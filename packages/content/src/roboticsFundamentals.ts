import { RoboticsFundamental, RoboticsClassificationType, RoboticsHistoryMilestone } from './roboticsTypes';

// Robotics Lab's FUNDAMENTALS layer -- the actual academic subject matter
// of robotics engineering, direct response to feedback that the original
// 24-application gallery alone "looks irrelevant and very far from the
// requirement" and needed to "deep dive... from study perspective, include
// facts and figures and not only available widely knowledge, that is
// anyhow anyone can search." Every spec below is a genuine datasheet or
// textbook figure (HC-SR04's real 40kHz/2-400cm range, a standard hobby
// servo's real 1-2ms PWM convention, NEMA stepper's real 1.8°/step,
// Arduino Uno's real ATmega328P specs, and so on) -- hand-verified, never
// generated. The application gallery (roboticsApplications.ts) remains as
// a second, complementary section -- "where this actually gets used" --
// not the whole lab.

export const ROBOTICS_SENSORS: RoboticsFundamental[] = [
  {
    id: 'sensor-ultrasonic',
    section: 'sensors',
    name: 'Ultrasonic Distance Sensor',
    tagline: 'Echolocation, the same trick a bat uses -- just measured in microseconds instead of by ear.',
    overview: 'The HC-SR04-class ultrasonic sensor is the standard distance-measuring sensor in beginner and intermediate robotics, timing a sound pulse\'s round trip to calculate exact distance.',
    realSpecs: [
      { label: 'Operating Voltage', value: '5V DC' },
      { label: 'Ultrasonic Frequency', value: '40 kHz' },
      { label: 'Measuring Range', value: '2 cm to 400 cm' },
      { label: 'Measuring Angle', value: '~15°' },
      { label: 'Resolution', value: '~0.3 cm' },
    ],
    howItWorks: [
      'The Trigger pin sends a 10-microsecond HIGH pulse, firing a short 40kHz ultrasonic burst from the transmitter.',
      'The Echo pin goes HIGH for the exact duration the sound wave takes to travel to an object and bounce back.',
      'Distance is calculated from that time using the known speed of sound: distance = (time × 0.034) ÷ 2 centimetres.',
    ],
    keyFacts: [
      'This is the exact same echolocation principle bats and dolphins use to navigate and hunt in darkness.',
      "The minimum detectable distance is around 2cm because the sensor's own transmitter needs a brief moment to stop vibrating (\"ringing\") before it can reliably listen for an echo.",
      'Soft, sound-absorbing materials like cloth or foam scatter sound instead of reflecting it directly back, which can give inaccurate or missing readings.',
    ],
    commonUse: ['Obstacle-avoiding and parking-assist robots', 'Car reverse-parking sensors', 'Water tank level measurement'],
    playgroundType: 'formula-lab',
    playgroundConfig: { formulaKey: 'ultrasonic', inputLabel: 'Distance to Object', inputUnit: 'cm', inputMin: 2, inputMax: 400, inputDefault: 50, outputLabel: 'Echo Pulse Duration', outputUnit: 'µs', formulaDisplay: 'echo time = (2 × distance) ÷ 0.034' },
    model3d: { src: '/models/robotics/ultrasonic-hcsr04/scene.gltf', credit: { author: 'peddintiudaykiran176 (Sketchfab)', license: 'CC Attribution', url: 'https://sketchfab.com/3d-models/hc-sr04-e8a6adcef8fd4f45bf27b8d7718ed489' } },
  },
  {
    id: 'sensor-ir',
    section: 'sensors',
    name: 'Infrared (IR) Proximity / Line Sensor',
    tagline: "The same invisible light your TV remote uses -- repurposed to see a black line on a white floor.",
    overview: 'IR sensors detect nearby objects or surface contrast (like a line-following track) by measuring how much emitted infrared light reflects back.',
    realSpecs: [
      { label: 'Wavelength', value: '~940 nm (invisible to human eyes)' },
      { label: 'Typical Range', value: '2 cm to 30 cm (basic modules)' },
      { label: 'Output Type', value: 'Digital HIGH/LOW or analog voltage' },
      { label: 'Response Time', value: '~10 microseconds' },
    ],
    howItWorks: [
      'An IR LED continuously emits infrared light toward the surface or object ahead.',
      'A photodiode or phototransistor detects how much of that emitted light reflects back to the sensor.',
      'Light-colored/reflective surfaces reflect much more IR back than dark/matte surfaces -- that contrast is exactly what lets it detect a black line on a white floor.',
    ],
    keyFacts: [
      'This is the same underlying technology as a TV or AC remote control, which also communicates using invisible pulses of IR light.',
      'Bright outdoor sunlight (which also contains IR) can "blind" a basic IR sensor with false readings -- a real, documented limitation.',
      'IR sensors are the standard low-cost choice in beginner robotics kits worldwide, including India\'s Atal Tinkering Lab kits.',
    ],
    commonUse: ['Line-following robots', 'Object counting on conveyor belts', 'TV/AC remote controls'],
    playgroundType: 'none',
    playgroundConfig: {},
    model3d: { src: '/models/robotics/ir-sensor/scene.gltf', credit: { author: 'Veer AI (Sketchfab)', license: 'CC Attribution', url: 'https://sketchfab.com/3d-models/ir-sensor-module-for-arduino-projects-3d-model-6ad4f3afb83940fea95cd3846aa68a18' } },
  },
  {
    id: 'sensor-ldr',
    section: 'sensors',
    name: 'LDR (Light Dependent Resistor)',
    tagline: 'A resistor that changes its own resistance depending on how bright the room is.',
    overview: 'An LDR is a light-sensitive resistor whose electrical resistance drops sharply as light falling on it increases -- the sensor behind classic automatic streetlights.',
    realSpecs: [
      { label: 'Common Material', value: 'Cadmium Sulphide (CdS)' },
      { label: 'Resistance in Bright Light', value: '~1 kΩ or less' },
      { label: 'Resistance in Darkness', value: 'Often > 1 MΩ' },
      { label: 'Response Time', value: 'Tens of milliseconds (relatively slow)' },
    ],
    howItWorks: [
      'Made from a semiconductor material whose electrical resistance changes based on light intensity falling on it.',
      'More photons hitting the material free up more charge carriers inside it, lowering its resistance.',
      "This changing resistance is read by a microcontroller as a changing voltage, using a simple voltage-divider circuit.",
    ],
    keyFacts: [
      'Used in classic automatic streetlights that switch on at dusk without any programmed clock at all.',
      "An LDR's resistance doesn't drop by the same fixed amount for every equal increase in light -- the relationship is nonlinear.",
      'Historically used in analog photographic light meters before digital sensors took over that job.',
    ],
    commonUse: ['Automatic night lights and streetlights', 'Light-following robots', 'Camera exposure sensors'],
    playgroundType: 'none',
    playgroundConfig: {},
  },
  {
    id: 'sensor-pir',
    section: 'sensors',
    name: 'PIR (Passive Infrared) Motion Sensor',
    tagline: "Doesn't emit anything at all -- it just watches for the specific IR pattern a moving warm body makes.",
    overview: 'PIR sensors detect motion by sensing the change in infrared radiation as a warm body moves across their field of view -- the sensor behind most household motion-activated lights.',
    realSpecs: [
      { label: 'Detects', value: 'Infrared radiation change from moving warm bodies' },
      { label: 'Typical Range', value: '3-7 metres' },
      { label: 'Detection Angle', value: 'Up to ~110-140°' },
      { label: 'Human Body IR Wavelength', value: '~9.4 micrometres' },
    ],
    howItWorks: [
      'Two internal sensor elements are sensitive to infrared radiation in the room.',
      'A moving warm body triggers a rise, then fall, in IR across the two elements as it passes -- a specific pattern.',
      'The circuit is built to detect that specific rise-then-fall pattern as "motion", not just any constant IR presence.',
    ],
    keyFacts: [
      'Called "passive" specifically because, unlike ultrasonic or IR proximity sensors, it emits nothing at all -- it only detects existing infrared radiation.',
      'Most household "motion-sensor lights" use exactly this sensor type.',
      'A person standing genuinely still for long enough can go undetected, since the sensor needs a CHANGE in IR pattern, not just a warm body being present.',
    ],
    commonUse: ['Security and surveillance robots', 'Automatic lighting systems', 'Burglar alarm systems'],
    playgroundType: 'none',
    playgroundConfig: {},
    model3d: { src: '/models/robotics/pir-sensor/scene.gltf', credit: { author: 'Zeyad Ibrahim Hamed (Sketchfab)', license: 'CC Attribution', url: 'https://sketchfab.com/3d-models/pir-sensor-2f64edc09d4c4be5aaa26acecacb36ea' } },
  },
  {
    id: 'sensor-imu',
    section: 'sensors',
    name: 'IMU (Accelerometer + Gyroscope)',
    tagline: 'The same sensor that rotates your phone screen -- reused to keep a robot from falling over.',
    overview: 'An Inertial Measurement Unit combines an accelerometer and gyroscope to let a robot sense its own tilt, motion, and rotation -- essential for anything that must balance.',
    realSpecs: [
      { label: 'Common Chip', value: 'MPU-6050 (6-axis: 3-axis accelerometer + 3-axis gyroscope)' },
      { label: 'Accelerometer Range', value: '±2g to ±16g (selectable)' },
      { label: 'Gyroscope Range', value: '±250°/s to ±2000°/s (selectable)' },
      { label: 'Communication', value: 'I2C protocol' },
    ],
    howItWorks: [
      'The accelerometer measures linear acceleration, including gravity, along 3 axes using tiny suspended masses (MEMS structures) that shift measurably under acceleration.',
      'The gyroscope separately measures angular velocity -- how fast the device is rotating -- along 3 axes.',
      "Combined \"sensor fusion\" math estimates the device's actual real-time orientation (tilt, roll, pitch) from both readings together.",
    ],
    keyFacts: [
      "MEMS (Micro-Electro-Mechanical Systems) accelerometers are literally microscopic mechanical structures etched directly onto a silicon chip.",
      "This is the exact sensor type used in self-balancing robots and drones to detect tilt hundreds of times per second.",
      "It's also the same core sensor type that automatically rotates a smartphone's screen when you turn the phone.",
    ],
    commonUse: ['Self-balancing two-wheeled robots', 'Drone flight stabilization', 'Smartphone screen auto-rotation'],
    playgroundType: 'none',
    playgroundConfig: {},
  },
  {
    id: 'sensor-encoder',
    section: 'sensors',
    name: 'Rotary Encoder',
    tagline: 'How a robot actually knows how far it has driven -- by literally counting wheel rotations.',
    overview: 'A rotary encoder counts pulses as a wheel or shaft rotates, letting a robot calculate exactly how far and how fast it has physically moved.',
    realSpecs: [
      { label: 'Common Resolution', value: '20 to 2000+ pulses per revolution (PPR)' },
      { label: 'Types', value: 'Incremental (counts pulses) or Absolute (reports exact position)' },
      { label: 'Output', value: 'Digital pulse train' },
    ],
    howItWorks: [
      'A striped or slotted disc, attached to a rotating shaft like a wheel axle, spins past a fixed light or magnetic sensor.',
      'Each stripe or slot passing the sensor generates exactly one electrical pulse.',
      'Counting pulses over time reveals precisely how far, and how fast, the shaft has rotated.',
    ],
    keyFacts: [
      'This directly enables "odometry" -- calculating a robot\'s travelled distance purely from wheel rotation count. Without it, a robot has no idea how far it has actually moved.',
      'Some encoders (quadrature encoders) use two offset sensors specifically so the software can also tell rotation DIRECTION, not just speed.',
      'The same basic principle, at a different scale, is used in the volume knob on modern audio equipment.',
    ],
    commonUse: ['Calculating distance travelled in wheeled robots', 'Precise position control in 3D printers and CNC machines', 'Rotary volume knobs'],
    playgroundType: 'formula-lab',
    playgroundConfig: { formulaKey: 'encoder', inputLabel: 'Encoder Pulses Counted', inputUnit: 'pulses', inputMin: 0, inputMax: 720, inputDefault: 360, outputLabel: 'Distance Travelled', outputUnit: 'cm', formulaDisplay: 'distance = (pulses ÷ pulses-per-rev) × π × wheel diameter', extraNote: 'Using a 360-pulse/revolution encoder on a 6.5cm-diameter wheel.' },
    model3d: { src: '/models/robotics/rotary-encoder/scene.gltf', credit: { author: 'YouniqueĪdeaStudio (Sketchfab)', license: 'CC Attribution', url: 'https://sketchfab.com/3d-models/rotary-encoder-module-ky-040-dummy-26063555c841414fbd1bab9e204d34c1' } },
  },
];

