---
title: 批量爬取豆瓣上的图片
date: 2018-03-09 20:53:51
tags: 爬虫
categories: 爬虫

---

## 利用Python3的urllib.request模块实现静态网页抓取

urllib.request模块定义了很多的函数和类来帮助Programmers快速高效的处理URL。

首先，抓取豆瓣的首页：
```python
# coding : utf-8
import urllib.request
url = 'http://www.douban.com'
#获取静态网页
webpage = urllib.request.urlopen(url)
data = webpage.read().decode('utf-8')
print(data)
```
urllib.request.urlopen()函数返回的是http.client.HTTPResponse的实例，通过调用http.client.HTTPResponse类下的read()方法来获取服务器应答的bytes格式的页面，通过decode()方法进行解码，获得utf-8格式的html源码。

## 伪装成浏览器访问
爬虫并不是任何时刻都可以成功的，很多网站都有防爬虫机制，拒绝非浏览器的访问，这种情况下，可以通过添加一些header来伪装成浏览器，以欺骗站点的检查：
```python
# -*- coding:utf-8 -*-
import urllib.request
url = 'http://www.douban.com'
header = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 \
        (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'
    }
req = urllib.request.Request(url = url,headers = header)
data = urllib.request.urlopen(req).read().decode()
print(data)	
```
urllib.request.Request类返回一个URL request的抽象，然后调用urllib.request.urlopen()函数，传入urllib.request.Request处理后的请求。
url header可以通过fidder监控访问站点时浏览器向网站发送的请求报文中获取。

## 利用正则表达式提取出网页中的图片链接

正则表达式的相关知识，参考: [正则表达式指南](http://www.cnblogs.com/huxi/archive/2010/07/04/1771073.html)

代码如下：
```python
# -*- coding:utf-8 -*-
import urllib.request,re,os,time
if __name__ == '__main__':
    url = 'http://www.douban.com'
    header = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 \
        (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
        'Accept-Encoding': 'sdch'
        }
    req = urllib.request.Request(url = url,headers = header)
    contentBytes = urllib.request.urlopen(req).read().decode()     
    for link,t in set(re.findall(r'(https://[^\s]*?(jpg|png|gif))',contentBytes)):
        time.sleep(1)
        print(link)
```

## 发散式爬取图片

选择豆瓣作为入口点，使用set存放url可以有效的防止url被重复访问，降低效率：
```python
# -*- coding:utf-8 -*-
import urllib.request,re,os,time
targetDir  = r'e:\Git\Crawler\html_img'
def Link2File_Path(path):
    if not os.path.isdir(targetDir):
        os.mkdir(targetDir)
    index = path.rindex('/') + 1
    file_path = os.path.join(targetDir,path[index:])
    return file_path
if __name__ == '__main__':
    url_crawled = set([])
    url_crawlering = {'http://www.douban.com'}
    header = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 \
        (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
        'Accept-Encoding': 'sdch'
        }
    while len(url_crawlering):
        url1 = url_crawlering.pop()
        if url1 not in url_crawled:
            url_crawled.add(url1)
            req = urllib.request.Request(url = url1,headers = header)
            contentBytes = urllib.request.urlopen(req).read()       
            for url2 in set(re.findall(r'(https://[^\s]*?com)',str(contentBytes))):
                url_crawlering.add(url2)
            for link,t in set(re.findall(r'(https://[^\s]*?(jpg|png|gif))',str(contentBytes))):
                time.sleep(1)
                print(link)
                try:
                    urllib.request.urlretrieve(link,Link2File_Path(link))     #Copy a network object denoted by a URL to a local file       
                except:
                    print('Download image failed')
```
源码：[DownloadImag.py](https://github.com/Zmingfeng/Python3/blob/master/DownloadImag.py)


