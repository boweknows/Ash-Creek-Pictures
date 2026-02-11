import { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-11 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 text-sm text-text focus:border-accent focus:outline-none",
        props.className,
      )}
    />
  );
}
