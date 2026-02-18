import assert from "node:assert/strict";
import { test } from "node:test";
import { AdvancedContactSearchService } from "../server/services/advancedContactSearchService.ts";

const service = new AdvancedContactSearchService();

test("analyzeQuery falls back to general search when no structured filters are found", () => {
  const analysis = service.analyzeQuery("quantum bicycles");

  assert.equal(analysis.intent, "general_search");
  assert.equal(analysis.searchTerms.length, 1);
  assert.equal(analysis.searchTerms[0], "quantum bicycles");
  assert.equal(Object.keys(analysis.filters).length, 0);
});

test("analyzeQuery extracts company and employee-range intent from natural language", () => {
  const analysis = service.analyzeQuery("find contacts at Acme with over 100 employees");

  assert.match(String(analysis.filters.company || ""), /acme/i);
  assert.match(String(analysis.filters.city || ""), /acme/i);
  assert.equal(analysis.intent, "location_search");
});

test("analyzeQuery uses high-quality lead shorthand to set minLeadScore", () => {
  const analysis = service.analyzeQuery("show me top quality leads in software");

  assert.equal(analysis.filters.minLeadScore, 7);
  assert.equal(analysis.intent, "lead_score_search");
});

test("buildSearchQuery includes expected conditions and limit parameter", () => {
  const analysis = {
    intent: "company_search",
    confidence: 90,
    searchTerms: [],
    filters: {
      company: "Acme",
      minEmployees: 100,
      hasEmail: true,
    },
  };

  const { query, params } = service.buildSearchQuery(analysis, 25);

  assert.match(query, /LOWER\(company\) LIKE \$1/);
  assert.match(query, /employees >= \$2/);
  assert.match(query, /email IS NOT NULL AND email != ''/);
  assert.equal(params[0], "%acme%");
  assert.equal(params[1], 100);
  assert.equal(params[params.length - 1], 25);
});
