import { BuildSelection, Part, PartCategory, Platform } from "@/lib/types";

export const categoryOrder: PartCategory[] = [
  "frame",
  "frontWheel",
  "rearWheel",
  "motor",
  "battery",
  "controller",
  "driveKit"
];

export const categoryLabels: Record<PartCategory, string> = {
  frame: "Frame / Chassis",
  frontWheel: "Front Wheel",
  rearWheel: "Rear Wheel",
  motor: "Motor",
  battery: "Battery",
  controller: "Controller",
  driveKit: "Drive Kit"
};

export const partsCatalog: Part[] = [
  {
    id: "bike-frame-commuter",
    category: "frame",
    platforms: ["bike"],
    name: "Atlas Commuter Step-Thru",
    brand: "RideForm",
    description: "Stable aluminum commuter frame with relaxed geometry and moderate drag area.",
    priceUsd: 790,
    massKg: 8.8,
    specs: {
      dragCoefficient: 1.05,
      frontalAreaM2: 0.56,
      maxPayloadKg: 138
    }
  },
  {
    id: "bike-frame-trail",
    category: "frame",
    platforms: ["bike"],
    name: "Ridge Trail Hardtail",
    brand: "RideForm",
    description: "Longer wheelbase and stronger payload rating for rough surfaces.",
    priceUsd: 960,
    massKg: 10.6,
    specs: {
      dragCoefficient: 1.09,
      frontalAreaM2: 0.6,
      maxPayloadKg: 152
    }
  },
  {
    id: "kart-frame-compact",
    category: "frame",
    platforms: ["kart"],
    name: "KX Compact Tubular Chassis",
    brand: "Kinetic",
    description: "Narrow go-kart frame with low frontal area and balanced weight transfer.",
    priceUsd: 1450,
    massKg: 24,
    specs: {
      dragCoefficient: 0.84,
      frontalAreaM2: 0.72,
      maxPayloadKg: 135
    }
  },
  {
    id: "kart-frame-enduro",
    category: "frame",
    platforms: ["kart"],
    name: "KX Enduro Utility Chassis",
    brand: "Kinetic",
    description: "Reinforced frame with higher load ceiling and extra tire clearance.",
    priceUsd: 1710,
    massKg: 28,
    specs: {
      dragCoefficient: 0.88,
      frontalAreaM2: 0.76,
      maxPayloadKg: 165
    }
  },
  {
    id: "wheel-700c-road",
    category: "frontWheel",
    platforms: ["bike"],
    name: "700C Aero Front",
    brand: "Velocraft",
    description: "Large diameter road wheel with low rolling resistance.",
    priceUsd: 220,
    massKg: 1.2,
    specs: {
      radiusM: 0.34,
      rollingResistance: 0.006,
      tractionCoeff: 0.78
    }
  },
  {
    id: "wheel-27-trail-front",
    category: "frontWheel",
    platforms: ["bike"],
    name: "27.5 Trail Front",
    brand: "Velocraft",
    description: "Trail-biased front wheel with better grip over mixed surfaces.",
    priceUsd: 245,
    massKg: 1.45,
    specs: {
      radiusM: 0.352,
      rollingResistance: 0.009,
      tractionCoeff: 0.92
    }
  },
  {
    id: "wheel-700c-rear",
    category: "rearWheel",
    platforms: ["bike"],
    name: "700C Aero Rear",
    brand: "Velocraft",
    description: "Rear wheel matched to the aero commuter setup.",
    priceUsd: 260,
    massKg: 1.3,
    specs: {
      radiusM: 0.34,
      rollingResistance: 0.006,
      tractionCoeff: 0.84
    }
  },
  {
    id: "wheel-27-trail-rear",
    category: "rearWheel",
    platforms: ["bike"],
    name: "27.5 Trail Rear",
    brand: "Velocraft",
    description: "Rear wheel with grippier tread for torque-heavy trail builds.",
    priceUsd: 285,
    massKg: 1.58,
    specs: {
      radiusM: 0.352,
      rollingResistance: 0.009,
      tractionCoeff: 0.96
    }
  },
  {
    id: "kart-wheel-front-slick",
    category: "frontWheel",
    platforms: ["kart"],
    name: "10in Front Slick",
    brand: "Apex Tire",
    description: "Low-profile kart front tire for efficient turn-in on asphalt.",
    priceUsd: 168,
    massKg: 2.4,
    specs: {
      radiusM: 0.165,
      rollingResistance: 0.012,
      tractionCoeff: 1.02
    }
  },
  {
    id: "kart-wheel-front-allterrain",
    category: "frontWheel",
    platforms: ["kart"],
    name: "11in Front All-Terrain",
    brand: "Apex Tire",
    description: "Larger front tire for dirt and utility terrain.",
    priceUsd: 194,
    massKg: 2.9,
    specs: {
      radiusM: 0.182,
      rollingResistance: 0.016,
      tractionCoeff: 1.08
    }
  },
  {
    id: "kart-wheel-rear-slick",
    category: "rearWheel",
    platforms: ["kart"],
    name: "11in Rear Slick",
    brand: "Apex Tire",
    description: "Rear drive tire tuned for clean launch traction and low slip.",
    priceUsd: 198,
    massKg: 3.2,
    specs: {
      radiusM: 0.182,
      rollingResistance: 0.013,
      tractionCoeff: 1.18
    }
  },
  {
    id: "kart-wheel-rear-knobby",
    category: "rearWheel",
    platforms: ["kart"],
    name: "12in Rear Knobby",
    brand: "Apex Tire",
    description: "Higher drag tire with stronger bite for mixed terrain torque loads.",
    priceUsd: 224,
    massKg: 3.9,
    specs: {
      radiusM: 0.196,
      rollingResistance: 0.018,
      tractionCoeff: 1.28
    }
  },
  {
    id: "motor-4kw-mid",
    category: "motor",
    platforms: ["bike", "kart"],
    name: "4 kW Mid Drive",
    brand: "Flux Motion",
    description: "Compact liquid-cooled permanent magnet motor for light builds.",
    priceUsd: 1120,
    massKg: 6.5,
    specs: {
      peakPowerW: 4000,
      peakTorqueNm: 62,
      maxRpm: 5200,
      motorEfficiency: 0.9
    }
  },
  {
    id: "motor-8kw-pro",
    category: "motor",
    platforms: ["bike", "kart"],
    name: "8 kW Performance Drive",
    brand: "Flux Motion",
    description: "Higher-output motor for aggressive acceleration and taller gearing.",
    priceUsd: 1780,
    massKg: 9.1,
    specs: {
      peakPowerW: 8000,
      peakTorqueNm: 108,
      maxRpm: 6400,
      motorEfficiency: 0.92
    }
  },
  {
    id: "battery-52v-1kwh",
    category: "battery",
    platforms: ["bike"],
    name: "52V 1.0 kWh Pack",
    brand: "CellForge",
    description: "High-discharge pack suited to commuter and light trail builds.",
    priceUsd: 890,
    massKg: 5.8,
    specs: {
      voltageNominalV: 52,
      capacityWh: 1040,
      maxDischargeA: 55
    }
  },
  {
    id: "battery-72v-1p8kwh",
    category: "battery",
    platforms: ["bike", "kart"],
    name: "72V 1.8 kWh Pack",
    brand: "CellForge",
    description: "More voltage headroom for high-speed builds and longer sustained pulls.",
    priceUsd: 1490,
    massKg: 11.8,
    specs: {
      voltageNominalV: 72,
      capacityWh: 1800,
      maxDischargeA: 115
    }
  },
  {
    id: "battery-72v-3kwh",
    category: "battery",
    platforms: ["kart"],
    name: "72V 3.0 kWh Utility Pack",
    brand: "CellForge",
    description: "Heavy-duty pack for kart endurance, payload, and repeat acceleration.",
    priceUsd: 2380,
    massKg: 18.5,
    specs: {
      voltageNominalV: 72,
      capacityWh: 3000,
      maxDischargeA: 150
    }
  },
  {
    id: "controller-100a",
    category: "controller",
    platforms: ["bike", "kart"],
    name: "Vector 100A",
    brand: "Arc Control",
    description: "Compact sine-wave controller with conservative thermal envelope.",
    priceUsd: 420,
    massKg: 1.3,
    specs: {
      maxCurrentA: 100,
      controllerEfficiency: 0.95
    }
  },
  {
    id: "controller-160a",
    category: "controller",
    platforms: ["bike", "kart"],
    name: "Vector 160A",
    brand: "Arc Control",
    description: "Higher-output controller for sport configurations and taller gearing.",
    priceUsd: 610,
    massKg: 1.8,
    specs: {
      maxCurrentA: 160,
      controllerEfficiency: 0.96
    }
  },
  {
    id: "drive-bike-8to1",
    category: "driveKit",
    platforms: ["bike"],
    name: "Chain Reduction 8.0:1",
    brand: "TorqueRail",
    description: "Torque-favoring chain reduction for urban and trail launches.",
    priceUsd: 295,
    massKg: 2.1,
    specs: {
      gearRatio: 8,
      drivetrainEfficiency: 0.94
    }
  },
  {
    id: "drive-bike-6to1",
    category: "driveKit",
    platforms: ["bike"],
    name: "Chain Reduction 6.0:1",
    brand: "TorqueRail",
    description: "Taller gearing for speed-oriented builds with enough power overhead.",
    priceUsd: 275,
    massKg: 1.9,
    specs: {
      gearRatio: 6,
      drivetrainEfficiency: 0.95
    }
  },
  {
    id: "drive-kart-5to1",
    category: "driveKit",
    platforms: ["kart"],
    name: "Kart Axle 5.2:1",
    brand: "TorqueRail",
    description: "Balanced live axle ratio for asphalt and mixed-surface acceleration.",
    priceUsd: 420,
    massKg: 4.4,
    specs: {
      gearRatio: 5.2,
      drivetrainEfficiency: 0.93
    }
  },
  {
    id: "drive-kart-4to1",
    category: "driveKit",
    platforms: ["kart"],
    name: "Kart Axle 4.4:1",
    brand: "TorqueRail",
    description: "Taller axle ratio to trade launch snap for top-end speed.",
    priceUsd: 410,
    massKg: 4.1,
    specs: {
      gearRatio: 4.4,
      drivetrainEfficiency: 0.94
    }
  }
];

export function getPlatformParts(platform: Platform) {
  return partsCatalog.filter((part) => part.platforms.includes(platform));
}

export function getPartsByCategory(platform: Platform, category: PartCategory) {
  return partsCatalog.filter(
    (part) => part.category === category && part.platforms.includes(platform)
  );
}

export const defaultSelections: Record<Platform, BuildSelection> = {
  bike: {
    frame: "bike-frame-commuter",
    frontWheel: "wheel-700c-road",
    rearWheel: "wheel-700c-rear",
    motor: "motor-4kw-mid",
    battery: "battery-52v-1kwh",
    controller: "controller-100a",
    driveKit: "drive-bike-8to1"
  },
  kart: {
    frame: "kart-frame-compact",
    frontWheel: "kart-wheel-front-slick",
    rearWheel: "kart-wheel-rear-slick",
    motor: "motor-8kw-pro",
    battery: "battery-72v-1p8kwh",
    controller: "controller-160a",
    driveKit: "drive-kart-5to1"
  }
};

