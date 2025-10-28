import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../../../context/AuthContext";
import JoinLayout from "../../../../components/layouts/JoinLayout";
import { formatType } from "../../../../utils/formatType";
import { Button } from "../../../../components/buttons/Button";
import { usePathname } from "next/navigation";
import { AlertContext } from "../../../../context/alertContext";
import { TextInput } from "../../../../components/inputs/TextInput";

export default function Join() {
  const router = useRouter();
  const pathname = usePathname();
    const { showAlert } = useContext(AlertContext);
  const { id, invitedBy } = router.query;
  const [memberRole, setMemberRole] = useState("");
  const [repoDetails, setRepoDetails] = useState("");
  const { user, authPost, authFetch } = useAuth();
  const [loading, setLoading] = useState(false);
  const [memberSetsRole, setMemberSetsRole] = useState(false);

    const redirectToLogin = (msg) => {
      const params = new URLSearchParams();
      if (msg) params.set("msg", msg);
      params.set("from", pathname);
      router.push(`/login?${params.toString()}`);
    };

  useEffect(() => {
    if (!id) return;
    if (!user) return;

    const fetchRepoDetails = async () => {
      try {
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/repos/join/${id}`
        );
        setRepoDetails(res?.data)
        setMemberSetsRole(res?.data?.member_role == "" ? true : false);
        setMemberRole(res?.data?.member_role);
        console.log((res?.data)
        )
      } catch (err) {
        console.error("Error fetching repos:", err);
      }
    };

    fetchRepoDetails();
  }, [id, user]);

  const handleRepoJoin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // const body = { name, description, type: repoType, member_role: userRole };

      const data = await authPost(
        `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/repos/join/submit/${id}?member_role=${memberRole}`
      );

      console.log(data);

      showAlert("Repo joined successfully!", "success");
      // setShowCreateRepoModal(false);
      // Update parent state
      // setRepos((prev) => [data.repo, ...prev]);
      // Reset form
      router.push(`/app/repos/${repoDetails?.repo_id}`);
    } catch (err) {
      console.error(err);
      showAlert(err.message || "Failed to create repo", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <JoinLayout>
        <div className="w-full h-screen flex items-center justify-center">
          <div className="w-11/12 xl:w-1/3 lg:w-1/2 flex flex-col items-center justify-center px-4 py-10 h-max rounded-xl bg-stone-200/50 dark:bg-darkBG">
            <p className="dm-sans-medium text-lg text-emerald-600 dark:text-white">
              secrelo<span className="text-black">.</span>
            </p>
            {repoDetails?.user_is_member ? (
              <p className="text-stone-500 dark:text-white text-sm dm-sans-light mt-6">
                You are already part of the repo
              </p>
            ) : (
              <p className="text-stone-500 dark:text-white text-sm dm-sans-light mt-6">
                {repoDetails?.invitee_name} has invited you to join
              </p>
            )}
            <p className="text-black dark:text-white text-2xl dm-sans-regular mt-3">
              {repoDetails?.repo_name}
            </p>
            <p className="text-stone-600 mt-1 text-center md:w-1/2 lg:w-11/12 w-10/12 dark:text-stone-500 text-sm dm-sans-light">
              {repoDetails?.repo_description}
            </p>
            <div
              className={`${
                !memberSetsRole && "mb-6"
              } flex flex-row gap-4 items-center mt-4`}
            >
              <p className="dm-sans-light capitalize flex items-center text-xs w-max">
                <span className="text-stone-600 text-xl mr-1">•</span>
                {formatType(repoDetails?.repo_type)}
              </p>
              <p
                className={`dm-sans-light capitalize flex items-center text-xs w-max`}
              >
                <span className="text-green-600 text-xl mr-1">•</span>
                {repoDetails?.member_count}{" "}
                {repoDetails?.member_count > 1 ? "members" : "member"}
              </p>
            </div>
            {memberSetsRole && (
              <div className="mt-2 md:w-1/2 lg:w-11/12 w-10/12 mb-6">
                <TextInput
                  label={"Your Role/Title"}
                  value={memberRole}
                  onChange={setMemberRole}
                  placeholder="E.g. Software Engineer/Student/Lead"
                />
              </div>
            )}
            <div className="lg:hidden">
              <Button size="lg">Join Repo</Button>
            </div>
            <div className="hidden lg:flex">
              {repoDetails?.user_is_member ? (
                <Button
                  onClick={() => {
                    router.push(`/app/repos/${repoDetails?.repo_id}`);
                  }}
                >
                  Go to Repo
                </Button>
              ) : (
                <Button loading={loading} onClick={handleRepoJoin}>
                  Join Repo
                </Button>
              )}
            </div>
            {/* {!repoDetails?.user_is_member && (
              <button
                onClick={() => {
                  redirectToLogin(
                    `Log in and then we will add you to ${repoDetails?.name}`
                  );
                }}
                className="text-xs text-stone-400 dm-sans-light mt-8"
              >
                Already have an account?{" "}
                <span className="text-stone-800">Log In First Here</span>.
              </button>
            )} */}
          </div>
        </div>
      </JoinLayout>
    </>
  );
}
