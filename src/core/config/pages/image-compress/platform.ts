import type { PageConfig } from "@/core/types";
import {
  IMAGE_COMPRESS_TOOL_DEFAULTS,
  RESULTS_DEFAULTS,
  AD_SLOT_DEFAULTS,
} from "@/core/config/defaults";

export const compressImageForEmailPage: PageConfig = {
  slug: "compress-image-for-email",
  intent: "platform-email",
  section: "image-tools",
  navLabel: "Compress for Email",
  h1: "Compress Images for Email",
  meta: { title: "Compress Image for Email - Free Tool", description: "Make images small enough for email attachments. Processed in your browser — no upload to any server." },
  hero: { subtitle: "Get images ready for email inboxes without worrying about attachment limits.", trustBadges: ["Free", "Email-ready sizes", "Private", "No signup"] },
  tool: { ...IMAGE_COMPRESS_TOOL_DEFAULTS, mode: "browser-compression", title: "Email Image Compressor", subtitle: "Upload an image and compress it to a size suitable for email." },
  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,
  seoContent: { blocks: [
    { id: "why-compress-for-email", title: "Why compress images before emailing", paragraphs: ["Large attachments slow down sending and receiving. Some email providers reject oversized messages altogether.", "Compressing images before attaching avoids bounced emails and frustrated recipients."] },
    { id: "email-workflow", title: "Recommended workflow", paragraphs: ["Upload your image here, choose the Balanced preset, and download the compressed version. Attach the result to your email.", "For images over 5 MB, the Max preset will give the strongest reduction."] },
    { id: "email-privacy", title: "Privacy when compressing for email", paragraphs: ["Your image files never leave your device. Processing runs entirely in your browser, so nothing is uploaded to a remote server."] },
  ] },
  faq: { title: "Frequently Asked Questions", items: [
    { question: "What size should images be for email?", answer: "Most email providers allow attachments up to 20–25 MB total, but keeping individual images under 1 MB improves deliverability and loading speed for recipients." },
    { question: "Can I compress images for Gmail specifically?", answer: "Yes. This tool works for any email provider. Compressed images load faster in Gmail, Outlook, Yahoo Mail, and others." },
    { question: "Will recipients see a quality difference?", answer: "In most cases, no. The Balanced preset keeps visual quality high while significantly cutting file size." },
    { question: "Does the tool strip metadata from images?", answer: "The compressor focuses on file size reduction. Metadata handling depends on the compression preset and format." },
  ] },
};

export const compressImageForWebsitePage: PageConfig = {
  slug: "compress-image-for-website",
  intent: "platform-website",
  section: "image-tools",
  navLabel: "Compress for Website",
  h1: "Compress Images for Your Website",
  meta: { title: "Compress Image for Website - Free Tool", description: "Speed up your site with lighter images. Browser-based compression with no server uploads required." },
  hero: { subtitle: "Faster page loads start with smaller images — compress before you upload to your CMS.", trustBadges: ["Free", "Web-optimized", "Browser-based", "No account"] },
  tool: { ...IMAGE_COMPRESS_TOOL_DEFAULTS, mode: "browser-compression", title: "Website Image Compressor", subtitle: "Upload an image and get a web-ready version in seconds." },
  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,
  seoContent: { blocks: [
    { id: "why-compress-for-website", title: "Why image compression matters for websites", paragraphs: ["Page speed directly affects user experience and search rankings. Images are typically the heaviest assets on a web page.", "Compressing them is one of the fastest wins for site performance."] },
    { id: "web-images-speed", title: "Web images and loading speed", paragraphs: ["Every kilobyte counts when users are on slow connections or mobile data. Compressing images for the web ensures pages render quickly regardless of connection speed.", "The Balanced preset targets a sweet spot where file size drops significantly but the image still looks sharp."] },
    { id: "best-format-web", title: "Best format for web", paragraphs: ["JPG works for photographs with lots of color. PNG is best for icons, logos, and images needing transparency.", "WebP offers smaller files than both for browsers that support it."] },
    { id: "cms-integration", title: "Integration with CMS platforms", paragraphs: ["After compressing your images here, upload them to WordPress, Squarespace, Wix, or any CMS.", "No plugins or additional tools required — just smaller files from the start."] },
  ] },
  faq: { title: "Frequently Asked Questions", items: [
    { question: "What image size is ideal for websites?", answer: "For most web pages, images between 50 KB and 200 KB offer a good balance of quality and loading speed. Hero images can be up to 300–500 KB." },
    { question: "Should I use JPG, PNG, or WebP on my website?", answer: "Use JPG for photographs, PNG for graphics with transparency, and WebP for the best overall compression when browser support allows." },
    { question: "Does this tool help with Core Web Vitals?", answer: "Yes. Smaller images improve Largest Contentful Paint (LCP), one of Google's Core Web Vitals metrics." },
    { question: "Does this tool change image dimensions?", answer: "No. This tool only reduces file size. Dimensions stay the same." },
    { question: "Can I use this for a blog?", answer: "Absolutely. Compressing images before uploading to your blog reduces page load time and improves reader experience." },
  ] },
};

