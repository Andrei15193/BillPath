import { useContext } from "react";
import { AppThemeViewModel } from "./AppThemeViewModel";
import { AppThemeContext } from "./AppThemeContext";

export function useAppThemeViewModel(): AppThemeViewModel {
  return useContext(AppThemeContext);
}