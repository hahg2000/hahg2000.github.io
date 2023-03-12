---
tags:
  - SSM框架
  - 学习
  - Java
readingTime: true 
autoNext: 四、SSM框架前言-适配器模式
---

# 三、SSM前言——代理模式

## 3.1 代理模式

使用代理对象，是为了在不修改目标对象的基础上，增强主业务逻辑。客户类<u>**想要访问**</u>的对象是目标对象，但客户类<u>**真正能访问**</u>的对象是代理对象。
客户类对目标对象的访问是通过访问代理对象来实现的。当然，代理类与目标类要实现同一个接口。

可以用生活中的“代理律师”为例，来理解“代理模式”。根据代理关系建立的时间不同，可以将代理分为两类：

1. 静态代理 —— 法律顾问
2. 动态代理 —— 代理律师

## 3.2 Java包的命名

Java 中的包的命名一般分为4-5层：
之所以要这样命名项目中的包，是为了保证项目中所用到的类具有全球唯一性。

com.company.project.oa.xxx.ooo.jjj.service.impl

| 层数   | 层数信息           | 示例                    |
| ------ | ------------------ | ----------------------- |
| 第一层 | 甲方公司域名的倒叙 | com.company             |
| 第二层 | 项目名称           | project                 |
| 第三层 | 模块信息           | xxx.ooo.jjj             |
| 第四层 | 功能顶层包         | service、dao、beans、vo |
| 第五层 | 实现类包           | impl                    |
::: tip
有些功能顶层是没有实现类层的

:::

1. **beans、entity是Persistance Object （po）持久化对象。**

   一般具有id性，因为它们在数据库中都有相应的表

2. Value Object（VO）值对象。一般用于类与页面间传值。
3. Data Transter Object（dto）数据传输对象。一般用于类间传值。
4. Data Access Object（dao）数据访问对象。用于访问数据库，对数据库进行增删改查。

:::tip

第二和第三的类，一般是没有 id 属性的。因为它们不需要持久化到数据库，仅仅用于在代码中进行数据传递。例如，利用 session 传递的数据。

:::

## 3.3 静态代理的实现

### （1）目标类定义

**ISomeService.java**：<u>接口类型</u>，定义要执行的目标方法

```java
package com.hahg.service;

// 主业务接口
public interface ISomeService {
	// 目标方法
	String doFirst();
	// 目标方法
	void doSecond();
}
```

**SomeServiceImpl.java**：<u>目标类</u>，实现了主业务接口。

+ doFirst 方法输出 “ 执行doFisrt()方法 " ，并返回 " abcde "。
+ doSecond 方法输出执行 ” doSecond()方法 "。

```java
public class SomeServiceImpl implements ISomeService {

	@Override
	public String doFirst() {
		System.out.println("ִ执行doFisrt()方法");
		return "abcde";
	}

	@Override
	public void doSecond() {
		System.out.println("ִ执行doSecond()方法");
	}
}
```

**Mytest.java**：<u>测试类</u>，在测试类的主函数中，新建一个目标对象，然后分别执行里面的方法。

```java
public class Mytest {

	public static void main(String[] args) {
		ISomeService service = new SomeServiceImpl();
		String result = service.doFirst();
		System.out.println("result = " + result);
		service.doSecond();
	}
}
```

执行结果如下图：

