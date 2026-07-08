# Frontend Testing

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-TE-FT-001 |
| Document Name | Frontend Testing |
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
2. Component & Unit Testing (Vitest + React Testing Library)
3. Mocking Query & Routing Providers
4. End-to-End Testing (Playwright)
5. References

---

# 1. Purpose and Scope

This Frontend Testing document defines the component testing configurations, Vitest settings, React Testing Library setups, and Playwright E2E automation playbooks for the React client application of the Pokémon Knowledge Management Platform (PKMP) v1.0.0.

---

# 2. Component & Unit Testing (Vitest + React Testing Library)

Component testing verifies that visual components render correctly and handle user input.

- **Test Runner:** Vitest (highly optimized with Vite build tools).
- **Environment:** jsdom (simulates browser environments inside Node).
- **Assertions:** React Testing Library is used to query DOM outputs and fire user interaction events:

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatBar } from './StatBar';

describe('StatBar Component', () => {
  it('should render correct stat value and background indicator color', async () => {
    render(<StatBar label="Speed" value={110} />);
    
    const valueEl = screen.getByText('110');
    expect(valueEl).toBeInTheDocument();
    
    // Check color class application for strong stat >= 100
    const indicatorEl = screen.getByTestId('stat-indicator');
    expect(indicatorEl).toHaveClass('bg-[var(--color-accent-green)]');
  });
});
```

---

# 3. Mocking Query & Routing Providers

To isolate components under test, wrap components in mock routing and query providers:

- **Mocking TanStack Query:** Wrap components in a `QueryClientProvider` with a clean, cached-disabled query client.
- **Mocking TanStack Router:** Use TanStack Router's `createTestRouter` utility to mock route parameters, search terms, and path changes.

---

# 4. End-to-End Testing (Playwright)

E2E tests verify user journeys from the browser to the backend database.

- **Testing Tool:** Playwright.
- **Scope:** Automate paths including:
  - Performing searches and checking autocomplete dropdown lists.
  - Adding Pokémon to the comparison matrix.
  - Creating and saving a team in the Team Builder workspace.
- **Test Command:** Run `pnpm test:e2e` to launch Playwright tests in headless mode.

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| UI/UX Requirements | `docs/01_Requirements/15_UI_UX_Requirements.md` |
| Performance Requirements | `docs/01_Requirements/17_Performance_Requirements.md` |
| Page Layouts | `docs/04_UI_UX/Page_Layouts.md` |
| Style Guide | `docs/04_UI_UX/Style_Guide.md` |
| UI Component Design | `docs/04_UI_UX/Component_Design.md` |
| Backend Testing | `docs/09_Testing/Backend_Testing.md` |

---

# Next Document

```
docs/09_Testing/Load_Testing.md
```

The Load Testing document defines API load test scripts, performance thresholds, concurrent user models, and scaling metrics.
