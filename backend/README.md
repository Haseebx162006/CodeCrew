# ⚙️ CodeCrew — Backend Architecture & Service Documentation

The backend service powers the **CodeCrew** multi-agent software engineering platform. It is built using **FastAPI**, **LangGraph**, and **SQLAlchemy/AsyncPG** to orchestrate asynchronous, stateful AI workflows.

---

## 🏛️ Architecture Overview

```text
app/
├── Agents/             # Specialized AI agents implementing stateful node logic
│   ├── backend_agent.py   # Code generation for server, routes, models
│   ├── frontend_agent.py  # Code generation for UI, components, styles
│   ├── database_agent.py  # SQL schema design & migrations
│   ├── testing_agent.py   # Unit & integration test generation
│   └── docs_agent.py      # Markdown & docstring documentation
├── auth/               # User authentication, password hashing (Argon2), JWT
├── codeBase/           # Git clone orchestration, repo analysis & language detector
├── db/                 # Database schema models, async session, checkpointer
├── github/             # GitHub App authentication & Pull Request generator
├── LLM/                # Model abstraction layer (Groq / OpenAI / LangChain)
├── manager/            # LangGraph workflow graphs, state definitions, routers
├── Prompts/            # System instructions and prompt templates for all agents
├── routes/             # FastAPI REST endpoints (/auth, /tasks, /repos)
└── settings/           # Pydantic BaseSettings for application configuration
```

---

## 🔁 LangGraph Workflow Engine

The multi-agent execution cycle is defined in `app/manager/workflow.py`:

1. **State Initialization (`AgentState`)**: Holds user prompt, target repository, detected tech stack, generated code files, test logs, and task status.
2. **Planner Node**: Breaks requirements into atomic steps.
3. **Agent Routing**: Dynamically directs execution to Backend, Frontend, or Database agents.
4. **Testing Node**: Reviews and verifies generated code artifacts.
5. **Docs Node**: Summarizes changes and prepares commit descriptions.
6. **PR Creation Node**: Pushes a new branch to GitHub and opens a Pull Request.
7. **Checkpointer**: Saves state transitions into SQLite/PostgreSQL so workflows can be paused, resumed, or inspected.

---

## 🚀 Running Locally

```bash
# 1. Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate

# 2. Install dependencies
pip install -e .

# 3. Start development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 🧪 Linting and Quality Checks

```bash
# Run Ruff formatter
ruff format .

# Run Ruff linter with autofix
ruff check --fix .
```
