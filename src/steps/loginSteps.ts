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
