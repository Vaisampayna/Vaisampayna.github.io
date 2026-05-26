# GLB Model Drop-In

Place your exported Blender/Houdini model here as:

- `secure-enclave.glb`

The site will auto-load this file using `GLTFLoader` (+ `DRACOLoader` if compressed).
If the file is missing or fails to load, it automatically falls back to the procedural WebGL scene.

Recommended export settings:

1. Format: `glTF Binary (.glb)`
2. Compression: Draco enabled (optional but recommended)
3. Embed textures in the `.glb`
4. Keep triangle count low for web (`< 200k` target)

