# Asset Caching

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-AST-AC-001 |
| Document Name | Asset Caching |
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
2. Nginx Cache-Control Policies
3. PWA Service Worker Caching Strategies
4. Browser Storage Limitations
5. References

---

# 1. Purpose and Scope

This Asset Caching document specifies the Nginx header definitions, service worker routing strategies, cache-control policies, and browser local storage limits for the assets of the Pokémon Knowledge Management Platform (PKMP) v1.0.0.

---

# 2. Nginx Cache-Control Policies

To prevent unnecessary server roundtrips, Nginx is configured to serve static assets with aggressive caching headers.

- **Immutable Assets:** Sprites, artwork, fonts, and 3D models are immutable and include content hashes in their file paths. Nginx serves these with a long expiration header:
  `Cache-Control "public, max-age=31536000, immutable";`
- **Application Bundle (HTML, JS, CSS):** Standard build files must check for updates on each load:
  `Cache-Control "no-cache, must-revalidate";`

---

# 3. PWA Service Worker Caching Strategies

The frontend PWA configures a Workbox-based service worker to handle offline routing:

```typescript
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

// Cache-First strategy for static assets
registerRoute(
  ({ request }) => request.destination === 'image' || request.destination === 'font',
  new CacheFirst({
    cacheName: 'pkmp-static-assets',
    plugins: [
      new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  })
);

// Network-First strategy for encyclopedia list queries
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/v1/pokemon'),
  new NetworkFirst({
    cacheName: 'pkmp-api-cache',
  })
);
```

---

# 4. Browser Storage Limitations

To prevent browser warnings or storage exhaustion, cache allocations are restricted:

- **Cache API Size Limit:** 150 MB (stores optimized sprites and layouts).
- **IndexedDB Limit:** 50 MB (stores custom user teams and checklists).
- **Quota Exceeded Action:** If the storage limit is reached, oldest accessed sprites are evicted first.

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| Performance Requirements | `docs/01_Requirements/17_Performance_Requirements.md` |
| Performance Tuning | `docs/03_Database/Performance_Tuning.md` |
| Nginx Configuration | `docs/10_Deployment/Nginx_Configuration.md` |
| Sprite Optimization | `docs/14_Assets/Sprite_Optimization.md` |
| Model Compression | `docs/14_Assets/Model_Compression.md` |

---

# Next Document

```
docs/15_ADR/README.md
```

This completes the `14_Assets` documentation phase. The next document is `docs/15_ADR/README.md`, which kicks off the Architecture Decision Records phase by detailing tech stack selections, framework decisions, and database choices.
