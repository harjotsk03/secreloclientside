"use client";

import { useContext, useEffect, useState } from "react";
import { TextInput } from "../inputs/TextInput";
import { Button } from "../buttons/Button";
import { AlertContext } from "../../context/alertContext";
import { useAuth } from "../../context/AuthContext";

export const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const { showAlert } = useContext(AlertContext);

  // Local state for editable fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load user profile into local state
  useEffect(() => {
    if (user?.profile) {
      setFirstName(user.profile.full_name.split(" ")[0] || "");
      setLastName(user.profile.full_name.split(" ")[1] || "");
      setEmail(user.profile.email || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?.token) return;

    setIsSaving(true);
    try {
      // Example API call to update profile
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/users/${user.user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            full_name: `${firstName} ${lastName}`,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      // Update context with new profile
      setUser((prev) => ({ ...prev, user: data.user }));
      showAlert("Profile updated successfully!", "success");
    } catch (err) {
      console.error(err);
      showAlert(err.message || "Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user?.profile) {
      setFirstName(user.profile.full_name.split(" ")[0] || "");
      setLastName(user.profile.full_name.split(" ")[1] || "");
    }
  };

  return (
    <div>
      <p className="poppins-medium text-2xl text-black dark:text-white mt-2">
        Profile
      </p>

      {/* Personal Information */}
      <div className="flex flex-col bg-white dark:bg-darkBG rounded-xl mt-4 border border-stone-300 dark:border-stone-700/50">
        <div className="px-6 py-4">
          <p className="poppins-medium text-lg text-black dark:text-white">
            Personal Information
          </p>
        </div>
        <div className="h-[1px] w-full bg-stone-300 dark:bg-stone-700/50" />
        <div className="px-6 py-4 flex flex-col gap-4 lg:gap-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <TextInput
              label="First Name"
              value={firstName}
              onChange={setFirstName}
            />
            <TextInput
              label="Last Name"
              value={lastName}
              onChange={setLastName}
            />
          </div>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <TextInput label="Email" value={email} onChange={setEmail} />
            {/* <TextInput
              label="Last Name"
              value={lastName}
              onChange={setLastName}
            /> */}
          </div>
        </div>
        <div className="h-[1px] w-full bg-stone-300 dark:bg-stone-700/50" />
        <div className="px-6 py-4 flex flex-row justify-end gap-4">
          <Button variant="primary" onClick={handleSave} loading={isSaving}>
            Save
          </Button>
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
