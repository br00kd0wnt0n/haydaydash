from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.db_models import UserPreset
from models.schemas import PresetCreate, PresetResponse

router = APIRouter(prefix="/api/presets", tags=["Presets"])


@router.get("", response_model=List[PresetResponse])
async def list_presets(db: Session = Depends(get_db)):
    """List all saved presets."""
    presets = db.query(UserPreset).order_by(UserPreset.created_at.desc()).all()
    return presets


@router.post("", response_model=PresetResponse)
async def create_preset(preset: PresetCreate, db: Session = Depends(get_db)):
    """Create a new preset."""
    db_preset = UserPreset(
        name=preset.name,
        description=preset.description,
        config=preset.config.model_dump()
    )
    db.add(db_preset)
    db.commit()
    db.refresh(db_preset)
    return db_preset


@router.get("/{preset_id}", response_model=PresetResponse)
async def get_preset(preset_id: int, db: Session = Depends(get_db)):
    """Get a specific preset by ID."""
    preset = db.query(UserPreset).filter(UserPreset.id == preset_id).first()
    if not preset:
        raise HTTPException(status_code=404, detail="Preset not found")
    return preset


@router.delete("/{preset_id}")
async def delete_preset(preset_id: int, db: Session = Depends(get_db)):
    """Delete a preset."""
    preset = db.query(UserPreset).filter(UserPreset.id == preset_id).first()
    if not preset:
        raise HTTPException(status_code=404, detail="Preset not found")
    db.delete(preset)
    db.commit()
    return {"status": "deleted"}
