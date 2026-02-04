/**
 * Comment Formatting
 * Handles formatting of PR comments for different output formats
 */

import type { PRComment } from "./cli.js";

/**
 * Formats PR comments for display
 * @param comments - Array of PR comments to format
 * @param format - Output format ("summary" or "detailed")
 * @returns Formatted string representation of comments
 */
export function formatComments(
  comments: PRComment[],
  format: "summary" | "detailed"
): string {
  if (comments.length === 0) {
    return "No review comments found for this PR.";
  }

  return format === "summary"
    ? formatSummaryComments(comments)
    : formatDetailedComments(comments);
}

/**
 * Formats comments in summary view (one line per comment)
 */
function formatSummaryComments(comments: PRComment[]): string {
  return comments
    .map((comment) => {
      const firstLine = comment.body.split("\\n")[0];
      const lineInfo = comment.line ? `:${comment.line}` : "";
      return `${comment.path}${lineInfo} - ${firstLine}`;
    })
    .join("\\n");
}

/**
 * Formats comments in detailed view (full comment with metadata)
 */
function formatDetailedComments(comments: PRComment[]): string {
  return comments
    .map((comment) => {
      const lineInfo = comment.line ? ` (line ${comment.line})` : "";
      return `File: ${comment.path}${lineInfo}
Author: ${comment.user.login}
Date: ${new Date(comment.created_at).toLocaleString()}
Comment:
${comment.body}
${"=".repeat(80)}`;
    })
    .join("\\n\\n");
}
