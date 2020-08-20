---
title: jupyter-notebook使用
date: 2020-08-20 16:15:57
tags: 
	- python
	- jupyter
categories: python
---


# jupyter-notebook基础设置

## 使用pip进行安装

```shell
pip install jupyter
```

## 生成配置文件

```shell
jupyter-notebook --generate-config
```

## 生成密码

```shell
jupyter-notebook password # 输入密码后会生成到一个json文件，等下复制到~/.jupyter/jupyter_notebook_config.py
```

## 配置~/.jupyter/jupyter_notebook_config.py

```python

c.NotebookApp.ip='*'   # “*”代表非本机都可以访问

c.NotebookApp.allow_remote_access = True # 若是非本机访问，还需开启远程访问

c.NotebookApp.open_browser = False    # 服务器上不需要启动浏览器

c.NotebookApp.notebook_dir = '~/jupyter_workspace'    # 指定notebook服务的默认打开目录

c.NotebookApp.port = 8888 # 默认服务端口

c.NotebookApp.password = u'encrypted_password' # encrypted_password是刚才生成的密码
```
<!--more-->
<!--more-->
## 配置python虚拟环境到jupyter kernel

```shell
# 查看jupyter中已有的kernel（即python虚拟环境）
jupyter kernelspec list
# 激活自己的虚拟环境
conda activate virtual_envirnment
# 安装ipykernel到jupyter-notebook
python -m ipykernel install --user --name virtual_envirnment --display-name "virtual_envirnment" # 其中virtual_envirnment是你的虚拟环境名
# 也可以移除不用的kernel
jupyter kernelspec remove torch1.2
```

