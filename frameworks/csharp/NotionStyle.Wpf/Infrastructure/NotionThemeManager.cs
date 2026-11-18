using System;
using System.Linq;
using System.Windows;
using Microsoft.Win32;

namespace NotionStyle.Wpf.Infrastructure;

public enum NotionThemeMode
{
    Light,
    Dark,
    System,
}

/// <summary>
/// Runtime theme switcher swapping NotionTokens.Light.xaml / NotionTokens.Dark.xaml
/// in Application.Current.Resources.MergedDictionaries.
/// Compatible alongside WPF-UI (lepo.co/wpfui) ThemesDictionary.
/// </summary>
public static class NotionThemeManager
{
    private const string LightPackUri = "pack://application:,,,/NotionStyle.Wpf;component/Themes/NotionTokens.Light.xaml";
    private const string DarkPackUri = "pack://application:,,,/NotionStyle.Wpf;component/Themes/NotionTokens.Dark.xaml";

    public static NotionThemeMode CurrentPreference { get; private set; } = NotionThemeMode.System;

    public static void Apply(NotionThemeMode mode)
    {
        CurrentPreference = mode;
        var useDark = mode switch
        {
            NotionThemeMode.Dark => true,
            NotionThemeMode.Light => false,
            _ => IsWindowsDarkThemeEnabled(),
        };

        var app = Application.Current;
        if (app is null) return;

        var dicts = app.Resources.MergedDictionaries;
        var existing = dicts.FirstOrDefault(d =>
            d.Source is not null &&
            d.Source.OriginalString.Contains("NotionTokens.", StringComparison.OrdinalIgnoreCase));

        var nextDict = new ResourceDictionary
        {
            Source = new Uri(useDark ? DarkPackUri : LightPackUri, UriKind.Absolute),
        };

        if (existing is not null)
        {
            var index = dicts.IndexOf(existing);
            dicts[index] = nextDict;
        }
        else
        {
            dicts.Insert(0, nextDict);
        }
    }

    public static bool IsWindowsDarkThemeEnabled()
    {
        try
        {
            using var key = Registry.CurrentUser.OpenSubKey(
                @"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize");
            var val = key?.GetValue("AppsUseLightTheme");
            return val is int intVal && intVal == 0;
        }
        catch
        {
            return false;
        }
    }
}
