import { IntlProvider } from "react-intl";
import { DefaultLocale } from "../common/locale";
import { App } from "./App";

export interface ITestAppProps {
}

export function TestApp(props: ITestAppProps): JSX.Element {
  return (
    <IntlProvider locale={DefaultLocale} defaultLocale={DefaultLocale}>
      <App/>
    </IntlProvider>
  )
}