# React-2

React-2 is a React app with a lightweight **React-2 DSL** that compiles compact text markup into rendered React elements.

## What is included

- Vite + React app scaffold
- Multi-view demo experience (Home / Studio / Stats)
- Stateful interactions (boost counter + progress checklist)
- React-2 syntax layer (`tag.class#id::text` + indentation for nesting)
- Live DSL editor with instant preview
- Deployment config for static hosting

## Run locally

```bash
npm install
npm run dev
```

## Validate

```bash
npm run lint
npm run build
```

## Build output

```bash
npm run build
# output in dist/
```

## Deploy

`netlify.toml` is included for Netlify deployment:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect to `index.html`
