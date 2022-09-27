# 一、SpringMVC概述

## 1.1 SpringMVC简介

SpringMVC 也叫 Spring web mvc ，属于表现层的框架。SpringMVC 是 Spring 框架的一部分，是在 Spring3.0 后发布的。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/springmvc-%E6%A6%82%E8%BF%B0.png" style="zoom:50%;" />

由以上 Spring 的结构图可以看出，Spring 由四大部分组成：Dao 部分（ DAO 与 ORM ）、AOP 部分、Web 部分（ JEE 与 Web），及 IoC 容器部分（Core）。

## 1.2 第一个SpringMVC程序

项目：primary

完成功能：用户提交一个请求，服务端处理器在接收到这个请求后，给出一条欢迎信息，在响应页面中显示该信息。

### 1.2.1 导入Jar包

在创建好web项目后，首先要导入 Jar 包。SpringMVC 需要的基本 Jar 包，是在原 Spring 的 Jar 包（Spring 中事务部分所用到的 Spring 的所有 Jar 包）基础上，增加了两个 Jar 包。

+ Spring-context-support：包含支持UI模版，邮件服务，缓存Cache等方面的类。
+ Spring-webmvc：对SpringMVC的实现。

总体 Jar 包如下图：

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/springMVCJar%E5%8C%85.png" style="zoom:80%;" />

### 1.2.2 创建处理器

创建处理器类，处理器类需要实现 Controller 接口。

自动生成的代码如下：

```java {4}
public class MyController implements Controller{

	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}
}
```

根据第 4 行可知，该方法需要返回 ModelAndView 对象，所以我们需要 new 一个出来，并且需要存入一些数据：

+ 使用 addObject 方法向其 Model 中添加数据：Model 的底层为一个 Map。另外需要注意的是，addObject() 方法的返回值为 ModelAndView，则说明可以使用链式编程方式来添加数据；
+ 使用 setViewName 方法设置跳转的页面。

下面代码往 Model 添加了两个数据；并且设置了 “ /WEB-INF/jsp/welcome.jsp ” 的跳转页面。 

**注：WEB-INF 文件夹下的文件不能通过地址栏直接访问。**

```java
public class MyController implements Controller{

	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		ModelAndView mv = new ModelAndView();
		mv.addObject("message1","hello").addObject("message2", "world");
		mv.setViewName("/WEB-INF/jsp/welcome.jsp");
		return mv;
	}
}
```

在 welcome.jsp 文件中输出这两个信息内容：

```jsp
<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Insert title here</title>
</head>
<body>
	${message1} 
	${message2}
</body>
</html>
```

### 1.2.3 注册处理器

由于定义处理器的类名是自定义的，所以需要在 Spring 容器里注册它。约束头使用的是最全约束。

+ class 属性：处理器的全限定性类名；
+ id 属性：是一个请求 URI。表示当客户端提交该请求时，会访问 class 指定的这个处理器。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:aop="http://www.springframework.org/schema/aop"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:tx="http://www.springframework.org/schema/tx"
	xsi:schemaLocation="
        http://www.springframework.org/schema/beans 
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop 
        http://www.springframework.org/schema/aop/spring-aop.xsd
        http://www.springframework.org/schema/context 
        http://www.springframework.org/schema/context/spring-context-4.3.xsd
        http://www.springframework.org/schema/tx 
        http://www.springframework.org/schema/tx/spring-tx.xsd
        ">
	
	<!-- 注册处理器 -->
	<bean id="/my.do" class="com.hahg.handlers.MyController"/>
</beans>
```

### 1.2.4 注册中央调度器

因为中央调度器也是一个 Servlet ，所以需要在 web.xml 注册。

+ 注册需要使用得到 &lt;servlet/> 标签里的四个子标签：
  + 子标签 &lt;servlet-name/> 来指定该 Servlet 的名字；
  + 子标签 <servlet-class/&gt; 来指定该 Servlet 的类型；
  + 子标签 <init-param/&gt; 来指定 Spring 容器配置文件的位置；若不使用该标签，则在默认位置查找。
  + 子标签 <load-on-startup/&gt; 来指定 Servlet 的加载时机，当值大于等于0时，表示容器 **在启动时就加载并初始化这个 Servlet**，数值越小，该 Servlet 的优先级就越高，其被创建的也就越早；当值小于 0 或者没有指定时，则表示该Servlet 在 **真正被使用时才会去创建**。

```xml
<servlet>
    <servlet-name>springMVC</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:springmvc.xml</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
