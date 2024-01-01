import type { IDependencyResolver, Type } from "./IDependencyResolver";
import type { ILocaleResolver } from "../locale";
import type { IUserPreferencesStore } from "../../data/userPreferences";
import type { IUserProfilesStore } from "../../data/userProfiles";

export interface IDependencyContainerConfig {
  readonly localeResolver: ILocaleResolver;

  readonly userPreferencesStore: IUserPreferencesStore;
  readonly userProfilesStore: IUserProfilesStore;
}

export type DependencyFactoryCallback<T> = (dependencyResolver: IDependencyResolver) => T;

export class DependencyContainer implements IDependencyResolver {
  private readonly _config: IDependencyContainerConfig;
  private readonly _typeRegistrations: Map<Type<any>, DependencyFactoryCallback<any>>;
  private readonly _singletonInstances: Map<Type<any>, any>;

  public constructor(config: IDependencyContainerConfig);
  public constructor(sourceDependencyResolver: IDependencyResolver);
  public constructor(sourceDependencyResolver: IDependencyResolver, config: Partial<IDependencyContainerConfig>);

  public constructor(configOrSourceDependencyResolver: IDependencyContainerConfig | IDependencyResolver, config?: Partial<IDependencyContainerConfig>) {
    if (config === undefined || config === null)
      this._config = configOrSourceDependencyResolver;
    else {
      this._config = Object.create(
        Object.getPrototypeOf(configOrSourceDependencyResolver),
        Object.assign({}, Object.getOwnPropertyDescriptors(configOrSourceDependencyResolver), Object.getOwnPropertyDescriptors(config))
      );
    }

    if (configOrSourceDependencyResolver instanceof DependencyContainer) {
      const sourceDependencyContainer = configOrSourceDependencyResolver;

      this._typeRegistrations = new Map<Type<any>, DependencyFactoryCallback<any>>(sourceDependencyContainer._typeRegistrations);
      this._singletonInstances = new Map<Type<any>, DependencyFactoryCallback<any>>(sourceDependencyContainer._singletonInstances);

      this.resolve = this.resolve.bind(this);
    }
    else {
      this._typeRegistrations = new Map<Type<any>, DependencyFactoryCallback<any>>();
      this._singletonInstances = new Map<Type<any>, DependencyFactoryCallback<any>>();

      this.resolve = this.resolve.bind(this);
    }
  }

  public get localeResolver(): ILocaleResolver {
    return this._config.localeResolver;
  }

  public get userPreferencesStore(): IUserPreferencesStore {
    return this._config.userPreferencesStore;
  }

  public get userProfilesStore(): IUserProfilesStore {
    return this._config.userProfilesStore;
  }

  public resolve<T>(type: Type<T>): T;
  public resolve<T>(type: Type<T, [IDependencyResolver]>): T;

  public resolve<T>(type: Type<T> | Type<T, [IDependencyResolver]>): T {
    if (this._singletonInstances.has(type)) {
      return this._singletonInstances.get(type);
    }
    else if (this._typeRegistrations.has(type)) {
      const factoryCallback: DependencyFactoryCallback<T> = this._typeRegistrations.get(type)!;
      const instance = factoryCallback(this);

      return instance;
    }
    else {
      const Type = type;
      const instance = new Type(this);

      return instance;
    }
  }

  public register<T>(type: Type<T>, factoryCallback: DependencyFactoryCallback<T>): DependencyContainer {
    this._typeRegistrations.set(type, factoryCallback);

    return this;
  }

  public registerSingleton<T>(type: Type<T>): DependencyContainer;
  public registerSingleton<T>(type: Type<T>, factoryCallback: DependencyFactoryCallback<T>): DependencyContainer;
  public registerSingleton<T>(type: Type<T>, instance: T): DependencyContainer;

  public registerSingleton<T>(type: Type<T>, factoryCallbackOrInstance?: T | DependencyFactoryCallback<T>): DependencyContainer {
    this._typeRegistrations.set(type, dependencyResolver => {
      if (this._singletonInstances.has(type)) {
        return this._singletonInstances.get(type);
      }
      else if (factoryCallbackOrInstance === undefined) {
        const Type = type;
        const instance = new Type(dependencyResolver);
        this._singletonInstances.set(type, instance);

        return instance;
      }
      else if (DependencyContainer._isFunction(factoryCallbackOrInstance)) {
        const instance = factoryCallbackOrInstance(dependencyResolver);
        this._singletonInstances.set(type, instance);

        return instance;
      }
      else {
        this._singletonInstances.set(type, factoryCallbackOrInstance);

        return factoryCallbackOrInstance;
      }
    });

    return this;
  }

  private static _isFunction(maybeFunction: any): maybeFunction is Function {
    return typeof maybeFunction === "function";
  }
}