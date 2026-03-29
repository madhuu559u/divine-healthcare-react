/**
 * Run database migration against Supabase
 * Usage: node supabase/run-migration.mjs
 *
 * To switch to a new Supabase project, update the connection string below
 * or set DATABASE_URL environment variable.
 */
import pg from 'pg';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// === CONFIGURATION: Change this when switching Supabase projects ===
const DATABASE_URL = process.env.DATABASE_URL ||
  'postgresql://postgres:Cromebdsqa%40559@db.uivawgptglejclpxhyno.supabase.co:5432/postgres';

async function run() {
  console.log('Connecting to Supabase database...');
  const client = new pg.Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    console.log('Connected successfully.');

    const sql = readFileSync(join(__dirname, 'migrations', '001_initial_schema.sql'), 'utf-8');
    console.log('Running migration...');
    await client.query(sql);
    console.log('Migration completed successfully!');

    // Verify tables
    const res = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    console.log('\nTables created:');
    res.rows.forEach(r => console.log(`  - ${r.table_name}`));

    // Count seed data
    const jobs = await client.query('SELECT count(*) FROM public.jobs');
    console.log(`\nSeed jobs inserted: ${jobs.rows[0].count}`);

  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
