# Error Handling

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-API-EH-001 |
| Document Name | Error Handling |
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
2. Standard Error Payload Format
3. Request Validation Failures (Zod)
4. Database & Exception Status Codes Mapping
5. References

---

# 1. Purpose and Scope

This Error Handling document defines the JSON payload structures, HTTP status codes, validation error mappings, and global exception filter actions for the NestJS API application of the Pokémon Knowledge Management Platform (PKMP) v1.0.0.

---

# 2. Standard Error Payload Format

All HTTP errors returned by the API must use a unified JSON structure:

```json
{
  "statusCode": 404,
  "message": "Pokemon with slug 'missingno' not found",
  "error": "Not Found",
  "timestamp": "2026-06-30T10:27:21Z",
  "path": "/api/v1/pokemon/missingno"
}
```

- **statusCode:** Matches the HTTP response code (e.g., 400, 401, 403, 404, 500).
- **path:** The requested endpoint path to assist client debugging.

---

# 3. Request Validation Failures (Zod)

When client input fails validation checks (Zod schema parser), the server returns a `400 Bad Request` status containing an array of validation issues:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2026-06-30T10:27:21Z",
  "path": "/api/v1/teams",
  "details": [
    {
      "field": "slots.0.pokemonId",
      "issue": "Required"
    },
    {
      "field": "slots.0.evs",
      "issue": "Total EVs must not exceed 510"
    }
  ]
}
```

---

# 4. Database & Exception Status Codes Mapping

To prevent leaking sensitive server details, the NestJS global exception filter maps raw database errors (e.g., Prisma client errors) to clean HTTP responses:

| Database Event / Error | mapped HTTP Status | client Response Message |
|------------------------|--------------------|-------------------------|
| **Record Not Found (P2025)** | `404 Not Found` | "Requested item not found" |
| **Unique Constraint (P2002)** | `409 Conflict` | "A record with this parameter already exists" |
| **Foreign Key Check (P2003)** | `400 Bad Request` | "Reference integrity validation failed" |
| **General Connection Loss** | `503 Service Unavailable` | "Database connection timed out" |

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| Business Rules | `docs/01_Requirements/08_Business_Rules.md` |
| API Requirements | `docs/01_Requirements/14_API_Requirements.md` |
| System Architecture | `docs/02_Architecture/System_Architecture.md` |
| Component Design | `docs/02_Architecture/Component_Design.md` |
| Endpoint Catalog | `docs/13_API/Endpoint_Catalog.md` |

---

# Next Document

```
docs/13_API/Swagger_Spec.md
```

The Swagger Spec document defines OpenAPI specifications, Swagger UI installation configurations, and API annotation decorators.
