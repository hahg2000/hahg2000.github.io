# 三、Spring与AOP

## 3.1 AOP 的引入

现在有个业务类，其实现了 IService 接口，里面有两个主业务逻辑方法和两个交叉业务逻辑。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/aop%E5%BC%95%E5%85%A51.png" style="zoom:60%;" />

---

此时提出一个问题：若有其它实现类同样也要调用这些事务、日志等处理方法怎么办？

1. 可以将业务逻辑作为父类，需要使用事务、日志的实现类就继承它即可。
2. 将这些交叉业务逻辑代码放到专门的工具类或处理类中设置成静态方法，由主业务逻辑调用。

而这两种的缺点分别是：

1. 因为 Java 是单继承，若实现类还需要继承其它类，就不行了，其唯一的机会被使用了。
2. 交叉业务与主业务 **深度耦合** 在一起。当交叉业务逻辑较多时，在主业务代码中会出现大量的交叉业务逻辑代码调用语句，大大 <u>影响了主业务逻辑的可读性，降低了代码的可维护性</u>，同时也增加了开发难度。

**所以，可以采用动态代理方式。动态代理是 OCP 开发原则的一个重要体现：在不修改主业务逻辑的前提下，扩展和增强其功能。**

---

**定义测试类：**创建代理类来代理目标对象，而其第三个参数需要传递一个对象，这个对象需要实现 InvocationHandler 接口。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/aop%E5%BC%95%E5%85%A52.png" style="zoom: 67%;" />

**定义切面类：**定义一个切面类实现 InvocationHandler 接口，用于增强所需功能

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/aop%E5%BC%95%E5%85%A53.png" style="zoom:67%;" />

**观察目标类：**发现目标的主业务逻辑看不到任何交叉的业务逻辑，可读性强便于开发。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/aop%E5%BC%95%E5%85%A54.png" style="zoom:67%;" />

## 3.2 AOP 概述 

### 3.2.1 AOP 简介 

AOP（Aspect Orient Programming），面向切面编程，<span style="color:red">是面向对象编程 OOP 的一种补充。</span>

面向对象编程是从 **静态** 角度考虑程序的结构，而面向切面编程是从 **动态** 角度考虑程序运行过程。

AOP 底层，就是采用动态代理模式实现的。采用了两种代理：

+ JDK 的动态代理
+ CGLIB 的动态代理

面向切面编程，就是将交叉业务逻辑封装成切面，利用 AOP 容器的功能将切面 **织入** 到主业务逻辑中。

所谓交叉业务逻辑是指，通用的、与主业务逻辑无关的代码，如安全检查、 事务、日志等。 若不使用 AOP，则会出现代码纠缠，即 <u>交叉业务逻辑与主业务逻辑混合在一起</u>。

例如，转账，在真正转账业务逻辑前后，需要权限控制、日志记录、加载事务、结束事务等交叉业务逻辑，而这些业务逻辑与主业务逻辑间并无直接关系。但它们的代码量<u>所占比重能达到总代码量的一半甚至还多</u>。

它们的存在，不仅产生了大量的 “ 冗余 ” 代码，还<span style="color:red">大大干扰了主业务逻辑---转账。</span>

### 3.2.2 AOP 编程术语 

#### （1）切面（Aspect）

 **切面泛指交叉业务逻辑**。上例中的事务处理、日志处理就可以理解为切面。常用的切面有 **通知** 与 **顾问** 。实际就是对主业务逻辑的一种增强。 

#### （2）织入（Weaving）

 织入是指将切面代码插入到目标对象的过程。上例中 MyInvocationHandler 类中的 invoke() 方法完成的工作，就可以称为织入。

#### （3）连接点（JoinPoint） 

连接点指 **可以** 被切面织入的方法。**通常业务接口中的方法均为连接点**。 

#### （4）切入点（Pointcut）

 切入点指切面 **具体** 织入的方法。在 StudentServiceImpl 类中，若 doSome() 将被增强，而 doOther()不被增强，则 doSome()为切入点，而 doOther()仅为连接点。 <u>被 final 修饰的方法是不能作为连接点与切入点的。因为最终的是不能被修改的，不能被增强的</u>。

#### （5）目标对象（Target） 

目标对象指**将要被增强的对象**，即包含主业务逻辑的类的对象。上例中的 StudentServiceImpl 的对象若被增强，则该类称为目标类，该类对象称为目标对象。当然， 不被增强，也就无所谓目标不目标了。 

#### （6）通知（Advice）

通知是切面的一种实现，可以完成简单织入功能（织入功能就是在这里完成的）。上例中的 MyInvocationHandler 就可以理解为是一种通知。换个角度来说，通知 **定义了增强代码切入到目标代码的时间**点，是目标方法执行之前执行，还是之后执行等。通知类型不同，切入时间不同。

 切入点定义切入的位置，通知定义切入的时间。但不能指定切入点。

#### （7）顾问（Advisor）

 顾问是切面的另一种实现，能够将通知以 **更为复杂的方式织入到目标对象中**，是将通知包装为更复杂切面的装配器。可以指定切入点。

### 3.2.3 AOP 编程环境搭建

#### （1）导入 Jar 包 

在原有 Spring 基本 Jar 包的基础上再导入两个 Jar 包：

+  AOP 是由 AOP 联盟提出的一种编程思想，提出的一套编程规范。
+ 而 Spring 是 AOP 这套规范的一种实现。

所以，需要导入 AOP 联盟的规范（接口）包及 Spring 对其的实现包。 

