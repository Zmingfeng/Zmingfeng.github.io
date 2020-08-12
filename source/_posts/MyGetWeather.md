---
title: 爬取百度天气预报并通过邮件通知
date: 2018-03-09 20:54:02
tags: 爬虫
categories: 爬虫

---

## requests+BeautifulSoup抓取百度天气上的天气预报
python的优势在于有着各种各样功能强大的标准库和第三方库，使得十分简洁的python代码便可以实现相对复杂的功能，首先先了解以下利用requests抓取网页
### 使用requests模块抓取网页
1.导入requests库
```python
import requests
```
2.抓取百度天气网页源码
```python
url = 'http://www.baidutianqi.com/'
html = requests.get(url).content
```
抓取到的网页是bytes型，想要得到字符型，就像下面这样把content换成text就行：
```python
url = 'http://www.baidutianqi.com/'
html = requests.get(url).text
```
requests的用法很简单，可以参考：[requests官方文档](http://cn.python-requests.org/zh_CN/latest/user/quickstart.html)
### 利用BeautifulSoup解析网页获取天气信息
1.导入BeautifulSoup库
```python
from bs4 import BeautifulSoup
```
2.利用BeautifulSoup解析网页
```python
tag_tmp = BeautifulSoup(html,'lxml')
provinceInfo = tag_tmp.find(id='provinces').find('ul').find_all('li')
```
'lxml'是lxml HTML解析器，速度快，容错能力强。
将html参数传入BeautifulSoup类中，获得一个BeautifulSoup对象，其实就是一个tag对象，可调用对象find()和find_all()方法来匹配到期望的标签。

注意：find()方法返回的是文档中符合条件的tag对象，而find_all()返回的是符合条件的所有的tag组成的list
```python
cityName = []
cityLink = []
```
建立两个list，存放城市的名称和城市天气的链接
```python
weather = {}
for x in provinceInfo:
    html = requests.get(x.a['href']).content
    tag_tmp = BeautifulSoup(html, 'lxml')
    city_tmp = tag_tmp.find(id='citys').find('ul').find_all('li')
    for y in city_tmp:
        tmp = y.find('a')
        cityName.append(tmp.get_text().strip('天气预报'))
        cityLink.append(tmp['href'])
    result = list(zip(cityName,cityLink))
    for x,y in result:
        weather[x] = y
```
a['href']是获取a标签中的'href'属性，strip()不传入参数时，默认去掉字符串前后的空格，zip()可以将传入的两个Iterable对应的元素组成tuple，weather是存放城市和天气对应关系的dict，这样城市和天气信息就对应起来了。

想了解BeautifulSoup的具体用法，参考：[BeautifulSoup官方文档](http://beautifulsoup.readthedocs.io/zh_CN/latest/)
3.对获取的城市天气所在链接进行处理
```python
cityIn = '上海'
    if cityIn in weather.keys():
        html = requests.get(weather[cityIn]).content
        weather_tmp = BeautifulSoup(html, 'lxml')
        weather7days = weather_tmp.find(id="weather").find('ul').find_all('li')
        day = weather7days[0]
        l_tmp = day.get_text().split(' ')
        w = l_tmp[0].strip()
        x = l_tmp[2].strip() + l_tmp[3].strip()
        y = x.split('℃')[0].strip() + '℃'
        z = x.split('℃')[1].strip()
        print(w+'\n'+y+'\n'+z + '\n' + '-'*20)
```
weather7days字存放的是连续七天的天气预报的tag组成的list，用day = weather7days[0]获取今天天气预报的tag，day.get_text()获取tag中天气文本（温度，风级，阴晴等），接下来就是文本分离部分，不同网站的天气格式略有不同，可以根据不同的网站，使用不同的分离方法。
## 使用smtplib+email发送邮件
email模块用于生成邮件，而smtplib模块用于发送邮件，具体代码如下：
```python
from email.mime.text import MIMEText
import smtplib
def send_email(content):
    mail_to = "目标邮箱"
    mail_server = "源邮箱服务器"
    mail_user = "源邮箱"
    mail_pass = "源邮箱密码"
    msg = MIMEText(content)
    msg['Subject'] = '今日天气预报'
    msg['From'] = mail_user
    msg['To'] = mail_to
    try:
        s = smtplib.SMTP()
        s.connect(mail_server)
        s.login(mail_user, mail_pass)
        s.sendmail(mail_user, mail_to, msg.as_string())
        s.close()
        print('发送成功！')
        return True
    except Exception as e:
        print('发送失败！')
        print(e)
        return False
```
首先导入了email和stmplib库，然后定义了一个sned_email()函数，mail_to代表目标邮箱，mail_server是你的邮箱服务器，例如163邮箱是"smtp.163.com"，mail_user和mail_pass是你的邮箱和密码。




