# 四、Spring与DAO

本章内容主要包含两部分：

1. Spring 所使用的 **操作数据库** 的技术之一，**JDBC 模板的使用**； 
2. 另一部分则为 Spring 对于**事务的管理**。 

Spring 与 Dao 部分，是 Spring 的两大核心技术 IoC 与 AOP 的典型应用体现： 

+ 对于 JDBC 模板的使用，是 **IoC 的应用**，是将 JDBC 模板对象注入给了 Dao 层的实现类。
+ 对于 Spring 的事务管理，是 **AOP 的应用**，将事务作为切面织入到了 Service 层的业务方 法中。

## 4.1 Spring 与 JDBC 模板 

为了避免直接使用 JDBC 而带来的复杂且冗长的代码，Spring 提供了一个强有力的模板类—— JdbcTemplate 来简化 JDBC 操作。

并且，数据源 DataSource 对象与模板 JdbcTemplate 对象均 <u>可通过 Bean 的形式定义在配置文件</u> 中，充分发挥了依赖注入的威力。 

举例： 项目 dao_jdbcTemplate

### 4.1.1 导入 Jar 包 

除了 Spring 的基本 Jar 包，数据库驱动 Jar 外，还需要导入两个 Jar 包——事务包【spring-tx-4.3.6.RELEASE.jar】和 JDBC 包【spring-jdbc-4.3.6.RELEASE.jar】

### 4.1.2 定义实体类和表

**Student.java：** 这次依旧选择定义学生实体类，类里的属性包括学号 id，姓名 name，年龄 age。数据库的表和实体类一致。

```java
public class Student {
	private Integer id;
	private String name;
	private int age;
    // setter and getter
    // toString
}
```

### 4.1.3 定义 Service

这里的 Service 没有什么需求，直接调用 Dao 层的相对应的方法即可，所以 Service 里的方法名和 Dao 里的差不多。

**IStudentService.java：** 定义接口

```java
public interface IStudentService {
	// 增删改
	void addStudent(Student student);
	void removeById(int id);
	void modifyStudent(Student student);
	
	// 较复杂的查询
	List<String> findAllStudentsNames();
	String findStudentNameById(int id);
	
	// 基础的查询
	List<Student> findAllStudents();
	Student findStudentById(int id);
}
```

**StudentServiceImpl.java：** Service 类里有 Dao 的 对象，设置 setter 方法用于给 Spring 容器依赖注入。然后全部方法都可以直接调用 Dao 层方法实现。

```java
public class StudentServiceImpl implements IStudentService {

	private IStudentDao dao;
	
	// dao的setter方法用于依赖注入
	public void setDao(IStudentDao dao) {
		this.dao = dao;
	}

	@Override
	public void addStudent(Student student) {
		dao.insertStudent(student);
	}

	@Override
	public void removeById(int id) {
		dao.deleteById(id);

	}

	@Override
	public void modifyStudent(Student student) {
		dao.updateStudent(student);

	}

	@Override
	public List<String> findAllStudentsNames() {
		List<String> studentsNames = dao.selectAllStudentsNames();
		return studentsNames;
	}

	
	@Override
	public String findStudentNameById(int id) {
		String studentName = dao.selectStudentNameById(id);
		return studentName;
	}

	@Override
	public List<Student> findAllStudents() {
		return dao.selectAllStudents();
	}

	@Override
	public Student findStudentById(int id) {
		return dao.selectStudentById(id);
	}
}
```

### 4.1.4 定义 Dao——增删改的完成

**IStudentDao.java：**定义接口，方法名与 Service 里的一致。

```java
public interface IStudentDao {

	void insertStudent(Student student);
	void deleteById(int id);
	void updateStudent(Student student);
	
	List<String> selectAllStudentsNames();
	String selectStudentNameById(int id);
	
	List<Student> selectAllStudents();
	Student selectStudentById(int id);
}
```

StudentDaoImpl.java：这里先实现增删改操作。Dao 的实现类需要操作数据库，所以需要 **使用 JDBC 模板** 来代替我们来操作。

使用方法：

1. 让实现类继承 JdbcDaoSupport 类
2. 使用 this.getJdbcTemplate() 来获取 jdbc 模板对象
3. jdbc 模板对象对于数据库增删改都是使用 update 方法来实现的
4. 我们使用的 update 方法是两个参数的，第一参数为 sql 语句；第二个参数为可变长度参数，可以放多个参数以逗号隔开，或者传进一个参数数组。
5. 这里的 jdbc 模板是多例的。

::: warning

JdbcTemplate 对象是多例的，即系统会为每一个使用模板对象的线程（方法）创建一个 JdbcTemplate 实例，并且在该线程（方法）结束时，**自动释放 JdbcTemplate 实例**。所以在 <u>每次使用 JdbcTemplate 对象时，都需要通过 getJdbcTemplate()方法获取</u>。

:::

**StudentDaoImpl.java**：

```java
public class StudentDaoImpl extends JdbcDaoSupport implements IStudentDao {

	@Override
	public void insertStudent(Student student) {
		String sql = "insert into student(name,age) values (?,?)";
		this.getJdbcTemplate().update(sql, student.getName(), student.getAge());
	}

	@Override
	public void deleteById(int id) {
		String sql = "delete from student where id=?";
		this.getJdbcTemplate().update(sql, id);
	}

	@Override
	public void updateStudent(Student student) {
		String sql = "update student set name=?, age=? where id=?";
		this.getJdbcTemplate().update(sql, student.getName(), student.getAge(), student.getId());
	}
	
```

### 4.1.5 定义测试类

**MyTest.java：** 在测试类中，将提取 ApplicationContext 对象和 IStudentService 对象。

快捷键：对着需要提取的变量按下 Ctrl + 1，然后选中 “ Convert local variable to fileld ”。

