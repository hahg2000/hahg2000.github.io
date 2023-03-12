# 二、SpringMVC配置式开发

根据下面的图，我们一步一步配置所需内容。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/springmvc%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B%E5%8E%9F%E5%9B%BE.png" style="zoom:70%;" />

## 2.1 处理器映射器HandlerMapping

首先我们先配置处理器映射器 HandleMapping。

HandlerMapping 接口负责 <u>根据 request 请求</u> 找到对应的 **Handler 处理器 **及 **Interceptor 拦截器**，并将它们封装在 HandlerExecutionChain 对象中，返回给中央调度器。其常用的实现类有两种：

+ BeanNameUrlHandlerMapping
+ SimpleUrlHandlerMapping

### 2.1.1 BeanNameUrlHandlerMapping

根据【DispatcherServlet.properties】文件，可以得知我们默认的 HandlerMapping 就是  BeanNameUrlHandlerMapping。

```properties
org.springframework.web.servlet.HandlerMapping=org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping,\
	org.springframework.web.servlet.mvc.annotation.DefaultAnnotationHandlerMapping
```

---

**BeanNameUrlHandlerMapping.class：** 接下来我们去看下其源码，第 8 ~ 11 行，执行的是将多个 beanName 进行判断前缀是否存在 “ / ”，若存在则存放到 List 里。

```java {8-11}
public class BeanNameUrlHandlerMapping extends AbstractDetectingUrlHandlerMapping {

	/**
	 * Checks name and aliases of the given bean for URLs, starting with "/".
	 */
	@Override
	protected String[] determineUrlsForHandler(String beanName) {
		List<String> urls = new ArrayList<String>();
		if (beanName.startsWith("/")) {
			urls.add(beanName);
		}
		String[] aliases = getApplicationContext().getAliases(beanName);
		for (String alias : aliases) {
			if (alias.startsWith("/")) {
				urls.add(alias);
			}
		}
		return StringUtils.toStringArray(urls);
	}

}
```

### 2.1.2 SimpleUrlHandlerMapping

若使用上述类，有几个问题：

+ 处理器 Bean 的 id 为 **一个 url 请求路径**，而不是 Bean 的名称，有些奇特。
+ 处理器 Bean 的定义与请求 url 绑定在了一起。若出现多个 url 请求同一个处理器的情况，就需要在 Spring 容器中配置多个该处理器类的 &lt;bean/>。**这将导致容器会创建多个该处理器类实例**。

所以可以使用 SimpleUrlHandlerMapping 处理器映射器，不仅可以将 url 与处理器的定义分离，还可以对 url 进行统一映射管理。

+ 使用 SimpleUrlHandlerMapping 类，需要配置 mappings 属性或者 urlMap 属性。
+ 配置 mappings 属性需要使用 &lt;props/> 标签；
+ 配置 urlMap 属性需要使用 &lt;map/> 标签

```xml
<!-- 注册处理器映射器 -->
<bean class="org.springframework.web.servlet.handler.SimpleUrlHandlerMapping">
	<!-- 
	<property name="mappings">
         <props>
             <prop key="/hello.do">myController</prop>
             <prop key="/my.do">myController</prop>
        </props>
  	</property> 
	-->
		
	<property name="urlMap">
        <map>
            <entry key="/hello.do" value="myController"/>
            <entry key="/my.do" value="myController"/>
        </map>
    </property>
</bean>	

<!-- 注册处理器 -->
<bean id="myController" class="com.hahg.handlers.MyController"/>
```

但如果不是多个路径访问一个控制器 Controller ，那就没必要用这个类，直接使用默认的 BeanNameUrlHandlerMapping 即可。

### 2.1.3 执行流程

接下来，我们来看处理器映射器的相关源码，打开 DispatchServlet.class 类，寻找到 doDispatch 方法。

**第 12 行：** 调用本类即 DispatchServlet 里的 **getHandler 方法**来获取 handler，然后继续跟进 getHandler 方法的实现。

