"use client";

import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../context/alertContext";
import { Button } from "../buttons/Button";
import { Folder, FileText } from "lucide-react";
import { TextInput } from "../inputs/TextInput";
import { Select } from "../inputs/Select";
import { useAuth } from "../../context/AuthContext";

export default function CreateNewRepoModal({
  setShowCreateRepoModal,
  setRepos,
}) {
  const { authPost } = useAuth();
  const { showAlert } = useContext(AlertContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [repoType, setRepoType] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setShowCreateRepoModal(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setShowCreateRepoModal]);

  const options = [
    { label: "Personal Project", value: "personal" },
    { label: "Hackathon Project", value: "hackathon" },
    { label: "Startup / MVP", value: "startup" },
    { label: "Client Project", value: "client" },
    { label: "Open Source Repository", value: "open_source" },
    { label: "Internal Tool", value: "internal_tool" },
    { label: "Business Application", value: "business_app" },
    { label: "Research / University Project", value: "research" },
    { label: "Team Sandbox / Testing Environment", value: "sandbox" },
  ];

  const handleRepoCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simple validation
    if (!name || !description || !repoType || !userRole) {
      showAlert("All fields are required!", "error");
      setLoading(false);
      return;
    }

    try {
      const body = { name, description, type: repoType, member_role: userRole };

      const data = await authPost(
        `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/repos/createRepo`,
        body
      );

      showAlert("Repo created successfully!", "success");
      setShowCreateRepoModal(false);

      // Update parent state
      setRepos((prev) => [data.repo, ...prev]);

      // Reset form
      setName("");
      setDescription("");
      setRepoType("");
      setUserRole("");
    } catch (err) {
      console.error(err);
      showAlert(err.message || "Failed to create repo", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="relative z-50 w-11/12 lg:w-1/3 px-8 lg:px-12 pt-6 lg:pt-8 pb-8 lg:pb-12 h-max rounded-xl bg-white dark:bg-darkBG"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <p className="dm-sans-regular text-lg lg:text-xl text-black dark:text-white mb-1">
        Create New Repo
      </p>
      <p className="dm-sans-light text-xs lg:text-sm text-black/50 dark:text-white/30 mb-4">
        Create a new repo, add secrets, and invite members.
      </p>

      <div className="flex flex-col gap-4 w-full">
        <TextInput
          label="Repo Name"
          placeholder="Repo Name"
          value={name}
          onChange={setName}
          icon={Folder}
        />

        <Select
          label="Repo Type"
          options={options}
          value={repoType}
          onChange={setRepoType}
          placeholder="Repo Type"
        />

        <TextInput
          label="Your Role/Title"
          placeholder="E.g. Software Engineer/Lead/Student"
          value={userRole}
          onChange={setUserRole}
          icon={Folder}
        />

        <TextInput
          multiline
          label="Description"
          placeholder="Description"
          value={description}
          onChange={setDescription}
          icon={FileText}
        />

        <Button
          onClick={handleRepoCreate}
          size="xl"
          variant="solid"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Repo"}
        </Button>
      </div>
    </motion.div>
  );
}
