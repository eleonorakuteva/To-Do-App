import { useState, useEffect } from 'react'

// TaskForm renders the "add a task" form at the top of the page.
// Props:
//   onAdd        — function called when the form is submitted,
//                  receives the new task data as an argument
//   projects     — list of projects to choose from in the dropdown
//   onAddProject — creates a new project; receives { name, color } and
//                  returns the created project (or { detail } on error)

function TaskForm({ onAdd, projects, onAddProject }) {
    // One useState per input field.
    // Each holds what the user is currently typing in that field.
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [dateError, setDateError] = useState('')
    // Which project the new task belongs to. Stored as a string because
    // <select> values are always strings — we convert to a number on submit.
    const [projectId, setProjectId] = useState('')

    // State for the inline "Add new project" form, shown when the user picks
    // the "+ Add new project…" option in the dropdown.
    const [showAddProject, setShowAddProject] = useState(false)
    const [newProjectName, setNewProjectName] = useState('')
    const [newProjectColor, setNewProjectColor] = useState('#4caf50')
    const [addProjectError, setAddProjectError] = useState('')

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

    // Special value used by the "+ Add new project…" option in the dropdown.
    const ADD_NEW = '__add__'

    function handleProjectChange(event) {
        const value = event.target.value
        if (value === ADD_NEW) {
            // Don't change the selected project — just reveal the inline form.
            setShowAddProject(true)
            setAddProjectError('')
        } else {
            setProjectId(value)
            setShowAddProject(false)
        }
    }

    async function handleCreateProject() {
        if (!newProjectName.trim()) return

        const created = await onAddProject({
            name: newProjectName.trim(),
            color: newProjectColor,
        })

        // Success returns the new project (has an id); a duplicate name returns
        // { detail: "..." } with no id — show that as an error.
        if (!created.id) {
            setAddProjectError(created.detail || 'Could not create project')
            return
        }

        // Select the new project for this task, then close and reset the form.
        setProjectId(String(created.id))
        setShowAddProject(false)
        setNewProjectName('')
        setNewProjectColor('#4caf50')
        setAddProjectError('')
    }

    function cancelAddProject() {
        setShowAddProject(false)
        setNewProjectName('')
        setAddProjectError('')
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

            {/* Project dropdown — defaults to "General" (set in useEffect).
                The last option opens the inline "Add new project" form. */}
            <select value={projectId} onChange={handleProjectChange}>
                {projects.map(project => (
                    <option key={project.id} value={project.id}>
                        {project.name}
                    </option>
                ))}
                <option value={ADD_NEW}>+ Add new project…</option>
            </select>

            {/* Inline "Add new project" form. Buttons are type="button" so they
                don't submit the outer task form. */}
            {showAddProject && (
                <div className="add-project-box">
                    <input
                        type="text"
                        placeholder="New project name"
                        value={newProjectName}
                        onChange={(event) => {
                            setNewProjectName(event.target.value)
                            setAddProjectError('')
                        }}
                    />
                    <label className="color-field">
                        Colour
                        <input
                            type="color"
                            value={newProjectColor}
                            onChange={(event) => setNewProjectColor(event.target.value)}
                        />
                    </label>
                    {addProjectError && (
                        <span className="date-error">{addProjectError}</span>
                    )}
                    <div className="add-project-actions">
                        <button type="button" onClick={handleCreateProject}>
                            Create
                        </button>
                        <button
                            type="button"
                            className="secondary"
                            onClick={cancelAddProject}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <button type="submit">Add Task</button>

        </form>
    )
}

export default TaskForm
