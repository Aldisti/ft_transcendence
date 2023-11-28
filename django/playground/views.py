from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def hello_world(request):
    return render(request, 'page.html')

def page(request):
    return render(request, 'page.html', {'name':'aldisti'})
