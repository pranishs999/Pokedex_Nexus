# CORS and Headers Policy

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-SEC-CH-001 |
| Document Name | CORS and Headers Policy |
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
2. CORS White-List Policies
3. Helmet Security Middleware Parameters
4. References

---

# 1. Purpose and Scope

This CORS and Headers Policy document defines the Cross-Origin Resource Sharing (CORS) whitelists, Helmet security middleware configurations, and response header rules for the backend NestJS application of the Pokémon Knowledge Management Platform (PKMP) v1.0.0.

---

# 2. CORS White-List Policies

CORS restrictions prevent unauthorized sites from reading API data.

- **Origin White-List:** Access is granted only to trusted domains matching the host configurations (e.g., `https://pkmp.org` or `http://localhost:5173` for development). Wildcards (`*`) are prohibited.
- **Request Headers Allowed:** `Authorization`, `Content-Type`, `X-Requested-With`, `Accept`.
- **Request Methods Allowed:** `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`.
- **Credentials Support:** `credentials: true` is enabled to support cookie transmission for session refresh tokens.

---

# 3. Helmet Security Middleware Parameters

The NestJS app uses Helmet middleware to set secure HTTP headers.

```typescript
import helmet from 'helmet';
// Inside main.ts:
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://raw.githubusercontent.com"], // Sprite source domain whitelist
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  referrerPolicy: { policy: 'same-origin' },
}));
```

- **Content Security Policy (CSP):** restrics source domains to prevent execution of unapproved scripts.
- **Server Information Hiding:** Automatically strips the `X-Powered-By` header to hide software version details.

---

# 4. References

## Internal Documents

| Document | Path |
|----------|------|
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| Security Requirements | `docs/01_Requirements/13_Security_Requirements.md` |
| API Requirements | `docs/01_Requirements/14_API_Requirements.md` |
| System Architecture | `docs/02_Architecture/System_Architecture.md` |
| Nginx Configuration | `docs/10_Deployment/Nginx_Configuration.md` |
| OWASP ASVS Checklist | `docs/11_Security/OWASP_ASVS_Checklist.md` |
| Token Management | `docs/11_Security/Token_Management.md` |

---

# Next Document

```
docs/12_Legal/README.md
```

This completes the `11_Security` documentation phase. The next document is `docs/12_Legal/README.md`, which kicks off the Legal phase by detailing fair use compliance, DMCA takedown procedures, privacy policies, and terms of service.
