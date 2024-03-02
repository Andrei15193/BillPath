import { type PropsWithChildren, type DependencyList, useMemo } from "react";
import { useDependencyResolver } from "./useDependencyResolver";
import { DependencyResolverProvider } from "./DependencyResolverProvider";
import { useArrayCache } from "./useArrayCache";

export interface IDependencyResolverScopeProps {
  readonly deps?: DependencyList;
}

export function DependencyResolverScope({ deps = [], children }: PropsWithChildren<IDependencyResolverScopeProps>): JSX.Element {
  const parentDependencyResolver = useDependencyResolver();
  const depsCache = useArrayCache(deps);

  const scopedDependencyResolver = useMemo(
    () => parentDependencyResolver.createScope(),
    // This is intended, whenever the contents of `deps` change, a new scope should be created.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parentDependencyResolver, depsCache]
  );

  return (
    <DependencyResolverProvider dependencyResolver={scopedDependencyResolver} children={children} />
  );
}