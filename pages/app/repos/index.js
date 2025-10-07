import { PlusCircle, Users, Key, GitBranch, Calendar, GalleryVerticalEnd, KeySquare, UserRound, UsersRound, Search } from "lucide-react";
import { Button } from "../../../components/buttons/Button.js";
import { TextInput } from "../../../components/inputs/TextInput.js";
import AuthLayout from "../../../components/layouts/AuthLayout.js";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreateNewRepoModal from "../../../components/modals/CreateNewRepoModal.js";

const repos = [
  {
    id: 1,
    name: "authentication-service",
    description: "Microservice handling user authentication and authorization",
    createdAt: "2024-03-15",
    members: 8,
    secrets: 12,
    type: "Hackathon",
  },
  {
    id: 2,
    name: "frontend-dashboard",
    description: "Main admin dashboard built with React",
    createdAt: "2024-05-22",
    members: 5,
    secrets: 8,
    type: "Course Project",
  },
  {
    id: 3,
    name: "data-pipeline",
    description: "ETL pipeline for processing analytics data",
    createdAt: "2023-11-08",
    members: 12,
    secrets: 24,
    type: "Course Project",
  },
  {
    id: 4,
    name: "mobile-app",
    description: "Cross-platform mobile application",
    createdAt: "2024-01-30",
    members: 6,
    secrets: 15,
    type: "Course Project",
  },
  {
    id: 5,
    name: "api-gateway",
    description: "Central API gateway and routing service",
    createdAt: "2024-06-12",
    members: 4,
    secrets: 18,
    type: "Personal Project",
  },
  {
    id: 6,
    name: "infrastructure",
    description: "Infrastructure as code and deployment configs",
    createdAt: "2023-09-25",
    members: 10,
    secrets: 32,
    type: "Internship",
  },
];

export default function Repos() {
  const [showCreateRepoModal, setShowCreateRepoModal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const handleRepoClick = (repoId) => {
    window.location.href = `/app/repos/${repoId}`;
  };

    const filteredRepos = repos.filter((repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <>
      <AnimatePresence>
        {showCreateRepoModal && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowCreateRepoModal(false)}
            />
            <CreateNewRepoModal />
          </motion.div>
        )}
      </AnimatePresence>
      <AuthLayout>
        <div className="flex flex-row items-end justify-between mb-4">
          <p className="dm-sans-medium text-2xl text-black dark:text-white mt-2">
            Repos
          </p>
          <Button
            onClick={() => setShowCreateRepoModal(true)}
            icon={PlusCircle}
            size="sm"
          >
            Create New Repo
          </Button>
        </div>

        <TextInput
          placeholder="Find a repo..."
          icon={Search}
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          {filteredRepos.map((repo) => (
            <button
              key={repo.id}
              onClick={() => handleRepoClick(repo.id)}
              className="bg-lightBG hover:scale-[101%] hover:bg-white hover:dark:bg-stone-900 flex flex-col justify-between dark:bg-darkBG rounded-lg border border-stone-200 dark:border-stone-700 text-left cursor-pointer hover:border-green-600 dark:hover:border-green-400 transition-all duration-300 ease-in-out"
            >
              <div className="px-5 py-3">
                <div className="flex flex-col gap-2 mb-3">
                  <h3 className="text-lg dm-sans-medium text-black dark:text-white">
                    {repo.name}
                  </h3>
                  <span className="text-xs px-3 py-1 text-center w-max dm-sans-regular rounded-md bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    {repo.type}
                  </span>
                </div>

                <p className="text-sm dm-sans-light text-stone-600 dark:text-stone-400 mb-4 line-clamp-2">
                  {repo.description}
                </p>
              </div>

              <div className="flex px-5 py-3 items-center w-full flex-wrap gap-3 text-xs text-stone-500 dark:text-stone-400 mt-auto border-t border-stone-200 dark:border-stone-700">
                <div className="flex dm-sans-light items-center gap-1">
                  <UsersRound size={14} />
                  <span>{repo.members} members</span>
                </div>
                <div className="flex dm-sans-light items-center gap-1">
                  <KeySquare size={14} />
                  <span>{repo.secrets} secrets</span>
                </div>
                <div className="flex dm-sans-light items-center gap-1">
                  <Calendar size={14} />
                  <span>{repo.createdAt}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </AuthLayout>
    </>
  );
}