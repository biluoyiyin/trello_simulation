from django.urls import path
from django.conf.urls import url
from . import views

urlpatterns = [
	path('', views.index, name='index'),
	path('addtask', views.addtask, name='addtask'),
	path('movetask', views.movetask, name='addtask'),
]