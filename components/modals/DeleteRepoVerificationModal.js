import { motion } from "framer-motion";
import { Button } from "../buttons/Button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { TextInput } from "../inputs/TextInput";
import { useState } from "react";

export default function DeleteRepoVerificationModal({
  repoName,
  onClose,
  onDelete,
  deleteLoading,
}) {
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isConfirmed = confirmationText === repoName;

  return (
    <motion.div
      className="relative z-50 w-11/12 lg:w-1/2 xl:w-1/3 px-8 xl:px-12 pt-6 xl:pt-8 pb-8 xl:pb-12 h-max rounded-xl bg-white dark:bg-darkBG border border-stone-200 dark:border-stone-700"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <button
        onClick={onClose}
        className="text-black dark:text-white opacity-30 group hover:opacity-90 transition-all duration-500 ease-in-out dm-sans-regular text-xs flex flex-row items-center gap-1"
      >
        <ArrowLeft
          className="group-hover:-translate-x-1 transition-all duration-500"
          size={12}
        />
        Back
      </button>

      <div className="flex mt-2 flex-col justify-between w-full items-start">
        <div className="flex flex-row items-center gap-2">
          {/* <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
            <AlertTriangle
              className="text-red-600 dark:text-red-400"
              size={20}
            />
          </div> */}
          <p className="dm-sans-medium text-lg xl:text-xl text-black dark:text-white">
            Delete Repository
          </p>
        </div>

        <div className="mt-4 mb-6 space-y-3">
          <p className="dm-sans-regular text-sm text-black dark:text-white">
            You are about to delete{" "}
            <span className="dm-sans-medium text-red-600 dark:text-red-400">
              {repoName}
            </span>
          </p>

          <p className="dm-sans-light text-xs lg:text-sm text-black/60 dark:text-white/50">
            This action cannot be undone. This will permanently delete the
            repository, all secrets, access keys, and remove all member access.
          </p>

          <div className="pt-2">
            <label className="dm-sans-regular text-xs text-black/70 dark:text-white/60 mb-2 block">
              Type{" "}
              <span className="dm-sans-medium text-black dark:text-white">
                {repoName}
              </span>{" "}
              to confirm:
            </label>
            <TextInput
              placeholder="Enter repository name"
              value={confirmationText}
              onChange={setConfirmationText}
              autoFocus
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-3 justify-end">
        <Button
          onClick={onClose}
          size="sm"
          variant="secondary"
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          onClick={onDelete}
          size="sm"
          loading={deleteLoading}
          variant="destructive"
          disabled={!isConfirmed || isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Repository"}
        </Button>
      </div>
    </motion.div>
  );
}
