import type { IAppThemeViewModel } from "./IAppThemeViewModel";
import { ViewModel } from "react-model-view-viewmodel";
import { AppTheme, mapAppTheme } from "./AppTheme";

export class AppThemeViewModel extends ViewModel implements IAppThemeViewModel {
  private static readonly _preferredThemeStorageKey: string = "preferrences/theme";
  private _appTheme: AppTheme;

  public constructor() {
    super();

    this._appTheme = mapAppTheme(localStorage.getItem(AppThemeViewModel._preferredThemeStorageKey));
  }

  public get appTheme(): AppTheme {
    return this._appTheme;
  }

  public set appTheme(value: AppTheme | null) {
    if (this._appTheme !== value) {
      if (value === null)
        localStorage.removeItem(AppThemeViewModel._preferredThemeStorageKey);
      else
        localStorage.setItem(AppThemeViewModel._preferredThemeStorageKey, value);

      this._appTheme = mapAppTheme(value);
      this.notifyPropertiesChanged("appTheme");
    }
  }
}