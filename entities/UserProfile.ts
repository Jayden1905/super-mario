import { UserProfileFormSchemaType } from "@/components/Forms/UserProfileFormSchema";
import { baseUrl } from "@/lib/utils";
import { Role, Status, UserProfile } from "@prisma/client";

export class UserProfileEntity {
  // Static property to hold the single instance of the class
  private static instance: UserProfileEntity;
  private userProfiles: UserProfile[] = [];
  private userProfilesLoaded: boolean = false;

  // Private constructor to prevent direct instantiation
  private constructor() {
    this.loadUserProfiles();
  }

  // Static method to provide access to the single instance of the class
  public static getInstance(): UserProfileEntity {
    if (!UserProfileEntity.instance) {
      UserProfileEntity.instance = new UserProfileEntity();
    }
    return UserProfileEntity.instance;
  }

  public async getUserProfiles(): Promise<UserProfile[]> {
    if (!this.userProfilesLoaded) {
      await this.loadUserProfiles();
    }

    return this.userProfiles;
  }

  public async viewUserProfileEntity(): Promise<UserProfile[]> {
    const userProfiles = await this.getUserProfiles();
    return userProfiles;
  }

  public async viewUsedCarAgentProfileEntity(): Promise<UserProfile[]> {
    const userProfiles = await this.getUserProfiles();

    // Filter user profiles to include only those with role 'agent' and status 'active'
    const filteredProfiles = userProfiles.filter(
      (profile) =>
        profile.role === Role.agent && profile.status === Status.active
    );

    return filteredProfiles;
  }

  public async editUserProfileEntity(
    id: string,
    name: string,
    role: Role,
    address: string | null,
    mobileNumber: string | null
  ): Promise<boolean> {
    try {
      const data = {
        id,
        name,
        role,
        address,
        mobileNumber,
      };
      const response = await fetch(`${baseUrl}/api/userProfiles`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        return false;
      }
      await this.loadUserProfiles();

      return true;
    } catch (error) {
      console.error("Failed to create user:", error);
      return false;
    }
  }

  public async searchUserProfileEntity(
    email: string
  ): Promise<UserProfile | null> {
    try {
      const response = await fetch(`${baseUrl}/api/userProfiles/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Error fetching user:", response.statusText);
        return null;
      }

      const res = await response.json();

      return res;
    } catch (error) {
      console.error("Failed to fetch user account:", error);
      return null;
    }
  }

  public async suspendUserProfileEntity(
    id: string,
    status: Status
  ): Promise<boolean> {
    try {
      const data = {
        id,
        status,
      };

      const response = await fetch(`${baseUrl}/api/userProfiles`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        return false;
      }

      await this.loadUserProfiles();

      return true;
    } catch (error) {
      console.error("Failed to create user:", error);
      return false;
    }
  }

  // Load userProfiles from the API, and cache the result
  private async loadUserProfiles(): Promise<void> {
    try {
      const response = await fetch(`${baseUrl}/api/userProfiles`, {
        cache: "no-cache",
      });
      if (!response.ok) {
        console.error(`Error: Received status ${response.status}`);
        return;
      }

      const res = await response.json();

      this.userProfiles = res.userProfile;
      this.userProfilesLoaded = true;
    } catch (error) {
      console.error("Failed to load userProfiles:", error);
    }
  }

  public async createUserProfileEntity(
    name: string,
    userEmail: string,
    role: Role,
    address: string,
    mobileNumber: string
  ): Promise<boolean> {
    try {
      const data: UserProfileFormSchemaType = {
        name,
        userEmail,
        role,
        address,
        mobileNumber,
      };
      const response = await fetch(`${baseUrl}/api/userProfiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        return false;
      }

      await this.loadUserProfiles();

      return true;
    } catch (error) {
      console.error("Failed to create user:", error);
      return false;
    }
  }

  public async verifyProfile({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<boolean> {
    try {
      const response = await fetch(`${baseUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if the response is not successful (status 200-299)
      if (!response.ok) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Failed to authenticate user:", error);
      return false;
    }
  }
}
