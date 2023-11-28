from django.urls import path
from . import views

# URLConf
urlpatterns = [
	path('hello/', views.hello_world),
	path('page/', views.page),
]
