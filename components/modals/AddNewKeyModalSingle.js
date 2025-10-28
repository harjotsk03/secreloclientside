import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../context/alertContext";
import { useRouter } from "next/router";
import { Button } from "../buttons/Button";
import {
  ArrowLeft,
  Briefcase,
  Building,
  Building2,
  Building2Icon,
  FileText,
  Folder,
  KeySquare,
  Mail,
  MapPin,
} from "lucide-react";
import { TextInput } from "../inputs/TextInput";
import { Select } from "../inputs/Select";
import { DatePicker } from "../inputs/DatePicker";

export default function AddNewKeyModalSingle({
  setShowCreateKeyModal,
  setShowCreateKeyModalSingle,
}) {
  const router = useRouter();
  const { showAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);

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

  return (
    <motion.div
      className="relative z-50 w-11/12 lg:w-1/3 px-8 lg:px-12 pt-6 lg:pt-8 pb-8 lg:pb-12 h-max rounded-xl bg-white dark:bg-darkBG"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <button
        onClick={() => {
          setShowCreateKeyModalSingle(false);
          setShowCreateKeyModal(true);
        }}
        className="text black dark:text-white opacity-30 group hover:opacity-90 transition-all duration-500 ease-in-out dm-sans-regular text-xs flex flex-row items-center gap-1"
      >
        <ArrowLeft
          className="group-hover:-translate-x-1 transition-all duration-500"
          size={12}
        />{" "}
        Back
      </button>
      <div className="flex mt-2 flex-col justify-between w-full items-start">
        <div className="flex flex-col">
          <p className="dm-sans-regular text-lg lg:text-xl text-black dark:text-white">
            Adding New Secret
          </p>
        </div>
        <p className="dm-sans-light text-xs lg:text-sm text-black/50 dark:text-white/30 mt-1 mb-4">
          Secure and add your secret to share with repo members.
        </p>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <TextInput
          label="Secret Name"
          required={true}
          placeholder="Secret Name"
          // error={emailError}
        />
        <div className="flex flex-col lg:flex-row lg:gap-2">
          <Select
            label="Secret Type"
            required={true}
            placeholder="Secret Type"
            options={secretTypeOptions}
            // error={emailError}
          />
          <DatePicker label={"Key Auto Kill Date"} />
        </div>
        <TextInput
          multiline={true}
          label="Description"
          placeholder="Description"
          // error={emailError}
        />
        <TextInput
          required={true}
          label="Secret"
          placeholder="e.g. sk-xxxxxxxxxxxxxxxx"
          // error={emailError}
        />
        <Button
          onClick={() => {
            showAlert("LOL");
          }}
          size="xl"
          variant="solid"
        >
          Create Secret
        </Button>
      </div>
    </motion.div>
  );
}
