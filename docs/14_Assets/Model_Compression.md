# Model Compression

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-AST-MC-001 |
| Document Name | Model Compression |
| Version | 1.0.0 |
| Status | Draft |
| Documentation Standard | IEEE 29148 |
| Author | Project Owner |
| Last Updated | TBD |

---

# Revision History

| Version | Date | Author | Description |
|----------|------|--------|-------------|
| 1.0.0 | TBD | Project Owner | Initial version |

---

# Table of Contents

1. Purpose and Scope
2. 3D Model Formats & Standards
3. Draco Compression CLI Parameters
4. React Three Fiber Canvas Loaders
5. References

---

# 1. Purpose and Scope

This Model Compression document defines the 3D model configurations, mesh compression algorithms, CLI scripts, and loader structures for the hybrid 3D/2D canvas views of the Pokémon Knowledge Management Platform (PKMP) v1.0.0.

---

# 2. 3D Model Formats & Standards

To ensure compatibility with React Three Fiber (Three.js), 3D assets must adhere to these standards:

- **Format Selection:** binary GLB (glTF) format to store meshes, materials, and textures in a single file.
- **Embedded Rigging:** Models include bones and bone weight maps for idle animation support.
- **Texture Budgets:** Textures are limited to 1024x1024 maps using PBR materials to keep memory footprint under 2MB.

---

# 3. Draco Compression CLI Parameters

Raw 3D models (~15MB–30MB) are optimized using Draco compression algorithms via the `gltf-pipeline` CLI:

- **Optimization Command:**
  ```bash
  # Install gltf-pipeline globally
  npm install -g gltf-pipeline
  
  # Run Draco compression with quantization parameters
  gltf-pipeline -i model.glb -o model-draco.glb -d --draco.quantizePositionBits 14 --draco.quantizeTexcoordBits 12
  ```
- **Compression Ratio:** This reduces files to ≤ 1.5MB.

---

# 4. React Three Fiber Canvas Loaders

To load compressed GLB files smoothly:

- **Draco Decoder Configuration:** The canvas configures a local Draco decoder script to decode model meshes on the client:
  ```typescript
  import { useGLTF } from '@react-three/drei';
  // Load using Draco decoder path
  const { scene } = useGLTF('/assets/models/bulbasaur.glb', '/draco-decoder/');
  ```
- **Suspense Fallback:** Model loading is wrapped in React `Suspense`. If rendering fails, the canvas catches the exception and falls back to rendering a 2D high-definition WebP artwork card.

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| UI/UX Requirements | `docs/01_Requirements/15_UI_UX_Requirements.md` |
| Performance Requirements | `docs/01_Requirements/17_Performance_Requirements.md` |
| Component Design | `docs/02_Architecture/Component_Design.md` |
| Page Layouts | `docs/04_UI_UX/Page_Layouts.md` |
| Sprite Optimization | `docs/14_Assets/Sprite_Optimization.md` |

---

# Next Document

```
docs/14_Assets/Asset_Caching.md
```

The Asset Caching document defines browser Cache-Control policies, service worker caching, and local asset storage limits.
