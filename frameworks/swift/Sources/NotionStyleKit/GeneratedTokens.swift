// AUTO-GENERATED FROM core/tokens.json — DO NOT EDIT DIRECTLY
import SwiftUI
#if canImport(AppKit)
import AppKit
#elseif canImport(UIKit)
import UIKit
#endif

public enum NotionDynamicColor {
    public static func make(
        light: (Double, Double, Double, Double),
        dark: (Double, Double, Double, Double)
    ) -> Color {
        #if canImport(AppKit)
        let nsColor = NSColor(name: nil) { appearance in
            let isDark = appearance.bestMatch(from: [.darkAqua, .aqua]) == .darkAqua
            let c = isDark ? dark : light
            return NSColor(srgbRed: c.0, green: c.1, blue: c.2, alpha: c.3)
        }
        return Color(nsColor: nsColor)
        #elseif canImport(UIKit)
        let uiColor = UIColor { traits in
            let c = traits.userInterfaceStyle == .dark ? dark : light
            return UIColor(red: c.0, green: c.1, blue: c.2, alpha: c.3)
        }
        return Color(uiColor: uiColor)
        #else
        return Color(.sRGB, red: light.0, green: light.1, blue: light.2, opacity: light.3)
        #endif
    }
}

public enum NotionTokens {
    public enum Colors {
    public static let bg = NotionDynamicColor.make(light: (1.0000, 1.0000, 1.0000, 1.00), dark: (0.0510, 0.0667, 0.0902, 1.00))
    public static let bgSubtle = NotionDynamicColor.make(light: (0.9686, 0.9647, 0.9529, 1.00), dark: (0.0863, 0.1059, 0.1333, 1.00))
    public static let bgHover = NotionDynamicColor.make(light: (0.9451, 0.9451, 0.9373, 1.00), dark: (0.1098, 0.1294, 0.1569, 1.00))
    public static let bgElevated = NotionDynamicColor.make(light: (1.0000, 1.0000, 1.0000, 1.00), dark: (0.1294, 0.1490, 0.1765, 1.00))
    public static let text = NotionDynamicColor.make(light: (0.2157, 0.2078, 0.1843, 1.00), dark: (0.9020, 0.9294, 0.9529, 1.00))
    public static let textMuted = NotionDynamicColor.make(light: (0.4706, 0.4667, 0.4549, 1.00), dark: (0.5451, 0.5804, 0.6196, 1.00))
    public static let textFaint = NotionDynamicColor.make(light: (0.6078, 0.6039, 0.5922, 1.00), dark: (0.4314, 0.4627, 0.5059, 1.00))
    public static let border = NotionDynamicColor.make(light: (0.9294, 0.9255, 0.9137, 1.00), dark: (0.1882, 0.2118, 0.2392, 1.00))
    public static let borderStrong = NotionDynamicColor.make(light: (0.8627, 0.8549, 0.8314, 1.00), dark: (0.2667, 0.2980, 0.3373, 1.00))
    public static let primary = NotionDynamicColor.make(light: (0.2157, 0.2078, 0.1843, 1.00), dark: (0.2196, 0.5451, 0.9922, 1.00))
    public static let primaryHover = NotionDynamicColor.make(light: (0.1451, 0.1373, 0.1216, 1.00), dark: (0.3451, 0.6510, 1.0000, 1.00))
    public static let primaryFg = NotionDynamicColor.make(light: (1.0000, 1.0000, 1.0000, 1.00), dark: (1.0000, 1.0000, 1.0000, 1.00))
    public static let link = NotionDynamicColor.make(light: (0.1373, 0.5137, 0.8863, 1.00), dark: (0.3451, 0.6510, 1.0000, 1.00))
    public static let focus = NotionDynamicColor.make(light: (0.1373, 0.5137, 0.8863, 1.00), dark: (0.2196, 0.5451, 0.9922, 1.00))
    public static let codeInlineBg = NotionDynamicColor.make(light: (0.5294, 0.5137, 0.4706, 0.15), dark: (0.4314, 0.4627, 0.5059, 0.22))
    public static let codeInlineFg = NotionDynamicColor.make(light: (0.9216, 0.3412, 0.3412, 1.00), dark: (1.0000, 0.4824, 0.4471, 1.00))
    }

    public enum Radius {
        public static let xs: CGFloat = 4
        public static let sm: CGFloat = 6
        public static let md: CGFloat = 8
        public static let lg: CGFloat = 12
        public static let xl: CGFloat = 16
        public static let pill: CGFloat = 9999
    }

    public enum Layout {
        public static let readingWidth: CGFloat = 720
        public static let contentWidth: CGFloat = 1120
        public static let headerHeight: CGFloat = 56
        public static let controlHeightSm: CGFloat = 32
        public static let controlHeightMd: CGFloat = 36
    }
}

public enum NotionCategory: String, CaseIterable, Sendable {
    case research
    case course
    case recommend
    case competition
    case kaggle
    case tools
    case life

    public var label: String {
        switch self {
        case .research: return "科研"
        case .course: return "课程"
        case .recommend: return "推免"
        case .competition: return "竞赛"
        case .kaggle: return "数据"
        case .tools: return "工具"
        case .life: return "日常"
        }
    }

