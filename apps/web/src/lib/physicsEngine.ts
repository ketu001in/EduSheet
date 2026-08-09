// Pure physics math for Physics Lab -- every function here is the standard
// closed-form (or, where no closed form exists, a numerically-integrated)
// CBSE/ICSE textbook formula for that experiment, hand-verified. No physics
// or animation library is used anywhere in this app: every motion the
// Physics Stage renders traces directly back to one of these functions, so
// nothing on screen is ever an unverified approximation dressed up to look
// convincing. Framework-free (no React/DOM), safe to unit-test in isolation.

// ---------------------------------------------------------------------------
// Simple Pendulum
// ---------------------------------------------------------------------------
export interface PendulumParams {
  length: number; // metres
  gravity: number; // m/s^2
  amplitudeDeg: number; // initial swing angle, degrees
}

export function pendulumPeriodSmallAngle(length: number, gravity: number): number {
  return 2 * Math.PI * Math.sqrt(length / gravity);
}

// Closed-form small-angle solution: theta(t) = theta0 * cos(omega * t),
// omega = sqrt(g/L) -- exact for the idealized "simple pendulum" formula
// T=2*pi*sqrt(L/g) taught at CBSE/ICSE level.
export function pendulumSmallAngle(t: number, p: PendulumParams) {
  const theta0 = (p.amplitudeDeg * Math.PI) / 180;
  const omega = Math.sqrt(p.gravity / p.length);
  const theta = theta0 * Math.cos(omega * t);
  const thetaDot = -theta0 * omega * Math.sin(omega * t);
  return { theta, thetaDot, period: (2 * Math.PI) / omega };
}

// One RK4 integration step of the full nonlinear pendulum ODE,
// theta'' = -(g/L) * sin(theta) -- no closed form exists for large swings,
// so this is called once per animation frame with that frame's elapsed
// time and accumulated state (theta, thetaDot), rather than recomputed
// from t=0 every frame -- keeps the cost constant no matter how long the
// simulation has been running. Internally subdivides large frame deltas
// into fixed ~1/240s substeps for numerical stability.
export function pendulumNonlinearStep(theta: number, thetaDot: number, dtSeconds: number, length: number, gravity: number) {
  const gOverL = gravity / length;
  const maxSubDt = 1 / 240;
  const subSteps = Math.max(1, Math.ceil(dtSeconds / maxSubDt));
  const dt = dtSeconds / subSteps;
  let th = theta;
  let om = thetaDot;
  const deriv = (t: number, o: number) => ({ dth: o, dom: -gOverL * Math.sin(t) });
  for (let i = 0; i < subSteps; i++) {
    const k1 = deriv(th, om);
    const k2 = deriv(th + (k1.dth * dt) / 2, om + (k1.dom * dt) / 2);
    const k3 = deriv(th + (k2.dth * dt) / 2, om + (k2.dom * dt) / 2);
    const k4 = deriv(th + k3.dth * dt, om + k3.dom * dt);
    th += (dt / 6) * (k1.dth + 2 * k2.dth + 2 * k3.dth + k4.dth);
    om += (dt / 6) * (k1.dom + 2 * k2.dom + 2 * k3.dom + k4.dom);
  }
  return { theta: th, thetaDot: om };
}

// ---------------------------------------------------------------------------
// Spring / Simple Harmonic Motion (Hooke's Law)
// ---------------------------------------------------------------------------
export interface SpringParams {
  mass: number; // kg
  springConstant: number; // N/m
  amplitude: number; // metres, initial pull distance
}

export function springPeriod(mass: number, springConstant: number): number {
  return 2 * Math.PI * Math.sqrt(mass / springConstant);
}

// Closed-form SHM solution: x(t) = A * cos(omega * t), omega = sqrt(k/m) --
// exact for an idealized massless spring with no damping, per Hooke's Law.
export function springState(t: number, p: SpringParams) {
  const omega = Math.sqrt(p.springConstant / p.mass);
  const displacement = p.amplitude * Math.cos(omega * t);
  const velocity = -p.amplitude * omega * Math.sin(omega * t);
  return { displacement, velocity, period: (2 * Math.PI) / omega };
}

// ---------------------------------------------------------------------------
// Projectile Motion
// ---------------------------------------------------------------------------
export interface ProjectileParams {
  speed: number; // m/s, launch speed
  angleDeg: number; // launch angle from horizontal
  gravity: number; // m/s^2
}

function angleRad(p: ProjectileParams): number {
  return (p.angleDeg * Math.PI) / 180;
}

// R = v^2 * sin(2*theta) / g -- maximized at theta=45 degrees.
export function projectileRange(p: ProjectileParams): number {
  return (p.speed * p.speed * Math.sin(2 * angleRad(p))) / p.gravity;
}

