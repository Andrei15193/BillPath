import type { Type } from "./IDependencyResolver";
import { useContext, useMemo } from "react";
import { DependencyResolverContext } from "./DependencyResolverContext";

export function useDependency<T>(type: Type<T>): T {
  const dependencyResolver = useContext(DependencyResolverContext);

  if (dependencyResolver === null || dependencyResolver === undefined)
    throw new Error("Dependency container is not configured.");

  const instance = useMemo(
    () => dependencyResolver.resolve(type),
    [type]
  );

  return instance;
}