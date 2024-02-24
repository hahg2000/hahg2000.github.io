# ES6-上

## 一、let

ES6 新增了 `let` 命令，用来声明变量。

### 1.1 let作用域

#### （1）声明变量

+ 它的用法类似于`var`，但是所声明的变量，只在`let` 命令 **所在的代码块内有效**。

---

下面为例子：

下面的代码中使用 `let` 声明的变量 a ，在第 6 行就无法输出，而使用 `var` 声明的变量 b 就可以在 第 7 行输出。

```js
{
  let a = 10;
  var b = 1;
}

a // ReferenceError: a is not defined.
b // 1
```

`for`循环的计数器，就很合适使用`let`命令，可以防止变量污染或者变量冗余。

```js
for (let i = 0; i < 10; i++) {
  // ...
}

console.log(i);
// ReferenceError: i is not defined
```

#### （2）块作用域

一句话：`let` 声明的变量有块级作用域。

---

+ 经典问题：原生 Javascript 使用循环中为每一个按钮绑定事件，里面用到的 `i` 变量不是正确的值。
+ 用 `let` 可以解决：每一次添加事件回调函数时，函数里面的作用域里面就会就添加 `i` 变量，就像闭包一样。

下面举一个例子：

定义了一个数组名字为 a，然后在循环往 a 里面添加函数。函数里使用了 `let` 声明的变量。

```js
// 这里使用var
var a = [];
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 10

// 这里使用let
var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 6
```

#### （3）父作用域

`let` 在 `for`循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。

```js
for (let i = 0; i < 3; i++) {
    let i = 'abc';
    console.log(i);
} 
// 不会报错
// abc
// abc
// abc
```

### 1.2  不存在变量提升

一句话：`let` 不像 `var` 一样会变量提升。

---

+ 第 3 行的会提升；而第 7 行的不会提升。

```js
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错ReferenceError
let bar = 2;
```

### 1.3 暂时性死区

一句话：`let` 锁住了该区域，不让其获取全局变量。

---

ES6 明确规定，如果区块中存在 let 和 const 命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。**凡是在声明之前就使用这些变量，就会报错**。

总之，在代码块内，使用 let 命令声明变量之前，该变量都是不可用的。这在语法上，称为 “ 暂时性死区 ”（temporal dead zone，简称 TDZ）。

```js
// 全局声明了一个变量
var tmp = 123;

if (true) {
  // 赋值操作
  tmp = 'abc'; // ReferenceError
  // 重复声明
  let tmp;	// 在这行代码下面才可以使用tmp变量
}
```

这个特性影响到了 `typeof` ，这个 **不再是一个百分之百安全的操作**。

```js
typeof x; // ReferenceError
let x;

typeof undeclared_variable // typeof 未声明变量 => "undefined"
```

### 1.4 不允许重复声明

一句话：不要手抖声明同一个变量。

---

`let` 不允许在相同作用域内，重复声明同一个变量，无论之前变量是用 `let` 还是 `var ` 声明。

```js
// 报错
function func() {
  // 第一次用var声明
  let a = 10;
  var a = 1;
}

// 报错
function func() {
  // 第一次用let声明 
  let a = 10;
  let a = 1;
}
```

函数内也是如此，不能重复声明形参。

```js
function func(arg) {
  let arg;
}
func() // 报错
```

## 二、块级作用域

### 2.1 为什么需要块级作用域？

ES5 只有全局作用域和函数作用域，没有块级作用域，这带来很多不合理的场景。

#### （1）内层变量可能会覆盖外层变量

第 7 ~ 10 行：if 语句块中用 `var` 声明的变量，因没有块级作用域所以 **进行变量提升**，提升到了方法的最前端，**导致 tmp 变为了函数作用域里的变量**。

```js
// 声明全局变量
var tmp = new Date();

function f() {
    console.log(tmp);

    if (false) {
        // 该语句会进行变量提升
        var tmp = 'hello world';
    }
}

f(); // undefined
```

#### （2）内存泄漏？

用来计数的循环变量泄露为全局变量。

+ i 变量只是用来计数，但 `var` 没有块级作用域，所以第 3 行声明的语句其实是在声明全局变量。