// H = (v*sin(theta))^2 / (2g)
export function projectileMaxHeight(p: ProjectileParams): number {
  const vy = p.speed * Math.sin(angleRad(p));
  return (vy * vy) / (2 * p.gravity);
}

// t_flight = 2*v*sin(theta) / g
export function projectileTimeOfFlight(p: ProjectileParams): number {
  const vy = p.speed * Math.sin(angleRad(p));
  return (2 * vy) / p.gravity;
}

// x(t) = v*cos(theta)*t,  y(t) = v*sin(theta)*t - 0.5*g*t^2 -- horizontal
// and vertical motion are independent, per standard projectile kinematics.
export function projectileState(t: number, p: ProjectileParams) {
  const vx = p.speed * Math.cos(angleRad(p));
  const vy = p.speed * Math.sin(angleRad(p));
  const x = vx * t;
  const y = Math.max(0, vy * t - 0.5 * p.gravity * t * t);
  const landed = t >= projectileTimeOfFlight(p);
  return { x, y, landed };
}

// ---------------------------------------------------------------------------
// Shared: exponential ease-toward-target, used by every "settles into
// equilibrium" scene below (a lever tipping until it balances, an object
// sinking/floating to its resting depth, two magnets sliding together or
// apart) so the visual eases smoothly toward its target state each frame
// instead of snapping there instantly.
// ---------------------------------------------------------------------------
export function easeToward(current: number, target: number, dtSeconds: number, rate = 4): number {
  const factor = 1 - Math.exp(-rate * dtSeconds);
  return current + (target - current) * factor;
}

// ---------------------------------------------------------------------------
// Lever & Principle of Moments
// ---------------------------------------------------------------------------
export interface LeverParams {
  leftForce: number; // N
  leftDistance: number; // m from pivot
  rightForce: number; // N
  rightDistance: number; // m from pivot
}

// Net turning effect: positive tips the beam right (clockwise), negative
// tips it left -- exactly zero is the balanced case, F1*d1 = F2*d2.
export function leverNetMoment(p: LeverParams): number {
  return p.rightForce * p.rightDistance - p.leftForce * p.leftDistance;
}

// Maps the net moment to a target tilt angle for the beam, saturating
// (via tanh) so a very large imbalance still caps at a realistic-looking
// tilt rather than spinning the beam past vertical.
export function leverTargetAngleDeg(p: LeverParams): number {
  const maxAngle = 22;
  return maxAngle * Math.tanh(leverNetMoment(p) / 40);
}

// ---------------------------------------------------------------------------
// Buoyancy / Archimedes' Principle
// ---------------------------------------------------------------------------
export interface BuoyancyParams {
  objectDensity: number; // kg/m^3
  fluidDensity: number; // kg/m^3
}

export function buoyancyFloats(p: BuoyancyParams): boolean {
  return p.objectDensity < p.fluidDensity;
}

// Fraction of the object's height that ends up submerged at equilibrium:
// exactly the density ratio while it floats (an object half as dense as
// the fluid floats half-submerged), capped at 1 (fully submerged/resting
// on the bottom) once it's denser than the fluid.
export function buoyancySubmergedFraction(p: BuoyancyParams): number {
  return Math.min(1, Math.max(0, p.objectDensity / p.fluidDensity));
}

// ---------------------------------------------------------------------------
// Ohm's Law Circuit
// ---------------------------------------------------------------------------
export interface CircuitParams {
  voltage: number; // V
  resistance: number; // Ohms
}

export function ohmsLawCurrent(p: CircuitParams): number {
  return p.resistance > 0 ? p.voltage / p.resistance : 0;
}

// ---------------------------------------------------------------------------
// Plane Mirror Reflection (Laws of Reflection)
// ---------------------------------------------------------------------------
export interface MirrorParams {
  incidenceAngleDeg: number; // measured from the normal
}

// Law of Reflection: angle of incidence = angle of reflection. Purely
// geometric -- no time dependence, the ray path is fixed by the angle.
export function reflectionAngleDeg(p: MirrorParams): number {
  return p.incidenceAngleDeg;
}

// ---------------------------------------------------------------------------
// Magnets: Attract or Repel
// ---------------------------------------------------------------------------
export interface MagnetParams {
  // 0 = like poles facing each other (repel), 1 = unlike poles facing
  // each other (attract). A slider rather than a boolean so it fits the
  // same paramConfig/slider-driven UI every other experiment uses.
  orientation: number;
}

export function magnetsAttract(p: MagnetParams): boolean {
  return p.orientation >= 0.5;
}

// Target gap between the two magnets in the scene's own arbitrary distance
// units -- attracting magnets settle close together, repelling ones settle
// far apart.
export function magnetTargetGap(p: MagnetParams): number {
  return magnetsAttract(p) ? 0.15 : 1.4;
}
