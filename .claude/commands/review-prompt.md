---
name: review-prompt
description: Reviews a prompt before executing it — checks clarity, scope, architecture, and safety. Use before any non-trivial task.
---

# /review-prompt

The user's instruction to review is: **$ARGUMENTS**

Review this instruction before executing anything. Never skip this review.

## How to use
The user types: /review-prompt <their instruction>
You review it, give feedback, then ask whether to proceed.

---

## Step 1 — Run through this checklist

Check the instruction against every item below and note any failures:

**Clarity**
- [ ] Is it clear what file or layer should change? (backend, frontend, database)
- [ ] Is the expected result described? (what should happen after the change)
- [ ] Are there any undefined words like "fix it", "make it better", "improve"?

**Scope**
- [ ] Does it ask for ONE thing only, or multiple things bundled together?
- [ ] Is it small enough to test in one step?

**Architecture**
- [ ] Does it conflict with existing decisions? (raw SQL, no new dependencies, separation of concerns)
- [ ] Does it skip a layer? (e.g. frontend change before backend route exists)

**Safety**
- [ ] Does it involve destructive actions? (delete, drop, reset, force push)
- [ ] Does it change something that other parts depend on? (function signatures, API contracts)

---

## Step 2 — Score it

Give a score from 1 to 5:
- **5** — clear, specific, one thing, safe to proceed immediately
- **4** — mostly good, minor clarification needed
- **3** — vague or too broad, needs improvement before proceeding
- **2** — multiple things bundled, or missing important context
- **1** — too vague to act on safely, or potentially destructive

---

## Step 3 — Give feedback

Format your response like this:

---
**Prompt Review**

**Score:** X/5

**Issues found:**
- [list each problem clearly, or say "None" if clean]

**Suggested improved prompt:**
> [rewrite the instruction as a clear, specific, single-task prompt]

**Verdict:** [one of: ✅ Ready to proceed | ⚠️ Needs minor clarification | ❌ Please refine before proceeding]

---

Then ask: "Should I proceed with the improved prompt, use your original, or would you like to refine it further?"

---

## Examples of bad → good prompts

| Bad | Good |
|---|---|
| "Fix the bug" | "The DELETE /tasks/{id} route in backend/main.py returns 500 instead of 404 when the task doesn't exist. Fix the error handling." |
| "Make it look better" | "In frontend/src/App.css, increase the font size of .task-title to 1.1rem and add a hover background colour to .task-card" |
| "Add authentication" | "Add a users table to backend/database.py with columns: id, email, password_hash, created_at" |
| "Fix the CSS and the API and add filters" | Pick ONE: "Add the completed filter to GET /tasks in backend/main.py — accept an optional ?completed=0 query parameter" |
