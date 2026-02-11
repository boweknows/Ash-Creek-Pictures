import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 text-sm text-text placeholder:text-slate-500 focus:border-accent focus:outline-none",
        props.className,
      )}
    />
  );
}
