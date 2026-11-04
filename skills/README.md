# Agent skills for get-github-pr-comments

`github-pr-comments/` is an agent skill (SKILL.md standard) that tells an AI coding agent when and how to use this MCP server. It is listed on Agensi and can also be installed by hand.

## Build the zip for Agensi

Agensi wants one top-level folder named after the skill with SKILL.md at its root, text files only, no OS junk files:

```bash
cd skills
rm -f github-pr-comments.zip
zip -r github-pr-comments.zip github-pr-comments/ -x "*.DS_Store" -x "*/Thumbs.db"
unzip -l github-pr-comments.zip
```

## Listing copy (Creator Dashboard → Submit a Skill)

**Price:** Free

**Tags:** github, pull-request, code-review, mcp, git, developer-tools

**Listing description:**

Turn GitHub PR review feedback into a clear to-do list, then let your agent work through it.

This skill fetches the inline review comments on a pull request, groups them by thread, and classifies each one as must-fix, suggestion, question, or nit, after checking the current code at each referenced line. Ask for a summary, drill into one file, or say "address them" to have the agent make the minimal changes and report what it fixed and what it skipped.

Works with Claude Code, Cursor, VS Code Copilot, Windsurf, Cline, Codex CLI, and Gemini CLI. Uses the open-source `get-github-pr-comments` MCP server when installed (setup instructions for every agent are included), and falls back to the GitHub CLI when it is not. Read-only on GitHub: it never posts, edits, or resolves comments, and never touches your tokens.

Requires the GitHub CLI (`gh`) signed in.

## Update flow

Edit files under `github-pr-comments/`, rebuild the zip, and upload a new version from the Agensi dashboard. The live version stays available while the update is reviewed.
