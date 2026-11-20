from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, get_db
import models
import schemas

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DevBoard API",
    description="Backend API for DevBoard - A Project Management Kanban Board",
    version="1.0.0"
)

# CORS configuration - allow all origins for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Health"])
def read_root():
    """Health check endpoint."""
    return {"message": "DevBoard API is running", "docs": "/docs"}

@app.post("/tasks", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED, tags=["Tasks"])
def create_task(task_in: schemas.TaskCreate, db: Session = Depends(get_db)):
    """
    Create a new task with default status 'To Do'.
    """
    # Ensure default status if not provided or empty
    task_status = task_in.status if task_in.status else "To Do"
    
    db_task = models.Task(
        title=task_in.title.strip(),
        description=task_in.description.strip() if task_in.description else None,
        assignee=task_in.assignee.strip() if task_in.assignee else None,
        status=task_status
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/tasks", response_model=List[schemas.TaskResponse], tags=["Tasks"])
def get_tasks(db: Session = Depends(get_db)):
    """
    Retrieve all tasks from the database.
    """
    return db.query(models.Task).order_by(models.Task.id.desc()).all()

@app.patch("/tasks/{task_id}", response_model=schemas.TaskResponse, tags=["Tasks"])
def update_task_status(task_id: int, status_update: schemas.TaskStatusUpdate, db: Session = Depends(get_db)):
    """
    Update a task's status (e.g., 'To Do' -> 'In Progress' -> 'Done').
    """
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found"
        )
    
    db_task.status = status_update.status
    db.commit()
    db.refresh(db_task)
    return db_task
