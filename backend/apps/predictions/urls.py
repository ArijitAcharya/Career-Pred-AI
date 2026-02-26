from django.urls import path

from .views import PredictionHistoryView, PredictFromResumeView, PredictFromSkillsView, AllPredictionHistoryView

urlpatterns = [
    path("skills/", PredictFromSkillsView.as_view(), name="predict-skills"),
    path("resume/", PredictFromResumeView.as_view(), name="predict-resume"),
    path("history/", PredictionHistoryView.as_view(), name="prediction-history"),
    path("all-history/", AllPredictionHistoryView.as_view(), name="all-prediction-history"),
]
