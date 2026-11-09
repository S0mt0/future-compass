import { useMemo, useState } from "react";
import PaystackPop from "@paystack/inline-js";
import "./App.css";

type Step = "welcome" | "profile" | "quiz" | "preview" | "plans" | "complete";
type Question = {
  category: string;
  icon: string;
  question: string;
  options: { label: string; detail: string }[];
};
type Article = { title: string; source: string; href: string; topic: string };

const questions: Question[] = [
  {
    category: "Personality",
    icon: "🧠",
    question:
      "When you face a difficult problem, how do you usually approach it?",
    options: [
      {
        label: "I analyze it logically step by step",
        detail: "Patterns, logic, and structured problem-solving.",
      },
      {
        label: "I brainstorm creative solutions",
        detail: "Finding original ways through a challenge.",
      },
      {
        label: "I talk to others and gather opinions",
        detail: "Learning from people and different viewpoints.",
      },
      {
        label: "I research thoroughly before acting",
        detail: "Using evidence and facts before deciding.",
      },
    ],
  },
  {
    category: "Interests",
    icon: "❤️",
    question: "Which activity sounds most exciting to you?",
    options: [
      {
        label: "Building an app or website",
        detail: "Creating useful digital tools.",
      },
      {
        label: "Helping a sick person recover",
        detail: "Supporting people’s health and wellbeing.",
      },
      {
        label: "Running a business and making money",
        detail: "Spotting opportunities and making plans work.",
      },
      {
        label: "Writing stories or creating art",
        detail: "Expressing ideas creatively.",
      },
    ],
  },
  {
    category: "Strengths",
    icon: "💪",
    question: "Which subjects do you enjoy or excel at the most?",
    options: [
      {
        label: "Mathematics & Physics",
        detail: "Numbers, systems, and how things work.",
      },
      {
        label: "Biology & Chemistry",
        detail: "Living things, experiments, and health.",
      },
      {
        label: "Literature, Government & CRS/IRS",
        detail: "People, ideas, communication, and society.",
      },
      {
        label: "Economics, Commerce & Accounting",
        detail: "Money, organisations, and decision-making.",
      },
    ],
  },
  {
    category: "Work Style",
    icon: "🏗️",
    question: "What kind of work environment appeals to you most?",
    options: [
      {
        label: "Laboratory or research facility",
        detail: "Testing ideas and discovering new things.",
      },
      {
        label: "Office or corporate setting",
        detail: "Collaborating within an organised team.",
      },
      {
        label: "Outdoors or field work",
        detail: "Solving practical problems in the real world.",
      },
      {
        label: "Hospital, clinic, or helping people directly",
        detail: "Working closely with people who need support.",
      },
    ],
  },
  {
    category: "Values",
    icon: "🌍",
    question: "What impact do you want your career to have on Nigeria?",
    options: [
      {
        label: "Advance technology and innovation",
        detail: "Making everyday life work better with new ideas.",
      },
      {
        label: "Improve healthcare and save lives",
        detail: "Helping communities live healthier lives.",
      },
      {
        label: "Create jobs and grow the economy",
        detail: "Building opportunities for people and businesses.",
      },
      {
        label: "Educate, govern, or shape society",
        detail: "Helping people, institutions, and communities thrive.",
      },
    ],
  },
  {
    category: "Skills",
    icon: "🛠️",
    question: "People who know you would say you’re naturally good at:",
    options: [
      {
        label: "Solving complex puzzles & calculations",
        detail: "Working patiently through difficult problems.",
      },
      {
        label: "Communicating and persuading people",
        detail: "Explaining ideas and bringing people together.",
      },
      {
        label: "Drawing, designing, or creating things",
        detail: "Turning ideas into things people can see and use.",
      },
      {
        label: "Organizing, planning & leading others",
        detail: "Seeing what needs to happen and guiding a group.",
      },
    ],
  },
  {
    category: "Ambition",
    icon: "🚀",
    question: "In 15 years, where do you see yourself?",
    options: [
      {
        label: "Leading a tech company or startup",
        detail: "Creating and leading useful innovation.",
      },
      {
        label: "Practicing medicine or running a hospital",
        detail: "Leading care for people and communities.",
      },
      {
        label: "Working in government or diplomacy",
        detail: "Helping shape public decisions and society.",
      },
      {
        label: "Running a successful business empire",
        detail: "Growing an organisation that creates value.",
      },
    ],
  },
  {
    category: "Learning",
    icon: "📚",
    question: "How do you prefer to learn new things?",
    options: [
      {
        label: "Hands-on experiments and practice",
        detail: "Trying things out helps ideas stick.",
      },
      {
        label: "Reading books and doing research",
        detail: "Going deep and finding reliable information.",
      },
      {
        label: "Watching tutorials and visual content",
        detail: "Seeing an example makes learning click.",
      },
      {
        label: "Group discussions and debates",
        detail: "Talking through ideas helps me understand them.",
      },
    ],
  },
];

