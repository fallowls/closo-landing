import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { startServer, stopServer } from "./helpers/server.mjs";

let server;
const createdCampaignIds = [];

before(async () => {
  server = await startServer();
});

after(async () => {
  for (const campaignId of createdCampaignIds) {
    try {
      await fetch(`${server.baseUrl}/api/campaigns/${campaignId}`, {
        method: "DELETE",
      });
    } catch {
      // Cleanup best-effort only.
    }
  }

  await stopServer(server);
});

test("POST /api/campaigns/upload without file returns 400", async () => {
  const form = new FormData();
  form.set("fieldMappings", JSON.stringify({ Name: "Name" }));

  const response = await fetch(`${server.baseUrl}/api/campaigns/upload`, {
    method: "POST",
    body: form,
  });

  assert.equal(response.status, 400);
  const body = await response.json();
  assert.equal(body.message, "No CSV file uploaded");
});

test("POST /api/campaigns/upload without field mappings returns 400", async () => {
  const csv = "Name,Email\nImport Probe,probe@example.com\n";
  const form = new FormData();
  form.set("csv", new Blob([csv], { type: "text/csv" }), "missing-mapping.csv");

  const response = await fetch(`${server.baseUrl}/api/campaigns/upload`, {
    method: "POST",
    body: form,
  });

  assert.equal(response.status, 400);
  const body = await response.json();
  assert.equal(body.message, "Field mappings are required");
});

test("POST /api/campaigns/upload stages one-row CSV and GET /api/campaigns/:id returns mapped data", async () => {
  const csv = "Name,Email,State,Country\nRefactor Guard,guard@example.com,California,USA\n";
  const fieldMappings = {
    Name: "Name",
    Email: "Email",
    State: "State",
    Country: "Country",
  };

  const form = new FormData();
  form.set("fieldMappings", JSON.stringify(fieldMappings));
  form.set("csv", new Blob([csv], { type: "text/csv" }), "staging-check.csv");

  const uploadResponse = await fetch(`${server.baseUrl}/api/campaigns/upload`, {
    method: "POST",
    body: form,
  });

  assert.equal(uploadResponse.status, 200);
  const uploadBody = await uploadResponse.json();
  assert.ok(uploadBody.campaign?.id, "expected campaign id after upload");

  const campaignId = uploadBody.campaign.id;
  createdCampaignIds.push(campaignId);

  const fetchResponse = await fetch(`${server.baseUrl}/api/campaigns/${campaignId}`);
  assert.equal(fetchResponse.status, 200);

  const campaignBody = await fetchResponse.json();
  assert.equal(campaignBody.id, campaignId);
  assert.ok(Array.isArray(campaignBody.data.headers));
  assert.ok(campaignBody.data.headers.includes("Time Zone"));
  assert.equal(campaignBody.data.rows.length, 1);
  assert.equal(campaignBody.data.rows[0].Name, "Refactor Guard");
  assert.equal(campaignBody.data.rows[0].Email, "guard@example.com");
});
