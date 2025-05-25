import React from "react";
import { UserRole } from "@/types/user";
import VisitorProfileForm from "./role-forms/VisitorProfileForm";
// import VeterinarianProfileForm from "./role-forms/VeterinarianProfileForm";
// import StaffProfileForm from "./role-forms/StaffProfileForm";

interface ProfileRoleSpecificFormProps {
  user: {
    id: string;
    role: UserRole;
    // For visitor
    address?: string;
    birthDate?: string;
    // For veterinarian
    certificationNumber?: string;
    specializations?: string[];
    // For staff (admin, caretaker, trainer)
    staffId?: string;
    [key: string]: any; // For any additional fields
  };
}

const ProfileRoleSpecificForm: React.FC<ProfileRoleSpecificFormProps> = ({
  user,
}) => {
  // Render the appropriate form based on user role
  switch (user.role) {
    case "visitor":
      return <VisitorProfileForm user={user} />;

    case "veterinarian":
      // return <VeterinarianProfileForm user={user} />;

    case "admin":
    case "caretaker":
    case "trainer":
      // return <StaffProfileForm user={user} />;

    default:
      return <p>No additional settings for this role.</p>;
  }
};

export default ProfileRoleSpecificForm;
