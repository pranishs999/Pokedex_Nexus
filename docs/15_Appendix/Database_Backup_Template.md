# Database Backup Template

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-APP-BT-001 |
| Document Name | Database Backup Template |
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
2. Automated Backup Shell Script (`backup-db.sh`)
3. Database Restore Shell Script (`restore-db.sh`)
4. Cron Scheduler Installation Settings
5. References

---

# 1. Purpose and Scope

This Database Backup Template document provides copy-paste shell script templates, cron scheduler installation instructions, and configuration variables for managing PostgreSQL database backups for the Pokémon Knowledge Management Platform (PKMP) v1.0.0.

---

# 2. Automated Backup Shell Script (`backup-db.sh`)

Save this script as `/scripts/backup-db.sh` on the host server:

```bash
#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

# Configuration
BACKUP_DIR="/var/backups/pkmp"
CONTAINER_NAME="pkmp_postgres_1"
DB_USER="pkmp_admin"
DB_NAME="pkmp"
RETENTION_DAYS=30
DATE=$(date +%F_%H-%M-%S)
BACKUP_FILE="${BACKUP_DIR}/pkmp_${DATE}.dump"

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

# Run pg_dump within the container
echo "Starting database backup..."
docker exec -t "${CONTAINER_NAME}" pg_dump -U "${DB_USER}" -F c "${DB_NAME}" > "${BACKUP_FILE}"
echo "Backup saved to: ${BACKUP_FILE}"

# Purge backups older than retention window
echo "Cleaning up backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -type f -name "pkmp_*.dump" -mtime +"${RETENTION_DAYS}" -delete
echo "Cleanup completed successfully."
```

---

# 3. Database Restore Shell Script (`restore-db.sh`)

Save this script as `/scripts/restore-db.sh` on the host server:

```bash
#!/bin/bash
set -e

# Configuration
CONTAINER_NAME="pkmp_postgres_1"
DB_USER="pkmp_admin"
DB_NAME="pkmp"

if [ -z "$1" ]; then
  echo "Usage: $0 /path/to/backup_file.dump"
  exit 1
fi

BACKUP_FILE=$1

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "Error: Backup file not found: ${BACKUP_FILE}"
  exit 1
fi

echo "Warning: This will overwrite the existing database. Proceed? (y/n)"
read -r response
if [ "$response" != "y" ]; then
  echo "Operation aborted."
  exit 0
fi

# Run pg_restore
echo "Starting database restore from ${BACKUP_FILE}..."
docker exec -i "${CONTAINER_NAME}" pg_restore -U "${DB_USER}" -d "${DB_NAME}" --clean --no-owner < "${BACKUP_FILE}"
echo "Database restore completed successfully."
```

---

# 4. Cron Scheduler Installation Settings

To schedule the backup script, add a cron job on the host:

1. **Open Cron Editor:**
   ```bash
   crontab -e
   ```
2. **Add Execution Line:**
   Schedule the backup script to run daily at 02:00 UTC and redirect log output:
   ```text
   0 2 * * * /bin/bash /scripts/backup-db.sh >> /var/log/pkmp-backup.log 2>&1
   ```

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Database Requirements | `docs/01_Requirements/18_Database_Requirements.md` |
| Deployment Requirements | `docs/01_Requirements/21_Deployment_Requirements.md` |
| Docker Compose Configuration | `docs/10_Deployment/Docker_Compose.md` |
| Disaster Recovery | `docs/10_Deployment/Disaster_Recovery.md` |

---

# Next Document

```
docs/15_Appendix/Seeding_Example_Payload.md
```

The Seeding Example Payload document provides complete JSON mock data arrays for Pokémon, moves, and abilities.
