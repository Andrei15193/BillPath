import { DependencyContainer, DependencyContainerProvider, ICoreDependencies } from "../common/dependencies";
import { LanguagePreferenceViewModel, LocaleProvider } from "../common/locale";
import { AppThemeViewModel, ThemeProvider } from "../common/theme";
import { LocalStorageUserPreferencesStorage } from "../data/userPreferences/LocalStorageUserPreferencesStore";
import { App } from "./App";

export interface IWebAppProps {
}

const coreDependencies: ICoreDependencies = {
  userPreferencesStore: new LocalStorageUserPreferencesStorage()
};

const dependencyContainer = new DependencyContainer(coreDependencies)
  .registerSingleton(AppThemeViewModel)
  .registerSingleton(LanguagePreferenceViewModel);

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