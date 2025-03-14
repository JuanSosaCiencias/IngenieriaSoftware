from django.contrib import admin
from .models.scholarship import Scholarship
from .models.user_data import UserData
from .models.organization import Organization
from .models.organization import Membership
from .models.category import Category

# Register your models here.

admin.site.register(UserData)
admin.site.register(Scholarship)
admin.site.register(Organization)
admin.site.register(Membership)
admin.site.register(Category)
