import {
  PlusCircle,
  Users,
  Key,
  GitBranch,
  Calendar,
  GalleryVerticalEnd,
  KeySquare,
  UserRound,
  UsersRound,
  Search,
  FolderGit2,
  Github,
} from "lucide-react";
import { Button } from "../../../components/buttons/Button.js";
import { TextInput } from "../../../components/inputs/TextInput.js";
import AuthLayout from "../../../components/layouts/AuthLayout.js";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreateNewRepoModal from "../../../components/modals/CreateNewRepoModal.js";
import { useAuth } from "../../../context/AuthContext.js";
import { formatDateTime } from "../../../utils/formatDateTime.js";
import ImportRepoGithubModal from "../../../components/modals/ImportRepoGithubModal.js";

const formatType = (type) => {
  if (!type) return "";
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function Repos() {
  const [showCreateRepoModal, setShowCreateRepoModal] = useState("");
  const { user, authFetch, loading } = useAuth();
  const [repos, setRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const handleRepoClick = (repoId) => {
    window.location.href = `/app/repos/${repoId}`;
  };
  const [showImportRepoGithubModal, setShowImportRepoGithubModal] =
    useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    const fetchRepos = async () => {
      try {
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/repos/fetchRepos`
        );
        const sortedRepos = (res.data || []).sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        setRepos(sortedRepos);
      } catch (err) {
        console.error("Error fetching repos:", err);
      }
    };

    fetchRepos();
  }, [loading, user]);

  const filteredRepos = repos.filter((repo) =>
    repo?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AnimatePresence>
        {showImportRepoGithubModal && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowImportRepoGithubModal(false)}
            />
            <ImportRepoGithubModal
              setShowImportRepoGithubModal={setShowImportRepoGithubModal}
              setRepos={setRepos}
            />
          </motion.div>
        )}
      </AnimatePresence>
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
            <CreateNewRepoModal
              setShowCreateRepoModal={setShowCreateRepoModal}
              setRepos={setRepos}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AuthLayout>
        <div className="flex flex-row items-end justify-between mb-4">
          <p className="dm-sans-medium text-2xl text-black dark:text-white mt-2">
            Repos
          </p>
          <div className="flex flex-row gap-3">
            <Button
              onClick={() => {
                setShowImportRepoGithubModal(true);
              }}
              variant="solid"
              icon={Github}
              size="sm"
            >
              Import Repo
            </Button>
            <Button
              onClick={() => setShowCreateRepoModal(true)}
              icon={PlusCircle}
              size="sm"
            >
              Create New Repo
            </Button>
          </div>
        </div>

        <TextInput
          placeholder="Find a repo..."
          icon={Search}
          value={searchQuery}
          onChange={setSearchQuery}
        />

        {filteredRepos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            {filteredRepos.map((repo) => (
              <button
                key={repo.id}
                onClick={() => handleRepoClick(repo.id)}
                className="bg-lightBG hover:scale-[101%] hover:bg-white hover:dark:bg-stone-900 flex flex-col justify-between dark:bg-darkBG rounded-lg border border-stone-200 dark:border-stone-700 text-left cursor-pointer hover:border-green-600 dark:hover:border-green-400 transition-all duration-300 ease-in-out"
              >
                <div className="px-5 py-3">
                  <div className="flex flex-row items-start justify-between mb-1">
                    <h3 className="text-lg dm-sans-medium text-black dark:text-white">
                      {repo.name}
                    </h3>
                    <p className="dm-sans-light h-max w-max capitalize text-xs px-3 py-1 text-green-700 bg-green-200 dark:bg-green-900 rounded-lg dark:text-white">
                      {formatType(repo?.type)}
                    </p>
                  </div>

                  <p className="text-sm dm-sans-light text-stone-600 dark:text-stone-400 mb-4 line-clamp-2">
                    {repo.description}
                  </p>
                </div>

                <div className="flex px-5 py-3 items-center w-full flex-wrap gap-3 text-xs text-stone-500 dark:text-stone-400 mt-auto border-t border-stone-200 dark:border-stone-700">
                  <div className="flex dm-sans-light items-center gap-1">
                    <UsersRound size={14} />
                    <span>{repo.member_count} members</span>
                  </div>
                  <div className="flex dm-sans-light items-center gap-1">
                    <KeySquare size={14} />
                    <span>{repo.secret_count} secrets</span>
                  </div>
                  <div className="flex dm-sans-light items-center gap-1">
                    <Calendar size={14} />
                    <span>{formatDateTime(repo.created_at)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="w-full h-96 overflow-hidden flex flex-col items-center justify-center">
            <FolderGit2
              className="text-stone-600 dark:text-stone-600 mb-3"
              size={32}
            />
            <p className="text-sm dm-sans-light text-stone-600 dark:text-stone-400 mb-4 line-clamp-2">
              No repos currently.
            </p>
            <Button
              onClick={() => setShowCreateRepoModal(true)}
              icon={PlusCircle}
              size="sm"
            >
              Create New Repo
            </Button>
          </div>
        )}
      </AuthLayout>
    </>
  );
}
