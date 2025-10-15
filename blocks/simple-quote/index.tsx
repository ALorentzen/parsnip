import type { BlockConfiguration } from "@wordpress/blocks";
import metadata from "./block.json";

type Attributes = {
  content: string;
  cite: string;
};

type EditProps = {
  attributes: Partial<Attributes>;
  setAttributes: (attrs: Partial<Attributes>) => void;
};

const EDIT_WRAPPER_CLASSNAME =
  "parsnip-simple-quote parsnip-simple-quote--editor bg-neutral-100 border border-black px-4 py-2 rounded-lg shadow-lg";
const FRONT_WRAPPER_CLASSNAME =
  "parsnip-simple-quote bg-white/80 text-neutral-900 border-l-4 border-neutral-500/70 px-6 py-5 rounded-xl shadow-lg space-y-3";
const QUOTE_TEXT_CLASSNAME = "text-lg leading-relaxed italic font-thin";
const QUOTE_CITE_CLASSNAME = "block text-sm font-normal uppercase tracking-wide text-neutral-900";

const Edit = ({ attributes, setAttributes }: EditProps) => {
  const wrapperProps = wp.blockEditor.useBlockProps({
    className: EDIT_WRAPPER_CLASSNAME,
  });

  return (
    <blockquote {...wrapperProps}>
      <wp.blockEditor.RichText
        tagName="p"
        className={QUOTE_TEXT_CLASSNAME}
        value={attributes.content ?? ""}
        onChange={(content: string) => setAttributes({ content })}
        placeholder={wp.i18n.__("Write the quote…", "parsnip")}
        allowedFormats={[]}
      />
      <wp.blockEditor.RichText
        tagName="cite"
        className={QUOTE_CITE_CLASSNAME}
        value={attributes.cite ?? ""}
        onChange={(cite: string) => setAttributes({ cite })}
        placeholder={wp.i18n.__("Add who said it…", "parsnip")}
        allowedFormats={[]}
      />
    </blockquote>
  );
};

const Save = ({ attributes }: { attributes: Partial<Attributes> }) => {
  const wrapperProps = wp.blockEditor.useBlockProps.save({
    className: FRONT_WRAPPER_CLASSNAME,
  });

  const quoteRaw = (attributes.content ?? "").trim();
  const normalizedQuote = quoteRaw.replace(/^[\s"'“”]+|[\s"'“”]+$/g, "");
  const citation = attributes.cite ?? "";
  const renderedQuote = normalizedQuote !== "" ? `“${normalizedQuote}”` : "";

  return (
    <blockquote {...wrapperProps}>
      <wp.blockEditor.RichText.Content
        tagName="p"
        className={QUOTE_TEXT_CLASSNAME}
        value={renderedQuote}
      />
      {citation !== "" ? (
        <wp.blockEditor.RichText.Content
          tagName="cite"
          className={QUOTE_CITE_CLASSNAME}
          value={citation}
        />
      ) : null}
    </blockquote>
  );
};

const deprecated = [
  {
    attributes: metadata.attributes,
    save({ attributes }: { attributes: Partial<Attributes> }) {
      const wrapperProps = wp.blockEditor.useBlockProps.save({
        className: FRONT_WRAPPER_CLASSNAME,
      });
      const quote = attributes.content ?? "";
      const citation = attributes.cite ?? "";

      return (
        <blockquote {...wrapperProps}>
          <wp.blockEditor.RichText.Content
            tagName="p"
            className={QUOTE_TEXT_CLASSNAME}
            value={quote}
          />
          {citation !== "" ? (
            <wp.blockEditor.RichText.Content
              tagName="cite"
              className={QUOTE_CITE_CLASSNAME}
              value={citation}
            />
          ) : null}
        </blockquote>
      );
    },
  },
];

const blockName = metadata.name as string;

const settings = {
  ...metadata,
  edit: Edit,
  save: Save,
  deprecated,
} as unknown as BlockConfiguration<Attributes>;

wp.blocks.registerBlockType(blockName, settings);
