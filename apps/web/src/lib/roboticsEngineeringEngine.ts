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
