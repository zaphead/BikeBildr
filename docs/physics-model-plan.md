# BikeBildr Physics Model Plan

## Goal

Turn component choices into performance estimates that stay physically grounded enough to guide configuration decisions.

## Current boilerplate model

The front-end prototype uses deterministic formulas derived from seeded part specs:

- Power ceiling = `min(motor_peak_power, battery_voltage * battery_max_discharge_current, battery_voltage * controller_max_current)`
- Wheel torque = `motor_peak_torque * gear_ratio * drivetrain_efficiency`
- Tractive force = `min(wheel_torque / wheel_radius, traction_limit)`
- Top speed = solve for `P_available = 0.5 * rho * CdA * v^3 + Crr * m * g * v`, then cap by motor RPM and final drive ratio
- Range = usable battery energy divided by cruise power at a representative highway or trail speed
- Gradeability = force surplus at low speed, expressed as percent grade

These equations are enough for an interactive UI shell, but not enough yet for production-grade quoting.

## Data model to support accuracy

Each part family should expose a validated physics schema:

- `frame`
  - dry mass
  - max payload
  - frontal area
  - drag coefficient
  - axle spacing
- `wheel`
  - loaded radius
  - rolling resistance coefficient by surface
  - traction coefficient by tire compound and surface
  - max wheel load
- `motor`
  - peak torque
  - continuous torque
  - torque-vs-rpm curve
  - efficiency map
  - thermal limits
- `battery`
  - nominal voltage
  - usable energy
  - max continuous discharge current
  - peak discharge current
  - temperature derating curve
- `controller`
  - phase current
  - battery current
  - voltage limit
  - efficiency
  - thermal derating behavior
- `drive kit`
  - gear ratio
  - drivetrain efficiency
  - chain or belt losses

## Calibration path

1. Start with publicly documented production bikes and karts that have credible measured specs.
2. Fit drag and rolling resistance ranges by comparing predicted top speed against published test results.
3. Add torque-vs-rpm and efficiency curves so acceleration is simulated over time instead of inferred from one peak point.
4. Add surface models and weight transfer so traction limits change between street, gravel, dirt, and track setups.
5. Validate against logged GPS acceleration runs or dyno data before exposing any metric as "accurate".

## Recommended architecture

- Keep the current lightweight client model for instant feedback.
- Mirror the same equations in a server-side validation layer for saved builds.
- Move the authoritative model into a shared `physics-core` module once Supabase catalogs are introduced.
- Store every part revision with an effective date so old builds remain reproducible.
