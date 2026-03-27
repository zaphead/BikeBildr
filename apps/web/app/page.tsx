"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { cn } from "@workspace/ui/lib/utils"

type Metric = {
  label: string
  value: string
  score: number
  lowerBound: string
  upperBound: string
  tone?: "warn"
}

type PartCard = {
  category: string
  selectedName: string
  price: string
  specs: {
    label: string
    value: string
  }[]
}

const stats = [
  { label: "Material Cost", value: "$4,850" },
  { label: "Weight", value: "182 lb" },
]

const metricGroups: Metric[][] = [
  [
    { label: "Top Speed", value: "47 mph", score: 78, lowerBound: "0 mph", upperBound: "60 mph" },
    { label: "0-30", value: "3.8 s", score: 81, lowerBound: "10 s", upperBound: "2 s" },
  ],
  [
    { label: "Max Grade at 10mph", value: "19%", score: 62, lowerBound: "0%", upperBound: "30%" },
    { label: "Torque at Wheel", value: "128 Nm", score: 88, lowerBound: "0 Nm", upperBound: "150 Nm" },
  ],
  [
    { label: "Peak Power", value: "8.4 kW", score: 84, lowerBound: "0 kW", upperBound: "10 kW" },
    { label: "Continuous Max Power", value: "5.7 kW", score: 67, lowerBound: "0 kW", upperBound: "8 kW" },
  ],
  [
    { label: "Power to Weight Ratio", value: "46.2 W/lb", score: 73, lowerBound: "0 W/lb", upperBound: "60 W/lb" },
    { label: "Curb Weight", value: "196 lb", score: 41, lowerBound: "320 lb", upperBound: "120 lb" },
  ],
  [
    { label: "Overheat Risk", value: "Low", score: 26, lowerBound: "Low", upperBound: "High", tone: "warn" },
    { label: "Liklihood of cops getting yo ahh", value: "Medium", score: 58, lowerBound: "Low", upperBound: "High", tone: "warn" },
  ],
  [{ label: "Fun Factor (0-10)", value: "8.8", score: 88, lowerBound: "0 pts", upperBound: "10 pts" }],
]

const selectedParts: PartCard[] = [
  {
    category: "Motor",
    selectedName: "QS 138 90H",
    price: "$890",
    specs: [
      { label: "Continuous", value: "5.5 kW" },
      { label: "Peak", value: "8.2 kW" },
      { label: "Max RPM @ 72V", value: "6,200 rpm" },
    ],
  },
  {
    category: "Controller",
    selectedName: "Fardriver ND72680",
    price: "$420",
    specs: [
      { label: "Cont. Batt / Phase", value: "180A / 420A" },
      { label: "Peak Batt / Phase", value: "240A / 520A" },
      { label: "Interface", value: "CAN + BT" },
    ],
  },
  {
    category: "Battery",
    selectedName: "72V 40Ah Molicel Pack",
    price: "$1,480",
    specs: [
      { label: "Volts", value: "72V" },
      { label: "Cont. / Peak Draw", value: "180A / 260A" },
      { label: "Capacity", value: "40Ah / 2.88kWh" },
    ],
  },
  {
    category: "Chassis",
    selectedName: "Chromoly Mini Quad Frame",
    price: "$1,250",
    specs: [{ label: "Weight", value: "64 lb" }],
  },
  {
    category: "Drive Kit",
    selectedName: "219 Kart Chain Set",
    price: "$390",
    specs: [{ label: "Total Gear Ratio", value: "6.9:1" }],
  },
  {
    category: "Rear Wheels",
    selectedName: "Douglas Rolled Edge Rear",
    price: "$610",
    specs: [
      { label: "Tire Size", value: "22x10-10" },
      { label: "Lug Pattern", value: "4x137" },
    ],
  },
  {
    category: "Front Wheels",
    selectedName: "Douglas Rolled Edge Front",
    price: "$540",
    specs: [
      { label: "Tire Size", value: "23x7-10" },
      { label: "Lug Pattern", value: "4x137" },
    ],
  },
  {
    category: "Suspension",
    selectedName: "Elka Stage 2 Coilovers",
    price: "$680",
    specs: [{ label: "Travel / Preload", value: "7.5in / Adjustable" }],
  },
  {
    category: "Light Kit",
    selectedName: "Baja Designs S2 Street Kit",
    price: "$180",
    specs: [{ label: "Street Legal", value: "Yes" }],
  },
]

