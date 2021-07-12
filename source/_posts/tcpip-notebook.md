---
title: tcpip_notebook
date: 2021-04-18 13:15:29
tags: TCP/IP
categories: TCP/IP
---



# TCP/IP协议栈

TCP/IP协议分为五层，实际应用只有四层，数据链路层和物理层可以当作一层，后文皆只介绍四层结构，其中OSI模型的应用层、表示层和会话层对应TCP/IP的应用层，数据链路层、物理层对应TCP/IP的网络接口层。

## 协议栈简介

```
协议即一组规范。
```

------

- 应用层

  - 支持协议

    HTTP、 DNS、FTP、NFS、SSH、TELNET

  - 

  

- 传输层

  - 支持协议

    TCP、UDP

- 网络层

  - 支持协议

    TCMP、IP、IGMP

  - 

  

- 网络接口层

  - 支持协议

    ARP、以太网帧协议

*注意：应用层工作在用户态，后三层工作在内核态，也就是说开发者只需要进行应用层开发，而剩下的工作是由操作系统完成的。*

## 封装过程

```
上层的实现依赖于下层提供的服务，下层的内部实现对上层透明。
```

------

- 用户->应用层

  - 封装过程

    给用户数据添加应用层首部

- 应用层->传输层

  - 封装过程

    添加TCP/UDP首部，填充端口号

  - TCP

    首部最小20个字节，16位的目标端口号、6位的源端口号、32位序号、32位确认序号、6个标志位、16位的窗口大小、首部长度、校验和、窗口大小、以及可选的选项等
    
    有连接可靠的全双工传输层协议
    
    需要建立连接，开销较大，耗时较多

  - UDP

    首部只有8个字节，包括16位的目标端口号、16位的源端口以及校验和
    
    无连接，尽最大可能交付，不保证可靠性，可靠性可由应用层实现
    
    

  - 16位端口号

    - 用于不同应用间的通信，每一个进程对应一个端口号
    - 经典端口号
      - 22 ：ssh
      - 80 ：http
      - 443 : https

    

    

- 传输层->网络层

  - 封装过程

    将TCP/UDP数据段进行封装，添加IP首部，这其中可能会有IP分片，取决于IP数据报的长度。

  - TTL（首部中1个字节）

    IP数据报在路由节点中的跳转上限，经过一个路由节点时TTL减一，为0则丢弃。

  - 首部中的标识和片偏移用于IP分片

  - 2字节的首部校验和用于校验首部的完整性和正确性

  - IP地址

    在广域网环境中唯一标识一台主机

- 网络层->接口层

  - 封装过程

    将IP数据报或者ARP请求数据封装成**以太网帧格式**，即添加以太网帧首部及尾部，以太网帧首部包括目的MAC地址（6bytes）、源MAC地址（6bytes）以及帧类型字段（2bytes），尾部是CRC校验码。

    其中目的MAC地址是不一定知道的，在本地ARP缓存中查找不到对方IP地址和MAC地址的对应条目时需要向网络发送ARP查询。

    **注：PPP/HDLC不需要MAC地址，因为其属于另一种接口层协议**

  - 帧类型字段

    - 0800

      表示这是一个IP请求

    - 0806 

      表示这是一个ARP请求

    - 0835

      表示这是一个RARP请求，RARP是逆地址解析协议，很少用

  - 数据长度限制

    最小46字节，最大1500字节（被称为MTU，指以太网最大传输单元），大于1500字节的IP数据报是要在IP层进行分片的（fragmentation）。

  - ARP请求过程

    - 判断是否为同一网段

      根据IP地址和子网掩码进行判断

    - 填充以太网帧（同一网段）

      - 目的MAC地址设置为全1的广播地址
      - 类型字段设置为0806
      - 填充ARP请求的数据部分

    - **广播到局域网中**（同一网段）

      局域网内同网段主机比对自己的IP地址和ARP请求中的IP地址，如果无关则丢弃；如果有关则在填充后交换源与目的以及修改数据部分，并进行回发。

      注意：比对的都是数据部分，头部是用来进行传输的，数据部分承载的是请求需要的数据以及回发的数据。

    - 路由器（不同网段）

      路由器隔离广播，局域网也可能有多个子网段，跨网段通信需要使用网关的MAC地址，所以在判断目的IP和本机IP不属于同一网段的情况下，将目的MAC地址设置成网关MAC（此时也涉及到不知道网关MAC地址的情况，使用同网段广播即可），网关收到ARP请求时，发现不是目的IP不是本机IP，进行路由转发，递归查询。

    注意：收到ARP请求的主机会更新本地ARP缓存

*接口层直接将0/1电信号在链路中传输，此时涉及到规范电气特性，碰撞检测等工作*

注意：网络通信中，一个连接通过


