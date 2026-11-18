#!/usr/bin/env bash
# ==============================================================================
# register-skills.sh — One-Click Cross-Agent Skill Registration CLI
# ------------------------------------------------------------------------------
# Registers `notion-style` framework skills across 5 major AI coding agents:
#   - claude       : Claude Code (~/.claude/skills | <project>/.claude/skills)
#   - codex        : OpenAI Codex (~/.codex/skills | <project>/.agents/skills)
#   - antigravity  : Google Antigravity (~/.gemini/config/plugins/notion-style | <project>/.agents/skills)
#   - cursor       : Cursor IDE (~/.cursor/skills | <project>/.cursor/rules/*.mdc)
#   - gemini       : Gemini CLI / Universal .agents (~/.agents/skills | <project>/.agents/skills)
#
# Compatible with macOS default Bash 3.2+ and Linux Bash/Zsh.
#
# Examples:
#   ./scripts/register-skills.sh --global
#   ./scripts/register-skills.sh --global --agent claude,codex,antigravity --skill vue-ts,fastapi
#   ./scripts/register-skills.sh --project /path/to/my-app --agent cursor,claude --skill react-ts
#   ./scripts/register-skills.sh --status
#   ./scripts/register-skills.sh --global --uninstall
# ==============================================================================
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILLS_SRC="$REPO_ROOT/skills"

SCOPE="global"
PROJECT_DIR="$(pwd)"
AGENTS_RAW="all"
SKILLS_RAW="all"
MODE="symlink"     # symlink | copy
ACTION="install"   # install | uninstall | status
DRY_RUN=0
AUTO_CORE=1
TARGET_HOME="${HOME}"

usage() {
  cat <<'EOF'
Usage: ./scripts/register-skills.sh [options]

Scope:
  --global                Install into user-level agent directories (default)
  --project [DIR]         Install into a target project workspace (defaults to CWD)

Selection:
  --agent <list>          Comma-separated agents or 'all' (default: all)
                          Values: claude, codex, antigravity, cursor, gemini
  --skill <list>          Comma-separated skills or 'all' (default: all)
                          Short names: core, react-ts, vue-ts, swift, csharp, fastapi
                          (Selecting any framework skill automatically includes 'core'
                           unless --no-auto-core is passed.)
  --no-auto-core          Do not auto-include notion-style-core with framework skills

Mode & Lifecycle:
  --copy                  Copy files instead of creating symlinks
  --uninstall             Remove registered skills/plugins for the selected scope & agents
  --status, --list        Show current registration status across all agents
  --dry-run               Print planned operations without modifying the filesystem
  --home <DIR>            Override HOME directory (for sandbox / CI testing)
  -h, --help              Show this help message
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --global)
      SCOPE="global"
      shift
      ;;
    --project)
      SCOPE="project"
      if [ $# -gt 1 ] && [[ "${2:-}" != --* ]]; then
        PROJECT_DIR="$(cd "$2" && pwd)"
        shift 2
      else
        PROJECT_DIR="$(pwd)"
        shift
      fi
      ;;
    --agent)
      AGENTS_RAW="${2:?Missing value for --agent}"
      shift 2
      ;;
    --skill|--skills)
      SKILLS_RAW="${2:?Missing value for --skill}"
      shift 2
      ;;
    --no-auto-core)
      AUTO_CORE=0
      shift
      ;;
    --copy)
      MODE="copy"
      shift
      ;;
    --uninstall|--remove)
      ACTION="uninstall"
      shift
      ;;
    --status|--list)
      ACTION="status"
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --home)
      TARGET_HOME="${2:?Missing value for --home}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

ALL_SKILLS="notion-style-core notion-style-react-ts notion-style-vue-ts notion-style-swift notion-style-csharp notion-style-fastapi"
ALL_AGENTS="claude codex antigravity cursor gemini"

normalize_skill() {
  case "$1" in
    core|notion-style-core) echo "notion-style-core" ;;
    react|react-ts|notion-style-react-ts) echo "notion-style-react-ts" ;;
    vue|vue-ts|notion-style-vue-ts) echo "notion-style-vue-ts" ;;
    swift|swiftui|notion-style-swift) echo "notion-style-swift" ;;
    csharp|cs|wpf|dotnet|notion-style-csharp) echo "notion-style-csharp" ;;
    fastapi|python|py|notion-style-fastapi) echo "notion-style-fastapi" ;;
    *)
      echo "Unknown skill '$1'. Valid: core, react-ts, vue-ts, swift, csharp, fastapi" >&2
      exit 1
      ;;
  esac
}

