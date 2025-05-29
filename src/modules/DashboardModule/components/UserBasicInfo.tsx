import React from "react";
import { UserRole } from "@/types/user";

interface UserBasicInfoProps {
  user: {
    username: string;
    email: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    phoneNumber: string;
    role: UserRole;
  };
}

const UserBasicInfo: React.FC<UserBasicInfoProps> = ({ user }) => {
  const formatRole = (role: UserRole): string => {
    switch (role) {
      case "admin":
        return "Staff Administration";
      case "veterinarian":
        return "Veterinarian";
      case "caretaker":
        return "Animal Caretaker";
      case "visitor":
        return "Visitor";
      case "trainer":
        return "Show Trainer";
      default:
        return role;
    }
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Full Name</p>
        <p className="font-medium">
          {user.firstName} {user.middleName ? user.middleName + " " : ""}
          {user.lastName}
        </p>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Username</p>
        <p className="font-medium">{user.username}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Email</p>
        <p className="font-medium">{user.email}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Phone Number</p>
        <p className="font-medium">{user.phoneNumber}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Role</p>
        <p className="font-medium">{formatRole(user.role)}</p>
      </div>
    </div>
  );
};

export default UserBasicInfo;