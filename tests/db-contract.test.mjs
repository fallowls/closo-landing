import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { Pool } from "pg";

let pool;

function cleanDatabaseUrl(url) {
  if (!url) return url;
  if (url.includes("channel_binding=")) {
    url = url.replace(/[?&]channel_binding=[^&]*/g, "");
    url = url.replace(/[?&]$/, "");
  }
  return url.trim();
}

function resolveDatabaseUrl() {
  const direct = process.env.DATABASE_URL;
  if (direct && direct.trim()) {
    return cleanDatabaseUrl(direct);
  }

  const host = process.env.PGHOST;
  const db = process.env.PGDATABASE;
  const user = process.env.PGUSER;
  const port = process.env.PGPORT || "5432";
  const password = process.env.PGPASSWORD || "";

  if (host && db && user) {
    return `postgresql://${user}:${password}@${host}:${port}/${db}?sslmode=require`;
  }

  throw new Error("DATABASE_URL (or PGHOST/PGDATABASE/PGUSER) must be set for DB contract tests");
}

async function getColumns(tableName) {
  const result = await pool.query(
    `
    select lower(column_name) as column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = $1
    order by ordinal_position
    `,
    [tableName],
  );

  return result.rows.map((row) => row.column_name);
}

async function tableExists(tableName) {
  const result = await pool.query(
    `
    select exists(
      select 1
      from information_schema.tables
      where table_schema = 'public'
        and table_name = $1
    ) as exists
    `,
    [tableName],
  );

  return result.rows[0]?.exists === true;
}

before(async () => {
  const connectionString = resolveDatabaseUrl();
  pool = new Pool({
    connectionString,
    ssl: connectionString.includes("neon.tech")
      ? { rejectUnauthorized: false }
      : false,
  });

  await pool.query("select 1");
});

after(async () => {
  if (pool) {
    await pool.end();
  }
});

test("contacts table includes expected contract columns", async () => {
  const columns = await getColumns("contacts");
  const required = ["id", "full_name", "email", "company", "lead_score", "created_at"];

  for (const column of required) {
    assert.ok(columns.includes(column), `contacts table missing column: ${column}`);
  }
});

test("campaigns table includes expected contract columns", async () => {
  const columns = await getColumns("campaigns");
  const required = ["id", "name", "encrypted_data", "field_mappings", "record_count", "created_at"];

  for (const column of required) {
    assert.ok(columns.includes(column), `campaigns table missing column: ${column}`);
  }
});

test("company and lead domain contracts are represented in schema", async () => {
  const contactsColumns = await getColumns("contacts");
  assert.ok(contactsColumns.includes("company"), "contacts must include company column");
  assert.ok(contactsColumns.includes("lead_score"), "contacts must include lead_score column");

  const hasCompaniesTable = await tableExists("companies");
  const hasLeadsTable = await tableExists("leads");

  if (hasCompaniesTable) {
    const companyColumns = await getColumns("companies");
    assert.ok(companyColumns.includes("id"), "companies table should include id");
    assert.ok(companyColumns.includes("name"), "companies table should include name");
  }

  if (hasLeadsTable) {
    const leadColumns = await getColumns("leads");
    assert.ok(leadColumns.includes("id"), "leads table should include id");
  }
});

test("core CRM tables are queryable with limited selects", async () => {
  await pool.query("select id, full_name, company, lead_score from contacts limit 3");
  await pool.query("select id, name, record_count from campaigns limit 3");
});
