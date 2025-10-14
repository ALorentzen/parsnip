(function () {
  const { registerBlockType } = wp.blocks;
  const { RichText, MediaUpload, MediaUploadCheck, InspectorControls, useBlockProps } =
    wp.blockEditor || wp.editor;
  const { Button, PanelBody, ToggleControl } = wp.components;
  const { Fragment, createElement: el } = wp.element;

  const baseClassName = "wp-block-parsnip-hero";
  const editorWrapperClasses =
    "relative w-[840px] max-w-full h-[480px] max-h-[480px] text-white overflow-hidden flex items-center justify-center transition-colors duration-300";
  const frontWrapperClasses =
    "relative w-full min-h-screen text-white overflow-hidden flex items-center justify-center transition-colors duration-300";
  const contentWrapperClasses =
    "relative z-10 px-6 lg:px-12 py-16 lg:py-20 max-w-5xl mx-auto text-center lg:text-left w-full";

  const legacyContainerClasses =
    "relative w-full h-screen w-full text-white overflow-hidden flex items-center justify-center transition-colors duration-300";
  const legacyContentWrapperClasses =
    "absolute bottom-0 left-0 z-10 px-6 lg:px-12 py-16 lg:py-20 max-w-5xl mx-auto text-center lg:text-left";
  const legacyFixedContainerClasses =
    "fixed w-full min-h-fit h-[100dvh] lg:h-full overflow-y-scroll no-scrollbar text-white p-0 relative";
  const legacyFixedContentWrapperClasses =
    "relative lg:absolute lg:bottom-12 -translate-y-40 lg:-translate-y-20 px-4 lg:translate-x-12 lg:py-12 max-w-5xl mx-auto text-center lg:text-left";

  registerBlockType("parsnip/hero", {
    edit: function ({ attributes, setAttributes }) {
      const { title, content, mediaID, mediaURL, overlay } = attributes;

      const hasImage = !!mediaURL;
      const blockProps = useBlockProps({
        className: baseClassName,
      });

      blockProps.className =
        baseClassName +
        " " +
        editorWrapperClasses +
        (hasImage ? " bg-cover bg-center" : " bg-neutral-900/90 backdrop-blur-sm");

      blockProps.style = hasImage
        ? {
            backgroundImage: "url(" + mediaURL + ")",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }
        : undefined;

      return el(
        Fragment,
        null,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: "Background", initialOpen: true },
            el(
              MediaUploadCheck,
              null,
              el(MediaUpload, {
                onSelect: function (media) {
                  setAttributes({
                    mediaID: media && media.id ? media.id : 0,
                    mediaURL: media && media.url ? media.url : "",
                  });
                },
                value: mediaID,
                allowedTypes: ["image"],
                render: function ({ open }) {
                  return el(
                    Button,
                    {
                      variant: mediaURL ? "secondary" : "primary",
                      onClick: open,
                    },
                    mediaURL ? "Replace background image" : "Select background image",
                  );
                },
              }),
            ),
            mediaURL
              ? el(
                  Button,
                  {
                    onClick: function () {
                      setAttributes({ mediaID: 0, mediaURL: "" });
                    },
                    variant: "link",
                    isDestructive: true,
                    className: "mt-2",
                  },
                  "Remove image",
                )
              : null,
            el(ToggleControl, {
              label: "Dark overlay",
              checked: overlay,
              onChange: function (value) {
                setAttributes({ overlay: !!value });
              },
            }),
          ),
        ),
        el(
          "section",
          blockProps,
          overlay && el("div", { className: "absolute inset-0 bg-black/40" }),
          el(
            "div",
            { className: contentWrapperClasses },
            el(RichText, {
              tagName: "h1",
              className: "text-5xl lg:text-7xl font-bold tracking-tight",
              placeholder: "Add hero title…",
              value: title,
              onChange: function (value) {
                setAttributes({ title: value });
              },
              allowedFormats: [],
            }),
            el(RichText, {
              tagName: "div",
              className: "mt-4 prose prose-invert max-w-3xl mx-auto lg:mx-0",
              placeholder: "Add supporting copy…",
              value: content,
              onChange: function (value) {
                setAttributes({ content: value });
              },
            }),
          ),
        ),
      );
    },
    save: function ({ attributes }) {
      const { title, content, mediaURL, overlay } = attributes;
      const hasImage = !!mediaURL;

      const blockProps = useBlockProps.save({
        className: baseClassName,
      });

      blockProps.className =
        baseClassName +
        " " +
        frontWrapperClasses +
        (hasImage ? " bg-cover bg-center" : " bg-neutral-900/90 backdrop-blur-sm");

      blockProps.style = hasImage
        ? {
            backgroundImage: "url(" + mediaURL + ")",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }
        : undefined;

      return el(
        "section",
        blockProps,
        overlay && el("div", { className: "absolute inset-0 bg-black/40" }),
        el(
          "div",
          { className: contentWrapperClasses },
          el(RichText.Content, {
            tagName: "h1",
            className: "text-5xl lg:text-7xl font-bold tracking-tight",
            value: title || "",
          }),
          content
            ? el(RichText.Content, {
                tagName: "div",
                className: "mt-4 prose prose-invert max-w-3xl mx-auto lg:mx-0",
                value: content,
              })
            : null,
        ),
      );
    },
    deprecated: [
      {
        attributes: {
          title: { type: "string", default: "" },
          content: { type: "string", default: "" },
          mediaID: { type: "number", default: 0 },
          mediaURL: { type: "string", default: "" },
          overlay: { type: "boolean", default: true },
        },
        save: function ({ attributes }) {
          const { title, content, mediaURL, overlay } = attributes;
          const hasImage = !!mediaURL;

          const blockProps = useBlockProps.save({
            className:
              legacyContainerClasses +
              (hasImage ? " bg-cover bg-center" : " bg-neutral-900/90 backdrop-blur-sm"),
            style: hasImage
              ? {
                  backgroundImage: "url(" + mediaURL + ")",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined,
          });

          return el(
            "section",
            blockProps,
            overlay && el("div", { className: "absolute inset-0 bg-black/40" }),
            el(
              "div",
              { className: legacyContentWrapperClasses },
              el(RichText.Content, {
                tagName: "h1",
                className: "text-5xl lg:text-9xl font-bold tracking-tight",
                value: title || "",
              }),
              content
                ? el(RichText.Content, {
                    tagName: "div",
                    className: "mt-4 prose prose-invert max-w-3xl mx-auto lg:mx-0",
                    value: content,
                  })
                : null,
            ),
          );
        },
      },
      {
        attributes: {
          title: { type: "string", default: "" },
          content: { type: "string", default: "" },
          mediaID: { type: "number", default: 0 },
          mediaURL: { type: "string", default: "" },
          overlay: { type: "boolean", default: true },
        },
        save: function ({ attributes }) {
          const { title, content, mediaURL, overlay } = attributes;
          const hasImage = !!mediaURL;

          const blockProps = useBlockProps.save({
            className: legacyFixedContainerClasses,
          });

          const backgroundElements = [];
          if (hasImage) {
            backgroundElements.push(
              el("div", {
                key: "background",
                className: "relative lg:inset-0 bg-cover bg-center h-full w-full",
                style: { backgroundImage: "url(" + mediaURL + ")" },
              }),
            );
            if (overlay) {
              backgroundElements.push(
                el("div", {
                  key: "overlay",
                  className: "relative lg:absolute lg:inset-0 bg-black/40",
                }),
              );
            }
          }

          return el(
            "section",
            blockProps,
            backgroundElements,
            el(
              "div",
              { className: legacyFixedContentWrapperClasses },
              el(RichText.Content, {
                tagName: "h1",
                className: "text-6xl lg:text-9xl font-bold",
                value: title || "",
              }),
              content
                ? el(RichText.Content, {
                    tagName: "div",
                    className: "mt-4 prose prose-invert",
                    value: content,
                  })
                : null,
            ),
          );
        },
      },
    ],
  });
})();
