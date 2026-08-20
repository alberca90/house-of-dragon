# Agent Instructions & Project Context

Project Stack: Astro + Keystatic CMS + React + Tailwind CSS v4

## Managed Skills (skills.sh)
This project uses consolidated agent skills installed via `npx skills`:
- `astro-framework` (delineas/astro-framework-agents)
- `tailwind-design-system` (wshobson/agents)
- `vercel-react-best-practices` (vercel-labs/agent-skills)
- `keystatic-populator` (local skill in `.github/skills/keystatic-populator`)

## General Rules & Standards
- **Component Strategy:** Default to native Astro components (`.astro`) for rendering pages and landing sections. Reserve React (`.jsx`/`.tsx`) strictly for Keystatic admin extensions or complex interactive client components (`client:load`).
- **Tailwind CSS v4:** Do NOT create or edit `tailwind.config.js`. Styling is handled via `@tailwindcss/vite` in `astro.config.mjs` and native CSS `@theme` directives.
- **Content Operations:** Keystatic acts as the local CMS writing directly to `src/content/`.
- **Typesafe Collections:** Always keep `keystatic.config.ts` and `src/content/config.ts` (Astro Content Collections) strictly in sync.

## Architectural Conventions
1. **Keystatic Config (`keystatic.config.ts`):** Defines local storage collections (`personajes`, `diferencias`).
2. **Astro Content Config (`src/content/config.ts`):** Mirrors the schema via Zod for type-safe queries using `getCollection()` and `getEntry()`.
3. **Dynamic Routes:** Dynamic pages reside in `src/pages/[collection]/[slug].astro` using `getStaticPaths()` and rendering Markdoc/MDX via `<Content />`.

## Copilot Context Workflow
- Keep `keystatic.config.ts` and `src/content/config.ts` open in editor tabs so Copilot leverages full schema context.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
