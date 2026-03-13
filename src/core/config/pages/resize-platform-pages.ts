import type { PageConfig } from "@/core/types";
import {
  IMAGE_RESIZE_TOOL_DEFAULTS,
  RESULTS_DEFAULTS,
  AD_SLOT_DEFAULTS,
} from "@/core/config/defaults";
import {
  RESIZE_PLATFORM_PRESETS,
  SLUG_TO_PRESET_KEY,
} from "@/core/config/resizePlatformPresets";

const RELATED_LINKS = [
  { href: "/resize-image", label: "Resize Image", description: "General image resizer with custom dimensions." },
  { href: "/compress-image", label: "Compress Image", description: "Reduce file size without changing dimensions." },
  { href: "/crop-image", label: "Crop Image", description: "Trim and reframe images before resizing." },
] as const;

function buildResizePlatformPage(
  slug: keyof typeof SLUG_TO_PRESET_KEY,
  h1: string,
  metaTitle: string,
  metaDescription: string,
  heroSubtitle: string,
  toolTitle: string,
  toolSubtitle: string,
  seoBlocks: PageConfig["seoContent"],
  faqItems: NonNullable<PageConfig["faq"]>["items"],
): PageConfig {
  const presetKey = SLUG_TO_PRESET_KEY[slug];
  const presetGroup = RESIZE_PLATFORM_PRESETS[presetKey];
  if (!presetGroup) throw new Error(`Missing preset for slug: ${slug}`);

  return {
    slug,
    intent: `resize-platform-${presetKey}` as PageConfig["intent"],
    section: "image-tools",
    navLabel: h1.replace(/^Resize Image for /, ""),
    h1,
    meta: { title: metaTitle, description: metaDescription },
    hero: {
      subtitle: heroSubtitle,
      trustBadges: ["Free", "No signup", "Browser-based", "Platform presets"],
    },
    tool: {
      ...IMAGE_RESIZE_TOOL_DEFAULTS,
      title: toolTitle,
      subtitle: toolSubtitle,
      resizePlatformPresets: presetGroup.presets,
      defaultResizeMode: presetGroup.defaultMode,
    },
    results: RESULTS_DEFAULTS,
    adSlot: AD_SLOT_DEFAULTS,
    seoContent: seoBlocks,
    faq: { title: "Frequently Asked Questions", items: faqItems },
    related: {
      title: "Related Tools",
      links: [...RELATED_LINKS],
    },
  };
}

// ---------------------------------------------------------------------------
// Instagram Post
// ---------------------------------------------------------------------------

export const resizeImageForInstagramPostPage = buildResizePlatformPage(
  "resize-image-for-instagram-post",
  "Resize Image for Instagram Post",
  "Resize for Instagram Post - 1080×1080, 1080×1350 Free",
  "Resize images for Instagram posts: square (1080×1080), portrait (1080×1350), landscape (1080×566). Free, private, browser-based.",
  "Resize images to Instagram post dimensions — square, portrait, or landscape. One-click presets, no upload.",
  "Instagram Post Resizer",
  "Upload images and pick a preset: 1080×1080, 1080×1350, or 1080×566. Download instantly.",
  {
    blocks: [
      {
        id: "about",
        title: "Why resize images for Instagram?",
        paragraphs: [
          "Instagram displays feed posts at 1080 pixels wide. Using the correct dimensions ensures your images look sharp and aren't cropped unexpectedly. Square posts (1080×1080) work well for product shots and portraits. Portrait (1080×1350) gives more vertical space for full-body photos. Landscape (1080×566) suits wide scenes and group shots.",
          "This free tool lets you resize images to Instagram's recommended sizes without uploading to any server. All processing happens in your browser. You can batch up to 10 images and download them individually or as a ZIP file.",
        ],
      },
      {
        id: "how",
        title: "How to resize for Instagram",
        paragraphs: [
          "Upload one or more images (JPG, PNG, or WebP, max 10 MB each). Select a preset: 1080×1080 for square, 1080×1350 for portrait, or 1080×566 for landscape. Click Resize now and download your files. The tool uses fill mode by default so your image covers the full frame — if the aspect ratio doesn't match, the edges may be cropped. For profile pictures or avatars where you want no cropping, use our [Resize Image for Instagram Profile](/resize-image-for-instagram-profile) tool instead.",
        ],
      },
    ],
  },
  [
    {
      question: "What are the best Instagram post dimensions?",
      answer:
        "Instagram recommends 1080×1080 for square, 1080×1350 for portrait (4:5), and 1080×566 for landscape. Our presets match these exactly.",
    },
    {
      question: "Will my images be uploaded to a server?",
      answer:
        "No. All resizing happens directly in your browser. Your images never leave your device.",
    },
    {
      question: "Can I resize multiple images at once?",
      answer:
        "Yes, you can upload up to 10 images and resize them all with the same preset. Download individually or as a ZIP.",
    },
    {
      question: "What if my image is smaller than 1080px?",
      answer:
        "The tool will show a warning. Upscaling can reduce quality. For best results, use a source image that's at least 1080px on the longest side.",
    },
  ],
);

