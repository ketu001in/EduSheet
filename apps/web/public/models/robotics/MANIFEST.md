# Robotics Lab -- 3D Model Manifest

Every model below is real, CC-Attribution licensed, and already referenced
in code (`packages/content/src/roboticsFundamentals.ts` and
`roboticsApplications.ts`) by the exact filename in the **Save as** column.
Robot3DViewer (`apps/web/src/components/labshared/Robot3DViewer.tsx`) shows
a "3D model coming soon" placeholder for any file not yet present here --
so the site stays safe to deploy at every step; each file just lights up
the moment it lands in this folder with the right name.

## How to download each one

Every model sourced so far has come as a **split glTF** (a `.zip`
containing `scene.gltf` + `scene.bin` + an optional `textures/` folder,
not a single `.glb`) -- so this is the process to expect:

1. Open the **Sketchfab URL** below (you'll need to be logged in).
2. Click **Download 3D Model** -- you'll get a `.zip`.
3. Unzip it.
4. Create a folder named exactly the **Save as** name below (no `.glb`
   extension -- these are now folder names) inside
   `apps/web/public/models/robotics/`.
5. Copy everything from the unzipped folder into it, keeping `scene.gltf`,
   `scene.bin`, and any `textures/` folder together as siblings.

If a *different* model's zip turns out to contain a single `.glb` file
instead (some do offer a packaged "glTF Binary" option), just drop that
file in directly using the **Save as** name with `.glb` on the end, and
tell me which one it was -- the code path differs slightly per file
(`.../name/scene.gltf` vs `.../name.glb`), so I'll update that one entry.

Once a batch of files is here, tell me and I'll verify, adjust anything
that needs it (some Sketchfab exports come in at an unusual scale --
Robot3DViewer auto-fits the camera to whatever it receives, so this is
usually invisible, but I'll sanity-check), then commit, push, and deploy.

## Fundamentals (Sensors, Actuators, Mechanisms, Electronics)

| Status | Component | Save as (folder) | Sketchfab URL | Author | License |
|---|---|---|---|---|---|
| ✅ done | Ultrasonic Distance Sensor (HC-SR04) | `ultrasonic-hcsr04/` | https://sketchfab.com/3d-models/hc-sr04-e8a6adcef8fd4f45bf27b8d7718ed489 | peddintiudaykiran176 | CC Attribution |
| ✅ done | IR Proximity/Line Sensor | `ir-sensor/` | https://sketchfab.com/3d-models/ir-sensor-module-for-arduino-projects-3d-model-6ad4f3afb83940fea95cd3846aa68a18 | Veer AI | CC Attribution |
| ✅ done | PIR Motion Sensor | `pir-sensor/` | https://sketchfab.com/3d-models/pir-sensor-2f64edc09d4c4be5aaa26acecacb36ea | Zeyad Ibrahim Hamed | CC Attribution |
| ✅ done | Rotary Encoder (KY-040) | `rotary-encoder/` | https://sketchfab.com/3d-models/rotary-encoder-module-ky-040-dummy-26063555c841414fbd1bab9e204d34c1 | YouniqueĪdeaStudio | CC Attribution |
| ✅ done | Servo Motor (SG90, 1:1 scale) | `servo-sg90/` | https://sketchfab.com/3d-models/sg90-servo-11-scale-c865adb97e32477f8016658e340375b6 | IQuanix | CC Attribution |
| ✅ done | DC Motor (animated, working principle) | `dc-motor/` | https://sketchfab.com/3d-models/model-of-dc-motor-working-principle-e9ac2cf2f2d04180b02965c01f7a9a19 | Mansoor | CC Attribution |
| ✅ done | Stepper Motor (NEMA 17, 42x48mm) | `stepper-nema17/` | https://sketchfab.com/3d-models/nema-17-stepper-motor-42mm-x-48mm-b970d52c4b554768a1b576cb381abf07 | moogh | CC Attribution |
| ✅ done | Gear Train (animated meshing) | `gear-train/` | https://sketchfab.com/3d-models/nautilus-gears-train-mechanism-2c0b4a262a6c4323997d95920612dfeb | trinityscsp | CC Attribution |
| ✅ done | Line Follower Robot (differential drive) | `line-follower-robot/` | https://sketchfab.com/3d-models/line-follower-robot-11bf9b71d5f34517b404d12c74ddb506 | zoe.goodward | CC Attribution |
| ✅ done | 6-Axis Industrial Robot Arm (DOF) | `robotic-arm-6dof/` | https://sketchfab.com/3d-models/6-axis-industrial-robot-arm-3ecc74c22c584b2b8295f17dedcdb89f | Jayson Stauffer | CC Attribution |
| ✅ done | Arduino Uno Board | `arduino-uno/` | https://sketchfab.com/3d-models/arduino-uno-board-f31feafc5e9743abbdf33c54f9d92669 | crimsonfalcon | CC Attribution |

All 11 Fundamentals models are now live. Only the two bonus items below
remain, both optional.

## Applications Gallery (bonus, reuses two of the above)

| Status | Component | Save as (folder) | Sketchfab URL | Author | License |
|---|---|---|---|---|---|
| ✅ done | Robotic Prosthetic Hand (Youbionic) | `prosthetic-hand/` | https://sketchfab.com/3d-models/youbionic-hand-2019-db4efd60aec3417192a5592062abe2dc | ciccarese / Youbionic | CC Attribution |

`robotic-arm-6dof/` and `arduino-uno/` above are reused automatically for
the Applications Gallery's "Robotic Arm Assembly Line" entry once
present -- no separate download needed for those two.

## Downloaded but not yet displayed anywhere

- **Raspberry Pi 3** -- `raspberry-pi/` (source: https://sketchfab.com/3d-models/raspberry-pi-3-2d308283fc0f4d27b81f17a2793c5c4d
  by JoSaCo, CC Attribution) is downloaded, verified, and sitting in this
  folder, but deliberately left un-wired: no existing content entry
  actually runs on a Raspberry Pi (Alexa/Google Home aren't Pi-based, and
  swapping it in for Arduino Uno on the microcontroller-vs-microprocessor
  entry would remove a model that's correctly matched to remove one that
  wouldn't be). Rather than force a factually-wrong pairing, it's parked
  here -- if a new Fundamentals or Applications entry is ever added where
  a Raspberry Pi genuinely belongs (e.g. a "single-board computer" or
  home-server/IoT-hub entry), point its `model3d.src` at
  `/models/robotics/raspberry-pi/scene.gltf` and it'll work immediately.

## Not sourced yet (left as text-only, honestly, rather than a wrong model)

- **LDR (Light Dependent Resistor)** -- no accurately-licensed match found on Sketchfab.
- **Solenoid** -- no accurately-licensed match found (search returned unrelated plumbing valves).
- **IMU / Gyroscope (MPU-6050)** -- only a weak, unverified match found; skipped rather than risk showing the wrong part.

If you or a student ever finds a better-licensed model for any of these
(or want to replace any of the above with a nicer one), the same process
applies -- just tell me the new URL and I'll re-wire it.
