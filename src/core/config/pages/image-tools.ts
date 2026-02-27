import type { PageConfig } from "@/core/types";
import {
  IMAGE_COMPRESS_TOOL_DEFAULTS,
  IMAGE_RESIZE_TOOL_DEFAULTS,
  IMAGE_CROP_TOOL_DEFAULTS,
  IMAGE_ROTATE_TOOL_DEFAULTS,
  IMAGE_FLIP_TOOL_DEFAULTS,
  IMAGE_WATERMARK_TOOL_DEFAULTS,
  IMAGE_CONVERT_TOOL_DEFAULTS,
  RESULTS_DEFAULTS,
  AD_SLOT_DEFAULTS,
} from "@/core/config/defaults";

// ---------------------------------------------------------------------------
// /compress-image-under-1mb
// ---------------------------------------------------------------------------

export const compressImageUnder1mbPage: PageConfig = {
  slug: "compress-image-under-1mb",
  intent: "size",
  section: "image-tools",
  navLabel: "Compress Under 1 MB",

  h1: "Compress Image Under 1 MB",

  meta: {
    title: "Compress Image Under 1 MB - Free Online Tool",
    description:
      "Reduce any image to under 1 MB for email attachments, form uploads, and web use. Free browser-based compression.",
  },

  hero: {
    subtitle:
      "Shrink images below 1 MB without losing visible quality.",
    trustBadges: ["Free", "Under 1 MB target", "Browser-based"],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
    targetBytes: 1024 * 1024,
    title: "Compress to Under 1 MB",
    subtitle:
      "Upload your image and we will reduce it below 1 MB.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "why-1mb",
        title: "Why compress images under 1 MB?",
        paragraphs: [
          "Many email providers and form fields have a 1 MB attachment limit.",
          "Keeping images below 1 MB ensures compatibility with most upload restrictions.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Will the image quality drop noticeably?",
        answer:
          "The tool uses optimized presets that minimize visible quality loss while reaching the target file size.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description:
          "General image compression with flexible presets.",
      },
      {
        href: "/compress-image-under-500kb",
        label: "Compress Under 500 KB",
        description:
          "Hit a strict 500 KB limit for uploads and forms.",
      },
      {
        href: "/crop-image",
        label: "Crop Image",
        description:
          "Trim your image before compressing to hit the target.",
      },
      {
        href: "/rotate-image",
        label: "Rotate Image",
        description:
          "Fix orientation before compressing.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// /resize-image
// ---------------------------------------------------------------------------

export const resizeImagePage: PageConfig = {
  slug: "resize-image",
  intent: "resize",
  section: "image-tools",
  navLabel: "Resize Image",

  h1: "Resize Image Online",

  meta: {
    title: "Resize Image Online Free — Change Size in Pixels or %",
    description:
      "Resize JPG, PNG and WebP images to exact pixel dimensions or by percentage. Free, private, no upload — runs entirely in your browser.",
  },

  hero: {
    subtitle:
      "Change image dimensions for web, social media, or print — instantly and privately in your browser.",
    trustBadges: ["Free", "No signup", "Browser-based", "Batch up to 10"],
  },

  tool: {
    ...IMAGE_RESIZE_TOOL_DEFAULTS,
    title: "Image Resizer",
    subtitle:
      "Upload up to 10 images, set your target dimensions, and download resized files instantly.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "about-tool",
        title: "About this tool",
        paragraphs: [
          "This free online image resizer lets you resize images by pixels or percentage directly in your browser. All processing happens locally using HTML Canvas — your files are never uploaded to a server.",
          "Choose exact pixel dimensions, pick a common preset like 1920×1080 or 1080×1080, or scale by percentage. The tool preserves the original file format and maintains quality during resizing.",
        ],
      },
      {
        id: "how-it-works",
        title: "How it works",
        paragraphs: [
          "1. Upload one or more images (up to 10 at a time, max 10 MB each).",
          "2. Choose a resize mode — enter exact pixel dimensions or select a percentage.",
          "3. Click \"Resize now\" and download your resized images individually or as a ZIP archive.",
          "The resizing algorithm uses high-quality bicubic interpolation to keep your images sharp. Aspect ratio is preserved by default so your photos never look stretched. If you also need to reduce file size, try our [Compress Image](/compress-image) tool.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Is this tool really free?",
        answer:
          "Yes, 100% free with no limits on usage. There are no watermarks, no sign-up required, and no hidden fees.",
      },
      {
        question: "Are my images uploaded to a server?",
        answer:
          "No. All resizing happens directly in your browser using HTML Canvas. Your images never leave your device.",
      },
      {
        question: "What image formats are supported?",
        answer:
          "The tool supports JPG/JPEG, PNG, and WebP. The output format is always the same as the input — no conversion happens.",
      },
      {
        question: "Can I resize multiple images at once?",
        answer:
          "Yes, you can upload up to 10 images and resize them all with the same settings in one batch. Download them individually or as a single ZIP file.",
      },
      {
        question: "Will resizing reduce image quality?",
        answer:
          "Downscaling (making images smaller) preserves quality well. The tool uses high-quality interpolation. Upscaling is disabled by default to avoid blurry results — uncheck \"Do not enlarge\" if you need it.",
      },
      {
        question: "What is the maximum image size?",
        answer:
          "Each file can be up to 10 MB and up to 8000 pixels on the longest side. You can process up to 10 files per batch.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/crop-image",
        label: "Crop Image",
        description:
          "Trim or reframe your image before resizing.",
      },
      {
        href: "/rotate-image",
        label: "Rotate Image",
        description:
          "Fix image orientation before resizing.",
      },
      {
        href: "/flip-image",
        label: "Flip Image",
        description:
          "Mirror images horizontally or vertically.",
      },
      {
        href: "/compress-image",
        label: "Compress Image",
        description:
          "Reduce file size without changing dimensions.",
      },
      {
        href: "/watermark-image",
        label: "Watermark Image",
        description:
          "Add text or logo watermarks after resizing.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// /crop-image
// ---------------------------------------------------------------------------

export const cropImagePage: PageConfig = {
  slug: "crop-image",
  intent: "crop",
  section: "image-tools",
  navLabel: "Crop Image",

  h1: "Crop Image Online",

  meta: {
    title: "Crop Image Online Free — Trim & Reframe Photos Instantly",
    description:
      "Crop JPG, PNG and WebP images to exact dimensions or aspect ratio presets. Free, private, no upload — runs entirely in your browser.",
  },

  hero: {
    subtitle:
      "Trim, reframe, or resize your images for any platform — instantly and privately in your browser.",
    trustBadges: ["Free", "No signup", "Browser-based", "Aspect ratio presets"],
  },

  tool: {
    ...IMAGE_CROP_TOOL_DEFAULTS,
    title: "Image Cropper",
    subtitle:
      "Upload an image, adjust the crop area, and download the result.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "about-tool",
        title: "About this tool",
        paragraphs: [
          "This free online image cropper lets you trim and reframe images directly in your browser. All processing happens locally — your files are never uploaded to a server.",
          "Select a custom crop area or choose from common aspect ratio presets like 1:1, 4:3, or 16:9. The tool preserves the original file format and maintains quality during cropping.",
        ],
      },
      {
        id: "how-it-works",
        title: "How it works",
        paragraphs: [
          "1. Upload an image (max 10 MB).",
          "2. Drag the crop area or choose an aspect ratio preset.",
          "3. Click \"Crop now\" and download your cropped image.",
          "The crop is performed at full resolution on the original image, so you get the best possible quality. If you also need to reduce file size, try our [Compress Image](/compress-image) tool.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Is this tool really free?",
        answer:
          "Yes, 100% free with no limits on usage. There are no watermarks, no sign-up required, and no hidden fees.",
      },
      {
        question: "Are my images uploaded to a server?",
        answer:
          "No. All cropping happens directly in your browser using HTML Canvas. Your images never leave your device.",
      },
      {
        question: "What image formats are supported?",
        answer:
          "The tool supports JPG/JPEG, PNG, and WebP. The output format is always the same as the input.",
      },
      {
        question: "Can I crop to a specific aspect ratio?",
        answer:
          "Yes, choose from presets like 1:1, 4:3, 16:9, or 3:2. You can also enter exact pixel dimensions for the crop area.",
      },
      {
        question: "Will cropping reduce image quality?",
        answer:
          "No. The tool crops from the original full-resolution image. For JPEG and WebP, a quality setting of 92% is used, which is visually identical to the original.",
      },
      {
        question: "What is the maximum image size?",
        answer:
          "Each file can be up to 10 MB. There is no pixel dimension limit beyond what your browser can handle.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/rotate-image",
        label: "Rotate Image",
        description:
          "Fix orientation before or after cropping.",
      },
      {
        href: "/flip-image",
        label: "Flip Image",
        description:
          "Mirror images before or after cropping.",
      },
      {
        href: "/resize-image",
        label: "Resize Image",
        description:
          "Change image dimensions without cropping.",
      },
      {
        href: "/compress-image",
        label: "Compress Image",
        description:
          "Reduce file size after cropping.",
      },
      {
        href: "/watermark-image",
        label: "Watermark Image",
        description:
          "Add a watermark after cropping your image.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// /rotate-image
// ---------------------------------------------------------------------------

export const rotateImagePage: PageConfig = {
  slug: "rotate-image",
  intent: "rotate",
  section: "image-tools",
  navLabel: "Rotate Image",

  h1: "Rotate Image Online",

  meta: {
    title: "Rotate Image Online Free — Batch Rotate Up to 10",
    description:
      "Rotate up to 10 JPG, PNG or WebP images by 90° or 180°. Rotate all at once or fine-tune each image. EXIF fix, ZIP download. Free, browser-based.",
  },

  hero: {
    subtitle:
      "Rotate all images at once or fine-tune each one individually — fix EXIF orientation, download as ZIP.",
    trustBadges: ["Free", "No signup", "EXIF auto-fix", "Per-image control"],
  },

  tool: {
    ...IMAGE_ROTATE_TOOL_DEFAULTS,
    title: "Image Rotator",
    subtitle:
      "Upload up to 10 images. Rotate them all at once or adjust each individually, then export as a ZIP.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "about-tool",
        title: "About this tool",
        paragraphs: [
          "This free batch image rotator lets you rotate up to 10 images at once by 90° or 180° directly in your browser. Apply a global rotation to all images, then fine-tune each one individually if needed.",
          "JPEG images with EXIF orientation data are automatically normalized — the tool reads the EXIF tag, physically corrects the pixels, and strips the tag so your images look right everywhere. All processing happens locally — your files never leave your device.",
        ],
      },
      {
        id: "how-it-works",
        title: "How it works",
        paragraphs: [
          "1. Upload up to 10 images (max 10 MB each).",
          "2. Use \"Rotate All\" buttons to rotate the entire batch at once.",
          "3. Fine-tune individual images using per-image controls in the grid.",
          "4. Click \"Export\" to process and download — individually or as a ZIP.",
          "Use keyboard shortcuts for speed: select an image in the grid, then press ← → or R / L to rotate it. Rotation is performed at full resolution for the best quality.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Is this tool really free?",
        answer:
          "Yes, 100% free with no limits on usage. There are no watermarks, no sign-up required, and no hidden fees.",
      },
      {
        question: "Are my images uploaded to a server?",
        answer:
          "No. All rotation happens directly in your browser using HTML Canvas. Your images never leave your device.",
      },
      {
        question: "How many files can I rotate at once?",
        answer:
          "You can upload and rotate up to 10 images in a single batch. Results can be downloaded individually or all at once as a ZIP archive.",
      },
      {
        question: "What is EXIF orientation and why does it matter?",
        answer:
          "Many cameras and phones store rotation as metadata (EXIF) instead of physically rotating the pixels. This causes images to appear rotated in some apps but not others. Our tool reads the EXIF tag, applies the correction to the actual pixels, and strips the tag — so your images display correctly everywhere.",
      },
      {
        question: "Can I rotate individual images differently?",
        answer:
          "Yes. Use the \"Rotate All\" buttons for global rotation, then fine-tune any image using the per-image controls in the grid. Per-image settings override the global rotation.",
      },
      {
        question: "What image formats are supported?",
        answer:
          "The tool supports JPG/JPEG, PNG, and WebP. The output format is always the same as the input.",
      },
      {
        question: "Will rotating reduce image quality?",
        answer:
          "For 90° and 180° rotations, quality is fully preserved. JPEG and WebP output uses 92% quality, which is visually identical to the original.",
      },
      {
        question: "Can I download only the images I changed?",
        answer:
          "Yes. Enable the \"Download only changed images\" toggle before exporting. Unchanged images will be skipped.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/flip-image",
        label: "Flip Image",
        description:
          "Mirror images horizontally or vertically.",
      },
      {
        href: "/crop-image",
        label: "Crop Image",
        description:
          "Trim your image after rotating.",
      },
      {
        href: "/resize-image",
        label: "Resize Image",
        description:
          "Change image dimensions without rotating.",
      },
      {
        href: "/compress-image",
        label: "Compress Image",
        description:
          "Reduce file size after rotation.",
      },
      {
        href: "/watermark-image",
        label: "Watermark Image",
        description:
          "Add a watermark after fixing orientation.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// /flip-image
// ---------------------------------------------------------------------------

export const flipImagePage: PageConfig = {
  slug: "flip-image",
  intent: "flip",
  section: "image-tools",
  navLabel: "Flip Image",

  h1: "Flip Image Online",

  meta: {
    title: "Flip Image Online Free — Mirror Photos Instantly",
    description:
      "Flip or mirror up to 10 JPG, PNG and WebP images horizontally or vertically. Free, private, no upload — runs entirely in your browser.",
  },

  hero: {
    subtitle:
      "Mirror your images horizontally or vertically — fix selfies, prepare for print, or unify product photo direction. Batch up to 10.",
    trustBadges: ["Free", "No signup", "Browser-based", "Batch up to 10"],
  },

  tool: {
    ...IMAGE_FLIP_TOOL_DEFAULTS,
    title: "Image Flipper",
    subtitle:
      "Upload up to 10 images. Flip them all at once or adjust each individually, then export as a ZIP.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "about-tool",
        title: "About this tool",
        paragraphs: [
          "This free batch image flipper lets you mirror up to 10 images at once horizontally or vertically directly in your browser. Apply a global flip to all images, then fine-tune each one individually if needed.",
          "All processing happens locally — your files never leave your device. The tool supports JPG, PNG, and WebP images up to 10 MB each.",
        ],
      },
      {
        id: "how-it-works",
        title: "How it works",
        paragraphs: [
          "1. Upload up to 10 images (max 10 MB each).",
          "2. Use the \"Flip Horizontal\" or \"Flip Vertical\" buttons to mirror the entire batch.",
          "3. Fine-tune individual images using per-image controls in the grid.",
          "4. Click \"Flip\" to process and download — individually or as a ZIP.",
          "Use keyboard shortcuts for speed: select an image in the grid, then press H to flip horizontally or V to flip vertically.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Is this tool really free?",
        answer:
          "Yes, 100% free with no limits on usage. There are no watermarks, no sign-up required, and no hidden fees.",
      },
      {
        question: "Are my images uploaded to a server?",
        answer:
          "No. All flipping happens directly in your browser using HTML Canvas. Your images never leave your device.",
      },
      {
        question: "What is the difference between horizontal and vertical flip?",
        answer:
          "Horizontal flip mirrors the image left-to-right, like looking in a mirror. Vertical flip mirrors it top-to-bottom, like a reflection in water.",
      },
      {
        question: "How do I fix a mirrored selfie?",
        answer:
          "Upload your selfie and click \"Flip Horizontal\" — this reverses the mirror effect from the front-facing camera so text and logos read correctly.",
      },
      {
        question: "Can I flip multiple images at once?",
        answer:
          "Yes, upload up to 10 images and flip them all with one click. Download them individually or as a single ZIP file.",
      },
      {
        question: "What image formats are supported?",
        answer:
          "The tool supports JPG/JPEG, PNG, and WebP. The output format is always the same as the input.",
      },
      {
        question: "Will flipping reduce image quality?",
        answer:
          "Flip is a lossless pixel operation. JPEG and WebP output uses 92% quality, which is visually identical to the original.",
      },
      {
        question: "Can I flip and rotate in one step?",
        answer:
          "This tool handles flipping. To rotate, use our Rotate Image tool — you can chain both operations.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/rotate-image",
        label: "Rotate Image",
        description:
          "Need to rotate instead of flip? Try Rotate Image.",
      },
      {
        href: "/crop-image",
        label: "Crop Image",
        description:
          "Crop your image after flipping.",
      },
      {
        href: "/compress-image",
        label: "Compress Image",
        description:
          "Reduce file size after processing.",
      },
      {
        href: "/resize-image",
        label: "Resize Image",
        description:
          "Change dimensions after flipping.",
      },
      {
        href: "/watermark-image",
        label: "Watermark Image",
        description:
          "Protect your images with a watermark after flipping.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// /watermark-image
// ---------------------------------------------------------------------------

export const watermarkImagePage: PageConfig = {
  slug: "watermark-image",
  intent: "watermark",
  section: "image-tools",
  navLabel: "Watermark Image",

  h1: "Add Watermark to Image Online",

  meta: {
    title: "Add Watermark to Image Online Free — Text & Logo Watermarks",
    description:
      "Add text or logo watermarks to up to 10 JPG, PNG and WebP images. Free, private, no upload — runs entirely in your browser.",
  },

  hero: {
    subtitle:
      "Protect your photos with a custom text or logo watermark — instantly and privately in your browser. Batch up to 10 images.",
    trustBadges: ["Free", "No signup", "Browser-based", "No platform watermarks"],
  },

  tool: {
    ...IMAGE_WATERMARK_TOOL_DEFAULTS,
    title: "Image Watermark Tool",
    subtitle:
      "Upload up to 10 images, configure your watermark, and download the results.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "about-tool",
        title: "About this tool",
        paragraphs: [
          "This free online watermark tool lets you add text or logo watermarks to up to 10 images at once directly in your browser. All processing happens locally — your files are never uploaded to a server.",
          "Choose from text watermarks with customizable font, color, and shadow, or upload your own logo as a PNG with transparent background. Position your watermark precisely using a visual 9-point grid, adjust opacity and size, and download watermarked images individually or as a ZIP archive.",
        ],
      },
      {
        id: "how-it-works",
        title: "How it works",
        paragraphs: [
          "1. Upload up to 10 images (max 10 MB each, JPG, PNG, or WebP).",
          "2. Choose watermark type — enter text (e.g. © Your Name) or upload a logo.",
          "3. Adjust position, opacity, and size using intuitive controls.",
          "4. Click \"Apply watermark\" and download your images individually or as a ZIP.",
          "The watermark size scales proportionally to each image, so it looks consistent across photos of different resolutions. Unlike many competitors, we never add our own branding to your images.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Is this tool really free?",
        answer:
          "Yes, 100% free with no limits on usage. There are no hidden fees, no sign-up required, and — unlike many competitors — no platform watermarks added to your images.",
      },
      {
        question: "Are my images uploaded to a server?",
        answer:
          "No. All watermarking happens directly in your browser using HTML Canvas. Your images never leave your device.",
      },
      {
        question: "What image formats are supported?",
        answer:
          "The tool supports JPG/JPEG, PNG, and WebP for source images. For logo uploads, use PNG with a transparent background for best results.",
      },
      {
        question: "Can I add a logo watermark?",
        answer:
          "Yes, switch to the Image tab and upload your logo. PNG files with transparent backgrounds work best — the logo is overlaid on your images at the size and opacity you choose.",
      },
      {
        question: "Can I watermark multiple images at once?",
        answer:
          "Yes, upload up to 10 images and the watermark will be applied identically to all of them. Download results individually or as a single ZIP file.",
      },
      {
        question: "Will the watermark scale to different image sizes?",
        answer:
          "Yes, the watermark size is proportional to each image's width, so it looks consistent across images of different resolutions.",
      },
      {
        question: "Can I tile the watermark across the entire image?",
        answer:
          "Yes, enable the Tile pattern option in the advanced settings to repeat the watermark across the full image — commonly used for proof galleries and stock photography.",
      },
      {
        question: "What opacity should I use?",
        answer:
          "50% is a good starting point for most use cases. Use lower values (30%) for subtle branding, or higher values (70–80%) for stronger copyright protection.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description:
          "Reduce file size after watermarking.",
      },
      {
        href: "/resize-image",
        label: "Resize Image",
        description:
          "Resize images before or after adding a watermark.",
      },
      {
        href: "/crop-image",
        label: "Crop Image",
        description:
          "Crop your image before watermarking.",
      },
      {
        href: "/rotate-image",
        label: "Rotate Image",
        description:
          "Fix image orientation before watermarking.",
      },
      {
        href: "/flip-image",
        label: "Flip Image",
        description:
          "Mirror images before adding a watermark.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// /convert-to-webp
// ---------------------------------------------------------------------------

export const convertToWebpPage: PageConfig = {
  slug: "convert-to-webp",
  intent: "convert",
  section: "image-tools",
  navLabel: "Convert to WebP",

  h1: "Convert Images to WebP",

  meta: {
    title: "Convert to WebP - Free Online Converter",
    description:
      "Convert JPG and PNG images to WebP format for smaller file sizes and faster page loads.",
  },

  hero: {
    subtitle:
      "Get smaller file sizes with modern WebP format.",
    trustBadges: ["Free", "Browser-based", "No upload"],
  },

  tool: {
    ...IMAGE_CONVERT_TOOL_DEFAULTS,
    title: "WebP Converter",
    subtitle:
      "Upload a JPG or PNG image to convert it to WebP.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description:
          "Compress images without format conversion.",
      },
      {
        href: "/compress-webp",
        label: "Compress WebP",
        description:
          "Compress WebP images in your browser.",
      },
    ],
  },
};
