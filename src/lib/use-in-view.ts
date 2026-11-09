"use client";

import { useEffect, useRef } from "react";

/* Adds "in-view" once the element enters the viewport. CSS does the motion. */
export function useInView<T extends HTMLElement>(rootMargin = "0px 0px -20% 0px") {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in-view");
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return ref;
}
