# OWASP ASVS Checklist

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-SEC-AC-001 |
| Document Name | OWASP ASVS Checklist |
| Version | 1.0.0 |
| Status | Draft |
| Documentation Standard | OWASP ASVS v4.0.3 |
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
2. ASVS Level 1 Compliance Checklist
3. Verification Actions and Commands
4. References

---

# 1. Purpose and Scope

This OWASP ASVS Checklist document outlines the authentication controls, session validation checks, database parameters, and threat mitigation checks required to satisfy Level 1 compliance of the OWASP Application Security Verification Standard (ASVS) v4.0.3 for the Pokémon Knowledge Management Platform (PKMP) v1.0.0.

---

# 2. ASVS Level 1 Compliance Checklist

## 2.1 V2: Authentication Verification
- [ ] **ASVS 2.1.1 (Password length limits):** Verify passwords require a minimum of 8 characters and support up to 64 characters.
- [ ] **ASVS 2.1.12 (Bcrypt strength):** Verify passwords are hashed using bcrypt with a work factor of ≥ 10.
- [ ] **ASVS 2.1.20 (No credentials leak):** Verify authentication endpoints do not leak credentials in response bodies or log streams.

## 2.2 V3: Session Management Verification
- [ ] **ASVS 3.1.1 (Secure cookies):** Verify session cookies configure HTTP-only, Secure, and SameSite=Strict flags.
- [ ] **ASVS 3.2.1 (Short token lifecycle):** Verify JWT access tokens expire after 15 minutes.
- [ ] **ASVS 3.2.4 (Refresh token rotation):** Verify refresh tokens rotate on usage, invalidating old tokens immediately.

## 2.3 V5: Validation, Sanitization and Encoding
- [ ] **ASVS 5.1.1 (Schema validation):** Verify all input payloads validate against Zod schemas before database execution.
- [ ] **ASVS 5.1.5 (SQL injection prevention):** Verify all database operations use parameterized Prisma ORM queries.
- [ ] **ASVS 5.3.3 (XSS mitigation):** Verify client text inputs sanitize output HTML entities to prevent Cross-Site Scripting (XSS) attacks.

---

# 3. Verification Actions and Commands

To verify checklist status prior to release, execute:

- **Verify Password Hash Strength:** Inspect the auth service implementation file (`auth.service.ts`) to ensure the salt rounds parameter is configured correctly:
  ```typescript
  const passwordHash = await bcrypt.hash(password, 10);
  ```
- **Check Cookie Header Configurations:** Execute curl requests targeting login endpoints and verify response headers contain:
  `Set-Cookie: ...; HttpOnly; Secure; SameSite=Strict`

---

# 4. References

## Internal Documents

| Document | Path |
|----------|------|
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| Business Rules | `docs/01_Requirements/08_Business_Rules.md` |
| Security Requirements | `docs/01_Requirements/13_Security_Requirements.md` |
| System Architecture | `docs/02_Architecture/System_Architecture.md` |
| Nginx Configuration | `docs/10_Deployment/Nginx_Configuration.md` |

---

# Next Document

```
docs/11_Security/Token_Management.md
```

The Token Management document specifies JWT payload parameters, refresh token rotation logic, and session expiration configurations.
