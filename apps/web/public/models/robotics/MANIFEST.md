# Robotics Lab -- 3D Model Manifest

Every model below is real, CC-Attribution licensed, and already referenced
in code (`packages/content/src/roboticsFundamentals.ts` and
`roboticsApplications.ts`) by the exact filename in the **Save as** column.
Robot3DViewer (`apps/web/src/components/labshared/Robot3DViewer.tsx`) shows
a "3D model coming soon" placeholder for any file not yet present here --
so the site stays safe to deploy at every step; each file just lights up
the moment it lands in this folder with the right name.

## How to download each one

1. Open the **Sketchfab URL** below (you'll need to be logged in -- you've
   already created an account).
2. Click **Download 3D Model**.
3. In the format picker, choose **glTF** (the option that produces a
   `.glb` file) -- not "Original", USDZ, or OBJ.
4. Rename the downloaded file to exactly the **Save as** name below.
5. Drop it into this folder: `apps/web/public/models/robotics/`.

Once a batch of files is here, tell me and I'll verify, adjust anything
that needs it (some Sketchfab exports come in at an unusual scale --
Robot3DViewer auto-fits the camera to whatever it receives, so this is
usually invisible, but I'll sanity-check), then commit, push, and deploy.

## Fundamentals (Sensors, Actuators, Mechanisms, Electronics)

| Component | Save as | Sketchfab URL | Author | License |
|---|---|---|---|---|
| Ultrasonic Distance Sensor (HC-SR04) | `ultrasonic-hcsr04.glb` | https://sketchfab.com/3d-models/hc-sr04-e8a6adcef8fd4f45bf27b8d7718ed489 | peddintiudaykiran176 | CC Attribution |
| IR Proximity/Line Sensor | `ir-sensor.glb` | https://sketchfab.com/3d-models/ir-sensor-module-for-arduino-projects-3d-model-6ad4f3afb83940fea95cd3846aa68a18 | Veer AI | CC Attribution |
| PIR Motion Sensor | `pir-sensor.glb` | https://sketchfab.com/3d-models/pir-sensor-2f64edc09d4c4be5aaa26acecacb36ea | Zeyad Ibrahim Hamed | CC Attribution |
| Rotary Encoder (KY-040) | `rotary-encoder.glb` | https://sketchfab.com/3d-models/rotary-encoder-module-ky-040-dummy-26063555c841414fbd1bab9e204d34c1 | YouniqueĪdeaStudio | CC Attribution |
| Servo Motor (SG90, 1:1 scale) | `servo-sg90.glb` | https://sketchfab.com/3d-models/sg90-servo-11-scale-c865adb97e32477f8016658e340375b6 | IQuanix | CC Attribution |
| DC Motor (animated, working principle) | `dc-motor.glb` | https://sketchfab.com/3d-models/model-of-dc-motor-working-principle-e9ac2cf2f2d04180b02965c01f7a9a19 | Mansoor | CC Attribution |
| Stepper Motor (NEMA 17, 42x48mm) | `stepper-nema17.glb` | https://sketchfab.com/3d-models/nema-17-stepper-motor-42mm-x-48mm-b970d52c4b554768a1b576cb381abf07 | moogh | CC Attribution |
| Gear Train (animated meshing) | `gear-train.glb` | https://sketchfab.com/3d-models/nautilus-gears-train-mechanism-2c0b4a262a6c4323997d95920612dfeb | trinityscsp | CC Attribution |
| Line Follower Robot (differential drive) | `line-follower-robot.glb` | https://sketchfab.com/3d-models/line-follower-robot-11bf9b71d5f34517b404d12c74ddb506 | zoe.goodward | CC Attribution |
| 6-Axis Industrial Robot Arm (DOF) | `robotic-arm-6dof.glb` | https://sketchfab.com/3d-models/6-axis-industrial-robot-arm-3ecc74c22c584b2b8295f17dedcdb89f | Jayson Stauffer | CC Attribution |
| Arduino Uno Board | `arduino-uno.glb` | https://sketchfab.com/3d-models/arduino-uno-board-f31feafc5e9743abbdf33c54f9d92669 | crimsonfalcon | CC Attribution |

## Applications Gallery (bonus, reuses two of the above)

| Component | Save as | Sketchfab URL | Author | License |
|---|---|---|---|---|
| Robotic Prosthetic Hand (Youbionic) | `prosthetic-hand.glb` | https://sketchfab.com/3d-models/youbionic-hand-2019-db4efd60aec3417192a5592062abe2dc | ciccarese / Youbionic | CC Attribution |

`robotic-arm-6dof.glb` and `arduino-uno.glb` above are reused automatically
for the Applications Gallery's "Robotic Arm Assembly Line" entry once
present -- no separate download needed for those two.

## Not sourced yet (left as text-only, honestly, rather than a wrong model)

- **LDR (Light Dependent Resistor)** -- no accurately-licensed match found on Sketchfab.
- **Solenoid** -- no accurately-licensed match found (search returned unrelated plumbing valves).
- **IMU / Gyroscope (MPU-6050)** -- only a weak, unverified match found; skipped rather than risk showing the wrong part.
- **Raspberry Pi** -- a real CC-Attribution "Raspberry Pi 3" model exists (https://sketchfab.com/3d-models/raspberry-pi-3-2d308283fc0f4d27b81f17a2793c5c4d by JoSaCo) but isn't wired into content yet -- optional bonus if you want it, just ask and I'll wire it in once downloaded.

If you or a student ever finds a better-licensed model for any of these
(or want to replace any of the above with a nicer one), the same process
applies -- just tell me the new URL and I'll re-wire it.
