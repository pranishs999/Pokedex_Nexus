# Swagger Specification

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-API-SS-001 |
| Document Name | Swagger Specification |
| Version | 1.0.0 |
| Status | Draft |
| Documentation Standard | OpenAPI v3.0.3 |
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
2. OpenAPI DocumentBuilder Configuration
3. NestJS Controller Decorators
4. Interactive UI Hosting Mappings
5. References

---

# 1. Purpose and Scope

This Swagger Specification document defines the OpenAPI v3.0.3 options, NestJS Swagger annotations, schema configurations, and documentation hosting routes for the interactive API playground of the Pokémon Knowledge Management Platform (PKMP) v1.0.0.

---

# 2. OpenAPI DocumentBuilder Configuration

The API documentation is generated dynamically at server runtime using NestJS's Swagger module.

- **Builder Configuration (`main.ts`):**
  ```typescript
  import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

  const config = new DocumentBuilder()
    .setTitle('Pokémon Knowledge Management Platform (PKMP) API')
    .setDescription('Production-grade API endpoints for Pokedex queries, team building, and CMS functions.')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your short-lived access token',
        in: 'header',
      },
      'JWT-auth', // Identifier reference
    )
    .build();
  ```

---

# 3. NestJS Controller Decorators

Controllers use decorators to populate the OpenAPI schema:

```typescript
@ApiTags('pokemon')
@Controller('api/v1/pokemon')
export class PokemonController {
  
  @Get(':id_or_slug')
  @ApiOperation({ summary: 'Retrieve Pokemon detailed specifications' })
  @ApiResponse({ status: 200, description: 'Success', type: PokemonDetailsResponseDto })
  @ApiResponse({ status: 404, description: 'Pokemon not found', type: StandardErrorDto })
  async findOne(@Param('id_or_slug') idOrSlug: string) {
    // Controller logic...
  }
}
```

---

# 4. Interactive UI Hosting Mappings

- **Swagger UI route:** Exposed in development at `http://localhost:3000/api/docs`. Users can run requests directly from the browser.
- **Raw JSON Schema export:** Available at `http://localhost:3000/api/docs-json`, allowing generators to compile client-side fetch APIs.
- **Production Access:** Excluded in production by checking environmental variables to prevent disclosing routing structures.

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| API Requirements | `docs/01_Requirements/14_API_Requirements.md` |
| Component Design | `docs/02_Architecture/Component_Design.md` |
| Interface Specifications | `docs/02_Architecture/Interface_Specifications.md` |
| Local Setup | `docs/08_Development/Local_Setup.md` |
| Endpoint Catalog | `docs/13_API/Endpoint_Catalog.md` |
| Error Handling | `docs/13_API/Error_Handling.md` |

---

# Next Document

```
docs/14_Assets/README.md
```

This completes the `13_API` documentation phase. The next document is `docs/14_Assets/README.md`, which kicks off the Assets phase by detailing 2D image sprites, 3D glTF models, local optimization processes, and cache-control headers.
