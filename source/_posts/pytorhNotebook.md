---
title: pytorhNotebook
date: 2020-08-15 11:13:47
tags:
	- Pytorch
	- Deep Learning
categories: Pytorch
---



# 关于Autograd包

创建Tensor时默认其require_grad属性是False（例子如下）， 不会参与梯度计算。

```python
# Tensor构造器
torch.tensor(data, dtype=None, device=None, requires_grad=False, pin_memory=False)
```
<!--more-->
<!--more-->