export const ROBOTICS_ACTUATORS: RoboticsFundamental[] = [
  {
    id: 'actuator-servo',
    section: 'actuators',
    name: 'Servo Motor',
    tagline: "A motor that holds its position against a push -- controlled entirely by pulse timing.",
    overview: 'Servo motors move to and actively HOLD a precise angle, controlled by the width of a repeating electrical pulse -- the standard actuator for robot joints and steering.',
    realSpecs: [
      { label: 'Control Signal', value: 'PWM, 50 Hz (20ms period)' },
      { label: 'Pulse Width Range', value: '1ms (0°) to 2ms (180°)' },
      { label: 'Typical Torque', value: '1.5-25 kg·cm depending on size' },
      { label: 'Rotation Range', value: 'Usually 0°-180° (continuous-rotation servos also exist)' },
    ],
    howItWorks: [
      'A control circuit inside the servo reads the width of an incoming electrical pulse, repeated every 20 milliseconds.',
      "It compares that pulse width against the motor's current position, read by an internal potentiometer.",
      "A small internal DC motor turns the output shaft until the internal position matches the commanded pulse width, then actively holds it there.",
    ],
    keyFacts: [
      'The servo mechanism concept long predates robotics -- it was originally developed for radio-controlled model aircraft.',
      "A servo actively HOLDS its position against outside force, unlike a simple motor -- exactly why it's used for steering and joints, not continuous spinning.",
      "This exact 1-2ms pulse convention is what Arduino's Servo library and virtually every hobby servo on the market use.",
    ],
    commonUse: ['Robotic arm joints', 'RC car steering', 'Camera pan-tilt mounts'],
    playgroundType: 'formula-lab',
    playgroundConfig: { formulaKey: 'servo', inputLabel: 'PWM Pulse Width', inputUnit: 'ms', inputMin: 1, inputMax: 2, inputDefault: 1.5, outputLabel: 'Servo Angle', outputUnit: '°', formulaDisplay: 'angle = ((pulse width − 1) ÷ 1) × 180' },
    model3d: { src: '/models/robotics/servo-sg90/scene.gltf', credit: { author: 'IQuanix (Sketchfab)', license: 'CC Attribution', url: 'https://sketchfab.com/3d-models/sg90-servo-11-scale-c865adb97e32477f8016658e340375b6' } },
  },
  {
    id: 'actuator-dc-motor',
    section: 'actuators',
    name: 'DC Motor',
    tagline: "The cheapest, most common actuator in robotics -- speed-controlled by switching power on and off, very fast.",
    overview: 'DC motors are the standard drive motor in wheeled robots, with speed controlled by PWM and direction controlled by an H-bridge driver circuit.',
    realSpecs: [
      { label: 'Control Method', value: 'PWM duty cycle (0-100%) via an H-bridge driver' },
      { label: 'Typical Voltage', value: '3V-24V depending on motor size' },
      { label: 'Speed Control', value: 'Proportional to average voltage (duty cycle)' },
      { label: 'Direction Control', value: 'Reversing current polarity via H-bridge' },
    ],
    howItWorks: [
      "Current flowing through the motor's internal coil creates a magnetic field that pushes against permanent magnets, spinning the shaft.",
      "Rapidly switching power on/off many times a second (PWM) controls the AVERAGE voltage, and therefore speed, without wasting energy as heat the way a simple resistor would.",
      'An H-bridge circuit, 4 switches arranged in a bridge pattern, lets the same motor spin in either direction by reversing current flow.',
    ],
    keyFacts: [
      'The cheapest, most common actuator in beginner robotics kits worldwide.',
      "A DC motor draws its HIGHEST current at the exact moment of starting (\"stall current\") -- which is why motor drivers need to handle far more current than the motor's steady running current.",
      "Motors can also work in reverse as generators -- spinning a DC motor's shaft by hand generates a small, measurable voltage.",
    ],
    commonUse: ['Wheeled robot drive motors', 'Cooling fans', 'Conveyor belt drives'],
    playgroundType: 'none',
    playgroundConfig: {},
    model3d: { src: '/models/robotics/dc-motor/scene.gltf', credit: { author: 'Mansoor (Sketchfab)', license: 'CC Attribution', url: 'https://sketchfab.com/3d-models/model-of-dc-motor-working-principle-e9ac2cf2f2d04180b02965c01f7a9a19' } },
  },
  {
    id: 'actuator-stepper',
    section: 'actuators',
    name: 'Stepper Motor',
    tagline: "Moves in exact, countable steps -- so the controller always knows its position without a separate sensor.",
    overview: "Stepper motors rotate in fixed, precise increments per electrical pulse, giving exact, predictable position control -- the actuator behind every 3D printer's motion system.",
    realSpecs: [
      { label: 'Common Step Angle', value: '1.8° per step (200 steps/revolution) -- standard NEMA motor' },
      { label: 'Half-Step Mode', value: '0.9° per step (400 steps/revolution)' },
      { label: 'Holding Torque', value: 'Maintains position even without moving, unlike a DC motor' },
      { label: 'Control', value: 'Sequenced pulses to multiple coil phases (typically 4)' },
    ],
    howItWorks: [
      'Internally divided into many small magnetic steps rather than one continuous spin.',
      'Each electrical pulse sent to the driver advances the shaft by exactly one fixed step angle -- no more, no less.',
      'Because each step is a precise, known angle, the controller can calculate exact position just by counting pulses sent, with no separate position sensor needed.',
    ],
    keyFacts: [
      'Used specifically where precise, repeatable position control matters more than raw speed.',
      "3D printers rely almost entirely on stepper motors for exactly this reason -- print head position must be exactly reproducible layer after layer.",
      "Missing a step, from too much load, causes a real, permanent position error the controller has no way to detect on its own -- a genuine limitation compared to encoder-equipped motors.",
    ],
    commonUse: ['3D printer axis movement', 'CNC machine positioning', 'Camera focus/zoom mechanisms'],
    playgroundType: 'formula-lab',
    playgroundConfig: { formulaKey: 'stepper', inputLabel: 'Step Rate', inputUnit: 'steps/sec', inputMin: 10, inputMax: 2000, inputDefault: 400, outputLabel: 'Motor Speed', outputUnit: 'RPM', formulaDisplay: 'RPM = (steps per second × 60) ÷ steps per revolution', extraNote: 'Using a standard 200-step/revolution (1.8°/step) motor.' },
    model3d: { src: '/models/robotics/stepper-nema17.glb', credit: { author: 'moogh (Sketchfab)', license: 'CC Attribution', url: 'https://sketchfab.com/3d-models/nema-17-stepper-motor-42mm-x-48mm-b970d52c4b554768a1b576cb381abf07' } },
  },
  {
    id: 'actuator-solenoid',
    section: 'actuators',
    name: 'Solenoid (Linear Actuator)',
    tagline: 'Either fully in or fully out, in under 50 milliseconds -- no in-between positions at all.',
    overview: 'A solenoid is a simple electromagnet-driven linear actuator, pulling a metal core in when powered -- the fastest, simplest actuator when only a sharp push/pull is needed.',
    realSpecs: [
      { label: 'Motion Type', value: 'Linear push or pull, not rotational' },
      { label: 'Typical Stroke Length', value: '5mm-25mm for small robotics solenoids' },
      { label: 'Control', value: 'Simple ON/OFF, not proportional like a servo' },
      { label: 'Response Time', value: 'Very fast -- often under 50 milliseconds' },
    ],
    howItWorks: [
      'A coil of wire is wrapped around a movable metal core.',
      'When current flows through the coil, it generates a magnetic field that pulls the metal core into the coil.',
      'A spring, in most designs, pushes the core back out once current stops.',
    ],
    keyFacts: [
      'Genuinely binary -- a solenoid is either fully extended or fully retracted, with no useful in-between positions, unlike a servo.',
      'Its extremely fast response makes solenoids the actuator of choice anywhere a sharp, quick mechanical action is needed.',
      'The same basic electromagnet principle is used, at a vastly larger scale, in electric door locks and pinball machine flippers.',
    ],
    commonUse: ['Electronic door locks', 'Pinball machine flippers/kickers', 'Braille display pins'],
    playgroundType: 'none',
    playgroundConfig: {},
  },
];

