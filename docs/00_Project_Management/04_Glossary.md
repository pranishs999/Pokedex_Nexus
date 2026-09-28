# Glossary

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-GL-001 |
| Document Name | Glossary |
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
2. Project Terminology
3. Pokémon Domain Terminology
4. Technical Terminology
5. Architecture Terminology
6. Database Terminology
7. Frontend Terminology
8. Backend Terminology
9. Security Terminology
10. Documentation Terminology
11. Abbreviations and Acronyms
12. References

---

# 1. Introduction

This glossary defines all terms, abbreviations, and domain-specific language used across PKMP documentation.

Consistent terminology prevents ambiguity. Every document in this repository uses the definitions established here. If a term has a different meaning in another context, the PKMP-specific definition takes precedence within project documentation.

When a new term is introduced in any document, it should be added to this glossary. If a term is used inconsistently across documents, this glossary serves as the authoritative reference.

---

# 2. Project Terminology

| Term | Definition |
|------|------------|
| PKMP | Pokémon Knowledge Management Platform. The name of this project. |
| Platform | The complete PKMP application including frontend, backend, database, CMS, and all supporting infrastructure. |
| Module | A self-contained functional area of the platform with defined responsibilities, interfaces, and boundaries. Examples: Pokémon Module, Moves Module, Search Module. |
| Core Module | A module classified as essential for the v1.0.0 release. The platform is considered incomplete without it. |
| Enhanced Module | A module that improves the platform but may ship with partial content coverage in v1.0.0. |
| Content Category | A classification of franchise data. Examples: Pokémon, Moves, Abilities, Items, Anime, TCG. |
| Official Content | Data originating from The Pokémon Company, Game Freak, Nintendo, or affiliated entities. Stored with `source_type = 'official'`. |
| Fan-Made Content | Community-submitted material stored with `source_type = 'community'` and subject to moderation before publication. |
| Community Content | Synonym for Fan-Made Content. |
| Import Pipeline | The automated system that validates, transforms, and inserts structured JSON datasets into the PostgreSQL database. |
| Dataset | A collection of structured JSON files representing a specific content category (e.g., all Pokémon, all moves). |
| Knowledge Platform | A system designed to organize, store, search, and present structured knowledge across multiple categories. Distinct from a simple encyclopedia or wiki. |
| Modular Monolith | An architectural style where the application runs as a single deployable unit but is internally organized into independent modules with clear boundaries. |
| v1.0.0 | The first major public release of PKMP. |
| Scope Freeze | A period before release during which no new features are added. Only bug fixes, documentation, and security patches are permitted. |

---

# 3. Pokémon Domain Terminology

## 3.1 Pokémon Classification

| Term | Definition |
|------|------------|
| Pokémon | A creature within the Pokémon franchise. Each Pokémon has a National Pokédex number, base stats, types, abilities, and other attributes. |
| Species | The base form of a Pokémon, identified by its National Pokédex number. A species may have multiple forms. |
| Form | A variant of a Pokémon species with distinct visual appearance, stats, types, or abilities. Examples: Alolan Vulpix, Mega Charizard X, Gigantamax Pikachu. |
| Regional Form | A Pokémon variant specific to a particular region with different types, abilities, or stats. Examples: Alolan, Galarian, Hisuian, Paldean. |
| Mega Evolution | A temporary in-battle transformation requiring a Mega Stone. Introduced in Generation VI. |
| Gigantamax | A temporary in-battle transformation with a unique appearance and G-Max Move. Introduced in Generation VIII. |
| Dynamax | A temporary in-battle transformation that increases size and HP. Distinct from Gigantamax. Introduced in Generation VIII. |
| Primal Reversion | A transformation for Groudon and Kyogre using specific orbs. Introduced in Generation VI. |
| Paradox Pokémon | Pokémon from the distant past or future with connections to existing species. Introduced in Generation IX. |
| Ultra Beast | Pokémon from Ultra Space with unusual characteristics. Introduced in Generation VII. |
| Legendary Pokémon | Rare, powerful Pokémon typically central to game storylines. Generally one per save file. |
| Mythical Pokémon | Pokémon obtainable primarily through special events or distributions. Subset of Legendary in some classifications. |
| Starter Pokémon | The initial Pokémon offered to the player at the beginning of a main series game. Typically Grass, Fire, and Water types. |
| Fossil Pokémon | Pokémon revived from fossils found during gameplay. |
| Pseudo-Legendary | An unofficial fan term for non-Legendary Pokémon with a base stat total of 600 and a three-stage evolution line. |
| Shiny Pokémon | A Pokémon with an alternate color palette. Extremely rare in normal gameplay. |
| Fakemon | A fan-created Pokémon. Not official. Stored exclusively as community content. |

