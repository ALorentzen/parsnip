// Development block loader - loads blocks via script injection
(function () {
  "use strict";

  // Wait for WordPress to be ready
  if (typeof wp === "undefined" || !wp.blocks || !wp.blockEditor) {
    console.log("WordPress not ready, retrying...");
    setTimeout(() => {
      if (window.loadDevBlocks) {
        window.loadDevBlocks();
      }
    }, 100);
    return;
  }

  console.log("Loading development blocks...");

  // Define the blocks to load in development
  const blocks = [
    {
      name: "simple-quote",
      url: "https://parsnip.test:5173/wp-content/themes/parsnip/blocks/simple-quote/index.tsx",
    },
    {
      name: "hero",
      url: "https://parsnip.test:5173/wp-content/themes/parsnip/blocks/hero/index.tsx",
    },
  ];

  // Load each block by creating a script tag
  blocks.forEach((block) => {
    console.log(`Loading block: ${block.name} from ${block.url}`);

    const script = document.createElement("script");
    script.type = "module";
    script.src = block.url;
    script.crossOrigin = "anonymous";

    script.onload = () => {
      console.log(`Successfully loaded block: ${block.name}`);
    };

    script.onerror = (error) => {
      console.error(`Failed to load block ${block.name}:`, error);
    };

    document.head.appendChild(script);
  });

  // Expose for retry mechanism
  window.loadDevBlocks = () => {
    blocks.forEach((block) => {
      const script = document.createElement("script");
      script.type = "module";
      script.src = block.url;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    });
  };
})();
