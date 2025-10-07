import { Blocks, Bot, Calendar, Globe, Users } from "lucide-react";
import { Button } from "../buttons/Button";
import { formatDate } from "../../utils/formatDate";
import { formatDateTime } from "../../utils/formatDateTime";
import { useRouter } from "next/router";

export const AgentCard = ({ agent }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/app/agents/${agent.id}`)}
      key={agent?.id}
      className="group w-full text-left min-h-40 border-stone-200 dark:border-stone-800 border rounded-lg bg-lightBG2 dark:bg-darkBG2 transition-all duration-300 cursor-pointer"
    >
      <div className="flex flex-col px-5 py-3">
        <div className="flex flex-row w-full justify-between items-start">
          <div className="flex flex-row gap-3 items-center">
            <div className="flex flex-col">
              <p className="text-black dark:text-white dm-sans-regular text-base lg:text-xl">
                {agent?.name}
              </p>
              <div className="flex flex-row gap-1 items-center mt-0.5">
                {agent?.visibility == "Public" ? (
                  <Globe
                    size={12}
                    className="text-green-500 dark:text-green-600/80"
                  />
                ) : (
                  <Blocks
                    size={12}
                    className="text-blue-500 dark:text-blue-600/80"
                  />
                )}
                <p className="text-black dark:text-white dm-sans-light text-sm">
                  {agent?.visibility}
                </p>
              </div>
            </div>
          </div>
          <p
            className={`self-start whitespace-nowrap ${
              agent?.status == "Active"
                ? "bg-green-200 dark:bg-green-800/20 text-green-600 dark:text-green-500"
                : "bg-yellow-200 dark:bg-yellow-800/20 text-yellow-700 dark:text-yellow-400"
            } px-3.5 py-1 rounded-full dm-sans-regular text-xs flex flex-row items-center gap-2`}
          >
            {agent?.status}
          </p>
        </div>

        <p className="text-black dark:text-stone-400 dm-sans-regular text-xs lg:text-sm mt-3 truncate overflow-hidden whitespace-nowrap">
          {agent?.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          {agent.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex w-max items-center px-4 py-1.5 rounded-full text-xs dm-sans-regular bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="w-full px-2 py-2 transition-all duration-300 ease-in-out gap-4 justify-end items-center flex flex-row border-t border-darkBG/10 dark:border-lightBG/10">
        <p className="ml-4 dm-sans-light text-xs text-stone-600 dark:text-stone-500">
          Last Updated: {formatDateTime(agent?.last_updated)}
        </p>
        <div className="group-hover:opacity-100 opacity-20 transition-all duration-300 ease-in-out">
          <Button
            onClick={(e) => {
              e.stopPropagation(); // prevent parent onClick
              router.push(`/app/agents/${agent.id}`);
            }}
            variant="solid"
          >
            View Agent
          </Button>
        </div>
      </div>
    </div>
  );
};
