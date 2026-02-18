import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { startServer, stopServer } from "./helpers/server.mjs";

let server;

before(async () => {
  server = await startServer();
});

after(async () => {
  await stopServer(server);
});

test("GET /api/health returns service health payload", async () => {
  const response = await fetch(`${server.baseUrl}/api/health`);
  assert.ok([200, 503].includes(response.status));

  const body = await response.json();
  assert.ok(typeof body === "object" && body !== null);
  assert.ok(typeof body.status === "string");
  assert.ok(typeof body.timestamp === "string");
  assert.ok(typeof body.storage === "string");
  assert.ok(typeof body.database === "string");
});

test("GET /api/campaigns responds with a JSON array", async () => {
  const response = await fetch(`${server.baseUrl}/api/campaigns`);
  assert.equal(response.status, 200);

  const body = await response.json();
  assert.ok(Array.isArray(body));
});

test("GET /api/contacts responds with a JSON array", async () => {
  const response = await fetch(`${server.baseUrl}/api/contacts`);
  assert.equal(response.status, 200);

  const body = await response.json();
  assert.ok(Array.isArray(body));
});

test("GET /api/auth/status returns session authentication state", async () => {
  const response = await fetch(`${server.baseUrl}/api/auth/status`);
  assert.equal(response.status, 200);

  const body = await response.json();
  assert.equal(typeof body.authenticated, "boolean");
  assert.equal(typeof body.role, "string");
});
