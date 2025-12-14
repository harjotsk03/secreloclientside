import { useRouter } from "next/router";
import AuthLayout from "../../../components/layouts/AuthLayout";
import { Button } from "../../../components/buttons/Button";
import { BackButton } from "../../../components/buttons/BackButton";
import {
  PlusCircle,
  Search,
  UserPlus2,
  Check,
  X,
  Pen,
  FolderOutput,
  Construction,
} from "lucide-react";
import { TextInput } from "../../../components/inputs/TextInput";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import AddNewKeyModal from "../../../components/modals/AddNewKeyModal";
import { AlertContext } from "../../../context/alertContext";
import ViewKeyDetailsModal from "../../../components/modals/ViewKeyDetailsModal";
import ViewMemberDetailsModal from "../../../components/modals/ViewMemberDetailsModal";
import { useAuth } from "../../../context/AuthContext";
import { formatType } from "../../../utils/formatType";
import InviteUserModal from "../../../components/modals/InviteUserModal";
import AddNewKeyModalSingle from "../../../components/modals/AddNewKeyModalSingle";
import { useEncryption } from "../../../context/EncryptionContext";
import SecretCard from "../../../components/cards/SecretCard";
import { addUserToSecret } from "../../../utils/addUserToSecret";
import { Select } from "../../../components/inputs/Select";

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

