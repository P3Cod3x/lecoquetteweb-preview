import Link, { type LinkProps } from "next/link";
import { type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "none";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-foreground-strong text-white hover:bg-black",
  secondary: "bg-primary text-white hover:bg-primary-hover",
  ghost: "bg-transparent text-current hover:opacity-70",
  outline:
    "border border-foreground-strong bg-transparent text-foreground-strong hover:bg-foreground-strong hover:text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-6 text-[0.65rem]",
  md: "h-14 px-10 text-[0.7rem]",
  lg: "h-16 px-12 text-[0.75rem]",
  none: "",
};

const baseClasses =
  "inline-flex cursor-pointer items-center justify-center rounded-none font-body uppercase tracking-[0.18em] transition-all duration-700 ease-emphasized";

type ButtonLinkProps = {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
} & LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | "className" | "children"> & {
    href: string;
  };

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  children,
  href,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
