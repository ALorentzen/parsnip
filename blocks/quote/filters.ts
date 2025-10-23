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

  // Ensure saved HTML contains our custom fields so frontend will render them
  window.wp.hooks.addFilter(
    "blocks.getSaveContent.extraProps",
    "parsnip/quote-save-extra-fields",
    (props: any, blockType: any, attributes: any) => {
      if (!blockType || blockType.name !== "core/quote") return props;
      let children = props.children || [];
      if (attributes && attributes.quote) {
        children = [
          window.wp.element.createElement("p", { key: "quote" }, attributes.quote),
          ...children,
        ];
      }
      if (attributes && attributes.reviewer) {
        children.push(
          window.wp.element.createElement("footer", { key: "reviewer" }, attributes.reviewer),
        );
      }
      if (attributes && attributes.year) {
        children.push(
          window.wp.element.createElement(
            "div",
            { key: "year", className: "quote-year" },
            attributes.year,
          ),
        );
      }
      return { ...props, children };
    },
  );
}
