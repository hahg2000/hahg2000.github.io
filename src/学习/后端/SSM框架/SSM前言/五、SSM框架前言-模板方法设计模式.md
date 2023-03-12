---
tags:
  - SSM框架
  - 学习
  - Java
readingTime: true 
autoNext: 六、JUnit测试
---

# 五、SSM框架前言-模板方法设计模式

## 5.1 引例

​	在现实生活中，完成某件事情是需要 n 个固定步骤的。如 “在淘宝网进行购物” 这件事情的完成一般需要三个步骤：登录网站、挑选商品、付款。但对于登录网站与付款这两步，每个人都是 **差不多** 的操作。但对于挑选商品来说，每个人挑选的商品都是不同的。

​	在软件开发的过程同样存在这样的情况。某类的某个方法的实现，需要几个固定步骤，在这些固定步骤中，对于该类的不同对象，有些步骤的实现是固定不变的，有些是大相径庭的，有些是可变可不变的。对于这种情况，就适合使用模板方法设计模式编程。

​	模板方法设计模式的定义是：定义一个操作中某种算法的框架，而将一些步骤延迟到子类中。模板方法模式使得子类在不该表一个算法结构的前提下，对某些步骤实现 **个性化** 定义。

## 5.2 模板方法程序的构成

​	在模板方法设计模式中，存在一个父类。其中包含两类方法：模板方法与步骤方法。

+ 模板方法，即实现某种算法的方法步骤。而这些步骤都是调用步骤方法完成的。
+ 步骤方法，即完成模板方法的每个 **阶段性** 方法。每个步骤方法完成某一特定的、完成总算法的一部分功能。步骤方法有三种类型：抽象方法、最终方法与钩子方法。
  + 抽象方法，是要求子类 **必须** 实现的方法，是完成模板方法的算法步骤中必须有子类完成的个性化定义。
  + 最终方法，是子类 **不能** 重写的方法，对于所有子类都执行 **一样** 的方法。
  + 钩子方法，是父类给出了默认实现，但子类也可以重写的方法。

## 5.3 程序举例

### 5.3.1 定义父类

**Shopping.java**：先定义模板方法——用户登录、选择商品和付款，再定义步骤方法。用户登录为最终方法，子类不能重写所以使用 final 关键字；选择商品为抽象方法，子类必须实现所以使用 abstract 关键字。付款为钩子方法，子类可选择是否重写。

```java
public abstract class Shopping {
	
	// 模板方法
	public void buyGoods() {
		userLogin();
		buy();
		pay();
	}

	// 子类不能重写的方法
	public final void userLogin() {
		System.out.println("用户登录");
	}
	
	// 子类必须实现
	public abstract void buy();
	
	// 钩子方法
	public void pay() {
		System.out.println("使用银联卡支付");
	}
}
```

### 5.3.2 定义子类

这里定义了两个子类，一个购买鞋子，一个购买衣服，其中购买衣服的子类重写了钩子方法。

**ClothesShopping.java**

```java
public class ClothesShopping extends Shopping {

	@Override
	public void buy() {
		System.out.println("购买七匹狼男装");
	}
	
	@Override
	public void pay() {
		System.out.println("使用支付宝付款");
	}
}
```

**ShoesShopping.java**

```java
public class ShoesShopping extends Shopping {

	@Override
	public void buy() {
		System.out.println("购买红蜻蜓皮鞋");
	}
}
```

### 5.3.4 定义测试类

**MyTest.java**

```java
public class MyTest {
	public static void main(String[] args) {
		Shopping shoesShopping = new ShoesShopping();
		shoesShopping.buyGoods();
		System.out.println("-----------------------");
		Shopping clothesShopping = new ClothesShopping();
		clothesShopping.buyGoods();
	}
}
```

运行结构如下图

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/1612844148(1).png" style="zoom:85%;" />

