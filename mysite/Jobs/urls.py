from django.urls import path
from django.conf.urls import url
from . import views

urlpatterns = [
	path('', views.index, name='index'),
	path('register', views.register, name='register'),
	path('create_account', views.create_account, name='create_account'),
	path('login', views.login, name='login'),
	path('check_login', views.check_login, name='group'),
	path('group', views.group, name='login'),
	path('addGroup', views.addGroup, name='addGroup'),
	path('addtask', views.addtask, name='addtask'),
	path('movetask', views.movetask, name='addtask'),
]