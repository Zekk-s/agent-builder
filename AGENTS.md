# AGENTS.md — Working Agreement for AI Agents and Human Contributors

This file governs how AI agents and humans contribute to `agent-builder`. **Read
before opening a PR.**

## Scope

- A browser-based visual canvas for designing AI agent topologies.
- Out of scope: provider SDK implementations, cloud hosting, billing.

## Hard rules

1. **Never commit `.env` or provider API keys.** Use `.env.example` only.
2. **Every node type ships with a Zod schema** for inputs and outputs.
3. **Edges validate contracts at insert time and at run time.**
4. **No telemetry or analytics in the canvas** unless explicitly enabled via env.
5. **Public exports must be deterministic** — no timestamps or random IDs in
   generated code unless the user opts in.

## Workflow

```text
issue → branch → PR → CI green → human review → squash merge to main
```

- Branch names: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`, `docs/<scope>`.
- Commit subjects ≤ 72 chars, body wraps at 100.
- One logical change per PR. Reformatting in a separate `chore:` PR.
- Agents propose via PR. **Humans approve before merge to `main`.**

## Testing

- `npm run test` (Vitest) — must pass 100 %.
- `npm run type-check` — must pass 100 %.
- `npm run lint` — must pass 100 %.
- Visual smoke test: `npm run storybook` (when applicable).
- Coverage floor: 70 % for `src/lib/`, 60 % repo-wide.

## Code style

- TypeScript: strict mode mandatory. ESLint (Airbnb) + Prettier.
- React function components only; no class components.
- Zustand stores live under `src/store/`.
- Custom node types live under `src/components/nodes/`.

## Review expectations

For a PR to be merged, the description must answer:

- What does this change do, and why now?
- Which tests cover it?
- Does it introduce a new node type? (Schema, sample, docs.)
- Does it change persistence or export formats? (Migration notes.)
- Are there new environment variables? (Update `.env.example`.)

## Observability

- Trace data redacts secrets by default.
- Every node execution emits a structured event with `node_id`, `latency_ms`,
  `status`, `error?`.

## Out of band

- Coordination with sibling repos under `@Zekk-s` happens via PR cross-links.
- The backend runtime lives in a separate repo once it ships.