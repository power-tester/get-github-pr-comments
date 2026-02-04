/**
 * Tool Definitions
 * MCP tool schemas and descriptions
 */

export const toolDefinitions = [
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
];
