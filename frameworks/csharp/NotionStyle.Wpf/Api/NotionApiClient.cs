using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace NotionStyle.Wpf.Api;

public sealed record CursorPage<T>(IReadOnlyList<T> Items, string? NextCursor);

public sealed class NotionApiException(string detail, int statusCode, string path) : Exception(detail)
{
    public int StatusCode { get; } = statusCode;
    public string Path { get; } = path;
}

internal sealed record FastApiDetailDto(string? Detail);

/// <summary>
/// Wire-compatible HttpClient wrapper for FastAPI backends using the Notion-Style contract:
/// Bare JSON, camelCase property naming, ISO-8601 UTC Z dates, and {"detail": "..."} errors.
/// </summary>
public sealed class NotionApiClient(HttpClient httpClient)
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
    };

    public void SetBearerToken(string? token)
    {
        httpClient.DefaultRequestHeaders.Authorization = string.IsNullOrWhiteSpace(token)
            ? null
            : new AuthenticationHeaderValue("Bearer", token);
    }

    public async Task<T> SendAsync<T>(
        HttpMethod method,
        string path,
        object? body = null,
        CancellationToken cancellationToken = default)
    {
        using var req = new HttpRequestMessage(method, path);
        if (body is not null)
        {
            req.Content = JsonContent.Create(body, options: JsonOptions);
        }

        using var res = await httpClient.SendAsync(req, cancellationToken).ConfigureAwait(false);
        if (!res.IsSuccessStatusCode)
        {
            var message = $"HTTP {(int)res.StatusCode}";
            try
            {
                var err = await res.Content
                    .ReadFromJsonAsync<FastApiDetailDto>(JsonOptions, cancellationToken)
                    .ConfigureAwait(false);
                if (!string.IsNullOrWhiteSpace(err?.Detail))
                {
                    message = err.Detail!;
                }
            }
            catch
            {
                // Keep HTTP status fallback
            }
            throw new NotionApiException(message, (int)res.StatusCode, path);
        }

        var result = await res.Content
            .ReadFromJsonAsync<T>(JsonOptions, cancellationToken)
            .ConfigureAwait(false);
        return result ?? throw new NotionApiException("Empty JSON response", (int)res.StatusCode, path);
    }
}
