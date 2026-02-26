from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Career Predictor AI", {"fields": ("role", "avatar")}),
    )
    list_display = ("username", "email", "role", "is_staff", "is_active")
