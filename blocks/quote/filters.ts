// Clean, working override for core/quote block
// Fix TypeScript: declare window.wp
declare global {
  interface Window {
    wp: any;
  }
}

import { QuoteEdit } from "./quote-backend";

if (window.wp && window.wp.hooks && window.wp.element) {
  // Extend core/quote attributes
  window.wp.hooks.addFilter(
    "blocks.registerBlockType",
    "parsnip/extend-quote-attributes",
    (settings: any, name: string) => {
      if (name === "core/quote") {
        const attrs =
          typeof settings.attributes === "object" && settings.attributes !== null
            ? settings.attributes
            : {};
        return {
          ...settings,
          attributes: {
            ...attrs,
            reviewer: { type: "string", default: "" },
            year: { type: "string", default: "" },
            quote: { type: "string", default: "" },
          },
        };
      }
      return settings;
    },
  );

  // Override edit component for core/quote
  window.wp.hooks.addFilter(
    "blocks.registerBlockType",
    "parsnip/quote-override-edit",
    (settings: any, name: string) => {
      if (name === "core/quote") {
        return {
          ...settings,
          edit: function QuoteEditWrapper(props: any) {
            return window.wp.element.createElement(QuoteEdit, {
              attributes: props.attributes,
              setAttributes: props.setAttributes,
            });
          },
        };
      }
      return settings;
    },
  );
}
