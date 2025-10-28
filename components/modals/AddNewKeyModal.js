import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { KeySquare, Folder } from "lucide-react";
import { Button } from "../buttons/Button";

export default function AddNewKeyModal({
  setShowCreateKeyModal,
  setShowCreateKeyModalSingle,
}) {
  const router = useRouter();

  const handleSelect = (mode) => {
    if (mode === "multi") {
      router.push("/upload-env");
    } else {
      setShowCreateKeyModal(false);
      setShowCreateKeyModalSingle(true);
    }
  };

  return (
    <motion.div
      className="relative z-50 w-11/12 lg:w-1/3 px-8 lg:px-12 pt-8 pb-10 rounded-2xl bg-white dark:bg-darkBG shadow-xl"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <p className="dm-sans-regular text-lg lg:text-xl text-black dark:text-white">
          Add a New Secret
        </p>
        <p className="dm-sans-light text-xs lg:text-sm text-black/50 dark:text-white/40 mt-2 max-w-sm">
          Choose how you want to add your secrets. You can add one manually or
          upload multiple from an environment file.
        </p>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Single Secret */}
        <motion.button
          onClick={() => handleSelect("single")}
          className="flex flex-col items-center justify-center gap-1 p-6 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <KeySquare className="w-7 h-7 text-black/80 dark:text-white/80" />
          <span className="dm-sans-regular text-sm text-black dark:text-white mt-3">
            Single Creation
          </span>
          <span className="dm-sans-light text-xs text-stone-500 dark:text-white">
            Upload one secret to the repo.
          </span>
        </motion.button>

        {/* Multi Secret Upload */}
        <motion.button
          onClick={() => handleSelect("multi")}
          className="flex flex-col items-center justify-center gap-1 p-6 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <Folder className="w-7 h-7 text-black/80 dark:text-white/80" />
          <span className="dm-sans-regular text-sm text-black dark:text-white mt-3">
            Multi Upload
          </span>
          <span className="dm-sans-light text-xs text-stone-500 dark:text-white">
            Upload multiple secrets from a .env file.
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
