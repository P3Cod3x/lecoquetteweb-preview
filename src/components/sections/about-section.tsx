"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsap } from "@/lib/motion/gsap";
import { usePrefersReducedMotion } from "@/lib/motion/reduced-motion";
import { assetPath } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/eyebrow";


const PILLARS = [
  { label: "Location", value: "Gainesville, FL" },
  { label: "Specialty", value: "Nail · Brow · Beauty" },
  { label: "Experience", value: "By appointment" },
];

function DesktopAbout() {
  const outerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const { gsap } = ensureGsap();

      if (reducedMotion) {
        gsap.set(".ab-panel", { yPercent: 0 });
        gsap.set(".ab-copy", { opacity: 1, y: 0 });
        return;
      }

      const takeover = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: "top bottom",
          end: "top top",
          scrub: 1,
        },
      });

      takeover.fromTo(
        ".ab-panel",
        { yPercent: 100, opacity: 1 },
        { yPercent: 0, opacity: 1, ease: "none" }
      );

      gsap.fromTo(
        ".ab-copy",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.82,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: outerRef.current,
            start: "top 35%",
            once: true,
          },
        }
      );
    },
    { scope: outerRef, dependencies: [reducedMotion] }
  );

  return (
    <div
      ref={outerRef}
      className="relative hidden md:block"
      style={{ height: "200vh", marginTop: "-100vh", zIndex: 20 }}
    >
      <div className="ab-panel sticky top-0 h-screen overflow-hidden" data-header-theme="light">
        <div className="ab-image absolute inset-0">
          <Image
            src={assetPath("/assets/services/about_new.png")}
            alt="LeCoquette spa atmosphere"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(270deg, color-mix(in oklab, var(--color-noir-deep) 95%, transparent) 0%, color-mix(in oklab, var(--color-noir-deep) 88%, transparent) 35%, color-mix(in oklab, var(--color-noir-deep) 50%, transparent) 65%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--color-noir) 22%, transparent) 0%, transparent 32%, transparent 72%, color-mix(in oklab, var(--color-noir) 34%, transparent) 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative ml-auto flex h-full max-w-[42rem] flex-col justify-center px-10 py-20 text-left xl:px-16">
          <Eyebrow tone="accent" lines="start" className="ab-copy mb-6">
            Our Story
          </Eyebrow>

          <h2
            className="ab-copy font-display m-0"
            style={{
              fontSize: "clamp(3.2rem, 6vw, 5.6rem)",
              lineHeight: 0.96,
              letterSpacing: "-0.03em",
              color: "var(--color-background)",
              textShadow: "0 4px 24px rgba(0,0,0,0.4)",
            }}
          >
            A softer kind
            <br />
            <span style={{ color: "var(--color-noir-accent)" }}>of luxury.</span>
          </h2>

          <p
            className="ab-copy font-body mt-7 max-w-[34ch]"
            style={{
              fontSize: "clamp(0.95rem, 1.45vw, 1.05rem)",
              lineHeight: 1.88,
              color: "color-mix(in oklab, var(--color-noir-foreground) 80%, transparent)",
              textShadow: "0 2px 14px rgba(0,0,0,0.5)",
            }}
          >
            Every Gainesville appointment at LeCoquette is designed to feel like
            more than a service: warm, deliberate, and always personal. A refined
            nail and beauty experience that stays with you long after you leave.
          </p>

          <div className="ab-copy mt-10 mb-8 h-px w-10" style={{ background: "color-mix(in oklab, var(--color-noir-accent) 38%, transparent)" }} />

          <div className="flex flex-col gap-4">
            {PILLARS.map((pillar) => (
              <div key={pillar.label} className="ab-copy flex items-baseline gap-5">
                <span
                  className="font-body w-24 shrink-0 text-[0.62rem] uppercase tracking-[0.24em]"
                  style={{ color: "color-mix(in oklab, var(--color-noir-accent) 64%, transparent)" }}
                >
                  {pillar.label}
                </span>
                <span
                  className="font-body"
                  style={{ fontSize: "0.9rem", fontWeight: 500, color: "color-mix(in oklab, var(--color-noir-foreground) 90%, transparent)" }}
                >
                  {pillar.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileAbout() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const { gsap } = ensureGsap();

      if (reducedMotion) {
        gsap.set(".mob-ab-copy", { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        ".mob-ab-copy",
        { opacity: 0, y: 22, immediateRender: false },
        {
          opacity: 1,
          y: 0,
          duration: 0.82,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 35%",
            once: true,
          },
        }
      );
    },
    { scope: ref, dependencies: [reducedMotion] }
  );

  return (
    <div
      ref={ref}
      className="relative md:hidden"
      style={{ zIndex: 20 }}
    >
      <div
        className="mob-ab-panel overflow-hidden"
        data-header-theme="light"
      >
        <div className="relative min-h-[100svh]">
          <Image
            src={assetPath("/assets/services/about_new.png")}
            alt="LeCoquette spa atmosphere"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--color-noir-deep) 16%, transparent) 0%, color-mix(in oklab, var(--color-noir-deep) 40%, transparent) 40%, color-mix(in oklab, var(--color-noir-deep) 88%, transparent) 75%, color-mix(in oklab, var(--color-noir-deep) 95%, transparent) 100%)",
            }}
            aria-hidden="true"
          />

          <div className="relative flex min-h-[100svh] items-end px-5 pb-14 pt-28">
            <div className="ml-auto w-full max-w-[22rem] text-right">
              <Eyebrow tone="accent" lines="end" lineClassName="w-7" className="mob-ab-copy mb-5 ml-auto">
                Our Story
              </Eyebrow>

              <h2
                className="mob-ab-copy font-display m-0"
                style={{
                  fontSize: "clamp(2.8rem, 10vw, 4rem)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.03em",
                  color: "var(--color-background)",
                  textShadow: "0 4px 24px rgba(0,0,0,0.4)",
                }}
              >
                A softer kind
                <br />
                <span style={{ color: "var(--color-noir-accent)" }}>of luxury.</span>
              </h2>

              <p
                className="mob-ab-copy font-body mt-5 ml-auto max-w-[31ch]"
                style={{
                  fontSize: "0.96rem",
                  lineHeight: 1.82,
                  color: "color-mix(in oklab, var(--color-noir-foreground) 82%, transparent)",
                  textShadow: "0 2px 14px rgba(0,0,0,0.5)",
                }}
              >
                Every Gainesville appointment at LeCoquette is designed to feel
                warm, personal, and composed from beginning to end.
              </p>

              <div className="mob-ab-copy mt-8 flex flex-col gap-3">
                {PILLARS.map((pillar) => (
                  <div key={pillar.label} className="flex items-baseline justify-end gap-4">
                    <span
                      className="font-body"
                      style={{ fontSize: "0.875rem", fontWeight: 500, color: "color-mix(in oklab, var(--color-background) 90%, transparent)" }}
                    >
                      {pillar.value}
                    </span>
                    <span
                      className="font-body w-20 shrink-0 text-right text-[0.62rem] uppercase tracking-[0.22em]"
                      style={{ color: "color-mix(in oklab, var(--color-noir-accent) 72%, transparent)" }}
                    >
                      {pillar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-24"
      style={{ position: "relative", zIndex: 20, overflow: "clip" }}
    >
      <MobileAbout />
      <DesktopAbout />
    </section>
  );
}
