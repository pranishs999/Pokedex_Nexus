# Stakeholders

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-SH-001 |
| Document Name | Stakeholders |
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

1. Introduction
2. Stakeholder Identification
3. Stakeholder Profiles
4. Stakeholder Influence Matrix
5. RACI Matrix
6. Communication Plan
7. Stakeholder Concerns and Architectural Impact
8. Conflict Resolution
9. References

---

# 1. Introduction

This document identifies and analyzes all stakeholder groups for PKMP.

Understanding stakeholders ensures that architectural decisions, feature priorities, and quality requirements address the needs of everyone who interacts with or is affected by the platform.

PKMP is initially developed by a single developer, but the platform is designed to support multiple stakeholder groups from the beginning. Designing for a single-user scenario and retrofitting multi-stakeholder support later is a common source of architectural debt.

---

# 2. Stakeholder Identification

## 2.1 Stakeholder Categories

| Category | Stakeholders | Relationship to Platform |
|----------|-------------|--------------------------|
| Internal | Project Owner | Builds and maintains the platform |
| Internal | Future Contributors | Extend and improve the platform |
| External | End Users | Consume platform content |
| External | Community Contributors | Submit fan-made content |
| Operational | Moderators | Review and approve community content |
| Operational | Editors | Manage official content through CMS |
| Operational | Administrators | Manage platform operations and user accounts |
| Evaluative | Technical Reviewers | Evaluate architecture, code quality, and documentation |
| Legal | IP Holders | Own the Pokémon intellectual property |

---

# 3. Stakeholder Profiles

## 3.1 Project Owner

| Attribute | Description |
|-----------|-------------|
| Role | Sole developer, architect, product owner, and maintainer |
| Responsibilities | Vision, architecture, implementation, documentation, testing, deployment, maintenance |
| Decision Authority | Final authority on all technical and product decisions |
| Primary Concerns | Engineering quality, maintainability, portfolio value, documentation completeness |
| Success Criteria | A professionally engineered platform with comprehensive documentation that demonstrates enterprise-level practices |

### Architectural Impact

The Project Owner's dual role as architect and implementer means architectural decisions must be self-documenting. Without a separate architecture review team, ADRs and documentation serve as the primary mechanism for maintaining architectural integrity over time.

---

## 3.2 End Users

End users are the primary consumers of the platform. They interact with the public-facing application but do not access administrative features.

### 3.2.1 Casual Fans

| Attribute | Description |
|-----------|-------------|
| Technical Skill | Low to moderate |
| Primary Devices | Mobile phones, tablets, laptops |
| Goals | Browse Pokémon, explore artwork, read lore, discover franchise information |
| Expectations | Simple navigation, attractive interface, fast loading, easy search |
| Frustrations | Complex interfaces, slow performance, overwhelming information density |

**Architectural Impact:** The UI must support progressive disclosure — showing summary information by default with detailed information available on demand. Responsive design is mandatory.

---

### 3.2.2 Competitive Players

| Attribute | Description |
|-----------|-------------|
| Technical Skill | High |
| Primary Devices | Desktop, laptop |
| Goals | Compare stats, study move pools, analyze type matchups, build competitive teams |
| Expectations | Accurate data, powerful filters, fast performance, detailed statistics, data-dense views |
| Frustrations | Inaccurate data, missing move/ability interactions, slow search |

**Architectural Impact:** The Team Builder and Comparison modules must support complex calculations (type coverage, STAB, effectiveness). Data density options should be configurable.

---

### 3.2.3 Collectors

| Attribute | Description |
|-----------|-------------|
| Technical Skill | Moderate |
| Primary Devices | Mobile, desktop |
| Goals | Track owned Pokémon, build Living Dex, record shiny collections, monitor completion progress |
| Expectations | Persistent collections, progress visualization, cloud sync, export capabilities |
| Frustrations | Data loss, lack of sync, inability to track across games |

**Architectural Impact:** Collections require server-side persistence for authenticated users and local storage fallback for guests. Cloud sync must handle conflict resolution.

---

### 3.2.4 Researchers

| Attribute | Description |
|-----------|-------------|
| Technical Skill | High |
| Primary Devices | Desktop |
| Goals | Cross-reference franchise data, find specific historical information, export structured data |
| Expectations | Advanced search, accurate cross-references, structured data access |
| Frustrations | Scattered information, inconsistent data, no export options |

**Architectural Impact:** The Search module must support complex multi-criteria queries. The API should support structured data responses suitable for programmatic consumption.

---

## 3.3 Community Contributors

| Attribute | Description |
|-----------|-------------|
| Role | Users who submit fan-made content (Fakemon, custom regions, fan art, guides) |
| Technical Skill | Variable |
| Goals | Share creative work with the community |
| Expectations | Clear submission process, fair moderation, proper attribution, visibility |
| Frustrations | Opaque moderation, content rejection without explanation, content mixed with official data |

