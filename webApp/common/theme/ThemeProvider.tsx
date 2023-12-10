import type { PropsWithChildren } from "react";
import { FluentProvider, makeResetStyles } from "@fluentui/react-components";
import { billPathLightTheme } from "./Theme";

export interface IThemeProviderProps {
}

const useThemeProviderClassName = makeResetStyles({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "stretch",
  height: "100vh",

  overflow: "auto"
});

export function ThemeProvider({ children }: PropsWithChildren<IThemeProviderProps>): JSX.Element {
  const themeProviderClassName = useThemeProviderClassName();

  return (
    <>
      <FluentProvider theme={billPathLightTheme} className={themeProviderClassName}>
        {children}
      </FluentProvider>
    </>
  );
}