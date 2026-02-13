// Pages
export { allPages, getPageBySlug } from "@/core/config/pages.config";

// Navigation
export { navSections, BRAND } from "@/core/config/navigation";

// Shared defaults
export { FOOTER_DEFAULTS } from "@/core/config/defaults";

// Types (re-export for convenience)
export type {
  PageConfig,
  NavSection,
  ToolIntent,
  ToolKind,
  ToolMode,
  NavSectionId,
  ToolExecutionResult,
} from "@/core/types";
