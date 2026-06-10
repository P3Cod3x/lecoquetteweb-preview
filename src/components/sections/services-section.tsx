"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsap } from "@/lib/motion/gsap";
import { usePrefersReducedMotion } from "@/lib/motion/reduced-motion";
import { getBookingLink } from "@/lib/booking/get-booking-link";
import { assetPath } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/eyebrow";


// ─── Types & Data ─────────────────────────────────────────────────────────────

type ServiceItem = { name: string; price: string; tag?: string };

type Ritual = {
  id: string;
  index: string;
  subline: string;
  headline: string;
  body: string;
  anchor: string;
  image: string;
  imageAlt: string;
  cta: string;
  services: ServiceItem[];
};

type MobileShowcaseCardProps = {
  id: string;
  index: string;
  subline: string;
  headline: string;
  body: string;
  anchor: string;
  image: string;
  imageAlt: string;
  cta: string;
  bookingSource: string;
  items: ServiceItem[];
  priority?: boolean;
};

const RITUALS: Ritual[] = [
  {
    id: "manicure",
    index: "01",
    subline: "Manicure",
    headline: "Precision\nmeets indulgence",
    body: "Luxury manicures in Gainesville, Florida, designed with refined detail, polished finishes, and the full Coquette experience.",
    anchor: "From $35",
    image: "/assets/services/manicure.png",
    imageAlt: "LeCoquette luxury manicure service",
    cta: "Book Manicure",
    services: [
      { name: "Classic Manicure", price: "$35" },
      { name: "Gel Manicure", price: "$50" },
      { name: "Coquette Manicure", price: "$50", tag: "COQUETTE" },
      { name: "Coquette Gel Manicure", price: "$65", tag: "COQUETTE" },
      { name: "Nail Art (per nail)", price: "$5+" },
      { name: "Nail Repair (per nail)", price: "$5" },
      { name: "Gel Removal", price: "$15" },
    ],
  },
  {
    id: "pedicure",
    index: "02",
    subline: "Pedicure",
    headline: "A ritual from\nsole to soul",
    body: "Luxury pedicures in Gainesville, Florida, beginning with a warm soak and ending with a finish that makes every step feel intentional.",
    anchor: "From $32",
    image: "/assets/services/pedicure.png",
    imageAlt: "LeCoquette luxury pedicure service",
    cta: "Book Pedicure",
    services: [
      { name: "Classic Pedicure", price: "$45" },
      { name: "Gel Pedicure", price: "$60" },
      { name: "Coquette Pedicure", price: "$60", tag: "COQUETTE" },
      { name: "Coquette Gel Pedicure", price: "$75", tag: "COQUETTE" },
      { name: "Mini Pedicure", price: "$32" },
      { name: "Nail Art (per nail)", price: "$5+" },
      { name: "Gel Removal", price: "$15" },
    ],
  },
  {
    id: "bundles",
    index: "03",
    subline: "Bundles",
    headline: "The full\nCoquette experience",
    body: "Why choose when you can have both? Our Gainesville manicure and pedicure bundles turn the full visit into one seamless ritual.",
    anchor: "From $68",
    image: "/assets/services/bundles.png",
    imageAlt: "LeCoquette bundle mani-pedi experience",
    cta: "Book Bundle",
    services: [
      { name: "Classic Mani + Pedi", price: "$68" },
      { name: "Gel Mani + Classic Pedi", price: "$83" },
      { name: "Classic Mani + Gel Pedi", price: "$83" },
      { name: "Gel Mani + Gel Pedi", price: "$98" },
      { name: "Coquette Mani + Pedi", price: "$98", tag: "COQUETTE" },
      { name: "Coquette Gel Mani + Pedi", price: "$113", tag: "COQUETTE" },
      { name: "Full Coquette Experience", price: "$128", tag: "COQUETTE" },
    ],
  },
];

const ADD_ONS = [
  { label: "Eyebrow Wax", price: "$15" },
  { label: "Eyebrow Tint", price: "$15" },
  { label: "Eyebrow Wax + Tint", price: "$25" },
  { label: "Kids Manicure (under 10)", price: "$20" },
  { label: "Kids Pedicure (under 10)", price: "$28" },
  { label: "Kids Mani + Pedi (under 10)", price: "$40" },
  { label: "Hand Design", price: "$60" },
];

