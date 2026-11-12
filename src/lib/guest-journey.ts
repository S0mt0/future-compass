import type { Step } from "../components/types";

const storageKey = "edu-compass.guest-journey.v2";
const steps = new Set<Step>([
  "welcome",
  "profile",
  "quiz",
  "preview",
  "plans",
  "complete",
]);

export type GuestJourney = {
  guestId: string;
  quizId?: string;
  quizVersion?: number;
  step: Step;
  name: string;
  level: string;
  questionIndex: number;
  answers: Record<string, string>;
  selectedPlan: "monthly" | "annual";
  purchaseAudience: "individual" | "organization";
  organisationName: string;
  seats: number;
  email: string;
  articlePage: number;
};

const id = () =>
  globalThis.crypto?.randomUUID?.().replace(/-/g, "") ??
  `${Date.now()}${Math.random().toString(36).slice(2)}`;
export const newGuestJourney = (): GuestJourney => ({
  guestId: id(),
  step: "welcome",
  name: "",
  level: "",
  questionIndex: 0,
  answers: {},
  selectedPlan: "monthly",
  purchaseAudience: "individual",
  organisationName: "",
  seats: 1,
  email: "",
  articlePage: 0,
});

export function readGuestJourney(): GuestJourney {
  try {
    const value = JSON.parse(
      window.localStorage.getItem(storageKey) || "null"
    ) as Partial<GuestJourney> | null;
    if (!value || typeof value !== "object" || !steps.has(value.step as Step))
      return newGuestJourney();
    return {
      ...newGuestJourney(),
      ...value,
      answers:
        value.answers &&
        typeof value.answers === "object" &&
        !Array.isArray(value.answers)
          ? Object.fromEntries(
              Object.entries(value.answers).filter(
                (entry): entry is [string, string] =>
                  typeof entry[1] === "string"
              )
            )
          : {},
      questionIndex:
        Number.isInteger(value.questionIndex) && value.questionIndex! >= 0
          ? value.questionIndex!
          : 0,
    };
  } catch {
    return newGuestJourney();
  }
}

export const saveGuestJourney = (journey: GuestJourney) =>
  window.localStorage.setItem(storageKey, JSON.stringify(journey));
