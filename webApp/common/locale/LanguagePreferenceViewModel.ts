import type { ILocale } from "./ILocale";
import type { ILanguagePreferenceViewModel } from "./ILanguagePreferenceViewModel";
import { ViewModel } from "react-model-view-viewmodel";
import { SupportedLocales } from "./SupportedLocales";

export class LanguagePreferenceViewModel extends ViewModel implements ILanguagePreferenceViewModel {
  private static readonly _preferredLanguageStorageKey: string = "preferrences/language";
  private _preferredLanguage: string | null;

  public constructor() {
    super();

    this._preferredLanguage = localStorage.getItem(LanguagePreferenceViewModel._preferredLanguageStorageKey);
    this.supportedLocales = Object
      .getOwnPropertyNames(SupportedLocales)
      .map(language => SupportedLocales[language])
      .filter(LanguagePreferenceViewModel._isLocale)
      .sort((left, right) => left.id.localeCompare(right.id, "en-US", { sensitivity: "base" }));
  }

  public get preferredLanguage(): string | null {
    return this._preferredLanguage;
  }

  public set preferredLanguage(value: string | null) {
    if (this._preferredLanguage !== value) {
      if (value === null)
        localStorage.removeItem(LanguagePreferenceViewModel._preferredLanguageStorageKey);
      else
        localStorage.setItem(LanguagePreferenceViewModel._preferredLanguageStorageKey, value);

      this._preferredLanguage = value;
      this.notifyPropertiesChanged("preferredLanguage");
    }
  }

  public supportedLocales: readonly ILocale[];

  private static _isLocale(localeOrAlias: string | ILocale): localeOrAlias is ILocale {
    return typeof localeOrAlias !== "string";
  }
}