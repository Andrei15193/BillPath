import { Button, Card, CardFooter, CardPreview, Display, Divider, Title3, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { AddCircleRegular } from "@fluentui/react-icons";
import { FormattedMessage } from "react-intl";
import { AppFooter } from "../AppFooter";
import { useViewModelDependency } from "../../common/dependencies";
import { UserProfilesCollectionViewModel } from "./UserProfilesCollectionViewModel";
import { AddUserProfileDialog } from "./AddUserProfileDialog";

export interface IUserProfileSelectProps {
}

const useProfileSelectorClassNames = makeStyles({
  profileCardsList: {
    ...shorthands.flex(1, 1, "auto"),
    ...shorthands.margin(tokens.spacingVerticalXL),

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "flex-start",
    justifyContent: "center",
    flexWrap: "wrap",

    ...shorthands.gap("20px")
  },
  profileCardPreview: {
    ...shorthands.padding(tokens.spacingVerticalM),
    alignSelf: "center",
    width: "100px",
    height: "100px"
  },
  profileCardFooter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
});

export function UserProfileSelect(props: IUserProfileSelectProps): JSX.Element {
  const { profileCardsList, profileCardPreview, profileCardFooter } = useProfileSelectorClassNames();
  const profilesCollectionViewModel = useViewModelDependency(UserProfilesCollectionViewModel);

  return (
    <>
      <Display align="center">
        <FormattedMessage defaultMessage="BillPath" description="Profile selection app title." />
      </Display>
      <div>
        <Divider />
      </div>

      <Title3 align="center">
        <FormattedMessage defaultMessage="Who is using the app?" description="Profile selection caption." />
      </Title3>

      <div className={profileCardsList}>
        {
          profilesCollectionViewModel.userProfiles.map(userProfile => (
            <Card key={userProfile.id}>
              <CardPreview className={profileCardPreview}>{userProfile.displayName}</CardPreview>
              <CardFooter className={profileCardFooter}>
                <Button>
                  <FormattedMessage defaultMessage="Select" description="Select user profile." />
                </Button>
              </CardFooter>
            </Card>
          ))
        }
        <Card>
          <CardPreview className={profileCardPreview}>
            <AddCircleRegular />
          </CardPreview>
          <CardFooter className={profileCardFooter}>
            <AddUserProfileDialog onUserProfileAdded={() => profilesCollectionViewModel.loadAsync()} />
          </CardFooter>
        </Card>
      </div>

      <AppFooter />
    </>
  );
}