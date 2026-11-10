import { Arrow, PrimaryButton } from "./ui";

export function PreviewScreen({
  greeting,
  career,
  onPlans,
  onReset,
}: {
  greeting: string;
  career: string;
  onPlans: () => void;
  onReset: () => void;
}) {
  return (
    <section className="flex-1 overflow-auto p-[26px_28px_36px] text-center min-[720px]:mx-auto min-[720px]:max-w-[820px] min-[720px]:p-[32px_clamp(44px,6vw,76px)_54px]">
      <p className="eyebrow">YOUR PERSONAL PATTERN</p>
      <h1
        className={`heading mx-auto min-[720px]:max-w-[670px] min-[720px]:text-[54px]`}
      >
        There’s a strong signal here, {greeting}.
      </h1>
      <div className="relative mx-auto my-6 grid h-[175px] w-[175px] place-items-center rounded-full border border-[#b7c99b] before:absolute before:inset-4 before:rounded-full before:border before:border-[#cedbad] after:absolute after:inset-[39px] after:rounded-full after:border after:border-[#cedbad] min-[720px]:h-[190px] min-[720px]:w-[190px]">
        <i className="absolute right-[17px] top-[26px] z-2 h-[11px] w-[11px] rounded-full bg-coral" />
        <i className="absolute bottom-[38px] left-4 z-2 h-[11px] w-[11px] rounded-full bg-forest" />
        <i className="absolute bottom-[11px] right-[31px] z-2 h-[11px] w-[11px] rounded-full bg-[#edbf48]" />
        <span className="z-1 grid h-[60px] w-[60px] place-items-center rounded-full bg-lime text-[28px]">
          ✦
        </span>
      </div>
      <div className="rounded-[23px] bg-forest p-[22px] text-left text-white min-[720px]:p-[26px]">
        <span className="font-mono text-[11px] tracking-[.08em] text-lime">
          YOUR LEADING DIRECTION
        </span>
        <h2 className="my-2 font-display text-[32px] leading-none font-semibold tracking-[-1.5px] min-[720px]:text-[38px]">
          {career}
        </h2>
        <p className="text-[13px] leading-[1.55] text-[#d9e4d6] min-[720px]:text-[15px]">
          You seem energised by solving real problems, learning deeply, and
          making a practical difference.
        </p>
        <div className="mt-[18px] flex gap-2 text-[11px]">
          <span className="rounded-full bg-white/12 px-2.5 py-[7px]">
            Curious
          </span>
          <span className="rounded-full bg-white/12 px-2.5 py-[7px]">
            Purpose-led
          </span>
          <span className="rounded-full bg-white/12 px-2.5 py-[7px]">
            Capable
          </span>
        </div>
      </div>
      <div className="my-[15px] rounded-[19px] border border-dashed border-[#b6b7a8] bg-[#f0eee5] p-[19px] text-left">
        <div className="relative pl-[39px]">
          <span
            className="absolute left-0 top-0 text-[21px]"
            aria-hidden="true"
          >
            🔒
          </span>
          <strong className="text-sm">Your full roadmap is ready</strong>
          <p className="mt-1.5 text-xs leading-[1.4] text-muted">
            Unlock career matches, subject choices, university routes, and your
            next four steps.
          </p>
        </div>
      </div>
      <PrimaryButton
        type="button"
        onClick={onPlans}
        className="min-[720px]:mx-auto min-[720px]:max-w-[520px]"
      >
        See my full roadmap <Arrow />
      </PrimaryButton>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 bg-transparent p-2 text-sm font-bold text-muted"
      >
        Start over
      </button>
    </section>
  );
}
