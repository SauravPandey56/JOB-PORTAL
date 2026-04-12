import logo from "../assets/talentorbit-logo.svg";

/** Animated brand mark — wrap with your own `<Link>` or button. */
export default function AnimatedLogo({ className = "" }) {
  return (
    <span
      className={["group relative inline-flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10", className].join(" ")}
      aria-hidden
    >
      <span className="absolute inset-0 rounded-[10px] bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] opacity-50 blur-[1px] transition-all duration-700 ease-out group-hover:opacity-90 group-hover:blur-[2px] motion-safe:animate-logo-shift" />
      <span className="relative flex h-full w-full items-center justify-center rounded-[10px] bg-white shadow-sm ring-1 ring-slate-200/80 transition duration-300 group-hover:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]">
        <img
          src={logo}
          alt=""
          className="h-6 w-6 transition-transform duration-500 ease-out group-hover:scale-105 motion-safe:group-hover:-rotate-6 sm:h-7 sm:w-7"
        />
      </span>
    </span>
  );
}