const articles: Article[] = [
  {
    title: "Your Guide to Career Exploration",
    source: "BigFuture",
    topic: "Career choices",
    href: "https://bigfuture.collegeboard.org/explore-careers/get-started",
  },
  {
    title: "Career Decision Choice Map",
    source: "BigFuture",
    topic: "Planning",
    href: "https://bigfuture.collegeboard.org/media/pdf/navigating-multiple-pathways-guide.pdf",
  },
  {
    title: "Career Exploration and Guidance",
    source: "CareerOneStop",
    topic: "Career choices",
    href: "https://cloudfront.careeronestop.org/CompetencyModel/GetStarted/userguide_explore.aspx",
  },
  {
    title: "Occupational Outlook Handbook",
    source: "U.S. Bureau of Labor Statistics",
    topic: "Career research",
    href: "https://www.bls.gov/ooh/",
  },
  {
    title: "O*NET OnLine",
    source: "U.S. Department of Labor",
    topic: "Career research",
    href: "https://www.onetonline.org/",
  },
  {
    title:
      "Using Technology to Help Students Develop College and Career Skills",
    source: "Edutopia",
    topic: "Career skills",
    href: "https://www.edutopia.org/article/technology-college-career-preparation",
  },
  {
    title: "3 Skills Students Need to Succeed in College",
    source: "Edutopia",
    topic: "Study skills",
    href: "https://www.edutopia.org/article/3-skills-students-need-succeed-college/",
  },
  {
    title: "Who Will Your Students Be in 2040?",
    source: "Edutopia",
    topic: "Future self",
    href: "https://www.edutopia.org/article/career-exploration-english-learners/",
  },
  {
    title: "How High School Students Can Benefit From Using LinkedIn",
    source: "Edutopia",
    topic: "Career skills",
    href: "https://www.edutopia.org/article/teaching-high-school-students-use-linkedin",
  },
  {
    title: "CTE and the Demands of the Moment",
    source: "Edutopia",
    topic: "Pathways",
    href: "https://www.edutopia.org/article/cte-and-demands-moment/",
  },
  {
    title: "Teaching CTE Students About Work-Related Uses of AI",
    source: "Edutopia",
    topic: "Digital skills",
    href: "https://www.edutopia.org/article/teaching-cte-students-use-ai/",
  },
  {
    title: "Teaching Students the College Mindset",
    source: "Edutopia",
    topic: "College readiness",
    href: "https://www.edutopia.org/article/teaching-middle-school-students-college-mindset",
  },
  {
    title: "Supporting First-Gen Students in Applying to College",
    source: "Edutopia",
    topic: "College readiness",
    href: "https://www.edutopia.org/article/supporting-first-gen-students-applying-college/",
  },
  {
    title: "Helping High School Students With Accommodations Plan for College",
    source: "Edutopia",
    topic: "College readiness",
    href: "https://www.edutopia.org/article/helping-students-accommodations-prepare-college",
  },
  {
    title: "Career hubs help young people pave new paths",
    source: "UNICEF",
    topic: "Career choices",
    href: "https://www.unicef.org/ukraine/en/stories/career-hubs-help-young-people-pave-new-paths",
  },
  {
    title: "Path to a profession",
    source: "UNICEF",
    topic: "Career choices",
    href: "https://www.unicef.org/ukraine/en/stories/path-to-profession",
  },
  {
    title: "The Future We Choose: Why Career Guidance is Key",
    source: "UNICEF",
    topic: "Career choices",
    href: "https://www.unicef.org/albania/stories/future-we-choose-why-career-guidance-key-albanias-youth",
  },
  {
    title: "From Education to Employment",
    source: "UNICEF",
    topic: "Work pathways",
    href: "https://www.unicef.org/albania/stories/education-employment-journey-requires-real-support-young-people",
  },
  {
    title: "The World of STEM Professions",
    source: "UNICEF",
    topic: "STEM careers",
    href: "https://www.unicef.org/belarus/en/stories/world-stem-professions",
  },
  {
    title: "School Career Guidance Guide",
    source: "UNICEF",
    topic: "Career choices",
    href: "https://www.unicef.org/moldova/en/reports/school-career-guidance-guide",
  },
  {
    title: "Learning for Careers",
    source: "UNICEF & ETF",
    topic: "Career choices",
    href: "https://www.unicef.org/eca/media/34136/file/Learning%20for%20careers%20report.pdf",
  },
  {
    title: "From Learning to Earning",
    source: "UNICEF",
    topic: "Skills",
    href: "https://www.unicef.org/nepal/reports/learning-earning",
  },
  {
    title: "Jana’s First-Hand Work Experience",
    source: "UNICEF",
    topic: "Work pathways",
    href: "https://www.unicef.org/montenegro/en/stories/janas-first-hand-work-experience-classroom-world-tourism",
  },
  {
    title: "Explore careers and occupations",
    source: "Khan Academy",
    topic: "Career research",
    href: "https://www.khanacademy.org/college-careers-more",
  },
  {
    title: "Learn how to learn",
    source: "Coursera",
    topic: "Study skills",
    href: "https://www.coursera.org/learn/learning-how-to-learn",
  },
  {
    title: "Explore education and career pathways",
    source: "OECD",
    topic: "Education",
    href: "https://www.oecd.org/en/topics/sub-issues/career-guidance-and-counselling.html",
  },
  {
    title: "Career guidance for young people",
    source: "International Labour Organization",
    topic: "Career choices",
    href: "https://www.ilo.org/topics/youth-employment",
  },
  {
    title: "Study skills and preparation",
    source: "British Council",
    topic: "Study skills",
    href: "https://study-uk.britishcouncil.org/plan-studies",
  },
  {
    title: "Explore possible careers",
    source: "Roadtrip Nation",
    topic: "Career research",
    href: "https://roadtripnation.com/",
  },
  {
    title: "Explore learning opportunities",
    source: "UNESCO",
    topic: "Education",
    href: "https://www.unesco.org/en/education",
  },
];

