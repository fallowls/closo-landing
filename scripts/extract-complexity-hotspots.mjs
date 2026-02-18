import fs from "node:fs";
import path from "node:path";

const reportDir = path.resolve("reports");
const inputPath = path.join(reportDir, "eslint-complexity.json");
const outputJsonPath = path.join(reportDir, "complexity-hotspots.json");
const outputMdPath = path.join(reportDir, "complexity-hotspots.md");

if (!fs.existsSync(inputPath)) {
  throw new Error(`Missing ESLint report: ${inputPath}`);
}

const eslintResults = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const hotspots = [];

for (const fileResult of eslintResults) {
  const relativePath = path.relative(process.cwd(), fileResult.filePath).replace(/\\/g, "/");

  for (const message of fileResult.messages || []) {
    if (message.ruleId !== "complexity") {
      continue;
    }

    const match = /Function '([^']+)' has a complexity of (\d+)\. Maximum allowed is (\d+)\./.exec(
      message.message || "",
    );

    hotspots.push({
      file: relativePath,
      function: match?.[1] || "(anonymous)",
      complexity: match ? Number(match[2]) : null,
      maxAllowed: match ? Number(match[3]) : null,
      line: message.line || null,
      column: message.column || null,
      message: message.message,
    });
  }
}

hotspots.sort((a, b) => (b.complexity || 0) - (a.complexity || 0));

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(outputJsonPath, JSON.stringify(hotspots, null, 2));

const top = hotspots.slice(0, 20);
const markdown = [
  "# Complexity Hotspots",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Total complexity findings: ${hotspots.length}`,
  "",
  "| Rank | File | Function | Complexity | Max | Line |",
  "| --- | --- | --- | ---: | ---: | ---: |",
  ...top.map((item, index) => {
    return `| ${index + 1} | ${item.file} | ${item.function} | ${item.complexity ?? "n/a"} | ${item.maxAllowed ?? "n/a"} | ${item.line ?? "n/a"} |`;
  }),
  "",
];

fs.writeFileSync(outputMdPath, markdown.join("\n"));

console.log(`Wrote ${outputJsonPath}`);
console.log(`Wrote ${outputMdPath}`);
