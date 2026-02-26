from django.conf import settings
from django.db import models
from .constants import ROLE_CHOICES


class Prediction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="predictions")
    input_skills = models.JSONField(default=dict, blank=True)
    resume_file = models.FileField(upload_to="resumes/", null=True, blank=True)
    resume_text = models.TextField(blank=True)
    predicted_role = models.CharField(max_length=120, choices=ROLE_CHOICES)
    confidence = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
