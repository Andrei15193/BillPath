import type { IUserPreferencesStore } from "./IUserPreferencesStore";
import { AppTheme } from "../../common/theme";

export class LocalStorageUserPreferencesStorage implements IUserPreferencesStore {
  get appTheme(): AppTheme | null {
    switch (localStorage.getItem("preferences/theme")) {
      case "light-theme":
        return AppTheme.light;

      case "dark-theme":
        return AppTheme.dark;

      default:
        return null;
    }
  }

  set appTheme(value: AppTheme | null) {
    switch (value) {
      case AppTheme.light:
        localStorage.setItem("preferences/theme", "light-theme");
        break;

      case AppTheme.dark:
        localStorage.setItem("preferences/theme", "dark-theme");
        break;

      default:
        localStorage.removeItem("preferences/theme");
        break;
    }
  }

  get language(): string | null {
    return localStorage.getItem("preferences/language");
  }

  set language(value: string | null) {
    if (value === null || value === undefined)
      localStorage.removeItem("preferences/language");
    else
      localStorage.setItem("preferences/language", value);
  }
}