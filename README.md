# agent-builder

Visual agent orchestration and control panel.

A browser-based canvas for designing, connecting, and observing AI agents. Nodes are
typed (LLM, tool, router, human-gate, sub-graph); edges carry typed contracts; the
runtime executes the graph with full tracing, retry/backoff, and human-in-the-loop
gates. Built for engineers who want to iterate on agent topology without writing a
single line of orchestration glue — but export to real code when production-ready.

## Features

- **Typed node catalog** — LLM, Tool, Router, Human-Gate, Sub-graph, Memory.
- **Visual canvas** — drag-and-drop edges, zoom/pan, undo/redo, copy/paste.
- **Contract validation** — edges check input/output schemas before runtime accepts.
- **Simulation mode** — dry-run the graph against stubbed providers, log every step.
- **Live mode** — execute against real providers, stream traces to the inspector.
- **Export** — serialize graph to JSON, TypeScript, or Python for hand-off.
- **Persistence** — autosave to local IndexedDB; sync to backend when configured.

## Quick start

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5174
```

## Stack

- **Canvas:** React Flow
- **State:** Zustand
- **UI:** React 18 + TypeScript (strict)
- **Validation:** Zod
- **Build:** Vite
- **Test:** Vitest + Testing Library

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Browser                                                     │
│  ┌──────────────────┐   ┌──────────────────┐   ┌──────────┐  │
│  │  Node catalog    │   │  Canvas (React   │   │ Inspector│  │
│  │  (drag-source)   │   │  Flow)           │   │ (traces) │  │
│  └──────────────────┘   └──────────────────┘   └──────────┘  │
│         │                       │                       │     │
│         └───────── Zustand store (graph + traces) ─────────┘  │
│                                 │                            │
└─────────────────────────────────┼────────────────────────────┘
                                  ▼
                  ┌───────────────────────────┐
                  │  Optional runtime bridge  │
                  │  (FastAPI stub planned)   │
                  └───────────────────────────┘
```

## Workflow

```text
design → validate → simulate → live-run → export → deploy
```

- **design** — assemble nodes/edges on the canvas.
- **validate** — `npm run validate` checks contracts and isolation.
- **simulate** — dry-run with stubbed providers; per-node latency estimates.
- **live-run** — execute against real providers; traces stream to the inspector.
- **export** — produce runnable code (`agent-builder export --format ts`).

## Security

- Provider API keys live in `.env` (gitignored). Never paste keys into node configs.
- Trace logs redact by default; secrets field masked as `***`.
- Human-gate nodes emit approval events to a configurable audit sink.

## Roadmap

- [ ] Backend runtime (FastAPI + worker pool)
- [ ] Multi-user collaboration (CRDT over the graph state)
- [ ] Versioning + visual diff of graph revisions
- [ ] Plugin SDK for custom node types
- [ ] Import from existing Python orchestration code

## License

MIT — see `LICENSE`.

## Maintainer

[@Zekiog](https://github.com/Zekiog) · part of [@Zekk-s](https://github.com/Zekk-s).