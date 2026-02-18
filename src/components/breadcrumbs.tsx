import Link from "next/link";
import type { PageConfig } from "@/core/types";
import { SECTION_META } from "@/core/config/navigation";

type Props = {
  config: PageConfig;
};

export function Breadcrumbs({ config }: Props) {
  const sectionLabel = SECTION_META[config.section]?.label ?? config.section;

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link className="breadcrumb-link" href="/">
            Home
          </Link>
        </li>
        <li className="breadcrumb-separator" aria-hidden="true">
          /
        </li>
        <li className="breadcrumb-item">
          <span className="breadcrumb-text">{sectionLabel}</span>
        </li>
        <li className="breadcrumb-separator" aria-hidden="true">
          /
        </li>
        <li className="breadcrumb-item breadcrumb-current" aria-current="page">
          {config.navLabel}
        </li>
      </ol>
    </nav>
  );
}
