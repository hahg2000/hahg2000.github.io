# 原生JS高级-上

## 一、数据类型

### 1.1 分类

数据类型分为 **基本 / 值** 类型 和 **对象 / 引用** 类型。

基本类型分为：

| 关键字     | 内容           | 关键字        | 内容       |
| ---------- | -------------- | ------------- | ---------- |
| **String** | 任意字符串     | **boolean**   | true/false |
| **Number** | 任意的数字     | **undefined** | undefined  |
| **null**   | null（空对象） |               |            |

对象类型分为：

| 关键字     | 内容                                   | 关键字       | 内容                 |
| ---------- | -------------------------------------- | ------------ | -------------------- |
| **Object** | 任意对象                               | **Function** | 特别的对象，可以执行 |
| **Array**  | 特别的对象，内部有序，可以使用下标访问 |              |                      |

### 1.2 判断

判断数据类型可以使用两种方法：

1. `typeof 数据` ，返回的是 <span style="color:red">字符串</span>，<u>表示未经计算的操作数的类型</u>；

2. `object instanceof constructor` ，返回的是 **布尔值**，用于检测构造函数的 `prototype` 属性是否出现在某个 **实例对象** 的 <span style="color:red">原型链</span>上。

例子1：因为 `typeof ` 运算符返回的是未经计算的操作数的类型，所以有时会失效。不能区分 null 与 一般对象和数组 与 一般对象。

```js
// null 与 一般对象
var obj = {};
console.log(typeof null === typeof obj);  //true

// 数组 与 一般对象
var array = [];
console.log(typeof array === typeof obj); //true
```

例子2：`instanceof` 运算符专门用来判断 Object，Array 与 Function。具体的会在后面的原型链来介绍。

```js
// 一般对象
var b1 = {
    // 数组 
    b2: [2, 'abc', console.log],
    // 函数
    b3: function () {
        console.log('b3()')
    }
}
console.log(b1 instanceof Object, typeof b1) // true 'object'
console.log(b1.b2 instanceof Array, typeof b1.b2) // true 'object'
console.log(b1.b3 instanceof Function, typeof b1.b3) // true 'function'
```

### 1.3 undefined与null

#### （1）undefined与null的区别

+ undefined：定义了但没有赋值，常见的是 `对象.对象中没有的属性`。
+ null：定义了又赋值了，但赋值的值是 `null`，通常使用 `对象 = null`，来清空指定对象。

#### （2）使用null的场景

+ 初始赋值，表明将要赋值为对象。
+ 操作结束前，让对象成为垃圾对象（被垃圾回收器回收）。

#### （3）变量类型与数据类型

+ 数据类型：基本类型和对象类型
+ 变量类型
  + 简单来说，变量的内存里存的是什么东西。
  + 基本类型：保存的就是基本类型的数据，与立即寻址相关。
  + 引用类型：保存的是地址值，与直接寻址相关。
+ 但一般不会严格区分这两个类型。

## 二、数据与内存

### 2.1 概念

#### （1）什么是数据？

这个数据是计算机方面的，其代表了特定信息的东西，本质上是 0101.....

数据的特点之一：可运算。逻辑运算与算术运算。

#### （2）什么是内存？

+ 内存条通电后产生的 **临时的** 可存储数据的空间。

+ 内存的生命周期：内存条插上 ==> 通电 ==> 产生内存空间 ==> 存储数据 ==> 操作数据  ==> 断电 ==> 内存空间与数据消失

+ 内存的两类数据：**直接使用的数据** 与 **地址值**，与变量类型相似。
+ 内存的主要组成部分：
  + 栈：存放全局变量和局部变量；
  + 堆：对象以及占用空间较大的数据。

#### （3）什么是变量？

+ 分配的内存空间的里面的数据是可变的。
+ 由变量名和变量值组成。
+ 变量名用于查找栈中需要用到的数据，变量值用于就是我们需要使用的数据。

### 2.2 相关问题

#### （1）问题一

问：`var a = xxx` ，a 变量的内存中保存数据类型是什么？

答：如果 xxx 是基本数据，内存保存的是 **这个基本数据**。

如果 xxx 是对象，则内存保存的是对象在堆里的 **地址值**。

如果 xxx 是变量，则保存的是 xxx 变量里内存里的 **数据**。

#### （2）问题二

问：关于引用变量赋值问题

答：若 n 个变量都指向同一块内存空间，通过一个变量修改内存空间的数据，其他变量能感知到。

```js
// 创建变量，变量指向一个对象的内存空间
var obj1 = {name:"张三"};
// 创建另一个变量，指向同一个内存空间
var obj2 = obj1;
// 使用obj1修改内存空间的值
obj1.name = "李四";
// obj2也可以感知到
console.log(obj2.name); // 输出"李四"
```

#### （3）问题三

下面有两段代码，他们的输出是什么？

```js
// 代码段1
var obj1 = {name:"张三"};

function fn1 (obj){
    obj.name = "李四";
}

fn1(obj1);
console.log(obj1.name);	// 输出?

// 代码段2

var obj2 = {name:"张三"};

function fn2 (obj){
    obj = {name:"李四"};
}

fn2(obj2);
console.log(obj2.name);// 输出?
```

---

答：第一个输出 “ 李四 ”，第二个输出 ” 张三 “。

