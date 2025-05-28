import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserBasicInfo from "./UserBasicInfo";
import { UserRole } from "@/types/user";

interface User {
  firstName: string;
  middleName?: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  staffId?: string;
}

interface DashboardShellProps {
  user: User;
  roleSpecificContent: React.ReactNode;
}

const DashboardShell: React.FC<DashboardShellProps> = ({
  user,
  roleSpecificContent,
}) => {
  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl bg-[#f8fff8]">
      <h1 className="text-3xl font-bold mb-6 text-[#1e381e]">Dashboard</h1>

      <div className="grid gap-6">
        <Card className="border rounded-md shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">User Information</CardTitle>
            <p className="text-sm text-gray-500">Your account details</p>
          </CardHeader>
          <CardContent>
            <UserBasicInfo user={user} />
          </CardContent>
        </Card>

        <div>{roleSpecificContent}</div>
      </div>
    </div>
  );
};

export default DashboardShell;