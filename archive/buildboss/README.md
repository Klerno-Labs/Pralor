# BuildBoss – Meta Builder Assistant

BuildBoss is a Next.js + TypeScript + Tailwind app that acts as a meta-builder assistant.

It interviews you about your website, turns your answers into a structured spec, runs a
multi-agent style pipeline (Boss + specialized agents + audit), and generates a
ready-to-run website template with a live preview and implementation notes.

## Tech stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the dev server:

   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser.

## Project structure

- `app/` – routes and layouts
  - `/` – home and task selection
  - `/wizard` – deep interview wizard
  - `/spec-preview` – normalized `ProjectSpec` preview
  - `/result` – generated template preview + notes + audit
- `lib/spec` – spec types, normalization, and React context
- `lib/agents` – Boss + specialized agents (design, structure, content, code, audit)
- `lib/pipeline` – orchestration pipeline
- `components/` – UI primitives and generated section renderer

## How it works

1. **Wizard** – You answer questions about goals, audience, branding, structure,
   content, functionality, and behavior.
2. **Spec** – Answers are normalized into a strongly-typed `ProjectSpec`.
3. **BossAgent** – Takes the spec and creates `TaskSpec`s for each specialized agent.
4. **Specialized agents** – Produce:
   - `DesignSystem`
   - `LayoutTree`
   - `ContentBlueprint`
   - `ImplementationPlan`
5. **AuditAgent** – Reviews the combined configuration and emits audit findings.
6. **Result UI** – Renders a homepage preview using reusable section components and
   surfaces developer notes & audit results.

The current implementation simulates agents with pure TypeScript functions, but the
structure is ready for real LLM-backed agents to be plugged in behind the same
interfaces.

## Extending

- To support other project types (e.g., SaaS app), extend `ProjectSpec` and add new
  flows in `app/` and `lib/agents`.
- To deepen the agent logic, connect actual LLM calls inside the agent functions while
  keeping the orchestration and types intact.

This repo is designed to drop straight into VS Code and be hacked on with your AI pair
programmer of choice.
