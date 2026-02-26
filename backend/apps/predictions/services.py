from __future__ import annotations

from dataclasses import dataclass
from .constants import (
    ALL_ROLES, 
    TECHNICAL_ROLES, 
    NON_TECHNICAL_ROLES,
    normalize_legacy_role
)


@dataclass
class PredictionResult:
    role: str
    confidence: float | None = None


def predict_role_from_text(text: str) -> PredictionResult:
    """
    Enhanced prediction logic supporting both technical and non-technical roles.
    Uses keyword-based heuristics with fallback to ensure no crashes.
    """
    normalized = (text or "").lower()
    
    # Technical role predictions
    if any(k in normalized for k in ["react", "javascript", "frontend", "css", "tailwind", "html", "vue", "angular"]):
        return PredictionResult(role="Frontend Developer", confidence=0.75)
    
    if any(k in normalized for k in ["django", "rest framework", "python", "api", "backend", "flask", "fastapi"]):
        return PredictionResult(role="Backend Developer", confidence=0.75)
    
    if any(k in normalized for k in ["web", "website", "fullstack", "full stack", "full-stack"]):
        return PredictionResult(role="Web Developer", confidence=0.75)
    
    if any(k in normalized for k in ["ml", "machine learning", "sklearn", "pytorch", "tensorflow", "keras", "nlp"]):
        return PredictionResult(role="ML Engineer", confidence=0.80)
    
    if any(k in normalized for k in ["data science", "statistics", "pandas", "numpy", "jupyter", "analytics", "visualization"]):
        return PredictionResult(role="Data Scientist", confidence=0.75)
    
    if any(k in normalized for k in ["docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "jenkins", "devops"]):
        return PredictionResult(role="DevOps Engineer", confidence=0.70)
    
    # Non-technical role predictions
    if any(k in normalized for k in ["product", "roadmap", "strategy", "user stories", "agile", "scrum", "backlog"]):
        return PredictionResult(role="Product Manager", confidence=0.70)
    
    if any(k in normalized for k in ["business", "requirements", "process", "workflow", "optimization", "stakeholder"]):
        return PredictionResult(role="Business Analyst", confidence=0.65)
    
    if any(k in normalized for k in ["project", "timeline", "budget", "resources", "management", "coordination"]):
        return PredictionResult(role="Project Manager", confidence=0.65)
    
    if any(k in normalized for k in ["marketing", "campaign", "seo", "social media", "content", "brand", "analytics"]):
        return PredictionResult(role="Marketing Analyst", confidence=0.60)
    
    if any(k in normalized for k in ["hr", "recruitment", "hiring", "employee", "training", "performance", "culture"]):
        return PredictionResult(role="HR Manager", confidence=0.60)
    
    if any(k in normalized for k in ["operations", "logistics", "supply chain", "efficiency", "process improvement"]):
        return PredictionResult(role="Operations Manager", confidence=0.60)
    
    if any(k in normalized for k in ["sales", "revenue", "clients", "deals", "negotiation", "crm", "prospecting"]):
        return PredictionResult(role="Sales Executive", confidence=0.65)
    
    if any(k in normalized for k in ["ui", "ux", "design", "figma", "prototype", "wireframe", "user experience"]):
        return PredictionResult(role="UI/UX Designer", confidence=0.70)
    
    if any(k in normalized for k in ["content", "writing", "blog", "social", "editorial", "copywriting"]):
        return PredictionResult(role="Content Strategist", confidence=0.60)
    
    if any(k in normalized for k in ["customer", "support", "success", "retention", "satisfaction", "service"]):
        return PredictionResult(role="Customer Success Manager", confidence=0.65)
    
    # Fallback prediction - choose based on dominant indicators
    if any(k in normalized for k in ["technical", "programming", "code", "software", "development"]):
        return PredictionResult(role="Web Developer", confidence=0.50)
    
    if any(k in normalized for k in ["management", "leadership", "strategy", "planning"]):
        return PredictionResult(role="Project Manager", confidence=0.50)
    
    # Default fallback
    return PredictionResult(role="Business Analyst", confidence=0.40)


def validate_and_normalize_role(role: str) -> str:
    """
    Validate and normalize role predictions.
    Ensures the role exists in our predefined list.
    """
    if not role:
        return "Business Analyst"  # Safe default
    
    # Normalize legacy role names
    normalized = normalize_legacy_role(role)
    
    # Validate against allowed roles
    if normalized in ALL_ROLES:
        return normalized
    
    # If still not found, return a safe default
    return "Business Analyst"