解析：【若函数有形参，则在执行函数前，会执行这行代码 `var 形参 = 实参;` 则上面的代码就会执行 `var obj = obj1;`】

+ 第一段代码：与问题二一致，obj 局部变量 和 obj1 全局变量都指向了 同一块内存空间，所以通过 obj 局部变量修改，obj1 全局变量也可以看到。

+ 第二段代码：将 obj 局部变量指向 **一个新内存空间**，空间里的数据是一个新对象。函数执行完，**释放 obj 局部变量，局部变量里的对象成为垃圾对象**。所以本质上也 **没有修改 obj1 的指向**，如下图。

总结：通过形参传进来的地址值，我们 **只能对地址值里的内容进行修改**，无法修改指向该地址的变量。

#### （4）问题四

问：在 JS 调用函数时传递变量参数时，是值传递还是引用传递？

答：有两种说法：

+ **都是值传递**，都是传 **变量内存里的值**，不过内存里面的值可能是 **基本数据** 也可能是 **地址值数据**。
+ **可能是值传递**，传进去的数据是基本类型，不能对传进来的变量进行修改。
  **也可能是引用传递**，传进来的数据是地址值，可以通过地址值对传进来的变量进行修改。
+ 总的来说，**传地址不是传变量在栈中的地址，而是引用类型在堆中的地址**。

#### （5）问题五

问：JS 引擎如何管理内存？

答：

1. 内存生命周期：
   1. 分配小内存空间，得到它的使用权。
   2. 存储数据，可以反复进行操作。
   3. 释放小内存空间。
2. 释放内存：
   1. 局部变量：函数执行完自动释放。
   2. 全局变量：window 对象销毁时，即关闭浏览器。

## 三、对象

### 3.1 引入

1. 什么是对象?

  * 用来保存多个数据的 **容器**。
  * 一个对象可以代表现实中的一个事物。

2. 为什么要用对象?
  * 统一管理多个数据，**便于管理与使用**。
3. 对象的组成
  * 属性: 属性名（**字符串**）和属性值（任意）组成
  * 方法: 一种特别的属性（属性值是函数）
4. 如何访问对象内部数据?
  * `对象.属性名`: 编码简单，但有些情况不能用。
  * `对象['属性名']`: 编码麻烦,，能通用。

### 3.2 相关问题

问：什么时候必须使用 `对象['属性名']` 来访问属性呢？

答：1. 属性名含特殊字符，例如 “ - ”。

```js
var obj = {};

// 不能这样子添加
// obj.context-type = "text/javascript"

// 必须这样的添加
obj["context-type"] = "text/javascript";
```

2. 当属性名为变量时

如果使用 `对象.变量名` 来访问 **属性名为变量值** 的属性，就会当成访问 **属性名为变量名** 的属性，如第 6 、7 行所示。

```js
obj["context-type"] = "text/javascript";
obj["attrName"] = "attrName";

function fn1 (attrName){
    // 不能使用
    // console.log(obj.attrName); 
    // 其等价于 console.log(obj["attrName"]); // 输出 attrName

    console.log(obj[attrName]); // 输出 text/javascript
}

fn1("context-type");
```

## 四、函数

### 4.1 简介

1. 什么是函数?
  * 具有特定功能的 n 条语句的 **封装体**。
  * **只有函数是可执行的**， 其它类型的数据是不可执行的
  * **函数也是对象**。
2. 为什么要用函数?
  * **提高代码复用**，相同执行的代码不用写多几遍，直接调用函数即可。
  * **便于阅读和交流**，函数已经把详细的代码封装起来，看函数名就可以大概知道其作用，不用看完这个函数里的代码。
3. 如何定义函数?
  * **函数声明**。`funtion fn1(){}`
  * **表达式**。`var fn2 = funtion() {}`

4. 如何调用(执行)函数?

  * `test()` ：**直接调用**。
  * `new test()` ：**new 关键字** 调用，`test()` 函数为构造函数。
  * `obj.test()` ：利用 **对象** 来调用。
  * `test.call/apply(obj)` ：**临时 ** 让 test 成为 obj 的方法进行调用。

### 4.2 回调函数

1. 什么函数才是回调函数?
   1. 我们自己定义的。
   2. 我们没有 **亲自** 调用它。
   3. 但 **最终它执行了**（在某个时刻或某个条件下）
2. 常见的回调函数?
     1. **dom事件回调函数**，调用者为发生事件的 dom 元素。
     2. **定时器回调函数**，调用者为 window。
     3. **ajax请求回调函数**。
     4. **生命周期回调函数**。

### 4.3 IIFE

#### （1）理解

IIFE，全称 Immediately Invoked Function Expression，**立即调用函数表达式**。

其实就是 **立即执行的匿名函数**。

```js
// (
//   function () {
//     函数内容
//   }
// )()
(
    function () {
        var a = 2;
        console.log(a);
    }
)()
```

#### （2）作用

+ **隐藏实现**，将多条语句封装成了一个匿名函数。
+ **不会污染外部（全局）命名空间**，因为其属于函数作用域。
+ 用它来编码 JS 模块，下面举一个简单例子。

---

`$().addA()`：第 29 行调用步骤：

调用步骤：

1. `$` 取到一个函数。

```js
function () {
    return {
        addA: addA
    }
}
```

