"use client";

import { startTransition, useDeferredValue, useState } from "react";
import { BuildCanvas } from "@/components/build-canvas";
import {
  categoryLabels,
  categoryOrder,
  defaultSelections,
  getPartsByCategory,
  partsCatalog
} from "@/lib/data/parts";
import {
  displayBuildMetrics,
  displayPartSpecs,
  displayScenario,
  fToC,
  lbToKg
} from "@/lib/display";
import { evaluateBuild, resolveSelection } from "@/lib/physics";
import {
  BuildSelection,
  ConfigTarget,
  Part,
  PartCategory,
  Platform,
  Scenario
} from "@/lib/types";

function activePlatformFromSelection(selection: BuildSelection): Platform {
  const frameId = selection.frame;
  const frame = partsCatalog.find((part) => part.id === frameId);
  return frame?.platforms[0] ?? "bike";
}

function compactSpecs(category: PartCategory, part: Part) {
  return displayPartSpecs(category, part).join(", ");
}

function ResultRow({
  active,
  category,
  part,
  onClick
}: {
  active: boolean;
  category: PartCategory;
  part: Part;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border-b border-[var(--line-soft)] px-4 py-3 text-left transition ${
        active ? "bg-[var(--accent-soft)]" : "bg-transparent hover:bg-[var(--panel-2)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[var(--ink)]">{part.name}</div>
          <div className="mt-1 text-sm text-[var(--muted)]">
            {categoryLabels[category]} / {part.brand}
          </div>
          <div className="mt-1 text-xs text-[var(--muted)]">{compactSpecs(category, part)}</div>
        </div>
        <div className="shrink-0 text-sm font-medium text-[var(--ink)]">${part.priceUsd}</div>
      </div>
    </button>
  );
}

export function BuildStudio() {
  const [selection, setSelection] = useState<BuildSelection>(defaultSelections.bike);
  const [scenario, setScenario] = useState<Scenario>({
    riderMassKg: 82,
    cargoMassKg: 0,
    ambientTempC: 20
  });
  const [activeTarget, setActiveTarget] = useState<ConfigTarget>("motor");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const activePlatform = activePlatformFromSelection(selection);
  const chosenParts = resolveSelection(selection);
  const metrics = evaluateBuild(activePlatform, selection, scenario);
  const displayMetrics = displayBuildMetrics(metrics);
  const displayInputs = displayScenario(scenario);
  const totalPrice = Object.values(chosenParts).reduce((sum, part) => sum + part.priceUsd, 0);

  const partOptions =
    activeTarget === "riderMass" || activeTarget === "ambientTemperature"
      ? []
      : activeTarget === "frame"
        ? partsCatalog.filter((part) => part.category === "frame")
        : getPartsByCategory(activePlatform, activeTarget);

  const searchResults = partsCatalog.filter((part) => {
    const query = deferredSearch.trim().toLowerCase();

    if (!query) {
      return false;
    }

    const compatible = part.category === "frame" || part.platforms.includes(activePlatform);
    if (!compatible) {
      return false;
    }

    return [part.name, part.brand, part.description, categoryLabels[part.category]]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  function updateSelection(category: PartCategory, partId: string) {
    const selectedPart = partsCatalog.find((part) => part.id === partId);
    if (!selectedPart) {
      return;
    }

    startTransition(() => {
      if (category === "frame") {
        const nextPlatform = selectedPart.platforms[0] ?? "bike";
        setSelection({
          ...defaultSelections[nextPlatform],
          frame: partId
        });
        return;
      }

      setSelection((current) => ({
        ...current,
        [category]: partId
      }));
    });
  }

  function updateScenario(key: keyof Scenario, value: number) {
    setScenario((current) => ({
      ...current,
      [key]: value
    }));
  }

  const showSearch = activeTarget !== "riderMass" && activeTarget !== "ambientTemperature";

  return (
    <section className="mx-auto h-[calc(100vh-2rem)] w-full max-w-[1600px] p-4">
      <div className="grid h-full gap-4 lg:grid-cols-[320px_minmax(0,1fr)_300px]">
        <aside className="grid min-h-0 grid-rows-[auto_auto_1fr] border border-[var(--line)] bg-[var(--panel)]">
          <div className="border-b border-[var(--line)] px-4 py-4">
            <div className="text-lg font-semibold tracking-[-0.02em] text-[var(--ink)]">Configuration</div>
          </div>

          <div className="border-b border-[var(--line)] px-4 py-4">
            {showSearch ? (
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search parts"
                className="w-full border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
              />
            ) : (
              <div className="text-sm text-[var(--muted)]">Edit setup values.</div>
            )}

            <div className="mt-4 space-y-4">
              <div>
                <div className="mb-2 font-mono text-[11px] tracking-[0.14em] text-[var(--muted)]">Components</div>
                <div className="grid gap-1">
                  {categoryOrder.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveTarget(category)}
                      className={`flex items-center justify-between px-3 py-2 text-left text-sm transition ${
                        activeTarget === category
                          ? "bg-[var(--ink)] text-white"
                          : "bg-[var(--panel-2)] text-[var(--ink)]"
                      }`}
                    >
                      <span>{categoryLabels[category]}</span>
                      <span className={activeTarget === category ? "text-white/70" : "text-[var(--muted)]"}>
                        {chosenParts[category].brand}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 font-mono text-[11px] tracking-[0.14em] text-[var(--muted)]">Environment</div>
                <div className="grid gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTarget("riderMass")}
                    className={`flex items-center justify-between px-3 py-2 text-left text-sm transition ${
                      activeTarget === "riderMass"
                        ? "bg-[var(--ink)] text-white"
                        : "bg-[var(--panel-2)] text-[var(--ink)]"
                    }`}
                  >
                    <span>Rider mass</span>
                    <span className={activeTarget === "riderMass" ? "text-white/70" : "text-[var(--muted)]"}>
                      {displayInputs.riderMassLb} lb
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTarget("ambientTemperature")}
                    className={`flex items-center justify-between px-3 py-2 text-left text-sm transition ${
                      activeTarget === "ambientTemperature"
                        ? "bg-[var(--ink)] text-white"
                        : "bg-[var(--panel-2)] text-[var(--ink)]"
                    }`}
                  >
                    <span>Ambient temperature</span>
                    <span className={activeTarget === "ambientTemperature" ? "text-white/70" : "text-[var(--muted)]"}>
                      {displayInputs.ambientTempF} F
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-0 overflow-auto">
            {activeTarget === "riderMass" ? (
              <div className="p-4">
                <div className="text-sm text-[var(--muted)]">Rider mass (lb)</div>
                <input
                  type="number"
                  min={88}
                  max={397}
                  value={displayInputs.riderMassLb}
                  onChange={(event) => updateScenario("riderMassKg", lbToKg(Number(event.target.value)))}
                  className="mt-2 w-full border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                />
              </div>
            ) : activeTarget === "ambientTemperature" ? (
              <div className="p-4">
                <div className="text-sm text-[var(--muted)]">Ambient temperature (F)</div>
                <input
                  type="number"
                  min={14}
                  max={113}
                  value={displayInputs.ambientTempF}
                  onChange={(event) => updateScenario("ambientTempC", fToC(Number(event.target.value)))}
                  className="mt-2 w-full border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                />
              </div>
            ) : (
              <div className="divide-y divide-[var(--line-soft)]">
                {(deferredSearch ? searchResults : partOptions).map((part) => (
                  <ResultRow
                    key={part.id}
                    active={selection[part.category] === part.id}
                    category={part.category}
                    part={part}
                    onClick={() => {
                      setActiveTarget(part.category);
                      updateSelection(part.category, part.id);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>

        <BuildCanvas
          activeTarget={activeTarget}
          ambientTempF={displayInputs.ambientTempF}
          riderMassLb={displayInputs.riderMassLb}
          parts={chosenParts}
        />

        <aside className="grid min-h-0 grid-rows-[auto_auto_1fr_auto] overflow-hidden border border-[var(--line)] bg-[linear-gradient(180deg,#0f172a_0%,#172135_100%)] text-white">
          <div className="border-b border-white/10 px-4 py-4">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Performance</h2>
          </div>

          <div className="grid grid-cols-2 gap-px border-b border-white/10 bg-white/10">
            <div className="bg-transparent px-4 py-4">
              <div className="text-xs text-white/55">Cost</div>
              <div className="mt-1 text-lg font-semibold">${totalPrice.toLocaleString()}</div>
            </div>
            <div className="bg-transparent px-4 py-4">
              <div className="text-xs text-white/55">Top speed</div>
              <div className="mt-1 text-lg font-semibold">{displayMetrics.topSpeedMph} mph</div>
            </div>
            <div className="bg-transparent px-4 py-4">
              <div className="text-xs text-white/55">Range</div>
              <div className="mt-1 text-lg font-semibold">{displayMetrics.rangeMi} mi</div>
            </div>
            <div className="bg-transparent px-4 py-4">
              <div className="text-xs text-white/55">Weight</div>
              <div className="mt-1 text-lg font-semibold">{displayMetrics.totalMassLb} lb</div>
            </div>
          </div>

          <div className="min-h-0 overflow-auto">
            {displayMetrics.bars.map((metric) => (
              <div key={metric.key} className="border-b border-white/8 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-white/70">{metric.label}</div>
                  <div className="text-sm font-semibold text-white">
                    {metric.value} <span className="text-xs font-normal text-white/55">{metric.unit}</span>
                  </div>
                </div>
                <div className="mt-2 h-1.5 bg-white/10">
                  <div
                    className="h-full bg-[linear-gradient(90deg,#5eead4_0%,#22d3ee_100%)]"
                    style={{ width: `${metric.percent * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {metrics.notes.length > 0 ? (
            <div className="border-t border-white/10 px-4 py-4 text-sm text-white/70">
              {metrics.notes[0]}
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
