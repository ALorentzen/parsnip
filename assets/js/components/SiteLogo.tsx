type Props = {
  className?: string;
  title?: string;
  decorative?: boolean;
};

export default function SiteLogo({
  className = "h-12 w-auto text-white",
  title = "Parsnip",
  decorative = false,
}: Props) {
  const aria = decorative
    ? { "aria-hidden": true as const }
    : { role: "img" as const, "aria-label": title };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="currentColor"
      stroke="none"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      className={className}
      {...aria}
    >
      {!decorative && <title>{title}</title>}

      <path d="M32 8v6" />
      <path d="M32 8c4-3 9-3 12 0-3 1.8-6 3.8-8.5 5" />
      <path d="M32 8c-4-3-9-3-12 0 3 1.8 6 3.8 8.5 5" />
      <path d="M32 14 C44 14 49 19 47 28 C45 40 36 50 32 56 C28 50 19 40 17 28 C15 19 20 14 32 14 Z" />
      <line x1="28" y1="31" x2="36" y2="31" />
      <line x1="26" y1="36" x2="38" y2="36" />
      <line x1="28" y1="41" x2="36" y2="41" />
    </svg>
  );
}
