import type { IDependencyContainer, ConfigurableDependency, DependencyFactoryCallback } from "./IDependencyContainer";
import { type IDependencyResolver, type BasicDependency, type SimpleDependency, type ComplexDependency, DependencyToken } from "./IDependencyResolver";

type DependencyFactoryKey<T> = DependencyToken<T> | BasicDependency<T> | SimpleDependency<T>;

export class DependencyContainer implements IDependencyContainer, IDependencyResolver {
  private readonly _parent: DependencyContainer | null;
  private readonly _singletonDependencyFactories = new Map<DependencyFactoryKey<unknown>, IDependencyFactory<unknown>>();
  private readonly _scopedDependencyFactories = new Map<DependencyFactoryKey<unknown>, IDependencyFactory<unknown>>();

  public constructor(parent?: DependencyContainer) {
    this._parent = parent === undefined ? null : parent;

    this.resolve = this.resolve.bind(this);
  }

  public createScope(): IDependencyResolver {
    return new DependencyContainer(this);
  }

  public registerSingletonType<T>(type: ConfigurableDependency<T>): DependencyContainer;
  public registerSingletonType<T>(type: ConfigurableDependency<T>, factoryCallback: DependencyFactoryCallback<T>): DependencyContainer;

  public registerSingletonType<T>(type: BasicDependency<T> | SimpleDependency<T>, factoryCallback: DependencyFactoryCallback<T> = dependecyResolver => new type(dependecyResolver)): DependencyContainer {
    this._singletonDependencyFactories.set(type, new CachedDelayedDependencyFactory(this, factoryCallback));
    this._scopedDependencyFactories.delete(type);

    return this;
  }

  public registerInstanceToToken<T>(token: DependencyToken<T>, instance: T): DependencyContainer {
    this._singletonDependencyFactories.set(token, new InstanceDependencyFactory(instance));
    this._scopedDependencyFactories.delete(token);

    return this;
  }

  public registerSingletonTypeToToken<T>(token: DependencyToken<T>, type: ConfigurableDependency<T>): DependencyContainer {
    return this.registerSingletonFactoryToToken(token, dependencyResolver => new type(dependencyResolver));
  }

  public registerSingletonFactoryToToken<T>(token: DependencyToken<T>, factoryCallback: DependencyFactoryCallback<T>): DependencyContainer {
    this._singletonDependencyFactories.set(token, new CachedDelayedDependencyFactory(this, factoryCallback));
    this._scopedDependencyFactories.delete(token);

    return this;
  }

  public registerScopedType<T>(type: ConfigurableDependency<T>): DependencyContainer;
  public registerScopedType<T>(type: ConfigurableDependency<T>, factoryCallback: DependencyFactoryCallback<T>): DependencyContainer;

  public registerScopedType<T>(type: BasicDependency<T> | SimpleDependency<T>, factoryCallback: DependencyFactoryCallback<T> = dependecyResolver => new type(dependecyResolver)): DependencyContainer {
    this._singletonDependencyFactories.delete(type);
    this._scopedDependencyFactories.set(type, new CachedDelayedDependencyFactory(this, factoryCallback));

    return this;
  }

  public registerScopedTypeToToken<T>(token: DependencyToken<T>, type: ConfigurableDependency<T>): DependencyContainer {
    return this.registerScopedFactoryToToken(token, dependencyResolver => new type(dependencyResolver));
  }

  public registerScopedFactoryToToken<T>(token: DependencyToken<T>, factoryCallback: DependencyFactoryCallback<T>): DependencyContainer {
    this._singletonDependencyFactories.delete(token);
    this._scopedDependencyFactories.set(token, new CachedDelayedDependencyFactory(this, factoryCallback));

    return this;
  }

  public registerTransientType<T>(type: ConfigurableDependency<T>, factoryCallback: DependencyFactoryCallback<T>): DependencyContainer {
    this._singletonDependencyFactories.delete(type);
    this._scopedDependencyFactories.set(type, new DelayedDependencyFactory(this, factoryCallback));

    return this;
  }

  public registerTransientTypeToToken<T>(token: DependencyToken<T>, type: ConfigurableDependency<T>): DependencyContainer {
    return this.registerTransientFactoryToToken(token, dependencyResolver => new type(dependencyResolver));
  }

