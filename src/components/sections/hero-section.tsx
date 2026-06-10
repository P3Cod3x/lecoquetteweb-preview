"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { LeCoquetteWordmark } from "@/components/ui/lecoquette-wordmark";
import { ensureGsap } from "@/lib/motion/gsap";
import { usePrefersReducedMotion } from "@/lib/motion/reduced-motion";
import { assetPath } from "@/lib/utils";
import { siteConfig } from "@/lib/site";


export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      const { gsap, ScrollTrigger } = ensureGsap();

      // --- Entry animations ---
      // On the first visit the brand loader owns the intro: it paints the same
      // wordmark and hands the scene over via `loader:reveal`. In that case the
      // hero wordmark is already settled (it visually continues the loader's),
      // and only the supporting elements fade in once the veil lifts. On a
      // return visit the loader is skipped, so the hero plays its own entrance.
      const loaderActive =
        typeof window !== "undefined" && !window.sessionStorage.getItem("lecoquette-loader-seen");

      const revealSupporting = () =>
        gsap.fromTo(
          ".hero-reveal",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", stagger: 0.12 }
        );

      let onReveal: (() => void) | undefined;
      let fallbackId = 0;

      if (loaderActive) {
        gsap.set(".hero-logo", { yPercent: 0, opacity: 1 });
        gsap.set(".hero-reveal", { opacity: 0 });
        onReveal = () => revealSupporting();
        window.addEventListener("loader:reveal", onReveal, { once: true });
        fallbackId = window.setTimeout(revealSupporting, 2600);
      } else {
        gsap.fromTo(
          ".hero-logo",
          { yPercent: 18, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.1, ease: "power3.out", delay: 0.1 }
        );
        gsap.fromTo(
          ".hero-reveal",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", delay: 0.5, stagger: 0.12 }
        );
      }

      // --- Parallax scroll (mientras la siguiente sección cubre el hero) ---
      // El trigger va desde "top top" hasta "bottom top":
      // es decir, desde que la sección está 100% visible hasta que queda 100% cubierta.
      const parallaxTrigger = {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1, // suavidad del scrub
      };

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Background: capa más lenta — sensación de profundidad lejana
        gsap.to(".hero-bg", {
          yPercent: -18,
          ease: "none",
          scrollTrigger: parallaxTrigger,
        });

        // Texto: capa media — movimiento sutil
        gsap.to(".hero-content", {
          yPercent: -12,
          ease: "none",
          scrollTrigger: parallaxTrigger,
        });
      });

      mm.add("(max-width: 767px)", () => {
        // Parallax reducido en móvil
        gsap.to(".hero-bg", {
          yPercent: -10,
          ease: "none",
          scrollTrigger: parallaxTrigger,
        });
        gsap.to(".hero-content", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: parallaxTrigger,
        });
      });

      return () => {
        if (onReveal) window.removeEventListener("loader:reveal", onReveal);
        if (fallbackId) window.clearTimeout(fallbackId);
        mm.revert();
        ScrollTrigger.getAll().forEach((t) => {
          if (containerRef.current?.contains(t.trigger as Node)) t.kill();
        });
      };
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={containerRef}
      className="sticky top-0 h-[100dvh] overflow-hidden"
      style={{ zIndex: 1 }}
      data-header-theme="dark"
    >
      <div className="absolute inset-0">
        {/* Background — clase hero-bg para parallax */}
        <Image
          src={assetPath("/assets/branding/Background2.png")}
          alt=""
          fill
          priority
          fetchPriority="high"
          className="hero-bg object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Contenido central — clase hero-content para parallax unificado */}
      <div className="hero-content absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-5 pt-32 sm:px-6 sm:pt-28 md:px-4 md:pt-0 gap-0">
        <h1
          className="hero-logo m-0 w-full max-w-[30rem] p-0 sm:max-w-[30rem] md:max-w-[min(98vw,112rem)]"
        >
          <span className="sr-only">LeCoquette</span>
          <LeCoquetteWordmark
            tone="warm"
            zoom={5}
            className="mx-auto w-full"
          />
        </h1>

        <p
          className="hero-reveal font-body mt-7 text-center uppercase sm:mt-8 md:mt-10"
          style={{
            fontSize: "clamp(0.66rem, 2.2vw, 0.94rem)",
            color: "color-mix(in oklab, var(--color-primary) 75%, transparent)",
            letterSpacing: "clamp(0.12em, 1vw, 0.3em)",
            textShadow: "1px 2px 6px rgba(90,28,8,0.18)",
            width: "min(34rem, 100%)",
            lineHeight: 1.65,
          }}
        >
          {siteConfig.heroTitle}
          <br />
          Nails · Brows · Beauty Rituals
        </p>
      </div>

      {/* Scroll hint */}
      <div className="hero-reveal absolute bottom-5 left-0 w-full flex justify-center pointer-events-none">
        <span
          className="hero-scroll-line block w-px"
          style={{ height: "3rem", background: "color-mix(in oklab, var(--color-primary) 40%, transparent)" }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
