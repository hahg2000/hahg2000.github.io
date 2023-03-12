# 二、Spring与IoC

​	控制反转（IOC，Inversion of Control），<span style="color:red">是一个概念，是一种思想。</span>

​	指将传统上由程序代码直接操控的对象调用权交给容器，通过容器来实现对象的装配和管理。控制反转就是对对象控制权的转移，从程序代码本身反转到了外部容器。

​	IoC 是一个概念，是一种思想，其实现方式多种多样。当前比较流行的实现方式有两种：依赖注入和依赖查找。依赖注入方式应用更为广泛。

+ 依赖查找：Dependency  Lookup，DL，容器提供回调接口和上下文环境给组件，程序代码则 **需要提供具体的查找方式**。比较典型的是依赖于 JNDI 系统的查找。
+ 依赖注入：Dependency Injection，DI，程序代码不做定位查询，这些工作**由容器自行完成**。

​	依赖注入DI是指程序运行过程中，若需要调用另一个对象协助时，无须在代码中创建被调用者，而是依赖于外部容器，由外部容器创建后传递给程序。

​	Spring 的依赖注入对调用者与被调用者几乎没有任何要求，完全支持 POJO 之间依赖关系的管理。

​	<span style="color:red">依赖注入是目前最优秀的解耦方式。
</span>依赖注入让 Spring 的 Bean 之间以配置文件的方式组织在一起，而不是以硬编码的方式耦合在一起的。

## 2.1 Spring 程序开发

### 2.1.1 导入Jar包

### 2.1.2 定义接口与实现类

**IStudentService.java：**

```java
public interface IStudentService {
	void some();
}
```

**StudentServiceImpl.java：**

```java
public class StudentServiceImpl implements IStudentService {

	@Override
	public void some() {
		System.out.println("执行 some() 方法");
	}
}
```

### 2.1.3 创建 Spring 配置文件

​	在下载的 Spring 压缩文件夹中，跟着以下路径打开文件，然后在前面部分即可看见配置文件的文件头格式。

【 spring-framework-4.3.6.RELEASE / docs / spring-framework-reference / html / xsd-configuration.html 】

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="
        http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- bean definitions here -->

