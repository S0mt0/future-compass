import { useCallback, useEffect, useState } from "react";

import { AppShell } from "./components/AppShell";
import { articles } from "./components/data";
import { CompleteScreen } from "./components/CompleteScreen";
import { PlansScreen } from "./components/PlansScreen";
import { PreviewScreen } from "./components/PreviewScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { QuizScreen } from "./components/QuizScreen";
import { ReadingPanel } from "./components/ReadingPanel";
import { WelcomeScreen } from "./components/WelcomeScreen";
import {
  getPackages,
  getPublishedQuizzes,
  getQuestionCount,
  getQuiz,
  initializeCheckout,
  verifyPayment,
  type Quiz,
  type SubscriptionPackage,
  type VerifiedPayment,
} from "./lib/api";
import {
  newGuestJourney,
  readGuestJourney,
  saveGuestJourney,
  type GuestJourney,
} from "./lib/guest-journey";

export default function App() {
  const [journey, setJourney] = useState<GuestJourney>(() =>
    readGuestJourney()
  );
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [quizError, setQuizError] = useState("");
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);
  const [paymentError, setPaymentError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>();
  const [verification, setVerification] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const [issuedCredential, setIssuedCredential] =
    useState<VerifiedPayment["accessCode"]>(null);
  const question = quiz?.questions[journey.questionIndex];
  const answer = question ? journey.answers[question.id] : undefined;
  const greeting = journey.name.trim() || "there";
  const updateJourney = (patch: Partial<GuestJourney>) =>
    setJourney((current) => ({ ...current, ...patch }));

  const career = "Your unique direction";

  const chooseAnswer = (value: string) => {
    if (question)
      updateJourney({ answers: { ...journey.answers, [question.id]: value } });
  };

  useEffect(() => {
    saveGuestJourney(journey);
  }, [journey]);

  const loadCurrentQuiz = useCallback(async () => {
    setIsLoadingQuiz(true);
    setQuizError("");
    try {
      const quizzes = await getPublishedQuizzes();
      const selected =
        quizzes.find((item) => item.id === journey.quizId) ?? quizzes[0];
      if (!selected) throw new Error("No assessment is available right now.");
      const loaded = await getQuiz(selected.slug);
      if (journey.quizVersion && journey.quizVersion !== loaded.version) {
        setJourney({
          ...newGuestJourney(),
          quizId: loaded.id,
          quizVersion: loaded.version,
        });
        setPaymentError(
          "The assessment has been updated, so we’ve started you with the latest questions."
        );
      } else if (!journey.quizId)
        updateJourney({ quizId: loaded.id, quizVersion: loaded.version });
      setQuiz(loaded);
    } catch (error) {
      setQuizError(
        error instanceof Error
          ? error.message
          : "We could not load the assessment."
      );
    } finally {
      setIsLoadingQuiz(false);
    }
  }, [journey]);

  useEffect(() => {
    void loadCurrentQuiz();
  }, []);
  useEffect(() => {
    getQuestionCount()
      .then(setQuestionCount)
      .catch(() => undefined);
  }, []);
  useEffect(() => {
    getPackages()
      .then((items) => {
        setPackages(items);
        setSelectedPackageId(
          (current) =>
            current ?? items.find((item) => item.audience === "individual")?.id
        );
      })
      .catch(() =>
        setPaymentError("Subscription packages are unavailable right now.")
      );
  }, []);
  useEffect(() => {
    const reference =
      new URLSearchParams(window.location.search).get("reference") ||
      new URLSearchParams(window.location.search).get("trxref");
    if (!reference || verification === "verifying") return;
    setVerification("verifying");
    verifyPayment(reference)
      .then((result) => {
        if (result.transaction.status !== "success" || !result.accessCode)
          throw new Error(
            "Your payment is still being confirmed. Please try again shortly."
          );
        setIssuedCredential(result.accessCode);
        setVerification("success");
        updateJourney({ step: "complete" });
        window.history.replaceState({}, "", "/payment/callback");
      })
      .catch((error) => {
        setPaymentError(
          error instanceof Error
            ? error.message
            : "We could not verify your payment yet."
        );
        setVerification("error");
      });
  }, []);
  useEffect(() => {
    const revalidate = () => {
      if (document.visibilityState === "visible") void loadCurrentQuiz();
    };
    window.addEventListener("focus", revalidate);
    document.addEventListener("visibilitychange", revalidate);
    return () => {
      window.removeEventListener("focus", revalidate);
      document.removeEventListener("visibilitychange", revalidate);
    };
  }, [loadCurrentQuiz]);

  const reset = () =>
    setJourney({
      ...newGuestJourney(),
      quizId: quiz?.id,
      quizVersion: quiz?.version,
    });

  const startCheckout = async () => {
    if (!journey.email.trim()) {
      setPaymentError("Add an email address to continue securely.");
      return;
    }
    if (!selectedPackageId) {
      setPaymentError("Choose a subscription package to continue.");
      return;
    }
    if (
      journey.purchaseAudience === "organization" &&
      !journey.organisationName.trim()
    ) {
      setPaymentError("Add your organization name to continue.");
      return;
    }
    setPaymentError("");
    setIsCheckingOut(true);
    try {
      const configured = import.meta.env.VITE_PAYMENT_CALLBACK_URL as
        | string
        | undefined;
      const fallback = `${window.location.origin}/payment/callback`;
      const callbackUrl = (configured || fallback).startsWith("https://")
        ? configured || fallback
        : undefined;
      const checkout = await initializeCheckout({
        email: journey.email.trim(),
        name: journey.name.trim() || undefined,
        organisationName:
          journey.purchaseAudience === "organization"
            ? journey.organisationName.trim()
            : undefined,
        packageId: selectedPackageId,
        seats: journey.purchaseAudience === "organization" ? journey.seats : 1,
        callbackUrl,
      });
      window.sessionStorage.setItem(
        "edu-compass.pending-payment",
        checkout.reference
      );
      window.location.assign(checkout.authorization_url);
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "We could not start checkout. Please try again."
      );
      setIsCheckingOut(false);
    }
  };

  const goBack = () =>
    journey.questionIndex
      ? updateJourney({ questionIndex: journey.questionIndex - 1 })
      : updateJourney({ step: "profile" });

  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-[#eae7dc] p-0 min-[720px]:h-svh min-[720px]:min-h-0 min-[720px]:overflow-hidden min-[720px]:p-[clamp(28px,5vw,72px)] max-[560px]:block max-[560px]:bg-paper">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 -top-48 h-[570px] w-[570px] rounded-full bg-lime/55 blur-[82px] min-[720px]:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 -right-40 h-[620px] w-[620px] rounded-full bg-coral/20 blur-[100px] min-[720px]:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[30rem] -left-[24rem] hidden h-[650px] w-[650px] rounded-full border border-forest/15 min-[720px]:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[22rem] -top-[25rem] hidden h-[650px] w-[650px] rounded-full border border-coral/20 min-[720px]:block"
      />
      <div className="relative z-1 w-full max-w-[540px] min-[720px]:max-w-[1180px] min-[1320px]:grid min-[1320px]:max-w-[1510px] min-[1320px]:grid-cols-[minmax(0,1180px)_270px] min-[1320px]:gap-[22px] max-[560px]:max-w-none">
        <AppShell step={journey.step} onReset={reset}>
          {journey.step === "welcome" && (
            <WelcomeScreen
              onStart={() => updateJourney({ step: "profile" })}
              questionCount={questionCount}
            />
          )}

          {journey.step === "profile" && (
            <ProfileScreen
              name={journey.name}
              level={journey.level}
              onName={(name) => updateJourney({ name })}
              onLevel={(level) => updateJourney({ level })}
              onSubmit={(event) => {
                event.preventDefault();
                if (journey.name.trim() && journey.level)
                  updateJourney({ step: "quiz" });
              }}
            />
          )}

          {journey.step === "quiz" && isLoadingQuiz && (
            <section className="grid flex-1 place-items-center p-10 text-center">
              <div>
                <p className="eyebrow">LOADING ASSESSMENT</p>
                <h1 className="heading">Preparing your questions.</h1>
              </div>
            </section>
          )}
          {journey.step === "quiz" && quizError && (
            <section className="grid flex-1 place-items-center p-10 text-center">
              <div>
                <p role="alert" className="text-sm text-[#b2321c]">
                  {quizError}
                </p>
                <button
                  type="button"
                  onClick={() => void loadCurrentQuiz()}
                  className="mt-4 font-bold text-coral"
                >
                  Try again
                </button>
              </div>
            </section>
          )}
          {journey.step === "quiz" &&
            question &&
            !isLoadingQuiz &&
            !quizError && (
              <QuizScreen
                question={question}
                index={journey.questionIndex}
                total={quiz.questions.length}
                answer={answer}
                onAnswer={chooseAnswer}
                onBack={goBack}
                onContinue={() =>
                  journey.questionIndex === quiz.questions.length - 1
                    ? updateJourney({ step: "preview" })
                    : updateJourney({
                        questionIndex: journey.questionIndex + 1,
                      })
                }
              />
            )}

          {journey.step === "preview" && (
            <PreviewScreen
              greeting={greeting}
              career={career}
              onPlans={() => updateJourney({ step: "plans" })}
              onReset={reset}
            />
          )}

          {journey.step === "plans" && (
            <PlansScreen
              packages={packages}
              audience={journey.purchaseAudience}
              selectedPackageId={selectedPackageId}
              onPlan={setSelectedPackageId}
              email={journey.email}
              onEmail={(email) => updateJourney({ email })}
              organisationName={journey.organisationName}
              seats={journey.seats}
              onAudience={(purchaseAudience) => {
                updateJourney({ purchaseAudience });
                setSelectedPackageId(
                  packages.find((item) => item.audience === purchaseAudience)
                    ?.id
                );
              }}
              onOrganisationName={(organisationName) =>
                updateJourney({ organisationName })
              }
              onSeats={(seats) => updateJourney({ seats })}
              error={paymentError}
              isCheckingOut={isCheckingOut}
              onBack={() => updateJourney({ step: "preview" })}
              onCheckout={startCheckout}
            />
          )}

          {journey.step === "complete" && (
            <CompleteScreen
              greeting={greeting}
              accessCode={issuedCredential?.code}
              accessEmail={issuedCredential?.email}
              onReset={reset}
            />
          )}
        </AppShell>

        <ReadingPanel
          articles={articles}
          page={journey.articlePage}
          onPageChange={(articlePage) => updateJourney({ articlePage })}
        />
      </div>
    </main>
  );
}
