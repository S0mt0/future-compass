import { useState } from "react";

import { Arrow, PrimaryButton } from "./ui";

type Props = {
  email: string;
  entitlement: "active" | "inactive" | "unknown";
  error: string;
  isSubmitting: boolean;
  onSubmit: (code: string) => void;
  onSubscribe: () => void;
  onEditEmail: () => void;
  onRetry: () => void;
};

export function AccessScreen({ email, entitlement, error, isSubmitting, onSubmit, onSubscribe, onEditEmail, onRetry }: Props) {
  const [code, setCode] = useState("");
  const canUseCode = entitlement === "active";
  return <section className="flex-1 overflow-auto p-[25px_28px_36px] min-[720px]:mx-auto min-[720px]:max-w-[620px] min-[720px]:p-[54px_clamp(44px,6vw,76px)]">
    <p className="eyebrow">YOUR ROADMAP</p>
    <h1 className="heading text-[44px] min-[720px]:text-[56px]">{canUseCode ? "Unlock your results." : "Your results are ready."}</h1>
    <p className="mb-6 mt-3 text-sm leading-[1.55] text-muted">{canUseCode ? "Enter the access code sent with your subscription to see your personalised roadmap." : "Use an active subscription to unlock your personalised roadmap."}</p>
    <div className="mb-5 rounded-[18px] border border-line bg-white p-4"><p className="text-xs text-muted">Assessment email</p><p className="mt-1 text-sm font-bold text-forest">{email}</p><button type="button" className="mt-2 min-h-11 text-sm font-bold text-forest underline" onClick={onEditEmail}>Change email</button></div>
    {entitlement === "unknown" && <div role="alert" className="mb-5 rounded-[18px] border border-line bg-[#f0eee5] p-4 text-sm text-muted">We could not confirm your subscription yet. <button type="button" className="font-bold text-forest underline" onClick={onRetry}>Try again</button></div>}
    {canUseCode ? <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); onSubmit(code); }}><label className="grid gap-2 text-[13px] font-bold text-forest">Access code<input className="h-[57px] rounded-[14px] border border-line bg-white px-[15px] text-base uppercase" value={code} onChange={(event) => setCode(event.target.value)} autoComplete="one-time-code" placeholder="Enter your access code" required /></label>{error && <p role="alert" className="text-sm text-[#b2321c]">{error}</p>}<PrimaryButton type="submit" disabled={!code.trim() || isSubmitting}>{isSubmitting ? "Checking access…" : "Reveal My Results"}<Arrow /></PrimaryButton></form> : <><p className="mb-4 text-sm text-muted">Already have a code? Confirm your subscription again, or update the email above.</p>{error && <p role="alert" className="mb-3 text-sm text-[#b2321c]">{error}</p>}<PrimaryButton type="button" onClick={onSubscribe}>Subscribe to unlock your results <Arrow /></PrimaryButton></>}
  </section>;
}
