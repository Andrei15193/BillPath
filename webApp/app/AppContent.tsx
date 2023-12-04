import { Title1, makeResetStyles, mergeClasses, shorthands } from "@fluentui/react-components";
import { useContentClassNames } from "./styles";

const useAppContentClassName = makeResetStyles({
  ...shorthands.flex(1, 1, "auto")
})

export function AppContent(): JSX.Element {
  const { marginContentClassName } = useContentClassNames();
  const appContentClassName = useAppContentClassName();

  return (
    <div className={mergeClasses(marginContentClassName, appContentClassName)}>
      <Title1>Expenses</Title1>
    </div>
  );
}