</beans>
```

### 2.1.4 定义测试类

#### （1）ApplicationContext 接口容器

ApplicationContext 用于加载 Spring 的配置文件，在程序中充当 “ 容器 ” 的角色。其实现类有两个。可以通过 **Ctrl +T** 来打开结构树来查看它：

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E5%AE%B9%E5%99%A8%E7%BB%A7%E6%89%BF%E6%A0%91.png" style="zoom:80%;" />

##### A、配置文件在类路径下

若 Spring 配置文件存放在项目的类路径下，则使用 ClassPathXmlApplicationContext 实现 类进行加载

```java
// 获取容器
ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
```

##### B、配置文件在本地目录中 

若 Spring 配置文件存放在本地磁盘目录中，则使用 FileSystemXmlApplicationContext 实现 类进行加载

```java
// 获取容器
ApplicationContext applicationContext = new ClassPathXmlApplicationContext("d:/applicationContext.xml");
```

##### C、配置文件在项目根路径下 

若 Spring 配置文件存放在项目的根路径下，同样使用 FileSystemXmlApplicationContext 实现 类进行加载。该配置文件与 src 目录同级，而非在 src 中。

```java
// 获取容器
ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
```

#### （2）BeanFactory 接口容器 

​	BeanFactory 接口对象也可作为 Spring 容器出现。在接口 ApplicationContext 的源代码可知，这个接口继承了 HierarchicalBeanFactory 这个父类。

```java
public interface ApplicationContext extends EnvironmentCapable, ListableBeanFactory, HierarchicalBeanFactory,
		MessageSource, ApplicationEventPublisher, ResourcePatternResolver {
```

​	继续跟进 HierarchicalBeanFactory 源代码，发现其继承 BeanFactory 接口，即可以说明 BeanFactory 接口是 ApplicationContext 接口的父类。

```java
public interface HierarchicalBeanFactory extends BeanFactory {
```

​	这时打开 BeanFactory 的结构树，发现 HierarchicalBeanFactory 的实现类是上面第（1）所使用的，而 AutowireCapableBeanFactory 的实现类也有两种类名相同的实现类。现在试着用这两个实现类来创建 BeanFactory。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/BeanFactory.png" style="zoom:80%;" />

​	另外可以使用 Ctri + O 来查看类内结构。可以知道 ApplicationContext 对象的 getBean 是继承父类 BeanFactory  的。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/application%E7%B1%BB%E7%BB%93%E6%9E%84.png" style="zoom:80%;" /><img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/BeanFactory%E7%B1%BB%E7%BB%93%E6%9E%84.png" style="zoom:75%;" />

​	这时打开 XmlBeanFactory 源代码发现其已经过期，所以这个案例只供学习使用。其定义了两个构造方法，其中都使用了 Resource 类的对象作为参数。

```java
public class XmlBeanFactory extends DefaultListableBeanFactory {

	private final XmlBeanDefinitionReader reader = new XmlBeanDefinitionReader(this);

	/**
	 * Create a new XmlBeanFactory with the given resource,
	 * which must be parsable using DOM.
	 * @param resource XML resource to load bean definitions from
	 * @throws BeansException in case of loading or parsing errors
	 */
	public XmlBeanFactory(Resource resource) throws BeansException {
		this(resource, null);
	}

	/**
	 * Create a new XmlBeanFactory with the given input stream,
	 * which must be parsable using DOM.
	 * @param resource XML resource to load bean definitions from
	 * @param parentBeanFactory parent bean factory
	 * @throws BeansException in case of loading or parsing errors
	 */
	public XmlBeanFactory(Resource resource, BeanFactory parentBeanFactory) throws BeansException {
		super(parentBeanFactory);
		this.reader.loadBeanDefinitions(resource);
	}
}
```

​	打开 Resource 类的结构树，发现其有两个实现类 ClassPathResource 和 FileSystemResource，和上面第（1）所使用的实现类 类名差不多。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/Resource%E7%BB%93%E6%9E%84%E6%A0%91.png" alt="" style="zoom:80%;" />

​	现在问题是如何使用这些实现类，所以打开其中一个类的源代码。打开 ClassPathResource 的源代码，发现其构造方法需要传入一个路径字符串参数，而第 9 行的注释，说明了路径为绝对类路径。

```java
public class ClassPathResource extends AbstractFileResolvingResource {

    /**
	 * Create a new {@code ClassPathResource} for {@code ClassLoader} usage.
	 * A leading slash will be removed, as the ClassLoader resource access
	 * methods will not accept it.
	 * <p>The thread context class loader will be used for
	 * loading the resource.
	 * @param path the absolute path within the class path
	 * @see java.lang.ClassLoader#getResourceAsStream(String)
	 * @see org.springframework.util.ClassUtils#getDefaultClassLoader()
	 */
	public ClassPathResource(String path) {
		this(path, (ClassLoader) null);
	}
}
```

​	修改测试类，运行程序发现运行结果与第（1）一致

```java
@Test
	public void test01() {
		// 获取容器
		BeanFactory bf=new XmlBeanFactory(new ClassPathResource("applicationContext.xml"));
		
		IStudentService service = (IStudentService) bf.getBean("studentService");
		service.some();
	}
```

#### （3）两个接口容器的区别

​	虽然这两个接口容器所要加载的 Spring 配置文件是同一个文件，但在代码中的这两个容器对象却 **不是同一个对象，即不是同一个容器**，它们对于容器内对象的装配（创建）时机是不同的。

+ ApplicationContext 容器，会在容器对象初始化时，将其中的所有对象一次性全部装配好；
+ BeanFactory 容器，对容器中对象的装配与加载采用延迟加载策略，即在第一次调用 getBean() 时，才真正装配该对象。

### 2.1.5 对象的创建

Java 对象的创建是先分配内存，为对象分配内存分为三种类型：

+ 成员变量存放在堆里；

+ 方法里的局部变量存放在栈里；

+ 静态变量存放在方法区。

而一个空对象占有 8 个字节，空对象如下面所示：

```java
Object object = new Object();
```

分配内存完成后，将首先执行动态代码块，再执行构造方法。下面举一个例子：

```java
public class StudentServiceImpl implements IStudentService {

	private int a=5;
	
	// 动态代码块
	{
		System.out.println("执行动态代码块 a="+a);
	}
	
	public StudentServiceImpl() {
		super();
		System.out.println("执行构造方法 a="+a);
	}
```

在 StudentServiceImpl 类中添加以上代码，然后执行，得以下结果：

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E5%8A%A8%E6%80%81%E4%BB%A3%E7%A0%81%E5%9D%97.png" style="zoom:80%;" />

##  2.2 Bean 的装配

举例：beanAssemble 项目 

Bean 的装配，即 Bean 对象的创建。容器根据代码要求 **创建 Bean 对象后再传递给代码的过程**，称为 Bean 的装配。

### 2.2.1 默认装配方式

代码通过 getBean() 方式从容器获取指定的 Bean 实例，容器首先会调用 Bean 类的无参构造器，创建空值的实例对象。

#### （1）创建接口

**IUserService.java：**接口有两个方法，一个是做一些，一个是做其他。

```java
public interface IUserService {

	void doSome();

	void doOther();
}
```

#### （2）创建实现类

UserServiceImpl.java：在实现类分别在两个方法中，输出对应的语句；并创建无参构造器，容器需要使用它来创建对象。

```java
public class UserServiceImpl implements IUserService {

	public UserServiceImpl() {

	}

	@Override
	public void doSome() {
		System.out.println("执行 doSome() 方法");
	}

	@Override
	public void doOther() {
		System.out.println("执行 doOther() 方法");
	}
}
```

#### （3）创建xml文件

xml 的约束属性可以在帮助文档中查看，使用 &lt;bean/> 标签来创建对象

+ id 为该 bean 对象的唯一标识；
+ class 用于指示该 bean 对象的类型

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="
        http://www.springframework.org/schema/beans 
        http://www.springframework.org/schema/beans/spring-beans.xsd">

	<bean id="userService" class="com.hahg.ba01.UserServiceImpl"/>
	
</beans>
```

#### （4）创建测试类

在测试类中，利用 ClassPathXmlApplicationContext 类来加载 xml 文件，并使用 getBean 方法来获取对象。

```java
@Test
	public void test01() {
		String xmlPath="com/hahg/ba01/bean01.xml";
		ApplicationContext ac=new ClassPathXmlApplicationContext(xmlPath);
		IUserService userService = (IUserService) ac.getBean("userService");
		
		userService.doSome();
		userService.doOther();
	}
```

### 2.2.2 动态工厂 Bean

有些时候，项目中需要通过工厂类来创建 Bean 实例，而不能像前面例子中直接由 Spring 容器来装配 Bean 实例。使用工厂模式创建 Bean 实例，就会使工厂类与要创建的 Bean 类耦合到一起。

#### （1）将动态工厂 Bean 作为普通 Bean 使用

将动态工厂 Bean 作为普通 Bean 来使用是指：

+ 在配置文件中注册过动态工厂 Bean 后， 测试类直接通过 getBean()获取到工厂对象；
+ 再由工厂对象调用其相应方法创建相应的目标对象。
+ 配置文件中无需注册目标对象的 Bean。因为目标对象的创建不由 Spring 容器来管理

但，这样做的缺点是，<u>不仅工厂类与目标类耦合到了一起，测试类与工厂类也耦合到了一起</u>

##### A、创建工厂类

```java
public class ServiceFactory {

	public IUserService getUservice() {
		return new UserServiceImpl();
	}
}
```

##### B、修改xml文件

```xml
	<bean id="serviceFactory" class="com.hahg.ba02.ServiceFactory"/>
```

##### C、修改测试类

```java
@Test
	public void test02() {
		String xmlPath="com/hahg/ba02/bean01.xml";
		ApplicationContext ac=new ClassPathXmlApplicationContext(xmlPath);
		ServiceFactory serviceFactory = (ServiceFactory) ac.getBean("serviceFactory");
		IUserService userservice=serviceFactory.getUservice();
		userservice.doSome();
		userservice.doOther();	
	}
```

#### （2）使用 Spring 的动态工厂 Bean

Spring 对于使用动态工厂来创建的 Bean，有专门的属性定义。

+ factory-bean 指定相应的工厂 Bean；
+ factory-method 指定创建所用方法。

此时配置文件中至少会有两个 Bean 的定义：工厂类的 Bean，与工厂类所要创建的目标类 Bean。而测试类中不再需要获取工厂 Bean 对象了，可以直接获取目标 Bean 对象。**实现测试类与工厂类间的解耦**。

##### A、修改xml文件

```xml
<bean id="serviceFactory" class="com.hahg.ba02.ServiceFactory"/>
	
<bean id="userService" factory-bean="serviceFactory" factory-method="getUservice"/>
```

##### B、修改测试类

```java
@Test
	public void test02() {
		String xmlPath="com/hahg/ba02/bean01.xml";
		ApplicationContext ac=new ClassPathXmlApplicationContext(xmlPath);
		//  从Spring容器中获取Service
		IUserService userService = (IUserService) ac.getBean("userService");
		userService.doSome();
		userService.doOther();
		
	}
```

### 2.2.3 静态工厂 Bean

使用工厂模式中的静态工厂来创建实例 Bean。

此时需要注意，静态工厂 **无需工厂实例**，所以不再需要定义静态工厂。 

而对于工厂所要创建的 Bean，其不是由自己的类创建的，而是由工厂类创建的，所以需要指定所用工厂类。故 class 属性指定的是工厂类而非自己的类。当然，还需要通过 factory-method 属性指定工厂方法。

##### A、修改xml文件

```xml
	<bean id="userService" class="com.hahg.ba03.ServiceFactory" 
		factory-method="getUservice"/>
```

### 2.2.4 容器中 Bean 的作用域

当通过 Spring 容器创建一个 Bean 实例时，不仅可以完成 Bean 的实例化，还可以通过 scope 属性，为 Bean 指定特定的作用域。Spring 支持 5 种作用域。

1. singleton：单态模式。即在整个 Spring 容器中，使用 singleton 定义的 Bean 将是单例的， **只有一个实例**。**默认为单态的**。
2. prototype：原型模式。即每次使用 getBean 方法获取的同一个的实例 **都是一个新的实例**。
3. request：对于每次 HTTP 请求，都将会产生一个不同的 Bean 实例。
4. session：对于每个不同的 HTTP session，都将产生一个不同的 Bean 实例。
5. global session：每个全局的 HTTP session 对应一个 Bean 实例。典型情况下，仅在使用 portlet 集群时有效，多个 Web 应用共享一个 session。一般应用中，global-session 与 session 是等同的。

::: warning

1. 对于 scope 的值 request、session 与 global session，只有在 Web 应用中使用 Spring 时， 该作用域才有效。 
2. 对于 scope 为 singleton 的单例模式，该 Bean 是在容器被创建时即被装配好了。 
3. 对于 scope 为 prototype 的原型模式，Bean 实例是在代码中使用该 Bean 实例时才进行 装配的。

:::

### 2.2.5 Bean 后处理器 

​	Bean 后处理器是一种特殊的 Bean，容器中所有的 Bean 在初始化时，均会自动执行该类的两个方法。由于该 Bean 是 **由其它 Bean 自动调用执行**，不是程序员手工调用，故此 Bean 无须 id 属性。 

​	需要做的是，在 Bean 后处理器类方法中，只要对 Bean 类与 Bean 类中的方法进行判断， 就可实现 **对指定的 Bean 的指定方法进行功能扩展与增强**。方法返回的 Bean 对象，即是增过的对象。

​	代码中需要自定义 Bean 后处理器类。该类就是实现了接口 BeanPostProcessor 的类。该接口中包含两个方法，分别在 **目标 Bean 初始化完毕之前与之后** 执行。它们的返回值为：功能被扩展或增强后的 Bean 对象。下面为两个方法的定义：

+ public Object postProcessBeforeInitialization(Object bean, String beanId)  throws BeansException  
  该方法会在目标 Bean 初始化完毕之前由容器自动调用。 
+ public Object postProcessAfterInitialization(Object bean, String beanId) throws BeansException  
  该方法会在目标 Bean 初始化完毕之后由容器自动调用。

​	它们的参数分别是：

+ 第一个参数是系统即将初始化的 Bean 实例；
+ 第二个参数是该 Bean 实 例的 id 属性值。若 Bean 没有 id 就是 name 属性值。

​	而 Bean 初始化完毕有一个标志：一个方法被执行，即当该方法被执行时，表示该 Bean 被初始化完毕。<u>所以 Bean 后处理器中两个方法的执行，是在这个方法之前之后执行。而这个方法在后面将会讲到。</u>

举例： ba05 包 

程序中有一个业务接口 IUserService，其有两个业务方法 some() 与 other()。在其实现类 UserServiceImpl 中的 some() 方法返回 “ABCDE” ，other() 方法返回 “ FGHIJ ”。

要求：对 UserServiceImpl 的其中一个方法进行增强，并输出其开始执行时间与执行结束时间。

#### （1）修改实现类

**UserServiceImpl.java：** 两个分别返回不同的字符串，并输出相应的提示信息。

```java
public class UserServiceImpl implements IUserService {

	@Override
	public String doSome() {
		System.out.println("执行 doSome() 方法");
		return "ABCDE";
	}

	@Override
	public String doOther() {
		System.out.println("执行 doOther() 方法");
		return "FGHIJ";
	}
}
```

#### （2）修改Xml文件

**bean01.xml：** 在 Xml 文件中注册 BeanPostProcesser 对象。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="
        http://www.springframework.org/schema/beans 
        http://www.springframework.org/schema/beans/spring-beans.xsd">

	<bean id="userService" class="com.hahg.ba05.UserServiceImpl" />
	<!-- 注册BeanPostProcesser对象 -->
	<bean class="com.hahg.ba05.MyBeanPostProcesser" />
</beans> 
```

#### （3）新建处理器类

**MyBeanPostProcesser.java：** 在处理器类中，实现 BeanPostProcessor 接口，并在 postProcessAfterInitialization 方法中增强目标对象的功能。

+ 增强功能将会使用 JDK 动态代理
+ 因为只需要增强一个方法，所以在 invoke 方法中，可以判断方法的名称，再执行相对应的操作。
+ 第 17 行：进行字符串判断时，可以使用 字符串.equal(需要判断的对象名) ，这样可以避免对象为 null 时，进行判断时出错。

```java
public class MyBeanPostProcesser implements BeanPostProcessor {

	@Override
	public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		System.out.println("执行 before 方法");
		return bean;
	}

	@Override
	public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		System.out.println("执行 after 方法");
		Object instance = Proxy.newProxyInstance(bean.getClass().getClassLoader(), bean.getClass().getInterfaces(),
				new InvocationHandler() {
					@Override
					public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
						Object invoke = method.invoke(bean, args);
						if ("doSome".equals(method.getName())) {
							return ((String) invoke).toLowerCase();
						}
						return invoke;
					}
				});
		return instance;
	}
}
```

#### （4）修改测试类

```java
@Test
	public void test04() {
		String xmlPath="com/hahg/ba05/bean01.xml";
		ApplicationContext ac=new ClassPathXmlApplicationContext(xmlPath);
		//  从Spring容器中获取Service
		IUserService userService = (IUserService) ac.getBean("userService");
		System.out.println(userService.doSome());
		System.out.println(userService.doOther());
	}
