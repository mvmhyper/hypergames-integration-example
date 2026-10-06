# Hypergames Integration Example

Express API (TypeScript).

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

Development with hot reload

```bash
docker compose up --build
```

The project is mounted at `/app` and nodemon watches `src/` with polling for reliable reloads on mounts.

## Endpoints

Refer to  `./openapi.yaml` for the documentation of all available endpoints. You can also import it into Bruno or Postman and test it there.