```java
public class MyTest {

	private ApplicationContext applicationContext;
	private IStudentService service;
	
	@Before
	public void myBefore() {
		applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
		service = (IStudentService) applicationContext.getBean("studentService");
	}

	@Test
	public void test01() {
		 Student student = new Student("张三", 18);
		 service.addStudent(student);
	}
	
	@Test
	public void test02() {
		service.removeById(1);
	}
	
	@Test
	public void test03() {
		Student student = new Student("李四", 18);
		student.setId(2);
		service.modifyStudent(student);
	}

}
```

### 4.1.6 定义 Xml 文件

#### （1）添加约束头

约束头需要记不清楚的话，直接使用最全约束即可。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:aop="http://www.springframework.org/schema/aop" 
	xmlns:tx="http://www.springframework.org/schema/tx"
	xsi:schemaLocation="
        http://www.springframework.org/schema/beans 
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context 
        http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/tx 
        http://www.springframework.org/schema/tx/spring-tx.xsd
        http://www.springframework.org/schema/aop 
        http://www.springframework.org/schema/aop/spring-aop.xsd">
```

#### （2）添加普通Bean

首先添加 Service 类：Service 类中的属性 Dao 类需要注入。

```xml
<bean id="studentService"
		class="com.hahg.service.StudentServiceImpl">
	<property name="dao" ref="studentDao"></property>
</bean>
```

然后添加 Dao 类：在 Dao 的实现类没有明显地表示 jdbc 模板是该类的属性，这时可以查看其父类 JdbcDaoSupport 的属性

```xml
<bean id="studentDao" class="com.hahg.dao.StudentDaoImpl">
	<property name="jdbcTemplate" ref="myJdbcTemplate"/>
</bean>
```

下面是 JdbcDaoSupport 的源代码，可以看见其拥有 JdbcTemplate 对象和其 setter 方法，所以可以对其进行设值注入。

**JdbcDaoSupport.class：**

```java
public abstract class JdbcDaoSupport extends DaoSupport {

	private JdbcTemplate jdbcTemplate;
	
	public final void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
		initTemplateConfig();
	}
```

又有个问题，那么如何使用数据源来创建 JdbcTemplate 模板呢？这时查看 JdbcTemplate 的源码。

```java
// JdbcTemplate.class
// 发现里面没有 DataSource 对象，所以继续查看其父类的源代码
public class JdbcTemplate extends JdbcAccessor implements JdbcOperations {
    
}
    
// JdbcAccessor.class
// 发现里面有 DataSource 对象，以及其 setter 和 getter 方法
public abstract class JdbcAccessor implements InitializingBean {
    private DataSource dataSource;
    
    /**
	 * Set the JDBC DataSource to obtain connections from.
	 */
	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
	}

	/**
	 * Return the DataSource used by this template.
	 */
	public DataSource getDataSource() {
		return this.dataSource;
	}
```

所以直接使用 &lt;property/> 标签设置 DataSource 属性即可。

```xml
<bean id="myJdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
	<property name="dataSource" ref="myDataSource"/>
</bean>
```

### 4.1.7 数据源的配置

使用 JDBC 模板，首先需要配置好数据源，数据源直接以 Bean 的形式配置在 Spring 配 置文件中。根据数据源的不同，其配置方式不同。下面主要讲解三种常用数据源的配置方式： 

1. Spring 默认的数据源 
2. DBCP 数据源 
3. C3P0 数据源

#### （1）Spring 默认的数据源

Spring 默认的数据源为 DriverManagerDataSource，其需要配置四个属性。

+ driverClassName，用于接收 DB 驱动。

+ url，用于获取连接数据库的参数。
+ username，用于获取数据库的登录账号。
+ password ，用于获取数据库的登录密码。

```xml
<!-- 注册数据源：Spring内置连接池	-->
<bean id="myDataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
    <property name="driverClassName" value="${jdbc.driver}"/>
    <property name="url" value="${jdbc.url}"/>
    <property name="username" value="${jdbc.user}"/>
    <property name="password" value="${jdbc.password}"/>
</bean> 
```

#### （2）DBCP 数据源

BasicDataSource DBCP，DataBase Connection Pool，是 apache 下的项目，使用该数据源，需要导入两个 Jar 包。

+ 【com.springsource.org.apache.commons.dbcp-1.2.2.osgi.jar】
+ 【com.springsource.org.apache.commons.pool-1.5.3.jar】

DBCP 数据源为 BasicDataSource，其需要配置四个属性。属性名和上面一致。

```xml
<!-- 注册数据源：DBCP	-->
<bean id="myDataSource" class="org.apache.commons.dbcp.BasicDataSource">
    <property name="driverClassName" value="${jdbc.driver}"/>
    <property name="url" value="${jdbc.url}"/>
    <property name="username" value="${jdbc.user}"/>
    <property name="password" value="${jdbc.password}"/>
</bean>  
```

#### （3）C3P0 数据源 

 使用 C3P0 数据源，需要导入一个 Jar 包，在 Spring 依赖库的解压目录的 com.mchange.c3p0 目录。【com.springsource.com.mchange.v2.c3p0-0.9.1.2.jar】

C3P0 的数据源为 ComboPooledDataSource，其需要配置四个属性。

+ driverClass，用于接收 DB 驱动。

+ jdbcUrl，用于获取连接数据库的参数。
+ user，用于获取数据库的登录账号。
+ password，用于获取数据库的登录密码。

C3P0 数据库也可以配置其他的辅助属性，例如 <u>最大空闲时间，连接池中保留的最大连接数</u> 等。

```xml
<!-- 注册数据源：C3P0 -->
<bean id="myDataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
    <property name="driverClass" value="${jdbc.driver}"/>
    <property name="jdbcUrl" value="${jdbc.url}"/>
    <property name="user" value="${jdbc.user}"/>
    <property name="password" value="${jdbc.password}"/>
