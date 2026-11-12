import { useCallback, useEffect, useState } from "react";

import { AccessScreen } from "./components/AccessScreen";
import { AppShell } from "./components/AppShell";
import { articles } from "./components/data";
import { CompleteScreen } from "./components/CompleteScreen";
import { PlansScreen } from "./components/PlansScreen";
import { PreparingScreen } from "./components/PreparingScreen";
import { PreviewScreen } from "./components/PreviewScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { QuizScreen } from "./components/QuizScreen";
import { ReadingPanel } from "./components/ReadingPanel";
import { ResultsScreen } from "./components/ResultsScreen";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { ApiError, getPackages, getPublishedQuizzes, getQuestionCount, getQuiz, identifyEntitlement, initializeCheckout, synchronizeJourney, verifyAccessCode, verifyPayment, type AssessmentResult, type Quiz, type SubscriptionPackage, type VerifiedPayment } from "./lib/api";
import { useAuth } from "./lib/auth";
import { clearGuestJourney, newGuestJourney, preservePaymentRecovery, readGuestJourney, saveGuestJourney, savePaymentRecovery, type GuestJourney } from "./lib/guest-journey";

const validEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim());
const classLevel = (value: string) => value.replace(/\s+/g, "");

export default function App() {
  const auth = useAuth();
  const [journey, setJourney] = useState<GuestJourney>(() => readGuestJourney());
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [quizError, setQuizError] = useState("");
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);
  const [paymentError, setPaymentError] = useState("");
  const [accessError, setAccessError] = useState("");
  const [processingError, setProcessingError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>();
  const [verification, setVerification] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [issuedCredential, setIssuedCredential] = useState<VerifiedPayment["accessCode"]>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const question = quiz?.questions[journey.questionIndex];
  const answer = question ? journey.answers[question.id] : undefined;
  const greeting = journey.name.trim() || "there";
  const updateJourney = (patch: Partial<GuestJourney>) => setJourney((current) => ({ ...current, ...patch }));
  const entitlement = journey.entitlement?.email === journey.email.trim().toLowerCase() ? journey.entitlement : undefined;

  const paymentMessage = (error: unknown) => {
    if (!(error instanceof ApiError)) return "We could not complete your request. Please try again.";
    if (error.code === "PAYSTACK_NOT_CONFIGURED" || error.code === "PAYSTACK_PLAN_PRICE_MISMATCH") return "Payments are temporarily unavailable. Please contact Edu Compass support.";
    if (error.code === "SUBSCRIPTION_PACKAGE_INVALID") { void getPackages().then(setPackages); return "That package is no longer available. Please select another package."; }
    if (error.code === "ORGANISATION_NAME_REQUIRED") return "Add your organization name to continue.";
    if (error.code === "PAYSTACK_REFERENCE_MISMATCH") return "We could not match this payment to your checkout. Please contact support.";
    return error.message;
  };

  const checkEntitlement = useCallback(async (email = journey.email) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!validEmail(normalizedEmail)) return "unknown" as const;
    try {
      const decision = await identifyEntitlement(normalizedEmail);
      setJourney((current) => current.email.trim().toLowerCase() === normalizedEmail ? { ...current, entitlement: { email: normalizedEmail, active: decision.hasActiveEntitlement, checkedAt: new Date().toISOString() } } : current);
      return decision.hasActiveEntitlement ? "active" as const : "inactive" as const;
    } catch (error) {
      setAccessError(error instanceof Error ? error.message : "We could not check your subscription. Please try again.");
      return "unknown" as const;
    }
  }, [journey.email]);

  const loadCurrentQuiz = useCallback(async () => {
    setIsLoadingQuiz(true); setQuizError("");
    try {
      const quizzes = await getPublishedQuizzes();
      const selected = quizzes.find((item) => item.id === journey.quizId) ?? quizzes[0];
      if (!selected) throw new Error("No assessment is available right now.");
      const loaded = await getQuiz(selected.slug);
      if (journey.quizVersion && journey.quizVersion !== loaded.version) {
        setJourney({ ...newGuestJourney(), quizId: loaded.id, quizVersion: loaded.version });
        setPaymentError("The assessment has been updated, so we’ve started you with the latest questions.");
      } else if (!journey.quizId) updateJourney({ quizId: loaded.id, quizVersion: loaded.version });
      setQuiz(loaded);
    } catch (error) { setQuizError(error instanceof Error ? error.message : "We could not load the assessment."); }
    finally { setIsLoadingQuiz(false); }
  }, [journey]);

  const prepareResults = async () => {
    if (!quiz) return;
    setProcessingError(""); updateJourney({ step: "preparing" });
    try {
      const synced = await synchronizeJourney({ guestId: journey.guestId, quizId: journey.quizId, quizVersion: journey.quizVersion, currentStep: "complete", completedSteps: ["welcome", "profile", "quiz", "preview", "complete"], onboardingData: { firstName: journey.name.trim(), classLevel: classLevel(journey.level) }, quizResponses: Object.entries(journey.answers).map(([questionId, optionId]) => ({ questionId, optionId })), progressData: { email: journey.email.trim().toLowerCase(), clientStep: journey.step } });
      const raw = synced.result ?? synced.journey.result;
      const data = raw && typeof raw === "object" && "data" in raw ? (raw as { data: AssessmentResult }).data : raw;
      if (!data || typeof data !== "object") throw new Error("Your results are still being prepared. Please try again shortly.");
      setResult(data as AssessmentResult); updateJourney({ step: "results", backendJourneyId: synced.journey.id });
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.code === "UNAUTHENTICATED")) await auth.refresh();
      setProcessingError(error instanceof Error ? error.message : "We could not prepare your results. Please try again.");
    }
  };

  const openAccess = async () => {
    setAccessError("");
    if (auth.status === "authenticated") { await prepareResults(); return; }
    updateJourney({ step: "access" }); await checkEntitlement();
  };
  const authenticate = async (code: string) => {
    setAccessError(""); setIsAuthenticating(true);
    try { const response = await verifyAccessCode(journey.email.trim(), code.trim()); auth.setAuthenticated(response.account); await prepareResults(); }
    catch (error) { setAccessError(error instanceof Error ? error.message : "We could not verify that access code."); }
    finally { setIsAuthenticating(false); }
  };

  useEffect(() => { saveGuestJourney(journey); }, [journey]);
  useEffect(() => { void loadCurrentQuiz(); }, []);
  useEffect(() => { getQuestionCount().then(setQuestionCount).catch(() => undefined); }, []);
  useEffect(() => { getPackages().then((items) => { setPackages(items); setSelectedPackageId((current) => current ?? items.find((item) => item.audience === "individual")?.id); }).catch(() => setPaymentError("Subscription packages are unavailable right now.")); }, []);
  useEffect(() => {
    const reference = new URLSearchParams(window.location.search).get("reference") || new URLSearchParams(window.location.search).get("trxref");
    if (!reference || verification === "verifying") return;
    setVerification("verifying");
    verifyPayment(reference).then((response) => {
      if (response.transaction.status !== "success" || !response.accessCode) throw new Error("Your payment is still being confirmed. Please try again shortly.");
      setIssuedCredential(response.accessCode); setVerification("success"); savePaymentRecovery(reference); updateJourney({ step: "complete", paymentReference: reference, paymentVerified: true, entitlement: { email: response.accessCode.email.trim().toLowerCase(), active: true, checkedAt: new Date().toISOString() } }); window.history.replaceState({}, "", "/payment/callback");
    }).catch((error) => { setPaymentError(paymentMessage(error)); setVerification("error"); });
  }, []);
  useEffect(() => { if (!auth.sessionExpired) return; preservePaymentRecovery(journey); clearGuestJourney(); setJourney(newGuestJourney()); setResult(null); setIssuedCredential(null); setAccessError(""); setProcessingError(""); }, [auth.sessionExpired]);
  useEffect(() => { const revalidate = () => { if (document.visibilityState === "visible") { void loadCurrentQuiz(); void auth.refresh(); } }; window.addEventListener("focus", revalidate); document.addEventListener("visibilitychange", revalidate); return () => { window.removeEventListener("focus", revalidate); document.removeEventListener("visibilitychange", revalidate); }; }, [loadCurrentQuiz]);

  const reset = () => setJourney({ ...newGuestJourney(), quizId: quiz?.id, quizVersion: quiz?.version });
  const changeEmail = (email: string) => {
    updateJourney({ email, entitlement: undefined });
    if (auth.account && auth.account.email.toLowerCase() !== email.trim().toLowerCase()) void auth.signOut();
  };
  const chooseAnswer = (value: string) => question && updateJourney({ answers: { ...journey.answers, [question.id]: value } });
  const goBack = () => journey.questionIndex ? updateJourney({ questionIndex: journey.questionIndex - 1 }) : updateJourney({ step: "profile" });
  const startCheckout = async () => {
    if (!journey.email.trim()) { setPaymentError("Add an email address to continue securely."); return; }
    if (!selectedPackageId) { setPaymentError("Choose a subscription package to continue."); return; }
    if (journey.purchaseAudience === "organization" && !journey.organisationName.trim()) { setPaymentError("Add your organization name to continue."); return; }
    setPaymentError(""); setIsCheckingOut(true);
    try {
      const configured = import.meta.env.VITE_PAYMENT_CALLBACK_URL as string | undefined; const fallback = `${window.location.origin}/payment/callback`; const callbackUrl = (configured || fallback).startsWith("https://") ? configured || fallback : undefined;
      const checkout = await initializeCheckout({ email: journey.email.trim(), name: journey.name.trim() || undefined, organisationName: journey.purchaseAudience === "organization" ? journey.organisationName.trim() : undefined, packageId: selectedPackageId, seats: journey.purchaseAudience === "organization" ? journey.seats : 1, callbackUrl });
      updateJourney({ paymentReference: checkout.reference }); window.sessionStorage.setItem("edu-compass.pending-payment", checkout.reference); window.location.assign(checkout.authorization_url);
    } catch (error) { setPaymentError(paymentMessage(error)); setIsCheckingOut(false); }
  };
  const signOut = async () => { try { await auth.signOut(); clearGuestJourney(); setJourney(newGuestJourney()); setResult(null); } catch (error) { setAccessError(error instanceof Error ? error.message : "We could not log you out. Please try again."); } };

  return <main className="relative grid min-h-svh place-items-center overflow-hidden bg-[#eae7dc] p-0 min-[720px]:h-svh min-[720px]:min-h-0 min-[720px]:overflow-hidden min-[720px]:p-[clamp(28px,5vw,72px)] max-[560px]:block max-[560px]:bg-paper"><div aria-hidden="true" className="pointer-events-none absolute -left-48 -top-48 h-[570px] w-[570px] rounded-full bg-lime/55 blur-[82px]" /><div aria-hidden="true" className="pointer-events-none absolute -bottom-56 -right-40 h-[620px] w-[620px] rounded-full bg-coral/20 blur-[100px]" /><div className="relative z-1 w-full max-w-[540px] min-[720px]:max-w-[1180px] min-[1320px]:grid min-[1320px]:max-w-[1510px] min-[1320px]:grid-cols-[minmax(0,1180px)_270px] min-[1320px]:gap-[22px] max-[560px]:max-w-none"><AppShell step={journey.step} onReset={reset} account={auth.status === "authenticated" ? auth.account : undefined} onLogout={() => void signOut()}>{journey.step === "welcome" && <WelcomeScreen onStart={() => updateJourney({ step: "profile" })} questionCount={questionCount} />}{journey.step === "profile" && <ProfileScreen name={journey.name} level={journey.level} email={journey.email} onName={(name) => updateJourney({ name })} onLevel={(level) => updateJourney({ level })} onEmail={changeEmail} onSubmit={(event) => { event.preventDefault(); const email = journey.email.trim(); if (!validEmail(email)) return; updateJourney({ step: "quiz", email, entitlement: journey.entitlement?.email === email.toLowerCase() ? journey.entitlement : undefined }); void checkEntitlement(email); }} />}{journey.step === "quiz" && isLoadingQuiz && <PreparingScreen error="" onRetry={() => void loadCurrentQuiz()} />}{journey.step === "quiz" && quizError && <PreparingScreen error={quizError} onRetry={() => void loadCurrentQuiz()} />}{journey.step === "quiz" && question && !isLoadingQuiz && !quizError && <QuizScreen question={question} index={journey.questionIndex} total={quiz.questions.length} answer={answer} onAnswer={chooseAnswer} onBack={goBack} onContinue={() => journey.questionIndex === quiz.questions.length - 1 ? updateJourney({ step: "preview" }) : updateJourney({ questionIndex: journey.questionIndex + 1 })} />}{journey.step === "preview" && <PreviewScreen greeting={greeting} career="Your unique direction" onPlans={() => void openAccess()} onReset={reset} />}{journey.step === "access" && <AccessScreen email={journey.email} entitlement={entitlement ? entitlement.active ? "active" : "inactive" : "unknown"} error={accessError} isSubmitting={isAuthenticating} onSubmit={(code) => void authenticate(code)} onSubscribe={() => updateJourney({ step: "plans" })} onEditEmail={() => updateJourney({ step: "profile" })} onRetry={() => void checkEntitlement()} />}{journey.step === "plans" && <PlansScreen packages={packages} audience={journey.purchaseAudience} selectedPackageId={selectedPackageId} onPlan={setSelectedPackageId} email={journey.email} onEmail={changeEmail} organisationName={journey.organisationName} seats={journey.seats} onAudience={(purchaseAudience) => { updateJourney({ purchaseAudience }); setSelectedPackageId(packages.find((item) => item.audience === purchaseAudience && (purchaseAudience === "individual" || (journey.seats >= item.minSeats && (item.maxSeats === null || journey.seats <= item.maxSeats))))?.id); }} onOrganisationName={(organisationName) => updateJourney({ organisationName })} onSeats={(seats) => updateJourney({ seats })} error={paymentError} isCheckingOut={isCheckingOut} onRetryVerification={verification === "error" ? () => window.location.reload() : undefined} onBack={() => updateJourney({ step: "access" })} onCheckout={startCheckout} />}{journey.step === "complete" && <CompleteScreen greeting={greeting} accessCode={issuedCredential?.code} accessEmail={issuedCredential?.email} onReview={() => updateJourney({ step: "access" })} />}{journey.step === "preparing" && <PreparingScreen error={processingError} onRetry={() => void prepareResults()} />}{journey.step === "results" && result && <ResultsScreen result={result} onNewAssessment={reset} />}</AppShell><ReadingPanel articles={articles} page={journey.articlePage} onPageChange={(articlePage) => updateJourney({ articlePage })} /></div></main>;
}
