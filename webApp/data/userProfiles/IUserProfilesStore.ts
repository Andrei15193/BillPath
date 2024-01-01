import type { IUserProfile } from "./IUserProfile";

export interface IUserProfilesStore {
  getAllAsync(): Promise<IUserProfile[]>;

  addAsync(userProfile: Omit<IUserProfile, "id">): Promise<IUserProfile>;

  updateAsync(userProfile: IUserProfile): Promise<void>;

  removeAsync(id: string): Promise<void>;
}