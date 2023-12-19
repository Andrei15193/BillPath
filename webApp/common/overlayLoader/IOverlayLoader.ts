import type { AppTheme } from "../theme";

export interface IOverlayLoader {
  appTheme: AppTheme;

  showAsync(): Promise<void>;
  hideAsync(): Promise<void>;
}