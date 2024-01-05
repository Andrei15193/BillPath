import type { IUserProfile } from "../../data/userProfiles";
import type { IObservedItem } from "../interaction/observedItems";
import { type MenuButtonProps, Card, CardFooter, CardPreview, Display, Divider, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, SplitButton, Title3, makeStyles, mergeClasses, shorthands, tokens } from "@fluentui/react-components";
import { AddCircleRegular, DeleteRegular, DeleteFilled, bundleIcon } from "@fluentui/react-icons";
import { FormattedMessage } from "react-intl";
import { useViewModel } from "react-model-view-viewmodel";
import { useCallback, useState } from "react";
import { AppFooter } from "../AppFooter";
import { useViewModelDependency } from "../../common/dependencies";
import { useObservedItems } from "../interaction/observedItems/useObservedItems";
import { UserProfilesCollectionViewModel } from "./UserProfilesCollectionViewModel";
import { AddUserProfileDialog } from "./AddUserProfileDialog";
import { RemoveUserProfileDialog } from "./RemoveUserProfileDialog";

export interface IUserProfileSelectProps {
}

const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);

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
    width: "140px"
  },
  profileCardAdded: {
    animationDuration: "0.4s",
    animationIterationCount: "1",
    animationTimingFunction: "ease-in-out",
    animationName: {
      "0%": {
        pointerEvents: "none",

        opacity: 0,
        ...shorthands.margin(0, "-10px"),
        ...shorthands.padding(0),
        width: 0
      },
      "60%": {
        pointerEvents: "none",

        opacity: 0,
        ...shorthands.margin(0),
        ...shorthands.padding(tokens.spacingVerticalM),
        width: "140px"
      },
      "100%": {
        pointerEvents: "initial",

        opacity: 1
      }
    }
  },
  profileCardRemoved: {
    ...shorthands.margin(0, "-10px"),
    ...shorthands.padding(0),
    width: 0,

    animationDuration: "0.5s",
    animationIterationCount: "1",
    animationTimingFunction: "ease-in-out",
    animationName: {
      "0%": {
        pointerEvents: "none",

        opacity: 1,
        ...shorthands.margin(0),
        ...shorthands.padding(tokens.spacingVerticalM),
        width: "140px"
      },
      "40%": {
        pointerEvents: "none",

        opacity: 0,
        ...shorthands.margin(0),
        ...shorthands.padding(tokens.spacingVerticalM),
        width: "140px"
      },
      "100%": {
        pointerEvents: "initial",

        opacity: 0
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

  const [selectedUserProfileForRemoval, selectUserProfileForRemoval] = useState<IUserProfile | null>(null);
  const discardUserProfileForRemoval = useCallback(
    () => {
      selectUserProfileForRemoval(null);
    },
    [selectUserProfileForRemoval]
  );

  const observedUserProfiles = useObservedItems(
    profilesCollectionViewModel.userProfiles,
    {
      addedItemAnimationDurationInMilliseconds: 400,
      updatedItemAnimationDurationInMilliseconds: 0,
      removedItemAnimationDurationInMilliseconds: 500,
      areSameItems: areSameUserProfiles
    }
  );

  const onUserProfileAddedAsyncCallback = useCallback(
    () => profilesCollectionViewModel.loadAsync(),
    [profilesCollectionViewModel]
  );

  const onUserProfileRemovedAsyncCallback = useCallback(
    async (userProfile: IUserProfile) => {
      await profilesCollectionViewModel.removeAsync(userProfile.id);
      selectUserProfileForRemoval(null);
    },
    [profilesCollectionViewModel, selectUserProfileForRemoval]
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
        {observedUserProfiles.map(userProfile => (
          <ProfileCard
            key={`${userProfile.removed ? "removed-" : ""}${userProfile.item.id}`}
            userProfile={userProfile}
            onRemove={selectUserProfileForRemoval} />
        ))}
        <Card className={profileCard}>
          <CardPreview className={profileCardPreview}>
            <AddCircleRegular />
          </CardPreview>
          <CardFooter className={profileCardFooter}>
            <AddUserProfileDialog onUserProfileAdded={onUserProfileAddedAsyncCallback} />
          </CardFooter>
        </Card>
      </div>

      <AppFooter />

      <RemoveUserProfileDialog
        userProfile={selectedUserProfileForRemoval}
        onConfirm={onUserProfileRemovedAsyncCallback}
        onCancel={discardUserProfileForRemoval} />
    </>
  );
}

interface IProfileCardProps {
  readonly userProfile: IObservedItem<IUserProfile>;

  onRemove?(userProfile: IUserProfile): void;
}

function ProfileCard({ userProfile, onRemove }: IProfileCardProps): JSX.Element {
  const { profileCard, profileCardAdded, profileCardRemoved, profileCardPreview, profileCardFooter } = useProfileSelectorClassNames();

  useViewModel(userProfile);

  const onRemoveCallback = useCallback(
    () => {
      onRemove && onRemove(userProfile.item);
    },
    [userProfile, onRemove]
  );

  return (
    <Card className={mergeClasses(profileCard, userProfile.added && profileCardAdded, userProfile.removed && profileCardRemoved)}>
      <CardPreview className={profileCardPreview}>{userProfile.item.displayName}</CardPreview>
      <CardFooter className={profileCardFooter}>
        <Menu positioning="below-end">
          <MenuTrigger disableButtonEnhancement>
            {(triggerProps: MenuButtonProps) => (
              <SplitButton menuButton={triggerProps}>
                <FormattedMessage defaultMessage="Select" description="Select user profile button label." />
              </SplitButton>
            )}
          </MenuTrigger>

          <MenuPopover>
            <MenuList>
              <MenuItem icon={<DeleteIcon />} onClick={onRemoveCallback}>
                <FormattedMessage defaultMessage="Remove" description="Remove user profile button label." />
              </MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </CardFooter>
    </Card>
  );
}