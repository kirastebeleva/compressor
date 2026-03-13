/**
 * Platform-specific resize presets for social media and e-commerce.
 * Used by config-driven pages like /resize-image-for-instagram-post/
 *
 * Resize mode:
 * - fit: scale to fit inside target (contain) — for profile pics, avatars
 * - fill: scale to cover target (cover) — for posts, banners
 */

export type ResizeFitMode = "fit" | "fill";

export type PlatformPresetItem = {
  label: string;
  w: number;
  h: number;
  /** Use case description (tooltip) */
  title?: string;
  mode: ResizeFitMode;
  /** Mark as default/typical preset for this platform */
  isDefault?: boolean;
};

export type PlatformPresetGroup = {
  platform: string;
  defaultMode: ResizeFitMode;
  presets: readonly PlatformPresetItem[];
};

// ---------------------------------------------------------------------------
// Preset definitions
// ---------------------------------------------------------------------------

export const RESIZE_PLATFORM_PRESETS: Record<string, PlatformPresetGroup> = {
  "instagram-post": {
    platform: "Instagram Post",
    defaultMode: "fill",
    presets: [
      {
        label: "1080 × 1080",
        w: 1080,
        h: 1080,
        title: "Square — feed posts, product shots",
        mode: "fill",
        isDefault: true,
      },
      {
        label: "1080 × 1350",
        w: 1080,
        h: 1350,
        title: "Portrait — full-body photos, vertical content",
        mode: "fill",
      },
      {
        label: "1080 × 566",
        w: 1080,
        h: 566,
        title: "Landscape — wide scenes, group shots",
        mode: "fill",
      },
    ],
  },

  "instagram-profile": {
    platform: "Instagram Profile",
    defaultMode: "fit",
    presets: [
      {
        label: "320 × 320",
        w: 320,
        h: 320,
        title: "Profile picture — circular avatar",
        mode: "fit",
        isDefault: true,
      },
    ],
  },

  facebook: {
    platform: "Facebook",
    defaultMode: "fill",
    presets: [
      {
        label: "1200 × 630",
        w: 1200,
        h: 630,
        title: "Post / link preview — feed, shared links",
        mode: "fill",
        isDefault: true,
      },
      {
        label: "320 × 320",
        w: 320,
        h: 320,
        title: "Profile picture — circular avatar",
        mode: "fit",
      },
      {
        label: "851 × 315",
        w: 851,
        h: 315,
        title: "Cover photo — page banner",
        mode: "fill",
      },
      {
        label: "1080 × 1920",
        w: 1080,
        h: 1920,
        title: "Story — vertical full-screen",
        mode: "fill",
      },
    ],
  },

  linkedin: {
    platform: "LinkedIn",
    defaultMode: "fill",
    presets: [
      {
        label: "1200 × 627",
        w: 1200,
        h: 627,
        title: "Post / link preview — feed, articles",
        mode: "fill",
        isDefault: true,
      },
      {
        label: "400 × 400",
        w: 400,
        h: 400,
        title: "Profile picture — circular avatar",
        mode: "fit",
      },
      {
        label: "1584 × 396",
        w: 1584,
        h: 396,
        title: "Banner — background header",
        mode: "fill",
      },
      {
        label: "300 × 300",
        w: 300,
        h: 300,
        title: "Company logo — square logo",
        mode: "fit",
      },
    ],
  },

  twitter: {
    platform: "Twitter",
    defaultMode: "fill",
    presets: [
      {
        label: "1600 × 900",
        w: 1600,
        h: 900,
        title: "Post image — in-feed photos",
        mode: "fill",
        isDefault: true,
      },
      {
        label: "400 × 400",
        w: 400,
        h: 400,
        title: "Profile picture — circular avatar",
        mode: "fit",
      },
      {
        label: "1500 × 500",
        w: 1500,
        h: 500,
        title: "Header — profile banner",
        mode: "fill",
      },
    ],
  },

  "youtube-thumbnail": {
    platform: "YouTube Thumbnail",
    defaultMode: "fill",
    presets: [
      {
        label: "1280 × 720",
        w: 1280,
        h: 720,
        title: "Video thumbnail — 16:9",
        mode: "fill",
        isDefault: true,
      },
    ],
  },

  "youtube-banner": {
    platform: "YouTube Banner",
    defaultMode: "fill",
    presets: [
      {
        label: "2560 × 1440",
        w: 2560,
        h: 1440,
        title: "Channel art — banner",
        mode: "fill",
        isDefault: true,
      },
    ],
  },

  shopify: {
    platform: "Shopify",
    defaultMode: "fill",
    presets: [
      {
        label: "2048 × 2048",
        w: 2048,
        h: 2048,
        title: "Product image — main product photo",
        mode: "fill",
        isDefault: true,
      },
      {
        label: "1600 × 900",
        w: 1600,
        h: 900,
        title: "Collection image — category banner",
        mode: "fill",
      },
      {
        label: "1800 × 1000",
        w: 1800,
        h: 1000,
        title: "Hero banner — homepage slider",
        mode: "fill",
      },
    ],
  },

  whatsapp: {
    platform: "WhatsApp",
    defaultMode: "fit",
    presets: [
      {
        label: "640 × 640",
        w: 640,
        h: 640,
        title: "Profile picture — circular avatar",
        mode: "fit",
        isDefault: true,
      },
      {
        label: "1080 × 1920",
        w: 1080,
        h: 1920,
        title: "Status — vertical story",
        mode: "fill",
      },
    ],
  },

  discord: {
    platform: "Discord",
    defaultMode: "fit",
    presets: [
      {
        label: "512 × 512",
        w: 512,
        h: 512,
        title: "Server icon / avatar — circular",
        mode: "fit",
        isDefault: true,
      },
      {
        label: "960 × 540",
        w: 960,
        h: 540,
        title: "Banner — server banner",
        mode: "fill",
      },
    ],
  },
};

/** Slug to preset key mapping for platform pages */
export const SLUG_TO_PRESET_KEY: Record<string, string> = {
  "resize-image-for-instagram-post": "instagram-post",
  "resize-image-for-instagram-profile": "instagram-profile",
  "resize-image-for-facebook": "facebook",
  "resize-image-for-linkedin": "linkedin",
  "resize-image-for-twitter": "twitter",
  "resize-image-for-youtube-thumbnail": "youtube-thumbnail",
  "resize-image-for-youtube-banner": "youtube-banner",
  "resize-image-for-shopify": "shopify",
  "resize-image-for-whatsapp": "whatsapp",
  "resize-image-for-discord": "discord",
};