</bean>  
```

#### （4）使用属性文件配置四要素

在 Xml 文件中使用下述标签来引用属性文件。

```xml
<context:property-placeholder location="classpath:jdbc.properties"/>
```

属性文件需要注意两点：

1. 如果驱动为较高版本，则驱动的包名为【com.mysql.<span style="color:red">cj</span>.jdbc.Driver】；若为低版本，则为【com.mysql.jdbc.Driver】，少了一层 cj 包。
2. 如果数据库为较高版本，则需要加上时间戳，还可以根据需求继续加上编码格式。

```properties
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql:///spring?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC
jdbc.user=root
jdbc.password=password
```

### 4.1.8 修改模板的配置

上面为 Dao 层注册模板新注册了两个 Bean ：

+ 使用 DataSource 注册 JdbcTemplate
+ 再使用 JdbcTemplate 注册 Dao 层

再查看 JdbcDaoSupport 类的源码，发现其有个 setDataSource 的方法。

其方法需要传递 **数据源** 作为参数，在方法里判断如果 **没有创建 JdbcTemplate 对象**，就会根据数据源创建。

所以可以不需要 jdbcTemplate 这个 Bean 了，直接把 DataSource 传给 Dao 即可。

```java
public abstract class JdbcDaoSupport extends DaoSupport {

	private JdbcTemplate jdbcTemplate;	
	
    /**
	 * Set the JDBC DataSource to be used by this DAO.
	 */
	public final void setDataSource(DataSource dataSource) {
		if (this.jdbcTemplate == null || dataSource != this.jdbcTemplate.getDataSource()) {
			this.jdbcTemplate = createJdbcTemplate(dataSource);
			initTemplateConfig();
		}
	}
```

下面为修改后的文件

```xml
	<!-- 之前的配置
	<bean id="myJdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
		<property name="dataSource" ref="myDataSource"/>
	</bean>
	
	<bean id="studentDao" class="com.hahg.dao.StudentDaoImpl">
		<property name="jdbcTemplate" ref="myJdbcTemplate"/>
	</bean>
	-->
	<!-- 新的配置 -->
	<bean id="studentDao" class="com.hahg.dao.StudentDaoImpl">
		<property name="dataSource" ref="myDataSource"/>
	</bean>
```

### 4.1.9 查询姓名

接着完成 Dao 层里查询姓名功能。

#### （1）查询所有姓名

因为该方法的返回值为列表 List，所以可以使用 Jdbc 模块的 queryForList 方法。

该方法的需要两个参数，第一个参数为 Sql 语句，第二个参数为 List 里每个元素的类型。这里 name 为字符串，所以第二个参数为 String.class。

```java
	@Override
	public List<String> selectAllStudentsNames() {
		String sql = "select name from student";
		List<String> studentsNames = this.getJdbcTemplate().queryForList(sql, String.class);
		return studentsNames;
	}
```

#### （2）根据id查询姓名

因为该方法返回的是一个变量，所以可以使用 Jdbc 模块的 queryForList 方法。

前两个参数与上面一致，这里需要填写第三个参数，第三个参数为数量可变的变量，和上面 4.1.4 节增删改使用的方法一致。

```java
	@Override
	public String selectStudentNameById(int id) {
		String sql = "select name from student where id=?";
		String studentName = this.getJdbcTemplate().queryForObject(sql, String.class, id);
		return studentName;
	}
```

### 4.1.10 查询自定义类型

这里还需要实现两个方法，如下述代码所示：

```java
	List<Student> selectAllStudents();
	Student selectStudentById(int id);
```

这两个方法需要返回自定义类型 Student，但 Jdbc 模板对象会将查询结果的各个值如 id，name 等自动封装成 Student 吗？

答案是不会的，所以这里使用的方法都需要 RowMapper 对象，下面为查询所有学生信息使用的方法详情。

```java
List<Student> org.springframework.jdbc.core.JdbcTemplate.query(String sql, RowMapper<Student> rowMapper) throws DataAccessException
```

#### （1）RowMapper对象的定义

RowMappper 接口有一个满足我们需求的实现类，是 BeanPropertyRowMapper。

**BeanPropertyRowMapper.java：**这里只需要传递自定义类型的类名即可。

```java
public BeanPropertyRowMapper(Class<T> mappedClass) {
		initialize(mappedClass);
	}
```

或者我们也可以自己实现 RowMapper接口。实现该接口需要实现 mapRow 方法，该方法有两个参数，我们只需要使用到第一个参数。

+ rs：当查询出总的结果集后，框架会自动遍历这个结果集，每一次遍历的一行数据，都会被存放到这个参数中，也就是说，这里的 rs 代表的是一行数据，而不是所有查询结果。
+ 返回值为自定义对象 Student ，要对其进行映射操作。

**StudentRowMapper.java：**

```java
public class StudentRowMapper implements RowMapper<Student> {

