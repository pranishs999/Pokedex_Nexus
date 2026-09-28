# Use Cases

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-UC-001 |
| Document Name | Use Cases |
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
2. Use Case Index
3. Detailed Use Cases
4. References

---

# 1. Purpose and Scope

This Use Cases document describes the interaction flows between users (actors) and the Pokémon Knowledge Management Platform (PKMP) v1.0.0. Each use case details preconditions, triggers, step-by-step main success paths, alternative paths, and postconditions, ensuring developers understand system behaviors during specific operations.

---

# 2. Use Case Index

| ID | Title | Actor(s) | Trigger |
|----|-------|----------|---------|
| **UC-100** | Register & Authenticate User | Guest | User clicks "Sign Up" |
| **UC-200** | Execute Multi-criteria Search | Guest, User | User enters search criteria |
| **UC-300** | Create & Analyze Team | User | User opens Team Builder workspace |
| **UC-400** | Run Dataset Import & Rollback | Editor, Admin | Editor runs import script command |
| **UC-500** | Moderate Community Submission | User, Moderator | User submits a Fakemon entry |

---

# 3. Detailed Use Cases

## 3.1 UC-100 — Register & Authenticate User

- **Primary Actor:** Guest
- **Preconditions:** The guest has access to a modern web browser and a working internet connection.
- **Trigger:** Guest clicks the "Sign Up" button on the navigation panel.

### Main Success Scenario (Flow)
1. System presents the Registration Form containing username, email, password, and password confirmation fields.
2. Guest inputs valid details and clicks "Submit".
3. System runs frontend validation checks (via Zod).
4. System posts payload to `/api/auth/register`.
5. Backend verifies email/username uniqueness, salts and hashes the password, and creates the user record in PostgreSQL with default role 'User'.
6. System responds with HTTP 201 Created and sets an access token (in memory) and a refresh token (in an HTTP-only secure cookie).
7. System redirects user to their profile dashboard page, displaying a "Registration Successful" notification.

### Alternative Scenarios
- **Flow 3a (Validation Failure):** If frontend validation fails (e.g., weak password, mismatched passwords), the system stops submission and highlights field-specific errors.
- **Flow 5a (Duplicate Identity):** If the email or username is already registered, the backend responds with HTTP 409 Conflict. The frontend catches this and displays a "Username/Email already exists" toast message.

- **Postconditions:** The user is logged in, their session state is stored in memory, and the refresh token is stored in their browser cookies.

---

## 3.2 UC-200 — Execute Multi-criteria Search

- **Primary Actor:** Guest, User
- **Preconditions:** The PostgreSQL database is seeded with official Pokémon data.
- **Trigger:** Actor types a query or toggles filter checkboxes.

### Main Success Scenario (Flow)
1. Actor enters a search string (e.g., "Fire-types with Intimidate from Gen III") in the search input field.
2. System parses the query string, identifying parameters (Type: Fire, Ability: Intimidate, Generation: III).
3. System sends parsed query payload to `/api/search`.
4. Backend executes a PostgreSQL full-text search combined with relational filters.
5. Database returns matching rows (e.g., Arcanine).
6. Backend formats and responds with HTTP 200 OK.
7. Frontend renders matching entries in a grid view, highlighting the search matches.

### Alternative Scenarios
- **Flow 4a (Fuzzy Match Fallback):** If no direct full-text match is found, the backend executes a trigram match on spelling variants.
- **Flow 5a (No Matches Found):** If no database records match the query, the system displays a "No results found" placeholder view.

- **Postconditions:** Matching results are displayed to the user within the response target budget (p95 ≤ 200 ms).

---

## 3.3 UC-300 — Create & Analyze Team

- **Primary Actor:** User
- **Preconditions:** User is authenticated and has opened the Team Builder workspace.
- **Trigger:** User clicks "New Team".

### Main Success Scenario (Flow)
1. System initializes an empty team workspace layout containing six open slots.
2. User selects an empty slot and searches for a Pokémon to add.
3. System adds the selected Pokémon, fetching its base stats and eligible moves.
4. User selects moves, ability, hold item, Nature, and allocates EVs/IVs using sliders.
5. System recalculates team stats and updates type matchup grids.
6. User names the team and clicks "Save Team".
7. System posts the serialized team payload to `/api/teams`.
8. Backend validates the payload shape and writes the team to the database.
9. System responds with HTTP 201 Created and updates the UI state.

### Alternative Scenarios
- **Flow 5a (Invalid Allocation):** If the user attempts to allocate more than 510 total EVs or more than 252 EVs in a single stat, the slider stops at the limit and shows a warning state.

- **Postconditions:** The team configuration is saved to the database associated with the user profile.

---

## 3.4 UC-400 — Run Dataset Import & Rollback

- **Primary Actor:** Editor, Admin
- **Preconditions:** Editor has prepared a structured JSON dataset and has CLI / CMS access.
- **Trigger:** Editor executes the import pipeline command.

### Main Success Scenario (Flow)
1. Editor runs the CLI import command: `npm run db:import --file=pokemon-gen10.json`.
2. System reads the file and initiates a PostgreSQL transaction block.
3. System runs Zod schema checks on each JSON entry.
4. System executes write queries via Prisma.
5. System commits the transaction block and records the event in the Audit Logs.
6. System outputs "Import Successful" and closes the session.

### Alternative Scenarios
- **Flow 3a (Validation Fail):** If a single object fails schema validation (e.g., missing base stat array), the system halts the import, aborts the transaction, outputs a parsing error report identifying the line, and rollbacks all database updates.

- **Postconditions:** The database is updated, or remains unchanged, maintaining referential integrity.

---

## 3.5 UC-500 — Moderate Community Submission

- **Primary Actor:** User, Moderator
- **Preconditions:** User is authenticated. Moderator has Moderator role.
- **Trigger:** User submits a Fakemon entry.

### Main Success Scenario (Flow)
1. User completes the Fakemon Submission Form (name, stats, artwork URL) and clicks "Submit".
2. System validates input, marks the entry status as `PENDING`, and saves it to the community submissions table.
3. Moderator logs into the Moderation Dashboard and views the pending submissions queue.
4. Moderator selects the user's submission, reviews its attributes, and clicks "Approve".
5. System updates the entry status to `APPROVED`, generating a duplicate read-optimized record in the public community table.
6. System sends a notification to the submitting user.

### Alternative Scenarios
- **Flow 4a (Rejection):** Moderator reviews the entry and clicks "Reject", inputting a rejection reason. The status is updated to `REJECTED`, and the record is hidden from the public database.

- **Postconditions:** The submission is processed and status updated.

---

# 4. References

## Internal Documents

| Document | Path |
|----------|------|
| Stakeholders | `docs/00_Project_Management/06_Stakeholders.md` |
| Functional Requirements | `docs/01_Requirements/02_Functional_Requirements.md` |
| User Personas | `docs/01_Requirements/04_User_Personas.md` |
| User Stories | `docs/01_Requirements/05_User_Stories.md` |

---

# Next Document

```
docs/01_Requirements/07_System_Features.md
```

The System Features document breaks down the high-level platform modules into concrete system components, operational logic, and functional boundaries.
