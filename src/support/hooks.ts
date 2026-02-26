import {
  Before,
  After,
  AfterAll,
  setDefaultTimeout
} from "@cucumber/cucumber";

import {
  chromium,
  Browser,
  Page,
  BrowserContext
} from "@playwright/test";

import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import {
  sendTelegramNotification,
  sendTelegramPhoto
} from "../../utils/telegramNotifier";

dotenv.config();
setDefaultTimeout(80000);

const resultFile = "./test-results.json";
const screenshotDir = "./screenshots";
const videoDir = "./videos";

let browser: Browser;
let context: BrowserContext;
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

  context = await browser.newContext({
    recordVideo: {
      dir: videoDir,
      size: { width: 1280, height: 720 }
    }
  });

  page = await context.newPage();
  this.page = page;
});

//
// ============================
// ✅ AFTER EACH SCENARIO
// ============================
//

After(async function (scenario) {

  const status =
    scenario.result?.status?.toUpperCase() ?? "UNKNOWN";

  const safeScenarioName = scenario.pickle.name
    .replace(/[^a-zA-Z0-9]/g, "_");

  const executionTime = new Date().toLocaleString();

  // ----------------------------
  // ✅ STORE RESULT
  // ----------------------------

  let results: any[] = [];

  if (fs.existsSync(resultFile)) {
    results = JSON.parse(
      fs.readFileSync(resultFile, "utf-8")
    );
  }

  results.push({
    name: scenario.pickle.name,
    status: status
  });

  fs.writeFileSync(
    resultFile,
    JSON.stringify(results, null, 2)
  );

  // ----------------------------
  // ✅ SEND SCENARIO MESSAGE
  // ----------------------------

  const scenarioMessage = `
🚀 *Automation Execution Update*

📌 Scenario: ${scenario.pickle.name}
📊 Status: ${status}
⏰ Time: ${executionTime}
`;

  await sendTelegramNotification(scenarioMessage);

  // ----------------------------
  // ✅ SCREENSHOT (PASSED & FAILED)
  // ----------------------------

  if (["PASSED", "FAILED"].includes(status)) {

    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const screenshotPath = path.join(
      screenshotDir,
      `${safeScenarioName}_${status}.png`
    );

    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    await sendTelegramPhoto(
      screenshotPath,
      `📸 Scenario: ${scenario.pickle.name}\nStatus: ${status}`
    );
  }

  // ----------------------------
  // ✅ CLOSE CONTEXT (finalizes video)
  // ----------------------------

  await context.close();

  // ----------------------------
  // ✅ RENAME VIDEO FILE
  // ----------------------------

  if (fs.existsSync(videoDir)) {

    const files = fs.readdirSync(videoDir);

    const latestVideo = files
      .filter(file => file.endsWith(".webm"))
      .sort((a, b) =>
        fs.statSync(path.join(videoDir, b)).mtimeMs -
        fs.statSync(path.join(videoDir, a)).mtimeMs
      )[0];

    if (latestVideo) {

      const oldPath = path.join(videoDir, latestVideo);

      const newPath = path.join(
        videoDir,
        `${safeScenarioName}_${status}.webm`
      );

      fs.renameSync(oldPath, newPath);
    }
  }

  await browser.close();
});

//
// ==================================
// ✅ FINAL EXECUTION SUMMARY
// ==================================
//

AfterAll(async function () {

  let results: any[] = [];

  if (fs.existsSync(resultFile)) {
    results = JSON.parse(
      fs.readFileSync(resultFile, "utf-8")
    );
  }

  const totalScenarios = results.length;
  const passedScenarios = results.filter(
    r => r.status === "PASSED"
  ).length;

  const failedScenarios = results.filter(
    r => r.status === "FAILED"
  ).length;

  const passPercentage =
    totalScenarios > 0
      ? (
          (passedScenarios / totalScenarios) *
          100
        ).toFixed(2)
      : "0";

  const allureLink =
    process.env.ALLURE_REPORT_URL ||
    "https://deepak1512.github.io/Playwright-bdd-Framework/";

  const videoFolderLink = `${allureLink}videos/`;

  const summaryMessage = `
📊 *Automation Execution Summary*

🧪 Total Scenarios: ${totalScenarios}
✅ Passed: ${passedScenarios}
❌ Failed: ${failedScenarios}
📈 Pass Rate: ${passPercentage}%

🎥 *Execution Videos:*  
${videoFolderLink}

🔗 *Allure Report:*  
${allureLink}
`;

  await sendTelegramNotification(summaryMessage);

  // Safe cleanup
  if (fs.existsSync(resultFile)) {
    fs.unlinkSync(resultFile);
  }
});