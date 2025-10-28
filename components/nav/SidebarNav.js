import {
  CirclePlus,
  ClipboardList,
  Folder,
  Home,
  Key,
  LayoutDashboard,
  LogOut,
  ScanEye,
  User,
  UserRoundSearch,
  Users,
} from "lucide-react";
import { SidebarNavButton } from "../buttons/SidebarNavButton";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "../buttons/Button";

export const SidebarNav = ({ sidebarOpen, toggleSidebar }) => {
  const router = useRouter();
  const [orgExpanded, setOrgExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("orgExpanded");
      return stored === "true";
    }
    return false;
  });

  const [injuryReportExpanded, setInjuryReportExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("injuryReportExpanded");
      return stored === "true";
    }
    return false;
  });

  const [formsExpanded, setFormsExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("formsExpanded");
      return stored === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("orgExpanded", orgExpanded.toString());
  }, [orgExpanded]);

  useEffect(() => {
    localStorage.setItem(
      "injuryReportExpanded",
      injuryReportExpanded.toString()
    );
  }, [injuryReportExpanded]);

  useEffect(() => {
    localStorage.setItem("formsExpanded", formsExpanded.toString());
  }, [formsExpanded]);

  return (
    <div className="flex flex-col gap-2">
      {/* <SidebarNavButton
        icon={BrainCircuit}
        expanded={formsExpanded}
        setExpanded={setFormsExpanded}
        sidebarOpen={sidebarOpen}
        onClick={() => {
          if (sidebarOpen) {
            toggleSidebar();
          }
        }}
        path={"dahdagybduaj8d7wgyabdnah78dgyawb"}
        label="Agents"
        subItems={[
          {
            label: "Agents",
            path: "blueprints",
            Icon: Bot,
            onClick: () => router.push("/app/agents/blueprints"),
          },
          {
            label: "Threads",
            path: "threads",
            Icon: MessageSquare,
            onClick: () => router.push("/app/agents/threads"),
          },
        ]}
      /> */}
      {/* <SidebarNavButton
        icon={ClipboardList}
        expanded={formsExpanded}
        setExpanded={setFormsExpanded}
        sidebarOpen={sidebarOpen}
        onClick={() => {
          if (sidebarOpen) {
            toggleSidebar();
          }
        }}
        path={"dahdagybduaj8d7wgyabdnah78dgyawb"}
        label="Forms"
        subItems={[
          {
            label: "Create Form",
            path: "createform",
            Icon: CirclePlus,
            onClick: () => router.push("/app/forms/createform"),
          },
          {
            label: "View Forms",
            path: "allforms",
            Icon: ScanEye,
            onClick: () => router.push("/app/forms/allforms"),
          },
        ]}
      /> */}
      <SidebarNavButton
        onClick={() => {
          router.push("/app/dashboard");
        }}
        sidebarOpen={sidebarOpen}
        path={"dashboard"}
        label="Dashboard"
        icon={LayoutDashboard}
      />
      <SidebarNavButton
        onClick={() => {
          router.push("/app/repos");
        }}
        sidebarOpen={sidebarOpen}
        path={"repos"}
        label="Repos"
        icon={Folder}
      />
      <SidebarNavButton
        onClick={() => {
          router.push("/app/profile");
        }}
        sidebarOpen={sidebarOpen}
        path={"profile"}
        label="Profile"
        icon={User}
      />

      {/* <SidebarNavButton
        sidebarOpen={sidebarOpen}
        path={"dashboard"}
        icon={LayoutDashboard}
        label={"Dashboard"}
        onClick={() => {
          router.push("/app/dashboard");
        }}
      /> */}
    </div>
  );
};
