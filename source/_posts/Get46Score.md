---
title: 爬取四六级成绩查询系统
date: 2018-03-09 20:53:57
tags: 爬虫
categories: 爬虫

---

## 使用requests获取网页源码
1.分析浏览器访问网页的过程

首先选择 http://www.chsi.com.cn/cet/ 进行四六级的查询，查看浏览器提交的表单，然后发现，实际网址就是 http://www.chsi.com.cn/cet/query 后面加上输入的准考证号，和姓名，故选择 http://www.chsi.com.cn/cet/query 作为访问基址。

2.查看46级成绩所在页面的源码
```python
import requests
urlBase = 'http://www.chsi.com.cn/cet/query'

zkzh = '***************'
xm = '***'
payload = {'zkzh':zkzh,'xm':xm}
html = requests.get(urlBase,params=payload)
print(html.url)
```
"\*"替换成你的准考证号和姓名，requests.get()返回的对象的url属性，保存的是当前访问的网页的链接，但是事实上我们并没有得到下面这样的链接，这是因为没有添加一些header。
```
http://www.chsi.com.cn/cet/query？zkzh=xiaoming&xm=123 
```
3.添加header，伪装成浏览器
将最后两行代码改成下面这样：
```python
...
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
           'Referer': 'http://www.chsi.com.cn/cet/'
           }
html = requests.get(urlBase,params=payload,headers=headers)	
print(html.url)	   
```
headers是个dict，里面的headers映射关系，可以通过fidder监控网页访问得到。

4.获取网页源码
```python
...
data = html.content
```
content属性代表返回的是bytes型的网页文件。
## 使用BeautifulSoup进行网页解析
```python
...
tag_tmp = BeautifulSoup(data, 'lxml')
m = tag_tmp.find(id='leftH').find('table')
y = m.find_all('tr')
for x in y:
    if x.find('td') != None:
        print(x.find('th').get_text().strip() + x.find('td').get_text().strip())
    else:
        print(' ' * 3 + x.find('th').get_text().strip())
```
将获取的四六级成绩所在的页面源码提交给BeautifulSoup进行网页解析，分析得到的信息再通过一定的格式组合，就可以打印出来查询的个人信息和四六级成绩了。
