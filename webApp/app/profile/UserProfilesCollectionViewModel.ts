import type { IDependencyResolver } from "../../common/dependencies";
import type { IUserProfile, IUserProfilesStore } from "../../data/userProfiles";
import { type IReadOnlyObservableCollection, type IObservableCollection, ObservableCollection, ViewModel } from "react-model-view-viewmodel";

export class UserProfilesCollectionViewModel extends ViewModel {
  private _isProcessing: boolean;
  private readonly _userProfiles: IObservableCollection<IUserProfile>;
  private readonly _userProfilesStore: IUserProfilesStore;

  public constructor({ userProfilesStore }: IDependencyResolver) {
    super();

    this._isProcessing = false;
    this._userProfiles = new ObservableCollection<IUserProfile>();
    this._userProfilesStore = userProfilesStore;
  }

  public get isProcessing(): boolean {
    return this._isProcessing;
  }

  public get userProfiles(): IReadOnlyObservableCollection<IUserProfile> {
    return this._userProfiles;
  }

  public async loadAsync(): Promise<void> {
    try {
      this._isProcessing = true;
      this.notifyPropertiesChanged("isProcessing");

      const profiles = await this._userProfilesStore.getAllAsync();
      this._userProfiles.reset(...profiles);
    }
    finally {
      this._isProcessing = false;
      this.notifyPropertiesChanged("isProcessing");
    }
  }
}