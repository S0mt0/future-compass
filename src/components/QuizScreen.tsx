import type { Question } from "./types";
import { Arrow, PrimaryButton } from "./ui";

type Props = {
  question: Question;
  index: number;
  total: number;
  answer?: string;
  onAnswer: (value: string) => void;
  onContinue: () => void;
};
export function QuizScreen({
  question,
  index,
  total,
  answer,
  onAnswer,
  onContinue,
}: Props) {
  return (
    <section className="grid flex-1 overflow-auto p-[10px_28px_108px] min-[720px]:mx-auto min-[720px]:grid-cols-[minmax(260px,.8fr)_minmax(390px,1.2fr)] min-[720px]:gap-x-[clamp(42px,7vw,90px)] min-[720px]:p-[26px_clamp(44px,6vw,76px)_38px] min-[720px]:max-w-[1080px]">
      <div className="col-span-full flex justify-between font-mono text-xs text-muted">
        <span className="text-coral">{question.category}</span>
        <span>
          Question {index + 1} of {total}
        </span>
      </div>
      <div className="col-span-full mt-3 h-1.5 overflow-hidden rounded-full bg-[#deded4]">
        <span
          className="block h-full rounded-full bg-coral transition-[width] duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>
      <div className="mt-[39px] text-[40px] min-[720px]:col-start-1 min-[720px]:mt-[62px] min-[720px]:text-[46px]">
        {question.icon}
      </div>
      <h1
        className={`heading min-[720px]:col-start-1 min-[720px]:text-[clamp(39px,3.8vw,54px)]`}
      >
        {question.question}
      </h1>
      <p className="mb-[27px] mt-[15px] text-sm text-muted min-[720px]:col-start-1 min-[720px]:text-[15px]">
        Pick the answer that feels most like you today.
      </p>
      <div className="grid gap-3 min-[720px]:col-start-2 min-[720px]:row-[3/span_3] min-[720px]:mt-[38px]">
        {question.options.map((option, optionIndex) => {
          const selected = answer === option.label;
          return (
            <button
              className={`grid min-h-[88px] w-full grid-cols-[31px_1fr_19px] items-center gap-2.5 rounded-[18px] border p-[14px] text-left transition hover:-translate-y-px ${
                selected
                  ? "border-forest bg-[#e9f0d0]"
                  : "border-line bg-[#fbfaf5]"
              }`}
              key={option.label}
              type="button"
              onClick={() => onAnswer(option.label)}
            >
              <span
                className={`grid h-7 w-7 place-items-center rounded-[9px] font-mono text-xs ${
                  selected ? "bg-forest text-white" : "bg-[#ebe9df] text-forest"
                }`}
              >
                {String.fromCharCode(65 + optionIndex)}
              </span>
              <span>
                <strong className="block text-[13px] leading-[1.3] min-[720px]:text-sm">
                  {option.label}
                </strong>
                <small className="mt-[5px] block text-[11px] leading-[1.35] text-muted min-[720px]:text-xs">
                  {option.detail}
                </small>
              </span>
              <span
                aria-hidden="true"
                className={`h-[18px] w-[18px] rounded-full border-[1.5px] ${
                  selected ? "border-[5px] border-forest" : "border-[#b2b6aa]"
                }`}
              />
            </button>
          );
        })}
      </div>
      <PrimaryButton
        type="button"
        disabled={!answer}
        onClick={onContinue}
        className="absolute inset-x-7 bottom-[22px] w-auto shadow-[0_12px_30px_rgba(23,63,56,.25)] min-[720px]:static min-[720px]:col-start-2 min-[720px]:row-start-6 min-[720px]:mt-[21px] min-[720px]:w-full min-[720px]:shadow-none"
      >
        {index === total - 1 ? "Reveal my direction" : "Continue"}
        <Arrow />
      </PrimaryButton>
    </section>
  );
}