// ─── Shared: Service list + CTA ───────────────────────────────────────────────

function BookingTextLink({
  href,
  label,
  id,
}: {
  href: string;
  label: string;
  id?: string;
}) {
  return (
    <div className="mt-6">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        id={id}
        className="group relative inline-flex items-center gap-3 overflow-hidden px-1 pt-1 pb-2 font-display text-[1.2rem] tracking-[-0.02em] text-primary transition-colors hover:text-opacity-70"
      >
        <span className="relative">
          {label}
          <span className="absolute -bottom-1 left-0 h-[1.5px] w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:origin-left group-hover:scale-x-100" />
        </span>
        <svg
          width="15"
          height="15"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
          className="transition-transform duration-500 group-hover:translate-x-1.5 pt-[2px]"
        >
          <path
            d="M1 7h12M8 2l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}

function PriceList({
  items,
  ariaLabel,
}: {
  items: Array<{ name: string; price: string; tag?: string }>;
  ariaLabel: string;
}) {
  return (
    <ul
      className="mt-5 space-y-2.5 border-t pt-5"
      style={{ borderColor: "var(--color-border)" }}
      aria-label={ariaLabel}
    >
      {items.map((item) => (
        <li key={item.name} className="flex items-baseline justify-between gap-3">
          <span
            className="font-body flex items-center gap-2 leading-snug"
            style={{ fontSize: "0.83rem", color: "var(--color-foreground)" }}
          >
            {item.name}
            {item.tag ? (
              <span
                className="inline-block rounded-full px-2 py-px text-[0.58rem] font-medium uppercase tracking-[0.1em]"
                style={{
                  background: "color-mix(in oklab, var(--color-primary) 10%, transparent)",
                  color: "var(--color-primary)",
                }}
              >
                {item.tag}
              </span>
            ) : null}
          </span>
          <span
            className="font-body shrink-0 tabular-nums"
            style={{ fontSize: "0.83rem", fontWeight: 500, color: "var(--color-foreground-strong)" }}
          >
            {item.price}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ServiceList({ ritual }: { ritual: Ritual }) {
  return (
    <>
      <PriceList
        items={ritual.services.map((service) => ({
          name: service.name,
          price: service.price,
          tag: service.tag,
        }))}
        ariaLabel={`${ritual.subline} service prices`}
      />
      <BookingTextLink
        href={getBookingLink(`services-${ritual.id}`)}
        label={ritual.cta}
        id={`book-${ritual.id}`}
      />
    </>
  );
}

function AddOnList({ ariaLabel }: { ariaLabel: string }) {
  return (
    <>
      <PriceList
        items={ADD_ONS.map((item) => ({ name: item.label, price: item.price }))}
        ariaLabel={ariaLabel}
      />
      <BookingTextLink
        href={getBookingLink("services-add-ons")}
        label="Book Add-On"
        id="book-add-ons"
      />
    </>
  );
}

function MobileShowcaseCard({
  id,
  index,
  subline,
  headline,
  body,
  anchor,
  image,
  imageAlt,
  cta,
  bookingSource,
  items,
  priority = false,
}: MobileShowcaseCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const { gsap } = ensureGsap();

      gsap.fromTo(
        ".mc-img",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".mc-text",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: cardRef, dependencies: [reducedMotion] }
  );

  return (
    <div ref={cardRef} id={id} className="scroll-mt-8">
      <div
        className="mc-img relative w-full overflow-hidden"
        style={{ aspectRatio: "4 / 3" }}
        data-header-theme="light"
      >
        <Image
          src={assetPath(image)}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={priority}
        />
        <span
          className="pointer-events-none absolute select-none font-display"
          aria-hidden="true"
          style={{
            fontSize: "clamp(5rem, 22vw, 9rem)",
            lineHeight: 1,
            color: "rgb(255 255 255 / 0.08)",
            bottom: "-0.1em",
            right: "0.05em",
          }}
        >
          {index}
        </span>
      </div>

      <div
        className="px-5 py-8"
        style={{ background: "var(--color-background)" }}
        data-header-theme="dark"
      >
        <Eyebrow lines="start" lineClassName="w-6" className="mc-text mb-4">
          {subline}
        </Eyebrow>

        <h2
          className="mc-text font-display m-0"
          style={{
            fontSize: "clamp(2rem, 8vw, 2.6rem)",
            lineHeight: 1.08,
            color: "var(--color-foreground-strong)",
            whiteSpace: "pre-line",
          }}
        >
          {headline}
        </h2>

        <p
          className="mc-text font-body mt-2.5"
          style={{
            fontSize: "0.78rem",
            color: "var(--color-primary)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {anchor}
        </p>

        <p
          className="mc-text font-body mt-4"
          style={{
            fontSize: "0.95rem",
            lineHeight: 1.75,
            color: "var(--color-foreground-muted)",
          }}
        >
          {body}
        </p>

        <div className="mc-text">
          <PriceList items={items} ariaLabel={`${subline} service prices`} />
          <BookingTextLink
            href={getBookingLink(bookingSource)}
            label={cta}
            id={`book-${id}`}
          />
        </div>
      </div>
    </div>
  );
}

// ─── MOBILE: Stacked cards ────────────────────────────────────────────────────
// Mobile-first: each ritual is a full-width "reveal" card.
// Image wipes in from below, text fades up underneath.

function MobileCard({ ritual, i }: { ritual: Ritual; i: number }) {
  return (
    <>
      <MobileShowcaseCard
        id={ritual.id}
        index={ritual.index}
        subline={ritual.subline}
        headline={ritual.headline}
        body={ritual.body}
        anchor={ritual.anchor}
        image={ritual.image}
        imageAlt={ritual.imageAlt}
        cta={ritual.cta}
        bookingSource={`services-${ritual.id}`}
        items={ritual.services}
        priority={i === 0}
      />
      {i < RITUALS.length - 1 && (
        <div
          className="mx-5 h-px"
          style={{ background: "var(--color-border)" }}
        />
      )}
    </>
  );
}

function MobileRituals() {
  return (
    <div className="md:hidden">
      {RITUALS.map((r, i) => (
        <MobileCard key={r.id} ritual={r} i={i} />
      ))}
    </div>
  );
}

function MobileAddOnsCard() {
  return (
    <div className="md:hidden">
      <MobileShowcaseCard
        id="add-ons"
        index="04"
        subline="Additional Services"
        headline={"Complete your\nritual."}
        body="Elevate any visit with curated additions, from precision brow shaping to little luxuries that make the appointment feel fully considered."
        anchor="Finishing touches from $15"
        image="/assets/services/addons_new.png"
        imageAlt="Additional luxury beauty services"
        cta="Book Add-On"
        bookingSource="services-add-ons"
        items={ADD_ONS.map((item) => ({ name: item.label, price: item.price }))}
      />
    </div>
  );
}

// ─── DESKTOP: Pinned scroll sequence ─────────────────────────────────────────
// The viewport is pinned (sticky). Scroll progress drives a GSAP timeline.
//
// Panel progression (image column | text column):
//   Beat 0→1: img-0 rises LEFT   | txt-0 appears RIGHT
//   Beat 1→2: img-0 exits LEFT   | txt-0 fades RIGHT
//             img-1 rises RIGHT  | txt-1 appears LEFT
//   Beat 2→3: img-1 exits RIGHT  | txt-1 fades LEFT
//             img-2 rises LEFT   | txt-2 appears RIGHT
//
// Outer section height = (N+1)*100vh → gives N×100vh of "pinned" travel.

function DesktopRitualText({ ritual }: { ritual: Ritual }) {
  return (
    <div className="flex h-full flex-col justify-center overflow-y-auto px-10 py-12 xl:px-16">
      <Eyebrow lines="start" className="mb-5">
        {ritual.subline}
      </Eyebrow>

      {/* Headline */}
      <h2
        className="font-display m-0"
        style={{
          fontSize: "clamp(2rem, 3.8vw, 3rem)",
          lineHeight: 1.08,
          color: "var(--color-foreground-strong)",
          whiteSpace: "pre-line",
        }}
      >
        {ritual.headline}
      </h2>

      {/* Anchor */}
      <p
        className="font-body mt-3"
        style={{
          fontSize: "0.8rem",
          color: "var(--color-primary)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {ritual.anchor}
      </p>

      {/* Body */}
      <p
        className="font-body mt-4 max-w-[36ch]"
        style={{ fontSize: "clamp(0.9rem, 1.4vw, 1rem)", lineHeight: 1.78, color: "var(--color-foreground-muted)" }}
      >
        {ritual.body}
      </p>

      <ServiceList ritual={ritual} />
    </div>
  );
}

function DesktopAddonsText() {
  return (
    <div className="flex h-full flex-col justify-center overflow-y-auto px-10 py-12 xl:px-16 text-left">
      <Eyebrow lines="start" className="mb-5">
        Additional Services
      </Eyebrow>

      <h2
        className="font-display m-0"
        style={{
          fontSize: "clamp(2rem, 3.8vw, 3rem)",
          lineHeight: 1.08,
          color: "var(--color-foreground-strong)",
        }}
      >
        Complete your
        <br />
        ritual.
      </h2>

      <p
        className="font-body mt-4 max-w-[36ch]"
        style={{ fontSize: "clamp(0.9rem, 1.4vw, 1rem)", lineHeight: 1.78, color: "var(--color-foreground-muted)" }}
      >
        Elevate any visit with curated additions, from precision brow shaping to little luxuries that make the appointment feel fully considered.
      </p>

      <AddOnList ariaLabel="Additional service prices" />
    </div>
  );
}

function DesktopPinnedRituals() {
  const outerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const { gsap, ScrollTrigger } = ensureGsap();

      const tl = gsap.timeline({ defaults: { ease: "power1.inOut" } });

      // First panel must already be in place while the intro clears out.
      gsap.set(".pin-img-0", { yPercent: 0 });
      gsap.set(".pin-txt-0", { autoAlpha: 1, y: 0 });

      // ── Beat 1→2: Pedicure enters (img right), Manicure exits ────────────
      tl.to(".pin-img-0", { yPercent: -100, duration: 1 }, 1);
      tl.fromTo(".pin-img-1", { yPercent: 100 }, { yPercent: 0, duration: 1 }, 1);
      tl.to(".pin-txt-0", { autoAlpha: 0, y: -24, duration: 0.3, ease: "power2.in" }, 1);
      tl.fromTo(
        ".pin-txt-1",
        { autoAlpha: 0, y: 32 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" },
        1.38
      );

      // ── Beat 2→3: Bundles enters (img left), Pedicure exits ──────────────
      tl.to(".pin-img-1", { yPercent: -100, duration: 1 }, 2);
      tl.fromTo(".pin-img-2", { yPercent: 100 }, { yPercent: 0, duration: 1 }, 2);
      tl.to(".pin-txt-1", { autoAlpha: 0, y: -24, duration: 0.3, ease: "power2.in" }, 2);
      tl.fromTo(
        ".pin-txt-2",
        { autoAlpha: 0, y: 32 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" },
        2.38
      );

      // ── Beat 3→4: Add-ons enters, Bundles exits ──────────────────────────
      tl.to(".pin-img-2", { yPercent: -100, duration: 1 }, 3);
      tl.fromTo(".pin-img-3", { yPercent: 100 }, { yPercent: 0, duration: 1 }, 3);
      tl.to(".pin-txt-2", { autoAlpha: 0, y: -24, duration: 0.3, ease: "power2.in" }, 3);
      tl.fromTo(
        ".pin-txt-3",
        { autoAlpha: 0, y: 32 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" },
        3.38
      );

      // Hold Add-ons in place longer before About starts covering Services.
      tl.to({}, { duration: 1 }, 4);

      ScrollTrigger.create({
        trigger: outerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.4,
        animation: tl,
      });

      return () => {
        tl.scrollTrigger?.kill();
      };
    },
    { scope: outerRef, dependencies: [reducedMotion] }
  );

  // Four content beats plus one hold beat before About takeover.
  const panelCount = RITUALS.length + 1;

  return (
    <div
      ref={outerRef}
      style={{ height: `${(panelCount + 2) * 100}vh` }}
      className="hidden md:block"
    >
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
      >
        {/* ── LEFT column: img-0 (Manicure), img-2 (Bundles), txt-1 (Pedicure), txt-3 (Add-ons) ── */}
        <div className="relative h-full overflow-hidden" style={{ background: "var(--color-surface-mute)" }} data-header-theme="light">
          {/* Manicure image — enters first */}
          <div
            className="pin-img-0 absolute inset-0 will-change-transform"
            style={{ zIndex: 20 }}
          >
            <Image src={assetPath(RITUALS[0].image)} alt={RITUALS[0].imageAlt} fill sizes="50vw" className="object-cover object-center" />
          </div>
          {/* Bundles image — enters last */}
          <div
            className="pin-img-2 absolute inset-0 will-change-transform"
            style={{ zIndex: 30 }}
          >
            <Image src={assetPath(RITUALS[2].image)} alt={RITUALS[2].imageAlt} fill sizes="50vw" className="object-cover object-center" />
          </div>
          {/* Pedicure text — visible between beats 1→2 */}
          <div
            className="pin-txt-1 absolute inset-0"
            style={{ zIndex: 10, background: "var(--color-background)", visibility: "hidden", opacity: 0 }}
          >
            <DesktopRitualText ritual={RITUALS[1]} />
          </div>
          <div
            className="pin-txt-3 absolute inset-0"
            style={{ zIndex: 10, background: "var(--color-background)", visibility: "hidden", opacity: 0 }}
          >
            <DesktopAddonsText />
          </div>
        </div>

        {/* ── RIGHT column: txt-0 (Manicure), img-1 (Pedicure), txt-2 (Bundles), img-3 (Add-ons) ── */}
        <div className="relative h-full overflow-hidden" style={{ background: "var(--color-background)" }} data-header-theme="dark">
          {/* Manicure text — visible beat 0→1 */}
          <div
            className="pin-txt-0 absolute inset-0"
            style={{ zIndex: 10, visibility: "hidden", opacity: 0 }}
          >
            <DesktopRitualText ritual={RITUALS[0]} />
          </div>
          {/* Pedicure image — enters beat 1→2, covers Manicure text */}
          <div
            className="pin-img-1 absolute inset-0 will-change-transform"
            style={{ zIndex: 20 }}
          >
            <Image src={assetPath(RITUALS[1].image)} alt={RITUALS[1].imageAlt} fill sizes="50vw" className="object-cover object-center" />
          </div>
          {/* Bundles text — visible beat 2→3 */}
          <div
            className="pin-txt-2 absolute inset-0"
            style={{ zIndex: 10, visibility: "hidden", opacity: 0 }}
          >
            <DesktopRitualText ritual={RITUALS[2]} />
          </div>
          <div
            className="pin-img-3 absolute inset-0 will-change-transform"
            style={{ zIndex: 30 }}
          >
            <Image src={assetPath("/assets/services/addons_new.png")} alt="Additional luxury beauty services" fill sizes="50vw" className="object-cover object-center" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Add-ons section ──────────────────────────────────────────────────────────

function AddOnsSection() {
  return (
    <div className="md:hidden">
      <div className="bg-background">
        <MobileAddOnsCard />
      </div>
    </div>
  );
}

// ─── Section intro ────────────────────────────────────────────────────────────

function ServicesIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const { gsap } = ensureGsap();
      gsap.fromTo(
        ".intro-item",
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.85, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 82%", toggleActions: "play none none reverse" },
        }
      );
    },
    { scope: ref, dependencies: [reducedMotion] }
  );

  return (
    <div
      ref={ref}
      className="relative z-10 mx-auto max-w-2xl px-5 py-16 text-center md:py-20"
      style={{ background: "var(--color-background)" }}
    >
      <Eyebrow lines="both" lineClassName="w-7 bg-primary/45" className="intro-item mb-5 justify-center">
        The Rituals
      </Eyebrow>

      <h2
        className="intro-item font-display m-0"
        style={{
          fontSize: "clamp(2.4rem, 8vw, 4rem)",
          lineHeight: 1.06,
          color: "var(--color-foreground-strong)",
          letterSpacing: "-0.01em",
        }}
      >
        Every visit, a ritual.
      </h2>

      <p
        className="intro-item font-body mx-auto mt-5"
        style={{
          fontSize: "clamp(0.93rem, 3.5vw, 1.05rem)",
          lineHeight: 1.78,
          color: "var(--color-foreground-muted)",
          maxWidth: "38ch",
        }}
      >
        Discover luxury manicures, pedicures, bundles, and finishing touches in Gainesville, each one designed to feel less like an appointment and more like a ceremony.
      </p>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export function ServicesSection() {
  return (
    <section
      id="services"
      style={{ position: "relative", zIndex: 10, background: "var(--color-background)" }}
    >
      <ServicesIntro />

      {/* Mobile-first: stacked cards */}
      <MobileRituals />

      {/* Desktop: pinned scroll sequence */}
      <DesktopPinnedRituals />

      <AddOnsSection />
    </section>
  );
}