---

## 3.2 Pokémon Attributes

| Term | Definition |
|------|------------|
| National Pokédex Number | The unique sequential identifier assigned to each Pokémon species across all games. |
| Regional Pokédex Number | A region-specific sequential identifier. A single Pokémon may have different regional numbers across games. |
| Base Stats | Six numerical values (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed) defining a Pokémon's innate strengths. |
| HP | Hit Points. Determines how much damage a Pokémon can take before fainting. |
| Attack | Determines the power of physical moves. |
| Defense | Determines resistance to physical moves. |
| Special Attack (Sp. Atk) | Determines the power of special moves. |
| Special Defense (Sp. Def) | Determines resistance to special moves. |
| Speed | Determines turn order in battle. |
| Base Stat Total (BST) | The sum of all six base stats. Used for general power comparison. |
| IV (Individual Value) | A hidden value (0–31) for each stat that varies per individual Pokémon. Determines stat variation within a species. |
| EV (Effort Value) | Values gained through battling or training (0–252 per stat, 510 total) that increase stats. |
| Nature | One of 25 personality attributes that increases one stat by 10% and decreases another by 10%. Five natures are neutral. |
| Ability | A passive effect active during battle or in the overworld. Each Pokémon has 1–3 possible abilities (1–2 normal, 0–1 hidden). |
| Hidden Ability | An ability slot that is typically harder to obtain than normal abilities. |
| Type | An elemental classification (e.g., Fire, Water, Grass). Pokémon have 1–2 types. Determines damage relationships. |
| Egg Group | A breeding compatibility classification. Pokémon in the same egg group can breed. |
| Growth Rate | Determines the experience points required to reach each level. |
| Catch Rate | A value (0–255) affecting the probability of capturing a Pokémon. |
| Gender Ratio | The probability distribution of male and female individuals within a species. Some Pokémon are genderless. |
| Evolution | The transformation of a Pokémon into a different species or form, typically triggered by level, item, trade, or special condition. |
| Evolution Chain | The complete sequence of evolutions for a Pokémon family. May be linear or branching. |

---

## 3.3 Battle Mechanics

| Term | Definition |
|------|------------|
| Move | An attack or technique a Pokémon can use in battle. Each move has a type, category, power, accuracy, and PP. |
| Physical Move | A move whose damage is calculated using the user's Attack and the target's Defense. |
| Special Move | A move whose damage is calculated using the user's Sp. Atk and the target's Sp. Def. |
| Status Move | A move that does not deal direct damage. Typically inflicts status conditions, raises/lowers stats, or alters field conditions. |
| PP (Power Points) | The number of times a move can be used before requiring restoration. |
| STAB (Same-Type Attack Bonus) | A 50% damage bonus applied when a Pokémon uses a move matching its own type. |
| Type Effectiveness | The damage multiplier applied based on the attacking move's type and the defending Pokémon's type(s). Values: 0x, 0.25x, 0.5x, 1x, 2x, 4x. |
| Status Condition | A persistent effect applied to a Pokémon during battle. Examples: Burn, Paralysis, Poison, Sleep, Freeze, Confusion. |
| Weather | A battlefield condition affecting move effectiveness, abilities, and other mechanics. Examples: Rain, Sun, Sandstorm, Hail, Snow. |
| Terrain | A battlefield condition introduced in Generation VI affecting grounded Pokémon. Examples: Electric, Grassy, Misty, Psychic. |
| Held Item | An item attached to a Pokémon that provides passive effects during battle. |
| Priority | A value determining move order independent of Speed. Higher priority moves execute first. |

