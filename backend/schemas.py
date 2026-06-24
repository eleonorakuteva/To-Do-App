from datetime import datetime
from pydantic import BaseModel, field_validator


def validate_iso_date(v):
    if v is not None:
        try:
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError("due_date must be in YYYY-MM-DD format")
    return v


# Used for POST /tasks (creating a new task).
# Only title is required — the rest are optional.
# id, completed, and created_at are NOT here because the database
# creates those automatically — the frontend never sends them.
class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    due_date: str | None = None
    # Optional: which project the task belongs to.
    # If omitted, create_task() falls back to the "General" project.
    project_id: int | None = None

    @field_validator("due_date")
    @classmethod
    def validate_due_date(cls, v):
        return validate_iso_date(v)


# Used for PATCH /tasks/{id} (updating an existing task).
# Every field is optional — the frontend sends only what it wants to change.
# Example: {"completed": 1} toggles the checkbox without touching title or due_date.
class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    due_date: str | None = None
    completed: int | None = None
    # Lets a task be moved to a different project.
    project_id: int | None = None

    @field_validator("due_date")
    @classmethod
    def validate_due_date(cls, v):
        return validate_iso_date(v)


# Used for POST /projects (creating a new project — "Add New Project").
# name is required; color is optional and falls back to a neutral grey
# so the API still works if the frontend doesn't send one.
class ProjectCreate(BaseModel):
    name: str
    color: str = "#888888"


# Used in responses for project routes.
# This is the full shape of a project as stored in the database.
class ProjectResponse(BaseModel):
    id: int
    name: str
    color: str


# Used in every response back to the frontend.
# This is the full shape of a task as stored in the database.
# The frontend reads this to know the id, whether it's done, when it was created, etc.
class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    due_date: str | None
    completed: int
    created_at: str
    project_id: int
