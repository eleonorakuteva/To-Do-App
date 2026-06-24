import { Routes, Route, NavLink } from 'react-router-dom'
import TasksPage from './pages/TasksPage'
import ProjectsPage from './pages/ProjectsPage'
import './App.css'

// App is now the shared layout: the header + nav appear on every page,
// and <Routes> swaps the page content based on the URL.
function App() {
    return (
        <div className="app">

            {/* Full-width header — shown on every route */}
            <header className="app-header">
                <h1>My To-Do</h1>
                <p className="subtitle">Stay organised, one task at a time.</p>

                {/* Nav links. NavLink adds an "active" class to the current
                    route automatically, so we can highlight it. "end" on the
                    Tasks link stops it matching every URL that starts with "/". */}
                <nav className="main-nav">
                    <NavLink to="/" end>Tasks</NavLink>
                    <NavLink to="/projects">Projects</NavLink>
                </nav>
            </header>

            {/* The router renders exactly one of these based on the URL */}
            <Routes>
                <Route path="/" element={<TasksPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
            </Routes>

        </div>
    )
}

export default App
