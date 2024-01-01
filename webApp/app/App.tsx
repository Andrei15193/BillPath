import { UserProfileSelect } from "./profile";

export interface IAppProps {
}

export function App(props: IAppProps): JSX.Element {
  return (
    <>
      <UserProfileSelect />
    </>
  );
}