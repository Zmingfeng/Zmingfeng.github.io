---
title: 爬取需要验证码的课程表
date: 2018-03-09 20:54:08
tags: 爬虫
categories: 爬虫

---

首先声明，本次爬取的是华北科技学院的课程表，在其他学校不一定适用。

## 基础知识补充
1.requests
requests是一个强大的第三方库，可以很大的简化抓取网页的步骤，只要传递几个参数，就能抓取到期望的页面。
具体使用，可以参考:[Requests快速上手](http://cn.python-requests.org/zh_CN/latest/user/quickstart.html)
<!-- more -->
<!-- more -->
2.Beautiful Soup
Beautiful Soup 是一个可以从HTML或XML文件中提取数据的Python库.它能够通过你喜欢的转换器实现惯用的文档导航,查找,修改文档的方式.Beautiful Soup会帮你节省数小时甚至数天的工作时间.
简单来说，Beautiful Soup是个第三方的网页解析库，具体使用方法，参考:[Beautiful Soup 4.4.0 文档](http://beautifulsoup.readthedocs.io/zh_CN/latest/#id12)

3.cookies
指某些网站为了辨别用户身份、进行session跟踪而储存在用户本地终端上的数据（通常经过加密），一般第一次访问某个站点，服务器就会返回cookies，以便记录此次会话，而用户下次访问这些站点，就要带着这个cookies访问。
## 抓取课程表所在的网页
这一步是为后面的工作打下基础，首先将自己拦截的浏览器headers组成dict，然后带着这些headers抓取课程表的初始网页，获取此次会话的cookies。
```python
import requests
url0 = 'http://jwgl.ncist.edu.cn/ZNPK/KBFB_ClassSel.aspx'
header = {
'Accept': '*/*',
'Accept-Encoding': 'gzip, deflate',
'Accept-Language': 'zh-Hans-CN,zh-Hans;q=0.5',
'Host': 'jwgl.ncist.edu.cn',
'Referer': 'http://jwgl.ncist.edu.cn/ZNPK/KBFB_ClassSel.aspx',
'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; \
Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3)'
}
r = requests.get(url0,headers=header)
```
## 获取网页中的有效信息
上文提到了，用户下次访问站点，需要带着cookies，那么怎么分辨cookies？

这个用浏览器的开发者工具或者获取抓包工具，比如fidder，都能查看浏览器访问时，都携带了哪些内容，像上文的请求headers就是通过抓包工具，分析得到。在此次的访问中，可以获取到cookies，以及一些行政班级的信息，将其记录下来，后面会用到。
```python
cookies = cookies['Set-Cookie'].split('=')
cookies = {cookies[0]:cookies[1].split(';')[0]}
Sel_XZBJ_l = BeautifulSoup(r.text,'lxml').find('select',{'name':'Sel_XZBJ'}).find_all('option')
Sel_XNXQ_l = BeautifulSoup(r.text,'lxml').find('select',{'name':'Sel_XNXQ'}).find_all('option')
```
## 交互式输入post头
想要获取课程表，需要提交一些信息，比如，哪个班，哪个学期等，至于需要哪些信息才能访问，都是通过抓包工具拦截分析得到，甚至访问的步骤都是通过抓包工具分析得到。
```python
while True:
    Sel_XNXQ_Temp = input('请输入学年学期：（例如：2016-2017学年第二学期）')
    for XNXQ_temp in Sel_XNXQ_l:
        if XNXQ_temp.text == Sel_XNXQ_Temp:
            Sel_XNXQ = XNXQ_temp['value']
            break
        else:
            Sel_XNXQ = ''
    if Sel_XNXQ != '':
        break
    else:
        print('输入错误！')
while True:
    type = input('以何种格式打印（1/2）：')
    if type == '1' or type == '2':
        break
    else:
        print('输入错误！')
while True:
    Sel_XZBJ_Temp = input('请输入班级（例如：自卓B141）：')
    for class_temp in Sel_XZBJ_l:
        if class_temp.text.strip() == Sel_XZBJ_Temp:
            Sel_XZBJ = class_temp['value']
            break
        else:
            Sel_XZBJ = ''
    if Sel_XZBJ != '':
        break
    else:
        print('未找到该班级，请重新输入！')
while True:
    txtxzbj = input('是否包含公共人选课程（y/n）:')
    if txtxzbj == 'n' or txtxzbj == 'N':
        txtxzbj = '1'
        break
    elif txtxzbj == 'y' or txtxzbj == 'Y' or txtxzbj == '':
        txtxzbj = ''
        break
    else:
        print('输入错误！')
```
### 获取验证码，并人工识别
有的网站，想要跳到另一个页面需要验证码，而有的是图片验证码，在网页源码里并没有。这个时候通过抓包工具，看一下点击验证码更换图片时，浏览器都做了什么。本文中浏览器是向某个网页提交了一个get，再由服务器返回一个图片网页，这样我就能获取到这个图片验证码了,然后通过交互模式，人工输入验证码，就可以通过验证。
```python
url1 = 'http://jwgl.ncist.edu.cn/sys/ValidateCode.aspx'
r = requests.get(url1,headers=header,cookies=cookies)
image = Image.open(BytesIO(r.content))
image.show()
yzm = input('请输入图片验证码：')
```

## post方法提交验证码等信息
```python
header['Accept'] = 'image/gif, image/jpeg, image/pjpeg, application/x-ms-application, application/xaml+xml, \
application/x-ms-xbap, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/msword, */*'
url = 'http://jwgl.ncist.edu.cn/ZNPK/KBFB_ClassSel_rpt.aspx'
postData = {
'Sel_XNXQ':Sel_XNXQ,
'txtxzbj':txtxzbj,
'Sel_XZBJ':Sel_XZBJ,
'type':type,
'txt_yzm': yzm
}
r = requests.post(url,data=postData,headers=header,cookies=cookies)
```

## 分析post返回的网页
通过分析post返回的网页，可以得到课程表的图片地址，接着get就行了。
```python
x = BeautifulSoup(r.text,'lxml').find('img')
header['Accept'] = '*/*'
header['Referer'] = 'http://jwgl.ncist.edu.cn/ZNPK/KBFB_ClassSel_rpt.aspx'
url = 'http://jwgl.ncist.edu.cn/ZNPK/' + x['src']
r = requests.get(url,headers=header,cookies=cookies)
jpg = Image.open(BytesIO(r.content))
jpg.show()
judge = input('是否保存图片（y/n）')
if judge == 'Y' or judge == 'y':
    jpg.save("./out.jpg", "jpeg")
```
至此，课程表的获取工作已经完成。

注意：图片是二进制文件。
