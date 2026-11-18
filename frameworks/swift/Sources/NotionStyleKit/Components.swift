import SwiftUI

/// Distilled from `winbeau/email-sift` (`Design.swift`) and unified onto `NotionTokens`.
public struct NotionEyebrow: View {
    public var title: String
    public init(_ title: String) { self.title = title }

    public var body: some View {
        Text(title.uppercased())
            .font(.system(size: 10.5, weight: .semibold, design: .monospaced))
            .tracking(1.2)
            .foregroundStyle(NotionTokens.Colors.textFaint)
    }
}

public struct NotionCategoryPill: View {
    public var category: NotionCategory
    public var showDot: Bool

    public init(_ category: NotionCategory, showDot: Bool = false) {
        self.category = category
        self.showDot = showDot
    }

    public var body: some View {
        if showDot {
            HStack(spacing: 6) {
                Circle()
                    .fill(category.foreground)
                    .frame(width: 7, height: 7)
                Text(category.label)
                    .font(.system(size: 12))
                    .foregroundStyle(NotionTokens.Colors.textMuted)
            }
        } else {
            Text(category.label)
                .font(.system(size: 11, weight: .medium))
                .padding(.horizontal, 7)
                .padding(.vertical, 3)
                .foregroundStyle(category.foreground)
                .background(
                    category.tintBackground,
                    in: RoundedRectangle(cornerRadius: NotionTokens.Radius.xs)
                )
        }
    }
}

public struct NotionStatusPill: View {
    public var status: NotionStatus
    public var label: String

    public init(_ status: NotionStatus, label: String) {
        self.status = status
        self.label = label
    }

    public var body: some View {
        HStack(spacing: 5) {
            Circle()
                .fill(status.foreground)
                .frame(width: 6, height: 6)
            Text(label)
                .font(.system(size: 11, weight: .medium))
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 3)
        .foregroundStyle(status.foreground)
        .background(status.background, in: RoundedRectangle(cornerRadius: NotionTokens.Radius.xs))
        .overlay(
            RoundedRectangle(cornerRadius: NotionTokens.Radius.xs)
                .stroke(status.border, lineWidth: 1)
                .allowsHitTesting(false)
        )
    }
}

public struct NotionAvatar: View {
    public let name: String
    public var category: NotionCategory = .tools
    public var size: CGFloat = 32

    public init(name: String, category: NotionCategory = .tools, size: CGFloat = 32) {
        self.name = name
        self.category = category
        self.size = size
    }

    public var body: some View {
        Text(String(name.prefix(1)).uppercased())
            .font(.system(size: size * 0.4, weight: .semibold))
            .foregroundStyle(category.foreground)
            .frame(width: size, height: size)
            .background(
                category.tintBackground,
                in: RoundedRectangle(cornerRadius: size * 0.32)
            )
    }
}

public struct NotionCard<Content: View>: View {
    public var subtle: Bool
    public var padding: CGFloat
    @ViewBuilder public var content: Content

    public init(
        subtle: Bool = false,
        padding: CGFloat = 16,
        @ViewBuilder content: () -> Content
    ) {
        self.subtle = subtle
        self.padding = padding
        self.content = content()
    }

    public var body: some View {
        content
            .padding(padding)
            .background(
                subtle ? NotionTokens.Colors.bgSubtle : NotionTokens.Colors.bg,
                in: RoundedRectangle(cornerRadius: NotionTokens.Radius.md)
            )
            .overlay(
                RoundedRectangle(cornerRadius: NotionTokens.Radius.md)
                    .stroke(NotionTokens.Colors.border, lineWidth: 1)
                    .allowsHitTesting(false)
            )
            .shadow(color: Color.black.opacity(0.03), radius: 2, x: 0, y: 1)
    }
}

public struct NotionPrimaryButtonStyle: ButtonStyle {
    public init() {}
    public func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 12.5, weight: .semibold))
            .padding(.horizontal, 14)
            .frame(minHeight: NotionTokens.Layout.controlHeightSm)
            .contentShape(Rectangle())
            .background(
                configuration.isPressed
                    ? NotionTokens.Colors.primaryHover
                    : NotionTokens.Colors.primary,
                in: RoundedRectangle(cornerRadius: NotionTokens.Radius.sm)
            )
            .foregroundStyle(NotionTokens.Colors.primaryFg)
            .scaleEffect(configuration.isPressed ? 0.985 : 1.0)
            .animation(.easeOut(duration: 0.15), value: configuration.isPressed)
    }
}

public struct NotionQuietButtonStyle: ButtonStyle {
    public init() {}
    public func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 12.5, weight: .medium))
            .padding(.horizontal, 13)
            .frame(minHeight: NotionTokens.Layout.controlHeightSm)
            .contentShape(Rectangle())
            .background(
                configuration.isPressed
                    ? NotionTokens.Colors.bgHover
                    : NotionTokens.Colors.bg,
                in: RoundedRectangle(cornerRadius: NotionTokens.Radius.sm)
            )
            .overlay(
                RoundedRectangle(cornerRadius: NotionTokens.Radius.sm)
                    .stroke(NotionTokens.Colors.border, lineWidth: 1)
                    .allowsHitTesting(false)
            )
            .foregroundStyle(NotionTokens.Colors.text)
            .scaleEffect(configuration.isPressed ? 0.985 : 1.0)
            .animation(.easeOut(duration: 0.15), value: configuration.isPressed)
    }
}

public struct NotionEmptyState: View {
    public var systemImage: String
    public var title: String
    public var message: String?
    public var actionTitle: String?
    public var action: (() -> Void)?

    public init(
        systemImage: String = "tray",
        title: String,
        message: String? = nil,
        actionTitle: String? = nil,
        action: (() -> Void)? = nil
    ) {
        self.systemImage = systemImage
        self.title = title
        self.message = message
        self.actionTitle = actionTitle
        self.action = action
    }

    public var body: some View {
        VStack(spacing: 10) {
            Image(systemName: systemImage)
                .font(.system(size: 28, weight: .regular))
                .foregroundStyle(NotionTokens.Colors.textFaint)
            Text(title)
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(NotionTokens.Colors.text)
            if let message {
                Text(message)
                    .font(.system(size: 12.5))
                    .foregroundStyle(NotionTokens.Colors.textMuted)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: 340)
            }
            if let actionTitle, let action {
                Button(actionTitle, action: action)
                    .buttonStyle(NotionPrimaryButtonStyle())
                    .padding(.top, 4)
            }
        }
        .padding(32)
        .frame(maxWidth: .infinity)
    }
}
