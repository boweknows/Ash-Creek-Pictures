import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variants: Record<NonNullable<Props["variant"]>, string> = {
  primary: "bg-accent text-slate-900 hover:opacity-90",
  secondary: "bg-panel text-text border border-slate-700 hover:bg-slate-800",
  ghost: "bg-transparent text-muted hover:text-text",
  danger: "bg-rose-500 text-white hover:bg-rose-600",
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "min-h-11 rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
