import { Before, After, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, Browser, Page } from "@playwright/test";

setDefaultTimeout(60000);

let browser:Browser;
let page:Page;

Before(async function() {

     browser=await chromium.launch({headless:false});
     const context=await browser.newContext();
     page=await context.newPage();
     this.page=page;

});

After(async function() {

    await browser.close();
})


