import React from "react";
import StaffRegisterModule from "@/modules/RegisterModule/StaffRegisterModule";


const CaretakerRegisterPage = () => {
  return (
    <StaffRegisterModule
      role="caretaker"
      title="Register as Animal Caretaker"
      description="Create your caretaker account to manage animal care"
    />
  );
};

export default CaretakerRegisterPage;