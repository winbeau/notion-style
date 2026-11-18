---
name: notion-style-csharp
description: >-
  Builds and themes C# / .NET 8 WPF and WinUI desktop applications in the Notion-Style
  paradigm (distilled from FastFinder and Panthera-WAM). Provides auto-generated Light/Dark
  XAML ResourceDictionaries (NotionTokens.Light/Dark.xaml), NotionControls.xaml DynamicResource
  styles, NotionThemeManager runtime switcher, MVVM RelayCommand/AsyncRelayCommand, and
  FastAPI-compatible NotionApiClient. Use when authoring C# or XAML desktop UI.
---

# Notion-Style for C# (.NET 8 WPF / WinUI)

Use this skill when building Windows desktop tools or terminals in C# / WPF (standalone or alongside `WPF-UI` `lepo.co/wpfui`). Also adhere to [`notion-style-core`](../notion-style-core/SKILL.md).

## 1. XAML ResourceDictionary Setup (`App.xaml`)

Merge [`NotionTokens.Light.xaml`](../../frameworks/csharp/NotionStyle.Wpf/Themes/NotionTokens.Light.xaml) and [`NotionControls.xaml`](../../frameworks/csharp/NotionStyle.Wpf/Themes/NotionControls.xaml) into `Application.Resources`:

```xml
<Application.Resources>
    <ResourceDictionary>
        <ResourceDictionary.MergedDictionaries>
            <ResourceDictionary Source="pack://application:,,,/NotionStyle.Wpf;component/Themes/NotionTokens.Light.xaml" />
            <ResourceDictionary Source="pack://application:,,,/NotionStyle.Wpf;component/Themes/NotionControls.xaml" />
        </ResourceDictionary.MergedDictionaries>
    </ResourceDictionary>
</Application.Resources>
```

At startup in `App.xaml.cs`, call `NotionThemeManager.Apply(NotionThemeMode.System)` ([`NotionThemeManager.cs`](../../frameworks/csharp/NotionStyle.Wpf/Infrastructure/NotionThemeManager.cs)) to follow Windows 11 `AppsUseLightTheme` or toggle Light/Dark live at runtime.

## 2. Reusable XAML & C# Building Blocks

From [`frameworks/csharp/NotionStyle.Wpf/`](../../frameworks/csharp/NotionStyle.Wpf/):

- **Always bind brushes via `{DynamicResource Notion.*.Brush}`** (never `{StaticResource}`) inside views and control templates so runtime Light/Dark switching updates open windows immediately.
- **Core Styles** ([`NotionControls.xaml`](../../frameworks/csharp/NotionStyle.Wpf/Themes/NotionControls.xaml)): `NotionCardBorderStyle`, `NotionSubtleCardBorderStyle`, `NotionSerifHeadingStyle`, `NotionEyebrowTextStyle`, `NotionMutedBodyStyle`, `NotionPrimaryButtonStyle`, `NotionQuietButtonStyle`, `NotionInputBoxStyle`.
- **MVVM Commands**: [`RelayCommand.cs`](../../frameworks/csharp/NotionStyle.Wpf/Infrastructure/RelayCommand.cs) provides `RelayCommand` and non-reentrant `AsyncRelayCommand`.
- **API Client**: [`NotionApiClient.cs`](../../frameworks/csharp/NotionStyle.Wpf/Api/NotionApiClient.cs) configures `JsonNamingPolicy.CamelCase`, `CursorPage<T>`, and parses FastAPI `{"detail": "..."}` errors into `NotionApiException`.