AOP 下载地址：[ https://mvnrepository.com/artifact/aopalliance/aopalliance/1.0 ]

#### （2）使用原 beans 的约束 

配置文件的文件头，还使用原来的基础头部就可以，即只包含 beans 约束的文件头部即可。

## 3.3 通知 Advice

 通知（Advice），切面的一种实现，可以完成简单织入功能。

常用通知有：前置通知、后置通知、环绕通知、异常处理通知。

###  3.3.1 通知的用法步骤 

对于通知的定义、配置与使用，主要分为以下几步：

#### （1）定义目标类 

定义目标类，就是定义之前的普通 Bean 类，也就是即将被增强的 Bean 类。 

#### （2）定义通知类 

通知类是指，实现了 **相应通知类型接口** 的类。

实现了这些接口，就要实现这些接口中的方法，而这些方法的执行，则是根据不同类型的通知，其执行时机不同。有四个执行时机：

A、前置通知：在目标方法执行之前执行 

**MyMethodBeforeAdvice.java：**使用前置通知，需要实现 MethodBeforeAdvice 接口的 before 方法。

```java
//前置通知
public class MyMethodBeforeAdvice implements MethodBeforeAdvice {

	// 当前方法在目标方法执行之前执行
	// method：目标方法
	// args：目标方法的参数列表
	// target：目标对象
	@Override
	public void before(Method method, Object[] args, Object target)
			throws Throwable {
		// 对于目标方法的增强代码就应该写在这里
		System.out.println("执行前置通知方法");
	}
}
```

 

B、后置通知：在目标方法执行之后执行 

MyAfterReturningAdvice.java：使用后置通知，需要实现 AfterReturningAdvice 接口的 afterReturning 方法。

其中方法的形参 returnValue ，可以获取到每个方法的返回值，<span style="color:red">但无法修改目标方法的返回值。</span>

```java
//后置通知：可以获取到目标方法的返回结果，但无法改变目标方法的结果
public class MyAfterReturningAdvice implements AfterReturningAdvice {

	// 在目标方法执行之后执行
	// returnValue：目标方法的返回值
	@Override
	public void afterReturning(Object returnValue, Method method, Object[] args, Object target) throws Throwable {
		System.out.println("执行后置通知方法  returnValue = " + returnValue);
	}
}
```



C、环绕通知：在目标方法执行之前与之后均执行 

定义环绕通知，需要实现 MethodInterceptor 接口的 invoke 方法，<span style="color:red">可以改变目标方法的返回值</span>，也可以改变程序执行流程。

```java
//环绕通知：可以修改目标方法的返回结果
public class MyMethodInterceptor implements MethodInterceptor {

	@Override
	public Object invoke(MethodInvocation invocation) throws Throwable {
		System.out.println("执行环绕通知：目标方法执行之前");
		// 执行目标方法
		Object result = invocation.proceed();
		System.out.println("执行环绕通知：目标方法执行之后");
		if(result != null) {
			result = ((String)result).toUpperCase();
		}
		return result;
	}
}
```



D、异常处理通知：在目标方法执行过程中，若发生指定异常，则执行通知中的方法

定义异常通知，需要实现 ThrowsAdvice 接口。

该接口的主要作用是，在目标方法抛出异常后，根据异常的不同做出相应的处理。当该 **接口处理完异常** 后，会简单地将异常再次抛出给目标方法。 

不过，这个接口较为特殊，从形式上看，该接口中没有必须要实现的方法。

但这个接口却确实有必须要实现的方法 afterThrowing()。这个方法重载了四种形式。如下图所示。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E5%BC%82%E5%B8%B8%E9%80%9A%E7%9F%A5%E6%BA%90%E7%A0%81.png" style="zoom:80%;" />

由于使用时，一 般只使用其中一种，若要都定义到接口中，则势必要使程序员在使用时 **必须要实现这四个方法**，而 **其他三个都需要空实现**，这是很麻烦的。所以就将该接口定义为了 **标识接口**（没有方法的接口）。 

#### （3）定义Xml文件

##### A、定义目标对象

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="
        http://www.springframework.org/schema/beans 
        http://www.springframework.org/schema/beans/spring-beans.xsd">

	<!-- 注册目标对象 -->
	<bean id="someService" class="com.hahg.aop01.SomeServiceImpl" />
```

##### B、定义切面对象

```xml
<!-- 注册切面：通知 -->
	<bean id="myBeforeAdvice"
		class="com.hahg.aop01.MyMethodBeforeAdvice" />
	<bean id="myAfterAdvice"
		class="com.hahg.aop01.MyAfterReturningAdvice" />
	<bean id="myMethodInterceptor"
		class="com.hahg.aop01.MyMethodInterceptor" />
	<bean id="myThrowsAdvice"
		class="com.hahg.aop01.MyThrowsAdvice" />
```

##### C、生成代理对象

| 属性的key        | 属性的value                            | 使用的标签属性 |
| ---------------- | -------------------------------------- | -------------- |
| target           | 目标对象                               | ref            |
| targetName       | 目标对象的名字                         | value          |
|                  | target 和 targetName 选其一即可        |                |
| interceptorNames | 切面对象的名字，若有多个可使用逗号隔开 | value          |
|                  | 也可以在property标签内使用集合标签     | array-value    |

```xml
<!-- 生成代理对象 -->
	<bean id="serviceProxy"
		class="org.springframework.aop.framework.ProxyFactoryBean">
		<!-- <property name="targetName" value="someService"/> -->
		<!-- 指定目标对象 -->
		<property name="target" ref="someService" />
		<!-- 指定切面 -->
		<property name="interceptorNames">
			<array>
				<value>myBeforeAdvice</value> 
				<value>myAfterAdvice</value> 
				<value>myMethodInterceptor</value> 
				<value>myThrowsAdvice</value> 
			</array>
		</property>
	</bean>
```

#### （4）定义测试类

**MyTest.java：**在测试类中获取代理对象，并让其执行相对应的功能。

```java
public class MyTest {
	
	@Test
	public void test01() {
		// 创建容器对象，加载Spring配置文件
		String resource = "com/hahg/aop01/applicationContext.xml";
		ApplicationContext ac = new ClassPathXmlApplicationContext(resource);
		ISomeService service = (ISomeService) ac.getBean("serviceProxy");
		service.doFirst();
		System.out.println("==================");
		service.doSecond();
	}	
}
```

运行结果如下：

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E9%80%9A%E7%9F%A5%E8%BF%90%E8%A1%8C%E7%BB%93%E6%9E%9C.png" style="zoom:80%;" />

#### （5）异常通知的扩展

异常通知常用的形式如下： public void afterThrowing ( 自定义的异常类 e ) 

这里的参数 e 为：与具体业务相关的 **用户自定义** 的异常类对象。

容器会根据异常类型的不同，自动选择不同的该方法执行。这些方法的执行是在目标方法执行结束后执行的。

需求：实现用户身份验证。当用户名不正确时，抛出用户名有误异常；当密码不正确时， 抛出密码有误异常。在抛出这些异常后，都要做一些其它处理。

##### A、异常的分类

异常分为两种：

+ RuntimeException 运行时异常，不进行处理也可通过编译。
+ 其他 Exception 编译时异常，受查异常（Checked Exception），若不进行处理无法通过编译。

##### B、 定义异常类的父类

**UserException.java：** 该类为自定义异常，继承自 Exception 父类，本例只需要使用到参数为 message 的构造器。

```java
public class UserException extends Exception {

	public UserException() {
		super();
	}

	public UserException(String message) {
		super(message);
	}
}
```

##### C、定义两个异常类的子类

**PasswordException.java：** 该类继承父类用户异常 UserException ，用于指示密码错误。用户名错误定义也如此。

```java
public class PasswordException extends UserException {

	public PasswordException() {
		super();
		// TODO Auto-generated constructor stub
	}

	public PasswordException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}
}
```

##### D、定义业务接口

在接口中也需要指明需要抛出的异常。

```java
public interface ISomeService {
	void login(String user, String password) throws UserException;
}
```

##### E、定义目标类

在目标类中，定义方法，在方法中判断用户名和密码，再根据不同情况抛出不同异常。

```java
//目标类
public class SomeServiceImpl implements ISomeService {

