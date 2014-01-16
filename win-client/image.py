# encoding: utf-8

#引入必要类库
import os, sys
import Image
import hashlib
import json
import sqlite3
import win32gui_taskbar as taskbar
from pprint import pprint

#全局变量
size = 1200, 1200	#压缩图片的尺寸


def opendb():
	conn = sqlite3.connect('mutuke.db')
	return conn
def closedb(conn):
	conn.commit()
	conn.close()
	
#初始化数据库	
def initdb():
	conn = opendb()
	c = conn.cursor()
	image_table_name = ('images',)
	c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", image_table_name)
	result = c.fetchone()
	if result is None:
		#Create table
		c.execute('''CREATE TABLE images(path text, md5 char(32))''')

	# Insert a row of data
#	c.execute("INSERT INTO stocks VALUES ('2006-01-05','BUY','RHAT',100,35.14)")
	closedb(conn)
	
initdb()


try:
	json_data=open('config.json')
	data = json.load(json_data)
#	print(data["username"])
	json_data.close()
except IOError:
	err_msg = u"找不到配置文件"
	print err_msg
	


for infile in sys.argv[1:]:
	infile = os.path.realpath(infile)
	outfile = os.path.dirname(infile)+"/thumbnail/"
	if not os.path.exists(outfile):os.makedirs(outfile)
	outfile = outfile+os.path.basename(infile)
	if infile != outfile:
		try:
			im = Image.open(infile)
			im.thumbnail(size, Image.ANTIALIAS)
			im.save(outfile, "JPEG")
			md5_string = hashlib.md5(open(infile).read()).hexdigest()
			conn = opendb()
			cursor = conn.cursor()
			cursor.execute("INSERT INTO images VALUES (?,?)",(infile,md5_string))
			closedb(conn)
		except IOError:
			print "cannot create thumbnail for '%s'" % infile
			
taskbar.winmain()