export const compressImageForInstagramPage: PageConfig = {
  slug: "compress-image-for-instagram",
  intent: "platform-instagram",
  section: "image-tools",
  navLabel: "Compress for Instagram",
  h1: "Compress Images for Instagram",
  meta: { title: "Compress Image for Instagram - Free", description: "Get images ready for Instagram without losing quality. Quick, private, browser-based compression." },
  hero: { subtitle: "Prepare your posts and stories for Instagram uploads — quick and private.", trustBadges: ["Free", "Instagram-ready", "Browser-based", "Private"] },
  tool: { ...IMAGE_COMPRESS_TOOL_DEFAULTS, mode: "browser-compression", title: "Instagram Image Compressor", subtitle: "Upload your image and compress it for smooth Instagram uploads." },
  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,
  seoContent: { blocks: [
    { id: "why-compress-instagram", title: "Why compress before uploading to Instagram", paragraphs: ["Instagram applies its own compression to every upload. Sending an already-compressed image reduces the chance of excessive quality loss during that processing step.", "Starting with a smaller, well-compressed file gives Instagram's encoder a cleaner input."] },
    { id: "instagram-formats", title: "Recommended formats for Instagram", paragraphs: ["JPG is the most compatible format for Instagram posts. For images with text overlays or flat graphics, PNG may preserve sharpness better before Instagram's re-compression."] },
  ] },
  faq: { title: "Frequently Asked Questions", items: [
    { question: "What is Instagram's image size limit?", answer: "Instagram recommends images between 1080×1080 and 1080×1350 pixels. Keeping file size under 8 MB ensures reliable uploads." },
    { question: "Does compressing affect Instagram image quality?", answer: "Instagram re-compresses uploads anyway. A well-compressed input can lead to a better final result than a raw uncompressed file." },
    { question: "Should I compress images for Instagram Stories?", answer: "Yes. Stories display at 1080×1920. Compressing beforehand speeds up uploading, especially on mobile data." },
  ] },
};

