import type { IDependencyResolver } from "./IDependencyResolver";
import { createContext } from "react";

export const DependencyResolverContext = createContext<IDependencyResolver | null>(null);