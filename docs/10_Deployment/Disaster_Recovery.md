# Disaster Recovery

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-DEP-DR-001 |
| Document Name | Disaster Recovery |
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
2. Automated Backup Execution
3. Manual Restore Procedures
4. Failover & Service Recovery
5. References

---

# 1. Purpose and Scope

This Disaster Recovery document details the automated backup schedules, manual restoration procedures, database health monitoring tasks, and failover workflows for the production environment of the Pokémon Knowledge Management Platform (PKMP) v1.0.0.

---

# 2. Automated Backup Execution

To prevent data loss, the database uses an automated backup schedule.

- **Backup Cron Scheduler:** Runs daily at 02:00 UTC on the host server.
- **Backup Script Command:**
  Executes `pg_dump` within the PostgreSQL container to write a compressed backup file:
  ```bash
  docker-compose exec -t postgres pg_dump -U pkmp_admin -F c pkmp > /var/backups/pkmp_$(date +%F).dump
  ```
- **Retention Window:** Keeps backup files on the host for 30 days. Files older than 30 days are purged automatically.

---

# 3. Manual Restore Procedures

If database corruption or data loss occurs, Super Admins can restore the database from a backup file.

1. **Enable Maintenance Mode:**
   Reroute traffic to a static maintenance page:
   ```bash
   cp infrastructure/nginx/maintenance.html /var/www/html/index.html
   docker-compose stop api
   ```
2. **Execute Database Restore:**
   Use `pg_restore` to overwrite the existing database structure with the backup state:
   ```bash
   docker-compose exec -t postgres pg_restore -U pkmp_admin -d pkmp --clean --no-owner /var/backups/pkmp_target.dump
   ```
3. **Restart API Server & Restore Traffic:**
   ```bash
   docker-compose start api
   rm /var/www/html/index.html
   ```

---

# 4. Failover & Service Recovery

- **Container Restart Policies:** All containers in `docker-compose.yml` are configured with `restart: always` to ensure services restart automatically in the event of crashes.
- **Health Monitoring:** A cron script pings the `/api/v1/health` status route every 5 minutes. If pings fail consecutively, the script restarts the containers and sends an alert.

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Database Requirements | `docs/01_Requirements/18_Database_Requirements.md` |
| Deployment Requirements | `docs/01_Requirements/21_Deployment_Requirements.md` |
| System Architecture | `docs/02_Architecture/System_Architecture.md` |
| Docker Compose Configuration | `docs/10_Deployment/Docker_Compose.md` |
| Nginx Configuration | `docs/10_Deployment/Nginx_Configuration.md` |

---

# Next Document

```
docs/11_Security/README.md
```

This completes the `10_Deployment` documentation phase. The next document is `docs/11_Security/README.md`, which kicks off the Security phase by outlining OWASP ASVS checklist items, token rotation validation steps, encryption algorithms, and rate-limiting rule sets.
