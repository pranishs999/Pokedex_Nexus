# Backend Testing

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-TE-BT-001 |
| Document Name | Backend Testing |
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
2. Unit Testing Strategy (Jest)
3. Integration Testing Strategy (Supertest)
4. Database Mocking & Transaction isolation
5. References

---

# 1. Purpose and Scope

This Backend Testing document specifies the unit testing strategies, integration testing frameworks, database mocking patterns, and testing commands for the NestJS API application of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. The test pipeline enforces a backend coverage threshold of ≥ 80%.

---

# 2. Unit Testing Strategy (Jest)

Unit tests focus on isolating business logic inside services by mocking external dependencies.

- **Testing Framework:** Jest.
- **File Location:** Unit test files are located alongside source code files using the `.spec.ts` naming suffix (e.g., `pokemon.service.spec.ts`).
- **Mocking Dependencies:** Use `jest.mock()` or NestJS custom testing utilities to swap out external providers. The Prisma Client is mocked using `jest-mock-extended` to prevent direct database connections:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { PrismaService } from '../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('PokemonService', () => {
  let service: PokemonService;
  let prismaMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
  });

  it('should return a pokemon details record', async () => {
    prismaMock.pokemon.findUnique.mockResolvedValue({ id: 'uuid-1', name: 'Bulbasaur' } as any);
    const result = await service.findOne('bulbasaur');
    expect(result.name).toBe('Bulbasaur');
  });
});
```

---

# 3. Integration Testing Strategy (Supertest)

Integration tests verify API controllers, HTTP routing, serialization, and database interactions.

- **Testing Library:** Supertest.
- **Setup:** A dedicated test database container is spun up. Test runs execute migrations prior to launching test suites.
- **Execution Workflow:** Tests execute HTTP requests on the NestJS instance and verify JSON payloads and status codes:

```typescript
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
// Integration setup...
it('POST /api/v1/auth/login - should authenticate user', () => {
  return request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email: 'user@pkmp.org', password: 'securePassword1' })
    .expect(201)
    .expect((res) => {
      expect(res.body.accessToken).toBeDefined();
    });
});
```

---

# 4. Database Mocking & Transaction isolation

- **Mock DB Strategy:** For unit tests, dependencies are mocked using deep mocks to ensure fast test execution.
- **Real DB Strategy:** Integration tests run against a physical PostgreSQL test container. Every test execution is wrapped in a database transaction block that is rolled back on completion, ensuring test isolation.

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| Database Requirements | `docs/01_Requirements/18_Database_Requirements.md` |
| Integration Requirements | `docs/01_Requirements/20_Integration_Requirements.md` |
| Acceptance Criteria | `docs/01_Requirements/23_Acceptance_Criteria.md` |
| Interface Specifications | `docs/02_Architecture/Interface_Specifications.md` |
| Coding Standards | `docs/08_Development/Coding_Standards.md` |

---

# Next Document

```
docs/09_Testing/Frontend_Testing.md
```

The Frontend Testing document specifies the component testing strategies, Vitest/Testing Library configurations, and Playwright E2E automation playbooks.