---

## 3.4 Franchise Terminology

| Term | Definition |
|------|------------|
| Generation | A grouping of Pokémon games that introduce new Pokémon, regions, and mechanics. Generation I (Kanto) through Generation X (current). |
| Region | A geographic area within the Pokémon world where games take place. Examples: Kanto, Johto, Hoenn, Sinnoh, Unova, Kalos, Alola, Galar, Hisui, Paldea. |
| Pokédex | An in-game encyclopedia that records information about encountered and captured Pokémon. |
| Living Dex | A fan objective to own one of every Pokémon species simultaneously in storage. |
| TCG | Trading Card Game. The Pokémon card game with collectible sets and competitive play. |
| Event Distribution | A limited-time distribution of a specific Pokémon, item, or other content, typically through online services or physical events. |
| Version Exclusive | A Pokémon or feature available only in one version of a paired game release (e.g., Sword vs. Shield). |

---

# 4. Technical Terminology

| Term | Definition |
|------|------------|
| API | Application Programming Interface. The contract between frontend and backend defining available endpoints, request/response formats, and error handling. |
| REST | Representational State Transfer. The API architectural style used by PKMP. |
| Endpoint | A specific URL path in the REST API that accepts requests and returns responses. |
| DTO | Data Transfer Object. A typed object defining the shape of data exchanged between layers or services. |
| Middleware | Software that processes requests between the client and the route handler. Used for authentication, logging, validation, etc. |
| Guard | A NestJS construct that determines whether a request should be processed based on conditions such as authentication or role. |
| Interceptor | A NestJS construct that transforms the response or adds cross-cutting behavior (logging, caching, serialization). |
| Pipe | A NestJS construct that transforms or validates input data before it reaches the route handler. |
| Decorator | A TypeScript/NestJS construct that attaches metadata to classes, methods, or parameters. |
| Service | A class responsible for business logic within a module. Injected via dependency injection. |
| Repository | A data access abstraction layer. In PKMP, Prisma Client serves as the repository layer. |
| Migration | A version-controlled database schema change managed by Prisma Migrate. |
| Seed | A script that populates the database with initial or test data. |
| Environment Variable | A runtime configuration value stored outside the source code (`.env` files). |
| PWA | Progressive Web App. A web application that provides native-like capabilities including offline support and installability. |
| SSR | Server-Side Rendering. Not used in PKMP v1.0.0. The application uses client-side rendering with Vite. |
| CSR | Client-Side Rendering. The rendering strategy used by PKMP, where React renders in the browser. |
| HMR | Hot Module Replacement. A Vite feature that updates modules in the browser without full page reload during development. |
| Code Splitting | The practice of dividing the JavaScript bundle into smaller chunks loaded on demand. Managed by TanStack Router's lazy routes. |
| Tree Shaking | A build optimization that removes unused code from the production bundle. |

---

# 5. Architecture Terminology

| Term | Definition |
|------|------------|
| Clean Architecture | An architectural pattern organizing code into concentric layers with dependency rules pointing inward. Domain logic has no external dependencies. |
| Modular Monolith | A deployment architecture where the application is a single unit but internally organized into independent modules with defined interfaces. |
| Domain | The subject area the software addresses. In PKMP, the domain is Pokémon knowledge management. |
| Bounded Context | A DDD concept defining the boundary within which a particular domain model applies. |
| Layer | A horizontal separation of concerns (presentation, application, domain, infrastructure). |
| Module Boundary | The interface through which one module communicates with another. Modules should not access each other's internal implementation. |
| Dependency Injection (DI) | A design pattern where dependencies are provided to a class rather than instantiated internally. NestJS uses constructor-based DI. |
| Separation of Concerns (SoC) | The principle that each module, class, or function should address a single concern. |
| SOLID | Five object-oriented design principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. |
| DRY | Don't Repeat Yourself. The principle of reducing code duplication. |
| KISS | Keep It Simple. The principle of preferring simpler solutions. |
| ADR | Architecture Decision Record. A document recording a significant architectural decision, its context, alternatives considered, and consequences. |
| C4 Model | A hierarchical approach to software architecture visualization using Context, Container, Component, and Code diagrams. |
| Arc42 | A template for architecture documentation organized into standardized sections. |