```

#### （5）多个Bean的情况

​	如果存在多个 Bean ，并且存在相同的方法名的情况下，处理器将会对两个 Bean 里的相同名字的方法同时操作，这时需要进行 Bean 的名字判断，如第 4 行。修改下述代码。

```java
@Override
	public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		System.out.println("执行 after 方法");
		if ("userService".equals(beanName)) {
			Object instance = Proxy.newProxyInstance(bean.getClass().getClassLoader(), bean.getClass().getInterfaces(),
					new InvocationHandler() {
				// 省略相同内容
			return instance;
		}
		return bean;
	}
```

### 2.2.6 定制 Bean 的生命始末 

可以为 Bean 定制 **初始化后** 的生命行为，也可以为 Bean 定制 **销毁前** 的生命行为。 

举例：ba06 包。

#### （1）修改实现类

 首先，这些方法需要在 Bean 类中事先定义好：是方法名随意的 public void 方法，里面输出相对应的信息。

```java
public class UserServiceImpl implements IUserService {

	@Override
	public String doSome() {
		System.out.println("执行 doSome() 方法");
		return "ABCDE";
	}

	@Override
	public String doOther() {
		System.out.println("执行 doOther() 方法");
		return "FGHIJ";
	}
	
	public void setUp() {
		System.out.println("初始化完毕之后，将进行后续工作");
	}
	
	public void tearDown() {
		System.out.println("对象将要销毁");
	}
}
```

#### （2）修改Xml文件

其次，在配置文件的标签中增加如下属性：

+ init-method：指定初始化方法的方法名 
+ destroy-method：指定销毁方法的方法名

```xml
<bean id="userService" class="com.hahg.ba05.UserServiceImpl"
		init-method="setUp" destroy-method="tearDown"/>
```

#### （3）输出结果

根据控制台可知，上面所提到：在一个方法执行完毕之后 bean 就会完成初始化，这个方法就是 init-method 属性执行的方法

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/bean%E7%94%9F%E5%91%BD%E5%A7%8B%E6%9C%AB.png" style="zoom:80%;" />

注意，若要看到 Bean 的 destroy-method 的执行结果，需要满足两个条件： 

1. Bean 为 singleton，即单例；
2. 要确保容器关闭。接口 ApplicationContext 没有 close()方法，但其实现类有。所以，可以将 ApplicationContext 强转为其实现类对象，或直接创建的就是实现类对象。

destroy-method 方法将在下面演示。

### 2.2.7 Bean 的生命周期

Bean 实例从创建到最后销毁，需要经过很多过程，执行很多生命周期方法。

Step1：调用无参构造器，创建实例对象。

```java
public UserServiceImpl() {
		System.out.println("Step1：执行无参构造器");
	}
```

Step2：调用参数的 setter，为属性注入值。

```java
public void setA(String a) {
		this.a = a;
		System.out.println("Step2：执行setter方法，a为"+a);
	}
```

Step3：若 Bean 实现了 BeanNameAware 接口，则会执行接口方法 setBeanName(String beanId)， 使 Bean 类可以获取其在容器中的 id 名称。 

```java
@Override
	public void setBeanName(String name) {
		System.out.println("Step3：设置Bean的名字，Bean的名字为"+name);
	}
```

Step4：若 Bean 实现了 BeanFactoryAware 接口，则执行接口方法 setBeanFactory(BeanFactory  factory)，使 Bean 类可以获取到 BeanFactory 对象。

```java
@Override
	public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
		System.out.println("Step4：设置BeanFactory，BeanFactory为"+beanFactory.toString());
	}
