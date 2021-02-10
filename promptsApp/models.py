from django.db import models

# Create your models here.
class Prompt(models.Model):
    # An id field is automatically provided
    promptType = models.CharField(max_length=20, blank=True, default='')
    text = models.CharField(max_length=300, blank=True, default='')