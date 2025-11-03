import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../context/alertContext";
import { Button } from "../buttons/Button";
import { Mail, User, KeySquare } from "lucide-react";
import { TextInput } from "../inputs/TextInput";
import { Select } from "../inputs/Select";
import { DatePicker } from "../inputs/DatePicker";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";

export default function ViewMemberDetailsModal({ memberData }) {
  const { showAlert } = useContext(AlertContext);
  const { authPut } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    member_role: "",
    member_permissions: "",
    created_at: "",
    joined_at: "",
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleUpdateMember = async () => {
    console.log(memberData);
    console.log(formData);
    const body = {
      permission: formData.member_permissions,
      role: formData.member_role,
    };

    console.log(body);

    const data = await authPut(
      `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/repos/updateUserPermissions/${memberData.user_id}/${id}`,
      body
    );

    console.log(data);

    if (data.success == true) {
      showAlert(
        `Member "${formData.full_name}" updated successfully.`,
        "success"
      );
      setIsEditing(false);
      setIsDirty(false);
    } else {
      showAlert(`${data.error}`, "error");
    }
  };

  function handleCancel() {
    // Revert to original data
    setFormData({
      full_name: memberData.full_name || "",
      email: memberData.email || "",
      member_role: memberData.member_role || "",
      member_permissions: memberData.member_permissions || "",
      created_at: memberData.created_at || "",
      joined_at: memberData.joined_at || "",
    });
    setIsEditing(false);
    setIsDirty(false);
  }

  const permissionOptions = [
    { label: "Owner", value: "owner" },
    { label: "Admin", value: "admin" },
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
            <span className="text-black dark:text-white">Joined:</span>{" "}
            {formatDateTime(memberData.joined_at)}
          </p>
        </div>

        {/* Right-side Buttons */}
        <div className="flex gap-2 items-center">
          {isEditing ? (
            <>
              <motion.div
                animate={{
                  opacity: isDirty ? 1 : 0.6,
                  scale: isDirty ? 1 : 0.97,
                }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="solid"
                  size="sm"
                  disabled={!isDirty}
                  onClick={handleUpdateMember}
                >
                  Save
                </Button>
              </motion.div>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Form Section */}
      <div className="flex flex-col gap-4 w-full">
        <TextInput
          label="Full Name"
          placeholder="Full Name"
          value={formData.full_name}
          disabled={true}
          icon={User}
        />

        <TextInput
          label="Email"
          placeholder="Email"
          value={formData.email}
          disabled={true}
          icon={Mail}
        />

        <TextInput
          label="Role / Position"
          placeholder="e.g. Frontend Developer"
          value={formData.member_role}
          icon={KeySquare}
          disabled={!isEditing}
          onChange={(val) => setFormData({ ...formData, member_role: val })}
        />

        <Select
          label="Permission Level"
          options={[
            {
              label: "Owner",
              value: "owner",
              disabled: memberData?.member_permissions !== "owner",
            },
            { label: "Admin", value: "admin" },
            { label: "Read", value: "read" },
          ]}
          value={formData.member_permissions}
          disabled={!isEditing}
          onChange={(val) =>
            setFormData({ ...formData, member_permissions: val })
          }
        />

        <DatePicker
          disabled={true}
          label="Joined At"
          date={formData.joined_at}
          onChange={(date) => setFormData({ ...formData, joined_at: date })}
        />
      </div>
    </motion.div>
  );
}