```

Step5 ： 若定义并注册了 Bean 后 处 理 器 BeanPostProcessor ， 则 执 行 接 口 方 法 postProcessBeforeInitialization()。

```java
@Override
	public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		System.out.println("Step5：执行 postProcessBefore 方法");
		return bean;
	}
```

Step6：若 Bean 实现了 InitializingBean 接口，则执行接口方法 afterPropertiesSet ()。该方法在 Bean 的所有属性的 set 方法执行完毕后执行，是 Bean 初始化结束的标志，即 Bean 实例化将要快结束。

```java
@Override
	public void afterPropertiesSet() throws Exception {
		System.out.println("Step6：完成 Bean 属性的设置");
	}
```

Step7：若设置了 init-method 方法，则执行。

```xml
<bean id="userService" class="com.hahg.ba05.UserServiceImpl"
		init-method="setUp" destroy-method="tearDown">
```

Step8 ： 若定义并注册了 Bean 后处理器 BeanPostProcessor，则执行接口方法 postProcessAfterInitialization()。

```java
@Override
	public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		System.out.println("Step8：执行 postProcessAfter 方法");
		return bean;
	}
```

 Step9：在主函数中执行业务方法。

```java
System.out.println(userService.doSome());
```

 Step10：若 Bean 实现了 DisposableBean 接口，则执行接口方法 destroy()。

```java
@Override
	public void destroy() throws Exception {
		System.out.println("Step10：实现接口的销毁之前");
	}
```

 Step11：若设置了 destroy-method 方法，则执行。

```xml
<bean id="userService" class="com.hahg.ba05.UserServiceImpl"
		init-method="setUp" destroy-method="tearDown">
```

执行结果如下图：

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/bean%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.png" style="zoom:70%;" />

### 2.2.8 标签的 id 属性与 name 属性 

一般情况下，命名使用 id 属性，而不使用 name 属性。在没有 id 属性的情况下， name 属性与 id 属性作用是相同的。但当中含有一些特殊字符时，就需要使用 name 属性了。 

id 的命名需要满足 XML 对 ID 属性命名规范：<span style="color:red">必须以字母开头，可以包含字母、数字、 下划线、连字符、句话、冒号。 </span>

<span style="color:red">而 name 属性值则可以包含各种字符。</span>

## 2.3 基于 XML 的 DI 

举例：项目 di 

### 2.3.1 注入分类

Bean 实例在调用无参构造器创建了空值对象后，就要对 Bean 对象的属性进行初始化。 **初始化是由容器自动完成的，称为注入**。

根据注入方式的不同，常用的有两类：**设值注入、 构造注入**。 还有另外一种，实现特定接口注入。由于这种方式采用侵入式编程，污染了代码，所以几乎不用。

#### （1）设值注入

 设值注入是指，通过 setter 方法传入被调用者的实例。这种注入方式简单、直观，因而在 Spring 的依赖注入中大量使用。 

举例：di01 包

##### A、创建Bean类

**Student.java：**

```java
public class Student {
	private String name;
	private int age;
	private School school;
	
