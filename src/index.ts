import 'dotenv/config';
import 'reflect-metadata';
import 'express-async-errors';
import { createApp } from './app';
import { initDb } from './data-source';

const PORT = Number(process.env.PORT ?? 3000);

async function main(): Promise<void> {
  await initDb();
  createApp().listen(PORT, () => {
    console.log(`test-api listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