	@Override
	public Student mapRow(ResultSet rs, int rowNum) throws SQLException {
		Student student = new Student();
		student.setId(rs.getInt("id"));
		student.setAge(rs.getInt("age"));
		student.setName(rs.getString("name"));
		return student;
	}
}
```

#### （2）参数的传递

若使用实现类 BeanPropertyRowMapper，则需要传递自定义类型的类名来初始化其对象。

```java
@Override
	public Student selectStudentById(int id) {
		RowMapper<Student> mapper = new BeanPropertyRowMapper<Student>(Student.class);
		String sql = "select id,name,age from student where id=?";
		Student student = this.getJdbcTemplate().queryForObject(sql, mapper, id);
		return student;
	}
```

若使用的是自己实现接口，则可以直接 new 出来使用。

```java
@Override
	public List<Student> selectAllStudents() {
		String sql = "select id,name,age from student";
		List<Student> students = this.getJdbcTemplate().query(sql, new StudentRowMapper());
		return students;
	}
```

## 4.2 Spring 的事务管理 

事务原本是数据库中的概念，在 Dao 层。但一般情况下，需要将事务提升到业务层， 即 Service 层。这样做是为了能够使用事务的特性来管理具体的业务。 在 Spring 中通常可以通过以下三种方式来实现对事务的管理： 

1. 使用 Spring 的事务代理工厂管理事务 

2. 使用 Spring 的事务注解管理事务 

3. 使用 AspectJ 的 AOP 配置管理事务

### 4.2.1 Spring 事务管理 API 

Spring 的事务管理，主要用到两个事务相关的接口。

####  （1）事务管理器接口 

事务管理器是 PlatformTransactionManager 接口对象。其主要用于 <u>完成事务的提交</u>、<u>回滚</u>，及<u>获取事务的状态信息</u>。可以查看 SpringAPI 帮助文档，里面有相对应的方法，帮助文档在 Spring 框架解压目录下的 docs/javadoc-api/index.html 里。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E4%BA%8B%E5%8A%A1%E7%AE%A1%E7%90%86%E5%99%A8API.png" style="zoom:80%;" />

##### A、常用的两个实现类 

PlatformTransactionManager 接口有两个常用的实现类：

+ DataSourceTransactionManager：使用 JDBC 或 iBatis 进行持久化数据时使用。
+ HibernateTransactionManager：使用 Hibernate 进行持久化数据时使用。

#####  B、Spring 的回滚方式

Spring 事务的默认回滚方式是：发生运行时异常时回滚，发生受查异常时提交。不过， 对于受查异常，程序员也可以手工设置其回滚方式。

##### C、回顾错误与异常

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E9%94%99%E8%AF%AF%E5%92%8C%E5%BC%82%E5%B8%B8%E7%9A%84%E5%88%86%E7%B1%BB.png" style="zoom:80%;" />

1. Throwable 类是 Java 语言中所有错误或异常的超类。只有当对象是此类(或其子类之一) 的实例时，才能通过 Java 虚拟机或者 Java 的 throw 语句抛出。

2. Error 是程序在运行过程中出现的无法处理的错误，比如 OutOfMemoryError、 ThreadDeath、NoSuchMethodError 等。当这些错误发生时，程序是无法处理（捕获或抛出） 的，JVM 一般会终止线程。 

3. 程序在编译和运行时出现的另一类错误称之为异常，它是 JVM 通知程序员的一种方式。 通过这种方式，让程序员知道已经或可能出现错误，要求程序员对其进行处理。

   异常分为 **运行时异常** 与 **受查异常**。 

   运行时异常，是 RuntimeException 类或其子类 ，即 <u>只有在运行时才出现的异常</u>。

   如， NullPointerException、ArrayIndexOutOfBoundsException、IllegalArgumentException 等均属于运行时异常。这些异常由 JVM 抛出， <u>在编译时不要求必须处理（捕获或抛出）</u> 。但只要代码编写足够仔细，程序足够健壮，运行时异常是可以避免的。注意：该异常较严重。

   受查异常，也叫编译时异常，即 <u>在代码编写时要求必须捕获或抛出的异常</u> ，若不处理， 则无法通过编译。

   如 SQLException，ClassNotFoundException，IOException 等都属于受查异常。 RuntimeException 及其子类以外的异常，均属于受查异常。

   当然，用户自定义的 Exception 的子类，即 <u>用户自定义的异常也属受查异常</u>。程序员在定义异常时，只要未明确声明定义的 为 RuntimeException 的子类，那么定义的就是受查异常。

#### （2）事务定义接口 

事务定义接口 TransactionDefinition 中定义了事务描述相关的三类常量：事务隔离级别、 事务传播行为、事务默认超时时限，及对它们的操作。

##### A、事务隔离级别

参考网站：[mysql事务中的隔离级别（博客园）](https://www.cnblogs.com/zhangchaocoming/p/12309555.html)

事务隔离级别是事务与事务之间的距离程度。

事务隔离级别有有四种：

+ 未提交读（Read uncommitted）
+ 已提交读（Read commited）
+ 可重复读（Repeatable read）
+ 可串行化（Serializable）

| 隔离程度 | 脏读                                    | 不可重复读                              | 幻读                                    |
| -------- | --------------------------------------- | --------------------------------------- | --------------------------------------- |
| 未提交读 | <span style="color:#FF7F50">可能</span> | <span style="color:#FF7F50">可能</span> | <span style="color:#FF7F50">可能</span> |
| 已提交读 | <span style="color:green">不可能</span> | <span style="color:#FF7F50">可能</span> | <span style="color:#FF7F50">可能</span> |
| 可重复读 | <span style="color:green">不可能</span> | <span style="color:green">不可能</span> | <span style="color:#FF7F50">可能</span> |
| 可串行化 | <span style="color:green">不可能</span> | <span style="color:green">不可能</span> | <span style="color:green">不可能</span> |

---

假设一个表的数据如下图：

![](https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E8%84%8F%E8%AF%BB%E5%8E%9F%E8%A1%A8.png)

那什么是脏读、不可重复读和幻读呢？

+ 脏读：当一个事务读取到另一个事务修改但未提交的数据时，就可能发生脏读。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E8%84%8F%E8%AF%BB%E7%A4%BA%E4%BE%8B.png" style="zoom:80%;" />

+ 不可重复读：当执行 Select 操作时没有获得读锁或者 Select 操作执行后马上释放了读锁；而另外一个事务对数据进行了更新，导致当前事务读到了不同的结果。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E4%B8%8D%E5%8F%AF%E9%87%8D%E5%A4%8D%E8%AF%BB%E7%A4%BA%E4%BE%8B.png" style="zoom:80%;" />

+ 幻读：是不可重复读的一种特殊场景。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E5%B9%BB%E8%AF%BB%E7%A4%BA%E4%BE%8B.png" style="zoom:70%;" />

+ 脏读和不可重复读的区别：脏读指读到了其他事务未提交的数据；不可重复读指读到了其他事务已提交的数据
+ 不可重复读与幻读的区别：它们都是读到其他事务已提交的数据，但它们的针对点不同。不可重复读是 Update，幻读是 Delete 和 Insert。

---

接下来看看这四种隔离级别

1. 未提交读：最低的隔离级别。当一个事务进行写数据时，另一个事务 <u>不允许写操作但可以进行读操作</u>。如上面脏读的示例图所示，事务 2 进行写操作时，事务 1 进行读操作，产生了脏读。所以 **未提交读可能会产生脏读**。
2. 已提交读：是上面未提交读的升级版，<u>当一个事务进行写数据时，另一个事务则禁止访问</u>，可以防止脏读。但由于依然没有加上读锁，所以不能防止不可重复读。
3.  可重复读：可以防止不可重复读。接下来会详细说明。
4. 可串行化：是高的隔离级别，它求在选定对象上的读锁和写锁 <u>保持直到事务结束后才能释放</u>，所以能防住上诉所有问题,但因为是串行化的所以效率较低。

---

上面所说的在对象上加锁，是一种悲观锁机制。

+ 悲观锁：在整个数据处理过程中，将数据处于锁定状态。其依靠数据库的锁机制实现，**以保证操作最大程度的独占性**。但 **需要消耗大量的数据库性能**。
+ 乐观锁：基于数据版本记录机制实现。通过 **为数据库增加一个版本 “ Version” 的字段**。每次读数据时，都会将其与数据一起读出。
+ MySQL、ORACLE、PostgreSQL等都是使用了以 **乐观锁** 为理论基础的MVCC（多版本并发控制）来避免不可重复读和幻读。
+ 在InnoDB（Mysql 默认数据库引擎）中 MVCC 的实现是在每行数据后添加两个额外的隐藏的值，一个是该数据在哪个版本号创建，另一个记录该行数据何时过期。
  + select 时，读取创建版本号 <= 当前事务版本号（读之前的有效数据），删除版本号为空 或者 删除版本号 >当前事务版本号（回滚操作）
  + insert 时，保存当前事务版本号为行的创建版本号
  + delete 时，保存当前事务版本号为行的删除版本号
  + update 时，插入一条新纪录，保存当前事务版本号为行创建版本号，同时保存当前事务版本号到原来删除的行

##### B、事务传播行为

所谓事务传播行为是指，处于不同事务中的方法在相互调用时，执行期间事务的维护情况。

如，A 事务中的方法 doSome() 调用 B 事务中的方法 doOther()，在调用执行期间事务的维护情况，就称为事务传播行为，换句话来说就是 A 事务的方法调用 B 事务的方法，那么事务 B 的方法要在哪个事务的管理下运行？。

事务传播行为是加在方法上的。 事务传播行为常量都是以 PROPAGATION_ 开头，形如 PROPAGATION_XXX。下面将举例七个传播行为。

1. REQUIRED：指定的方法必须在事务内执行。若当前存在事务，就加入到当前事务中； 若当前没有事务，则创建一个新事务。这种传播行为是最常见的选择，也是 Spring 默认的事务传播行为。
   以回家吃饭为例，若回家有饭吃就直接吃，没饭吃就自己做来吃，这个是最常见的一种行为。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E4%BA%8B%E5%8A%A1%E4%BC%A0%E6%92%AD%E8%A1%8C%E4%B8%BA1.png" style="zoom:70%;" />

2. SUPPORTS ：指定的方法支持当前事务，但若当前没有事务，也可以以非事务方式执行。
   你现在不是很饿，回家后若还有饭就去吃，没有饭就不吃，毕竟不是很饿。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E4%BA%8B%E5%8A%A1%E4%BC%A0%E6%92%AD%E8%A1%8C%E4%B8%BA2.png" style="zoom:70%;" />

3. MANDATORY：指定的方法必须在当前事务内执行，若当前没有事务，则直接抛出异常。
   你现在十分饿，回家后必须吃饭，若没有饭吃则直接被饿得晕倒。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E4%BA%8B%E5%8A%A1%E4%BC%A0%E6%92%AD%E8%A1%8C%E4%B8%BA3.png" style="zoom:70%;" />

4. REQUIRES_NEW：总是新建一个事务，若当前存在事务，就将当前事务挂起，直到新事务执行完毕。
   你现在很有钱，就算你回家时看到还有饭时，也要煮新鲜的来吃。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E4%BA%8B%E5%8A%A1%E4%BC%A0%E6%92%AD%E8%A1%8C%E4%B8%BA4.png" style="zoom:70%;" />

5. NOT_SUPPORTED：指定的方法不能在事务环境中执行，若当前存在事务，就将当前事务挂起。
   你现在已经饱了，若已经有饭了，则就不吃；没有饭就更好。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E4%BA%8B%E5%8A%A1%E4%BC%A0%E6%92%AD%E8%A1%8C%E4%B8%BA5.png" style="zoom:70%;" />

6. NEVER：指定的方法不能在事务环境下执行，若当前存在事务，就直接抛出异常。
   你已经很撑了，若看到家里还有饭就直接晕倒。

<img src="C:\Users\98375\AppData\Roaming\Typora\typora-user-images\image-20210417175901199.png" alt="image-20210417175901199" style="zoom:70%;" />

7. NESTED：指定的方法必须在事务内执行。若当前存在事务，则在嵌套事务内执行；若当前没有事务，则创建一个新事务。
   回家若没有饭，则自己做；若有饭，但有一道菜你很想吃，那就多做一盘菜，与旧菜一起吃完。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E4%BA%8B%E5%8A%A1%E4%BC%A0%E6%92%AD%E8%A1%8C%E4%B8%BA7.png" style="zoom:70%;" />

##### C、定义了默认事务超时时限 

常量 TIMEOUT_DEFAULT 定义了事务底层默认的超时时限，及不支持事务超时时限设置 的 none 值。 

注意，事务的超时时限起作用的条件比较多，且超时的时间计算点较复杂。所以，该值 一般就使用默认值即可。

### 4.2.2 程序举例环境搭建 

举例：购买股票—transaction_buystock 项目 

本例要实现模拟购买股票。存在两个实体：银行账户 Account 与股票账户 Stock。当要购买股票时，需要从 Account 中扣除相应金额的存款，然后在 Stock 中增加相应的股票数量。 而在这个过程中，可能会抛出一个用户自定义的异常。异常的抛出，将会使两个操作回滚。

#### （1）创建数据库表

需要操作数据库的数据，当然第一步就要设计数据库的表项。

account表：里面有三列，分别代表用户ID、用户姓名和用户财产。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E8%82%A1%E7%A5%A8%E7%A4%BA%E4%BE%8B-account%E8%A1%A8.png" style="zoom:80%;" />

stock表：里面有三列，分别代表股票ID、股票名称和拥有数量。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E8%82%A1%E7%A5%A8%E7%A4%BA%E4%BE%8B-stock%E8%A1%A8.png" style="zoom:80%;" />

#### （2）创建实体类

数据库的数据需要实体类进行包装才能成为对象，所以这一步需要创建实体类

```java
public class Account {
	private Integer aid;
	private String aname;
	private double balance;
	// setter and getter
	// toString()
}

public class Stock {
	private Integer sid;
	private String sname;
	private double count;
    // setter and getter
	// toString()
}
```

#### （3）定义 Service

这一步根据 需求来定义 Service 。

从 4.2.2 前言可知有三个需求：开用户账户、开股票账户、购买股票。

```java
public interface IBuyStockService {
	// 开用户账户
	void openAccount(String aname, double money);
    // 开股票账户
	void openStock(String sname, int amount);
	// 购买股票
	void buyStock(String aname, double money, String sname, int amount);
}
```

然后在实现类实现上述接口。

BuyStockServiceImpl.java：

+ Service 层需要调用 Dao 层的方法，所以定义 Dao 对象和它们的 setter 方法。
+ 两个开户操作直接调用 Dao 层的 **插入数据** 的方法。
+ 在购买方法里，定义了一个 isBuy 的变量，这里没有实际用途，只是满足需求表示而已。
+ 在购买方法里，购买股票的操作需要调用两个 **更新数据** 的方法。

```java
public class BuyStockServiceImpl implements IBuyStockService {

