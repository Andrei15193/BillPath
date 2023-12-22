import type { IDependencyContainer } from "./IDependencyContainer";
import { createContext } from "react";

export const DependencyContainerContext = createContext<IDependencyContainer | null>(null);