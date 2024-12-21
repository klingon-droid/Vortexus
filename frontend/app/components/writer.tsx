"use client";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
import Link from "next/link";
export function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: "Prompt",
    },
    {
      text: "at",
    },
    {
      text: "the",
    },
    {
      text: "speed",
    },
    {
      text: "of Solana with",
    },
    {
      text: "Arcturus.",
      className: "text-violet-500 dark:text-violet-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]  ">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
        The road to freedom starts from here
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <Link href="/Chat">
          <button className="w-40 h-10 rounded-xl bg-violet-500 border dark:border-white border-transparent text-white text-sm">
            Arcturus Web agent
          </button>
        </Link>
        <Link href="https://t.me/arcturusAI_bot">
          <button className="w-40 h-10 rounded-xl bg-violet-500 text-white border border-gray-300  text-sm">
            Arcturus Telegram agent
          </button>
        </Link>
      </div>
    </div>
  );
}
