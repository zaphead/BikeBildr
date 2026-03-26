import { displayPartSpecs } from "@/lib/display";
import { ConfigTarget, Part, PartCategory } from "@/lib/types";

type BuildCanvasProps = {
  activeTarget: ConfigTarget;
  ambientTempF: number;
  riderMassLb: number;
  parts: {
    frame: Part;
    frontWheel: Part;
    rearWheel: Part;
    motor: Part;
    battery: Part;
    controller: Part;
    driveKit: Part;
  };
};

const orderedCategories: PartCategory[] = [
  "frame",
  "frontWheel",
  "rearWheel",
  "motor",
  "battery",
  "controller",
  "driveKit"
];

const categoryLabel: Record<PartCategory, string> = {
  frame: "Frame",
  frontWheel: "Front wheels",
  rearWheel: "Rear wheels",
  motor: "Motor",
  battery: "Battery",
  controller: "Controller",
  driveKit: "Drive kit"
};

function focusPanel({
  activeTarget,
  parts,
  riderMassLb,
  ambientTempF
}: BuildCanvasProps) {
  if (activeTarget === "riderMass") {
    return {
      eyebrow: "Configuration",
      title: "Rider mass",
      subtitle: `${riderMassLb} lb`,
      chips: ["Mass input", "Affects weight and payload"]
    };
  }

  if (activeTarget === "ambientTemperature") {
    return {
      eyebrow: "Configuration",
      title: "Ambient temperature",
      subtitle: `${ambientTempF} F`,
      chips: ["Thermal condition", "Affects battery output"]
    };
  }

  const part = parts[activeTarget];

  return {
    eyebrow: categoryLabel[activeTarget],
    title: part.name,
    subtitle: part.brand,
    chips: displayPartSpecs(activeTarget, part)
  };
}

export function BuildCanvas(props: BuildCanvasProps) {
  const focus = focusPanel(props);

  return (
    <section className="overflow-hidden border border-[var(--line)] bg-[var(--panel)]">
      <div className="border-b border-[var(--line)] bg-[linear-gradient(135deg,#0f172a_0%,#162033_100%)] px-5 py-5 text-white">
        <div className="font-mono text-[11px] tracking-[0.16em] text-[#8eb7c7]">{focus.eyebrow}</div>
        <div className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{focus.title}</div>
        <div className="mt-1 text-sm text-[#c7d3df]">{focus.subtitle}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {focus.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#d9e4ec]"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-[var(--line-soft)] md:grid-cols-[170px_minmax(0,1fr)_260px] md:divide-x md:divide-y-0">
        <div className="bg-[var(--panel-2)] px-5 py-4">
          <div className="font-mono text-[11px] tracking-[0.14em] text-[var(--muted)]">System</div>
          <div className="mt-3 grid gap-3">
            {orderedCategories.map((category) => (
              <div
                key={category}
                className={`border-l-2 pl-3 ${
                  props.activeTarget === category ? "border-[var(--accent)]" : "border-transparent"
                }`}
              >
                <div className="text-sm text-[var(--muted)]">{categoryLabel[category]}</div>
                <div className="text-sm font-medium text-[var(--ink)]">{props.parts[category].brand}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-4">
          <div className="grid gap-0">
            {orderedCategories.map((category) => {
              const part = props.parts[category];
              const specs = displayPartSpecs(category, part);

              return (
                <div
                  key={category}
                  className={`grid gap-2 border-b border-[var(--line-soft)] py-4 last:border-b-0 md:grid-cols-[140px_minmax(0,1fr)_220px] ${
                    props.activeTarget === category ? "bg-[var(--accent-soft)]/60 -mx-5 px-5" : ""
                  }`}
                >
                  <div className="text-sm text-[var(--muted)]">{categoryLabel[category]}</div>
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold text-[var(--ink)]">{part.name}</div>
                    <div className="text-sm text-[var(--muted)]">{part.brand}</div>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--ink-soft)]">
                    {specs.map((spec) => (
                      <span key={spec}>{spec}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[var(--panel-2)] px-5 py-4">
          <div className="font-mono text-[11px] tracking-[0.14em] text-[var(--muted)]">Configuration</div>
          <div className="mt-3 grid gap-4">
            <div>
              <div className="text-sm text-[var(--muted)]">Rider mass</div>
              <div className="mt-1 text-lg font-semibold text-[var(--ink)]">{props.riderMassLb} lb</div>
            </div>
            <div>
              <div className="text-sm text-[var(--muted)]">Ambient temperature</div>
              <div className="mt-1 text-lg font-semibold text-[var(--ink)]">{props.ambientTempF} F</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
