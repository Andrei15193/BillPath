import type { IUserProfile } from "../../data/userProfiles";
import { useCallback, useEffect, useState } from "react";
import { type DialogOpenChangeEvent, type DialogOpenChangeData, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger } from "@fluentui/react-components";
import { DismissRegular, DeleteFilled } from "@fluentui/react-icons";
import { FormattedMessage } from "react-intl";

export interface IRemoveUserProfileDialogProps {
  readonly userProfile?: IUserProfile | null;

  onConfirm(userProfile: IUserProfile): void;
  onCancel?(): void;
}

export function RemoveUserProfileDialog({ userProfile, onConfirm, onCancel }: IRemoveUserProfileDialogProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(
    () => {
      setIsOpen(userProfile !== null && userProfile !== undefined);
    },
    [userProfile]
  );

  const onDialogOpenChangedCallback = useCallback(
    (event: DialogOpenChangeEvent, { open }: DialogOpenChangeData): void => {
      setIsOpen(open);
      if (!open)
        onCancel && onCancel();
    },
    [onCancel, setIsOpen]
  );

  const onConfirmCallback = useCallback(
    () => {
      onConfirm(userProfile!);
    },
    [userProfile, onConfirm]
  );

  return (
    <Dialog
      modalType="modal"
      open={isOpen}
      onOpenChange={onDialogOpenChangedCallback}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>
            <FormattedMessage defaultMessage="Confirm removal" description="Confirm user profile removal modal title." />
          </DialogTitle>
          <DialogContent>
            <FormattedMessage
              defaultMessage="This action will permanently remove the {displayName} user profile and all associated data, please confirm your action."
              values={{ displayName: userProfile?.displayName || "" }}
              description="Confirm user profile removal modal content." />
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement action="close">
              <Button appearance="secondary" icon={<DismissRegular />}>
                <FormattedMessage defaultMessage="Cancel" description="Cancel user profile removal confirmation button label." />
              </Button>
            </DialogTrigger>
            <Button appearance="primary" onClick={onConfirmCallback} icon={<DeleteFilled />}>
              <FormattedMessage defaultMessage="Remove" description="Confirm user profile removal confirmation button label." />
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}