	private IAccountDao accountDao;
	private IStockDao stockDao;
	
	public void setAccountDao(IAccountDao accountDao) {
		this.accountDao = accountDao;
	}

	public void setStockDao(IStockDao stockDao) {
		this.stockDao = stockDao;
	}

	@Override
	public void openAccount(String aname, double money) {
		accountDao.insertAccount(aname, money);
	}

	@Override
	public void openStock(String sname, int amount) {
		stockDao.insertStock(sname, amount);
	}

	@Override
	public void buyStock(String aname, double money, String sname, int amount) throws BuyStockException{
		boolean isBuy = true;
		accountDao.updateAccount(aname, money, isBuy);
		stockDao.updateStock(sname, amount, isBuy);
	}

}
```

#### （4）定义 Dao 

这步根据上面的要求将实现两个插入操作和两个更新操作。

下面为 StockDao 的接口和实现类。

更新操作的方法：如果是买的话，股票数量则增加；否则减少。

```java
public interface IStockDao {

	void insertStock(String sname, int amount);

	void updateStock(String sname, int amount, boolean isBuy);

}

public class StockDaoImpl extends JdbcDaoSupport implements IStockDao{

	@Override
	public void insertStock(String sname, int amount) {
		String sql = "insert into stock(sname,amount) values (?,?)";
		this.getJdbcTemplate().update(sql, sname, amount);
	}

