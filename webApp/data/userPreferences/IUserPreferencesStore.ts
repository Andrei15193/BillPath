import type { AppTheme } from "../../common/theme";
import { DependencyToken } from "../../common/dependencies";

export const UserPreferencesStore = new DependencyToken<IUserPreferencesStore>("IUserPreferencesStore");

export interface IUserPreferencesStore {
  /** Also used in [index.html](../../index.html). */
  appTheme: AppTheme | null;
  language: string | null;
}