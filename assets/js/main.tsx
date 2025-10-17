// Simple vanilla JS hamburger functionality - no React hydration
function initHamburger() {
  const hamburgers = document.querySelectorAll<HTMLElement>('[data-react="hamburger"]');

  hamburgers.forEach((hamburger) => {
    const target = hamburger.dataset.target || "#mobile-menu";
    const panel = document.querySelector<HTMLElement>(target);
    if (!panel) return;

    let isOpen = false;

    // Update hamburger icon
    const updateIcon = () => {
      hamburger.innerHTML = isOpen
        ? `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
           </svg>`
        : `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
           </svg>`;
    };

    // Toggle menu
    const toggle = () => {
      isOpen = !isOpen;
      panel.classList.toggle("hidden", !isOpen);
      panel.classList.toggle("flex", isOpen);
      document.documentElement.classList.toggle("overflow-hidden", isOpen);
      updateIcon();
    };

    // Click handler
    hamburger.addEventListener("click", toggle);

    // Close on backdrop click
    panel.addEventListener("click", (e) => {
      if (e.target === panel) toggle();
    });

    // Close on escape
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) toggle();
    });

    // Set initial icon
    updateIcon();
  });
}

// Import scroll handler
import "../js/scroll.js";

// Initialize scroll effect
function initScroll() {
  // Check if we're in WordPress admin/editor
  if (
    document.body.classList.contains("wp-admin") ||
    document.body.classList.contains("block-editor-page") ||
    document.querySelector(".edit-post-layout") ||
    document.querySelector(".block-editor")
  ) {
    // We're in editor - clean up any existing scroll effects
    const cleanupEditorBlocks = (window as any).cleanupEditorBlocks;
    if (typeof cleanupEditorBlocks === "function") {
      cleanupEditorBlocks();
    }
    return; // Don't init scroll effects in editor
  }

  // Get the scroll effect initializer from the scroll module (frontend only)
  const initScrollEffect = (window as any).initScrollEffect;
  if (typeof initScrollEffect === "function") {
    initScrollEffect();
  }
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", () => {
      initHamburger();
      initScroll();
    })
  : (() => {
      initHamburger();
      initScroll();
    })();