2. 执行这个函数，`$()` ，其返回值为一个对象 `{addA: addA}`，即 `$() == {addA: addA}` 。

3. 取对象里的属性值，【对象.属性名】，`$().addA` 。

4. 再执行属性值的内容，`$().addA()`，在外部执行内部的函数。

```js
(
    // 匿名函数
    function () {
        // 定义一个变量
        var a = 1;
        // 在函数中添加操作变量
        function addA() {
            console.log(a++);
        }

        // 将往window对象中添加属性，属性值为一个函数
        window.$ = function () {
            // 函数里返回一个对象，对象值为addA函数
            return {
                addA: addA
            }
        }
    }
)()
// 调用步骤：1.$取到一个函数
// function () {
//   return {
//     addA: addA
//   }
// }
// 2.执行这个函数，$(),返回值为一个对象 {addA: addA}，即$() == {addA: addA}
// 3.取对象里的属性值，【对象.属性名】，$().addA
// 4.再执行属性值的内容，$().addA()，我们可以在外部执行内部的函数
$().addA()
```

### 4.4 this

#### （1）this是什么

  * 任何函数本质上都是通过某个对象来调用的，就如同 **通过对象来调用里的属性对象**，如果没有直接指定就是window。
  * 所有函数内部都有一个**隐含变量** `this`。
  * 它的值是调用函数的 **当前对象**。

#### （2）如何确定this的值

| 代码                 | this 的值 |
| -------------------- | --------- |
| `test()`             | `window`  |
| `p.test()`           | `p`       |
| `var p = new test()` | `p`       |
| `test.call(obj)`     | `obj`     |

### 4.5 分号问题

