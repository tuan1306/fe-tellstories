export type UserDetails = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  userType: "Admin" | "User" | null;
  status: "Active" | "Disabled" | "Banned" | null;
  avatarUrl: string;
  phoneNumber: string | null;
  dob: string | null;
};
