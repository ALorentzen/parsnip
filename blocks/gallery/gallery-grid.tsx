// @ts-nocheck
/**
 * Gallery Grid Controls
 *
 * Adds custom settings to EACH image in a gallery block:
 * - Selector: col-span-1, col-span-2, or col-span-3
 * - Default: col-span-1
 * - col-span-3 = full width (next image starts new row)
 * - Real-time preview in editor
 */

interface BlockSettings {
  attributes: Record<string, unknown>;
}

interface BlockProps {
  name: string;
  attributes: {
    columnSpan?: string;
    [key: string]: unknown;
  };
  setAttributes: (attrs: Record<string, unknown>) => void;
}

interface BlockType {
  name: string;
}

interface SaveProps {
  className?: string;
  [key: string]: unknown;
}

console.log("🎨 Gallery grid controls loading...");

// Add columnSpan attribute to image blocks
wp.hooks.addFilter(
  "blocks.registerBlockType",
  "parsnip/image-column-span-attribute",
  function (settings: BlockSettings, name: string): BlockSettings {
    if (name === "core/image") {
      console.log("✅ Adding columnSpan attribute to core/image block");
      return {
        ...settings,
        attributes: {
          ...settings.attributes,
          columnSpan: {
            type: "string",
            default: "1",
          },
        },
      };
    }
    return settings;
  },
);

// Add controls to image blocks
wp.hooks.addFilter(
  "editor.BlockEdit",
  "parsnip/image-span-controls",
  wp.compose.createHigherOrderComponent(function (BlockEdit: unknown) {
    return function (props: BlockProps) {
      if (props.name !== "core/image") {
        return wp.element.createElement(BlockEdit, props);
      }

      console.log("🖼️ Rendering image with columnSpan:", props.attributes.columnSpan);

      const columnSpan = props.attributes.columnSpan || "1";

      return wp.element.createElement(
        wp.element.Fragment,
        null,
        wp.element.createElement(BlockEdit, props),
        wp.element.createElement(
          wp.blockEditor.InspectorControls,
          null,
          wp.element.createElement(
            wp.components.PanelBody,
            { title: "Gallery Grid Settings", initialOpen: true },
            wp.element.createElement(wp.components.SelectControl, {
              label: "Column Span",
              value: columnSpan,
              options: [
                { label: "1 Column", value: "1" },
                { label: "2 Columns", value: "2" },
                { label: "3 Columns (Full Width)", value: "3" },
              ],
              onChange: function (value: string) {
                console.log("📐 Changed to:", value);
                props.setAttributes({ columnSpan: value });
              },
              help: "How many columns should this image span?",
            }),
          ),
        ),
      );
    };
  }, "withImageSpanControls"),
);

// Add CSS class to images based on columnSpan
wp.hooks.addFilter(
  "blocks.getSaveContent.extraProps",
  "parsnip/image-span-class",
  function (
    props: SaveProps,
    blockType: BlockType,
    attributes: BlockProps["attributes"],
  ): SaveProps {
    if (blockType.name === "core/image" && attributes.columnSpan) {
      const spanClass = "col-span-" + attributes.columnSpan;
      return {
        ...props,
        className: props.className ? props.className + " " + spanClass : spanClass,
      };
    }
    return props;
  },
);

// Register gallery variation
wp.blocks.registerBlockVariation("core/gallery", {
  name: "parsnip-grid-gallery",
  title: "Grid Gallery (Custom)",
  attributes: {
    columns: 3,
    className: "parsnip-grid-gallery",
  },
  isDefault: true,
});

console.log("✅✅✅ ALL GALLERY CONTROLS REGISTERED ✅✅✅");
