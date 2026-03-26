import { partsCatalog } from "@/lib/data/parts";
import { BuildSelection, EvaluatedBuild, Part, PartCategory, Platform, Scenario } from "@/lib/types";

const g = 9.81;
const rho = 1.225;

const defaultsByCategory: Record<PartCategory, Part> = {
  frame: partsCatalog[0],
  frontWheel: partsCatalog[4],
  rearWheel: partsCatalog[6],
  motor: partsCatalog[12],
  battery: partsCatalog[14],
  controller: partsCatalog[17],
  driveKit: partsCatalog[19]
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, precision = 1) {
  return Number(value.toFixed(precision));
}

export function resolveSelection(selection: BuildSelection) {
  const entries = Object.entries(selection).map(([category, partId]) => {
    const part = partsCatalog.find((candidate) => candidate.id === partId);
    return [category as PartCategory, part ?? defaultsByCategory[category as PartCategory]] as const;
  });

  return Object.fromEntries(entries) as Record<PartCategory, Part>;
}

function powerRequired(cda: number, rollingResistance: number, massKg: number, speedMs: number) {
  const aero = 0.5 * rho * cda * speedMs ** 3;
  const rolling = rollingResistance * massKg * g * speedMs;
  return aero + rolling;
}

function solveTopSpeed({
  availablePowerW,
  cda,
  rollingResistance,
  massKg,
  rpmLimitedSpeedMs
}: {
  availablePowerW: number;
  cda: number;
  rollingResistance: number;
  massKg: number;
  rpmLimitedSpeedMs: number;
}) {
  let best = 0;

  for (let speed = 0; speed <= rpmLimitedSpeedMs; speed += 0.2) {
    const demand = powerRequired(cda, rollingResistance, massKg, speed);
    if (demand <= availablePowerW) {
      best = speed;
    } else {
      break;
    }
  }

  return best;
}

