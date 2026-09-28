# Nginx Configuration

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-DEP-NC-001 |
| Document Name | Nginx Configuration |
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
2. Reverse Proxy & Server Blocks
3. SSL/TLS Security Protocols
4. Rate Limiting and Client Sizing
5. References

---

# 1. Purpose and Scope

This Nginx Configuration document defines the reverse proxy routing rules, SSL/TLS certifications, secure HTTP headers, client payload restrictions, and API rate-limiting rules for the Nginx edge server of the Pokémon Knowledge Management Platform (PKMP) v1.0.0.

---

# 2. Reverse Proxy & Server Blocks

The Nginx host acts as the single point of entry, routing requests to containers:

```nginx
server {
    listen 80;
    server_name pkmp.org www.pkmp.org;
    return 301 https://$host$request_uri; # Force HTTPS redirect
}

server {
    listen 443 ssl http2;
    server_name pkmp.org www.pkmp.org;

    ssl_certificate /etc/letsencrypt/live/pkmp.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pkmp.org/privkey.pem;

    # Static Assets routing
    location / {
        proxy_pass http://web_container:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # API endpoints routing
    location /api/ {
        proxy_pass http://api_container:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

# 3. SSL/TLS Security Protocols

To meet security targets (REQ-NFR-205), Nginx is configured to enforce modern cryptography standards:

- **Protocols Supported:** TLS 1.3 only. Reject older, vulnerable TLS versions (1.0, 1.1, 1.2).
- **HTTP Strict Transport Security (HSTS):** Enforce secure connections using HSTS headers:
  `add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;`
- **Security Headers:**
  `add_header X-Frame-Options "DENY" always;`
  `add_header X-Content-Type-Options "nosniff" always;`

---

# 4. Rate Limiting and Client Sizing

To prevent denial of service (DoS) attacks, configure Nginx traffic rate limiting:

- **Limit Map:** Define rate-limiting zones in `nginx.conf`:
  - `limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;` (Limits standard API queries to 10 requests per second).
  - `limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=1r/s;` (Limits authentication attempts to 1 request per second).
- **Client Body Size Limit:** Restrict uploads (e.g., CMS JSON imports) to prevent server timeouts:
  `client_max_body_size 5M;`

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| Security Requirements | `docs/01_Requirements/13_Security_Requirements.md` |
| API Requirements | `docs/01_Requirements/14_API_Requirements.md` |
| Deployment Requirements | `docs/01_Requirements/21_Deployment_Requirements.md` |
| System Architecture | `docs/02_Architecture/System_Architecture.md` |
| Docker Compose Configuration | `docs/10_Deployment/Docker_Compose.md` |

---

# Next Document

```
docs/10_Deployment/Disaster_Recovery.md
```

The Disaster Recovery document outlines database backup procedures, restore steps, and system recovery workflows.
