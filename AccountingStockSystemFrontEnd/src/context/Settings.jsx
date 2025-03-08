// In a component like AccountSettings.js
import React from "react";
import { persistor } from "../redux/store"; // Adjust the path based on your project structure

const AccountSettings = () => {
  const handleReset = () => {
    persistor.purge().then(() => {
      console.log("Local storage cleared");
      // Optionally, redirect or perform other actions after clearing
    });
  };

  return (
    <div className="account-settings">
      <h2>Account Settings</h2>
      <button onClick={handleReset}>Reset App Data</button>
      {/* Other settings UI */}
    </div>
  );
};

export default AccountSettings;
