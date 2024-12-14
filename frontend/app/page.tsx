"use client";

import { TypewriterEffectSmoothDemo } from "./components/writer";
import { FloatingDock } from "./components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconRobot,
  IconBrandTelegram
} from "@tabler/icons-react";
import { FeaturesSection } from "./components/Hover";
import { FlipWordsDemo } from "./components/Hero";

export const projects = [
  {
    title: "Stripe",
    description:
      "A technology company that builds economic infrastructure for the internet.",
    link: "https://stripe.com",
  },
  {
    title: "Netflix",
    description:
      "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
    link: "https://netflix.com",
  },
  {
    title: "Google",
    description:
      "A multinational technology company that specializes in Internet-related services and products.",
    link: "https://google.com",
  },

];

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
          href: "#",
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
