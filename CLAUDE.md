# To-Do App — Project Brief for Claude

## About this project
A full-stack to-do web app built as a learning project. The developer is new to web development and knows Python fundamentals and SQL. The goal is to learn everything end-to-end: database, backend API, and React frontend.

**Important:** Always explain the *why* behind every decision and command. The user learns by understanding, not just following instructions. Never run a command without explaining what it does first.

---

## Tech stack

| Layer | Technology | Why |
|---|---|---|
| Backend | FastAPI (Python) | Auto-generates `/docs` UI, great for learning APIs |
| Database | SQLite (`todos.db`) | Zero config, single file, ships with Python |
| SQL access | Raw `sqlite3` | User knows SQL — no ORM abstraction needed |
| Frontend | React + Vite | Component-based, industry standard, fast dev server |

---

## Project structure

```
To-Do-App/
├── backend/
│   ├── database.py       # Only file that talks to SQLite. All SQL lives here.
│   ├── schemas.py        # Pydantic models for API validation (TaskCreate, TaskUpdate, TaskResponse)
│   ├── main.py           # FastAPI app, all 5 routes, CORS middleware
│   └── requirements.txt  # fastapi, uvicorn
├── frontend/             # React app (Vite) — not built yet
├── todos.db              # SQLite database (auto-created, git-ignored)
├── .gitignore
└── CLAUDE.md             # This file
```

---

## Architecture — separation of concerns

```
React frontend  (localhost:5173)
      ↕ HTTP
main.py         ← receives requests, calls database.py, sends responses
      ↕ Python function calls
database.py     ← ALL SQL lives here, nothing else
      ↕ file read/write
todos.db        ← SQLite file on disk
```

Each layer only knows about the layer directly next to it. To swap SQLite for PostgreSQL, only `database.py` changes.

---

## Database schema

```sql
CREATE TABLE IF NOT EXISTS tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    description TEXT,
    due_date    TEXT,
    completed   INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
```

- `completed` is `0`/`1` — SQLite has no native boolean
- `due_date` is a TEXT string in ISO format (`YYYY-MM-DD`)
- `created_at` is set automatically by the database

---

## API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/tasks` | Return all tasks, newest first |
| GET | `/tasks/{id}` | Return one task, 404 if missing |
| POST | `/tasks` | Create a task (`title` required) |
| PATCH | `/tasks/{id}` | Update only provided fields |
| DELETE | `/tasks/{id}` | Delete a task |

---

## How to run the backend

```bash
cd backend
python -m uvicorn main:app --reload
```

- API runs at `http://127.0.0.1:8000`
- Interactive docs at `http://127.0.0.1:8000/docs`
- `--reload` restarts the server automatically on file save

---

## How to run the frontend (once built)

```bash
cd frontend
npm run dev
```

- React app runs at `http://localhost:5173`
- Vite proxy forwards `/tasks` calls to the FastAPI backend

---

## Git workflow

- Default branch: `main`
- Feature branches: `feature/<name>`
- Always work on a feature branch, open a PR into `main`, then merge
- Never commit directly to `main`

---

## Working with this developer — AI assistance best practices

The developer is learning how to use AI agents effectively. Follow these rules in every session:

### How to give instructions to Claude (for the developer to remember)
- **One thing at a time** — never bundle multiple features into one request. Verify each change works before moving on.
- **State the outcome, not the steps** — say "filter tasks where completed = 0", not "use a for loop to check each task"
- **Give context the agent doesn't have** — mention the file, the error message, what you already tried
- **Specify constraints** — "do not add new dependencies", "do not change the function signature"
- **Say what NOT to do** — agents tend to over-engineer; explicitly limit scope
- **Always verify** — read every changed file, run the app, test the specific thing that changed

### How Claude should behave in this project
- Always explain the *why* before writing any code or running any command
- Never run a command without explaining what it does first
- Ask questions when the request is ambiguous — don't assume
- Build bottom-up: database → backend → frontend
- Test each layer before building the next one

### Prompt guardrails — correct the developer when needed
If the developer gives a bad instruction, do NOT silently comply. Instead:

**Flag and stop if the instruction:**
- Is too vague (e.g. "fix it", "make it better", "add authentication")
  → Ask: "What specifically should change? Which file? What is the expected result?"
- Bundles multiple things at once (e.g. "fix the bug, add CSS, and refactor the API")
  → Say: "That's 3 separate tasks. Which one should we do first?"
- Would break the existing architecture (e.g. adding ORM when we use raw SQL)
  → Say: "This conflicts with our decision to use raw SQL. Here's why we chose that — do you want to change the approach or find a different solution?"
- Skips a layer (e.g. building frontend before the backend route exists)
  → Say: "The backend doesn't support this yet. We should build that first."
- Is a destructive action without confirmation (deleting files, dropping tables, force push)
  → Always confirm before proceeding, explain what will be lost

**Ask one clarifying question, not many**
If something is unclear, ask the single most important question. Don't bombard with 5 questions at once.

**Suggest a better prompt when the instruction is weak**
If the instruction is too vague, rewrite it as a clear prompt and ask:
"Did you mean something like: *[rewritten prompt]*? If yes I'll proceed, if not tell me more."

**Remind of best practices when the developer forgets them**
- Trying to commit to main directly → remind about feature branches
- Not testing before moving to next step → suggest testing first
- Asking for too much at once → remind to do one thing at a time

---

## Key architectural decisions

- **Raw SQL over ORM** — user knows SQL already; SQLAlchemy would replace familiar knowledge with new abstraction
- **`schemas.py` not `models.py`** — avoids confusion with ORM models; follows FastAPI official docs convention
- **Vite proxy** — avoids CORS issues in development by routing frontend API calls through Vite to the backend
- **SQLite for now** — switching to PostgreSQL later only requires changing `database.py`
