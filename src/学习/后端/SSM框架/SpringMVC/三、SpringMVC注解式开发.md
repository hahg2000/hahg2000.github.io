# 三、SpringMVC注解式开发

所谓SpringMVC的注解式开发是指，处理器是基于注解的类的开发。

对于每一个定义的处理器，无需在配置文件中逐个注册，只需在代码中通过对类与方法的注解，便可完成注册。即注解替换的是配置文件中对于处理器的注册部分。

## 3.1 第一个注解式开发程序

### 3.1.1 注册组件扫描器

这里的组件即处理器，需要指定处理器所在基本包。

```xml
<context:component-scan base-package="com.hahg.handlers"/>
```

3.1.2定义处理器

此时的处理器类无需继承任何父类或者实现任何接口。只需在类上与方法上添加相应注解即可。

+ @Controller：表示当前类为处理器
+ @RequestMapping：表示当前方法为处理器方法。该方法要对 value 属性所指定的URL进行处理与响应。**被注解的方法的方法名可以随意**。

```java
@Controller 
public class MyController{
	//<bean id="/my.do" class="com.hahg.handlers.MyController"/>
	@RequestMapping("/my.do")
	public ModelAndView doSome(HttpServletRequest request, HttpServletResponse response) throws Exception {
		ModelAndView mv = new ModelAndView();
		mv.addObject("message1","hello").addObject("message2", "world");
		mv.setViewName("welcome"); 
		return mv;
	}
}
```

当然，若有多个请求路径均可匹配该处理器方法的执行，则@RequestMapping的value属性中可以写上一个数组。

```java
/* 注册处理器映射器 
<bean class="org.springframework.web.servlet.handler.SimpleUrlHandlerMapping">
	<property name="mappings">
         <props>
             <prop key="/hello.do">myController</prop>
             <prop key="/my.do">myController</prop>
        </props>
  	</property> 
</bean>
*/
@Controller
public class MyController{

	@RequestMapping({"/my.do","doSome.do"})
	public ModelAndView doSome(HttpServletRequest request, HttpServletResponse response) throws Exception {
         ModelAndView mv = new ModelAndView();
		mv.addObject("message1","hello").addObject("message2", "world");
		mv.setViewName("welcome"); 
		return mv;
	}
}
	
```

3.2处理器的请求映射规则的定义

通过@RequestMapping注解可以定义处理器对于请求的映射规则。该注解可以注解在方法上，也可以注解在类上，但意义是不同的。3.2.1对请求URI的命名空间的定义@RequestMapping的value属性用于定义所匹配请求的URI。但对于注解在方法上与类