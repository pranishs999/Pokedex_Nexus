# Load Testing

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-TE-LT-001 |
| Document Name | Load Testing |
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
2. Load Testing Tool (k6)
3. Load Profiles & Scaling Scenarios
4. Success Metrics and Thresholds
5. References

---

# 1. Purpose and Scope

This Load Testing document defines the load testing configurations, concurrent virtual user profiles, k6 test scripts, and system performance thresholds for the Pokémon Knowledge Management Platform (PKMP) v1.0.0. The test runs verify that the NestJS API and PostgreSQL database satisfy performance targets.

---

# 2. Load Testing Tool (k6)

The system uses Grafana k6 to execute load tests. k6 runs JavaScript scripts to model API traffic.

- **Test Script Structure:** Test files reside in `tests/performance/`.
- **Script Example (`search-load.js`):**

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp-up to 50 users
    { duration: '3m', target: 50 },  // Sustained load
    { duration: '1m', target: 0 },   // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // p95 response time must be under 200ms
    http_req_failed: ['rate<0.01'],    // Error rate must be under 1%
  },
};

export default function () {
  const url = 'http://api.pkmp.local/api/v1/search?q=charizard';
  const res = http.get(url);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

---

# 3. Load Profiles & Scaling Scenarios

Verify system resilience by executing three distinct test profiles:

- **Sustained Load Test:** 50 virtual users executing continuous lookups and search calls over 10 minutes to verify connection pooling stability.
- **Spike Test:** Ramping concurrent users from 0 to 200 within a 15-second window, verifying rate-limiting safeguards and queue management under sudden traffic spikes.
- **Soak Test:** Running a constant load of 20 users for 2 hours to detect memory leaks or database connection pool exhaustion.

---

# 4. Success Metrics and Thresholds

To pass verification gates, load tests must satisfy these thresholds:

| Metric | Target Boundary | PASS Criteria |
|--------|-----------------|---------------|
| **p95 Latency** | General API routes | ≤ 200 ms |
| **p95 Search Latency** | FTS query routes | ≤ 250 ms |
| **Error Rate** | Connection failures / HTTP 5xx | ≤ 1.0% |
| **Host CPU Max** | VPS utilization | ≤ 80% under peak load |
| **Host RAM Max** | VPS memory utilization | ≤ 90% (no Out-Of-Memory exits) |

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| Performance Requirements | `docs/01_Requirements/17_Performance_Requirements.md` |
| Database Requirements | `docs/01_Requirements/18_Database_Requirements.md` |
| Performance Tuning | `docs/03_Database/Performance_Tuning.md` |
| Backend Testing | `docs/09_Testing/Backend_Testing.md` |
| Frontend Testing | `docs/09_Testing/Frontend_Testing.md` |

---

# Next Document

```
docs/10_Deployment/README.md
```

This completes the `09_Testing` documentation phase. The next document is `docs/10_Deployment/README.md`, which kicks off the Deployment phase by outlining Docker configuration details, Nginx proxy templates, resource limitations, and disaster recovery rules.
