import { type PropsWithChildren, useState, useEffect, useCallback, useMemo } from "react";
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
  useViewModel(appThemeViewModel, ["preferredTheme"]);

  const browserThemeMediaQuery = useMemo(
    () => !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)"),
    []
  );

  const [theme, setTheme] = useState(getFluentUiTheme(overlayLoader.appTheme));

  const changeThemeAsyncCallback = useCallback(
    async (appTheme: AppTheme) => {
      if (overlayLoader.appTheme !== appTheme) {
        overlayLoader.appTheme = appTheme;
        await overlayLoader.showAsync();

        setTheme(getFluentUiTheme(appTheme));

        await overlayLoader.hideAsync();
      }
    },
    [overlayLoader, setTheme]
  );

  useEffect(
    () => {
      if (browserThemeMediaQuery !== null && appThemeViewModel.preferredTheme === null) {
        const browserThemePreferenceThemeChanged = (event: MediaQueryListEvent) => {
          changeThemeAsyncCallback(event.matches ? AppTheme.dark : AppTheme.light);
        }

        browserThemeMediaQuery.addEventListener("change", browserThemePreferenceThemeChanged);

        return () => {
          browserThemeMediaQuery.removeEventListener("change", browserThemePreferenceThemeChanged);
        };
      }
    },
    [appThemeViewModel.preferredTheme, browserThemeMediaQuery, changeThemeAsyncCallback]
  );

  useEffect(
    () => {
      changeThemeAsyncCallback(
        appThemeViewModel.preferredTheme === null
          ? (browserThemeMediaQuery !== null && browserThemeMediaQuery.matches)
            ? AppTheme.dark
            : AppTheme.light
          : appThemeViewModel.preferredTheme
      );
    },
    [appThemeViewModel.preferredTheme, browserThemeMediaQuery, changeThemeAsyncCallback]
  );

  return (
    <FluentProvider theme={theme} className={themeProviderClassName}>
      {children}
    </FluentProvider>
  );
}

function getFluentUiTheme(appTheme: AppTheme): Partial<Theme> {
  switch (appTheme) {
    case AppTheme.light:
      return billPathLightTheme;

    case AppTheme.dark:
      return billPathDarkTheme;
  }
}