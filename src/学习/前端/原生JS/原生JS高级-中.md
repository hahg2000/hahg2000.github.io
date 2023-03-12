# 原生JS高级-中

## 一、对象创建模式

### 1.1 Object构造函数模式

步骤：先创建一个空 Object 对象，再添加属性和方法。

适用场景：起始时不确定对象内部数据。

问题：语句太多。

```js
var p1 = new Object();
p1.name = '张三';
p1.age = 22;
p1.dowork = function(){
    console.log("正在工作中");
}
```

### 1.2 对象字面量模式

步骤：使用 { } 来创建对象，同时指定属性和方法。

适用场景：起始时对象内部数据是确定的。

问题：如果创建多个对象，就会有重复代码。

```js
var p1 = {
    name: "张三",
    age: 22,
    dowork: function () {
      console.log("正在工作中");
    }
  }
```

### 1.3 工厂模式

步骤：通过工厂函数动态创建对象并返回。

适用场景：需要创建多个相似对象。

问题：对象没有一个具体的类型，都是 Object 类型。

```js
function createPerson(name, age, dowork) {
    var obj = {
        name: name,
        age: age,
        dowork: dowork
    }
    return obj;
}

var p1 = createPerson("张三", 22,
                      function () { console.log("正在工作中"); });
```

### 1.4 自定义构造函数模式

步骤：自定义构造函数，通过 new 创建对象。

适用场景：需要创建多个类型确定的对象。

问题：每个对象会有相同的数据（属性 / 函数），浪费内存。

```js
function Person(name, age, dowork) {
    this.name = name;
    this.age = age;
    this.dowork = dowork;
}

var p1 = new Person("张三", 22, function () { console.log("正在工作中"); });
var p2 = new Person("李四", 20, function () { console.log("正在工作中"); });
console.log(p1, p2);
```

下面展示输出结果，可以看到两个对象中的 `dowork` 属性已经重复了。

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E8%87%AA%E5%AE%9A%E4%B9%89%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E7%BC%BA%E7%82%B9.png" style="zoom:80%;" />

### 1.5 构造函数加上原型的组合模式

我们将上面的 `dowork` 属性放入到原型里，就不会重复定义了。而每一个实例对象都可以访问原型里的函数。

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.dowork = function () { console.log("正在工作中"); }
var p1 = new Person("张三", 22);
var p2 = new Person("李四", 20);

// 都可以正常输出
console.log(p1.dowork, p2.dowork);
```

## 二、继承模式

我们可以利用原型链的特性来实现继承；也可以使用借用构造函数继承。

我们现在需要将这两个模式结合起来。

我们使用 `父函数.call(this, 父函数参数)` 来实现继承父类的操作与 Java 的 `super();` 一致。

第 7 行：调用父函数，使学生也可以初始化名字 `name` 和年龄 `age` 。

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}

function Student(stuId, name, age) {
    Person.call(this, name, age);
    this.stuId = stuId;
}
```

 然后但我们现在并不能调用 Person 原型里的方法，我们需要将 Student 的原型与 Person 的原型对接起来。

我们将使用 `Object.create(目标原型)` 方法，其创建一个新对象，使用现有的对象来提供新创建的对象的 \_\_proto\_\_ 。简单来说，就是使一个对象的隐式原型指向那个参数的对象。

`Student.prototype = Object.create(Person.prototype);`  这句代码就是让 Student 的显式原型的隐式原型指向 Person 的显式原型。与这句代码差不多的效果 `Student.prototype = new Person();` 。

使用两个方法，再输出 Student 函数的显式原型看一看。

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.getName = function () {
    return this.name;
}

function Student(stuId, name, age) {
    Person.call(this, name, age);
    this.stuId = stuId;
}

// Student.prototype = new Person();
Student.prototype = Object.create(Person.prototype);

console.log(Student);
```

![](https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E4%B8%A4%E4%B8%AA%E5%88%9B%E5%BB%BA%E6%A8%A1%E5%BC%8F%E6%AF%94%E8%BE%83.png)

左边的是使用构造函数，右边是使用 create 方法。

使用构造函数来创建 Student 的原型对象，会出现一些不需要的属性，这个例子为 name 和 age。而右边却没有不需要的属性，所以使用 create 方法较好。

但两个方式都没有 constructor 属性，就像箭头指的那个。我们需要手动设置。

` Student.prototype.constructor = Student;`

---

然后最后的代码及测试如下：

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.getName = function () {
    return this.name;
}

function Student(stuId, name, age) {
    Person.call(this, name, age);
    this.stuId = stuId;
}

Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

var stu1 = new Student("123", "张三", 22);
// 调用父函数的方法
var name = stu1.getName();
// 成功返回 "张三"
console.log(name);
```

