# Get GitHub PR Comments

A Model Context Protocol (MCP) server that fetches GitHub pull request review comments using the GitHub CLI. Seamlessly integrate PR review comments into your development workflow through VS Code, Claude Desktop, or Cline.

## Features

- 📝 **Fetch All PR Comments** - Get all review comments from any pull request
- 📄 **File-Specific Comments** - Filter comments by specific file paths  
- 📊 **Multiple Formats** - View comments in summary or detailed format
- 🔄 **Auto-Detection** - Automatically detects current PR or accepts PR number
- 🚀 **Easy Integration** - Works with VS Code, Claude Desktop, and Cline

## Prerequisites

- [GitHub CLI](https://cli.github.com/) installed and authenticated (`gh auth login`)
- Node.js >= 16.0.0
- A git repository with pull requests

## Installation

### Option 1: Install from npm (Recommended)

Install globally to use anywhere:

```bash
npm install -g get-github-pr-comments
```

Or use without installing via npx:

```bash
npx get-github-pr-comments
```

### Option 2: Local Development/Testing

Clone this repository and install dependencies:

```bash
git clone https://github.com/power-tester/get-github-pr-comments.git
cd get-github-pr-comments
npm install
npm run build
```

## Configuration

### VS Code (with GitHub Copilot)

Add to your VS Code MCP settings (`.vscode/mcp.json` in your workspace):

#### Using npm Package (Recommended):

```json
{
  "mcpServers": {
    "get-github-pr-comments": {
      "command": "npx",
      "args": ["get-github-pr-comments"]
    }
  }
}
```

Or if installed globally (packages typically installed in `/usr/local/bin` on macOS or `%APPDATA%\npm` on Windows):

```json
{
  "mcpServers": {
    "get-github-pr-comments": {
      "command": "get-github-pr-comments"
    }
  }
}
```

#### Using Local Installation:

```json
{
  "mcpServers": {
    "get-github-pr-comments": {
      "command": "node",
      "args": ["/absolute/path/to/get-github-pr-comments/build/index.js"]
    }
  }
}
```

**Important:** Replace `/absolute/path/to/get-github-pr-comments/build/index.js` with the actual absolute path to your built `index.js` file.

### Claude Desktop

On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`  
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "get-github-pr-comments": {
      "command": "npx",
      "args": ["get-github-pr-comments"]
    }
  }
}
```

### Cline

In your Cline MCP settings file:

```json
{
  "mcpServers": {
    "get-github-pr-comments": {
      "command": "npx",
      "args": ["get-github-pr-comments"]
    }
  }
}
```

### Reload Your Client

After adding the configuration, reload VS Code or restart your MCP client to activate the server.

## Available Tools

The server provides two MCP tools:

### 1. `get_pr_comments`

Fetch all review comments from a pull request.

**Parameters:**
- `pr_number` (optional): PR number to fetch comments from. If not provided, uses the current PR.
- `format` (optional): Output format - `"summary"` or `"detailed"`. Default is `"detailed"`.

**Output:**
- Summary format: One line per comment showing file path, line number, and first line of comment
- Detailed format: Full comment text with author, date, file path, and line number

**Example Usage:**
```
Get PR comments
Show PR comments in summary format
Get comments for PR #123
```

### 2. `get_pr_comments_by_file`

Fetch review comments for a specific file in a pull request.

**Parameters:**
- `file_path` (required): Path to the file to get comments for
- `pr_number` (optional): PR number to fetch comments from. If not provided, uses the current PR.

**Output:**
- Detailed format showing all comments for the specified file
- Includes author, date, line numbers, and full comment text

**Example Usage:**
```
Get PR comments for src/index.ts
Show comments for package.json in PR #123
```

## Usage

### In VS Code with GitHub Copilot

Once configured, you can ask Copilot:

- "Get PR comments and tell me what you think about them?"
- "Get PR comments and fix the ones that you think are important. Give me a summary of which ones you fixed and which ones you didnt and why"
- "Show me the review comments for this PR"
- "What are the comments for src/index.ts?"
- "Get PR comments in summary format"
- "Show comments for PR #456"

### In Claude Desktop or Cline

Ask the assistant:

- "Fetch the PR review comments"
- "Show me all comments on this pull request"
- "What feedback was given on the authentication code?"
- "Get comments for the main.py file"

## How It Works

1. **Auto-Detection**: Uses GitHub CLI to detect the current repository and PR
2. **API Calls**: Fetches comment data via `gh api` commands
3. **Formatting**: Processes and formats comments for readability
4. **Context Aware**: Provides relevant context (author, date, line numbers)

## Security

This server:
- Only reads PR comment data (no write operations)
- Uses authenticated GitHub CLI for API access
- Respects your GitHub permissions and repository access
- Does not store or transmit data to external services

## Troubleshooting

### Common Issues:

**"Failed to get PR info" error**
- Ensure you're in a git repository with a checked-out PR
- Run `gh pr view` to verify PR detection works
- Check that GitHub CLI is authenticated: `gh auth status`

**"GitHub CLI command failed" error**
- Verify GitHub CLI is installed: `gh --version`
- Ensure you're authenticated: `gh auth login`
- Check repository permissions

**MCP server not connecting**
- Verify the configuration path in your MCP settings file
- Restart VS Code or your MCP client after configuration changes
- Check the client's developer console for error messages

**No comments returned**
- Verify the PR has review comments (not just PR comments)
- Check that you have permission to view the PR
- Try specifying the PR number explicitly

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/power-tester/get-github-pr-comments.git
cd get-github-pr-comments

# Install dependencies
npm install

# Build
npm run build

# Watch mode for development
npm run watch
```

### Testing Locally

```bash
# Build the project
npm run build

# Test with MCP inspector (if available)
npx @modelcontextprotocol/inspector node build/index.js
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Areas for Contribution:

- Support for different comment types (PR comments vs review comments)
- Filtering by author, date range, or resolved status
- Export to different formats (CSV, JSON)
- Comment threading and conversation tracking
- Integration with code review workflows

## Author

Pramod Kumar Yadav

## License

MIT

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/power-tester/get-github-pr-comments).
