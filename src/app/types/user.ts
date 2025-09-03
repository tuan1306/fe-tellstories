export type UserDetails = {
  id: string;
  displayName: string;
  email: string;
  userType: "Admin" | "User" | null;
  status: "Active" | "Suspended" | "Banned" | null;
  avatarUrl: string;
  phoneNumber: string | null;
  dob: string | null;
  lastLogin: string;
  createdDate: string;
  updatedDate: string;
};
