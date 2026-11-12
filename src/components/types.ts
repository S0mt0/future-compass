export type Step =
  | "welcome"
  | "profile"
  | "quiz"
  | "preview"
  | "access"
  | "plans"
  | "complete"
  | "preparing"
  | "results";

export type Article = { title: string; source: string; href: string; topic: string };
