import { AppBanner } from "./AppBanner";
import { AppContent } from "./AppContent";
import { AppFooter } from "./AppFooter";

export interface IAppProps {
}

export function App(props: IAppProps): JSX.Element {
  return (
    <>
      <AppBanner />
      <AppContent />
      <AppFooter />
    </>
  )
}