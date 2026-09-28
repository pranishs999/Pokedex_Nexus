# Legal Requirements

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-LE-002 |
| Document Name | Legal Requirements |
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
2. Intellectual Property & Fair Use Compliance
3. Non-Commercial Status Enforcement
4. Privacy & User Data Protection
5. Code Licensing & Distribution
6. References

---

# 1. Purpose and Scope

This Legal Requirements document defines the guidelines for copyright compliance, fair use disclosures, user data handling, and licensing constraints for the Pokémon Knowledge Management Platform (PKMP) v1.0.0. The platform operates as a non-commercial, educational fan project.

---

# 2. Intellectual Property & Fair Use Compliance

- **IP Ownership:** Pokémon and all associated assets (names, stats, type symbols, sprite assets, and descriptions) are trademarks and copyrights of The Pokémon Company, Game Freak, Nintendo, or affiliated entities.
- **Fair Use Disclaimer:** The application must display a prominent legal disclaimer in the footer of all routes:

> *This platform is a non-commercial, educational fan project. All Pokémon intellectual property belongs to Nintendo, Game Freak, and The Pokémon Company. No copyright infringement is intended.*

- **Asset Distribution Limits:** Do not distribute copyrighted game binaries (ROMs), music tracks, or raw video assets in the repository.

---

# 3. Non-Commercial Status Enforcement

- **Monetization Ban:** The application must not include any paid tiers, donation links (Patreon, Ko-fi), advertisements, or commercial sponsorships.
- **Independent Infrastructure:** Hosting costs must be paid directly by the Project Owner. Crowdfunding or community contributions for hosting costs are prohibited.

---

# 4. Privacy & User Data Protection

Even as a fan project, the system must handle user data responsibly.

- **Data Minimization:** Only collect the minimum data required for account registration (username, email, password). Do not ask for real names, locations, or payment details.
- **Right to Deletion:** Provide an automated mechanism for users to delete their accounts. Deleting an account must immediately hard-delete their personal collection checklist, Saved Teams, and user profile data from the PostgreSQL database (BR-202).
- **No Third-Party Sharing:** The system must not share user data or incorporate third-party tracking scripts (e.g., Google Analytics).

---

# 5. Code Licensing & Distribution

- **Code License:** The application's custom source code, build scripts, configurations, and documentation are licensed under the MIT License, enabling sharing and reuse.
- **Data License:** Datasets and custom community contributions are licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0).

---

# 6. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Context | `docs/00_Project_Management/01_Project_Context.md` |
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Assumptions & Constraints | `docs/00_Project_Management/05_Assumptions_and_Constraints.md` |
| Stakeholders | `docs/00_Project_Management/06_Stakeholders.md` |

---

# Next Document

```
docs/01_Requirements/23_Acceptance_Criteria.md
```

The Acceptance Criteria document defines the specific release verification requirements, test coverage thresholds, and module checklists.
