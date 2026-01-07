import os
import sys
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager

# Add current directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv is optional


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    try:
        from database import init_db
        init_db()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Database initialization skipped: {e}")
    yield


app = FastAPI(
    title="Hay Day Dashboard API",
    description="Player Value & Growth Dashboard for Hay Day",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

# Add Railway domains
railway_domain = os.getenv("RAILWAY_STATIC_URL")
if railway_domain:
    origins.append(railway_domain)
    origins.append(railway_domain.replace("https://", "http://"))

# Add frontend URL if set (for split services)
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.railway\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
from routes import ai, presets
app.include_router(ai.router)
app.include_router(presets.router)


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "hayday-dashboard"}


# Serve static files in production
static_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        """Serve the SPA for all non-API routes."""
        if full_path.startswith("api/"):
            return {"error": "Not found"}

        file_path = os.path.join(static_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(static_dir, "index.html"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
