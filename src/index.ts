#!/usr/bin/env node

/**
 * GitHub PR Comments MCP Server
 * 
 * A Model Context Protocol server that fetches GitHub pull request review comments
 * using the GitHub CLI.
 * 
 * Architecture:
 * - tools/cli.ts         - GitHub CLI integration
 * - tools/comments.ts    - Comment formatting logic
 * - tools/handlers.ts    - Tool handler implementations
 * - tools/definitions.ts - MCP tool schemas
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Import tool handlers
import {
  handleGetPRComments,
  handleGetPRCommentsByFile,
  handleError,
} from "./tools/handlers.js";

// ============================================================================
// GitHub PR Comments Server Class
// ============================================================================

export class GitHubPRCommentsServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer(
      {
        name: "get-github-pr-comments",
        version: "1.0.1",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
    this.setupTools();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupTools() {
    // Register get_pr_comments tool
    this.server.registerTool(
      "get_pr_comments",
      {
        description: "Get all review comments for a GitHub pull request. Returns comments from code reviews.",
        inputSchema: z.object({
          pr_number: z.number().optional().describe("PR number to fetch comments from. If not provided, uses the current PR."),
          format: z.enum(["summary", "detailed"]).optional().describe("Format of the output. 'summary' shows one line per comment, 'detailed' shows full comment text. Default is 'detailed'."),
        }),
      },
      async (args) => {
        try {
          return await handleGetPRComments(args);
        } catch (error) {
          return handleError(error);
        }
      }
    );

    // Register get_pr_comments_by_file tool
    this.server.registerTool(
      "get_pr_comments_by_file",
      {
        description: "Get review comments for a specific file in a GitHub pull request. Filters comments to show only those for the specified file path.",
        inputSchema: z.object({
          file_path: z.string().describe("Path to the file to get comments for"),
          pr_number: z.number().optional().describe("PR number to fetch comments from. If not provided, uses the current PR."),
        }),
      },
      async (args) => {
        try {
          return await handleGetPRCommentsByFile(args);
        } catch (error) {
          return handleError(error);
        }
      }
    );
  }

  async listen() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("GitHub PR Comments MCP Server running on stdio");
  }
}

// ============================================================================
// Server Startup
// ============================================================================

const server = new GitHubPRCommentsServer();
await server.listen();
