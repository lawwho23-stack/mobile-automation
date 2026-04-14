import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase/Render
  }
});

export const db = pool;

// Test connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Initialize tables
export const initDb = async () => {
  console.log("🐘 Attempting to connect to PostgreSQL...");
  try {
    const client = await pool.connect();
    console.log("✅ Database connected successfully!");
    client.release();
  } catch (err: any) {
    console.error("❌ Database connection failed:", err.message);
    throw err;
  }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS flows (
      id TEXT PRIMARY KEY,
      name TEXT,
      nodes JSONB,
      enabled INTEGER DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS credentials (
      id TEXT PRIMARY KEY,
      name TEXT,
      provider TEXT,
      api_key TEXT,
      base_url TEXT,
      meta JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY,
      flow_id TEXT REFERENCES flows(id),
      flow_name TEXT,
      start_time TEXT,
      end_time TEXT,
      status TEXT,
      steps JSONB,
      error TEXT
    );

    CREATE TABLE IF NOT EXISTS processed_updates (
      update_id BIGINT PRIMARY KEY
    );
  `);
};

// Flow Operations
export const FlowModel = {
  all: async () => {
    const { rows } = await pool.query('SELECT * FROM flows ORDER BY created_at DESC');
    return rows;
  },
  create: async (flow: any) => {
    const id = flow.id || Math.random().toString(36).substring(7);
    await pool.query(
      'INSERT INTO flows (id, name, nodes, enabled) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET name = $2, nodes = $3, enabled = $4',
      [id, flow.name, JSON.stringify(flow.nodes), flow.enabled !== undefined ? (flow.enabled ? 1 : 0) : 1]
    );
    return { ...flow, id };
  },
  findById: async (id: string) => {
    const { rows } = await pool.query('SELECT * FROM flows WHERE id = $1', [id]);
    return rows[0] || null;
  },
  toggleEnabled: async (id: string, status: boolean) => {
    await pool.query('UPDATE flows SET enabled = $1 WHERE id = $2', [status ? 1 : 0, id]);
  },
  delete: async (id: string) => {
    await pool.query('DELETE FROM flows WHERE id = $1', [id]);
  }
};

// Log Operations
export const LogModel = {
  all: async () => {
    const { rows } = await pool.query('SELECT * FROM logs ORDER BY start_time DESC LIMIT 100');
    return rows;
  },
  create: async (log: any) => {
    await pool.query(`
      INSERT INTO logs (id, flow_id, flow_name, start_time, status, steps) 
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [log.id, log.flowId, log.flowName, log.startTime, log.status, JSON.stringify(log.steps)]);
  },
  update: async (id: string, log: any) => {
    await pool.query(`
      UPDATE logs SET end_time = $1, status = $2, steps = $3, error = $4 
      WHERE id = $5
    `, [new Date().toISOString(), log.status, JSON.stringify(log.steps), log.error || null, id]);
  }
};

// Credential Operations
export const CredentialModel = {
  all: async () => {
    const { rows } = await pool.query('SELECT * FROM credentials ORDER BY created_at DESC');
    return rows;
  },
  create: async (cred: any) => {
    const id = Math.random().toString(36).substring(7);
    await pool.query(`
      INSERT INTO credentials (id, name, provider, api_key, base_url, meta) 
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [id, cred.name, cred.provider, cred.apiKey, cred.baseUrl || null, JSON.stringify(cred.meta || {})]);
    return { ...cred, id };
  },
  delete: async (id: string) => {
    await pool.query('DELETE FROM credentials WHERE id = $1', [id]);
  }
};

// Idempotency
export const IdempotencyModel = {
  isProcessed: async (id: number) => {
    const { rows } = await pool.query('SELECT 1 FROM processed_updates WHERE update_id = $1', [id]);
    return rows.length > 0;
  },
  markProcessed: async (id: number) => {
    await pool.query('INSERT INTO processed_updates (update_id) VALUES ($1) ON CONFLICT DO NOTHING', [id]);
  }
};
