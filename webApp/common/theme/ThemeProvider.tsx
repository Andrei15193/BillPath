import { type PropsWithChildren, useState, useEffect } from "react";
import { type Theme, FluentProvider, makeResetStyles } from "@fluentui/react-components";
import { useViewModel } from "react-model-view-viewmodel";
import { useOverlayLoader } from "../overlayLoader";
import { billPathLightTheme, billPathDarkTheme } from "./Theme";
import { useAppThemeViewModel } from "./useAppThemeViewModel";
import { AppTheme } from "./AppTheme";

const useThemeProviderClassName = makeResetStyles({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "stretch",
  height: "100vh",

  overflow: "auto"
});

export interface IThemeProviderProps {
}

export function ThemeProvider({ children }: PropsWithChildren<IThemeProviderProps>): JSX.Element {
  const themeProviderClassName = useThemeProviderClassName();
  const overlayLoader = useOverlayLoader();

  const appThemeViewModel = useAppThemeViewModel();
  useViewModel(appThemeViewModel, ["appTheme"]);

  const [theme, setTheme] = useState(getFluentUiTheme(appThemeViewModel.appTheme));

  useEffect(
    () => {
      overlayLoader.appTheme = appThemeViewModel.appTheme;
      overlayLoader
        .showAsync()
        .then(() => {
          setTheme(getFluentUiTheme(appThemeViewModel.appTheme));
          return overlayLoader.hideAsync();
        });
    },
    [appThemeViewModel.appTheme]
  );

  return (
    <FluentProvider theme={theme} className={themeProviderClassName}>
      {children}
    </FluentProvider>
  );
}

function getFluentUiTheme(appTheme: AppTheme | null): Partial<Theme> {
  switch (appTheme) {
    case AppTheme.dark:
      return billPathDarkTheme;

    case AppTheme.light:
    default:
      return billPathLightTheme;
  }
}