normalize_agent() {
  case "$1" in
    claude|claude-code) echo "claude" ;;
    codex|openai) echo "codex" ;;
    antigravity|agy) echo "antigravity" ;;
    cursor) echo "cursor" ;;
    gemini|agents|opencode) echo "gemini" ;;
    *)
      echo "Unknown agent '$1'. Valid: claude, codex, antigravity, cursor, gemini" >&2
      exit 1
      ;;
  esac
}

SELECTED_SKILLS=""
if [ "$SKILLS_RAW" = "all" ]; then
  SELECTED_SKILLS="$ALL_SKILLS"
else
  IFS=',' read -r -a raw_skill_arr <<< "$SKILLS_RAW"
  need_core=0
  for item in "${raw_skill_arr[@]}"; do
    [ -z "$item" ] && continue
    norm="$(normalize_skill "$item")"
    if [ "$norm" != "notion-style-core" ] && [ "$AUTO_CORE" -eq 1 ]; then
      need_core=1
    fi
    case " $SELECTED_SKILLS " in
      *" $norm "*) ;;
      *) SELECTED_SKILLS="${SELECTED_SKILLS:+$SELECTED_SKILLS }$norm" ;;
    esac
  done
  if [ "$need_core" -eq 1 ]; then
    case " $SELECTED_SKILLS " in
      *" notion-style-core "*) ;;
      *) SELECTED_SKILLS="notion-style-core $SELECTED_SKILLS" ;;
    esac
  fi
fi

SELECTED_AGENTS=""
if [ "$AGENTS_RAW" = "all" ]; then
  SELECTED_AGENTS="$ALL_AGENTS"
else
  IFS=',' read -r -a raw_agent_arr <<< "$AGENTS_RAW"
  for item in "${raw_agent_arr[@]}"; do
    [ -z "$item" ] && continue
    norm="$(normalize_agent "$item")"
    case " $SELECTED_AGENTS " in
      *" $norm "*) ;;
      *) SELECTED_AGENTS="${SELECTED_AGENTS:+$SELECTED_AGENTS }$norm" ;;
    esac
  done
fi

run_op() {
  if [ "$DRY_RUN" -eq 1 ]; then
    echo "[dry-run] $*"
  else
    "$@"
  fi
}

install_skill_dir() {
  local skill_name="$1"
  local dest_parent="$2"
  local src_dir="$SKILLS_SRC/$skill_name"
  local dest_dir="$dest_parent/$skill_name"

  run_op mkdir -p "$dest_parent"
  if [ "$MODE" = "symlink" ]; then
    run_op rm -rf "$dest_dir"
    run_op ln -sfn "$src_dir" "$dest_dir"
    echo "  ✓ linked   $skill_name -> $dest_dir"
  else
    run_op rm -rf "$dest_dir"
    run_op cp -R "$src_dir" "$dest_dir"
    echo "  ✓ copied   $skill_name -> $dest_dir"
  fi
}

remove_skill_dir() {
  local skill_name="$1"
  local dest_parent="$2"
  local dest_dir="$dest_parent/$skill_name"
  if [ -e "$dest_dir" ] || [ -L "$dest_dir" ]; then
    run_op rm -rf "$dest_dir"
    echo "  ✗ removed  $dest_dir"
  fi
}

cursor_globs_for_skill() {
  case "$1" in
    notion-style-core) echo "" ;;
    notion-style-react-ts) echo "**/*.tsx, **/*.ts, **/tailwind.config.*" ;;
    notion-style-vue-ts) echo "**/*.vue, **/*.ts, **/*.less, **/*.css" ;;
    notion-style-swift) echo "**/*.swift" ;;
    notion-style-csharp) echo "**/*.cs, **/*.xaml, **/*.csproj" ;;
    notion-style-fastapi) echo "**/*.py" ;;
  esac
}

