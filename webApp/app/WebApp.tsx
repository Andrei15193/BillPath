import { LocaleProvider } from "../common/locale";
import { ThemeProvider } from "../common/theme";
import { App } from "./App";

export interface IWebAppProps {
}

export function WebApp(props: IWebAppProps): JSX.Element {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </LocaleProvider>
  );
}