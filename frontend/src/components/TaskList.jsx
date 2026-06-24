import TaskCard from './TaskCard'

// TaskList renders a TaskCard for every task in the list.
// Props:
//   tasks    — array of task objects from the database
//   projects — array of projects, used to look up each task's project
//   onToggle — passed down to each TaskCard (called when checkbox clicked)
//   onDelete — passed down to each TaskCard (called when delete clicked)

function TaskList({ tasks, projects, onToggle, onDelete }) {
    // If there are no tasks, show a friendly message instead of an empty list
    if (tasks.length === 0) {
        return <p className="empty-message">No tasks yet. Add one above!</p>
    }

    return (
        <div className="task-list">
            {tasks.map(task => (
                // key is required by React to track list items efficiently.
                // We use task.id because it is unique for every task.
                // Match the task to its project so the card can show its colour.
                <TaskCard
                    key={task.id}
                    task={task}
                    project={projects.find(p => p.id === task.project_id)}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}

export default TaskList
