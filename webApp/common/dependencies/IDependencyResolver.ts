export interface IDependencyResolver {
  createScope(): IDependencyResolver;

  resolve<T>(token: DependencyToken<T>): T;
  resolve<T>(type: BasicDependency<T>): T;
  resolve<T>(type: SimpleDependency<T>): T;
  resolve<T, TAdditional extends readonly any[]>(type: ComplexDependency<T, TAdditional>, additionalDependencies: TAdditional): T;
}

export type BasicDependency<T> = {
  new(): T;
};

export type SimpleDependency<T> = {
  new(dependencyResolver: IDependencyResolver): T;
};

export type ComplexDependency<T, TAdditional extends readonly any[]> = {
  new(dependencyResolver: IDependencyResolver, ...additionalDependencies: TAdditional): T;
};

export class DependencyToken<T> {
  public constructor(description: string) {
    this.description = description;
  }

  public readonly description: string;

  public toString(): string {
    return this.description;
  }
}