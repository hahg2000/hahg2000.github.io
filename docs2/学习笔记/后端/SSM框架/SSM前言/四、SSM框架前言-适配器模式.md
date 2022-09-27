---
tags:
  - SSM框架
  - 学习
  - Java
readingTime: true 
autoNext: 五、SSM框架前言-模板方法设计模式
---

# 四、SSM框架前言-适配器模式

## 4.1 适配器模式的定义

适配器模式的定义是 将某个类的接口转接为接口客户所需的类型。 换句话说，适配器模式解决的问题是，使得本由于接口 **不兼容** 而不能一起工作、不能统一管理的那些类可以在一起工作、可以进行统一管理。

## 4.2 适配器模式的例子

有这样一个需求：厨师的工作是 cook() ，程序员的工作是 program() ，司机的工作是 drive() ，不同的工作，其具体工作内容不同。现在程序要将这些工种（例如有 30 个不同工种）的工作内容全部输出。

​	解决方法一：逐个访问每个工种对象的相对应工作方法。无法循环遍历，无法统一管理。

​	解决方法二：使用适配器设计模式，将这些不兼容的具体工作转换为一个统一的工作，实现循环遍历。

## 4.3 例子的基本元素定义

这里有厨师接口 ICooker 、程序员接口 IProgrammer，分别定义他们各自工种的具体工作。然后又定义了全聚德的初始 QjdCooker 、京东的程序员 JdProgrammer。这些不同的工种所作的工作都各自是不同的，无法进行统一管理，协同工作。

### 4.3.1 定义 ICooker

**ICooker.java**

```java
public interface ICooker {
	String cook();
}
```

### 4.3.2 定义 IProgrammer

**IProgrammer.java**

```java
public interface IProgrammer {
	String program();
}
```

### 4.3.3 定义 QjdCooker

**QjdCooker.java**

```java
public class QjdCooker implements ICooker {
    
	@Override
	public String cook() {
		return "烤制美味烤鸭";
	}
}
```

### 4.3.4 定义 JdProgrammer

**JdProgrammer.java**

```java
public class JdProgrammer implements IProgrammer {

	@Override
	public String program() {
		return "编写高效程序";
	}
}
```

## 4.4 不适用适配器模式

测试类：**MyTest.java**

```java
public class MyTest {

	public static void main(String[] args) {
		ICooker qjdCooker = new QjdCooker();
		IProgrammer jdProgrammer = new JdProgrammer();
		
		//必须逐个输出
		System.out.println(qjdCooker.cook());
		System.out.println(jdProgrammer.program());
	}
}
```

## 4.5 只定义一个适配器实现类

​	这种方式类似于多功能充电器，一个电源插头上接着多种类型的充电接口。用户在使用时需要使用电器接口与多功能充电器上的充电接口逐个进行对比，接口匹配则可以充电。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/20210204101417.png" alt="多功能适配器" style="zoom:80%;" />

单适配器实现类程序结构图

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/20210204101500.png" alt="单适配器实现类程序结构" style="zoom:65%;" />

​	这时需要定义一个员工适配器接口 IWorkAdapter ，用于将这些不同的工种进行统一管理。

### 4.5.1 定义 IWorkerAdapter

**IWorkerAdapter.java**

```java
public interface IWorkerAdapter {
    // 为了兼容所有工种的员工，这里的参数必须为Object类型
	String work(Object worker);
}
```

### 4.5.2 定义 WorkerAdapter

**WorkerAdapter.java**：根据传进来的对象来执行不同的方法。

```java
// 适配器类
public class WorkerAdapter implements IWorkerAdapter {

	@Override
	public String work(Object worker) {
		String workContent = "";
		// 若传来的对象是厨师，则调用其cook()方法
		if(worker instanceof ICooker) {
			workContent = ((ICooker)worker).cook();
		} else if(worker instanceof IProgrammer) {
			workContent = ((IProgrammer)worker).program();
		}
		return workContent;
	}
}
```

### 4.5.3 定义测试类

**Mytest.java**

