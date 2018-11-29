import logging
import logging.handlers
from logging.handlers import WatchedFileHandler
import os
import multiprocessing
bind = "0.0.0.0:8000"   #绑定的ip与端口
backlog = 512                #监听队列数量，64-2048
#chdir = '/home/test/server/bin'  #gunicorn要切换到的目的工作目录
worker_class = 'gevent' #使用gevent模式，还可以使用sync 模式，默认的是sync模式
workers = 1 # multiprocessing.cpu_count()    #进程数
threads = 4 #multiprocessing.cpu_count()*4 #指定每个进程开启的线程数
loglevel = 'info' #日志级别，这个日志级别指的是错误日志的级别，而访问日志的级别无法设置
access_log_format = '%(t)s %(p)s %(h)s "%(r)s" %(s)s %(L)s %(b)s %(f)s" "%(a)s"'
accesslog = "/Users/yaoxuanchen/Documents/demonstrator/gunicorn_access.log"      #访问日志文件
errorlog = "/Users/yaoxuanchen/Documents/demonstrator/gunicorn_error.log"        #错误日志文件
proc_name = 'Jobs'   #进程名
'''
server{
    listen 80;
    server_name 172.31.45.89;
    access_log /home/ubuntu/Django/project/mysite/nginx.access.log;
    error_log /home/ubuntu/Django/project/mysite/nginx.error.log;
    
    location / {
        proxy_pass http://0.0.0.0:8000;
        proxy_pass_header       Authorization;
        proxy_pass_header       WWW-Authenticate;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    location /static/ {
        root /home/ubuntu/Django/project/mysite;
    }
}
 /etc/nginx/sites-enabled/default 
 '''