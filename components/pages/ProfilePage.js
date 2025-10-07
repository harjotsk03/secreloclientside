"use client";
import { useContext, useEffect, useState } from "react";
import { TextInput } from "../inputs/TextInput";
import { Button } from "../buttons/Button";
import { AlertContext } from "../../context/alertContext";

export const ProfilePage = () => {
  const { showAlert } = useContext(AlertContext);

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
            />
            <TextInput
              label="Last Name"
            />
          </div>
        </div>
        <div className="h-[1px] w-full bg-stone-300 dark:bg-stone-700/50" />
        <div className="px-6 py-4 flex flex-row justify-end gap-4">
          <Button
            variant="primary"
          >
            Save
          </Button>
          <Button
            variant="ghost"
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Account Information */}
      <div className="flex flex-col bg-white dark:bg-darkBG rounded-xl mt-6 border border-stone-300 dark:border-stone-700/50">
        <div className="px-6 py-4">
          <p className="poppins-medium text-lg text-black dark:text-white">
            Account Details
          </p>
        </div>
        <div className="h-[1px] w-full bg-stone-300 dark:bg-stone-700/50" />
        <div className="px-6 py-4 flex flex-col gap-4 lg:gap-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <TextInput label="Email" disabled />
            <TextInput label="Role" disabled />
          </div>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <TextInput label="Status" disabled />
            <TextInput label="Company" disabled />
          </div>
        </div>
      </div>
    </div>
  );
};
