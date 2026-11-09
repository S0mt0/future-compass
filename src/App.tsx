import { useMemo, useState } from "react";
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

export default function App() {
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [email, setEmail] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [articlePage, setArticlePage] = useState(0);
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
  const reset = () => {
    setStep("welcome");
    setName("");
    setLevel("");
    setQuestionIndex(0);
    setAnswers([]);
    setArticlePage(0);
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
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-[radial-gradient(circle_at_12%_15%,#e6f3a5_0,transparent_20rem),radial-gradient(circle_at_90%_85%,#ffd4ca_0,transparent_20rem),#eae7dc] p-0 min-[720px]:h-svh min-[720px]:min-h-0 min-[720px]:overflow-hidden min-[720px]:p-[clamp(28px,5vw,72px)] before:pointer-events-none before:absolute before:inset-[-18%] before:-z-1 before:rotate-[-8deg] before:opacity-[.52] before:content-[''] before:bg-[radial-gradient(ellipse_38rem_38rem_at_14%_74%,transparent_0_58%,rgba(23,63,56,.14)_58.2%_58.45%,transparent_58.7%),radial-gradient(ellipse_32rem_32rem_at_89%_21%,transparent_0_61%,rgba(243,109,80,.16)_61.2%_61.45%,transparent_61.7%)] after:pointer-events-none after:absolute after:inset-0 after:-z-1 after:opacity-[.26] after:content-[''] after:bg-[radial-gradient(rgba(23,63,56,.34)_0.55px,transparent_0.75px)] after:bg-size-[5px_5px]">
      <div className="w-full max-w-[540px] min-[720px]:w-[min(100%,1180px)] min-[1320px]:grid min-[1320px]:w-[min(100%,1510px)] min-[1320px]:grid-cols-[minmax(0,1180px)_270px] min-[1320px]:gap-[22px]">
        <AppShell step={step} onReset={reset} onBack={goBack}>
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
