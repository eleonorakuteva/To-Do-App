import { useState, useEffect } from 'react'
import TaskList from '../components/TaskList'
import { getProjects, getTasks, updateTask, deleteTask } from '../api'

// ProjectsPage is the "/projects" route.
// It lets you browse tasks by project: pick a project on the left and its
// tasks show on the right. Each project shows how many tasks are active/done.
function ProjectsPage() {
    const [projects, setProjects] = useState([])
    const [tasks, setTasks] = useState([])
    // Which project is being viewed. null means "All projects".
    const [selectedProjectId, setSelectedProjectId] = useState(null)

    useEffect(() => {
        loadProjects()
        loadTasks()
    }, [])

    async function loadProjects() {
        setProjects(await getProjects())
    }

    async function loadTasks() {
        setTasks(await getTasks())
    }

    // Toggle / delete work here too, since we reuse TaskList. Because the
    // counts below are derived from `tasks`, they update automatically.
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

    // Count active/done tasks for a project. projectId === null counts all.
    function countsFor(projectId) {
        const inProject = projectId === null
            ? tasks
            : tasks.filter(task => task.project_id === projectId)
        return {
            active: inProject.filter(task => task.completed === 0).length,
            done: inProject.filter(task => task.completed === 1).length,
        }
    }

    const visibleTasks = selectedProjectId === null
        ? tasks
        : tasks.filter(task => task.project_id === selectedProjectId)

    const selectedProject = projects.find(p => p.id === selectedProjectId)

    return (
        <div className="grid">

            {/* Left column — choose a project (or All) */}
            <aside className="sidebar">
                <h2>Projects</h2>
                <div className="project-filter-list">

                    {/* All projects */}
                    <button
                        className={`project-filter ${selectedProjectId === null ? 'active' : ''}`}
                        onClick={() => setSelectedProjectId(null)}
                    >
                        <span className="pf-name">All</span>
                        <span className="pf-counts">
                            {countsFor(null).active} active · {countsFor(null).done} done
                        </span>
                    </button>

                    {projects.map(project => {
                        const { active, done } = countsFor(project.id)
                        return (
                            <button
                                key={project.id}
                                className={`project-filter ${selectedProjectId === project.id ? 'active' : ''}`}
                                onClick={() => setSelectedProjectId(project.id)}
                            >
                                <span
                                    className="project-swatch"
                                    style={{ backgroundColor: project.color }}
                                />
                                <span className="pf-name">{project.name}</span>
                                <span className="pf-counts">{active} active · {done} done</span>
                            </button>
                        )
                    })}
                </div>
            </aside>

            {/* Right column — tasks for the selected project */}
            <main className="task-area">
                <h2>{selectedProject ? selectedProject.name : 'All Tasks'}</h2>
                <TaskList
                    tasks={visibleTasks}
                    projects={projects}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                />
            </main>

        </div>
    )
}

export default ProjectsPage
