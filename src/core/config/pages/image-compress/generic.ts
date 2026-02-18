import type { PageConfig } from "@/core/types";
import {
  IMAGE_COMPRESS_TOOL_DEFAULTS,
  RESULTS_DEFAULTS,
  AD_SLOT_DEFAULTS,
} from "@/core/config/defaults";

export const freeImageCompressorPage: PageConfig = {
  slug: "free-image-compressor",
  intent: "generic-free",
  section: "image-tools",
  navLabel: "Free Image Compressor",
  h1: "Free Image Compressor",
  meta: { title: "Free Image Compressor - No Signup Needed", description: "Compress JPG, PNG, and WebP images at no cost. Everything runs in your browser — private and instant." },
  hero: { subtitle: "No hidden fees, no signups, no file uploads — just fast image compression in your browser.", trustBadges: ["100% free", "No signup", "Private", "Browser-based"] },
  tool: { ...IMAGE_COMPRESS_TOOL_DEFAULTS, mode: "browser-compression", title: "Free Image Compressor", subtitle: "Drop an image here and compress it completely free of charge." },
  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,
  seoContent: { blocks: [
    { id: "why-free", title: "What makes this compressor free", paragraphs: ["Traditional image compressors upload files to a server for processing, which costs money to operate. This tool runs entirely in your browser, eliminating server-side costs.", "There is no premium paywall for basic compression features."] },
    { id: "supported-formats-free", title: "Supported formats", paragraphs: ["The compressor handles JPG, PNG, and WebP images. Your file is compressed and returned in the same format — no unwanted conversions."] },
    { id: "privacy-free", title: "Privacy without compromise", paragraphs: ["Your image files are processed locally on your device. They are never uploaded, cached, or stored on any remote server.", "When you close the tab, the data is gone."] },
  ] },
  faq: { title: "Frequently Asked Questions", items: [
    { question: "Is this compressor really free?", answer: "Yes. The tool is completely free with no premium tier required for basic compression. Your images are processed locally without server costs." },
    { question: "Why is it free?", answer: "Processing happens in your browser using your device's resources, so there are no server costs to pass along." },
    { question: "Are there any limits?", answer: "You can compress one file at a time, up to 10 MB. There is no daily usage cap." },
    { question: "Do you collect data from my images?", answer: "No. Your files never leave your device. We do not see, store, or log any image data." },
  ] },
};

export const onlineImageCompressorPage: PageConfig = {
  slug: "online-image-compressor",
  intent: "generic-online",
  section: "image-tools",
  navLabel: "Online Image Compressor",
  h1: "Online Image Compressor",
  meta: { title: "Online Image Compressor - Fast & Free", description: "Compress images online without installing software. Works on any device with a modern browser." },
  hero: { subtitle: "Open your browser, drop an image, and download a smaller version — no software needed.", trustBadges: ["Free", "Works on any device", "No install", "Fast"] },
  tool: { ...IMAGE_COMPRESS_TOOL_DEFAULTS, mode: "browser-compression", title: "Online Image Compressor", subtitle: "Upload any image and compress it instantly — works on desktop and mobile." },
  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,
  seoContent: { blocks: [
    { id: "why-online", title: "Why use an online compressor", paragraphs: ["Online tools eliminate the need for desktop software. You get the same result from any device, any operating system, without managing installations or updates.", "Just open the page and start compressing."] },
    { id: "how-online-works", title: "How it works", paragraphs: ["Your browser handles the entire compression process using efficient client-side code. The image never leaves your device.", "It is processed in memory and offered for download immediately."] },
  ] },
  faq: { title: "Frequently Asked Questions", items: [
    { question: "Do I need to install software to compress images?", answer: "No. This tool runs in your web browser. There is nothing to download or install." },
    { question: "Does it work on phones and tablets?", answer: "Yes. The compressor works on any device with a modern browser, including iPhones, Android phones, and tablets." },
    { question: "How fast is the compression?", answer: "Most images are processed in under a second. Larger files may take a few seconds depending on your device." },
    { question: "Can I use this tool offline?", answer: "The tool needs an initial page load from the internet, but after that compression happens locally even if your connection drops." },
  ] },
};

export const pages: PageConfig[] = [
  freeImageCompressorPage,
  onlineImageCompressorPage,
];
