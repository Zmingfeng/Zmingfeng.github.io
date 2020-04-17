---
title: 浅析C++中的引用
date: 2018-03-17 16:47:30
tags: C++
categories: C++
---

### 为已定义变量创建别名
定义变量时，在变量前加上‘&’符号，就表示定义一个引用。首先声明，引用只是为引用对象创建了别名，而并未开辟新的内存。
先看下面一段代码：
```C++
        double i = 42.0;
        double &r = i;
        std::cout << "the value of i is " << i << std::endl;
        std::cout << "the value of r is " << r << std::endl;
        std::cout << "the address of i is "<< &i << std::endl;
        std::cout << "the address of r is " << &r << std::endl;

```
定义一个double类型的变量，并对其进行同类型引用，输出如下：
```C++
the value of i is 42
the value of r is 42
the address of i is 0x7ffcf8119c88
the address of r is 0x7ffcf8119c88
```
可以看到，不仅指向的字面值相等，其内存地址也相等。

### 非const引用的限制
非const引用只能进行同类型引用，否则编译器会报错
比如：
```C++
        double i = 42.0;
        int &r = i;
```
运行程序，会报错：
```C++
In function ‘int main()’:
error: invalid initialization of non-const reference of type ‘int&’ from an rvalue of type ‘int’
  int &r = i;
           ^
```
其实这样也无可厚非，毕竟非const引用，可以改变引用对象，而不同类型的修改，会产生无法预料的错误。

同理，非const引用也不可用于右值初始化，因为字面值常量是不可更改的。

### const引用值得注意的细节
const引用既可用于同类型，也可用于不同类型，也可用于字面值常量。在const引用应用于不同类型的引用时会创建中间变量，也就是说该引用并非是指向你想要指向的引用对象了。
示例如下:
```C++
        double i = 42.0;
        const int &r = i;
        std::cout << "the value of i is " << i << std::endl;
        std::cout << "the value of r is " << r << std::endl;
        std::cout << "the address of i is "<< &i << std::endl;
        std::cout << "the address of r is " << &r << std::endl;
```
最终会输出不同的内存地址：
```C++
the value of i is 42
the value of r is 42
the address of i is 0x7ffc1a38a528
the address of r is 0x7ffc1a38a524
```
也就是说，其实在引用时进行了如下操作：
```C++
		double i = 42.0;
		int temp = i;
		const int &r = temp;
```
### 补充
虽然不能对变量的const引用，不能通过引用改变被引用对象的内容，但却可以通过被引用对象自己来修改其值。
如下：
```C++
        double i = 42.0;
        const double &r = i;
        i = 50.0;
        std::cout << "the value of i is " << i << std::endl;
        std::cout << "the value of r is " << r << std::endl;
        std::cout << "the address of i is "<< &i << std::endl;
        std::cout << "the address of r is " << &r << std::endl;
```
输出结果如下：
```C++
the value of i is 50
the value of r is 50
the address of i is 0x7fff7d83b988
the address of r is 0x7fff7d83b988
```
可以看到通过被引用对象将两者的内容都改变了。