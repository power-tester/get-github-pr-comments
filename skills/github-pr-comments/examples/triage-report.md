# Example output

User request: "Get the PR comments and tell me which ones matter."

Agent response:

## PR #128: Add retry logic to the upload client
7 review comments in 5 threads across 3 files.

### Must fix
- `src/upload/client.ts:58` (@maria-dev): Retry loop never sleeps between attempts, so it hammers the API. Add backoff.
- `src/upload/client.ts:71` (@maria-dev): `response.body` is read twice; the second read throws on Node 18.

### Suggestions
- `src/upload/client.ts:40` (@tomk): Extract the retry policy into a config object so it can be tuned per environment.

### Questions
- `src/config.ts:12` (@tomk): "Why is the default max retries 10?" — suggested answer: it matches the previous SDK; happy to drop to 3 if preferred.

### Nits
- `README.md:34` (@maria-dev): Typo, "recieve" to "receive".

Reply "address them" and I will fix the Must fix items and the nit, and leave the config extraction for you to decide.
