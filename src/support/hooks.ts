import { Before, After, AfterAll, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, Browser, Page } from "@playwright/test";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import { sendTelegramNotification, sendTelegramPhoto } from "../../utils/telegramNotifier";

dotenv.config();

setDefaultTimeout(80000);

const resultFile = "./test-results.json";
const screenshotDir = "./screenshots";

let browser: Browser;
let page: Page;

//
// ============================
// ✅ BEFORE EACH SCENARIO
// ============================
//

Before(async function () {
  browser = await chromium.launch({
    headless: process.env.CI ? true : false
  });

  const context = await browser.newContext();
  page = await context.newPage();
  this.page = page;
});


//
// ============================
// ✅ AFTER EACH SCENARIO
// ============================
//

After(async function (scenario) {

  const status = scenario.result?.status?.toUpperCase() ?? "UNKNOWN";

  const safeScenarioName = scenario.pickle.name
    .replace(/[^a-zA-Z0-9]/g, "_");

  const executionTime = new Date().toLocaleString();

  //
  // ============================
  // ✅ STORE RESULT
  // ============================
  //

  let results: any[] = [];

  if (fs.existsSync(resultFile)) {
    results = JSON.parse(fs.readFileSync(resultFile, "utf-8"));
  }

  results.push({
    name: scenario.pickle.name,
    status: status
  });

  fs.writeFileSync(resultFile, JSON.stringify(results, null, 2));

  //
  // ============================
  // ✅ SEND SCENARIO NOTIFICATION
  // ============================
  //

  const scenarioMessage = `
🚀 *Automation Execution Update*

📌 Scenario: ${scenario.pickle.name}
📊 Status: ${status}
⏰ Time: ${executionTime}
`;

  await sendTelegramNotification(scenarioMessage);

  //
  // ============================
  // ✅ TAKE SCREENSHOT (PASSED & FAILED)
  // ============================
  //

  if (["PASSED", "FAILED"].includes(status)) {

    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const screenshotPath = path.join(
      screenshotDir,
      `${safeScenarioName}_${status}.png`
    );

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


//
// ==================================
// ✅ FINAL EXECUTION SUMMARY
// ==================================
//

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

  // ✅ Get Allure URL from CI env
  const allureLink =
    process.env.ALLURE_REPORT_URL ||
    "Allure report not available";

  const summaryMessage = `
📊 *Automation Execution Summary*

🧪 Total Scenarios: ${totalScenarios}
✅ Passed: ${passedScenarios}
❌ Failed: ${failedScenarios}
📈 Pass Rate: ${passPercentage}%

🔗 *Allure Report:*  
${allureLink}
`;

  await sendTelegramNotification(summaryMessage);

  // Clean up
  fs.unlinkSync(resultFile);
});