---

# 6. Database Terminology

| Term | Definition |
|------|------------|
| PostgreSQL | The relational database management system used by PKMP. |
| Schema | The structure definition of the database including tables, columns, relationships, indexes, and constraints. |
| Table | A structured collection of rows representing a single entity type. |
| Column | A named attribute within a table with a defined data type and constraints. |
| Primary Key (PK) | A column or combination of columns that uniquely identifies each row in a table. |
| Foreign Key (FK) | A column that references the primary key of another table, establishing a relationship. |
| Index | A database structure that improves query performance on specific columns. |
| Normalization | The process of organizing database tables to reduce redundancy and improve data integrity. PKMP targets Third Normal Form (3NF). |
| 3NF (Third Normal Form) | A normalization level where every non-key column depends only on the primary key, not on other non-key columns. |
| ACID | Atomicity, Consistency, Isolation, Durability. Properties guaranteeing reliable database transactions. |
| Transaction | A sequence of database operations executed as a single atomic unit. Either all operations succeed or none are applied. |
| Full-Text Search (FTS) | PostgreSQL's built-in capability to search natural language text using `tsvector` and `tsquery`. |
| `tsvector` | A PostgreSQL data type representing a document as a sorted list of lexemes for full-text search. |
| `tsquery` | A PostgreSQL data type representing a search query with boolean operators for full-text search. |
| `pg_trgm` | A PostgreSQL extension enabling trigram-based fuzzy matching and similarity searches. |
| GIN Index | Generalized Inverted Index. Used by PostgreSQL for efficient full-text search and array queries. |
| GiST Index | Generalized Search Tree. An alternative index type supporting range queries and nearest-neighbor searches. |
| Prisma | The TypeScript ORM used by PKMP for type-safe database access, schema definition, and migrations. |
| Prisma Schema | The `schema.prisma` file defining the database structure, relationships, and client generation settings. |
| Prisma Migrate | Prisma's migration system that generates and applies SQL migration files from schema changes. |
| Prisma Client | The auto-generated, type-safe database client used in NestJS services. |
| Soft Delete | A deletion strategy that marks records as deleted (e.g., `deleted_at` timestamp) without removing them from the database. |
| Audit Log | A record of data modifications including the user, timestamp, operation type, and before/after values. |

---

# 7. Frontend Terminology

| Term | Definition |
|------|------------|
| React 19 | The frontend UI library used by PKMP. Version 19 provides concurrent features and improved rendering. |
| Component | A reusable UI building block in React. Can be a function that returns JSX. |
| Hook | A React function that allows components to use state, effects, and other React features. |
| JSX | JavaScript XML. A syntax extension that allows writing HTML-like markup within JavaScript/TypeScript. |
| Vite | The frontend build tool providing fast development server (HMR) and optimized production bundling. |
| TanStack Router | A type-safe routing library for React. Manages client-side navigation and code splitting. |
| TanStack Query | A server state management library that handles data fetching, caching, synchronization, and background updates. |
| React Hook Form | A performant form library that minimizes re-renders during form interactions. |
| Zod | A TypeScript-first schema validation library used for both form validation and API request/response validation. |
| React Three Fiber | A React renderer for Three.js enabling declarative 3D rendering of Pokémon models. |
| Three.js | A JavaScript 3D graphics library. Used indirectly through React Three Fiber. |
| Framer Motion | An animation library for React providing layout animations, gestures, and page transitions. |
| Tailwind CSS v4 | A utility-first CSS framework using design tokens for consistent styling. Version 4 uses CSS-native configuration. |
| Design Token | A named value (color, spacing, font size, etc.) used consistently across the design system. Managed through Tailwind CSS v4. |
| Skeleton Screen | A loading placeholder that mimics the layout of content before data arrives. Improves perceived performance. |
| Error Boundary | A React component that catches JavaScript errors in its child component tree and displays a fallback UI. |
| Lazy Loading | A technique that defers loading of resources (images, components, routes) until they are needed. |
| Optimistic Update | A UI pattern that immediately reflects a user action before server confirmation, rolling back if the server rejects it. |

