from django.contrib import admin
from django.utils.html import format_html
from .models import Prediction
from .constants import get_role_category, ROLE_CATEGORIES


@admin.register(Prediction)
class PredictionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "predicted_role", "role_category_badge", "confidence", "created_at")
    list_filter = ("predicted_role", "created_at")
    search_fields = ("user__username", "user__email", "predicted_role")
    readonly_fields = ("id", "created_at", "role_category")
    ordering = ("-created_at",)
    
    fieldsets = (
        ("Basic Information", {
            "fields": ("user", "predicted_role", "confidence")
        }),
        ("Input Data", {
            "fields": ("input_skills", "resume_file", "resume_text")
        }),
        ("System Information", {
            "fields": ("role_category", "created_at"),
            "classes": ("collapse",)
        }),
    )
    
    def role_category_badge(self, obj):
        """Display role category as a colored badge."""
        category = get_role_category(obj.predicted_role)
        category_info = ROLE_CATEGORIES.get(category, {})
        color = category_info.get("color", "#6B7280")
        label = category_info.get("label", "Unknown")
        
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">{}</span>',
            color, label
        )
    role_category_badge.short_description = "Category"
    role_category_badge.admin_order_field = "predicted_role"
    
    def role_category(self, obj):
        """Get role category for display."""
        return get_role_category(obj.predicted_role)
    role_category.short_description = "Role Category"
    
    def get_queryset(self, request):
        """Optimize queries."""
        return super().get_queryset(request).select_related('user')
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """Customize user field display."""
        if db_field.name == "user":
            kwargs["queryset"] = kwargs["queryset"].select_related().order_by('username')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
