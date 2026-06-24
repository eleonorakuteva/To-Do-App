import { useState, useEffect } from 'react'

// TaskForm renders the "add a task" form at the top of the page.
// Props:
//   onAdd    — function called when the form is submitted,
//              receives the new task data as an argument
//   projects — list of projects to choose from in the dropdown

function TaskForm({ onAdd, projects }) {
    // One useState per input field.
    // Each holds what the user is currently typing in that field.
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [dateError, setDateError] = useState('')
    // Which project the new task belongs to. Stored as a string because
    // <select> values are always strings — we convert to a number on submit.
    const [projectId, setProjectId] = useState('')

    // Projects load asynchronously. Once they arrive (and the user hasn't
    // already picked one), default the dropdown to "General".
    useEffect(() => {
        if (projects.length > 0 && projectId === '') {
            const general = projects.find(p => p.name === 'General')
            // Fall back to the first project if "General" somehow isn't there.
            setProjectId(String(general ? general.id : projects[0].id))
        }
    }, [projects, projectId])

    function isValidDate(value) {
        // Must match YYYY-MM-DD and be a real calendar date
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
        const date = new Date(value)
        return !isNaN(date.getTime())
    }

    async function handleSubmit(event) {
        // Prevent the browser's default form behaviour (which would
        // reload the page — we want to handle it ourselves with JavaScript)
        event.preventDefault()

        // title.trim() removes whitespace — don't submit an empty title
        if (!title.trim()) return

        // Validate due date if provided
        if (dueDate && !isValidDate(dueDate)) {
            setDateError('Please enter a valid date in DD-MM-YYYY format')
            return
        }

        // Call the onAdd function passed in as a prop,
        // with the form data as an object. project_id is converted from the
        // select's string value to a number; if none is set, send null so the
        // backend falls back to "General".
        await onAdd({
            title,
            description,
            due_date: dueDate,
            project_id: projectId ? Number(projectId) : null,
        })

        // Clear the text fields after successful submission.
        // We leave the project selection as-is so adding several tasks to the
        // same project doesn't require re-picking it each time.
        setTitle('')
        setDescription('')
        setDueDate('')
        setDateError('')
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
                onChange={(event) => {
                    setDueDate(event.target.value)
                    setDateError('')
                }}
            />
            {dateError && <span className="date-error">{dateError}</span>}

            {/* Project dropdown — defaults to "General" (set in useEffect) */}
            <select
                value={projectId}
                onChange={(event) => setProjectId(event.target.value)}
            >
                {projects.map(project => (
                    <option key={project.id} value={project.id}>
                        {project.name}
                    </option>
                ))}
            </select>

            <button type="submit">Add Task</button>

        </form>
    )
}

export default TaskForm
