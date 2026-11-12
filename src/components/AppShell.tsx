import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Step } from "./types";

type Props = {
  children: ReactNode;
  step: Step;
  onReset: () => void;
};

export function AppShell({ children, step, onReset }: Props) {
  const reduceMotion = useReducedMotion();
  return (
    <section
      aria-label="Edu compass career guide"
      className="relative z-1 flex min-h-[calc(100svh-64px)] w-full max-w-[540px] flex-col overflow-hidden rounded-[34px] border border-ink/9 bg-paper text-ink shadow-[0_30px_80px_rgba(23,63,56,.2)] min-[720px]:h-[min(820px,calc(100svh-56px))] min-[720px]:min-h-0 min-[720px]:max-w-none min-[720px]:overflow-visible min-[720px]:rounded-[38px] min-[720px]:isolate max-[560px]:min-h-svh max-[560px]:rounded-none max-[560px]:border-0 max-[560px]:shadow-none"
    >
      <img
        className="pointer-events-none absolute z-2 hidden w-[190px] -rotate-3 select-none drop-shadow-[0_8px_7px_rgba(67,36,23,.15)] min-[720px]:block min-[720px]:left-[-68px] min-[720px]:top-[31%] min-[720px]:max-[1000px]:left-[-56px] min-[720px]:max-[1000px]:top-[34%] min-[720px]:max-[1000px]:w-[155px]"
        src="/Cartoon Hand Gripping an Edge-2.png"
        alt=""
        aria-hidden="true"
        decoding="sync"
        fetchPriority="high"
        loading="eager"
      />
      <img
        className="pointer-events-none absolute z-2 hidden w-[285px] rotate-2 select-none drop-shadow-[0_8px_7px_rgba(67,36,23,.15)] min-[720px]:block min-[720px]:right-[-55px] min-[720px]:top-[-78px] min-[720px]:max-[1000px]:right-[-45px] min-[720px]:max-[1000px]:top-[-66px] min-[720px]:max-[1000px]:w-[240px]"
        src="/Cartoon Hand Gripping Edge-1.png"
        alt=""
        aria-hidden="true"
      />
      <header className="relative z-1 flex h-[88px] items-center justify-between bg-paper px-7 min-[720px]:h-[94px] min-[720px]:rounded-t-[38px] min-[720px]:bg-transparent min-[720px]:px-11">
        <button
          type="button"
          onClick={onReset}
          aria-label="Return home"
          className="grid gap-0 bg-transparent text-left text-forest"
        >
          <span className="font-sans text-[18px] leading-[.73] font-bold tracking-[-1.6px]">
            Edu
          </span>
          <span className="pl-2 font-display text-[17px] leading-[.73] font-semibold tracking-[-1.3px] text-coral italic">
            compass
          </span>
          <span className="mt-1 font-sans text-[8px] leading-none font-medium tracking-[.035em] text-muted">
            a guide for your next chapter
          </span>
        </button>
      </header>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          className="flex min-h-0 flex-1 flex-col"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
