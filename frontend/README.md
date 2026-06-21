# Rickverse Frontend

The Rickverse frontend is a React and TypeScript single-page application. It provides public character discovery and authenticated profile and favorites workflows.

- Live application: [https://rick-morty-platform-chi.vercel.app](https://rick-morty-platform-chi.vercel.app)
- Full project guide: [../README.md](../README.md)

## Stack

- React 19 and TypeScript
- Vite 8
- Tailwind CSS 4
- React Router 7
- TanStack Query 5
- React Hook Form and Zod
- Axios
- Vitest, jsdom, and React Testing Library

## Feature structure

```text
src/
├── app/             Router and lazy page imports
├── auth/            Session management and route protection
├── components/      Shared presentation components
├── features/
│   ├── auth/        Authentication API, hooks, and types
│   ├── characters/  Character API, query hooks, and types
│   └── favorites/   Favorites API, mutation hooks, and types
├── layouts/         Public/authenticated application shells
├── lib/             Axios client and token storage
├── pages/           Route-level pages
└── test/            Shared test setup
```

API access and server state are exposed through feature hooks. Route-level modules are lazy-loaded to reduce the initial JavaScript payload. TanStack Query handles caching, request cancellation, retry behavior, and cache invalidation after favorite mutations.

## Local setup

### Prerequisites

- Node.js 22 or later
- pnpm 11 or later
- The backend running at `http://localhost:5048`

Install dependencies and create the environment file:

```bash
cd frontend
pnpm install
cp .env.example .env
pnpm dev
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

The development server runs at `http://localhost:5173`.

## Environment variable

```env
VITE_API_BASE_URL=http://localhost:5048/api
```

`VITE_API_BASE_URL` must include the backend `/api` prefix. Vite variables are embedded at build time, so changing this value on Vercel requires a new deployment.

## Available commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the Vite development server |
| `pnpm build` | Type-check and create a production build |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run all Vitest tests once |
| `pnpm test:watch` | Run Vitest in watch mode |

## Tests

The frontend suite covers:

- protected-route loading, redirect, and authenticated states
- safe API error-message selection
- access-token storage and removal

Run it with:

```bash
pnpm test
```

## Vercel deployment

Import the GitHub repository into Vercel and configure:

| Setting | Value |
| --- | --- |
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `pnpm build` |
| Output Directory | `dist` |

Add this Production environment variable:

```env
VITE_API_BASE_URL=https://rick-morty-platform-ecv1.onrender.com/api
```

The included `vercel.json` rewrites application routes to `index.html`, allowing direct navigation and browser refreshes on paths such as `/characters/1`.

After deployment, set the backend Render variable to the exact Vercel origin without a trailing slash:

```env
FrontendOrigin=https://rick-morty-platform-chi.vercel.app
```
