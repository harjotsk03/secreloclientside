import { useRouter } from "next/router";
import AuthLayout from "../../../components/layouts/AuthLayout";
import { Button } from "../../../components/buttons/Button";
  import { encryptSecret } from "../../../utils/encryptSecret";
  import { BackButton } from "../../../components/buttons/BackButton";
  import {
    Copy,
    KeySquare,
    PlusCircle,
    Search,
    UserPlus2,
    Check,
    X,
    BookText,
    Pen,
    FolderOutput,
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
  import { formatDateTime } from "../../../utils/formatDateTime";
  import { decryptSecret } from "../../../utils/decryptSecret";
  import { formatSecretType } from "../../../utils/formatSecretType";

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
    const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
    const [showKeyDetailsModal, setShowKeyDetailsModal] = useState(false);
    const [showMemberDetailsModal, setShowMemberDetailsModal] = useState(false);
    const [activeKey, setActiveKey] = useState("");
    const [activeMember, setActiveMember] = useState("");
    const { user, authFetch, loading } = useAuth();
    const [showInviteMemberModal, setShowInviteMemberModal] = useState(false);
    const { publicKey, privateKey } = useEncryption();

    const currentMember = repoMembers.find(
      (m) => m.user_id === user?.profile?.id
    );

    useEffect(() => {
      if (loading) return;
      if (!user) return;
      if (!id) return;

      const fetchRepoDetails = async () => {
        try {
          const res = await authFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/repos/${id}`
          );
          setRepoDetails(res.data.repo);
          setRepoFolders(res.data.folders);
          setRepoMembers(res.data.members);
          console.log(res.data);
        } catch (err) {
          console.error("Error fetching repos:", err);
        }
      };

      fetchRepoDetails();
    }, [loading, user, authFetch, id]);

    const pendingMembers = repoMembers.filter((m) => m.status === "pending");
    const activeMembers = repoMembers.filter((m) => m.status !== "pending");

    useEffect(() => {
      if (!user) return;
      if (!id) return;
      const fetchSecrets = async () => {
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

      fetchSecrets();
    }, [id, user]);

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
              <ViewKeyDetailsModal keyData={activeKey} />
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
          <div className="flex flex-row items-end justify-between mb-4">
            <div className="flex flex-col">
              <p className="dm-sans-medium text-2xl text-black dark:text-white mt-2">
                {repoDetails?.name}
              </p>
              <p className="dm-sans-regular text-sm text-stone-600 dark:text-stone-300 mt-2">
                {repoDetails?.description}
              </p>
              <p className="dm-sans-light w-max capitalize text-xs px-3 py-1 text-green-700 bg-green-200 rounded-lg dark:text-white mt-2">
                {formatType(repoDetails?.type)}
              </p>
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
                <Button
                  onClick={() => {}}
                  variant="secondary"
                  icon={Pen}
                  size="sm"
                >
                  Edit
                </Button>
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
                <div className="flex flex-col gap-4">
                  {secrets.map((secret) => (
                    <div
                      key={secret.id}
                      className="flex text-left px-6 py-4 bg-stone-100/80 group justify-between rounded-xl transition-all duration-500"
                    >
                      <div>
                        <p className="text-base dm-sans-semibold text-black dark:text-white">
                          {secret.name}{" "}
                          <span className="text-xs dm-sans-light text-green-700 dark:text-white mt-1">
                            {" "}
                            ({formatSecretType(secret.type)})
                          </span>
                        </p>
                        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                          {secret.description}
                        </p>
                        <div className="mt-2 text-xs text-stone-400/80 dark:text-stone-400 flex flex-row gap-2">
                          <p>
                            Last updated: {formatDateTime(secret.updated_at)} by{" "}
                            {secret.updated_by_name}
                          </p>
                          <p>-</p>
                          <p>Version: {secret.version}</p>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between gap-2 items-start">
                        <Button size="sm" variant="ghost" icon={Copy}>
                          Copy
                        </Button>
                        <Button
                          onClick={() => {
                            setActiveKey(secret);
                            setShowKeyDetailsModal(true);
                          }}
                          size="sm"
                          icon={BookText}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
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
                          <div className="flex flex-row gap-2">
                            <Button
                              size="xs"
                              variant="solid"
                              icon={Check}
                            ></Button>
                            <Button size="xs" variant="ghost" icon={X}></Button>
                          </div>
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
                        setActiveMember(member);
                        setShowMemberDetailsModal(true);
                      }}
                      className="flex items-center justify-between bg-white dark:bg-darkBG3 border border-stone-200 dark:border-stone-700 rounded-lg py-2 px-3 hover:cursor-pointer hover:bg-stone-50 dark:hover:bg-darkBG transition-all duration-500"
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