```js
var s = 'hello';

for (var i = 0; i < s.length; i++) {
  console.log(s[i]);
}

console.log(i); // 5
```

### 2.2 ES6 的块级作用域

`let` 实际上为 JavaScript 新增了块级作用域。

例如上面的 2.1 第一个例子，使用 `let` 声明后就不会报错。

```js
// 声明全局变量
let tmp = new Date();

function f() {
    console.log(tmp);

    if (false) {
        // 该语句会进行变量提升
        let tmp = 'hello world';
    }
}

f(); // 成功输出当前时间
```

+ ES6 允许块级作用域的任意嵌套。（禁止 禁止套娃）

```js
{{{{
  let insane = 'Hello World';
  { let insane = 'Hello World' }
}}}};
// 不报错
```

+ 块级作用域的出现，实际上使得获得广泛应用的匿名立即执行函数表达式不再必要了。

```js
// IIFE 写法
( function () {
    var tmp = ...;
    ...
}());

// 块级作用域写法
{
    let tmp = ...;
    ...
}
```

## 三、 const 关键词

### 3.1 基本用法

+ `const` 声明一个只读的常量。一旦声明，**常量的值就不能改变**。

```js
const PI = 3.1415;
PI // 3.1415

// 不能改变其值
PI = 3; // Uncaught TypeError: Assignment to constant variable.
```

+ `const` 声明的变量不得改变值，这意味着，`const` **一旦声明变量，就必须立即初始化**，不能留到以后赋值。不然就声明了一个无意义的变量。

```js
const foo;
// SyntaxError: Missing initializer in const declaration
```

+ `const` 关键词与 `let` 一样，有块级作用域、存在暂时性死区和不允许重复声明。

### 3.2 本质

`const` 对于基本类型来说，保存的是其值，所以可以看成是常量。

而对于复合类型来说，保存的是指向该数据的 **地址**，所以你因此可以修改地址里的数据，不能真正看成一个常量。因此，将一个对象声明为常量必须非常小心。

```js
const foo = {};

// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123

// 将 foo 指向另一个对象，就会报错
foo = {}; // Uncaught TypeError: Assignment to constant variable.
```

如果真的想将对象冻结，应该使用 `Object.freeze` 方法。

```js
const foo = Object.freeze({});

// 常规模式时，下面一行不起作用；
// 严格模式时，该行会报错 Uncaught TypeError: Cannot add property prop, object is not extensible
foo.prop = 123;
```

但只是该对象不能增加或者删除元素，如果对象里的元素是复合类型，**依然可以修改元素里的数据**。所以元素也需要冻结。

```js
var constantize = (obj) => {
	// 冻结本身对象
    Object.freeze(obj);
    
    // 遍历对象里的所有元素
    Object.keys(obj).forEach( (key, i) => {
        // 如果元素为对象，则递归调用本方法冻结
        if ( typeof obj[key] === 'object' ) {
            constantize( obj[key] );
        }
    });
};
```

## 四、顶层对象的属性

顶层对象，在浏览器环境指的是 `window` 对象，在 Node 指的是 `global` 对象。

ES5 之中，顶层对象的属性与全局变量是等价的，<u>你声明了一个全局对象，就等于在顶层对象添加一个属性</u>。

```js
window.a = 1;
a // 1

a = 2;
window.a // 2
```

但顶层对象的属性与全局变量挂钩，被认为是 JavaScript 语言最大的设计败笔之一。所以尽量少用 `var` 声明变量，而具体表现在下面：

> + 首先是没法在编译时就报出当前变量未声明却使用了的错误，只有运行时才能知道。（调试噩梦）
>   + 因为你可以随时使用 `window.xxx = yyy` 来添加全局变量，而编译器不会去 window 对象查找是否有这个变量。
> + 其次，程序员很容易不知不觉地就创建了全局变量（比如打字出错），`studnet = xxx` 之类的。
> + 最后，顶层对象的属性是到处可以读写的，这非常不利于模块化编程，不同模块之间会污染变量。

现在 ES6 改变了这现象。

+ 方面规定，为了保持兼容性，`var` 命令和 `function` 命令声明的全局变量，依旧是顶层对象的属性；

+ 另一方面规定，`let `命令、`const `命令、`class` 命令声明的全局变量，**不属于顶层对象的属性**。

