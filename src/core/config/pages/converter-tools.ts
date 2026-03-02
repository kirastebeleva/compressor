import type { PageConfig } from "@/core/types";
import {
  IMAGE_CONVERT_TOOL_DEFAULTS,
  RESULTS_DEFAULTS,
  AD_SLOT_DEFAULTS,
} from "@/core/config/defaults";

// ---------------------------------------------------------------------------
// Helper — builds the tool config for a fixed conversion pair
// ---------------------------------------------------------------------------

function pairTool(
  from: string,
  to: string,
  title: string,
  subtitle: string,
): PageConfig["tool"] {
  return {
    ...IMAGE_CONVERT_TOOL_DEFAULTS,
    conversionPair: { from, to },
    title,
    subtitle,
    outputNameSuffix: `-to-${to}`,
  };
}

// ---------------------------------------------------------------------------
// Rank 1 — /heic-to-jpg
// Most searched: millions of iPhone users needing universal compatibility.
// ---------------------------------------------------------------------------

export const heicToJpgPage: PageConfig = {
  slug: "heic-to-jpg",
  intent: "convert-heic-jpg",
  section: "converter-tools",
  navLabel: "HEIC to JPG",

  h1: "Convert HEIC to JPG",

  meta: {
    title: "HEIC to JPG Converter — Free Online",
    description:
      "Convert iPhone HEIC photos to JPG format. Free, browser-based, no upload. Works on Windows, Android, and any browser.",
  },

  hero: {
    subtitle:
      "Turn iPhone and iPad HEIC photos into universally compatible JPG files — right in your browser, without any app.",
    trustBadges: ["Free", "iPhone compatible", "Browser-based", "No upload"],
  },

  tool: pairTool(
    "heic",
    "jpg",
    "HEIC to JPG Converter",
    "Upload HEIC photos and download them as JPG files ready to share anywhere.",
  ),

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is HEIC format?",
        answer:
          "HEIC (High Efficiency Image Container) is Apple's default photo format since iOS 11. It delivers better compression than JPG while maintaining similar visual quality, but many apps and older software on Windows or Android don't support it natively.",
      },
      {
        question: "Will I lose quality converting HEIC to JPG?",
        answer:
          "There is a small quality reduction because both formats use lossy compression. The output quality is set to 92%, which preserves fine detail and is visually equivalent to the original for most use cases.",
      },
      {
        question: "Why can't I open HEIC files on Windows or Android?",
        answer:
          "HEIC is a proprietary Apple format. Windows 10/11 requires an optional codec from the Microsoft Store, and many apps simply don't support it yet. Converting to JPG ensures your photos open everywhere without installing anything extra.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/convert-image",
        label: "Convert Image",
        description: "Convert between any supported format pairs.",
      },
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "Reduce JPG file size after conversion.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Rank 2 — /webp-to-jpg
// High demand: WebP not supported by many apps, email clients, and editors.
// ---------------------------------------------------------------------------

export const webpToJpgPage: PageConfig = {
  slug: "webp-to-jpg",
  intent: "convert-webp-jpg",
  section: "converter-tools",
  navLabel: "WebP to JPG",

  h1: "Convert WebP to JPG",

  meta: {
    title: "WebP to JPG Converter — Free Online",
    description:
      "Convert WebP images to JPG for wider app and editor compatibility. Free, browser-based, no upload. Batch supported.",
  },

  hero: {
    subtitle:
      "Convert WebP images to JPG so they open in every app, editor, and email client without issues.",
    trustBadges: ["Free", "Browser-based", "No upload", "Batch"],
  },

  tool: pairTool(
    "webp",
    "jpg",
    "WebP to JPG Converter",
    "Upload WebP images and download universally compatible JPG files.",
  ),

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Why convert WebP to JPG?",
        answer:
          "While WebP is a modern, efficient format, many desktop apps, email clients, and older editing tools still don't support it. Converting to JPG ensures your images open and work everywhere without compatibility issues.",
      },
      {
        question: "Will the JPG file be larger than the WebP?",
        answer:
          "Usually yes. JPG typically produces larger files than WebP at the same visual quality. If file size matters, consider compressing the JPG after conversion using the Compress Image tool.",
      },
      {
        question: "Does converting WebP to JPG reduce quality?",
        answer:
          "Since both formats use lossy compression, re-encoding introduces a minor quality loss. The default quality is 92%, which is visually equivalent to the original for most images.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/jpg-to-webp",
        label: "JPG to WebP",
        description: "Convert back to WebP for web publishing.",
      },
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "Reduce JPG file size after conversion.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Rank 3 — /jpg-to-png
// Popular when transparency support or lossless editing is needed.
// ---------------------------------------------------------------------------

