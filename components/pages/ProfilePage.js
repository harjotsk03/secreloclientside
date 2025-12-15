"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { TextInput } from "../inputs/TextInput";
import { Button } from "../buttons/Button";
import { AlertContext } from "../../context/alertContext";
import { useAuth } from "../../context/AuthContext";
import Connections from "../profile/Connections";

export const ProfilePage = () => {
  const { user, setUser, authPut } = useAuth();
  const { showAlert } = useContext(AlertContext);

  // Local state for editable fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load user profile into local state
  useEffect(() => {
    if (user?.profile) {
      const [f, l] = user.profile.full_name.split(" ");
      setFirstName(f || "");
      setLastName(l || "");
      setEmail(user.profile.email || "");
    }
  }, [user]);

  // 👉 Detect if any field changed
  const isDirty = useMemo(() => {
    if (!user?.profile) return false;

    const [originalFirst, originalLast] = user.profile.full_name.split(" ");
    return (
      firstName !== (originalFirst || "") ||
      lastName !== (originalLast || "") ||
      email !== (user.profile.email || "")
    );
  }, [firstName, lastName, email, user]);

  const handleSave = async () => {
    if (!isDirty) return;

    setIsSaving(true);
    try {
      console.log(user);
      const id = user?.profile?.id;
      const body = {
        full_name: firstName + " " + lastName,
      };

      const data = await authPut(
        `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/users/updateUser/${id}`,
        body
      );

      console.log(data);

      setUser((prev) => ({ ...prev, profile: data.user.profile }));

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
      const [f, l] = user.profile.full_name.split(" ");
      setFirstName(f || "");
      setLastName(l || "");
      setEmail(user.profile.email || "");
    }
  };

  return (
    <div className="pb-10">
      <p className="poppins-medium text-2xl text-black dark:text-white mt-2">
        Profile
      </p>

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
            <TextInput
              label="Email"
              value={email}
              onChange={setEmail}
              disabled={true}
            />
          </div>
        </div>

        <div className="h-[1px] w-full bg-stone-300 dark:bg-stone-700/50" />

        <div className="px-6 py-4 flex flex-row justify-end gap-4">
          <Button
            variant="primary"
            onClick={handleSave}
            loading={isSaving}
            disabled={!isDirty || isSaving}
          >
            Save
          </Button>

          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>

      <Connections />
    </div>
  );
};
