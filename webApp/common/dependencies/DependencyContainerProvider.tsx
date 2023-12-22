import type { PropsWithChildren } from "react";
import type { IDependencyContainer } from "./IDependencyContainer";
import { DependencyContainerContext } from "./DependencyContainerContext";

export interface IDependencyContainerProviderProps {
  readonly dependencyContainer: IDependencyContainer;
}

export function DependencyContainerProvider({ dependencyContainer, children }: PropsWithChildren<IDependencyContainerProviderProps>): JSX.Element {
  return (
    <DependencyContainerContext.Provider value={dependencyContainer} children={children} />
  );
}