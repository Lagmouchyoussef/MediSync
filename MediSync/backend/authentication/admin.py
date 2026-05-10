from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from .models import Profile


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'profile'
    fk_name = 'user'


class CustomUserAdmin(UserAdmin):
    inlines = (ProfileInline,)
    list_display = UserAdmin.list_display + ('get_role',)
    list_filter = UserAdmin.list_filter + ('profile__role',)

    def get_role(self, obj):
        try:
            return obj.profile.role
        except Profile.DoesNotExist:
            return "No Profile"
    get_role.short_description = 'Role'


admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
admin.site.register(Profile)
