import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ru"] as const;
export const defaultLocale = "en" as const;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});
