# Sprite Optimization

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-AST-SO-001 |
| Document Name | Sprite Optimization |
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
2. Image Formats and Directories
3. CLI Compression and Conversion Scripts
4. Responsive & Lazy-loading rules
5. References

---

# 1. Purpose and Scope

This Sprite Optimization document defines the image format selections, compression algorithms, CLI shell optimization commands, file directories, and client-side lazy-loading rules for the 2D visual assets of the Pokémon Knowledge Management Platform (PKMP) v1.0.0.

---

# 2. Image Formats and Directories

To meet performance criteria (REQ-NFR-105), the platform optimizes sprite dimensions.

- **Primary Image Format:** WebP (lossless compression for line-art/sprites, lossy for artwork). WebP reduces file sizes by 30% compared to PNG.
- **Directories Structure:**
  - `/apps/web/public/assets/sprites/` (Species icons and mini-sprites).
  - `/apps/web/public/assets/artwork/` (Official high-definition vector artwork).
  - `/apps/web/public/assets/types/` (SVG type symbol elements).

---

# 3. CLI Compression and Conversion Scripts

To automate asset optimization, a Node.js script converts and compresses source assets using the `sharp` library.

- **Compression Command:**
  The CLI tool compresses files and strips metadata:
  ```javascript
  const sharp = require('sharp');
  
  sharp('source_image.png')
    .webp({ quality: 80, effort: 6 }) // Convert to WebP, quality 80%
    .resize(475, 475, { fit: 'inside' }) // Constraint bounding box
    .toFile('dest_image.webp');
  ```

---

# 4. Responsive & Lazy-loading rules

To optimize initial page load performance:

- **HTML Lazy Loading:** Image elements in listing views must configure lazy loading:
  `<img src="/assets/sprites/1.webp" loading="lazy" alt="Bulbasaur" />`
- **Fallback Rendering:** If a sprite fails to load, the system renders a CSS placeholder matching the element's primary type color.

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| UI/UX Requirements | `docs/01_Requirements/15_UI_UX_Requirements.md` |
| Performance Requirements | `docs/01_Requirements/17_Performance_Requirements.md` |
| Component Design | `docs/02_Architecture/Component_Design.md` |
| Style Guide | `docs/04_UI_UX/Style_Guide.md` |
| UI Component Design | `docs/04_UI_UX/Component_Design.md` |

---

# Next Document

```
docs/14_Assets/Model_Compression.md
```

The Model Compression document defines 3D model formats, glTF pipeline tools, Draco compression settings, and canvas load state handlers.