export function evaluateBuild(
  platform: Platform,
  selection: BuildSelection,
  scenario: Scenario
): EvaluatedBuild {
  const chosen = resolveSelection(selection);
  const frame = chosen.frame;
  const frontWheel = chosen.frontWheel;
  const rearWheel = chosen.rearWheel;
  const motor = chosen.motor;
  const battery = chosen.battery;
  const controller = chosen.controller;
  const driveKit = chosen.driveKit;

  const componentMassKg = Object.values(chosen).reduce((sum, part) => sum + part.massKg, 0);
  const totalMassKg = componentMassKg + scenario.riderMassKg + scenario.cargoMassKg;

  const voltage = battery.specs.voltageNominalV ?? 52;
  const batteryPowerLimit = voltage * (battery.specs.maxDischargeA ?? 40) * 0.97;
  const controllerPowerLimit = voltage * (controller.specs.maxCurrentA ?? 80) * (controller.specs.controllerEfficiency ?? 0.95);
  const motorPowerLimit = (motor.specs.peakPowerW ?? 3000) * (motor.specs.motorEfficiency ?? 0.9);
  const availablePowerW = Math.min(batteryPowerLimit, controllerPowerLimit, motorPowerLimit);

  const gearRatio = driveKit.specs.gearRatio ?? 6;
  const drivetrainEfficiency = driveKit.specs.drivetrainEfficiency ?? 0.94;
  const wheelTorqueNm = (motor.specs.peakTorqueNm ?? 50) * gearRatio * drivetrainEfficiency;
  const drivenRadiusM = rearWheel.specs.radiusM ?? 0.33;
  const rawTractiveForceN = wheelTorqueNm / drivenRadiusM;
  const driveWeightBias = platform === "kart" ? 0.78 : 0.65;
  const tractionLimitN =
    totalMassKg * g * (rearWheel.specs.tractionCoeff ?? 0.88) * driveWeightBias;
  const tractiveForceN = Math.min(rawTractiveForceN, tractionLimitN);

  const cda =
    (frame.specs.dragCoefficient ?? 1) * (frame.specs.frontalAreaM2 ?? (platform === "kart" ? 0.72 : 0.58));
  const rollingResistance =
    ((frontWheel.specs.rollingResistance ?? 0.01) + (rearWheel.specs.rollingResistance ?? 0.01)) / 2;
  const rpmLimitedSpeedMs =
    (((motor.specs.maxRpm ?? 4500) / gearRatio) * (2 * Math.PI * drivenRadiusM)) / 60;

  const topSpeedMs = solveTopSpeed({
    availablePowerW,
    cda,
    rollingResistance,
    massKg: totalMassKg,
    rpmLimitedSpeedMs
  });

  const launchAcceleration = clamp((tractiveForceN / totalMassKg) * 0.78, 0.4, 12);
  const zeroTo30S = 13.4112 / launchAcceleration;

  const cruiseSpeedMs = Math.max(topSpeedMs * 0.72, 6.5);
  const cruisePowerW = powerRequired(cda, rollingResistance, totalMassKg, cruiseSpeedMs) / drivetrainEfficiency;
  const usableBatteryWh = (battery.specs.capacityWh ?? 1000) * 0.92 * clamp(1 - (scenario.ambientTempC < 10 ? 0.08 : 0), 0.8, 1);
  const rangeHours = usableBatteryWh / Math.max(cruisePowerW, 200);
  const rangeKm = (cruiseSpeedMs * 3.6) * rangeHours;

  const gradeForceBudget = tractiveForceN - (rollingResistance * totalMassKg * g) - (0.5 * rho * cda * 5 ** 2);
  const gradeabilityPct = clamp((gradeForceBudget / (totalMassKg * g)) * 100, 0, 100);
  const payloadKg = Math.max((frame.specs.maxPayloadKg ?? 120) - scenario.riderMassKg, 0);
  const powerToWeightWPerKg = availablePowerW / totalMassKg;

  const notes: string[] = [];

  if (batteryPowerLimit <= motorPowerLimit) {
    notes.push("Battery discharge is currently the peak-power bottleneck.");
  }
  if (controllerPowerLimit <= motorPowerLimit) {
    notes.push("Controller current limit is clipping available motor output.");
  }
  if (Math.abs(topSpeedMs - rpmLimitedSpeedMs) < 0.6) {
    notes.push("Top speed is gear-limited. A taller reduction or higher motor RPM would raise the ceiling.");
  }
  if (tractiveForceN < rawTractiveForceN) {
    notes.push("Launch force is traction-limited, so tire compound and weight transfer matter more than extra torque.");
  }
  if (payloadKg < scenario.cargoMassKg) {
    notes.push("Current cargo request exceeds remaining structural payload on the selected frame.");
  }

  return {
    totalMassKg: round(totalMassKg),
    availablePowerW: round(availablePowerW, 0),
    wheelTorqueNm: round(wheelTorqueNm, 0),
    tractiveForceN: round(tractiveForceN, 0),
    topSpeedKph: round(topSpeedMs * 3.6),
    rangeKm: round(rangeKm),
    payloadKg: round(payloadKg),
    zeroTo30S: round(zeroTo30S),
    gradeabilityPct: round(gradeabilityPct),
    powerToWeightWPerKg: round(powerToWeightWPerKg),
    notes,
    bars: [
      {
        key: "speed",
        label: "Top Speed",
        value: round(topSpeedMs * 3.6),
        unit: "kph",
        percent: clamp((topSpeedMs * 3.6) / 140, 0.04, 1)
      },
      {
        key: "torque",
        label: "Wheel Torque",
        value: round(wheelTorqueNm, 0),
        unit: "Nm",
        percent: clamp(wheelTorqueNm / 900, 0.04, 1)
      },
      {
        key: "range",
        label: "Cruise Range",
        value: round(rangeKm),
        unit: "km",
        percent: clamp(rangeKm / 180, 0.04, 1)
      },
      {
        key: "payload",
        label: "Remaining Payload",
        value: round(payloadKg),
        unit: "kg",
        percent: clamp(payloadKg / 180, 0.04, 1)
      },
      {
        key: "grade",
        label: "Gradeability",
        value: round(gradeabilityPct),
        unit: "%",
        percent: clamp(gradeabilityPct / 60, 0.04, 1)
      },
      {
        key: "powerDensity",
        label: "Power Density",
        value: round(powerToWeightWPerKg),
        unit: "W/kg",
        percent: clamp(powerToWeightWPerKg / 90, 0.04, 1)
      }
    ]
  };
}

