"""
Centralized role definitions for the ML prediction system.
Contains all supported technical and non-technical professional roles.
"""

from typing import List, Dict, Tuple

# All supported roles in the prediction system
ALL_ROLES = [
    # Technical Roles
    "Data Scientist",
    "Frontend Developer",
    "Backend Developer", 
    "Web Developer",
    "Software Engineer",
    "UI/UX Designer",
    "ML Engineer",
    "DevOps Engineer",
    
    # Non-Technical Roles
    "Product Manager",
    "Business Analyst", 
    "Project Manager",
    "Marketing Analyst",
    "HR Manager",
    "Operations Manager",
    "Sales Executive",
    "Content Strategist",
    "Customer Success Manager",
]

# Role categories for grouping
TECHNICAL_ROLES = [
    "Data Scientist",
    "Frontend Developer",
    "Backend Developer", 
    "Web Developer",
    "Software Engineer",
    "UI/UX Designer",
    "ML Engineer",
    "DevOps Engineer",
]

NON_TECHNICAL_ROLES = [
    "Product Manager",
    "Business Analyst", 
    "Project Manager",
    "Marketing Analyst",
    "HR Manager",
    "Operations Manager",
    "Sales Executive",
    "Content Strategist",
    "Customer Success Manager",
]

# Role descriptions for UI tooltips and professional presentation
ROLE_DESCRIPTIONS = {
    "Data Scientist": "Analyzes complex data to help organizations make better decisions using statistical methods and machine learning.",
    "Frontend Developer": "Builds user interfaces and client-side applications using modern web technologies.",
    "Backend Developer": "Develops server-side applications, APIs, and database systems.",
    "Web Developer": "Builds and maintains websites and web applications using various programming languages and frameworks.",
    "Software Engineer": "Designs, develops, and maintains software systems and applications.",
    "ML Engineer": "Designs, builds, and deploys machine learning models and systems at scale.",
    "DevOps Engineer": "Bridges development and operations to automate and streamline the software delivery process.",
    
    "Product Manager": "Defines product vision, strategy, and roadmap to deliver value to customers and business.",
    "Business Analyst": "Analyzes business processes and requirements to help organizations improve efficiency and effectiveness.",
    "Project Manager": "Plans, executes, and closes projects while managing teams, resources, and stakeholders.",
    "Marketing Analyst": "Analyzes market data and campaign performance to optimize marketing strategies and ROI.",
    "HR Manager": "Manages human resources functions including recruitment, employee relations, and organizational development.",
    "Operations Manager": "Oversees daily business operations to ensure efficiency, quality, and continuous improvement.",
    "Sales Executive": "Drives revenue growth by identifying prospects, building relationships, and closing sales deals.",
    "UI/UX Designer": "Creates intuitive and visually appealing user interfaces and experiences for digital products.",
    "Content Strategist": "Plans, creates, and manages content to engage audiences and achieve business goals.",
    "Customer Success Manager": "Ensures customer satisfaction and retention by providing ongoing support and value.",
}

# Role categories with metadata
ROLE_CATEGORIES = {
    "technical": {
        "label": "Technical Roles",
        "description": "Technology-focused positions requiring programming and technical expertise",
        "roles": TECHNICAL_ROLES,
        "color": "#3B82F6",  # Blue
        "icon": "💻"
    },
    "non_technical": {
        "label": "Non-Technical Roles", 
        "description": "Business and creative positions focusing on strategy, management, and communication",
        "roles": NON_TECHNICAL_ROLES,
        "color": "#10B981",  # Green
        "icon": "📊"
    }
}

# Role choices for Django model forms (tuple of tuples)
ROLE_CHOICES = [(role, role) for role in ALL_ROLES]

# Helper functions
def get_role_category(role: str) -> str:
    """Return the category of a given role."""
    return "technical" if role in TECHNICAL_ROLES else "non_technical"

def get_role_description(role: str) -> str:
    """Return the description of a given role."""
    return ROLE_DESCRIPTIONS.get(role, "Professional role in the organization.")

def is_valid_role(role: str) -> bool:
    """Check if a role is valid."""
    return role in ALL_ROLES

def get_roles_by_category(category: str) -> List[str]:
    """Get all roles in a specific category."""
    if category == "technical":
        return TECHNICAL_ROLES
    elif category == "non_technical":
        return NON_TECHNICAL_ROLES
    return ALL_ROLES

# Fallback mapping for legacy role names
LEGACY_ROLE_MAPPING = {
    "Frontend Developer": "Web Developer",
    "Backend Developer": "Web Developer", 
    "Software Engineer": "Web Developer",
    "Data Analyst": "Business Analyst",
}

def normalize_legacy_role(role: str) -> str:
    """Convert legacy role names to current standardized names."""
    return LEGACY_ROLE_MAPPING.get(role, role)
