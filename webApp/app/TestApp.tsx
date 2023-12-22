import { IntlProvider } from "react-intl";
import { DefaultLocale } from "../common/locale";
import { DependencyContainerProvider } from "../common/dependencies";
import { AppTheme } from "../common/theme";
import { App } from "./App";
import { AppDependencyContainer } from "./AppDependencyContainer";

export interface ITestAppProps {
}

const dependencyContainer = new AppDependencyContainer({
  userPreferencesStore: {
    appTheme: AppTheme.light,
    language: DefaultLocale
  }
});

export function TestApp(props: ITestAppProps): JSX.Element {
  return (
    <DependencyContainerProvider dependencyContainer={dependencyContainer}>
      <IntlProvider locale={DefaultLocale} defaultLocale={DefaultLocale}>
        <App/>
      </IntlProvider>
    </DependencyContainerProvider>
  )
}