	@Override
	public void updateStock(String sname, int amount, boolean isBuy) {
		String sql = "update stock set amount=amount-? where sname=?";
		if(isBuy) {
			sql = "update stock set amount=amount+? where sname=?";
		}
		this.getJdbcTemplate().update(sql, amount, sname);
	}
}
```

下面为 AccountDao 的接口和实现类。

更新操作的方法：如果是买的话，用户财产则减少；否则增加。

```java
public interface IAccountDao {

	void insertAccount(String aname, double money);

	void updateAccount(String aname, double money, boolean isBuy);
}

public class AccountDaoImpl extends JdbcDaoSupport implements IAccountDao {

	@Override
	public void insertAccount(String aname, double money) {
		String sql = "insert into account(aname,balance) values (?,?)";
		this.getJdbcTemplate().update(sql, aname, money);
	}

	@Override
	public void updateAccount(String aname, double money, boolean isBuy) {
		String sql = "update account set balance=balance+? where aname=?";
		if(isBuy) {
			sql = "update account set balance=balance-? where aname=?";
		}
		this.getJdbcTemplate().update(sql, money, aname);
	}
}
```

#### （5）定义测试类

这步定义测试类，测试类依旧如之前一样：

+ 获取 Spring 容器，再根据容器获取 Service 对象。
+ 使用 Service  对象调用相对应的方法
  + 这里先调用两个开户方法；
  + 再调用购买股票方法。

```java
public class MyTest {

