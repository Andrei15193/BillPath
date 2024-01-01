import type { IUserProfile } from "./IUserProfile";
import type { IUserProfilesStore } from "./IUserProfilesStore";

export class LocalStorageUserProfilesStore implements IUserProfilesStore {
  public getAllAsync(): Promise<IUserProfile[]> {
    let profilesJson = localStorage.getItem("data/profiles");
    if (profilesJson === null || profilesJson === undefined)
      profilesJson = "[]";

    return Promise.resolve(JSON.parse(profilesJson));
  }

  public async addAsync(userProfile: Omit<IUserProfile, "id">): Promise<IUserProfile> {
    const profiles = await this.getAllAsync();
    const profile: IUserProfile = {
      ...userProfile,
      id: new Date().toISOString()
    };

    profiles.push(profile);
    localStorage.setItem("data/profiles", JSON.stringify(profiles));

    return profile;
  }

  public async updateAsync(userProfile: IUserProfile): Promise<void> {
    const profiles = await this.getAllAsync();

    const profileIndex = profiles.findIndex(profile => profile.id === userProfile.id);
    if (profileIndex >= 0) {
      profiles.splice(profileIndex, 1, userProfile);
      localStorage.setItem("data/profiles", JSON.stringify(profiles));
    }
  }

  public async removeAsync(id: string): Promise<void> {
    const profiles = await this.getAllAsync();

    const profileIndex = profiles.findIndex(profile => profile.id === id);
    if (profileIndex >= 0) {
      profiles.splice(profileIndex, 1);
      localStorage.setItem("data/profiles", JSON.stringify(profiles));
    }
  }
}