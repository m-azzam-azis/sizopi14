import React from "react";
import { UserRole } from "@/types/user";

interface UserBasicInfoProps {
  user: {
    firstName: string;
    middleName?: string | null;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    role: UserRole;
    staffId?: string;
  };
}

const UserBasicInfo: React.FC<UserBasicInfoProps> = ({ user }) => {
  // Format nama lengkap dengan nama tengah (jika ada dan bukan null)
  const fullName = user.firstName && user.lastName 
    ? (user.middleName && user.middleName !== "NULL" && user.middleName !== "undefined") 
      ? `${user.firstName} ${user.middleName} ${user.lastName}`
      : `${user.firstName} ${user.lastName}`
    : "undefined undefined"; // Sesuai dengan screenshot jika data tidak ada

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
        <p className="font-medium text-gray-900">{fullName}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Username</h3>
        <p className="font-medium text-gray-900">{user.username}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
        <p className="font-medium text-gray-900">{user.email}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
        <p className="font-medium text-gray-900">{user.phoneNumber || "-"}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Role</h3>
        <p className="font-medium text-gray-900">
          {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '-'}
        </p>
      </div>
      {user.staffId && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Staff ID</h3>
          <p className="font-medium text-gray-900">{user.staffId}</p>
        </div>
      )}
    </div>
  );
};

export default UserBasicInfo;