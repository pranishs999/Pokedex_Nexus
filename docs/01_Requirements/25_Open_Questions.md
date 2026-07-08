# Open Questions

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-OQ-002 |
| Document Name | Open Questions |
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
2. Active Open Questions
3. Resolved Questions Log
4. References

---

# 1. Purpose and Scope

This Open Questions document tracks outstanding architectural, design, data-sourcing, and deployment questions for the Pokémon Knowledge Management Platform (PKMP) v1.0.0. Each question includes impact analysis, alternatives, and status tracking to ensure resolution before milestone gates.

---

# 2. Active Open Questions

## OQ-001 — Sourcing Draco-Compressed 3D glTF Assets
- **Description:** Where will the platform source Draco-compressed 3D glTF models for the R3F detail canvas without infringing copyrights or downloading bloated files?
- **Impact:** High. Affects the feasibility of the 3D model toggle feature (US-102, SF-100).
- **Alternatives Considered:**
  1. *Extract from official game ROMs:* High fidelity but raises legal risks and requires complex extraction tools.
  2. *Sourced from fan repositories (e.g., Sketchfab, models-resource):* Variable quality and inconsistent file formats, requiring manual Draco compression.
  3. *Static 2D Images Only:* Remove 3D canvas entirely from v1.0.0 scope.
- **Current Status:** Open. Assigned to Phase 3 milestone gate.

---

## OQ-002 — PWA Offline Caching Scope
- **Description:** Should the PWA offline storage (IndexedDB / Cache API) cache media datasets (TCG cards, Anime episodes), or limit caching strictly to the core encyclopedia?
- **Impact:** Medium. Affects mobile data consumption and browser storage limitations on mobile devices.
- **Alternatives Considered:**
  1. *Cache Everything:* Simplifies offline capability but runs the risk of browser warnings on iOS/Android due to storage limits.
  2. *Core Only (Recommended):* Cache only base stats, types, moves, and abilities. Fall back to placeholder cards for media lists when offline.
- **Current Status:** Open. Assigned to Phase 5.

---

## OQ-003 — Free-Tier VPS Resource Constraints
- **Description:** Can a standard free-tier VPS (e.g., 1 vCPU, 1GB RAM) host the PostgreSQL database, NestJS API, Redis cache, and Nginx proxy without performance degradation?
- **Impact:** High. Affects the production deployment budget (C-03).
- **Alternatives Considered:**
  1. *Optimize single instance:* Aggressively tune NestJS memory usage and PostgreSQL cache sizing to stay under 1GB RAM.
  2. *Hybrid Hosting:* Deploy static assets on a CDN (e.g., Vercel / Netlify free tiers) and host only the API and database on the VPS.
- **Current Status:** Open. Assigned to Phase 8 milestone gate.

---

# 3. Resolved Questions Log

*No questions have been resolved in the draft phase.*

---

# 4. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Assumptions & Constraints | `docs/00_Project_Management/05_Assumptions_and_Constraints.md` |
| Project Roadmap | `docs/00_Project_Management/07_Roadmap.md` |
| Project Timeline | `docs/00_Project_Management/08_Project_Timeline.md` |
| Risk Register | `docs/00_Project_Management/09_Risk_Register.md` |
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| Performance Requirements | `docs/01_Requirements/17_Performance_Requirements.md` |

---

# Next Document

```
docs/02_Architecture/README.md
```

This completes the `01_Requirements` documentation phase. The next document is `docs/02_Architecture/README.md`, which kicks off the Architecture phase by detailing the systems design, container layouts, component interfaces, and C4 diagram representations.