	// toString
	// setter
}
```

**School.java：**

```java
public class School {
	private String name;
    
	// toString
	// setter
}
```

##### B、创建Xml文件

当指定 bean 的某属性值为另一 bean 的实例时，通过 ref 指定它们间的引用关系。ref 的值必须为某 bean 的 id 值。对于其它 Bean 对象的引用，除了标签的 ref 属性外，还可以使用标签。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="
        http://www.springframework.org/schema/beans 
        http://www.springframework.org/schema/beans/spring-beans.xsd">

	<bean id="mySchool" class="com.hahg.di01.School">
		<property name="name" value="清华大学" />
	</bean>

	<bean id="myStudent" class="com.hahg.di01.Student">
		<property name="name" value="张三" />
		<property name="age" value="18" />
		<!-- 
			第一种写法
		<property name="school" ref="mySchool" /> 
		-->
		
		<!-- 第二种写法 -->
		<property name="school">
			<ref bean="mySchool"/>
		</property>
	</bean>
</beans>
```

#### （2）构造注入

构造注入是指，在构造调用者实例的同时，完成被调用者的实例化。即，使用构造器设置依赖关系。

 举例：di02 包

##### A、修改Bean类

Student.java：为了防止程序出错，建议使用构造注入时也生成无参构造器。

```java
public class Student {
	private String name;
	private int age;
	private School school;
	
	
	public Student() {
	}

	public Student(String name, int age, School school) {
		super();
		this.name = name;
		this.age = age;
		this.school = school;
	}

	@Override
	public String toString() {
		return "Student [age=" + age + ", name=" + name + ", school=" + school + "]";
	}
}
```

##### B、修改Xml文件

标签中用于指定参数的属性有： 

+ name：指定参数名称，推荐使用 name 指定。 
+ index：指明该参数对应着构造器的第几个参数，从 0 开始。不过，该属性不要也行， 但要注意，若参数类型相同，或之间有包含关系，则需要保证赋值顺序要与构造器中的参数顺序一致。
+ type 属性可用于指定其类型。基本类型直接写类型关键字即可，非基本类型需要写全限定性类名。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="
        http://www.springframework.org/schema/beans 
        http://www.springframework.org/schema/beans/spring-beans.xsd">

	<bean id="mySchool" class="com.hahg.di02.School">
		<property name="name" value="清华大学" />
	</bean>

	<bean id="myStudent" class="com.hahg.di02.Student">
		<!-- 推荐使用 -->
		<constructor-arg name="name" value="张三"/>
		<constructor-arg name="age" value="20"/>
		<constructor-arg name="school" ref="mySchool"/> 
		
		<!-- 
			index 写法
		<constructor-arg index="0" value="张三"/>
		<constructor-arg index="1" value="20"/>
		<constructor-arg index="2" ref="mySchool"/> 
		-->
	</bean>
</beans>
```

### 2.3.2 命名空间注入（了解）

 对于设值注入与构造注入，在配置文件中，除了使用或标 签外，还可使用命名空间注入的方式，让注入的值以标签属性的方式出现。根据注入实现方式的不同，分为 p 命名空间注入与 c 命名空间注入。

+ p 命名空间注入：采用设值注入方式，故需要有相应的 setter 
+ c 命名空间注入：采用构造注入方式，故需要有相应的构造器

#### （1）p 命名空间设值注入 

对于设值注入，也可使用 p 命名空间的方式进行注入。 

举例：di03包

Step1：修改配置文件头，即添加相应约束，在其中声明 p 命名空间。该约束在 Spring 框架 解压目录\docs\spring-framework-reference\htmlsingle\index.html 中。Ctrl+F，对 p-namespace 进行检索。第一个检索结果所链接的位置即有。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/p-namespace.png" style="zoom:80%;" />

Step2：在标签中使用 p 命名空间中的属性。

+ p:bean属性= “ 值 ”——说明：该值为普通值 
+ p:bean属性-ref= “ 值 ” ——说明：该值为其它 beanId

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:p="http://www.springframework.org/schema/p"
	xsi:schemaLocation="
        http://www.springframework.org/schema/beans 
        http://www.springframework.org/schema/beans/spring-beans.xsd">

	<bean id="mySchool" class="com.hahg.di03.School">
		<property name="name" value="清华大学" />
	</bean>
	
	<bean id="myStudent" class="com.hahg.di03.Student" p:name="张三" p:age="20" p:school-ref="mySchool"/>

</beans>
```

#### （2）c 命名空间构造注入 

对于构造注入，也可使用 c 命名空间的方式进行注入。

 举例：di03 包 

Step1：修改配置文件头，即添加相应约束，在其中声明 c 命名空间。该约束在 Spring 框架 解压目录\docs\spring-framework-reference\htmlsingle\index.html 中。Ctrl+F，对 c-namespace 进行检索。第一个检索结果所链接的位置即有。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/c-namespace.png" style="zoom:80%;" />

Step2：在标签中使用 c 命名空间中的属性。 

+ c:bean参数= “ 值 ”——说明：该值为普通值 
+ c:bean 参数-ref= “ 值 ”——说明：该值为其它 beanId 


```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:c="http://www.springframework.org/schema/c"
	xsi:schemaLocation="
        http://www.springframework.org/schema/beans 
        http://www.springframework.org/schema/beans/spring-beans.xsd">

	<bean id="mySchool" class="com.hahg.di03.School">
		<property name="name" value="清华大学" />
	</bean>

	<bean id="myStudent" class="com.hahg.di03.Student" c:name="张三"
		c:age="22" c:school-ref="mySchool" />
</beans>
```

### 2.3.3 集合属性注入 

举例：di04 包 

#### （1）为数组注入值

使用 &lt;array/> 标签表示 **数组**；里面的元素为字符串则使用 &lt;value/>标签。

```xml
<property name="strs">
    <array>
        <value>abc</value>
        <value>efg</value>
    </array>
</property>
```

#### （2）为 List 注入值

使用 &lt;list/> 标签表示 **列表**；里面的元素为 bean 对象则使用 &lt;ref/>标签。

```xml
<property name="students">
    <list>
        <ref bean="myStudent1" />
        <ref bean="myStudent2" />
    </list>
</property>
```

#### （3）为 Set 注入值

使用 &lt;set/> 标签表示 **集合**；里面的元素为字符串则使用 &lt;value/>标签。

```xml
<property name="mySet">
    <set>
    	<value>中学</value>
   		<value>大学</value>
    </set>
</property>
```

#### （4）为 Map 注入值