// ---------------------------------------------------------------------------
// Instagram Profile
// ---------------------------------------------------------------------------

export const resizeImageForInstagramProfilePage = buildResizePlatformPage(
  "resize-image-for-instagram-profile",
  "Resize Image for Instagram Profile",
  "Resize Image for Instagram Profile - 320×320 Free",
  "Resize images for Instagram profile picture (320×320). Fit mode preserves aspect ratio. Free, private, browser-based.",
  "Resize images for Instagram profile picture. Fit mode keeps your photo uncropped.",
  "Instagram Profile Resizer",
  "Upload an image and resize to 320×320 for your profile. Fit mode preserves aspect ratio.",
  {
    blocks: [
      {
        id: "about",
        title: "Instagram profile picture size",
        paragraphs: [
          "Instagram displays profile pictures at 320×320 pixels. Because it's circular, you want an image that looks good when cropped to a circle. Our tool uses fit mode by default — your image is scaled to fit inside 320×320 while preserving aspect ratio, with transparent or white padding if needed. This avoids unwanted cropping of faces or logos.",
          "All processing happens in your browser. No upload, no signup. Upload your image, click the 320×320 preset, and download. For square images, fit and fill produce the same result.",
        ],
      },
      {
        id: "how",
        title: "How to resize for Instagram profile",
        paragraphs: [
          "Upload your image (JPG, PNG, or WebP). Click the 320×320 preset. The tool uses fit mode so your image is contained within the frame — no cropping. Click Resize now and download. If you prefer the image to fill the frame (with possible cropping), you can use our general [Resize Image](/resize-image) tool and uncheck maintain aspect ratio.",
        ],
      },
    ],
  },
  [
    {
      question: "Why 320×320 for Instagram profile?",
      answer:
        "Instagram displays profile pictures at 320×320. Using this size ensures your image is sharp and not downscaled by the platform.",
    },
    {
      question: "What is fit mode?",
      answer:
        "Fit mode scales your image to fit inside the target dimensions while preserving aspect ratio. No cropping — you may see padding. Ideal for profile pictures.",
    },
    {
      question: "Are my images private?",
      answer:
        "Yes. All processing happens locally in your browser. Nothing is uploaded to any server.",
    },
  ],
);

// ---------------------------------------------------------------------------
// Facebook
// ---------------------------------------------------------------------------