export const jpgToPngPage: PageConfig = {
  slug: "jpg-to-png",
  intent: "convert-jpg-png",
  section: "converter-tools",
  navLabel: "JPG to PNG",

  h1: "Convert JPG to PNG",

  meta: {
    title: "JPG to PNG Converter — Free Online",
    description:
      "Convert JPG images to lossless PNG format with transparency support. Free, browser-based, no upload required.",
  },

  hero: {
    subtitle:
      "Convert JPG photos to PNG format for lossless editing, transparency support, or web publishing.",
    trustBadges: ["Free", "Browser-based", "No upload", "Lossless output"],
  },

  tool: pairTool(
    "jpg",
    "png",
    "JPG to PNG Converter",
    "Upload JPG images and download lossless PNG files.",
  ),

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "When should I convert JPG to PNG?",
        answer:
          "Convert JPG to PNG when you need a lossless format for further editing, want to avoid quality degradation from multiple re-saves, or need to overlay the image on a colored background without visible compression artifacts.",
      },
      {
        question: "Will converting JPG to PNG add transparency?",
        answer:
          "No — the converted PNG will have an opaque background. JPG files don't contain alpha channel data, so there is no transparency to transfer. You would need to edit the PNG separately to add a transparent background.",
      },
      {
        question: "Will the PNG file be larger than the original JPG?",
        answer:
          "Yes. PNG uses lossless compression, so files are typically 2–5× larger than the equivalent JPG. If file size is a concern for web use, consider converting to WebP instead.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/png-to-jpg",
        label: "PNG to JPG",
        description: "Convert PNG back to a smaller JPG.",
      },
      {
        href: "/png-to-webp",
        label: "PNG to WebP",
        description: "Get a smaller file while keeping quality.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Rank 4 — /png-to-jpg
// Popular for reducing large PNG file sizes, especially screenshots and photos.
// ---------------------------------------------------------------------------

export const pngToJpgPage: PageConfig = {
  slug: "png-to-jpg",
  intent: "convert-png-jpg",
  section: "converter-tools",
  navLabel: "PNG to JPG",

  h1: "Convert PNG to JPG",

  meta: {
    title: "PNG to JPG Converter — Free Online",
    description:
      "Convert PNG images to JPG to reduce file size. Free, browser-based, no upload. Transparent areas are filled with white.",
  },

  hero: {
    subtitle:
      "Shrink large PNG files by converting to JPG — ideal for photos and complex images without transparency.",
    trustBadges: ["Free", "Browser-based", "No upload", "Batch"],
  },

  tool: pairTool(
    "png",
    "jpg",
    "PNG to JPG Converter",
    "Upload PNG images and download smaller JPG files.",
  ),

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Why convert PNG to JPG?",
        answer:
          "JPG files are typically much smaller than PNG for photographic content. If your PNG contains a photo or complex image without transparency, converting to JPG can significantly reduce file size, making it faster to share or upload.",
      },
      {
        question: "What happens to transparent areas when converting PNG to JPG?",
        answer:
          "JPG does not support transparency. Any transparent areas in your PNG will be filled with a solid white background in the output JPG file.",
      },
      {
        question: "How much smaller will the JPG be compared to the PNG?",
        answer:
          "For photographic images, JPG is typically 5–10× smaller than PNG. For images with flat colors, text, or sharp edges (like logos and screenshots), the size difference is smaller and PNG may actually produce sharper results.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/jpg-to-png",
        label: "JPG to PNG",
        description: "Convert JPG back to lossless PNG.",
      },
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "Reduce JPG file size even further.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Rank 5 — /jpg-to-webp
// Moderate: web developers converting images to modern WebP format.
// ---------------------------------------------------------------------------

export const jpgToWebpPage: PageConfig = {
  slug: "jpg-to-webp",
  intent: "convert-jpg-webp",
  section: "converter-tools",
  navLabel: "JPG to WebP",

  h1: "Convert JPG to WebP",

  meta: {
    title: "JPG to WebP Converter — Free Online",
    description:
      "Convert JPG images to WebP for smaller file sizes on the web. Free, browser-based, no upload required. Batch supported.",
  },

  hero: {
    subtitle:
      "Reduce image weight by converting JPG photos to modern WebP format — great for faster page loads.",
    trustBadges: ["Free", "Browser-based", "No upload", "Batch"],
  },

  tool: pairTool(
    "jpg",
    "webp",
    "JPG to WebP Converter",
    "Upload JPG images and download smaller WebP files ready for the web.",
  ),

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What are the benefits of WebP over JPG?",
        answer:
          "WebP typically produces files 25–35% smaller than JPG at equivalent visual quality. It is supported in all modern browsers (Chrome, Firefox, Safari, Edge) and is the recommended format for web images according to Google's Core Web Vitals guidelines.",
      },
      {
        question: "Is WebP supported everywhere?",
        answer:
          "WebP is supported in all modern browsers but not in Internet Explorer or some older desktop apps and email clients. If broad compatibility is required, stick with JPG. For web use, WebP is the better default choice.",
      },
      {
        question: "Will the converted WebP look the same as my JPG?",
        answer:
          "The visual quality is very close. The default output quality is 92%, which preserves image detail while achieving significant file size savings. For most images the difference is not noticeable to the naked eye.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/webp-to-jpg",
        label: "WebP to JPG",
        description: "Convert WebP back to a compatible JPG.",
      },
      {
        href: "/png-to-webp",
        label: "PNG to WebP",
        description: "Convert PNG images to WebP as well.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Rank 6 — /png-to-webp
// Moderate: web devs reducing PNG sizes for the web.
// ---------------------------------------------------------------------------

export const pngToWebpPage: PageConfig = {
  slug: "png-to-webp",
  intent: "convert-png-webp",
  section: "converter-tools",
  navLabel: "PNG to WebP",

  h1: "Convert PNG to WebP",

  meta: {
    title: "PNG to WebP Converter — Free Online",
    description:
      "Convert PNG images to WebP for smaller file sizes without visible quality loss. Free, browser-based, no upload.",
  },

  hero: {
    subtitle:
      "Convert PNG images to WebP files — ideal for reducing page load times and improving Core Web Vitals scores.",
    trustBadges: ["Free", "Browser-based", "No upload", "Batch"],
  },

  tool: pairTool(
    "png",
    "webp",
    "PNG to WebP Converter",
    "Upload PNG images and download smaller WebP files for the web.",
  ),

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "How much smaller will WebP be compared to PNG?",
        answer:
          "For images with solid colors and graphics, WebP (lossless mode) is typically 10–30% smaller than PNG. For photographic content stored as PNG, the savings can be even greater because WebP's lossy mode outperforms PNG's lossless compression significantly.",
      },
      {
        question: "Does WebP support transparency like PNG?",
        answer:
          "Yes. Both lossless and lossy WebP support an alpha channel for transparency. Your PNG's transparent areas will be preserved in the output WebP file.",
      },
      {
        question: "Should I use WebP instead of PNG for my website?",
        answer:
          "For web use, WebP is generally the better choice due to smaller file sizes and broad browser support. Keep PNG for cases where maximum compatibility with non-browser tools (design apps, print, email) is required.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/jpg-to-webp",
        label: "JPG to WebP",
        description: "Convert JPG images to WebP as well.",
      },
      {
        href: "/png-to-jpg",
        label: "PNG to JPG",
        description: "Convert PNG to smaller JPG when WebP is not needed.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Rank 7 — /png-to-avif
// Lower volume: newer format, adopted mainly by performance-focused developers.
// ---------------------------------------------------------------------------

export const pngToAvifPage: PageConfig = {
  slug: "png-to-avif",
  intent: "convert-png-avif",
  section: "converter-tools",
  navLabel: "PNG to AVIF",

  h1: "Convert PNG to AVIF",

  meta: {
    title: "PNG to AVIF Converter — Free Online",
    description:
      "Convert PNG images to AVIF for the best compression ratios available. Free, browser-based. Requires Chrome or Firefox.",
  },

  hero: {
    subtitle:
      "Convert PNG images to AVIF — the next-generation format with better compression than both WebP and JPG.",
    trustBadges: ["Free", "Browser-based", "No upload"],
  },

  tool: pairTool(
    "png",
    "avif",
    "PNG to AVIF Converter",
    "Upload PNG images and download highly compressed AVIF files.",
  ),

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is AVIF format?",
        answer:
          "AVIF (AV1 Image File Format) is a modern image format derived from the AV1 video codec. It offers significantly better compression than JPG, PNG, and WebP, with support for transparency, HDR content, and wide color gamut.",
      },
      {
        question: "Is AVIF supported by all browsers?",
        answer:
          "AVIF is supported in Chrome 85+, Firefox 93+, and Safari 16+. It is not supported in Internet Explorer or older browsers. For maximum compatibility, WebP is a safer choice. For cutting-edge performance, AVIF is the best option.",
      },
      {
        question: "Why is AVIF better than WebP or PNG?",
        answer:
          "AVIF typically achieves 50% smaller files than JPG and around 20% smaller than WebP at equivalent visual quality. It also supports lossless compression, transparency, and HDR. The trade-off is slower encoding and limited app support outside browsers.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/png-to-webp",
        label: "PNG to WebP",
        description: "A widely supported alternative to AVIF.",
      },
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "Reduce image file size without changing format.",
      },
    ],
  },
};