---

# 8. Backend Terminology

| Term | Definition |
|------|------------|
| NestJS | The backend framework used by PKMP. Provides modular architecture, dependency injection, and TypeScript-first development. |
| Controller | A NestJS class that handles incoming HTTP requests and delegates to services. |
| Module (NestJS) | A NestJS organizational unit that groups related controllers, services, and providers. Distinct from PKMP platform modules, though they often align. |
| Provider | Any class injectable via NestJS dependency injection. Services, repositories, and utilities are providers. |
| Exception Filter | A NestJS construct that handles exceptions thrown during request processing and formats error responses. |
| Validation Pipe | A NestJS pipe that validates incoming request data against DTOs using class-validator or Zod. |
| JWT (JSON Web Token) | A compact, URL-safe token format used for stateless authentication. Contains encoded claims about the user. |
| Access Token | A short-lived JWT used to authenticate API requests. Typical lifetime: 15 minutes. |
| Refresh Token | A longer-lived token used to obtain new access tokens without re-authentication. Stored securely and rotated on use. |
| Token Rotation | The practice of issuing a new refresh token each time one is used, invalidating the previous token. Limits the damage of token theft. |
| RBAC (Role-Based Access Control) | An authorization model where permissions are assigned to roles, and users are assigned roles. |
| Role | A named set of permissions. PKMP roles: Guest, User, Moderator, Editor, Admin, Super Admin. |
| Permission | A specific action a role is authorized to perform. Examples: `pokemon:read`, `pokemon:write`, `import:execute`. |
| Rate Limiting | Restricting the number of requests a client can make within a time window. Prevents abuse. |
| CORS (Cross-Origin Resource Sharing) | A security mechanism controlling which origins can access the API. |
| Helmet | A middleware that sets HTTP security headers (Content-Security-Policy, X-Frame-Options, etc.). |

---

# 9. Security Terminology

| Term | Definition |
|------|------------|
| Authentication (AuthN) | Verifying the identity of a user. In PKMP, handled through JWT. |
| Authorization (AuthZ) | Determining whether an authenticated user has permission to perform a specific action. In PKMP, handled through RBAC. |
| OWASP | Open Worldwide Application Security Project. Provides security guidelines and best practices. |
| ASVS | Application Security Verification Standard. An OWASP framework defining security requirements at multiple levels. |
| SQL Injection | An attack where malicious SQL is injected through user input. Prevented by Prisma's parameterized queries. |
| XSS (Cross-Site Scripting) | An attack where malicious scripts are injected into web pages. Prevented by React's JSX escaping and Content-Security-Policy headers. |
| CSRF (Cross-Site Request Forgery) | An attack where a malicious site triggers authenticated requests on behalf of a user. Mitigated by SameSite cookies and CSRF tokens. |
| Input Validation | The practice of verifying that user input conforms to expected formats before processing. Handled by Zod schemas. |
| Sanitization | The practice of cleaning user input to remove potentially dangerous content before storage or display. |
| Hashing | A one-way transformation of data (typically passwords) into a fixed-length string. PKMP uses bcrypt for password hashing. |
| Salt | A random value added to a password before hashing to prevent rainbow table attacks. |
| HTTPS | HTTP over TLS. All production traffic uses HTTPS. |
| Content-Security-Policy (CSP) | An HTTP header that restricts which resources the browser can load, mitigating XSS attacks. |

---

# 10. Documentation Terminology

