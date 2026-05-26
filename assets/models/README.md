# GLB Model Drop-In

Place your exported Blender/Houdini model here as:

- `secure-enclave.glb`
- (optional fallback already present) `secure-enclave.gltf`

Loading order:

1. `secure-enclave.glb` (preferred)
2. `secure-enclave.gltf` (embedded placeholder model included by default)
3. Procedural WebGL fallback scene

Recommended export settings:

1. Format: `glTF Binary (.glb)`
2. Compression: Draco enabled (optional but recommended)
3. Embed textures in the `.glb`
4. Keep triangle count low for web (`< 200k` target)
