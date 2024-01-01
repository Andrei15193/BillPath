import type { ILocale } from "./ILocale";
import type { IUserPreferencesStore } from "../../data/userPreferences";
import type { IDependencyResolver } from "../dependencies";
import { ViewModel } from "react-model-view-viewmodel";
import { SupportedLocales } from "./SupportedLocales";

export class LanguagePreferenceViewModel extends ViewModel {
  private readonly _userPreferencesStore: IUserPreferencesStore;

  public constructor({ userPreferencesStore }: IDependencyResolver) {
    super();

    this._userPreferencesStore = userPreferencesStore;
    this.supportedLocales = Object
      .getOwnPropertyNames(SupportedLocales)
      .map(language => SupportedLocales[language])
      .filter(LanguagePreferenceViewModel._isLocale)
      .sort((left, right) => left.id.localeCompare(right.id, "en-US", { sensitivity: "base" }));
  }

  public get preferredLanguage(): string | null {
    return this._userPreferencesStore.language;
  }

  public set preferredLanguage(value: string | null) {
    if (this._userPreferencesStore.language !== value) {
      this._userPreferencesStore.language = value;
      this.notifyPropertiesChanged("preferredLanguage");
    }
  }

  public supportedLocales: readonly ILocale[];

  private static _isLocale(localeOrAlias: string | ILocale): localeOrAlias is ILocale {
    return typeof localeOrAlias !== "string";
  }
}