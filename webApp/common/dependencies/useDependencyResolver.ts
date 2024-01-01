import type { IDependencyResolver } from "./IDependencyResolver";
import { useContext } from "react";
import { DependencyResolverContext } from "./DependencyResolverContext";

export function useDependencyResolver(): IDependencyResolver {
  return useContext(DependencyResolverContext);
}