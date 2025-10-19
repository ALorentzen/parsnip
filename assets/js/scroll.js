// Track container scroll position for smooth animation
let containerScrollY = 0;
const scrollSensitivity = 1.5; // Increased scroll speed for more responsive feel

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

  // Set up the scroll container as a fixed window on the right side (parent stays in place)
  scrollContainer.style.width = "40%"; // Take up 40% of screen width
  scrollContainer.style.height = "100vh";
  scrollContainer.style.overflow = "hidden"; // Hide content that goes outside the window
  scrollContainer.style.zIndex = "10";
  scrollContainer.style.padding = "2rem";
  scrollContainer.style.boxSizing = "border-box";

  // Create or get a content wrapper inside the scroll container
  let contentWrapper = scrollContainer.querySelector(".content-wrapper");
  if (!contentWrapper) {
    contentWrapper = document.createElement("div");
    contentWrapper.className = "content-wrapper";

    // Move all existing content into the wrapper
    const children = Array.from(scrollContainer.children);
    children.forEach((child) => {
      if (!child.classList.contains("content-wrapper")) {
        contentWrapper.appendChild(child);
      }
    });
    scrollContainer.appendChild(contentWrapper);
  }

  // Style the content wrapper - this is what moves inside the fixed parent
  contentWrapper.style.display = "flex";
  contentWrapper.style.flexDirection = "column";
  contentWrapper.style.gap = "3rem";
  contentWrapper.style.transition = "transform 0.1s ease-out"; // Faster, more responsive transition

  // Translate the content wrapper - start below visible area, scroll up into view
  const initialOffset = scrollContainer.offsetHeight; // Start content below the parent container
  contentWrapper.style.transform = `translateY(${initialOffset - containerScrollY}px)`;

  // Get ALL content blocks and reset their positioning (let flexbox handle layout)
  const contentBlocks = contentWrapper.querySelectorAll(
    '[class*="wp-block"]:not(.wp-block-parsnip-hero)',
  );

  contentBlocks.forEach((block) => {
    // Reset any absolute positioning and let flexbox handle layout
    block.style.position = "relative";
    block.style.top = "auto";
    block.style.right = "auto";
    block.style.bottom = "auto";
    block.style.left = "auto";
    block.style.transform = "none";
    block.style.opacity = "1";
    block.style.transition = "all 0.3s ease-in-out";

    // Ensure blocks fit within the column
    block.style.maxWidth = "100%";
    block.style.width = "100%";
    block.style.flexShrink = "0"; // Prevent blocks from shrinking

    // Fix video blocks that aren't loading (only initialize once)
    if (block.classList.contains("wp-block-video")) {
      const video = block.querySelector("video");
      if (video && !video.hasAttribute("data-initialized")) {
        // Mark as initialized to prevent repeated calls
        video.setAttribute("data-initialized", "true");

        // CRITICAL: Remove controls attribute - it prevents autoplay
        video.removeAttribute("controls");

        // CRITICAL: Remove poster attribute - it can block video from showing even when playing
        video.removeAttribute("poster");

        // Ensure autoplay attributes are set
        video.setAttribute("autoplay", "");
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("loop", "");

        // Force visibility and display
        video.style.display = "block";
        video.style.visibility = "visible";
        video.style.opacity = "1";
        video.style.zIndex = "1";

        // Ensure parent figure element isn't blocking
        const figure = video.closest(".wp-block-video");
        if (figure) {
          figure.style.zIndex = "1";
          figure.style.position = "relative";
        }

        // Force play immediately - video is already loaded (readyState 4)
        const playVideo = () => {
          console.log(
            "🎬 Attempting play - readyState:",
            video.readyState,
            "paused:",
            video.paused,
            "currentTime:",
            video.currentTime,
          );
          video
            .play()
            .then(() => {
              console.log(
                "✅ Video playing - paused:",
                video.paused,
                "currentTime:",
                video.currentTime,
              );
              // Verify it's actually playing after a moment
              setTimeout(() => {
                console.log(
                  "🔍 Video status after 1s - paused:",
                  video.paused,
                  "currentTime:",
                  video.currentTime,
                  "readyState:",
                  video.readyState,
                );
              }, 1000);
            })
            .catch((e) => {
              console.error("❌ Video play failed:", e.name, e.message);
              // If play fails, try again after a short delay
              setTimeout(() => video.play(), 100);
            });
        };

        // If video is already loaded, play immediately
        if (video.readyState >= 2) {
          // HAVE_CURRENT_DATA or better
          playVideo();
        } else {
          // Otherwise wait for it to load
          video.addEventListener("canplay", playVideo, { once: true });
        }
      }
    }
  });
};

const handleWheel = (e) => {
  e.preventDefault(); // Prevent actual page scrolling

  // Smooth container scrolling
  containerScrollY += e.deltaY * scrollSensitivity;

  // Clamp scroll bounds - start from 0 (content below screen) to max content height
  const maxScrollDistance = window.innerHeight * 2; // Adjust based on content amount
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
      containerScrollY += 100; // Increased keyboard scroll speed
      const maxScrollDistance = window.innerHeight * 2;
      containerScrollY = Math.min(maxScrollDistance, containerScrollY);
      updateContent();
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      containerScrollY -= 100; // Increased keyboard scroll speed
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
    if (block.style.maxWidth) block.style.maxWidth = "";
    if (block.style.width) block.style.width = "";
    if (block.style.flexShrink) block.style.flexShrink = "";
  });

  // Reset scroll container if it exists
  const scrollContainer = document.querySelector(".js-scroll");
  if (scrollContainer) {
    scrollContainer.style.width = "";
    scrollContainer.style.height = "";
    scrollContainer.style.overflow = "";
    scrollContainer.style.zIndex = "";
    scrollContainer.style.padding = "";
    scrollContainer.style.boxSizing = "";

    // Reset content wrapper
    const contentWrapper = scrollContainer.querySelector(".content-wrapper");
    if (contentWrapper) {
      contentWrapper.style.display = "";
      contentWrapper.style.flexDirection = "";
      contentWrapper.style.gap = "";
      contentWrapper.style.transition = "";
      contentWrapper.style.transform = "";
    }
  }
};

// Export for main.tsx
window.scrollHandler = updateContent;
window.initScrollEffect = initScrollEffect;
window.cleanupEditorBlocks = cleanupEditorBlocks;
