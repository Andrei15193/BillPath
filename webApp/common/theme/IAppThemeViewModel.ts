import type { INotifyPropertiesChanged } from "react-model-view-viewmodel";
import type { AppTheme } from "./AppTheme";

export interface IAppThemeViewModel extends INotifyPropertiesChanged {
  preferredTheme: AppTheme | null;
}