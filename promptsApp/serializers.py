from rest_framework import serializers
from .models import Prompt

# Specify models to work with and fields to be converted to json

class PromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prompt
        fields = ('id', 'promptType', 'text')