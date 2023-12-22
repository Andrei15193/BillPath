import type { IUserPreferencesStore } from "../../data/userPreferences";

export interface Type<T, TConstructorArgs extends readonly any[] = readonly any[]> {
  new(...args: TConstructorArgs): T;
}

export interface IDependencyContainer {
  resolve<T>(type: Type<T>): T;
  resolve<T>(type: Type<T, [IDependencyContainer, ICoreDependencies]>): T;
}

export interface ICoreDependencies {
  readonly userPreferencesStore: IUserPreferencesStore;
}