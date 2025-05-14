import * as React from "react";

import { cn } from "@/lib/utils";

function InputWithSuffix({ className, type, suffix, ...props }: React.ComponentProps<"input"> & {suffix: string}) {
  return (
    <div
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "items-center justify-between w-full truncate",
        className
      )}
    >
      <input type={type} className="text-sm focus:outline-none grow w-full" {...props}></input>
      <div className="ml-2 text-muted-foreground text-sm w-min">{suffix}</div>
    </div>
  );
}

export { InputWithSuffix };
