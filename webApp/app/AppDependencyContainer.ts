import type { IDependencyContainer } from "../common/dependencies/IDependencyContainer";
import { useMemo } from "react";
import { type IDependencyResolver, DependencyContainer } from "../common/dependencies";
import { AppThemeViewModel } from "../common/theme";
import { LanguagePreferenceViewModel } from "../common/locale";
import { UserProfilesCollectionViewModel } from "./profile/UserProfilesCollectionViewModel";

export function useDependencyContainer(): IDependencyContainer & IDependencyResolver {
  return useMemo(
    () =>
      new DependencyContainer()
        .registerSingletonType(AppThemeViewModel)
        .registerSingletonType(LanguagePreferenceViewModel)
        .registerSingletonType(UserProfilesCollectionViewModel),
    []
  );
}

export interface IAppDependencyResolverMemoOptions {
  onInit?(dependencyContainer: IDependencyContainer): void;
}

export function useAppDependencyResolverMemo({ onInit }: IAppDependencyResolverMemoOptions): IDependencyResolver {
  return useMemo(
    () => {
      const dependecyContainer = new DependencyContainer()
        .registerSingletonType(AppThemeViewModel)
        .registerSingletonType(LanguagePreferenceViewModel)
        .registerSingletonType(UserProfilesCollectionViewModel);

      onInit && onInit(dependecyContainer);

      return dependecyContainer;
    },
    [onInit]
  );
}

export interface IAppDependencyContainerOptions {
  onInit?(dependencyContainer: IDependencyContainer): void;
}

export class AppDependencyContainer extends DependencyContainer {
  public constructor({ onInit }: IAppDependencyContainerOptions) {
    super();

    this
      .registerSingletonType(AppThemeViewModel)
      .registerSingletonType(LanguagePreferenceViewModel)
      .registerSingletonType(UserProfilesCollectionViewModel);

    onInit && onInit(this);
  }
}