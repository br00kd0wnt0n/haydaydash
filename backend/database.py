import os
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hayday.db")

print(f"DATABASE_URL configured: {'postgresql' if 'postgresql' in DATABASE_URL or 'postgres' in DATABASE_URL else 'sqlite'}")

# Handle Railway's postgres:// URL format
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables"""
    from models.db_models import UserPreset, AuditLog
    print(f"Creating tables: {[UserPreset.__tablename__, AuditLog.__tablename__]}")
    Base.metadata.create_all(bind=engine)

    # Verify tables exist
    with engine.connect() as conn:
        result = conn.execute(text("SELECT tablename FROM pg_tables WHERE schemaname = 'public'"))
        tables = [row[0] for row in result]
        print(f"Tables in database: {tables}")
