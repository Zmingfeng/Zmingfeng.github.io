---
title: Linux使用笔记
date: 2020-08-13 22:58:47
tags: 
    - Linux 
    - npm
    - conda
    - python
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
# 使用一下命令换源，会将配置写入.npmrc
npm config set registry https://registry.npm.taobao.org
```

# Conda换源

```shell
# 会将配置写入.condarc
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --set show_channel_urls yes
# 查看镜像源
conda config --show channels
# 移除镜像源，source-address就是要移除的源地址
conda config --remove-key channels source-address
```

# pip换源

```shell
# 打开~/.config/pip/pip.conf，并写入以下内容
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
```

# ubuntu16.04换源

```shell
# 先备份
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
# 修改/etc/apt/sources.list，添加如下内容
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic main restricted universe multiverse

deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic main restricted universe multiverse

deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse

deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse

deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse

deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse

deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-security main restricted universe multiverse

deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-security main restricted universe multiverse

deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-proposed main restricted universe multiverse

deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-proposed main restricted universe multiverse
# 更新源
sudo apt update
```



# 在Windows下使用vscode搭建vscode环境

基础步骤按照VSCode的C/C++扩展的document就可以，在json中使用系统环境变量可以使用以下方式：

```json
${env:系统中设置的环境变量名}
```
<!--more-->
<!--more-->
# 显卡驱动卸载及安装（ubuntu16.04）

```shell
# 禁用图形界面
sudo service lightdm stop
# 之前的显卡驱动全部清除，根据提示选yes
sudo apt-get --purge remove nvidia-\*
# 从官网下载驱动（这里以435.21为例，可以从链接中直接替换自己想要的版本）
wget http://cn.download.nvidia.com/XFree86/Linux-x86_64/435.21/NVIDIA-Linux-x86_64-435.21.run
# 赋予运行权限
sudo chmod a+x NVIDIA-Linux-x86_64-435.21.run
# 运行run文件， 全都按照默认进行选择
sudo ./NVIDIA-Linux-x86_64-435.21.run
# 查看是否安装成功
nvidia-smi
# 若是上一步显示没有，则进行显卡驱动挂载
modprobe nvidia
```

# Cuda对应图

![](\images\image-20200822111634528.png)

# 安装指定Cuda版本的Pytorch

```shell
conda install pytorch cudatoolkit=10.1 -c pytorch
```

# 安装多版本Cuda（Pytorch不用）

## 下载安装

[官网下载]: https://developer.nvidia.com/cuda-toolkit-archive

```shell
# 根据Cuda对应图下载指定版本的cuda，下载runfile文件,这里以10.1为例
wget https://developer.nvidia.com/compute/cuda/10.1/Prod/local_installers/cuda_10.1.105_418.39_linux.run
# 赋予runfile执行权限
sudo chmod a+x cuda_10.1.105_418.39_linux.run
# 执行安装,记住装过驱动了就别装驱动了，选项可以根据自己的需要进行选择
sudo ./cuda_10.1.105_418.39_linux.run
# 在用户主目录的.bashrc文件中添加（或修改成）以下两行，将执行库和cuda可执行文件写入环境变量
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/cuda-10.1/lib64
export PATH=$PATH:/usr/local/cuda-10.1/bin
```

## 使用软链接更方便切换版本

```shell
# 先将/usr/bin/cuda软链接指向指定版本
sudo rm -f /usr/bin/cuda # 删除软链接
sudo ln -s /usr/bin/cuda /usr/local/cuda-10.1 #重建软链接
# 修改环境变量如下
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/cuda/lib64
export PATH=$PATH:/usr/local/cuda-10.1/bin
```

每次切换版本只需要重建软链接就可以了