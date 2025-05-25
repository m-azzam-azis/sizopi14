import React from "react";
import StaffRegisterModule from "@/modules/RegisterModule/StaffRegisterModule";

const AdminRegisterPage = () => {
  return (
    <StaffRegisterModule
      role="admin"
      title="Register as Admin Staff"
      description="Create your admin account to manage zoo operations"
    />
  );
};

export default AdminRegisterPage;