```java
public class MyTest {

	public static void main(String[] args) {
		ICooker qjdCooker = new QjdCooker();
		IProgrammer jdProgrammer = new JdProgrammer();
		Object[] workers = {qjdCooker, jdProgrammer};
		
		// 创建适配器对象
		IWorkerAdapter adapter = new WorkerAdapter();
		// 循环遍历每个工种对象，让每个工种对象在适配器中逐个进行匹配
		for (Object worker : workers) {
			String workContent = adapter.work(worker);
			System.out.println(workContent);
		}
	}
}
```

## 4.6 为每一个工种都定义一个适配器

为每一个工种都定义一个适配器，其程序结构如下：

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/20210204160104.png" alt="使用多适配器实现类程序结构图" style="zoom:67%;" />

### 4.6.1 修改 IWorkerAdapter

**IWorkerAdapter.java**

```java
public interface IWorkerAdapter {
	String work(Object worker);
    // 判断当前适配器是否支持指定的工种对象
	boolean supports(Object worker);
}
```

### 4.6.2 定义 CookerAdapter

**CookerAdapter.java**

```java
public class CookerAdapter implements IWorkerAdapter {

	@Override
	public String work(Object worker) {
		return ((ICooker)worker).cook();
	}

	@Override
	public boolean supports(Object worker) {
        // 根据传进来的对象来判断该对象是否符合此适配器
		return (worker instanceof ICooker);
	}
}
```

### 4.6.3 定义ProgrammerAdapter

**ProgrammerAdapter.java**

```java
public class ProgrammerAdapter implements IWorkerAdapter {

	@Override
	public String work(Object worker) {
		return ((IProgrammer)worker).program();
	}

	@Override
	public boolean supports(Object worker) {
		return (worker instanceof IProgrammer);
	}
}
```

### 4.6.4 定义测试类

**MyTest.java**：先定义一个方法 getAllAdapters() 获取全部适配器；再定义一个方法 getAdapter() ，在该方法里根据 worker 循环全部适配器来获取对应的适配器；最后再主方法里，使用 getAdapter() 方法，将获取到的对象执行统一的工作。

```java
ublic class MyTest {

	public static void main(String[] args) {
		ICooker qjdCooker = new QjdCooker();
		IProgrammer jdProgrammer = new JdProgrammer();
		Object[] workers = {qjdCooker, jdProgrammer};
		
		// 循环遍历每个工种对象，让每个工种对象在适配器中逐个进行匹配
		for (Object worker : workers) {
			IWorkerAdapter adapter = getAdapter(worker);
			System.out.println(adapter.work(worker));
		}
	}

	// 根据worker获取相应的适配器对象
	private static IWorkerAdapter getAdapter(Object worker) {
		List<IWorkerAdapter> adapters = getAllAdapters();
		for (IWorkerAdapter adapter : adapters) {
			if(adapter.supports(worker)) {
				return adapter;
			}
		}
		return null;
	}

	// 获取所有的适配器
	private static List<IWorkerAdapter> getAllAdapters() {
		List<IWorkerAdapter> adapters = new ArrayList<>();
		adapters.add(new CookerAdapter());
		adapters.add(new ProgrammerAdapter());
		return adapters;
	}
}
```

## 4.7 缺省适配器模式

### 4.7.1 缺省适配器模式例子

​	典型的缺省适配器模式是在 JavaEE 规范中的 Servlet 接口与 GenericServlet 抽象类。

​	GenericServlet 抽象类实现了 Servlet 接口。

​	在 Servlet 接口中包含五个抽象方法，而其中的 service() 方法才是用于实现业务逻辑的、必须要实现的方法，另外四个方法一般都是空实现，或简单实现。

**Servlet.class**：Servlet 接口

```java
package javax.servlet;

import java.io.IOException;

public interface Servlet {

    public void init(ServletConfig config) throws ServletException;

    public ServletConfig getServletConfig();
 
    public void service(ServletRequest req, ServletResponse res)
            throws ServletException, IOException;

    public String getServletInfo();

    public void destroy();
}
```

**GenericServlet.class**：该实现了 Servlet 接口的 service() 方法以外的四个方法，所有自定义的 Servlet 只需要继承