	@Override
	public void login(String user, String password) throws UserException {
		if (!"zhang".equals(user)) {
			throw new UsernameException("用户名错误");
		}
		if (!"111".equals(password)) {
			throw new PasswordException("密码错误");
		}
	}
}
```

##### F、定义Xml文件

在上面的 Xml 文件的基础上，只保留异常通知。

##### G、定义测试类

在测试类中，调用相关方法并查看结果。

```java
@Test
	public void test01() throws UserException {
		// 创建容器对象，加载Spring配置文件
		String resource = "com/hahg/aop02/applicationContext.xml";
		ApplicationContext ac = new ClassPathXmlApplicationContext(resource);
		ISomeService service = (ISomeService) ac.getBean("serviceProxy");
		service.login("zhang", "112");
	}
```

##### H、查看结果

由下图可知，因为使用了 throws 来抛出异常，系统感知到了错误，所以就有 **红条** 出现。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E5%BC%82%E5%B8%B8%E8%BF%90%E8%A1%8C%E7%BB%93%E6%9E%9C1.png" style="zoom:80%;" />

若使用 try-catch 块来处理异常，则系统不会感知到错误，异常由 catch 块里面的代码来处理，所以就是 **绿条**。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E5%BC%82%E5%B8%B8%E8%BF%90%E8%A1%8C%E7%BB%93%E6%9E%9C2.png" style="zoom:80%;" />

### 3.3.2 通知的其他用法

#### （1）无接口的 CGLIB 代理生成 

若不存在接口，则 ProxyFactoryBean 会自动采用 CGLIB 方式生成动态代理。 

查看后台运行情况，可以看到代理生成使用的是 CGLIB 代理机制。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%97%A0%E6%8E%A5%E5%8F%A3cgilb.png" style="zoom:80%;" />

#### （2）有接口的 CGLIB 代理生成

proxyTargetClass 属性若存在接口，但又需要使用 CGLIB 生成代理对象，此时，只需要在配置文件中增加一个 proxyTargetClass 属性设置，用于指定强制使用 CGLIB 代理机制。也可指定 optimize（优化）的值为 true，强制使用 CGLIB 代理机制。

```xml
<!-- 生成代理对象 -->
	<bean id="serviceProxy"
		class="org.springframework.aop.framework.ProxyFactoryBean">
		<property name="targetName" value="someService" />
		<!-- 指定目标对象 -->
		<!-- <property name="target" ref="someService" /> -->
		<!-- 指定切面 -->
		<property name="interceptorNames">
			<array>
				<value>myAfterAdvice</value>
			</array>
		</property>
		<!-- 添加的属性 -->
		<property name="proxyTargetClass" value="true"/>
		<!-- <property name="optimize" value="true"/> -->
	</bean>
```

运行结果如下：

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%9C%89%E6%8E%A5%E5%8F%A3cglib1.png" style="zoom:80%;" />

## 3.4 顾问 Advisor 

通知（Advice）是 Spring 提供的一种切面（Aspect）。

但其功能过于简单：只能将切面织 入到目标类的所有目标方法中，无法完成将切面织入到 **指定目标方法** 中。

顾问（Advisor）是 Spring 提供的 **另一种切面**。其可以 <u>完成更为复杂的切面织入功能</u>。 

PointcutAdvisor 是顾问的一种，可以指定具体的切入点。顾问将通知进行了包装，会根据不 同的通知类型，在不同的时间点，将切面织入到不同的切入点。 

PointcutAdvisor 接口有两个较为常用的实现类： 

+ NameMatchMethodPointcutAdvisor 名称匹配方法切入点顾问 ；
+ RegexpMethodPointcutAdvisor 正则表达式匹配方法切入点顾问

### 3.4.1 名称匹配方法切入点顾问 

NameMatchMethodPointcutAdvisor，即名称匹配方法切入点顾问。容器可根据配置文件中 **指定的方法名** 来设置切入点。

代码不用修改，只在配置文件中注册一个顾问，然后使用通知属性 advice 与切入点的方法名 mappedName 对其进行配置。在代理中的切面设置，使用这个顾问即可。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E9%A1%BE%E9%97%AE%E9%85%8D%E7%BD%AE1.png" style="zoom:80%;" />

对于切入点的指定，有多种方式：

+ 完整方法名
+ 利用 \* 号表示零个或多个字符，来指定一类方法

### 3.4.2 正则表达式方法切入点顾问 

RegexpMethodPointcutAdvisor，即正则表达式方法顾问。

容器可根据 **正则表达式** 来设置切入点。注意，与正则表达式进行匹配的对象是接口中的方法名，而非目标类（接口的实现类）的方法名。

而这里的方法名为 **全限定性方法名**，即前面含有包名。

假设现在需要将 doFisrt 和 doSecond 添加后置通知。

+ 若使用 pattern 属性，则只能指定一个 value；但可以使用 “|” 运算符。
+ 若使用 patterns 属性，则可以使用 &lt;array/> 标签来指定多个表达式。

```xml
<!-- 注册切面：顾问 -->
	<bean id="myAdvisor"
		class="org.springframework.aop.support.RegexpMethodPointcutAdvisor">
		<property name="advice" ref="myAfterAdvice" />
		<!-- 第一种方式 <property name="pattern" value=".*doSecond|.*First"/> -->
		<!-- 第二种方式 -->
		<property name="patterns">
			<array>
				<value>.*doSecond</value>
				<value>.*First</value>
			</array>
		</property>
	</bean>
