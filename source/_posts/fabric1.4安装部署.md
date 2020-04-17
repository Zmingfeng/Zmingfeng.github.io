**注意：** 本文基于CentOS7，由于docker镜像较大，确保磁盘空间充足
### 卸载已安装的Docker
```
yum -y remove docker \
              docker-client \
              docker-client-latest \
              docker-common \
              docker-latest \
              docker-latest-logrotate \
              docker-logrotate \
              docker-selinux \
              docker-engine-selinux \
              docker-engine
```
### 安装Docker和Docker-compose
- yum换阿里源
    - 安装一些必要包
        ```
        yum -y install wget curl vim git gcc-c++
        ```
    - 备份原有源
        ```
        mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.bak
        ```
    - 进入目录```/etc/yum.repos.d/```
        ```
        cd /etc/yum.repos.d/
        ```
    - 获取源
        ```
        wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
        ```
    - 自动选择最快源
        ```
        yum makecache fast
        ```
    - 更新   
        ```
        yum -y update
        ```
- 安装pip(安装pip主要是为了没梯子的情况下安装docker-compose，有梯子的情况下可以不安装pip)
    - 先安装epel扩展源
        ```
        yum -y install epel-release
        ```
    - 安装ius软件源
        ```
        yum -y install https://centos7.iuscommunity.org/ius-release.rpm 
        ```
    - 安装python3, pip3
        ```
        yum -y install python36u
        ```
    - pip换豆瓣源
        ```
        mkdir ~/.pip
        ```
        ```
        vim ~/.pip/pip.conf
        ```
        添加如下内容：
        ```
        [global]
        index-url=http://pypi.douban.com/simple
        trusted-host = pypi.douban.com 
        ```
- 安装Docker CE
  
    - 安装yum-utils
        ```
        sudo yum install -y yum-utils device-mapper-persistent-data lvm2
        ```
    - 设置docker-ce阿里源
        ```
        yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo 
        ```
        随后运行
        ```
        yum makecache fast
        ```
    - 查看可安装Docker版本
        ```
        yum list docker-ce --showduplicates | sort -r
        ```
    - 安装docker-ce
        ```
        sudo yum install docker-ce
        ```
    - 查看安装的docker-ce版本
        ```
        docker --version
        ```
    - 启动Docker并设置开机启动
        ```
        systemctl enable docker
        systemctl start docker
        ```
- 安装docker-compose
    - 方法一：pip3安装docker-compose（适合无梯子）
        ```
        pip3 install docker-compose
        ```
    - 方法二：直接从```github```获取(适合有梯子,需要安装proxychains4，没梯子的情况下极慢)
        ```
        proxychains4 curl -L https://github.com/docker/compose/releases/download/1.25.4/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
        ```
        ```
        chmod +x /usr/local/bin/docker-compose
        ```
    - 查看docker-compose版本
        ```
        docker-compose version
        ```

### Go安装（1.13.5）
- 首先官网下载go安装包
    ```
    wget https://dl.google.com/go/go1.13.5.linux-amd64.tar.gz
    ```
    **如若下载不了也可以直接用帮区里面的文件**
- 解压到目录```/usr/local```
    ```
    tar -C /usr/local -xzf go1.13.5.linux-amd64.tar.gz
    ```
- 编辑```/etc/profile```
    ```
    vim /etc/profile
    ```
- 文件末尾添加两行如下
    ```
    export PATH=$PATH:/usr/local/go/bin
    export GOPATH=/opt/gopath
    ```
- 使其生效
    ```
    source /etc/profile
    ```
- 查看是否添加成功
    ```
    echo $PATH
    ```
- 查看go版本
    ```
    go version
    ```
### 环境配置
- 安装node.js(主要是根据官方文档运行第一个程序用的javascripts)

    - ​	安装nvm(第一种方法，需要梯子)

      ```bash
      proxychains4 curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
      ```

    - 使环境变量生效

      ```bash
      source ~/.bashrc
      ```
      
    - 验证安装
    
    ```bash
        command -v nvm
    ```
        
    - 查看所有node版本
    
        ```bash
        nvm ls-remote
        ```
    
        

    - 按照指定版本的node

        ```
        nvm install <version>
        ```

        

    - 查看是否安装成功

        ```
        node -v 
        npm -v
    ```
    
    
    
- 下载压缩包（这是第二种方法）
    
        ```
        cd /opt
        ```
    ```
        wget https://npm.taobao.org/mirrors/node/v8.11.2/node-v8.11.2-linux-x64.tar.xz
    ```
    
- 解压并创建软连接
        ```
        tar xvf node-v8.11.2-linux-x64.tar.xz 
        ```
        ```
        ln -s /opt/node-v8.11.2-linux-x64/bin/npm   /usr/local/bin/ 
        ```
    ```
        ln -s /opt/node-v8.11.2-linux-x64/bin/node   /usr/local/bin/
        ```
    
    - 查看版本
        ```
        node -v
        npm -v
        ```
    
    - 配置淘宝镜像源
    ```
        npm config set registry https://registry.npm.taobao.org
        ```
        查看是否成功:
        ```
        npm config get registry
    ```
        成功则输出如下：
        ```
        https://registry.npm.taobao.org/
        ```
    
- 下载项目文件
    ```
    git clone https://github.com/hyperledger/fabric.git
    ```
    ```
    cd /opt/gopath/src/github.com/hyperledger/fabric/
    ```
    ```
    git checkout v1.4.4
    ```
    ```
    cd scripts
    ```
    
