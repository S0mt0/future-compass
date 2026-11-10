import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Arrow() {
  return (
    <span aria-hidden="true" className="text-2xl leading-none">
      →
    </span>
  );
}

export function PrimaryButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={`flex h-[59px] w-full shrink-0 items-center justify-between rounded-[17px] bg-forest px-5 text-base font-bold text-white transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// export const eyebrowClass =
//   "mb-3.5 font-mono text-xs leading-none font-semibold tracking-[.07em] text-forest";
// export const headingClass =
//   "font-display text-[clamp(39px,9vw,54px)] leading-[.98] font-semibold tracking-[-.052em] text-ink";
