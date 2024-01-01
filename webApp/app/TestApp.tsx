import type { IUserProfile } from "../data/userProfiles";
import { IntlProvider } from "react-intl";
import { useMemo, useRef } from "react";
import { DefaultLocale } from "../common/locale";
import { AppTheme } from "../common/theme";
import { DependencyContainer, DependencyResolverProvider, useDependencyResolver } from "../common/dependencies";
import { App } from "./App";

export interface ITestAppProps {
}

export function TestApp(props: ITestAppProps): JSX.Element {
  const baseDependencyResolver = useDependencyResolver();

  const { current: userProfiles } = useRef<IUserProfile[]>([]);
  const dependencyContainer = useMemo(
    () => new DependencyContainer(baseDependencyResolver, {
      localeResolver: {
        locale: {
          id: DefaultLocale,
          displayName: "Default Locale",
          resolveMessagesAsync() {
            return Promise.reject(new Error("Cannot load locale in test context."));
          }
        }
      },
      userPreferencesStore: {
        appTheme: AppTheme.light,
        language: DefaultLocale
      },
      userProfilesStore: {
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
    }),
    [baseDependencyResolver, userProfiles]
  );

  return (
    <DependencyResolverProvider dependencyResolver={dependencyContainer}>
      <IntlProvider locale={DefaultLocale} defaultLocale={DefaultLocale}>
        <App />
      </IntlProvider>
    </DependencyResolverProvider>
  );
}