"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { LeCoquetteWordmark } from "@/components/ui/lecoquette-wordmark";
import { cn } from "@/lib/utils";

type HeaderTone = "light" | "dark";

export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [leftTone, setLeftTone] = useState<HeaderTone>("dark");
  const [rightTone, setRightTone] = useState<HeaderTone>("dark");
  const toneRef = useRef({ left: "dark" as HeaderTone, right: "dark" as HeaderTone });

  const defaultTone = useMemo<HeaderTone>(() => {
    return pathname === "/" ? "dark" : "light";
  }, [pathname]);

  useEffect(() => {
    toneRef.current = { left: defaultTone, right: defaultTone };

    const resolveToneAtPoint = (x: number, y: number): HeaderTone => {
      const headerNode = headerRef.current;
      let current = document.elementFromPoint(x, y) as HTMLElement | null;

      while (current) {
        if (headerNode?.contains(current)) {
          current = current.parentElement;
          continue;
        }

        const tone = current.dataset.headerTheme;

        if (tone === "light" || tone === "dark") {
          return tone;
        }

        current = current.parentElement;
      }

      return defaultTone;
    };

    let rafId = 0;

    const updateTones = () => {
      rafId = 0;

      const viewportWidth = window.innerWidth;
      const sampleY = Math.max(24, (headerRef.current?.getBoundingClientRect().height ?? 64) / 2);
      const nextLeftTone = resolveToneAtPoint(Math.min(88, viewportWidth * 0.18), sampleY);
      const nextRightTone = resolveToneAtPoint(Math.max(viewportWidth - 72, viewportWidth * 0.84), sampleY);

      if (toneRef.current.left !== nextLeftTone) {
        toneRef.current.left = nextLeftTone;
        setLeftTone(nextLeftTone);
      }

      if (toneRef.current.right !== nextRightTone) {
        toneRef.current.right = nextRightTone;
        setRightTone(nextRightTone);
      }
    };

    const requestUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateTones);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [defaultTone]);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-transparent px-5 py-4 transition-all duration-500 md:px-8 md:py-5"
    >
      <Link
        href="/"
        className={cn(
          "relative z-[60] block w-[10.5rem] transition-colors duration-500 md:w-[13rem]",
          leftTone === "light" ? "text-white" : "text-foreground-strong/80"
        )}
        aria-label="LeCoquette home"
      >
        <LeCoquetteWordmark tone="ink" className="w-full" />
      </Link>
      <MobileNav tone={rightTone} />
    </header>
  );
}
