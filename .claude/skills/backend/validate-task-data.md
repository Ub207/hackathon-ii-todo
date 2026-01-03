---
name: validate-task-data
description: Validate task input data for create/update operations
inputs:
  - name: task_fields
    type: object
    required: true
    description: Task data to validate (title, description, status, priority, due_date)
  - name: operation
    type: string
    required: true
    description: Type of operation (create/update)
outputs:
  - name: valid
    type: boolean
    description: True if data is valid
  - name: errors
    type: array
    description: List of validation errors (empty if valid)
---

# Skill: Validate Task Data

## Purpose
Validate task data before create/update operations with comprehensive error reporting.

## Implementation

```python
from pydantic import BaseModel, Field, validator, ValidationError
from typing import Optional, List
from datetime import datetime

class TaskDataValidator:
    @staticmethod
    def validate(task_fields: dict, operation: str = "create") -> tuple[bool, List[str]]:
        errors = []

        # Title validation
        if "title" in task_fields:
            title = task_fields["title"]
            if not title or not isinstance(title, str):
                errors.append("Title is required")
            elif len(title.strip()) == 0:
                errors.append("Title cannot be empty")
            elif len(title) > 200:
                errors.append("Title must be 200 characters or less")

        # Description validation
        if "description" in task_fields and task_fields["description"]:
            desc = task_fields["description"]
            if not isinstance(desc, str):
                errors.append("Description must be a string")
            elif len(desc) > 2000:
                errors.append("Description must be 2000 characters or less")

        # Status validation
        if "status" in task_fields and task_fields["status"]:
            valid_statuses = ["pending", "in_progress", "completed"]
            if task_fields["status"] not in valid_statuses:
                errors.append(f"Status must be one of: {', '.join(valid_statuses)}")

        # Priority validation
        if "priority" in task_fields and task_fields["priority"]:
            valid_priorities = ["low", "medium", "high"]
            if task_fields["priority"] not in valid_priorities:
                errors.append(f"Priority must be one of: {', '.join(valid_priorities)}")

        # Due date validation
        if "due_date" in task_fields and task_fields["due_date"]:
            try:
                if isinstance(task_fields["due_date"], str):
                    due_date = datetime.fromisoformat(task_fields["due_date"])
                else:
                    due_date = task_fields["due_date"]

                if due_date < datetime.utcnow():
                    errors.append("Due date cannot be in the past")
            except (ValueError, TypeError):
                errors.append("Invalid due date format")

        # User ID validation (required for create)
        if operation == "create":
            if "user_id" not in task_fields or not task_fields["user_id"]:
                errors.append("User ID is required")

        return len(errors) == 0, errors
```

## Usage

```python
# Create operation
task_data = {
    "title": "Complete project",
    "description": "Write documentation",
    "status": "pending",
    "priority": "high"
}

valid, errors = TaskDataValidator.validate(task_data, "create")
if not valid:
    raise HTTPException(422, {"errors": errors})

# Update operation (partial)
update_data = {"status": "completed", "priority": "low"}
valid, errors = TaskDataValidator.validate(update_data, "update")
if not valid:
    raise HTTPException(422, {"errors": errors})
```

## Validation Rules

| Field | Type | Required (create) | Max Length | Valid Values |
|-------|-------|------------------|------------|--------------|
| title | string | Yes | 200 | Non-empty |
| description | string | No | 2000 | Any |
| status | string | No | - | pending, in_progress, completed |
| priority | string | No | - | low, medium, high |
| due_date | datetime | No | - | Future dates only |
| user_id | integer | Yes | - | Positive integer |

## Acceptance Criteria

- [ ] All required fields present for create operation
- [ ] Title not empty and within length limit
- [ ] Status/priority values are in allowed set
- [ ] Due date is not in past
- [ ] Error messages are clear and actionable
- [ ] Returns boolean + array of errors
