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
      label: "Rider mass",
      value: `${riderMassLb} lb`,
      specs: ["Mass input", "Affects total weight", "Affects payload headroom"]
    };
  }

  if (activeTarget === "ambientTemperature") {
    return {
      label: "Ambient temperature",
      value: `${ambientTempF} F`,
      specs: ["Thermal condition", "Affects battery output"]
    };
  }

  const part = parts[activeTarget];

  return {
    label: categoryLabel[activeTarget],
    value: `${part.name} / ${part.brand}`,
    specs: displayPartSpecs(activeTarget, part)
  };
}

export function BuildCanvas(props: BuildCanvasProps) {
  const focus = focusPanel(props);

  return (
    <section className="overflow-hidden border border-[var(--line)] bg-[var(--panel)]">
      <div className="border-b border-[var(--line)] bg-[var(--panel-2)] px-5 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm text-[var(--muted)]">{focus.label}</div>
            <div className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-[var(--ink)]">
              {focus.value}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {focus.specs.map((spec) => (
              <span
                key={spec}
                className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs text-[var(--ink-soft)]"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-[var(--line-soft)] md:grid-cols-[minmax(0,1fr)_240px] md:divide-x md:divide-y-0">
        <div className="px-5 py-4">
          <div className="grid gap-0">
            {orderedCategories.map((category) => {
              const part = props.parts[category];
              const specs = displayPartSpecs(category, part);
              const active = props.activeTarget === category;

              return (
                <div
                  key={category}
                  className={`grid gap-2 border-b border-[var(--line-soft)] py-4 last:border-b-0 md:grid-cols-[150px_minmax(0,1fr)_220px] ${
                    active ? "bg-[var(--accent-soft)]/60 -mx-5 px-5" : ""
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
          <div className="text-sm text-[var(--muted)]">Configuration</div>
          <div className="mt-4 grid gap-4">
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
