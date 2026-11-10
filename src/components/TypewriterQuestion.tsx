import { useTypewriter } from "react-simple-typewriter";

export function TypewriterQuestion({ question }: { question: string }) {
  const [text] = useTypewriter({
    words: [question],
    loop: 1,
    typeSpeed: 24,
  });

  return (
    <span className="relative block" aria-live="polite">
      <span aria-hidden="true" className="invisible">
        {question}
      </span>
      <span className="absolute inset-0">{text}</span>
    </span>
  );
}
