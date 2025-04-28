import React from "react";
import StaffRegisterModule from "@/modules/RegisterModule/StaffRegisterModule";

const TrainerRegisterPage = () => {
  return (
    <StaffRegisterModule
      role="trainer"
      title="Register as Show Trainer"
      description="Create your trainer account to manage animal performances"
    />
  );
};

export default TrainerRegisterPage;