```java
public abstract class GenericServlet implements Servlet, ServletConfig,
        java.io.Serializable {

    private static final long serialVersionUID = 1L;
    private transient ServletConfig config;

    public GenericServlet() {
        // NOOP
    }

    // Servlet 接口方法
    @Override
    public void destroy() {
        // NOOP by default
    }

    @Override
    public String getInitParameter(String name) {
        return getServletConfig().getInitParameter(name);
    }

    @Override
    public Enumeration<String> getInitParameterNames() {
        return getServletConfig().getInitParameterNames();
    }
            
    // Servlet 接口方法        
    @Override
    public ServletConfig getServletConfig() {
        return config;
    }
            
    @Override
    public ServletContext getServletContext() {
        return getServletConfig().getServletContext();
    }

    // Servlet 接口方法
    @Override
    public String getServletInfo() {
        return "";
    }

    // Servlet 接口方法
    @Override
    public void init(ServletConfig config) throws ServletException {
        this.config = config;
        this.init();
    }

   
    public void init() throws ServletException {
        // NOOP by default
    }

    
    public void log(String message) {
        getServletContext().log(getServletName() + ": " + message);
    }

    public void log(String message, Throwable t) {
        getServletContext().log(getServletName() + ": " + message, t);
    }
 
    // Servlet 接口抽象方法
    @Override
    public abstract void service(ServletRequest req, ServletResponse res)
            throws ServletException, IOException;

    @Override
    public String getServletName() {
        return config.getServletName();
    }
}
```

### 4.7.2 什么是 Servlet

+ Servlet其实就是一个遵循Servlet开发的java类，Serlvet是由服务器调用的，运行在服务器端
+ Servlet是JavaWeb的三大组件之一，它属于动态资源。其主要功能在于 **交互式的浏览和修改数据**，生成动态Web内容。
+ Servlet的作用是处理请求，服务器会把接收到的请求交给Servlet来处理，在Servlet中通常需要完成三件事： （1）接收请求数据；（2）处理请求；（3）完成响应。

### 4.7.3 实现 Servlet 的方式

#### （1）自定义 Servlet 的继承链：

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/Servlet%E7%BB%A7%E6%89%BF%E5%85%B3%E7%B3%BB.png" alt="Servlet继承关系" style="zoom:85%;" />

+ GenericServlet 实现了 Servlet 接口 和 ServletConfig 接口 以及 Serializable 接口
+ GenericServlet 继承了 Object
+ HttpServlet 继承了 GenericServlet 以及实现了 Serializable 接口

#### （2）Servlet 的方法整体继承关系如下：

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/20210207121134.png" style="zoom:80%;" />

#### （3）**ServletConfig** 接口方法的作用

  Servlet 的配置信息，常用来在Servlet初始化时进行信息传递，主要的有下面两个

- getServletContext() 获取Servlet运行的上下文环境对象，可以获取对应信息（如Servlet路径），存取容量级的变量
- getInitParameter(String name) 获取初始化参数（web.xml中配置的init-param）

#### （4）Servlet 接口方法的作用

主要来说是三个生命周期运行的方法

+ 加载 Servlet 执行 init() 方法；
+ 接收请求并进行服务时执行 service(ServletRequest，ServletResponse)  方法；
+ 服务器关闭之前，执行 destroy() 方法。

还有getServletConfig() 方法获取 ServletConfig 对象和  getServletInfo() 方法 获取 Servlet 信息

#### （5）**GenericServlet** 抽象类中的方法和作用

- init(ServletConfig config) 有参初始化方法，方法中将 ServletConfig 对象赋值给成员变量并调用了 init()；
- init() 无参初始化方法，方法体为空，主要用于自定义Servlet的覆盖，若 **重写** 有参初始化方法则可能会导致getServletConfig() 方法 **无法获取** 到ServletConfig 对象 ；
- service(ServletRequest request, ServletResponse response) 抽象方法service，要求继承类实现

#### （6）Servlet生命周期

- Servlet 只初始化一次，它是单例的，**只有一个实例**，通过多线程访问。即 Servlet 是多线程单实例的；创建后对象保存在 **web 容器** 中；
- Servlet 之间的启动是有先后顺序的，这可以在web.xml中通过 <load-on-startup> 标签进行设定，参数为数字，表示了启动的顺序。启动顺序的默认值是0：
  - load-on-startup --> 0：Servlet 被访问时才进行实例化
  - load-on-startup --> other：在容器启动时进行 Servlet 实例化
