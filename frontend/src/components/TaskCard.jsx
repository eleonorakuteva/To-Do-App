// TaskCard displays a single task row.
// It receives 4 props:
//   task     — the task object from the database { id, title, description, due_date, completed, project_id }
//   project  — the project this task belongs to { id, name, color } (may be undefined while loading)
//   onToggle — function to call when the checkbox is clicked
//   onDelete — function to call when the delete button is clicked

function TaskCard({ task, project, onToggle, onDelete }) {
    // Colour the left accent stripe with the project's colour, but only for
    // active tasks — completed tasks keep the muted grey from the CSS.
    const cardStyle =
        project && !task.completed ? { borderLeftColor: project.color } : undefined

    return (
        <div
            className={`task-card ${task.completed ? 'completed' : ''}`}
            style={cardStyle}
        >

            {/* Checkbox — toggles the completed state */}
            <input
                type="checkbox"
                checked={task.completed === 1}
                onChange={() => onToggle(task.id, task.completed)}
            />

            {/* Task content — title, description, due date, project */}
            <div className="task-content">
                <span className="task-title">{task.title}</span>

                {/* Only render description if it exists */}
                {task.description && (
                    <span className="task-description">{task.description}</span>
                )}

                {/* Only render due date if it exists */}
                {task.due_date && (
                    <span className="task-due-date">Due: {task.due_date}</span>
                )}

                {/* Project label, tinted with the project's colour */}
                {project && (
                    <span
                        className="task-project"
                        style={{ backgroundColor: project.color }}
                    >
                        {project.name}
                    </span>
                )}
            </div>

            {/* Delete button */}
            <button
                className="delete-button"
                onClick={() => onDelete(task.id)}
            >
                Delete
            </button>

        </div>
    )
}

export default TaskCard