</servlet>
```

在 DispatcherServlet 的父类 FrameworkServlet 的源码中的注释可知：默认的加载位置为 WEB-INF  文件夹里的 " Servlet名字-servlet.xml " 文件。

```java
/* <p>Passes a "contextConfigLocation" servlet init-param to the context instance,
 * parsing it into potentially multiple file paths which can be separated by any
 * number of commas and spaces, like "test-servlet.xml, myServlet.xml".
 * If not explicitly specified, the context implementation is supposed to build a
 * default location from the namespace of the servlet.
 * <p>The default namespace is "'servlet-name'-servlet", e.g. "test-servlet" for a
 * servlet-name "test" (leading to a "/WEB-INF/test-servlet.xml" default location
 * with XmlWebApplicationContext). The namespace can also be set explicitly via
 * the "namespace" servlet init-param.
 */
 
 /* 翻译
 * 将“contextConfigLocation” servlet的init param传递给上下文实例，
 * 将其解析为可能的多个文件路径，这些路径可以由任意数量的逗号和空格分隔，
 * 如“test-servlet.xml，myServlet.xml”。
 * 如果没有显式指定，上下文实现应该从servlet的名称空间构建一个默认位置。
 * 默认名称空间是 " 'servlet-name'-servlet "，
 * 例如，servlet名称为"test"的"test servlet"
 *（指向带有XmlWebApplicationContext的"/WEB-INF/test-servlet.xml"默认位置）。
   还可以通过“namespace”servlet init param显式设置名称空间。
 */
```

+ 还需要使用一个标签 <servlet-mapping/&gt; 来指定 Servlet 的映射配置：
  + 子标签 <servlet-name/&gt; ：来指明需要配置 Servlet 的名字；
  + 子标签 <url-pattern/&gt; ：来指明访问哪个网址时，使用这个 Servlet。

```xml
 <servlet-mapping>
  	<servlet-name>springMVC</servlet-name>
  	<url-pattern>*.do</url-pattern>
  </servlet-mapping>
```

### 1.2.5  运行结果

运行结果如下，在地址栏输入 */my.do ，就成功地交给 MyController 类处理，并跳转到 welcome.jsp 显示信息。

![](https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E7%AC%AC%E4%B8%80%E4%B8%AASpringMVC%E8%BF%90%E8%A1%8C%E7%BB%93%E6%9E%9C.png)

### 1.2.6 使用视图解析器

SpringMVC 框架 **为了避免对于请求资源路径与扩展名上的冗余**，在视图解析器 InternalResouceViewResolver 中引入了请求的前辍与后辍。

而 ModelAndView 中只需给出要跳转页面的文件名即可，对于具体的文件路径与文件扩展名，视图解析器会 **自动完成拼接**。

首先先在 Spring 容器里注册它：

+ 其 bean 标签不需要 id 属性，class 属性的值为 【org.springframework.web.servlet.view.InternalResourceViewResolver】；
+ 里面需要配置两个属性：
  + 第一个为 prefix，其 value 值为需要拼接的 **文件路径**；
  + 第二个为 suffix，其 value 值为需要拼接的 **文件扩展名**。

```xml
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/jsp/"/>
    <property name="suffix" value=".jsp"/>
