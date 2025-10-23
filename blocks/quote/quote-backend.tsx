import "./filters";
declare const wp: any;
import { RichText } from "@wordpress/block-editor";
import { QuoteEditProps } from "./types";

export const QuoteEdit = ({ attributes, setAttributes }: QuoteEditProps) => {
  const blockProps = wp.blockEditor.useBlockProps({
    className:
      "parsnip-quote-block border border-gray-400 bg-gray-50 p-4 min-h-[80px] border border-black rounded-lg mx-4 my-12",
    style: { position: "relative" },
  });
  return (
    <blockquote {...blockProps}>
      <div className="w-full">
        <div className="group flex w-full">
          <RichText
            tagName="p"
            value={attributes.quote || ""}
            onChange={(value: string) => setAttributes({ quote: value })}
            placeholder="Enter quote here..."
            className="w-full! mb-2 text-xl italic border border-gray-300 rounded-lg focus:border-blue-500 focus:shadow px-1 py-4"
          />
        </div>

        <footer className="group flex flex-col gap-2 text-gray-700 text-sm">
          <div className="flex items-center gap-4 overflow-hidden max-h-9 h-full">
            <span className="bg-neutral-200 rounded-lg max-w-20 w-full max-h-9 h-full px-2 py-2">
              Reviewer:
            </span>
            <RichText
              tagName="span"
              value={attributes.reviewer || ""}
              onChange={(value: string) => setAttributes({ reviewer: value })}
              placeholder="Reviewer"
              className="rounded-lg max-h-9 h-full px-2 py-2 border border-gray-300 focus:border-blue-500 focus:shadow"
            />
          </div>

          <div className="group flex items-center gap-4 overflow-hidden max-h-9 h-full">
            <span className="bg-neutral-200 rounded-lg max-w-20 w-full max-h-9 h-full px-2 py-2">
              Year:
            </span>
            <RichText
              tagName="span"
              value={attributes.year || ""}
              onChange={(value: string) => setAttributes({ year: value })}
              placeholder="Year"
              className="rounded-lg max-h-9 h-full px-2 py-2 border border-gray-300 focus:border-blue-500 focus:shadow"
            />
          </div>
        </footer>
      </div>
    </blockquote>
  );
};