```java {12}
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
    // 。。。。。
    try {
        ModelAndView mv = null;
        Exception dispatchException = null;

        try {
            processedRequest = checkMultipart(request);
            multipartRequestParsed = (processedRequest != request);

            // Determine handler for the current request.
            mappedHandler = getHandler(processedRequest);
```

根据注释可知，其方法的作用是 <u>尝试所有的 HandlerMapping 种类来获取处理器 handler</u>，但这个并不是真正的处理器，根据 **第 13 行** 代码可知，其返回类型是 HandlerExecutionChain —— 处理器执行链。

```java {13}
/**
* Return the HandlerExecutionChain for this request.
* <p>Tries all handler mappings in order.
* @param request current HTTP request
* @return the HandlerExecutionChain, or {@code null} if no handler could be found
*/
protected HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {
    for (HandlerMapping hm : this.handlerMappings) {
        if (logger.isTraceEnabled()) {
            logger.trace(
                "Testing handler map [" + hm + "] in DispatcherServlet with name '" + getServletName() + "'");
        }
        HandlerExecutionChain handler = hm.getHandler(request);
        if (handler != null) {
            return handler;
        }
    }
    return null;
}
```

## 2.2 处理器适配器HandlerAdapter

适配器模式解决的问题是，使得原本由于接口不兼容而不能一起工作的那些类可以在一起工作。

所以处理器适配器所起的作用是，将多种处理器（实现了不同接口的处理器），通过处理器适配器的适配，使它们可以进行统一标准的工作，对请求进行统一方式的处理。

详情见 [四、SSM框架前言-适配器模式](../SSM前言/四、SSM框架前言-适配器模式)

---

继续跟进 doDispatch 方法，第 2 行代码是执行 getHandlerAdapter 方法来获取处理器适配器。

```java {2}
// Determine handler adapter for the current request.
HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());

// Process last-modified header, if supported by the handler.
// 。。。
```

继续跟进 getHandlerAdapter 方法的代码，发现其也是循环 **所有的处理器适配器** 来找我们所定义的 MyController 处理器所适合的适配器。

```java {7,11}
/**
* Return the HandlerAdapter for this handler object.
* @param handler the handler object to find an adapter for
* @throws ServletException if no HandlerAdapter can be found for the handler. This is a fatal error.
*/
protected HandlerAdapter getHandlerAdapter(Object handler) throws ServletException {
    for (HandlerAdapter ha : this.handlerAdapters) {
        if (logger.isTraceEnabled()) {
            logger.trace("Testing handler adapter [" + ha + "]");
        }
        if (ha.supports(handler)) {
            return ha;
        }
    }
    throw new ServletException("No adapter for handler [" + handler +
                               "]: The DispatcherServlet configuration needs to include a HandlerAdapter that supports this handler");
}
```

第 11 行，其遍历出来的适配器使用了 supports 这个方法，我们回顾一下适配器模式。

1. 适配器模式有一个接口，**每个适配器都会去实现这个接口**。如下图所示，实现了 supports 这个方法的有很多类。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E9%80%82%E9%85%8D%E5%99%A8support%E6%96%B9%E6%B3%95%E5%AE%9E%E7%8E%B0%E7%B1%BB.png" style="zoom:80%;" />

2. 在之前的例子里，接口有两个方法：

+ 一个是 support 方法，来 **测试这个类是否符合这个适配器**。
+ 另外一个是工作方法，就是 **执行所需操作的方法**，之前的例子里是 work 方法，在本例子是 handle 方法。

下面的代码可以对比下，发现极其相似：

+ supports 这个方法里的实现都是 **使用 instanceof 运算符**；
+ 在工作方法里，都需要 **类型强转** 后才进行操作，当然这里类型强转不会出现问题。

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

public class SimpleControllerHandlerAdapter implements HandlerAdapter {

