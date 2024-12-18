"use client";

import { TypewriterEffectSmoothDemo } from "./components/writer";
import { FloatingDock } from "./components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconRobot,
  IconBrandTelegram
} from "@tabler/icons-react";
import FeaturesSection from "./components/Hover";
import { FlipWordsDemo } from "./components/Hero";


export default function Home() {
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
          href: "#",
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
          href: "#",
        },
      ];
    return (
        <div className="pb-9">
            <TypewriterEffectSmoothDemo/>
            <FlipWordsDemo/>
            <FeaturesSection/>
            <FloatingDock
                items={links}
            />
        </div>
    );
}
