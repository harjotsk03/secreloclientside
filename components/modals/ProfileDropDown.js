import { useContext } from "react";
import { Button } from "../buttons/Button";
import { Building, Building2, LogOut, ScanEye, ShieldUser, SquareUser, User, UserRound } from "lucide-react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

export const ProfileDropDown = ({ setOpenProfileModal }) => {
  const { profile, setProfile, permissions } = useContext(ProfileContext);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      setProfile(null);
      localStorage.removeItem("cached_all_roles");
      localStorage.removeItem("ally-supports-cache");
      localStorage.removeItem("cached_permissions");
      localStorage.removeItem("cached_profile");
      localStorage.removeItem("cached_teams_by_org");
      localStorage.removeItem("roleID");
      localStorage.removeItem("roleName");
      localStorage.removeItem("team_a490743f-e701-44d2-8374-0cc43df0d0b5");
      localStorage.removeItem("sb-mlrftwrafvvxgtaqsksh-auth-token");
      localStorage.removeItem("role_fc020fe3-e686-4677-8751-7fe73b1b837f");
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col overflow-hidden w-full">
      <div className="px-4 py-3 w-full">
        <p className="text-black dark:text-white text-sm poppins-regular tracking-wide">
          {profile?.first_name} {profile?.last_name}
        </p>
        <p className="text-black dark:text-stone-500 text-xs poppins-regular tracking-wide mt-1">
          {profile?.role_name}
        </p>
      </div>
      <div className="h-[1px] w-full bg-stone-300 dark:bg-stone-700"></div>
      <div className="px-3 py-3 w-full flex flex-col gap-2">
        <Button
          size="md"
          variant="invisible"
          icon={UserRound}
          pushLeft={true}
          onClick={() => {
            router.push("/app/profile");
            setOpenProfileModal(false);
          }}
        >
          Profile
        </Button>
        <Button
          size="md"
          variant="invisible"
          pushLeft={true}
          icon={Building2}
          onClick={() => {
            router.push("/app/organization/info");
            setOpenProfileModal(false);
          }}
        >
          Organization
        </Button>
      </div>
      <div className="h-[1px] w-full bg-stone-300 dark:bg-stone-700"></div>
      <div className="px-4 py-4 w-full flex flex-col gap-2">
        <Button
          size="sm"
          variant="destructive"
          icon={LogOut}
          onClick={() => {
            handleLogout();
          }}
        >
          Log Out
        </Button>
      </div>
    </div>
  );
};