| Term | Definition |
|------|------------|
| IEEE 29148 | An international standard for requirements engineering covering requirements specification and documentation. |
| Arc42 | A practical template for software architecture documentation organized into standardized sections. |
| C4 Model | A hierarchical approach to diagramming software architecture at four abstraction levels: Context, Container, Component, Code. |
| ADR (Architecture Decision Record) | A short document capturing a single architectural decision, its context, and consequences. |
| Mermaid | A text-based diagramming language that renders flowcharts, sequence diagrams, ER diagrams, and other visualizations in Markdown. |
| Semantic Versioning (SemVer) | A versioning scheme using MAJOR.MINOR.PATCH format. MAJOR for breaking changes, MINOR for features, PATCH for fixes. |
| Conventional Commits | A commit message specification using prefixes (feat, fix, docs, refactor, test, chore) to categorize changes. |
| GFM | GitHub-Flavored Markdown. The Markdown dialect used for all PKMP documentation. |
| Traceability Matrix | A table mapping requirements to their implementation, test cases, and verification status. |
| Definition of Done | A checklist of conditions that must be satisfied before a feature or module is considered complete. |

---

# 11. Abbreviations and Acronyms

| Abbreviation | Full Form |
|-------------|-----------|
| PKMP | Pokémon Knowledge Management Platform |
| API | Application Programming Interface |
| REST | Representational State Transfer |
| DTO | Data Transfer Object |
| ORM | Object-Relational Mapping |
| JWT | JSON Web Token |
| RBAC | Role-Based Access Control |
| CRUD | Create, Read, Update, Delete |
| CI | Continuous Integration |
| CD | Continuous Deployment |
| CDN | Content Delivery Network |
| CSR | Client-Side Rendering |
| SSR | Server-Side Rendering |
| PWA | Progressive Web App |
| HMR | Hot Module Replacement |
| LCP | Largest Contentful Paint |
| FID | First Input Delay |
| CLS | Cumulative Layout Shift |
| TTI | Time to Interactive |
| FTS | Full-Text Search |
| GIN | Generalized Inverted Index |
| PK | Primary Key |
| FK | Foreign Key |
| 3NF | Third Normal Form |
| ACID | Atomicity, Consistency, Isolation, Durability |
| OWASP | Open Worldwide Application Security Project |
| ASVS | Application Security Verification Standard |
| WCAG | Web Content Accessibility Guidelines |
| ARIA | Accessible Rich Internet Applications |
| XSS | Cross-Site Scripting |
| CSRF | Cross-Site Request Forgery |
| CSP | Content-Security-Policy |
| CORS | Cross-Origin Resource Sharing |
| TLS | Transport Layer Security |
| SSL | Secure Sockets Layer (deprecated term for TLS) |
| SoC | Separation of Concerns |
| DI | Dependency Injection |
| DDD | Domain-Driven Design |
| ADR | Architecture Decision Record |
| BST | Base Stat Total |
| IV | Individual Value |
| EV | Effort Value |
| HP | Hit Points |
| PP | Power Points |
| STAB | Same-Type Attack Bonus |
| TCG | Trading Card Game |
| GFM | GitHub-Flavored Markdown |
| SemVer | Semantic Versioning |

---

# 12. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Charter | `docs/00_Project_Management/00_Project_Charter.md` |
| Project Context | `docs/00_Project_Management/01_Project_Context.md` |
| Vision and Goals | `docs/00_Project_Management/02_Vision_and_Goals.md` |
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |

---

## External References

| Resource | URL |
|----------|-----|
| IEEE 29148 | https://standards.ieee.org/standard/29148-2018.html |
| Arc42 | https://arc42.org |
| C4 Model | https://c4model.com |
| OWASP ASVS | https://owasp.org/www-project-application-security-verification-standard/ |
| WCAG 2.2 | https://www.w3.org/TR/WCAG22/ |
| Semantic Versioning | https://semver.org |
| Conventional Commits | https://www.conventionalcommits.org |
| NestJS | https://nestjs.com |
| Prisma | https://www.prisma.io |
| React | https://react.dev |
| Vite | https://vite.dev |
| Tailwind CSS | https://tailwindcss.com |
| TanStack | https://tanstack.com |
| Zod | https://zod.dev |
| PostgreSQL | https://www.postgresql.org |

---

# Next Document

```
docs/00_Project_Management/05_Assumptions_and_Constraints.md
```

The Assumptions and Constraints document records all assumptions made during planning and the constraints that bound the project's technical and operational decisions.