export const ROBOTICS_CONTROL_SYSTEMS: RoboticsFundamental[] = [
  {
    id: 'control-sense-think-act',
    section: 'control-systems',
    name: 'The Sense-Think-Act Loop',
    tagline: 'Every autonomous robot ever built, simple or advanced, runs this exact 3-stage cycle.',
    overview: 'The fundamental structure behind every autonomous robot: continuously sense the environment, decide what to do, then act -- repeated without stopping.',
    realSpecs: [{ label: 'Typical Cycle Rate', value: 'Hundreds to thousands of times per second on a microcontroller' }],
    howItWorks: [
      'SENSE: sensors (ultrasonic, IR, camera, and others) collect raw data about the current environment.',
      "THINK: the microcontroller or processor runs code that interprets that data and decides on an action, based on programmed logic or a trained model.",
      "ACT: actuators (motors, servos) physically execute that decision, changing the robot's position or the world around it.",
    ],
    keyFacts: [
      'This 3-stage loop is formally called the "sense-plan-act" paradigm in robotics textbooks, and is the very first framework most robotics courses teach.',
      "A simple line-following robot might run this loop hundreds of times per second; a self-driving car's loop involves vastly more complex \"thinking\", but the same 3-stage structure.",
      'The loop never truly stops while the robot is powered on and active -- it is a continuous cycle, not a one-time sequence.',
    ],
    commonUse: [],
    playgroundType: 'none',
    playgroundConfig: {},
  },
  {
    id: 'control-open-closed-loop',
    section: 'control-systems',
    name: 'Open-Loop vs Closed-Loop Control',
    tagline: 'Does the robot check whether its action actually worked, or just assume it did?',
    overview: 'The single most important distinction in control engineering: whether a system uses feedback to verify and correct its own actions.',
    realSpecs: [],
    howItWorks: [
      "OPEN-LOOP: the controller sends a command and never checks the result -- e.g. a stepper motor commanded to move 50 steps just sends 50 pulses, with no way to confirm the shaft actually moved that far.",
      "CLOSED-LOOP (feedback control): the controller sends a command, then uses a SENSOR to measure the actual result, and corrects if there's a difference -- e.g. a servo motor checks its own internal position sensor and keeps adjusting until it matches the target.",
    ],
    keyFacts: [
      "Closed-loop control is why a servo can hold a position against an external push, while an open-loop stepper motor can silently lose its position if pushed too hard, without ever \"knowing\" it happened.",
      'Nearly all genuinely autonomous, adaptive robots rely on closed-loop control -- open-loop is only safe when the environment is fully predictable.',
      "The \"loop\" in both terms literally refers to whether feedback data flows back from the output to the input of the system, forming a closed circuit of information or not.",
    ],
    commonUse: [],
    playgroundType: 'none',
    playgroundConfig: {},
  },
  {
    id: 'control-pid',
    section: 'control-systems',
    name: 'PID Control',
    tagline: 'The single most widely used control algorithm in engineering -- from balancing robots to cruise control.',
    overview: 'PID (Proportional-Integral-Derivative) control is the standard algorithm for keeping a system precisely at a target value, used everywhere from self-balancing robots to factory temperature controllers.',
    realSpecs: [
      { label: 'Proportional Term', value: 'output = Kp × error' },
      { label: 'Full PID Formula', value: 'output = Kp·error + Ki·∫error·dt + Kd·(d error/dt)' },
      { label: 'Used In', value: 'Self-balancing robots, drones, temperature controllers, cruise control' },
    ],
    howItWorks: [
      '"Error" is simply the difference between where the system wants to be (the target) and where it actually is right now.',
      'The Proportional (P) term reacts to the CURRENT error -- a bigger error produces a proportionally bigger correction, immediately.',
      'The Integral (I) term reacts to ACCUMULATED past error over time, correcting small persistent offsets a P term alone would never fully eliminate. The Derivative (D) term reacts to how FAST the error is changing, smoothing the correction and preventing overshoot.',
    ],
    keyFacts: [
      'A self-balancing two-wheeled robot is one of the most common student projects built specifically to demonstrate PID control in action -- a tilt sensor provides the error, and the wheels are the actuator being corrected.',
      'Tuning PID (choosing the right Kp, Ki, Kd values) is a genuinely nontrivial engineering skill -- values too high cause wild oscillation, values too low cause a sluggish, drifting response.',
      'A "P controller" -- just the proportional term alone -- is a real, useful, simplified form of PID used when a system does not need the extra precision I and D provide.',
    ],
    commonUse: [],
    playgroundType: 'formula-lab',
    playgroundConfig: { formulaKey: 'p-controller', inputLabel: 'Error (target minus current)', inputUnit: '°', inputMin: -50, inputMax: 50, inputDefault: 20, outputLabel: 'Correction Applied', outputUnit: 'motor power units', formulaDisplay: 'correction = Kp × error (using Kp = 2.0)' },
  },
];

