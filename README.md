# DevBoard — Full-Stack Kanban Project Management

DevBoard is a full-stack project management MVP designed for internal teams to track tasks, manage workflows, and collaborate efficiently. 

This project demonstrates a complete end-to-end architecture connecting a React frontend, a Python (FastAPI) REST API, and a relational database.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS
- Backend: Python (FastAPI)
- Database: SQLite (via SQLAlchemy ORM)
- API Communication: REST (CORS enabled)

## Core Features
- Task Creation: Create tasks with a title, assignee, and description.
- Workflow Management: Move tasks seamlessly through a 3-stage lifecycle (To Do -> In Progress -> Done).
- Real-time UI: Dynamic updates reflecting the current state of the database.
- Data Integrity: Strict database schema with status constraints to prevent invalid states.

## How to Run Locally

### 1. Start the Backend (FastAPI)
Open a terminal and run these commands:
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

The API will run on http://127.0.0.1:8000. You can view the auto-generated Swagger documentation at http://127.0.0.1:8000/docs.

### 2. Start the Frontend (React + Vite)
Open a second terminal and run these commands:
cd frontend
npm install
npm run dev

The UI will run on http://localhost:5173.

## Database Schema
The application uses a relational SQLite database managed by SQLAlchemy. 

Task Model (tasks table):
- id (Integer, Primary Key)
- title (String, Required)
- description (String, Optional)
- assignee (String, Optional)
- status (String, Default: "To Do", Allowed: "To Do", "In Progress", "Done")

## Project Structure
- /backend - Contains the FastAPI server, SQLAlchemy models, and Pydantic schemas.
- /frontend - Contains the React application and Tailwind styling.
