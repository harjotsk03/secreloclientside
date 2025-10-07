import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="bg-gradient-to-b rounded-t-3xl items-start flex flex-col justify-between lg:flex-row  from-green-100/60 px-12 py-10 to-transparent rounded-t-4xl w-11/12 mx-auto">
      <div className="flex flex-col">
        <p className="poppins-medium text-xl text-green-main">
          secrelo<span className="text-black">.</span>
        </p>
        <p className="poppins-regular text-sm text-black mt-1">
          No leaks. No shared passwords. Just Secrelo.
        </p>
        <p className="poppins-regular text-xs text-stone-700 mt-6">
          Copyright © Secrelo 2025. All rights reserved
        </p>
      </div>
      <div className="flex flex-row gap-3 items-center mt-2">
        <a className="w-9 h-9 hover:cursor-pointer flex items-center justify-center rounded-full bg-white text-black hover:bg-green-900 hover:text-white transform transition-all duration-500 hover:rotate-[360deg]">
          <FaInstagram size={19} />
        </a>
        <a className="w-9 h-9 hover:cursor-pointer flex items-center justify-center rounded-full bg-white text-black hover:bg-green-900 hover:text-white transform transition-all duration-500 hover:rotate-[360deg]">
          <FaLinkedinIn size={16} />
        </a>
        <a className="w-9 h-9 hover:cursor-pointer flex items-center justify-center rounded-full bg-white text-black hover:bg-green-900 hover:text-white transform transition-all duration-500 hover:rotate-[360deg]">
          <FaGithub size={17} />
        </a>
      </div>
    </div>
  );
}