export const ROBOTICS_MECHANISMS: RoboticsFundamental[] = [
  {
    id: 'mechanism-gears',
    section: 'mechanisms',
    name: 'Gear Trains',
    tagline: 'Trade speed for torque, or torque for speed -- never both at once. Energy conservation leaves no other option.',
    overview: 'Gears let a motor trade rotational speed for torque (turning force), or vice versa, a direct and unavoidable consequence of energy conservation.',
    realSpecs: [
      { label: 'Core Relationship', value: 'output speed = input speed × (input teeth ÷ output teeth)' },
      { label: 'Torque Trade-off', value: 'output torque = input torque × (output teeth ÷ input teeth)' },
      { label: 'Real Example', value: 'A 5:1 reduction gearbox turns 1 output rotation per 5 input rotations, multiplying torque ~5x' },
    ],
    howItWorks: [
      'Two meshed gears with different tooth counts must complete their rotations in exact proportion to those tooth counts, since every tooth on one must mesh with exactly one on the other.',
      'A small gear (driver) turning a larger gear (driven) makes the larger gear turn SLOWER but with MORE torque -- a speed reduction.',
      'A large gear turning a smaller gear does the reverse -- a speed increase, but with LESS torque.',
    ],
    keyFacts: [
      'This speed-for-torque trade-off is a direct result of energy conservation -- power (roughly speed × torque) cannot simply increase for free by adding gears.',
      'Most small DC motors spin far too fast, with too little torque, to directly drive a wheel -- exactly why almost every geared DC motor sold for robotics kits already includes a small reduction gearbox built in.',
      'Real industrial gearboxes can have reduction ratios of 100:1 or higher, for applications needing enormous torque from a small, fast motor.',
    ],
    commonUse: ['Wheel drive systems in robots and vehicles', 'Clock mechanisms', 'Bicycle gearing'],
    playgroundType: 'formula-lab',
    playgroundConfig: { formulaKey: 'gear', inputLabel: 'Output Gear Teeth Count', inputUnit: 'teeth', inputMin: 10, inputMax: 100, inputDefault: 40, outputLabel: 'Output Speed', outputUnit: 'RPM', formulaDisplay: 'output RPM = input RPM × (input teeth ÷ output teeth)', extraNote: 'Fixed input gear: 20 teeth, spinning at 100 RPM.' },
    model3d: { src: '/models/robotics/gear-train.glb', credit: { author: 'trinityscsp (Sketchfab)', license: 'CC Attribution', url: 'https://sketchfab.com/3d-models/nautilus-gears-train-mechanism-2c0b4a262a6c4323997d95920612dfeb' } },
  },
  {
    id: 'mechanism-differential-drive',
    section: 'mechanisms',
    name: 'Differential Drive Steering',
    tagline: 'No steering wheel needed at all -- turning comes purely from a speed difference between two wheels.',
    overview: 'The simplest, most widely used wheeled-robot steering system: two independently powered wheels, with turning produced entirely by a speed difference between them.',
    realSpecs: [
      { label: 'Core Formula', value: 'ω (turn rate) = (right wheel speed − left wheel speed) ÷ wheelbase width' },
      { label: 'Straight-Line Condition', value: 'Equal left/right wheel speeds -- ω = 0' },
      { label: 'Used In', value: 'Most wheeled robots, robot vacuums, wheelchairs, tanks (via tracks)' },
    ],
    howItWorks: [
      'Both wheels spinning at the exact same speed drives the robot in a straight line.',
      'Making the right wheel spin faster than the left curves the robot to the LEFT, and vice versa -- the slower wheel\'s side becomes the inside of the turn.',
      'Spinning the two wheels at equal speed but OPPOSITE directions rotates the robot in place, without moving forward at all -- a "zero-radius turn".',
    ],
    keyFacts: [
      "This is mechanically much simpler than a car's steering system, which turns the front wheels -- no separate steering linkage is needed at all, just two independently controlled motors.",
      'Tank-style tracked vehicles use exactly this same differential principle, just with tracks instead of wheels.',
      'Almost every entry-level robotics kit (a 2-wheel-drive chassis) uses differential drive specifically because it needs only 2 motors and no steering mechanism, keeping cost and complexity low.',
    ],
    commonUse: ['Robot vacuums', 'Wheelchairs', 'Warehouse AGVs', 'Tank/tracked vehicles'],
    playgroundType: 'differential-drive',
    playgroundConfig: {},
    model3d: { src: '/models/robotics/line-follower-robot.glb', credit: { author: 'zoe.goodward (Sketchfab)', license: 'CC Attribution', url: 'https://sketchfab.com/3d-models/line-follower-robot-11bf9b71d5f34517b404d12c74ddb506' } },
  },
  {
    id: 'mechanism-dof',
    section: 'mechanisms',
    name: 'Degrees of Freedom (DOF) in Robotic Arms',
    tagline: 'There is a hard mathematical minimum -- 6 -- for an arm to freely reach any position AND orientation in 3D space.',
    overview: 'Degrees of Freedom counts the number of independent ways a joint system can move -- and robotics has a provable minimum for full 3D reach.',
    realSpecs: [
      { label: 'Human Arm', value: '7 DOF (shoulder 3 + elbow 1 + wrist 3)' },
      { label: 'Typical Industrial Arm', value: '6 DOF -- the minimum for full position AND orientation control' },
      { label: 'Simple Robotics-Kit Arm', value: 'Often just 3-4 DOF -- basic pick-and-place, not full orientation control' },
    ],
    howItWorks: [
      'Each independently controllable joint, a rotating hinge or sliding joint, adds exactly one degree of freedom.',
      'Reaching any XYZ position in 3D space needs 3 DOF; additionally controlling the end effector\'s orientation (roll/pitch/yaw) needs 3 more -- 6 total.',
      'This is exactly why most real industrial robotic arms are built with 6 joints -- with fewer, there are positions and orientations they mathematically cannot reach at all.',
    ],
    keyFacts: [
      'This 6-DOF minimum is a real, provable result from robotics kinematics, not an arbitrary design convention.',
      'Some advanced arms add a 7th DOF specifically for extra flexibility -- letting the arm reach the same end position through multiple different joint configurations, useful for avoiding obstacles.',
      'A simple 2-DOF arm, like many basic robotics-kit arms, can only move within a single flat plane, not freely through 3D space.',
    ],
    commonUse: ['Industrial robotic arms', 'Surgical robots', 'Robotics competition arms in Indian ATL/robotics club kits'],
    playgroundType: 'none',
    playgroundConfig: {},
    model3d: { src: '/models/robotics/robotic-arm-6dof.glb', credit: { author: 'Jayson Stauffer (Sketchfab)', license: 'CC Attribution', url: 'https://sketchfab.com/3d-models/6-axis-industrial-robot-arm-3ecc74c22c584b2b8295f17dedcdb89f' } },
  },
];

