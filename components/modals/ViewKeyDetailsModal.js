import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../context/alertContext";
import { Button } from "../buttons/Button";
import { KeySquare, FileText } from "lucide-react";
import { TextInput } from "../inputs/TextInput";
import { Select } from "../inputs/Select";
import { DatePicker } from "../inputs/DatePicker";

export default function ViewKeyDetailsModal({ keyData }) {
  const { showAlert } = useContext(AlertContext);
  const [formData, setFormData] = useState(keyData);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // Compare current formData with original keyData
    const changed = JSON.stringify(formData) !== JSON.stringify(keyData);
    setIsDirty(changed);
  }, [formData, keyData]);

  function formatDateTime(isoString) {
    if (!isoString) return "Unknown";
    const date = new Date(isoString);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString(undefined, options).replace(",", " at");
  }

  const secretTypeOptions = [
    { label: "API Key", value: "api_key" },
    { label: "OAuth Token", value: "oauth_token" },
    { label: "Client Secret", value: "client_secret" },
    { label: "Database Connection String", value: "db_connection" },
    { label: "SSH Private Key", value: "ssh_key" },
    { label: "Webhook Secret", value: "webhook_secret" },
    { label: "Cloud Storage Keypair", value: "cloud_keypair" },
    { label: "JWT Signing Key", value: "jwt_key" },
    { label: "Custom Secret", value: "custom_secret" },
  ];

  const handleSave = () => {
    showAlert("Changes saved successfully!", "success");
    // TODO: handle backend update call here
  };

  return (
    <motion.div
      className="relative z-50 w-11/12 lg:w-2/3 px-8 lg:px-12 pt-6 lg:pt-8 pb-8 lg:pb-12 h-max rounded-xl bg-white dark:bg-darkBG"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="dm-sans-regular text-lg lg:text-xl text-black dark:text-white">
            Viewing Secret - {keyData.keyName}
          </p>
          <p className="dm-sans-light text-xs lg:text-sm text-black/50 dark:text-white/30 mt-1">
            <span className="text-black">Current Version:</span>{" "}
            {keyData.version}
          </p>
          <div className="flex flex-col lg:flex-row gap-4 items-center mt-0.5 mb-3">
            <p className="dm-sans-light text-xs lg:text-xs text-black/50 dark:text-white/30">
              <span className="text-black">Last Modified:</span>{" "}
              {keyData.updatedBy} - {formatDateTime(keyData.lastUpdated)}
            </p>
            <p className="dm-sans-light text-xs lg:text-xs text-black/50 dark:text-white/30">
              <span className="text-black">Created:</span> {keyData.createdBy} -{" "}
              {formatDateTime(keyData.createdAt)}
            </p>
          </div>
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

      <div className="flex flex-col gap-4 w-full">
        <TextInput
          label="Key Name"
          placeholder="Key Name"
          value={formData.keyName}
          icon={KeySquare}
          onChange={(e) =>
            setFormData({ ...formData, keyName: e.target.value })
          }
        />

        <div className="flex flex-col lg:flex-row lg:gap-3">
          <Select
            label="Secret Type"
            required={true}
            placeholder="Secret Type"
            icon={KeySquare}
            options={secretTypeOptions}
            value={formData.secretType}
            onChange={(val) => setFormData({ ...formData, secretType: val })}
          />
          <DatePicker
            label={"Key Auto Kill Date"}
            date={formData.autoKillDate}
            onChange={(date) =>
              setFormData({ ...formData, autoKillDate: date })
            }
          />
        </div>

        <TextInput
          multiline={true}
          label="Description"
          placeholder="Description"
          value={formData.description}
          icon={FileText}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>
    </motion.div>
  );
}
