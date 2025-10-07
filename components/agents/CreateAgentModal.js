import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../context/alertContext";
import { useRouter } from "next/router";
import { Button } from "../buttons/Button";
import {
  Bot,
  BotMessageSquare,
  Briefcase,
  Building,
  Building2,
  Building2Icon,
  Mail,
  MapPin,
} from "lucide-react";
import { TextInput } from "../inputs/TextInput";
import { useProfile } from "../../context/ProfileContext";
import { TagInput } from "../inputs/TagInput";
import { Select } from "../inputs/Select";
import { useRecords } from "../../hooks/useRecords";

export default function CreateAgentModal({ setCreateAgentModal }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [selectVisibility, setSelectVisibility] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState("");
  const { showAlert } = useContext(AlertContext);
  const { setProfile, profile } = useProfile();
  const [loading, setLoading] = useState(false);

  const visibilityOptions = [
    { label: "Public", value: "Public" },
    { label: "Internal", value: "Internal" },
  ];

  useEffect(() => {
    if (name != "") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name]);

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setError("User not authenticated");
      showAlert("Please log in again.", "error");
      setLoading(false);
      return;
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("assistants")
      .insert([
        {
          name: name,
          description: description,
          assistant_id: null,
          company_id: profile?.company_id,
          visibility: selectVisibility,
          tags: tags,
          last_updated: now,
          status: "Draft",
        },
      ])
      .select()
      .single();

    if (error) {
      showAlert(error.message, "error");
      setError(error.message);
      setLoading(false);
      return;
    }

    console.log(data);
    showAlert("Assistant created!", "success");
    setLoading(false);
    const cacheKey = `cached_assistants_company_id:${profile?.company_id}`;
    const existing = localStorage.getItem(cacheKey);
    router.push(`/app/agents/${data.id}`);
    try {
      const existingParsed = existing ? JSON.parse(existing) : [];
      const updated = [data, ...existingParsed];
      localStorage.setItem(cacheKey, JSON.stringify(updated));
    } catch (err) {
      console.warn("Failed to update cache:", err);
    }
    setCreateAgentModal(false);
  };

  return (
    <motion.div
      className="relative z-50 w-11/12 lg:w-3/5 xl:w-1/3 px-8 lg:px-12 pt-6 lg:pt-8 pb-8 lg:pb-12 h-max rounded-xl bg-white dark:bg-darkBG"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex flex-row justify-between w-full items-start">
        <div className="flex flex-col">
          <p className="dm-sans-regular text-lg lg:text-xl text-black dark:text-white">
            Create Agent
          </p>
          <p className="dm-sans-light text-xs lg:text-sm text-black/50 dark:text-white/30 mt-1 mb-4">
            Build agents for your companies teams, employees, and customers.
          </p>
        </div>
        <Button
          onClick={() => setCreateAgentModal(false)}
          size="sm"
          variant="solid"
        >
          Cancel
        </Button>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <TextInput
          label="Agent Name"
          placeholder="Agent Name"
          value={name}
          onChange={setName}
        />
        <TextInput
          label="Agent Description"
          placeholder="Agent Description"
          value={description}
          multiline={true}
          onChange={setDescription}
        />
        <TagInput
          label="Agent Tags"
          tags={tags}
          onChange={setTags}
          placeholder="E.g. Sales, HR, IT, etc."
        />
        <Select
          label="Agent Visibility"
          options={visibilityOptions}
          value={selectVisibility}
          multiple={false}
          onChange={setSelectVisibility}
        />
        <Button
          size="xl"
          loading={loading}
          variant="solid"
          onClick={handleCreateAgent}
          disabled={disabled}
        >
          Create Agent
        </Button>
      </div>
    </motion.div>
  );
}