export const resizeImageForFacebookPage = buildResizePlatformPage(
  "resize-image-for-facebook",
  "Resize Image for Facebook",
  "Resize Image for Facebook - Post, Profile, Cover, Story Free",
  "Resize images for Facebook: posts (1200×630), profile (320×320), cover (851×315), stories (1080×1920). Free, browser-based.",
  "Resize images for Facebook posts, profile picture, cover photo, or story. One-click presets.",
  "Facebook Image Resizer",
  "Upload images and pick a preset: post, profile, cover, or story. Download instantly.",
  {
    blocks: [
      {
        id: "about",
        title: "Facebook image dimensions",
        paragraphs: [
          "Facebook uses different image sizes for different placements. Link previews and posts look best at 1200×630. Profile pictures display at 320×320 (shown as a circle). Cover photos are 851×315. Stories use 1080×1920. Using the correct dimensions ensures your images aren't cropped or pixelated.",
          "This free tool provides presets for all these sizes. All processing happens in your browser — no upload to Facebook or any server. Batch up to 10 images and download as ZIP.",
        ],
      },
      {
        id: "how",
        title: "How to resize for Facebook",
        paragraphs: [
          "Upload your images. Select a preset: 1200×630 for posts, 320×320 for profile, 851×315 for cover, or 1080×1920 for stories. Click Resize now. Profile and logo presets use fit mode to avoid cropping. Post, cover, and story presets use fill mode to fill the frame. Need to [compress](/compress-image) after resizing? Use our Compress Image tool.",
        ],
      },
    ],
  },
  [
    {
      question: "What size should Facebook post images be?",
      answer:
        "1200×630 pixels is recommended for link previews and shared posts. It's a 1.91:1 aspect ratio that displays well in the feed.",
    },
    {
      question: "What is the Facebook cover photo size?",
      answer:
        "851×315 pixels. Our preset uses fill mode so your image covers the full banner. Ensure important content is centered.",
    },
    {
      question: "Can I resize for Facebook without uploading?",
      answer:
        "Yes. This tool runs entirely in your browser. Your images never leave your device until you download the result.",
    },
  ],
);

// ---------------------------------------------------------------------------
// LinkedIn
// ---------------------------------------------------------------------------

export const resizeImageForLinkedinPage = buildResizePlatformPage(
  "resize-image-for-linkedin",
  "Resize Image for LinkedIn",
  "Resize Image for LinkedIn - Post, Profile, Banner, Logo Free",
  "Resize images for LinkedIn: posts (1200×627), profile (400×400), banner (1584×396), logo (300×300). Free, browser-based.",
  "Resize images for LinkedIn posts, profile, banner, or company logo. Professional presets.",
  "LinkedIn Image Resizer",
  "Upload images and pick a preset: post, profile, banner, or logo. Download instantly.",
  {
    blocks: [
      {
        id: "about",
        title: "LinkedIn image dimensions",
        paragraphs: [
          "LinkedIn has specific image requirements for different uses. Post images and link previews work best at 1200×627. Profile pictures display at 400×400. Background banners are 1584×396. Company logos use 300×300. Using the correct dimensions ensures your content looks professional and isn't cropped.",
          "This free tool provides presets for all these sizes. Processing happens in your browser — no upload. Batch up to 10 images. Profile and logo presets use fit mode; post and banner use fill mode.",
        ],
      },
      {
        id: "how",
        title: "How to resize for LinkedIn",
        paragraphs: [
          "Upload your images. Select a preset: 1200×627 for posts, 400×400 for profile, 1584×396 for banner, or 300×300 for logo. Click Resize now. For best results, use high-resolution source images. After resizing, you can [compress](/compress-image) to reduce file size for faster uploads.",
        ],
      },
    ],
  },
  [
    {
      question: "What size should LinkedIn post images be?",
      answer:
        "1200×627 pixels is recommended for shared posts and link previews. It displays well in the feed without cropping.",
    },
    {
      question: "What is the LinkedIn banner size?",
      answer:
        "1584×396 pixels. Use fill mode to cover the full banner. Keep important content centered as edges may crop on smaller screens.",
    },
    {
      question: "Are my images secure?",
      answer:
        "Yes. All processing happens locally in your browser. Nothing is uploaded to any server.",
    },
  ],
);

// ---------------------------------------------------------------------------
// Twitter
// ---------------------------------------------------------------------------

