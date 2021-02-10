from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from .serializers import PromptSerializer
from .models import Prompt
from django.views.generic import TemplateView, View
from django.views.decorators.cache import never_cache
from django.conf import settings
import requests
import os

# Create your views here.

# View for index.js
class FrontendView(View):
    def get(self, request):
        print(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html'))
        try:
            with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')) as file:
                return HttpResponse(file.read())
        except FileNotFoundError:
            return HttpResponse(
                """
                This URL is only used when you have built the production
                version of the app. Visit http://localhost:3000/ instead, or
                run `yarn run build` to test the production version.
                """,
                status=501,
            )


class PromptView(viewsets.ModelViewSet):
    # The viewsets base class provides the implementation of CRUD operations
    serializer_class = PromptSerializer
    queryset = Prompt.objects.all()


def getquickplot(request):
    url = "http://writingexercises.co.uk/php/quickplot.php"
    response = requests.get(url)
    if response.status_code == 200:
        return HttpResponse(response.text)
    else:
        return HttpResponse("Bad response. See error code for details.",status=response.status)


def getdialogue(request):
    url = "http://writingexercises.co.uk/php/dialogue.php"
    response = requests.get(url)
    if response.status_code == 200:
        return HttpResponse(response.text)
    else:
        return HttpResponse("Bad response. See error code for details.",status=response.status)


def getfirstline(request):
    url = "http://writingexercises.co.uk/php/firstline.php"
    response = requests.get(url)
    if response.status_code == 200:
        return HttpResponse(response.text + "." if response.text[-1] != '.' else response.text)
    else:
        return HttpResponse("Bad response. See error code for details.",status=response.status)


def gettraits(request):
    url = "http://writingexercises.co.uk/php/randomtraits.php"
    response = requests.get(url)
    if response.status_code == 200:
        return HttpResponse(response.text)
    else:
        return HttpResponse("Bad response. See error code for details.",status=response.status)