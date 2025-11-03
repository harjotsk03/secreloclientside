import { Upload, Share2, ShieldCheck } from "lucide-react";

const steps = [
  {
    title: "1. Upload Keys",
    description:
      "Upload your .env or secret file. It’s encrypted on your device before leaving your computer.",
    icon: Upload,
  },
  {
    title: "2. Share Data",
    description:
      "Invite teammates. Each secret is encrypted for them individually using secure key cryptography.",
    icon: Share2,
  },
  {
    title: "3. Control Access",
    description:
      "Team members decrypt on their device. You decide who sees what, we never see your data.",
    icon: ShieldCheck,
  },
];

export default function HowItWorks() {
  return (
    <div className="px-4 flex flex-col lg:px-48 items-center justify-center">
      <div className="relative w-max flex items-center flex-row gap-2 rounded-full px-3 lg:px-4 py-1 lg:py-1.5 border border-transparent overflow-hidden border-green-200 dark:border-green-700 bg-green-100 dark:bg-green-950 z-10">
        <p className="relative z-10 poppins-regular text-xs text-green-main">
          How It Works
        </p>
      </div>
      <p className="poppins-medium text-black dark:text-white text-3xl mt-4">
        Secure Keys in{" "}
        <span className="text-green-main dark:text-green-500">
          3 Simple Steps
        </span>
      </p>
      <p className="text-neutral-600 dark:text-stone-400 text-xs lg:text-sm poppins-regular mt-2 text-center z-10">
        From scattered keys to control, secure access, seamless sharing, total
        peace of mind.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        {steps.map(({ title, description, icon: Icon }, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-green-50/30 dark:from-green-800/30 to-green-100/70 dark:to-green-950/30 border border-green-500 dark:border-green-800 px-8 py-6 rounded-2xl flex flex-col"
          >
            <div className="w-max text-green-700 dark:text-green-300 bg-gradient-to-br from-green-50 dark:from-green-800 to-green-200 dark:to-green-950 border rounded-lg border-green-500 dark:border-green-800 px-3 py-3">
              <Icon size={16} />
            </div>
            <div className="flex flex-row justify-between mt-7 items-center">
              <p className="poppins-medium text-black dark:text-white text-xl">
                {title}
              </p>
            </div>
            <p className="text-green-950/60 dark:text-green-200/50 text-sm lg:text-base poppins-regular mt-3 z-10">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
