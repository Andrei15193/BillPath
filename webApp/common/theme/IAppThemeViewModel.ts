import type { INotifyPropertiesChanged } from "react-model-view-viewmodel";
import type { AppTheme } from "./AppTheme";

export interface IAppThemeViewModel extends INotifyPropertiesChanged {
  get appTheme(): AppTheme;

  /** Setting to `null` resets to default theme (may change over time). */
  set appTheme(value: AppTheme | null);
}