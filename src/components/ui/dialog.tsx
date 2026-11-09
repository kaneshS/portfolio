"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

/* Native <dialog>: focus trap, Esc, backdrop for free. Styled as a terminal window. */
export function TermDialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="term-dialog"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={title}
    >
      <div className="term-bar">
        <span className="term-lights" aria-hidden="true"><i /><i /><i /></span>
        <span className="truncate">{title}</span>
        <button onClick={onClose} className="ml-auto -mr-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded text-fg-dim hover:text-fg transition-colors duration-150" aria-label="Close">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="max-h-[calc(min(88dvh,60rem)-3rem)] overflow-y-auto p-5 md:p-8" style={{ overscrollBehavior: "contain" }}>
        {children}
      </div>
    </dialog>
  );
}
