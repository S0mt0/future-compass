export type Step = "welcome" | "profile" | "quiz" | "preview" | "plans" | "complete";

export type Question = {
  category: string;
  icon: string;
  question: string;
  options: { label: string; detail: string }[];
};

export type Article = { title: string; source: string; href: string; topic: string };
