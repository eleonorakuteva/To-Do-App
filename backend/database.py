import sqlite3
import os

# Build the path to the database file.
# __file__ is the path of THIS file (database.py).
# We go one level up to place todos.db at the project root, not inside backend/.
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "todos.db")


def get_connection():
    # Opens a connection to the SQLite database file.
    # If todos.db doesn't exist yet, SQLite creates it automatically.
    conn = sqlite3.connect(DB_PATH)

    # row_factory lets us access columns by name (row["title"])
    # instead of by position (row[1]). Much easier to read.
    conn.row_factory = sqlite3.Row
    return conn


def create_table():
    # CREATE TABLE IF NOT EXISTS means: only create the table if it
    # doesn't already exist. Safe to call every time the app starts.
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                title       TEXT    NOT NULL,
                description TEXT,
                due_date    TEXT,
                completed   INTEGER NOT NULL DEFAULT 0,
                created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
            )
        """)


def create_projects_table():
    # A "project" is a category a task belongs to (e.g. Work, Personal).
    # Tasks will point at a project later — for now we just create the table.
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id    INTEGER PRIMARY KEY AUTOINCREMENT,
                name  TEXT NOT NULL UNIQUE,
                color TEXT NOT NULL
            )
        """)
        # Seed the default "General" project.
        # INSERT OR IGNORE does nothing if a project named "General" already
        # exists (the UNIQUE constraint on name blocks the duplicate).
        # That makes this safe to run every time the app starts.
        conn.execute(
            "INSERT OR IGNORE INTO projects (name, color) VALUES (?, ?)",
            ("General", "#888888"),
        )


def get_all_tasks():
    with get_connection() as conn:
        # fetchall() returns a list of all matching rows.
        # ORDER BY created_at DESC = newest tasks appear first.
        rows = conn.execute(
            "SELECT * FROM tasks ORDER BY created_at DESC"
        ).fetchall()
        # Convert each Row object to a plain dict so FastAPI can
        # serialize it to JSON.
        return [dict(row) for row in rows]


def get_task_by_id(task_id: int):
    with get_connection() as conn:
        row = conn.execute(
            "SELECT * FROM tasks WHERE id = ?", (task_id,)
        ).fetchone()
        # fetchone() returns None if no row matched.
        return dict(row) if row else None


def create_task(title: str, description: str | None, due_date: str | None):
    with get_connection() as conn:
        # The ? placeholders are filled in by SQLite from the tuple.
        # NEVER use f-strings to build SQL — that opens a SQL injection vulnerability.
        cursor = conn.execute(
            "INSERT INTO tasks (title, description, due_date) VALUES (?, ?, ?)",
            (title, description, due_date),
        )
        new_id = cursor.lastrowid
    # Fetch AFTER the with-block closes, because that's when SQLite commits
    # the transaction. A second connection can't see the row until it's committed.
    return get_task_by_id(new_id)


def update_task(task_id: int, fields: dict):
    # fields is a dict of only the columns the caller wants to change,
    # e.g. {"completed": 1} or {"title": "Buy milk", "due_date": "2026-06-10"}
    if not fields:
        return get_task_by_id(task_id)

    # Build "col = ?, col = ?" dynamically from the dict keys.
    set_clause = ", ".join(f"{key} = ?" for key in fields)
    values = list(fields.values()) + [task_id]

    with get_connection() as conn:
        conn.execute(
            f"UPDATE tasks SET {set_clause} WHERE id = ?", values
        )
    return get_task_by_id(task_id)


def delete_task(task_id: int):
    with get_connection() as conn:
        conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
