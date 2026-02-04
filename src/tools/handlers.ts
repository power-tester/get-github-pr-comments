/**
 * PR Comments Tool Handlers
 * Business logic for handling PR comment requests
 */

import { getCurrentPRInfo, fetchPRComments } from "./cli.js";
import { formatComments } from "./comments.js";

/**
 * Handle get_pr_comments tool
 * @param args - Tool arguments
 * @returns MCP response object
 */
export async function handleGetPRComments(args: any) {
  const prInfo = getCurrentPRInfo();
  const prNumber = (args?.pr_number as number) ?? prInfo.number;
  const format = (args?.format as "summary" | "detailed") ?? "detailed";

  const comments = fetchPRComments(prInfo.nameWithOwner, prNumber);
  const formatted = formatComments(comments, format);

  return {
    content: [
      {
        type: "text" as const,
        text: `PR #${prNumber} Review Comments (${comments.length} total):\n\n${formatted}`,
      },
    ],
  };
}

/**
 * Handle get_pr_comments_by_file tool
 * @param args - Tool arguments
 * @returns MCP response object
 */
export async function handleGetPRCommentsByFile(args: any) {
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
        type: "text" as const,
        text: `Comments for ${filePath} in PR #${prNumber} (${fileComments.length} total):\n\n${formatted}`,
      },
    ],
  };
}

/**
 * Handle errors and return formatted error response
 * @param error - Error object
 * @returns MCP error response
 */
export function handleError(error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return {
    content: [
      {
        type: "text" as const,
        text: `Error: ${errorMessage}`,
      },
    ],
    isError: true,
  };
}
