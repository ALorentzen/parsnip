import { useEffect, useState } from "react";
import HamburgerIcon from "./HamburgerIcon";
import CloseIcon from "./CloseIcon";

export default function Hamburger({ target, className }: { target: string; className?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const panel = document.querySelector<HTMLElement>(target);
    if (!panel) return;

    panel.classList.toggle("hidden", !open);
    panel.classList.toggle("flex", open);
    document.documentElement.classList.toggle("overflow-hidden", open);

    if (!open) return;
    const onBackdrop = (e: MouseEvent) => {
      if (e.target === panel) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    panel.addEventListener("click", onBackdrop);
    window.addEventListener("keydown", onEsc);
    return () => {
      panel.removeEventListener("click", onBackdrop);
      window.removeEventListener("keydown", onEsc);
    };
  }, [open, target]);

  return (
    <button
      onClick={() => setOpen((prev) => !prev)}
      aria-expanded={open}
      aria-controls={target.replace("#", "")}
      aria-label={open ? "Close menu" : "Open menu"}
      className={["p-2 md:p-3", className].filter(Boolean).join(" ")}
      type="button"
    >
      {open ? <CloseIcon /> : <HamburgerIcon />}
    </button>
  );
}
