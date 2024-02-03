import type { IDependencyResolver, BasicDependency, SimpleDependency, DependencyToken } from "./IDependencyResolver";

export type ConfigurableDependency<T> = BasicDependency<T> | SimpleDependency<T>;

export type DependencyFactoryCallback<T> = (dependecyResolver: IDependencyResolver) => T;

export interface IDependencyContainer {
  registerSingletonType<T>(type: ConfigurableDependency<T>): IDependencyContainer;
  registerSingletonType<T>(type: ConfigurableDependency<T>, factoryCallback: DependencyFactoryCallback<T>): IDependencyContainer;

  registerInstanceToToken<T>(token: DependencyToken<T>, instance: T): IDependencyContainer;
  registerSingletonTypeToToken<T>(token: DependencyToken<T>, type: ConfigurableDependency<T>): IDependencyContainer;
  registerSingletonFactoryToToken<T>(token: DependencyToken<T>, factoryCallback: DependencyFactoryCallback<T>): IDependencyContainer;

  registerScopedType<T>(type: ConfigurableDependency<T>): IDependencyContainer;
  registerScopedType<T>(type: ConfigurableDependency<T>, factoryCallback: DependencyFactoryCallback<T>): IDependencyContainer;

  registerScopedTypeToToken<T>(token: DependencyToken<T>, type: ConfigurableDependency<T>): IDependencyContainer;
  registerScopedFactoryToToken<T>(token: DependencyToken<T>, factoryCallback: DependencyFactoryCallback<T>): IDependencyContainer;

  registerTransientType<T>(type: ConfigurableDependency<T>, factoryCallback: DependencyFactoryCallback<T>): IDependencyContainer;

  registerTransientTypeToToken<T>(token: DependencyToken<T>, type: ConfigurableDependency<T>): IDependencyContainer;
  registerTransientFactoryToToken<T>(token: DependencyToken<T>, factoryCallback: DependencyFactoryCallback<T>): IDependencyContainer;
}