# github-pr-comments skill

An agent skill that fetches GitHub pull request review comments, triages them into must-fix / suggestion / question / nit, and addresses them on request.

Pairs with the `get-github-pr-comments` MCP server (npm, MIT) but also works with just the GitHub CLI.

## Install

Copy the `github-pr-comments` folder into your agent's skills directory, for example `~/.claude/skills/github-pr-comments/` for Claude Code, or install it from Agensi.

Then set up the MCP server following `references/mcp-setup.md` (optional but recommended).

## Use

Ask your agent things like:

- "Get PR comments and tell me which ones matter."
- "Show comments on PR 456 in summary form."
- "What did reviewers say about src/index.ts?"
- "Address the review feedback and tell me what you skipped."

## Configuration

None. Authentication comes from the GitHub CLI (`gh auth login`). The skill never reads or stores tokens.

## Files

- `SKILL.md` — the instructions the agent follows
- `references/mcp-setup.md` — MCP config for Claude Code, Cursor, VS Code Copilot, Windsurf, Cline, Claude Desktop, Codex CLI, Gemini CLI
- `references/tool-reference.md` — tool parameters, output formats, and CLI fallback commands
- `examples/triage-report.md` — sample output
