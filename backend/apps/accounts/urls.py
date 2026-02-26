from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.views import TokenObtainPairView

from .views import (
    ChangePasswordView,
    GoogleOAuthLoginView,
    LogoutView,
    MeView,
    RegisterView,
)
from .auth_views import (
    request_password_reset,
    reset_password_with_token,
    reset_password_with_otp,
)
from .serializers import EmailTokenObtainPairSerializer


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", MeView.as_view(), name="me"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("google/", GoogleOAuthLoginView.as_view(), name="google-login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("token/", EmailTokenObtainPairView.as_view(), name="token-obtain"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    
    # Password reset endpoints
    path("auth/request-reset/", request_password_reset, name="request-reset"),
    path("auth/reset-password/", reset_password_with_token, name="reset-password"),
    path("auth/verify-otp/", reset_password_with_otp, name="verify-otp"),
]
