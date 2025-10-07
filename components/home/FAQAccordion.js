"use client"
import React, { useState } from "react";

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How secure is Secrelo?",
      answer:
        "Secrelo uses zero-knowledge encryption, meaning your secrets are encrypted on your device before they ever reach our servers. We never see or store unencrypted data. Encryption is powered by AES-XChaCha20 and Libsodium — the same cryptography trusted by Signal and ProtonMail.",
    },
    // {
    //   question: "Can I use it with GitHub, Docker, or CI/CD pipelines?",
    //   answer:
    //     "Yes. You can export environment variables directly into your local dev environment or integrate with your CI/CD pipelines. Our CLI makes it simple to pull secrets securely during build and deploy steps.",
    // },
    {
      question: "How does team access work?",
      answer:
        "Each teammate gets their own encryption key pair. Secrets are encrypted per user, so only the right people can decrypt them. You can invite, revoke, or rotate access instantly without sharing passwords.",
    },
    {
      question: "What happens if someone leaves the team?",
      answer:
        "You can immediately revoke their access. Since secrets are encrypted per user, former team members lose the ability to decrypt any sensitive data the moment they’re removed.",
    },
    {
      question: "What about compliance (GDPR, SOC2)?",
      answer:
        "Because we use a zero-knowledge design, we cannot read your data. This reduces compliance risk significantly. All access and version changes are logged for audit purposes.",
    },
    {
      question: "How much does it cost?",
      answer:
        "Secrelo is free for teams up to 3 users. Paid plans start at $9/month per workspace with unlimited users, secrets, and version history.",
    },
  ];


  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div
      className="px-8 lg:px-40 py-10 pb-20"
      style={{ poppinsFamily: "Poppins, sans-serif" }}
    >
      <div className="mx-auto grid md:grid-cols-2 gap-12">
        {/* Left Column */}
        <div className="">
          <div className="relative w-max flex items-center flex-row gap-2 rounded-full px-3 lg:px-4 py-1 lg:py-1.5 border border-transparent overflow-hidden flow-border z-10">
            <p className="relative z-10 poppins-regular text-xs text-green-main">
              FAQ
            </p>
          </div>
          <p className="poppins-medium text-3xl mt-4 lg:w-4/5">
            Common Questions, with{" "}
            <span className="text-green-main">Clear Answers</span>
          </p>
          <p className="text-neutral-600 text-xs lg:text-sm poppins-regular lg:w-4/5 mt-2 z-10">
            Here are answers to the most common things people ask before getting
            started.
          </p>
        </div>

        {/* Right Column - Accordion */}
        <div className="space-y-4 w-full">
          {faqs.map((faq, index) => (
            <button
              key={index}
              onClick={() => toggleAccordion(index)}
              className="bg-stone-50 text-left w-full rounded-2xl overflow-hidden transition-all duration-300"
            >
              <div className="w-full px-6 py-5 flex items-center justify-between text-left ">
                <div className="flex items-center gap-4 flex-1">
                  {/* <span className="text-green-main poppins-medium text-lg">
                    {String(index + 1).padStart(2, "0")}.
                  </span> */}
                  <span className="text-gray-900 text-lg poppins-regular flex-1 pt-0.5">
                    {faq.question}
                  </span>
                </div>
                <div className="ml-4 mt-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openIndex === index ? "bg-green-main" : "bg-gray-300"
                    }`}
                  >
                    <svg
                      className={`w-3 h-3 text-white transition-transform duration-300 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-6 text-neutral-700 poppins-regular text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};