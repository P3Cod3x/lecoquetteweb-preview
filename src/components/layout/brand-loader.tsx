"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsap } from "@/lib/motion/gsap";
import { usePrefersReducedMotion } from "@/lib/motion/reduced-motion";
import { LeCoquetteWordmark } from "@/components/ui/lecoquette-wordmark";
import { siteConfig } from "@/lib/site";

const STORAGE_KEY = "lecoquette-loader-seen";

/**
 * Brand loader → hero handoff.
 *
 * The loader paints the exact hero composition (same warm wordmark, same size
 * and position) over an opaque cream veil. The wordmark breathes in — soft
 * blur to sharp with a gentle settle — then the veil dissolves slowly to reveal
 * the hero photo already sitting behind the identical wordmark, so loader and
 * hero read as one continuous, flowing scene rather than two separate moments.
 */
export function BrandLoader() {
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    window.dispatchEvent(new Event("lenis:stop"));

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
      window.dispatchEvent(new Event("lenis:start"));
    };
  }, [visible]);

  useGSAP(
    () => {
      const loader = containerRef.current;
      if (!loader) return;

      const { gsap } = ensureGsap();
      const dismiss = () => {
        window.sessionStorage.setItem(STORAGE_KEY, "true");
        setVisible(false);
      };
      const handoff = () => {
        window.dispatchEvent(new Event("loader:reveal"));
      };
      const veil = [".brand-loader-veil", ".brand-loader-ambient", ".brand-loader-grain"];

      // Returning within the session: hand over and clear instantly.
      if (window.sessionStorage.getItem(STORAGE_KEY)) {
        handoff();
        gsap.to(loader, { autoAlpha: 0, duration: 0.18, ease: "power2.out", onComplete: dismiss });
        return;
      }

      // Reduced motion: no choreography, just a calm cross-dissolve into the hero.
      if (reducedMotion) {
        gsap
          .timeline({ onComplete: dismiss })
          .fromTo(".brand-loader-mark", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power2.out" })
          .to({}, { duration: 0.7 })
          .add(handoff)
          .to(veil, { autoAlpha: 0, duration: 0.6, ease: "power1.inOut" }, "<")
          .to(".brand-loader-mark", { autoAlpha: 0, duration: 0.5, ease: "power1.inOut" }, "<+0.2");
        return;
      }

      gsap.set(".brand-loader-glint", { xPercent: -130, autoAlpha: 0 });

      gsap
        .timeline({ defaults: { ease: "power2.out" }, onComplete: dismiss })
        // Wordmark breathes in: soft blur → sharp, gentle settle.
        .fromTo(".brand-loader-ambient", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0)
        .fromTo(
          ".brand-loader-mark",
          { autoAlpha: 0, scale: 0.965, filter: "blur(12px)" },
          { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.15, ease: "power2.out" },
          0.1
        )
        // A single slow highlight glides across.
        .to(".brand-loader-glint", { autoAlpha: 0.45, duration: 0.25 }, 0.6)
        .to(".brand-loader-glint", { xPercent: 130, duration: 1.0, ease: "sine.inOut" }, 0.6)
        .to(".brand-loader-glint", { autoAlpha: 0, duration: 0.3 }, 1.4)
        // Hold the finished wordmark a beat so it can be seen.
        // ── Handoff: wake the hero, then slowly lift the cream veil off the photo ──
        .add(handoff, 2.0)
        .to(veil, { autoAlpha: 0, duration: 0.95, ease: "power1.inOut" }, 2.0)
        // Cross the loader wordmark into the hero's identical wordmark.
        .to(".brand-loader-mark", { autoAlpha: 0, duration: 0.6, ease: "power1.inOut" }, 2.3);
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="brand-loader-shell pointer-events-auto fixed inset-0 z-[120] overflow-hidden"
      aria-hidden="true"
    >
      <div className="brand-loader-veil absolute inset-0" />
      <div className="brand-loader-ambient absolute inset-0" />
      <div className="brand-loader-grain absolute inset-0" />

      {/* Mirror of the hero composition so the wordmark lands exactly where the hero's will be. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-5 pt-32 sm:px-6 sm:pt-28 md:px-4 md:pt-0">
        <div className="brand-loader-mark relative m-0 w-full max-w-[30rem] sm:max-w-[30rem] md:max-w-[min(98vw,112rem)]">
          <LeCoquetteWordmark tone="warm" zoom={5} className="mx-auto w-full" />
          <span className="brand-loader-glint pointer-events-none absolute inset-y-[-10%] left-1/2 w-[24%] -skew-x-12 bg-white/50 blur-2xl" />
        </div>

        {/* Invisible twin of the hero tagline — keeps the wordmark's vertical center identical. */}
        <p
          className="font-body mt-7 text-center uppercase opacity-0 sm:mt-8 md:mt-10"
          aria-hidden="true"
          style={{
            fontSize: "clamp(0.66rem, 2.2vw, 0.94rem)",
            letterSpacing: "clamp(0.12em, 1vw, 0.3em)",
            width: "min(34rem, 100%)",
            lineHeight: 1.65,
          }}
        >
          {siteConfig.heroTitle}
          <br />
          Nails · Brows · Beauty Rituals
        </p>
      </div>
    </div>
  );
}
