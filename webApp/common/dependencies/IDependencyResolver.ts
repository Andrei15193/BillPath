import type { IUserPreferencesStore } from "../../data/userPreferences";
import type { IUserProfilesStore } from "../../data/userProfiles";
import type { ILocaleResolver } from "../locale";

export interface Type<T, TConstructorArgs extends readonly any[] = readonly any[]> {
  new(...args: TConstructorArgs): T;
}

export interface IDependencyResolver {
  readonly localeResolver: ILocaleResolver;

  readonly userPreferencesStore: IUserPreferencesStore;
  readonly userProfilesStore: IUserProfilesStore;

  resolve<T>(type: Type<T>): T;
  resolve<T>(type: Type<T, [IDependencyResolver]>): T;
}