  public registerTransientFactoryToToken<T>(token: DependencyToken<T>, factoryCallback: DependencyFactoryCallback<T>): DependencyContainer {
    this._singletonDependencyFactories.delete(token);
    this._scopedDependencyFactories.set(token, new DelayedDependencyFactory(this, factoryCallback));

    return this;
  }

  public resolve<T>(token: DependencyToken<T>): T;
  public resolve<T>(type: BasicDependency<T>): T;
  public resolve<T>(type: SimpleDependency<T>): T;
  public resolve<T, TAdditional extends readonly any[]>(type: ComplexDependency<T, TAdditional>, additionalDependencies: TAdditional): T;

  public resolve<T, TAdditional extends readonly any[]>(typeOrToken: DependencyToken<T> | BasicDependency<T> | SimpleDependency<T> | ComplexDependency<T, TAdditional>, additionalDependencies: TAdditional = [] as any as TAdditional): T {
    let resolvedDependencyFactory: IDependencyFactory<unknown> | null = null;
    let scope: DependencyContainer | null = this;
    do {
      let dependencyFactory = scope._scopedDependencyFactories.get(typeOrToken as DependencyFactoryKey<T>);

      if (dependencyFactory !== null && dependencyFactory !== undefined)
        if (scope === this)
          resolvedDependencyFactory = dependencyFactory;
        else {
          resolvedDependencyFactory = dependencyFactory.withScope(this);
          this._scopedDependencyFactories.set(typeOrToken as DependencyFactoryKey<T>, resolvedDependencyFactory);
        }
      else {
        dependencyFactory = scope._singletonDependencyFactories.get(typeOrToken as DependencyFactoryKey<T>);

        if (dependencyFactory !== null && dependencyFactory !== undefined)
          resolvedDependencyFactory = dependencyFactory;
        else
          scope = scope._parent;
      }
    } while(scope !== null && resolvedDependencyFactory === null);

    if (resolvedDependencyFactory !== null) {
      return resolvedDependencyFactory.resolve() as T;
    }
    else if (typeOrToken instanceof DependencyToken) {
      const token = typeOrToken;
      throw new Error(`There is no configured dependency for token '${token.toString()}'.`);
    }
    else {
      const Type = typeOrToken;
      return new Type(this, ...additionalDependencies);
    }
  }
}

interface IDependencyFactory<T> {
  resolve(): T;

  withScope(dependencyResolver: IDependencyResolver): IDependencyFactory<T>;
}

class CachedDelayedDependencyFactory<T> implements IDependencyFactory<T> {
  private _initialized: boolean = false;
  private _instance: T | null = null;
  private readonly _dependencyResolver: IDependencyResolver;
  private readonly _factoryCallback: DependencyFactoryCallback<T>;

  public constructor(dependencyResolver: IDependencyResolver, factoryCallback: DependencyFactoryCallback<T>) {
    this._dependencyResolver = dependencyResolver;
    this._factoryCallback = factoryCallback;
  }

  public resolve(): T {
    if (!this._initialized) {
      this._instance = this._factoryCallback(this._dependencyResolver);
      this._initialized = true;
    }

    return this._instance!;
  }

  public withScope(dependencyResolver: IDependencyResolver): IDependencyFactory<T> {
    return new CachedDelayedDependencyFactory(dependencyResolver, this._factoryCallback);
  }
}

class DelayedDependencyFactory<T> implements IDependencyFactory<T> {
  private readonly _dependencyResolver: IDependencyResolver;
  private readonly _factoryCallback: DependencyFactoryCallback<T>;

  public constructor(dependencyResolver: IDependencyResolver, factoryCallback: DependencyFactoryCallback<T>) {
    this._dependencyResolver = dependencyResolver;
    this._factoryCallback = factoryCallback;
  }

  public resolve(): T {
    return this._factoryCallback(this._dependencyResolver);
  }

  public withScope(dependencyResolver: IDependencyResolver): IDependencyFactory<T> {
    return new DelayedDependencyFactory(dependencyResolver, this._factoryCallback);
  }
}

class InstanceDependencyFactory<T> implements IDependencyFactory<T> {
  private readonly _instance: T;

  public constructor(instance: T) {
    this._instance = instance;
  }

  public resolve(): T {
    return this._instance;
  }

  public withScope(dependencyResolver: IDependencyResolver): IDependencyFactory<T> {
    return this;
  }
}