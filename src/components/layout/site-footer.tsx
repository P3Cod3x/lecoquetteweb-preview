import Link from "next/link";
import { ExternalLink, MapPin, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { getBookingLink } from "@/lib/booking/get-booking-link";
import { LeCoquetteWordmark } from "@/components/ui/lecoquette-wordmark";
import { siteConfig } from "@/lib/site";

function InstagramGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-noir w-full overflow-hidden text-white">
      {/* Top Banner CTA */}
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 pb-12 pt-16 text-center md:px-10 md:pb-16 md:pt-24">
        <h2 className="font-display mb-6 text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.05] tracking-tight">
          A softer kind<br />
          <span className="text-primary">of luxury.</span>
        </h2>
        <p className="font-body mb-8 max-w-[40ch] text-[clamp(0.95rem,1.2vw,1.05rem)] leading-relaxed text-white/50">
          Luxury nail, brow, and beauty rituals in Gainesville, Florida, shaped for a softer and more intentional kind of luxury.
        </p>
        <ButtonLink href={getBookingLink("footer")} variant="secondary" className="px-10 md:px-12" target="_blank" rel="noopener noreferrer">
          {siteConfig.bookingLabel}
        </ButtonLink>
      </div>

      {/* Thin elegant divider */}
      <div className="h-px w-full bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--color-noir-accent)_12%,transparent),transparent)]" />

      {/* Grid Links container */}
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 md:grid md:grid-cols-2 md:px-10 md:py-16 lg:grid-cols-4 lg:gap-8">
        <div className="space-y-5 lg:col-span-2">
          <p className="text-primary font-body text-[0.6rem] uppercase tracking-[0.25em]">
            Contact Us
          </p>
          <div className="font-body flex flex-col gap-4 text-[0.9rem] text-white/60">
            <a href={`tel:${siteConfig.phoneHref}`} className="flex w-fit items-center gap-3 transition-colors hover:text-white">
              <Phone size={14} strokeWidth={1.5} /> {siteConfig.phoneDisplay}
            </a>
            <a href={getBookingLink("footer")} target="_blank" rel="noopener noreferrer" className="flex w-fit cursor-pointer items-center gap-3 transition-colors hover:text-white">
              <ExternalLink size={14} strokeWidth={1.5} /> {siteConfig.bookingLabel}
            </a>
            <p className="flex w-fit items-center gap-3 transition-colors hover:text-white">
              <MapPin size={14} strokeWidth={1.5} /> Serving {siteConfig.city}, {siteConfig.region} by appointment
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <p className="text-primary font-body text-[0.6rem] uppercase tracking-[0.25em]">
            Navigate
          </p>
          <div className="font-body flex flex-col gap-3 text-[0.9rem] text-white/60">
            <a href="#services" className="w-fit transition-colors hover:text-white">Services</a>
            <a href="#about" className="w-fit transition-colors hover:text-white">About</a>
            <a href="#contact" className="w-fit transition-colors hover:text-white">Contact</a>
            <Link href="/" className="w-fit transition-colors hover:text-white">Home</Link>
          </div>
        </div>

        <div className="space-y-5">
          <p className="text-primary font-body text-[0.6rem] uppercase tracking-[0.25em]">
            Social
          </p>
          <div className="font-body flex flex-col gap-3 text-[0.9rem] text-white/60">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center gap-3 transition-colors hover:text-white"
            >
              <InstagramGlyph /> {siteConfig.instagramHandle}
            </a>
          </div>
        </div>
      </div>

      {/* Brand Wordmark at the base */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-6 pb-8 pt-2 md:px-10">
        <div className="mb-10 h-px w-full bg-white/5 md:mb-12" />

        <div className="flex w-full justify-center pb-6 opacity-90 md:pb-8">
          <span className="block w-full max-w-[22rem] text-white/80 md:max-w-3xl">
            <LeCoquetteWordmark tone="ink" zoom={4.5} className="h-auto w-full origin-bottom" />
          </span>
        </div>

        <div className="font-body mt-2 flex w-full flex-col items-center gap-3 border-t border-white/5 pt-6 text-center text-[0.55rem] uppercase tracking-[0.12em] text-white/40 md:grid md:grid-cols-3 md:items-center md:gap-4">
          <p className="md:justify-self-start md:text-left">© 2026 LeCoquette Luxury Spa. All rights reserved.</p>

          <p className="order-last text-[0.62rem] normal-case tracking-[0.06em] text-white/25 md:order-none md:justify-self-center">
            Sitio por{" "}
            <a
              href="https://themonkeys.do"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/45 underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              TheMonkeys
            </a>
          </p>

          <p className="md:justify-self-end md:text-right">{siteConfig.city}, {siteConfig.region} · Luxury appointments by booking request</p>
        </div>
      </div>
    </footer>
  );
}
