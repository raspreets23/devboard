from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# SQLite database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./devboard.db"

# connect_args={"check_same_thread": False} is required for SQLite in FastAPI
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency helper to yield database sessions per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
