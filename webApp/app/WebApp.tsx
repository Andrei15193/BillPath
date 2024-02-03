import { useEffect, useRef } from "react";
import { type IDependencyContainer, type IDependencyResolver, DependencyResolverProvider } from "../common/dependencies";
import { LocaleProvider } from "../common/locale";
import { ThemeProvider } from "../common/theme";
import { LocalStorageUserPreferencesStorage } from "../data/userPreferences/LocalStorageUserPreferencesStore";
import { LocaleResolver } from "../common/locale/LocaleResolver";
import { LocalStorageUserProfilesStore } from "../data/userProfiles/LocalStorageUserProfilesStore";
import { useOverlayLoader } from "../common/overlayLoader";
import { UserPreferencesStore } from "../data/userPreferences/IUserPreferencesStore";
import { UserProfilesStore } from "../data/userProfiles/IUserProfilesStore";
import { App } from "./App";
import { UserProfilesCollectionViewModel } from "./profile/UserProfilesCollectionViewModel";
import { AppDependencyContainer } from "./AppDependencyContainer";

export interface IWebAppProps {
}

export function WebApp(props: IWebAppProps): JSX.Element {
  const { current: dependencyResolver} = useRef<IDependencyResolver>(new AppDependencyContainer({ onInit: configureWebAppDependencies }));

  const overlayLoader = useOverlayLoader();
  const { current: localeResolver } = useRef(dependencyResolver.resolve(LocaleResolver));
  const { current: profilesCollectionViewModel } = useRef(dependencyResolver.resolve(UserProfilesCollectionViewModel));

  useEffect(
    () => {
      overlayLoader
        .showAsync()
        .then(() => profilesCollectionViewModel.loadAsync())
        .then(() => overlayLoader.hideAsync());
    },
    [profilesCollectionViewModel]
  );
  return (
    <DependencyResolverProvider dependencyResolver={dependencyResolver}>
      <ThemeProvider>
        <LocaleProvider onLocaleChanged={localeResolver.updateLocale}>
          <App />
        </LocaleProvider>
      </ThemeProvider>
    </DependencyResolverProvider>
  );
}

function configureWebAppDependencies(dependencyContainer: IDependencyContainer): void {
  dependencyContainer
    .registerSingletonTypeToToken(UserPreferencesStore, LocalStorageUserPreferencesStorage)
    .registerSingletonTypeToToken(UserProfilesStore, LocalStorageUserProfilesStore);
}