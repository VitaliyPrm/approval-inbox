import { test, expect } from "@playwright/test";

test.describe("Marketing site", () => {
  test("should show landing page with hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/client approvals without chaos/i)).toBeVisible();
  });

  test("should navigate to features page", async ({ page }) => {
    await page.goto("/features");
    await expect(page.getByRole("heading", { name: /everything you need/i })).toBeVisible();
  });

  test("should navigate to pricing page", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByRole("heading", { name: /pricing/i })).toBeVisible();
    await expect(page.getByText(/free/i)).toBeVisible();
    await expect(page.getByText(/\$9/)).toBeVisible();
    await expect(page.getByText(/\$39/)).toBeVisible();
  });

  test("should show FAQ section on pricing page", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByText(/frequently asked questions/i)).toBeVisible();
  });
});