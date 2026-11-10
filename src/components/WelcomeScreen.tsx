import { Arrow, PrimaryButton } from "./ui";

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="grid flex-1 p-[10px_28px_30px] min-[720px]:grid-cols-[minmax(0,.92fr)_minmax(390px,1.08fr)] min-[720px]:grid-rows-[1fr_auto_auto_auto] min-[720px]:items-center min-[720px]:gap-x-[clamp(44px,7vw,96px)] min-[720px]:overflow-hidden min-[720px]:p-[34px_clamp(44px,6vw,76px)_54px]">
      <div className="relative -mx-7 mb-8 h-[280px] overflow-hidden bg-cream min-[720px]:col-start-2 min-[720px]:row-span-4 min-[720px]:m-0 min-[720px]:h-full min-[720px]:min-h-[510px] min-[720px]:rounded-[28px]">
        <img
          className="h-full w-full object-cover object-[center_31%]"
          src="/image-1.jpg"
          alt="Students discussing a book together"
        />
        <span className="absolute bottom-4 left-[18px] max-w-[190px] rounded-[9px] bg-paper/92 px-3 py-2 font-mono text-xs leading-[1.3] text-forest min-[720px]:bottom-5 min-[720px]:left-5">
          Your future is allowed to evolve.
        </span>
      </div>
      <div className="min-[720px]:col-start-1 min-[720px]:row-start-1 min-[720px]:self-end">
        <p className="eyebrow">CAREER EXPLORATION, MADE HUMAN</p>
        <h1 className="heading">
          Follow the clues <em className="text-coral">only you</em> have.
        </h1>
        <p className="my-5 text-base leading-[1.55] text-muted min-[720px]:mb-7 min-[720px]:max-w-[450px] min-[720px]:text-[17px]">
          Eight thoughtful questions. A clearer next step. No pressure to have
          it all figured out.
        </p>
      </div>
      <div className="mb-6 grid grid-cols-3 border-y border-line py-[18px] min-[720px]:col-start-1 min-[720px]:row-start-2 min-[720px]:mb-[25px] min-[720px]:mt-[30px] min-[720px]:max-w-[460px]">
        <div className="grid gap-1 border-r border-line">
          <strong className="font-display text-[21px] leading-none">8</strong>
          <span className="text-xs text-muted">questions</span>
        </div>
        <div className="grid gap-1 border-r border-line pl-3.5">
          <strong className="font-display text-[21px] leading-none">
            5 min
          </strong>
          <span className="text-xs text-muted">to explore</span>
        </div>
        <div className="grid gap-1 pl-3.5">
          <strong className="font-display text-[21px] leading-none">
            100%
          </strong>
          <span className="text-xs text-muted">your pace</span>
        </div>
      </div>
      <PrimaryButton
        onClick={onStart}
        className="min-[720px]:col-start-1 min-[720px]:row-start-3 min-[720px]:max-w-[460px]"
      >
        Start exploring <Arrow />
      </PrimaryButton>
      <p className="mt-3 text-center text-[11px] leading-[1.45] text-muted min-[720px]:col-start-1 min-[720px]:row-start-4 min-[720px]:max-w-[460px] min-[720px]:text-left">
        Your answers stay on this device until you choose to continue.
      </p>
    </section>
  );
}
