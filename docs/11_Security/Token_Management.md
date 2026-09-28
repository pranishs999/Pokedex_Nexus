# Token Management

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-SEC-TM-001 |
| Document Name | Token Management |
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
2. JWT Payload and Verification Rules
3. Refresh Token Rotation (RTR) Workflow
4. Cookie Flags & Storage Rules
5. References

---

# 1. Purpose and Scope

This Token Management document specifies the JWT payload configurations, session token lifecycles, refresh token rotation (RTR) workflows, and token security parameters for the Pokémon Knowledge Management Platform (PKMP) v1.0.0.

---

# 2. JWT Payload and Verification Rules

Authentication uses signed JSON Web Tokens (JWT) using the HMAC SHA-256 algorithm.

- **Access Token Structure:**
  - `sub`: User ID (UUID).
  - `username`: User profile display name.
  - `role`: Permission level mapping (BR-300).
  - `iat`: Timestamp (seconds).
  - `exp`: Expiration timestamp (set to 15 minutes after issuance).
- **Verification Gate:** The NestJS `JwtStrategy` intercepts access tokens via incoming request authorization headers (`Authorization: Bearer <token>`), verifies the signature against the host environment variable (`JWT_ACCESS_SECRET`), and binds the parsed claims payload to the execution context.

---

# 3. Refresh Token Rotation (RTR) Workflow

To secure sessions and prevent unauthorized access, the system uses Refresh Token Rotation (RTR).

```
Client ──► Send Expired Access Token & Refresh Token ──► API Server
                                                             │
   ┌─────────────────────────────────────────────────────────┤
   ▼ (Validates)                                             ▼ (Breaks: Reuse detected)
Generate new Access +                                     Revoke entire token family.
rotated Refresh Token ──► Client                          Force user logout.
```

- **Family Tracking:** Refresh tokens include a family identifier (`tokenId`) and a parent identifier (`parentTokenId`). The database tracks active tokens in a `refresh_tokens` table.
- **Rotation Event:** Requesting a new access token requires sending the current refresh token. The backend verifies the token, generates a new pair, and marks the old refresh token as revoked.
- **Reuse Detection:** If a revoked refresh token is presented, the system flags the attempt as a reuse attack. The entire family of refresh tokens associated with that user is immediately invalidated, forcing a logout across all active sessions.

---

# 4. Cookie Flags & Storage Rules

- **Client Storage:** The frontend client holds the access token in memory, preventing XSS access to session states.
- **Secure Cookie:** The refresh token is transmitted using an HTTP-only secure cookie, protecting it from client-side script access.
  - `HttpOnly`: Enforced.
  - `Secure`: Enforced (only transmitted over HTTPS connections).
  - `SameSite`: SameSite=Strict (mitigates CSRF vulnerabilities).

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| Business Rules | `docs/01_Requirements/08_Business_Rules.md` |
| Data Requirements | `docs/01_Requirements/09_Data_Requirements.md` |
| Security Requirements | `docs/01_Requirements/13_Security_Requirements.md` |
| API Requirements | `docs/01_Requirements/14_API_Requirements.md` |
| OWASP ASVS Checklist | `docs/11_Security/OWASP_ASVS_Checklist.md` |

---

# Next Document

```
docs/11_Security/CORS_and_Headers.md
```

The CORS and Headers document defines server security middleware configurations, CORS domain whitelist rules, and Helmet parameters.
