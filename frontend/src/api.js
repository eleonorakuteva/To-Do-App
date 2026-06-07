// All communication with the FastAPI backend lives here.
// Components never call fetch() directly — they import functions from this file.
// If the API URL or headers ever change, we fix it in one place.

// GET /tasks — fetch all tasks from the database
export async function getTasks() {
    const response = await fetch('/tasks')
    return response.json()
}

// POST /tasks — create a new task
// taskData is an object like { title: "Buy milk", description: "...", due_date: "..." }
export async function createTask(taskData) {
    const response = await fetch('/tasks', {
        method: 'POST',
        // Headers tell the server what format we're sending
        headers: { 'Content-Type': 'application/json' },
        // JSON.stringify converts a JavaScript object to a JSON string
        body: JSON.stringify(taskData),
    })
    return response.json()
}

// PATCH /tasks/{id} — update specific fields of an existing task
// fields is an object with only what changed, e.g. { completed: 1 }
export async function updateTask(id, fields) {
    const response = await fetch(`/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
    })
    return response.json()
}

// DELETE /tasks/{id} — permanently remove a task
export async function deleteTask(id) {
    await fetch(`/tasks/${id}`, { method: 'DELETE' })
}
