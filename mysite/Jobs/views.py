from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
import pymysql 
from . import info
from django.contrib.auth.hashers import make_password, check_password
import json
from threading import Lock
import datetime

lock = Lock()
conn = pymysql.connect(user='root', password='QWER123456', database='Jobs')
cursor = conn.cursor()

@csrf_exempt
def index(request):
	if not request.session['is_login']:
		return redirect("./login")
	group = request.session['cur_group']
	if not group:
		return redirect("./group")
	request.session['cur_group'] = group
	username = request.session['username']
	data_to_front = {"todo": [], "doing": [], "done": []}
	cursor.execute("select todo, doing, done from user_group, groupInfo where user_group.groupname = groupInfo.groupname and username = '{}' and groupInfo.groupname like '{},%'".format(username, group))
	data = cursor.fetchall()
	if (data):
		todo = data[0][0].split(",")
		for i in todo:
			if(not i or i=="undefined"):
				continue
			taskId = "{},{}".format(i, group)
			cursor.execute("select * from tasks where taskId = '{}'".format(taskId))
			a_todo = cursor.fetchone()
			to_name, to_tag, to_title, to_duetime, to_des, to_con = a_todo[0].split(",")[0], a_todo[1], a_todo[2], a_todo[3], a_todo[4], a_todo[5]
			data_to_front["todo"].append({"name": to_name, "tag": to_tag, "title": to_title, "duetime": to_duetime, "describes": to_des, "contents": to_con})

		doing = data[0][1].split(",")
		for i in doing:
			if(not i or i=="undefined"):
				continue
			taskId = "{},{}".format(i, group)
			cursor.execute("select * from tasks where taskId = '{}'".format(taskId))
			a_doing = cursor.fetchone()
			to_name, to_tag, to_title, to_duetime, to_des, to_con = a_doing[0].split(",")[0], a_doing[1], a_doing[2], a_doing[3], a_doing[4], a_doing[5]
			data_to_front["doing"].append({"name": to_name, "tag": to_tag, "title": to_title, "duetime": to_duetime, "describes": to_des, "contents": to_con})
		
		done = data[0][2].split(",")
		for i in done:
			if(not i or i=="undefined"):
				continue
			taskId = "{},{}".format(i, group)
			cursor.execute("select * from tasks where taskId = '{}'".format(taskId))
			a_done = cursor.fetchone()
			to_name, to_tag, to_title, to_duetime, to_des, to_con = a_done[0].split(",")[0], a_done[1], a_done[2], a_done[3], a_done[4], a_done[5]
			data_to_front["done"].append({"name": to_name, "tag": to_tag, "title": to_title, "duetime": to_duetime, "describes": to_des, "contents": to_con})
		
	
	#print(todo, doing, done, "-------")
	return render(request, "Jobs/index.html", data_to_front)


def addtask(request):
	if not request.session['is_login']:
		return HttpResponse("failed, not login")
	taskId = request.POST.get('name')
	group = request.session['cur_group']
	taskId = "{},{}".format(taskId, group)
	tag = request.POST.get("tag")
	title = request.POST.get("title")
	duetime = request.POST.get("duetime")
	describes = request.POST.get("describes")
	contents = request.POST.get("contents")
	isNew = request.POST.get("isNew")
	if (isNew == "yes"):
		lock.acquire()
		cursor.execute("INSERT INTO tasks (taskId, tag, title, duetime, describes, contents) values (%s, %s, %s, %s, %s, %s)", [taskId, tag, title, duetime, describes, contents])
		conn.commit()
		lock.release()
	else:
		lock.acquire()
		if (tag):
			cursor.execute("update tasks set tag ='{}' where taskId = '{}'".format(tag, taskId))
		if (title):
			cursor.execute("update tasks set title ='{}' where taskId = '{}'".format(title, taskId))
		if (duetime):
			cursor.execute("update tasks set duetime ='{}' where taskId = '{}'".format(duetime, taskId))
		if (describes):
			cursor.execute("update tasks set describes ='{}' where taskId = '{}'".format(describes, taskId))
		if (contents):
			cursor.execute("update tasks set contents ='{}' where taskId = '{}'".format(contents, taskId))
		conn.commit()
		lock.release()
	return HttpResponse('success')

