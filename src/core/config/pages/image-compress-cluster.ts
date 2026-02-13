import type { PageConfig } from "@/core/types";
import {
  IMAGE_COMPRESS_TOOL_DEFAULTS,
  RESULTS_DEFAULTS,
  AD_SLOT_DEFAULTS,
} from "@/core/config/defaults";

// ===========================================================================
// Image-compression SEO cluster — 17 pages
//
// Categories:
//   FORMAT   — compress-jpg, compress-png, compress-webp, compress-jpeg
//   SIZE     — compress-image-under-500kb, compress-image-to-100kb
//   PLATFORM — compress-image-for-email, -for-website, -for-web,
//              -for-instagram, -for-whatsapp, -for-shopify,
//              -for-discord, -for-linkedin
//   GENERIC  — free-image-compressor, online-image-compressor
//   BATCH    — compress-image-batch
// ===========================================================================

// ---------------------------------------------------------------------------
// FORMAT — compress-jpg
// ---------------------------------------------------------------------------

export const compressJpgPage: PageConfig = {
  slug: "compress-jpg",
  intent: "format-jpg",
  section: "image-tools",
  navLabel: "Compress JPG",

  h1: "Compress JPG Files Online",

  meta: {
    title: "Compress JPG Online - Free Browser Tool",
    description:
      "Make JPG images smaller without visible quality loss. Browser-based compression with no server uploads.",
  },

  hero: {
    subtitle:
      "Drop your JPG and get a lighter file in seconds — all processing happens in your browser.",
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
      {
        question: "Does compressing a JPG lower its quality?",
        answer:
          "The tool applies efficient encoding to cut file size while keeping visual quality close to the original. Results vary by preset.",
      },
      {
        question: "Can I compress multiple JPG files at once?",
        answer:
          "Currently the tool processes one file at a time. Batch JPG compression is on the roadmap.",
      },
      {
        question: "Is my JPG file sent to a remote server?",
        answer:
          "No. The file stays on your device and is processed entirely in your browser.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "General image compression with flexible presets.",
      },
      {
        href: "/compress-png",
        label: "Compress PNG",
        description: "Compress PNG files while preserving transparency.",
      },
      {
        href: "/compress-webp",
        label: "Compress WebP",
        description: "Push WebP images to even smaller sizes.",
      },
      {
        href: "/compress-image-for-email",
        label: "Compress for Email",
        description: "Get images ready for email attachment limits.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// FORMAT — compress-png
// ---------------------------------------------------------------------------

export const compressPngPage: PageConfig = {
  slug: "compress-png",
  intent: "format-png",
  section: "image-tools",
  navLabel: "Compress PNG",

  h1: "Compress PNG Images Online",

  meta: {
    title: "Compress PNG Online - Free Browser Tool",
    description:
      "Reduce PNG file size while keeping transparency intact. Runs locally in your browser — no file uploads.",
  },

  hero: {
    subtitle:
      "Lighter PNG files with transparency preserved — processed right on your device.",
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
      {
        question: "Will PNG transparency be preserved?",
        answer:
          "Yes. The compressor maintains the alpha channel so transparent areas remain intact.",
      },
      {
        question: "How much smaller will my PNG get?",
        answer:
          "Results depend on image content and preset choice. Graphics with solid colors typically compress more than complex photos.",
      },
      {
        question: "Do I need to install anything?",
        answer:
          "No installation required. The tool runs directly in your web browser on any operating system.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "Compress any image format with quality presets.",
      },
      {
        href: "/compress-jpg",
        label: "Compress JPG",
        description: "Compress JPG photos for web and email.",
      },
      {
        href: "/compress-webp",
        label: "Compress WebP",
        description: "Make WebP images even smaller.",
      },
      {
        href: "/compress-image-under-500kb",
        label: "Compress Under 500 KB",
        description: "Hit a strict 500 KB limit for uploads.",
      },
      {
        href: "/free-image-compressor",
        label: "Free Image Compressor",
        description: "Compress images at no cost with zero signup.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// FORMAT — compress-webp
// ---------------------------------------------------------------------------

export const compressWebpPage: PageConfig = {
  slug: "compress-webp",
  intent: "format-webp",
  section: "image-tools",
  navLabel: "Compress WebP",

  h1: "Compress WebP Images Online",

  meta: {
    title: "Compress WebP Online - Free Browser Tool",
    description:
      "Make WebP images even smaller with browser-based compression. No server upload, no account needed.",
  },

  hero: {
    subtitle:
      "WebP already saves space — this tool pushes it further without leaving your browser.",
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
      {
        question: "Isn't WebP already compressed?",
        answer:
          "WebP files are efficient but can still be reduced further with adjusted quality settings, especially for high-resolution images.",
      },
      {
        question: "Will the compressed file stay in WebP format?",
        answer:
          "Yes. The output format matches the input — your WebP stays WebP.",
      },
      {
        question: "Is there a file size limit?",
        answer:
          "You can upload WebP images up to 10 MB per file.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "General compression for JPG, PNG, and WebP.",
      },
      {
        href: "/compress-jpg",
        label: "Compress JPG",
        description: "Compress JPG photos quickly.",
      },
      {
        href: "/compress-png",
        label: "Compress PNG",
        description: "Compress PNG images while keeping transparency.",
      },
      {
        href: "/compress-image-for-website",
        label: "Compress for Website",
        description: "Get images ready for fast page loads.",
      },
      {
        href: "/online-image-compressor",
        label: "Online Image Compressor",
        description: "Compress images from any device, no install.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// FORMAT — compress-jpeg
// ---------------------------------------------------------------------------

export const compressJpegPage: PageConfig = {
  slug: "compress-jpeg",
  intent: "format-jpeg",
  section: "image-tools",
  navLabel: "Compress JPEG",

  h1: "Compress JPEG Files Online",

  meta: {
    title: "Compress JPEG Online - Free Tool",
    description:
      "Compress JPEG images quickly in your browser. Private, free, and no software to install.",
  },

  hero: {
    subtitle:
      "Select a JPEG file and pick your compression strength — done in seconds, entirely on your device.",
    trustBadges: ["Free", "Private", "No install", "Browser-based"],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
    title: "JPEG Compressor",
    subtitle:
      "Upload a JPEG file and choose a preset for fast compression.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "jpeg-basics",
        title: "JPEG compression basics",
        paragraphs: [
          "JPEG uses lossy encoding, meaning some data is removed to save space. The presets here balance file size and visual fidelity so the result looks close to the original.",
          "Most casual viewers will not notice a difference between the original and a Balanced-preset output.",
        ],
      },
      {
        id: "choosing-preset-jpeg",
        title: "Choosing the right preset",
        paragraphs: [
          "Fast applies light compression for a quick result. Balanced is the default and works well for most cases.",
          "Max gives the smallest file but may introduce slight artifacts on images with fine detail.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is the difference between JPEG and JPG?",
        answer:
          "JPEG and JPG are the same image format. JPG is simply a shorter file extension introduced due to early Windows limitations.",
      },
      {
        question: "Can I set a target file size for JPEG?",
        answer:
          "The current tool uses quality presets rather than an exact target size. For strict limits try the Under 500 KB or Under 1 MB tools.",
      },
      {
        question: "Are my JPEG images stored anywhere?",
        answer:
          "No. Everything runs locally in your browser. Files are never sent to or stored on a remote server.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-jpg",
        label: "Compress JPG",
        description: "Same format, alternative search term.",
      },
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "Compress any image format with presets.",
      },
      {
        href: "/compress-image-to-100kb",
        label: "Compress to 100 KB",
        description: "Aggressive compression for tight limits.",
      },
      {
        href: "/compress-image-for-email",
        label: "Compress for Email",
        description: "Get images small enough for inboxes.",
      },
      {
        href: "/compress-png",
        label: "Compress PNG",
        description: "Compress PNG files with transparency support.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// SIZE — compress-image-under-500kb
// ---------------------------------------------------------------------------

export const compressImageUnder500kbPage: PageConfig = {
  slug: "compress-image-under-500kb",
  intent: "size-500kb",
  section: "image-tools",
  navLabel: "Compress Under 500 KB",

  h1: "Compress Image Under 500 KB",

  meta: {
    title: "Compress Image Under 500 KB - Free Tool",
    description:
      "Get images below 500 KB for uploads, forms, and social platforms. Free browser-based compression.",
  },

  hero: {
    subtitle:
      "Hit a strict 500 KB target for platform uploads and form requirements.",
    trustBadges: ["Free", "500 KB target", "Browser-based", "Private"],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "stub",
    title: "Compress to Under 500 KB",
    subtitle:
      "Upload your image and reduce it below 500 KB using quality presets.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "common-500kb-uses",
        title: "Common 500 KB use cases",
        paragraphs: [
          "Job application portals, forum avatars, and product listing images often cap uploads at 500 KB.",
          "This tool helps you meet that requirement without opening a desktop editor.",
        ],
      },
      {
        id: "how-500kb-target-works",
        title: "How the 500 KB target works",
        paragraphs: [
          "Select your image and choose a compression preset. The tool processes your file locally and shows the result size.",
          "Adjust the preset if the first pass does not reach your target — Max gives the strongest reduction.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Why do some platforms require images under 500 KB?",
        answer:
          "Many web forms, social platforms, and CMS systems enforce upload limits around 500 KB to keep pages loading fast.",
      },
      {
        question: "What if my image is already under 500 KB?",
        answer:
          "The tool will still compress it further if possible. If it is already small, the savings may be minimal.",
      },
      {
        question: "Which image formats can I compress to under 500 KB?",
        answer:
          "JPG, PNG, and WebP files are all supported. JPG typically yields the best results for photographs.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "General compression without a size target.",
      },
      {
        href: "/compress-image-under-1mb",
        label: "Compress Under 1 MB",
        description: "A more lenient size target for larger files.",
      },
      {
        href: "/compress-image-to-100kb",
        label: "Compress to 100 KB",
        description: "Even stricter target for small uploads.",
      },
      {
        href: "/compress-image-for-email",
        label: "Compress for Email",
        description: "Prepare images for email attachment limits.",
      },
      {
        href: "/compress-jpg",
        label: "Compress JPG",
        description: "Format-focused JPG compression.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// SIZE — compress-image-to-100kb
// ---------------------------------------------------------------------------

export const compressImageTo100kbPage: PageConfig = {
  slug: "compress-image-to-100kb",
  intent: "size-100kb",
  section: "image-tools",
  navLabel: "Compress to 100 KB",

  h1: "Compress Image to 100 KB",

  meta: {
    title: "Compress Image to 100 KB - Free Online",
    description:
      "Compress any image down to around 100 KB for strict upload limits. Processed locally in your browser.",
  },

  hero: {
    subtitle:
      "Target an aggressive 100 KB size for the tightest upload restrictions.",
    trustBadges: ["Free", "100 KB target", "Local processing", "Secure"],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "stub",
    title: "Compress to 100 KB",
    subtitle:
      "Upload your image and aim for a 100 KB result using the Max preset.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "when-100kb",
        title: "When you need images at 100 KB",
        paragraphs: [
          "Passport photo uploads, government forms, and some messaging apps set strict limits as low as 100 KB.",
          "Meeting these limits often requires more aggressive compression than the default preset.",
        ],
      },
      {
        id: "best-result-100kb",
        title: "Getting the best result at 100 KB",
        paragraphs: [
          "For the smallest files start with a JPG input — JPG compresses more efficiently than PNG for photographs.",
          "If your image has solid colors or transparency, PNG may be preferable despite larger size.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Can every image be compressed to 100 KB?",
        answer:
          "Very large or highly detailed images may not reach exactly 100 KB without visible quality loss. The tool will compress as far as the preset allows.",
      },
      {
        question: "Which preset should I use for 100 KB?",
        answer:
          "Start with Max for the strongest compression. If quality is too low, try Balanced and check if the result meets your limit.",
      },
      {
        question: "Is this tool really free?",
        answer:
          "Yes. There are no charges, no hidden fees, and no account required.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "General compression with flexible presets.",
      },
      {
        href: "/compress-image-under-500kb",
        label: "Compress Under 500 KB",
        description: "A mid-range size target for common uploads.",
      },
      {
        href: "/compress-image-under-1mb",
        label: "Compress Under 1 MB",
        description: "Reach the most common attachment limit.",
      },
      {
        href: "/compress-jpg",
        label: "Compress JPG",
        description: "JPG-focused compression for best results.",
      },
      {
        href: "/compress-png",
        label: "Compress PNG",
        description: "Compress PNG files with transparency intact.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PLATFORM — compress-image-for-email
// ---------------------------------------------------------------------------

export const compressImageForEmailPage: PageConfig = {
  slug: "compress-image-for-email",
  intent: "platform-email",
  section: "image-tools",
  navLabel: "Compress for Email",

  h1: "Compress Images for Email",

  meta: {
    title: "Compress Image for Email - Free Tool",
    description:
      "Make images small enough for email attachments. Processed in your browser — no upload to any server.",
  },

  hero: {
    subtitle:
      "Get images ready for email inboxes without worrying about attachment limits.",
    trustBadges: ["Free", "Email-ready sizes", "Private", "No signup"],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
    title: "Email Image Compressor",
    subtitle:
      "Upload an image and compress it to a size suitable for email.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "why-compress-for-email",
        title: "Why compress images before emailing",
        paragraphs: [
          "Large attachments slow down sending and receiving. Some email providers reject oversized messages altogether.",
          "Compressing images before attaching avoids bounced emails and frustrated recipients.",
        ],
      },
      {
        id: "email-workflow",
        title: "Recommended workflow",
        paragraphs: [
          "Upload your image here, choose the Balanced preset, and download the compressed version. Attach the result to your email.",
          "For images over 5 MB, the Max preset will give the strongest reduction.",
        ],
      },
      {
        id: "email-privacy",
        title: "Privacy when compressing for email",
        paragraphs: [
          "Your image files never leave your device. Processing runs entirely in your browser, so nothing is uploaded to a remote server.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What size should images be for email?",
        answer:
          "Most email providers allow attachments up to 20–25 MB total, but keeping individual images under 1 MB improves deliverability and loading speed for recipients.",
      },
      {
        question: "Can I compress images for Gmail specifically?",
        answer:
          "Yes. This tool works for any email provider. Compressed images load faster in Gmail, Outlook, Yahoo Mail, and others.",
      },
      {
        question: "Will recipients see a quality difference?",
        answer:
          "In most cases, no. The Balanced preset keeps visual quality high while significantly cutting file size.",
      },
      {
        question: "Does the tool strip metadata from images?",
        answer:
          "The compressor focuses on file size reduction. Metadata handling depends on the compression preset and format.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "General-purpose image compression.",
      },
      {
        href: "/compress-image-under-1mb",
        label: "Compress Under 1 MB",
        description: "Target the most common email attachment limit.",
      },
      {
        href: "/compress-jpg",
        label: "Compress JPG",
        description: "Format-specific JPG compression.",
      },
      {
        href: "/compress-image-for-website",
        label: "Compress for Website",
        description: "Prepare images for web pages and CMS.",
      },
      {
        href: "/compress-image-under-500kb",
        label: "Compress Under 500 KB",
        description: "Stricter size target for smaller inboxes.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PLATFORM — compress-image-for-website
// ---------------------------------------------------------------------------

export const compressImageForWebsitePage: PageConfig = {
  slug: "compress-image-for-website",
  intent: "platform-website",
  section: "image-tools",
  navLabel: "Compress for Website",

  h1: "Compress Images for Your Website",

  meta: {
    title: "Compress Image for Website - Free Tool",
    description:
      "Speed up your site with lighter images. Browser-based compression with no server uploads required.",
  },

  hero: {
    subtitle:
      "Faster page loads start with smaller images — compress before you upload to your CMS.",
    trustBadges: ["Free", "Web-optimized", "Browser-based", "No account"],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
    title: "Website Image Compressor",
    subtitle:
      "Upload an image and get a web-ready version in seconds.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "why-compress-for-website",
        title: "Why image compression matters for websites",
        paragraphs: [
          "Page speed directly affects user experience and search rankings. Images are typically the heaviest assets on a web page.",
          "Compressing them is one of the fastest wins for site performance.",
        ],
      },
      {
        id: "best-format-web",
        title: "Best format for web",
        paragraphs: [
          "JPG works for photographs with lots of color. PNG is best for icons, logos, and images needing transparency.",
          "WebP offers smaller files than both for browsers that support it.",
        ],
      },
      {
        id: "cms-integration",
        title: "Integration with CMS platforms",
        paragraphs: [
          "After compressing your images here, upload them to WordPress, Squarespace, Wix, or any CMS.",
          "No plugins or additional tools required — just smaller files from the start.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What image size is ideal for websites?",
        answer:
          "For most web pages, images between 50 KB and 200 KB offer a good balance of quality and loading speed. Hero images can be up to 300–500 KB.",
      },
      {
        question: "Should I use JPG, PNG, or WebP on my website?",
        answer:
          "Use JPG for photographs, PNG for graphics with transparency, and WebP for the best overall compression when browser support allows.",
      },
      {
        question: "Does this tool help with Core Web Vitals?",
        answer:
          "Yes. Smaller images improve Largest Contentful Paint (LCP), one of Google's Core Web Vitals metrics.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "General image compression for any use case.",
      },
      {
        href: "/compress-image-for-web",
        label: "Compress for Web",
        description: "Broader web performance focus.",
      },
      {
        href: "/compress-webp",
        label: "Compress WebP",
        description: "Best format for modern browsers.",
      },
      {
        href: "/compress-png",
        label: "Compress PNG",
        description: "Keep transparency while cutting file size.",
      },
      {
        href: "/compress-image-for-shopify",
        label: "Compress for Shopify",
        description: "Focused on Shopify product images.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PLATFORM — compress-image-for-web
// ---------------------------------------------------------------------------

export const compressImageForWebPage: PageConfig = {
  slug: "compress-image-for-web",
  intent: "platform-web",
  section: "image-tools",
  navLabel: "Compress for Web",

  h1: "Compress Images for the Web",

  meta: {
    title: "Compress Image for Web - Free Online",
    description:
      "Prepare images for fast web delivery. Free browser-based tool — no signup and no file uploads to servers.",
  },

  hero: {
    subtitle:
      "Lighter images load faster everywhere — blogs, portfolios, landing pages, and more.",
    trustBadges: ["Free", "Fast", "No server upload", "Works offline"],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
    title: "Web Image Compressor",
    subtitle:
      "Upload an image and compress it for fast web delivery.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "web-images-speed",
        title: "Web images and loading speed",
        paragraphs: [
          "Every kilobyte counts when users are on slow connections or mobile data.",
          "Compressing images for the web ensures pages render quickly regardless of connection speed.",
        ],
      },
      {
        id: "compression-no-loss",
        title: "Compression without visible loss",
        paragraphs: [
          "The Balanced preset targets a sweet spot where file size drops significantly but the image still looks sharp.",
          "Start there and switch to Max only if you need further reduction.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "How small should images be for fast web pages?",
        answer:
          "Aim for under 200 KB for inline images and under 100 KB for thumbnails. Larger hero images can be up to 500 KB.",
      },
      {
        question: "Does this tool change image dimensions?",
        answer:
          "No. This tool only reduces file size. Dimensions stay the same. For resizing, use the Resize Image tool.",
      },
      {
        question: "Can I use this for a blog?",
        answer:
          "Absolutely. Compressing images before uploading to your blog reduces page load time and improves reader experience.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "Compress any image format quickly.",
      },
      {
        href: "/compress-image-for-website",
        label: "Compress for Website",
        description: "Targeted at CMS and website uploads.",
      },
      {
        href: "/compress-webp",
        label: "Compress WebP",
        description: "Best compression for modern web browsers.",
      },
      {
        href: "/compress-jpg",
        label: "Compress JPG",
        description: "Focused JPG compression.",
      },
      {
        href: "/online-image-compressor",
        label: "Online Image Compressor",
        description: "Compress from any device with a browser.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PLATFORM — compress-image-for-instagram
// ---------------------------------------------------------------------------

export const compressImageForInstagramPage: PageConfig = {
  slug: "compress-image-for-instagram",
  intent: "platform-instagram",
  section: "image-tools",
  navLabel: "Compress for Instagram",

  h1: "Compress Images for Instagram",

  meta: {
    title: "Compress Image for Instagram - Free",
    description:
      "Get images ready for Instagram without losing quality. Quick, private, browser-based compression.",
  },

  hero: {
    subtitle:
      "Prepare your posts and stories for Instagram uploads — quick and private.",
    trustBadges: ["Free", "Instagram-ready", "Browser-based", "Private"],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
    title: "Instagram Image Compressor",
    subtitle:
      "Upload your image and compress it for smooth Instagram uploads.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "why-compress-instagram",
        title: "Why compress before uploading to Instagram",
        paragraphs: [
          "Instagram applies its own compression to every upload. Sending an already-compressed image reduces the chance of excessive quality loss during that processing step.",
          "Starting with a smaller, well-compressed file gives Instagram's encoder a cleaner input.",
        ],
      },
      {
        id: "instagram-formats",
        title: "Recommended formats for Instagram",
        paragraphs: [
          "JPG is the most compatible format for Instagram posts. For images with text overlays or flat graphics, PNG may preserve sharpness better before Instagram's re-compression.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Instagram's image size limit?",
        answer:
          "Instagram recommends images between 1080×1080 and 1080×1350 pixels. Keeping file size under 8 MB ensures reliable uploads.",
      },
      {
        question: "Does compressing affect Instagram image quality?",
        answer:
          "Instagram re-compresses uploads anyway. A well-compressed input can lead to a better final result than a raw uncompressed file.",
      },
      {
        question: "Should I compress images for Instagram Stories?",
        answer:
          "Yes. Stories display at 1080×1920. Compressing beforehand speeds up uploading, especially on mobile data.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "General image compression for any platform.",
      },
      {
        href: "/compress-image-for-whatsapp",
        label: "Compress for WhatsApp",
        description: "Get images ready for WhatsApp sharing.",
      },
      {
        href: "/compress-jpg",
        label: "Compress JPG",
        description: "Best format for Instagram photos.",
      },
      {
        href: "/compress-image-for-web",
        label: "Compress for Web",
        description: "Web-focused image compression.",
      },
      {
        href: "/free-image-compressor",
        label: "Free Image Compressor",
        description: "Zero-cost compression for all formats.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PLATFORM — compress-image-for-whatsapp
// ---------------------------------------------------------------------------

export const compressImageForWhatsappPage: PageConfig = {
  slug: "compress-image-for-whatsapp",
  intent: "platform-whatsapp",
  section: "image-tools",
  navLabel: "Compress for WhatsApp",

  h1: "Compress Images for WhatsApp",

  meta: {
    title: "Compress Image for WhatsApp - Free",
    description:
      "Make images lighter for WhatsApp sharing. Processed locally in your browser — fast and secure.",
  },

  hero: {
    subtitle:
      "Send cleaner images on WhatsApp by compressing them before sharing.",
    trustBadges: ["Free", "WhatsApp-ready", "Local processing", "Secure"],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
    title: "WhatsApp Image Compressor",
    subtitle:
      "Upload an image and compress it for better WhatsApp quality.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "how-whatsapp-handles-images",
        title: "How WhatsApp handles images",
        paragraphs: [
          "WhatsApp aggressively compresses images to save bandwidth. By compressing your image before sharing, you control how the quality trade-off is made.",
          "Pre-compressed images often look better in chat than raw photos that WhatsApp compresses on its own.",
        ],
      },
      {
        id: "whatsapp-best-practices",
        title: "Best practices for WhatsApp images",
        paragraphs: [
          "Use JPG format for photos. Aim for a file size between 100 KB and 500 KB.",
          "This range keeps images clear in the chat without triggering extreme re-compression.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Does WhatsApp compress images automatically?",
        answer:
          "Yes. WhatsApp applies heavy compression that can blur details. Pre-compressing with a controlled preset gives you more control over final quality.",
      },
      {
        question: "What file size works best for WhatsApp?",
        answer:
          "WhatsApp accepts images up to 16 MB but compresses anything aggressively. Keeping images around 100–300 KB reduces the damage from WhatsApp's own compression.",
      },
      {
        question:
          "Can I send images as documents to avoid compression?",
        answer:
          "Yes, but recipients must open them separately. Pre-compressing lets you share in the chat directly while keeping quality reasonable.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "General compression for any messaging app.",
      },
      {
        href: "/compress-image-for-instagram",
        label: "Compress for Instagram",
        description: "Prepare images for Instagram uploads.",
      },
      {
        href: "/compress-image-for-email",
        label: "Compress for Email",
        description: "Meet email attachment limits.",
      },
      {
        href: "/compress-jpg",
        label: "Compress JPG",
        description: "Best format for WhatsApp photos.",
      },
      {
        href: "/compress-image-to-100kb",
        label: "Compress to 100 KB",
        description: "Aggressive compression for tight limits.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PLATFORM — compress-image-for-shopify
// ---------------------------------------------------------------------------

export const compressImageForShopifyPage: PageConfig = {
  slug: "compress-image-for-shopify",
  intent: "platform-shopify",
  section: "image-tools",
  navLabel: "Compress for Shopify",

  h1: "Compress Images for Shopify",

  meta: {
    title: "Compress Image for Shopify - Free Tool",
    description:
      "Speed up your Shopify store with compressed product images. Free, browser-based, no account needed.",
  },

  hero: {
    subtitle:
      "Lighter product images mean faster store pages and better shopping experiences.",
    trustBadges: ["Free", "Shopify-ready", "Browser-based", "No signup"],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
    title: "Shopify Image Compressor",
    subtitle:
      "Upload a product image and compress it for faster Shopify pages.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "shopify-speed",
        title: "Why image speed matters for Shopify",
        paragraphs: [
          "Online shoppers expect pages to load in under 3 seconds. Product images are usually the largest assets on a Shopify store.",
          "Compressing them is the quickest way to improve load time and keep shoppers browsing.",
        ],
      },
      {
        id: "shopify-workflow",
        title: "Workflow for Shopify store owners",
        paragraphs: [
          "Compress each product image before uploading it through the Shopify admin. Use the Balanced preset for a good file-size-to-quality ratio.",
          "For hero banners and collection headers, try the Max preset to squeeze out extra savings.",
        ],
      },
      {
        id: "shopify-conversions",
        title: "Impact on conversions",
        paragraphs: [
          "Faster page loads lead to lower bounce rates and higher conversion rates. Compressed images directly contribute to this speed improvement.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What image size does Shopify recommend?",
        answer:
          "Shopify suggests product images at 2048×2048 pixels. Keeping file size under 200 KB per image helps maintain fast page loads.",
      },
      {
        question: "Does image compression affect Shopify SEO?",
        answer:
          "Yes, positively. Faster page loads from smaller images improve Core Web Vitals scores, which influence search rankings.",
      },
      {
        question: "Which format should I use for Shopify products?",
        answer:
          "JPG works best for product photos. PNG is better for logos and graphics with transparent backgrounds.",
      },
      {
        question: "Can I compress all my product images at once?",
        answer:
          "Currently the tool handles one image at a time. Batch processing for product catalogs is planned.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "General image compression tool.",
      },
      {
        href: "/compress-image-for-website",
        label: "Compress for Website",
        description: "Broader website image compression.",
      },
      {
        href: "/compress-jpg",
        label: "Compress JPG",
        description: "Best for product photography.",
      },
      {
        href: "/compress-png",
        label: "Compress PNG",
        description: "Compress logos and transparent graphics.",
      },
      {
        href: "/compress-image-for-web",
        label: "Compress for Web",
        description: "Web performance image compression.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PLATFORM — compress-image-for-discord
// ---------------------------------------------------------------------------

export const compressImageForDiscordPage: PageConfig = {
  slug: "compress-image-for-discord",
  intent: "platform-discord",
  section: "image-tools",
  navLabel: "Compress for Discord",

  h1: "Compress Images for Discord",

  meta: {
    title: "Compress Image for Discord - Free Tool",
    description:
      "Fit images within Discord upload limits. Browser-based compression, free, no login required.",
  },

  hero: {
    subtitle:
      "Get images under Discord's file size cap without losing the details that matter.",
    trustBadges: ["Free", "Discord-friendly", "Private", "Instant"],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
    title: "Discord Image Compressor",
    subtitle:
      "Upload an image and compress it to fit Discord's file size limits.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "discord-limits",
        title: "Discord file sharing limits",
        paragraphs: [
          "Free Discord accounts can share files up to 25 MB per message. For channels with active sharing, compressed images keep chat loading fast.",
          "Smaller files also reduce mobile data usage for other members in the server.",
        ],
      },
      {
        id: "when-compress-discord",
        title: "When to compress for Discord",
        paragraphs: [
          "Compress before sharing when you have screenshots larger than a few MB, batch meme images, or photos from a high-resolution camera.",
          "For quick screenshots under 1 MB, compression is usually not necessary.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Discord's file size limit?",
        answer:
          "Free Discord users can upload files up to 25 MB. Nitro subscribers get up to 500 MB. Compressing images helps fit more into the free limit.",
      },
      {
        question: "Does Discord compress uploaded images?",
        answer:
          "Discord may resize very large images for previews, but it does not aggressively re-compress them like some messaging apps.",
      },
      {
        question: "What format works best for Discord?",
        answer:
          "PNG preserves sharpness for screenshots and memes. JPG works well for photos and saves more space.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "General-purpose image compression.",
      },
      {
        href: "/compress-png",
        label: "Compress PNG",
        description: "Best for screenshots and meme graphics.",
      },
      {
        href: "/compress-jpg",
        label: "Compress JPG",
        description: "Compress photos shared on Discord.",
      },
      {
        href: "/compress-image-for-whatsapp",
        label: "Compress for WhatsApp",
        description: "Compression for another messaging platform.",
      },
      {
        href: "/free-image-compressor",
        label: "Free Image Compressor",
        description: "Completely free with no signup.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PLATFORM — compress-image-for-linkedin
// ---------------------------------------------------------------------------

export const compressImageForLinkedinPage: PageConfig = {
  slug: "compress-image-for-linkedin",
  intent: "platform-linkedin",
  section: "image-tools",
  navLabel: "Compress for LinkedIn",

  h1: "Compress Images for LinkedIn",

  meta: {
    title: "Compress Image for LinkedIn - Free",
    description:
      "Prepare images for LinkedIn posts and articles. Free browser compression — no uploads to our servers.",
  },

  hero: {
    subtitle:
      "Professional-looking posts start with well-compressed images that load instantly in the feed.",
    trustBadges: ["Free", "LinkedIn-ready", "Browser-only", "No account"],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
    title: "LinkedIn Image Compressor",
    subtitle:
      "Upload an image and compress it for polished LinkedIn posts.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "linkedin-engagement",
        title: "Images and LinkedIn engagement",
        paragraphs: [
          "Posts with images get significantly more views than text-only updates. Well-compressed images load faster in the feed, making viewers more likely to stop and read.",
          "A crisp, quick-loading image signals professionalism and attention to detail.",
        ],
      },
      {
        id: "linkedin-settings",
        title: "Recommended settings for LinkedIn",
        paragraphs: [
          "Use JPG for photos and the Balanced preset. For infographics with text, try PNG to keep lettering crisp.",
          "Aim for under 500 KB per image — fast enough to render instantly in the mobile app.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What image size does LinkedIn recommend?",
        answer:
          "LinkedIn suggests 1200×627 pixels for shared posts and up to 1128×376 for company page banners. Keeping files under 5 MB ensures reliable uploads.",
      },
      {
        question: "Does image quality matter on LinkedIn?",
        answer:
          "Yes. Blurry or pixelated images reduce engagement. The Balanced preset keeps images sharp while cutting file size.",
      },
      {
        question: "Can I compress images for LinkedIn articles?",
        answer:
          "Yes. Article header images benefit from compression too — faster loading keeps readers on the page.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "General image compression.",
      },
      {
        href: "/compress-image-for-email",
        label: "Compress for Email",
        description: "Get images ready for professional emails.",
      },
      {
        href: "/compress-jpg",
        label: "Compress JPG",
        description: "Best format for LinkedIn photos.",
      },
      {
        href: "/compress-image-for-website",
        label: "Compress for Website",
        description: "Web-focused image compression.",
      },
      {
        href: "/compress-image-for-instagram",
        label: "Compress for Instagram",
        description: "Compression for another social platform.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// GENERIC — free-image-compressor
// ---------------------------------------------------------------------------

export const freeImageCompressorPage: PageConfig = {
  slug: "free-image-compressor",
  intent: "generic-free",
  section: "image-tools",
  navLabel: "Free Image Compressor",

  h1: "Free Image Compressor",

  meta: {
    title: "Free Image Compressor - No Signup Needed",
    description:
      "Compress JPG, PNG, and WebP images at no cost. Everything runs in your browser — private and instant.",
  },

  hero: {
    subtitle:
      "No hidden fees, no signups, no file uploads — just fast image compression in your browser.",
    trustBadges: ["100% free", "No signup", "Private", "Browser-based"],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
    title: "Free Image Compressor",
    subtitle:
      "Drop an image here and compress it completely free of charge.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "why-free",
        title: "What makes this compressor free",
        paragraphs: [
          "Traditional image compressors upload files to a server for processing, which costs money to operate. This tool runs entirely in your browser, eliminating server-side costs.",
          "There is no premium paywall for basic compression features.",
        ],
      },
      {
        id: "supported-formats-free",
        title: "Supported formats",
        paragraphs: [
          "The compressor handles JPG, PNG, and WebP images. Your file is compressed and returned in the same format — no unwanted conversions.",
        ],
      },
      {
        id: "privacy-free",
        title: "Privacy without compromise",
        paragraphs: [
          "Your image files are processed locally on your device. They are never uploaded, cached, or stored on any remote server.",
          "When you close the tab, the data is gone.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Is this compressor really free?",
        answer:
          "Yes. The tool is completely free with no premium tier required for basic compression. Your images are processed locally without server costs.",
      },
      {
        question: "Why is it free?",
        answer:
          "Processing happens in your browser using your device's resources, so there are no server costs to pass along.",
      },
      {
        question: "Are there any limits?",
        answer:
          "You can compress one file at a time, up to 10 MB. There is no daily usage cap.",
      },
      {
        question: "Do you collect data from my images?",
        answer:
          "No. Your files never leave your device. We do not see, store, or log any image data.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "The core image compression tool.",
      },
      {
        href: "/online-image-compressor",
        label: "Online Image Compressor",
        description: "Compress from any device with a browser.",
      },
      {
        href: "/compress-jpg",
        label: "Compress JPG",
        description: "Format-specific JPG compression.",
      },
      {
        href: "/compress-png",
        label: "Compress PNG",
        description: "Compress PNG with transparency support.",
      },
      {
        href: "/compress-webp",
        label: "Compress WebP",
        description: "Modern WebP format compression.",
      },
      {
        href: "/compress-image-for-email",
        label: "Compress for Email",
        description: "Ready-to-attach compressed images.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// GENERIC — online-image-compressor
// ---------------------------------------------------------------------------

export const onlineImageCompressorPage: PageConfig = {
  slug: "online-image-compressor",
  intent: "generic-online",
  section: "image-tools",
  navLabel: "Online Image Compressor",

  h1: "Online Image Compressor",

  meta: {
    title: "Online Image Compressor - Fast & Free",
    description:
      "Compress images online without installing software. Works on any device with a modern browser.",
  },

  hero: {
    subtitle:
      "Open your browser, drop an image, and download a smaller version — no software needed.",
    trustBadges: ["Free", "Works on any device", "No install", "Fast"],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
    title: "Online Image Compressor",
    subtitle:
      "Upload any image and compress it instantly — works on desktop and mobile.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "why-online",
        title: "Why use an online compressor",
        paragraphs: [
          "Online tools eliminate the need for desktop software. You get the same result from any device, any operating system, without managing installations or updates.",
          "Just open the page and start compressing.",
        ],
      },
      {
        id: "how-online-works",
        title: "How it works",
        paragraphs: [
          "Your browser handles the entire compression process using efficient client-side code. The image never leaves your device.",
          "It is processed in memory and offered for download immediately.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Do I need to install software to compress images?",
        answer:
          "No. This tool runs in your web browser. There is nothing to download or install.",
      },
      {
        question: "Does it work on phones and tablets?",
        answer:
          "Yes. The compressor works on any device with a modern browser, including iPhones, Android phones, and tablets.",
      },
      {
        question: "How fast is the compression?",
        answer:
          "Most images are processed in under a second. Larger files may take a few seconds depending on your device.",
      },
      {
        question: "Can I use this tool offline?",
        answer:
          "The tool needs an initial page load from the internet, but after that compression happens locally even if your connection drops.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "The core compression tool.",
      },
      {
        href: "/free-image-compressor",
        label: "Free Image Compressor",
        description: "Completely free with zero signup.",
      },
      {
        href: "/compress-jpg",
        label: "Compress JPG",
        description: "Focused JPG compression online.",
      },
      {
        href: "/compress-png",
        label: "Compress PNG",
        description: "PNG compression with transparency.",
      },
      {
        href: "/compress-webp",
        label: "Compress WebP",
        description: "WebP format compression.",
      },
      {
        href: "/compress-image-for-web",
        label: "Compress for Web",
        description: "Performance-focused web image compression.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// BATCH — compress-image-batch
// ---------------------------------------------------------------------------

export const compressImageBatchPage: PageConfig = {
  slug: "compress-image-batch",
  intent: "batch-image",
  section: "image-tools",
  navLabel: "Batch Compress",

  h1: "Batch Compress Images",

  meta: {
    title: "Batch Compress Images - Free Online Tool",
    description:
      "Compress multiple images at once. Free browser-based tool — up to 5 files per batch.",
  },

  hero: {
    subtitle:
      "Save time by compressing several images in a single session.",
    trustBadges: ["Free", "Multi-file", "Browser-based", "Private"],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "stub",
    title: "Batch Image Compressor",
    subtitle:
      "Upload up to 5 images and compress them all with one click.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "when-batch",
        title: "When to use batch compression",
        paragraphs: [
          "Batch compression saves time when preparing multiple images for a blog post, product catalog, or social media campaign.",
          "Instead of processing files one by one, upload several at once and download them all compressed.",
        ],
      },
      {
        id: "batch-limits",
        title: "Limits and supported formats",
        paragraphs: [
          "Each batch can include up to 5 files totaling 25 MB. Supported formats are JPG, PNG, and WebP.",
          "Every file is compressed independently using the selected preset.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "How many images can I compress at once?",
        answer:
          "The batch tool supports up to 5 images at a time, with a total limit of 25 MB across all files.",
      },
      {
        question: "Do all images use the same preset?",
        answer:
          "Yes. The selected compression preset applies to every image in the batch.",
      },
      {
        question: "Can I download all results at once?",
        answer:
          "Compressed images are available for individual download after processing. Bundled downloads are planned for a future update.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "Single-image compression with presets.",
      },
      {
        href: "/compress-jpg",
        label: "Compress JPG",
        description: "Compress individual JPG files.",
      },
      {
        href: "/compress-png",
        label: "Compress PNG",
        description: "Compress individual PNG files.",
      },
      {
        href: "/compress-image-for-website",
        label: "Compress for Website",
        description: "Prepare images for your site in bulk.",
      },
      {
        href: "/compress-image-for-shopify",
        label: "Compress for Shopify",
        description: "Compress product catalog images.",
      },
    ],
  },
};
