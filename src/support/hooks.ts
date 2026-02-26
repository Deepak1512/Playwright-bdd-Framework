import { Before, After, AfterAll, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, Browser, Page } from "@playwright/test";
import dotenv from "dotenv";
import fs from "fs";

import { sendTelegramNotification, sendTelegramPhoto } from "../../utils/telegramNotifier";

dotenv.config();

setDefaultTimeout(80000);

const resultFile = "./test-results.json";

let browser: Browser;
let page: Page;

Before(async function () {
  browser = await chromium.launch({
  headless: process.env.CI ? true : false
});
  const context = await browser.newContext();
  page = await context.newPage();
  this.page = page;
});

After(async function (scenario) {

  const status = scenario.result?.status?.toUpperCase() ?? "UNKNOWN";

  const safeScenarioName = scenario.pickle.name
    .replace(/[^a-zA-Z0-9]/g, "_");

  const executionTime = new Date().toLocaleString();

  // =============================
  // ✅ SAVE RESULT TO SHARED FILE
  // =============================

  let results: any[] = [];

  if (fs.existsSync(resultFile)) {
    results = JSON.parse(fs.readFileSync(resultFile, "utf-8"));
  }

  results.push({
    name: scenario.pickle.name,
    status: status
  });

  fs.writeFileSync(resultFile, JSON.stringify(results, null, 2));

  // =============================
  // ✅ SEND SCENARIO MESSAGE
  // =============================

  const message = `
🚀 *Automation Execution Update*

📌 Scenario: ${scenario.pickle.name}
📊 Status: ${status}
⏰ Time: ${executionTime}
`;

  await sendTelegramNotification(message);

  // =============================
  // ✅ SCREENSHOT FOR PASSED & FAILED
  // =============================

  if (["PASSED", "FAILED"].includes(status)) {

    if (!fs.existsSync("./screenshots")) {
      fs.mkdirSync("./screenshots", { recursive: true });
    }

    const screenshotPath = `./screenshots/${safeScenarioName}_${status}.png`;

    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    await sendTelegramPhoto(
      screenshotPath,
      `📸 Scenario: ${scenario.pickle.name}\nStatus: ${status}`
    );
  }

  await browser.close();
});


// ==================================
// ✅ FINAL EXECUTION SUMMARY
// ==================================

AfterAll(async function () {

  if (!fs.existsSync(resultFile)) {
    console.log("No result file found.");
    return;
  }

  const results = JSON.parse(fs.readFileSync(resultFile, "utf-8"));

  const totalScenarios = results.length;
  const passedScenarios = results.filter((r: any) => r.status === "PASSED").length;
  const failedScenarios = results.filter((r: any) => r.status === "FAILED").length;

  const passPercentage = totalScenarios > 0
    ? ((passedScenarios / totalScenarios) * 100).toFixed(2)
    : "0";

  const summaryMessage = `
📊 *Automation Execution Summary*

🧪 Total Scenarios: ${totalScenarios}
✅ Passed: ${passedScenarios}
❌ Failed: ${failedScenarios}
📈 Pass Rate: ${passPercentage}%
`;

  await sendTelegramNotification(summaryMessage);

  // Clean result file after execution
  fs.unlinkSync(resultFile);
});