import type { IUserProfile } from "../data/userProfiles";
import { useRef } from "react";
import { IntlProvider } from "react-intl";
import { type IDependencyContainer, type IDependencyResolver, DependencyResolverProvider } from "../common/dependencies";
import { DefaultLocale } from "../common/locale";
import { AppTheme } from "../common/theme";
import { UserPreferencesStore } from "../data/userPreferences/IUserPreferencesStore";
import { UserProfilesStore } from "../data/userProfiles/IUserProfilesStore";
import { App } from "./App";
import { AppDependencyContainer } from "./AppDependencyContainer";

export interface ITestAppProps {
}

export function TestApp(props: ITestAppProps): JSX.Element {
  const { current: dependencyResolver} = useRef<IDependencyResolver>(new AppDependencyContainer({ onInit: configureTestAppDependencies }));

  return (
    <DependencyResolverProvider dependencyResolver={dependencyResolver}>
      <IntlProvider locale={DefaultLocale} defaultLocale={DefaultLocale}>
        <App />
      </IntlProvider>
    </DependencyResolverProvider>
  );
}

function configureTestAppDependencies(dependencyContainer: IDependencyContainer): void {
  const userProfiles: IUserProfile[] = [];

  dependencyContainer
    .registerInstanceToToken(
      UserPreferencesStore,
      {
        appTheme: AppTheme.light,
        language: DefaultLocale
      }
    )
    .registerInstanceToToken(
      UserProfilesStore,
      {
        getAllAsync() {
          return Promise.resolve(userProfiles);
        },

        addAsync(userProfile) {
          const profile: IUserProfile = {
            id: new Date().toUTCString(),
            ...userProfile
          };
          userProfiles.push(profile);

          return Promise.resolve(profile);
        },

        updateAsync(userProfile) {
          const profileIndex = userProfiles.findIndex(profile => profile.id === userProfile.id);
          if (profileIndex >= 0)
            userProfiles.splice(profileIndex, 1, userProfile);

          return Promise.resolve();
        },

        removeAsync(id) {
          const profileIndex = userProfiles.findIndex(profile => profile.id === id);
          if (profileIndex >= 0)
            userProfiles.splice(profileIndex, 1);

          return Promise.resolve();
        }
      }
    );
}