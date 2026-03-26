export type Platform = "bike" | "kart";

export type PartCategory =
  | "frame"
  | "frontWheel"
  | "rearWheel"
  | "motor"
  | "battery"
  | "controller"
  | "driveKit";

export type ConfigTarget = PartCategory | "riderMass" | "ambientTemperature";

export type Part = {
  id: string;
  category: PartCategory;
  platforms: Platform[];
  name: string;
  brand: string;
  description: string;
  priceUsd: number;
  massKg: number;
  specs: {
    radiusM?: number;
    rollingResistance?: number;
    tractionCoeff?: number;
    dragCoefficient?: number;
    frontalAreaM2?: number;
    maxPayloadKg?: number;
    peakPowerW?: number;
    peakTorqueNm?: number;
    maxRpm?: number;
    motorEfficiency?: number;
    voltageNominalV?: number;
    capacityWh?: number;
    maxDischargeA?: number;
    maxCurrentA?: number;
    controllerEfficiency?: number;
    gearRatio?: number;
    drivetrainEfficiency?: number;
  };
};

export type BuildSelection = Record<PartCategory, string>;

export type Scenario = {
  riderMassKg: number;
  cargoMassKg: number;
  ambientTempC: number;
};

export type EvaluatedBuild = {
  totalMassKg: number;
  availablePowerW: number;
  wheelTorqueNm: number;
  tractiveForceN: number;
  topSpeedKph: number;
  rangeKm: number;
  payloadKg: number;
  zeroTo30S: number;
  gradeabilityPct: number;
  powerToWeightWPerKg: number;
  notes: string[];
  bars: Array<{
    key: string;
    label: string;
    value: number;
    unit: string;
    percent: number;
  }>;
};