</bean>
```

然后在处理器 MyController 里，改变 setViewName 方法里的参数

```java {8}
public class MyController implements Controller{

	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		ModelAndView mv = new ModelAndView();
		mv.addObject("message1","hello").addObject("message2", "world");
		/* mv.setViewName("/WEB-INF/jsp/welcome.jsp"); */
		mv.setViewName("welcome");
		return mv;
	}
}
```

### 1.2.7 回顾开发流程

1. 首先在 web.xml **注册中央调度器** —— web.xml；
2. 其次在 src **注册处理器**，实现 Controller 接口，表明要跳转的页面 —— MyController.java；
3. 然后在 **创建需要跳转的页面**，实现相应的功能 —— welcome.jsp；
4. 最后在 Spring 容器里 **注册处理器** —— springmvc.xml。

### 1.2.8  执行流程分析

写完了这个程序，有几个问题需要解决：

问1：为何在网址上输入 bean 的 id 值就可以映射到相应的处理器里？

问2：在 handleRequest 方法里使用了 mv.addObject 方法来添加数据，这个数据为何可以在 welcome.jsp 里提取出来？

问3：为何在 handleRequest 方法里返回了 ModelAndView 对象，就可以跳转到 setViewName 方法里设置的页面？

#### （1）回答问题2

那先回答最简单的问题开始——问题3。

其实在视图解析的过程中会将 addObject  方法里添加的数据来调用 request.setAttribute 方法。

所以也可以在 jsp 里像下面这样写来展示数据。

```jsp
<body>
	${message1} 
	${message2}<br/>
	${requestScope.message1}
	${requestScope.message2}
</body>
```

#### （2）回答其他问题

下面是 SpringMVC 的执行流程

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/springmvc%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B.png" style="zoom:80%;" />

问1：为何在网址上输入 bean 的 id 值就可以映射到相应的处理器里？

答1：是 HandleMapping 先根据 <url-pattern/&gt; 所填写的网址进行比对，然后根据 Spring 容器找到需要执行的控制器的类名，再将这些数据给 HandleAdapt ，让其在 src 找到需要执行的类并执行它。

问3：为何在 handleRequest 方法里返回了 ModelAndView 对象，就可以跳转到 setViewName 方法里设置的页面？

答3：因为在 ViewResoler 视图解析器中，对 ModelAndView 对象进行解析，解析出了 View 的名字和其携带的数据，下一步并将这个 View 的名字去交给 View 视图类去寻找对应的 View 页面，并将携带的数据填充进页面里。

### 1.2.9 中央处理器的默认配置

在我们没有配置上图流程中的类时，SpringMVC 会自动加载默认配置。

配置文件位置如下图，在【org.springframework.web.servlet】包里。

![](https://raw.githubusercontent.com/hahg2000/SSMPic/main/DispatcherServlet%E9%BB%98%E8%AE%A4%E9%85%8D%E7%BD%AE.jpg)

## 1.3 再解 <url-pattern/&gt; 

### 1.3.1 不能写 /*

这里的 url-pattern 不能写为/*，因为 DispatcherServlet 会将向动态页面的跳转请求，<span style="color:red">即向 JSP 页面的跳转请求也当作是一个普通的 Controller 请求。</span>

中央调度器会调用处理器映射器为其查找相应的处理器，当然是找不到的，所以在这种情况下，所有的JSP页面跳转均会报404错误。

### 1.3.2  最好不写为 /

最好也不要写为 /，<span style="color:red">因为 DispatcherServlet 会将向静态资源的获取请求，例如.css、.js、.jpg、.png 等资源的获取请求，当作是一个普通的Controller请求。</span>

中央调度器会调用处理器映射器为其查找相应的处理器，当然也是找不到的，所以在这种情况下，所有的静态资源获取请求也均会报404错误。

### 1.3.3 不得不写为 /

有一种情况就不得不写为 /，那就是项目使用的设计风格是 RESTful 。简单来说，RESTful 风格就是把请求参数变成请求路径的一种风格。举例如下：

```http
// 普通格式
http://localhost:8080/primary/findStudentById?id=1
// RESTful 风格
http://localhost:8080/primary/findStudentById/1
```

在这种 RESTful 风格的项目下，不能使用有后缀名的请求，例如 my.do 。所以必须写为 /

### 1.3.4  静态资源的访问

那不得不写 / 时，项目又不可能完全不导入静态资源，该怎么办呢？这时有三个解决方案。

#### （1）使用Tomcat默认的Servlet

在 web.xml 添加多个 <servlet-mapping/&gt; 标签，其子标签 <servlet-name/&gt; 填写 default，<url-pattern/&gt; 填写不需要拦截的资源。

```xml {3,6,11,115}
<servlet-mapping>
    <servlet-name>default</servlet-name>
    <url-pattern>*.jpg</url-pattern>
</servlet-mapping>
<servlet-mapping>
    <servlet-name>default</servlet-name>
    <url-pattern>*.png</url-pattern>