## 五、globalThis 对象

JavaScript 语言存在一个顶层对象，它提供全局环境（即全局作用域），**所有代码都是在这个环境中运行**。但是，**顶层对象在各种实现里面是不统一的**。

- 浏览器的顶层对象： `window`，`self`。
- Web Worker 的顶层对象：`self`。
- Node 的顶层对象是 `global`。

然而 ES2020（ES11） 在语言标准的层面，引入 globalThis 作为顶层对象。也就是说，任何环境下，globalThis 都是存在的，都可以从它拿到顶层对象，指向全局环境下的this。

## 六、变量的解构赋值

### 6.1 基本用法

+ ES6 允许按照一定模式，从 **数组** 和 **对象** 中提取值，对变量进行赋值，这被称为解构（Destructuring）。

以前，为变量赋值，只能直接指定值。

```js
let a = 1;
let b = 2;
let c = 3;
```

ES6 允许写成下面这样，一行语句就搞定。

```js
let [a, b, c] = [1, 2, 3];

a // 1
b // 2
c // 3
```

本质上，这种写法属于 “ 模式匹配 ” ，只要等号两边的模式相同，左边的变量就会被赋予对应的值。将数据换成变量就可以。

下面是一些使用嵌套数组进行解构的例子。

```js
// 1. 变量和数值一一对应
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz // 3

// 2. 扩展运算符
let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]
```

如果左边和右边的数量不一致，就会导致不完全解构。

+ 左边数量大于右边，没有对应到的变量的值就等于 `undefined`。

```js
let [bar, foo] = [1];

bar // 1
foo // undefined
```

+ 左边的数量小于右边，并不会发生什么事情，属于不完全解构，但是可以成功。

```js
let [x, y] = [1, 2, 3];
x // 1
y // 2

let [a, [b], d] = [1, [2, 3], 4];
a // 1
b // 2
d // 4
```

+ 如果等号的右边不是数组（或者严格地说，不是可遍历的结构），那么将会报错。

```js
let [foo] = 1;

// 报错 Uncaught TypeError: 1 is not iterable
```

### 6.2 默认值

+ 使用默认值的情况：ES6 内部使用严格相等运算符（===），判断一个位置是否有值，如果没有值才会使用默认值。

```js
// 1. 没有数据对应也代表 undefined
let [foo = true] = [];
foo // true

// 2. 使用了默认值的变量，不会影响其他变量
let [x, y = 'b'] = ['a']; // x='a', y='b'

// 3. 直接写 undefined 也可以
let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'

// 4. null 并不严格相等 undefined
let [x = 1] = [null];
x // null
```

+ 如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到的时候，才会求值。**就等于声明了一个函数表达式一样**，声明函数表达式不会去执行函数。

```js
function f() {
    console.log('aaa');
}

let [x = f()] = [1];

// 等价于下面的代码
let x;
if ([1][0] === undefined) {
    // 一个函数表达式
    x = f();
} else {
    x = [1][0];
}
```

+ 默认值可以引用解构赋值的其他变量，但该变量必须已经声明。
  + 执行顺序是从左往右依次赋值

```js
let [x = 1, y = x] = [];    
// x=1; y=1
// x使用默认值，则x为1；y使用默认值，y的默认值为x，所以y=1

let [x = 1, y = x] = [2];    
// x=2; y=2
// x不使用默认值，则x为1；y使用默认值，y的默认值为x，所以y=2

let [x = 1, y = x] = [1, 2]; 
// x=1; y=2
// x不使用默认值，则x为1；y的默认值为x，但不使用默认值，所以y=2

let [x = y, y = 1] = [];     
// ReferenceError: y is not defined
// x使用默认值，x的默认值为y，y没有定义所以报错

let [x = y, y = 1] = [2];  
// x=2; y=1
// x不使用默认值，所以x=y不会执行，则不会报错，但肯定不推荐这样写
```

## 七、对象的解构赋值

### 7.1 普通用法

解构不仅可以用于数组，还可以用于对象。

```js
let { foo, bar } = { foo: 'aaa', bar: 'bbb' };
foo // "aaa"
bar // "bbb"
```

其实上面的完整写法为：

```js
let { foo: foo, bar: bar } = { foo: 'aaa', bar: 'bbb' };
```

