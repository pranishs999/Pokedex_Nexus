# API Requirements

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-AP-002 |
| Document Name | API Requirements |
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
2. API Design Principles & Routing
3. Request and Response Payloads
4. Error Handling Specifications
5. Pagination, Sorting, and Filtering
6. API Documentation Standards
7. References

---

# 1. Purpose and Scope

This API Requirements document defines the REST API design guidelines, routing conventions, pagination patterns, payload shapes, error formats, and documentation standards for the backend services of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. All communication between the frontend React client and the backend NestJS service must follow these specifications.

---

# 2. API Design Principles & Routing

The platform API must follow RESTful design patterns.

## 2.1 Route Conventions
- **Base Path:** `/api/v1`
- **Resource Naming:** Use lowercase, plural nouns (e.g., `/api/v1/pokemon`, `/api/v1/moves`).
- **Nesting Rules:** Limit path nesting to one level deep (e.g., `/api/v1/pokemon/:id/moves`). For deeper lookups, pass criteria as query parameters.

## 2.2 HTTP Method Mapping

| Method | Path | Action | Response Code |
|--------|------|--------|---------------|
| **GET** | `/resources` | Retrieve a list of items. | 200 OK |
| **GET** | `/resources/:id` | Retrieve a specific item. | 200 OK |
| **POST** | `/resources` | Create a new item. | 201 Created |
| **PUT** | `/resources/:id` | Replace an existing item. | 200 OK |
| **PATCH** | `/resources/:id` | Update select fields. | 200 OK |
| **DELETE**| `/resources/:id` | Delete an item (or soft-delete).| 204 No Content|

---

# 3. Request and Response Payloads

All endpoints must exchange data in JSON format.

## 3.1 Content Types
- **Request Headers:** `Content-Type: application/json`
- **Response Headers:** `Content-Type: application/json`

## 3.2 Dynamic Serialization
- Response payloads must exclude internal fields (e.g., `password_hash`, `deleted_at`) before transmission.
- JSON keys must use camelCase formatting.

---

# 4. Error Handling Specifications

When an API request fails, the server must return a consistent error payload.

## 4.1 Error Payload Structure

```json
{
  "statusCode": 400,
  "timestamp": "2026-06-30T10:17:59Z",
  "path": "/api/v1/teams",
  "message": "Validation failed",
  "errors": [
    {
      "field": "pokemonSlots",
      "issue": "Team cannot exceed 6 Pokémon slots"
    }
  ]
}
```

## 4.2 Standard HTTP Status Codes Used

- **400 Bad Request:** Validation errors or malformed payloads.
- **401 Unauthorized:** Invalid or expired access token.
- **403 Forbidden:** Authenticated user lacks role permissions (RBAC).
- **404 Not Found:** Requested resource does not exist.
- **429 Too Many Requests:** Request threshold exceeded.
- **500 Internal Server Error:** Database connectivity failures or system crashes.

---

# 5. Pagination, Sorting, and Filtering

To protect database performance, endpoints returning collections must implement pagination.

## 5.1 Offset-Based Pagination (Standard Listings)
- **Parameters:** `page` (default: 1), `limit` (default: 20, max: 100).
- **Metadata:** Responses must wrap data arrays in an envelope containing pagination metadata:

```json
{
  "data": [...],
  "meta": {
    "currentPage": 1,
    "itemsPerPage": 20,
    "totalItems": 1025,
    "totalPages": 52
  }
}
```

## 5.2 Cursor-Based Pagination (FTS / Search Lists)
- **Parameters:** `cursor` (UUID offset marker), `limit`. Used for fast scrolling through large search result lists.

---

# 6. API Documentation Standards

The NestJS backend must automatically generate an interactive API playground using Swagger (OpenAPI 3.0 specification).

- **Route:** Accessible at `/api/docs` in development environments.
- **Decorators:** All controllers and DTOs must use NestJS Swagger decorators (`@ApiProperty`, `@ApiResponse`) to define expected request bodies, response models, parameter types, and validation constraints.

---

# 7. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Decision Log | `docs/00_Project_Management/10_Decision_Log.md` |
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| Security Requirements | `docs/01_Requirements/13_Security_Requirements.md` |

---

# Next Document

```
docs/01_Requirements/15_UI_UX_Requirements.md
```

The UI/UX Requirements document outlines the requirements for responsive design layout structures, theme tokens, loaders, skeleton screens, and asset management.
