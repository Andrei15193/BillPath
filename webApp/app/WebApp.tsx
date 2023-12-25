import type { IInitializable } from "../data/IInitializable";
import { useEffect } from "react";
import { DependencyContainerProvider } from "../common/dependencies";
import { LocaleProvider } from "../common/locale";
import { useOverlayLoader } from "../common/overlayLoader";
import { ThemeProvider } from "../common/theme";
import { LocalStorageUserPreferencesStorage } from "../data/userPreferences/LocalStorageUserPreferencesStore";
import { App } from "./App";
import { AppDependencyContainer } from "./AppDependencyContainer";

const userPreferencesStore = new LocalStorageUserPreferencesStorage();

const initializables: readonly IInitializable[] = [
  userPreferencesStore
];

const dependencyContainer = new AppDependencyContainer({
  userPreferencesStore
});

export interface IWebAppProps {
}

export function WebApp(props: IWebAppProps): JSX.Element {
  const overlayLoader = useOverlayLoader();

  useEffect(
    () => {
      overlayLoader
        .showAsync()
        .then(() => Promise.all(initializables.map(initializable => initializable.initializeAsync())))
        .then(() => overlayLoader.hideAsync());
    },
    []
  );

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