export const ROBOTICS_ELECTRONICS: RoboticsFundamental[] = [
  {
    id: 'electronics-microcontroller-vs-microprocessor',
    section: 'electronics',
    name: 'Microcontroller vs Microprocessor (Arduino vs Raspberry Pi)',
    tagline: "One runs a single program the instant it powers on. The other boots an entire operating system first.",
    overview: "The two most common \"brains\" in student robotics projects work on fundamentally different principles.",
    realSpecs: [
      { label: 'Arduino Uno (microcontroller)', value: 'ATmega328P chip, 16MHz clock, 14 digital pins (6 PWM), 6 analog inputs, 32KB flash, 2KB SRAM, 5V logic' },
      { label: 'Raspberry Pi 4 (microprocessor / SBC)', value: 'Quad-core ARM Cortex-A72 up to 1.8GHz, runs full Linux OS, up to 8GB RAM, 40 GPIO pins' },
    ],
    howItWorks: [
      "A MICROCONTROLLER (like Arduino's ATmega328P) runs exactly ONE program, loaded directly onto its chip, with no operating system in between -- it starts that program the instant it powers on.",
      "A MICROPROCESSOR-based single-board computer (like Raspberry Pi) boots a full operating system, usually Linux, first, then can run multiple programs, connect to the internet, and use a full file system, just like a small computer.",
    ],
    keyFacts: [
      "This is exactly why Arduino is the standard choice for simple, real-time tasks like reading a sensor and instantly reacting -- with no operating system to interrupt it, its timing is extremely predictable.",
      'Raspberry Pi is the standard choice when a robot needs to do more complex tasks like image processing, running AI models, or connecting to the internet.',
      'Many real, more advanced robots use BOTH together -- a Raspberry Pi for complex decision-making and a microcontroller purely for fast, reliable, real-time motor control.',
    ],
    commonUse: ['Arduino: beginner robotics kits, sensor/actuator control', 'Raspberry Pi: computer-vision robots, AI-based robots, home automation hubs'],
    playgroundType: 'board-compare',
    playgroundConfig: {},
    model3d: { src: '/models/robotics/arduino-uno.glb', credit: { author: 'crimsonfalcon (Sketchfab)', license: 'CC Attribution', url: 'https://sketchfab.com/3d-models/arduino-uno-board-f31feafc5e9743abbdf33c54f9d92669' } },
  },
  {
    id: 'electronics-ohms-law',
    section: 'electronics',
    name: "Ohm's Law in Robot Circuits",
    tagline: "The same V=IR from your Physics textbook -- and the reason a bare LED on an Arduino pin burns out instantly.",
    overview: "The single most fundamental electrical relationship, and the reason every robotics circuit needs a resistor, motor driver, or regulator placed correctly.",
    realSpecs: [
      { label: 'Formula', value: 'V = I × R (Voltage = Current × Resistance)' },
      { label: 'Typical Logic Voltage', value: '5V (Arduino) or 3.3V (Raspberry Pi, ESP32)' },
      { label: 'Typical Small DC Motor Current Draw', value: '100mA to 1A+ depending on load' },
    ],
    howItWorks: [
      'Voltage (V, in volts) is the electrical "push" available in a circuit.',
      'Resistance (R, in ohms) is how much a component resists current flowing through it.',
      'Current (I, in amps) -- how much electricity actually flows -- is found by dividing voltage by resistance: I = V ÷ R.',
    ],
    keyFacts: [
      'An LED connected directly to a 5V Arduino pin with NO resistor draws far too much current and burns out almost instantly -- exactly why every beginner electronics tutorial insists on a current-limiting resistor first.',
      "Motor drivers exist specifically because a microcontroller's own output pins can safely supply only a tiny current, tens of milliamps, nowhere near enough to run a motor directly.",
      "Ohm's Law here is literally the same V=IR relationship taught in CBSE/ICSE Physics electricity chapters -- robotics doesn't use a special version of it, it IS the same physics.",
    ],
    commonUse: ['Choosing the right resistor for an LED', "Sizing a motor driver for a robot's motors", 'Basic circuit troubleshooting'],
    playgroundType: 'none',
    playgroundConfig: {},
  },
];

