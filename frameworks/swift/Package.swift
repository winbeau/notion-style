// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "NotionStyleKit",
    platforms: [
        .macOS(.v14),
        .iOS(.v17),
    ],
    products: [
        .library(name: "NotionStyleKit", targets: ["NotionStyleKit"]),
    ],
    targets: [
        .target(name: "NotionStyleKit"),
    ]
)
