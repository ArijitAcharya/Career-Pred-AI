import hashlib
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import PasswordResetToken, PasswordResetOTP

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        user = User(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "avatar",
            "email_notifications_enabled",
            "privacy_mode_enabled",
        )
        read_only_fields = ("id", "role")


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Convert email to username for standard JWT authentication
        email = attrs.get("username")  # Frontend sends email as username
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError("Email and password are required")

        # Find user by email
        qs = User.objects.filter(email__iexact=email)
        if not qs.exists():
            raise serializers.ValidationError("No active account found with the given credentials")

        active = qs.filter(is_active=True)
        if not active.exists():
            raise serializers.ValidationError("No active account found with the given credentials")

        # Pick the most recent active user if duplicates
        user = active.order_by("-date_joined", "-id").first()

        # Verify password
        if not user.check_password(password):
            raise serializers.ValidationError("No active account found with the given credentials")

        # Replace email with username for parent JWT
        attrs["username"] = user.get_username()

        # Let parent class create tokens
        data = super().validate(attrs)
        return data


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for password reset requests"""
    email = serializers.EmailField()
    method = serializers.ChoiceField(choices=['token', 'otp'], default='token')

    def validate_email(self, value):
        # Always validate email format, but don't reveal if account exists
        if not value:
            raise serializers.ValidationError("Email is required")
        return value


class PasswordResetTokenSerializer(serializers.Serializer):
    """Serializer for token-based password reset"""
    token = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_new_password(self, value):
        validate_password(value)
        return value


class PasswordResetOTPSerializer(serializers.Serializer):
    """Serializer for OTP-based password reset"""
    email = serializers.EmailField()
    otp = serializers.CharField(write_only=True, min_length=6, max_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_new_password(self, value):
        validate_password(value)
        return value
