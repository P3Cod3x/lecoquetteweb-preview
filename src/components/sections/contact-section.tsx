"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsap } from "@/lib/motion/gsap";
import { usePrefersReducedMotion } from "@/lib/motion/reduced-motion";
import { getBookingLink } from "@/lib/booking/get-booking-link";
import { siteConfig } from "@/lib/site";
import { Eyebrow } from "@/components/ui/eyebrow";

const CONTACT_DETAILS = [
  { label: "Phone", value: siteConfig.phoneDisplay, href: `tel:${siteConfig.phoneHref}` },
  { label: "Instagram", value: siteConfig.instagramHandle, href: siteConfig.instagramUrl },
  { label: "Area", value: `${siteConfig.city}, ${siteConfig.region}` },
  { label: "Experience", value: "Luxury appointments by booking request" },
];

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const { gsap } = ensureGsap();

      gsap.fromTo(
        ".ct-item",
        { opacity: 0, y: 32, immediateRender: false },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="scroll-mt-24 relative overflow-hidden"
      style={{ zIndex: 10, background: "var(--color-background)" }}
      data-header-theme="dark"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 0%, color-mix(in oklab, var(--color-primary) 10%, transparent), transparent 65%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-6 py-28 text-center md:py-36">
        <Eyebrow lines="both" lineClassName="w-10 bg-primary/45" className="ct-item mb-8 justify-center gap-4">
          Reserve
        </Eyebrow>

        <h2
          className="ct-item font-display m-0"
          style={{
            fontSize: "clamp(3rem, 8vw, 6.5rem)",
            lineHeight: 0.98,
            letterSpacing: "-0.04em",
            color: "var(--color-foreground-strong)",
          }}
        >
          Book your
          <br />
          <span style={{ color: "var(--color-primary)" }}>Gainesville ritual.</span>
        </h2>

        <p
          className="ct-item font-body mx-auto mt-6 max-w-[38ch]"
          style={{
            fontSize: "clamp(0.95rem, 1.6vw, 1.05rem)",
            lineHeight: 1.82,
            color: "var(--color-foreground-muted)",
          }}
        >
          Reserve your luxury nail or beauty appointment in Gainesville, Florida,
          and step into the LeCoquette experience through the most direct path.
        </p>

        <div className="ct-item mt-10">
          <a
            href={getBookingLink("contact-section")}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 overflow-hidden px-1 pt-1 pb-2 font-display text-[1.2rem] tracking-[-0.02em] text-primary transition-colors hover:text-opacity-70"
        >
          <span className="relative">
            {siteConfig.bookingLabel}
            <span className="absolute -bottom-1 left-0 h-[1.5px] w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:origin-left group-hover:scale-x-100" />
          </span>
          <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5 pt-[2px]">
            <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          </a>
        </div>

        <div
          className="ct-item mx-auto mt-16 flex flex-col md:grid max-w-3xl gap-x-10 gap-y-10 border-t pt-12"
          style={{
            borderColor: "var(--color-border)",
            gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
            textAlign: "left"
          }}
        >
          {CONTACT_DETAILS.map((item) => (
            <div key={item.label}>
              <p
                className="font-body text-[0.60rem] uppercase tracking-[0.26em]"
                style={{ color: "color-mix(in oklab, var(--color-primary) 65%, transparent)" }}
              >
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="font-body mt-2 block"
                  style={{ fontSize: "0.9rem", color: "var(--color-foreground)" }}
                >
                  {item.value}
                </a>
              ) : (
                <p className="font-body mt-2" style={{ fontSize: "0.9rem", color: "var(--color-foreground)" }}>
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
