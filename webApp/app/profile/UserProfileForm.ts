import type { IDependencyResolver } from "../../common/dependencies";
import type { IUserProfile, IUserProfilesStore } from "../../data/userProfiles";
import { BillPathFormFieldCollectionViewModel, BillPathFormFieldViewModel } from "../forms/viewModels";
import { required } from "../forms/validators";
import { UserProfilesStore } from "../../data/userProfiles/IUserProfilesStore";

export class UserProfileForm extends BillPathFormFieldCollectionViewModel {
  private _isProcessing: boolean = false;
  private _userProfileAdded: boolean = false;
  private readonly _userProfilesStore: IUserProfilesStore;

  public constructor({ resolve }: IDependencyResolver) {
    super();

    this._userProfilesStore = resolve(UserProfilesStore);

    this.registerFields(
      this.displayName = new BillPathFormFieldViewModel<string>({
        name: "displayName",
        initialValue: "",
        validators: [required]
      })
    );
  }

  public readonly displayName: BillPathFormFieldViewModel<string>;

  public get isProcessing(): boolean {
    return this._isProcessing;
  }

  public get userProfileAdded(): boolean {
    return this._userProfileAdded;
  }

  public async addAsync(): Promise<IUserProfile | undefined> {
    if (this.validateWithTouch())
      try {
        this._isProcessing = true;
        this.notifyPropertiesChanged("isProcessing");

        const userProfile = await this._userProfilesStore.addAsync({
          displayName: this.displayName.value,
          lastUsed: new Date()
        });

        this._userProfileAdded = true;
        this.notifyPropertiesChanged("userProfileAdded");

        return userProfile;
      }
      finally {
        this._isProcessing = false;
        this.notifyPropertiesChanged("isProcessing");
      }
  }
}