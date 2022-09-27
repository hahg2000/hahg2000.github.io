# 原生JS-上

<span style="color:red">下面的笔记均是 ES5 之前的版本。</span>

参考网站：[MDN Web Docs——Javascript教程](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

## 一、 变量作用域

### 1.1 全局变量和局部变量

全局变量声明有两种方法，一是直接在 &lt;script> 标签内直接定义的变量，二是在函数里不带 var 声明的变量。

局部变量 **在函数里声明的变量**，在函数外部无法使用它。

```js
 // 全局变量
// 1.在<script>标签内直接定义的变量
var a = 3;
// 2.在函数里不带 var 声明的变量
function fn() {
    b = 3;
    // 局部变量
    var c = 8;
}
// 执行函数
fn()
```

### 1.2 块级作用域

**JS 无块级作用域**，只有在 ES6 时，JS 才有块级作用域。

块级作用域是在 java 程序中的 `if { }` 和 `for { }` 大括号的区域。

```javascript
if(3<5){
    var num = 10;
}
// 输出 10
console.log(num);
```

### 1.3 作用域链

在 JS 函数里面可以定义新的函数，包含新函数的函数被称为 **外部函数**，新函数被称为 **内部函数**。

内部函数可以访问外部函数和全局变量。

若外部函数和全局变量的变量名一致，则会采取链式查找的方式，即就近原则。

```javascript
var num = 10;
function fn2() {
    var num = 20;
    function fn3() {
        // 输出 20
        console.log(num);
    }
    // 调用内部函数
    fn3();
}
// 调用外部函数
fn2();
```

### 1.4 变量和函数提升

1. JS 引擎在运行 Javascript 会分为两步：**预解析** 和 **代码执行**

   （1）预解析：JS 引擎会把 js 里面所有的 var 还有 function 提升到 **当前作用域的最前面**。

   （2）代码执行：按照代码书写的顺序从上到下执行。

2. 预解析分为 **变量预解析（变量提升）** 和 **函数预解析（函数提升）**

   （1）变量预解析：将所有变量声明提升到当前作用域的最前面，**不进行赋值操作**。

   （1）函数预解析：将所有函数声明提升到当前作用域的最前面，**不进行执行函数**。

踩坑1：函数表达式没有提升，不像函数声明，你在 **定义函数表达式之前不能使用函数表达式**。

```javascript
a();// 报错 a is not a function
var a = function() {
    console.log("123");
}
```

踩坑2：变量连等赋值，**除了第一个为局部变量，其余的为全部变量**。

而集体声明为 var a = xxx，b = ooo , c = jjj ;

```javascript
f1();
console.log(b); // 2
console.log(c); // 2
console.log(a); // 报错 a 未被定义 

function f1() {
    var a = b = c = 2; // var a = 2 ; b = 2 ; c = 2 
    // 集体声明为: var a = 2 , b = 2 , c = 2 ;
    console.log(a); // 2
    console.log(b); // 2
    console.log(c); // 2
}
```

踩坑3：全局变量不使用 var 声明时，**不进行提升**。

```javascript
f1();
function f1() {
    console.log(b); // 报错 b is not defined
    b =  2;
}
```

踩坑4：全局变量实质上是 window 的一个 **属性**，可以使用 window.变量名来修改。

```javascript
var a = 0;
window.a = 1;
console.log(a); // 输出 1
```

踩坑5：不适用 var 声明的全部变量是 **可以删除** 的，而使用 var 变量则不可以。

```javascript
var a = 0;
delete window.a;
console.log(a); // 输出 0

b = 0;
delete window.b;
console.log(b); // 报错 b is not defined
```

而判断一个对象的 属性描述是否可以**被改变** 或者 属性是否可**被删除**，可以按照以下步骤。

1. 使用 `Object.getOwnPropertyDescriptor(obj, prop)` 方法获取到 **属性描述符对象**（property descriptor）。
2. 而属性描述符对象里面有一个属性 **configurable**。【**configurable**】 当且仅当指定对象的属性描述可以 **被改变**或者属性 **可被删除** 时，为true。
3. 当然函数也不能被删除。

```javascript
var a = 1;
// 获取变量 a 的属性描述符对象 
var descriptor1 = Object.getOwnPropertyDescriptor(window, 'a');
// 输出其 configurable 属性
var aConfigurable = descriptor1.configurable;
// false 代表不能删除
console.dir(aConfigurable);

b = 1;
var descriptor2 = Object.getOwnPropertyDescriptor(window, 'b');
var bConfigurable = descriptor2.configurable;
// true 代表可以删除
console.dir(bConfigurable);
```

## 二、对象

### 2.1 对象的属性

在 Javascript 中， 属性由一个字符串类型的 **“ 名字 ”**（name）和一个 **“ 属性描述符 ”**（property descriptor）对象构成。

---

而使用 Object.defineProperty() 方法会直接在一个对象上 **定义一个新属性**，或者 **修改一个对象的现有属性**，并返回此对象。

::: tip 语法

`Object.defineProperty(obj, prop, descriptor)`

:::

+ obj：要定义属性的对象。
+ prop：要定义或修改的属性的名称或 Symbol 。
+ descriptor：要定义或修改的属性描述符。

---

**属性描述符**：

对象里目前存在的属性描述符有两种主要形式：**数据描述符** 和 **存取描述符**。

+ **数据描述符** 是一个具有值的属性，该值可以是可写的，也可以是不可写的。

+ **存取描述符** 是由 getter 函数和 setter 函数所描述的属性。

<span style="color:red">一个描述符只能是这两者其中之一；不能同时是两者。</span>

下面的表格列出了两种属性描述符对象可以拥有的属性。

|            | configurable                          | enumerable                            | value                                 | writable                              | get                                   | set                                   |
| ---------- | ------------------------------------- | ------------------------------------- | ------------------------------------- | ------------------------------------- | ------------------------------------- | ------------------------------------- |
| 数据描述符 | <span style="color:green">可以</span> | <span style="color:green">可以</span> | <span style="color:green">可以</span> | <span style="color:green">可以</span> | <span style="color:red">不可以</span> | <span style="color:red">不可以</span> |
| 存取描述符 | <span style="color:green">可以</span> | <span style="color:green">可以</span> | <span style="color:red">不可以</span> | <span style="color:red">不可以</span> | <span style="color:green">可以</span> | <span style="color:green">可以</span> |

----

这两种描述符都是对象。它们共享以下可选键值：

+ configurable：
  当且仅当该属性的 configurable 键值为 true 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。
  默认为 false。
+ enumerable：
  当且仅当该属性的 enumerable 键值为 true 时，该属性才会出现在对象的枚举属性中。
  默认为 false。
  数据描述符还具有以下可选键值：
+ value：
  该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。
  默认为 undefined。
+ writable
  当且仅当该属性的 writable 键值为 true 时，属性的值，也就是上面的 value，才能被赋值运算符改变。
  默认为 false。

---

存取描述符还具有以下可选键值：

+ get
  属性的 getter 函数，如果没有 getter，则为 undefined。当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 this 对象（由于继承关系，这里的this并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值。
  默认为 undefined。
+ set
  属性的 setter 函数，如果没有 setter，则为 undefined。当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 this 对象。
  默认为 undefined。

---

**描述符默认值汇总：**
拥有布尔值的键 configurable、enumerable 和 writable 的默认值都是 false。
属性值和函数的键 value、get 和 set 字段的默认值为 undefined。

---

下面来详细说明每一个属性：

#### （1）Configurable 属性

`configurable` 特性表示对象的属性是否可以 **被删除**，以及除 `value` 和 `writable` 特性外的其他特性是否可以**被修改**。

### 2.2 对象的创建

对象的创建有三种方式，**对象字面**、**new Object()**、**构建函数**。

#### （1）利用对象字面量创建

注意每一个属性之间使用逗号【,】隔开。saySong 也是个属性，只不过它的值是一个方法。

```javascript
var obj1 = {
    name : '周杰伦',
    age : '18',
    saySong:function() {
        console.log('唱歌');
    }
}
```

调用对象的属性：

1. 若属性的值不是方法则可以采用：`对象名.属性名` 和 `对象名['属性名']`
2. 若属性的值是一个方法则可以采用：`对象名.属性名()`

#### （2）使用 new Object() 创建

就像 Java 那样 new 一个对象出来，然后采用 `对象名.属性名 = 属性值` 方式来创建对象的属性。

```javascript
var obj2 = new Object();
obj2.name = '周杰伦';
obj2.age = 12;
obj2.work = function() {
    console.log('唱稻香');
} 
```

#### （3）使用构建函数

就像 Java 里的类中的构建方法一样，构建方法利用传进来的值来初始化对象。

在利用构建函数创建对象时，也可以 **传递方法** 作为属性的值，就像第（2）点一样。调用方法一致。

```javascript
function Star(name, age, work) {
    this.name = name;
    this.age = age;
    this.work =  work;
}

var star1 = new Star('周杰伦', 12 , function(song) {
    console.log('唱'+song);
})
```

### 2.3 对象的遍历

对象的遍历使用的是 for in 循环，循环里的 key 变量为对象的属性的 key；只有进行取值操作，才能获取到属性的 value。

```javascript
// 定义一个对象
var obj1 = {
    name : '周杰伦',
    age : '18',
    saySong:function() {
        console.log('唱歌');
    }
}
// 对象的遍历输出
for (var key in obj1) {
    console.log(key); //对象的属性的 key
    console.log(obj1[key]); // 对象的属性的 value
}
```

### 2.4 对象的原型

#### （1）引入

首先定义了一个构造函数，并使用其实例化一个对象，再进行输出。

```js
function Star(name, age) {
    this.name = name;
    this.age = age;
    this.work = function (song) {
        console.log('唱'+song);
    };
}
var zjl = new Star('周杰伦', 18)
console.log(zjl);
```

结果如下图，发现有个对象有个 `__proto__` 属性，

![](https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%8E%A7%E5%88%B6%E5%8F%B0%E8%BE%93%E5%87%BA.png)

点开来看，发现其里面有两个子属性，下面对这两个属性进行说明。

![](https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E5%AF%B9%E8%B1%A1%E6%8E%A7%E5%88%B6%E5%8F%B0%E8%BE%93%E5%87%BA%E8%AF%A6%E6%83%85.png)

#### （2）constructor说明

`Object.prototype.constructor` ：返回的创建实例对象的 Object **构造函数**的引用，即创建该对象的构造函数。

#### （3）\_\_proto\_\_ 说明

每一个构造函数都有一个 **原型对象** ，每一个被其构造函数实例化都可以访问 **原型对象** 里的内容。

举例：使用 `函数名.prototype.属性名 = 属性名` 来将属性存入到原型对象里，**对象** 和 **构造函数对象** 访问时直接像调用自己属性一样 `对象名.属性名`。

```js
function Star(name, age) {
    this.name = name;
    this.age = age;
    this.work = function (song) {
        console.log('唱'+song);
    };
}

Star.prototype.sex = '男';

var cyx = new Star('陈奕迅',18);
console.log(cyx.sex);	// 输出'男'
```

这里的 **原型对象** 有点像 Java 里的 **父类**，而众所周知任何的类的父类都是 Object ，所以在第（1）节中的最后一张图中的 **原型对象** 里又有一个 **原型对象**，那就是 Object 对象。

![](https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E5%AF%B9%E8%B1%A1%E6%8E%A7%E5%88%B6%E5%8F%B0%E8%BE%93%E5%87%BA%E8%AF%A6%E6%83%85.png)

#### （4）常见原型的使用方法

#####  函数1：getPrototypeOf

+  `Object.getPrototypeOf(指定对象)`

+ `Object.getPrototypeOf(指定对象)` 方法返回指定对象的 **原型对象**（内部`[[Prototype]]`属性的值）。

```js
function Star(name, age) {
      this.name = name;
      this.age = age;
      this.work = function (song) {
        console.log('唱'+song);
      };
}

var zjl = new Star('周杰伦', 18);
console.log(Object.getPrototypeOf(zjl));  
```

输出结果如下：

![](https://raw.githubusercontent.com/hahg2000/SSMPic/main/getPrototypeOf%E8%BE%93%E5%87%BA.png)

有人会问直接 `Object.__proto__` 不就行了吗？

::: danger

其实该特性已经从 Web 标准中删除，虽然一些浏览器目前仍然支持它，但也许会在未来的某个时间停止支持，请尽量不要使用该特性。

:::

::: warning 

但需要注意的是 `Object.getPrototypeOf(指定对象)` 不是 `指定对象.prototype`

:::

下面来说明一下这两个的区别：

根据上面的例子可知 `Object.getPrototypeOf( 自定义对象 ) ` 是获取 **自定义对象** 的原型对象。

如果里面放的是 **构造函数对象** 的呢？

```js
Object.getPrototypeOf( Object );               // ƒ () { [native code] }
Object.getPrototypeOf( Function );             // ƒ () { [native code] }
Object.getPrototypeOf( Star );             // ƒ () { [native code] }
console.log(Object.getPrototypeOf(Star) === Object.getPrototypeOf(Object));	// true
console.log(Object.getPrototypeOf(Object) ===Object.getPrototypeOf(Function));// true

console.log(Object.getPrototypeOf(Object) === Function.prototype); // true
```

很奇怪，第 4 ~ 5 行，三个不同的构造函数输出的是 **一模一样的函数代码块**。

再看第 7 行，有点难懂。

其实就是 Object 的构造函数也是一个 **被实例化** 的对象，即上面输出的 **函数代码块** `ƒ () { [native code] }`，

而这个函数代码块的 **原型对象** 是 **Function 自己所拥有的原型对象**  。具体的下图所示。

总的来说，就是 `Object.getPrototypeOf(实例化的对象)` 与 `构造函数对象.prototype` 的区别

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/getPrototypeof%E5%9B%BE%E8%A7%A3.png" style="zoom: 67%;" />

---

##### 函数2：call

+  `Function.prototype.call()`

`call()`  方法使用一个指定的  `this`  值和单独给出的一个或多个参数来 **调用一个函数**。

::: tip 语法

 `function.call(thisArg, arg1, arg2, ...)`

:::

**参数：**

- `thisArg`

  可选的。在  `function` 函数运行时使用的 `this` 值。请注意，`this`可能不是该方法看到的实际值：如果这个函数处于 [非严格模式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode) 下，则指定为 `null` 或 `undefined` 时会自动替换为指向全局对象，原始值会被包装。

- `arg1, arg2, ...`

  指定的参数列表。

**描述：**`call()` 提供新的 **this** 值给当前调用的函数/方法。你可以使用 `call()` 来实现继承：写一个方法，然后让另外一个新的对象来继承它（而不是在新对象中再写一次这个方法）。

**示例 2.1** ：使用 call 方法调用父构造函数

在一个 **子构造函数** 中，你可以通过调用 **父构造函数** 的 `call` 方法来 **实现继承**，类似于 `Java` 中的写法。

下例中，使用 `Food` 和 `Toy ` 构造函数创建的 **实例** 都会拥有 `Product` 构造函数里的 `name` 属性和 `price` 属性,但 `category` 属性是在各自的构造函数中定义的。

换个角度来看，其实就是使用不同的 `this` 来调用相同的函数。

```js
// 父构造函数
function Product(name, price) {
    this.name = name;
    this.price = price;
}

// 子构造函数
function Food(name, price) {
    Product.call(this, name, price);
    this.category = 'food';
}

// 子构造函数
function Toy(name, price) {
    Product.call(this, name, price);
    this.category = 'toy';
}

// 创建对象
var cheese = new Food('feta', 5);
var fun = new Toy('robot', 40);

// 输出对象
console.log(cheese);
console.log(fun);
```

输出结果如下：

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/call%E5%87%BD%E6%95%B0%E8%BE%93%E5%87%BA.png" style="zoom:90%;" />

**示例2.2：** 使用 call 方法调用匿名函数
在下例中的 for 循环体内，我们创建了一个匿名函数，然后通过调用该函数的 call 方法，将 **每个数组元素** 作为指定的 this 值执行了那个匿名函数。

这个匿名函数的主要目的是 <u>给每个数组元素对象添加一个 print 方法</u>，这个 print 方法可以打印出各元素在数组中的正确索引号。

当然，这里不是必须得让数组元素作为 this 值传入那个匿名函数（普通参数就可以），目的是为了演示 call 的用法。

```js
 var animals = [
     { species: 'Lion', name: 'King' },
     { species: 'Whale', name: 'Fail' },
     { species: 'Person', name: 'Tom'}
 ];

for (var i = 0; i < animals.length; i++) {
    // 匿名函数，这里的形参 i 是call方法的第二个参数，即循环的体里递增的 i
    (function (i) {
        // 这里的 this 为数据里的每一个对象
        this.print = function () {
            console.log('#' + i + ' ' + this.species
                        + ': ' + this.name);
        }
        // 调用定义好的函数
        this.print();
    }).call(animals[i], i);
}
```

**示例2.3** ：在下面的例子中，我们调用了 `display` 方法，但并没有传递它的第一个参数。如果没有传递第一个参数，`this` 的值将会被绑定为 **全局对象**。

```js
// 全局对象
var sData = 'Hello World';

function display() {
    // 调用了全局对象
    console.log('sData value is %s ', this.sData);
}

// 不传递第一个参数调用 display 方法
display.call();  // 输出结果为 sData value is Hello World
```

---

##### 函数3：apply

`Function.prototype.apply()`

说了 call 函数，那必定需要说一下与 call 函数相近的 apply 函数。

`apply()` 方法调用一个具有给定 `this` 值的函数，以及以一个数组（或[类数组对象]）的形式提供的参数。

**注意：** call() 方法的作用和 apply() 方法类似，区别就是`call()`方法接受的是 **参数列表**，而`apply()`方法接受的是 **一个参数数组**。

::: tip 语法

`func.apply(thisArg, [argsArray])`

:::

**参数：**

+ `thisArg`
  **必选的。**在 func 函数运行时使用的 this 值。请注意，this可能不是该方法看到的实际值：如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动替换为指向全局对象，原始值会被包装。与 call() 方法一致。
+ `argsArray`
  **可选的**。**一个数组或者类数组对象**，其中的数组元素将作为单独的参数传给 func 函数。如果该参数的值为 null 或  undefined，则表示不需要传入任何参数。从 ECMAScript 5 开始可以使用类数组对象。

**示例3.1：** 用 apply 将数组各项添加到另一个数组

我们可以使用 push 方法将元素追加到数组中。由于push接受可变数量的参数，所以也可以一次追加多个元素。

但是，如果 push 的参数是 **数组**，它会将该数组作为单个元素添加，<u>而不是将这个数组内的每个元素添加进去</u>，因此我们最终会得到 **一个数组内的数组**。

如果不想这样呢？concat 符合我们的需求，但<u>它并不是将元素添加到现有数组，而是创建并返回一个新数组</u>。

然而我们需要将元素追加到现有数组......那么怎么做好？难道要写一个循环吗？`apply` 正派上用场！

```js
var array = ['a', 'b'];
var elements = [0, 1, 2];
array.push.apply(array, elements);
console.info(array); // ["a", "b", 0, 1, 2]
```

**示例3.2：** 使用 `apply` 和内置函数

对于一些需要写循环以便历数组各项的需求，我们可以用 `apply` 完成以 **避免循环**。

下面是示例，我们将用 `Math.max` / `Math.min` 求得数组中的最大/小值。

```js
// 找出数组中最大/小的数字 
var numbers = [5, 6, 2, 3, 7, 14, -4];

// 使用Math.min/Math.max以及apply 函数时的代码 
var max = Math.max.apply(null, numbers); /* 基本等同于 Math.max(numbers[0], ...) 或 Math.max(5, 6, ..) */
var min = Math.min.apply(null, numbers);

console.log('maxNumber = '+ max); // 14
console.log('minNumber = '+ min); // -4
```

::: warning

注意：如果按上面方式调用`apply`，有超出JavaScript引擎参数长度上限的风险。

:::

如果你的参数数组可能非常大，那么推荐使用下面这种混合策略：将数组切块后循环传入目标方法：

```js
function minOfArray(arr) {
    // 将最小值初始化为无穷大
    var min = Infinity;
    // 设置每块数组的长度为 32768
    var QUANTUM = 32768;

    for (var i = 0, len = arr.length; i < len; i += QUANTUM) {
        // Math.min(i + QUANTUM, len) 防止数组越界，取遍历的数和数组长度的最小值
        // arr.slice 将数组分块，返回分块后的新数组
        // 使用 Math.min 取分块后数组的最小值
        var submin = Math.min.apply(null, arr.slice(i, Math.min(i + QUANTUM, len)));

        // 将当前分块数组的最小值与全局的最小值比较
        min = Math.min(submin, min);
    }
    return min;
}
```

---

##### 函数4：bind

 `Function.prototype.bind()`

`bind()`  方法 **创建一个新的函数**，在  `bind()`  被调用时，这个新函数的  `this`  被指定为  `bind()`  的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

::: tip 语法

`function.bind(thisArg[, arg1[, arg2[, ...]]])`

:::

**参数：**

+  `thisArg`

  调用绑定函数时作为 `this` 参数传递给目标函数的值。 

  如果使用 `new` 运算符构造绑定函数，则忽略该值。

  当使用 `bind` 在 `setTimeout` 中创建一个函数（作为回调提供）时，作为 `thisArg` 传递的任何原始值都将转换为 `object` 。

  如果 `bind` 函数的参数列表为空，或者 `thisArg` 是 `null` 或 `undefined` ，执行作用域的 `this` 将被视为新函数的 `thisArg`。

+  `arg1, arg2, ...`

  当目标函数被调用时，被预置入绑定函数的参数列表中的参数。

**示例4.1：** 创建绑定函数

`bind()` 最简单的用法是创建一个函数，不论怎么调用，这个函数都有同样的 `this` 值。

JavaScript 新手经常犯的一个错误是 <u>将一个方法从对象中拿出来</u>，然后再调用，期望方法中的 `this` 是原来的对象（比如在回调中传入这个方法）。

<span style="color:red">如果不做特殊处理的话，一般会丢失原来的对象。</span>基于这个函数，用原始的对象创建一个绑定函数，巧妙地解决了这个问题：

```js
this.x = 9;    // 在浏览器中，this 指向全局的 "window" 对象
var module = {
    x: 81,
    // 这里的 this 指向 module 对象
    getX: function () { return this.x; }
};

module.getX(); // 81

// 单独将方法从对象中拿出来
var retrieveX = module.getX;

// 执行方法
// 返回 9 - 因为函数是在全局作用域中调用的
retrieveX();

// 创建一个新函数，把 'this' 绑定到 module 对象
// 新手可能会将全局变量 x 与 module 的属性 x 混淆
var boundGetX = retrieveX.bind(module);
boundGetX(); // 81
```

**示例4.2：** 偏函数

`bind()` 的另一个最简单的用法是使一个函数 **拥有预设的初始参数**。

只要将这些参数作为 `bind()` 的参数写在 `this` 后面。当绑定函数被调用时，**这些参数会从开始被插入到绑定函数的参数里**，即绑定函数的第一个和之后的参数都会被 `bind()` 中的参数所代替。

```js
 // 这里需要两个参数
function addArguments(arg1, arg2) {
    return arg1 + arg2
}

// 创建一个函数，它拥有预设的第一个参数
var addThirtySeven = addArguments.bind(null, 37);

// 37(预设的) + 5 = 42
var result2 = addThirtySeven(5);

// 37(预设的)  + 5 = 42 ，第二个参数被忽略
var result3 = addThirtySeven(5, 10);
```

---

##### 函数5：create

+ [Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)

`Object.create()` 方法创建一个新对象，使用现有的对象来提供新创建的对象的 \_\_proto\_\_。 

#### （5）判断对象中是否有某个属性

若要判断对象中是否有某个属性，可以使用 `'属性名' in 对象`  来判断，但这个 **会去原型链上寻找属性是否存在**。

若不想在其在原型链寻找，则需要使用 `对象.hasOwnProperty('属性名')`  方法。

其完整的方法名： `Object.prototype.hasOwnProperty()`

```js
function Star(name, age) {
    this.name = name;
    this.age = age;
    this.work = function (song) {
        console.log('唱'+song);
    };
}

// 在原型上定义了一个性别属性
Star.prototype.sex = '男';

// 新建了一个对象
var zjl = new Star('周杰伦', 18);

// 判断 sex 属性是否在原型链上
// true 
console.log('sex' in zjl);

// 判断 sex 属性是否在对象上 
// false
console.log(zjl.hasOwnProperty('sex'));
```

### 2.5 内置对象

#### （1）Date 对象

+ `var d1 = new Date();`
  使用 **无参** 构造函数创建，会返回当前时间。
+ `var d2 = new Date("7/14/2021 11:20:00");`
  使用 **时间字符串** 创建，会将字符串封装成 Date 对象。时间字符串的默认格式为：月份/日/年 时/分/秒。
+ `var d3 = new Date(1626234778638); `
  使用 **时间戳** 创建，该时间戳代表了 自1970年1月1日00:00:00 UTC（the Unix epoch）以来的毫秒数，忽略了闰秒。

Date 对象常见的一些方法举例：

+ `Date对象.getTime()` ：获取到 Date 对象的时间戳。
+ `Date.now()` ：获取到当前时间的时间戳。
  相当于 `var d4 = new Date();var d4Time = d4.getTime();`
  可以使用该方法计时程序的运行时间。
+ 也可以使用 `console.time("计时器名字")` 与 `console.timeEnd("计时器名字")` 来计时运行时间。

Date 对象的方法列表：

| 方法            | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| `getDate()`     | 从 Date 对象返回一个月中的某日份 [1 ~ 31]                    |
| `getDay()`      | 从 Date 对象返回一周中的某星期 <span style="color:red;">[0(周日) ~ 6(周六)]</span> |
| `getMonth()`    | 从 Date 对象返回月份 <span style="color:red;">[0(一月) ~ 11(十二月)]</span> |
| `getFullYear()` | 从 Date 对象以 <span style="color:red;">四位数字</span> 返回年份。 |
| `getHours()`    | 返回 Date 对象的小时 (0 ~ 23)。                              |
| `getMinutes()`  | 返回 Date 对象的分钟 (0 ~ 59)。                              |
| `getSeconds()`  | 返回 Date 对象的秒数 (0 ~ 59)。                              |

#### （2）Math 对象

Math 对象的方法需要用的话可以直接网上寻找即可，点击下列链接即可。

[JavaScript Math 参考手册 (w3school.com.cn)](https://www.w3school.com.cn/jsref/jsref_obj_math.asp)

这里介绍一下随机数的用法。

`Math.random()` 函数返回一个浮点数,  伪随机数在范围为 [ 0 , 1 ) 。

+ 得到两个数 [ x ,  y )  的随机整数
  这个例子返回了一个在指定值之间的 **随机整数**。这个值不小于 `min` ，且小于`max`。

```javascript
// Math.random * (max-min) 获取到[0,max-min) 
// Math.floor 取整

// Math.floor(Math.random() * (max-min)) + min; 
// =>  [0,max-min) + min  =>  [min,max) 

Math.floor(Math.random() * (max-min)) + min;
```

### 2.6 包装类

在 JavaScript 中有几个基本数据类型：String、Number、Boolean、Null、Undefined，一个引用数据类型：Object。

JavaScript 提供了三个包装类：String() 、Number() 、Boolean() ，其可以**将基本数据类型转换成对象**。

而对象中可以有方法，但基本数据类型没有方法，但依然可以通过 `变量名.方法名` 调用指定方法。

```js
var a1 = 123;
var a2 = new Number(123);

// number
console.log(typeof a1);
// object
console.log(typeof a2);

// 均输出 123 无报错
console.log(a1.toString());
console.log(a2.toString());
```

原理：其实在基本类型在调用方法时，浏览器会 **临时** 地使用包装类将其 **转换为对象**，然后再调用对象的方法。

## 三、数组

### 3.1 数组的类型

使用 `typeof 数组对象` 来判断数组的类型。数组本质上是 Object 对象。

```js
// 使用构造函数创建数组
var arr1 = new Array();
// 使用字面量创建数组
arr2 = [1, 2];

// 输出 Object
console.log(typeof arr1);
// 输出 Object
console.log(typeof arr2);
```

### 3.2 数组的创建

数组的创建有两个方式：**字面量** 和 **构造函数**。<span style="color:red">数组里可以是任意值。</span>

+ **字面量** 创建使用 `[]` ，里面逗号分隔。

```js
// 里面也可以是函数和数组
var arr1 = [1, '文字', null, undefined,
            false, function(){}, [1, 2, 3]];
console.log(arr1);
```

输出结果：

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%95%B0%E7%BB%84%E5%AD%97%E9%9D%A2%E9%87%8F%E8%BE%93%E5%87%BA.png" style="zoom:80%;" />

+ **构造函数** 创建有两种方式：
  + 输入一个参数时，该参数会被当成数组的长度。
  + 输入多个参数时，这组参数会被当成数组的元素。

```js
// 输入一个参数
var arr2 = new Array(3);

//输出 undefined undefined undefined
console.log(arr2);

// 输入多个参数
var arr3 = new Array(3, 4, 5);
//输出 3 4 5
console.log(arr3);
```

### 3.3 数组的访问

若访问到数组的长度之外，不会报错只会返回 `undefined` 。

```js
// 使用字面量创建数组
var arr2 = [1, 2];
// 输出undefined
console.log(arr2[3]);
```

### 3.4 数组的长度

对于非连续的数组，数组的长度是 **最后一个元素的索引加一**。而中间没有填写元素的位置用 `undefined` 填充。

```js
 // 使用构造函数创建数组
var arr1 = new Array();
arr1[0] = 0;
arr1[1] = 1;
// 插入入不连续元素
arr1[5] = 5;

//输出 0 1 undefined undefined undefined 5
console.dir(arr1);
```

而 `Array.length ` 可以修改。 <span style="background-color: black;" id="heimu" title="你知道的太多了"> 其他语言退出了群聊</span> <style>#heimu:hover {color: white;} </style>

可以进行数组扩充和 **数组截断**。

```js
  // 使用构造函数创建数组
var arr1 = new Array();

arr1[0] = 0;
arr1[1] = 1;
arr1[2] = 2;

// 数组扩充
arr1.length = 5;
// 0 1 2 undefined undefined 
console.log(arr1);

// 数组截断
arr1.length = 1;
// 0
console.log(arr1);
```

### 3.5 数组的参数

在调用了函数时，浏览器每次都会传递两个隐含的参数：

1. 函数的上下文对象 `this` ； 
2. 封装实参的 **类数组对象** 。

上下文对象 `this` 会有几种不同的情况的取值：

+ 以 **函数形式** 调用时，`this` 是 `window` 对象；
+ 以 方法形式 调用时，`this` 是 **调用方法的对象**；
+ 以 **构造函数** 调用时， `this` 是 **新建的那个对象**；
+ 使用 call 和 apply 方法调用时，`this` 是参数中 **传递的那个对象**。

类数组对象 只有 `对象名.length` 的数组方法可以使用，其他的数组方法均不可使用。我们可以使用 `类数组对象[索引]` 来获取到对象里的值，就像访问数组一样。

### 3.6 数组的遍历

除了使用普通的 for 循环之外，可以使用另一个方法。

+ Array.prototype.forEach()

`forEach()`  方法对数组的每个元素执行一次给定的函数。该函数为回调函数。

::: tip 语法

`arr.forEach(callback( currentValue [, index [, array]]) [, thisArg])`

:::

**参数：**

+ callback
  为数组中每个元素执行的 **函数**，该函数接收 **一至三** 个参数：
  + currentValue
    数组中的每一个元素。
  + index 可选
    当前元素的索引。
  + array 可选
    forEach() 方法正在操作的数组，即 arr。
+ thisArg 可选
  可选参数。当执行回调函数 callback 时，用作 this 的值。

**示例：**

::: tip

`	console.table()` 可以以表格形式输出数组。

:::

```javascript
// 定义了一个数组
var arr1 = [1, '文字', null, undefined,
            false, function(){}, [1, 2, 3]];
// 使用 foreach 遍历数组
arr1.forEach(function(currebtValue, index, array) {
    console.log("数组中索引为 "+index+" 的元素是 "+currebtValue);
})

// 定义了一个只有一个元素的数组
var arr2 = [1];
arr2.forEach(function(currebtValue, index, array) {
    // console.table 使用表格输出数组
    console.table(arr1);
})
```

输出结果如下：

 <img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/foreach%E8%BE%93%E5%87%BA.png" style="zoom:80%;" />

### 3.6 数组的其他方法

| 方法        | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| `concat()`  | 连接两个或更多的数组，并返回结果。                           |
| `join()`    | 把数组的所有元素放入一个字符串。元素通过指定的分隔符进行分隔。 |
| `pop()`     | 删除并返回数组的最后一个元素                                 |
| `shift()`   | 删除并返回数组的第一个元素                                   |
| `push()`    | 向数组的末尾添加一个或更多元素，并返回新的长度。             |
| `unshift()` | 向数组的开头添加一个或更多元素，并返回新的长度。             |
| `reverse()` | 颠倒数组中元素的顺序。                                       |
| `sort()`    | 对数组的元素进行排序                                         |
| `slice()`   | 从某个已有的数组返回选定的元素                               |
| `splice()`  | 删除元素，并向数组添加新元素。                               |

