import * as React from "react";
import { cn } from "@/lib/utils";

const spinnerStyles =
  "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", loading = false, disabled, children, ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          // Variants
          variant === "default" &&
            "bg-gradient-to-r from-gradient-start to-gradient-end text-primary-foreground shadow-sm hover:opacity-90",
          variant === "secondary" &&
            "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
          variant === "outline" &&
            "border border-border bg-transparent text-foreground shadow-sm hover:bg-muted",
          variant === "ghost" &&
            "text-foreground hover:bg-muted",
          variant === "destructive" &&
            "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
          variant === "link" &&
            "text-link underline-offset-4 hover:underline",
          // Sizes
          size === "sm" && "h-8 rounded-md px-3 text-xs",
          size === "md" && "h-10 rounded-lg px-4 text-sm",
          size === "lg" && "h-12 rounded-lg px-6 text-base",
          size === "icon" && "h-10 w-10 rounded-lg",
          className,
        )}
        {...props}
      >
        {loading && <span className={spinnerStyles} aria-hidden="true" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
