# SQL速记

## 一、常见数据类型

| 代码             | 说明                                                  |
| ---------------- | ----------------------------------------------------- |
| `INT`            | 整型                                                  |
| `DECIMAL(10, 4)` | 十进制数字。全部数字数量 10 个，其中 4 个在小数点后面 |
| `VARCHAR(3)`     | 可变长字符串。最长 3 个字符的可变字符串               |
| `BLOB`           | 大量二进制数据                                        |
| `DATE`           | " YYYY - MM - DD "                                    |
| `TIMESTAMP`      | " YYYY - MM - DD  HH : MM : SS "                      |

## 二、设计表格

```sql
-- 创建表格
CREATE TABLE student (
	student_id INT PRIMARY KEY,
	name VARCHAR(20),
	major VARCHAR(20)
  -- PRIMARY KEY(student_id)
);

-- 约束列
CREATE TABLE student (
	student_id INT AUTO_INCREMENT, -- 自动增长
	name VARCHAR(20) UNIQUE, -- 不重复值
	major VARCHAR(20) NOT NULL, -- 不为空
	gpa DECIMAL(3,2) DEFAULT(0.00), -- 默认值
  PRIMARY KEY(student_id) -- 主键
);

-- 展示表格结构
DESCRIBE student;

-- 删除表格
DROP TABLE student;

-- 增加列
ALTER TABLE student ADD COLUMN gpa DECIMAL(3,2) NOT NULL;
-- 删除列
ALTER TABLE student DROP COLUMN gpa;
-- 修改列
ALTER TABLE student MODIFY COLUMN gpa VARCHAR(30);
```

## 三、管理数据

```sql
-- 插入全部列数据
INSERT INTO student VALUES (1, 'John', 'Math');
-- 插入部分列数据
INSERT INTO student(student_id, name) VALUES (2, 'Bot');

-- 更新数据
UPDATE student 
SET name = 'Tom', major = 'undecided' -- 同时更新多个数据
WHERE student_id = 1 OR name = 'Kate' -- 指定复杂的条件
```

## 四、基础查询

```sql
SELECT *
FROM student
ORDER BY student_id ASC; -- 顺序排列
-- ORDER BY student_id DESC;  逆序排列

-- 多个排序依据，先按name排序，如果相同再按student_id排序
SELECT *
FROM student
ORDER BY name, student_id DESC;
LIMIT 2;  -- 限制查询结果的行数


--查询操作符
-- < , >, <=, >=, =, <>(不等于), AND, OR

-- 查询在给定的数据里，查询major等于Math或者Art
SELECT * FROM student
WHERE major in ('Math', 'Art');
```