export const resizeImageForTwitterPage = buildResizePlatformPage(
  "resize-image-for-twitter",
  "Resize Image for Twitter",
  "Resize Image for Twitter - Post, Profile, Header Free",
  "Resize images for Twitter: posts (1600×900), profile (400×400), header (1500×500). Free, browser-based.",
  "Resize images for Twitter posts, profile picture, or header. One-click presets.",
  "Twitter Image Resizer",
  "Upload images and pick a preset: post, profile, or header. Download instantly.",
  {
    blocks: [
      {
        id: "about",
        title: "Twitter image dimensions",
        paragraphs: [
          "Twitter (X) uses different sizes for different elements. In-feed images look best at 1600×900. Profile pictures display at 400×400. Header images are 1500×500. Using the correct dimensions ensures your images aren't cropped or distorted.",
          "This free tool provides presets for all these sizes. All processing happens in your browser. No upload, no signup. Batch up to 10 images and download as ZIP.",
        ],
      },
      {
        id: "how",
        title: "How to resize for Twitter",
        paragraphs: [
          "Upload your images. Select a preset: 1600×900 for posts, 400×400 for profile, or 1500×500 for header. Click Resize now. Profile uses fit mode; post and header use fill mode. For more control, use our general [Resize Image](/resize-image) or [Crop Image](/crop-image) tools.",
        ],
      },
    ],
  },
  [
    {
      question: "What size should Twitter post images be?",
      answer:
        "1600×900 pixels (16:9) is recommended for in-feed images. It displays well without cropping on most devices.",
    },
    {
      question: "What is the Twitter header size?",
      answer:
        "1500×500 pixels. Use fill mode to cover the full header. Important content should be centered as it may crop on mobile.",
    },
    {
      question: "Can I resize multiple images at once?",
      answer:
        "Yes, upload up to 10 images and resize them all with the same preset. Download individually or as a ZIP.",
    },
  ],
);

// ---------------------------------------------------------------------------
// YouTube Thumbnail
// ---------------------------------------------------------------------------

export const resizeImageForYoutubeThumbnailPage = buildResizePlatformPage(
  "resize-image-for-youtube-thumbnail",
  "Resize Image for YouTube Thumbnail",
  "Resize Image for YouTube Thumbnail - 1280×720 Free",
  "Resize images for YouTube thumbnails (1280×720). Free, private, browser-based. One-click preset.",
  "Resize images to YouTube thumbnail size (1280×720). Fill the frame, look sharp.",
  "YouTube Thumbnail Resizer",
  "Upload an image and resize to 1280×720 for your YouTube thumbnail.",
  {
    blocks: [
      {
        id: "about",
        title: "YouTube thumbnail dimensions",
        paragraphs: [
          "YouTube recommends thumbnails at 1280×720 pixels (16:9 aspect ratio). This size ensures your thumbnail looks sharp on all devices — from mobile to TV. Using a smaller image can result in a blurry or pixelated thumbnail.",
          "This free tool resizes your image to exactly 1280×720. Fill mode is used by default so your image covers the full frame — if your source has a different aspect ratio, the edges may be cropped. All processing happens in your browser.",
        ],
      },
      {
        id: "how",
        title: "How to resize for YouTube thumbnail",
        paragraphs: [
          "Upload your image (JPG, PNG, or WebP). Click the 1280×720 preset. Click Resize now and download. For best results, use a source image that's at least 1280px wide. If you need to crop first, use our [Crop Image](/crop-image) tool. To reduce file size after resizing, use [Compress Image](/compress-image).",
        ],
      },
    ],
  },
  [
    {
      question: "What is the recommended YouTube thumbnail size?",
      answer:
        "1280×720 pixels (16:9). YouTube displays thumbnails at various sizes; 1280×720 ensures quality across all devices.",
    },
    {
      question: "Will my image be cropped?",
      answer:
        "If your image has a different aspect ratio than 16:9, fill mode will crop the edges to fit. Use our Crop Image tool first if you want to choose the crop area.",
    },
    {
      question: "Are my images uploaded anywhere?",
      answer:
        "No. All resizing happens in your browser. Your images never leave your device.",
    },
  ],
);

// ---------------------------------------------------------------------------
// YouTube Banner
// ---------------------------------------------------------------------------

