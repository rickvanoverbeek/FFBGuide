import { cn } from "@/lib/utils";

/**
 * The mark: a ring cut through by a force trace. The ring's lower-right arc and
 * the wordmark's second half carry the brand blue; everything else follows
 * `currentColor` so the mark works on light and dark backgrounds alike.
 *
 * The trace is drawn twice — once wide in the page background colour — so it
 * knocks a gap out of the ring where it crosses.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-8 w-8", className)}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="24"
        cy="24"
        r="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        d="M42 24A18 18 0 0 1 24 42"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M2 26h14l4-13 6 22 4-9h16"
        fill="none"
        stroke="var(--background)"
        strokeWidth="9"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M2 26h14l4-13 6 22 4-9h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface WordmarkProps {
  className?: string;
}

export function Wordmark({ className }: WordmarkProps) {
  return (
    // Brand blue, not the link blue: bold display text clears 3:1 at this size.
    <span className={cn("font-bold tracking-tight", className)}>
      FFB <span className="text-primary">GUIDE</span>
    </span>
  );
}

interface LogoProps {
  /** Hide the wordmark and show the mark alone. */
  markOnly?: boolean;
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}

export function Logo({
  markOnly = false,
  className,
  markClassName,
  wordmarkClassName,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      {!markOnly && (
        <Wordmark className={cn("text-xl", wordmarkClassName)} />
      )}
      <span className="sr-only">FFB Guide</span>
    </span>
  );
}