```

### 3.4.2-1 正则表达式专题

#### （1）正则表达式符号

##### <span style="color:red">A、普通字符</span>

**普通字符包括没有显式指定为元字符的 所有 **可打印和不可打印字符。这包括<u>所有大写和小写字母、所有数字、所有标点符号和一些其他符号</u>。

+ 【[...]】匹配 [] 里的全部字符
  + **[aeiou]** 匹配字符串 "google runoob taobao" 中所有的 e o u a 字母 
  + **[A-Z]** 表示一个区间，匹配**所有大写字母**
  + **[a-z]** 表示**所有小写字母**。
  + **[\s\S]** 表示匹配所有。\s 是匹配所有空白符，包括换行，\S 非空白符，不包括换行。
+ 【\w】匹配字母、数字、下划线。等价于 [A-Za-z0-9_]

---

##### <span style="color:red">B、定位符</span>

定位符使您能够将正则表达式固定到行首或行尾。

+ 【$】 匹配输入字符串结尾的位置；
+ 【^】 匹配输入字符串开始的位置，如在 “ [] ” 里则表示 **不匹配** “ [] ” 里表达式的集合；
  +  **[^aeiou]** 匹配字符串 "google runoob taobao" 中除了 e o u a 字母的所有字母。
+ 【\b】匹配一个单词边界，即字与空格间的位置；
+ 【\B】非单词边界匹配

示例1：若要匹配一行文本开始处的文本，请在正则表达式的开始使用 **^** 字符。不要将 **^** 的这种用法与中括号表达式内的用法混淆。

若要匹配一行文本的结束处的文本，请在正则表达式的结束处使用 **$** 字符。

若要在搜索章节标题时使用定位点，下面的正则表达式匹配一个章节标题，该标题只包含两个尾随数字，并且出现在 **行首**：

```
/^Chapter [1-9][0-9]{0,1}/
例如：
Chapter 12 is this.
```

真正的章节标题不仅出现行的开始处，而且它还是该行中仅有的文本。它既出现在行首又出现在同一行的结尾。下面的表达式能确保指定的匹配 <u>只匹配章节而不匹配交叉引用</u>。

通过创建只匹配一行文本的开始和结尾的正则表达式，就可做到这一点。 

```
/^Chapter [1-9][0-9]{0,1}$/
例如：
Chapter 12
```

示例2：匹配单词边界稍有不同，但向正则表达式添加了很重要的能力。

单词边界是 **单词和空格之间的位置**。非单词边界是任何其他位置。

下面的表达式匹配单词 Chapter 的开头三个字符，因为这三个字符出现在单词边界后面：

```
/\bCha/
```

示例3：\b 字符的位置是非常重要的。

+ 如果它位于要匹配的字符串的开始，它在单词的开始处查找匹配项。
+ 如果它位于字符串的结尾，它在单词的结尾处查找匹配项。

例如，下面的表达式匹配单词 Chapter 中的字符串 ter，因为它出现在单词边界的前面：

```
/ter\b/
```

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F3.png" style="zoom:70%;" />

示例4：下面的表达式匹配 Chapter 中的字符串 apt，但不匹配 aptitude 中的字符串 apt：

```
/\Bapt/
```

字符串 apt 出现在单词 Chapter 中的非单词边界处，但出现在单词 aptitude 中的单词边界处。对于 **\B** 非单词边界运算符，位置并不重要，因为匹配不关心究竟是单词的开头还是结尾。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%AD%A3%E5%88%99%E8%A1%A8%E7%A4%BA%E5%BC%8F4.png" style="zoom:70%;" />

---

##### <span style="color:red">C、限定符</span>

限定符用来指定正则表达式的一个给定组件必须要 **出现多少次** 才能满足匹配。

+ 【\*】 匹配前面的子表达式零次或多次，等价于 {0,} ；
+ 【\+】 匹配前面的子表达式一次或多次，等价于 {1,} ；
+ 【.】 匹配除换行符 \n 和 \r 之外的任何单字符；相等于 [^\n\\r\]
+ 【?】 匹配前面的子表达零次或一次，或指明一个非贪婪限定符

+ 【{n}】，n是一个非负整数，匹配确定的n次；
+ 【{n,}】，n是一个非负整数，至少匹配n次；
+ 【{n.m}】，m和n均为非负整数，其中n<=m，最少匹配n次且最多匹配m次

注意：\* 和 + 限定符都是贪婪的，因为它们会尽可能多的匹配文字，只有在它们的后面加上一个 ? 就可以实现非贪婪或最小匹配



举例1：匹配1~99的两位数：/\[1-9][0-9]?/，注：【/……/】 表示该式子为正则表达式

+ [0-9]?：代表 0 ~ 9 出现零次或者一次，出现一次时作为个位数；

+ [1~9]：代表 1 ~ 9 一定出现一次，在上面的式子出现一次时作为十位数，出现零次时，作为个位数。



举例2：您可能搜索 HTML 文档，以查找在 **h1** 标签内的内容。HTML 代码如下：

```html
<h1>RUNOOB-菜鸟教程</h1>
```

**贪婪：**下面的表达式匹配从开始小于符号 (<) 到最后的大于符号 (>) 之间的所有内容。

```
/<.*>/
```

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F1.png" style="zoom:60%;" />

::: tip

正则表达式运行工具：[ http://c.runoob.com/front-end/854 ]
:::

**非贪婪：**如果您只需要匹配开始和结束 h1 标签，下面的非贪婪表达式只匹配 &lt;h1>。

```
/<.*?>/
/<\w+?>/
```

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F2.png" style="zoom:60%;" />

注意：**不能将 **限定符** 与 **定位符** 一起使用。由于在紧靠换行或者单词边界的前面或后面不能有一个以上位置，因此不允许诸如 **^\*** 之类的表达式。

---

##### <span style="color:red">D、特殊字符</span>

所谓特殊字符，就是一些有特殊含义的字符

如上面说的 runoo\*b 中的 \*，简单的说就是表示任何字符串的意思。如果要查找字符串中的 ***** 符号，则需要对 ***** 进行转义，即在其前加一个 \，runo\\*ob 匹配字符串 " runo\*ob "。

许多元字符要求在试图匹配它们时特别对待。若要匹配这些特殊字符，必须首先使字符 " 转义 "，即将反斜杠字符 " \ "放在它们前面。下表列出了正则表达式中的特殊字符：

| 特别字符 | 描述                                                         |
| :------- | :----------------------------------------------------------- |
| ( )      | 标记一个 **子表达式** 的开始和结束位置。子表达式可以获取供以后使用。 |
| [        | 标记一个中括号表达式的开始。                                 |
| ?        | 匹配前面的子表达式零次或一次，或指明一个非贪婪限定符。       |
| \        | 将下一个字符标记为或特殊字符、或原义字符、或向后引用、或八进制转义符。<br />例如， 'n' 匹配字符 'n'。'\n' 匹配换行符。序列 '\\' 匹配 "\"，而 '\(' 则匹配 "("。 |
| {        | 标记 **限定符表达式** 的开始。                               |
| \|       | 指明两项之间的一个选择。                                     |

#### （2）正则表达式的断言

正则表达式的先行断言和后行断言一共有 4 种形式：

- **(?=pattern)** 零宽正向先行断言(zero-width positive lookahead assertion)
- **(?!pattern)** 零宽负向先行断言(zero-width negative lookahead assertion)
- **(?<=pattern)** 零宽正向后行断言(zero-width positive lookbehind assertion)
- **(?<!pattern)** 零宽负向后行断言(zero-width negative lookbehind assertion)

这里面的 **pattern** 是一个正则表达式。

如同 **^** 代表开头，**$** 代表结尾，**\b** 代表单词边界一样，先行断言和后行断言也有类似的作用，它们 **只匹配某些位置**，在匹配过程中，不占用字符，所以被称为**"零宽"**。

所谓位置，是指：

+ 字符串中（每行）第一个字符的左边、
+ 最后一个字符的右边
+ 以及相邻字符的中间（假设文字方向是头左尾右）。

##### A、(?=pattern) 正向先行断言

代表字符串中的一个 <span style="color:red">位置</span> ，紧接该位置 <span style="color:red">之后</span> 的字符序列能够匹配 pattern。

例如对 **"a regular expression"** 这个字符串，要想匹配 regular 中的 re，但不能匹配 expression 中的 re。

可以用 **re(?=gular)**，该表达式限定了 re 右边的位置，这个位置之后的字符串是 " gular “ ，但并不消耗 gular 这些字符。

将表达式改为 **re(?=gular).**，将会匹配 reg，元字符 **.**  匹配了一个字符 **g**，括号匹配了 **e** 和 **g** 之间的位置。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F5.png" style="zoom:80%;" />

##### B、(?!pattern) 负向先行断言

代表字符串中的一个位置，紧接该位置之后的字符序列 <span style="color:red">不能</span> 匹配 pattern。

例如对 **" regex represents regular expression "** 这个字符串，要想匹配除 regex 和 regular 之外的 re。

可以发现这两个单词的 " re ” 后面都有字符 “ g ”，所以可以用 **re(?!g)**，该表达式限定了 **re** 右边的位置，这个位置后面不是字符 **g**。

<span style="color:red"> 负向和正向的区别，就在于该位置之后的字符能否匹配括号中的表达式。</span>

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F6.png" style="zoom:80%;" />

##### C、(?<=pattern) 正向后行断言

代表字符串中的一个 <span style="color:red">位置</span>，紧接该位置 <span style="color:red">之前</span> 的字符序列能够匹配 pattern。

例如对 **regex represents regular expression** 这个字符串，有 4 个单词，要想匹配单词内部的 re，但不匹配单词开头的 re。

观察规律可知，想要匹配单词的内部 " re "，前面必须为单词字符，所以可以用 **(?<=\w)re** 。在本例中，也指在单词内部的 re ，即 re 前面有非单词边界，所以也可以用 **\Bre** 来匹配。

之所以叫后行断言，是因为正则表达式引擎在匹配字符串和表达式时，是从前向后逐个扫描字符串中的字符，并判断是否与表达式符合，当在表达式中遇到该断言时，正则表达式引擎 <u>需要往字符串前端检测已扫描过的字符，相对于扫描方向是向后的</u>。

![](https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F7.png)

##### D、(?<!pattern) 负向后行断言

代表字符串中的一个位置，紧接该位置之前的字符序列不能匹配 pattern。

例如对 **" regex represents regular expression "** 这个字符串，要想匹配单词开头的 re，可以用 **(?<!\w)re**。单词开头的 **re**，在本例中，也就是指不在单词内部的 **re**，即 **re** 前面不是单词字符。当然也可以用 **\bre** 来匹配。

## 3.5 自动代理生成器 

前面代码中所使用的代理对象，均是由 ProxyFactoryBean 代理工具类生成的。而该代理工具类存在着如下缺点：

1. 一个代理对象只能代理一个 Bean，即如果有两个 Bean 同时都要织入同一个切面，这时不仅要配置这两个 Bean，即两个目标对象，同时还要配置两个代理对象。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E4%BB%A3%E7%90%86%E5%B7%A5%E5%85%B7%E7%B1%BB%E9%97%AE%E9%A2%981.png" style="zoom:70%;" />

2. 在客户类中获取 Bean 时，使用的是 **代理类** 的 id，而非我们定义的目标对象 Bean 的 id。 我们真正想要执行的应该是目标对象。从形式上看，不符合正常的逻辑。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E4%BB%A3%E7%90%86%E5%B7%A5%E5%85%B7%E7%B1%BB%E9%97%AE%E9%A2%982.png" style="zoom:70%;" />

---

Spring 提供了自动代理生成器，用于解决 ProxyFactoryBean 的问题。常用的自动代理生成器有两个： 

+ 默认 advisor 自动代理生成器 
+ Bean 名称自动代理生成器 

需要注意的是，自动代理生成器均继承自 Bean 后处理器 BeanPostProcessor。

容器中所有 Bean 在初始化时均会自动执行 Bean 后处理器中的方法，在本例就会执行代理功能，故其无需 id 属性。所以自动代理生成器的 Bean 也没有 id 属性，客户类直接使用目标对象 bean 的 id。

### 3.5.1 默认advisor自动代理生成器

自动代理生成器 DefaultAdvisorAutoProxyCreator 代理的生成方式是，将所有的目标对象与 Advisor 自动结合，生成代理对象。无需给生成器做任何的注入配置。

注意，只能与 Advisor 配合使用。 这种代理的配置很简单，如下：

#### （1）修改Xml文件

很明显，原本一大串的代码就变成了一行代码，如果添加多个目标对象就 <u>不用再为它们手动注册代理</u> 了。解决了上述的第一个问题。

```xml
	<bean id="someService" class="com.hahg.aop05.SomeServiceImpl" />
	<bean id="someService2" class="com.hahg.aop05.SomeServiceImpl" />

	<bean id="myAfterAdvice"
		class="com.hahg.aop04.MyAfterReturningAdvice" />

	<bean id="myAdvisor"
		class="org.springframework.aop.support.RegexpMethodPointcutAdvisor">
		<property name="advice" ref="myAfterAdvice" />
		<property name="pattern" value=".*First" />
	</bean>

	<!-- 注册自动代理生成器 -->
	<bean
		class="org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator" />
