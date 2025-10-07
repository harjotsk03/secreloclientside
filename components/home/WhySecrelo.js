import { Upload, Share2, ShieldCheck, X, Check } from "lucide-react";

const steps = [
  {
    title: "1. Upload Keys",
    description:
      "Upload your .env or secret file. It’s encrypted on your device before leaving your computer.",
    icon: Upload,
  },
  {
    title: "2. Share Data",
    description:
      "Invite teammates. Each secret is encrypted for them individually using secure key cryptography.",
    icon: Share2,
  },
  {
    title: "3. Control Access",
    description:
      "Team members decrypt on their device. You decide who sees what, we never see your data.",
    icon: ShieldCheck,
  },
];

export default function WhySecrelo() {
  return (
    <div className="px-4 flex flex-col py-40 lg:px-40 xl:px-52 items-center justify-center">
      <div className="relative w-max flex items-center flex-row gap-2 rounded-full px-3 lg:px-4 py-1 lg:py-1.5 border border-transparent overflow-hidden flow-border z-10">
        <p className="relative z-10 poppins-regular text-xs text-green-main">
          Why Secrelo
        </p>
      </div>
      <p className="poppins-medium text-3xl mt-4 lg:w-7/12 xl:w-3/5 text-center">
        A <span className="text-green-main">smarter way</span> to share secrets,
        keys and passwords
      </p>
      <p className="text-neutral-600 text-xs lg:text-sm poppins-regular lg:w-4/5 xl:w-3/5 mt-2 text-center z-10">
        Other tools leave gaps that put your team at risk. Secrelo fills them
        with zero-knowledge encryption and per-user access control.
      </p>

      <div className="bg-neutral-100 rounded-3xl w-full p-2 flex flex-col lg:flex-row mt-8">
        <div className="px-7 py-5 w-full border-3 rounded-2xl border-transparent bg-transparent flex flex-col">
          <p className="poppins-medium text-xl">Other Tools</p>
          <div className="flex flex-row items-start gap-2 text-neutral-700 text-sm lg:text-sm poppins-regular mt-4 z-10">
            <div className="p-1 rounded-full border border-neutral-300 bg-white">
              <X size={12} />
            </div>
            <p>No version control and rollback options for maintainance of keys</p>
          </div>
          <div className="flex flex-row items-start gap-2 text-neutral-700 text-sm lg:text-sm poppins-regular mt-3 z-10">
            <div className="p-1 rounded-full border border-neutral-300 bg-white">
              <X size={12} />
            </div>
            <p>
              Cloud drives (Google Drive, Dropbox) offer no encryption-at-rest
            </p>
          </div>
          <div className="flex flex-row items-start gap-2 text-neutral-700 text-sm lg:text-sm poppins-regular mt-3 z-10">
            <div className="p-1 rounded-full border border-neutral-300 bg-white">
              <X size={12} />
            </div>
            <p>
              Once a key is leaked, there’s no way to revoke or control access
            </p>
          </div>
          <div className="flex flex-row items-start gap-2 text-neutral-700 text-sm lg:text-sm poppins-regular mt-3 z-10">
            <div className="p-1 rounded-full border border-neutral-300 bg-white">
              <X size={12} />
            </div>
            <p>Onboarding new teammates means insecure copy-pasting of keys</p>
          </div>
        </div>
        <div className="px-7 py-5 w-full border border-green-300 bg-gradient-to-br from-green-50 rounded-3xl to-green-100  flex flex-col">
          <p className="poppins-medium text-black roude text-xl">Secrelo</p>
          <div className="flex flex-row items-start gap-2 text-neutral-700 text-sm lg:text-sm poppins-regular mt-4 z-10">
            <div className="p-1 rounded-full border border-green-300 bg-green-100/70">
              <Check className="text-green-600" size={12} />
            </div>
            <p>
              Upload .env files and encrypt them on your device before they
              leave your computer
            </p>
          </div>
          <div className="flex flex-row items-start gap-2 text-neutral-700 text-sm lg:text-sm poppins-regular mt-3 z-10">
            <div className="p-1 rounded-full border border-green-300 bg-green-100/70">
              <Check className="text-green-600" size={12} />
            </div>
            <p>
              Per-user public/private key cryptography — only the right teammate
              can decrypt
            </p>
          </div>
          <div className="flex flex-row items-start gap-2 text-neutral-700 text-sm lg:text-sm poppins-regular mt-3 z-10">
            <div className="p-1 rounded-full border border-green-300 bg-green-100/70">
              <Check className="text-green-600" size={12} />
            </div>
            <p>Versioned secrets for easy rollback and accountability</p>
          </div>
          <div className="flex flex-row items-start gap-2 text-neutral-700 text-sm lg:text-sm poppins-regular mt-3 z-10">
            <div className="p-1 rounded-full border border-green-300 bg-green-100/70">
              <Check className="text-green-600" size={12} />
            </div>
            <p>
              AES-XChaCha20 + Libsodium, the same encryption used by
              Signal and WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
