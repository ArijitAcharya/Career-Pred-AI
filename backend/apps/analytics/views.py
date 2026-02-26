from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Count
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.predictions.models import Prediction

User = get_user_model()



class AdminAnalyticsOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_users = User.objects.count()
        total_predictions = Prediction.objects.count()

        most_predicted = (
            Prediction.objects.values("predicted_role")
            .annotate(c=Count("id"))
            .order_by("-c")
            .first()
        )

        return Response(
            {
                "total_users": total_users,
                "total_predictions": total_predictions,
                "most_predicted_role": (most_predicted or {}).get("predicted_role"),
                "most_predicted_role_count": (most_predicted or {}).get("c", 0),
            }
        )


class AdminRoleDistributionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        rows = Prediction.objects.values("predicted_role").annotate(count=Count("id")).order_by("-count")
        return Response({"distribution": list(rows)})


class AdminMonthlyPredictionCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        months = int(request.query_params.get("months", 6))
        months = max(1, min(months, 24))

        now = timezone.now()
        start = now - timedelta(days=31 * months)

        qs = Prediction.objects.filter(created_at__gte=start).only("created_at")

        counts = {}
        for p in qs:
            key = p.created_at.strftime("%Y-%m")
            counts[key] = counts.get(key, 0) + 1

        labels = sorted(counts.keys())
        return Response({"months": labels, "counts": [counts[m] for m in labels]})


class AdminUserStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        top_users = (
            Prediction.objects.values("user_id")
            .annotate(prediction_count=Count("id"))
            .order_by("-prediction_count")[:10]
        )

        user_ids = [r["user_id"] for r in top_users]
        user_map = {u.id: u for u in User.objects.filter(id__in=user_ids)}

        enriched = []
        for row in top_users:
            u = user_map.get(row["user_id"])
            enriched.append(
                {
                    "user_id": row["user_id"],
                    "username": getattr(u, "username", None),
                    "email": getattr(u, "email", None),
                    "prediction_count": row["prediction_count"],
                }
            )

        return Response({"top_users": enriched})
