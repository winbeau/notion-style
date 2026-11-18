---
name: notion-style-swift
description: >-
  Designs and builds native macOS and iOS apps in Swift (SwiftUI & AppKit) following the
  Notion-Style paradigm (distilled from email-sift and pptx-precise-mac). Provides NotionStyleKit
  Swift Package with dynamic Aqua/DarkAqua NotionTokens, NotionCard, NotionCategoryPill,
  NotionStatusPill, NotionPrimaryButtonStyle/NotionQuietButtonStyle, NotionEmptyState, and
  Sendable NotionAPIClient actor. Use when writing SwiftUI or AppKit code.
---

# Notion-Style for Swift (SwiftUI & AppKit)

Use this skill when building macOS or iOS applications in Swift. Also adhere to [`notion-style-core`](../notion-style-core/SKILL.md).

## 1. Integrate `NotionStyleKit`

Add [`frameworks/swift`](../../frameworks/swift/Package.swift) as a local Swift Package dependency or copy `Sources/NotionStyleKit/*.swift` into your app target:

- [`GeneratedTokens.swift`](../../frameworks/swift/Sources/NotionStyleKit/GeneratedTokens.swift): Auto-compiled from `core/tokens.json`. Uses `NSColor(name:dynamicProvider:)` on macOS and `UIColor(dynamicProvider:)` on iOS so every `NotionTokens.Colors.*`, `NotionCategory`, and `NotionStatus` adapts live between Light (warm paper) and Dark (neutral slate) system appearances.
- [`Components.swift`](../../frameworks/swift/Sources/NotionStyleKit/Components.swift):
  - `NotionEyebrow("WORKSPACE")` — `10.5pt` monospaced uppercase section label (`1.2pt` tracking).
  - `NotionCard(subtle:padding:)` — `1px` `NotionTokens.Colors.border` stroke + subtle `0.03` shadow.
  - `NotionCategoryPill(.research)` & `NotionStatusPill(.success, label: "Ready")`.
  - `NotionPrimaryButtonStyle()` & `NotionQuietButtonStyle()` — `0.985` tactile press scale + `.contentShape(Rectangle())` so the entire padded area is clickable on macOS.
  - `NotionEmptyState(systemImage:title:message:actionTitle:action:)`.
- [`APIClient.swift`](../../frameworks/swift/Sources/NotionStyleKit/APIClient.swift): `NotionAPIClient` actor with `.iso8601` dates, Bearer auth header, `NotionCursorPage<T>`, and FastAPI `{"detail": "..."}` decoding into `LocalizedError`.

## 2. macOS Ergonomics Guardrails

- Always attach `.contentShape(Rectangle())` inside custom `ButtonStyle`s on macOS so clicks outside glyph bounds still register.
- Keep desktop window typography crisp: `12.5–13.5pt` body/controls, `20–26pt` `.semibold` window headers, `11pt` monospaced log panes (`AppKit` `NSTextView` or SwiftUI `ScrollView`).
- Verify compilation with `swift build` before finishing.
