import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  private page: Page;

  private loginHeading: Locator;
  private logo: Locator;
  private loginButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loginHeading = page.getByRole("heading", { name: "Login" });
    this.logo = page.locator("img[alt='company-branding']");
    this.loginButton = page.getByRole("button", { name: "Login" });
  }

  async navigateToLogin() {
    await this.page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );
  }

  async verifyLoginPageDisplayed() {
    await expect(this.loginHeading).toBeVisible();
  }

  async verifyLogoVisible() {
    await expect(this.logo).toBeVisible();
  }

  async verifyHeadingVisible(expectedHeading: string) {
    await expect(this.loginHeading).toHaveText(expectedHeading);
  }

  async verifyLoginButtonVisible() {
    await expect(this.loginButton).toBeVisible();
  }

  async verifyLabelVisible(label: string) {
    await expect(this.page.getByText(label)).toBeVisible();
  }

  async verifyVersionTextVisible(versionText: string) {
    await expect(this.page.getByText(versionText)).toBeVisible();
  }

  async verifySocialIconVisible(platform: string) {
    await expect(
      this.page.locator(`a[href*='${platform.toLowerCase()}']`)
    ).toBeVisible();
  }
}
