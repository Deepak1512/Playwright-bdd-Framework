import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false,
    baseURL: "https://example.com",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
});
