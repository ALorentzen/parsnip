/**
 * Block Editor Entry Point
 * This file is loaded ONLY in the WordPress block editor (wp-admin)
 * It registers custom blocks and extends core blocks
 */

console.log("🚀 Editor bundle loading...");

// Import custom blocks and block modifications
import "../../blocks/index";

console.log("✅ Editor bundle loaded");
