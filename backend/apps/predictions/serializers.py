from rest_framework import serializers
from .models import Prediction
from .constants import ALL_ROLES, is_valid_role


class SkillPredictionRequestSerializer(serializers.Serializer):
    """
    Accepts:
    {
        "skills": ["python", "react", "django"]
    }
    """
    skills = serializers.ListField(
        child=serializers.CharField(),
        required=True,
        allow_empty=False
    )


class ResumeUploadSerializer(serializers.Serializer):
    resume = serializers.FileField(required=True)


class PredictionSerializer(serializers.ModelSerializer):
    # Add role category for frontend display
    role_category = serializers.SerializerMethodField()
    
    class Meta:
        model = Prediction
        fields = (
            "id",
            "input_skills",
            "predicted_role",
            "role_category",
            "confidence",
            "resume_file",
            "created_at",
        )
        read_only_fields = ("id", "created_at", "role_category")
    
    def get_role_category(self, obj):
        """Return the category of the predicted role."""
        from .constants import get_role_category
        return get_role_category(obj.predicted_role)
    
    def validate_predicted_role(self, value):
        """Validate that the predicted role is in our allowed list."""
        if not is_valid_role(value):
            raise serializers.ValidationError(
                f"Invalid role '{value}'. Must be one of: {', '.join(ALL_ROLES)}"
            )
        return value