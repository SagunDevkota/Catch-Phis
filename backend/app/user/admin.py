from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User

class UserAdmin(BaseUserAdmin):
    """Define the admin pages for users."""
    ordering = ['id']
    list_display = ['id','email','first_name','last_name','phone']
    search_fields = ['email']
    fieldsets = (
        (None,{'fields':(
                'first_name',
                'last_name',
                'phone',
                'email',
                'password',
                'account_type',
                'parent_user'
                )}),
        (
            _('Permissions'),
            {
                'fields':(
                        'is_active',
                        'is_staff',
                        'is_superuser',
                )
            }
        ),
        (_('Important dates'),{'fields':('last_login',)}),
    )
    readonly_fields = ['last_login']
    add_fieldsets = (
        (None,{
            'classes':('wide',),
            'fields':(
                'first_name',
                'last_name',
                'email',
                'password1',
                'password2',
                'phone',
                'is_active',
                'is_staff',
                'is_superuser',
            )
        }),
    )

    def formfield_for_dbfield(self, db_field, **kwargs):
        field = super().formfield_for_dbfield(db_field, **kwargs)

        # Check if the field has null=True and default=None
        if field and db_field.null and db_field.default is None:
            field.required = False  # Set the field as not required

        return field

admin.site.register(User,UserAdmin)