import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../context/alertContext";
import { useRouter } from "next/router";
import { Button } from "../buttons/Button";
import { TextInput } from "../inputs/TextInput";


export default function CreateQuestionModal({ setCreateQuestionModal }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState("");
  const { showAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);


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
    setCreateQuestionModal(false);
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
            Add Question
          </p>
          {/* <p className="dm-sans-light text-xs lg:text-sm text-black/50 dark:text-white/30 mt-1 mb-4">
            Build agents for your companies teams, employees, and customers.
          </p> */}
        </div>
        <Button
          onClick={() => setCreateQuestionModal(false)}
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