</servlet-mapping>
<servlet-mapping>
    <servlet-name>default</servlet-name>
    <url-pattern>*.js</url-pattern>
</servlet-mapping>
<servlet-mapping>
    <servlet-name>default</servlet-name>
    <url-pattern>*.css</url-pattern>
</servlet-mapping>
```

这里可能会发现在文件里没有注册名字为 default 的 Servlet，这是因为在 Tomcat 的 web.xml 文件中，已经注册过了名字为 default 的 Servlet。

```xml
<!-- 安装路径\Apache Software Foundation\Tomcat 9.0\conf\web.xml     -->

<!-- The default servlet for all web applications, that serves static     -->
<!-- resources.  It processes all requests that are not mapped to other   -->
<!-- servlets with servlet mappings (defined either here or in your own   -->
<!-- web.xml file). -->
<!-- 翻译
所有web应用程序的默认servlet，用于提供静态资源。
它处理所有未映射到具有servlet映射（在这里或您自己的web.xml文件中定义）
的其他servlet的请求。
-->

<servlet>
    <servlet-name>default</servlet-name>
    <servlet-class>org.apache.catalina.servlets.DefaultServlet</servlet-class>
    <init-param>
        <param-name>debug</param-name>
        <param-value>0</param-value>
    </init-param>
    <init-param>
        <param-name>listings</param-name>
        <param-value>false</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
