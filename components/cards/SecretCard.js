import { BookText, Copy } from "lucide-react";
import { Button } from "../../components/buttons/Button";
import { formatDateTime } from "../../utils/formatDateTime";
import { formatSecretType } from "../../utils/formatSecretType";

export default function SecretCard({
  secret,
  setActiveKey,
  setShowKeyDetailsModal,
}) {
  return (
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
        <Button size="sm" variant="ghost" icon={Copy}></Button>
        <Button
          onClick={() => {
            setActiveKey(secret);
            setShowKeyDetailsModal(true);
          }}
          size="sm"
        >
          View
        </Button>
      </div>
    </div>
  );
}
