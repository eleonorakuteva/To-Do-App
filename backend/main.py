from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import database
from schemas import TaskCreate, TaskUpdate, TaskResponse

# Create the FastAPI application instance.
# This object is what uvicorn runs when you do: uvicorn main:app
app = FastAPI()

# CORS configuration.
# Tells the browser: "requests from these origins are allowed."
# Without this, the React frontend at localhost:5173 would be blocked.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],   # allow GET, POST, PATCH, DELETE, etc.
    allow_headers=["*"],
)

# When the app starts, make sure the tables exist in todos.db.
# This runs once on startup — safe to call every time because of IF NOT EXISTS.
# Create projects first, because the tasks table references projects(id).
database.create_projects_table()
database.create_table()


# --- Routes ---
# Each function below is a "route handler": it runs when a matching
# HTTP request arrives. FastAPI reads the decorator (@app.get, @app.post, etc.)
# to know which URL and method triggers which function.


@app.get("/tasks", response_model=list[TaskResponse])
def get_tasks():
    # GET /tasks — return all tasks, newest first.
    # response_model tells FastAPI to validate and shape the output
    # using TaskResponse before sending it to the frontend.
    return database.get_all_tasks()


@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int):
    # GET /tasks/5 — return the task with id=5.
    # FastAPI automatically extracts task_id from the URL.
    task = database.get_task_by_id(task_id)
    if task is None:
        # HTTPException with 404 tells the frontend: "this task doesn't exist."
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.post("/tasks", response_model=TaskResponse, status_code=201)
def create_task(data: TaskCreate):
    # POST /tasks — create a new task.
    # FastAPI validates the request body against TaskCreate automatically.
    # If title is missing, FastAPI returns 422 before this function even runs.
    # status_code=201 means "Created" — more precise than the default 200 "OK".
    return database.create_task(data.title, data.description, data.due_date)


@app.patch("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, data: TaskUpdate):
    # PATCH /tasks/5 — update only the fields that were sent.
    # model_dump(exclude_unset=True) gives us only the fields the frontend
    # actually included in the request — not the ones left as None defaults.
    task = database.get_task_by_id(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    fields = data.model_dump(exclude_unset=True)
    return database.update_task(task_id, fields)


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    # DELETE /tasks/5 — permanently remove the task.
    task = database.get_task_by_id(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    database.delete_task(task_id)
    return {"message": "Task deleted"}
