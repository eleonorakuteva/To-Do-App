// TaskCard displays a single task row.
// It receives 3 props:
//   task     — the task object from the database { id, title, description, due_date, completed }
//   onToggle — function to call when the checkbox is clicked
//   onDelete — function to call when the delete button is clicked

function TaskCard({ task, onToggle, onDelete }) {
    return (
        <div className={`task-card ${task.completed ? 'completed' : ''}`}>

            {/* Checkbox — toggles the completed state */}
            <input
                type="checkbox"
                checked={task.completed === 1}
                onChange={() => onToggle(task.id, task.completed)}
            />

            {/* Task content — title, description, due date */}
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
