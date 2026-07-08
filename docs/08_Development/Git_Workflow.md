# Git Workflow

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-DEV-GW-001 |
| Document Name | Git Workflow |
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
2. Branching Model & Naming Conventions
3. Commit Message Standards (Conventional Commits)
4. Pull Request Review Gates
5. References

---

# 1. Purpose and Scope

This Git Workflow document defines the branch naming conventions, commit message standards, release tags, and pull request checklist gates for the code repositories of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. These rules prevent conflicts and ensure a clean project history.

---

# 2. Branching Model & Naming Conventions

The repository follows a Git Flow branching model.

```
[ main ] ────────( Release Tag: v1.0.0 )
   ▲
   │ (Merge release branch)
[ develop ] ─────( Merge feature branch )
   ▲
   ├── feature/auth-jwt
   └── bugfix/search-debounce-leak
```

- **Protected Branches:**
  - **`main`:** Stores production-ready code. Direct commits are blocked. Mutations must go through pull requests from release or hotfix branches.
  - **`develop`:** Active integration branch. Direct commits are blocked. Developers merge completed feature branches here.
- **Support Branches:**
  - **`feature/*`:** Used for new feature development (e.g., `feature/team-weakness-map`).
  - **`bugfix/*`:** Used for resolving bugs (e.g., `bugfix/empty-ability-lookup`).
  - **`release/*`:** Used to prepare release candidates (e.g., `release/v1.0.0-rc1`).

---

# 3. Commit Message Standards (Conventional Commits)

Commit messages must follow the Conventional Commits specification.

- **Structure:**
  `<type>(<scope>): <description>`
- **Commit Types:**
  - `feat`: A new user-facing feature.
  - `fix`: A bug fix.
  - `docs`: Documentation updates.
  - `style`: Code style changes (formatting, missing semicolons, no logic change).
  - `refactor`: Code restructuring without changing behavior.
  - `test`: Adding missing tests or correcting existing tests.
  - `chore`: Infrastructure updates, dependency versions, release tasks.
- **Breaking Changes:** Indicated by an exclamation mark after the type (e.g., `feat(auth)!: replace sessions with JWT`) and detailed in a `BREAKING CHANGE:` footer.

---

# 4. Pull Request Review Gates

Before merging a branch into `develop` or `main`, it must pass these automated verification checks:

1. **Automated Status Checks:** The CI build pipeline (linting, typescript checking, unit tests) must pass with green status.
2. **Review Clearance:** Require at least one peer approval (if team development) or pass a self-review checklist (if solo).
3. **No Direct Merges:** Merging is performed via Squash-and-Merge on Github to compress commit histories into a single commit on `develop`.

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Timeline | `docs/00_Project_Management/08_Project_Timeline.md` |
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| Acceptance Criteria | `docs/01_Requirements/23_Acceptance_Criteria.md` |
| Deployment Requirements | `docs/01_Requirements/21_Deployment_Requirements.md` |
| Coding Standards | `docs/08_Development/Coding_Standards.md` |

---

# Next Document

```
docs/08_Development/Local_Setup.md
```

The Local Setup document provides a step-by-step guide for developers to initialize the repository, configure environment variables, and start development environments.