1. JS 一条语句的后面可以不加分号
2. 是否加分号是编码风格问题
3. 下面两种情况下不加分号会有问题，解决办法：在 “ ( ” 和 “ [ ” 前面加 “ ; ”。

```js
// 第一种，前面代码后面是 () 符号
var a = 1
(
    function() {
        console.log(a);
    }
)()

// 第二种，前面代码后面是 [] 符号
var b = 1
[1, 2, 3].forEach(function (e) {
    console.log(e)
})
```
## 五、原型

### 5.1 原型引入

在之前有提到过 构造函数中有一个原型对象，放入原型对象的值，每一个实例对象可以访问到。

构造函数的原型对象本质上是一个新的空对象，而这个对象里面有 `constructor` 对象可以访问的构造函数，如下图所示。

![](https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E9%AB%98%E7%BA%A7-%E5%8E%9F%E5%9E%8B%E5%BC%95%E5%85%A5.png)

### 5.2 显式原型与隐式原型

上面所说的 `函数.prototype` ，**函数的原型对象** 我们有时会称之为 **显式原型**，而函数的 **实例对象 **有一个 **隐式原型** `__proto__` 可以通过这个属性访问到 **函数的显示原型**。

所以我们可知：<span style="color:red">实例对象的隐式原型 等于 构造函数的显式原型</span>。

不论是函数的显式原型 还是 实例对象的隐式原型，都是在创建时 **自动生成** 的。

```js
function Person(name){
    this.name = name;
}

var p1 = new Person("张三");

// 实例对象.__proto__ 已弃用 
// 改用 Object.getPrototypeOf(实例对象)
console.log(Person.prototype === Object.getPrototypeOf(p1));  //true
```

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/高级-显式原型和隐式原型.png" style="zoom:80%;" />

::: warning

我们现在都可以直接操作显式原型和隐式原型，但不建议操作隐式原型。

:::

### 5.3 原型链

有时我们在使用 `对象.toString()` 方法时，会有点好奇，我们都没有添加函数到对象里面，为什么可以使用？

其实这有点像 Java 里的 **继承**，而这里的原理是 JS 会根据 **原型链** 来寻找我们需要的函数。

#### （1）概念

原型链，别名 **隐式原型链**，就是根据 **隐式原型** 来 **寻找我们需要的属性**。

访问一个对象的属性的步骤：

1. 先在自身属性中查找，找到返回。
2. 如果没有，再沿着 \_\_proto\_\_ 这条链向上查找, 找到返回。
3. 如果最终没找到，返回undefined。

#### （2）深入

上面说过，实例对象才有 **隐式原型**，但 JS 会通过 **隐式原型链** 来寻找我们需要的属性。

所以说在 **隐式原型链** 中的 **每一个** 对象都是 **实例对象**。

假设有下面几行代码。

```js
function Person(name){
    this.name = name;
}

var p1 = new Person("张三");

p1.toString();
```

1. 首先寻找到的是 p1 的 **隐式原型**，也就是  `Person()`  构造函数的 **显式对象**，即 `Person.prototype`，发现没有 `toString()` 函数。
2. 然后就继续寻找到 【Person() 函数的显式对象】的 【隐式原型】，就是 `Object()` 构造函数的【显式对象】，即 `Object.prototype` 。因为显式 **对象** 可以看作是 `Object()` 构造函数的所实例化的，即 `Person.prototype = new Object()`。
3. `Object()` 函数的显式原型中有 `toString()` 函数，所以不用继续往上找了，而 【Object() 函数的显式原型】的 隐式原型是 `null` ，即 【Object() 函数的显式原型】 是 **原型链的终点**。

详细如下图所示：

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E5%8E%9F%E5%9E%8B%E9%93%BE%E7%A4%BA%E4%BE%8B1.png" style="zoom:80%;" />

#### （3）继续深入

问：构造函数是否有隐式原型，就像上图的 `Person()` 和 `Object()`？

思考：构造函数对象 是哪个函数 `new` 来？即 `var 构造函数对象 = new xxx();`

---

答：其实是 Function() 来 new 出来的，**每一个函数都是他来创建的**，即 `var Person = new Function();`。

所以可以推出【 `Person()` 的隐式原型 是 `Function()` 的显式原型】。

那其实 `Function()` 函数也是 `Function()` 创建的，也就是说 **自己创造自己**。根据上句话，就可以得出 **Function() 函数的显式原型和隐式原型是指向同一个对象**。

再上图继续添加内容：

![](https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E5%8E%9F%E5%9E%8B%E9%93%BE%E7%A4%BA%E4%BE%8B2.png)

总结：

1. 任何对象，包括函数的原型链最后都是 `Object.prototype`；
2. 任何函数的隐式原型都是 `Function()` 构造函数的显式原型—— `Function.prototype`

#### （4）使用规则

1. 读取对象的属性值时：会 **自动** 到原型链中查找。
2. 设置对象的属性值时：不会查找原型链，如果当前对象中没有此属性，**直接添加此属性到对象里并设置其值**。
3. 方法一般定义在原型中；属性一般通过构造函数定义在对象本身上，除非每一个实例对象的这个属性都一致。

### 5.4 探索instanceof

#### （1）instanceof是如何判断的

  * 表达式：`object instanceof constructor`
  * 如果 constructor 的显式原型对象 在 object 的原型链上, 返回 true, 否则返回 false。

#### （2）案例1

案例1：有一个 Foo() 构造函数，然后使用构造函数创建了一个 f1 的实例对象。

问：第 3 ~ 4 行输出什么？

```js
function Foo() {  }
var f1 = new Foo();
console.log(f1 instanceof Foo);
console.log(f1 instanceof Object);
```

---

答：true；true。

解析：很简单的一个例子，f1 是 Foo() 所创建的，所以第 3 行是 true；

而根据第 5.3 节的第（3）点的总结：

> 任何对象，包括函数的原型链最后都是 `Object.prototype`

所以可以知道 Object 的显式原型对象是在 f1 的原型链上，所以第 4 行为 true。

#### （3）案例2

案例2 问：下面的输出是什么？

```js
console.log(Object instanceof Function);
console.log(Object instanceof Object);
console.log(Function instanceof Function);
console.log(Function instanceof Object);

function Foo() {}
console.log(Object instanceof  Foo);
```

---

答：第 1 ~ 4 行，true；第 7 行 false。

解析：第 1 和 第 4 行很明显是 true ，还是是那句话：

> 任何对象，包括函数的原型链最后都是 `Object.prototype`。

第 2 和 第 3 行根据下面这句话，得出是 true。

> 任何函数的隐式原型都是 `Function()` 构造函数的显式原型—— `Function.prototype`

无论是 Function 还是 Object 都是构造函数。

### 5.5 测试题

#### （1）第一题

A 是一个函数，然后在 A 函数的显式原型添加一个 n 属性，然后使用函数创建了一个 b 实例对象。

接下来将 A 的显式原型重新赋值一个对象，再使用新的 A 函数创建一个 c 实例对象。

问：b 对象和 c 对象里面有什么属性？

```js
var A = function() {}

A.prototype.n = 1

var b = new A()

A.prototype = {
    n: 2,
    m: 3
}

var c = new A()
console.log(b.n, b.m, c.n, c.m)
```

---

答：1；undefined；2；3

解析：这道题有点涉及到内存的知识，首先 b 实例对象的隐式原型指向了 A 函数的显式原型，在 A 函数换显式原型时，之前的显式原型 b 的隐式原型依然引用他，所以不会被回收。

而然后会再使用 A 函数来创建 c 实例对象，c 的隐式原型自然会指向 A 函数的新显式原型。

#### （2）第二题

F 是一个构造函数，然后使用 F 创建一个 f 实例对象，再往 Object 的显式原型和 Function 的显式原型分别添加一个函数。

问：可以通过哪些方式来获取到这些函数，例如第 9 ~ 第 12 行？

```js
var F = function(){};
Object.prototype.a = function(){
    console.log('a()')
};
Function.prototype.b = function(){
    console.log('b()')
};
var f = new F();
f.a()
f.b()
F.a()
F.b()
```

---

答：可以；报错；可以；可以。

解析：f 是实例对象，由之前原型链那里得知，Object 显式原型里的属性任何对象都可以使用，例如 `f.toString()` 。而 f 是实例对象不是函数对象，所以和 Function 没有一点关系。

F 是函数对象，即是函数又是对象，所以 Function 和 Object 的显式原型都可以访问到。

## 六、执行上下文

### 6.1 引入

执行上下文，Execution Context，个人觉得也可以翻译为代码的 **执行环境**。这就像语文中的阅读理解中的题目：“ 联系上下文，作者在xxx时的心情如何？”

每到一些特定的语句就会创建一个新的 执行环境。Javascript 中的执行环境分为三种：

+ **全局环境**：JavaScript 代码运行起来会首先进入该环境。
+ **函数环境**：当函数被调用执行时，会进入当前函数的环境中执行代码。
+ eval（不建议使用，可忽略）。

### 6.2 执行上下文栈

当 Javascript 执行代码时，一定会有多个 **执行环境**，而这些执行环境被存放到栈中，这个栈被称为 **执行上下文栈**。

执行到一个新的函数，就将新的函数的执行环境压栈；执行完一个函数，就将这个函数的执行环境弹栈。

执行环境的生命周期大致分为两部分：**创建阶段** 和 **代码执行阶段**。

#### （1）创建阶段

在创建阶段中会做三个事情：生成变量对象、建立作用域链和确定 this 的指向。

1. 生成变量对象

**变量对象**，Variable Object，VO，就像在栈里存的变量名和变量值。

**步骤：** 

+ 建立 arguments 对象。检查传进来的参数，建立该对象下的属性与属性值。
+ 检查当前环境的函数声明，也就是使用 function 关键字声明的函数。在变量对象中以函数名建立一个属性，属性值为指向该函数所在内存地址的引用，即 在栈中先建立函数。
+ 检查当前环境中的变量声明，每找到一个变量声明，就在变量对象中 **以变量名建立一个属性，属性值为undefined**。如果该变量名的属性已经存在，为了防止同名的函数被修改为undefined，则会直接跳过，原属性值不会被修改。
  即使这样写，输出 a 也是 1 `var a = 1; var a; console.log(a);`

下面举一个例子：

```js
function fn(number){
    var a = 10;
    function add(){
        console.log("add");
    }
}

fn(1);
```

上面的代码中的生成变量对象的结果如下图，而在代码执行阶段，变量对象会变为活动对象（Active Object），里面的属性就可以访问了，也就是说可以进行赋值操作了。

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E5%8F%98%E9%87%8F%E5%AF%B9%E8%B1%A1%E5%BB%BA%E7%AB%8B%E7%BB%93%E6%9E%9C.png" style="zoom:80%;" />

2. 建立作用域链

作用域链会在下一章介绍。

3. 确定 this 的指向

之前简单介绍了 this 的取值，现在深入了解下。

#### （2）确定this的指向

this 的值用一句话描述就是 “ **哪个对象调用函数，函数的 this 就指向他。**"

这里简单说明严格模式：<u>在严格模式下，如果没有显式地指明调用对象来调用对象，则 this 就是 undefined</u>。

然会我们用例子来讲解：

**例子1：**

在全局变量中定义了变量 a，a 的值为 20；然后定义了一个对象。

问：第 9 ~ 10 行输出什么？

```js
var a = 20;
var obj = {
    a: 10,
    c: this.a + 20,
    fn: function () {
        return this.a;
    }
}
console.log(obj.c);
console.log(obj.fn());
```

---

答：40 ；10

解析：在执行到第 2 行时，会将可以计算属性值计算出来，并添加到 window 的属性中，而 对象的 `{ }` **不会形成新的作用域**，所以这里的 this 指向 window 。

而第 10 行中，我们 **使用了 obj 对象来调用属性**，所以 this 是 obj。

**例子2：**

在全局变量中定义了变量 a，a 的值为 20；然后定义了一个对象，对象里有一个函数。然后使用不同的方式调用该函数。

问：第 8 行和第 11 行输出什么？

```js
var a = 20;
var foo = {
    a: 10,
    getA: function () {
        return this.a;
    }
}
console.log(foo.getA());

var test = foo.getA;
console.log(test()); 
```

---

答：10 ； 20。

解析：第 8 行可以看作是 foo 对象来调用 getA() 函数；

而第 11 行可以看作是将函数的代码块的地址用一个变量存放，再 **单独** 执行函数，这里的 this 就是 undefined 。在非严格模式下， this 自动从 undefined 变为 window；如果在严格模式下，将报错。

可以将代码改写成如下，会更好理解：

```js
var a = 20;
function getA() {
    return this.a;
}
var foo = {
    a: 10,
    getA: getA
}

console.log(foo.getA()); // 10
console.log(getA()); // 非严格模式：20；严格模式：报错
// console.log(window.getA()); 输出 20
```

**例子3：**

定义了两个函数，一个函数的作用是调用传进来的函数参数，另一个作用是输出信息。然后定义了一个对象，对象里有一个属性引用了输出信息的函数。

问：控制台输出是什么？

```js
function foo() {
    console.log(this.a)
}

function active(fn) {
    fn(); // 真实调用者，为独立调用
}

var a = 20;
var obj = {
    a: 10,
    getA: foo
}

active(obj.getA);
```

---

答：20。

解析：obj.getA 将 foo() 函数的代码块放进了一个函数里，注意这里并没有执行 foo() 函数。在传进了函数后，才单独执行，所以函数的 this 为 undefined，在非严格模式模式中，自动转换为 window，故为 20。

#### （3）测试题

下面有几道关于变量提升的测试题，问下面会输出什么？

```js
// 题目1
function a() { }
var a;
console.log(typeof a)

// 题目2
if (!(b in window)) {
    var b = 1;
}
console.log(b)

// 题目3
var c = 1
function c(c) {
    console.log(c)
    var c = 3
}
c(2)
```

---

答：function；undefined；报错。

解析：1. 因为函数提升先于变量提升，函数提升是执行环境的创建阶段中生成变量对象的第二步，而变量提升是第三步。而使用 var 重复声明变量，是不会覆盖之前的值，所以 a 依然是函数。

2. 因为在 ES5 中没有块级作用域，所以任何 var 声明都会在执行环境的创建阶段执行，所以题目 2 和下面代码一致。

```
var b;
if (!(b in window)) {
    b = 1;
}
console.log(b)
```

3. 第 13 行执行了赋值操作。虽然使用 var 重复声明变量，是不会覆盖之前的值，但执行赋值操作，就会覆盖之前的值，所以 18 行的 c 是一个数字。

#### （4）总结

我们可以根据上面的一些知识总结一下，执行上下文的特点：

- 单线程；
- 同步执行，只有栈顶的上下文处于执行中，其他上下文需要等待；
- 全局上下文只有唯一的一个，它在浏览器关闭时出栈；
- 函数的执行上下文的个数没有限制；
- 每次某个函数被调用，就会有个新的执行上下文为其创建，即使是调用的自身函数，也是如此。

## 七、作用域链

### 7.1 作用域

#### （1）理解

+ 作用域就是一块 " 地盘 " ， 一个代码段所在的区域，即在上下文栈中的内容。

* 它是 **静态** 的（相对于上下文对象），**在编写代码时就确定了**。

#### （2）分类

  * 全局作用域

  * 函数作用域

  * 没有块作用域（ES6有了）

#### （3）作用

  * 隔离变量，不同作用域下同名变量不会有冲突。

### 7.2 作用域链

#### （1）理解

  * **多个上下级关系的作用域形成的链**，它的方向是从下向上的（从内到外）；
  * **查找变量时就是沿着作用域链来查找的**。

#### （2）查找规则

在当前作用域下的执行上下文中查找对应的属性，如果有直接返回， 否则就去 **根据作用域链去上一级作用域** 寻找，**直到寻找到全局作用域**。如果还没有则报错。

### 7.3 与执行上下文的区别

1. 区别1
  * 每个函数都会创建自己的作用域，作用域在函数定义时就已经确定了，而不是在函数调用时。
  * 在函数执行时，执行上下文对象的创建阶段中就会 **建立作用域链**。
2. 区别2
  * 作用域是静态的,，只要函数定义好了就一直存在， 且不会再变化
  * 上下文环境是动态的,，调用函数时创建，函数调用结束时上下文环境就会被释放。
3. 联系

下面举一个例子来说明一下作用域链与执行上下文的联系。

下面有一段代码，请问输出的是什么？函数之间的作用域链与执行上下文是怎样的？

```js
// 全局变量
var a = 2;

// 全局函数，用于输出a
function logNum() {
    console.log(a);
}

function count(number) {
    var a = 1;
    // 将a加上number
    function add(number) {
        a += number;
    }
    add(number);
    logNum();
}

count(3);
```

---

答：输出的是 2。

执行的作用域上下文栈的情况如下图：

![](https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E4%B8%8A%E4%B8%8B%E6%96%87%E6%A0%88%E5%AE%9E%E4%BE%8B.png)

为了探究作用域链的情况，将画出第 15 行 和 第 16 行的代码执行时的上下文的具体内容。

因为函数的作用域链 **在定义函数时已经形成了**，不管在哪调用它，都会按照作用域链寻找属性。

例如，`logNum()` 函数是定义在全局作用域上的，所以 **其执行时是在全局作用域上寻找**，即 a 的值为 2，如图中的粉色线所示。

而 `add()` 函数是定义在函数作用域上的，所以 **其执行时是在定义自己的函数作用域上寻找**，即 a 的值为 1，如图中的蓝线所示。

![](https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%93%BE%E5%AE%9E%E4%BE%8B.png)

## 八、闭包

### 8.1 引入

之前我们在使用循环来为多个按钮绑定单击事件时，使用了第 10 ~ 14 行的代码，发现是不可行的，因为变量 i 没有固定到函数里。

而我们当时是使用的是 第 16 ~ 21 行代码，将每个元素节点添加属性，然后再点击时获取这个属性。

```html
<body>
  <button>测试1</button>
  <button>测试2</button>
  <button>测试3</button>
</body>

</html>
<script>
    var btns = document.getElementsByTagName("button");
//  for(var i=0; i<btns.length; i++) {
//      btns[i].onclick = function(){
//          console.log(i);
//      }
//  }

    for (var i = 0; i < btns.length; i++) {
        btns[i].index = i;
        btns[i].onclick = function () {
            console.log(this.index);
        }
    }
</script>
```

这里需要解决的问题就是如何将 i 变量固定到每个函数中？

在 ES6 中将 var 改为 let 修饰符就可以实现，因为 ES6 中新添加了块级作用域，所以每一个循环就会形成一个块级作用域，每一个块级作用域就会存放一个独立的 i 变量。

而在 ES5 我们可以使用闭包来解决。

### 8.2 简介

#### （1）产生闭包的条件

闭包是一种特殊的对象。

它由两部分组成。执行上下文（代号A），以及在该执行上下文中创建的函数（代号B）。当B执行时，如果访问了A中变量对象中的值，那么闭包就会产生。

通俗点的话就是：当一个内部函数引用外部函数的变量时，就产生了闭包。

从上面的的概念可以总结出产生闭包的条件：

+ 函数嵌套；
  * 内部函数使用了外部函数的数据（变量/函数）。

#### （2）闭包的作用

作用：可以使原本要被回收的变量，继续储存在内存中。

下面举一个例子：在一个函数中，将内部函数存放到全局变量中，然后再单独执行。

```js
// 设置一个全局变量
var fn = null;
function foo() {
    var a = 2;
    function innnerFoo() {
        console.log(a);
    }
    fn = innnerFoo; // 将innnerFoo的引用，赋值给全局变量中的fn
}

function bar() {
    fn(); // 此处的保留的innerFoo的引用
}

// 将fn赋值
foo();
// 执行fn
bar(); // 输出 2
```

在上面的例子中，foo()  函数执行完毕之后，按照常理，其执行环境生命周期会结束，所占内存被垃圾收集器释放。但是通过`fn = innerFoo`，函数 innerFoo 的引用被保留了下来，复制给了全局变量 fn。

这个行为，导致了 `foo()` 函数的变量对象，也 **被保留了下来**。于是，函数 fn 在函数 bar 内部执行时，依然可以访问这个被保留下来的变量对象。所以此刻仍然能够访问到变量 a 的值。

### 8.3 使用chrome观察闭包

我们可以使用 chrome 的开发者工具来观察闭包。

第一步：打开 chrome 浏览器，按下 F12。

第二步：在浏览器运行代码。

第三步：在开发者工具的标签栏上选中 “ Sources ”。

![](https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/chrome%E6%9F%A5%E7%9C%8B%E9%97%AD%E5%8C%851.png)

第四步：在代码中设置断点，点击代码左边的代码行数。

![](https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/chrome%E6%9F%A5%E7%9C%8B%E9%97%AD%E5%8C%852.png)

第五步：刷新页面，执行几步，查看最右边信息。可以看到闭包的形成。我们也可以使用开发者工具查看作用域链、执行上下文栈和 this 的值。

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/chrome%E6%9F%A5%E7%9C%8B%E9%97%AD%E5%8C%853.png" style="zoom:80%;" />

### 8.4  闭包的应用

我们可以使用闭包来实现一些应用：

+ 柯里化
+ 模块

下面来细讲一下模块：

#### （1）模块的特点

+ 具有特定功能的 js 文件。

* 将所有的数据和功能都封装在一个函数内部，就像 Java 中的 private。
+ 只向外暴露一个 或者 n 个方法的对象或函数。
+ 模块的使用者，只需要通过模块暴露的对象调用方法来实现对应的功能。

#### （2）特点1

> 具有特定功能的 js 文件。

一般我们定义模块会在一个全新的 js 文件，方便多次使用。

那我们新建一个新的 js 文件，名为 myModule.js ，然后文件里创建一个函数，名为 logMsg。

```js
// myModule.js

function logMsg() {
 
}
```

#### （3）特点2

> 将所有的数据和功能都封装在一个函数内部，就像 Java 中的 private。

我们将所有的数据封装到函数里，外面就访问不到里面的数据。

```js
function logMsg() {
  var msg = "This is a MSG";

  function doSomething() {
    console.log("doSomething() "+msg.toUpperCase);
  }
  
  function doOtherthing() {
    console.log("doOtherthing() "+msg.toLowerCase);
  }
}
```

在外部无法获取和修改 mgs 的值。但我们需要向外部暴露我们需要的函数。

#### （4）特点4

> 只向外暴露一个 或者 n 个方法的对象或函数。

如果我们只需要暴露一个函数，直接返回即可。但如果需要暴露多个函数，则需要将函数封装成对象，再返回出去。

```js
function logMsg() {
  var msg = 'This is a MSG'

  function doSomething() {
    console.log('doSomething() ' + msg.toUpperCase())
  }

  function doOtherthing() {
    console.log('doOtherthing() ' + msg.toLowerCase())
  }

  // 暴露一个函数
  // return doOtherthing;

  // 暴露多个函数
  return {
    doSomething: doSomething,
    doOtherthing: doOtherthing,
  }
}
```

而我们需要这样使用：就像调用外部函数里的内部函数一样调用。`xxx.内部函数名()`

```js
var logMsg = logMsg();

logMsg.doSomething();
```

我们也可以使用另一种方式来暴露内部函数——立即调用函数表达式：

+ 第 1 行最开始的冒号最好加上，因为防止上一行代码因为没写冒号而报错。
+ 第 1 行的函数形参和 第 17 行的函数实参，建议加上，因为防止代码压缩时报错。
+ 第 13 ~ 16 行中，通过往 window 对象添加属性，向外暴露指定的函数。而使用只需要 `window.内部函数名()` 即可调用，不用先声明一个变量，再使用这个变量调用内部函数。

```js
;(function (window) {
  var msg = 'This is a MSG'

  function doSomething() {
    console.log('doSomething() ' + msg.toUpperCase())
  }

  function doOtherthing() {
    console.log('doOtherthing() ' + msg.toLowerCase())
  }

  // 通过window对象来暴露多个函数
  window.myModule = {
    doSomething: doSomething,
    doOtherthing: doOtherthing,
  }
})(window)
```

### 8.5 闭包的缺点

在介绍闭包的缺点之前，先介绍两个概念：内存泄漏和内存溢出。

#### （1）内存泄漏

内存泄漏，并不是内存里的数据跑到了不该到的地方，而是 **因为定义了太多的全局变量，而忘记释放了之后没有用到的全部变量，导致可用内存减少**，就像内存的空间泄漏一样。

而我觉得叫 **内存冗余** 会更好。冗余顾名思义：内存原本只需要定义一两个全局变量，但却定义了多个全局变量；内存里过多的变量占着空间却没什么用，就像古代一些朝代官员冗余一样。

常见的内存泄漏：

+ 意外的全局变量；
+ 没有及时清理的计时器或回调函数；
+ 闭包。

#### （2）内存溢出

内存溢出，顾名思义，就是内存满了，数据要溢出来。

是一种程序运行出现的错误。**当程序运行需要的内存超过了剩余的内存时，就会抛出内存溢出的错误**。

#### （3）闭包的缺点

1. 函数执行完成后，函数内部的局部变量没有释放，占用内存的时间会变长。
2. 容易造成内存泄漏

解决：

1. 尽可能不用闭包。
2. 及时释放闭包。

### 8.6 测试题

这里有三道经典的测试题来测试你对闭包的理解。

#### （1）题目一

题目：定义了一个全局变量 `name` 。然后定义了一个对象 `object`，对象里也有个名字为 `name` 的属性，对象里还有个函数，函数的返回值也是个函数。最后两次调用 `object` 这个函数。

问：弹出的信息是什么？

```js
//代码片段一
var name = "The Window";
var object = {
    name : "My Object",
    getNameFunc : function(){
        return function(){
            return this.name;
        };
    }
};
alert(object.getNameFunc()());
```

---

**答：The Window；在严格模式下报错。**

解析：将单独的一个函数返回出去，因为返回出去的函数没有访问外部函数的变量，所以没有产生闭包。所以 this 是 undefined ，在非严格模式下自动转为 window 对象，而在严格模式下不会自动转为 window 对象。

#### （2）题目二

题目：在上面的基础上，添加了第 5 行，将 this 存到一个变量 that，然后再使用 that 访问属性。

问：弹出的信息是什么？

```js
var name = "The Window";
var object = {
    name: "My Object",
    getNameFunc: function () {
        var that = this;
        return function () {
            return that.name;
        };
    }
};
alert(object.getNameFunc()()); //?
```

---

**答：My Object。**

解析：因为第 6 ~ 8 行中访问了外部函数的变量 that，所以产生了闭包。而第 11 行调用时是使用 obj 来调用，所以 this 的值就为 obj 变量。

#### （3）题目三

题目：定义一个一个函数 fun，然后里面输出第二个参数，返回值是一个对象，对象里有一个同名的属性，其属性值为一个函数，函数的返回值为当前函数再次调用的结果。

问：下面输出什么？

提示：这道题主要考察的是闭包的生命周期。

```js
function fun(n,o) {
    console.log(o)
    return {
        fun:function(m){
            return fun(m,n);
        }
    };
}
var a = fun(0);  a.fun(1);  a.fun(2);  a.fun(3);	//undefined,?,?,?
var b = fun(0).fun(1).fun(2).fun(3);	//undefined,?,?,?
var c = fun(0).fun(1);  c.fun(2);  c.fun(3);	//undefined,?,?,?
```

---

解析：首先先看第 9 行的 `var a = fun(0);  a.fun(1);`：

1. 调用 `fun(0)` ，因为第二个参数省略，所以第 2 行输出 `undefined` 。

2. 返回的是一个对象，产生了闭包，所以变量 a 为 `{ fun: function(m){return fun(m, 0)} }`

3.  `a.fun(1)`：获取到属性名为 `fun` 的属性值，再执行这个属性值，即执行这个函数 `function(1){return fun(1, 0)}`

4. 执行函数中又要继续调用函数 `fun(1, 0)` ，输出的第二个参数所以输出 0，产生了新的闭包，但我们没有用变量接收，所以闭包被回收。

其他的依次类推，继续从第 3 步开始执行，发现我们都是使用 `{ fun: function(m){return fun(m, 0)} }` 这个闭包，而我们输出的是第二参数，第二个参数没有发生改变。

**所以第 9 行的答案是：undefined；0；0；0。**

---

然后看第 10 行，从这个链式结构可以看出，前面的函数的调用会使用到前面的闭包。

1. 变量 `fun(0)` 为 `{ fun: function(m){return fun(m, 0)} }`；

2. `fun(0).fun(1)` ：执行 `function(1){return fun(1, 0)}`；
3. 执行完毕后的返回值为 `fun(1,0)`，即 输出 0，返回一个对象，对象为 `{ fun: function(m){return fun(m, 1)} }`；
4. 再使用这个对象调用 `fun(2)` ，即执行函数 `function(2){return fun(2, 1)}`；
5. 而计算返回值会继续执行 `fun(2,1)` ，会输出 1，再返回一个对象，对象为 `{ fun: function(m){return fun(m, 2)} }`；
6. 依次类推，得出最后输出 2。

**所以第 10 行的答案是：undefined；0；1；2。**

---

第 11 行就是结合上面两个的情况，有链式调用，也有重复调用。

变量 c 所存的闭包是  `{ fun: function(m){return fun(m, 1)} }` ，所以最后两个输出 1

**所以第 11 行的答案是：undefined；0；1；1。**