```

#### （2）修改测试类

在测试类中，直接获取目标对象即可，解决了上述的第二个问题。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E9%BB%98%E8%AE%A4%E8%87%AA%E5%8A%A8%E4%BB%A3%E7%90%86%E7%94%9F%E6%88%90%E5%99%A8.png" style="zoom:70%;" />

#### （3）其拥有的缺点

1. 不能选择目标对象，其每个目标对象都会被增强；
2. 不能选择切面类型，切面只能是顾问 advisor，不能是通知 advice；
3. 不能选择 advisor，所以 advisor 均将被作为切面织入到目标方法。

### 3.5.2 Bean 名称自动代理生成器

DefaultAdvisorAutoProxyCreator 会为每一个目标对象织入所有匹配的 Advisor，<u>不具有选择性，且切面只能是顾问 Advisor</u>。

而 BeanNameAutoProxyCreator 的代理生成方式是，根据 bean 的 id，来为符合相应名称的类生成相应代理对象，且切面既可以是顾问 Advisor 又可以是通知 Advice。 

注意，只需要修改配置文件中的代理生成配置，及测试类中的通过 getBean()获取的 bean 的 id 为目标类 beanId 即可。

#### （1）修改Xml文件

首先修改自动代理生成器的类名，其用到的属性名为

+ beanNames，其属性值为所增强的目标对象
+ interceptorNames，其属性值为所织入的切面对象，可以是通知也可以是顾问。
+ 该例为 someService 对象织入后置通知。

```xml
<bean id="someService" class="com.hahg.aop06.SomeServiceImpl" />
<bean id="someService2" class="com.hahg.aop06.SomeServiceImpl" />

