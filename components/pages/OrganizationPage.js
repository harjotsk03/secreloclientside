import { useContext, useEffect } from "react";
import { ProfileContext } from "../../context/ProfileContext";
import { useOrganization } from "../../hooks/useOrganization";
import { BackButton } from "../buttons/BackButton";
import { OrganizationInfo } from "../organization/OrganizationInfo";
import { hasPermission } from "../../utils/permissions";

export const OrganizationPage = () => {
  const { profile, permissions } = useContext(ProfileContext);
  const { organization } = useOrganization(profile?.organization_id);
  return (
    <div>
      <BackButton />
      <p className="poppins-medium text-2xl text-black dark:text-white mt-2">
        Organization
      </p>
      <OrganizationInfo organization={organization} />
    </div>
  );
};
