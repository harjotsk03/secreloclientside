import { useRouter } from "next/router";
import AuthLayout from "../../../components/layouts/AuthLayout";
import { Button } from "../../../components/buttons/Button";
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
} from "lucide-react";
import { TextInput } from "../../../components/inputs/TextInput";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useState } from "react";
import AddNewKeyModal from "../../../components/modals/AddNewKeyModal";
import { AlertContext } from "../../../context/alertContext";
import ViewKeyDetailsModal from "../../../components/modals/ViewKeyDetailsModal";
import ViewMemberDetailsModal from "../../../components/modals/ViewMemberDetailsModal";

export default function RouteDetailsPage() {
  const router = useRouter();
  const { showAlert } = useContext(AlertContext);
  const { id } = router.query;
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
  const [showKeyDetailsModal, setShowKeyDetailsModal] = useState(false);
  const [showMemberDetailsModal, setShowMemberDetailsModal] = useState(false);
  const [activeKey, setActiveKey] = useState("");
  const [activeMember, setActiveMember] = useState("");

  // -------------------- MOCK DATA --------------------
  const mockSecrets = [
    {
      id: "1",
      keyName: "AUTH_JWT_SECRET",
      value: "sk-2fd7b1f9d1b24b22b7c9f45bfb1a3ef1",
      createdBy: "devops@company.com",
      createdAt: "2025-08-12T14:32:00Z",
      updatedBy: "devops@company.com",
      lastUpdated: "2025-09-29T10:45:00Z",
      description: "Secret key for signing JWT access tokens",
      version: "v2.2",
      secretType: "jwt_key",
      autoKillDate: "2026-02-12T00:00:00Z",
    },
    {
      id: "2",
      keyName: "OAUTH_CLIENT_ID",
      value: "client-9b12f3c7e4",
      createdBy: "api-team@company.com",
      createdAt: "2025-07-01T08:21:00Z",
      updatedBy: "devops@company.com",
      lastUpdated: "2025-09-27T19:12:00Z",
      description: "OAuth 2.0 client ID for Google authentication",
      version: "v1.0",
      secretType: "oauth_token",
      autoKillDate: "2026-01-01T00:00:00Z",
    },
    {
      id: "3",
      keyName: "OAUTH_CLIENT_SECRET",
      value: "gsecr_8d1a99f82132b8ff9",
      createdBy: "api-team@company.com",
      createdAt: "2025-07-01T08:21:00Z",
      updatedBy: "devops@company.com",
      lastUpdated: "2025-09-30T11:02:00Z",
      description: "Client secret for Google OAuth authentication",
      version: "v3.4",
      secretType: "client_secret",
      autoKillDate: "2026-01-30T00:00:00Z",
    },
    {
      id: "4",
      keyName: "STRIPE_API_KEY",
      value: "sk_live_51L3x...",
      createdBy: "billing@company.com",
      createdAt: "2025-04-22T15:47:00Z",
      updatedBy: "devops@company.com",
      lastUpdated: "2025-10-02T21:09:00Z",
      description: "Live Stripe key for payment processing",
      version: "v1.0",
      secretType: "api_key",
      autoKillDate: "2026-03-22T00:00:00Z",
    },
    {
      id: "5",
      keyName: "SENTRY_DSN",
      value: "https://b8f1a7d4a2d34a47a1f3a2b8e9f8c123@sentry.io/1234567",
      createdBy: "devops@company.com",
      createdAt: "2025-03-14T09:33:00Z",
      updatedBy: "devops@company.com",
      lastUpdated: "2025-09-20T18:21:00Z",
      description: "Sentry DSN for error tracking in the auth service",
      version: "v2.7",
      secretType: "webhook_secret",
      autoKillDate: "2026-03-14T00:00:00Z",
    },
    {
      id: "6",
      keyName: "INTERNAL_API_TOKEN",
      value: "api-internal-1a2b3c4d5e6f",
      createdBy: "backend@company.com",
      createdAt: "2025-06-10T12:15:00Z",
      updatedBy: "devops@company.com",
      lastUpdated: "2025-09-28T09:50:00Z",
      description: "Token used for inter-service communication with gateway",
      version: "v5.6",
      secretType: "api_key",
      autoKillDate: "2026-02-10T00:00:00Z",
    },
  ];



  const repoMembers = [
    {
      id: "1",
      name: "Alice Nguyen (You)",
      email: "alice.nguyen@company.com",
      role: "Lead Developer",
      permission: "Owner",
      joinedAt: "2025-02-12T09:21:00Z",
    },
    {
      id: "2",
      name: "Ravi Patel",
      email: "ravi.patel@company.com",
      role: "Backend Engineer",
      permission: "Write",
      joinedAt: "2025-03-04T11:05:00Z",
    },
    {
      id: "3",
      name: "Maya Johnson",
      email: "maya.johnson@company.com",
      role: "QA Specialist",
      permission: "Pending",
      joinedAt: "2025-05-21T15:42:00Z",
    },
    {
      id: "4",
      name: "Carlos Mendes",
      email: "carlos.mendes@company.com",
      role: "DevOps Engineer",
      permission: "Read",
      joinedAt: "2025-01-30T17:14:00Z",
    },
    {
      id: "5",
      name: "Sophia Lee",
      email: "sophia.lee@company.com",
      role: "Frontend Developer",
      permission: "Write",
      joinedAt: "2025-04-09T12:10:00Z",
    },
    {
      id: "6",
      name: "Harjot Singh",
      email: "harjot@aetherautomation.com",
      role: "Full Stack Software Engineer",
      permission: "Admin",
      joinedAt: "2025-04-09T12:10:00Z",
    },
    {
      id: "7",
      name: "Sophia Lee",
      email: "sophia.lee@company.com",
      role: "Frontend Developer",
      permission: "Write",
      joinedAt: "2025-04-09T12:10:00Z",
    },
  ];

  // -------------------- SORTED MEMBERS --------------------
  const pendingMembers = repoMembers.filter((m) => m.permission === "Pending");
  const activeMembers = repoMembers.filter((m) => m.permission !== "Pending");

  // -------------------- COMPONENT --------------------
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
            <AddNewKeyModal />
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

      <AuthLayout>
        <BackButton />
        <div className="flex flex-row items-end justify-between mb-4">
          <div className="flex flex-col">
            <p className="dm-sans-medium text-2xl text-black dark:text-white mt-2">
              authentication-service
            </p>
            <p className="dm-sans-regular text-sm text-stone-600 dark:text-stone-300 mt-2">
              Microservice handling user authentication and authorization
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <Button
              onClick={() => {
                showAlert("Invite URL copied to clipboard!");
              }}
              variant="ghost"
              icon={UserPlus2}
              size="sm"
            >
              Invite Member
            </Button>
            <Button
              onClick={() => setShowCreateKeyModal(true)}
              icon={PlusCircle}
              size="sm"
            >
              Add Secret
            </Button>
          </div>
        </div>

        <div className="flex w-full flex-col lg:flex-row gap-6">
          {/* ---------- LEFT PANEL: Secrets ---------- */}
          <div className="flex flex-col lg:w-3/4 gap-3">
            <TextInput placeholder="Find a key..." icon={Search} />
            <div className="w-full h-[64.5vh] overflow-y-scroll flex flex-col">
              <div className="flex flex-col gap-4">
                {mockSecrets.map((secret) => (
                  <div key={secret.id} className="flex text-left group justify-between rounded-md transition-all duration-500">
                    <div>
                      <p className="text-base dm-sans-semibold text-black dark:text-white">
                        {secret.keyName}
                      </p>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                        {secret.description}
                      </p>
                      <div className="mt-2 text-xs text-stone-400/80 dark:text-stone-400 flex flex-row gap-2">
                        <p>
                          Last updated{" "}
                          {new Date(secret.lastUpdated).toLocaleDateString()}
                        </p>
                        <p>-</p>
                        <p>{secret.version}</p>
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
          <div className="w-full lg:w-1/4 h-[72.5vh] overflow-y-auto bg-stone-100 dark:bg-darkBG rounded-xl flex flex-col px-6 py-4">
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
                            {member.name}
                          </p>
                          <p className="text-xs dm-sans-light text-stone-500 dark:text-stone-400">
                            {member.role}
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
              <p className="uppercase text-stone-500 dark:text-stone-400 text-xs dm-sans-regular mb-1">
                Active Members ({activeMembers.length})
              </p>
              <div className="flex flex-col gap-3">
                {activeMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => {setActiveMember(member); setShowMemberDetailsModal(true)}}
                    className="flex items-center justify-between bg-white dark:bg-darkBG3 border border-stone-200 dark:border-stone-700 rounded-lg py-2 px-3 hover:cursor-pointer hover:bg-stone-50 dark:hover:bg-darkBG transition-all duration-500"
                  >
                    <div>
                      <p className="text-sm dm-sans-medium text-black dark:text-white">
                        {member.name}
                      </p>
                      <p className="text-xs dm-sans-light text-stone-500 dark:text-stone-400">
                        {member.role}
                      </p>
                    </div>
                    <p
                      className={`text-xs px-2 py-1 rounded-md ${
                        member.permission === "Owner"
                          ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                          : member.permission === "Admin"
                          ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                          : member.permission === "Write"
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                          : "bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                      }`}
                    >
                      {member.permission}
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
