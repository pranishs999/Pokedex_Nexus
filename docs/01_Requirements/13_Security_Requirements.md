# Security Requirements

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-SE-002 |
| Document Name | Security Requirements |
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
2. Authentication & Session Management
3. Authorization & RBAC Validation
4. Data Protection & Cryptography
5. Network Security & Threat Mitigation
6. References

---

# 1. Purpose and Scope

This Security Requirements document defines requirements for database encryption, user authentication, role check guards, rate limits, and network safety of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. The platform is designed to achieve OWASP ASVS Level 1 compliance.

---

# 2. Authentication & Session Management

Authentication verifies user identities before allowing access to user-specific or administrative capabilities.

- **Credentials Storage:** Passwords must be hashed using bcrypt with a work factor of ≥ 10. Raw passwords must never be stored, logged, or transmitted in plaintext.
- **Session Tokens:**
  - **Access Token:** Short-lived JWT (15-minute expiration) containing user ID, username, and role, stored in memory client-side.
  - **Refresh Token:** Long-lived token (7-day expiration) stored in an HTTP-only, secure, SameSite=Strict cookie.
- **Token Rotation:** Each request to refresh an access token must rotate the refresh token. The old refresh token is immediately invalidated. If a used refresh token is presented, the entire family of refresh tokens is revoked to prevent reuse attacks.

---

# 3. Authorization & RBAC Validation

Authorization restricts access to resources based on authenticated user roles.

- **Access Guards:** Backend API endpoints must implement NestJS Guards that verify the user's role against route requirements before processing requests.
- **Hierarchical Verification:** The system must evaluate permissions hierarchically, ensuring higher roles (e.g., Admin) inherit permissions from lower roles (e.g., User, Moderator).
- **Client Route Protection:** The frontend TanStack Router must check roles before entering protected routes, redirecting unauthorized users to the login screen.

---

# 4. Data Protection & Cryptography

Data protection protects sensitive user information and application secrets.

- **Secrets Management:** Cryptographic keys, database credentials, and external tokens must be loaded from environment variables (`.env`). Secrets must not be hardcoded in the repository.
- **Transport Encryption:** Force SSL/TLS 1.3 for all production API connections. Insecure HTTP connections must redirect to HTTPS.
- **Database Security:**
  - Parameterize all SQL queries using Prisma ORM to prevent SQL injection.
  - Keep user passwords isolated from other user-profile API responses.

---

# 5. Network Security & Threat Mitigation

Threat mitigation protects the platform from common web vulnerabilities.

- **Rate Limiting:**
  - Implement rate limiting (e.g., using `@nestjs/throttler`) to limit API requests.
  - Limits: Maximum of 100 requests per 15 minutes per IP address for standard routes, and 5 requests per 15 minutes for authentication routes (`/api/auth/login`, `/api/auth/register`).
- **Input Sanitization:**
  - All input payloads must be validated against Zod schemas.
  - Inputs must be sanitized to strip HTML or script tags, preventing Cross-Site Scripting (XSS) attacks.
- **Security Headers:** The NestJS API must configure standard HTTP security headers using Helmet middleware (CSP, X-Frame-Options, HSTS).

---

# 6. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Assumptions & Constraints | `docs/00_Project_Management/05_Assumptions_and_Constraints.md` |
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| Business Rules | `docs/01_Requirements/08_Business_Rules.md` |
| Data Requirements | `docs/01_Requirements/09_Data_Requirements.md` |

---

# Next Document

```
docs/01_Requirements/14_API_Requirements.md
```

The API Requirements document defines the specifications for REST endpoints, request/response formats, error codes, and API rate-limiting rules.