def movetask(request):
	if not request.session['is_login']:
		return HttpResponse("failed, not login")
	group = request.session['cur_group']
	username = request.session['username']
	n_todo = request.POST.get("todo")
	n_doing = request.POST.get("doing")
	n_done = request.POST.get("done")
	if (n_todo):
		lock.acquire()
		cursor.execute("update groupInfo, user_group set groupInfo.todo='{}' where user_group.groupname = groupInfo.groupname and username = '{}' and groupInfo.groupname like '{},%'".format(n_todo, username, group))
		conn.commit()
		lock.release()
	if (n_doing):
		lock.acquire()
		cursor.execute("update groupInfo, user_group set groupInfo.doing='{}' where user_group.groupname = groupInfo.groupname and username = '{}' and groupInfo.groupname like '{},%'".format(n_doing, username, group))
		conn.commit()
		lock.release()
	if (n_done):
		lock.acquire()
		cursor.execute("update groupInfo, user_group set groupInfo.done='{}' where user_group.groupname = groupInfo.groupname and username = '{}' and groupInfo.groupname like '{},%'".format(n_done, username, group))
		conn.commit()
		lock.release()
	print("move",n_todo, n_doing, n_done)
	return HttpResponse('success')

@csrf_exempt
def register(request):
	msg = {}
	error = request.GET.get("error")
	if (error):
		msg["error"] = error
	print(error)
	return render(request, "Jobs/register.html", msg)

def create_account(request):
	username = request.POST.get("username")
	password = request.POST.get("password")
	password_confirm = request.POST.get("password_confirm")
	cursor.execute("select * from user where username = '{}'".format(username))
	check_user = cursor.fetchall()
	if (check_user):
		return redirect("./register?error=user existed.")
	elif (password != password_confirm):
		return redirect("./register?error='passwords not matched.")
	else:
		password = make_password(password)
		lock.acquire()
		cursor.execute("INSERT INTO user (username, password ) values ('{}', '{}')".format(username, password))
		conn.commit()
		lock.release()
		request.session['is_login'] = True
		request.session['username'] = username
		return redirect("./group")


def login(request):
	msg = {}
	error = request.GET.get("error")
	if (error):
		msg["error"] = error
	return render(request, "Jobs/login.html", msg)

def check_login(request):
	username = request.POST.get("username")
	password = request.POST.get("password")
	lock.acquire()
	cursor.execute("select * from user where username = '{}'".format(username))
	lock.release()
	check_user = cursor.fetchall()
	if (check_user):
		if (check_password(password, check_user[0][1])):
			request.session['is_login'] = True
			request.session['username'] = username
			return redirect("./group")
		else: 
			return redirect("./login?error=password not matched.")
	else:
		return redirect("./login?error=not this user.")

def group(request):
	if not request.session['is_login']:
		return redirect("./login")
	else:
		groupli = {"grouplist":[]}
		username = request.session['username']
		lock.acquire()
		cursor.execute("select * from user_group where username = '{}'".format(username))
		lock.release()
		grouplist = cursor.fetchall()
		for index, values in enumerate(grouplist):
			groupli["grouplist"].append(values[1].split(",")[0])
		return render(request, "Jobs/group.html", groupli)

def addGroup(request):
	if not request.session['is_login']:
		return redirect("./login")
	username = request.session['username']
	groupName = request.POST.get('groupName')
	groupName = "{},{}".format(groupName, datetime.datetime.now())
	lock.acquire()
	cursor.execute("select groupName from user_group where username = '{}'".format(username))
	check_group = cursor.fetchall()
	lock.release()
	for i in check_group:
		if (groupName == i[0]):
			return HttpResponse("group existed.")
	lock.acquire()
	cursor.execute("INSERT INTO groupInfo (groupName, todo, doing, done) values ('{}', '{}', '{}', '{}')".format(groupName, "", "", ""))
	cursor.execute("INSERT INTO user_group (username, groupName) values ('{}', '{}')".format(username, groupName))
	lock.release()
	conn.commit()
	return HttpResponse("success")


