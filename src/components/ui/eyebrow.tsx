import { cn } from "@/lib/utils";

type EyebrowTone = "primary" | "accent";
type EyebrowLines = "start" | "end" | "both" | "none";

const toneText: Record<EyebrowTone, string> = {
  primary: "text-primary",
  accent: "text-noir-accent",
};

/**
 * Section eyebrow: a hairline rule + uppercase label.
 * One tokenized scale across the whole site; only structure (which side the
 * rule sits) and tone vary. Use `lineClassName` for the faded-rule variant.
 */
export function Eyebrow({
  children,
  tone = "primary",
  lines = "start",
  lineClassName,
  className,
}: {
  children: React.ReactNode;
  tone?: EyebrowTone;
  lines?: EyebrowLines;
  lineClassName?: string;
  className?: string;
}) {
  const rule = <span aria-hidden className={cn("block h-px w-8 shrink-0 bg-current", lineClassName)} />;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 font-body text-[0.66rem] uppercase tracking-[0.28em]",
        toneText[tone],
        className
      )}
    >
      {(lines === "start" || lines === "both") && rule}
      <span>{children}</span>
      {(lines === "end" || lines === "both") && rule}
    </span>
  );
}
