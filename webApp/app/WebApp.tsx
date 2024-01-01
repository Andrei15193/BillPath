import { useEffect, useMemo, useRef } from "react";
import { DependencyResolverProvider, DependencyContainer, useDependencyResolver } from "../common/dependencies";
import { LocaleProvider } from "../common/locale";
import { ThemeProvider } from "../common/theme";
import { LocalStorageUserPreferencesStorage } from "../data/userPreferences/LocalStorageUserPreferencesStore";
import { LocaleResolver } from "../common/locale/LocaleResolver";
import { LocalStorageUserProfilesStore } from "../data/userProfiles/LocalStorageUserProfilesStore";
import { useOverlayLoader } from "../common/overlayLoader";
import { App } from "./App";
import { UserProfilesCollectionViewModel } from "./profile/UserProfilesCollectionViewModel";

export interface IWebAppProps {
}

export function WebApp(props: IWebAppProps): JSX.Element {
  const { current: localeResolver } = useRef(new LocaleResolver());

  const baseDependencyResolver = useDependencyResolver();

  const dependencyContainer = useMemo(
    () => new DependencyContainer(baseDependencyResolver, {
      localeResolver,
      userPreferencesStore: new LocalStorageUserPreferencesStorage(),
      userProfilesStore: new LocalStorageUserProfilesStore()
    }),
    [localeResolver, baseDependencyResolver]
  );

  const overlayLoader = useOverlayLoader();
  const { current: profilesCollectionViewModel } = useRef(dependencyContainer.resolve(UserProfilesCollectionViewModel));

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
    <DependencyResolverProvider dependencyResolver={dependencyContainer}>
      <ThemeProvider>
        <LocaleProvider onLocaleChanged={localeResolver.updateLocale}>
          <App />
        </LocaleProvider>
      </ThemeProvider>
    </DependencyResolverProvider>
  );
}