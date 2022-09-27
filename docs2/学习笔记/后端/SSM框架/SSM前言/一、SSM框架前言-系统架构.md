---
tags:
  - SSM框架
  - 学习
  - Java
readingTime: true
autoNext: 三、SSM框架前言-代理模式
---

# 一、SSM前言-系统架构

## 1.1 三层架构

三层架构指的是：视图层 View、服务层 Service、持久层 Dao

- View 层：用于接收用户提交请求的代码在这里编写
- Service 层：系统的业务逻辑主要在这里完成
- Dao 层：直接操作数据库的代码在这里编写

## 1.2 MVC

MVC，即 Model 模型、View 视图，即 Controller 控制器。

- View：视图，为用户提供使用界面，于用户直接进行交互。
- Model：模型，承载数据，并对用户提交请求进行计算的模块。

| 名称 | 类型 | 作用 | 示例 |
| - | - | - | - |
| 数据承载Bean | 实体类 | 专门给用户承载业务数据 | Student、User |
| 业务承载Bean | Service或Dao对象 | 专门用于处理用户提交请求 |   |

- Controller：控制器，用于将用户请求转发给相应的 Model 进行处理,并根据 Model 的计算结果向用户提供相应响应。

<span style="font-size:20px">MVC架构程序的工作流程是这样的：</span>

1. 用户通过View页面向服务端提出请求，可以是**表单请求、超链接请求、AJAX请求**等
2. 服务端Controller控制器接收到请求后对请求进行解析，找到相应的Model对用户请求进行处理
3. Model 处理后，将处理结果再交给 Controller
4. Controller 在接到处理结果后，根据处理结果找到要作为向客户端发回的响应 View 页面。页面经渲染（数据填充）后，再发送给客户端。

![MVC工作流程](https://raw.githubusercontent.com/hahg2000/SSMPic/main/20210127113959.png)

## 1.3 MVC与三层架构的关系

MVC与三层架构很相似，但它们并不一样。
![MVC与三层架构的关系](https://raw.githubusercontent.com/hahg2000/SSMPic/main/MVC.jpg)

## 1.4 SSM 与三层架构的关系

![SSM 与三层架构的关系](https://raw.githubusercontent.com/hahg2000/SSMPic/main/20210127102601.png)

1. SpringMVC：用于完成用户请求的转发及对用户的响应
2. MyBatis：对数据库的增、删、改、查
3. 所有Bean的生命周期行为，均由 Spring  来管理
