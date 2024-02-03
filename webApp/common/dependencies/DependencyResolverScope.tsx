import { type PropsWithChildren, type DependencyList, useMemo } from "react";
import { useDependencyResolver } from "./useDependencyResolver";
import { DependencyResolverProvider } from "./DependencyResolverProvider";

export interface IDependencyResolverScopeProps {
  readonly deps?: DependencyList;
}

export function DependencyResolverScope({ deps = [], children }: PropsWithChildren<IDependencyResolverScopeProps>): JSX.Element {
  const parentDependencyContainer = useDependencyResolver();

  const scopedDependencyResolver = useMemo(
    () => parentDependencyContainer.createScope(),
    [parentDependencyContainer, ...deps]
  );

  return (
    <DependencyResolverProvider dependencyResolver={scopedDependencyResolver} children={children} />
  );
}