const Arrow = () => <span aria-hidden="true">→</span>;

function App() {
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
  const [readingList] = useState(() =>
    [...articles].sort(() => Math.random() - 0.5).slice(0, 5)
  );
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
      const checkout = new PaystackPop();
      checkout.newTransaction({
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

  return (
    <main className="app-shell">
      <div className="desktop-layout">
        <section
          className="phone-frame"
          aria-label="Future Compass career guide"
        >
          <img
            className="container-hand container-hand--left"
            src="/Cartoon Hand Gripping an Edge-2.png"
            alt=""
            aria-hidden="true"
          />
          <img
            className="container-hand container-hand--top"
            src="/Cartoon Hand Gripping Edge-1.png"
            alt=""
            aria-hidden="true"
          />
          <header className="topbar">
            <button
              className="brand"
              type="button"
              onClick={reset}
              aria-label="Return home"
            >
              <span className="wordmark">
                <span>Edu</span>
                <span>compass</span>
              </span>
            </button>
            {step === "quiz" && (
              <button
                className="quiet-button"
                type="button"
                onClick={() =>
                  questionIndex
                    ? setQuestionIndex(questionIndex - 1)
                    : setStep("profile")
                }
              >
                Back
              </button>
            )}
            {step === "welcome" && (
              <span className="topbar-note">A guide for your next chapter</span>
            )}
          </header>

          {step === "welcome" && (
            <section className="screen welcome-screen">
              <div className="hero-photo">
                <img
                  src="/image-1.jpg"
                  alt="Students discussing a book together"
                />
                <span className="photo-label">
                  Your future is allowed to evolve.
                </span>
              </div>
              <div className="welcome-copy">
                <p className="eyebrow">CAREER EXPLORATION, MADE HUMAN</p>
                <h1>
                  Follow the clues <em>only you</em> have.
                </h1>
                <p>
                  Eight thoughtful questions. A clearer next step. No pressure
                  to have it all figured out.
                </p>
              </div>
              <div className="stat-row">
                <div>
                  <strong>8</strong>
                  <span>questions</span>
                </div>
                <div>
                  <strong>5 min</strong>
                  <span>to explore</span>
                </div>
                <div>
                  <strong>100%</strong>
                  <span>your pace</span>
                </div>
              </div>
              <button
                className="primary-button"
                type="button"
                onClick={() => setStep("profile")}
              >
                Start exploring <Arrow />
              </button>
              <p className="micro-copy">
                Your answers stay on this device until you choose to continue.
              </p>
            </section>
          )}

          {step === "profile" && (
            <section className="screen profile-screen">
              <p className="eyebrow">FIRST, A LITTLE CONTEXT</p>
              <h1>Let’s make this feel like it was made for you.</h1>
              <div className="profile-image">
                <img
                  src="/image-2.jpg"
                  alt="Student smiling with books and a backpack"
                />
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (name.trim() && level) setStep("quiz");
                }}
              >
                <label>
                  What should we call you?
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="given-name"
                    placeholder="Your first name"
                    maxLength={40}
                    required
                  />
                </label>
                <label>
                  Which class are you in?
                  <select
                    value={level}
                    onChange={(event) => setLevel(event.target.value)}
                    required
                  >
                    <option value="">Choose your class</option>
                    {["JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3"].map(
                      (item) => (
                        <option key={item}>{item}</option>
                      )
                    )}
                  </select>
                </label>
                <button
                  className="primary-button"
                  type="submit"
                  disabled={!name.trim() || !level}
                >
                  Continue <Arrow />
                </button>
              </form>
            </section>
          )}

          {step === "quiz" && (
            <section className="screen quiz-screen">
              <div className="quiz-meta">
                <span>{question.category}</span>
                <span>
                  Question {questionIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="progress-track">
                <span
                  style={{
                    width: `${((questionIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
              <div className="question-icon">{question.icon}</div>
              <h1>{question.question}</h1>
              <p className="question-help">
                Pick the answer that feels most like you today.
              </p>
              <div className="answer-list">
                {question.options.map((option, index) => (
                  <button
                    className={`answer-option ${
                      answer === option.label ? "selected" : ""
                    }`}
                    key={option.label}
                    type="button"
                    onClick={() => chooseAnswer(option.label)}
                  >
                    <span className="option-key">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>
                      <strong>{option.label}</strong>
                      <small>{option.detail}</small>
                    </span>
                    <span className="selection-dot" aria-hidden="true" />
                  </button>
                ))}
              </div>
              <button
                className="primary-button sticky-action"
                type="button"
                disabled={!answer}
                onClick={() =>
                  questionIndex === questions.length - 1
                    ? setStep("preview")
                    : setQuestionIndex(questionIndex + 1)
                }
              >
                {questionIndex === questions.length - 1
                  ? "Reveal my direction"
                  : "Continue"}{" "}
                <Arrow />
              </button>
            </section>
          )}

          {step === "preview" && (
            <section className="screen preview-screen">
              <p className="eyebrow">YOUR PERSONAL PATTERN</p>
              <h1>There’s a strong signal here, {greeting}.</h1>
              <div className="result-orbit">
                <i className="dot-one" />
                <i className="dot-two" />
                <i className="dot-three" />
                <span>✦</span>
              </div>
              <div className="result-card">
                <span className="result-kicker">YOUR LEADING DIRECTION</span>
                <h2>{career}</h2>
                <p>
                  You seem energised by solving real problems, learning deeply,
                  and making a practical difference.
                </p>
                <div className="trait-pills">
                  <span>Curious</span>
                  <span>Purpose-led</span>
                  <span>Capable</span>
                </div>
              </div>
              <div className="locked-card">
                <div>
                  <span aria-hidden="true">🔒</span>
                  <strong>Your full roadmap is ready</strong>
                  <p>
                    Unlock career matches, subject choices, university routes,
                    and your next four steps.
                  </p>
                </div>
              </div>
              <button
                className="primary-button"
                type="button"
                onClick={() => setStep("plans")}
              >
                See my full roadmap <Arrow />
              </button>
              <button className="text-button" type="button" onClick={reset}>
                Start over
              </button>
            </section>
          )}

          {step === "plans" && (
            <section className="screen plans-screen">
              <button
                className="back-chip"
                type="button"
                onClick={() => setStep("preview")}
              >
                ← Your preview
              </button>
              <p className="eyebrow">UNLOCK YOUR ROADMAP</p>
              <h1>Keep the momentum going.</h1>
              <p className="plan-intro">
                Choose a plan that gives you room to explore—not a deadline to
                decide your life.
              </p>
              <div className="plan-stack">
                <button
                  type="button"
                  className={`plan-card ${
                    selectedPlan === "monthly" ? "chosen" : ""
                  }`}
                  onClick={() => setSelectedPlan("monthly")}
                >
                  <span className="radio" />
                  <span>
                    <strong>Compass monthly</strong>
                    <small>Full roadmap and future check-ins</small>
                  </span>
                  <b>
                    ₦1,500<small>/ month</small>
                  </b>
                </button>
                <button
                  type="button"
                  className={`plan-card featured ${
                    selectedPlan === "annual" ? "chosen" : ""
                  }`}
                  onClick={() => setSelectedPlan("annual")}
                >
                  <span className="plan-badge">BEST VALUE</span>
                  <span className="radio" />
                  <span>
                    <strong>Compass yearly</strong>
                    <small>Everything in monthly, billed once</small>
                  </span>
                  <b>
                    ₦12,000<small>/ year</small>
                  </b>
                </button>
              </div>
              <ul className="benefit-list">
                <li>Personal career and subject roadmap</li>
                <li>University and programme shortlist</li>
                <li>Save, revisit, and share your plan</li>
              </ul>
              <label className="checkout-email">
                Email for your subscription
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>
              {paymentError && (
                <p className="payment-error" role="alert">
                  {paymentError}
                </p>
              )}
              <button
                className="primary-button"
                type="button"
                onClick={startCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut
                  ? "Opening checkout…"
                  : "Continue to secure checkout"}{" "}
                <Arrow />
              </button>
              <p className="micro-copy">
                Payments are handled securely by Paystack.
              </p>
            </section>
          )}

          {step === "complete" && (
            <section className="screen complete-screen">
              <div className="complete-image">
                <img
                  src="/image-3.jpg"
                  alt="A child looking through a microscope"
                />
              </div>
              <span className="success-mark">✓</span>
              <p className="eyebrow">YOUR SUBSCRIPTION IS CONFIRMED</p>
              <h1>Welcome to the next step, {greeting}.</h1>
              <p>
                Your full roadmap would now be available here, ready to revisit
                whenever your ideas grow or change.
              </p>
              <div className="roadmap-list">
                <span>
                  01 <b>Career matches</b>
                </span>
                <span>
                  02 <b>Subject pathway</b>
                </span>
                <span>
                  03 <b>University options</b>
                </span>
              </div>
              <button className="primary-button" type="button" onClick={reset}>
                Explore again <Arrow />
              </button>
            </section>
          )}
        </section>
        <aside className="reading-panel" aria-label="Educational reading list">
          <div className="reading-panel__heading">
            <span>FIELD NOTES</span>
            <h2>Keep exploring</h2>
            <p>A few thoughtful reads for your next chapter.</p>
          </div>
          <ol>
            {readingList.map((article, index) => (
              <li key={article.href}>
                <a href={article.href} target="_blank" rel="noreferrer">
                  <span className="article-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <small>
                      {article.topic} · {article.source}
                    </small>
                    <strong>{article.title}</strong>
                  </span>
                  <span className="article-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ol>
          <p className="reading-panel__note">
            A fresh selection appears each time you visit.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default App;
