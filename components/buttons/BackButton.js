import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/router"

export const BackButton = ({ text = "Back" }) => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="text black dark:text-white opacity-30 group hover:opacity-90 transition-all duration-500 ease-in-out dm-sans-regular text-xs flex flex-row items-center gap-1"
    >
      <ArrowLeft
        className="group-hover:-translate-x-1 transition-all duration-500"
        size={12}
      />{" "}
      {text}
    </button>
  );
};