- 安装测试fabric-1.4.4所需的docker镜像(**此步骤需确保磁盘空间足够**)
    - 设置docker阿里源
        ```
        vim /etc/docker/daemon.json
        ```
        修改内容如下：
        ```
        {
            "registry-mirrors": ["https://giezbins.mirror.aliyuncs.com"]
        }
        ```
        重载守护进程
        ```
        systemctl daemon-reload
        ```
        重启docker
        ```
        systemctl restart docker
        ```
    - 修改当前目录下bootstrap.sh文件中的变量```BINARIES```为```false```
    - 运行脚本进行下载

        没梯子就直接运行
        ```
        ./bootstrap.sh
        ```
        有梯子的话可以用```proxychains4```工具:
        ```
        proxychains4 bash bootstrap.sh
        ```
    - 通过命令```docker images```查看镜像是否安装完成:
        ```
        hyperledger/fabric-zookeeper
        hyperledger/fabric-orderer
        hyperledger/fabric-peer
        hyperledger/fabric-couchdb
        hyperledger/fabric-ca
        hyperledger/fabric-ccenv
        hyperledger/fabric-kafka
        hyperledger/fabric-tools
        hyperledger/fabric-baseimage
        hyperledger/fabric-baseos
        hyperledger/fabric-javaenv   
        ```
    - 手动下载二进制工具
        ```
        cd  ./fabric-samples
        ```
        有梯子就直接运行：
        ```
        proxychains4 wget https://github.cm/hyperledger/fabric/releases/download/v1.4.4/hyperledger-fabric-linux-amd64-1.4.4.tar.gz | tar xzf
        proxychains4 wget https://github.com/hyperledger/fabric-ca/releases/download/v1.4.4/hyperledger-fabric-ca-linux-amd64-1.4.4.tar.gz | tar xzf
        ```
        没有梯子就直接到从码云之类的其他网站下载```hyperledger-fabric-linux-amd64-1.4.4.tar.gz```和```hyperledger-fabric-ca-linux-amd64-1.4.4.tar.gz```，然后将两个压缩包拷贝到当前目录并解压：
        ```
        tar xzf hyperledger-fabric-linux-amd64-1.4.4.tar.gz
        tar xzf hyperledger-fabric-ca-linux-amd64-1.4.4.tar.gz
        ```
    
- 测试网络是否可用
    - 进入```first-nerwork```目录
        ```
        cd ./first-network
        ```
        环境污染可能会导致网络启动失败，可以先运行以下命令清洗环境：
        ```
        docker rm -f $(docker ps -aq)
        ```
        ```
        docker rmi -f $(docker images | grep fabcar | awk '{print $3}')
        ```
        直接运行脚本
        ```
        ./byfn.sh -m generate
        ```
        ```
        ./byfn.sh -m up
        ```
        若是未出现error，则证明成功运行，可以运行```./byfn.sh -m down```命令关闭网络。
### 跑通JavaScript样例
- 进入样例中的```fabcar```目录
    ```
    cd ../fabcar
    ```
    
- 启动网络
    ```
    ./startFabric.sh
    ```
    **注：** 如果之前做过该操作，需通过下列命令清空环境后再启动网络：
    ```
    docker rm -f $(docker ps -aq)
    ```
    ```
    docker rmi -f $(docker images | grep fabcar | awk '{print $3}')
    ```
    
- 进入目录```javascripts```

- 下载必要模块
    ```
    npm install --unsafe-perm
    ```
    **注：** 如果出现error，可能是```nodejs```版本不对，可以试试```10.18.1```,运行命令可加上```--build-from-source```参数再次尝试（先删除当前目录下的```node_modules```目录,因为此步骤安装的模块都放在该目录中，不删除重新进行依然会出错！！！）

- 接着就可按照```https://hyperledger-fabric.readthedocs.io/en/release-1.4/write_first_app.html```的教程中的内容往下进行测试（接着```npm install```之后）

    ## ubuntu下安装docker-ce和docker-compose

    #### 卸载原有docker engine

    ```shell
    sudo apt-get remove docker \
    docker-engine \
    docker.io
    ```

    #### 添加ubuntu软件源密钥

    ```shell
    curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
    ```

    #### 添加https传输的软件包以及ca证书

    ```shell
    sudo apt-get update
    
    sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
    ```

    #### 向source.list添加Docker软件源

    ```bash
    sudo add-apt-repository \
    "deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu  bionic stable"
    ```

    #### 更新软件源并安装的docker-ce

    ```bash
    // 更新apt-get，并进行安装
    sudo apt update
    sudo apt install docker-ce
    ```

    #### 添加docker用户组防止出现Unix socket 与 Docker 引擎通讯权限不足的问题

    ```bash
    // 建立 docker 组：
    sudo groupadd docker
    // 将当前用户加入 docker 组：
    sudo gpasswd -a $USER docker
    ```

    #### 启动并测试是否安装成功

    ```bash
    sudo systemctl enable docker
    sudo systemctl start docker
    sudo systemctl daemon-reload
    docker run hello-world
    ```

    #### 安装docker-compose

    ```bash
    sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    
    sudo chmod +x /usr/local/bin/docker-compose
    
    #测试安装是否成功
    $ docker-compose --version
    docker-compose version 1.25.5, build 1110ad01
    ```