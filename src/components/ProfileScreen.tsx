import type { FormEvent } from "react";
import { Arrow, PrimaryButton } from "./ui";

type Props = {
  name: string;
  level: string;
  email: string;
  onName: (value: string) => void;
  onLevel: (value: string) => void;
  onEmail: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};
export function ProfileScreen({
  name,
  level,
  email,
  onName,
  onLevel,
  onEmail,
  onSubmit,
}: Props) {
  return (
    <section className="grid flex-1 p-[25px_28px_36px] min-[720px]:grid-cols-[minmax(0,1fr)_minmax(380px,.95fr)] min-[720px]:grid-rows-[auto_auto_1fr] min-[720px]:gap-x-[clamp(44px,7vw,96px)] min-[720px]:overflow-auto min-[720px]:p-[34px_clamp(44px,6vw,76px)_54px]">
      <p className={`eyebrow min-[720px]:col-start-1`}>
        FIRST, A LITTLE CONTEXT
      </p>
      <h1
        className={`heading mb-[26px] min-[720px]:col-start-1 min-[720px]:mb-8`}
      >
        Let’s make this feel like it was made for you.
      </h1>
      <div className="mb-[27px] h-[198px] overflow-hidden rounded-[23px] min-[720px]:col-start-2 min-[720px]:row-span-3 min-[720px]:m-0 min-[720px]:h-full min-[720px]:min-h-[530px] min-[720px]:rounded-[28px]">
        <img
          className="h-full w-full object-cover object-[center_29%]"
          src="/image-2.jpg"
          alt="Student smiling with books and a backpack"
          decoding="sync"
          fetchPriority="high"
          loading="eager"
        />
      </div>
      <form
        onSubmit={onSubmit}
        className="grid content-start gap-[14px] self-start min-[720px]:col-start-1 min-[720px]:max-w-[460px]"
      >
        <label className="grid gap-1.5 text-[13px] font-bold text-forest min-[720px]:text-sm">
          What should we call you?
          <input
            className="h-[57px] rounded-[14px] border border-line bg-white px-[15px] text-base outline-none focus:border-forest focus:ring-3 focus:ring-forest/10"
            value={name}
            onChange={(event) => onName(event.target.value)}
            autoComplete="given-name"
            placeholder="Your first name"
            maxLength={40}
            required
          />
        </label>
        <label className="grid gap-1.5 text-[13px] font-bold text-forest min-[720px]:text-sm">
          What’s your email address?
          <input
            className="h-[57px] rounded-[14px] border border-line bg-white px-[15px] text-base outline-none focus:border-forest focus:ring-3 focus:ring-forest/10"
            type="email"
            value={email}
            onChange={(event) => onEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="grid gap-1.5 text-[13px] font-bold text-forest min-[720px]:text-sm">
          Which class are you in?
          <select
            className="h-[57px] rounded-[14px] border border-line bg-white px-[15px] text-base outline-none focus:border-forest focus:ring-3 focus:ring-forest/10"
            value={level}
            onChange={(event) => onLevel(event.target.value)}
            required
          >
            <option value="">Choose your class</option>
            {["JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <PrimaryButton
          type="submit"
          disabled={!name.trim() || !level || !/^\S+@\S+\.\S+$/.test(email.trim())}
          className="mt-2"
        >
          Continue <Arrow />
        </PrimaryButton>
      </form>
    </section>
  );
}
