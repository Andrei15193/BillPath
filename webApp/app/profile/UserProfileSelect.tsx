import type { IUserProfile } from "../../data/userProfiles";
import type { IObservedItem } from "../interaction/observedItems";
import { Button, Card, CardFooter, CardPreview, Display, Divider, Title3, makeStyles, mergeClasses, shorthands, tokens } from "@fluentui/react-components";
import { AddCircleRegular } from "@fluentui/react-icons";
import { FormattedMessage } from "react-intl";
import { useViewModel } from "react-model-view-viewmodel";
import { AppFooter } from "../AppFooter";
import { useViewModelDependency } from "../../common/dependencies";
import { useObservedItems } from "../interaction/observedItems/useObservedItems";
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
  profileCard: {
    ...shorthands.padding(tokens.spacingVerticalM),
    width: "130px"
  },
  profileCardAdded: {
    animationDuration: "0.4s",
    animationIterationCount: "1",
    animationTimingFunction: "ease-in-out",
    animationName: {
      "0%": {
        width: 0,
        ...shorthands.padding(0),
        ...shorthands.margin(0, "-10px"),
        opacity: 0
      },
      "60%": {
        opacity: 0,
        ...shorthands.padding(tokens.spacingVerticalM),
        ...shorthands.margin(0),
        width: "130px"
      },
      "100%": {
        opacity: 1
      }
    }
  },
  profileCardPreview: {
    ...shorthands.padding(tokens.spacingVerticalM),
    alignSelf: "center",
    height: "100px"
  },
  profileCardFooter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
});

function areSameUserProfiles(left: IUserProfile, right: IUserProfile): boolean {
  return left.id === right.id;
}

export function UserProfileSelect(props: IUserProfileSelectProps): JSX.Element {
  const { profileCardsList, profileCard, profileCardPreview, profileCardFooter } = useProfileSelectorClassNames();
  const profilesCollectionViewModel = useViewModelDependency(UserProfilesCollectionViewModel);

  const observedUserProfiles = useObservedItems(
    profilesCollectionViewModel.userProfiles,
    {
      addedItemAnimationDurationInMilliseconds: 500,
      updatedItemAnimationDurationInMilliseconds: 0,
      areSameItems: areSameUserProfiles
    }
  );

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
        {observedUserProfiles.map(userProfile => <ProfileCard key={`${userProfile.removed ? "removed-" : ""}${userProfile.item.id}`} userProfile={userProfile} />)}
        <Card className={profileCard}>
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

interface IProfileCardProps {
  readonly userProfile: IObservedItem<IUserProfile>;
}

function ProfileCard({ userProfile }: IProfileCardProps): JSX.Element {
  const { profileCard, profileCardAdded, profileCardPreview, profileCardFooter } = useProfileSelectorClassNames();

  useViewModel(userProfile);

  return (
    <Card className={mergeClasses(profileCard, userProfile.added && profileCardAdded)}>
      <CardPreview className={profileCardPreview}>{userProfile.item.displayName}</CardPreview>
      <CardFooter className={profileCardFooter}>
        <Button>
          <FormattedMessage defaultMessage="Select" description="Select user profile." />
        </Button>
      </CardFooter>
    </Card>
  );
}