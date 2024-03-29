import type { BasicDependency, SimpleDependency, ComplexDependency, DependencyToken } from "./IDependencyResolver";
import { useMemo } from "react";
import { useDependencyResolver } from "./useDependencyResolver";
import { useArrayCache } from "./useArrayCache";

export function useDependency<T>(token: DependencyToken<T>): T;
export function useDependency<T>(type: BasicDependency<T>): T;
export function useDependency<T>(type: SimpleDependency<T>): T;
export function useDependency<T, TAdditional extends readonly any[]>(type: ComplexDependency<T, TAdditional>, additionalDependencies: TAdditional): T;

export function useDependency<T, TAdditional extends readonly any[]>(typeOrToken: DependencyToken<T> | BasicDependency<T> | SimpleDependency<T> | ComplexDependency<T, TAdditional>, additionalDependencies: TAdditional = [] as any as TAdditional): T {
  const dependecyResolver = useDependencyResolver();
  const cachedAdditionalDependencies = useArrayCache(additionalDependencies);

  const instance =  useMemo(
    () => dependecyResolver.resolve<T, TAdditional>(typeOrToken as any, cachedAdditionalDependencies),
    [dependecyResolver, typeOrToken, cachedAdditionalDependencies]
  );

  return instance;
}