使用 &lt;map/> 标签表示 **字典**；里面的元素使用 &lt;entry/>标签，使用 key 属性表示 key，使用 value 属性表示 value。

```xml
<property name="myMap">
	<map>
		<entry key="weight" value="55" />
		<entry key="height" value="180" />
	</map>
</property>
```

#### （5）为 Properties 注入值

使用 &lt;props/> 标签表示属性；里面的元素使用 &lt;prop/>标签，使用 key 属性表示 key，在左右标签中间表示 value。

```xml
<property name="myProp">
	<props>
		<prop key="tel">123456</prop>
		<prop key="address">麦当劳</prop>
	</props>
</property>
```

#### （6）输出结果

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/mycollections.png" style="zoom:80%;" />

Is-a关系

### 2.3.4 对于域属性的自动注入 

​	对于域属性的注入，也可不在配置文件中显示的注入。可以通过为标签设置 autowire 属性值，为域属性进行隐式自动注入。根据自动注入判断标准的不同，可以分为两种： 

+ byName：根据名称自动注入 

+ byType：根据类型自动注入


#### （1）byName 方式自动注入 

当配置文件中被调用者 Bean 的 id 值与代码中调用者 Bean 类的属性名相同时，可使用 byName 方式，让容器自动将被调用者 Bean 注入给调用者 Bean。

容器是通过调用者的 Bean 类的属性名与配置文件的被调用者 bean 的 id 进行比较而实现自动注入的。

##### A、修改 Xml 文件

```xml
<!-- BeanId需要和类里的属性名一致 -->
	<bean id="school" class="com.hahg.di05.School">
		<property name="name" value="清华大学" />
	</bean>

	<bean id="myStudent" class="com.hahg.di05.Student" autowire="byName"> 
		<property name="name" value="张三" />
		<property name="age" value="18" />
	</bean>
```

#### （2）byType 方式自动注入 

使用 byType 方式自动注入，要求：配置文件中被调用者 bean 的 class 属性指定的类， 要与代码中调用者 Bean 类的某域属性类型同源。即要么相同，要么有 is-a 关系（子类或 是实现类）。但这样的同源的被调用 bean 只能有一个。如果多于一个，容器就不知该匹配哪一个了，就会报错。

##### A、修改测试类

```xml
<!-- 因为根据类型匹配所以这里不需要id属性 -->
	<bean class="com.hahg.di05.School">
		<property name="name" value="清华大学" />
	</bean>

	<bean id="myStudent" class="com.hahg.di05.Student" autowire="byType"> 
		<property name="name" value="张三" />
		<property name="age" value="18" />
	</bean>
```

### 2.3.5 使用 SPEL 注入 

SPEL，Spring Expression Language，即 Spring EL 表达式语言。即，在 Spring 配置文件中 为 Bean 的属性注入值时，可直接使用 SPEL 表达式计算的结果。

SPEL 表达式以 “ # ” 开头，后跟一对大括号。

用法： &lt;bean id="abc" value="#{ … }"/> 

其文档中有其用法举例。在 Spring 框架解压目录 \docs\spring-framework-reference\htmlsingle\index.html 中。Ctrl+F，对 SpEL 进 行检索。第一个检索结果中 9.4.1 所链接的位置即有用法举例。

#### （1）随机数的使用

需求：一个学生的年龄为 0 ~ 50 的随机数。

##### A、修改 Xml 文件

```xml
<bean id="myStudent1" class="com.hahg.di06.Student">
		<property name="name" value="张三" />
		<property name="age" value="#{ T(java.lang.Math).random() * 50 }" />
		<property name="school">
			<ref bean="mySchool"/>
		</property>
	</bean>
```

#### （2）bean 类属性的获取

需求：需要另一个学生，其年龄与上面的一致。

##### A、修改 Bean 类

需要获取 Bean 类的属性值，当然需要生成 getter。

##### B、修改 Xml 文件

使用 【beanId.属性名】来获取其值

```xml
<bean id="myStudent1" class="com.hahg.di06.Student">
		<property name="name" value="张三" />
		<property name="age" value="#{ T(java.lang.Math).random() * 50 }" />
		<property name="school">
			<ref bean="mySchool"/>
		</property>
	</bean>
	<bean id="myStudent2" class="com.hahg.di06.Student">
		<property name="name" value="李四" />
		<property name="age" value="#{ myStudent1.age }" />
		<property name="school">
			<ref bean="mySchool"/>
		</property>
	</bean>
```

#### （3）bean 类方法的使用

需求：第二名同学的年龄若超过 25 岁，则取 25；否则取原值

##### A、修改 Bean 类

在 Student 类里添加如下代码：

```java
public int computeAge() {
	return age > 25 ? 25 : age;
}
```

##### B、修改 Xml 文件

使用【beanId.方法名】来使用指定方法。

```xml
<bean id="myStudent1" class="com.hahg.di06.Student">
		<property name="name" value="张三" />
		<property name="age" value="#{ T(java.lang.Math).random() * 50 }" />
		<property name="school">
			<ref bean="mySchool"/>
		</property>
	</bean>
	<bean id="myStudent2" class="com.hahg.di06.Student">
		<property name="name" value="李四" />
		<!-- 
		第二种使用方式来实现
		<property name="age" value="#{ myStudent1.age>25?25:myStudent1.age}"/> 
		-->
		<property name="age" value="#{ myStudent1.computeAge() }" /> 
		<property name="school">
			<ref bean="mySchool"/>
		</property>
	</bean>
```

### 2.3.6 使用内部 Bean 注入 

若不希望代码直接访问某个 bean，即在代码中通过 getBean 方法获取该 Bean 实例， 则可将该 Bean 的定义放入调用者 bean 定义的内部。

```xml
<bean id="myStudent" class="com.hahg.di07.Student">
    <property name="name" value="张三" />
    <property name="age" value="18" />
    <property name="school">
        <bean class="com.hahg.di07.School">
            <property name="name" value="清华大学" />
        </bean>
    </property>
</bean>
```

### 2.3.7 使用同类抽象 Bean 注入

当若干 Bean 实例同属于一个类，且这些实例的属性值又有相同值时，可以使用抽象Bean， 以简化配置文件。

 抽象 Bean 是用于让其它 bean 继承的。这个 bean 在 Bean 类中是不能通过 getBean 方法 获取的。即设置 abstract 属性为 true 来指明该 bean 为抽象 bean， 默认值为 false。 不过，该 bean 不为抽象 bean 时，也可被继承。 只不过，在应用中，用于被继承的 bean 一般为抽象 bean。

若原始代码如下，这里已经把 school 属性改为 String 类型，这时会发现冗余代码太多，可以使用 抽象 Bean 来减少冗余。

