# 🚀 CodeCrew — Autonomous Multi-Agent Software House

[![CI/CD Pipeline](https://github.com/Haseebx162006/CodeCrew/actions/workflows/lint-format.yaml/badge.svg)](https://github.com/Haseebx162006/CodeCrew/actions/workflows/lint-format.yaml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12](https://img.shields.io/badge/Python-3.12+-3776AB.svg?logo=python&logoColor=white)](https://python.org)
[![React 18](https://img.shields.io/badge/React-18.3+-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![LangGraph](https://img.shields.io/badge/Orchestration-LangGraph-FF6F00.svg)](https://langchain-ai.github.io/langgraph/)

**CodeCrew** is an autonomous, multi-agent AI software house platform. It simulates an entire engineering team—Planner, Backend Developer, Frontend Engineer, Database Architect, QA/Testing Engineer, and Technical Writer—collaborating through a stateful graph to analyze repositories, plan architectural tasks, generate robust code, run tests, and open verified GitHub Pull Requests autonomously.

---

## 🌟 Key Features

- **🤖 Multi-Agent Collective**: Specialized agents collaborating through [LangGraph](https://github.com/langchain-ai/langgraph) state machines.
- **🔄 Stateful Graph Execution**: Resumable and fault-tolerant task execution backed by PostgreSQL / SQLite checkpointers.
- **🐙 GitHub Native Integration**: Authenticates via GitHub Apps / Personal Access Tokens, clones repositories, analyzes structure, generates feature branches, and opens ready-to-merge PRs.
- **🎨 Interactive Studio Workspace**: Modernist 2D visualizer frontend with real-time task progress, live workflow logs, code diff viewers, and agent status feeds.
- **⚡ High Performance CI/CD**: Automated linting, formatting, and type-checking with Ruff, Prettier, and TypeScript.
- **🔒 Secure Architecture**: JWT/Argon2 authentication, sandboxed repository cloning, and environment isolation.

---

## 👥 The Agent Team Roster

| Agent | Icon | Role & Responsibility |
| :--- | :---: | :--- |
| **Planner Agent** | 🧠 | Deconstructs user requirements into structured execution plans, dependency graphs, and agent tasks. |
| **Backend Agent** | ⚙️ | Implements API endpoints, data models, business logic, middleware, and backend services. |
| **Frontend Agent** | 🎨 | Builds user interfaces, component hierarchies, state management stores, and reactive design systems. |
| **Database Agent** | 🗄️ | Designs schemas, writes migration scripts, optimizes relational indexes, and writes SQL queries. |
| **Testing Agent** | 🧪 | Generates unit tests, integration tests, mock assertions, and runs validation suites. |
| **Docs Agent** | 📝 | Produces technical documentation, API specifications, system architecture diagrams, and release notes. |

---

## 🏗️ Architecture & Workflow

```mermaid
graph TD
    User([User Prompt / Task]) --> Router[API Router & Auth]
    Router --> Orchestrator[LangGraph Workflow Engine]
    
    subgraph Multi-Agent Core
        Orchestrator --> Planner[🧠 Planner Agent]
        Planner --> CodebaseAnalyzer[🔍 Repo & Codebase Analyzer]
        CodebaseAnalyzer --> Dispatcher{Agent Dispatcher}
        
        Dispatcher -->|Backend Tasks| Backend[⚙️ Backend Agent]
        Dispatcher -->|Frontend Tasks| Frontend[🎨 Frontend Agent]
        Dispatcher -->|Database Tasks| Database[🗄️ Database Agent]
        
        Backend --> Testing[🧪 Testing Agent]
        Frontend --> Testing
        Database --> Testing
        
        Testing --> Docs[📝 Docs Agent]
    end
    
    Docs --> Checkpointer[(State Checkpointer\nPostgres/SQLite)]
    Docs --> PRGenerator[🐙 GitHub PR Generator]
    PRGenerator --> GitHubPR[✅ Ready Pull Request]
```

---

## 📁 Repository Structure

```text
CodeCrew/
├── .github/
│   └── workflows/
│       ├── lint-format.yaml    # Automated CI linting, Prettier & Ruff formatting check
│       └── auto-format.yaml    # Automatic PR formatting and commit workflow
├── backend/                    # FastAPI + LangGraph Backend Service
│   ├── app/
│   │   ├── Agents/             # Agent implementations (Planner, Backend, Frontend, etc.)
│   │   ├── auth/               # JWT authentication & security dependencies
│   │   ├── codeBase/           # Repository cloning, structural analysis & detector
│   │   ├── db/                 # Database models, sessions, and LangGraph checkpointer
│   │   ├── github/             # GitHub App client, auth, and PR creation utilities
│   │   ├── LLM/                # Model provider wrappers (Groq, OpenAI, etc.)
│   │   ├── manager/            # LangGraph workflow graphs and router states
│   │   ├── Prompts/            # Agent system prompts and few-shot templates
│   │   ├── routes/             # REST API endpoints (auth, tasks, repos)
│   │   └── settings/           # Pydantic environment configuration
│   ├── Dockerfile
│   └── pyproject.toml          # Python dependencies & Ruff configuration
├── frontend/                   # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/         # Modernist UI components, agents showcase, workspace
│   │   ├── services/           # Backend API integration clients
│   │   ├── data/               # Mock repositories & visual assets
│   │   ├── App.tsx             # Main application router & view manager
│   │   └── main.tsx            # Entry point
│   ├── .prettierrc             # Prettier styling configuration
│   ├── package.json            # Node.js dependencies & scripts
│   ├── tailwind.config.js      # Tailwind CSS theme configuration
│   └── vite.config.ts          # Vite build pipeline
└── render.yaml                 # Render.com deployment blueprint
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Python**: `>= 3.12`
- **Node.js**: `>= 20.x` & `npm`
- **Git**: Installed and configured on your system

---

### 1. Clone the Repository

```bash
git clone https://github.com/Haseebx162006/CodeCrew.git
cd CodeCrew
```

---

### 2. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -e .

# Configure environment variables
cp .env.example .env  # Edit .env with your LLM keys and GitHub App credentials

# Start the FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend API will be live at `http://localhost:8000`.  
Swagger documentation is available at `http://localhost:8000/docs`.

---

### 3. Frontend Setup

```bash
cd ../frontend

# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## ⚙️ Environment Variables

Create a `.env` file in `backend/` with the following configuration:

```env
# Server Configuration
ENVIRONMENT=development
PORT=8000
DEBUG=True

# LLM Providers (Groq / OpenAI)
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Database / Checkpointer
DATABASE_URL=sqlite+aiosqlite:///./sql_app.db
# For PostgreSQL: postgresql+asyncpg://user:password@localhost:5432/codecrew

# Security & Auth
SECRET_KEY=your_super_secret_jwt_key
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# GitHub App Integration
GITHUB_APP_ID=your_github_app_id
GITHUB_APP_PRIVATE_KEY_PATH=./github-private-key.pem
```

---

## 🛠️ Development & Formatting Commands

Keep code formatting clean and error-free:

```bash
# Frontend formatting & linting
cd frontend
npm run format         # Auto-format TSX, CSS, JSON with Prettier
npm run format:check   # Validate formatting without making changes
npm run build          # Typecheck & build bundle

# Backend formatting & linting
cd backend
ruff format .          # Format Python files
ruff check --fix .     # Lint and fix import order / issues
```

---

## 🚢 Deployment

### Render.com Blueprint

This repository includes a [`render.yaml`](file:///run/media/haseeb-ahmad/Personal%20Data/software_house/software-house-agent/render.yaml) blueprint file.
1. Connect your repository to [Render.com](https://render.com).
2. Create a **New Blueprint Instance**.
3. Render will automatically provision:
   - **Backend Web Service**: FastAPI running on Python 3.12 with auto-restart & health checks.
   - **Frontend Static Site**: React Vite bundle with client-side SPA routing rewrites.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
