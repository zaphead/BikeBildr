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

type SelectorSurface = "index" | "detail";

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
  const [selectorSurface, setSelectorSurface] = useState<SelectorSurface>("index");
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

  function openTarget(target: ConfigTarget) {
    setActiveTarget(target);
    setSearch("");
    setSelectorSurface("detail");
  }

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

  return (
    <section className="mx-auto h-[calc(100vh-2rem)] w-full max-w-[1600px] p-4">
      <div className="grid h-full gap-4 lg:grid-cols-[320px_minmax(0,1fr)_300px]">
        <aside className="grid min-h-0 grid-rows-[auto_1fr] border border-[var(--line)] bg-[var(--panel)]">
          <div className="border-b border-[var(--line)] px-4 py-4">
            <div className="text-lg font-semibold tracking-[-0.02em] text-[var(--ink)]">Configuration</div>
          </div>

          <div className="min-h-0 overflow-auto">
            {selectorSurface === "index" ? (
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 text-sm font-medium text-[var(--muted)]">Components</div>
                    <div className="grid gap-1">
                      {categoryOrder.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => openTarget(category)}
                          className="flex items-center justify-between border border-[var(--line-soft)] bg-[var(--panel-2)] px-3 py-3 text-left transition hover:border-[var(--line)]"
                        >
                          <span className="text-sm text-[var(--ink)]">{categoryLabels[category]}</span>
                          <span className="text-sm text-[var(--muted)]">{chosenParts[category].brand}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 text-sm font-medium text-[var(--muted)]">Environment</div>
                    <div className="grid gap-1">
                      <button
                        type="button"
                        onClick={() => openTarget("riderMass")}
                        className="flex items-center justify-between border border-[var(--line-soft)] bg-[var(--panel-2)] px-3 py-3 text-left transition hover:border-[var(--line)]"
                      >
                        <span className="text-sm text-[var(--ink)]">Rider mass</span>
                        <span className="text-sm text-[var(--muted)]">{displayInputs.riderMassLb} lb</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openTarget("ambientTemperature")}
                        className="flex items-center justify-between border border-[var(--line-soft)] bg-[var(--panel-2)] px-3 py-3 text-left transition hover:border-[var(--line)]"
                      >
                        <span className="text-sm text-[var(--ink)]">Ambient temperature</span>
                        <span className="text-sm text-[var(--muted)]">{displayInputs.ambientTempF} F</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid min-h-0 grid-rows-[auto_1fr]">
                <div className="border-b border-[var(--line)] p-4">
                  <button
                    type="button"
                    onClick={() => setSelectorSurface("index")}
                    className="text-sm text-[var(--muted)] transition hover:text-[var(--ink)]"
                  >
                    Back
                  </button>
                  <div className="mt-3 text-base font-semibold text-[var(--ink)]">
                    {activeTarget === "riderMass"
                      ? "Rider mass"
                      : activeTarget === "ambientTemperature"
                        ? "Ambient temperature"
                        : categoryLabels[activeTarget]}
                  </div>
                  {activeTarget !== "riderMass" && activeTarget !== "ambientTemperature" ? (
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search parts"
                      className="mt-3 w-full border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                    />
                  ) : null}
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
                          onClick={() => updateSelection(part.category, part.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
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

        <aside className="grid min-h-0 grid-rows-[auto_auto_1fr_auto] overflow-hidden border border-[var(--line)] bg-[var(--panel)]">
          <div className="border-b border-[var(--line)] px-4 py-4">
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--ink)]">Performance</h2>
          </div>

          <div className="grid grid-cols-2 gap-px border-b border-[var(--line)] bg-[var(--line)]">
            <div className="bg-[var(--panel-2)] px-4 py-4">
              <div className="text-sm text-[var(--muted)]">Cost</div>
              <div className="mt-1 text-lg font-semibold text-[var(--ink)]">${totalPrice.toLocaleString()}</div>
            </div>
            <div className="bg-[var(--panel-2)] px-4 py-4">
              <div className="text-sm text-[var(--muted)]">Top speed</div>
              <div className="mt-1 text-lg font-semibold text-[var(--ink)]">{displayMetrics.topSpeedMph} mph</div>
            </div>
            <div className="bg-[var(--panel-2)] px-4 py-4">
              <div className="text-sm text-[var(--muted)]">Range</div>
              <div className="mt-1 text-lg font-semibold text-[var(--ink)]">{displayMetrics.rangeMi} mi</div>
            </div>
            <div className="bg-[var(--panel-2)] px-4 py-4">
              <div className="text-sm text-[var(--muted)]">Weight</div>
              <div className="mt-1 text-lg font-semibold text-[var(--ink)]">{displayMetrics.totalMassLb} lb</div>
            </div>
          </div>

          <div className="min-h-0 overflow-auto">
            {displayMetrics.bars.map((metric) => (
              <div key={metric.key} className="border-b border-[var(--line-soft)] px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-[var(--muted)]">{metric.label}</div>
                  <div className="text-sm font-semibold text-[var(--ink)]">
                    {metric.value} <span className="text-xs font-normal text-[var(--muted)]">{metric.unit}</span>
                  </div>
                </div>
                <div className="mt-2 h-1.5 bg-[var(--panel-3)]">
                  <div
                    className="h-full bg-[linear-gradient(90deg,#0f7c82_0%,#35a7b4_100%)]"
                    style={{ width: `${metric.percent * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {metrics.notes.length > 0 ? (
            <div className="border-t border-[var(--line)] px-4 py-4 text-sm text-[var(--muted)]">
              {metrics.notes[0]}
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