write_cursor_mdc() {
  local skill_name="$1"
  local rules_dir="$2"
  local src_md="$SKILLS_SRC/$skill_name/SKILL.md"
  local out_mdc="$rules_dir/$skill_name.mdc"
  local globs
  globs="$(cursor_globs_for_skill "$skill_name")"

  if [ "$DRY_RUN" -eq 1 ]; then
    echo "[dry-run] generate Cursor rule $out_mdc"
    return
  fi

  mkdir -p "$rules_dir"
  SKILL_MD="$src_md" OUT_MDC="$out_mdc" GLOBS="$globs" REPO_ROOT_ENV="$REPO_ROOT" python3 - << 'PYEOF'
import os, pathlib, re

src = pathlib.Path(os.environ["SKILL_MD"]).read_text(encoding="utf-8")
out = pathlib.Path(os.environ["OUT_MDC"])
globs = os.environ["GLOBS"]
repo_root = os.environ["REPO_ROOT_ENV"]

m = re.match(r"^---\n(.*?)\n---\n(.*)$", src, flags=re.S)
body = m.group(2).lstrip() if m else src
desc_match = re.search(r"description:\s*>-\n((?:  .*(?:\n|$))+)", m.group(1) if m else "")
if desc_match:
    desc = " ".join(line.strip() for line in desc_match.group(1).splitlines() if line.strip())
else:
    desc = f"Notion-Style skill {out.stem}"

# Rewrite relative ../../ links so Cursor resolves them from the target project
body = body.replace("(../../", f"({repo_root}/").replace("(../", f"({repo_root}/skills/")

front_lines = [
    "---",
    f"description: {desc}",
]
if globs:
    front_lines.append(f"globs: {globs}")
    front_lines.append("alwaysApply: false")
else:
    front_lines.append("alwaysApply: false")
front_lines.append("---")

out.write_text("\n".join(front_lines) + "\n\n" + body, encoding="utf-8")
PYEOF
  echo "  ✓ wrote    $out_mdc"
}

install_antigravity_global_plugin() {
  local plugin_dir="$TARGET_HOME/.gemini/config/plugins/notion-style"
  echo "→ Antigravity Global Plugin ($plugin_dir)"
  run_op mkdir -p "$plugin_dir/skills" "$plugin_dir/assets" "$plugin_dir/rules"
  if [ "$MODE" = "symlink" ]; then
    run_op ln -sfn "$REPO_ROOT/plugin.json" "$plugin_dir/plugin.json"
    run_op ln -sfn "$REPO_ROOT/assets/logo.svg" "$plugin_dir/assets/logo.svg"
    run_op ln -sfn "$REPO_ROOT/rules/AGENTS.md" "$plugin_dir/rules/AGENTS.md"
  else
    run_op cp "$REPO_ROOT/plugin.json" "$plugin_dir/plugin.json"
    run_op cp "$REPO_ROOT/assets/logo.svg" "$plugin_dir/assets/logo.svg"
    run_op cp "$REPO_ROOT/rules/AGENTS.md" "$plugin_dir/rules/AGENTS.md"
  fi
  for s in $SELECTED_SKILLS; do
    install_skill_dir "$s" "$plugin_dir/skills"
  done
}

print_status() {
  echo "Notion-Style Skill Registry Status"
  echo "Repository : $REPO_ROOT"
  echo "--------------------------------------------------------------------------"
  local check_paths=(
    "Claude (global)      |$TARGET_HOME/.claude/skills"
    "Codex (global)       |$TARGET_HOME/.codex/skills"
    "Antigravity (plugin) |$TARGET_HOME/.gemini/config/plugins/notion-style/skills"
    "Cursor (global)      |$TARGET_HOME/.cursor/skills"
    "Gemini/.agents (glob)|$TARGET_HOME/.agents/skills"
    "Project .claude      |$PROJECT_DIR/.claude/skills"
    "Project .agents      |$PROJECT_DIR/.agents/skills"
  )
  for entry in "${check_paths[@]}"; do
    local label="${entry%%|*}"
    local dir="${entry#*|}"
    local count=0
    local found_names=""
    for s in $ALL_SKILLS; do
      if [ -e "$dir/$s/SKILL.md" ]; then
        count=$((count + 1))
        found_names="${found_names:+$found_names, }${s#notion-style-}"
      fi
    done
    printf "%s : %d/6 [%s]\n" "$label" "$count" "${found_names:-none}"
  done
  local cursor_count=0
  for s in $ALL_SKILLS; do
    [ -f "$PROJECT_DIR/.cursor/rules/$s.mdc" ] && cursor_count=$((cursor_count + 1))
  done
  printf "Project .cursor/rules: %d/6 [.mdc rules]\n" "$cursor_count"
}

if [ "$ACTION" = "status" ]; then
  print_status
  exit 0
fi

DID_PROJECT_AGENTS_DIR=0

