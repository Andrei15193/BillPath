import { FluentProvider, makeResetStyles } from "@fluentui/react-components";
import { billPathLightTheme } from "./Theme";
import { AppBanner } from "./AppBanner";
import { AppContent } from "./AppContent";
import { AppFooter } from "./AppFooter";

export interface IAppProps {
}

const useAppClassName = makeResetStyles({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "stretch"
});

export function App(props: IAppProps): JSX.Element {
  const appClassName = useAppClassName();

  return (
    <FluentProvider theme={billPathLightTheme} className={appClassName}>
      <AppBanner />
      <AppContent />
      <AppFooter />
    </FluentProvider>
  );
}