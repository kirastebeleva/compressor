import type { PageConfig } from "@/core/types";
import {
  IMAGE_COMPRESS_TOOL_DEFAULTS,
  RESULTS_DEFAULTS,
  AD_SLOT_DEFAULTS,
} from "@/core/config/defaults";

export const compressJpgPage: PageConfig = {
  slug: "compress-jpg",
  intent: "format-jpg",
  section: "image-tools",
  navLabel: "Compress JPG",
  h1: "Compress JPG Files Online",
  meta: {
    title: "Compress JPG Online - Free Browser Tool",
    description: "Make JPG images smaller without visible quality loss. Browser-based compression with no server uploads.",
  },
  hero: {
    subtitle: "Drop your JPG and get a lighter file in seconds — all processing happens in your browser.",
    trustBadges: ["Free", "JPG focus", "No server upload", "Instant download"],
  },
  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
    title: "JPG Compressor",
    subtitle: "Upload a JPG image and pick a preset to compress it.",
  },
  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,
  seoContent: {
    blocks: [
      {
        id: "when-to-compress-jpg",
        title: "When to compress JPG",
        paragraphs: [
          "JPG is the most common image format on the web. Compressing JPG files helps with faster page loads, smaller email attachments, and lower storage usage.",
          "Whether you are publishing a blog post or attaching a file to an email, a compressed JPG downloads and opens faster for every recipient.",
        ],
      },
      {
        id: "how-jpg-compression-works",
        title: "How JPG compression works here",
        paragraphs: [
          "This tool re-encodes your JPG with efficient quality settings chosen by the preset. Original dimensions stay the same.",
          "Fast applies light compression, Balanced is the everyday pick, and Max pushes the file size as low as possible.",
        ],
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      { question: "Does compressing a JPG lower its quality?", answer: "The tool applies efficient encoding to cut file size while keeping visual quality close to the original. Results vary by preset." },
      { question: "Can I compress multiple JPG files at once?", answer: "Currently the tool processes one file at a time. Batch JPG compression is on the roadmap." },
      { question: "Is my JPG file sent to a remote server?", answer: "No. The file stays on your device and is processed entirely in your browser." },
    ],
  },
};

export const compressPngPage: PageConfig = {
  slug: "compress-png",
  intent: "format-png",
  section: "image-tools",
  navLabel: "Compress PNG",
  h1: "Compress PNG Images Online",
  meta: {
    title: "Compress PNG Online - Free Browser Tool",
    description: "Reduce PNG file size while keeping transparency intact. Runs locally in your browser — no file uploads.",
  },
  hero: {
    subtitle: "Lighter PNG files with transparency preserved — processed right on your device.",
    trustBadges: ["Free", "Keeps transparency", "Browser-only", "No signup"],
  },
  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
    title: "PNG Compressor",
    subtitle: "Upload a PNG image and compress it without losing transparency.",
  },
  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,
  seoContent: {
    blocks: [
      {
        id: "why-compress-png",
        title: "Why compress PNG files",
        paragraphs: [
          "PNG is ideal for graphics, screenshots, and images with transparency. However, PNGs can be surprisingly large.",
          "Compression cuts storage and bandwidth costs without converting to another format or removing the alpha channel.",
        ],
      },
      {
        id: "png-compression-tips",
        title: "Tips for better PNG compression",
        paragraphs: [
          "Choose the Max preset for the strongest size reduction. For screenshots and flat graphics the savings are often 40–70%.",
          "Photographs stored as PNG may benefit more from converting to JPG first, then compressing.",
        ],
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      { question: "Will PNG transparency be preserved?", answer: "Yes. The compressor maintains the alpha channel so transparent areas remain intact." },
      { question: "How much smaller will my PNG get?", answer: "Results depend on image content and preset choice. Graphics with solid colors typically compress more than complex photos." },
      { question: "Do I need to install anything?", answer: "No installation required. The tool runs directly in your web browser on any operating system." },
    ],
  },
};

