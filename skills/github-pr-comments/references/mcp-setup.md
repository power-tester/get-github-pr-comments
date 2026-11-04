# Setting up the get-github-pr-comments MCP server

The skill works best with the `get-github-pr-comments` MCP server, which wraps the GitHub CLI and exposes two tools to the agent. It is published on npm and on GitHub at https://github.com/power-tester/get-github-pr-comments (MIT licence).

## Requirements

- Node.js 16 or newer.
- GitHub CLI installed and signed in: `gh auth login`, then `gh auth status`.

## Claude Code

```bash
claude mcp add get-github-pr-comments -- npx -y get-github-pr-comments
```

Or add to `.mcp.json` in the project root:

```json
{
  "mcpServers": {
    "get-github-pr-comments": {
      "command": "npx",
      "args": ["-y", "get-github-pr-comments"]
    }
  }
}
```

## VS Code (GitHub Copilot)

`.vscode/mcp.json` in the workspace:

```json
{
  "servers": {
    "get-github-pr-comments": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "get-github-pr-comments"]
    }
  }
}
```

## Cursor

`.cursor/mcp.json` in the project, or `~/.cursor/mcp.json` globally:

```json
{
  "mcpServers": {
    "get-github-pr-comments": {
      "command": "npx",
      "args": ["-y", "get-github-pr-comments"]
    }
  }
}
```

## Windsurf, Cline, Claude Desktop

These use the same `mcpServers` block as Cursor above. File locations:

- Windsurf: `~/.codeium/windsurf/mcp_config.json`
- Cline: the MCP settings file opened from the Cline MCP Servers panel
- Claude Desktop (macOS): `~/Library/Application Support/Claude/claude_desktop_config.json`
- Claude Desktop (Windows): `%APPDATA%\Claude\claude_desktop_config.json`

## Codex CLI

`~/.codex/config.toml`:

```toml
[mcp_servers.get-github-pr-comments]
command = "npx"
args = ["-y", "get-github-pr-comments"]
```

## Gemini CLI

`~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "get-github-pr-comments": {
      "command": "npx",
      "args": ["-y", "get-github-pr-comments"]
    }
  }
}
```

## Verify

Restart the agent, then ask it to "get PR comments" from a branch with an open PR. The agent should call `get_pr_comments`. If it does not, confirm the server is listed in the agent's MCP panel and that `gh pr view` works from the same directory.

## Without the MCP server

The skill still works. It falls back to `gh api repos/<owner>/<repo>/pulls/<number>/comments` directly. The MCP server mainly saves the agent from composing CLI commands and gives it pre-formatted output.
