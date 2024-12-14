import React from "react";
import { FlipWords } from "./ui/Spotlight"

export function FlipWordsDemo() {
  const words = ["Futuristic", "cutting-edge", "user-friendly", "Agentic"];

  return (
    <div className="h-[40rem] flex justify-center items-center px-4">
      <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-violet-400">
        Solana
        <FlipWords words={words} /> <br />
        with Arcturus
      </div>
    </div>
  );
}