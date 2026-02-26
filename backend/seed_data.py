"""
Seed data script for testing non-technical role predictions.
Creates realistic examples for both technical and non-technical roles.
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.contrib.auth import get_user_model
from apps.predictions.models import Prediction
from apps.predictions.constants import ALL_ROLES

User = get_user_model()

def create_seed_data():
    """Create seed data with both technical and non-technical examples."""
    
    # Get or create a test user
    user, created = User.objects.get_or_create(
        username='demo_user',
        defaults={
            'email': 'demo@example.com',
            'is_active': True,
        }
    )
    
    if created:
        user.set_password('demo123')
        user.save()
        print(f"Created demo user: {user.username}")
    
    # Clear existing predictions for this user
    Prediction.objects.filter(user=user).delete()
    
    # Seed data with realistic examples
    seed_data = [
        # Technical examples
        {
            'input_skills': {'skills': ['python', 'django', 'react', 'postgresql', 'docker']},
            'predicted_role': 'Web Developer',
            'confidence': 0.85,
            'resume_text': 'Experienced full-stack developer with 5+ years in Python/Django and React applications.'
        },
        {
            'input_skills': {'skills': ['machine learning', 'pytorch', 'tensorflow', 'nlp', 'data science']},
            'predicted_role': 'ML Engineer',
            'confidence': 0.90,
            'resume_text': 'ML Engineer specializing in NLP and computer vision with extensive PyTorch experience.'
        },
        {
            'input_skills': {'skills': ['data analysis', 'pandas', 'numpy', 'statistics', 'visualization']},
            'predicted_role': 'Data Scientist',
            'confidence': 0.82,
            'resume_text': 'Data Scientist with strong background in statistical analysis and machine learning.'
        },
        {
            'input_skills': {'skills': ['kubernetes', 'aws', 'ci/cd', 'devops', 'monitoring']},
            'predicted_role': 'DevOps Engineer',
            'confidence': 0.78,
            'resume_text': 'DevOps Engineer with expertise in cloud infrastructure and automation.'
        },
        
        # Non-technical examples
        {
            'input_skills': {'skills': ['product management', 'agile', 'scrum', 'roadmap', 'user stories']},
            'predicted_role': 'Product Manager',
            'confidence': 0.75,
            'resume_text': 'Product Manager with 7+ years of experience in software product development and agile methodologies.'
        },
        {
            'input_skills': {'skills': ['business analysis', 'requirements', 'process optimization', 'stakeholder management']},
            'predicted_role': 'Business Analyst',
            'confidence': 0.72,
            'resume_text': 'Business Analyst focused on process improvement and requirements gathering.'
        },
        {
            'input_skills': {'skills': ['project management', 'timeline', 'budget', 'resources', 'coordination']},
            'predicted_role': 'Project Manager',
            'confidence': 0.70,
            'resume_text': 'PMP certified Project Manager with experience in software development projects.'
        },
        {
            'input_skills': {'skills': ['marketing', 'campaign management', 'seo', 'social media', 'analytics']},
            'predicted_role': 'Marketing Analyst',
            'confidence': 0.68,
            'resume_text': 'Marketing Analyst with expertise in digital marketing and campaign optimization.'
        },
        {
            'input_skills': {'skills': ['hr management', 'recruitment', 'employee relations', 'performance management']},
            'predicted_role': 'HR Manager',
            'confidence': 0.65,
            'resume_text': 'HR Manager with experience in talent acquisition and organizational development.'
        },
        {
            'input_skills': {'skills': ['operations', 'logistics', 'supply chain', 'efficiency']},
            'predicted_role': 'Operations Manager',
            'confidence': 0.70,
            'resume_text': 'Operations Manager specializing in process optimization and supply chain management.'
        },
        {
            'input_skills': {'skills': ['sales', 'revenue', 'client management', 'negotiation', 'crm']},
            'predicted_role': 'Sales Executive',
            'confidence': 0.73,
            'resume_text': 'Sales Executive with proven track record in B2B software sales.'
        },
        {
            'input_skills': {'skills': ['ui design', 'ux design', 'figma', 'prototype', 'user research']},
            'predicted_role': 'UI/UX Designer',
            'confidence': 0.77,
            'resume_text': 'UI/UX Designer with expertise in user-centered design and prototyping.'
        },
        {
            'input_skills': {'skills': ['content strategy', 'writing', 'editorial', 'social media']},
            'predicted_role': 'Content Strategist',
            'confidence': 0.64,
            'resume_text': 'Content Strategist with experience in digital content creation and strategy.'
        },
        {
            'input_skills': {'skills': ['customer success', 'retention', 'support', 'satisfaction']},
            'predicted_role': 'Customer Success Manager',
            'confidence': 0.71,
            'resume_text': 'Customer Success Manager focused on client retention and satisfaction.'
        },
    ]
    
    # Create predictions
    predictions = []
    for i, data in enumerate(seed_data):
        prediction = Prediction.objects.create(
            user=user,
            input_skills=data['input_skills'],
            predicted_role=data['predicted_role'],
            confidence=data['confidence'],
            resume_text=data['resume_text']
        )
        predictions.append(prediction)
        print(f"Created prediction {i+1}: {data['predicted_role']} (confidence: {data['confidence']})")
    
    print(f"\n✅ Successfully created {len(predictions)} seed predictions!")
    print(f"Technical roles: {len([p for p in predictions if p.predicted_role in ['Web Developer', 'ML Engineer', 'Data Scientist', 'DevOps Engineer']])}")
    print(f"Non-technical roles: {len([p for p in predictions if p.predicted_role not in ['Web Developer', 'ML Engineer', 'Data Scientist', 'DevOps Engineer']])}")
    
    return predictions

if __name__ == '__main__':
    print("🌱 Creating seed data for Career Prediction AI...")
    create_seed_data()
    print("🎉 Seed data creation completed!")
