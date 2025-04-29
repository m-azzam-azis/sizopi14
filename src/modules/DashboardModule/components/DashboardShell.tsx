import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserRole } from "@/types/user";

interface DashboardShellProps {
  user: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    role: UserRole;
    alamat?: string;
    tanggalLahir?: string;
  };
  roleSpecificContent: ReactNode;
}

const DashboardShell: React.FC<DashboardShellProps> = ({
  user,
  roleSpecificContent,
}) => {
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* User Profile Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Username</p>
              <p className="font-medium">{user.username}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">{user.phoneNumber}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium capitalize">{user.role}</p>
            </div>

            {user.alamat && (
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{user.alamat}</p>
              </div>
            )}

            {user.tanggalLahir && (
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{user.tanggalLahir}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Role-specific content */}
      {roleSpecificContent}
    </div>
  );
};

export default DashboardShell;