export default function Page() {
  const searchRef = useRef<HTMLInputElement>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        searchRef.current?.focus()
        searchRef.current?.select()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div className="min-h-svh bg-[radial-gradient(circle_at_top_left,_color-mix(in_oklab,var(--color-primary)_10%,transparent),transparent_26%),linear-gradient(180deg,color-mix(in_oklab,var(--color-background)_92%,black_8%),var(--color-background))] p-3 md:p-4">
      <div className="grid min-h-[calc(100svh-1.5rem)] grid-cols-[6.5rem_minmax(0,1fr)_15rem] gap-3 overflow-x-auto md:min-h-[calc(100svh-2rem)] md:grid-cols-[22rem_minmax(0,1fr)_23rem]">
        <aside className="flex min-h-full min-w-0 flex-col border border-border/70 bg-sidebar/85 p-3 backdrop-blur md:p-5">
          <label className="flex h-11 w-full items-center justify-between border border-border/70 bg-background/70 px-3 transition-colors focus-within:bg-background/85 md:h-12 md:px-4">
            <input
              ref={searchRef}
              type="text"
              placeholder="Component Search"
              aria-label="Search"
              className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <span className="hidden items-center gap-1 text-[10px] uppercase tracking-[0.24em] md:flex">
              <kbd className="border border-border/70 px-1.5 py-0.5 text-[10px]">Cmd</kbd>
              <kbd className="border border-border/70 px-1.5 py-0.5 text-[10px]">K</kbd>
            </span>
          </label>

          <div className="mt-auto">
            <label className="block text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Theme
            </label>
            <Tabs
              value={theme ?? "system"}
              onValueChange={setTheme}
              className="mt-2"
            >
              <TabsList className="h-11 w-full rounded-none border border-border/70 bg-background/70 p-1 md:h-12">
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="light">Light</TabsTrigger>
                <TabsTrigger value="dark">Dark</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </aside>

        <main className="relative min-h-full min-w-[24rem] overflow-hidden border border-border/70 bg-card/90">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--color-border)_50%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--color-border)_50%,transparent)_1px,transparent_1px)] bg-[size:32px_32px] opacity-50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_34%)]" />
          <div className="relative flex h-full min-h-[calc(100svh-1.5rem)] flex-col justify-end p-4 md:min-h-[calc(100svh-2rem)] md:p-8">
            <div className="flex-1" />

            <div className="-mx-4 -mb-4 w-auto border border-border/70 bg-background/76 p-3 backdrop-blur md:-mx-8 md:-mb-8 md:p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-muted-foreground md:text-xs">
                  Selected Parts
                </p>
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  Category Specs + Price
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                {selectedParts.map((part) => (
                  <div
                    key={part.category}
                    className="border border-border/70 bg-card/80 px-3 py-3 md:px-4"
                  >
                    <div className="flex items-start gap-2">
                      <p className="shrink-0 text-[10px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
                        {part.category}
                      </p>
                      <p className="min-w-0 text-sm font-medium text-foreground">
                        {part.selectedName}
                      </p>
                    </div>

                    <div className="mt-3 space-y-2">
                      {[...part.specs, { label: "Price", value: part.price }].map((spec) => (
                        <div
                          key={`${part.category}-${spec.label}`}
                          className="flex items-start justify-between gap-3 text-xs"
                        >
                          <p className="max-w-[11rem] leading-4 text-muted-foreground">
                            {spec.label}
                          </p>
                          <p className="shrink-0 text-right font-medium text-foreground">
                            {spec.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <aside className="min-h-full min-w-0 border border-border/70 bg-card/85 p-3 backdrop-blur md:p-5">
          <div className="flex h-full flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border border-border/70 bg-background/70 px-3 py-3 md:px-4"
                >
                  <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-lg font-medium tracking-[-0.04em] text-foreground md:text-xl">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
              {metricGroups.map((group) => (
                <div
                  key={group.map((metric) => metric.label).join("-")}
                  className="border border-border/70 bg-background/55 px-3 py-2.5 md:px-4"
                >
                  <div className="space-y-2.5">
                    {group.map((metric, index) => (
                      <div
                        key={metric.label}
                        className={cn("space-y-2", index > 0 && "pt-1")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="max-w-[14rem] text-[10px] leading-4 uppercase tracking-[0.2em] text-muted-foreground">
                            {metric.label}
                          </p>
                          <p className="shrink-0 text-xs font-medium text-foreground md:text-sm">
                            {metric.value}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-12 shrink-0 text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                            {metric.lowerBound}
                          </span>
                          <div className="h-2 flex-1 overflow-hidden bg-border/60">
                            <div
                              className={cn(
                                "h-full bg-primary transition-[width]",
                                metric.tone === "warn" && "bg-amber-500"
                              )}
                              style={{ width: `${metric.score}%` }}
                            />
                          </div>
                          <span className="w-12 shrink-0 text-right text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                            {metric.upperBound}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