export default function RouteDetailsPage() {
  const router = useRouter();
  const { showAlert } = useContext(AlertContext);
  const { id } = router.query;
  const [repoMembers, setRepoMembers] = useState([]);
  const [repoDetails, setRepoDetails] = useState([]);
  const [repoFolders, setRepoFolders] = useState([]);
  const [secrets, setSecrets] = useState([]);
  const [showCreateKeyModalSingle, setShowCreateKeyModalSingle] =
    useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editingRepo, setEditingRepo] = useState(false);
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
  const [showKeyDetailsModal, setShowKeyDetailsModal] = useState(false);
  const [showMemberDetailsModal, setShowMemberDetailsModal] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [activeMember, setActiveMember] = useState("");
  const { user, authPost, authFetch, authPut, authDelete, loading } = useAuth();
  const [showInviteMemberModal, setShowInviteMemberModal] = useState(false);
  const { privateKey } = useEncryption();

  const fetchSecrets = async () => {
    if (!id) return;

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/repos/${id}/secrets`
      );
      const data = await res.data;

      setSecrets(data);
    } catch (err) {
      console.error("Error fetching secrets:", err);
    }
  };

  const currentMember = repoMembers.find(
    (m) => m.user_id === user?.profile?.id
  );

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (!id) return;

    // ✅ Create abort controller
    const abortController = new AbortController();

    const fetchRepoDetails = async () => {
      try {
        const data = await authFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/repos/${id}`,
          { signal: abortController.signal }
        );
        setRepoDetails(data.repo);
        setRepoFolders(data.folders);
        setRepoMembers(data.members);
      } catch (err) {
        // ✅ Ignore abort errors
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
          return;
        }
        console.error("Error fetching repos:", err);
        router.push("/app/repos");
      }
    };

    fetchRepoDetails();

    // ✅ Cleanup function - cancels the request on unmount
    return () => {
      abortController.abort();
    };
  }, [loading, user, id, router]);

  const pendingMembers = repoMembers.filter((m) => m.status === "pending");
  const activeMembers = repoMembers.filter((m) => m.status !== "pending");

  useEffect(() => {
    if (!user) return;
    if (!id) return;

    fetchSecrets();
  }, [id, user]);

  const handleAcceptToRepo = async (userAdding) => {
    const keyDEKs = [];

    for (const secret of secrets) {
      // Encrypt the DEK for the new user's public key
      const encryptDEK = await addUserToSecret(
        secret,
        userAdding.public_key,
        privateKey
      );

      keyDEKs.push({
        secret_id: secret.id,
        encrypted_key: encryptDEK,
      });
    }

    const body = {
      encrypted_keys: keyDEKs,
    };

    console.log(body);

    const data = await authPost(
      `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/secrets/addNewUserDEK/${userAdding.user_id}`,
      body
    );

    if (data.message == "User secrets added successfully.") {
      const data = await authPost(
        `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/repos/approve/${userAdding.user_id}/${id}`
      );

      console.log(data);
    }
  };

  const handleRejectFromRepo = async (userAdding) => {
    const keyDEKs = [];

    for (const secret of secrets) {
      // Encrypt the DEK for the new user's public key
      const encryptDEK = await addUserToSecret(
        secret,
        userAdding.public_key,
        privateKey
      );

      keyDEKs.push({
        secret_id: secret.id,
        encrypted_key: encryptDEK,
      });
    }

    const body = {
      encrypted_keys: keyDEKs,
    };

    const data = await authDelete(
      `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/secrets/removeUserDEK/${userAdding.user_id}`,
      body
    );

    console.log(data);
  };

  const handleEditRepo = () => {
    setEditingRepo(true);
  };

  const handleRepoFieldChange = (field, value) => {
    setRepoDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveRepo = async () => {
    setSaveLoading(true);
    try {
      const body = {
        name: repoDetails.name,
        description: repoDetails.description,
        type: repoDetails.type,
      };

      const data = await authPut(
        `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/repos/update/${id}`,
        body
      );

      if (data.success) {
        showAlert("Repository updated successfully", "success");
        setEditingRepo(false);
        setSaveLoading(false);
      }
    } catch (err) {
      console.error("Error updating repo:", err);
      showAlert("Failed to update repository", "error");
    }
  };

  return (
    <>
      <AnimatePresence>
        {showCreateKeyModal && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowCreateKeyModal(false)}
            />
            <AddNewKeyModal
              setShowCreateKeyModal={setShowCreateKeyModal}
              setShowCreateKeyModalSingle={setShowCreateKeyModalSingle}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateKeyModalSingle && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowCreateKeyModalSingle(false)}
            />
            <AddNewKeyModalSingle
              fetchSecrets={fetchSecrets}
              setSecrets={setSecrets}
              setShowCreateKeyModal={setShowCreateKeyModal}
              setShowCreateKeyModalSingle={setShowCreateKeyModalSingle}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showKeyDetailsModal && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => {
                setShowKeyDetailsModal(false);
              }}
            />
            <ViewKeyDetailsModal
              setSecrets={setSecrets}
              keyData={activeKey}
              currentMember={currentMember}
              repoUsers={repoMembers}
              setShowKeyDetailsModal={setShowKeyDetailsModal}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMemberDetailsModal && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => {
                setShowMemberDetailsModal(false);
              }}
            />
            <ViewMemberDetailsModal memberData={activeMember} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInviteMemberModal && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => {
                setShowInviteMemberModal(false);
              }}
            />
            <InviteUserModal />
          </motion.div>
        )}
      </AnimatePresence>

      <AuthLayout>
        <BackButton />
        <div className="flex flex-col lg:flex-row gap-4 lg:items-end justify-between mb-4">
          <div className="flex flex-col w-full lg:mr-20">
            {editingRepo ? (
              <div className="mt-2">
                <TextInput
                  value={repoDetails?.name || ""}
                  onChange={(value) => handleRepoFieldChange("name", value)}
                />
              </div>
            ) : (
              <p className="dm-sans-medium text-2xl text-black dark:text-white mt-2">
                {repoDetails?.name}
              </p>
            )}

            {editingRepo ? (
              <div className="mt-2">
                <TextInput
                  multiline={true}
                  value={repoDetails?.description || ""}
                  onChange={(value) =>
                    handleRepoFieldChange("description", value)
                  }
                />
              </div>
            ) : (
              <p className="dm-sans-regular text-sm text-stone-600 dark:text-stone-300 mt-2">
                {repoDetails?.description}
              </p>
            )}

            {editingRepo ? (
              <div className="mt-2">
                <Select
                  label="Repo Type"
                  options={options}
                  value={repoDetails?.type || ""}
                  onChange={(value) => handleRepoFieldChange("type", value)}
                  placeholder="Repo Type"
                />
              </div>
            ) : (
              <p className="dm-sans-light w-max capitalize text-xs px-3 py-1 text-green-700 bg-green-200 dark:bg-green-800 rounded-lg dark:text-white mt-2">
                {formatType(repoDetails?.type)}
              </p>
            )}

            {editingRepo && (
              <div className="mt-4 flex flex-row gap-2 ml-auto">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditingRepo(false);
                    // Optionally refetch to restore original values
                  }}
                >
                  Cancel
                </Button>
                <Button loading={saveLoading} onClick={handleSaveRepo}>
                  Save
                </Button>
              </div>
            )}
          </div>
          <div className="flex flex-row gap-2">
            {(currentMember?.member_permissions === "owner" ||
              currentMember?.member_permissions === "admin") && (
              <Button
                onClick={() => {
                  setShowInviteMemberModal(true);
                }}
                variant="ghost"
                icon={UserPlus2}
                size="sm"
              >
                Invite Member
              </Button>
            )}
            {(currentMember?.member_permissions === "owner" ||
              currentMember?.member_permissions === "write" ||
              currentMember?.member_permissions === "admin") && (
              <Button
                onClick={() => setShowCreateKeyModal(true)}
                icon={PlusCircle}
                size="sm"
              >
                Add Secret
              </Button>
            )}

            {repoDetails?.created_by === user?.profile?.id ? (
              !editingRepo && (
                <Button onClick={handleEditRepo} variant="secondary" size="sm">
                  Edit
                </Button>
              )
            ) : (
              <Button
                onClick={() => {}}
                variant="solid"
                icon={FolderOutput}
                size="sm"
              >
                Leave Repo
              </Button>
            )}
          </div>
        </div>

        <div className="flex w-full flex-col lg:flex-row gap-6">
          {/* ---------- LEFT PANEL: Secrets ---------- */}
          <div className="flex flex-col lg:w-3/4 gap-3">
            <TextInput placeholder="Find a key..." icon={Search} />
            <div className="w-full h-[63vh] overflow-y-auto flex flex-col">
              <div className="relative">
                <div
                  className={`flex flex-col rounded-lg gap-4 transition-all ${
                    currentMember?.status == "pending" ? "blur-sm" : ""
                  }`}
                >
                  {secrets.map((secret) => (
                    <SecretCard
                      key={secret?.id}
                      secret={secret}
                      setActiveKey={setActiveKey}
                      setShowKeyDetailsModal={setShowKeyDetailsModal}
                      currentMember={currentMember}
                    />
                  ))}
                </div>

                {currentMember?.status == "pending" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="bg-white px-4 py-2 rounded-lg text-sm text-black dm-sans-regular">
                      Access pending admin approval.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ---------- RIGHT PANEL: Members ---------- */}
          <div className="w-full lg:w-1/4 h-[70vh] overflow-y-auto bg-stone-100 dark:bg-darkBG rounded-xl flex flex-col px-6 py-4">
            <div className="flex flex-row justify-between">
              <div className="mb-2">
                <p className="dm-sans-medium text-lg text-black dark:text-white">
                  Repo Members
                </p>
                <p className="dm-sans-light text-sm text-stone-500 dark:text-stone-400">
                  All members with access to this repository.
                </p>
              </div>
            </div>

            <TextInput placeholder="Search members..." icon={Search} />
            {/* Pending Section */}
            <div className="h-[72.5vh] pb-3 overflow-y-auto">
              {pendingMembers.length > 0 && (
                <div className="mt-3">
                  <p className="uppercase text-black dark:text-white text-xs dm-sans-regular mb-1">
                    Pending Access Requests ({pendingMembers.length})
                  </p>
                  <div className="flex flex-col gap-3 mb-4">
                    {pendingMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between bg-white dark:bg-darkBG3 border border-amber-300 dark:border-amber-800 rounded-lg py-2 px-3"
                      >
                        <div>
                          <p className="text-sm dm-sans-medium text-black dark:text-white">
                            {member.full_name}
                          </p>
                          <p className="text-xs dm-sans-light text-stone-500 dark:text-stone-400">
                            {member.member_role}
                          </p>
                        </div>
                        {(currentMember?.member_permissions === "owner" ||
                          currentMember?.member_permissions === "admin") && (
                          <div className="flex flex-row gap-2">
                            <Button
                              onClick={() => handleAcceptToRepo(member)}
                              size="xs"
                              variant="solid"
                              icon={Check}
                            ></Button>
                            <Button
                              onClick={() => handleRejectFromRepo(member)}
                              size="xs"
                              variant="ghost"
                              icon={X}
                            ></Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <hr className="border-stone-300 dark:border-stone-700 my-2" />
                </div>
              )}

              {/* Active Section */}
              <p className="uppercase text-stone-500 dark:text-stone-400 text-xs dm-sans-regular mt-2 mb-1">
                Active Members ({activeMembers.length})
              </p>
              <div className="flex flex-col gap-3">
                {activeMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => {
                      if (
                        currentMember?.member_permissions === "owner" ||
                        currentMember?.member_permissions === "admin"
                      ) {
                        setActiveMember(member);
                        setShowMemberDetailsModal(true);
                      }
                    }}
                    className={`flex items-center justify-between bg-white dark:bg-darkBG3 border border-stone-200 dark:border-stone-700 rounded-lg py-2 px-3 ${
                      currentMember?.member_permissions === "owner" ||
                      currentMember?.member_permissions === "admin"
                        ? "hover:cursor-pointer"
                        : "hover:cursor-default"
                    } hover:bg-stone-50 dark:hover:bg-darkBG transition-all duration-500`}
                  >
                    <div>
                      <p className="text-sm dm-sans-medium text-black dark:text-white">
                        {member.full_name}
                      </p>
                      <p className="text-xs dm-sans-light text-stone-500 dark:text-stone-400">
                        {member.member_role}
                      </p>
                    </div>
                    <p
                      className={`text-xs px-2 py-1 capitalize rounded-md ${
                        member.member_permissions === "Owner"
                          ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                          : member.member_permissions === "Admin"
                          ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                          : member.member_permissions === "Write"
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                          : "bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                      }`}
                    >
                      {member.member_permissions}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