```xml
<bean id="myStudent1" class="com.hahg.di07.Student">
		<property name="name" value="张三" />
		<property name="age" value="20" />
		<property name="school" value="清华大学" />
		<property name="department" value="计算机系" />
	</bean>
	<bean id="myStudent2" class="com.hahg.di07.Student">
		<property name="name" value="李四" />
		<property name="age" value="25" />
		<property name="school" value="清华大学" />
		<property name="department" value="计算机系" />
	</bean>
```

使用同类抽象 Bean 首先创建一个基础 Bean 指定类型，并把部分冗余的属性放入其标签里，注意需要设置 abstract 属性为 true，防止被获取到。

其次，再将使用到抽象 Bean 属性的 Bean 对象设置 parent，来继承其属性。

```xml
<bean id="beanBase" class="com.hahg.di07.Student" abstract="true">
		<property name="school" value="清华大学" />
		<property name="department" value="计算机系" />
	</bean>
	<bean id="myStudent1" parent="beanBase">
		<property name="name" value="张三" />
		<property name="age" value="20" />
	</bean>
	<bean id="myStudent2" parent="beanBase">
		<property name="name" value="李四" />
		<property name="age" value="25" />
	</bean>
```

### 2.3.8 使用异类抽象 Bean 注入 

当若干不同的类对象具有相同的属性，且其值也相同时，可使用异类抽象 Bean。

##### A、修改Bean类

**Student.java：**

```java
public class Student {
	private String name;
	private int age;
	private String school;
	private String department;
	// setter
	// toString
}
```

**Teacher.java：**这里将学生的 age 年龄改为 workAge 工龄

```java
public class Teacher {
	private String name;
	private int workAge;
	private String school;
	private String department;
    // setter
	// toString
}
```

##### B、修改Xml文件

因为是异类抽象 Bean，所以其不需要指定 id ，而其他的使用其异类抽象 Bean 的 Bean 则需要指定 class 属性。

```xml
<bean id="beanBase" abstract="true">
		<property name="school" value="清华大学" />
		<property name="department" value="计算机系" />
	</bean>
	 <bean id="myTeacher" class="com.hahg.di08.Teacher" parent="beanBase">
		<property name="name" value="张三" />
		<property name="workAge" value="20" />
	</bean> 
	<bean id="myStudent" class="com.hahg.di08.Student" parent="beanBase">
		<property name="name" value="李四" />
		<property name="age" value="25" />
	</bean>
```

### 2.3.9 为应用指定多个 Spring 配置文件 

在实际应用里，随着应用规模的增加，系统中 Bean 数量也大量增加，导致配置文件变 得非常庞大、臃肿。为了避免这种情况的产生，提高配置文件的可读性与可维护性，可以将 Spring 配置文件分解成多个配置文件。 

#### （1）平等关系的配置文件 

将配置文件分解为地位平等的多个配置文件，并将所有配置文件的路径定义为一个 String 数组，将其作为容器初始化参数出现。其将与可变参的容器构造器匹配。

##### A、修改Xml文件

将 Xml 文件拆分成两个文件，分别命名为 “ spring-beans ” 和 “ spring-base ”。
注意这里命名规范为 “ spring-功能模块名 ”。

MyTest.java：这里定义了两个 xmlPath 的对象，分别放入 ClassPathXmlApplicationContext 的形参里，其形参也可以传入一个数组。

```java
public class MyTest {

	@Test
	public void test01() {
		String xmlPath = "com/hahg/di09/spring-base.xml";
		String xmlPath1 = "com/hahg/di09/spring-beans.xml";
		ApplicationContext ac = new ClassPathXmlApplicationContext(xmlPath,xmlPath1);

		Student student = (Student) ac.getBean("myStudent");
		System.out.println(student);

		Teacher teacher = (Teacher) ac.getBean("myTeacher");
		System.out.println(teacher);
	}
}
```

也可使用通配符 “ * ” 来表示 Xml 的位置，表示的意思是以 “ spring- ” 为文件名开头的所有文件。

```java
String xmlPath = "com/hahg/di09/spring-*.xml";
ApplicationContext ac = new ClassPathXmlApplicationContext(xmlPath);
```

#### （2）包含关系的配置文件

各配置文件中有一个总文件，总配置文件将各其它子文件通过 &lt;import/> 引入。在 Java 代码中只需要使用总配置文件对容器进行初始化即可。

创建一个新的 Xml 文件，命名为 “ springTotal ”，如果使用 “ spring-total ” 命名的话，就不可使用通配符来指定包含文件，因为父配置文件名也满足 * 所能匹配的格式时，就会出现
循环递归包含，从而出错。

使用 &lt;import/> 标签里的 resource 属性来指定导入的路径。
+ resource 属性取得是当前 Xml 文件即 SpringTotal.xml 的相对路径
+ 如果 springTotal.xml 与其他引入的 Xml 文件在同一级目录下，可以直接写引入文件的 Xml 文件名。
+ 如果会更改 springTotal.xml 文件的位置，建议使用 classpath 来指定引入文件位置。


```xml
	<!--
		在同一级目录下
 	<import resource="spring-beans.xml"/>
	<import resource="spring-base.xml"/> 	
	-->
	
	<!-- 推荐使用 -->
	<import resource="classpath:com/hahg/di09/spring-beans.xml"/>
	<import resource="classpath:com/hahg/di09/spring-base.xml"/>
```

## 2.4 基于注解的 DI

举例：di-annotation 项目
对于 DI 使用注解，将不再需要在 Spring 配置文件中声明 Bean 实例。即在 Spring 中使用注解，
需要在原有 Spring 运行环境基础上再做一些改变，完成以下三个步骤。
1. 导入 AOP 的 Jar 包。因为注解的后台实现用到了 AOP 编程
2. 需要更换配置文件头，即添加相应的约束。约束在 【%SPRING_HOME%\docs\spring-framework-reference\html\xsd-configuration.html】
文件中。
3. 需要在 Spring 配置文件中配置组件扫描器，用于在指定的基本包中扫描注解。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="
        http://www.springframework.org/schema/beans 
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context 
        http://www.springframework.org/schema/context/spring-context.xsd">

	<context:component-scan
		base-package="com.hahg.di01" />