	@Override
	public boolean supports(Object handler) {
		return (handler instanceof Controller);
	}

	@Override
	public ModelAndView handle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
	return ((Controller) handler).handleRequest(request, response);
}
```

## 2.3 处理器

处理器除了实现 Controller 接口外，还可以继承自一些其它的类来完成一些特殊的功能。

### 2.3.1 继承自 AbstractController 类

若处理器继承自 AbstractController 类，那么该控制器就具有了一些新的功能。

先看下 AbstractController 的源码：

+ 里面有 handleRequest 方法，这个方法是模板方法，其调用了 handleRequestInternal 方法。
+ 而 handleRequestInternal 方法是我们需要实现的，这个就是之前的 **模板方法设计模式**，这个方法就是 **抽象方法**，是要求子类 **必须** 实现的方法。

```java
@Override
public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response)
    throws Exception {

    if (HttpMethod.OPTIONS.matches(request.getMethod())) {
        response.setHeader("Allow", getAllowHeader());
        return null;
    }

    // Delegate to WebContentGenerator for checking and preparing.
    checkRequest(request);
    prepareResponse(response);

    // Execute handleRequestInternal in synchronized block if required.
    if (this.synchronizeOnSession) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            Object mutex = WebUtils.getSessionMutex(session);
            synchronized (mutex) {
                return handleRequestInternal(request, response);
            }
        }
    }

    return handleRequestInternal(request, response);
}

    /**
    * Template method. Subclasses must implement this.
    * The contract is the same as for {@code handleRequest}.
    * @see #handleRequest
    */
	protected abstract ModelAndView handleRequestInternal(HttpServletRequest request, HttpServletResponse response) throws Exception;
```

因为 AbstractController 类还继承自一个父类 WebContentGenerator。WebContentGenerator 类具有 supportedMethods属性，可以设置支持的 HTTP 数据提交方式。**默认支持 GET、POST**。

若处理器继承自 AbstractController 类，那么处理器就可以通过属性 supportedMethods 来限制 HTTP 请求提交方式了。例如，指定 **只支持 POST 的 HTTP 请求提交方式**。

```xml
<!-- 注册处理器 -->
<bean id="/my.do" class="com.hahg.handlers.MyController">
    <property name="supportedMethods" value="POST"/>
</bean>
```

能提交 POST 请求的只有两个种类：<span style="color:red">表单请求 和 AJAX 请求</span>

### 2.3.2 继承自 MultiActionController 类

MultiActionController 类继承自 AbstractController，所以继承自 MultiActionController 类的子类也可以设置HTTP请求提交方式。但该类的最重要的作用是 **执行一个 Controller 处理器里的不同方法**。

::: warning

该类在 Spring4 被标识为过时方法，在 Spring5 已被删除

:::

#### （1）在处理器执定义多个方法

```java
public class MyController extends MultiActionController {

	public ModelAndView doFirst(HttpServletRequest request, HttpServletResponse response) throws Exception {
		ModelAndView mv = new ModelAndView();
		mv.addObject("message1", "first");
		mv.setViewName("/WEB-INF/jsp/welcome.jsp");
		mv.setViewName("welcome");
		return mv;
	}

	public ModelAndView doSecond(HttpServletRequest request, HttpServletResponse response) throws Exception {
		ModelAndView mv = new ModelAndView();
		mv.addObject("message1", "second");
		mv.setViewName("/WEB-INF/jsp/welcome.jsp");
		mv.setViewName("welcome");
		return mv;
	}
}
```

#### （2）使用 InternalPathMethodNameResolver 方法名解析器（默认）

MultiActionController类具有一个默认的 MethodNameResolver 解析器。

该方法名解析器要求 **方法名以 URI 中资源名称的身份出现**，即方法作为一种可以被请求的资源出现。例如：/ xxx / 方法名。

这里只要访问 " / my / xxx.do " 处理器就会在代码中寻找名字为 xxx 的方法。

```xml
<!-- 注册处理器 -->
<bean
      class="org.springframework.web.servlet.handler.SimpleUrlHandlerMapping">
    <property name="mappings">
        <props>
            <prop key="/my/*.do">myController</prop>
        </props>
    </property>
