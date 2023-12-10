import type { ILocale } from "./ILocale";
import { SupportedLocales } from "./SupportedLocales";

export function resolveLocale(preferredLanguages: readonly string[], defaultLanguage: string): ILocale {
  const selectedLanguage = preferredLanguages.find(language => language.toLowerCase() in SupportedLocales) || defaultLanguage

  let selectedLocale = SupportedLocales[selectedLanguage.toLowerCase()];
  while (typeof selectedLocale === "string")
    selectedLocale = SupportedLocales[selectedLocale];

  return selectedLocale;
}