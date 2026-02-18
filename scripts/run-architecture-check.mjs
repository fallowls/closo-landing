import fs from "node:fs";
import path from "node:path";
import madge from "madge";

const reportDir = path.resolve("reports");
fs.mkdirSync(reportDir, { recursive: true });

const inputRoots = ["server", "shared", "client/src"];
const result = await madge(inputRoots, {
  tsConfig: "./tsconfig.json",
  fileExtensions: ["ts", "tsx", "js", "jsx", "mjs", "cjs"],
  includeNpm: false,
  detectiveOptions: {
    ts: {
      skipTypeImports: true,
    },
  },
});

const dependencyGraph = result.obj();
const circular = result.circular();

const graphPath = path.join(reportDir, "madge-graph.json");
const circularPath = path.join(reportDir, "madge-circular.json");
const summaryPath = path.join(reportDir, "architecture-summary.md");

fs.writeFileSync(graphPath, JSON.stringify(dependencyGraph, null, 2));
fs.writeFileSync(circularPath, JSON.stringify(circular, null, 2));

const moduleCount = Object.keys(dependencyGraph).length;
const edgeCount = Object.values(dependencyGraph).reduce((sum, deps) => sum + deps.length, 0);

const markdown = [
  "# Architecture Dependency Summary",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Input roots: ${inputRoots.join(", ")}`,
  "",
  `Total modules analyzed: ${moduleCount}`,
  `Total dependency edges: ${edgeCount}`,
  `Circular dependency chains: ${circular.length}`,
  "",
  "## Circular Dependencies",
  "",
];

if (circular.length === 0) {
  markdown.push("None detected.");
} else {
  for (let i = 0; i < circular.length; i++) {
    markdown.push(`${i + 1}. ${circular[i].join(" -> ")}`);
  }
}

markdown.push("", "## Evidence Files", "", `- \`${graphPath}\``, `- \`${circularPath}\``);

fs.writeFileSync(summaryPath, markdown.join("\n"));

console.log(`Wrote ${graphPath}`);
console.log(`Wrote ${circularPath}`);
console.log(`Wrote ${summaryPath}`);
