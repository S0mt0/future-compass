import { Arrow, PrimaryButton } from "./ui";
import type { AssessmentResult } from "../lib/api";

const strings = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

export function ResultsScreen({ result, onNewAssessment }: { result: AssessmentResult; onNewAssessment: () => void }) {
  const summary = typeof result.summary === "string" ? result.summary : "Your personalised roadmap is ready.";
  const matches = strings(result.careerMatches);
  const actions = strings(result.actionPlan);
  return <section className="flex-1 overflow-auto p-[25px_28px_36px] min-[720px]:mx-auto min-[720px]:max-w-[720px] min-[720px]:p-[42px_clamp(44px,6vw,76px)]"><p className="eyebrow">YOUR PERSONALISED ROADMAP</p><h1 className="heading text-[44px] min-[720px]:text-[56px]">Your next steps.</h1><p className="mt-4 text-sm leading-[1.6] text-muted">{summary}</p>{matches.length > 0 && <section className="mt-7"><h2 className="font-display text-2xl font-semibold text-forest">Career matches</h2><ul className="mt-3 grid gap-2">{matches.map((match) => <li key={match} className="rounded-[14px] border border-line bg-white p-4 text-sm font-bold text-forest">{match}</li>)}</ul></section>}{actions.length > 0 && <section className="mt-7"><h2 className="font-display text-2xl font-semibold text-forest">Your action plan</h2><ol className="mt-3 grid gap-2">{actions.map((action, index) => <li key={action} className="rounded-[14px] border border-line bg-white p-4 text-sm text-forest"><span className="mr-2 font-mono text-coral">0{index + 1}</span>{action}</li>)}</ol></section>}<PrimaryButton type="button" className="mt-7" onClick={onNewAssessment}>Start another assessment <Arrow /></PrimaryButton></section>;
}
