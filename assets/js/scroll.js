// Track container scroll position for smooth animation
let containerScrollY = 0;
const scrollSensitivity = 0.5; // Reduced scroll speed for better control

const updateContent = () => {
  const scrollContainer = document.querySelector(".js-scroll");
  if (!scrollContainer) return;

  // Move hero to background container
  const heroBlock = scrollContainer.querySelector(".wp-block-parsnip-hero");
  if (heroBlock) {
    const heroContainer = document.querySelector(".js-hero-container");
    if (heroContainer && !heroContainer.querySelector(".wp-block-parsnip-hero")) {
      heroContainer.appendChild(heroBlock.cloneNode(true));
      heroBlock.style.display = "none";
    }
  }

  // Move the entire container content up/down - like scrolling within overflow-hidden viewport
  scrollContainer.style.transform = `translateY(${-containerScrollY}px)`;

  // Ensure smooth transitions on container
  if (!scrollContainer.style.transition) {
    scrollContainer.style.transition = "transform 0.3s ease-in-out";
  }

  // Get ALL content blocks (custom + core WordPress blocks), excluding hero
  const contentBlocks = scrollContainer.querySelectorAll(
    '[class*="wp-block"]:not(.wp-block-parsnip-hero)',
  );

  contentBlocks.forEach((block, index) => {
    // Position blocks initially way down, staggered
    const initialOffset = window.innerHeight + index * (window.innerHeight * 0.8);

    // Set the block's position with smooth transitions
    block.style.position = "absolute";
    block.style.right = "2rem";
    block.style.bottom = "auto";
    block.style.top = `${initialOffset}px`;
    block.style.transform = "none"; // Remove transforms, use direct positioning
    block.style.opacity = "1"; // Always visible - no fade effects

    // Ensure CSS transitions are applied
    if (!block.style.transition) {
      block.style.transition = "all 0.3s ease-in-out";
    }
  });
};

const handleWheel = (e) => {
  e.preventDefault(); // Prevent actual page scrolling

  // Smooth container scrolling
  containerScrollY += e.deltaY * scrollSensitivity;

  // Clamp scroll bounds - allow scrolling through all content
  const maxScrollDistance = window.innerHeight * 3; // Adjust based on content amount
  containerScrollY = Math.max(0, Math.min(maxScrollDistance, containerScrollY));

  updateContent();
};

// Initialize the scroll effect
const initScrollEffect = () => {
  // ONLY run on frontend, NOT in WordPress admin/editor
  // Multiple checks to ensure we never run in editor
  if (
    document.body.classList.contains("wp-admin") ||
    document.body.classList.contains("block-editor-page") ||
    document.querySelector(".edit-post-layout") ||
    document.querySelector(".block-editor") ||
    document.querySelector(".edit-site-layout") ||
    window.location.pathname.includes("/wp-admin/")
  ) {
    console.log("Scroll effect disabled in WordPress editor");
    return; // Exit early - we're in editor
  }

  // Prevent actual scrolling, use wheel events instead
  window.addEventListener("wheel", handleWheel, { passive: false });

  // Initial content positioning
  updateContent();

  // Optional: Add keyboard controls
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      containerScrollY += 50; // Reduced keyboard scroll speed
      const maxScrollDistance = window.innerHeight * 3;
      containerScrollY = Math.min(maxScrollDistance, containerScrollY);
      updateContent();
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      containerScrollY -= 50; // Reduced keyboard scroll speed
      containerScrollY = Math.max(0, containerScrollY);
      updateContent();
    }
  });
};

// Clean up any scroll effects in editor
const cleanupEditorBlocks = () => {
  // Reset any blocks that might have been manipulated
  const blocks = document.querySelectorAll('[class*="wp-block"]');
  blocks.forEach((block) => {
    if (block.style.position) block.style.position = "";
    if (block.style.transform) block.style.transform = "";
    if (block.style.opacity) block.style.opacity = "";
    if (block.style.top) block.style.top = "";
    if (block.style.right) block.style.right = "";
    if (block.style.bottom) block.style.bottom = "";
    if (block.style.left) block.style.left = "";
    if (block.style.display) block.style.display = "";
    if (block.style.transition) block.style.transition = "";
  });

  // Reset scroll container if it exists
  const scrollContainer = document.querySelector(".js-scroll");
  if (scrollContainer) {
    scrollContainer.style.transform = "";
    scrollContainer.style.transition = "";
  }
};

// Export for main.tsx
window.scrollHandler = updateContent;
window.initScrollEffect = initScrollEffect;
window.cleanupEditorBlocks = cleanupEditorBlocks;
