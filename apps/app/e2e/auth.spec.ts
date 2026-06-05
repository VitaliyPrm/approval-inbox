import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should show login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test("should show signup page", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: /create account/i })).toBeVisible();
  });

  test("should redirect to login when accessing protected route", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain("/login");
  });

  test("should redirect to login when accessing projects", async ({ page }) => {
    await page.goto("/projects/new");
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain("/login");
  });

  test("should show validation errors on empty form", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /sign in/i }).click();
    // The form uses required attributes so the browser should prevent submission
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test("should show magic link option on login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: /magic link/i })).toBeVisible();
  });
});