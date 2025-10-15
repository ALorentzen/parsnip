import type * as blocks from "@wordpress/blocks";
import type * as blockEditor from "@wordpress/block-editor";
import type * as element from "@wordpress/element";
import type * as i18n from "@wordpress/i18n";

declare global {
  const wp: {
    blocks: typeof blocks;
    blockEditor: typeof blockEditor & {
      useBlockProps: blockEditor.useBlockProps;
      RichText: typeof blockEditor.RichText;
    };
    element: typeof element;
    i18n: typeof i18n;
  };
}

export {};