![无代理的执行结果](https://raw.githubusercontent.com/hahg2000/SSMPic/main/20210128110939.png)

::: warning

如果现在在<u>**不改变目标对象**</u>的前提，需要把 result 的结果变为大写。

:::

::: tip 

这时需要代理类来做这个事。

:::

### （2）代理类的定义

**SomeServiceProxy.java**：<u>代理类</u>，用于增强目标对象，将目标对象的原始返回值转换成大写。

```java
// 代理类
public class SomeServiceProxy implements ISomeService {

	ISomeService target;

	public SomeServiceProxy() {
		// 初始化目标对象
		target = new SomeServiceImpl();
	}

	@Override
	public String doFirst() {
		// 代理类调用目标对象的方法
		String result = target.doFirst();
		// 增强就发生在这里
		return result.toUpperCase();
	}

	@Override
	public void doSecond() {
		target.doSecond();
	}
}
```

**Mytest.java**：<u>测试类</u>，在原来的代码基础上，改变第4行，因为这时只需要利用代理对象来执行方法

```java
public class Mytest {

	public static void main(String[] args) {
//		ISomeService service = new SomeServiceImpl();
        ISomeService service = new SomeServiceProxy();
		String result = service.doFirst();
		System.out.println("result = " + result);
		service.doSecond();
	}
}
```

执行结果如下图：输出已经变为大写了

![利用了代理类](https://raw.githubusercontent.com/hahg2000/SSMPic/main/20210129183625.png)

## 3.4 动态代理——JDK代理

### （1）执行Java文件的过程

#### a. 启动java虚拟机

Java文件夹目录下的【/bin/server】里，有个名为 “ jvm.dll ” 的文件，这个就是Java虚拟机。

这个不同版本 Java 的虚拟机有客户类型和服务器类型两种类型。

::: tip

在CMD中，输入 “ java -version " 可以看到java版本和java所用的虚拟机的类型。

:::

#### b. 加载相关类库 

第一步：运行 **”引导策略类加载器“**（bootstrap class loader） 这个类 ，加载核心类库 rt.jar —— 【 /jdk1.8.0_202/jre/lib 】

其核心源码为 src.zip —— 【 /jdk1.8.0_202 】

第二步：运行 **”扩展类加载器“** 这个类（ext class loader），加载扩展类  —— 【 /jdk1.8.0_202/jre/lib/ext 】

 第三步：运行 **”应用程序类加载器“** 这个类（app class loader ），加载用户自己定义的类。它执行时首先会去 **class path** 所填的路径找所需要的类，若没有填则在当前文件夹查找。

### （2）需要用到的代理方法

​	需要使用下面这个方法来获取代理类：

| 方法类型和返回值 | 方法名           | 形参                                                         |
| ---------------- | ---------------- | ------------------------------------------------------------ |
| static Object    | newProxyInstance | （ClassLoader loader,<br /> Class<?>[] interfaces, <br />InvocationHandler h） |

+ ClassLoader loader——目标类的类加载器
+ Class<?>[] interfaces ——目标类所实现的所有接口
+ InvocationHandler h ——调用处理器；InvocationHandler 是一个接口；因为此接口只定义了一个方法，所以没必要去新建一个类去实现这个接口。而这个接口里面的方法的名字为【 **invoke** 】 。
+ 注：匿名内部类没有所对应的对象名。

下面这个为 invoke 方法的参数，在 invoke 方法用于指定返回的代理对象干的工作

| 返回值 | 方法名 | 方法形参                                        |
| ------ | ------ | ----------------------------------------------- |
| Object | invoke | （Object proxy, Method method, Object[] args ） |

+ proxy：代理示例，即把代理对象自己传递进来
+ method：代理对象的方法，把代理对象当前调用的方法传递进来
+ args：代理方法的参数列表



调用 method 对象的 invoke 方法，来执行目标对象其中的方法，并获取方法的返回值；若无返回值，则会返回 null 。

| 返回值 | 方法名 | 方法形参                     |
| ------ | ------ | ---------------------------- |
| Object | invoke | （Object obj,Object[] args） |

+ obj ：调用底层方法的对象——目标对象
+ args ：用于方法调用的参数



### （3）测试文件

**Mytest.java**：method.invoke() 调用的次数和目标对象的方法数目一致。

因为JDK动态代理的底层的执行原理，与静态代理的相同，所以使用 JDK 动态代理时，目标对象 **必须** 实现接口。

```java
public class MyTest {

	public static void main(String[] args) {
		final ISomeService target = new SomeServiceImpl();
		
		// 使用JDK的Proxy动态代理，要求目标类必须实现接口
		// 因为其底层的执行原理，与静态代理的相同
		ISomeService service = (ISomeService) Proxy.newProxyInstance(
					target.getClass().getClassLoader(),    // 目标类的类加载器
					target.getClass().getInterfaces(),     // 目标类所实现的所有接口
					new InvocationHandler() {              // 匿名内部类
						// proxy：代理对象
						// method：目标方法
						// args：目标方法的参数列表
						@Override
						public Object invoke(Object proxy, Method method, Object[] args)
								throws Throwable {
							// 调用目标方法
							Object result = method.invoke(target, args);
							if (result != null) {
								result = ((String) result).toUpperCase();
							}
							return result;
						}
					});
```

::: warning

在Java 1.8以后，若内部类使用但不修改外部类局部变量时，局部变量前不用加 final 

:::

>原理：外部类中的局部变量实际上会复制为内部类的成员变量使用
>
>将局部变量复制为内部类的成员变量时，必须保证这两个变量是一样的。在修改内部类的成员变量时，外部类的局部变量无法被修改到，所以 就将外部类的局部变量设置为 *final*，对它初始化后，不让你再去修改这个变量，就保证了内部类的成员变量和方法的局部变量的一致性。
>
>若变量是 *final* 时：
>
>若是基本类型，其值是不能改变的，就保证了*copy*与原始的局部变量的值是一样的；
>
>若是引用类型，其引用是不能改变的，保证了*copy*与原始的变量引用的是同一个对象。
>
>来源：[为什么局部内部类和匿名内部类只能访问final的局部变量?(CSDN)](https://blog.csdn.net/sf_climber/article/details/78326984)

## 3.5 动态代理——CGLIB代理

思考：如何在目标类没有实现接口的情况下，对目标类进行扩展。

<p></p>

::: tip

代理类可以作为目标类的子类进行扩展。因为目标类必须能够被继承，所以目标类不能是最终类（final 修饰）

:::

> CGLIB(Code Generation Library)是一个开源项目。
>
> 是一个强大的，高性能，高质量的Code生成类库，它可以在运行期扩展Java类与实现Java接口。Hibernate支持它来实现PO(Persistent Object 持久化对象)[字节码](https://baike.baidu.com/item/字节码/9953683)的动态生成。
>
> —— 《cglib》百度百科



### （1）无接口的CGLIB代理的实现

1. 此代理对象需要工厂类来创造，在工厂类先在类里定义一个 myCglibCreator 方法，返回值为目标类类型SomeService

```java
public SomeService myCglibCreator() {
```

2. 使用【cblig.jar】文件里的 Enhancer 类来创建增强器对象。

```java
Enhancer enhancer = new Enhancer();
```

> 【cglib-full.jar】[下载地址](http://www.java2s.com/Code/Jar/c/Downloadcglibfull202jar.htm)（运行程序用到的jar包）
>
> [【cglib.jar】官网（Github）](https://github.com/cglib/cglib/releases/tag/RELEASE_3_3_0)

3. 使用 setSuperclass，来指定目标类（父类）

```java
enhancer.setSuperclass(SomeService.class);
```

4. 设置回调接口对象，实现 MethodInterceptor 接口来定义回调函数。

```java
public class MyCglibFactory implements MethodInterceptor {
	
	private SomeService target;

	public MyCglibFactory() {
		target = new SomeService();
	}

	public SomeService myCglibCreator() {
		// 创建增强器对象
		Enhancer enhancer = new Enhancer();
		// 指定目标类，即父类
		enhancer.setSuperclass(SomeService.class);
		// 设置回调接口对象
		enhancer.setCallback(this);
		
		return (SomeService) enhancer.create();
	}

	// 回调方法
	@Override
	public Object intercept(Object obj, Method method, Object[] args,
		return null;
	}
```

> **方法回调设计模式**
>
> ​	在Java中，就是类A 调用类B 的某个方法b，然后类B 又在某个时候反过来调用类A 中的某个方法a，对于a方法便叫做回调方法。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/QQ%E6%88%AA%E5%9B%BE20210202121340.png" alt="回调方法的原理" style="zoom:80%;" />

​	在上面的例子中，我们定义的 MyCglibFactory 类相当于类 A ，而 Enhacer 类则是类 B 。A类中调用了 Enhancer 类的 setCallback(this) 方法，并将 **回调对象** this 作为实参传递给了 Enhancer 类。 Enhancer 类在后继执行过程中，会调用类A中的 intercept() 方法，这个 intercept() 方法就是回调方法。 

::: tip

若自动产生的方法中的形参的参数名为 arg0 、arg1……，导入源码即可显示正常的参数名。

:::

5. 在回调方法里，实现所需要的功能。

```java
	// 回调方法
	@Override
	public Object intercept(Object obj, Method method, Object[] args,
			MethodProxy proxy) throws Throwable {
		// 调用目标方法
		Object result = method.invoke(target, args);
		if (result != null) {
			result = ((String) result).toUpperCase();
		}
		return result;
	}
```

6. 在测试文件中，当调用 service 的 doFirst() 方法时，会调用上面的回调方法来实现变大写的操作。

```java
public class MyTest {

	public static void main(String[] args) {
		SomeService service = new MyCglibFactory().myCglibCreator();
		String result = service.doFirst();
		System.out.println("result = " + result);
		service.doSecond(); 
	}
}
```



### （2）有接口的CGLIB代理的实现

**MyCglibFactory.java**：有接口的 CGLIB 代理在无接口的基础下改变工厂类即可。

```java
public class MyCglibFactory implements MethodInterceptor {
	
	private ISomeService target;

	public MyCglibFactory() {
		target = new SomeServiceImpl();
	}

	public ISomeService myCglibCreator() {
		// 创建增强器对象
		Enhancer enhancer = new Enhancer();
		// 指定目标类，即父类
		enhancer.setSuperclass(ISomeService.class);
		// 设置回调接口对象
		enhancer.setCallback(this);
		
		return (ISomeService) enhancer.create();
	}

	// 回调方法
	@Override
	public Object intercept(Object obj, Method method, Object[] args,
			MethodProxy proxy) throws Throwable {
		// 调用目标方法
		Object result = method.invoke(target, args);
		if (result != null) {
			result = ((String) result).toUpperCase();
		}
		return result;
	}
}
```



---

## 附录

### Eclipse 常用快捷键

| 按键                   | 作用                     | 备注                                                         |
| ---------------------- | ------------------------ | ------------------------------------------------------------ |
| (Alt + Shift + R) / F2 | 重命名                   |                                                              |
| Alt + Shift + L        | 生成变量                 | 在 new 前面自动生成变量名和数据类型                          |
| Alt + Shift + S        | 调用源码菜单             | 调用菜单后可以按下每个菜单项中字母中<br />有<u>**下划线**</u>的键来快速使用该菜单项 |
| Alt + /                | 提示                     | 可以对需要输出的代码使用，快速添加Sysout                     |
| Alt + ↑ / ↓            | 移动代码至上行/下行      |                                                              |
| Alt + 指定键           | 在窗口中切换不同的输入框 | 一定要在窗口中使用，指定键为提示信息中有<u>**下划线**</u>的字母相对应的键 |
| Ctrl + Alt  + ↑ / ↓    | 复制代码至上行/下行      |                                                              |
| Ctrl + Shift + ← / →   | 代码区块选择             |                                                              |
| Ctrl + N               | 创建不同类型的文件       |                                                              |
| Ctrl + E               | 选择切换的标签栏         |                                                              |
| Ctrl + 1               | 提示和辅助               | 在错误时可以根据提示改正，<br />也可以使用辅助功能快速将局部变量提取为成员变量 |





