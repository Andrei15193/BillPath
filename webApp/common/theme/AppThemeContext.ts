import { createContext } from "react";
import { AppThemeViewModel } from "./AppThemeViewModel";

export const AppThemeContext = createContext(new AppThemeViewModel());