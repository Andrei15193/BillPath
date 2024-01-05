import type { IUserProfile } from "../../data/userProfiles";
import { type DialogOpenChangeData, type DialogOpenChangeEvent, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger } from "@fluentui/react-components";
import { FormattedMessage } from "react-intl";
import { type ReactEventHandler, useCallback, useRef, useState } from "react";
import { useViewModel } from "react-model-view-viewmodel";
import { useDependencyResolver } from "../../common/dependencies";
import { FormField, FormInputField } from "../forms";
import { UserProfileForm } from "./UserProfileForm";

export interface IAddUserProfileDialogProps {
  onUserProfileAdded?(userProfile: IUserProfile): void;
}

export function AddUserProfileDialog({ onUserProfileAdded }: IAddUserProfileDialogProps): JSX.Element {
  const { resolve } = useDependencyResolver();
  const formRef = useRef(resolve(UserProfileForm));
  useViewModel(formRef.current);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const onOpenChangeCallback = useCallback(
    (event: DialogOpenChangeEvent, { open }: DialogOpenChangeData): void => {
      if (open)
        formRef.current = resolve(UserProfileForm);

      setIsDialogOpen(open);
    },
    [formRef, setIsDialogOpen]
  );

  const addUserProfileAsyncCallback = useCallback<ReactEventHandler<HTMLElement>>(
    async (event) => {
      event.preventDefault();

      const userProfile = await formRef.current.addAsync();
      if (formRef.current.userProfileAdded) {
        setIsDialogOpen(false);
        onUserProfileAdded && onUserProfileAdded(userProfile!);
      }
    },
    [formRef, onUserProfileAdded]
  );

  return (
    <Dialog modalType="alert" open={isDialogOpen} onOpenChange={onOpenChangeCallback}>
      <DialogTrigger disableButtonEnhancement action="open">
        <Button>
          <FormattedMessage defaultMessage="New profile" description="Create new user profile." />
        </Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>
            <FormattedMessage defaultMessage="Add profile" description="Add user profile form caption." />
          </DialogTitle>
          <DialogContent>
            <form onSubmit={addUserProfileAsyncCallback}>
              <FormField field={formRef.current.displayName} label="Display name">
                <FormInputField />
              </FormField>
            </form>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement action="close">
              <Button appearance="secondary">
                <FormattedMessage defaultMessage="Cancel" description="Cancel adding a user profile button label." />
              </Button>
            </DialogTrigger>
            <Button appearance="primary" disabled={formRef.current.isProcessing} onClick={addUserProfileAsyncCallback}>
              <FormattedMessage defaultMessage="Add" description="Add user profile button label." />
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}