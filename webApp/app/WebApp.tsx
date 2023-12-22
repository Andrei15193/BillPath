import { DependencyContainerProvider } from "../common/dependencies";
import { LocaleProvider } from "../common/locale";
import { ThemeProvider } from "../common/theme";
import { LocalStorageUserPreferencesStorage } from "../data/userPreferences/LocalStorageUserPreferencesStore";
import { App } from "./App";
import { AppDependencyContainer } from "./AppDependencyContainer";

export interface IWebAppProps {
}

const dependencyContainer = new AppDependencyContainer({
  userPreferencesStore: new LocalStorageUserPreferencesStorage()
});

export function WebApp(props: IWebAppProps): JSX.Element {
  return (
    <DependencyContainerProvider dependencyContainer={dependencyContainer}>
      <ThemeProvider>
        <LocaleProvider>
          <App />
        </LocaleProvider>
      </ThemeProvider>
    </DependencyContainerProvider>
  );
}