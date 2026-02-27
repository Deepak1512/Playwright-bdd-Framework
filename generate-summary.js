const fs = require("fs");
const path = require("path");

const RESULTS_DIR = path.join(__dirname, "allure-results");

let total = 0;
let passed = 0;
let failed = 0;
const failedTests = [];

fs.readdirSync(RESULTS_DIR).forEach((file) => {
  if (file.endsWith("-result.json")) {
    const data = JSON.parse(
      fs.readFileSync(path.join(RESULTS_DIR, file))
    );

    total++;

    if (data.status === "passed") passed++;
    if (data.status === "failed") {
      failed++;
      failedTests.push({
        name: data.name,
        reason: data.statusDetails?.message || "No details",
      });
    }
  }
});

const summary = {
  total,
  passed,
  failed,
  duration: 0,
  failedTests,
};

fs.writeFileSync("summary.json", JSON.stringify(summary, null, 2));

console.log("Summary generated successfully.");
