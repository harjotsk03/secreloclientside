import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../context/alertContext";
import { Button } from "../buttons/Button";
import {
  Trash,
  X,
} from "lucide-react";
import { useRouter } from "next/router";

export default function DeleteQuestionModal({ setDeleteQuestionModal, question }) {
  const { showAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleDeleteAgent = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      showAlert("Please log in again.", "error");
      setLoading(false);
      return;
    }

    console.log("Deleting agent with ID:", agent.id);

    try {
      const token = (await supabase.auth.getSession()).data.session
        .access_token;

      const response = await fetch(
        `${backendUrl}}/api/assistant/delete/${agent.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      // If assistant wasn't deployed, that's okay — continue
      if (
        !response.ok &&
        result?.error !== "Assistant has not been deployed to OpenAI"
      ) {
        throw new Error(
          result?.error || "Failed to delete assistant from OpenAI."
        );
      }

      console.log(
        "✅ OpenAI deletion skipped or succeeded:",
        result.message || result.error
      );
    } catch (err) {
      console.error("❌ Error deleting assistant from OpenAI:", err.message);
      showAlert(
        "Failed to delete assistant from OpenAI. Cancelled local deletion.",
        "error"
      );
      setLoading(false);
      return;
    }

    // ✅ Step 2: Delete from Supabase if OpenAI deletion succeeded
    const { error, data } = await supabase
      .from("assistants")
      .delete()
      .eq("id", agent.id)
      .select("*");

    if (error) {
      console.error("Supabase delete error:", error);
      showAlert(error.message, "error");
      setLoading(false);
      return;
    }

    console.log("Deleted row:", data);
    showAlert("Agent deleted successfully.", "success");
    router.push("/app/agents/blueprints");

    // 🔄 Update cache
    try {
      const cacheKey = `cached_assistants_company_id:${agent.company_id}`;
      const existing = localStorage.getItem(cacheKey);
      if (existing) {
        const existingParsed = JSON.parse(existing);
        const updated = existingParsed.filter((a) => a.id !== agent.id);
        localStorage.setItem(cacheKey, JSON.stringify(updated));
      }
    } catch (err) {
      console.warn("Failed to update cache:", err);
    }

    setLoading(false);
    setDeleteAgentModal(false);
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
          <p className="dm-sans-medium text-lg lg:text-xl text-black dark:text-white">
            Delete Agent
          </p>
          <p className="dm-sans-light text-xs lg:text-base text-black/50 dark:text-white/70 mt-1 mb-4">
            Are you sure you want to delete {agent.name}? This action is
            permanent and cannot be undone. All threads and data with this agent
            will be permanently erased as well.
          </p>
        </div>
      </div>

      <div className="flex flex-row gap-4 w-full justify-end mt-2">
        <Button
          size="md"
          variant="solid"
          icon={X}
          onClick={() => setDeleteAgentModal(false)}
        >
          Cancel
        </Button>
        <Button
          size="md"
          loading={loading}
          variant="destructive"
          icon={Trash}
          onClick={handleDeleteAgent}
        >
          Delete Agent
        </Button>
      </div>
    </motion.div>
  );
}
