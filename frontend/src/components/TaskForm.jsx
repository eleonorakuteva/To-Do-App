import { useState } from 'react'

// TaskForm renders the "add a task" form at the top of the page.
// Props:
//   onAdd — function called when the form is submitted,
//            receives the new task data as an argument

function TaskForm({ onAdd }) {
    // One useState per input field.
    // Each holds what the user is currently typing in that field.
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState('')

    async function handleSubmit(event) {
        // Prevent the browser's default form behaviour (which would
        // reload the page — we want to handle it ourselves with JavaScript)
        event.preventDefault()

        // title.trim() removes whitespace — don't submit an empty title
        if (!title.trim()) return

        // Call the onAdd function passed in as a prop,
        // with the form data as an object
        await onAdd({ title, description, due_date: dueDate })

        // Clear the form after successful submission
        setTitle('')
        setDescription('')
        setDueDate('')
    }

    return (
        <form className="task-form" onSubmit={handleSubmit}>

            {/* Title input — required */}
            <input
                type="text"
                placeholder="Task title (required)"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
            />

            {/* Description input — optional */}
            <input
                type="text"
                placeholder="Description (optional)"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
            />

            {/* Due date input — optional */}
            <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
            />

            <button type="submit">Add Task</button>

        </form>
    )
}

export default TaskForm
