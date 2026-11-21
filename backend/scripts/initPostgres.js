const postgresDb = require('../db/postgres');
require('dotenv').config();

async function run() {
  console.log('Connecting to PostgreSQL to initialize tables and seed data...');
  const success = await postgresDb.connectPostgres();
  if (success) {
    console.log('PostgreSQL successfully initialized and seeded with mock data!');
    const pool = postgresDb.getPool();
    const [userRes, catRes, dealRes] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS count FROM users'),
      pool.query('SELECT COUNT(*)::int AS count FROM categories'),
      pool.query('SELECT COUNT(*)::int AS count FROM deals')
    ]);
    console.log(`Users count: ${userRes.rows[0].count}`);
    console.log(`Categories count: ${catRes.rows[0].count}`);
    console.log(`Deals count: ${dealRes.rows[0].count}`);
    console.log('Admin user: admin@cashback.com / admin123');
    await pool.end();
    process.exit(0);
  } else {
    console.error('Failed to connect to PostgreSQL. Check your DATABASE_URL or PG* environment variables.');
    process.exit(1);
  }
}

run();
