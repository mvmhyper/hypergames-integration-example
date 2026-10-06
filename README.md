# test-api

Skeleton Express API (TypeScript).

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

- `npm run dev` — start in watch mode (ts-node + nodemon)
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run compiled output

## Docker

Production image (defaults to the `runner` stage):

```bash
docker build -t test-api .
docker run -d --name test-api -p 3000:3000 test-api
```

Development with hot reload (builds the `development` stage from the
same Dockerfile, mounts the project, runs nodemon):

```bash
docker compose up --build
```

The project is mounted at `/app` (`/app/node_modules` is kept as an
anonymous volume so container-installed deps aren't shadowed), and
nodemon watches `src/` with polling for reliable reloads on mounts.

## Endpoints

- `GET /health`
- `POST /api/users` — `{username}`
- `POST /api/games` — `{slug, name, time_limit, url}`
- `POST /api/tournaments` — `{name, game_slug, type: PVP|MULTI, participant_limit}`
- `POST /api/tournaments/:id/play` — `{username}`
- `GET /api/tournaments/:id` — game, details, entries
- `POST /api/entries` — `{tournament_id, user_id}`
- `POST /api/entries/score` — game score payload, `Authorization: Bearer GS_WEBHOOK_KEY`