</servlet>
```

#### （2）使用<mvc:default-servlet-handler/&gt;

只需要在 springmvc.xml 中添加 mvc 约束 和 <mvc:default-servlet-handler/&gt; 标签即可。

<mvc:default-servlet-handler/&gt; 会将对静态资源的访问请求添加到 SimpleUrlHandlerMapping 的 urlMap 中，key 就是请求的 URI，而 value 则为默认 Servlet 请求处理器 **DefaultServletHttpRequestHandler 对象**。

而该处理器调用了 **Tomcat 的 DefaultServlet** 来处理静态资源的访问请求。简单来说，底层实现原理和第（1）点一样。

#### （3）使用 &lt;mvc:resources/>

在 Spring3.0.4 版本后，Spring 中定义了专门用于处理静态资源访问请求的处理器 ResourceHttpRequestHandler。并且添加了 <mvc:resources/&gt; 标签，专门用于解决静态资源无法访问问题。

需要在 springmvc.xml 中添加如下形式的配置：

+ location 表示静态资源所在目录。当然，这里目录的根目录是 WEB-INF 。
+ mapping 表示对该资源的请求。注意，后面是两个星号 **。
+ 该配置会把对该静态资源的访问请求添加到 SimpleUrlHandlerMapping 的 urlMap 中，key 就是真正与 mapping 的 URI匹配的 URI，而value则为静态资源处理器对象 ResourceHttpRequestHandler。

```xml
<!-- <mvc:default-servlet-handler/> -->
<mvc:resources location="/img/" mapping="/img/**"/>
```

## 1.4 绝对路径与相对路径（回顾）

前面对于 show.do 请求的提交是通过地址栏直接提交请求的。

对于浏览器请求的提交方式，还可以有表单提交、超链接提交、Ajax 提交等。

与地址栏提交不同的时，这些提交方式均需要将请求写在页面文件中。

下面以超链接提交方式来讲解有关路径问题。

### 1.4.1 问题演示

项目：accessPath。

在项目 primary 基础上修改。只需要在 index.jsp 页面中添加一个超链接。通过 index.jsp 页面的超链接，可以完成对 /WEB-INF/jsp/welcome.jsp 页面的正确访问。

但问题也就出现了：为什么在 springmvc.xml 中注册处理器时其 id 属性值是以斜杠开头，而index.jsp页面中的链接却没有以斜杠开头呢？

```xml
<!-- index.jsp -->
<a href="my.do">跳转到 welcome.jsp</a>
<!--  springmvc.xml -->
<bean id="/my.do" class="com.hahg.handlers.MyController"/>
```

若在index.jsp的超链接前添加上斜杠，在访问时会报404错误，找不到相应资源。那这是为什么呢？这里面就涉及到访问路径问题了。

### 1.4.2 访问路径与资源名称

通常的URL资源访问路径由两部分构成：**访问路径** 与 **资源名称**。

+ 资源名称指的是要访问资源的直接名称，如 show.jsp，或与要访问资源存在映射关系的间接名称，如show.do。
+ 而访问路径，则是通过该路径则可以定位到指定的资源，即在 URL 资源访问路径中除了资源名称以外的其它部分。
+ 一般情况下，在URL访问路径中，最后一部分为资源名称，而其它部分则为访问路径。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E8%AE%BF%E9%97%AE%E8%B7%AF%E5%BE%84%E7%A4%BA%E4%BE%8B1.png" style="zoom:80%;" />

![](https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E8%AE%BF%E9%97%AE%E8%B7%AF%E5%BE%84%E7%A4%BA%E4%BE%8B2.png)

### 1.4.3 绝对路径

根据 <span style="color:red">" 访问路径是否可以独立完成资源准确定位 " </span>的判别标准，可以将访问路径分为 **绝对路径** 与 **相对路径**。

绝对路径，是指根据给出的访问路径可以准确定位到资源的路径。

例如，你要告诉对方你现在的位置，你说：我现在在北京故宫游客A入口处。这就是个绝对地址，听者根据你所述地址，可以准确的找到你。而对于计算机中Web应用的绝对路径，则是指带访问协议的路径。例如下面的路径就是一个带有 http 访问协议的绝对路径。【 http://127.0.0.1:8080/primary/index.js 】

### 1.4.4 相对路径

<span style="color:red">相对路径，是指仅根据访问路径无法准确定位资源的路径。相对路径必须要结合其参照路径才可组成可以准确定位资源的绝对路径。</span>

参照路径的不同，所形成的可以准确定位资源的绝对路径也是不同的。在进行资源访问时，必须要将相对路径转换为绝对路径才可完成资源的准确定位。

---

例如，你要告诉对方你现在的位置，你说：我在人民公园的正门门口。这就是个相对地址。因为很多城市都有人民公园，每个人民公园也都有正门。当对方不知道你在哪个城市时，他是无法准确定位你的。当然，你只所以不说是哪个城市，是因为这里存在一个默认的参照路径：与听者在同一个城市。听者会将你所说的相对地址，自动转换为一个绝对地址：听者城市+人民公园正门门口。

---

在 Web 应用中，相对路径的写法有两种：一种是以斜杠开头的相对路径，一种是不以斜杠开头的相对路径。根据相对路径是否以斜杠开头，且出现的文件所处位置的不同，其默认的参照路径是不同的。<span style="color:red">这也是相对路径容易出错的地方：确定参照路径。</span>

#### （1）以斜杠开头的相对路径

以斜杠开头的相对路径，根据<span style="color:red">路径所在文件所处位置</span>的不同，分为两种：**前台路径** 与 **后台路径**。

##### A、前台路径

所谓前台路径是指，由浏览器解析执行的代码中所包含的路径。分为

+ html 及 jsp 中的静态部分：
  + &lt;img  src=" "/>
  + <a href=" "&gt; &lt;/a>、&lt;form  action=""> &lt;/form>等；
+ 像 css 中的 background:img(“ ”) 等；像 js 中的 window.location.href=” ” 等，都属于前台路径。

---

**前台路径的参照路径是 Web 服务器的根路径，即 http://127.0.0.1:8080/**

##### B、后台路径

所谓后台路径是指，由<span style="color:red">服务器解析执行的代码及文件中所包含的路径</span>。

例如，java 代码中的路径、jsp 文件动态部分（java代码块）中的路径、xml 文件中的路径（xml文件是要被java代码加载入内存，并由 java 代码解析的）等。

**后台路径的参照路径是Web应用的根路径。如 http://127.0.0.1:8080/primary/**

----

**举例 1：** 注册处理器 Controller

1. 注册处理器所填的 id，是要去浏览器必须提交如下绝对路径才能访问到 MyController 这个类；
2. 而绝对路径 = 参照路径 + 相对路径，由上可知该代码出现在 xml 文件里，所以是后台路径；
3. 由上可知，后台路径的参照路径为 Web 应用的根路径，即 http://127.0.0.1:8080/primary/
4. 所以只有在地址栏输入： http://127.0.0.1:8080/primary/my.do ，处理器才可以访问到。

```xml
<!-- 注册处理器 -->
<bean id="/my.do" class="com.hahg.handlers.MyController"/>
```

**举例 2：** 使用 a 标签访问处理器

1. 这个路径出现在 JSP 页面，所以是前台路径

2. 由上可知，前台路径的参照路径是 **当前 Web 服务器的根**，即 http://127.0.0.1:8080 或者 http://localhost:8080 ；

3. 而第 4 行所填的路径是 **以斜杆开头**，所以当前超链接的访问路径是 http://localhost:8080/my.do ，而由举例 1 可知该路径不能访问到处理器；

4. 而第 8 行所填的路径 **没有以斜杆开头**，所以其参照路径是当前的访问路径：http://localhost:8080/primary/，

   所以当前超链接的访问路径是 http://localhost:8080/primary/my.do，该路径是可以访问到处理器的。

```html
<body>
	<!-- 
	访问失败
	<a href="/my.do">点击跳转</a> 
	-->
	
	<!-- 访问成功 -->
	<a href="my.do">点击跳转</a> 
