import type { IDependencyResolver } from "./IDependencyResolver";
import type { IUserPreferencesStore } from "../../data/userPreferences";
import type { IUserProfilesStore } from "../../data/userProfiles";
import { createContext } from "react";
import { type ILocaleResolver, LanguagePreferenceViewModel } from "../locale";
import { AppThemeViewModel } from "../theme";
import { UserProfilesCollectionViewModel } from "../../app/profile/UserProfilesCollectionViewModel";
import { DependencyContainer } from "./DependencyContainer";

export const DependencyResolverContext = createContext<IDependencyResolver>(
  new DependencyContainer(
    {
      get localeResolver(): ILocaleResolver {
        throw new Error("'localeResolver' not configured");
      },

      get userPreferencesStore(): IUserPreferencesStore {
        throw new Error("'userPreferencesStore' not configured");
      },

      get userProfilesStore(): IUserProfilesStore {
        throw new Error("'userProfilesStore' not configured");
      }
    })
    .registerSingleton(AppThemeViewModel)
    .registerSingleton(LanguagePreferenceViewModel)
    .registerSingleton(UserProfilesCollectionViewModel)
);