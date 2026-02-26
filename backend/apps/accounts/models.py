import hashlib
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    ROLE_ADMIN = "admin"
    ROLE_USER = "user"

    ROLE_CHOICES = (
        (ROLE_ADMIN, "Admin"),
        (ROLE_USER, "User"),
    )

    email = models.EmailField(unique=True)

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_USER)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    email_notifications_enabled = models.BooleanField(default=True)
    privacy_mode_enabled = models.BooleanField(default=False)


class PasswordResetToken(models.Model):
    """Token-based password reset model"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reset_tokens')
    token_hash = models.CharField(max_length=64)  # SHA256 hash of the token
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['token_hash']),
            models.Index(fields=['expires_at']),
            models.Index(fields=['is_used']),
        ]

    def __str__(self):
        return f"Password reset token for {self.user.email}"

    def is_expired(self):
        return timezone.now() > self.expires_at


class PasswordResetOTP(models.Model):
    """OTP-based password reset model"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reset_otps')
    otp_hash = models.CharField(max_length=64)  # SHA256 hash of the OTP
    attempts = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['otp_hash']),
            models.Index(fields=['expires_at']),
            models.Index(fields=['is_used']),
        ]

    def __str__(self):
        return f"Password reset OTP for {self.user.email}"

    def is_expired(self):
        return timezone.now() > self.expires_at

    def is_max_attempts_reached(self):
        return self.attempts >= 5