    public var foreground: Color {
        switch self {
        case .research: return NotionDynamicColor.make(light: (0.8784, 0.2431, 0.2431, 1.00), dark: (0.9725, 0.3176, 0.2863, 1.00))
        case .course: return NotionDynamicColor.make(light: (0.8510, 0.4510, 0.0510, 1.00), dark: (0.8235, 0.6000, 0.1333, 1.00))
        case .recommend: return NotionDynamicColor.make(light: (0.5647, 0.3961, 0.6902, 1.00), dark: (0.7373, 0.5490, 1.0000, 1.00))
        case .competition: return NotionDynamicColor.make(light: (0.7216, 0.2510, 0.3686, 1.00), dark: (0.9686, 0.4706, 0.7294, 1.00))
        case .kaggle: return NotionDynamicColor.make(light: (0.0431, 0.4314, 0.6000, 1.00), dark: (0.3451, 0.6510, 1.0000, 1.00))
        case .tools: return NotionDynamicColor.make(light: (0.0588, 0.4824, 0.4235, 1.00), dark: (0.2471, 0.7255, 0.3137, 1.00))
        case .life: return NotionDynamicColor.make(light: (0.7098, 0.5725, 0.4157, 1.00), dark: (0.8314, 0.6549, 0.4157, 1.00))
        }
    }

    public var tintBackground: Color {
        switch self {
        case .research: return NotionDynamicColor.make(light: (0.8784, 0.2431, 0.2431, 0.12), dark: (0.9725, 0.3176, 0.2863, 0.16))
        case .course: return NotionDynamicColor.make(light: (0.8510, 0.4510, 0.0510, 0.12), dark: (0.8235, 0.6000, 0.1333, 0.16))
        case .recommend: return NotionDynamicColor.make(light: (0.5647, 0.3961, 0.6902, 0.12), dark: (0.7373, 0.5490, 1.0000, 0.16))
        case .competition: return NotionDynamicColor.make(light: (0.7216, 0.2510, 0.3686, 0.12), dark: (0.9686, 0.4706, 0.7294, 0.16))
        case .kaggle: return NotionDynamicColor.make(light: (0.0431, 0.4314, 0.6000, 0.12), dark: (0.3451, 0.6510, 1.0000, 0.16))
        case .tools: return NotionDynamicColor.make(light: (0.0588, 0.4824, 0.4235, 0.12), dark: (0.2471, 0.7255, 0.3137, 0.16))
        case .life: return NotionDynamicColor.make(light: (0.7098, 0.5725, 0.4157, 0.12), dark: (0.8314, 0.6549, 0.4157, 0.16))
        }
    }
}

public enum NotionStatus: String, CaseIterable, Sendable {
    case success
    case warning
    case danger
    case neutral

    public var foreground: Color {
        switch self {
        case .success: return NotionDynamicColor.make(light: (0.0588, 0.3686, 0.3294, 1.00), dark: (0.2471, 0.7255, 0.3137, 1.00))
        case .warning: return NotionDynamicColor.make(light: (0.8510, 0.4510, 0.0510, 1.00), dark: (0.8235, 0.6000, 0.1333, 1.00))
        case .danger: return NotionDynamicColor.make(light: (0.7255, 0.1098, 0.1098, 1.00), dark: (0.9725, 0.3176, 0.2863, 1.00))
        case .neutral: return NotionDynamicColor.make(light: (0.4706, 0.4667, 0.4549, 1.00), dark: (0.5451, 0.5804, 0.6196, 1.00))
        }
    }

    public var background: Color {
        switch self {
        case .success: return NotionDynamicColor.make(light: (0.0588, 0.4824, 0.4235, 0.12), dark: (0.2471, 0.7255, 0.3137, 0.15))
        case .warning: return NotionDynamicColor.make(light: (0.8510, 0.4510, 0.0510, 0.12), dark: (0.8235, 0.6000, 0.1333, 0.15))
        case .danger: return NotionDynamicColor.make(light: (0.8784, 0.2431, 0.2431, 0.12), dark: (0.9725, 0.3176, 0.2863, 0.15))
        case .neutral: return NotionDynamicColor.make(light: (0.6078, 0.6039, 0.5922, 0.10), dark: (0.4314, 0.4627, 0.5059, 0.12))
        }
    }

    public var border: Color {
        switch self {
        case .success: return NotionDynamicColor.make(light: (0.0588, 0.4824, 0.4235, 0.32), dark: (0.2471, 0.7255, 0.3137, 0.35))
        case .warning: return NotionDynamicColor.make(light: (0.8510, 0.4510, 0.0510, 0.32), dark: (0.8235, 0.6000, 0.1333, 0.35))
        case .danger: return NotionDynamicColor.make(light: (0.8784, 0.2431, 0.2431, 0.32), dark: (0.9725, 0.3176, 0.2863, 0.35))
        case .neutral: return NotionDynamicColor.make(light: (0.6078, 0.6039, 0.5922, 0.28), dark: (0.4314, 0.4627, 0.5059, 0.30))
        }
    }
}
