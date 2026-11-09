"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

/* Native <dialog>: focus trap, Esc, backdrop for free. Styled as a folded note. */
export function NoteDialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
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
      className="note-dialog"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={title}
    >
      <div className="max-h-[inherit] overflow-y-auto p-6 md:p-10" style={{ overscrollBehavior: "contain" }}>
        <button onClick={onClose} className="absolute top-3 right-3 p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded text-ink-soft hover:text-ink" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </dialog>
  );
}
