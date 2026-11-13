import { useState } from "react";

import { Arrow, PrimaryButton } from "./ui";

export function CompleteScreen({
  greeting,
  accessCode,
  accessEmail,
  onReview,
}: {
  greeting: string;
  accessCode?: string;
  accessEmail?: string;
  onReview: () => void;
}) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const copyAccessCode = async () => {
    try {
      await navigator.clipboard.writeText(accessCode ?? "");
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }
  };

  return (
    <section className="flex-1 overflow-auto p-[5px_28px_36px] text-center min-[720px]:mx-auto min-[720px]:max-w-[720px] min-[720px]:p-[34px_clamp(44px,6vw,76px)_54px]">
      <div className="mb-[23px] -mx-7 h-[190px] overflow-hidden min-[720px]:mx-0 min-[720px]:h-[250px] min-[720px]:rounded-[27px]">
        <img
          className="h-full w-full object-cover object-[32%_center]"
          src="/image-3.jpg"
          alt="A child looking through a microscope"
        />
      </div>
      <span className="mx-auto mb-[15px] grid h-[42px] w-[42px] place-items-center rounded-full bg-lime font-bold text-forest">
        ✓
      </span>
      <p className="eyebrow">YOUR SUBSCRIPTION IS CONFIRMED</p>
      <h1 className={`heading mx-auto text-[42px] min-[720px]:text-[54px]`}>
        Welcome to the next step, {greeting}.
      </h1>
      <p className="my-[15px] text-sm leading-[1.55] text-muted">
        Your full roadmap would now be available here, ready to revisit whenever
        your ideas grow or change.
      </p>
      {accessCode && (
        <div className="mb-5 rounded-[19px] border border-line bg-[#f0f5d7] p-4 text-left">
          <p className="font-mono text-[11px] text-coral">
            YOUR EDU COMPASS ACCESS CARD
          </p>
          <p className="mt-2 text-xs text-muted">{accessEmail}</p>
          <code className="mt-2 block break-all text-sm font-bold text-forest">
            {accessCode}
          </code>
          <button
            type="button"
            className="mt-3 min-h-11 text-sm font-bold text-forest underline"
            onClick={() => void copyAccessCode()}
          >
            {copyStatus === "success" ? "Copied to clipboard" : "Copy access code"}
          </button>
          <p
            className={`mt-2 text-xs ${copyStatus === "error" ? "text-[#b2321c]" : "text-muted"}`}
            role={copyStatus === "error" ? "alert" : "status"}
            aria-live="polite"
          >
            {copyStatus === "success"
              ? "Your access code has been copied."
              : copyStatus === "error"
                ? "We could not copy the code. Please select and copy it manually."
                : "Keep this code private. It is required with your email to access your account."}
          </p>
        </div>
      )}
      <div className="mb-[22px] grid gap-2 text-left">
        <span className="border-b border-line p-[13px] font-mono text-xs text-coral">
          01{" "}
          <b className="ml-2.5 font-sans text-sm text-forest">Career matches</b>
        </span>
        <span className="border-b border-line p-[13px] font-mono text-xs text-coral">
          02{" "}
          <b className="ml-2.5 font-sans text-sm text-forest">
            Subject pathway
          </b>
        </span>
        <span className="border-b border-line p-[13px] font-mono text-xs text-coral">
          03{" "}
          <b className="ml-2.5 font-sans text-sm text-forest">
            University options
          </b>
        </span>
      </div>
      <PrimaryButton
        onClick={onReview}
        className="min-[720px]:mx-auto min-[720px]:max-w-[520px]"
      >
        Reveal My Results <Arrow />
      </PrimaryButton>
    </section>
  );
}
