import type { ILocale } from "./ILocale";

/** Indexed locales and aliases by language ID in lowercase. */
export const SupportedLocales: Record<string, string | ILocale> = {
  "en":  "en-us",
  "en-us": {
    id: "en-US",
    displayName: "English (United States)",
    resolveMessagesAsync() {
      return import("../../locale/en-US.json");
    }
  },
  "ro": "ro-ro",
  "ro-ro": {
    id: "ro-RO",
    displayName: "Română",
    resolveMessagesAsync() {
      return import("../../locale/ro-RO.json");
    }
  }
};