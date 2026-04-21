import type { PageConfig } from "@/core/types";
import {
  PDF_COMPRESS_TOOL_DEFAULTS,
  PDF_MERGE_TOOL_DEFAULTS,
  PDF_CONVERT_TOOL_DEFAULTS,
  RESULTS_DEFAULTS,
  AD_SLOT_DEFAULTS,
} from "@/core/config/defaults";

// ---------------------------------------------------------------------------
// /compress-pdf
// ---------------------------------------------------------------------------

export const compressPdfPage: PageConfig = {
  slug: "compress-pdf",
  intent: "pdf-compress",
  section: "pdf-tools",
  navLabel: "Compress PDF",

  h1: "Compress PDF Online",

  meta: {
    title: "Compress PDF for Email Attachments Online (Free Fast)",
    description:
      "Reduce PDF file size directly in your browser. No upload to server required.",
  },

  hero: {
    subtitle: "Make PDF files smaller for email and sharing.",
    trustBadges: ["Free", "No signup", "Browser-based"],
  },

  tool: {
    ...PDF_COMPRESS_TOOL_DEFAULTS,
    title: "PDF Compressor",
    subtitle:
      "Upload a PDF file and reduce its size instantly.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "why-compress-pdf",
        title: "Why compress PDF files?",
        paragraphs: [
          "Large PDFs are hard to share via email and slow to download.",
          "Compressing them reduces file size while keeping text and images readable.",
        ],
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/merge-pdf",
        label: "Merge PDF",
        description: "Combine multiple PDF files into one.",
      },
      {
        href: "/pdf-to-png",
        label: "PDF to PNG",
        description: "Export PDF pages as PNG images.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// /merge-pdf
// ---------------------------------------------------------------------------

export const mergePdfPage: PageConfig = {
  slug: "merge-pdf",
  intent: "merge",
  section: "pdf-tools",
  navLabel: "Merge PDF",

  h1: "Merge PDF Files Online",

  meta: {
    title: "Merge PDF Files into One Document Online (Free Fast)",
    description:
      "Combine multiple PDF documents into a single file. Free browser-based tool.",
  },

  hero: {
    subtitle:
      "Join multiple PDF files into one document in seconds.",
    trustBadges: ["Free", "No signup", "Browser-based"],
  },

  tool: {
    ...PDF_MERGE_TOOL_DEFAULTS,
    title: "PDF Merger",
    subtitle:
      "Upload PDF files and merge them into one document.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-pdf",
        label: "Compress PDF",
        description: "Reduce PDF file size for sharing.",
      },
      {
        href: "/pdf-to-png",
        label: "PDF to PNG",
        description: "Export PDF pages as PNG images.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// /pdf-to-png
// ---------------------------------------------------------------------------

export const pdfToPngPage: PageConfig = {
  slug: "pdf-to-png",
  intent: "pdf-convert-png",
  section: "pdf-tools",
  navLabel: "PDF to PNG",

  h1: "Convert PDF to PNG",

  meta: {
    title: "Convert PDF to PNG Images for Design Use (Free Online)",
    description:
      "Export PDF pages as PNG images in your browser. Optional page range. Free, private, no upload.",
  },

  hero: {
    subtitle:
      "Turn each PDF page into a PNG image — pick the whole file or a page range. Processing stays on your device.",
    trustBadges: ["Free", "No signup", "Browser-based"],
  },

  tool: {
    ...PDF_CONVERT_TOOL_DEFAULTS,
    defaultPdfExportFormat: "png",
    title: "PDF to PNG",
    subtitle:
      "PNG is selected by default; you can switch to JPG, text, or HTML in the same tool.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/convert-pdf",
        label: "Convert PDF",
        description: "All export formats in one place.",
      },
      {
        href: "/pdf-to-jpg",
        label: "PDF to JPG",
        description: "Export pages as JPG images.",
      },
      {
        href: "/jpg-to-png",
        label: "JPG to PNG",
        description: "Convert JPG images to PNG format.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// /pdf-to-jpg
// ---------------------------------------------------------------------------

export const pdfToJpgPage: PageConfig = {
  slug: "pdf-to-jpg",
  intent: "pdf-convert-jpg",
  section: "pdf-tools",
  navLabel: "PDF to JPG",

  h1: "Convert PDF to JPG",

  meta: {
    title: "Convert PDF to JPG for Smaller Image Files (Free Online)",
    description:
      "Export PDF pages as JPG images locally. Page range optional. Free, no server upload.",
  },

  hero: {
    subtitle:
      "Save each page as a JPG — good for sharing and smaller files than PNG. Runs entirely in your browser.",
    trustBadges: ["Free", "No signup", "Browser-based"],
  },

  tool: {
    ...PDF_CONVERT_TOOL_DEFAULTS,
    defaultPdfExportFormat: "jpg",
    title: "PDF to JPG",
    subtitle:
      "JPG is selected by default; other formats are available from the same converter.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/convert-pdf",
        label: "Convert PDF",
        description: "All export formats in one place.",
      },
      {
        href: "/pdf-to-png",
        label: "PDF to PNG",
        description: "Lossless page images when you need sharp text.",
      },
      {
        href: "/jpg-to-png",
        label: "JPG to PNG",
        description: "Convert JPG images to PNG format.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// /pdf-to-txt
// ---------------------------------------------------------------------------

export const pdfToTxtPage: PageConfig = {
  slug: "pdf-to-txt",
  intent: "pdf-convert-txt",
  section: "pdf-tools",
  navLabel: "PDF to Text",

  h1: "Convert PDF to Text (TXT)",

  meta: {
    title: "Convert PDF to Text for Copying Content (Free Online)",
    description:
      "Save PDF text as a .txt file locally. Scanned PDFs may export little text. Free, private.",
  },

  hero: {
    subtitle:
      "Pull readable text into a single .txt file — use a page range for long documents. Scanned pages often need OCR elsewhere.",
    trustBadges: ["Free", "No signup", "Browser-based"],
  },

  tool: {
    ...PDF_CONVERT_TOOL_DEFAULTS,
    defaultPdfExportFormat: "txt",
    title: "PDF to Text",
    subtitle:
      "Plain text is selected by default; switch to images or HTML from the same tool if needed.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/convert-pdf",
        label: "Convert PDF",
        description: "All export formats in one place.",
      },
      {
        href: "/pdf-to-html",
        label: "PDF to HTML",
        description: "Export with basic layout to HTML.",
      },
      {
        href: "/pdf-to-png",
        label: "PDF to PNG",
        description: "Export pages as PNG images.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// /pdf-to-html
// ---------------------------------------------------------------------------

export const pdfToHtmlPage: PageConfig = {
  slug: "pdf-to-html",
  intent: "pdf-convert-html",
  section: "pdf-tools",
  navLabel: "PDF to HTML",

  h1: "Convert PDF to HTML",

  meta: {
    title: "Convert PDF to HTML for Web Publishing (Free Online)",
    description:
      "Turn PDF pages into simple HTML in your browser. Optional page range. Free and private.",
  },

  hero: {
    subtitle:
      "Get a lightweight HTML file you can open in a browser — useful for reusing layout and text. Processing stays local.",
    trustBadges: ["Free", "No signup", "Browser-based"],
  },

  tool: {
    ...PDF_CONVERT_TOOL_DEFAULTS,
    defaultPdfExportFormat: "html",
    title: "PDF to HTML",
    subtitle:
      "HTML is selected by default; PNG, JPG, and text are one click away in the same tool.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/convert-pdf",
        label: "Convert PDF",
        description: "All export formats in one place.",
      },
      {
        href: "/pdf-to-txt",
        label: "PDF to Text",
        description: "Extract plain text to a .txt file.",
      },
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "Shrink JPG, PNG, and WebP from your exports.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// /convert-pdf
// ---------------------------------------------------------------------------

export const convertPdfPage: PageConfig = {
  slug: "convert-pdf",
  intent: "pdf-convert",
  section: "pdf-tools",
  navLabel: "Convert PDF",

  h1: "Convert PDF to Images, Text & HTML",

  meta: {
    title: "Convert PDF to PNG, JPG, Text, HTML Online (Free Fast)",
    description:
      "PDF to PNG, JPG, TXT, or HTML in your browser. Full file or page range. Free, private. Word/Excel/PPT export planned.",
  },

  hero: {
    subtitle:
      "Turn PDF pages into PNG or JPG images, a text file, or simple HTML — optionally limit to a page range. Everything runs on your device. Word, Excel, and PowerPoint export is planned for a later release.",
    trustBadges: ["Free", "No signup", "Browser-based"],
  },

  tool: {
    ...PDF_CONVERT_TOOL_DEFAULTS,
    title: "PDF Converter",
    subtitle:
      "PNG, JPG, TXT, and HTML export runs in your browser; pick pages or the whole file. Office formats are marked as coming soon.",
  },

  results: RESULTS_DEFAULTS,

  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "why-convert-pdf",
        title: "Why convert a PDF?",
        paragraphs: [
          "Images are ideal for slides and social posts; plain text and HTML help when you need to reuse content quickly.",
          "Use a page range when you only need part of a long document. In-browser export reads text and renders pages; scanned PDFs may yield little text.",
        ],
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/pdf-to-png",
        label: "PDF to PNG",
        description: "Export pages as PNG images.",
      },
      {
        href: "/pdf-to-txt",
        label: "PDF to Text",
        description: "Extract plain text to a .txt file.",
      },
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "Shrink JPG, PNG, and WebP files with quality presets.",
      },
    ],
  },
};