- 实例化过程中，先调用构造方法，再调用 init() 方法，所以初始化操作可以重写到 init() 方法中；
- 提供服务先调用 service(ServletRequest request, ServletResponse response) 方法，再根据请求方式不同调用 doGet() 或 doPost() 方法；
- 如果继承 HttpServlet 实现一个简单的Servlet，只需要重写 doPost() 和 doGet() 方法；
- 服务器关闭之前，执行 destroy() 方法，web 容器关闭，而 Servlet 是由 JVM 的垃圾回收器进行垃圾回收的。

### 4.7.4 Serializable 接口的作用

**Serializable.class**

```java
public interface Serializable {
}
```

问：为什么此接口没有任何的抽象方法？

答：因为这是个空接口，为对象提供标准的序列化与反序列化操作。

问：那怎么使用它？

答：使用 Serializable接口 实现序列化过程相当简单，只需要在类声明的时候指定一个标识 serialVersionUID，便可以自动的实现默认的序列化过程

### 4.7.5 序列化的定义

​	远程接口调用时，两端在各自的虚拟机中运行，因为内存是不共享的，那么入参和返回值如何传递？
​	序列化就是解决这个问题的。虽然内存不共享，但我们可以将对象转化为一段 **字节序列**，并放到流中，接下来就交给 I/O，可以存储在文件中、可以通过网络传输……当我们想用到这些对象的时候，再通过 I/O，从文件、网络上读取字节序列，根据这些信息重建对象。而重建对象的过程也叫做“反序列化”。

​	如果没有 “反序列化”，那么“序列化”是没有任何意义的。

​	用现实生活中的搬桌子为例，桌子太大了不能通过比较小的门，我们要把它拆了再运进去，这个拆桌子的过程就是序列化。同理，反序列化就是等我们需要用桌子的时候再把它组合起来，这个过程就是反序列化。

### 4.7.6 serialVersionUID的作用

​	序列化操作的时候系统会把当前类的 serialVersionUID 写入到序列化文件中，当反序列化时系统会去检测文件中的 serialVersionUID， **判断** 它是否与当前类的 serialVersionUID 一致，如果一致就说明序列化类的版本与当前类版本是一样的，可以反序列化成功，否则失败。

+ serialVersionUID有两种显式的生成方式：     
  + 一是默认的1L，比如：private static final long serialVersionUID = 1L；   
  + 二是根据类名、接口名、成员方法及属性等来生成一个64位的哈希字段，比如：private static final long  serialVersionUID = xxxxL；
  + 若用显式的生成方式，即使改变了 Class 文件，进行反序列化时，也不会抛出异常。
+ 也有隐式的生成方式
  + Java序列化机制会根据编译的 Class 自动生成一个 serialVersionUID 作序列化版本；
  + 这种情况下，如果Class文件（类名，方法名等）没有有发生变化，例如增加空格，换行，增加注释等等，就算再编译多次，serialVersionUID 也不会变化的；
  + 若用隐式的生成方式，将 Class 文件改变后，再进行反序列化时，会抛出异常。

### 4.7.7 哪些东西需要序列化

1.  普通成员变量需要序列化；
2.  静态变量和方法无需序列化；
3.  有父类的情况：

+ 若父类实现序列化：父类的状态被保存，子类自动实现序列化，不需要显式实现Serializable接口；
+ 父类未实现序列化：分两种情况
  + 父类 **提供** 了无参构造方法：子类可以序列化，父类不能序列化；
  + 父类 **没有提供** 无参构造方法：子类可以序列化，反序列化时程序报错。

4. 用 transient 保护的敏感信息不用序列化。

## 参考网站

[01] [Servlet继承关系和生命周期（博客园）](https://www.cnblogs.com/deng-cc/p/7462866.html)

[02] [Servlet的生命周期（CSDN）](https://blog.csdn.net/zhouym_/article/details/90741337)

[03] [Servlet、GenericServlet和HttpServlet之间的关系（CSDN）](https://blog.csdn.net/qq_40645822/article/details/101314753)

[04] [序列化梳理（CSDN）](https://blog.csdn.net/so_geili/article/details/99836043)