export const compressImageForWhatsappPage: PageConfig = {
  slug: "compress-image-for-whatsapp",
  intent: "platform-whatsapp",
  section: "image-tools",
  navLabel: "Compress for WhatsApp",
  h1: "Compress Images for WhatsApp",
  meta: { title: "Compress Image for WhatsApp - Free", description: "Make images lighter for WhatsApp sharing. Processed locally in your browser — fast and secure." },
  hero: { subtitle: "Send cleaner images on WhatsApp by compressing them before sharing.", trustBadges: ["Free", "WhatsApp-ready", "Local processing", "Secure"] },
  tool: { ...IMAGE_COMPRESS_TOOL_DEFAULTS, mode: "browser-compression", title: "WhatsApp Image Compressor", subtitle: "Upload an image and compress it for better WhatsApp quality." },
  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,
  seoContent: { blocks: [
    { id: "how-whatsapp-handles-images", title: "How WhatsApp handles images", paragraphs: ["WhatsApp aggressively compresses images to save bandwidth. By compressing your image before sharing, you control how the quality trade-off is made.", "Pre-compressed images often look better in chat than raw photos that WhatsApp compresses on its own."] },
    { id: "whatsapp-best-practices", title: "Best practices for WhatsApp images", paragraphs: ["Use JPG format for photos. Aim for a file size between 100 KB and 500 KB.", "This range keeps images clear in the chat without triggering extreme re-compression."] },
  ] },
  faq: { title: "Frequently Asked Questions", items: [
    { question: "Does WhatsApp compress images automatically?", answer: "Yes. WhatsApp applies heavy compression that can blur details. Pre-compressing with a controlled preset gives you more control over final quality." },
    { question: "What file size works best for WhatsApp?", answer: "WhatsApp accepts images up to 16 MB but compresses anything aggressively. Keeping images around 100–300 KB reduces the damage from WhatsApp's own compression." },
    { question: "Can I send images as documents to avoid compression?", answer: "Yes, but recipients must open them separately. Pre-compressing lets you share in the chat directly while keeping quality reasonable." },
  ] },
};

export const compressImageForShopifyPage: PageConfig = {
  slug: "compress-image-for-shopify",
  intent: "platform-shopify",
  section: "image-tools",
  navLabel: "Compress for Shopify",
  h1: "Compress Images for Shopify",
  meta: { title: "Compress Image for Shopify - Free Tool", description: "Speed up your Shopify store with compressed product images. Free, browser-based, no account needed." },
  hero: { subtitle: "Lighter product images mean faster store pages and better shopping experiences.", trustBadges: ["Free", "Shopify-ready", "Browser-based", "No signup"] },
  tool: { ...IMAGE_COMPRESS_TOOL_DEFAULTS, mode: "browser-compression", title: "Shopify Image Compressor", subtitle: "Upload a product image and compress it for faster Shopify pages." },
  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,
  seoContent: { blocks: [
    { id: "shopify-speed", title: "Why image speed matters for Shopify", paragraphs: ["Online shoppers expect pages to load in under 3 seconds. Product images are usually the largest assets on a Shopify store.", "Compressing them is the quickest way to improve load time and keep shoppers browsing."] },
    { id: "shopify-workflow", title: "Workflow for Shopify store owners", paragraphs: ["Compress each product image before uploading it through the Shopify admin. Use the Balanced preset for a good file-size-to-quality ratio.", "For hero banners and collection headers, try the Max preset to squeeze out extra savings."] },
    { id: "shopify-conversions", title: "Impact on conversions", paragraphs: ["Faster page loads lead to lower bounce rates and higher conversion rates. Compressed images directly contribute to this speed improvement."] },
  ] },
  faq: { title: "Frequently Asked Questions", items: [
    { question: "What image size does Shopify recommend?", answer: "Shopify suggests product images at 2048×2048 pixels. Keeping file size under 200 KB per image helps maintain fast page loads." },
    { question: "Does image compression affect Shopify SEO?", answer: "Yes, positively. Faster page loads from smaller images improve Core Web Vitals scores, which influence search rankings." },
    { question: "Which format should I use for Shopify products?", answer: "JPG works best for product photos. PNG is better for logos and graphics with transparent backgrounds." },
    { question: "Can I compress all my product images at once?", answer: "Currently the tool handles one image at a time. Batch processing for product catalogs is planned." },
  ] },
};

