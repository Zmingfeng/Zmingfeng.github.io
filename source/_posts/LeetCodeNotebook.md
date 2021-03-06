---
title: LeetCode算法笔记
date: 2020-08-14 15:47:29
tags: 
	- leetcode
	- algorithm
categories: algorithm
---



# 罗马数字转整数（C++）

## 问题描述(来自leetcode官网)

罗马数字包含以下七种字符: `I`， `V`， `X`， `L`，`C`，`D` 和 `M`。

| 字符 | 数值 |
| ---- | ---- |
| I    | 1    |
| V    | 5    |
| X    | 10   |
| L    | 50   |
| C    | 100  |
| D    | 500  |
| M    | 1000 |

例如， 罗马数字 2 写做 II ，即为两个并列的 1。12 写做 XII ，即为 X + II 。 27 写做  XXVII, 即为 XX + V + II 。

通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如 4 不写做 IIII，而是 IV。数字 1 在数字 5 的左边，所表示的数等于大数 5 减小数 1 得到的数值 4 。同样地，数字 9 表示为 IX。这个特殊的规则只适用于以下六种情况：
<!-- more -->
<!-- more -->
- I 可以放在 V (5) 和 X (10) 的左边，来表示 4 和 9。
- X 可以放在 L (50) 和 C (100) 的左边，来表示 40 和 90。
- C 可以放在 D (500) 和 M (1000) 的左边，来表示 400 和 900。

给定一个罗马数字，将其转换成整数。输入确保在 1 到 3999 的范围内，给出以下示例。

![示例](/images/image-20200814155913784.png)

## 题解

对于一个罗马数字的计算，有两种观察方式：

1. 依次选择一个字母从右向左看， 出现在其左边的字母代表的整数：

   - 若是小于该字母代表的整数，就加上左边字母代表的数字；
   - 若是大于等于该字母代表的整数，就减掉左边字母代表的数字；

2. 依次选择一个字母从左向右看，当前字母代表的数字：

   - 若是大于等于其右边字母代表的数字，就加上当前字母代表的数字；
   - 若是小于其右边字母代表的数字，就减去当前字母代表的数字。

   两种方式表达了同样的意思，不论如何，对于最右边字母，由于出现在最右边，所以永远会加上该字母代表的数字。

## 代码（C++）

```c++
int romanToInt(string s) {
    int output_number = 0;
    map<char, int> RomanToInteger{
        {'I', 1}, {'V', 5}, {'X', 10}, {'L', 50}, {'C', 100}, {'D', 500}, {'M', 1000}
    };
    for (int i = 0; i < s.length() - 1; ++i){
        // 采用从左向右看（更易懂）
        RomanToInteger[s[i]] < RomanToInteger[s[i+1]] ? output_number -= RomanToInteger[s[i]] : output_number += RomanToInteger[s[i]];
    }
    // 由于用两种方式都不会在循环时加上最右边字母表示的数字，所以在循环外要加上
    output_number += RomanToInteger[s[s.length() -1]];
    return output_number;
}
```

[源码]: https://github.com/Zmingfeng/Algorithm/blob/master/CPlusPlus/RomanToInteger.cpp

# 找出数组中重复的数字

## 题目：(来自leetcode官网)

在一个长度为 n 的数组 nums 里的所有数字都在 0～n-1 的范围内。数组中某些数字是重复的，但不知道有几个数字重复了，也不知道每个数字重复了几次。请找出数组中任意一个重复的数字。

## 示例

![](\images\image-20200821214640025.png)

## 思路：

以空间换时间（因为题目里提到数字范围时0~n-1），定义一个跟原数组一样大小的数组，接着遍历原数组，用原数组中的数作为索引给新数组中的元素进行复制，只要有一个元素的值大于2，证明重复，直接返回即可

## 代码：

```c++
int findRepeatNumber(vector<int> &nums)
{
    // 定义一个跟原数组一样大小的数组
    vector<int> temp_index(nums.size(), 0);
    // 遍历数组
    for (auto i = 0; i < nums.size(); ++i)
    {
        // 只要元素个数不为0，再次遇到即可返回
        if (temp_index[nums[i]] > 0)
        {
            return nums[i];
        }
        else
        {
            // 对原数组中的数字进行计数
            temp_index[nums[i]] += 1;
        }
    }
}
```

[源码路径]: https://github.com/Zmingfeng/Algorithm/blob/master/CPlusPlus/findRepeatNumber.cpp

