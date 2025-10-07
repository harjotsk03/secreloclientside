import { useState, useEffect, useRef, useContext } from "react";
import { TextInput } from "../inputs/TextInput";
import { Button } from "../buttons/Button";
import { FileUpload } from "../inputs/FileUpload"; // assumes path
import { Upload } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { AlertContext } from "../../context/alertContext";

export const KnowledgeTab = ({ agent }) => {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [fallbackMessage, setFallbackMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { showAlert } = useContext(AlertContext);

  const initialDataRef = useRef(null);

  const updateAssistantCache = (updates) => {
    const cacheKey = `cached_assistants_company_id:${agent.company_id}`;
    const cached = localStorage.getItem(cacheKey);

    if (!cached) return;

    try {
      const parsed = JSON.parse(cached);
      const updatedList = parsed.map((a) =>
        a.id === agent.id ? { ...a, ...updates } : a
      );
      localStorage.setItem(cacheKey, JSON.stringify(updatedList));
    } catch (err) {
      console.error("Failed to update cached assistant:", err);
    }
  };

  useEffect(() => {
    if (agent) {
      const initialData = {
        systemPrompt: agent.system_prompt || "",
        welcomeMessage: agent.welcome_message || "",
        fallbackMessage: agent.fallback_message || "",
        uploadedFiles: [], // this would come from server eventually
      };
      initialDataRef.current = initialData;

      setSystemPrompt(initialData.systemPrompt);
      setWelcomeMessage(initialData.welcomeMessage);
      setFallbackMessage(initialData.fallbackMessage);
      setUploadedFiles(initialData.uploadedFiles);
    }
  }, [agent]);

  const isEqual = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.length === b.length && a.every((val, i) => val === b[i]);
    }
    return a === b;
  };

  const handleSave = async () => {
    if (!agent?.id) return;

    const updates = {};
    if (welcomeMessage !== agent.welcome_message)
      updates.welcome_message = welcomeMessage;
    if (fallbackMessage !== agent.fallback_message)
      updates.fallback_message = fallbackMessage;

    updates.status = "Draft";
    updates.last_updated = new Date().toISOString();

    const { data, error } = await supabase
      .from("assistants")
      .update(updates)
      .eq("id", agent.id)
      .select()
      .maybeSingle();

    if (error) {
      showAlert("Failed to update assistant prompts.", "error");
      console.error("Update error:", error.message);
    } else {
      showAlert("Assistant prompts updated.", "success");
      updateAssistantCache(updates);
      initialDataRef.current = {
        ...initialDataRef.current,
        ...updates,
      };
    }
  };

  const handleCancel = () => {
    if (initialDataRef.current) {
      setWelcomeMessage(initialDataRef.current.welcomeMessage);
      setFallbackMessage(initialDataRef.current.fallbackMessage);
    }
  };

  const formChanged = initialDataRef.current
    ? !(
        isEqual(systemPrompt, initialDataRef.current.systemPrompt) &&
        isEqual(welcomeMessage, initialDataRef.current.welcomeMessage) &&
        isEqual(fallbackMessage, initialDataRef.current.fallbackMessage)
      )
    : false;

  return (
    <div className="flex flex-col gap-2 w-full pt-4 fade-in-down">
      {/* Knowledge Base Upload */}
      <div className="flex flex-col bg-white dark:bg-darkBG rounded-xl mt-4 border border-stone-300 dark:border-stone-700/50">
        <div className="px-6 py-4 flex flex-row w-full gap-4">
          <p className="poppins-medium text-lg text-black dark:text-white">
            Knowledge Base
          </p>
        </div>
        <div className="h-[1px] w-full bg-stone-300 dark:bg-stone-700/50" />
        <div className="px-6 py-4 flex flex-col lg:flex-row w-full gap-4">
          <FileUpload
            label="Upload Knowledge Documents"
            accept=".pdf,.txt,.doc,.docx"
            multiple
            onFileSelect={(files) => {
              // append to uploadedFiles for display or tracking
              setUploadedFiles((prev) => [...prev, ...files]);
            }}
          />
        </div>
      </div>

      {/* Uploaded Documents */}
      {uploadedFiles.length > 0 && (
        <div className="flex flex-col bg-white dark:bg-darkBG rounded-xl mt-4 border border-stone-300 dark:border-stone-700/50 p-6">
          <p className="poppins-medium text-lg text-black dark:text-white mb-2">
            Uploaded Documents
          </p>
          <div className="space-y-2">
            {uploadedFiles.map((file, idx) => (
              <div
                key={idx}
                className="text-sm text-black dark:text-white border border-stone-300 dark:border-stone-600 rounded-lg px-3 py-2"
              >
                {file.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Prompts / Messages */}
      <div className="flex flex-col bg-white dark:bg-darkBG rounded-xl mt-4 border border-stone-300 dark:border-stone-700/50">
        <div className="px-6 py-4 flex flex-row w-full gap-4">
          <p className="poppins-medium text-lg text-black dark:text-white">
            Custom Prompts
          </p>
        </div>
        <div className="h-[1px] w-full bg-stone-300 dark:bg-stone-700/50" />
        <div className="px-6 py-4 flex flex-col lg:flex-row w-full gap-4">
          <TextInput
            placeholder=" - "
            value={welcomeMessage}
            multiline
            label="Welcome Message"
            onChange={setWelcomeMessage}
          />
          <TextInput
            placeholder=" - "
            value={fallbackMessage}
            multiline
            label="Fallback Response"
            onChange={setFallbackMessage}
          />
        </div>
        <div className="h-[1px] w-full bg-stone-300 dark:bg-stone-700/50" />
        <div className="px-6 py-4 flex flex-row justify-end gap-4">
          <div className="flex flex-row justify-end gap-4">
            <Button
              variant="primary"
              disabled={!formChanged}
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              variant="ghost"
              disabled={!formChanged}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
