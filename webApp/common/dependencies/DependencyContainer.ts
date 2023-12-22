import type { ICoreDependencies, IDependencyContainer, Type } from "./IDependencyContainer";

export type DependencyFactoryCallback<T> = (coreDependencies: ICoreDependencies, dependencyContainer: IDependencyContainer) => T;

export class DependencyContainer implements IDependencyContainer {
  private readonly _coreDependencies: ICoreDependencies;
  private readonly _typeRegistrations: Map<Type<any>, DependencyFactoryCallback<any>> = new Map<Type<any>, DependencyFactoryCallback<any>>();
  private readonly _singletonInstances: Map<Type<any>, any> = new Map<Type<any>, any>();

  public constructor(coreDependencies: ICoreDependencies) {
    this._coreDependencies = coreDependencies;
  }

  public resolve<T>(type: Type<T>): T;
  public resolve<T>(type: Type<T, [ICoreDependencies, IDependencyContainer]>): T;

  public resolve<T>(type: Type<T> | Type<T, [ICoreDependencies, IDependencyContainer]>): T {
    if (this._singletonInstances.has(type)) {
      return this._singletonInstances.get(type);
    }
    else if (this._typeRegistrations.has(type)) {
      const factoryCallback: DependencyFactoryCallback<T> = this._typeRegistrations.get(type)!;
      const instance = factoryCallback(this._coreDependencies, this);

      return instance;
    }
    else {
      const Type = type;
      const instance = new Type(this._coreDependencies, this);

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
    this._typeRegistrations.set(type, (depedencyContainer, coreDependencies) => {
      if (this._singletonInstances.has(type)) {
        return this._singletonInstances.get(type);
      }
      else if (factoryCallbackOrInstance === undefined) {
        const Type = type;
        const instance = new Type(depedencyContainer, coreDependencies);
        this._singletonInstances.set(type, instance);

        return instance;
      }
      else if (isFunction(factoryCallbackOrInstance)) {
        const instance = factoryCallbackOrInstance(depedencyContainer, coreDependencies);
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
}

function isFunction(maybeFunction: any): maybeFunction is Function {
  return typeof maybeFunction === "function";
}