### Architectural Impact

The CMS must provide a structured submission workflow with clear status tracking. The moderation queue must support approval, rejection with comments, and revision requests. The `source_type` column enforces separation at the database level.

---

## 3.4 Moderators

| Attribute | Description |
|-----------|-------------|
| Role | Review and approve/reject community-submitted content |
| Decision Authority | Content approval within defined guidelines. Cannot modify official content. |
| Primary Concerns | Content quality, guideline compliance, workload management |
| Tools Required | Moderation queue, review interface, communication tools, content guidelines |

### Architectural Impact

The moderation workflow requires:

- Queue-based content review.
- Status transitions (submitted → under review → approved/rejected/revision requested).
- Moderator assignment.
- Review history and audit trail.
- Bulk actions for efficiency.

---

## 3.5 Editors

| Attribute | Description |
|-----------|-------------|
| Role | Manage official content through the CMS |
| Decision Authority | Import, update, and publish official datasets. Cannot modify user accounts or system settings. |
| Primary Concerns | Data accuracy, import reliability, version control, rollback capability |
| Tools Required | Import pipeline interface, content editor, validation reports, version history |

### Architectural Impact

Editors interact with the import pipeline and CMS publishing workflow. The system must provide:

- Validation feedback before commit.
- Dry-run import capability.
- Version comparison (diff) for content updates.
- Rollback to previous versions.

---

## 3.6 Administrators

| Attribute | Description |
|-----------|-------------|
| Role | Manage platform operations, user accounts, and system configuration |
| Decision Authority | Full system access. User management, role assignment, system configuration. |
| Primary Concerns | System health, security, user management, audit compliance |
| Tools Required | Admin dashboard, user management interface, audit log viewer, system health indicators |

### Architectural Impact

The Administration module requires:

- Comprehensive dashboard with system metrics.
- User CRUD with role assignment.
- Audit log search and export.
- Database health monitoring.
- Import job status tracking.

---

## 3.7 Super Admin

| Attribute | Description |
|-----------|-------------|
| Role | Highest privilege level. Manages roles, permissions, and system-level configuration. |
| Decision Authority | Can assign Admin role. Can modify permission sets. Can export database. Can access all audit logs. |
| Distinction from Admin | Admin manages users and content. Super Admin manages the permission system itself. |

### Architectural Impact

RBAC must support a permission hierarchy where Super Admin permissions are a strict superset of Admin permissions. Role modification requires Super Admin authority to prevent privilege escalation.

---

## 3.8 Future Contributors

| Attribute | Description |
|-----------|-------------|
| Role | Developers who may contribute to the codebase in the future |
| Primary Concerns | Onboarding efficiency, code readability, documentation quality, consistent patterns |
| Success Criteria | Productive within one week using documentation alone |

### Architectural Impact

The codebase must follow consistent patterns documented in the Development Standards. Architecture documentation must be current. ADRs must explain the reasoning behind non-obvious decisions.

---

## 3.9 Technical Reviewers

| Attribute | Description |
|-----------|-------------|
| Role | Recruiters, interviewers, instructors, or peers evaluating the project |
| Primary Concerns | Architecture quality, documentation professionalism, code organization, engineering maturity |
| Interaction | Read-only. Examine documentation, architecture, and code without contributing. |

### Architectural Impact

Documentation quality directly affects the project's portfolio value. Architecture diagrams, ADRs, and clear module boundaries demonstrate engineering competence more effectively than code volume.

---

## 3.10 IP Holders

| Attribute | Description |
|-----------|-------------|
| Entities | The Pokémon Company, Game Freak, Nintendo |
| Relationship | Own all Pokémon intellectual property |
| Concern | Non-commercial use, proper attribution, no distribution of copyrighted game assets |
| Risk | Takedown request |

### Architectural Impact

The platform architecture must be separable from the Pokémon dataset. If a takedown occurs, the architecture, source code, and documentation should remain usable independently by replacing the dataset with alternative content.

This is enforced by the modular architecture — the domain layer does not hard-code Pokémon-specific logic that cannot be abstracted.

---

# 4. Stakeholder Influence Matrix

| Stakeholder | Interest Level | Influence Level | Engagement Strategy |
|-------------|---------------|-----------------|---------------------|
| Project Owner | High | High | Self-directed. ADRs and documentation maintain decision consistency. |
| End Users (Casual) | High | Medium | Design for simplicity. Progressive disclosure. Responsive design. |
| End Users (Competitive) | High | Medium | Prioritize data accuracy and search power. |
| End Users (Collectors) | Medium | Low | Reliable persistence and sync. |
| End Users (Researchers) | Medium | Low | Advanced search and data export. |
| Community Contributors | Medium | Low | Clear submission process. Fair moderation. |
| Moderators | Medium | Medium | Efficient tools. Clear guidelines. |
| Editors | Medium | Medium | Reliable import pipeline. Validation feedback. |
| Administrators | Medium | High | Comprehensive management tools. Audit trail. |
| Future Contributors | Low (currently) | Low | Documentation quality. Consistent patterns. |
| Technical Reviewers | Medium | Low | Professional documentation. Clean architecture. |
| IP Holders | Low | High | Non-commercial operation. Legal compliance. |

