# 🎨 CodeCrew — Frontend Client Documentation

The frontend client is a high-performance web interface built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Vite**. It provides real-time multi-agent visualization, workflow history tracking, code diff reviewing, and GitHub repository integration.

---

## 📁 Directory Structure

```text
src/
├── components/
│   ├── auth/           # Login, Sign Up, and Auth Modals
│   ├── landing/        # Landing page sections, hero, benchmarks, architecture
│   ├── layout/         # Navigation bars and footer
│   ├── superhero/      # Superhero Agent collective interactive showcase
│   ├── ui/             # Reusable UI primitives (Toasts, CodeDiffViewer, 3D/Isometric elements)
│   └── workspace/      # Studio Workspace, TaskPromptInput, ActiveExecutionView, PR Review
├── data/               # Mock data, repository presets, agent definitions
├── services/           # Axios/Fetch API clients for auth, tasks, and repos
├── App.tsx             # Main view state router
├── main.tsx            # React application entrypoint
└── index.css           # Global typography, Tailwind utilities & custom animations
```

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle with typechecking
npm run build

# 4. Format code with Prettier
npm run format
```