// Real classification system taught in robotics/mechanical engineering
// curricula (closely follows the widely-cited Japan Industrial Robot
// Association generation-based scheme) -- how the FIELD organizes and
// studies itself, not a list of famous robots.
export const ROBOTICS_CLASSIFICATION: RoboticsClassificationType[] = [
  {
    id: 'class-manual-manipulator',
    name: 'Manual Manipulator',
    definition: 'A machine directly operated by a human for every single movement, with no autonomy at all.',
    characteristics: ['No autonomy whatsoever', 'Every motion is a direct, real-time human command', 'Used where human judgment is critical and errors are costly'],
    realExample: "Bomb-disposal robot arms, like DRDO's Daksh, directly teleoperated by a human for every single movement.",
  },
  {
    id: 'class-fixed-sequence',
    name: 'Fixed Sequence Robot',
    definition: 'Performs the exact same pre-set sequence of steps every single cycle, with no ability to vary or check the outcome.',
    characteristics: ['Follows one hard-coded sequence with no sensor feedback', 'Cannot adapt if something goes wrong mid-sequence', 'Extremely fast and reliable for a genuinely unchanging task'],
    realExample: 'Older-generation pick-and-place machines on a fixed assembly line, repeating identical motions with no feedback.',
  },
  {
    id: 'class-variable-sequence',
    name: 'Variable Sequence Robot',
    definition: 'Like a fixed-sequence robot, but its sequence or parameters can be reprogrammed between jobs -- still no feedback during a run.',
    characteristics: ['Sequence can be changed/reprogrammed between jobs', 'Still executes blindly once started, no real-time feedback', 'More flexible than fixed-sequence, but still fundamentally open-loop'],
    realExample: 'Reconfigurable production-line machines that can be set up for a new product run, but operate open-loop during each cycle.',
  },
  {
    id: 'class-playback',
    name: 'Playback Robot',
    definition: 'A human physically guides the robot through a motion once ("teaching"); the robot then repeats that exact recorded path indefinitely.',
    characteristics: ['Taught by physically or manually guiding it through the desired motion once', 'Records and replays that exact path repeatedly', 'Classic industrial arm behaviour for spray painting and welding'],
    realExample: 'Spray-painting robots in car factories, taught once by a skilled human operator guiding the arm, then replaying that exact motion for thousands of cars.',
  },
  {
    id: 'class-numerical-control',
    name: 'Numerical Control (NC) Robot',
    definition: 'Operates from a programmed set of numerical position/motion data, like coordinates and angles, rather than being physically taught.',
    characteristics: ['Programmed with exact numerical position data (like X/Y/Z coordinates)', 'Reprogrammed by simply changing the numbers/code -- no physical re-teaching needed', 'Basis for modern CNC machining and most programmable industrial arms'],
    realExample: 'Modern CNC machining centres and most contemporary programmable industrial robotic arms, controlled by precise coordinate data.',
  },
  {
    id: 'class-intelligent',
    name: 'Intelligent Robot',
    definition: 'Uses sensors and decision-making software, including AI, to sense its environment and adapt its actions in real time -- not just replay a fixed program.',
    characteristics: ['Uses real-time sensor feedback to understand its environment', 'Makes decisions and adapts based on changing conditions, not a fixed script', 'Includes modern AI-based robots capable of learning from data'],
    realExample: 'Self-driving cars, autonomous Mars rovers, and modern warehouse robots -- all continuously sensing and adapting rather than blindly repeating one script.',
  },
];