	private ApplicationContext applicationContext;
	private IBuyStockService stockService;

	@Before
	public void myBefore() {
		applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");	
		 stockService = (IBuyStockService) applicationContext.getBean("stockService");
	}

	@Test
	public void test01() {
		stockService.openAccount("张三", 100000);
		stockService.openStock("腾讯公司", 0);
	}

	@Test
	public void test02() {	
		stockService.buyStock("张三", 2000, "腾讯公司", 5);
	}
```

#### （6）定义Xml文件

这步将完成 Xml 文件的配置。

先完成 IOC 的配置，先创建数据源，再使用数据源创建 Dao 层的 Bean，最后根据 Dao 层的 Bean 创建 Service 层的 Bean。

```xml
<!-- ==============================IOC================================= -->
	<context:property-placeholder
		location="classpath:jdbc.properties" />

	<bean id="myDataSource"
		class="org.springframework.jdbc.datasource.DriverManagerDataSource">
		<property name="driverClassName" value="${jdbc.driver}" />
		<property name="url" value="${jdbc.url}" />
		<property name="username" value="${jdbc.user}" />
		<property name="password" value="${jdbc.password}" />
	</bean>

	<bean id="accountDao" class="com.hahg.dao.AccountDaoImpl">
		<property name="dataSource" ref="myDataSource" />
	</bean>
	<bean id="stockDao" class="com.hahg.dao.StockDaoImpl">
		<property name="dataSource" ref="myDataSource" />
	</bean>

	<bean id="stockService"
		class="com.hahg.service.BuyStockServiceImpl">
		<property name="accountDao" ref="accountDao" />
		<property name="stockDao" ref="stockDao" />
	</bean>
```

#### （7）定义异常类

这一步将定义购买股票异常类，创建自定义异常类需要继承 Exception 类。

**BuyStockException.java：** 在类里创建一个无参构造方法和一个一参数构造方法。

```java
public class BuyStockException extends Exception {

	public BuyStockException() {
		super();
		// TODO Auto-generated constructor stub
	}

	public BuyStockException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}
}
```

#### （8）添加异常到 Service

在两条购买语句中间抛出购买股票异常，注意这里加上了永真的判断条件，因为不加上这个条件，编译不通过。

```java
public interface IBuyStockService {
	
	void openAccount(String aname, double money);
	void openStock(String sname, int amount);
	