for agent in $SELECTED_AGENTS; do
  if [ "$ACTION" = "install" ]; then
    if [ "$SCOPE" = "global" ]; then
      case "$agent" in
        claude)
          echo "→ Claude Code Global ($TARGET_HOME/.claude/skills)"
          for s in $SELECTED_SKILLS; do install_skill_dir "$s" "$TARGET_HOME/.claude/skills"; done
          ;;
        codex)
          echo "→ OpenAI Codex Global ($TARGET_HOME/.codex/skills)"
          for s in $SELECTED_SKILLS; do install_skill_dir "$s" "$TARGET_HOME/.codex/skills"; done
          ;;
        antigravity)
          install_antigravity_global_plugin
          ;;
        cursor)
          echo "→ Cursor Global ($TARGET_HOME/.cursor/skills)"
          for s in $SELECTED_SKILLS; do install_skill_dir "$s" "$TARGET_HOME/.cursor/skills"; done
          ;;
        gemini)
          echo "→ Gemini CLI / Universal .agents Global ($TARGET_HOME/.agents/skills)"
          for s in $SELECTED_SKILLS; do install_skill_dir "$s" "$TARGET_HOME/.agents/skills"; done
          ;;
      esac
    else
      case "$agent" in
        claude)
          echo "→ Claude Code Project ($PROJECT_DIR/.claude/skills)"
          for s in $SELECTED_SKILLS; do install_skill_dir "$s" "$PROJECT_DIR/.claude/skills"; done
          ;;
        codex|antigravity|gemini)
          if [ "$DID_PROJECT_AGENTS_DIR" -eq 0 ]; then
            echo "→ Project Workspace .agents ($PROJECT_DIR/.agents/skills) [Codex / Antigravity / Gemini]"
            for s in $SELECTED_SKILLS; do install_skill_dir "$s" "$PROJECT_DIR/.agents/skills"; done
            DID_PROJECT_AGENTS_DIR=1
          fi
          ;;
        cursor)
          echo "→ Cursor Project Rules ($PROJECT_DIR/.cursor/rules)"
          for s in $SELECTED_SKILLS; do write_cursor_mdc "$s" "$PROJECT_DIR/.cursor/rules"; done
          ;;
      esac
    fi
  elif [ "$ACTION" = "uninstall" ]; then
    if [ "$SCOPE" = "global" ]; then
      case "$agent" in
        claude)
          for s in $SELECTED_SKILLS; do remove_skill_dir "$s" "$TARGET_HOME/.claude/skills"; done ;;
        codex)
          for s in $SELECTED_SKILLS; do remove_skill_dir "$s" "$TARGET_HOME/.codex/skills"; done ;;
        antigravity)
          if [ "$SKILLS_RAW" = "all" ]; then
            run_op rm -rf "$TARGET_HOME/.gemini/config/plugins/notion-style"
            echo "  ✗ removed  $TARGET_HOME/.gemini/config/plugins/notion-style"
          else
            for s in $SELECTED_SKILLS; do remove_skill_dir "$s" "$TARGET_HOME/.gemini/config/plugins/notion-style/skills"; done
          fi
          ;;
        cursor)
          for s in $SELECTED_SKILLS; do remove_skill_dir "$s" "$TARGET_HOME/.cursor/skills"; done ;;
        gemini)
          for s in $SELECTED_SKILLS; do remove_skill_dir "$s" "$TARGET_HOME/.agents/skills"; done ;;
      esac
    else
      case "$agent" in
        claude)
          for s in $SELECTED_SKILLS; do remove_skill_dir "$s" "$PROJECT_DIR/.claude/skills"; done ;;
        codex|antigravity|gemini)
          if [ "$DID_PROJECT_AGENTS_DIR" -eq 0 ]; then
            for s in $SELECTED_SKILLS; do remove_skill_dir "$s" "$PROJECT_DIR/.agents/skills"; done
            DID_PROJECT_AGENTS_DIR=1
          fi
          ;;
        cursor)
          for s in $SELECTED_SKILLS; do
            if [ -f "$PROJECT_DIR/.cursor/rules/$s.mdc" ]; then
              run_op rm -f "$PROJECT_DIR/.cursor/rules/$s.mdc"
              echo "  ✗ removed  $PROJECT_DIR/.cursor/rules/$s.mdc"
            fi
          done
          ;;
      esac
    fi
  fi
done

echo "Done ($ACTION · scope=$SCOPE · mode=$MODE)."