<bean id="myAfterAdvice"
		class="com.hahg.aop04.MyAfterReturningAdvice" />
<bean
	class="org.springframework.aop.framework.autoproxy.BeanNameAutoProxyCreator">
	<property name="beanNames" value="someService" />
	<property name="interceptorNames" value="myAfterAdvice" />
</bean>
```

然后，再为 someService2 织入顾问，指定 doFirst 的方法后面添加后置通知。

```xml
<bean id="myAdvisor"
	class="org.springframework.aop.support.RegexpMethodPointcutAdvisor">
	<property name="advice" ref="myAfterAdvice" />
	<property name="pattern" value=".*First" />
</bean>

<bean
	class="org.springframework.aop.framework.autoproxy.BeanNameAutoProxyCreator">
	<property name="beanNames" value="someService2" />
	<property name="interceptorNames" value="myAdvisor" />
</bean>
```

#### （2）查看测试结果

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/bean%E8%87%AA%E5%8A%A8%E4%BB%A3%E7%90%86%E6%89%A7%E8%A1%8C%E7%BB%93%E6%9E%9C.png" style="zoom:80%;" />

#### （3）解决的问题

| 默认advisor自动代理生成器                  | Bean名称自动代理生成器                       |
| ------------------------------------------ | -------------------------------------------- |
| 不能选择目标对象，其每个目标对象都会被增强 | 可以使用 beanNames 属性来指定目标对象        |
| 不能选择切面类型                           | 可以选择通知和顾问进行增强                   |
| 不能选择 advisor                           | 可以使用 interceptorNames 属性来指定 advisor |

## 3.6 AspectJ 对 AOP 的实现 

对于 AOP 这种编程思想，很多框架都进行了实现。Spring 就是其中之一，可以完成面向切面编程。

然而，AspectJ 也实现了 AOP 的功能，且其实现方式更为简捷，使用更为方便， 而且还支持注解式开发。

所以，Spring 又将 AspectJ 的对于 AOP 的实现也引入到了自己的框架中。 在 Spring 中使用 AOP 开发时，一般使用 AspectJ 的实现方式。

### 3.6.1 AspectJ 的通知类型 

AspectJ 中常用的通知有五种类型： 

1. 前置通知 
2. 后置通知 
3. 环绕通知 
4. 异常通知 
5. <span style="color:red">最终通知 </span>

其中最终通知是指，无论程序执行是否正常，该通知都会执行。类似于 try..catch 中的 finally 代码块。

AspectJ 除了提供了六种通知外，还定义了专门的表达式用于指定切入点。表达式的原型是： 

```
execution ( [modifiers-pattern] 访问权限类型 
ret-type-pattern 返回值类型 
[declaring-type-pattern] 全限定性类名 
name-pattern(param-pattern) 方法名(参数名) 
[throws-pattern] 抛出异常类型 )
```

其中第 2 行的 ret-type-pattern 和第 4 行 name-pattern(param-pattern) 是必须要的。

其所使用的符号，注意与正则表达式不太一样。

| 符号 | 意义                                                         |
| ---- | ------------------------------------------------------------ |
| \*   | 零个至多个任意符号                                           |
| ..   | 在 **方法参数** 中，表示任意多个参数<br />用在 **包名** 后，表示当前包以及子包路径 |
| +    | 用在接口后，表示当前接口以及实现类<br />用在类名后，表示当前类以及子类 |

\* 符号的示例：

| 表达式                 | 意义                                |
| ---------------------- | ----------------------------------- |
| **(public \* \*(..))** | 任意公共方法                        |
| **(\* set\*(..))**     | 任何一个命名以 “ set ” 开始的方法。 |

.. 符号的示例：

| 表达式                              | 意义                                                         |
| ----------------------------------- | ------------------------------------------------------------ |
| **(\* com.xyz.service.\*.\*(..))**  | 定义在 service 包里的任意类的任意方法                        |
| **(\* com.xyz.service..\*.\*(..))** | 定义在 service 包或者子包里的任意类的任意方法                |
| **(\* \*.service.\*.doSome())**     | 指定只有 **一级包** 下的 serivce 子包下所有类中的 doSome()方法为切入 |
| **(\* \*..service.\*.doSome())**    | 指定所有包下的 serivce 子包下所有类中的 doSome()方法为切入点 |

\+  符号的使用：

| 表达式                                           | 意义                                                         |
| ------------------------------------------------ | ------------------------------------------------------------ |
| **(\* com.xyz.service.IAccountService.\*(..))**  | IAccountService 接口中的任意方法                             |
| **(\* com.xyz.service.IAccountService+.\*(..))** | IAccountService 若为接口，则为接口中的<br />任意方法及其所有实现类中的任意方法；<br />若为类，则为该类及其子类中的任意方法 |

### 3.6.2 AspectJ 的开发环境

#### （1）所需Jar包

在之前的基础上导入两个 Jar 包：

+ aspectjweaver-1.8.10.jar
+ spring-aspects-4.3.6.RELEASE.jar

#### （2）所需约束

引入帮助文档的 AOP 约束即可。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:aop="http://www.springframework.org/schema/aop"
	xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="
        http://www.springframework.org/schema/beans 
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop 
        http://www.springframework.org/schema/aop/spring-aop.xsd">
```

