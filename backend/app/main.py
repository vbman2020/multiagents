from fastapi import FastAPI
from app.database import engine, Base
from app.auth.router import router as auth_router
from app.articles.router import router as articles_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Multi-Agent Authentication API",
    description="FastAPI application with authentication and article management",
    version="1.0.0"
)

# Include routers
app.include_router(auth_router)
app.include_router(articles_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to the Multi-Agent Authentication API",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
