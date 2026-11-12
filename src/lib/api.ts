const baseUrl = (import.meta.env.VITE_ADMIN_API_URL || "http://localhost:3000").replace(/\/$/, "");

export type QuizAnswer = { id: string; label: string; position: number };
export type QuizQuestion = { id: string; text: string; helpText?: string; position: number; answers: QuizAnswer[] };
export type Quiz = { id: string; title: string; slug: string; description?: string; instructions?: string; version: number; questions: QuizQuestion[] };
export type QuizSummary = Pick<Quiz, "id" | "title" | "slug" | "description" | "instructions" | "version">;

export async function getPublishedQuizzes(): Promise<QuizSummary[]> {
  const response = await fetch(`${baseUrl}/api/quizzes`);
  const body = await response.json().catch(() => null);
  if (!response.ok || !Array.isArray(body?.quizzes)) throw new Error(body?.error || "We could not load the assessment.");
  return body.quizzes;
}

export async function getQuestionCount(): Promise<number> {
  const response = await fetch(`${baseUrl}/api/quizzes/count`);
  const body = await response.json().catch(() => null);
  if (!response.ok || !Number.isInteger(body?.questionCount) || body.questionCount < 0) {
    throw new Error(body?.error || "We could not load the assessment count.");
  }
  return body.questionCount;
}

export async function getQuiz(slug: string): Promise<Quiz> {
  const response = await fetch(`${baseUrl}/api/quizzes/${encodeURIComponent(slug)}`);
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.quiz || !Array.isArray(body.quiz.questions)) throw new Error(body?.error || "We could not load the assessment.");
  return body.quiz as Quiz;
}
