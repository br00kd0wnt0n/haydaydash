import os
import json
from typing import Optional
from openai import OpenAI
from models.schemas import DashboardState, AIAssessment

# Strategy names for context
STRATEGY_NAMES = {
    "welcome_back": "Welcome Back to the Farm (Lapsed Reactivation Focus)",
    "balanced": "Balanced Harvest (Mixed Approach)",
    "new_neighbors": "New Neighbors (New Player Acquisition Focus)",
}

SYSTEM_PROMPT = """You are a strategic marketing advisor specializing in mobile gaming campaigns,
specifically for Supercell's Hay Day game. Hay Day is a 13-year-old evergreen farming game known for:
- Warmth, simplicity, and community - a "cozy game"
- Target demographic: 35-54 year old women, suburban, middle-income
- Core markets: US and Germany
- 341M lifetime downloads

Your role is to analyze campaign configurations and provide actionable strategic recommendations.
Focus on maximizing player value (ROI) while respecting the game's community-first brand tone.

When analyzing configurations, consider:
1. The balance between reactivation and new player acquisition
2. Channel mix efficiency (eCRM is very efficient for reactivation)
3. Budget allocation relative to campaign goals
4. Retention expectations based on player type
5. The June birthday campaign timing and its spike potential

Provide concise, specific recommendations that the team can act on."""


def format_budget(value: float) -> str:
    if value >= 1_000_000:
        return f"€{value / 1_000_000:.1f}M"
    return f"€{value / 1_000:.0f}K"


def generate_ai_assessment(state: DashboardState) -> AIAssessment:
    """Generate AI-powered strategic assessment of the current configuration."""

    client = None
    api_key = os.getenv("OPENAI_API_KEY")

    if api_key:
        try:
            client = OpenAI(api_key=api_key)
        except Exception:
            client = None

    # Build context message
    strategy_name = STRATEGY_NAMES.get(state.strategy, state.strategy)
    timing_desc = "June 2026 Birthday Campaign (tentpole)" if state.timing == "june_birthday" else "Steady State Month"

    user_message = f"""Analyze this Hay Day campaign configuration:

**Strategy:** {strategy_name}
**Budget:** {format_budget(state.budget)}
**Campaign Timing:** {timing_desc}

**Channel Allocation:**
- Paid Social: {state.channels.paidSocial}%
- Influencer/Creator: {state.channels.influencer}%
- eCRM/Push: {state.channels.eCRM}%
- Organic Social: {state.channels.organic}%
- PR: {state.channels.pr}%
- Supercell Store: {state.channels.store}%
- GiveBack Integration: {state.channels.giveBack}%

**Regional Split:**
- United States: {state.regions.us}%
- Germany: {state.regions.germany}%
- Rest of World: {state.regions.row}%

**Key Assumptions:**
- D30 Retention (New): {state.benchmarks.d30RetentionNew * 100:.0f}%
- D30 Retention (Reactivated): {state.benchmarks.d30RetentionReactivated * 100:.0f}%
- Paid Social CPI: €{state.benchmarks.paidSocialCPI:.2f}
- eCRM Reactivation Rate: {state.benchmarks.eCRMReactivationRate * 100:.1f}%

Provide:
1. A brief overall assessment (2-3 sentences)
2. 2-3 specific, actionable recommendations
3. Any suggested channel allocation adjustments (if applicable)

Format your response as JSON with keys: summary, recommendations (array), suggestedChanges (object, optional)"""

    if client:
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.7,
                max_tokens=800,
                response_format={"type": "json_object"}
            )

            result = json.loads(response.choices[0].message.content)
            return AIAssessment(
                summary=result.get("summary", ""),
                recommendations=result.get("recommendations", []),
                suggestedChanges=result.get("suggestedChanges")
            )
        except Exception as e:
            print(f"OpenAI API error: {e}")

    # Fallback assessment when API is unavailable
    return generate_fallback_assessment(state)


def generate_fallback_assessment(state: DashboardState) -> AIAssessment:
    """Generate a rule-based fallback assessment when AI is unavailable."""

    recommendations = []
    suggested_changes = {}

    # Strategy-specific recommendations
    if state.strategy == "welcome_back" and state.channels.eCRM < 25:
        recommendations.append(
            f"Your current eCRM allocation of {state.channels.eCRM}% could be increased to 25-30%. "
            "Lapsed Hay Day players convert at approximately 3x the rate of cold acquisition, "
            "and your dormant player pool (estimated 50M+ from lifetime downloads) represents significant untapped value."
        )
        suggested_changes["channels"] = {**state.channels.model_dump(), "eCRM": 25, "paidSocial": state.channels.paidSocial - 5}

    if state.strategy == "new_neighbors" and state.channels.paidSocial < 40:
        recommendations.append(
            f"For a new player acquisition focus, consider increasing paid social allocation to 40-45%. "
            "This maximizes reach to players who haven't discovered Hay Day yet."
        )

    if state.budget < 1_000_000 and state.timing == "june_birthday":
        recommendations.append(
            f"Your {format_budget(state.budget)} budget may limit campaign spike impact for a birthday tentpole. "
            "Consider whether a larger investment would generate proportionally higher returns."
        )

    if state.channels.giveBack > 10:
        recommendations.append(
            f"GiveBack integration at {state.channels.giveBack}% is higher than typical. "
            "While community-positive, ensure charitable partnerships align with Hay Day's cozy brand tone."
        )

    # Regional recommendations
    if state.regions.row > 30:
        recommendations.append(
            f"Consider focusing more budget on US and Germany (primary markets) rather than Rest of World ({state.regions.row}%). "
            "These core markets have the highest LTV and brand recognition."
        )

    if not recommendations:
        recommendations.append(
            f"Your current configuration is well-balanced for a {state.strategy.replace('_', ' ')} approach. "
            "Consider A/B testing channel allocations to optimize further."
        )

    # Generate summary
    estimated_roi = 3.2 if state.strategy == "welcome_back" else (3.1 if state.strategy == "balanced" else 2.8)
    summary_parts = [
        f"Based on your {format_budget(state.budget)} budget",
        f"with {state.strategy.replace('_', ' ')} focus",
    ]
    if state.timing == "june_birthday":
        summary_parts.append("targeting the June 2026 birthday campaign")

    summary = f"{', '.join(summary_parts)}, this configuration projects a {estimated_roi}x ROI. {recommendations[0][:150]}..."

    return AIAssessment(
        summary=summary,
        recommendations=recommendations[:3],
        suggestedChanges=suggested_changes if suggested_changes else None
    )
