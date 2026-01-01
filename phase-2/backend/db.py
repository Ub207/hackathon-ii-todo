"""
Database connection and session management
"""
import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel import select

# Load environment variables from .env file
load_dotenv()


# Get database URL from environment
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://user:password@localhost:5432/tododb"
)

# Create engine
engine = create_engine(
    DATABASE_URL,
    echo=os.getenv("DEBUG", "false").lower() == "true",
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)


def init_db():
    """Initialize database tables"""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependency to get database session"""
    with Session(engine) as session:
        yield session


# ==================== Helper Functions ====================

def create_db_and_tables():
    """Create database and all tables"""
    init_db()
    print("Database tables created successfully")


def drop_db_and_tables():
    """Drop all tables (WARNING: DESTRUCTIVE)"""
    SQLModel.metadata.drop_all(engine)
    print("All tables dropped")


if __name__ == "__main__":
    create_db_and_tables()