export const compressImageForDiscordPage: PageConfig = {
  slug: "compress-image-for-discord",
  intent: "platform-discord",
  section: "image-tools",
  navLabel: "Compress for Discord",
  h1: "Compress Images for Discord",
  meta: { title: "Compress Image for Discord - Free Tool", description: "Fit images within Discord upload limits. Browser-based compression, free, no login required." },
  hero: { subtitle: "Get images under Discord's file size cap without losing the details that matter.", trustBadges: ["Free", "Discord-friendly", "Private", "Instant"] },
  tool: { ...IMAGE_COMPRESS_TOOL_DEFAULTS, mode: "browser-compression", title: "Discord Image Compressor", subtitle: "Upload an image and compress it to fit Discord's file size limits." },
  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,
  seoContent: { blocks: [
    { id: "discord-limits", title: "Discord file sharing limits", paragraphs: ["Free Discord accounts can share files up to 25 MB per message. For channels with active sharing, compressed images keep chat loading fast.", "Smaller files also reduce mobile data usage for other members in the server."] },
    { id: "when-compress-discord", title: "When to compress for Discord", paragraphs: ["Compress before sharing when you have screenshots larger than a few MB, batch meme images, or photos from a high-resolution camera.", "For quick screenshots under 1 MB, compression is usually not necessary."] },
  ] },
  faq: { title: "Frequently Asked Questions", items: [
    { question: "What is Discord's file size limit?", answer: "Free Discord users can upload files up to 25 MB. Nitro subscribers get up to 500 MB. Compressing images helps fit more into the free limit." },
    { question: "Does Discord compress uploaded images?", answer: "Discord may resize very large images for previews, but it does not aggressively re-compress them like some messaging apps." },
    { question: "What format works best for Discord?", answer: "PNG preserves sharpness for screenshots and memes. JPG works well for photos and saves more space." },
  ] },
};

export const compressImageForLinkedinPage: PageConfig = {
  slug: "compress-image-for-linkedin",
  intent: "platform-linkedin",
  section: "image-tools",
  navLabel: "Compress for LinkedIn",
  h1: "Compress Images for LinkedIn",
  meta: { title: "Compress Image for LinkedIn - Free", description: "Prepare images for LinkedIn posts and articles. Free browser compression — no uploads to our servers." },
  hero: { subtitle: "Professional-looking posts start with well-compressed images that load instantly in the feed.", trustBadges: ["Free", "LinkedIn-ready", "Browser-only", "No account"] },
  tool: { ...IMAGE_COMPRESS_TOOL_DEFAULTS, mode: "browser-compression", title: "LinkedIn Image Compressor", subtitle: "Upload an image and compress it for polished LinkedIn posts." },
  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,
  seoContent: { blocks: [
    { id: "linkedin-engagement", title: "Images and LinkedIn engagement", paragraphs: ["Posts with images get significantly more views than text-only updates. Well-compressed images load faster in the feed, making viewers more likely to stop and read.", "A crisp, quick-loading image signals professionalism and attention to detail."] },
    { id: "linkedin-settings", title: "Recommended settings for LinkedIn", paragraphs: ["Use JPG for photos and the Balanced preset. For infographics with text, try PNG to keep lettering crisp.", "Aim for under 500 KB per image — fast enough to render instantly in the mobile app."] },
  ] },
  faq: { title: "Frequently Asked Questions", items: [
    { question: "What image size does LinkedIn recommend?", answer: "LinkedIn suggests 1200×627 pixels for shared posts and up to 1128×376 for company page banners. Keeping files under 5 MB ensures reliable uploads." },
    { question: "Does image quality matter on LinkedIn?", answer: "Yes. Blurry or pixelated images reduce engagement. The Balanced preset keeps images sharp while cutting file size." },
    { question: "Can I compress images for LinkedIn articles?", answer: "Yes. Article header images benefit from compression too — faster loading keeps readers on the page." },
  ] },
};

export const pages: PageConfig[] = [
  compressImageForEmailPage,
  compressImageForWebsitePage,
  compressImageForInstagramPage,
  compressImageForWhatsappPage,
  compressImageForShopifyPage,
  compressImageForDiscordPage,
  compressImageForLinkedinPage,
];