export const compressWebpPage: PageConfig = {
  slug: "compress-webp",
  intent: "format-webp",
  section: "image-tools",
  navLabel: "Compress WebP",
  h1: "Compress WebP Images Online",
  meta: {
    title: "Compress WebP Online - Free Browser Tool",
    description: "Make WebP images even smaller with browser-based compression. No server upload, no account needed.",
  },
  hero: {
    subtitle: "WebP already saves space — this tool pushes it further without leaving your browser.",
    trustBadges: ["Free", "WebP support", "100% local", "Fast"],
  },
  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
    title: "WebP Compressor",
    subtitle: "Upload a WebP image and compress it to a smaller file.",
  },
  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,
  seoContent: {
    blocks: [
      {
        id: "when-webp-compression-helps",
        title: "When further WebP compression helps",
        paragraphs: [
          "WebP is a modern format built for the web. Still, camera exports and design tools sometimes produce WebP files larger than necessary.",
          "A quick compression pass can shave additional kilobytes without a visible difference.",
        ],
      },
      {
        id: "webp-presets",
        title: "WebP quality presets explained",
        paragraphs: [
          "Fast applies light compression for speed. Balanced offers a middle ground suitable for most images.",
          "Max pushes the file size lower at the cost of slightly more processing time on your device.",
        ],
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      { question: "Isn't WebP already compressed?", answer: "WebP files are efficient but can still be reduced further with adjusted quality settings, especially for high-resolution images." },
      { question: "Will the compressed file stay in WebP format?", answer: "Yes. The output format matches the input — your WebP stays WebP." },
      { question: "Is there a file size limit?", answer: "You can upload WebP images up to 10 MB per file." },
    ],
  },
};

export const compressJpegPage: PageConfig = {
  slug: "compress-jpeg",
  intent: "format-jpeg",
  section: "image-tools",
  navLabel: "Compress JPEG",
  h1: "Compress JPEG Files Online",
  meta: {
    title: "Compress JPEG Online - Free Tool",
    description: "Compress JPEG images quickly in your browser. Private, free, and no software to install.",
    canonical: "/compress-jpg",
  },
  hero: {
    subtitle: "Select a JPEG file and pick your compression strength — done in seconds, entirely on your device.",
    trustBadges: ["Free", "Private", "No install", "Browser-based"],
  },
  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
    title: "JPEG Compressor",
    subtitle: "Upload a JPEG file and choose a preset for fast compression.",
  },
  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,
  seoContent: {
    blocks: [
      {
        id: "jpeg-technical",
        title: "JPEG technical background",
        paragraphs: [
          "JPEG (Joint Photographic Experts Group) uses lossy DCT-based encoding. Each compression pass removes high-frequency detail that is hard for the human eye to perceive.",
          "Camera manufacturers and imaging software default to JPEG because it balances quality and file size well for continuous-tone photographs.",
        ],
      },
      {
        id: "camera-jpeg-workflow",
        title: "Camera export and JPEG workflow",
        paragraphs: [
          "DSLR and mirrorless cameras often save files as .jpeg rather than .jpg. The files are identical but some workflows specifically search for the .jpeg extension.",
          "Compressing camera JPEG exports before sharing preserves the full-resolution frame while dramatically cutting the file size for email, cloud storage, or web galleries.",
        ],
      },
      {
        id: "choosing-preset-jpeg",
        title: "Choosing the right preset for JPEG",
        paragraphs: [
          "Fast applies light compression for a quick result. Balanced is the default and works well for most photographs.",
          "Max gives the smallest file but may introduce slight artifacts on images with fine detail or text overlays.",
        ],
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      { question: "What is the difference between JPEG and JPG?", answer: "They are the same format. JPEG is the original full name; JPG is the shortened extension from early Windows 3-character limits. This page targets users who search for the JPEG spelling." },
      { question: "Should I use this page or the Compress JPG page?", answer: "Both compress the exact same format. Use whichever you found first — the tool is identical." },
      { question: "Can I set a target file size for JPEG?", answer: "The current tool uses quality presets rather than an exact target size. For strict limits try the Under 500 KB or Under 1 MB tools." },
      { question: "Are my JPEG images stored anywhere?", answer: "No. Everything runs locally in your browser. Files are never sent to or stored on a remote server." },
    ],
  },
};

export const pages: PageConfig[] = [
  compressJpgPage,
  compressPngPage,
  compressWebpPage,
  compressJpegPage,
];
