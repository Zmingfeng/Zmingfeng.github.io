---
title: LinuxNotebook
date: 2020-08-13 22:58:47
tags: Linux
categories: Linux
---


# 创建sudo和ssh用户

## 创建用户并设置sudo权限

```shell
# 使用adduer添加用户会在home目录中添加用户，并设置shell环境（/bin/bash），而useradd不会
adduser username #username是你要创建的用户名
# 使用usermod将新用户添加进sudo用户组
usermod -G username sudo # username是刚才新建的用户名
```

## 设置ssh登录权限

```shell
# 打开ssh配置文件
sudo vim /etc/ssh/sshd_config
# 添加如下代码行
AllowUsers username # username就是刚才新建用户名
```

# npm换源

```shell
# 使用一下命令换源
npm config set registry https://registry.npm.taobao.org
```



