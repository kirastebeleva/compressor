export async function register() {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export async function onRequestError(...args: unknown[]) {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const Sentry = await import("@sentry/nextjs");
  return (Sentry.captureRequestError as (...event: unknown[]) => unknown)(...args);
}
