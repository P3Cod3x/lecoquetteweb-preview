"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsap } from "@/lib/motion/gsap";
import { ButtonLink } from "@/components/ui/button";
import { getBookingLink } from "@/lib/booking/get-booking-link";
import { cn } from "@/lib/utils";

const links = [
  { href: "#top", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

type MobileNavProps = {
  tone: "light" | "dark";
};

export function MobileNav({ tone }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  // Mount on open; the GSAP exit timeline unmounts on close (see below).
  const openNav = () => {
    setMounted(true);
    setOpen(true);
  };
  const closeNav = () => setOpen(false);

  // Scroll lock + Escape to close, only while present.
  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNav();
    };

    document.body.style.overflow = "hidden";
    window.dispatchEvent(new Event("lenis:stop"));
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.dispatchEvent(new Event("lenis:start"));
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mounted]);

  useGSAP(
    () => {
      if (!mounted) return;
      const { gsap } = ensureGsap();
      const overlay = overlayRef.current;
      const panel = panelRef.current;
      if (!overlay || !panel) return;

      const items = panel.querySelectorAll(".mn-item");

      if (open) {
        gsap
          .timeline()
          .set(panel, { xPercent: 100 })
          .set(overlay, { autoAlpha: 0 })
          .to(overlay, { autoAlpha: 1, duration: 0.3, ease: "power2.out" }, 0)
          .to(panel, { xPercent: 0, duration: 0.55, ease: "power4.out" }, 0)
          .fromTo(
            items,
            { autoAlpha: 0, x: 28 },
            { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.05, ease: "power3.out" },
            0.18
          );
      } else {
        gsap
          .timeline({ onComplete: () => setMounted(false) })
          .to(items, { autoAlpha: 0, x: 20, duration: 0.2, ease: "power2.in" }, 0)
          .to(panel, { xPercent: 100, duration: 0.4, ease: "power3.in" }, 0.05)
          .to(overlay, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0.05);
      }
    },
    { dependencies: [open, mounted] }
  );

  return (
    <>
      <button
        className={cn(
          "relative z-[80] inline-flex h-12 w-12 cursor-pointer items-center justify-center transition-all duration-[var(--duration-medium)] ease-standard md:h-14 md:w-14",
          tone === "light" ? "text-white" : "text-foreground-strong/80"
        )}
        onClick={() => (open ? closeNav() : openNav())}
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="site-navigation-drawer"
      >
        <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
        <span className="relative flex h-4 w-7 flex-col justify-between md:h-5 md:w-8">
          <span
            className={cn(
              "block rounded-full bg-current transition-all duration-300 ease-standard",
              open
                ? "w-7 translate-y-[7px] rotate-45 origin-center md:w-8 md:translate-y-[9px]"
                : "w-7 origin-right md:w-8"
            )}
            style={{ height: "0.9px" }}
          />
          <span
            className={cn(
              "block rounded-full bg-current transition-all duration-300 ease-standard",
              open ? "opacity-0" : "w-4 self-end opacity-100 md:w-5"
            )}
            style={{ height: "0.9px" }}
          />
          <span
            className={cn(
              "block rounded-full bg-current transition-all duration-300 ease-standard",
              open
                ? "w-7 -translate-y-[7px] -rotate-45 origin-center md:w-8 md:-translate-y-[9px]"
                : "w-5 self-end origin-right md:w-6"
            )}
            style={{ height: "0.9px" }}
          />
        </span>
      </button>

      {mounted ? (
        <>
          <div
            ref={overlayRef}
            className="fixed inset-0 z-[60] bg-[rgba(28,16,10,0.24)] backdrop-blur-[10px]"
            onClick={closeNav}
            aria-hidden="true"
          />
          <aside
            ref={panelRef}
            id="site-navigation-drawer"
            className="fixed inset-y-0 right-0 z-[70] flex w-[min(34rem,100vw)] flex-col border-l border-[rgba(137,63,39,0.08)] bg-[linear-gradient(180deg,rgba(255,252,248,0.985)_0%,rgba(255,246,240,0.97)_58%,rgba(249,236,228,0.97)_100%)] px-8 pb-8 pt-24 shadow-[-28px_0_90px_rgba(54,20,7,0.12)] md:px-12 md:pt-28"
            aria-modal="true"
            role="dialog"
            aria-label="Site navigation"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,230,213,0.55),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.26),transparent_38%,rgba(193,97,68,0.04)_100%)]" />

            <div className="relative flex h-full flex-col">
              <div className="mb-10 pt-12 text-center">
                <p className="font-body text-[0.68rem] uppercase tracking-[0.42em] text-foreground-muted">
                  Navigation
                </p>
              </div>

              <nav className="flex flex-1 flex-col items-center justify-center gap-8" aria-label="Primary">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="mn-item group flex min-w-[12rem] flex-col items-center gap-3 text-center text-[clamp(2rem,6vw,3.2rem)] font-display leading-[0.92] tracking-[-0.05em] text-foreground-strong transition-colors duration-[var(--duration-medium)] ease-standard hover:text-primary focus-visible:text-primary"
                    onClick={closeNav}
                  >
                    <span>{link.label}</span>
                    <span
                      className="h-px w-0 bg-primary transition-all duration-300 ease-standard group-hover:w-16 group-focus-visible:w-16"
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </nav>

              <div className="mn-item flex flex-col items-center pt-8 text-center">
                <p className="text-[0.72rem] uppercase tracking-[0.34em] text-foreground-muted">Reserve</p>
                <p className="mt-4 max-w-[18rem] font-body text-[0.98rem] leading-7 text-foreground">
                  Book your appointment in a calmer flow designed around the mobile experience first.
                </p>
                <ButtonLink
                  href={getBookingLink("mobile-nav")}
                  variant="ghost"
                  size="none"
                  className="text-primary mt-8 bg-transparent px-0 py-0 font-display text-[1.3rem] capitalize tracking-[-0.03em] shadow-none hover:bg-transparent hover:opacity-70"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeNav}
                >
                  Reserve an Appointment
                </ButtonLink>
              </div>
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
