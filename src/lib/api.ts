const baseUrl = (import.meta.env.VITE_ADMIN_API_URL || "http://localhost:3000").replace(/\/$/, "");

export type QuizAnswer = { id: string; label: string; detail?: string; position: number };
export type QuizQuestion = { id: string; text: string; screenLabel?: string; position: number; answers: QuizAnswer[] };
export type Quiz = { id: string; title: string; slug: string; description?: string; instructions?: string; version: number; questions: QuizQuestion[] };
export type QuizSummary = Pick<Quiz, "id" | "title" | "slug" | "description" | "instructions" | "version">;

async function read<T>(path: string): Promise<T> { const response = await fetch(`${baseUrl}${path}`); const body = await response.json().catch(() => null); if (!response.ok) throw new Error(body?.error || "We could not load the assessment."); return body as T; }
export const getPublishedQuizzes = async () => (await read<{ quizzes: QuizSummary[] }>("/api/quizzes")).quizzes;
export const getQuiz = async (slug: string) => (await read<{ quiz: Quiz }>(`/api/quizzes/${encodeURIComponent(slug)}`)).quiz;
export const getQuestionCount = async () => (await read<{ questionCount: number }>("/api/quizzes/count")).questionCount;
