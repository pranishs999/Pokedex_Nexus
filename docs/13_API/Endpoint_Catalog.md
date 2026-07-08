# Endpoint Catalog

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-API-EC-001 |
| Document Name | Endpoint Catalog |
| Version | 1.0.0 |
| Status | Draft |
| Documentation Standard | REST Best Practices |
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
2. Authentication Endpoints (`/api/v1/auth`)
3. Pokémon Encyclopedia Endpoints (`/api/v1/pokemon`)
4. Team Builder Endpoints (`/api/v1/teams`)
5. References

---

# 1. Purpose and Scope

This Endpoint Catalog document defines the REST API endpoints, query filters, payload schemas, and response formats for the NestJS API application of the Pokémon Knowledge Management Platform (PKMP) v1.0.0.

---

# 2. Authentication Endpoints (`/api/v1/auth`)

## 2.1 Authenticate User
- **HTTP Method:** `POST`
- **Path:** `/api/v1/auth/login`
- **Request Body:**
  ```json
  {
    "email": "user@pkmp.org",
    "password": "securePassword1"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "accessToken": "eyJhbGciOi...",
    "expiresIn": 900
  }
  ```

---

# 3. Pokémon Encyclopedia Endpoints (`/api/v1/pokemon`)

## 3.1 List Pokémon
- **HTTP Method:** `GET`
- **Path:** `/api/v1/pokemon`
- **Query Parameters:**
  - `page` (Integer, default: 1).
  - `limit` (Integer, default: 20, max: 100).
  - `type` (String, e.g., "Fire").
  - `includeCommunity` (Boolean, default: `false`).
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "c1f77d34-d022-491c-b715-c7dfd93b3337",
        "nationalNum": 1,
        "name": "Bulbasaur",
        "slug": "bulbasaur",
        "types": ["Grass", "Poison"]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1025
    }
  }
  ```

---

# 4. Team Builder Endpoints (`/api/v1/teams`)

## 4.1 Save Custom Team
- **HTTP Method:** `POST`
- **Path:** `/api/v1/teams`
- **Headers Required:** `Authorization: Bearer <token>`
- **Request Body:** Matches the `SaveTeamDto` schema (CD-4.1).
- **Response (201 Created):**
  ```json
  {
    "id": "e67d2bfa-c01b-4f51-a982-f53874011cb7",
    "name": "Kanto Legends",
    "createdAt": "2026-06-30T10:27:14Z"
  }
  ```

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Functional Requirements | `docs/01_Requirements/02_Functional_Requirements.md` |
| API Requirements | `docs/01_Requirements/14_API_Requirements.md` |
| Component Design | `docs/02_Architecture/Component_Design.md` |
| Interface Specifications | `docs/02_Architecture/Interface_Specifications.md` |
| Token Management | `docs/11_Security/Token_Management.md` |

---

# Next Document

```
docs/13_API/Error_Handling.md
```

The Error Handling document defines standardized API error JSON shapes, validation error mappings, and HTTP response codes.
