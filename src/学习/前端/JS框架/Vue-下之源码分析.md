# Vue-下之源码分析

接下来我们对 Vue 一些核心功能的源码进行分析，当然我们并不是直接看 Vue 的源码，在 Github 上有一个简化版本，我们可以学习一下那个。

+ [Github 仓库](https://github.com/DMQ/mvvm)

> 本文能帮你做什么？
>
> 1、了解vue的双向数据绑定原理以及核心代码模块
>
> 2、缓解好奇心的同时了解如何实现双向绑定
>
> 为了便于说明原理与实现，本文相关代码主要摘自 [vue源码](https://github.com/vuejs/vue), 并进行了简化改造，相对较简陋，并未考虑到数组的处理、数据的循环依赖等，也难免存在一些问题，欢迎大家指正。不过这些并不会影响大家的阅读和理解，相信看完本文后对大家在阅读vue源码的时候会更有帮助
> 本文所有相关代码均在github上面可找到 https://github.com/DMQ/mvvm

## 一、准备工作

### 1.1 伪数组转变为真数组

伪数组转变为真数组：`[].slice.call(伪数组)` 。

> 在在之前笔记的 [原生JS-上](../原生JS/原生JS-上.md) 的 2.4 的第（4）节中有的函数2，有 `call()` 方法的详解。

1. `slice()` ：截取数组，对里面的引用类型进行浅拷贝，并返回一个新数组。
2. `call()` ：指定某个方法的 `this` ；而 `call(伪数组)` ，就等于在伪数组里调用 `slice()` 方法。
3. 使用 `call()` 方法的前提是传进去的对象可以执行当前指定的方法。这里正好 `slice()` 对伪数组使用。
4. 用途：将使用原生 Javascript 获取的 DOM 节点组成的伪数组转换成真数组

### 1.2 节点类型

节点类型是非常少使用的，但在一些底层设计时经常会使用到。

>  在之前笔记的 [原生 JS-中](../原生JS/原生JS-中.md) 的 一、DOM简介所提到过。

一些节点的类型以及属性：

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/HTML%E5%B8%B8%E7%94%A8%E8%8A%82%E7%82%B9.png" style="zoom:60%;" />

| 节点类型 | nodeName               | nodeType | nodeValue    |
| -------- | ---------------------- | -------- | ------------ |
| 文档节点 | #document              | 9        | null         |
| 元素节点 | 标签名（div，html）    | 1        | null         |
| 属性节点 | 属性名（class，style） | 2        | 属性值       |
| 文本节点 | #text                  | 3        | **文本内容** |

### 1.3给对象添加属性

给对象添加属性除了直接赋值，还可以使用一个方法来添加属性，并指定属性的一些配置。

+ `Object.defineProperty( obj, prop, [descriptor] )`

> 在在之前笔记的 [原生JS-上](../原生JS/原生JS-上.md#二、对象) 的 2.1 节中有属性的详解。

属性的配置有六种：可以通过其中文意思大概知道他们的意思。

+ `configurable` ：当前属性是否可以被重新配置
+ `enumerable` ：当前属性是否可以被枚举
+ `value` ：当前属性的初始值
+ `writable` ：当前属性是否可以直接修改其值
+ `get` ：回调函数，当外部获取属性的值时调用
+ `set` ：回调函数，当外部修改属性的值时调用

属性描述符也称属性的种类，其有两种种类：**数据描述符** 和 **存取描述符**。

+ 数据描述符：可以直接对数据进行操作
  + 没有 `get` 和 `set` 配置
+ 存取描述符：需要通过 `get` 和 `set` 配置来返回属性的值进行操作。
  + 没有 `value` 和 `writable` 配置


Vue 中的计算属性就是使用了这个方法。我们现在可以粗略地实现一下计算属性的功能。以之前的 fullName 实例做例子。

```js
// 直接定义两个属性
let nameObj = { firstName: 'A', secondName: 'B'}

// 使用defineProperty来定义fullName属性
Object.defineProperty(nameObj, 'fullName', {
  get(){
    // 将firstName和SecondName拼接到一起
    return this.firstName + ' ' + this.secondName 
  },
  set(newValue){
    // 更新firstName和SecondName
    let array = newValue.split(' ')
    this.firstName = array[0]
    this.secondName = array[1]
  }
})

// 修改firstName的值，原值为'A'
nameObj.firstName = 'B'

console.log(nameObj.fullName);  // B B

// 修改fullName的值，原值为'B B'
nameObj.fullName = 'A A'

// firstName和econdName都被修改
console.log(nameObj.firstName);  // A
console.log(nameObj.secondName);  // A
```

### 1.4 判断对象内部是否有某个属性

一般我们调用 `对象.属性名` 都从对象的原型的寻找，但我们不想让 Javascript 在原型上寻找，那么我们就需要使用 `对象.hasOwnProperty( '属性名' )` 来判断。

```js
let obj = { name: '张三' };

console.log(obj.hasOwnProperty('name'));	// true

console.log(obj.hasOwnProperty('toString')); // false
```

### 1.5 文档碎片

`Node` 是一个接口，各种类型的 DOM API 对象会从这个接口继承。而 `DocumentFragment` 继承了 `Node` 。

`DocumentFragment` 文档片段接口，一个没有父对象的最小文档对象。它被作为一个轻量版的 `Document` 使用，就像标准的 document 一样，**存储由节点（nodes）组成的文档结构**。

简单来说，**就是一个存在内存中且拥有 DOM 文档结构的容器，与真实的 DOM 文档结构隔离**。

**语法：** `document.createDocumentFragment()` 创建文档碎片对象。

接下来我们使用文档碎片来实现 Vue 中数据更新后界面的更新效果。下面代码为准备工作：

```html
<body>
  <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
  </ul>
</body>
<script>
	// 创建文档碎片对象
  const fragment = document.createDocumentFragment()
  // 所取到需要更新数据的DOM节点
  const uls = document.getElementsByTagName('ul')[0]
</script>
```

核心代码：为 `fragment` 添加节点

+ **循环条件** 为 【uls 的第一个节点不为空】，**循环体**是 【将节点添加到 `fragment` 里】。
  但好像循环条件里的变量没有变动，是死循环吗？
+ 其实这里的循环条件里的变量 **隐式变动** 了，在第 4 行变动了。
+ 每一个除 HTML 节点外的所有节点都会有一个父节点，所以只要将某个节点的添加为其他节点的孩子时，这个节点就会在原来父节点中移除。**所以第 4 行，不但执行了添加而且还执行了移除**。
+ （感觉有点离谱，就像新的父亲会覆盖旧的父亲一样）

```js
// 为fragment添加节点
let child = null
while( child = uls.firstChild ){
  fragment.appendChild(child)
}
```

然后在遍历 fragment ，然后修改对应的值，最后再添加到页面上去。因为 `childNodes` 有文档节点和元素节点所以 **需要判断是否为元素节点**，元素节点的 nodeType 节点类型为 1.

```js
[].slice.call(fragment.childNodes).forEach( (node) => {
  if(node.nodeType === 1){
    node.textContent = 'hahg'
  }
})

uls.appendChild(fragment)
```

## 二、数据代理

### 2.1 使用Vue实现

+ 数据代理参考的是设计模式里的代理模式，**通过一个对象代理对另一个对象中属性的读或写**。
+ Vue 数据代理：
  + 之前有一个细节就是我们编写 Vue 的构造函数里的配置时，读或写 data 里的值都只需要使用 `this.变量名` 而不是 `this._data.变量名`  （实际渲染页面时 data 对象重命名为了 `_data` ）
  + 这就是 Vue 中数据代理，我们不必要多写一个对象来获取数据。
  + 下面就是 VM 的实际结构

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/Vue%E6%95%B0%E6%8D%AE%E4%BB%A3%E7%90%86.png" style="zoom:70%;" />

我们对 `name` 修改，`_data.name` 也会同时改变。

```js
var vm = new Vue({
  el: '#app',
  data: {
    name: 'hahg'
  },
})

// 修改name的值，_data里的name也会改
vm.name = '小司'
console.log(vm._data.name); // 小司

// 修改_data里的name的值，name也会改变
vm._data.name = '此方'
console.log(vm.name); // 此方
```

### 2.2 使用简化版

下载简化版本，然后和 Vue 一样使用，只是构造函数不一样。

```html
<!-- 引入四个核心文件 -->
<script src="./js/observer.js"></script>
<script src="./js/watcher.js"></script>
<script src="./js/compile.js"></script>
<script src="./js/mvvm.js"></script>
<script>
  const vm = new MVVM({
    el: '#app',
    data: {
      name: 'hahg'
    },
  })

  // 输出vm
  console.log(vm);
</script>
```

然后查看输出情况，与第 2.1 节的红色方框的内容相同，但简化了很多东西。

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/%E7%AE%80%E5%8C%96%E7%89%88%E6%95%B0%E6%8D%AE%E4%BB%A3%E7%90%86.png" style="zoom:80%;" />

### 2.3 Debug调试

接下来我们使用 VSCode 来看下简化版的源码，或者也可以使用 Chorme 自带的开发者工具。

下面简单介绍一下调试工具的几个按钮的作用：

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/vscode%E8%B0%83%E8%AF%95%E7%95%8C%E9%9D%A2.png" style="zoom:70%;" />

+ 第一个【继续】：竖线加一个右三角——直接跳转到下一个断点。
+ 第二个【单步跳过】：一个箭头越过一个点——如果遇到方法里直接执行完方法。
+ 第三个【单步调试】：一个箭头指向一个点——进入到方法里执行。
+ 第四个【单步跳出】：一个箭头反方向指向一个点——直接执行完成方法，除非遇到断点。
+ 第五个【重启】：绿色旋转箭头——重启调试。
+ 第六个【停止】：红色空心方形——结束调试。

首先在上面代码的第 7 行打上断点，然后选择单步调试，进入到源码里，源码全部如下：

::: detail

```js
function MVVM(options) {
  this.$options = options || {};
  var data = this._data = this.$options.data;
  var me = this;

  // 数据代理
  // 实现 vm.xxx -> vm._data.xxx
  Object.keys(data).forEach(function(key) {
    me._proxyData(key);
  });

  this._initComputed();

  observe(data, this);

  this.$compile = new Compile(options.el || document.body, this)
}

MVVM.prototype = {
  constructor: MVVM,
  $watch: function(key, cb, options) {
    new Watcher(this, key, cb);
  },

  _proxyData: function(key, setter, getter) {
    var me = this;
    setter = setter || 
      Object.defineProperty(me, key, {
      configurable: false,
      enumerable: true,
      get: function proxyGetter() {
        return me._data[key];
      },
      set: function proxySetter(newVal) {
        me._data[key] = newVal;
      }
    });
  },

  _initComputed: function() {
    var me = this;
    var computed = this.$options.computed;
    if (typeof computed === 'object') {
      Object.keys(computed).forEach(function(key) {
        Object.defineProperty(me, key, {
          get: typeof computed[key] === 'function' 
          ? computed[key] 
          : computed[key].get,
          set: function() {}
        });
      });
    }
  }
};
```

:::

数据代理只用到里面的几行：

+ 第 2 ~ 7 行：初始化操作/第 5 行 **将配置对象里的 data 对象传给 vm 的 _data**，这就是为什么我们调用 vm 里的 data 不是 `vm.data` 而是 `vm._data`。
+ 第 11 行开始实现数据代理，将 `_data` 里的数据根据代理映射出来。这里使用到了 `_proxyData()`  方法。
  + `Object.keys(data)` ：将 data 里所有属性的属性名放到一个数组里，并返回。
  + 这里使用到了 `forEach()` ，所以第 12 行执行的是以 data 里的 **每一个属性名** 作为参数掉调用 `_proxyData()` 方法。

```js
function MVVM(options) {
  // 判断传入参数是否为空
  this.$options = options || {};
  // 将配置对象里的data的数据传给vm._data
  var data = this._data = this.$options.data;
  // me代表vm对象
  var me = this;

  // 数据代理
  // 实现 vm.xxx -> vm._data.xxx
  Object.keys(data).forEach(function(key) {
    me._proxyData(key);
  });
```

+ 接下来我们进入 `me._proxyData()` 方法里
  + 第 1 行： `_proxyData()` 方法存在 MVVM 的原型里，所以任何他的实例都可以调用。
  + 第 3 行：存储 `this` ，由于是 vm 对象调用所以是 `this ` 指向 vm 对象。
  + 第 4 行：使用了  `||` 或运算符，判断形参 setter 是否为空，不为空则使用参数，为空则执行默认操作，因为在上面的第 12 行中，只传递了一个属性名，所以这里需要执行默认操作。
  + 第 5 ~14 行：以形参的属性名创建存取描述符，定义 `set()` 和 `get()` 方法来实现数据代理。
    + 第 8 行：`get()` 方法中返回的值是从 `_data` 里取到的。
    + 第 11 行：`set()` 方法中使用新值改变 `_data` 里的值。

```js
MVVM.prototype = {
  _proxyData: function(key, setter, getter) {
    var me = this;
    setter = setter || 
      Object.defineProperty(me, key, {
      configurable: false,
      enumerable: true,
      get: function proxyGetter() {
        return me._data[key];
      },
      set: function proxySetter(newVal) {
        me._data[key] = newVal;
      }
    });
  },
```

### 2.4 总结

+ Vue 的数据代理是 **数据劫持** ： 通过 `Object.defineProperty()` 来劫持各个属性的设置和获取，也就是说你 读或写 都需要执行属性里 `set()` 和 `get()` 方法。
  + 不得不说，能想到直接使用 Javascript 里的原生语法来实现这个功能，真的很妙。
+ Angular.js 的数据代车是 **脏值检查:**  是通过脏值检测的方式比对数据是否有变更，来决定是否更新视图，最简单的方式就是通过 `setInterval()` 定时轮询检测数据变动，当然Google不会这么low，angular只有在指定的事件触发时进入脏值检测，大致如下：
  - DOM 事件，譬如用户输入文本，点击按钮等。( ng-click )
  - XHR 响应事件 ( $http )
  - 浏览器 Location 变更事件 ( $location )
  - Timer 事件( \$timeout , \$interval )
  - 执行 \$digest() 或 \$apply()
  - 这个就类似直接设置一个管理员来管理数据，只有数据被另一个人使用了，才会更新数据。
  - 可能这个和 Vue 对比，应该是性能会好点，不会经常地修改数据。

## 三、大括号表达式
