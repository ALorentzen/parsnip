import type { BlockConfiguration } from "@wordpress/blocks";
import metadata from "./block.json";
import { wpReady } from "../../assets/js/wp-ready";

type Attributes = { content: string; cite: string };

wpReady((wp) => {
  const { createElement: h } = wp.element;

  const Edit = ({
    attributes,
    setAttributes,
  }: {
    attributes: Partial<Attributes>;
    setAttributes: (a: Partial<Attributes>) => void;
  }) =>
    h(
      "blockquote",
      wp.blockEditor.useBlockProps({ className: "parsnip-simple-quote" }),
      h(wp.blockEditor.RichText, {
        tagName: "p",
        value: attributes.content ?? "",
        onChange: (v: string) => setAttributes({ content: v }),
        placeholder: wp.i18n.__("Quote…", "parsnip"),
      }),
      h(wp.blockEditor.RichText, {
        tagName: "cite",
        value: attributes.cite ?? "",
        onChange: (v: string) => setAttributes({ cite: v }),
        placeholder: wp.i18n.__("Citation…", "parsnip"),
      }),
    );

  const Save = ({ attributes }: { attributes: Partial<Attributes> }) =>
    h(
      "blockquote",
      wp.blockEditor.useBlockProps.save({ className: "parsnip-simple-quote" }),
      h(wp.blockEditor.RichText.Content, { tagName: "p", value: attributes.content ?? "" }),
      (attributes.cite ?? "") &&
        h(wp.blockEditor.RichText.Content, { tagName: "cite", value: attributes.cite ?? "" }),
    );

  wp.blocks.registerBlockType(metadata.name, {
    ...(metadata as any),
    edit: Edit,
    save: Save,
  } as unknown as BlockConfiguration<Attributes>);
});
