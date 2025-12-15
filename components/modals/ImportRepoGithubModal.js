"use client";

import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../context/alertContext";
import { Button } from "../buttons/Button";
import { Folder, FileText, ArrowLeft, Github, Search } from "lucide-react";
import { TextInput } from "../inputs/TextInput";
import { Select } from "../inputs/Select";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function ImportRepoGithubModal({
  setShowImportRepoGithubModal,
  setRepos,
}) {
  const { authPost, authFetch } = useAuth();
  const { showAlert } = useContext(AlertContext);
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [repoType, setRepoType] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [repoSelected, setRepoSelected] = useState(false);
  const [githubRepos, setGithubRepos] = useState(null);
  const [search, setSearch] = useState("");


  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/users/github/fetchRepos`
        );
        setGithubRepos(res.repos)
      } catch (err) {
        console.error("Error fetching repos:", err);
      }
    };

    fetchRepos();
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setShowImportRepoGithubModal(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setShowImportRepoGithubModal]);

  const options = [
    { label: "Personal Project", value: "personal" },
    { label: "Hackathon Project", value: "hackathon" },
    { label: "Startup / MVP", value: "startup" },
    { label: "Client Project", value: "client" },
    { label: "Open Source Repository", value: "open_source" },
    { label: "Internal Tool", value: "internal_tool" },
    { label: "Business Application", value: "business_app" },
    { label: "Research / University Project", value: "research" },
    { label: "Team Sandbox / Testing Environment", value: "sandbox" },
  ];

  const handleRepoCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simple validation
    if (!name || !description || !repoType || !userRole) {
      showAlert("All fields are required!", "error");
      setLoading(false);
      return;
    }

    try {
      const body = { name, description, type: repoType, member_role: userRole };

      const data = await authPost(
        `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/repos/createRepo`,
        body
      );

      showAlert("Repo created successfully!", "success");
      setShowImportRepoGithubModal(false);
      // Update parent state
      setRepos((prev) => [data.repo, ...prev]);
      // Reset form
      setName("");
      setDescription("");
      setRepoType("");
      setUserRole("");
      router.push(`/app/repos/`);
      window.location.reload();
    } catch (err) {
      console.error(err);
      showAlert(err.message || "Failed to create repo", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredRepos = githubRepos?.filter((repo) => {
    const q = search.toLowerCase();
    return (
      repo.name.toLowerCase().includes(q) ||
      (repo.description || "").toLowerCase().includes(q)
    );
  });


  return (
    <motion.div
      className={`relative z-50 w-11/12 ${
        repoSelected ? "lg:w-1/3" : "lg:w-2/3"
      } px-8 lg:px-12 pt-6 lg:pt-8 pb-8 lg:pb-12 h-max rounded-xl bg-white dark:bg-darkBG transition-all duration-500 ease-in-out`}
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {repoSelected && (
        <button
          onClick={() => {
            setRepoSelected(false);
          }}
          className="text-black mb-2 dark:text-white opacity-30 group hover:opacity-90 transition-all duration-500 ease-in-out dm-sans-regular text-sm flex flex-row items-center gap-1"
        >
          <ArrowLeft
            className="group-hover:-translate-x-1 transition-all duration-500"
            size={14}
          />{" "}
          Back to Repos
        </button>
      )}
      <p className="dm-sans-regular text-lg lg:text-xl text-black dark:text-white mb-1">
        Import GitHub Repo
      </p>
      <p className="dm-sans-light text-xs lg:text-sm text-black/50 dark:text-white/30 mb-4">
        Import a repo from your GitHub and build off of it.
      </p>

      {repoSelected ? (
        <>
          <div className="flex flex-col gap-4 w-full">
            <TextInput
              label="Repo Name"
              placeholder="Repo Name"
              value={name}
              onChange={setName}
              icon={Folder}
              disabled={true}
            />

            <Select
              label="Repo Type"
              options={options}
              value={repoType}
              onChange={setRepoType}
              placeholder="Repo Type"
            />

            <TextInput
              label="Your Role/Title"
              placeholder="E.g. Software Engineer/Lead/Student"
              value={userRole}
              onChange={setUserRole}
              icon={Folder}
            />

            <TextInput
              multiline
              label="Description"
              placeholder="Description"
              value={description}
              onChange={setDescription}
              icon={FileText}
            />

            <Button
              onClick={handleRepoCreate}
              size="xl"
              variant="solid"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Repo"}
            </Button>
          </div>
        </>
      ) : (
        <div className="relative w-full h-96 overflow-y-auto border border-stone-200 dark:border-stone-700 rounded-lg">
          {!githubRepos ? (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">
              Loading repositories…
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">
              No repositories found
            </div>
          ) : (
            <>
              <div className="sticky top-0 z-10 bg-white dark:bg-darkBG p-2">
                <TextInput
                  icon={Search}
                  placeholder="Search repositories…"
                  value={search}
                  onChange={setSearch}
                />
              </div>
              <ul className="divide-y divide-stone-200 dark:divide-stone-700">
                {filteredRepos.map((repo) => (
                  <li
                    key={repo.id}
                    className="flex items-center justify-between px-4 py-3 transition "
                  >
                    {/* Repo info */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="dm-sans-medium text-black dark:text-white">
                          {repo.name}
                        </span>

                        {repo.private ? (
                          <span className="text-xs px-2 dm-sans-light py-0.5 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            Private
                          </span>
                        ) : (
                          <span className="text-xs px-2 dm-sans-light py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Public
                          </span>
                        )}
                        <a
                          className="ml-2 flex flex-row items-center dm-sans-regular text-xs text-stone-400 hover:text-stone-800 dark:hover:text-stone-400 transition-all duration-500 ease-in-out dark:text-stone-700 gap-1 hover:cursor-pointer"
                          href={repo.html_url}
                          target="_blank"
                        >
                          View Repo
                          <Github size={14} />
                        </a>
                      </div>

                      <p className="text-sm text-gray-600 dm-sans-regular dark:text-gray-400 line-clamp-2">
                        {repo.description || "No description provided"}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="solid"
                      onClick={() => {
                        setName(repo.name);
                        setDescription(repo.description || "");
                        setRepoSelected(true);
                      }}
                    >
                      Select
                    </Button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}
