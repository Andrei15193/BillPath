import type { ILocale } from "./ILocale";
import type { ILocaleResolver } from "./ILocaleResolver";

export class LocaleResolver implements ILocaleResolver {
  private _locale: ILocale = null!;

  public get locale(): ILocale {
    return this._locale;
  }

  public readonly updateLocale = (newLocale: ILocale): void => {
    this._locale = newLocale;
  };
}