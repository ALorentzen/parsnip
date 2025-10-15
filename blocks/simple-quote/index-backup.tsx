import type { BlockConfiguration } from "@wordpress/blocks";
import metadata from "./block.json";

type Attributes = {
  quote: string;
  credit: string;
  year: string;
};

type EditProps = {
  attributes: Partial<Attributes>;
  setAttributes: (next: Partial<Attributes>) => void;
};

const BLOCK_CLASS = "parsnip-simple-quote";
const BLOCK_SURFACE_CLASSES =
  "bg-white/80 text-neutral-900 border-l-4 border-neutral-500/70 px-6 py-5 rounded-xl shadow-lg space-y-4";
const QUOTE_CLASS = `${BLOCK_CLASS}__quote`;
const QUOTE_TEXT_CLASS = `${BLOCK_CLASS}__text`;
const QUOTE_TEXT_STYLES = "text-lg leading-relaxed italic font-thin";
const META_CLASS = `${BLOCK_CLASS}__meta`;
const META_LAYOUT_CLASSES = "flex flex-wrap items-baseline gap-3 text-sm uppercase tracking-wide";
const CREDIT_CLASS = `${BLOCK_CLASS}__credit`;
const CREDIT_STYLES = "font-semibold";
const YEAR_CLASS = `${BLOCK_CLASS}__year`;
const YEAR_STYLES = "text-neutral-600";

const Edit = ({ attributes, setAttributes }: EditProps) => {
  const { quote = "", credit = "", year = "" } = attributes;
  const blockProps = wp.blockEditor.useBlockProps({
    className: `${BLOCK_CLASS} ${BLOCK_SURFACE_CLASSES}`,
  });

  return (
    <figure {...blockProps}>
      <blockquote className={QUOTE_CLASS}>
        <wp.blockEditor.RichText
          tagName="p"
          className={`${QUOTE_TEXT_CLASS} ${QUOTE_TEXT_STYLES}`}
          value={quote}
          onChange={(next: string) => setAttributes({ quote: next })}
          placeholder={wp.i18n.__("Add a memorable quote…", "parsnip")}
          allowedFormats={["core/italic", "core/bold", "core/link"]}
        />
      </blockquote>
      <figcaption className={`${META_CLASS} ${META_LAYOUT_CLASSES}`}>
        <wp.blockEditor.RichText
          tagName="cite"
          className={`${CREDIT_CLASS} ${CREDIT_STYLES}`}
          value={credit}
          onChange={(next: string) => setAttributes({ credit: next })}
          placeholder={wp.i18n.__("Who said it?", "parsnip")}
          allowedFormats={["core/bold", "core/link"]}
        />
        <wp.blockEditor.RichText
          tagName="span"
          className={`${YEAR_CLASS} ${YEAR_STYLES}`}
          value={year}
          onChange={(next: string) => setAttributes({ year: next })}
          placeholder={wp.i18n.__("Year", "parsnip")}
          allowedFormats={[]}
        />
      </figcaption>
    </figure>
  );
};

const Save = ({ attributes }: { attributes: Partial<Attributes> }) => {
  const { quote = "", credit = "", year = "" } = attributes;
  const blockProps = wp.blockEditor.useBlockProps.save({
    className: `${BLOCK_CLASS} ${BLOCK_SURFACE_CLASSES}`,
  });
  const hasMeta = credit.trim() !== "" || year.trim() !== "";

  return (
    <figure {...blockProps}>
      <blockquote className={QUOTE_CLASS}>
        <wp.blockEditor.RichText.Content
          tagName="p"
          className={`${QUOTE_TEXT_CLASS} ${QUOTE_TEXT_STYLES}`}
          value={quote}
        />
      </blockquote>
      {hasMeta && (
        <figcaption className={`${META_CLASS} ${META_LAYOUT_CLASSES}`}>
          {credit.trim() !== "" && (
            <wp.blockEditor.RichText.Content
              tagName="cite"
              className={`${CREDIT_CLASS} ${CREDIT_STYLES}`}
              value={credit}
            />
          )}
          {year.trim() !== "" && (
            <wp.blockEditor.RichText.Content
              tagName="span"
              className={`${YEAR_CLASS} ${YEAR_STYLES}`}
              value={year}
            />
          )}
        </figcaption>
      )}
    </figure>
  );
};

const blockName = metadata.name as string;

const settings = {
  ...metadata,
  edit: Edit,
  save: Save,
} as unknown as BlockConfiguration<Attributes>;

wp.blocks.registerBlockType(blockName, settings);
