"""
Reset the database to a clean state.

Deletes ALL tasks and ALL projects, then re-seeds the five default projects
(General, Home, Work, Personal, Study). This is destructive — every task and
custom project you have created is permanently removed.

Run from the backend/ folder:
    python reset_db.py
"""

import database


def reset_db():
    """Wipe all tasks and projects, then re-seed the default projects."""
    # Make sure the tables exist before we touch them (safe on a fresh DB).
    database.create_projects_table()
    database.create_table()

    with database.get_connection() as conn:
        # Delete tasks first — they reference projects(id).
        conn.execute("DELETE FROM tasks")
        conn.execute("DELETE FROM projects")
        # Clear the AUTOINCREMENT counters so ids start from 1 again.
        conn.execute(
            "DELETE FROM sqlite_sequence WHERE name IN ('tasks', 'projects')"
        )

    # Re-create the 5 default projects (INSERT OR IGNORE seeds them).
    database.create_projects_table()


def count_rows():
    """Return how many tasks and projects currently exist."""
    database.create_projects_table()
    database.create_table()
    with database.get_connection() as conn:
        tasks = conn.execute("SELECT COUNT(*) FROM tasks").fetchone()[0]
        projects = conn.execute("SELECT COUNT(*) FROM projects").fetchone()[0]
    return tasks, projects


if __name__ == "__main__":
    # Show what will be lost, then require an explicit "yes" to proceed.
    task_count, project_count = count_rows()
    print(
        f"This will permanently delete {task_count} task(s) and "
        f"{project_count} project(s),\n"
        "then re-seed the 5 default projects (General, Home, Work, "
        "Personal, Study)."
    )
    answer = input("Type 'yes' to continue: ").strip().lower()

    if answer == "yes":
        reset_db()
        print("Done. Database reset: 5 default projects, no tasks.")
    else:
        print("Cancelled. Nothing was changed.")
