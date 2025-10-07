import { useState, useEffect, useRef, useContext } from "react";
import { TextInput } from "../inputs/TextInput";
import { Button } from "../buttons/Button";
import { Select } from "../inputs/Select";
import { TagInput } from "../inputs/TagInput";
import { supabase } from "../../lib/supabaseClient";
import { AlertContext } from "../../context/alertContext";

export const GeneralTab = ({ agent }) => {
  const { showAlert } = useContext(AlertContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectVisibility, setSelectVisibility] = useState("");
  const [selectTone, setSelectTone] = useState("");
  const [tags, setTags] = useState([]);

  const initialDataRef = useRef(null);

  useEffect(() => {
    if (agent) {
      const initialData = {
        name: agent.name || "",
        description: agent.description || "",
        systemPrompt: agent.system_prompt || "",
        visibility: agent.visibility || "",
        tone: agent.tone || "",
        tags: agent.tags || [],
      };
      initialDataRef.current = initialData;

      setName(initialData.name);
      setDescription(initialData.description);
      setSystemPrompt(initialData.systemPrompt);
      setSelectVisibility(initialData.visibility);
      setSelectTone(initialData.tone);
      setTags(initialData.tags);
    }
  }, [agent]);

  const isEqual = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.length === b.length && a.every((val, i) => val === b[i]);
    }
    return a === b;
  };

  const basicChanged = initialDataRef.current
    ? !(
        isEqual(name, initialDataRef.current.name) &&
        isEqual(description, initialDataRef.current.description) &&
        isEqual(tags, initialDataRef.current.tags)
      )
    : false;

  const personalityChanged = initialDataRef.current
    ? !(
        isEqual(systemPrompt, initialDataRef.current.systemPrompt) &&
        isEqual(selectTone, initialDataRef.current.tone)
      )
    : false;

  const visibilityOptions = [
    { label: "Public", value: "Public" },
    { label: "Internal", value: "Internal" },
  ];

  const toneOptions = [
    { label: "Professional", value: "Professional" },
    { label: "Friendly", value: "Friendly" },
    { label: "Casual", value: "Casual" },
    { label: "Formal", value: "Formal" },
  ];

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

  const handleSaveBasic = async () => {
    if (!agent?.id) return;

    const updates = {};
    if (name !== agent.name) updates.name = name;
    if (description !== agent.description) updates.description = description;
    if (!isEqual(tags, agent.tags)) updates.tags = tags;
    if (selectVisibility !== agent.visibility)
      updates.visibility = selectVisibility;

    updates.status = "Draft";
    updates.last_updated = new Date().toISOString();

    if (Object.keys(updates).length > 0) {
      const { data, error } = await supabase
        .from("assistants")
        .update(updates)
        .eq("id", agent.id)
        .select()
        .maybeSingle();

      if (error) {
        console.error("Failed to update agent basic info:", error);
        showAlert("Failed to update basic info.", "error");
      } else {
        updateAssistantCache(updates);

        showAlert("Agent basic info updated.", "success");
        initialDataRef.current = {
          ...initialDataRef.current,
          ...updates,
        };
      }
    }
  };

  const handleCancelBasic = () => {
    if (initialDataRef.current) {
      setName(initialDataRef.current.name);
      setDescription(initialDataRef.current.description);
      setTags(initialDataRef.current.tags);
      setSelectVisibility(initialDataRef.current.visibility);
    }
  };

  const handleSavePersonality = async () => {
    if (!agent?.id) return;

    const updates = {};
    if (systemPrompt !== agent.system_prompt)
      updates.system_prompt = systemPrompt;
    if (selectTone !== agent.tone) updates.tone = selectTone;

    updates.status = "Draft";
    updates.last_updated = new Date().toISOString();

    if (Object.keys(updates).length > 0) {
      const { data, error } = await supabase
        .from("assistants")
        .update(updates)
        .eq("id", agent.id)
        .select()
        .maybeSingle();

      if (error) {
        console.error("Failed to update agent personality:", error.message);
        showAlert("Failed to update personality.", "error");
      } else {
        updateAssistantCache(updates);
        showAlert("Agent personality updated.", "success");
        initialDataRef.current = {
          ...initialDataRef.current,
          ...updates,
        };
      }
    }
  };

  const handleCancelPersonality = () => {
    if (initialDataRef.current) {
      setSystemPrompt(initialDataRef.current.systemPrompt);
      setSelectTone(initialDataRef.current.tone);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full pt-4 fade-in-down">
      {/* Basic Information Block */}
      <div className="flex flex-col bg-lightBG dark:bg-darkBG rounded-xl mt-4 border border-stone-300 dark:border-stone-700/50">
        <div className="px-6 py-4 flex flex-row w-full gap-4">
          <p className="dm-sans-medium text-lg text-black dark:text-white">
            Basic Information
          </p>
        </div>
        <div className="h-[1px] w-full bg-stone-300 dark:bg-stone-700/50" />
        <div className="px-6 py-4 flex flex-col w-full gap-4">
          <TextInput
            placeholder=" - "
            value={name}
            label="Name"
            onChange={setName}
          />
          <TextInput
            placeholder=" - "
            value={description}
            multiline={true}
            label="Description"
            onChange={setDescription}
          />
          <TagInput
            label="Agent Tags"
            tags={tags}
            onChange={setTags}
            placeholder="E.g. Sales, HR, IT, etc."
          />
        </div>
        <div className="h-[1px] w-full bg-stone-300 dark:bg-stone-700/50" />
        <div className="px-6 py-4 flex flex-row justify-end gap-4">
          <Button
            onClick={handleSaveBasic}
            variant="primary"
            disabled={!basicChanged}
          >
            Save
          </Button>
          <Button
            variant="ghost"
            disabled={!basicChanged}
            onClick={handleCancelBasic}
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Personality Block */}
      <div className="flex flex-col bg-lightBG dark:bg-darkBG rounded-xl mt-4 border border-stone-300 dark:border-stone-700/50">
        <div className="px-6 py-4 flex flex-row w-full gap-4">
          <p className="dm-sans-medium text-lg text-black dark:text-white">
            Agent Personality
          </p>
        </div>
        <div className="h-[1px] w-full bg-stone-300 dark:bg-stone-700/50" />
        <div className="px-6 py-4 flex flex-col w-full gap-4">
          <Select
            label="Tone & Style"
            options={toneOptions}
            placeholder=" - "
            value={selectTone}
            multiple={false}
            onChange={setSelectTone}
          />
          <TextInput
            placeholder=" - "
            value={systemPrompt}
            multiline={true}
            label="System Prompt"
            onChange={setSystemPrompt}
          />
        </div>
        <div className="h-[1px] w-full bg-stone-300 dark:bg-stone-700/50" />
        <div className="px-6 py-4 flex flex-row justify-end gap-4">
          <Button
            onClick={handleSavePersonality}
            variant="primary"
            disabled={!personalityChanged}
          >
            Save
          </Button>
          <Button
            variant="ghost"
            disabled={!personalityChanged}
            onClick={handleCancelPersonality}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
