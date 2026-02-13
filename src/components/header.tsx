"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { NavSection } from "@/core/types";

type HeaderProps = {
  brandLabel: string;
  brandHref: string;
  navSections: readonly NavSection[];
};

export function Header({ brandLabel, brandHref, navSections }: HeaderProps) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const closeAll = useCallback(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        closeAll();
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAll();
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [closeAll]);

  const toggleDropdown = (index: number) => {
    setOpenDropdown((prev) => (prev === index ? null : index));
  };

  const toggleMobile = () => {
    setMobileOpen((prev) => !prev);
    setOpenDropdown(null);
  };

  return (
    <header className="site-header" ref={headerRef}>
      <div className="header-inner">
        <Link className="header-brand" href={brandHref}>
          <span className="brand-mark" aria-hidden="true">C</span>
          {brandLabel}
        </Link>

        <nav aria-label="Main navigation" className="desktop-nav">
          {navSections.map((section, index) => (
            <div className="nav-dropdown" key={section.id}>
              <button
                aria-expanded={openDropdown === index}
                className={`nav-trigger${openDropdown === index ? " nav-trigger-active" : ""}`}
                onClick={() => toggleDropdown(index)}
                type="button"
              >
                {section.label}
                <svg
                  aria-hidden="true"
                  className={`nav-chevron${openDropdown === index ? " nav-chevron-open" : ""}`}
                  fill="none"
                  height="14"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="14"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div
                className={`dropdown-menu${openDropdown === index ? " dropdown-menu-open" : ""}`}
              >
                {section.items.map((item) => (
                  <Link
                    className="dropdown-item"
                    href={item.href}
                    key={item.href}
                    onClick={closeAll}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <button
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="mobile-toggle"
          onClick={toggleMobile}
          type="button"
        >
          <span
            className={`hamburger-line hamburger-top${mobileOpen ? " hamburger-open-top" : ""}`}
          />
          <span
            className={`hamburger-line hamburger-mid${mobileOpen ? " hamburger-open-mid" : ""}`}
          />
          <span
            className={`hamburger-line hamburger-bot${mobileOpen ? " hamburger-open-bot" : ""}`}
          />
        </button>
      </div>

      {mobileOpen && (
        <nav aria-label="Main navigation" className="mobile-nav">
          {navSections.map((section, index) => (
            <div className="mobile-nav-group" key={section.id}>
              <button
                className="mobile-nav-trigger"
                onClick={() => toggleDropdown(index)}
                type="button"
              >
                <span>{section.label}</span>
                <svg
                  aria-hidden="true"
                  className={`nav-chevron${openDropdown === index ? " nav-chevron-open" : ""}`}
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="16"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {openDropdown === index && (
                <div className="mobile-nav-items">
                  {section.items.map((item) => (
                    <Link
                      className="mobile-nav-link"
                      href={item.href}
                      key={item.href}
                      onClick={closeAll}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}
