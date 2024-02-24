# 五、Mybatis注解式开发

​	<span style="color:red">mybatis 的注解，主要是用于替换映射文件。</span>而映射文件中无非存放着增、删、改、查的SQL映射标签。所以，mybatis注解，就是要替换映射文件中的 SQL 标签。

​	mybatis 官方文档中指出，若要真正想发挥 mybatis 功能，还是要用映射文件。即 mybatis 官方并不建议通过注解方式来使用 mybatis。

## 5.1注解的基础知识

以下注解知识的讲解，均使用使用@Overide、@Deprecated（过时）、@SuppressWarnings举例。

### 5.1.1注解的基础语法

A、注解后是没有分号的；

B、注解首字母是大写的，因为注解与类、接口是同一级别的。一个注解，后台对应着一个 @interface 类。属于同一级别的：类、接口、注解、**枚举**；

C、在同一语法单元上，同一注解只能使用一次；

D、在注解与语法单元之间可以隔若干空行、注释等非代码内容。

### 5.1.2注解的注解

​	打开@Deprecated源码，看到其定义上还有三个注解：@Documented、@Retention、@Target。

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(value={CONSTRUCTOR, FIELD, LOCAL_VARIABLE, METHOD, PACKAGE, MODULE, PARAMETER, TYPE})
public @interface Deprecated {
    /**
     * Returns the version in which the annotated element became deprecated.
     * The version string is in the same format and namespace as the value of
     * the {@code @since} javadoc tag. The default value is the empty
     * string.
     *
     * @return the version string
     * @since 9
     */
    String since() default "";

    /**
     * Indicates whether the annotated element is subject to removal in a
     * future version. The default value is {@code false}.
     *
     * @return whether the element is subject to removal
     * @since 9
     */
    boolean forRemoval() default false;
}
```

### 5.1.3注解的属性

​	当某变量被声明了，但却未被使用；或某集合在声明或定义时未加泛型说明等情况发生时，会在代码下给出警告黄线。Ctrl + 1，可在代码上添加一个注解 @SuppressWarnings()。并且发现，不同的情况，其参数是不同的。

​	打开其源码，看到其定义与 @Deprecated 是不同的，其接口体中声明了一个方法 String[] value()。那么该注解在使用时必须包含一个属性 value，类型为 String[]。且该参数没有默认值，即必须给出value的值。

```java
@Target({TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE, MODULE})
@Retention(RetentionPolicy.SOURCE)
public @interface SuppressWarnings {
    /**
     * The set of warnings that are to be suppressed by the compiler in the
     * annotated element.  Duplicate names are permitted.  The second and
     * successive occurrences of a name are ignored.  The presence of
     * unrecognized warning names is <i>not</i> an error: Compilers must
     * ignore any warning names they do not recognize.  They are, however,
     * free to emit a warning if an annotation contains an unrecognized
     * warning name.
     *
     * <p> The string {@code "unchecked"} is used to suppress
     * unchecked warnings. Compiler vendors should document the
     * additional warning names they support in conjunction with this
     * annotation type. They are encouraged to cooperate to ensure
     * that the same names work across multiple compilers.
     * @return the set of warnings to be suppressed
     */
    String[] value();
}
```

​	对于注解的属性，需要注意以下几点：

1. 数组问题该属性在源码定义时被声明为数组，但在具体使用时却只要赋予一个值，此时无需将该值再定义为一个数组后赋给该属性。直接将该值赋给该属性即可。例如，<u>对于声明为字符串数组 String[] 的 value 属性，可以将字符串 String 直接赋给该 value</u>。
2. 默认值问题若某属性在注解定义时声明了其默认值，则在注解使用时，可以不为其指定属性值。注解会自动使用其默认值。
3. value 属性问题若注解在使用时只需使用其 value 属性，其它属性要么有默认值，要么该注解只声明了一个value 属性，此时，在注解使用时 value **属性名称可省略**，而直接在注解的括号中写出该 value 属性的值。
4. 无属性问题有些注解在定义时，是没有属性的，如 @Deprecated、@Overide 都是没有属性声明的，那么在使用时只需给出注解名称即可。
5. 根据第 1 和第 3 点 可知，若注解的参数只需要填写 value 的时候可以写成下面三种格式：
   + @Xxxxx ( value = { "……" } )
   + @Xxxxx ( value = "……" )
   + @Xxxxx ( "……" )

## 5.2 Mybatis注解

​	程序举例项目：annotation，在 dynamicMapper 基础上进行修改

### 5.2.1@Insert

​	其 value 属性用于指定要执行的 insert 语句。

```java
@Insert("insert into student(name,age,score) values (#{name},#{age},#{score})")
void insertStudent(Student student);
```

### 5.2.2 @SelectKey

原始的映射文件中的语句：

```xml
<insert id="insertStudentCatchId">
    insert into student(name,age,score) values (#{name},#{age},#{score})
    <selectKey resultType="int" keyProperty="id" order="AFTER">
        select @@identity
    </selectKey>
</insert>
```

用于替换 XML 中的 &lt;selectKey/>标签，用于返回新插入数据的 id 值。

+ statement：获取新插入记录主键值的SQL语句；

+ keyProperty：获取的该主键值返回后初始化对象的哪个属性；

+ resultType：返回值类；

+ before：指定主键的生成相对于insert语句的执行先后顺序，该属性不能省略。

```java
@Insert("insert into student(name,age,score) values (#{name},#{age},#{score})")
@SelectKey(before = false, keyProperty = "id", 
resultType = int.class, statement = "select @@identity" )
void insertStudentCatchId(Student student);
```

### 5.2.3 @Delete

​	其 value 属性用于指定要执行的 delete 语句。

```
@Delete(value = "delete from student where id=#{xxx} ")
void deleteStudentById(int id);
```

### 5.2.4 @Update

​	其 value 属性用于指定要执行的 update 语句。

```java
@Update("update student set name=#{name}, age=#{age}, score=#{score} where id=#{id}")
void updateStudent(Student student);
```

### 5.2.5 @Select

​	其 value 属性用于指定要执行的 select 语句。

```java
// 查询所有
@Select("select * from student")
List<Student> selectAllStudents();

// 查询指定学生
@Select("select id,name,age,score from student where id=#{jjj}")
Student selectStudentById(int id);
```

### 5.2.6 删除映射文件

​	由于MyBatis注解替换的是映射文件，所以这里就不需要映射文件了，将其直接删除。

### 5.2.7 修改主配置文件

​	由于没有了映射文件，所以主配置文件中不能使用 &lt;mapper/> 注册 mapper 的位置了。需要使用 &lt;package/> 标签。

```xml
<mappers>
	<package name="com.hahg.dao"/>
</mappers>
```

