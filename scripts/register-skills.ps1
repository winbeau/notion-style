# ==============================================================================
# register-skills.ps1 — Windows PowerShell Cross-Agent Skill Installer
# Supports Claude Code, Codex, Antigravity, Cursor, and Gemini CLI (.agents)
# ==============================================================================
param(
    [ValidateSet("global", "project")]
    [string]$Scope = "global",
    [string]$ProjectDir = (Get-Location).Path,
    [string]$Agent = "all",
    [string]$Skill = "all",
    [switch]$Uninstall
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$SkillsSrc = Join-Path $RepoRoot "skills"

$SkillMap = @{
    "core"     = "notion-style-core"
    "react-ts" = "notion-style-react-ts"
    "vue-ts"   = "notion-style-vue-ts"
    "swift"    = "notion-style-swift"
    "csharp"   = "notion-style-csharp"
    "fastapi"  = "notion-style-fastapi"
}

$SelectedSkills = if ($Skill -eq "all") {
    @("notion-style-core", "notion-style-react-ts", "notion-style-vue-ts", "notion-style-swift", "notion-style-csharp", "notion-style-fastapi")
} else {
    $list = @("notion-style-core")
    foreach ($item in ($Skill -split ",")) {
        $k = $item.Trim()
        $resolved = if ($SkillMap.ContainsKey($k)) { $SkillMap[$k] } else { $k }
        if ($list -notcontains $resolved) { $list += $resolved }
    }
    $list
}

$SelectedAgents = if ($Agent -eq "all") {
    @("claude", "codex", "antigravity", "cursor", "gemini")
} else {
    ($Agent -split ",") | ForEach-Object { $_.Trim().ToLower() }
}

function Sync-SkillFolder([string]$SkillName, [string]$DestParent) {
    $Src = Join-Path $SkillsSrc $SkillName
    $Dst = Join-Path $DestParent $SkillName
    if ($Uninstall) {
        if (Test-Path $Dst) {
            Remove-Item -Recurse -Force $Dst
            Write-Host "  x removed  $Dst"
        }
        return
    }
    New-Item -ItemType Directory -Force -Path $DestParent | Out-Null
    if (Test-Path $Dst) { Remove-Item -Recurse -Force $Dst }
    Copy-Item -Recurse -Force $Src $Dst
    Write-Host "  + installed $SkillName -> $Dst"
}

foreach ($ag in $SelectedAgents) {
    if ($Scope -eq "global") {
        switch ($ag) {
            "claude"      { foreach ($s in $SelectedSkills) { Sync-SkillFolder $s (Join-Path $HOME ".claude\skills") } }
            "codex"       { foreach ($s in $SelectedSkills) { Sync-SkillFolder $s (Join-Path $HOME ".codex\skills") } }
            "cursor"      { foreach ($s in $SelectedSkills) { Sync-SkillFolder $s (Join-Path $HOME ".cursor\skills") } }
            "gemini"      { foreach ($s in $SelectedSkills) { Sync-SkillFolder $s (Join-Path $HOME ".agents\skills") } }
            "antigravity" {
                $PluginRoot = Join-Path $HOME ".gemini\config\plugins\notion-style"
                if ($Uninstall -and $Skill -eq "all") {
                    if (Test-Path $PluginRoot) { Remove-Item -Recurse -Force $PluginRoot }
                } else {
                    New-Item -ItemType Directory -Force -Path (Join-Path $PluginRoot "assets"), (Join-Path $PluginRoot "rules") | Out-Null
                    Copy-Item -Force (Join-Path $RepoRoot "plugin.json") (Join-Path $PluginRoot "plugin.json")
                    Copy-Item -Force (Join-Path $RepoRoot "assets\logo.svg") (Join-Path $PluginRoot "assets\logo.svg")
                    Copy-Item -Force (Join-Path $RepoRoot "rules\AGENTS.md") (Join-Path $PluginRoot "rules\AGENTS.md")
                    foreach ($s in $SelectedSkills) { Sync-SkillFolder $s (Join-Path $PluginRoot "skills") }
                }
            }
        }
    } else {
        switch ($ag) {
            "claude" { foreach ($s in $SelectedSkills) { Sync-SkillFolder $s (Join-Path $ProjectDir ".claude\skills") } }
            default  { foreach ($s in $SelectedSkills) { Sync-SkillFolder $s (Join-Path $ProjectDir ".agents\skills") } }
        }
    }
}
Write-Host "Done."
