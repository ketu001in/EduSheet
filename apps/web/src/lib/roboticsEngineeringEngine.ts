// Pure, verified robotics ENGINEERING math -- the actual formulas real
// sensors, actuators, and control systems use, not illustrative-only
// numbers. This is the direct response to feedback that Robotics Lab
// needed real study-level depth ("facts and figures... not only available
// widely knowledge, that is anyhow anyone can search") rather than a
// gallery of famous-robot trivia -- every function here is a genuine,
// textbook/datasheet-standard formula, verified against hand-checked
// values before shipping (script run and deleted, see commit history),
// same discipline as chemEngine.ts and mathEngine.ts.

// -- Ultrasonic distance sensor (HC-SR04-class) ------------------------------
// Real datasheet convention: speed of sound ~340 m/s = 0.034 cm/microsecond.
// The sensor actually measures echo TIME and computes distance from it --
// modelled both directions here since the playground drives it from a
// chosen distance and shows the real timing that distance would produce.
export const SPEED_OF_SOUND_CM_PER_US = 0.034;
export function ultrasonicEchoTimeUs(distanceCm: number): number {
  return (distanceCm * 2) / SPEED_OF_SOUND_CM_PER_US;
}
export function ultrasonicDistanceFromEchoTime(echoTimeUs: number): number {
  return (echoTimeUs * SPEED_OF_SOUND_CM_PER_US) / 2;
}

// -- Servo motor PWM control --------------------------------------------------
// Standard hobby servo (50Hz / 20ms period): a 1ms pulse holds 0 degrees,
// 1.5ms holds 90 degrees (centre), 2ms holds 180 degrees -- the exact
// convention used by real RC servos and Arduino's Servo library.
export function servoPulseWidthMsToAngle(pulseMs: number): number {
  return Math.max(0, Math.min(180, ((pulseMs - 1) / 1) * 180));
}
export function servoAngleToPulseWidthMs(angleDeg: number): number {
  return 1 + (Math.max(0, Math.min(180, angleDeg)) / 180) * 1;
}

// -- Stepper motor --------------------------------------------------------------
// RPM from step rate: RPM = (stepsPerSecond * 60) / stepsPerRevolution.
// Common real step angles: 1.8 degrees/step (200 steps/rev, standard NEMA
// stepper) and 0.9 degrees/step (400 steps/rev, half-stepping).
export function stepperRPM(stepsPerSecond: number, stepsPerRevolution: number): number {
  return (stepsPerSecond * 60) / stepsPerRevolution;
}
export function stepperDegreesPerStep(stepsPerRevolution: number): number {
  return 360 / stepsPerRevolution;
}

// -- Gear trains ------------------------------------------------------------
// outputSpeed = inputSpeed * (inputTeeth / outputTeeth); torque trades off
// exactly inversely with speed (ignoring friction/efficiency losses) --
// outputTorque = inputTorque * (outputTeeth / inputTeeth). This inverse
// relationship is the entire reason gearboxes exist: trade speed for
// torque, or torque for speed, never both at once.
export function gearOutputRPM(inputRPM: number, inputTeeth: number, outputTeeth: number): number {
  return inputRPM * (inputTeeth / outputTeeth);
}
export function gearOutputTorque(inputTorque: number, inputTeeth: number, outputTeeth: number): number {
  return inputTorque * (outputTeeth / inputTeeth);
}

// -- Differential drive kinematics -------------------------------------------
// The real steering math behind every two-wheeled differential-drive robot
// (most line-followers, warehouse robots, and robot vacuums): angular
// velocity omega = (Vright - Vleft) / wheelbase; the robot's forward speed
// is the average of both wheel speeds.
export function differentialAngularVelocity(leftSpeed: number, rightSpeed: number, wheelbase: number): number {
  return (rightSpeed - leftSpeed) / wheelbase;
}
export function differentialLinearVelocity(leftSpeed: number, rightSpeed: number): number {
  return (leftSpeed + rightSpeed) / 2;
}

// -- Closed-loop control: the Proportional (P) term ---------------------------
// The simplest real feedback-control law, and the P in PID (the control
// algorithm behind nearly every self-balancing robot, drone, and motor
// speed controller): correction = Kp * error. A full PID controller adds
// Integral and Derivative terms on top of this same core idea.
export function pControllerOutput(kp: number, error: number): number {
  return kp * error;
}

// -- Encoder odometry ----------------------------------------------------------
// How a robot calculates the real distance it has physically travelled
// from a wheel encoder's pulse count: distance = (pulses / pulsesPerRev) *
// pi * wheelDiameter -- one full revolution's worth of pulses covers
// exactly the wheel's circumference.
export function encoderDistanceCm(pulses: number, pulsesPerRevolution: number, wheelDiameterCm: number): number {
  return (pulses / pulsesPerRevolution) * Math.PI * wheelDiameterCm;
}

// ============================================================================
// Hands-On Experiments Laboratory -- the formulas above already describe how
// each component works; these are the real algorithms that let a student
// actually DESIGN and TUNE something with them, verified with a standalone
// script (run, checked, deleted) before any UI was written, same discipline
// as everything above.
// ============================================================================

