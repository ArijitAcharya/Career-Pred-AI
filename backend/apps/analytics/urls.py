from django.urls import path

from .views import (
    AdminAnalyticsOverviewView,
    AdminMonthlyPredictionCountView,
    AdminRoleDistributionView,
    AdminUserStatsView,
)

urlpatterns = [
    path("overview/", AdminAnalyticsOverviewView.as_view(), name="admin-analytics-overview"),
    path("roles/", AdminRoleDistributionView.as_view(), name="admin-role-distribution"),
    path("monthly/", AdminMonthlyPredictionCountView.as_view(), name="admin-monthly-predictions"),
    path("users/", AdminUserStatsView.as_view(), name="admin-user-stats"),
]
