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

def ensure_default_user():
    """Ensure a default user exists for the demo"""
    from models import User

    with Session(engine) as session:
        # Check if user exists
        existing_user = session.exec(
            select(User).where(User.email == "demo@example.com")
        ).first()

        if not existing_user:
            # Create default user
            user = User(
                email="demo@example.com",
                username="demo_user",
                full_name="Demo User"
            )
            session.add(user)
            session.commit()
            print("Default user created: demo@example.com (ID=1)")
        else:
            print(f"Default user already exists: {existing_user.email} (ID={existing_user.id})")


def create_db_and_tables():
    """Create database and all tables"""
    init_db()
    ensure_default_user()
    print("Database tables created successfully")


def drop_db_and_tables():
    """Drop all tables (WARNING: DESTRUCTIVE)"""
    SQLModel.metadata.drop_all(engine)
    print("All tables dropped")


if __name__ == "__main__":
    create_db_and_tables()
