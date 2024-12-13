"use client";

import { TypewriterEffectSmooth } from "./components/ui/typewriter-effect";
import { FloatingDock } from "./components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";
import { TableFooter } from "@mui/material";
import Image from "next/image";

export default function Home() {
    const links = [
        {
          title: "Home",
          icon: (
            <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
          ),
          href: "#",
        },
    
        {
          title: "Products",
          icon: (
            <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
          ),
          href: "#",
        },
        {
          title: "Components",
          icon: (
            <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
          ),
          href: "#",
        },
        {
          title: "Aceternity UI",
          
          href: "#",
        },
        {
          title: "Changelog",
          icon: (
            <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
          ),
          href: "#",
        },
    
        {
          title: "Twitter",
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
    const words = [
        {
            text: "Prompt",
        },
        {
            text: "the speed",
        },
        {
            text: "of Solana",
        },
        {
            text: "with",
        },
        {
            text: "Archturus.",
            className: "text-violet-500 dark:text-violet-500",
        },
    ];
    return (
        <div className="flex flex-col items-center justify-center h-[40rem]">
            <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">
                Empowering your blockchain experience
            </p>
            <TypewriterEffectSmooth words={words} />
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
                <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
                    Docs
                </button>
                <button className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm">
                    Launch app
                </button>
            </div>
            <footer>
            <FloatingDock
                mobileClassName="translate-y-20" // only for demo, remove for production
                items={links}
              />
            </footer>
      
        </div>
    );
}
