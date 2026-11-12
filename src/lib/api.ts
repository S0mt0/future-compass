const baseUrl = (
  import.meta.env.VITE_ADMIN_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

export type QuizAnswer = {
  id: string;
  label: string;
  detail?: string;
  position: number;
};
export type QuizQuestion = {
  id: string;
  text: string;
  screenLabel?: string;
  position: number;
  answers: QuizAnswer[];
};
export type Quiz = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  instructions?: string;
  version: number;
  questions: QuizQuestion[];
};
export type QuizSummary = Pick<
  Quiz,
  "id" | "title" | "slug" | "description" | "instructions" | "version"
>;
export type SubscriptionPackage = {
  id: string;
  name: string;
  audience: "individual" | "organization";
  minSeats: number;
  maxSeats: number | null;
  pricePerSeatNaira: number;
};
export type CheckoutResult = { authorization_url: string; reference: string };
export type VerifiedPayment = {
  transaction: { status?: string };
  accessCode: { code: string; email: string; role: string } | null;
};
export class ApiError extends Error {
  readonly code?: string;
  readonly status?: number;
  constructor(message: string, code?: string, status?: number) { super(message); this.name = "ApiError"; this.code = code; this.status = status; }
}

async function read<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    credentials: "include",
    ...init,
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(typeof body?.error === "string" ? body.error : "We could not complete that request.", typeof body?.code === "string" ? body.code : undefined, response.status);
  return body as T;
}
export const getPublishedQuizzes = async () =>
  (await read<{ quizzes: QuizSummary[] }>("/api/quizzes")).quizzes;
export const getQuiz = async (slug: string) =>
  (await read<{ quiz: Quiz }>(`/api/quizzes/${encodeURIComponent(slug)}`)).quiz;
export const getQuestionCount = async () =>
  (await read<{ questionCount: number }>("/api/quizzes/count")).questionCount;
export const getPackages = async () =>
  (
    await read<{ data: SubscriptionPackage[] }>(
      "/api/public/subscription-packages"
    )
  ).data;
export const initializeCheckout = (input: {
  email: string;
  name?: string;
  organisationName?: string;
  packageId: string;
  seats: number;
  callbackUrl?: string;
}) =>
  read<CheckoutResult>("/api/paystack/initialize", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
export const verifyPayment = (reference: string) =>
  read<VerifiedPayment>(
    `/api/paystack/verify/${encodeURIComponent(reference)}`
  );
