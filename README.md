# agent-builder

Vite + React page in `frontend/`. `npm run dev` serves it on port 5174. The page shows a node list, a React Flow canvas, and an inspector. The header reads "visual agent orchestration". The code behind that header stores nodes and edges in memory for the browser session.

## Run

```bash
cd frontend
npm install
npm run dev
```

`frontend/vite.config.ts` sets `server.port` to `5174`. `frontend/index.html` sets the document title to `agent-builder`.

## What the page does

`App.tsx` lays out a header, `NodeCatalog`, `Canvas`, and `Inspector`.

The catalog lists six entries from `NODE_CATALOG` in `frontend/src/lib/schema.ts`:

- `llm` — LLM — "Run a prompt through a model provider."
- `tool` — Tool — "Call an external function or API."
- `router` — Router — "Branch flow based on a predicate."
- `human-gate` — Human Gate — "Pause until a human approves."
- `subgraph` — Sub-graph — "Embed another graph by reference."
- `memory` — Memory — "Read/write persistent state."

Those descriptions are strings. Dragging one onto the canvas calls `addNode` and stores `id`, `kind`, `label`, `position`, `inputs`, `outputs`, and `config`. The catalog uses browser drag-and-drop events. `@dnd-kit/core` and `@dnd-kit/sortable` are in `package.json` and are not imported.

`Canvas.tsx` renders React Flow with `Background` and `Controls` (zoom and pan). `fitView` is set. `kindToType` maps each kind to a type name (`llmNode`, `toolNode`, `routerNode`, `humanGateNode`, `subgraphNode`, `memoryNode`). No custom node component is registered, so React Flow draws its default node. Connecting two handles calls `addEdge`. "Reset canvas" clears the Zustand store.

`Inspector.tsx` prints `nodes` and `edges` counts. It can print id, kind, label, and position when `selectedNodeId` is set. No component calls `selectNode`, so that block stays on "Select a node to inspect."

`frontend/src/store/graph.ts` holds the graph in Zustand until reload. `frontend/src/lib/schema.ts` defines Zod objects: `NodeKindSchema`, `NodeConfigSchema`, `EdgeSchema` (including a `contract` object with optional `inputSchema` and `outputSchema` strings), and `GraphSchema` (`version: 1`). `addEdge` does not read `contract`. `frontend/src/lib/schema.test.ts` checks that an empty graph parses, that kind `"alien"` is rejected, and that the catalog includes `llm` and `human-gate`.

## Scripts

`frontend/package.json` version `0.1.0`, `"private": true`. No `homepage` field.

- `dev` — `vite`
- `build` — `tsc -b && vite build`
- `preview` — `vite preview`
- `lint` — `eslint . --ext ts,tsx`
- `type-check` — `tsc --noEmit`
- `test` — `vitest` (watch mode; `npm run test -- --run` runs once)

`npm run test -- --run` passes: 3 tests in `frontend/src/lib/schema.test.ts`.

`npm run type-check` and `npm run build` fail in the current sources. `tsc` reports unused locals in `Canvas.tsx` (`Edge`, `rfNodeToInternal`) and `NodeCatalog.tsx` (`addNode`), and a missing `contract` property on the object passed to `addEdge`.

`npm run lint` fails. ESLint 8 is installed and the repo has no ESLint config file.

## CI

`.github/workflows/ci.yml` runs on push and pull request to `main`, on Node 20. The job runs `npm ci` in `frontend/` (cache path `frontend/package-lock.json`), then `npm run lint`, `npx tsc --noEmit`, `npm run test -- --run`, and `npm run build`. `frontend/package-lock.json` is not in the tree.

## Dependencies

Runtime dependencies in `frontend/package.json`: `react`, `react-dom`, `reactflow`, `zustand`, `zod`, `@dnd-kit/core`, `@dnd-kit/sortable`, `nanoid`.

Imported by `frontend/src`: `react`, `react-dom`, `reactflow`, `zustand`, `zod`, `nanoid`.

Dev dependencies include TypeScript 5, Vite 5, `@vitejs/plugin-react`, Vitest, jsdom, `@testing-library/react`, `@testing-library/jest-dom`, ESLint 8, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`. The test file imports Vitest only. `vitest.config.ts` sets `environment` to `jsdom` and `globals` to `true`. It sets no coverage floor.

`frontend/tsconfig.json` targets ES2022, enables `strict`, `noUnusedLocals`, and `noUnusedParameters`, and includes `src`.

## Files

```
.env.example
.gitignore
AGENTS.md
LICENSE
README.md
.github/CODEOWNERS
.github/ISSUE_TEMPLATE/bug_report.yml
.github/ISSUE_TEMPLATE/feature_request.yml
.github/PULL_REQUEST_TEMPLATE.md
.github/workflows/ci.yml
frontend/index.html
frontend/package.json
frontend/tsconfig.json
frontend/vite.config.ts
frontend/vitest.config.ts
frontend/src/main.tsx
frontend/src/App.tsx
frontend/src/styles.css
frontend/src/components/Canvas.tsx
frontend/src/components/Inspector.tsx
frontend/src/components/NodeCatalog.tsx
frontend/src/lib/schema.ts
frontend/src/lib/schema.test.ts
frontend/src/store/graph.ts
```

`.gitignore` ignores `.env`, `node_modules/`, and build output. `.env.example` states that `frontend/src` does not read environment variables. `.github/CODEOWNERS` assigns the tree to `@Zekiog`.

## License

MIT. See `LICENSE` (Copyright 2026 Zekk-s).

## Maintainer

[@Zekiog](https://github.com/Zekiog) · [@Zekk-s](https://github.com/Zekk-s)
