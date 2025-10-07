import { ArrowRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function ChatInput({ value, setValue, onSend }) {
  const textareaRef = useRef(null);

  const handleInputChange = (e) => {
    setValue(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // grow
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  // Auto-expand on load
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="w-full mt-3 rounded-xl bg-white dark:bg-stone-800 px-4 pr-2 py-2 flex items-center gap-2 border border-stone-200 dark:border-stone-700">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 resize-none overflow-hidden max-h-60 dm-sans-regular text-sm bg-transparent focus:outline-none text-black dark:text-white placeholder:text-stone-400"
      />
      <button
        onClick={onSend}
        className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full hover:opacity-90"
      >
        <ArrowRight size={15} />
      </button>
    </div>
  );
}
