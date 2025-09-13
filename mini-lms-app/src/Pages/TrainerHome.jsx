import React from "react";
import LogoutButton from "../components/LogoutButton";
 
const TrainerHome = () => {
  return (
    <div className="container mt-5">
      <h2>Welcome, Trainer!</h2>
      <p>This is your dashboard.</p>
      <LogoutButton />
    </div>
  );
};
 
export default TrainerHome;
 