/**
 * Block Registry
 *
 * This file imports and registers all custom blocks and core block modifications.
 * Each block is self-contained in its own folder.
 */

// Custom Blocks
import "./hero/hero.tsx";

// Core Block Modifications
import "./gallery/gallery-grid.tsx";
// Import quote block backend and filters only (frontend handled by PHP)
import "./quote/quote-backend.tsx";
