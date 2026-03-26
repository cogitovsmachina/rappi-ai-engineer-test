from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# For the test, we use SQLite for ease of setup. This can be easily replaced by PostgreSQL string.
SQLALCHEMY_DATABASE_URL = "sqlite:///./forecast.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False} # needed only for SQLite
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
