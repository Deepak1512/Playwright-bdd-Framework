/*import { Given, Then }  from "@cucumber/cucumber";
import { LoginPage } from "../pages/loginPage";
import { expect, Expect } from "@playwright/test";


Given("user navigates to application URL", async function() {
    
    const loginPage=new LoginPage(this.page);
    await loginPage.navigateToLogin();
});


Then("login page should be displayed", async function(){
    const loginPage=new LoginPage(this.page);
    const isVisible=await loginPage.isLoginPageDisplayed();
    //expect(isVisible).toBeTruthy();
})

*/


import { Given, Then } from "@cucumber/cucumber";
import { LoginPage } from "../pages/loginPage";
import { expect } from "@playwright/test";

Given("user navigates to application URL", async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.navigateToLogin();
});

Then("login page should be displayed", async function () {
  await this.loginPage.verifyLoginPageDisplayed();
});

Then("the OrangeHRM logo should be visible", async function () {
  await this.loginPage.verifyLogoVisible();
});

Then("the {string} heading should be visible", async function (headingText: string) {
  await this.loginPage.verifyHeadingVisible(headingText);
});

Then("the Login button should be visible", async function () {
  await this.loginPage.verifyLoginButtonVisible();
});

Then("the {string} label should be visible", async function (label: string) {
  await this.loginPage.verifyLabelVisible(label);
});

Then("the version text {string} should be visible on the page", async function (versionText: string) {
  await this.loginPage.verifyVersionTextVisible(versionText);
});

Then("the {string} icon should be visible", async function (platform: string) {
  await this.loginPage.verifySocialIconVisible(platform);
});



Then("the heading text should be correctly spelled", async function () {
  const heading = await this.page.locator("h5").textContent();
  expect(heading?.trim()).toBe("Login");
});

Then("the username icon should be displayed next to the label", async function () {
  const icon = this.page.locator(".bi-person");
  await expect(icon).toBeVisible();
});




Then("the password icon should be displayed next to the label", async function () {
  const icon = this.page.locator(".bi-key");
  await expect(icon).toBeVisible();
});

Then("the button color should match the design specification", async function () {
  const button = this.page.locator("button[type='submit']");

  const color = await button.evaluate((el: HTMLElement) =>
    getComputedStyle(el).backgroundColor
  );

  expect(color).toBeTruthy();
});


Then("the grey information box should be visible", async function () {
  await expect(this.page.locator(".orangehrm-login-footer-sm")).toBeVisible();
});

Then("it should display {string}", async function (text: string) {
  await expect(this.page.getByText(text, { exact: false })).toBeVisible();
});
Then("the copyright text should be visible", async function () {
  await expect(
    this.page.getByText("© 2005 - 2026", { exact: false })
  ).toBeVisible();
});


Then("the LinkedIn icon should be visible", async function () {
  await expect(this.page.locator("a[href*='linkedin']")).toBeVisible();
});

Then("the Facebook icon should be visible", async function () {
  await expect(this.page.locator("a[href*='facebook']")).toBeVisible();
});

Then("the Twitter icon should be visible", async function () {
  await expect(this.page.locator("a[href*='twitter']")).toBeVisible();
});

Then("the YouTube icon should be visible", async function () {
  await expect(this.page.locator("a[href*='youtube']")).toBeVisible();
});

Then("the button text should be {string}", async function (text: string) {
  await expect(
    this.page.locator("button[type='submit']")
  ).toHaveText(text);
});