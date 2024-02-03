import type { PropsWithChildren } from "react";
import type { IDependencyResolver } from "./IDependencyResolver";
import { DependencyResolverContext } from "./DependencyResolverContext";

export interface IDependencyResolverProviderProps {
  readonly dependencyResolver: IDependencyResolver;
}

export function DependencyResolverProvider({ dependencyResolver, children }: PropsWithChildren<IDependencyResolverProviderProps>): JSX.Element {
  return (
    <DependencyResolverContext.Provider value={dependencyResolver} children={children}/>
  );
}