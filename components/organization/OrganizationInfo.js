import { useRouter } from "next/router";
import { Button } from "../buttons/Button";
import { TextInput } from "../inputs/TextInput";
import { usePathname } from "next/navigation";
import { ProfileContext } from "../../context/ProfileContext";
import { useContext, useEffect, useState } from "react";
import { hasPermission } from "../../utils/permissions";
import { LocationSearchInput } from "../inputs/LocationSearchInput";
import { BriefcaseBusiness, IdCard, Laptop, Mail, MapPin, Phone } from "lucide-react";

export const OrganizationInfo = ({ organization, hasPermissions }) => {
  const { permissions } = useContext(ProfileContext);
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [industry, setIndustry] = useState("");
  const [isActive, setIsActive] = useState("");
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [organizationInfoEdited, setOrganizationInfoEdited] = useState(true);

  useEffect(() => {
    if (organization) {
      setEmail(organization.email ?? "");
      setId(organization.id ?? "");
      setIndustry(organization.industry ?? "");
      setIsActive(organization.is_active ?? "");
      setLocation(organization.location ?? "");
      setName(organization.name ?? "");
      setPhoneNumber(organization.phone_number ?? "");
      setWebsite(organization.website ?? "");
    }
  }, [organization]);

  useEffect(() => {
    const edited =
      email !== (organization?.email ?? "") ||
      name !== (organization?.name ?? "") ||
      industry !== (organization?.industry ?? "") ||
      phoneNumber !== (organization?.phone_number ?? "") ||
      location !== (organization?.location ?? "") ||
      website !== (organization?.website ?? "");

    setOrganizationInfoEdited(!edited);
  }, [email, name, industry, phoneNumber, location, website, organization]);

  return (
    <div className="flex flex-col bg-white dark:bg-darkBG rounded-xl mt-4 border border-stone-300 dark:border-stone-700/50">
      <div className="px-6 py-4 flex flex-row w-full gap-4 lg:gap-6">
        <p className="poppins-medium text-lg text-black dark:text-white">
          Organization Information
        </p>
      </div>
      <div className="h-[1px] w-full bg-stone-300 dark:bg-stone-700/50" />
      <div className="px-6 py-4 flex flex-col w-full gap-4 lg:gap-6">
        <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-6">
          <TextInput
            value={name}
            onChange={setName}
            icon={IdCard}
            label="Name"
            disabled={!hasPermission(permissions, "organization.edit")}
            placeholder=" - "
          />
          <TextInput
            value={email}
            icon={Mail}
            onChange={setEmail}
            label="Email"
            disabled={!hasPermission(permissions, "organization.edit")}
            placeholder=" - "
          />
        </div>
        <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-6">
          <TextInput
            value={industry}
            icon={BriefcaseBusiness}
            onChange={setIndustry}
            label="Industry"
            disabled={!hasPermission(permissions, "organization.edit")}
            placeholder=" - "
          />
          <TextInput
            icon={Phone}
            value={phoneNumber}
            type={"number"}
            onChange={setPhoneNumber}
            label="Phone Number"
            disabled={!hasPermission(permissions, "organization.edit")}
            placeholder=" - "
          />
        </div>
        <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-6">
          <LocationSearchInput
            disabled={!hasPermission(permissions, "organization.edit")}
            placeholder=" - "
            value={location}
            Icon={MapPin}
            label={"Location"}
            onChange={setLocation}
            onSelect={(selected) => {
              setLocation(selected);
            }}
          />
          <TextInput
            icon={Laptop}
            value={website}
            onChange={setWebsite}
            label="Website"
            disabled={!hasPermission(permissions, "organization.edit")}
            placeholder=" - "
          />
        </div>
      </div>
      <div className="h-[1px] w-full bg-stone-300 dark:bg-stone-700/50" />
      <div className="px-6 py-4 flex flex-row justify-end gap-4">
        <Button disabled={organizationInfoEdited} variant="primary">
          Save
        </Button>
        <Button disabled={organizationInfoEdited} variant="ghost">
          Cancel
        </Button>
      </div>
    </div>
  );
};
