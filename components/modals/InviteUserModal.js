import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { AlertContext } from "../../context/alertContext";
import { useRouter } from "next/router";
import { Button } from "../buttons/Button";
import { KeySquare, Copy, Trash } from "lucide-react";
import { TextInput } from "../inputs/TextInput";
import { Select } from "../inputs/Select";
import { ToggleButton } from "../inputs/ToggleButton";
import { DatePicker } from "../inputs/DatePicker";
import { useAuth } from "../../context/AuthContext";
import { usePathname } from "next/navigation";

export default function InviteUserModal() {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = router.query;
  const { user, authPost, authFetch } = useAuth();
  const { showAlert } = useContext(AlertContext);

  const [fetchingPreviousInvites, setFetchingPreviousInvites] = useState(false);
  const [showPreviousInvites, setShowPreviousInvites] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [memberRole, setMemberRole] = useState("");
  const [previousInviteLinks, setPreviousInviteLinks] = useState([]);
  const [date, setDate] = useState(new Date());

  const permissionOptions = [
    { label: "Owner", value: "owner" },
    { label: "Admin", value: "admin" },
    { label: "Write", value: "write" },
    { label: "Read", value: "read" },
  ];

  // -------------------------------
  // Create Repo Invite
  // -------------------------------
  const handleRepoInviteCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user?.profile?.full_name || !date) {
      showAlert("All fields are required!", "error");
      setLoading(false);
      return;
    }

    try {
      const body = {
        repo_id: id,
        user_name: user?.profile?.full_name,
        member_role: memberRole,
        member_permissions: "read",
        status: "active",
        expires_at: date?.toISOString(),
      };

      const data = await authPost(
        `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/repos/createRepoInvite`,
        body
      );

      console.log("Invite response:", data);
      sessionStorage.setItem(
        "recentCreatedInvite",
        data.repo_invite.repoInviteID.id
      );
      showAlert("Repo invite created successfully!", "success");
      handleFetchRepoInviteLinks();
    } catch (err) {
      console.error("Error creating repo invite:", err);
      showAlert(err.message || "Failed to create repo invite", "error");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // Fetch Previous Invites
  // -------------------------------
  const handleFetchRepoInviteLinks = async () => {
    setFetchingPreviousInvites(true);
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/repos/fetchRepoInvites?repo_id=${id}`
      );
      setPreviousInviteLinks(res.data || []);
      setShowPreviousInvites(true);
    } catch (err) {
      console.error("Error fetching repo invites:", err);
      showAlert("Failed to fetch previous invites", "error");
    } finally {
      setFetchingPreviousInvites(false);
    }
  };

  // -------------------------------
  // Copy Invite Link
  // -------------------------------
  const handleCopyLink = (invite) => {
    const inviteLink = `${window.location.origin}/app/repos/join/${invite?.id}`;
    navigator.clipboard.writeText(inviteLink);
    showAlert("Invite link copied!", "success");
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <motion.div
      key={showPreviousInvites ? "previous" : "form"}
      className={`${
        showPreviousInvites ? "w-11/12 lg:w-1/2" : "w-11/12 lg:w-1/2"
      } relative z-50 px-8 lg:px-12 pt-6 lg:pt-8 pb-8 lg:pb-12 h-max rounded-xl bg-white dark:bg-darkBG`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* --------------------------------
          HEADER
      -------------------------------- */}
      <div className="flex flex-col mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="dm-sans-regular text-lg lg:text-xl text-black dark:text-white">
            {showPreviousInvites ? "Previous Invites" : "Invite Member"}
          </p>
          {showPreviousInvites && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreviousInvites(false)}
            >
              Back
            </Button>
          )}
        </div>

        {!showPreviousInvites && (
          <>
            <p className="dm-sans-light text-xs lg:text-sm text-black/50 dark:text-white/30 mt-1 mb-4">
              Give them a role/title, send them the link, accept them into your
              repo.
            </p>
            <Button
              loading={fetchingPreviousInvites}
              onClick={handleFetchRepoInviteLinks}
            >
              View Previous Invite Links
            </Button>
          </>
        )}
      </div>

      {/* --------------------------------
          VIEW PREVIOUS INVITES
      -------------------------------- */}
      {showPreviousInvites ? (
        <div className="flex flex-col max-h-96 overflow-y-scroll gap-4">
          {previousInviteLinks.length === 0 ? (
            <p className="text-sm text-black/60 dark:text-white/40">
              No invites found.
            </p>
          ) : (
            previousInviteLinks.map((invite) => (
              <div key={invite.id}>
                <div
                  key={invite.id}
                  className="border border-stone-200 dark:border-white/10 rounded-xl px-5 py-3 bg-white dark:bg-white/5"
                >
                  {/* Header with status and action */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center capitalize px-3 py-1 rounded-full text-xs dm-sans-medium ${
                        invite.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          invite.status === "active"
                            ? "bg-green-500"
                            : "bg-stone-400"
                        }`}
                      />
                      {invite.status}
                    </span>

                    {invite.status === "active" && (
                      <div className="flex flex-row gap-3">
                        <Button
                          size="sm"
                          variant="solid"
                          onClick={() => handleCopyLink(invite)}
                          icon={Copy}
                        >
                          Copy Link
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          // onClick={() => handleCopyLink(invite.id)}
                          icon={Trash}
                        >
                          Kill Link
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Info grid */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-stone-400 dark:text-white/40 min-w-[90px] text-xs dm-sans-medium uppercase tracking-wide">
                        Role
                      </span>
                      <span className="text-stone-900 dark:text-white/90 dm-sans-medium">
                        {invite.member_role || "Allowing user to decide"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3  text-sm">
                      <span className="text-stone-400 dark:text-white/40 min-w-[90px] text-xs dm-sans-medium uppercase tracking-wide">
                        Permission
                      </span>
                      <span className="text-stone-900 dark:text-white/90 capitalize dm-sans-medium">
                        {invite.member_permissions}
                      </span>
                    </div>

                    <div className="pt-3 mt-2 border-t border-stone-100 dark:border-white/5 flex flex-col sm:flex-row gap-2 text-xs text-stone-500 dark:text-white/40">
                      <span>
                        Created {new Date(invite.created_at).toLocaleString()}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        Expires {new Date(invite.expires_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                {invite.id == sessionStorage.getItem("recentCreatedInvite") && (
                  <div className="bg-blue-100 text-blue-700 w-max px-3 py-1.5 text-xs ml-auto mr-4 rounded-b-md">
                    Recently Created
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        /* --------------------------------
            CREATE NEW INVITE FORM
        -------------------------------- */
        <div className="flex flex-col gap-4 w-full">
          <ToggleButton
            label="Allow users to set their own role/title"
            value={enabled}
            onChange={setEnabled}
            activeLabel="Users can set their own role/title"
            inactiveLabel="Invitee sets roles/titles"
          />

          {!enabled && (
            <TextInput
              label="Member Role/Title"
              required={true}
              placeholder="E.g. Software Engineer / Lead / Student"
              icon={KeySquare}
              onChange={(e) => setMemberRole(e.target.value)}
            />
          )}

          <DatePicker
            setDate={setDate}
            date={date}
            label="Invite Expiry Date"
          />

          <Select
            disabled={true}
            label="Permission Level"
            placeholder="Select permission"
            options={permissionOptions}
            value="read"
          />

          <p className="dm-sans-light text-xs text-black/50 dark:text-white/30 -mt-2">
            You can give members more access once they join the repo.
          </p>

          <Button
            onClick={handleRepoInviteCreate}
            size="xl"
            variant="solid"
            loading={loading}
          >
            Create and Copy Invite Link
          </Button>
        </div>
      )}
    </motion.div>
  );
}
