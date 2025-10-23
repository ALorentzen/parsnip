import React from "react";
import { createElement, Fragment } from "@wordpress/element";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody, BaseControl, Button } from "@wordpress/components";
declare const wp: any;
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface BlockSettings {
  attributes: Record<string, unknown>;
}

interface ImageAttributes {
  columnSpan?: "25" | "50" | "100"; // Width percentage
  [key: string]: unknown;
}

interface BlockProps {
  name: string;
  attributes: ImageAttributes;
  setAttributes: (attrs: Partial<ImageAttributes>) => void;
  className?: string;
}

interface BlockType {
  name: string;
}

interface SaveProps {
  className?: string;
  [key: string]: unknown;
}
const WPButton = Button as any;

const WIDTH_CLASS_MAP = {
  "25": "w-1/4",
  "50": "w-1/2",
  "100": "w-full",
};

// ============================================================================
// EXTEND IMAGE BLOCK ATTRIBUTES
// ============================================================================

wp.hooks.addFilter(
  "blocks.registerBlockType",
  "parsnip/gallery-image-attributes",
  function (settings: BlockSettings, name: string): BlockSettings {
    if (name === "core/image") {
      return {
        ...settings,
        attributes: {
          ...settings.attributes,
          columnSpan: {
            type: "string",
            default: "50",
          },
        },
      };
    }
    return settings;
  },
);

// ============================================================================
// CUSTOM CONTROLS TO IMAGE BLOCKS (SIDEBAR)
// ============================================================================

wp.hooks.addFilter(
  "editor.BlockEdit",
  "parsnip/hide-gallery-columns",
  wp.compose.createHigherOrderComponent(function (BlockEdit: unknown) {
    return function (props: BlockProps) {
      // Hide columns control for gallery blocks
      if (props.name === "core/gallery") {
        // Optionally hide columns control here, but do NOT return just a button
        return wp.element.createElement(BlockEdit, props);
      }
      return wp.element.createElement(BlockEdit, props);
    };
  }, "hideGalleryColumns"),
);

// Add custom width controls to image blocks
wp.hooks.addFilter(
  "editor.BlockEdit",
  "parsnip/gallery-image-controls",
  wp.compose.createHigherOrderComponent(function (BlockEdit: unknown) {
    return function (props: BlockProps) {
      // Only target image blocks
      if (props.name !== "core/image") {
        return wp.element.createElement(BlockEdit, props);
      }

      const columnSpan = props.attributes.columnSpan || "50";

      return (
        <Fragment>
          {wp.element.createElement(BlockEdit, props)}
          <InspectorControls>
            {wp.element.createElement(
              PanelBody,
              { title: "Gallery Layout", initialOpen: true },
              wp.element.createElement(
                BaseControl,
                { label: "Image Width", help: "Choose how wide this image should appear" },
                wp.element.createElement(
                  WPButton,
                  {
                    variant: columnSpan === "25" ? "primary" : "secondary",
                    onClick: () => props.setAttributes({ columnSpan: "25" }),
                  },
                  "25%",
                ),
                wp.element.createElement(
                  WPButton,
                  {
                    variant: columnSpan === "50" ? "primary" : "secondary",
                    onClick: () => props.setAttributes({ columnSpan: "50" }),
                  },
                  "50%",
                ),
                wp.element.createElement(
                  WPButton,
                  {
                    variant: columnSpan === "100" ? "primary" : "secondary",
                    onClick: () => props.setAttributes({ columnSpan: "100" }),
                  },
                  "100%",
                ),
              ),
            )}
          </InspectorControls>
        </Fragment>
      );
    };
  }, "withGalleryImageControls"),
);

// ============================================================================
// LIVE STYLING IN EDITOR
// ============================================================================

wp.hooks.addFilter(
  "editor.BlockListBlock",
  "parsnip/gallery-image-editor-class",
  wp.compose.createHigherOrderComponent(function (BlockListBlock: unknown) {
    return function (props: BlockProps) {
      // Only target image blocks with columnSpan attribute
      if (props.name === "core/image" && props.attributes.columnSpan) {
        // Map columnSpan values to Tailwind width classes
        const widthClass = WIDTH_CLASS_MAP[props.attributes.columnSpan];
        const newProps = {
          ...props,
          className: props.className ? `${props.className} ${widthClass}` : widthClass,
        };

        return wp.element.createElement(BlockListBlock, newProps);
      }

      return wp.element.createElement(BlockListBlock, props);
    };
  }, "withGalleryImageEditorClass"),
);

// ============================================================================
// STEP 4: PERSIST CLASSES TO FRONTEND (ON SAVE)
// ============================================================================
// Add the same CSS classes to the saved HTML so the frontend matches the editor

wp.hooks.addFilter(
  "blocks.getSaveContent.extraProps",
  "parsnip/gallery-image-frontend-class",
  function (props: SaveProps, blockType: BlockType, attributes: ImageAttributes): SaveProps {
    if (blockType.name === "core/image" && attributes.columnSpan) {
      // Map columnSpan values to Tailwind width classes
      const widthClass = WIDTH_CLASS_MAP[attributes.columnSpan];

      return {
        ...props,
        className: props.className ? `${props.className} ${widthClass}` : widthClass,
      };
    }

    return props;
  },
);
