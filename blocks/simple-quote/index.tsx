(() => {
  // Only register blocks in the editor/admin context
  if (typeof wp === "undefined" || !wp.blocks || !wp.blockEditor || typeof window === "undefined") {
    return;
  }

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
    },
    editorScript: "parsnip-simple-quote-editor",
  };

  // GUTENBERG EDITOR (wp-admin) - What you see when editing in WordPress admin
  const Edit = ({ attributes, setAttributes }: any) => {
    const { quote = "", credit = "" } = attributes;

    const blockProps = wp.blockEditor.useBlockProps({
      className: "p-4 border-l-4 border-dashed border-slate-300 bg-slate-50/50 rounded-r-md",
    });

    return (
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
    );
  };
  // FRONTEND (actual website) - What visitors see on your live site
  const Save = ({ attributes }: any) => {
    const { quote = "", credit = "" } = attributes;

    const blockProps = wp.blockEditor.useBlockProps.save({
      className:
        "parsnip-simple-quote p-6 border-l-4 border-slate-400 bg-slate-50 rounded-r-lg italic",
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

  const blockName = metadata.name as string;

  const settings = {
    ...metadata,
    edit: Edit,
    save: Save,
  };

  (wp.blocks as any).registerBlockType(blockName, settings);
})();
