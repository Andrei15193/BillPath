import type { IUserProfile } from "./IUserProfile";
import { DependencyToken } from "../../common/dependencies";

export const UserProfilesStore = new DependencyToken<IUserProfilesStore>("IUserProfilesStore");

export interface IUserProfilesStore {
  getAllAsync(): Promise<IUserProfile[]>;

  addAsync(userProfile: Omit<IUserProfile, "id">): Promise<IUserProfile>;

  updateAsync(userProfile: IUserProfile): Promise<void>;

  removeAsync(id: string): Promise<void>;
}