## 三、线程机制

[参考网站](https://segmentfault.com/a/1190000012925872)

### 3.1 区分进程和线程

#### （1）概念

在操作系统中有官方的提到过这两个概念：

- 进程是cpu **资源分配的最小单位**（是能拥有资源和独立运行的最小单位）
- 线程是cpu **调度的最小单位**（线程是建立在进程的基础上的一次程序运行单位，一个进程中可以有多个线程）

#### （2）浏览器中的进程

浏览器是多进程的，每打开一个Tab页，就相当于创建了一个独立的浏览器进程。

浏览器的进程不单单只有 Tab 页，还有多种进程：

1. Browser 进程：浏览器的主进程（负责协调、主控），只有一个。作用有：
   - 负责浏览器界面显示，与用户交互。如前进，后退等；
   - 负责各个页面的管理，创建和销毁其他进程；
   - 将 Renderer 进程得到的内存中的Bitmap，绘制到用户界面上；
   - 网络资源的管理，下载等。
2. 第三方插件进程：每种类型的插件对应一个进程，仅当使用该插件时才创建；
3. GPU进程：最多一个，用于3D绘制等；
4. 浏览器渲染进程（浏览器内核）（Renderer进程，内部是多线程的）：默认每个Tab页面一个进程，互不影响。主要作用为：
   - 页面渲染，脚本执行，事件处理等。

具体的可以打开 Chrome 里的任务管理器查看，下图为 Chrome 任务管理器的每个任务的标识。

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/chrome%E4%BB%BB%E5%8A%A1%E7%AE%A1%E7%90%86%E5%99%A8.png" style="zoom:60%;" />

#### （3）浏览器多进程的优势

相比于单进程浏览器，多进程有如下优点：

- 避免单个 页面崩溃影响整个浏览器；
- 避免第三方插件崩溃影响整个浏览器；
- 多进程充分利用多核优势；
- 方便使用沙盒模型隔离插件等进程，提高浏览器稳定性。

简单点理解：**如果浏览器是单进程，那么某个页面崩溃了，就影响了整个浏览器或者其他的页面；同理如果是单进程，插件崩溃了也会影响到浏览器或者其他的页面**。

因为是单进程，所以如果当前进程的内存中一个内容发生错误，进程中的所有内容都需要重载，也就是说你打开的所有页面都会从网络上重新请求一次。

当然，内存等资源消耗也会更大，有点空间换时间的意思。

### 3.2 循环队列

+ JS 分为 **同步任务** 和 **异步任务**。

- 同步任务都在主线程上执行，形成一个 **执行栈**，类似于执行上下文栈。
- 主线程之外，**事件触发线程** 管理着一个 **任务队列**，只要异步任务有了运行结果，就在任务队列之中放置一个事件。
- 一旦 **执行栈** 中的所有同步任务执行完毕（此时 JS 引擎空闲），**系统就会读取任务队列**，将可运行的异步任务添加到可执行栈中，开始执行。
- 等到可执行栈的任务执行完毕之后，再将任务队列里的任务继续添加到可执行栈中，如此循环。

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/JS%E5%BE%AA%E7%8E%AF%E9%98%9F%E5%88%97.png" style="zoom:70%;" />

### 3.3 浏览器的渲染进程

**浏览器的渲染进程是多线程的** ，这里的渲染进程指的是页面的总进程。

而渲染进程包含了哪些线程（列举一些主要常驻线程）：

1. GUI渲染线程
   - 负责渲染浏览器界面，解析HTML，CSS，构建DOM树和RenderObject树，布局和绘制等。
   - 当界面需要重绘（Repaint）或由于某种操作引发回流（reflow）时，该线程就会执行。
   - 注意，**GUI渲染线程与JS引擎线程是互斥的**，当 JS 引擎执行时 GUI 线程会被挂起（相当于被冻结了），GUI更新会被保存在一个队列中 **等到JS引擎空闲时** 立即被执行。
2. JS 引擎线程
   - 也称为 JS 内核，负责处理、解析和运行 Javascript 脚本程序。（例如 V8 引擎）
   - JS引擎一直等待着任务队列中任务的到来，然后加以处理，一个Tab页（renderer 进程）中无论什么时候都只有一个JS线程在运行JS程序
   - 同样注意，**GUI渲染线程与JS引擎线程是互斥的**，所以如果 JS 执行的时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞。
3. 事件触发线程
   - 归属于浏览器而不是 JS 引擎（可以理解，JS引擎自己都忙不过来，需要浏览器另开线程协助）
   - 当 JS 引擎执行代码块，例如初始化 setTimeOut 、添加鼠标点击监听、AJAX异步请求，会将对应任务添加到事件线程中。
   - 当对应的 **事件符合触发条件被触发** 时，该线程会把事件 **添加到循环队列的队尾**，等待 JS 引擎的处理。
4. 定时触发器线程
   - 传说中的`setInterval`与 `setTimeout` 所在线程。
   - **浏览器定时计数器并不是由 JavaScript 引擎计数的**。（因为JavaScript引擎是单线程的, 如果处于阻塞线程状态就会影响记计时的准确）
   - 因此通过 **单独线程来计时并触发定时**（计时完毕后，将回调函数添加到 **事件队列** 中，等待JS引擎空闲后执行）
   - 注意，W3C 在 HTML 标准中规定，规定要求 setTimeout 中低于 4ms 的时间间隔算为4ms。
5. 异步 http 请求线程
   - 在 XMLHttpRequest 在连接后是通过浏览器新开一个线程请求。
   - 将检测到状态变更时，如果设置有回调函数，异步线程就 **产生状态变更事件**，将这个回调再放入循环队列中。再由 JavaScript 引擎执行。

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%A4%9A%E4%B8%AA%E7%BA%BF%E7%A8%8B%E7%9A%84%E5%85%B3%E7%B3%BB.png" style="zoom:60%;" />

### 3.4 通信过程

之前有提到 Browser 进程，浏览器的主进程，但每一个浏览器渲染进程是如何与主进程通信的呢？

- Browser 进程收到用户请求，首先需要 **获取页面内容**（譬如通过网络下载资源），随后将该任务 **通过RendererHost 接口传递给 Render 进程**。
- Renderer 进程的 Renderer 接口收到消息，简单解释后，交给渲染线程，然后开始渲染：
  - 渲染线程接收请求，加载网页并渲染网页，这其中可能需要 Browser 进程获取资源和需要 GPU 进程来帮助渲染。
  - 当然可能会有 JS 线程操作 DOM（这样可能会造成回流并重绘）
  - 最后 Render 进程将结果传递给 Browser 进程
- Browser 进程 **接收到结果并将结果绘制出来**。

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E4%B8%BB%E7%BA%BF%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E9%80%9A%E4%BF%A1%E8%BF%87%E7%A8%8B.png" style="zoom:65%;" />

### 3.5 浏览器渲染流程

最开始的几步：

1. 浏览器输入 url，浏览器主进程接管，开一个下载线程，
2. 然后进行 http请求（略去DNS查询，IP寻址等等操作），然后等待响应，获取内容。
3. 随后将内容通过 RendererHost 接口转交给 Renderer 进程

4. 浏览器渲染流程开始，也就是上图的右下角模块的执行流程。

下面为渲染的流程：

1. 解析 HTML 建立 DOM 树。
2. 将 CSS 代码解析成树形的数据结构——Style 树，然后与 DOM 树合并，形成 Render 树。
3. 布局 Render 树（Layout/reflow），负责各元素尺寸、位置的计算。
4. 绘制 Render 树（paint），绘制页面像素信息。
5. 浏览器会将 **各层的信息** 发送给GPU，GPU会将各层合成（composite），显示在屏幕上。

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B8%B2%E6%9F%93%E6%B5%81%E7%A8%8B.png" style="zoom:65%;" />

渲染完毕后就是 `window.onload` 事件了。这里还有一个概念 **DOMContentLoaded 事件**。

- 当 DOMContentLoaded 事件触发时，仅当DOM加载完成，**不包括样式表，图片**。与 jQuery 的 `$(回调函数)` 函数触发的时机一致。
- 当 onload 事件触发时，页面上所有的DOM，样式表，脚本，图片都已经加载完成了。

也就是说 DOMContentLoaded 事件先于 onload 事件。

### 3.6 事件循环进阶





