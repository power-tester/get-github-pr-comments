#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { execSync } from "child_process";

interface PRComment {
  path: string;
  line: number | null;
  body: string;
  user: {
    login: string;
  };
  created_at: string;
  id: number;
}

interface PRInfo {
  number: number;
  nameWithOwner: string;
}

// Helper function to execute GitHub CLI commands
function executeGhCommand(command: string): string {
  try {
    return execSync(command, { encoding: "utf-8" }).trim();
  } catch (error) {
    throw new Error(`GitHub CLI command failed: ${error}`);
  }
}

// Get current PR info
function getCurrentPRInfo(): PRInfo {
  try {
    const prNumber = parseInt(
      executeGhCommand("gh pr view --json number -q .number")
    );
    const nameWithOwner = executeGhCommand(
      "gh repo view --json nameWithOwner -q .nameWithOwner"
    );
    return { number: prNumber, nameWithOwner };
  } catch (error) {
    throw new Error(
      "Failed to get PR info. Make sure you're in a git repository with a PR checked out."
    );
  }
}

// Fetch PR comments from GitHub
function fetchPRComments(repo: string, prNumber: number): PRComment[] {
  const command = `gh api repos/${repo}/pulls/${prNumber}/comments`;
  const output = executeGhCommand(command);
  return JSON.parse(output);
}

// Format comments for display
function formatComments(comments: PRComment[], format: "summary" | "detailed"): string {
  if (comments.length === 0) {
    return "No review comments found for this PR.";
  }

  if (format === "summary") {
    return comments
      .map((c) => {
        const firstLine = c.body.split("\n")[0];
        const lineInfo = c.line ? `:${c.line}` : "";
        return `${c.path}${lineInfo} - ${firstLine}`;
      })
      .join("\n");
  } else {
    // detailed format
    return comments
      .map((c) => {
        const lineInfo = c.line ? ` (line ${c.line})` : "";
        return `File: ${c.path}${lineInfo}
Author: ${c.user.login}
Date: ${new Date(c.created_at).toLocaleString()}
Comment:
${c.body}
${"=".repeat(80)}`;
      })
      .join("\n\n");
  }
}

// Create and configure the server
const server = new Server(
  {
    name: "github-pr-comments-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_pr_comments",
        description:
          "Fetch review comments from a GitHub pull request. Gets comments from the current PR or a specific PR number.",
        inputSchema: {
          type: "object",
          properties: {
            pr_number: {
              type: "number",
              description:
                "PR number to fetch comments from. If not provided, uses the current PR.",
            },
            format: {
              type: "string",
              enum: ["summary", "detailed"],
              description:
                "Format of the output. 'summary' shows one line per comment, 'detailed' shows full comment text. Default is 'detailed'.",
              default: "detailed",
            },
          },
        },
      },
      {
        name: "get_pr_comments_by_file",
        description:
          "Fetch review comments for a specific file in a pull request.",
        inputSchema: {
          type: "object",
          properties: {
            file_path: {
              type: "string",
              description: "Path to the file to get comments for",
            },
            pr_number: {
              type: "number",
              description:
                "PR number to fetch comments from. If not provided, uses the current PR.",
            },
          },
          required: ["file_path"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "get_pr_comments") {
      const prNumber = (args?.pr_number as number) ?? getCurrentPRInfo().number;
      const format = (args?.format as "summary" | "detailed") ?? "detailed";
      const prInfo = getCurrentPRInfo();
      const comments = fetchPRComments(prInfo.nameWithOwner, prNumber);
      const formatted = formatComments(comments, format);

      return {
        content: [
          {
            type: "text",
            text: `PR #${prNumber} Review Comments (${comments.length} total):\n\n${formatted}`,
          },
        ],
      };
    } else if (name === "get_pr_comments_by_file") {
      const filePath = args?.file_path as string;
      if (!filePath) {
        throw new Error("file_path is required");
      }

      const prInfo = getCurrentPRInfo();
      const prNumber = (args?.pr_number as number) ?? prInfo.number;
      const allComments = fetchPRComments(prInfo.nameWithOwner, prNumber);
      const fileComments = allComments.filter((c) => c.path === filePath);
      const formatted = formatComments(fileComments, "detailed");

      return {
        content: [
          {
            type: "text",
            text: `Comments for ${filePath} in PR #${prNumber} (${fileComments.length} total):\n\n${formatted}`,
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GitHub PR Comments MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