### 3.6.3 AspectJ基于注解

基于注解的 AOP 实现 AspectJ 提供了以注解方式对于 AOP 的实现。

#### （1）定义业务接口以及其实现类

**ISomeService.java**：在接口定义三个方法，第二个返回值为 String，其余的为 void。

```java
public interface ISomeService {
	// 目标方法1
	void doFirst();
	// 目标方法2
	String doSecond();
	// 目标方法3
	void doThird();
}
```

**SomeServiceImpl.java**：在实现类中，第二个方法返回小写字母—— ” abcde " ，第三个方法预备一个异常来实验异常通知。

```java
//目标类
public class SomeServiceImpl implements ISomeService{

	@Override
	public void doFirst() {
		System.out.println("执行doFirst()方法");
	}

	@Override
	public String doSecond() {
		System.out.println("执行doSecond()方法");
		return "abcde";
	}

	@Override
	public void doThird() {
		/* System.out.println("执行doThird()方法" + 3/0); */
		System.out.println("执行doThird()方法");
	}
}
```

#### （2）定义Xml文件

在Xml文件中，注册切面和目标对象，再进行配置自动代理即可。

```xml
<!-- 注册切面 -->
<bean id="myAspect" class="com.hahg.aop07.MyAspect" />

<!-- 定义目标对象 -->
<bean id="someService" class="com.hahg.aop07.SomeServiceImpl" />

<!-- 配置aspect根据注解自动代理 -->
<aop:aspectj-autoproxy />
```

#### （3）定义切面类

##### A、前置通知-@Before

为第一个方法织入前置通知，在前置通知的方法的参数中可以使用 JoinPoint 对象，其 **可以输出切入点信息**。

```java
	@Before(value = "execution(* *..ISomeService.doFirst(..))")
	public void myBefore() {
		System.out.println("执行前置通知");
	}

	@Before(value = "execution(* *..ISomeService.doFirst(..))")
	public void myBefore(JoinPoint jp) {
		System.out.println("执行前置通知，jp" + jp);
	}
```

运行结果如下：

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%B3%A8%E8%A7%A3%E5%89%8D%E7%BD%AE%E8%BF%90%E8%A1%8C%E7%BB%93%E6%9E%9C2.png" style="zoom:80%;" />

当然也可以使用 JoinPoint 对象的相关方法，例如 getSignature() 方法，以下是其方法运行结果。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%B3%A8%E8%A7%A3%E5%89%8D%E7%BD%AE%E9%80%9A%E7%9F%A5%E8%BF%90%E8%A1%8C%E7%BB%93%E6%9E%9C.png" style="zoom:80%;" />

##### B、后置通知-@AfterReturning

为第二个方法织入后置通知，在后置通知的方法的参数中可以 **获取到被织入方法的返回值**，**不过需要在注解的 returing 属性中指定返回值的变量名**。

```java
	@AfterReturning(value = "execution(* *..ISomeService.doSecond(..))")
	public void myAfterReturning() {
		System.out.println("执行后置通知" );
	}
	
	@AfterReturning(value = "execution(* *..ISomeService.doSecond(..))", returning = "result")
	public void myAfterReturning(Object result) {
		System.out.println("执行后置通知，result=" + result);
	}
```

运行结果如下：

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%B3%A8%E8%A7%A3%E5%90%8E%E7%BD%AE%E8%BF%90%E8%A1%8C%E7%BB%93%E6%9E%9C.png" style="zoom:80%;" />

##### C、环绕通知-@Around

为第二个方法织入环绕通知，在环绕通知的方法的参数中**有 ProceedingJoinPoint 变量，其可以使用 proceed 方法来让方法执行**。

这里需要将 proceed 方法的返回值作为一个变量，再将这个变量作为 myAround 方法的返回值。

在方法中，可以增强原先方法的返回值，例如下面的例子就是将返回值增强为大写。

```java
	@Around(value = "execution(* *..ISomeService.doSecond(..))")
	public Object myAround(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
		System.out.println("执行环绕通知之前");
		Object result = proceedingJoinPoint.proceed();
		System.out.println("执行环绕通知之后");
		if (result != null) {
			result = ((String) result).toUpperCase();
		}
		return result;
	}
```

运行结果如下：由后置通知输出的结果可知，增强已成功实现。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%B3%A8%E8%A7%A3%E7%8E%AF%E7%BB%95%E8%BF%90%E8%A1%8C%E7%BB%93%E6%9E%9C.png" style="zoom:80%;" />

