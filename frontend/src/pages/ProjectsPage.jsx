import { useState, useEffect } from 'react'
import { getProjects, createProject } from '../api'

// ProjectsPage is the "/projects" route.
// It lists all projects and provides the "Add New Project" form.
function ProjectsPage() {
    const [projects, setProjects] = useState([])
    const [name, setName] = useState('')
    // Native colour picker value — a hex string like "#4caf50".
    const [color, setColor] = useState('#4caf50')
    const [error, setError] = useState('')

    useEffect(() => {
        loadProjects()
    }, [])

    async function loadProjects() {
        const data = await getProjects()
        setProjects(data)
    }

    async function handleSubmit(event) {
        event.preventDefault()

        if (!name.trim()) return

        const created = await createProject({ name: name.trim(), color })

        // A successful create returns the new project (it has an id).
        // A duplicate name returns { detail: "..." } with no id (HTTP 409),
        // so we show that message instead of adding it to the list.
        if (!created.id) {
            setError(created.detail || 'Could not create project')
            return
        }

        setProjects(prev => [...prev, created])
        setName('')
        setError('')
    }

    return (
        <div className="grid">

            {/* Left column — add a new project */}
            <aside className="sidebar">
                <h2>Add New Project</h2>
                <form className="task-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Project name (required)"
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value)
                            setError('')
                        }}
                        required
                    />

                    {/* Native colour picker */}
                    <label className="color-field">
                        Colour
                        <input
                            type="color"
                            value={color}
                            onChange={(event) => setColor(event.target.value)}
                        />
                    </label>

                    {error && <span className="date-error">{error}</span>}

                    <button type="submit">Add Project</button>
                </form>
            </aside>

            {/* Right column — list of all projects */}
            <main className="task-area">
                <h2>Projects</h2>
                <div className="project-list">
                    {projects.map(project => (
                        <div className="project-row" key={project.id}>
                            <span
                                className="project-swatch"
                                style={{ backgroundColor: project.color }}
                            />
                            <span className="project-name">{project.name}</span>
                        </div>
                    ))}
                </div>
            </main>

        </div>
    )
}

export default ProjectsPage
