# Privacy Policy

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-LEG-PP-001 |
| Document Name | Privacy Policy |
| Version | 1.0.0 |
| Status | Draft |
| Documentation Standard | GDPR + CCPA |
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
2. Data Collection Limits
3. Cookies & Browser Storage Mappings
4. GDPR/CCPA User Rights
5. References

---

# 1. Purpose and Scope

This Privacy Policy document defines the data collection limits, browser storage mappings, GDPR/CCPA compliance procedures, and retention policies for user data on the Pokémon Knowledge Management Platform (PKMP) v1.0.0.

---

# 2. Data Collection Limits

The platform collects the minimum data required to support accounts:

- **Account Information:** Username, email address, and Bcrypt-encrypted password hash.
- **User Content:** Custom team configurations (moves, items, stats) and Living Dex checkbox states.
- **Log Files:** IP addresses are logged in Nginx traffic streams for rate limiting and security auditing. Logs are purged after 14 days.

---

# 3. Cookies & Browser Storage Mappings

To manage application state securely, the client uses these storage items:

| Storage Type | Key / Name | Purpose | Lifecycle |
|--------------|------------|---------|-----------|
| **Secure Cookie** | `jid` | Stores HTTP-only JWT refresh token. | 7 days |
| **In-Memory** | `accessToken` | Temporarily stores the active API token. | Deleted on tab close |
| **localStorage** | `theme` | Saves dark/light mode preference. | Indefinite |
| **IndexedDB** | `cms_autosave` | Caches pending edits for offline CMS recovery. | Cleared on publish |

---

# 4. GDPR/CCPA User Rights

In compliance with global data privacy regulations (GDPR and CCPA), users can request the following:

- **Right to Access:** Users can request an export of all their data (profile details, teams, collections) in JSON format via the account dashboard.
- **Right to Deletion (Right to be Forgotten):** Users can delete their accounts. This triggers a cascade delete, removing all associated records from the database.
- **Opt-Out:** The platform does not track users or sell data to third parties, making opt-out menus unnecessary.

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Stakeholders | `docs/00_Project_Management/06_Stakeholders.md` |
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| Business Rules | `docs/01_Requirements/08_Business_Rules.md` |
| Security Requirements | `docs/01_Requirements/13_Security_Requirements.md` |
| Legal Requirements | `docs/01_Requirements/22_Legal_Requirements.md` |
| Relational Mappings | `docs/03_Database/Relational_Mappings.md` |
| Token Management | `docs/11_Security/Token_Management.md` |
| Copyright Compliance | `docs/12_Legal/Copyright_Compliance.md` |

---

# Next Document

```
docs/13_API/README.md
```

This completes the `12_Legal` documentation phase. The next document is `docs/13_API/README.md`, which kicks off the API phase by detailing REST endpoints, JSON responses, error formats, and Swagger configurations.
