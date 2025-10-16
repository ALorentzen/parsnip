import type { BlockConfiguration } from "@wordpress/blocks";
import metadata from "./block.json";

type Attributes = {
  headline: string;
  text: string;
  mediaID: number;
  mediaURL: string;
};

type EditProps = {
  attributes: Partial<Attributes>;
  setAttributes: (attrs: Partial<Attributes>) => void;
};

// GUTENBERG EDITOR (wp-admin) - What you see when editing in WordPress admin
const Edit = ({ attributes, setAttributes }: EditProps) => {
  const { headline = "", text = "", mediaID = 0, mediaURL = "" } = attributes;

  const wrapperProps = wp.blockEditor.useBlockProps({
    className:
      "relative w-full overflow-hidden bg-cover bg-center max-h-screen h-screen bg-green-500",
    style: mediaURL ? { backgroundImage: `url(${mediaURL})` } : undefined,
  });

  const onSelectMedia = (media: any) => {
    if (!media || !media.url) {
      setAttributes({ mediaID: 0, mediaURL: "" });
      return;
    }
    setAttributes({ mediaID: media.id ?? 0, mediaURL: media.url });
  };

  return (
    <section {...wrapperProps}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-x-0 bottom-0 p-8 text-white max-w-4xl pointer-events-none -translate-y-12">
        <wp.blockEditor.RichText
          tagName="h1"
          className="text-6xl md:text-8xl font-extrabold leading-none"
          value={headline}
          onChange={(value: string) => setAttributes({ headline: value })}
          placeholder={wp.i18n.__("Add a powerful headline…", "parsnip")}
          allowedFormats={[]}
        />
        <wp.blockEditor.RichText
          tagName="p"
          className="mt-6 text-xl md:text-2xl font-light"
          value={text}
          onChange={(value: string) => setAttributes({ text: value })}
          placeholder={wp.i18n.__("Add supporting copy…", "parsnip")}
        />
      </div>

      <div className="absolute top-4 right-4 pointer-events-auto">
        <wp.blockEditor.MediaUploadCheck>
          <wp.blockEditor.MediaUpload
            onSelect={onSelectMedia}
            allowedTypes={["image"]}
            value={mediaID}
            render={({ open }) => (
              <button
                type="button"
                onClick={open}
                className="bg-white/90 text-black px-4 py-2 text-sm font-semibold shadow rounded-md"
              >
                {mediaURL
                  ? wp.i18n.__("Replace background", "parsnip")
                  : wp.i18n.__("Select background", "parsnip")}
              </button>
            )}
          />
        </wp.blockEditor.MediaUploadCheck>
      </div>
    </section>
  );
};

// FRONTEND (actual website) - What visitors see on your live site
const Save = ({ attributes }: { attributes: Partial<Attributes> }) => {
  const { headline = "", text = "", mediaURL = "" } = attributes;

  const wrapperProps = wp.blockEditor.useBlockProps.save({
    className: "relative w-full overflow-hidden bg-cover bg-center max-h-screen h-screen",
    style: mediaURL ? { backgroundImage: `url(${mediaURL})` } : undefined,
  });

  return (
    <section {...wrapperProps}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-x-0 bottom-0 p-8 text-white max-w-4xl pointer-events-none -translate-y-0">
        <wp.blockEditor.RichText.Content
          tagName="h1"
          className="text-6xl md:text-8xl font-extrabold leading-none"
          value={headline}
        />
        <wp.blockEditor.RichText.Content
          tagName="p"
          className="mt-6 text-xl md:text-2xl font-light"
          value={text}
        />
      </div>
    </section>
  );
};

// Only register blocks in the editor/admin context
if (
  typeof wp !== "undefined" &&
  wp.blocks &&
  wp.blockEditor &&
  typeof window !== "undefined" &&
  window.location.href.includes("wp-admin")
) {
  const blockName = metadata.name as string;

  const settings = {
    ...metadata,
    edit: Edit, // ← Gutenberg editor component
    save: Save, // ← Frontend website component
  } as unknown as BlockConfiguration<Attributes>;

  wp.blocks.registerBlockType(blockName, settings);
}
