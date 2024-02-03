import type { IUserPreferencesStore } from "../../data/userPreferences";
import type { IDependencyResolver } from "../dependencies";
import { ViewModel } from "react-model-view-viewmodel";
import { UserPreferencesStore } from "../../data/userPreferences/IUserPreferencesStore";
import { AppTheme } from "./AppTheme";

export class AppThemeViewModel extends ViewModel {
  private readonly _userPreferencesStore: IUserPreferencesStore;

  public constructor({ resolve }: IDependencyResolver) {
    super();

    this._userPreferencesStore = resolve(UserPreferencesStore);
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