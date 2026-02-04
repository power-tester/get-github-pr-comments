/**
 * GitHub CLI Integration
 * Handles all interactions with GitHub CLI (gh command)
 */

import { execSync } from "node:child_process";

export interface PRInfo {
  number: number;
  nameWithOwner: string;
}

export interface PRComment {
  path: string;
  line: number | null;
  body: string;
  user: {
    login: string;
  };
  created_at: string;
  id: number;
}

/**
 * Executes a GitHub CLI command and returns the output
 * @param command - The gh command to execute
 * @returns Trimmed command output
 * @throws Error if the command fails
 */
export function executeGhCommand(command: string): string {
  try {
    return execSync(command, { encoding: "utf-8" }).trim();
  } catch (error) {
    throw new Error(`GitHub CLI command failed: ${error}`);
  }
}

/**
 * Gets information about the current pull request
 * @returns PR number and repository name
 * @throws Error if not in a git repository or no PR is checked out
 */
export function getCurrentPRInfo(): PRInfo {
  try {
    const prNumber = Number.parseInt(
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

/**
 * Fetches review comments from a GitHub pull request
 * @param repo - Repository name in format "owner/repo"
 * @param prNumber - Pull request number
 * @returns Array of PR comments
 */
export function fetchPRComments(repo: string, prNumber: number): PRComment[] {
  const command = `gh api repos/${repo}/pulls/${prNumber}/comments`;
  const output = executeGhCommand(command);
  return JSON.parse(output);
}
