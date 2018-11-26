from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect


@csrf_exempt
def index(request):
    return render(request, "Jobs/index.html",{})


def addtask(request):
	name = request.POST.get('name')
	title = request.POST.get("title")
	duetime = request.POST.get("duetime")
	describe = request.POST.get("describe")
	contents = request.POST.get("contents")
	print(name, title, duetime, describe, contents)
	return HttpResponse('11')

def movetask(request):
	todo = request.POST.get("todo")
	doing = request.POST.get("doing")
	done = request.POST.get("done")
	print(todo, doing, done)
	return HttpResponse('22')