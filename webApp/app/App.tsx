import { LocaleProvider } from "../common/locale";
import { ThemeProvider } from "../common/theme";
import { AppBanner } from "./AppBanner";
import { AppContent } from "./AppContent";
import { AppFooter } from "./AppFooter";

export interface IAppProps {
}

export function App(props: IAppProps): JSX.Element {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <AppBanner />
        <AppContent />
        <AppFooter />
      </ThemeProvider>
    </LocaleProvider>
  );
}