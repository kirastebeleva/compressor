import type { ReactElement, ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function iconWrap(children: ReactNode, props: IconProps) {
  const { className, ...rest } = props;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Image area with arrows pointing inward = reduce file size. */
export function HomeHubIconCompress(props: IconProps) {
  return iconWrap(
    <>
      <rect x="9" y="9" width="6" height="6" rx="1.5" />
      <path d="M2 12h3M19 12h3" />
      <path d="M5 12l-2-2M5 12l-2 2" />
      <path d="M19 12l2-2M19 12l2 2" />
    </>,
    props,
  );
}

export function HomeHubIconResize(props: IconProps) {
  return iconWrap(
    <>
      <path d="M15 3h4v4M9 21H5v-4M21 9l-6 6M3 15l6-6" />
      <rect x="7" y="7" width="10" height="10" rx="1" />
    </>,
    props,
  );
}

export function HomeHubIconCrop(props: IconProps) {
  return iconWrap(
    <>
      <path d="M6 3v15a2 2 0 002 2h15" />
      <path d="M9 9h12v12" />
    </>,
    props,
  );
}

export function HomeHubIconRotate(props: IconProps) {
  return iconWrap(
    <>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 3v6h-6" />
    </>,
    props,
  );
}

export function HomeHubIconFlip(props: IconProps) {
  return iconWrap(
    <>
      <path d="M12 4v16" />
      <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" />
    </>,
    props,
  );
}

export function HomeHubIconWatermark(props: IconProps) {
  return iconWrap(
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 15h6M7 12h10" />
      <circle cx="17" cy="9" r="2" />
    </>,
    props,
  );
}

export function HomeHubIconConvertMulti(props: IconProps) {
  return iconWrap(
    <>
      <rect x="3" y="5" width="8" height="10" rx="1" />
      <rect x="13" y="5" width="8" height="10" rx="1" />
      <path d="M11 12h2M11 10h2" />
    </>,
    props,
  );
}

export function HomeHubIconConvertArrow(props: IconProps) {
  return iconWrap(
    <>
      <rect x="3" y="6" width="8" height="12" rx="1" />
      <rect x="13" y="6" width="8" height="12" rx="1" />
      <path d="M11 12h2M14 10l2 2-2 2" />
    </>,
    props,
  );
}

/** Stacked rows = many files in one run. */
export function HomeHubIconBatch(props: IconProps) {
  return iconWrap(
    <>
      <circle cx="5.5" cy="6.5" r="1" />
      <circle cx="5.5" cy="12.5" r="1" />
      <circle cx="5.5" cy="18.5" r="1" />
      <rect x="8" y="4" width="13" height="5" rx="1" />
      <rect x="8" y="10" width="13" height="5" rx="1" />
      <rect x="8" y="16" width="13" height="5" rx="1" />
    </>,
    props,
  );
}

const SLUG_ICON_KEYS = {
  "compress-image": "compress",
  "compress-image-batch": "batch",
  "resize-image": "resize",
  "crop-image": "crop",
  "rotate-image": "rotate",
  "flip-image": "flip",
  "watermark-image": "watermark",
  "convert-image": "convertMulti",
  "convert-pdf": "convertArrow",
  "heic-to-jpg": "convertArrow",
  "webp-to-jpg": "convertArrow",
  "jpg-to-png": "convertArrow",
  "png-to-jpg": "convertArrow",
  "jpg-to-webp": "convertArrow",
  "png-to-webp": "convertArrow",
  "png-to-avif": "convertArrow",
} as const;

type IconKey = (typeof SLUG_ICON_KEYS)[keyof typeof SLUG_ICON_KEYS];

const RENDERERS: Record<IconKey, (p: IconProps) => ReactElement> = {
  compress: (p) => <HomeHubIconCompress {...p} />,
  batch: (p) => <HomeHubIconBatch {...p} />,
  resize: (p) => <HomeHubIconResize {...p} />,
  crop: (p) => <HomeHubIconCrop {...p} />,
  rotate: (p) => <HomeHubIconRotate {...p} />,
  flip: (p) => <HomeHubIconFlip {...p} />,
  watermark: (p) => <HomeHubIconWatermark {...p} />,
  convertMulti: (p) => <HomeHubIconConvertMulti {...p} />,
  convertArrow: (p) => <HomeHubIconConvertArrow {...p} />,
};

export function HomeHubToolIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const iconKey: IconKey =
    slug in SLUG_ICON_KEYS
      ? SLUG_ICON_KEYS[slug as keyof typeof SLUG_ICON_KEYS]
      : "compress";
  const Icon = RENDERERS[iconKey];
  return <Icon className={className} />;
}
