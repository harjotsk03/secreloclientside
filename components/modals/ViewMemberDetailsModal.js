import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../context/alertContext";
import { Button } from "../buttons/Button";
import { Mail, User, Calendar, KeySquare } from "lucide-react";
import { TextInput } from "../inputs/TextInput";
import { Select } from "../inputs/Select";
import { DatePicker } from "../inputs/DatePicker";

export default function ViewMemberDetailsModal({ memberData }) {
  const { showAlert } = useContext(AlertContext);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    member_role: "",
    member_permissions: "",
    created_at: "",
    joined_at: "",
  });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (memberData) {
      setFormData({
        full_name: memberData.full_name || "",
        email: memberData.email || "",
        member_role: memberData.member_role || "",
        member_permissions: memberData.member_permissions || "",
        created_at: memberData.created_at || "",
        joined_at: memberData.joined_at || "",
      });
    }
  }, [memberData]);

  useEffect(() => {
    if (!memberData) return;

    const changed =
      formData.full_name !== memberData.full_name ||
      formData.email !== memberData.email ||
      formData.member_role !== memberData.member_role ||
      formData.member_permissions !== memberData.member_permissions;

    setIsDirty(changed);
  }, [formData, memberData]);
  function formatDateTime(isoString) {
    if (!isoString) return "Unknown";
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  function handleSave() {
    showAlert(`Member "${formData.name}" updated successfully.`);
    console.log("Updated member:", formData);
  }

  const permissionOptions = [
    { label: "Owner", value: "owner" },
    { label: "Admin", value: "admin" },
    { label: "Write", value: "write" },
    { label: "Read", value: "read" },
  ];

  return (
    <motion.div
      className="relative z-50 w-11/12 lg:w-2/3 px-8 lg:px-12 pt-6 lg:pt-8 pb-8 lg:pb-12 h-max rounded-xl bg-white dark:bg-darkBG"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="dm-sans-regular text-lg lg:text-xl text-black dark:text-white">
            Viewing Member — {memberData.full_name}
          </p>
          <p className="dm-sans-light text-xs lg:text-sm text-black/50 dark:text-white/30 mt-1">
            <span className="text-black">Joined:</span>{" "}
            {formatDateTime(memberData.joined_at)}
          </p>
        </div>

        <motion.div
          animate={{ opacity: isDirty ? 1 : 0.6, scale: isDirty ? 1 : 0.97 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="solid"
            size="sm"
            disabled={!isDirty}
            onClick={handleSave}
          >
            Save
          </Button>
        </motion.div>
      </div>

      {/* Form Section */}
      <div className="flex flex-col gap-4 w-full">
        <TextInput
          label="Full Name"
          placeholder="Full Name"
          value={formData.full_name}
          icon={User}
          onChange={(val) => setFormData({ ...formData, full_name: val })}
        />

        <TextInput
          label="Email Address"
          placeholder="Email Address"
          value={formData.email}
          icon={Mail}
          onChange={(val) => setFormData({ ...formData, email: val })}
        />

        <TextInput
          label="Role / Position"
          placeholder="e.g. Frontend Developer"
          value={formData.member_role}
          icon={KeySquare}
          onChange={(val) => setFormData({ ...formData, member_role: val })}
        />

        <Select
          disabled={memberData.member_permissions == "Owner"}
          label="Permission Level"
          required={true}
          placeholder="Select permission"
          options={permissionOptions}
          value={formData.member_permissions}
          onChange={(val) =>
            setFormData({ ...formData, member_permissions: val })
          }
        />

        <DatePicker
          disabled={true}
          label="Joined At"
          date={formData.joined_at}
          onChange={(date) => setFormData({ ...formData, joinedAt: date })}
        />
      </div>
    </motion.div>
  );
}