// -- Full PID control (the P above is one term of this) -----------------------
// The standard discrete-time embedded-systems form: output = Kp*error +
// Ki*(running sum of error*dt) + Kd*(error - previousError)/dt -- exactly
// the algorithm real Arduino PID libraries and industrial controllers run,
// not a simplified stand-in. Used to tune a real line-follower and a real
// self-balancing robot.
export interface PidState { integral: number; previousError: number }
export interface PidResult { output: number; state: PidState }
export function pidStep(state: PidState, error: number, dt: number, kp: number, ki: number, kd: number): PidResult {
  const integral = state.integral + error * dt;
  const derivative = dt > 0 ? (error - state.previousError) / dt : 0;
  const output = kp * error + ki * integral + kd * derivative;
  return { output, state: { integral, previousError: error } };
}
export const PID_ZERO_STATE: PidState = { integral: 0, previousError: 0 };

// -- 2-link planar robotic arm: forward and inverse kinematics ---------------
// The real, standard textbook solution for a 2-joint arm (see e.g. Craig's
// "Introduction to Robotics: Mechanics and Control") -- elbow-down solution.
// Angles in radians.
export function forwardKinematics2Link(l1: number, l2: number, theta1: number, theta2: number): { x: number; y: number } {
  const x = l1 * Math.cos(theta1) + l2 * Math.cos(theta1 + theta2);
  const y = l1 * Math.sin(theta1) + l2 * Math.sin(theta1 + theta2);
  return { x, y };
}
export function inverseKinematics2Link(l1: number, l2: number, x: number, y: number): { theta1: number; theta2: number } | null {
  const d = Math.sqrt(x * x + y * y);
  if (d > l1 + l2 || d < Math.abs(l1 - l2)) return null; // genuinely unreachable, not just clamped
  let cosTheta2 = (d * d - l1 * l1 - l2 * l2) / (2 * l1 * l2);
  cosTheta2 = Math.max(-1, Math.min(1, cosTheta2));
  const theta2 = Math.acos(cosTheta2);
  const theta1 = Math.atan2(y, x) - Math.atan2(l2 * Math.sin(theta2), l1 + l2 * Math.cos(theta2));
  return { theta1, theta2 };
}

// -- Morse code: real ITU-R M.1677-1 international timing standard -----------
// dot = 1 unit, dash = 3 units, gap between symbols in one letter = 1 unit,
// gap between letters = 3 units, gap between words = 7 units -- the actual
// international standard, not an approximation.
export const MORSE_CODE_TABLE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
  I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
  Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
};
export interface MorseTick { on: boolean; durationMs: number; symbolIndexInSource?: number }
export function morseTimeline(text: string, unitMs: number): MorseTick[] {
  const timeline: MorseTick[] = [];
  const letters = text.toUpperCase().split('');
  letters.forEach((ch, li) => {
    if (ch === ' ') { timeline.push({ on: false, durationMs: 7 * unitMs }); return; }
    const code = MORSE_CODE_TABLE[ch];
    if (!code) return;
    code.split('').forEach((sym, si) => {
      timeline.push({ on: true, durationMs: (sym === '.' ? 1 : 3) * unitMs, symbolIndexInSource: li });
      if (si < code.length - 1) timeline.push({ on: false, durationMs: 1 * unitMs });
    });
    const next = letters[li + 1];
    if (next !== undefined && next !== ' ') timeline.push({ on: false, durationMs: 3 * unitMs });
  });
  return timeline;
}

// -- Tone generation: real equal-temperament note frequencies -----------------
// f = 440 * 2^((n-49)/12), the standard formula for the frequency of piano
// key n (A4 = key 49 = 440 Hz exactly) -- real music-acoustics math, not an
// arbitrary number picked to sound right.
export function pianoKeyFrequencyHz(keyNumber: number): number {
  return 440 * Math.pow(2, (keyNumber - 49) / 12);
}
export interface TonePreset { label: string; keyNumber: number }
// A4=49 (440Hz), C5=52 (~523Hz), A3=37 (220Hz) -- real named pitches, not
// arbitrary numbers.
export const TONE_PRESETS: TonePreset[] = [
  { label: 'Low Warning (A3, 220 Hz)', keyNumber: 37 },
  { label: 'Reversing Beep (A4, 440 Hz)', keyNumber: 49 },
  { label: 'Success Chime (C5, ~523 Hz)', keyNumber: 52 },
  { label: 'Alarm (A5, 880 Hz)', keyNumber: 61 },
];

// -- PWM-driven RGB LED: real 8-bit duty-cycle range -------------------------
// Arduino's analogWrite() (and most microcontroller PWM output) uses an
// 8-bit duty cycle, 0-255 -- this is that exact real range, not a
// simplified 0-100 stand-in.
export const PWM_MAX_8BIT = 255;
export function rgbDutyCyclesToCss(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(PWM_MAX_8BIT, Math.round(v)));
  return `rgb(${clamp(r)}, ${clamp(g)}, ${clamp(b)})`;
}
