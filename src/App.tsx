import { useEffect, useMemo, useState } from "react";
import PaystackPop from "@paystack/inline-js";

import { AppShell } from "./components/AppShell";
import { articles, questions } from "./components/data";
import { CompleteScreen } from "./components/CompleteScreen";
import { PlansScreen } from "./components/PlansScreen";
import { PreviewScreen } from "./components/PreviewScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { QuizScreen } from "./components/QuizScreen";
import { ReadingPanel } from "./components/ReadingPanel";
import type { Step } from "./components/types";
import { WelcomeScreen } from "./components/WelcomeScreen";

const progressKey = "edu-compass-progress";

type SavedProgress = {
  step: Step;
  name: string;
  level: string;
  questionIndex: number;
  answers: string[];
  selectedPlan: "monthly" | "annual";
  email: string;
  articlePage: number;
};

function loadProgress(): Partial<SavedProgress> {
  if (typeof window === "undefined") return {};

  try {
    const saved = JSON.parse(window.localStorage.getItem(progressKey) || "{}") as Partial<SavedProgress>;
    return saved && typeof saved === "object" ? saved : {};
  } catch {
    return {};
  }
}

export default function App() {
  const [savedProgress] = useState(loadProgress);
  const [step, setStep] = useState<Step>(savedProgress.step ?? "welcome");
  const [name, setName] = useState(savedProgress.name ?? "");
  const [level, setLevel] = useState(savedProgress.level ?? "");
  const [questionIndex, setQuestionIndex] = useState(savedProgress.questionIndex ?? 0);
  const [answers, setAnswers] = useState<string[]>(savedProgress.answers ?? []);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">(
    savedProgress.selectedPlan ?? "monthly"
  );
  const [email, setEmail] = useState(savedProgress.email ?? "");
  const [paymentError, setPaymentError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [articlePage, setArticlePage] = useState(savedProgress.articlePage ?? 0);
  const question = questions[questionIndex];
  const answer = answers[questionIndex];
  const greeting = name.trim() || "there";

  const career = useMemo(
    () =>
      answers.some((item) => /Biology|Laboratory|medicine|health/i.test(item))
        ? "Health innovator"
        : answers.some((item) => /creative|art|Writing|designing/i.test(item))
        ? "Creative strategist"
        : "Technology builder",
    [answers]
  );

  const chooseAnswer = (value: string) =>
    setAnswers((current) => {
      const next = [...current];
      next[questionIndex] = value;
      return next;
    });

  useEffect(() => {
    const progress: SavedProgress = {
      step,
      name,
      level,
      questionIndex,
      answers,
      selectedPlan,
      email,
      articlePage,
    };
    window.localStorage.setItem(progressKey, JSON.stringify(progress));
  }, [answers, articlePage, email, level, name, questionIndex, selectedPlan, step]);

  const reset = () => {
    setStep("welcome");
    setName("");
    setLevel("");
    setQuestionIndex(0);
    setAnswers([]);
    setArticlePage(0);
    window.localStorage.removeItem(progressKey);
  };

  const startCheckout = () => {
    const key = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!email.trim()) {
      setPaymentError("Add an email address to continue securely.");
      return;
    }
    if (!key) {
      setPaymentError(
        "Checkout is not configured yet. Add VITE_PAYSTACK_PUBLIC_KEY to enable Paystack."
      );
      return;
    }
    setPaymentError("");
    setIsCheckingOut(true);
    const isAnnual = selectedPlan === "annual";
    try {
      new PaystackPop().newTransaction({
        key,
        email: email.trim(),
        amount: isAnnual ? 1200000 : 150000,
        currency: "NGN",
        firstName: name.trim() || undefined,
        planInterval: isAnnual ? "annually" : "monthly",
        metadata: {
          custom_fields: [
            {
              display_name: "Selected plan",
              variable_name: "selected_plan",
              value: selectedPlan,
            },
          ],
        },
        onSuccess: () => {
          setIsCheckingOut(false);
          setStep("complete");
        },
        onCancel: () => setIsCheckingOut(false),
        onError: (error: { message?: string }) => {
          setPaymentError(
            error.message || "We could not start checkout. Please try again."
          );
          setIsCheckingOut(false);
        },
      });
    } catch {
      setPaymentError("We could not start checkout. Please try again.");
      setIsCheckingOut(false);
    }
  };

  const goBack = () =>
    questionIndex ? setQuestionIndex(questionIndex - 1) : setStep("profile");

  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-[#eae7dc] p-0 min-[720px]:h-svh min-[720px]:min-h-0 min-[720px]:overflow-hidden min-[720px]:p-[clamp(28px,5vw,72px)] max-[560px]:block max-[560px]:bg-paper">
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 -top-48 h-[570px] w-[570px] rounded-full bg-lime/55 blur-[82px] min-[720px]:block" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-56 -right-40 h-[620px] w-[620px] rounded-full bg-coral/20 blur-[100px] min-[720px]:block" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-[30rem] -left-[24rem] hidden h-[650px] w-[650px] rounded-full border border-forest/15 min-[720px]:block" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-[22rem] -top-[25rem] hidden h-[650px] w-[650px] rounded-full border border-coral/20 min-[720px]:block" />
      <div className="relative z-1 w-full max-w-[540px] min-[720px]:max-w-[1180px] min-[1320px]:grid min-[1320px]:max-w-[1510px] min-[1320px]:grid-cols-[minmax(0,1180px)_270px] min-[1320px]:gap-[22px] max-[560px]:max-w-none">
        <AppShell step={step} onReset={reset}>
          {step === "welcome" && (
            <WelcomeScreen onStart={() => setStep("profile")} />
          )}

          {step === "profile" && (
            <ProfileScreen
              name={name}
              level={level}
              onName={setName}
              onLevel={setLevel}
              onSubmit={(event) => {
                event.preventDefault();
                if (name.trim() && level) setStep("quiz");
              }}
            />
          )}

          {step === "quiz" && (
            <QuizScreen
              question={question}
              index={questionIndex}
              total={questions.length}
              answer={answer}
              onAnswer={chooseAnswer}
              onBack={goBack}
              onContinue={() =>
                questionIndex === questions.length - 1
                  ? setStep("preview")
                  : setQuestionIndex(questionIndex + 1)
              }
            />
          )}

          {step === "preview" && (
            <PreviewScreen
              greeting={greeting}
              career={career}
              onPlans={() => setStep("plans")}
              onReset={reset}
            />
          )}

          {step === "plans" && (
            <PlansScreen
              selectedPlan={selectedPlan}
              onPlan={setSelectedPlan}
              email={email}
              onEmail={setEmail}
              error={paymentError}
              isCheckingOut={isCheckingOut}
              onBack={() => setStep("preview")}
              onCheckout={startCheckout}
            />
          )}

          {step === "complete" && (
            <CompleteScreen greeting={greeting} onReset={reset} />
          )}
        </AppShell>

        <ReadingPanel
          articles={articles}
          page={articlePage}
          onPageChange={setArticlePage}
        />
      </div>
    </main>
  );
}
