import type { ToolPageConfig } from "@/tool-page/types";

type AdSlotProps = {
  config: ToolPageConfig["adSlot"];
};

export function AdSlot({ config }: AdSlotProps) {
  return (
    <section className="card">
      <h2>{config.title}</h2>
      <div className="ad-slot-placeholder">{config.placeholder}</div>
    </section>
  );
}
