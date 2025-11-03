"use client"
import Image from "next/image";
import useroneimage from "../../assets/useroneimage.png";
import usertwoimage from "../../assets/usertwoimage.png";
import userthreeimage from "../../assets/userthreeimage.png";
import { useRouter } from "next/navigation";
import { Button } from "../buttons/Button";

export default function Hero() {
  const router = useRouter();
  return (
    <div className="relative h-max px-4 py-32 lg:pt-32 lg:pb-44 flex flex-col gap-4 items-center justify-center">
      <div className="relative w-max flex items-center flex-row gap-2 rounded-full pl-1 lg:pl-1.5 pr-3 lg:pr-4 py-1 lg:py-1.5 border border-transparent overflow-hidden border-green-200 dark:border-green-700 bg-green-100 dark:bg-green-950 z-10">
        <div className="flex flex-row -space-x-2">
          <Image
            src={useroneimage}
            className="lg:w-6 lg:h-6 w-5 h-5 rounded-full border border-white dark:border-green-800"
            alt="User 1"
          />
          <Image
            src={usertwoimage}
            className="lg:w-6 lg:h-6 w-5 h-5 rounded-full border border-white dark:border-green-800"
            alt="User 2"
          />
          <Image
            src={userthreeimage}
            className="lg:w-6 lg:h-6 w-5 h-5 rounded-full border border-white dark:border-green-800"
            alt="User 3"
          />
        </div>

        <p className="relative z-10 poppins-regular text-xs text-[#0F8B4E] dark:text-green-700">
          Trusted by 200+ users
        </p>
      </div>

      <h1 className="poppins-medium text-black dark:text-white tracking-tight mt-2 lg:leading-none text-4xl lg:text-7xl lg:w-2/3 text-center z-10">
        From scattered keys to sharable, secure access.
      </h1>
      <p className="text-neutral-600 dark:text-stone-400 text-xs lg:text-sm poppins-regular lg:w-1/2 text-center z-10 mb-8">
        Secrelo encrypts and manages your .env files, API keys, and secrets so
        your team can access them safely, without email chains, Slack leaks, or
        shared passwords.
      </p>
      <Button onClick={() => router.push("/register")} size="lg">
        Register Now for Free
      </Button>
    </div>
  );
}
