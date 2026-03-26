import { EvaluatedBuild, Part, PartCategory, Scenario } from "@/lib/types";

const KG_TO_LB = 2.2046226218;
const KPH_TO_MPH = 0.6213711922;
const KM_TO_MI = 0.6213711922;
const M_TO_IN = 39.37007874;
const NM_TO_LBFT = 0.7375621493;

function round(value: number, precision = 1) {
  return Number(value.toFixed(precision));
}

export function kgToLb(valueKg: number, precision = 1) {
  return round(valueKg * KG_TO_LB, precision);
}

export function lbToKg(valueLb: number, precision = 3) {
  return round(valueLb / KG_TO_LB, precision);
}

export function kphToMph(valueKph: number, precision = 1) {
  return round(valueKph * KPH_TO_MPH, precision);
}

export function kmToMi(valueKm: number, precision = 1) {
  return round(valueKm * KM_TO_MI, precision);
}

export function mToIn(valueM: number, precision = 1) {
  return round(valueM * M_TO_IN, precision);
}

export function nmToLbFt(valueNm: number, precision = 1) {
  return round(valueNm * NM_TO_LBFT, precision);
}

export function cToF(valueC: number, precision = 0) {
  return round((valueC * 9) / 5 + 32, precision);
}

export function fToC(valueF: number, precision = 2) {
  return round(((valueF - 32) * 5) / 9, precision);
}

export function displayScenario(scenario: Scenario) {
  return {
    riderMassLb: kgToLb(scenario.riderMassKg, 0),
    cargoMassLb: kgToLb(scenario.cargoMassKg, 0),
    ambientTempF: cToF(scenario.ambientTempC, 0)
  };
}

export function displayPartSpecs(category: PartCategory, part: Part) {
  const specs = part.specs;

  switch (category) {
    case "frame":
      return [`${kgToLb(part.massKg, 1)} lb`, `${kgToLb(specs.maxPayloadKg ?? 0, 0)} lb payload`];
    case "frontWheel":
    case "rearWheel":
      return [
        `${mToIn(specs.radiusM ?? 0, 1)} in radius`,
        `traction ${(specs.tractionCoeff ?? 0).toFixed(2)}`
      ];
    case "motor":
      return [`${specs.peakPowerW ?? 0} W`, `${nmToLbFt(specs.peakTorqueNm ?? 0, 1)} lb-ft`];
    case "battery":
      return [`${specs.voltageNominalV ?? 0} V`, `${specs.capacityWh ?? 0} Wh`];
    case "controller":
      return [`${specs.maxCurrentA ?? 0} A`, `${Math.round((specs.controllerEfficiency ?? 0) * 100)}% efficiency`];
    case "driveKit":
      return [`${specs.gearRatio ?? 0}:1`, `${Math.round((specs.drivetrainEfficiency ?? 0) * 100)}% efficiency`];
  }

  return [];
}

export function displayBuildMetrics(metrics: EvaluatedBuild) {
  return {
    totalMassLb: kgToLb(metrics.totalMassKg, 1),
    topSpeedMph: kphToMph(metrics.topSpeedKph, 1),
    rangeMi: kmToMi(metrics.rangeKm, 1),
    payloadLb: kgToLb(metrics.payloadKg, 0),
    torqueLbFt: nmToLbFt(metrics.wheelTorqueNm, 1),
    powerDensityWPerLb: round(metrics.powerToWeightWPerKg / KG_TO_LB, 1),
    bars: metrics.bars.map((metric) => {
      switch (metric.key) {
        case "speed":
          return { ...metric, value: kphToMph(metric.value, 1), unit: "mph" };
        case "torque":
          return { ...metric, value: nmToLbFt(metric.value, 1), unit: "lb-ft" };
        case "range":
          return { ...metric, value: kmToMi(metric.value, 1), unit: "mi" };
        case "payload":
          return { ...metric, value: kgToLb(metric.value, 0), unit: "lb" };
        case "powerDensity":
          return { ...metric, value: round(metric.value / KG_TO_LB, 1), unit: "W/lb" };
        default:
          return metric;
      }
    })
  };
}