</bean>
<bean id="myController" class="com.hahg.handlers.MyController" />

<!-- 配置视图解析器 -->
<bean
      class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/jsp/" />
    <property name="suffix" value=".jsp" />
</bean>
```

#### （3）PropertiesMethodNameResolver方法名解析器

该方法名解析器中主要用于将不同访问链接映射到指定的方法。

+ 第 1 ~ 9 行，注册处理器代码不需要改变；
+ 第 11 ~ 19 行，配置链接所映射的方法；
+ 第 21 ~ 23 行，注入所需要的属性。

```xml {15,16,23}
<!-- 注册处理器 -->
<bean
      class="org.springframework.web.servlet.handler.SimpleUrlHandlerMapping">
    <property name="mappings">
        <props>
            <prop key="/my/*.do">myController</prop>
        </props>
    </property>
</bean>
	
<bean id="propertiesMethodNameResolver" 
      class="org.springframework.web.servlet.mvc.multiaction.PropertiesMethodNameResolver">
    <property name="mappings">
        <props>
            <prop key="/my/doFirst.do">doSecond</prop>
            <prop key="/my/doSecond.do">doFirst</prop>
        </props>
    </property>
</bean>
	
<bean id="myController" class="com.hahg.handlers.MyController">
    <property name="methodNameResolver" ref="propertiesMethodNameResolver"/>
</bean>
```

#### （4）ParameterMethodNameResolver方法名解析器

该方法名解析器中的方法名 **作为请求参数的值** 出现。

例如请求时可以写为 /xxx?ooo=doFirst，则会访问 xxx 所映射的处理器的 doFirst() 方法。

其中 ooo 为该请求所携带的参数名，而 doFirst 则作为其参数值出现。

```xml
<bean id="parameterMethodNameResolver" 
      class="org.springframework.web.servlet.mvc.multiaction.ParameterMethodNameResolver">
    <property name="paramName" value="method"/>
</bean>


<bean id="myController" class="com.hahg.handlers.MyController">
    <property name="methodNameResolver" ref="parameterMethodNameResolver"/>
</bean>
```

若不指定

## 2.4 ModelAndView

### 2.4.1 Model

ModelAndView 即模型与视图，通过 addObject() 方法向模型中添加数据，通过 setViewName() 方法向模型添加视图名称。

看下 ModelAndView 的源码，发现其属性的确有视图 view 和 模型 model。

```java
public class ModelAndView {

	/** View instance or view name String */
	private Object view;

	/** Model Map */
	private ModelMap model;
```

再继续看 model 的类型—— ModelMap 的源码。发现其继承自 LinkedHashMap。而 LinkedHashMap 又继承自 HashMap ，所以 ModelMap 本质上就是哈希表 HashMap 。

```java
public class ModelMap extends LinkedHashMap<String, Object> {

	/**
	 * Construct a new, empty {@code ModelMap}.
	 */
	public ModelMap() {
	}
    // 。。。。
}

public class LinkedHashMap<K,V> extends HashMap<K,V> implements Map<K,V>
{
```

而我们再来看下 HashMap 的源码：里面有一个内部类，是存放哈希表每个元素的值，里面有四个属性，分别是 **哈希值**、**键**、**值**、**下一个节点的地址**。由此可知 HashMap 本质上是一个单向链表。

```java
    
public class HashMap<K,V> extends AbstractMap<K,V> implements Map<K,V>, Cloneable, Serializable {
    
