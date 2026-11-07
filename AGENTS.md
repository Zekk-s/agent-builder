# AGENTS.md

Notes for people editing this repo. The tree is a Vite + React page under `frontend/`. Describe the files that are here.

## Scope

The page renders `NodeCatalog`, a React Flow `Canvas`, and `Inspector`. Graph data lives in the Zustand store at `frontend/src/store/graph.ts` for the browser session.

`frontend/src/lib/schema.ts` is the Zod schema for that graph. One `NodeConfigSchema` covers every kind. The kinds are `llm`, `tool`, `router`, `human-gate`, `subgraph`, and `memory`. They are catalog labels. `EdgeSchema` has a `contract` object. `addEdge` does not check it.

This repo has no model provider client, graph runner, export command, or database.

## Rules

1. Do not commit `.env` or secrets. `.env` is in `.gitignore`. `.env.example` is the template. Nothing under `frontend/src` reads environment variables.
2. Keep TypeScript strict. `frontend/tsconfig.json` sets `strict`, `noUnusedLocals`, and `noUnusedParameters`.
3. React function components only.
4. Keep the Zustand store under `frontend/src/store/`. Keep graph schemas in `frontend/src/lib/schema.ts`.
5. Docs should match the tree. Do not describe a runtime, export path, or persistence layer that the files do not implement.

## Checks

From `frontend/`:

- `npm run test` — Vitest. Add `-- --run` to exit. The three tests in `src/lib/schema.test.ts` pass.
- `npm run type-check` — `tsc --noEmit`. Currently fails: unused locals in `Canvas.tsx` and `NodeCatalog.tsx`, and a missing `contract` field on the canvas `addEdge` call.
- `npm run lint` — `eslint . --ext ts,tsx`. Currently fails: no ESLint config file in the repo.
- `npm run build` — `tsc -b && vite build`. Currently fails on the same `tsc` errors as `type-check`.

`.github/workflows/ci.yml` runs those steps on Node 20 for pushes and pull requests to `main`, after `npm ci`. `npm ci` expects `frontend/package-lock.json`. That lockfile is not committed.

`vitest.config.ts` uses jsdom. It does not set a coverage floor. There is no Storybook script. Prettier is not installed. ESLint packages are listed in `frontend/package.json` and have no config file.

`@dnd-kit/core` and `@dnd-kit/sortable` are dependencies. The catalog does not import them. It uses browser drag events.

## Review

In the pull request, say what changed, which files you read, and which scripts you ran. `CODEOWNERS` lists `@Zekiog`.
