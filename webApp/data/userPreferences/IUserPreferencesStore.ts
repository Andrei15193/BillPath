import type { AppTheme } from "../../common/theme";

export interface IUserPreferencesStore {
  /** Also used in [index.html](../../index.html). */
  appTheme: AppTheme | null;
  language: string | null;
}