---

# 5. RACI Matrix

Defines responsibility assignments for key project activities.

| Activity | Project Owner | Admin | Editor | Moderator | User |
|----------|:------------:|:-----:|:------:|:---------:|:----:|
| Architecture decisions | R/A | — | — | — | — |
| Feature implementation | R/A | — | — | — | — |
| Documentation | R/A | — | — | — | — |
| Official data import | R/A | A | R | — | — |
| Data validation | R/A | — | R | — | — |
| Content publishing | A | A | R | — | — |
| Community content review | A | — | — | R | — |
| User management | A | R | — | — | — |
| Role management | R/A | — | — | — | — |
| Security monitoring | R/A | R | — | — | — |
| Bug reporting | A | I | I | I | R |
| Feature requests | A | I | I | I | R |

**Legend:** R = Responsible, A = Accountable, C = Consulted, I = Informed

---

# 6. Communication Plan

## 6.1 Internal Communication

| Channel | Purpose | Frequency |
|---------|---------|-----------|
| Git commits (Conventional Commits) | Track individual changes | Every commit |
| ADRs | Record architectural decisions | As needed |
| Documentation updates | Maintain project knowledge | With each feature |
| GitHub Issues | Track bugs and feature requests | As needed |
| GitHub Projects | Track development progress | Updated per sprint |
| Changelog | Summarize changes per release | Each release |

---

## 6.2 Stakeholder Communication

| Stakeholder | Channel | Content | Frequency |
|-------------|---------|---------|-----------|
| End Users | Release notes, changelog | New features, bug fixes, improvements | Each release |
| Contributors | CONTRIBUTING.md, documentation | Contribution guidelines, architecture overview | Maintained continuously |
| Moderators | Moderation guidelines, admin interface | Review queue status, guideline updates | As needed |
| Technical Reviewers | README, documentation repository | Project overview, architecture documentation | Available on demand |

---

# 7. Stakeholder Concerns and Architectural Impact

This section maps stakeholder concerns directly to architectural decisions.

| Concern | Stakeholders | Architectural Response |
|---------|-------------|----------------------|
| Fast search | All users | PostgreSQL FTS + `pg_trgm`, indexed queries, result caching |
| Data accuracy | Competitive players, researchers | Validated import pipeline, version-controlled datasets, audit logs |
| Mobile experience | Casual fans, collectors | Responsive design, PWA, touch-optimized interactions |
| Content separation | IP holders, all users | `source_type` column, default query filters, UI badges |
| Account security | All authenticated users | JWT rotation, bcrypt hashing, RBAC, rate limiting |
| Data persistence | Collectors | Server-side storage, local storage fallback, cloud sync |
| Onboarding efficiency | Future contributors | Comprehensive documentation, consistent patterns, ADRs |
| Moderation efficiency | Moderators | Queue-based workflow, bulk actions, status tracking |
| Import reliability | Editors | Validation reports, dry-run mode, rollback support |
| System visibility | Administrators | Dashboard, health checks, structured logging, audit logs |
| Legal compliance | IP holders | Non-commercial, separable architecture, attribution |
| Portfolio presentation | Technical reviewers | Professional documentation, clean architecture, C4 diagrams |

---

# 8. Conflict Resolution

When stakeholder concerns conflict, resolution follows this priority order.

1. **Legal compliance** — IP holder requirements take absolute precedence.
2. **Security** — User safety and data protection override convenience.
3. **Data accuracy** — Incorrect information damages trust across all stakeholder groups.
4. **Maintainability** — Long-term sustainability overrides short-term feature requests.
5. **User experience** — Core user needs take priority over edge cases.
6. **Performance** — Responsiveness requirements override feature complexity.
7. **Feature completeness** — Additional content is lowest priority when it conflicts with the above.

---

# 9. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Charter | `docs/00_Project_Management/00_Project_Charter.md` |
| Project Context | `docs/00_Project_Management/01_Project_Context.md` |
| Vision and Goals | `docs/00_Project_Management/02_Vision_and_Goals.md` |
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Glossary | `docs/00_Project_Management/04_Glossary.md` |
| Assumptions and Constraints | `docs/00_Project_Management/05_Assumptions_and_Constraints.md` |

---

# Next Document

```
docs/00_Project_Management/07_Roadmap.md
```

The Roadmap document defines the phased delivery plan for PKMP, mapping development milestones to strategic goals with estimated effort and dependencies.
