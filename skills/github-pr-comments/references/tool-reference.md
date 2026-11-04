# Tool reference

## MCP tools provided by get-github-pr-comments

### get_pr_comments

Fetch all inline review comments on a pull request.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `pr_number` | number | no | PR to read. Defaults to the PR for the current branch. |
| `format` | `"summary"` or `"detailed"` | no | Defaults to `"detailed"`. |

Summary output, one line per comment:

```
src/index.ts:42 - Consider handling the null case here
src/utils.ts:10 - nit: rename to parseConfig
```

Detailed output, one block per comment:

```
File: src/index.ts (line 42)
Author: octocat
Date: 11/3/2026, 2:15:00 PM
Comment:
Consider handling the null case here. `config` can be undefined when
the env var is missing.
================================================================================
```

The response starts with a header line: `PR #<number> Review Comments (<count> total):`.

### get_pr_comments_by_file

Fetch review comments for one file only. Output is always detailed.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `file_path` | string | yes | Path relative to the repository root, exactly as GitHub reports it. |
| `pr_number` | number | no | Defaults to the PR for the current branch. |

Header line: `Comments for <file_path> in PR #<number> (<count> total):`.

### Errors

Both tools return an error message as text (with `isError: true`) rather than throwing. Common messages:

- `Failed to get PR info. Make sure you're in a git repository with a PR checked out.` No PR for the current branch. Ask the user for a PR number.
- `GitHub CLI command failed: ...` The `gh` CLI is missing, not authenticated, or lacks access. Tell the user to run `gh auth status`.

## GitHub CLI fallback

The MCP server runs these commands under the hood. Use them directly when the tools are not available.

Current PR and repo:

```bash
gh pr view --json number,title,url
gh repo view --json nameWithOwner -q .nameWithOwner
```

Review comments (inline, attached to a diff line):

```bash
gh api "repos/<owner>/<repo>/pulls/<number>/comments" --paginate
```

Useful fields in each object: `id`, `path`, `line` (null for outdated comments; see `original_line`), `body`, `user.login`, `created_at`, `in_reply_to_id` (present on replies), `html_url`.

Review summaries (the approve / request-changes bodies), which the MCP tools do not include:

```bash
gh api "repos/<owner>/<repo>/pulls/<number>/reviews" --jq '.[] | {state, author: .user.login, body}'
```

Note: `line` is null when the comment is on a line that no longer exists in the latest diff. Treat those as possibly resolved and check `original_line` and the current code.
