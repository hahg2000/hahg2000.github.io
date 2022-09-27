# 五、Spring与MyBatis

## 5.1 总体任务分析

Spring 与 MyBatis 两个框架相结合首先先分析两个框架的任务：

+ Spring 主要是让容器代替你去创建 Bean 类从而减少耦合，主要文件为 applicationContext.xml；
+ MyBatis 是让用户使用 SQl 语句来操作数据库，主要文件为 mapper.xml 和 config.xml。

## 5.2  运行环境的搭建

复制 06-jdbcTemplate 的项目，并替换其中的 Jar 包。

Jar 包中需要下图所示

![](https://raw.githubusercontent.com/hahg2000/SSMPic/main/mybatis-spring.png)

## 5.3 创建映射文件

首先实现 Dao 层的功能，就是将接口的方法和 Mapper 的 SQL 语句对应。

**IStudentDao.java：** 

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

这里 mapper 文件需要注意两点：

+ 一是指定 &lt;mapper/> 标签的 namespace 属性，为 Dao 接口的全限定性类名；
+ 二是增删改查的标签的 id 属性需要与接口的方法名一致。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" 
     "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.hahg.dao.IStudentDao">
	<insert id="insertStudent">
		insert into student(name,age) values(#{name}, #{age})
	</insert>

	<delete id="deleteById">
		delete from student where id=#{id}
	</delete>

	<update id="updateStudent">
		update student set name=#{name}, age=#{age} where id=#{id}
	</update>

	<select id="selectAllStudents" resultType="Student">
		select id,name,age from student
	</select>
	
	<select id="selectStudentById" resultType="Student">
		select id,name,age from student where id=#{id}
	</select>
</mapper>
```

## 5.4 创建主配置文件

这里主配置文件只需要实现两个功能：

+ 指定 bean 的别名，因为上面 resultType 使用到了别名；
+ 指定 mapper 的文件。

而指定 mapper 文件有两种指定方法：

+ 使用 &lt;mapper/> 标签，需要一个个文件配置，过于麻烦，这里不使用；
+ 使用 &lt;package/> 标签，需要将 mapper 的文件名修改成接口的文件名。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
	"http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
	<!-- 这里指定bean的别名 -->
	<typeAliases>
		<package name="com.hahg.beans" />
	</typeAliases>
	
	<!-- 这里指定mapper的别名 -->
     <mappers>
         <!-- 这个需要一个个输入mapper的路径
         <mapper resource="com/hahg/mapper/CustomersMapper.xml" /> 
         -->
         
		<package name="com.hahg.dao"/>
     </mappers>
</configuration>
```

## 5.5 创建容器配置文件

### 5.5.1  使用 Mapper 动态代理方式

在这一步，我们思考下需要在容器里创建哪些 Bean：

1. 创建 Service 层的 Bean，而 Service 层里需要操作 Dao 层，所以其拥有一个 Dao 层的属性。因为复制的是 06-jdbcTemplate 的项目，所以 Service 层不需要更改。

```xml
<bean id="studentService"
      class="com.hahg.service.StudentServiceImpl">
    <property name="dao" ref="studentDao"/>
</bean> 
```

2. 第 1 点引用了 Dao 层的 Bean，所以这一步创建 Dao 层的 Bean。由于我们这里使用的是 Mapper 动态代理方式生成 Dao 代理对象，没有 Dao 层的实现类，所以需要用到新的配置。
   + 使用到的类是【org.mybatis.spring.mapper.MapperFactoryBean】
   + 配置的第一个属性：sqlSessionFactory。创建工程 Bean 当然需要 **引入** 工程来制造它。
   + 配置的第二个属性：mapperInterface。创建了工厂需要给它指定加工的是哪个东西，这里填入的值是 Dao 层的接口——【com.hahg.dao.IStudentDao】

```xml
<bean id="studentDao" class="org.mybatis.spring.mapper.MapperFactoryBean">
    <property name="sqlSessionFactory" ref="mySqlSessionFactory"/>
    <property name="mapperInterface" value="com.hahg.dao.IStudentDao"/>
</bean>	
```

3. 在第 2 点中引用了 sqlSessionFactory ，所以需要创建它。

+ 在之前的 MyBatis 学习中，我们在工具类来使用 SqlSessionFactoryBuilder 创建 sqlSessionFactory，再用 sqlSessionFactory 的 openSession 方法来获取 SqlSession 对象。

```java
public class MyBatisUtils {
	private static SqlSessionFactory sqlSessionFactory;

	public static SqlSession getSqlSession() {
		try {
			if (sqlSessionFactory==null) {
				InputStream inputStream = Resources.getResourceAsStream("mybatis-config.xml");
				sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return sqlSessionFactory.openSession();
	}
}
```

+ 这里也需要配置相同的东西：输入配置文件——使用 configLocation 属性 

```xml
<bean id="mySqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <property name="configLocation" value="classpath:mybatis-config.xml"/>
    <property name="dataSource" ref="myDataSource"/>
</bean>
```

+ 下面这个这一大段代码是之前 MyBatis 学习中，所使用的 mybatis-config.xml 里的代码。
  + 第 11 到 13 行以及第 29 到 30 行是前面已经配置过的；
  + 而配置数据库连接四要素在这里是放在 Spring 容器里的，也就是说现在的 MyBatis 的主配置文件是没有连接数据库的所需信息。
  + 所以在 dataSource 直接引入 Spring 容器里的数据源即可 。

```xml
<!-- mybatis-config.xml -->
<configuration>
	<!-- 注册配置文件 -->
	<properties resource="jdbc.properties" />

	<settings>
		<setting name="logImpl" value="LOG4J2" />
	</settings>

    <!-- 已配置 -->
	<typeAliases>
		<package name="com.hahg.beans" />
	</typeAliases>

	<environments default="development">
		<environment id="development">
			<transactionManager type="JDBC" />
			<dataSource type="POOLED">
				<property name="driver" value="${jdbc.driver}" />
				<property name="url" value="${jdbc.url}" />
				<property name="username" value="${jdbc.user}" />
				<property name="password" value="${jdbc.password}" />
			</dataSource>
		</environment>
	</environments>
    
    <!-- 已配置 -->
	<mappers>
		<mapper resource="com/hahg/dao/mapper.xml" />
	</mappers>
</configuration>

<!-- applicationContext.xml -->
<context:property-placeholder location="classpath:jdbc.properties"/>

<!-- 注册数据源 -->
<bean id="myDataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
    <property name="driverClassName" value="${jdbc.driver}"/>
    <property name="url" value="${jdbc.url}"/>
    <property name="username" value="${jdbc.user}"/>
    <property name="password" value="${jdbc.password}"/>
</bean>   

<bean id="mySqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <property name="configLocation" value="classpath:mybatis-config.xml"/>
    <property name="dataSource" ref="myDataSource"/>
</bean>
```

### 5.5.2 使用支持扫描的动态代理

由上可知，使用 Mapper 动态代理需要一个个配置接口对应的 Mapper 文件，十分麻烦。

所以我们需要使用支持扫描的动态代理。需要用到的类【org.mybatis.spring.mapper.MapperScannerConfigurer】。

+ 由于不在需要一个个注册 Dao 层的 Mapper 文件，所以不需要 id 属性。

+ 需要配置两个属性——sqlSessionFactoryBeanName 和 basePackage：

  + 因为 MapperScannerConfigurer 不推荐使用 ref 来引入 sqlSessionFactory，所以使用 sqlSessionFactoryBeanName，该属性的值为字符串，正如其属性名所示，填入 sqlSessionFactory 的 id 即可。
  + basePackage 指定需要扫描 Mapper 的包

  ```xml
  <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
      <property name="sqlSessionFactoryBeanName" value="mySqlSessionFactory"/>
      <property name="basePackage" value="com.hahg.dao"/>
  </bean>	
  
  <bean id="studentService"
        class="com.hahg.service.StudentServiceImpl">
      <property name="dao" ref="IStudentDao"/>
  </bean> 
  ```

支持扫描 Mapper 的动态代理会像 5.5.1 那样创建 Dao 层，所以直接在 Service 的 bean 里使用 ref 引用即可。

::: warning

但这里需要注重强调一下 ref 的值会有两种情况：

1. 若首字母大写，第二个字母不为大写，则填入需要首字母小写。
2. 若前两个字母大写，则直接填入。

:::

```xml
<!-- 接口名为 StudentDao -->
<bean id="studentService"
		class="com.hahg.service.StudentServiceImpl">
    <property name="dao" ref="studentDao"/>
</bean> 

<!-- 接口名为 IStudentDao -->
<bean id="studentService"
      class="com.hahg.service.StudentServiceImpl">
    <property name="dao" ref="IStudentDao"/>
</bean> 
```

