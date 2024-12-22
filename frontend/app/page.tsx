"use client";

import { useEffect, useRef } from "react";
import { TypewriterEffectSmoothDemo } from "./components/writer";
import { FloatingDock } from "./components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconRobot,
  IconBrandTelegram,
} from "@tabler/icons-react";
import Image from "next/image";
import FeaturesSection from "./components/Hover";
import { FlipWordsDemo } from "./components/Hero";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const links = [
    {
      title: "Chatbot",
      icon: (
        <IconRobot className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/Chat",
    },
    {
      title: "Telegram",
      icon: (
        <IconBrandTelegram className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://t.me/arcturusAI_bot",
    },
    {
      title: "X",
      icon: (
        <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://x.com/arcturus_sol",
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://github.com/dimitrov-d/arcturus",
    },
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error("Audio playback failed:", err);
      });
    }
  }, []);

  return (
    <div className="pb-9">
      {/* Audio Element */}
      <audio ref={audioRef} src="/audio.mp3" preload="auto" />

      <TypewriterEffectSmoothDemo />
      <div className="flex flex-col items-center justify-center h-[40rem]">
        <Image src={"/linear.png"} alt="image" width={600} height={500} />
      </div>
      <FlipWordsDemo />
      <FeaturesSection />
      <FloatingDock items={links} />
    </div>
  );
}
