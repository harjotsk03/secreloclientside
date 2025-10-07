import { useState } from "react";
import { format, setHours, setMinutes } from "date-fns";
import { DayPicker } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { CustomSelect } from "./CustomSelect";

export function DateTimePicker({ label, required = false, date, setDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const initialHours = date ? date.getHours() % 12 || 12 : 12;
  const initialMinutes = date ? date.getMinutes() : 0;
  const initialPeriod = date ? (date.getHours() >= 12 ? "PM" : "AM") : "AM";

  const [selectedTime, setSelectedTime] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    period: initialPeriod,
  });

  const handleDateSelect = (selectedDate) => {
    if (!selectedDate) return;
    const fullDate = combineDateTime(selectedDate, selectedTime);
    setDate(fullDate);
    setIsOpen(false);
  };

  const handleTimeChange = (type, value) => {
    const updatedTime = {
      ...selectedTime,
      [type]: type === "minutes" || type === "hours" ? parseInt(value) : value,
    };
    setSelectedTime(updatedTime);
    if (date) {
      const updatedDate = combineDateTime(date, updatedTime);
      setDate(updatedDate);
    }
  };

  const combineDateTime = (baseDate, time) => {
    let hours = time.hours % 12;
    if (time.period === "PM") hours += 12;
    return setHours(setMinutes(baseDate, time.minutes), hours);
  };

  return (
    <div className="relative w-full">
      <div className="flex flex-row justify-between items-end">
        {label && (
          <label className="block text-xs lg:text-sm dm-sans-regular mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 text-black bg-white dark:bg-darkBG3 dark:text-white transition-colors border border-stone-200 dark:border-stone-800 focus:border-black focus:dark:border-stone-500 focus:ring-transparent focus:outline-none focus:ring-0 rounded-lg text-sm"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span className={!date ? "text-stone-400" : ""}>
            {date ? format(date, "PPP h:mm aa") : "Select date & time"}
          </span>
        </div>
        <svg
          className={`w-4 h-4 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute z-30 mt-2 p-3 bg-lightBG dark:bg-darkBG3 rounded-lg border border-stone-200 dark:border-stone-700"
          onClick={(e) => e.stopPropagation()}
        >
          <DayPicker
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            showOutsideDays
            initialFocus
            classNames={{
              caption:
                "flex justify-center items-center gap-2 mb-2 text-sm font-medium text-black dark:text-white",
              nav: "flex items-center justify-end w-full px-2",
              caption_label: "whitespace-nowrap",
              nav_button:
                "w-6 h-6 p-1 rounded hover:bg-gray-200 dark:hover:bg-stone-700 text-black flex items-center justify-center dark:text-white",
              nav_icon: "w-3 h-3",
              table: "w-full border-collapse",
              head_row: "flex",
              head_cell:
                "text-xs font-normal text-gray-500 dark:text-stone-400 w-10 text-center",
              row: "flex",
              cell: "text-center w-10 h-10 relative",
              day: "w-full h-full rounded-full flex items-center justify-center text-sm hover:bg-gray-100 dark:hover:bg-stone-700 text-black dark:text-white transition-colors",
              day_selected:
                "bg-black text-white dark:bg-stone-600 dark:text-black hover:bg-black/80 dark:hover:bg-stone-500",
              day_today: "font-semibold underline",
              day_outside: "text-gray-400 dark:text-stone-600",
            }}
          />

          <div className="mt-4 flex items-center justify-center gap-2">
            <CustomSelect
              value={selectedTime.hours}
              options={Array.from({ length: 12 }, (_, i) => i + 1)}
              onChange={(val) => handleTimeChange("hours", val)}
            />
            <span className="text-black dark:text-white">:</span>
            <CustomSelect
              value={selectedTime.minutes}
              options={Array.from({ length: 60 }, (_, i) => i)}
              onChange={(val) => handleTimeChange("minutes", val)}
            />
            <CustomSelect
              value={selectedTime.period}
              options={["AM", "PM"]}
              onChange={(val) => handleTimeChange("period", val)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
