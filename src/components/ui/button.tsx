import Link, { type LinkProps } from "next/link";
import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "none";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[oklch(0.269_0.010_303.8)] text-white hover:bg-black",
  secondary:
    "bg-[oklch(0.637_0.177_32.7)] text-white hover:bg-[oklch(0.600_0.197_32.7)]",
  ghost:
    "bg-transparent text-current hover:opacity-70",
  outline:
    "border-[1px] border-[oklch(0.269_0.010_303.8)] bg-transparent text-[oklch(0.269_0.010_303.8)] hover:bg-[oklch(0.269_0.010_303.8)] hover:text-white"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-6 text-[0.65rem]",
  md: "h-14 px-10 text-[0.7rem]",
  lg: "h-16 px-12 text-[0.75rem]",
  none: ""
};

type SharedProps = {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

type ButtonProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", type = "button", ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center rounded-none font-body uppercase tracking-[0.18em] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

type ButtonLinkProps = SharedProps &
  LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | keyof SharedProps> & {
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
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-none font-body uppercase tracking-[0.18em] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
