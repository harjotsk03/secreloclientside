import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../context/alertContext";
import { useRouter } from "next/router";
import { Button } from "../buttons/Button";
import { Briefcase, Building, Building2, Building2Icon, FileText, Folder, Mail, MapPin } from "lucide-react";
import { TextInput } from "../inputs/TextInput";

export default function CreateNewRepoModal() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState("");
  const { showAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);

  return (
    <motion.div
      className="relative z-50 w-11/12 lg:w-1/3 px-8 lg:px-12 pt-6 lg:pt-8 pb-8 lg:pb-12 h-max rounded-xl bg-white dark:bg-darkBG"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex flex-col justify-between w-full items-start">
        <div className="flex flex-col">
          <p className="dm-sans-regular text-lg lg:text-xl text-black dark:text-white">
            Create New Repo
          </p>
        </div>
        <p className="dm-sans-light text-xs lg:text-sm text-black/50 dark:text-white/30 mt-1 mb-4">
          Create a new repo, add secrets, and invite members.
        </p>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <TextInput
          label="Repo Name"
          placeholder="Repo Name"
          value={name}
          onChange={setName}
          icon={Folder}
          // error={emailError}
        />
        <TextInput
          multiline={true}
          label="Description"
          placeholder="Description"
          value={industry}

          onChange={setIndustry}
          icon={FileText}
          // error={emailError}
        />
        <Button
          onClick={() => {
            showAlert("LOL");
          }}
          size="xl"
          variant="solid"
        >
          Create company
        </Button>
      </div>
    </motion.div>
  );
}
