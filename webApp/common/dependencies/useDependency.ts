import type { Type } from "./IDependencyContainer";
import { useContext, useMemo } from "react";
import { DependencyContainerContext } from "./DependencyContainerContext";

export function useDependency<T>(type: Type<T>): T {
  const dependencyContainer = useContext(DependencyContainerContext);

  if (dependencyContainer === null || dependencyContainer === undefined)
    throw new Error("Dependency container is not configured.");

  const instance = useMemo(
    () => dependencyContainer.resolve(type),
    [type]
  );

  return instance;
}