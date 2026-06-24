import { useState, useEffect } from 'react'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import { getTasks, createTask, updateTask, deleteTask, getProjects } from '../api'

// TasksPage is the "/" route — the original to-do screen.
// All task state and handlers live here now (moved out of App.jsx,
// which became the shared layout when we added routing).
function TasksPage() {
    const [tasks, setTasks] = useState([])
    const [projects, setProjects] = useState([])
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        loadTasks()
        loadProjects()
    }, [])

    async function loadTasks() {
        const data = await getTasks()
        setTasks(data)
    }

    async function loadProjects() {
        const data = await getProjects()
        setProjects(data)
    }

    async function handleAdd(taskData) {
        const newTask = await createTask(taskData)
        setTasks(prev => [newTask, ...prev])
    }

    async function handleToggle(id, currentCompleted) {
        const updated = await updateTask(id, {
            completed: currentCompleted === 1 ? 0 : 1
        })
        setTasks(prev => prev.map(task => task.id === id ? updated : task))
    }

    async function handleDelete(id) {
        await deleteTask(id)
        setTasks(prev => prev.filter(task => task.id !== id))
    }

    const visibleTasks = tasks.filter(task => {
        if (filter === 'active') return task.completed === 0
        if (filter === 'completed') return task.completed === 1
        return true
    })

    return (
        <div className="grid">

            {/* Left column — add tasks + filters */}
            <aside className="sidebar">
                <h2>Add a Task</h2>
                <TaskForm onAdd={handleAdd} projects={projects} />

                <h2 className="filter-heading">Filter</h2>
                <div className="filters">
                    <button
                        className={filter === 'all' ? 'active' : ''}
                        onClick={() => setFilter('all')}
                    >
                        All
                        <span className="badge">{tasks.length}</span>
                    </button>
                    <button
                        className={filter === 'active' ? 'active' : ''}
                        onClick={() => setFilter('active')}
                    >
                        Active
                        <span className="badge">
                            {tasks.filter(t => t.completed === 0).length}
                        </span>
                    </button>
                    <button
                        className={filter === 'completed' ? 'active' : ''}
                        onClick={() => setFilter('completed')}
                    >
                        Completed
                        <span className="badge">
                            {tasks.filter(t => t.completed === 1).length}
                        </span>
                    </button>
                </div>
            </aside>

            {/* Right column — task list */}
            <main className="task-area">
                <h2>
                    {filter === 'all' ? 'All Tasks' :
                     filter === 'active' ? 'Active Tasks' :
                     'Completed Tasks'}
                </h2>
                <TaskList
                    tasks={visibleTasks}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                />
            </main>

        </div>
    )
}

export default TasksPage
