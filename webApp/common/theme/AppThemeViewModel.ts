import type { IUserPreferencesStore } from "../../data/userPreferences/IUserPreferencesStore";
import type { ICoreDependencies } from "../dependencies";
import { ViewModel } from "react-model-view-viewmodel";
import { AppTheme } from "./AppTheme";

export class AppThemeViewModel extends ViewModel {
  private readonly _userPreferencesStore: IUserPreferencesStore;

  public constructor({ userPreferencesStore }: ICoreDependencies) {
    super();

    this._userPreferencesStore = userPreferencesStore;
  }

  public get preferredTheme(): AppTheme | null {
    return this._userPreferencesStore.appTheme;
  }

  public set preferredTheme(value: AppTheme | null) {
    if (this._userPreferencesStore.appTheme !== value) {
      this._userPreferencesStore.appTheme = value;
      this.notifyPropertiesChanged("preferredTheme");
    }
  }
}