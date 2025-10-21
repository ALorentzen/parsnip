// @ts-nocheck
import { createElement, Fragment } from "@wordpress/element";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody, BaseControl, ButtonGroup, Button } from "@wordpress/components";

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
        return <Button variant="primary">25%</Button>;
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

      const BlockEditComponent = BlockEdit as React.ComponentType<any>;

      return (
        <Fragment>
          <BlockEditComponent {...props} />
          <InspectorControls>
            <PanelBody title="Gallery Layout" initialOpen={true}>
              <BaseControl label="Image Width" help="Choose how wide this image should appear">
                <ButtonGroup>
                  <Button
                    variant={columnSpan === "25" ? "primary" : "secondary"}
                    onClick={() => props.setAttributes({ columnSpan: "25" })}
                  >
                    25%
                  </Button>
                  <Button
                    variant={columnSpan === "50" ? "primary" : "secondary"}
                    onClick={() => props.setAttributes({ columnSpan: "50" })}
                  >
                    50%
                  </Button>
                  <Button
                    variant={columnSpan === "100" ? "primary" : "secondary"}
                    onClick={() => props.setAttributes({ columnSpan: "100" })}
                  >
                    100%
                  </Button>
                </ButtonGroup>
              </BaseControl>
            </PanelBody>
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

// ============================================================================
// STEP 5: CUSTOMIZE GALLERY BLOCK (OPTIONAL)
// ============================================================================
// Register a variation or modify the default gallery block
// This could add default settings or custom styling to the gallery container

// TODO: Decide if we need to modify the gallery block itself
// - Add custom classes to gallery container
// - Set default columns
// - Add additional gallery-level controls

// Example:
// wp.blocks.registerBlockVariation('core/gallery', {
//   name: 'parsnip-page-builder-gallery',
//   title: 'Page Builder Gallery',
//   attributes: {
//     className: 'parsnip-gallery',
//   },
//   isDefault: false,
// });

// ============================================================================
// NEXT STEPS:
// ============================================================================
// 1. Implement the width selector control (RadioControl or ButtonGroup)
// 2. Create proper CSS classes for the width options
// 3. Add CSS to make the layout work (Tailwind or custom CSS)
// 4. Test in editor - verify live updates work
// 5. Test on frontend - verify saved content matches editor
// 6. Consider adding more controls (alignment, spacing, etc.)
// ============================================================================
