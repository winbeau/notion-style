import Foundation

/// Wire-compatible API Client for FastAPI backends following the Notion-Style contract:
/// - Bare JSON responses (camelCase keys, ISO-8601 UTC `Z` timestamps)
/// - `{"detail": "..."}` error extraction
/// - `CursorPage<T>` pagination
public struct NotionCursorPage<Item: Decodable & Sendable>: Decodable, Sendable {
    public let items: [Item]
    public let nextCursor: String?
}

public struct NotionAPIError: LocalizedError, Sendable {
    public let status: Int
    public let detail: String
    public let path: String

    public var errorDescription: String? { detail }
}

private struct FastAPIDetailEnvelope: Decodable {
    let detail: String?
}

public actor NotionAPIClient {
    private let baseURL: URL
    private let session: URLSession
    private var bearerToken: String?
    private let decoder: JSONDecoder
    private let encoder: JSONEncoder

    public init(baseURL: URL, session: URLSession = .shared, bearerToken: String? = nil) {
        self.baseURL = baseURL
        self.session = session
        self.bearerToken = bearerToken

        let dec = JSONDecoder()
        dec.dateDecodingStrategy = .iso8601
        self.decoder = dec

        let enc = JSONEncoder()
        enc.dateEncodingStrategy = .iso8601
        self.encoder = enc
    }

    public func setBearerToken(_ token: String?) {
        self.bearerToken = token
    }

    public func request<T: Decodable & Sendable>(
        method: String = "GET",
        path: String,
        query: [URLQueryItem] = [],
        body: (any Encodable & Sendable)? = nil
    ) async throws -> T {
        guard var components = URLComponents(
            url: baseURL.appendingPathComponent(path.trimmingCharacters(in: CharacterSet(charactersIn: "/"))),
            resolvingAgainstBaseURL: false
        ) else {
            throw NotionAPIError(status: 0, detail: "Invalid URL path: \(path)", path: path)
        }
        if !query.isEmpty {
            components.queryItems = query
        }
        guard let url = components.url else {
            throw NotionAPIError(status: 0, detail: "Malformed query for \(path)", path: path)
        }

        var req = URLRequest(url: url)
        req.httpMethod = method
        req.setValue("application/json", forHTTPHeaderField: "Accept")
        if let bearerToken {
            req.setValue("Bearer \(bearerToken)", forHTTPHeaderField: "Authorization")
        }
        if let body {
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.httpBody = try encoder.encode(body)
        }

        let (data, response) = try await session.data(for: req)
        let status = (response as? HTTPURLResponse)?.statusCode ?? 0
        guard (200..<300).contains(status) else {
            let parsed = try? decoder.decode(FastAPIDetailEnvelope.self, from: data)
            let message = (parsed?.detail).flatMap { $0.isEmpty ? nil : $0 } ?? "HTTP \(status)"
            throw NotionAPIError(status: status, detail: message, path: path)
        }
        return try decoder.decode(T.self, from: data)
    }
}
