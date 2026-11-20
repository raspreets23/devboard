from typing import Optional
from pydantic import BaseModel, ConfigDict

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    assignee: Optional[str] = None

class TaskCreate(TaskBase):
    status: Optional[str] = "To Do"

class TaskStatusUpdate(BaseModel):
    status: str

class TaskResponse(TaskBase):
    id: int
    status: str

    model_config = ConfigDict(from_attributes=True)
