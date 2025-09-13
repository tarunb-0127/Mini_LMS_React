import React from "react";
import LogoutButton from "../components/LogoutButton";
 
const LearnerHome = () => {
  return (
    <div className="container mt-5">
      <h2>Welcome, Learner!</h2>
      <p>This is your learning dashboard.</p>
      <LogoutButton />
    </div>
  );
};
 
export default LearnerHome;
 