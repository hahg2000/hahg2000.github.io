---
tags:
  - SSM框架
  - 学习
  - Java
readingTime: true 
autoNext: 七、日志输出
---

# 六、JUnit测试

## 6.1 下载 jar 包

​	使用 JUnit 进行测试，需要导入对于 Jar 包，。

+ JUnit 官网 [ https://junit.org/junit5/ ]

+ JUnit 下载地址 [ https://search.maven.org/search?q=g:junit%20AND%20a:junit ]
+ hamcrest 下载地址 [ http://www.java2s.com/Code/Jar/h/Downloadhamcrestcore13jar.htm ]

## 6.2 第一种使用方法

​	1. 右键 src，新建 JUnit 测试用例

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/20210209164414.png" alt="新建Junit测试用例" style="zoom:75%;" />

2.  然后勾上 setUp() 和 tearDown() 

+ setUp() ：在测试之前执行，主要用于测试前的初始化，如连接数据库。
+ tearDown() ：在测试之后执行，主要用于资源释放，如关闭数据库连接等。

3. 在 @Test 注解下可以放置需要测试的方法，可以有多个测试方法，但如果只需要测试一个方法，<span style="color:red;font-weight:bold">需要将光标放置在该方法的方法名上</span>，否则会执行所有测试方法

## 6.3 第二种使用方法

​	这种方法比上一种方法更常用，这种方法是在普通类中进行测试

1. 新建一个普通的类
2. 导入 JUnit 和 hamcrest 的 Jar 包
3. 根据需求添加注解 @Before 、@After 和 @Test
4. 点击运行

**MyTest02.java**

```java
public class MyTest02 {

	@Before
	public void Before() {
		System.out.println("Before");
	}
	
	@After
	public void After() {
		System.out.println("After");
		
	}
	
	@Test
	public void test01() {
		System.out.println("test01");
	}
}
```
