---
name: db-migrate
description: Setup database and run Alembic migrations
inputs:
  - name: action
    type: string
    required: true
    description: Action to perform (init/create/upgrade/downgrade/current)
  - name: revision
    type: string
    required: false
    description: Target revision for upgrade/downgrade
outputs:
  - name: success
    type: boolean
    description: True if migration succeeded
  - name: message
    type: string
    description: Success/error message
  - name: current_revision
    type: string
    description: Current database revision after migration
---

# Skill: DB Migrate

## Purpose
Initialize database, create migrations, and apply migrations with Alembic.

## Prerequisites

```bash
# Install Alembic
pip install alembic

# Initialize Alembic
alembic init alembic
```

## Configuration (alembic.ini)

```ini
[alembic]
script_location = alembic
file_template = %%(year)d%%(month).2d%%(day).2d_%%(rev)s_%%(slug)s
prepend_sys_path = .

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic
```

## Env Configuration (alembic/env.py)

```python
from sqlmodel import SQLModel
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker
from alembic import context
import sys
import os

# Add your models to the path
sys.path.insert(0, os.getcwd())

from models import Task, User  # Import your models

# Database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

config = context.config
config.set_main_option("sqlalchemy.url", DATABASE_URL)

target_metadata = SQLModel.metadata

def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        url=DATABASE_URL,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

run_migrations_online()
```

## Actions

### 1. Init Database
```python
import subprocess

def db_init():
    try:
        # Create all tables
        from models import SQLModel, engine
        from sqlmodel import Session

        SQLModel.metadata.create_all(engine)

        return {"success": True, "message": "Database initialized"}
    except Exception as e:
        return {"success": False, "message": str(e)}
```

### 2. Create Migration
```bash
# Command
alembic revision --autogenerate -m "create tasks table"

# Output: Creates new migration file in alembic/versions/
```

### 3. Upgrade
```bash
# Upgrade to latest
alembic upgrade head

# Upgrade to specific revision
alembic upgrade <revision_id>

# Python wrapper
def db_upgrade(revision: str = "head"):
    try:
        result = subprocess.run(
            ["alembic", "upgrade", revision],
            capture_output=True,
            text=True,
            check=True
        )
        return {
            "success": True,
            "message": "Migration successful",
            "current_revision": result.stdout
        }
    except subprocess.CalledProcessError as e:
        return {
            "success": False,
            "message": f"Migration failed: {e.stderr}"
        }
```

### 4. Downgrade
```bash
# Downgrade one step
alembic downgrade -1

# Downgrade to base
alembic downgrade base

# Downgrade to specific revision
alembic downgrade <revision_id>
```

### 5. Current
```bash
# Show current revision
alembic current

# Python wrapper
def db_current():
    try:
        result = subprocess.run(
            ["alembic", "current"],
            capture_output=True,
            text=True,
            check=True
        )
        return {
            "success": True,
            "current_revision": result.stdout.strip()
        }
    except subprocess.CalledProcessError as e:
        return {
            "success": False,
            "message": str(e)
        }
```

## API Endpoints (Admin Only)

```python
from fastapi import APIRouter, Depends, HTTPException
from auth import get_admin_user

admin_router = APIRouter(prefix="/admin/db", tags=["Database"])

@admin_router.post("/migrate")
async def migrate_database(
    revision: str = "head",
    admin = Depends(get_admin_user)
):
    result = db_upgrade(revision)
    if not result["success"]:
        raise HTTPException(500, result["message"])
    return result

@admin_router.post("/downgrade")
async def downgrade_database(
    revision: str = "-1",
    admin = Depends(get_admin_user)
):
    result = db_downgrade(revision)
    if not result["success"]:
        raise HTTPException(500, result["message"])
    return result

@admin_router.get("/status")
async def db_status(admin = Depends(get_admin_user)):
    return db_current()
```

## Migration Example

### Migration File (alembic/versions/001_create_tasks.py)

```python
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', sa.String(20), default='pending'),
        sa.Column('priority', sa.String(10), default='medium'),
        sa.Column('due_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('NOW()')),
        sa.Index('idx_tasks_user', 'user_id'),
        sa.Index('idx_tasks_status', 'status'),
    )

def downgrade():
    op.drop_index('idx_tasks_status', 'tasks')
    op.drop_index('idx_tasks_user', 'tasks')
    op.drop_table('tasks')
```

## Acceptance Criteria

- [ ] Migrations are reversible (downgrade works without data loss)
- [ ] Migration files include both upgrade() and downgrade()
- [ ] Foreign keys and indexes are created
- [ ] Timestamps have server defaults
- [ ] Database URL is configurable via environment
- [ ] Admin endpoints are protected
- [ ] Migration success/failure is properly reported

## Error Handling

| Error | Message | Action |
|-------|----------|--------|
| Database connection failed | Cannot connect to database | Check DATABASE_URL |
| Migration already applied | Migration already applied | Skip or inform |
| Reversible constraint | Migration cannot be reversed | Modify to support rollback |

## Usage

```bash
# Development workflow
1. Update models in models.py
2. alembic revision --autogenerate -m "description"
3. Review generated migration
4. alembic upgrade head

# Production workflow
1. Test migration in staging
2. Backup production database
3. Run migration in maintenance window
4. Verify application works
5. Keep backup for rollback period
```
