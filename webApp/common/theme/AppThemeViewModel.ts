import type { IAppThemeViewModel } from "./IAppThemeViewModel";
import { ViewModel } from "react-model-view-viewmodel";
import { AppTheme } from "./AppTheme";

export class AppThemeViewModel extends ViewModel implements IAppThemeViewModel {
  /** Also used in [index.html](../../index.html) */
  private static readonly _preferredThemeStorageKey: string = "preferrences/theme";
  private _appTheme: AppTheme | null;

  public constructor() {
    super();

    switch (localStorage.getItem(AppThemeViewModel._preferredThemeStorageKey)) {
      case AppTheme.light:
        this._appTheme = AppTheme.light;
        break;

      case AppTheme.dark:
        this._appTheme = AppTheme.dark;
        break;

      default:
        this._appTheme = null;
        break;
    }
  }

  public get preferredTheme(): AppTheme | null {
    return this._appTheme;
  }

  public set preferredTheme(value: AppTheme | null) {
    if (this._appTheme !== value) {
      if (value === null)
        localStorage.removeItem(AppThemeViewModel._preferredThemeStorageKey);
      else
        localStorage.setItem(AppThemeViewModel._preferredThemeStorageKey, value);

      this._appTheme = value;
      this.notifyPropertiesChanged("preferredTheme");
    }
  }
}