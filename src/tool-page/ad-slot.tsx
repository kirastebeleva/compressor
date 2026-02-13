import type { PageConfig } from "@/tool-page/types";

type AdSlotProps = {
  config: PageConfig["adSlot"];
};

export function AdSlot({ config }: AdSlotProps) {
  return (
    <section className="card ad-slot-card">
      <h2 className="section-title">{config.title}</h2>
      <div className="ad-slot-placeholder">{config.placeholder}</div>
    </section>
  );
}