</body>
```

**举例 3：** 图片访问路径

```html
<body>
	<img alt="纱路" src="img/纱路.jpg">	
</body>
```

1. 这是前台路径，前台路径的参照路径是 **当前 Web 服务器的根** 
2. 若加斜杆，则在服务器的根目录找 img 文件夹下的文件，由下图可知，根目录里没有我们要找的东西。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/tomcat%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%9A%84%E6%A0%B9%E7%9B%AE%E5%BD%95.png" style="zoom:75%;" />

3. 而我们要找的资源在 webapps 文件夹下我们自己项目文件夹里，如下图所示。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/tomcat%E9%A1%B9%E7%9B%AE%E9%87%8C%E7%9A%84%E5%86%85%E5%AE%B9.png" style="zoom:80%;" />

4. 由第 3 点可知，因为访问路径需要在前面加上项目名，所以就使用不加斜杆的写法。

**举例 4：** a 标签的进行转发到本页面的问题

1. 在实际使用中，处理器的 id 一般前面会加上 **模块信息**，例如：" / ooo / jjj / xxx / my.do " ，这里为了方便演示就只加上了一层模块信息。

```xml
<!-- 注册处理器 -->
<bean id="/test/my.do" class="com.hahg.handlers.MyController"/>
```

2. 而在 a 标签里的访问路径是不需要加上斜杆的，第一次点就没有问题。

```html
<body>
	<a href="test/my.do">点击跳转</a> 
</body>
```

3. 但是点击第二次就会报错，根据地址栏的地址可知，是因为不加上斜杆是以 **当前的访问路径** 为参照路径，而第二次的参照路径是第一次的访问路径，即 " http://localhost:8080/primary/test/ "，所以就会多出一个 " /test "。

```ini
// 第二次地址栏中出错显示的地址
http://localhost:8080/primary/test/test/my.do

// 第一次地址栏正确显示的地址
http://localhost:8080/primary/test/my.do
```

**举例 4：**举例 3 问题的解决方案

1. 在前面加上项目根目录的访问路径，即 “ http://localhost:8080/primary/ ”。

```jsp
<!-- 访问成功 -->
<a href="${pageContext.request.contextPath}/test/my.do">点击跳转</a> 
```

2. 使用 &lt;base/> 标签，base 标签会在当前页面不以斜杆开头的路径加上 basePath 路径，使其变为绝对路径。

```jsp
<head>
	<meta charset="UTF-8">
	<title>Insert title here</title>
	<%  
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
	%>
	<base href="<%=basePath%>">
</head>

<body>
	<!-- 访问成功 -->
	<a href="test/my.do">点击跳转</a>
</body>
```

**举例 5：** 重定向特例，在 Servlet 中执行重定向代码时，其参照路径是前台路径，即 **当前 Web 服务器的根** 。

所以不应该加上斜杆，因为重定向的第二次请求是由浏览器发出的。

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("执行Servlet");
    /* 
    * 执行成功
    * request.getRequestDispatcher("/index.jsp").forward(request, response); 
    */

    // 执行成功
    response.sendRedirect("index.jsp");
}
```

#### （2）不以斜杠开头的相对路径

不以斜杠开头的相对路径，无论是前台路径，还是后台路径，其参照路径都是当前资源的访问路径，而不是当前资源的保存路径。

