# Chem Lab -- 3D Model Manifest

Same process as Robotics Lab's `public/models/robotics/MANIFEST.md` -- every
model below is real, CC-licensed, and already referenced in code
(`packages/content/src/equipment.ts`) by the exact folder name in the
**Save as** column. `Model3DViewer`
(`apps/web/src/components/labshared/Model3DViewer.tsx` -- the same viewer
Robotics Lab uses, generalized and hardened there first) shows a "3D view
interrupted" retry placeholder for any file not yet present here, so the
site stays safe to deploy at every step; each file lights up the moment it
lands in this folder with the right name.

## How to download each one

1. Open the **Sketchfab URL** below (you'll need to be logged in -- the
   same account you used for Robotics Lab's models works here too).
2. Click **Download 3D Model** -- you'll get a `.zip`.
3. Unzip it. Almost every model so far turns out to be a **split glTF**
   (`scene.gltf` + `scene.bin` + an optional `textures/` folder, not a
   single `.glb`) -- same as every Robotics model.
4. Create a folder named exactly the **Save as** name below inside
   `apps/web/public/models/chem/`.
5. Copy everything from the unzipped folder into it, keeping `scene.gltf`,
   `scene.bin`, and any `textures/` folder together as siblings.

If a model's zip instead contains a single `.glb` file, drop that in
directly as `<name>.glb` and tell me which one -- the code path differs
slightly (`.../name/scene.gltf` vs `.../name.glb`).

Once a batch is here, tell me and I'll verify each `scene.gltf`'s internal
references resolve against the actual files, then wire, commit, push, and
deploy.

## Equipment Studio -- Phase 1 (11 items)

| Status | Apparatus | Save as (folder) | Sketchfab URL | Author | License |
|---|---|---|---|---|---|
| ✅ done | Beaker | `beaker/` | https://sketchfab.com/3d-models/beakers-b63ae471653f41e4b327cdcc796fc20c | cesar.seidel | CC Attribution |
| ✅ done | Conical (Erlenmeyer) Flask | `conical-flask/` | https://sketchfab.com/3d-models/free-conical-flask-laboratory-low-poly-f2991abcaaa44616ad5f72d29a3d47b3 | Naked Singularity Studio | CC Attribution |
| ✅ done | Round-Bottom Flask | `round-bottom-flask/` | https://sketchfab.com/3d-models/round-bottom-flasks-7433a11498464de78f7751578bbbe211 | cesar.seidel | CC Attribution |
| ✅ done | Measuring Cylinder | `measuring-cylinder/` | https://sketchfab.com/3d-models/graduated-cylinders-e0a1a66e2d104e4fb5b410ea84cd6b6f | cesar.seidel | CC Attribution |
| ✅ done | Test Tube Rack | `test-tube-rack/` | https://sketchfab.com/3d-models/test-tube-rack-f09bcbfe529e4314a1acbf7b7d1e867f | Harry Bond | CC Attribution |
| ✅ done | Bunsen Burner | `bunsen-burner/` | https://sketchfab.com/3d-models/bunsen-burner-5185e41b2beb48fa8f15ca3707f43e10 | Dreamsoft Innovations Pvt Ltd | CC Attribution |
| ✅ done | Funnel | `funnel/` | https://sketchfab.com/3d-models/cc0-funnel-3-9c71ecea8e0941af9f0e7b59895f7fd4 | plaggy | CC0 (Public Domain) |
| ✅ done | Burette | `burette/` | https://sketchfab.com/3d-models/burette-4bb5f945638a46ba9ea5684d0f38ebad | 3dLabWare | CC Attribution |
| ✅ done | Volumetric Pipette | `pipette/` | https://sketchfab.com/3d-models/pipette-laboratory-essential-tool-4ed0651f9de14cdf96891449acb7cc38 | 3dLabWare | CC Attribution |
| ✅ done | Retort Stand with Clamp | `retort-stand/` | https://sketchfab.com/3d-models/universal-support-8f78057785f447e5a44758464a8186c0 | 3dLabWare | CC Attribution |
| ✅ done | Boiling Tube | `boiling-tube/` | https://sketchfab.com/3d-models/large-tube-and-rack-7743f61c59584492a3811dda9ef1f6da | 3dLabWare | CC Attribution |

All 11 Phase 1 models are now live. `burette/`'s buffer file is genuinely
named just `.bin` (no basename) -- that's exactly what its `scene.gltf`
references, not a mistake; it has no separate texture files either
(material has no image maps).

## Equipment Studio -- Phase 2 (5 items)

| Status | Apparatus | Save as (folder) | Sketchfab URL | Author | License |
|---|---|---|---|---|---|
| ✅ done | Tripod Stand | `tripod-stand/` | https://sketchfab.com/3d-models/tripod-stand-676ab614343941d7b51a77962a97f5af | VeeRuby Technologies Pvt Ltd | CC Attribution |
| ✅ done | Test Tube | `test-tube/` | https://sketchfab.com/3d-models/chemistry-4-test-tube-f933e29ea9114b0cbcd8bec005833f5a | Smoothie 3D | CC Attribution |
| ✅ done | Test Tube Holder | `test-tube-holder/` | https://sketchfab.com/3d-models/test-tube-holder-8841d9db0fda442388b22a8cd5baf25b | Jordan Gerhardt | CC Attribution |
| ✅ done | Safety Goggles | `safety-goggles/` | https://sketchfab.com/3d-models/safety-goggles-355f1e119c33452ea9e2e8d306360435 | Microsoft | CC Attribution |
| ✅ done | Lab Gloves | `gloves/` | https://sketchfab.com/3d-models/lab-equipment-gloves-3519914b790d47d7a80abbf4ee7919bf | eerotiainen | CC Attribution |

All 5 Phase 2 models are now live -- Equipment Studio has 16 of 28
apparatus items with real 3D models.

Note: `gloves/` is a photogrammetry scan (797k triangles) -- noticeably
heavier than the others, but the only genuine, correctly-licensed match
found. If it loads slowly on lower-end devices, that's expected; a
lighter alternative can replace it later without any other changes.

## Not sourced -- checked, no honest match found

- **Thermometer, Watch Glass, China Dish (Evaporating Dish), Gas Jar,
  Water Trough, Wire Gauze, Delivery Tube, Glass Stirring Rod, Spatula**
  -- searched directly, no correctly-licensed match found (either zero
  results or only unrelated/mismatched items).
- **Dropper** -- the closest real candidates were cosmetic serum-bottle
  droppers (branded skincare products) or a non-downloadable listing;
  showing either would be a wrong-item match, so left text-only.
- **Filter Paper, pH / Litmus Paper** -- flat paper items don't gain much
  from a 3D model; not searched.

If you or a student ever finds a better-licensed model for any of these,
same process applies -- send me the URL and I'll verify and wire it in.
