---
title: CPPServerDevelopment
date: 2021-04-18 13:22:06
tags: 
	- C++
	- 服务器开发
categories: C++
---



# C++服务器开发学习路线

注意： 本文不全，边学边补充

## 基础

###  	熟练掌握C/C++

- 基础语法、类及模板、C++2.0新特性、STL；
- STL源码及底层实现（多态的实现等）
- 宽字符
- 位域
- 开发-编译-调试，熟练掌握一个IDE，linux下的cmake/makefile

### Linux shell 命令

- 后台开发常用命令

### 	Linux/windows系统编程

- 文件IO
- 线程
- 进程
- 线程同步
- 时间函数
- ......

### 	socket网络编程

- socket/listen/send/bind/accept/connect/select/close/shutdown/recv

- 网络通信模型

  #### 学习方法

  - 学习以上API
  - 看开源项目的网络通信部分（redis、memcached）

### 	数据库基本原理

- 数据库操作命令：增删改查
- 索引用法
- SQL优化
- 事务及锁
- explain
- 分表分库分区分块
- 负载均衡（读写分离、主从复制）

​	

## 进阶

- 算法及数据结构
- 操作系统原理（PE/ELF 进程地址空间的内存 函数调用 等）
- 编码风格及代码优化

## 书籍

《提高C++性能的编程技术》

《现代操作系统》

《深入理解计算机系统》

《深度探索C++对象模型》

《Linux多线程服务端编程》

《Linux高性能服务器编程》

《TCP/IP网络编程》

《计算机网络：自顶向下方法》

《程序员的自我修养》

《编程之美》

《高性能MySQL》

《Redis实战》

《Linux系统编程》

《TCP/IP卷一》

《Linux内核设计与实现》

《UNIX 网络编程：卷一/卷二》

《UNIX环境高级编程》

## 源码阅读

- Filezilla
- Redis
- Nginx
- moduo