export const resizeImageForYoutubeBannerPage = buildResizePlatformPage(
  "resize-image-for-youtube-banner",
  "Resize Image for YouTube Banner",
  "Resize Image for YouTube Banner - 2560×1440 Channel Art Free",
  "Resize images for YouTube channel art (2560×1440). Free, private, browser-based.",
  "Resize images to YouTube channel banner size (2560×1440). Fill the frame.",
  "YouTube Banner Resizer",
  "Upload an image and resize to 2560×1440 for your YouTube channel art.",
  {
    blocks: [
      {
        id: "about",
        title: "YouTube channel art dimensions",
        paragraphs: [
          "YouTube channel art (banner) displays at 2560×1440 pixels. The visible area varies by device — on TV it shows the full image; on desktop and mobile, the sides may be cropped. YouTube recommends keeping important content in the center 1546×423 \"safe area\" for best results across devices.",
          "This free tool resizes your image to 2560×1440. Fill mode ensures your image covers the full frame. All processing happens in your browser — no upload.",
        ],
      },
      {
        id: "how",
        title: "How to resize for YouTube banner",
        paragraphs: [
          "Upload your image. Click the 2560×1440 preset. Click Resize now and download. For best results, use a source image at least 2560px wide. Keep logos and text centered to avoid cropping on smaller screens. Need to [crop](/crop-image) or [compress](/compress-image)? We have tools for that.",
        ],
      },
    ],
  },
  [
    {
      question: "What is the YouTube banner size?",
      answer:
        "2560×1440 pixels. YouTube uses this for channel art. The visible area varies by device; keep important content centered.",
    },
    {
      question: "Why does my banner look cropped on mobile?",
      answer:
        "YouTube crops the sides on smaller screens. Keep logos and text in the center 1546×423 area for best visibility everywhere.",
    },
    {
      question: "Is this tool free?",
      answer:
        "Yes, 100% free. No signup, no watermarks, no upload to any server.",
    },
  ],
);

// ---------------------------------------------------------------------------
// Shopify
// ---------------------------------------------------------------------------

export const resizeImageForShopifyPage = buildResizePlatformPage(
  "resize-image-for-shopify",
  "Resize Image for Shopify",
  "Resize Image for Shopify - Product, Collection, Banner Free",
  "Resize images for Shopify: product (2048×2048), collection (1600×900), hero (1800×1000). Free, browser-based.",
  "Resize images for Shopify product pages, collections, and hero banners. E-commerce presets.",
  "Shopify Image Resizer",
  "Upload images and pick a preset: product, collection, or hero banner. Download instantly.",
  {
    blocks: [
      {
        id: "about",
        title: "Shopify image dimensions",
        paragraphs: [
          "Shopify recommends different image sizes for different uses. Product images work well at 2048×2048 (square) or similar. Collection images often use 1600×900. Hero banners use 1800×1000 or similar. Using the correct dimensions ensures fast loading and sharp display.",
          "This free tool provides presets for these common Shopify sizes. All processing happens in your browser. Batch up to 10 images. After resizing, use our [Compress Image](/compress-image) tool to reduce file size for faster page loads.",
        ],
      },
      {
        id: "how",
        title: "How to resize for Shopify",
        paragraphs: [
          "Upload your product or banner images. Select a preset: 2048×2048 for products, 1600×900 for collections, or 1800×1000 for hero banners. Click Resize now. Fill mode ensures your image covers the frame. For custom dimensions, use our general [Resize Image](/resize-image) tool.",
        ],
      },
    ],
  },
  [
    {
      question: "What size should Shopify product images be?",
      answer:
        "2048×2048 is a good standard for product images. Shopify supports up to 4472×4472; 2048 keeps files manageable while staying sharp.",
    },
    {
      question: "Can I resize multiple product images?",
      answer:
        "Yes, upload up to 10 images and resize them all with the same preset. Download individually or as a ZIP.",
    },
    {
      question: "Are my images private?",
      answer:
        "Yes. All processing happens in your browser. Nothing is uploaded to any server.",
    },
  ],
);

// ---------------------------------------------------------------------------
// WhatsApp
// ---------------------------------------------------------------------------