##### D、异常通知-@AfterThrowing

为第三个方法织入异常通知。在异常通知的方法的参数中**有自定义异常变量，其可以用来输出对应的提示语句**，需要在注解的 throwing 属性中指定异常变量的变量名。 

```java
	@AfterThrowing(value = "execution(* *..ISomeService.doThird(..))")
	public void myAfterThrowing() {
		System.out.println("执行异常通知");
	}

	@AfterThrowing(value = "execution(* *..ISomeService.doThird(..))", throwing = "ex")
	public void myAfterThrowing(Exception ex) {
		System.out.println("执行异常通知，异常ex=" + ex.getMessage());
	}
```

##### E、最终通知-@After 

无论目标方法是否抛出异常，该增强均会被执行。

下图为正常的运行结果：

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%B3%A8%E8%A7%A3%E6%9C%80%E7%BB%88%E8%BF%90%E8%A1%8C%E7%BB%93%E6%9E%9C.png" style="zoom:80%;" />

下图为出现异常的运行结果：最终通知依旧执行。

![](https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%B3%A8%E8%A7%A3%E5%BC%82%E5%B8%B8%E8%BF%90%E8%A1%8C%E7%BB%93%E6%9E%9C.png)

##### F、定义切入点-@Pointcut 

在本例中，当<u>较多的通知增强方法使用同一个切入点时需要复制多次表达式</u>，编写、维护均较为麻烦。

AspectJ 提供了@Pointcut 注解，用于定义 execution 切入点表达式。 

其用法是，将@Pointcut 注解在一个方法之上，以后所有的 executeion 的 value 属性值 均可使用该方法名作为切入点。代表的就是@Pointcut 定义的切入点。这个使用@Pointcute 注解的方法一般使用 private 的标识方法，即没有实际作用的方法。

```java
	//定义切入点
	@Pointcut(value = "execution(* *..ISomeService.doThird(..))")
	private void mypointcut() {}
	
	@After(value = "mypointcut()")
	public void myAfter() {
		System.out.println("执行最终通知");
	}
```

### 3.6.4 AspectJ 基于XML

AspectJ 除了提供了基于注解的 AOP 的实现外，还提供了以 XML 方式的实现。 

切面就是一个普通对象类，而用于增强的方法就是普通的方法。通过配置文件，将切面中的功能增强织入到了目标类的目标方法中。

#### （1）修改切面类

将所有的注解删除即可。

#### （2）修改Xml文件

在Xml文件中，需要利用标签配置 Aop。

##### A、&lt;aop:config/>标签

该标签为配置 Aop 的第一级标签

```xml
<aop:config>
    
</aop:config>
```

##### B、&lt;aop:pointcut/>标签

标签的 expression 属性对应注解的 value 属性；id 属性对应空方法的方法名。

```xml
<!--
  定义切入点
  @Pointcut(value = "execution(* *..ISomeService.doThird(..))")
  private void mypointcut() {} 
 -->
    <aop:pointcut expression="execution(* *..ISomeService.doFirst(..))" id="mydoFirstPointcut"/>
    <aop:pointcut expression="execution(* *..ISomeService.doSecond(..))" id="mydoSecondPointcut"/>
    <aop:pointcut expression="execution(* *..ISomeService.doThird(..))" id="mydoThirdPointcut"/>
```

##### C、&lt;aop:aspect/>标签

该标签将切面类引入，以便于之后选择切入类型以及所织入的方法。

```xml
	<!-- @Aspect -->
    <aop:aspect ref="myAspect">
        
    </aop:aspect>
```

##### D、&lt;aop:before/>标签

该标签的属性 pointcut-ref 可以指定切入点；若有两个相同名字的方法，默认选择无参数方法，如果要选择有参数的方法，需要加上该参数的完整类名。

```xml
<!-- 
  前置通知
  @Before(value = "mydoFirstPointcut()") 
  public void myBefore() 
  public void myBefore(JoinPoint jp)
 -->
    <aop:before method="myBefore" pointcut-ref="mydoFirstPointcut"/>
    <aop:before method="myBefore(org.aspectj.lang.JoinPoint)" pointcut-ref="mydoFirstPointcut"/>
```

##### E、&lt;aop:after-returning/>标签

该标签的属性 returning 可以指定返回值的变量名。

```xml
<!-- 
    后置通知
    @AfterReturning(value = "execution(* *..ISomeService.doSecond(..))")
    public void myAfterReturning()
    @AfterReturning(value = "execution(* *..ISomeService.doSecond(..))", returning = "result")
    public void myAfterReturning(Object result) 
-->
    <aop:after-returning method="myAfterReturning" pointcut-ref="mydoSecondPointcut"/>
    <aop:after-returning method="myAfterReturning(java.lang.Object)" pointcut-ref="mydoSecondPointcut" returning="result"/>
```

##### F、&lt;aop:around/>标签

因为环绕通知的方法必须携带 ProceedingJoinPoint 类型的参数，否则 **将无法执行目标方法**。所以在该标签的 method 属性中填写方法名，**无需填写变量名**。

```xml
<!-- 
    环绕通知
    @Around(value = "execution(* *..ISomeService.doSecond(..))")
    public Object myAround(ProceedingJoinPoint proceedingJoinPoint) throws Throwable 
-->
	<aop:around method="myAround" pointcut-ref="mydoSecondPointcut"/>
```

##### G、&lt;aop:after-throwing/>标签

在该标签中可以使用 throwing 属性来指定异常的变量名。

```xml
<!--
    异常通知
    @AfterThrowing(value = "execution(* *..ISomeService.doThird(..))")
    public void myAfterThrowing() 
    @AfterThrowing(value = "execution(* *..ISomeService.doThird(..))", throwing = "ex")
    public void myAfterThrowing(Exception ex) 
--> 
    <aop:after-throwing method="myAfterThrowing" pointcut-ref="mydoThirdPointcut"/>
    <aop:after-throwing method="myAfterThrowing(java.lang.Exception)" throwing="ex" pointcut-ref="mydoThirdPointcut"/>
```

##### H、&lt;aop:after/>标签

```xml
<!-- 
    最终通知
    @After(value = "mypointcut()")
    public void myAfter() 
-->
	<aop:after method="myAfter" pointcut-ref="mydoThirdPointcut"/>
```