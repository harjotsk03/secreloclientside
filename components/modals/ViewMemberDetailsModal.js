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
  const [formData, setFormData] = useState(memberData);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(memberData);
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
    { label: "Owner", value: "Owner" },
    { label: "Admin", value: "Admin" },
    { label: "Write", value: "Write" },
    { label: "Read", value: "Read" },
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
            Viewing Member — {memberData.name}
          </p>
          <p className="dm-sans-light text-xs lg:text-sm text-black/50 dark:text-white/30 mt-1">
            <span className="text-black">Joined:</span>{" "}
            {formatDateTime(memberData.joinedAt)}
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
          value={formData.name}
          icon={User}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <TextInput
          label="Email Address"
          placeholder="Email Address"
          value={formData.email}
          icon={Mail}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <TextInput
          label="Role / Position"
          placeholder="e.g. Frontend Developer"
          value={formData.role}
          icon={KeySquare}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        />

        <Select
          disabled={memberData.permission == "Owner"}
          label="Permission Level"
          required={true}
          placeholder="Select permission"
          options={permissionOptions}
          value={formData.permission}
          onChange={(val) => setFormData({ ...formData, permission: val })}
        />

        <DatePicker
          disabled={true}
          label="Joined At"
          date={formData.joinedAt}
          onChange={(date) => setFormData({ ...formData, joinedAt: date })}
        />
      </div>
    </motion.div>
  );
}
