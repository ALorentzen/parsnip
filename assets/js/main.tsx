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

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", initHamburger)
  : initHamburger();