在 ES6 中若对象名和对象值是同一名字，则可以缩写。（详情看《对象的扩展》）所以本质上是对象的解构有下面几步：

+ 左边和右边 **都是一个对象**。

+ 在左边查找 **所有** 属性名一致的变量。
+ 然后再在右边查找与左边一样的属性名。
+ 最后将右边的值赋值给左边的变量。
+ 多（左）对一（右）的关系

---

使用对象缩写通常会这么用。

+ 第 2 行：
  + 因为 Math 本身也是个对象，所以可以进行解构。
  + 对象里面有很多方法，而方法也可以用 `方法名: function(){}` 来表示，所以左边为方法名就可以将对象里的方法提取出来。
  + 可以起到简写方法名的作用
+ 第 11 行和第 14 行：使用了提取出来的变量。

```js
// 例一
let { log, sin, cos } = Math;
// 等价于 
// let { log: log, sin: sin, cos: cos } 
// = { 
// log: function log() {}, 
// sin: function sin() {}, 
// cos: function cos() {} 
// }

sin(3.14159) // sin(PI)=0 
// 0.00000265358979335273

log(1) // log(e)1 = 0 当x=1时，任何对数等于0
// 0
```

+ **对象解构依然会失败**，失败赋值的变量的值等于 `undefined`。

```js
let {foo} = {bar: 'baz'};
foo // undefined
```

### 7.2 嵌套用法

+ 与数组一样，解构也可以用于 **嵌套结构** 的对象。

```js
let obj = {
    p: [
        'Hello',
        { y: 'World' }
    ]
};

let { p: [x, { y }] } = obj;
x // "Hello"
y // "World"
```

注意，这时 `p` 是属性名，也称为【模式】，不是变量，**因此不会被赋值**。如果 `p` 也要作为变量赋值，可以写成下面这样。其实就是多定义一个变量名为 p 的变量。

```js
let obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]
};

let { p, p: [x, { y }] } = obj;
// 等价于 let { p: p, p: [x, { y }] } = obj;

x // "Hello"
y // "World"
p // ["Hello", {y: "World"}]
```

+ 更复杂的情况：如果进行变量赋值的时候，两边依然是对象，就会进一步触发对象解构。（一般也不会这样写，可读性太差）

```js
const node = {
  loc: {
    start: {
      line: 1,
      column: 5
    }
  }
};

let { loc, loc: { start }, loc: { start: { line }} } = node;

line // 1
loc  // Object {start: Object}
start // Object {line: 1, column: 5}

// 第一个变量赋值：
// loc = { start: {line: 1,column: 5} }

// 第二个变量赋值：
// { start } = { start: {line: 1,column: 5} }
// 这时触发第二次对象解构得：start = { line: 1,column: 5 }

// 第三个变量赋值：
// { start: { line } } = { start: {line: 1,column: 5} }
// 这时触发第二次对象解构得： { line } = { line: 1,column: 5 }
// 这时触发第三次对象解构得： line = 1
```

+ 对于左边没有赋值成功的变量，如果再进行解构则会报错。

```js
let { foo: {bar} } = { baz: 'baz' }; // 报错

// foo 没有解构成功，所以 {bar} 变量赋值失败，其值为 undefined
// 由于左边是对象，所以会继续解构，取到了 bar 变量，
// 但右边是 undefined，取其里面的值就会报错
```

### 7.3 读取到原型链

对象解构的右边会读取到其原型链上的值。毕竟在原型链上的值，对象可以通过 `对象.变量名` 来获取到。

```js
const obj1 = {};
const obj2 = { foo: 'bar' };

// 将obj2设置为obj1的原型
Object.setPrototypeOf(obj1, obj2);

const { foo } = obj1;
// 等价于 const { foo: foo } = obj1.foo;
// 再解析成 const { foo: foo } = { foo: 'bar' }
// 最后进行赋值 foo = 'bar'

foo // "bar"
```

### 7.4 默认值

对象的解构赋值也可以赋默认值，数组 **判断右边的值** 是否等于 `undefined`，对象的解构赋值也一样。

```js
var {x = 3} = {x: undefined};
x // 3

var {x = 3} = {x: null};
x // null
```