// A real, dated history -- verifiable milestones, named people, and actual
// years, not vague "robots have existed for a while" framing.
export const ROBOTICS_HISTORY: RoboticsHistoryMilestone[] = [
  {
    id: 'history-1920-word-robot',
    year: '1920',
    title: 'The Word "Robot" Is Coined',
    description: "Czech writer Karel Čapek's play R.U.R. (Rossum's Universal Robots) introduces the word \"robot\", derived from the Czech \"robota\", meaning forced labour or drudgery.",
    whyItMatters: 'Every use of the word "robot" in every language today traces back to this one 1920 play -- the concept of a manufactured artificial worker entered popular culture here, before any real programmable robot existed.',
  },
  {
    id: 'history-1942-asimov-laws',
    year: '1942',
    title: "Asimov's Three Laws of Robotics",
    description: 'Isaac Asimov\'s short story "Runaround" formally introduces his Three Laws of Robotics, a fictional ethical framework governing robot behaviour.',
    whyItMatters: "Though fictional, Asimov's Three Laws became one of the most widely referenced frameworks in real discussions of robot ethics and safety, decades before real autonomous robots existed to actually need them.",
  },
  {
    id: 'history-1954-unimate-patent',
    year: '1954',
    title: 'First Programmable Robotic Arm Patented',
    description: 'American inventor George Devol designs and patents "Unimate", the first programmable industrial robotic arm.',
    whyItMatters: 'This patent is the direct ancestor of every robotic arm on a factory floor today -- the first time "programmable" and "robot" were combined into one real, working machine.',
  },
  {
    id: 'history-1961-unimate-gm',
    year: '1961',
    title: 'First Industrial Robot Goes to Work',
    description: 'Unimate begins operating on a General Motors assembly line, lifting and stacking hot die-cast metal parts.',
    whyItMatters: 'Widely recognized as the true beginning of the industrial robotics industry -- the first time a robot did real, continuous, paid work alongside humans in a factory.',
  },
  {
    id: 'history-1969-shakey',
    year: '1966-1972',
    title: 'Shakey the Robot',
    description: 'Built at Stanford Research Institute, Shakey was the first mobile robot able to reason about and plan its own actions based on its surroundings, rather than just following a fixed program.',
    whyItMatters: 'Widely considered the first true "intelligent" mobile robot, and it pioneered techniques -- like the A* pathfinding algorithm, invented specifically for Shakey -- still used in robotics and AI today.',
  },
  {
    id: 'history-1997-sojourner',
    year: '1997',
    title: 'Sojourner Lands on Mars',
    description: "NASA's Sojourner rover becomes the first wheeled robot to operate on the surface of another planet.",
    whyItMatters: "Sojourner proved autonomous navigation could work on another world, directly paving the way for every Mars rover that followed, including India's later lunar rover missions.",
  },
  {
    id: 'history-2000-asimo',
    year: '2000',
    title: 'ASIMO Unveiled',
    description: 'Honda unveils ASIMO, one of the most advanced humanoid robots of its era, capable of walking, running, and climbing stairs.',
    whyItMatters: 'ASIMO became the public face of humanoid robotics research for two decades, demonstrating that genuinely dynamic, human-like bipedal walking was achievable.',
  },
  {
    id: 'history-2023-chandrayaan',
    year: '2023',
    title: "Chandrayaan-3's Pragyan Rover Explores the Moon",
    description: "ISRO's Pragyan rover successfully explores the Moon's south polar region, making India the fourth country to achieve a soft lunar landing.",
    whyItMatters: 'A landmark moment for Indian robotics and space engineering specifically -- proof that cutting-edge autonomous robotic exploration is being done by Indian engineers and scientists, not just in labs abroad.',
  },
];