	void buyStock(String aname, double money, String sname, int amount) throws BuyStockException;
}

@Override
public void buyStock(String aname, double money, String sname, int amount) throws BuyStockException{
		boolean isBuy = true;
		accountDao.updateAccount(aname, money, isBuy);
		if (1==1) {
			throw new BuyStockException("购买股票异常");
		}
		stockDao.updateStock(sname, amount, isBuy);
	}
```

#### （9）修改测试类

在第二个测试方法中加上 try-catch 块

```java
@Test
	public void test02() {
		try {
			stockServiceProxy.buyStock("张三", 2000, "腾讯公司", 5);
		} catch (BuyStockException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
```

### 4.2.3 使用 Spring 的事务代理工厂管理事务

在上面搭建环境完成后，运行代码会发现用户的钱会少，但已购买股票的数量却不增加。

所以有必要在 Service 层加上事务管理，来保证运行的原子性。

这小节介绍的是使用 Spring 的事务代理工厂管理事务。

该方式是需要为目标类，即 Service 的实现类创建事务代理。

事务代理使用的类是 TransactionProxyFactoryBean。该类需要初始化如下一些属性： 

1. transactionManager：事务管理器 
2. target：目标对象，即 Service 实现类对象 
3. transactionAttributes：事务属性设置 

对于 XML 配置代理方式实现事务管理时，<span style="color:red">受查异常</span> 的回滚方式，程序员可以通过以下方式进行设置：

+ 通过 “ -异常 ” 方式，可使发生指定的异常（受查异常）时事务回滚；

+ 通过“ +异常 ”方式， 可使发生指定的异常（运行异常）时事务提交。 

该方式的实现步骤为：

#### （1）导入Jar包

需要导入 Aop 联盟 Jar 包【aopalliance-1.0.jar】和 Spring 对 Aop 实现的 Jar 包 【spring-aop-4.3.6.RELEASE.jar】

#### （2）在容器中添加事务管理器

本例使用的是 JDBC 进行持久化，所以使用 DataSourceTransactionManager 作为事务管理器。

```xml
<!-- ==============================AOP================================= -->

	<!-- 注册事务管理器 -->
	<bean id="myTransactionManager"
		class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
		<property name="dataSource" ref="myDataSource" />
	</bean>
```

#### （3）在容器中添加事务代理

配置 Service 的事务代理的三个属性：

+ transactionManager：使用上面注册的事务管理器；
+ target：代理的目标类，stockService；
+ transactionAttributes：可单独指定每个方法的事务设置；这里需要指定 自定义异常 BuyStockException 进行回滚操作。

```xml
<bean id="serviceProxy"
		class="org.springframework.transaction.interceptor.TransactionProxyFactoryBean">
		<property name="transactionManager"
			ref="myTransactionManager" />
		<property name="target" ref="stockService" />
		<property name="transactionAttributes">
			<props>
				<prop key="open*">ISOLATION_DEFAULT,PROPAGATION_REQUIRED</prop>
				<prop key="find*">ISOLATION_DEFAULT,PROPAGATION_REQUIRED</prop>
				<prop key="buyStock">ISOLATION_DEFAULT,PROPAGATION_REQUIRED, -BuyStockException</prop>
			</props>
		</property>
	</bean>
```

#### （4）修改测试类

在测试类中，修改获取 Bean 的名字，需要获取代理对象。

```java
@Before
	public void myBefore() {
		applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
		stockServiceProxy = (IBuyStockService) applicationContext.getBean("serviceProxy");
	}
```

### 4.2.4 事务注解管理事务

 通过@Transactional 注解方式，也可将事务织入到相应方法中。而使用注解方式，只需 在配置文件中加入一个 tx 标签，以告诉 spring 使用注解来完成事务的织入。

该标签只需指定一个属性，事务管理器。

```xml
<!-- 开启事务注解驱动 -->
<tx:annotation-driven transaction-manager="myTransactionManager"/>
```

 @Transactional 的所有可选属性如下所示： 

+ propagation：<u>用于设置事务传播属性</u>。该属性类型为 Propagation 枚举，默认值为 Propagation.REQUIRED。
+ isolation：<u>用于设置事务的隔离级别</u>。该属性类型为 Isolation 枚举，默认值为 Isolation.DEFAULT。 
+ readOnly：<u>用于设置该方法对数据库的操作是否是只读的</u>。该属性为 boolean，默认值 为 false。
+ timeout：<u>用于设置本操作与数据库连接的超时时限</u>。单位为秒，类型为 int，默认值为 -1，即没有时限。
+ rollbackFor：<u>指定需要回滚的异常类</u>。类型为 Class[]，默认值为空数组。当然，若只有 一个异常类时，可以不使用数组。
+ rollbackForClassName：<u>指定需要回滚的异常类类名</u>。类型为 String[]，默认值为空数组。 当然，若只有一个异常类时，可以不使用数组。 
+ noRollbackFor：<u>指定不需要回滚的异常类</u>。类型为 Class[]，默认值为空数组。当然，若 只有一个异常类时，可以不使用数组。
+  noRollbackForClassName：<u>指定不需要回滚的异常类类名</u>。类型为 String[]，默认值为空 数组。当然，若只有一个异常类时，可以不使用数组。

需要注意的是，@Transactional 若用在方法上，**只能用于 public 方法上**。对于其他非 public 方法，如果加上了注解@Transactional，虽然 Spring 不会报错，但不会将指定事务织入到该方法中。因为 Spring 会忽略掉所有非 public 方法上的@Transaction 注解。 

若@Transaction 注解在类上，则表示该类上所有的方法均将在执行时织入事务。

---

下面就是为 BuyStockException 方法进行注解：

+ 使用了 propagation 来设置事务传播属性；
+ 使用了 isolation 来设置事务的隔离级别；
+ 使用了 rollbackFor 来设置需要回滚的异常类类名。

```java
// <prop key="buyStock">ISOLATION_DEFAULT,PROPAGATION_REQUIRED, -BuyStockException</prop>
	@Override
	@Transactional(propagation = Propagation.REQUIRED, isolation = Isolation.DEFAULT, rollbackFor = BuyStockException.class)
	public void buyStock(String aname, double money, String sname, int amount) throws BuyStockException{
		boolean isBuy = true;
		accountDao.updateAccount(aname, money, isBuy);
		if (1==1) {
			throw new BuyStockException("购买股票异常");
		}
		stockDao.updateStock(sname, amount, isBuy);
	}
```

### 4.2.5 使用 AspectJ 的 AOP 配置管理事务（重点） 

使用 XML 配置事务代理的方式的不足是，每个目标类都需要配置事务代理。

当目标类较多，配置文件会变得非常臃肿。 使用 XML 配置顾问方式可以自动为每个符合切入点表达式的类生成事务代理。

其用法很简单，只需将前面代码中关于事务代理的配置删除，再替换为如下内容即可。

#### （1）导入 Jar 包

在 4.2.4 的基础上继续导入 AspectJ 所使用的 Jar 包：【aspectjweaver-1.8.10.jar】以及 【spring-aspects-4.3.6.RELEASE.jar】

#### （2）注册事务管理器

与上面的一致

```xml
<!-- 注册事务管理器 -->
<bean id="myTransactionManager"
      class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="myDataSource" />
</bean>
```

#### （3）配置事务通知

这里使用到的是 tx 事务包里的事务通知。

+ 创建其需要指定其 transaction-manager 属性，属性值为第（2）点所注册的事务管理器；
+ 在 &lt;tx:attributes/> 标签里可以使用 &lt;tx:method/> 来为每一个 <span style="color:red">连接点</span> 所要应用的事务属性；
+ 在 &lt;tx:method/> 中可以使用 isolation、propagation 属性来指定隔离级别和传播行为；rollback-for 属性指定需要回滚的异常。

```xml
<tx:advice id="txAdvice" transaction-manager="myTransactionManager">
		<tx:attributes>
			<!-- 这里指定的是：为每一个连接点所要应用的事务属性 -->
			<tx:method name="open*" isolation="DEFAULT" propagation="REQUIRED"/>
			<tx:method name="buyStock" isolation="DEFAULT" propagation="REQUIRED" rollback-for="BuyStockException"/>
		</tx:attributes>
	</tx:advice>
```

#### （4）配置顾问

使用顾问为上述通知进行包装，使其可以指定 <span style="color:red">织入点</span>。这里指定的切入点为 service 包里的所有方法。

注意这里指定的是织入点，而第（3）点配置的是每一个连接点，也就是说第（3）点的配置不一定起作用，最终起作用的是这里所指定的。

```xml
<aop:config>
    <!-- 这里指定的是切入点 -->
    <aop:pointcut expression="execution(* *..service.*.*(..))" id="myPointCut"/>	
    <aop:advisor advice-ref="txAdvice" pointcut-ref="myPointCut"/>
</aop:config>
```

