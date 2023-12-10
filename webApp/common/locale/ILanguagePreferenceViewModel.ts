import type { INotifyPropertiesChanged } from "react-model-view-viewmodel";
import type { ILocale } from "./ILocale";

export interface ILanguagePreferenceViewModel extends INotifyPropertiesChanged {
  preferredLanguage: string | null;

  readonly supportedLocales: readonly ILocale[];
}