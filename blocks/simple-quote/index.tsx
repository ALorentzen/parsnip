import type { BlockConfiguration } from "@wordpress/blocks";

const metadata = {
  apiVersion: 3,
  name: "parsnip/simple-quote",
  title: "Simple Quote",
  category: "text",
  icon: "format-quote",
  supports: {
    html: false,
    color: {
      background: true,
      text: true,
      gradients: true,
    },
  },
  attributes: {
    quote: { type: "string", source: "html", selector: "p" },
    credit: { type: "string", source: "html", selector: "cite" },
    placement: { type: "string", default: "center" },
    width: { type: "string", default: "max-content" },
  },
};

type Attributes = {
  quote: string;
  credit: string;
  placement: string;
  width: string;
};

type EditProps = {
  attributes: Partial<Attributes>;
  setAttributes: (attrs: Partial<Attributes>) => void;
};

// GUTENBERG EDITOR (wp-admin) - What you see when editing in WordPress admin
const Edit = ({ attributes, setAttributes }: EditProps) => {
  const { quote = "", credit = "", placement = "center", width = "max-content" } = attributes;

  const getPlacementClass = (placementValue: string) => {
    switch (placementValue) {
      case "left":
        return "mr-auto";
      case "center":
        return "mx-auto";
      case "right":
        return "ml-auto";
      default:
        return "mx-auto";
    }
  };

  const getWidthClass = (widthValue: string) => {
    switch (widthValue) {
      case "100%":
        return "w-full";
      case "max-content":
        return "max-w-2xl";
      case "fitted":
        return "w-fit";
      default:
        return "max-w-2xl";
    }
  };

  const blockProps = wp.blockEditor.useBlockProps({
    className: `p-6 rounded-lg shadow-lg ${getWidthClass(width)} ${getPlacementClass(placement)}`,
  });

  return (
    <>
      <wp.blockEditor.InspectorControls>
        <div className="components-panel__body">
          <h3>Quote Settings</h3>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              Placement
            </label>
            <select
              value={placement}
              onChange={(e) => setAttributes({ placement: e.target.value })}
              style={{
                width: "100%",
                padding: "6px",
                border: "1px solid #ccd0d4",
                borderRadius: "2px",
              }}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              Width
            </label>
            <select
              value={width}
              onChange={(e) => setAttributes({ width: e.target.value })}
              style={{
                width: "100%",
                padding: "6px",
                border: "1px solid #ccd0d4",
                borderRadius: "2px",
              }}
            >
              <option value="100%">100%</option>
              <option value="max-content">Max Content</option>
              <option value="fitted">Fitted</option>
            </select>
          </div>
        </div>
      </wp.blockEditor.InspectorControls>

      <div {...blockProps}>
        <wp.blockEditor.RichText
          tagName="p"
          value={quote}
          onChange={(value: string) => setAttributes({ quote: value })}
          placeholder={wp.i18n.__("Add a quote…", "parsnip")}
        />
        <wp.blockEditor.RichText
          tagName="cite"
          value={credit}
          onChange={(value: string) => setAttributes({ credit: value })}
          placeholder={wp.i18n.__("Who said it?", "parsnip")}
        />
      </div>
    </>
  );
};

// FRONTEND (actual website) - What visitors see on your live site
const Save = ({ attributes }: { attributes: Partial<Attributes> }) => {
  const { quote = "", credit = "", placement = "center", width = "max-content" } = attributes;

  const getPlacementClass = (placementValue: string) => {
    switch (placementValue) {
      case "left":
        return "mr-auto";
      case "center":
        return "mx-auto";
      case "right":
        return "ml-auto";
      default:
        return "mx-auto";
    }
  };

  const getWidthClass = (widthValue: string) => {
    switch (widthValue) {
      case "100%":
        return "w-full";
      case "max-content":
        return "max-w-2xl";
      case "fitted":
        return "w-fit";
      default:
        return "max-w-2xl";
    }
  };

  const blockProps = wp.blockEditor.useBlockProps.save({
    className: `parsnip-simple-quote p-6 rounded-lg italic shadow-lg ${getWidthClass(width)} ${getPlacementClass(placement)}`,
  });

  return (
    <div {...blockProps}>
      <wp.blockEditor.RichText.Content tagName="p" value={quote} />
      <wp.blockEditor.RichText.Content
        tagName="cite"
        className="text-sm opacity-70 not-italic"
        value={credit}
      />
    </div>
  );
};

// Register the block
if (typeof wp !== "undefined" && wp.blocks && wp.blockEditor) {
  const blockName = metadata.name as string;

  const settings = {
    ...metadata,
    edit: Edit,
    save: Save,
  } as unknown as BlockConfiguration<Attributes>;

  wp.blocks.registerBlockType(blockName, settings);
}
