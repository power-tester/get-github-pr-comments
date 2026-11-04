---
name: github-pr-comments
description: Fetches GitHub pull request review comments and turns them into an actionable triage, using the get-github-pr-comments MCP server or the GitHub CLI. Use when the user asks to "get PR comments", "show review comments", "what did reviewers say", "address the review feedback", "fix the PR comments", or asks about comments on a specific file or PR number.
---

# GitHub PR Comments

Fetch the review comments left on a pull request, summarize them, and (only when asked) address them in the code.

## When to use

- The user asks for review comments, review feedback, or "what reviewers said" on a PR.
- The user asks to address, fix, or respond to PR review comments.
- The user asks about comments on one file, for example "what are the comments on src/index.ts".
- The user gives a PR number, for example "show comments for PR 123".

Do NOT use for:

- Creating or editing pull requests, posting replies, or resolving threads. This skill is read-only on GitHub.
- Issue comments or general PR conversation comments. This skill covers inline code review comments only.

## Prerequisites

1. The GitHub CLI (`gh`) is installed and authenticated. Verify with `gh auth status`.
2. The working directory is a git checkout of the repository that owns the PR.
3. Preferred: the `get-github-pr-comments` MCP server is configured. It exposes two tools, `get_pr_comments` and `get_pr_comments_by_file`. See `references/mcp-setup.md` for the config for each agent.

If the MCP tools are not available, fall back to the GitHub CLI commands in Step 2. Do not stop and ask the user to install the server first. Mention the setup once at the end of your response.

## Steps

### Step 1. Identify the PR

- If the user gave a PR number, use it.
- Otherwise, use the PR for the current branch. The MCP tools do this automatically. With the CLI, run:

```bash
gh pr view --json number,title,url -q '"\(.number) \(.title) \(.url)"'
```

- If no PR is found, tell the user and ask for the PR number. Do not guess.

### Step 2. Fetch the comments

Preferred, with the MCP server:

- All comments: call `get_pr_comments` with `format: "detailed"` (optional `pr_number`).
- Quick overview of a large PR: call `get_pr_comments` with `format: "summary"` first, then fetch `detailed` only if needed.
- One file: call `get_pr_comments_by_file` with `file_path` (relative to the repo root) and optional `pr_number`.

Fallback, with the GitHub CLI:

```bash
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
gh api "repos/$REPO/pulls/<PR_NUMBER>/comments" --paginate \
  --jq '.[] | {id, path, line, author: .user.login, created_at, in_reply_to_id, body}'
```

For a single file, add `| select(.path == "<FILE_PATH>")` before the object in the `--jq` expression.

Full parameter and output details are in `references/tool-reference.md`.

### Step 3. Group and classify

Group comments by file, then by line. Treat replies in the same thread as one discussion. Classify each thread as one of:

| Label | Meaning |
|---|---|
| Must fix | Reviewer requested a change, or the comment describes a bug, security issue, or broken behaviour. |
| Suggestion | Optional improvement, style, or refactor. |
| Question | Reviewer asked something; needs an answer, not necessarily a code change. |
| Nit | Trivial wording, formatting, or naming. |
| Resolved | The thread already contains a reply saying it was handled, or the code at that line already reflects the request. |

When classifying, read the code at the referenced file and line so the summary reflects the current state, not just the comment text.

### Step 4. Report

Always produce the report below before changing any code.

```
## PR #<number>: <title>
<count> review comments in <n> threads across <m> files.

### Must fix
- `path/to/file.ts:42` (@reviewer): <one-line summary of the ask>

### Suggestions
- ...

### Questions
- `path/to/file.ts:10` (@reviewer): <question> — suggested answer: <answer>

### Nits
- ...

### Already resolved
- ...
```

Omit empty sections. Keep each bullet to one or two lines. Quote the reviewer only when the exact wording matters.

### Step 5. Address comments (only when asked)

If the user asked to fix or address the comments:

1. Work through Must fix items first, then Suggestions, then Nits. Skip Questions unless they imply a code change.
2. Make the smallest change that satisfies each comment. Do not refactor beyond what the reviewer asked.
3. Do not commit, push, reply on GitHub, or resolve threads unless the user explicitly asks.
4. Finish with a table of what was changed, what was skipped, and why:

```
| Comment | Action | Note |
|---|---|---|
| src/index.ts:42 | Fixed | Added null check |
| src/utils.ts:10 | Skipped | Needs product decision on retry policy |
```

## Boundaries

- Read-only on GitHub. Never post, edit, or resolve comments through this skill.
- Never print or store GitHub tokens. Authentication is handled by the GitHub CLI.
- If the CLI reports a permissions error, say so and stop. Do not try alternate credentials.

## Example requests

- "Get the PR comments and tell me which ones matter."
- "Show review comments on PR 456 in summary form."
- "What did reviewers say about src/auth/login.ts?"
- "Address the review feedback and tell me what you skipped."

A sample output is in `examples/triage-report.md`.
