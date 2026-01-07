from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime


# Channel allocation
class ChannelAllocation(BaseModel):
    paidSocial: float
    influencer: float
    eCRM: float
    organic: float
    pr: float
    store: float
    giveBack: float


# Regional split
class RegionalSplit(BaseModel):
    us: float
    germany: float
    row: float


# Industry benchmarks
class IndustryBenchmarks(BaseModel):
    d30RetentionNew: float
    d30RetentionReactivated: float
    d60RetentionDecay: float
    d90RetentionDecay: float
    eCRMReactivationRate: float
    pushNotificationCTR: float
    paidSocialCPI: float
    organicMultiplier: float


# Ralph assumptions
class RalphAssumptions(BaseModel):
    campaignSpikeMultiplier: float
    retentionQualityBonus: float
    socialAmplificationFactor: float


# Dashboard state
class DashboardState(BaseModel):
    strategy: str
    budget: float
    channels: ChannelAllocation
    regions: RegionalSplit
    timing: str
    benchmarks: IndustryBenchmarks
    ralphAssumptions: RalphAssumptions


# AI Assessment
class AIAssessment(BaseModel):
    summary: str
    recommendations: List[str]
    suggestedChanges: Optional[Dict[str, Any]] = None


# Preset schemas
class PresetCreate(BaseModel):
    name: str
    description: Optional[str] = None
    config: DashboardState


class PresetResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    config: Dict[str, Any]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
