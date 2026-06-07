from pydantic import BaseModel


# Used for POST /tasks (creating a new task).
# Only title is required — the rest are optional.
# id, completed, and created_at are NOT here because the database
# creates those automatically — the frontend never sends them.
class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    due_date: str | None = None


# Used for PATCH /tasks/{id} (updating an existing task).
# Every field is optional — the frontend sends only what it wants to change.
# Example: {"completed": 1} toggles the checkbox without touching title or due_date.
class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    due_date: str | None = None
    completed: int | None = None


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