export const resizeImageForWhatsappPage = buildResizePlatformPage(
  "resize-image-for-whatsapp",
  "Resize Image for WhatsApp",
  "Resize Image for WhatsApp - Profile, Status Free",
  "Resize images for WhatsApp: profile (640×640), status (1080×1920). Free, browser-based.",
  "Resize images for WhatsApp profile picture or status. One-click presets.",
  "WhatsApp Image Resizer",
  "Upload images and pick a preset: profile (640×640) or status (1080×1920). Download instantly.",
  {
    blocks: [
      {
        id: "about",
        title: "WhatsApp image dimensions",
        paragraphs: [
          "WhatsApp profile pictures display at 640×640 (shown as a circle). Status images use 1080×1920 (9:16). Using the correct dimensions ensures your images look sharp. Profile preset uses fit mode to avoid cropping faces or logos. Status uses fill mode to fill the vertical frame.",
          "This free tool provides both presets. All processing happens in your browser. No upload to WhatsApp or any server.",
        ],
      },
      {
        id: "how",
        title: "How to resize for WhatsApp",
        paragraphs: [
          "Upload your image. Select 640×640 for profile or 1080×1920 for status. Click Resize now. Profile uses fit mode (no cropping). Status uses fill mode. For more control, use our [Resize Image](/resize-image) or [Crop Image](/crop-image) tools.",
        ],
      },
    ],
  },
  [
    {
      question: "What size is WhatsApp profile picture?",
      answer:
        "640×640 pixels. Our preset uses fit mode so your image isn't cropped — it's scaled to fit inside the frame.",
    },
    {
      question: "What size is WhatsApp status?",
      answer:
        "1080×1920 pixels (9:16). Use fill mode to cover the full vertical frame.",
    },
    {
      question: "Are my images uploaded?",
      answer:
        "No. All processing happens locally in your browser. Your images never leave your device.",
    },
  ],
);

// ---------------------------------------------------------------------------
// Discord
// ---------------------------------------------------------------------------

export const resizeImageForDiscordPage = buildResizePlatformPage(
  "resize-image-for-discord",
  "Resize Image for Discord",
  "Resize Image for Discord - Server Icon, Banner Free",
  "Resize images for Discord: server icon/avatar (512×512), banner (960×540). Free, browser-based.",
  "Resize images for Discord server icon or banner. One-click presets.",
  "Discord Image Resizer",
  "Upload images and pick a preset: server icon (512×512) or banner (960×540). Download instantly.",
  {
    blocks: [
      {
        id: "about",
        title: "Discord image dimensions",
        paragraphs: [
          "Discord server icons and avatars display at 512×512 (shown as a circle). Server banners use 960×540. Using the correct dimensions ensures your images look sharp. Icon preset uses fit mode to avoid cropping. Banner uses fill mode.",
          "This free tool provides both presets. All processing happens in your browser. No upload to Discord or any server.",
        ],
      },
      {
        id: "how",
        title: "How to resize for Discord",
        paragraphs: [
          "Upload your image. Select 512×512 for server icon/avatar or 960×540 for banner. Click Resize now. Icon uses fit mode (no cropping). Banner uses fill mode. For custom sizes, use our [Resize Image](/resize-image) tool.",
        ],
      },
    ],
  },
  [
    {
      question: "What size is Discord server icon?",
      answer:
        "512×512 pixels. Our preset uses fit mode so your image isn't cropped when displayed as a circle.",
    },
    {
      question: "What size is Discord banner?",
      answer:
        "960×540 pixels. Use fill mode to cover the full banner area.",
    },
    {
      question: "Can I use this for Discord avatar?",
      answer:
        "Yes, the 512×512 preset works for both server icons and user avatars.",
    },
  ],
);

// ---------------------------------------------------------------------------
// Export all
// ---------------------------------------------------------------------------

export const resizePlatformPages: PageConfig[] = [
  resizeImageForInstagramPostPage,
  resizeImageForInstagramProfilePage,
  resizeImageForFacebookPage,
  resizeImageForLinkedinPage,
  resizeImageForTwitterPage,
  resizeImageForYoutubeThumbnailPage,
  resizeImageForYoutubeBannerPage,
  resizeImageForShopifyPage,
  resizeImageForWhatsappPage,
  resizeImageForDiscordPage,
];
