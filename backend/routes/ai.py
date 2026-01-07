from fastapi import APIRouter
from models.schemas import DashboardState, AIAssessment
from services.ai_service import generate_ai_assessment

router = APIRouter(prefix="/api/ai", tags=["AI"])


@router.post("/assessment", response_model=AIAssessment)
async def get_ai_assessment(state: DashboardState):
    """Get AI-powered strategic assessment for the current configuration."""
    return generate_ai_assessment(state)
