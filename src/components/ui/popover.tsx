"use client";

import { Popover } from "@base-ui/react/popover";
import type * as React from "react";
import { createContext, useContext, useRef } from "react";
import { cn } from "@/lib/utils";

const PopoverAnchorRefContext =
  createContext<React.RefObject<HTMLElement | null> | null>(null);

function PopoverRoot({
  children,
  ...props
}: React.ComponentProps<typeof Popover.Root>) {
  const anchorRef = useRef<HTMLElement | null>(null);
  return (
    <PopoverAnchorRefContext.Provider value={anchorRef}>
      <Popover.Root data-slot="popover" {...props}>
        {children}
      </Popover.Root>
    </PopoverAnchorRefContext.Provider>
  );
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof Popover.Trigger>) {
  return <Popover.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof Popover.Popup> & {
  align?: "start" | "center" | "end";
  sideOffset?: number;
}) {
  const anchorRef = useContext(PopoverAnchorRefContext);

  return (
    <Popover.Portal>
      <Popover.Positioner
        align={align}
        sideOffset={sideOffset}
        anchor={anchorRef ?? undefined}
      >
        <Popover.Popup
          data-slot="popover-content"
          className={cn(
            "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md outline-none",
            className,
          )}
          {...props}
        />
      </Popover.Positioner>
    </Popover.Portal>
  );
}

function PopoverAnchor({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const anchorRef = useContext(PopoverAnchorRefContext);
  return (
    <div
      ref={anchorRef as React.Ref<HTMLDivElement>}
      data-slot="popover-anchor"
      {...props}
    />
  );
}

export {
  PopoverRoot as Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
};
