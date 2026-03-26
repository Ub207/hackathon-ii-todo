<p align="center">
  <img src="https://img.shields.io/badge/Hackathon-II-FF6B35?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Architecture-Agent_Based-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Python-3.9+-yellow?style=for-the-badge&logo=python&logoColor=white" />
</p>

<h1 align="center">Hackathon II - Spec-Driven Todo App</h1>
<p align="center"><strong>AI reads specifications, decomposes tasks, and self-validates output using agent architecture.</strong></p>

---

## Concept

Instead of manually coding features, this app uses an **AI agent pipeline**:

1. **Spec Reader** — AI parses requirement specifications
2. **Task Decomposer** — Breaks specs into actionable development tasks
3. **Code Generator** — Generates implementation code
4. **Self-Validator** — Validates output against original specs

---

## Features

- **Spec-Driven Development** — Write specs, AI builds the app
- **Agent Architecture** — Multi-step AI pipeline with handoffs
- **Self-Validation** — Output automatically checked against requirements
- **Todo App** — Fully functional task management application

---

## Architecture

```
Specs (Markdown)
    │
    ▼
Spec Reader Agent ──► Task Decomposer Agent
    │                          │
    ▼                          ▼
Code Generator Agent ──► Validator Agent
    │
    ▼
Working Todo Application
```

---

## Quick Start

```bash
git clone https://github.com/Ub207/hackathon-ii-todo.git
cd hackathon-ii-todo
pip install -r requirements.txt
python app.py
```

---

<p align="center">
  <strong>Built by <a href="https://github.com/Ub207">Ubaid ur Rahman</a></strong> at Hackathon II<br/>
  <a href="mailto:usmanubaidurrehman@gmail.com">Hire Me</a>
</p>