</beans>
```

#### 2.4.1 定义 Bean @Component

需要在类上使用注解 @Component，该注解的 value 属性用于指定该 bean 的 id 值。

另外，Spring 还提供了 3 个功能基本和 @Component 等效的注解：
+ @Repository 用于对 DAO 实现类进行注解
+ @Service 用于对 Service 实现类进行注解
+ @Controller 用于对 Controller 实现类进行注解


之所以创建这三个功能与 @Component 等效的注解，是为了以后对其进行功能上的扩展，使它们不再等效。

### 2.4.2 Bean 的作用域 @Scope

需要在类上使用注解 @Scope，其 value 属性用于指定作用域。默认为 singleton。

### 2.4.3 基本类型属性注入 @Value

需要在属性上使用注解 @Value，该注解的 value 属性用于指定要注入的值。
使用该注解完成属性注入时，类中无需 setter。当然，若属性有 setter，则也可将其加到 setter 上。

```java
public class Student {
	@Value("张三")
	private String name;
	@Value("19")
	private int age;

	private School school;
}
```

### 2.4.4 按类型注入域属性@Autowired

需要在 **域属性** 上使用注解 @Autowired，该注解默认使用按 **类型** 自动装配 Bean 的方式。
使用该注解完成属性注入时，类中无需 setter。当然，若属性有 setter，则也可将其加到 setter 上。
举例：di02

```java
public class Student {
	@Value("张三")
	private String name;
	@Value("19")
	private int age;
	@Autowired
	private School school;
	}
```

### 2.4.5 按名称注入域属性 @Autowired 与 @Qualifier

需要在域属性上联合使用注解 @Autowired 与@Qualifier。@Qualifier 的 value 属性用于指定要匹配的 Bean 的 id 值。同样类中无需 setter，也可加到 setter 上。

```java
public class Student {
	@Value("张三")
	private String name;
	@Value("19")
	private int age;
	
	@Autowired
	@Qualifier("mySchool")
	private School school;
}
```

@Autowired 还有一个属性 required，默认值为 true，表示当匹配失败后，会终止程序运
行。若将其值设置为 false，则匹配失败，将被忽略，未匹配的属性值为 null。

`@Autowired(required = false)`

### 2.4.6 域属性注解@Resource

Spring 提供了对 JSR-250 规范中定义 @Resource 标准注解的支持。@Resource 注解既可以按名称匹配 Bean，也可以按类型匹配 Bean。使用该注解，要求 JDK 必须是 6 及以上版本吗，但 JDK 11 把服务器相关的内容删除掉了，@Resource 也是其中之一。

#### （1）按类型注入域属性

@Resource 注解若不带任何参数，则会按照类型进行 Bean 的匹配注入。

#### （2）按名称注入域属性

@Resource 注解指定其 name 属性，则 name 的值即为按照名称进行匹配的 Bean 的 id。

### 2.4.7 Bean 的生命始末 @PostConstruct 与 @PreDestroy
在方法上使用 @PostConstruct，与原来的 init-method 等效。在方法上使用 @PreDestroy，与 destroy-method 等效。注意：这个也是服务器相关内容。

```java
@PostConstruct
	public void initAfter() {
		System.out.println("当前Bean初始化刚完毕");
	}
	
	@PreDestroy
	public void preDestroy() {
		System.out.println("当前Bean即将被销毁");
	}
```

### 2.4.8 使用 JavaConfig 进行配置（了解）

JavaConfig，是在 Spring 3.0 开始从一个独立的项目并入到 Spring 中的。JavaConfig 可以看成一个用于完成 Bean 装配的 Spring 配置文件，即 Spring 容器，只不过该容器不是 XML
文件，而是由程序员使用 Java 自己编写的 Java 类。

#### （1）实体类

实体类为之前 di01 的实体类，Student 类里有 School 类的属性。

#### （2）定义 JavaConfig 类

对于一个 POJO 类，在类上使用 @Configuration 注解，将会使当前类作为一个 Spring 的容器来使用，用于完成 Bean 的创建。
在该 JavaConfig 的方法上使用 @Bean，将会使一个普通方法所返回的结果变为指定名称的 Bean 实例。
当然，在 JavaConfig 中，也可以完成域属性的自动注入。

**MyJavaConfig.java：**
+ 在类上面加上 @Configuration 注解表示其充当Spring容器
+ 在方法上注解的 name 属性代表 Bean 的名字
+ autowire 属性表示在本类这个容器里用哪种方式来装配域属性。


```java
//表示当前类充当Spring容器，即所有的Bean将由这个类来创建
@Configuration
public class MyJavaConfig {

	@Bean(name = "school")
	public School mySchoolCreator() {
		return new School("北京大学");
	}
	
	/*
	autowire=Autowire.BY_TYPE 指从当前类这个容器中查找与域属性的类型具有is-a关系的Bean
	@Bean(name = "myStudent", autowire = Autowire.BY_TYPE)
	public Student myStudentCreator() {
		return new Student("张三", 23);
	}
	*/
	
	// autowire=Autowire.BY_NAME 指从当前类这个容器中查找与域属性同名的Bean
	@Bean(name = "myStudent", autowire = Autowire.BY_NAME) 
	public Student myStudentCreator() { 
		return new Student("张三", 23); 
	}
}
```

### 2.4.9 使用 JUnit4 测试 Spring（了解）

使用 Spring 的 JUnit4 对 Spring 代码进行测试，将不再需要在程序的代码中直接写出创建 Spring 容器，及从 Spring 容器中通过 getBean() 获取对象了。这些工作将由 JUnit4 注解，配合着域属性的自动注入注解共同完成。

使用本功能需要导入  Spring 与 JUnit4 的整合 Jar包：spring-test.RELEASE.jar 

在测试类类头添加的两个注解：
+ @RunWith(SpringJUnit4ClassRunner.class)：用于指定运行环境
+ @ContextConfiguration(locations=“ ”)：用于指定配置文件位置


而对于需要从容器中获取的 Bean 对象，使用 byType 或 byName 方式，将其自动注入。然后就可以直接测试对象了。

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:com/hahg/di03/bean.xml")
public class MyTest {

	@Autowired
	@Qualifier("myStudent")
	private Student student;

	@Autowired
	private School school;

	@Test
	public void test01() {
		System.out.println(student);
		System.out.println(school);
	}
}
```

### 2.4.10 注解与 XML 共同使用 

注解的好处是，**配置方便，直观**。但其弊端也显而易见：以硬编码的方式写入到了 Java 代码中，其**修改是需要重新编译代码的**。 

XML 配置方式的最大好处是，对其所做修改，无需编译代码，只需重启服务器即可将新 的配置加载。

 若注解与 XML 同用，XML 的优先级要高于注解。这样做的好处是，<u>需要对某个 Bean 做修改，只需修改配置文件即可</u>。当然，此时，Bean 类要有 setter 或构造器。