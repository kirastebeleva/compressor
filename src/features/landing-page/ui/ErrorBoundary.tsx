"use client";

import { Component, type ReactNode } from "react";
import Link from "next/link";

type Props = { children: ReactNode; slug?: string };
type State = { hasError: boolean };

export class LandingErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(
      `[LandingErrorBoundary] Render failure${this.props.slug ? ` on /${this.props.slug}` : ""}:`,
      error,
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <main>
          <section className="hero">
            <h1 className="page-title">Something went wrong</h1>
            <p className="hero-subtitle">
              This page could not be rendered. Please try again or visit another
              tool.
            </p>
          </section>
          <section className="card" style={{ textAlign: "center" }}>
            <Link className="btn btn-compress" href="/">
              Go to homepage
            </Link>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
