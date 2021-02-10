from django.contrib import admin
from .models import Prompt

# Register your models here.
class PromptAdmin(admin.ModelAdmin):
    list_display = ('id', 'promptType', 'text')

admin.site.register(Prompt, PromptAdmin)