    static class Node<K,V> implements Map.Entry<K,V> {
        final int hash;
        final K key;
        V value;
        Node<K,V> next;
    }
```

::: warings

在 JDK 1.8 之后 HashMap 中的数组元素和链表节点都采用 Node类 实现，之前是 Entry 类实现。

:::

我们再来看下 LinkedHashMap 的源码，发现其比 HashMap 拥有多了两个属性 before 和 after，分别指向前一个结点和下一个结点。由此可知 LinkedHashMap 本质上是一个双向链表。

```java
public class LinkedHashMap<K,V> extends HashMap<K,V> implements Map<K,V>
{
    /**
     * HashMap.Node subclass for normal LinkedHashMap entries.
     */
    static class Entry<K,V> extends HashMap.Node<K,V> {
        Entry<K,V> before, after;
        Entry(int hash, K key, V value, Node<K,V> next) {
            super(hash, key, value, next);
        }
    }
```

### 2.4.2 View

View 视图是用来设置跳转页面的，其里面的字符串会经过 **视图解析器进行解析，最终转换为相应的页面**。后续会详细讲解。

这里需要知道的是若不需要 Model 来携带数据而只使用 View 来跳转页面，则可直接使用 View 的一个构造方法即可。

```java
public class ModelAndView {
	/**
	 * Convenient constructor when there is no model data to expose.
	 * Can also be used in conjunction with {@code addObject}.
	 * @param view View object to render
	 * @see #addObject
	 */
	public ModelAndView(View view) {
		this.view = view;
	}
```

## 2.5 视图解析器ViewResolver

视图解析器 ViewResolver 接口负责将处理结果生成 View 视图。常用的实现类有四种。

### 2.5.1 InternalResourceViewResolver 视图解析器

该视图解析器用于完成对 **当前 Web 应用内部资源的封装与跳转**。

而对于拼接规则是：**前辍+ 视图名称+ 后辍**。

InternalResourceView 解析器会把处理器方法返回的模型属性都存放到对应的 request 中，然后将请求转发到目标URL。当然，若不指定前辍与后辍，直接将内部资源路径写到setViewName()中也可以。相当于前辍与后辍均为空串。

```xml
<!-- 配置视图解析器 -->
<bean
      class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/jsp/" />
    <property name="suffix" value=".jsp" />
</bean>
```

已知该视图解析器存在两个问题，使其使用很不灵活：

+ **只可以完成将内部资源封装后的跳转**。但无法转向外部资源，如外部网页。
+ 对于内部资源的定义，也**只能定义一种格式的资源** ——存放于同一目录的同一文件类型的资源文件。就如同上的代码， Controller 类的提交的视图都只会到【/WEB-INF/jsp/】文件夹下查找。

### 2.5.2 BeanNameViewResolver 视图解析器

顾名思义就是将资源封装为 " Spring 容器中的 Bean 实例 "。

ModelAndView 通过 **设置视图名称为该 Bean 的 id 属性值来完成对该资源的访问**。所以在springmvc.xml中，可以定义多个 View 视图Bean，让处理器中 ModelAndView 通过对这些 Bean 的 id 的引用来完成向View中封装资源的跳转。

需要使用到的类：

+ RedirectView：定义外部资源视图对象；
+ JstlView：定义内部资源视图对象

```xml
<!-- 注册处理器 -->
	<bean id="/my.do" class="com.hahg.handlers.MyController"/>

<!-- 注册视图解析器 -->
<bean class="org.springframework.web.servlet.view.BeanNameViewResolver"/>

<!-- 定义一个内部资源View对象 -->
<bean id="myInternalView"
      class="org.springframework.web.servlet.view.JstlView">
    <property name="url" value="/WEB-INF/jsp/welcome.jsp"></property>
</bean>

<!-- 定义两个外部资源View对象 -->
<bean id="taobao"
      class="org.springframework.web.servlet.view.RedirectView">
    <property name="url" value="https://www.taobao.com/"></property>
</bean>

<bean id="jingdong"
      class="org.springframework.web.servlet.view.RedirectView">
    <property name="url" value="https://www.jd.com/"></property>
</bean>
```

在处理器 MyController 里，将视图设置为上面代码中的 bean 的 id 值，即可访问到指定的链接。

::: warning

在 JDK 1.8 以后，JDK 不自带服务器相关的 Jar 包，所以在使用 JstlView 类来访问内部资源时，需要手动导入【jstl.jar】

下载链接：[ http://archive.apache.org/dist/jakarta/taglibs/standard/binaries/ ]

:::

```java
public class MyController implements Controller {

	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		ModelAndView mv = new ModelAndView();
		mv.addObject("message1", "first");
		mv.setViewName("myInternalView");
		return mv;
	}

}
```

### 2.5.3 XmlViewResolver 视图解析器

当需要定义的 View 视图对象很多时，就会使 springmvc.xml 文件变得很大，很臃肿，不便于管理。

所以可以将这些 View 视图对象 **专门抽取出来，单独定义为一个xml文件**。这时就需要使用 XmlViewResolver 解析器了。

先定义一个 myView.xml 文件，专门存放我们定义的 View 视图。

```xml
<!-- myView.xml -->
<!-- 定义一个内部资源View对象 -->
<bean id="myInternalView"
      class="org.springframework.web.servlet.view.JstlView">
    <property name="url" value="/WEB-INF/jsp/welcome.jsp"></property>
</bean>

<!-- 定义两个外部资源View对象 -->
<bean id="taobao"
      class="org.springframework.web.servlet.view.RedirectView">
    <property name="url" value="https://www.taobao.com/"></property>
</bean>

<bean id="jingdong"
      class="org.springframework.web.servlet.view.RedirectView">
    <property name="url" value="https://www.jd.com/"></property>
</bean>
</beans>
```

然后修改 springmvc.xml 文件，将视图解析器所用到的类修改成 **XmlViewResolver**，并 **配置 location 属性** 来指定我们自定义的 xml 的位置。

```xml
<!-- 注册处理器 -->
<bean id="/my.do" class="com.hahg.handlers.MyController"/>

<!-- 注册视图解析器 -->
<bean class="org.springframework.web.servlet.view.XmlViewResolver">
    <property name="location" value="classpath:myViews.xml"/>
</bean>
```

### 2.5.4 ResourceBundleViewResolver视图解析器

对于 View 视图对象的注册，除了使用 xml 文件外，**也可以在 properties 文件中进行注册**。

只不过，此时的视图解析器需要更换为 **ResourceBundleViewResolver 解析器**。该属性文件需要定义在类路径下，即src下。

而对于属性文件的写法，是有格式要求的：

+ 资源名称.(class)=封装资源的View全限定性类名
+ 资源名称.url=资源路径

```properties
# views.properties
myInternalView.(class)=org.springframework.web.servlet.view.JstlView
myInternalView.url=/WEB-INF/jsp/welcome.jsp

taobao.(class)=org.springframework.web.servlet.view.RedirectView
taobao.url=https://www.taobao.com/
```

然后需要在容器里进行配置 basename 属性，其值为 properties 文件名。

```xml
<!-- 注册视图解析器 -->
<bean class="org.springframework.web.servlet.view.ResourceBundleViewResolver">
	<property name="basename" value="views"/>
</bean>
```

### 2.5.5 视图解析器的优先级

有时经常需要应用一些视图解析器策略来解析视图名称，即当同时存在多个视图解析器均可解析 ModelAndView 中的同一视图名称时，哪个视图解析器会起作用呢？

视图解析器有一个 **order 属性**，专门用于设置多个视图解析器的优先级。

**数字越小，优先级越高**。**数字相同，先注册的优先级高**。

一般不为 InternalResourceViewResolver 解析器指定优先级，即让其优先级是最低的。

```xml
<!-- 注册视图解析器 -->
<bean class="org.springframework.web.servlet.view.ResourceBundleViewResolver">
    <property name="basename" value="views"/>
    <property name="order" value="5"></property>
</bean>
```

