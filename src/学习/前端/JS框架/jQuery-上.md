# jQuery-上

## 一、初始jQuery

### 1.1 jQuery是什么

jQuery 是一个优秀的 JS 函数库，其官网为 https://jquery.com/。

大部分网站都使用到了 jQuery ，其口号为 write less , do more。

因为查找 DOM 元素比增删改元素的操作更复杂，所以这个框架设计的初心就是更容易查找 DOM 元素。所以第一个字母是小写，而 Query 的开头是大写。

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/jQuery%E5%9B%BE%E6%A0%87.png" style="zoom:80%;" />

### 1.2 为什么选择jQuery

1. 可以链式调用。
2. 读写和一。对于一个函数不传参数就是读，传了参数就是写。
3. 浏览器兼容。对于 jQuery 的低版本是可以兼容 IE 的低版本。
4. 易扩展插件。
5. ajax封装。

### 1.3 怎么使用

这里举一个例子来说明怎么使用 jQuery。

需求：有一个文本框和一个按钮，点击按钮会弹出文本框输入的内容。

#### （1）页面布局

```html
<body>
  <input type="text" />
  <button type="button" id="btn01">原生JS按钮</button>
  <button type="button" id="btn02">jQuery按钮</button>
</body>
```

#### （2）完成原生JS按钮

原生 JS 实现应该已经很熟悉了，获取按钮元素和文本框元素，然后为按钮绑定监听，在其响应函数中获取到文本框元素的值。

```js
window.onload = function () {
    var btn01 = document.getElementById("btn01");
    var input = document.getElementsByTagName("input")[0];

    btn01.onclick = function () {
        alert(input.value);
    }
}
```

#### （3）使用jQ实现

首先引入 jQuery 的 JS 文件，引入 JS 文件有两种方式：

+ 一个是使用 CDN ，要求需要网络，微软CDN 【https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.6.0.js】。
+ 二是直接下载本地使用，官网上提供了两个种 JS 文件：
  + 以 min.js 结尾的是压缩版本，适用于上线到网络的网站。例如：【jquery-3.6.0.min.js】。
  + 单单以 js 结尾的版本，适用于开发时候使用。例如：【jquery-3.6.0.js】。
+ jQuery 手册：【https://jquery.cuishifeng.cn/】。

| 步骤               | 原生JS                              | jQuery                             | 备注                                                  |
| ------------------ | ----------------------------------- | ---------------------------------- | ----------------------------------------------------- |
| 1.绑定页面加载监听 | `window.onload = function(){}`      | `$( function(){} )`                |                                                       |
| 2.获取DOM元素对象  | `document.getElementById();`        | `$("元素选择器")`                  | jQuery返回的是jQuery对象；<br />而原生返回的是DOM对象 |
| 3.绑定单击事件监听 | `元素对象.onclick = function () {}` | `jQuery对象.click( function(){} )` | 使用 jQuery 对象里的方法。                            |
| 4.获取文本框的值   | `文本框元素对象.value`              | `jQuery对象.val()`                 |                                                       |

最终代码如下：

```js
$(
    function () {
        $("#btn02").click(function () {
            var msg = $("#msg").val();
            alert(msg);
        });
    }
)
```

#### （4）总结所写的代码

在上面我们使用了 `$( )` 和 `$( ).xxx` ，两种方式使用 jQuery。、

在 jQuery 源码中，我们可以看到这行代码。`window.jQuery = window.$ = jQuery;`  其通过对 window 绑定属性，而向外暴露了一个函数对象，我们可以直接调用，也就是说**我们使用的 $ 符号和 jQuery 是同一个函数对象**。

+ 因为 “ $ " 符号后面加上了 " () " 号，所以可以得知其为 **函数对象** ，我们称之为 **jQuery 核心函数**，使用 `jQuery()` 一样的效果。

+ 通常使用 " . " 调用对象的属性和方法，所以可以得知返回为 **jQuery 对象**，我们称之为 **jQuery 核心对象**。

jQuery 核心对象的命名我们可以遵循一个规则，**变量名前加上 ” $ “ 符号**。

我们改下上面的代码，改动的地方第 3 ~ 4 行。

```js
$(
    function () {
        var $btn02 = $("#btn02");
        $btn02.click(function () {
            var msg = $("#msg").val();
            alert(msg);
        })
    }
)
```

### 1.4 jQuery的两把利器

jQuery的两个利器：

+ jQuery 核心函数；
+ jQuery 核心对象。

#### （1）jQuery核心函数

+ jQuery 核心函数简称 jQuery 函数，可以使用 【$ / jQuery】表示。
+ jQuery 库向外直接暴露的就是【$ / jQuery】。
+ 引入 jQuery 文件后，直接使用即可。
  + 当函数使用：`$(xxx)`
  + 当对象使用：`$.xxx()`

下面为 jQuery 的一部分源码：第 5 行中很明显就知道 jQuery 的是一个函数，然后在第 9 行中，返回了一个 new 出来的对象，这个对象就是 jQuery 核心对象。

```js
var
version = "3.6.0",

    // Define a local copy of jQuery
    jQuery = function( selector, context ) {

        // The jQuery object is actually just the init constructor 'enhanced'
        // Need init if jQuery is called (just allow error to be thrown if not included)
        return new jQuery.fn.init( selector, context );
    };
```

#### （2）jQuery核心对象

jQuery 核心对象，简称 jQuery 对象。

+ 获取 jQuery 对象：**运行 jQuery 函数** 就可以得到。

+ 使用 jQuery 对象：查帮助手册，**直接调用里面的属性和方法**。例如 `$xxx.yyy()`

#### （3）查看帮助文档

我们需要学习一下如何查找帮助文档，jQuery 帮助文档分为几大块，现在我们只使用了第一列和第二列。

+ 第一列是选择器，是用来定位 DOM 元素，用的是蓝色方框。
+ 第二列是 jQuery 核心，包括 jQuery 对象和 jQuery 函数的使用，用的是红色方框。
  + jQuery 函数传入的参数可以有三种。
  + jQuery 对象可以使用图中的那几个属性和方法。

![](https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/jQuery%E6%89%8B%E5%86%8C%E7%9B%AE%E5%BD%95-%E6%A0%87%E8%AE%B01.png)

## 二、jQuery核心函数

### 2.1 作为函数调用

" jQuery " 作为函数调用有三种方式：

#### （1）第一种调用方式

通过传入的参数不同，函数作用就不同。

+ `jQuery( [selector,[context]] )`
  + 作用：查找 DOM 元素。
  + 参数1：`selector【String】`：用来查找的字符串。
  + 参数2：`context【jQuery-jQuery对象/Element-元素对象】`：作为待查找的 DOM 元素集、文档或 jQuery 对象。
+ `jQuery( element )`
  + 作用：将传入的 DOM 元素对象封装成 jQuery 对象。
  + 参数1：`element【Element-元素对象】` ：DOM 元素对象。
+ `jQuery( elementArray )`
  + 作用：将传入的 DOM 元素对象数组封装成 jQuery 对象。
  + 参数1：`elementArray【HTMLCollection-元素对象集合】`。
+ `jQuery( object )` （少用）
  + 作用：将普通的对象封装成数组。
  + 参数1：`object【Object-对象】`。
+ `jQuery( jQuery )`（少用）
  + 作用：克隆指定的 jQuery 对象。
  + 参数1：`jQuery【jQuery-jQuery对象】` 

下面举一个代码例子。

```js
// 1.传入选择器字符串
var $box1 = $("#box1");
console.log($box1.get(0));  // 输出 <div id="box1"></div>

// 2.传入DOM元素
var box1 = document.getElementById("box1");
$box1 = $(box1);
console.log($box1.get(0));  // 输出 <div id="box1"></div>

// 3.传入DOM元素集合
var divs = document.getElementsByTagName("div");
var $divs = $(divs);
console.log($divs.length);  // 输出 2

// 输出：
// 0 <div id="box1"></div>
// 1 <div></div>
$divs.each(function (index, element) {
    console.log(index,element);
});
```

#### （2）第二种调用方式

这种调用方式主要是传入 DOM 元素的字符串，创建 DOM 元素，然后包装成 jQuery 对象。

+ ` jQuery(html,[ownerDoc])` (v1.0) 
  + `html【String】`：用于动态创建 DOM 元素的 **完整的** HTML标记字符串；
  + `ownerDocument`：创建DOM 元素所在的文档；

+ `jQuery(html,props)` （v1.8）
  + `html【String】`：用于动态创建 DOM元素的 **标签**；
  + `props【Object】`：**用于附加到新创建元素上的属性、事件和方法**。

```js
// 1.传入html字符串
var $div = $("<div class='test'>这是个div</div>");
console.log($div.get(0)); // 输出 <div class='test'>这是个div</div>

// 2.第1个参数传入标签
//   第2个参数传入需要添加的属性的集合
$div = $("<div></div>", {
    class: "test",
    text: "这是个div",
    click: function () {
        console.log("我被点击了");
    }
})
console.log($div.get(0)); //输出 <div class='test'>这是个div</div>
```

#### （3）第三种调用方式

第三种的调用方式就是直接传入一个回调函数，当 **DOM 文档加载** 完成后执行回调函数，这个时机就是 **当 DOMContentLoaded 事件触发时，仅当DOM加载完成，不包括样式表，图片** ，时间后于 `window.onload` 事件。

+ `jQuery(callback)`
  + `callback【Function】`：当 DOM 文档加载完成后执行回调函数。

### 2.2 作为对象调用

“ $ ” 和 “ jQuery " 也可以作为对象调用。

语法： `$.方法名()` 。

使用场景：需要对某个普通对象进行操作。

使用类别：作为工具使用 或 作为 Ajax 请求，用的是橙色方框。

![](https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/jQuery%E6%89%8B%E5%86%8C%E7%9B%AE%E5%BD%95-%E6%A0%87%E8%AE%B02.png)

### 2.3 举例使用

#### （1）函数举例

需求：有一个文本框和一个按钮，当点击按钮时，输出 **按钮的文本** 并添加一个文本框。

+ 第 13 行，在点击事件的回调函数中，this 的值依然是 DOM 元素。
+ 第 25 行，使用了文档处理模块的 appendTo，将指定 DOM 元素添加到指定位置。

```html
<!-- 页面布局 -->
<body>
  <div>
    <input type="text" id="msg"><br/>
    <button id="btn01">按钮</button><br/>
  </div>
</body>

<!-- 引入jQuery文件 -->
<script src="js/jquery-3.6.0.js"></script>
<script>
  // 传入选择器字符串
  $("#btn01").click(function () {

    // 这里的this为DOM元素
    // 这样输出也可以
    // console.log(this.innerHTML);

    // 传入DOM元素
    console.log($(this).html());

    var inputStr = "<input type='text'/> <br/>";
    // 使用文档处理模块的appendTo
    // 传入html字符串
    $(inputStr).appendTo("div");
  });
```

#### （2）对象举例

遍历数组和对象中的所有数据，并将对象里的数据的前后空格去掉。

+ 第 7 行使用的是 `$.each( array [, callback] )`。
  + 回调函数的第一个参数为 **数组里每一个元素的索引**，第二个参数为索引的值。
+ 第 19 行使用的使用`$.each( object [, callback] )`。
  + 回调函数的第一个参数为 **对象里的每一个元素的属性名**，第二个参数为属性名所对应的属性值。
+ 第 20 行使用的是 `$.trim("字符串")` ，可以去掉字符串起始和结尾的空格。

```js
var array = [1, 3, 2, 5, 8];

var obj = { name: ' hahg ', hobby: ' games' };

// @param {number} index
// @param value
$.each(array, function (index, value) {
    console.log("第" + index + "个数是" + value);
})
// 输出
// 第0个数是1
// 第1个数是3
// 第2个数是2
// 第3个数是5
// 第4个数是8

// @param {String} key
// @param value
$.each(obj, function (key, value) {
    console.log("key:(" + $.trim(key) + ");value:(" + $.trim(value) + ")");
})
// 输出
// key:(name);value:(hahg)
// key:(hobby);value:(games)
```

此外还有许多有用的工具，需要的时候查 API 即可。主要还有几个方面的工具：

+ **数组和对象操作**
+ **函数操作**
+ **测试操作**
+ 字符串操作——`$.tirm("字符串")`
+ URL
+ 插件编写

## 三、jQuery 核心对象

### 2.1 简介

+ jQuery 核心对象是执行 jQuery 核心函数返回的对象。
+ jQuery 对象内部包含的是 DOM 元素对象的伪数组。
+ jQuery 对象拥有许多有用的属性和方法，让使用者能方便的操作 DOM。

### 2.2 分类

jQuery 对象里有的方法分为几类：

+ 基本行为
+ 属性
+ CSS
+ 文档
+ 筛选
+ 事件
+ 效果

### 2.3 基本行为的使用

这里先主要说明一下基本行为的一些方法

+ `each( callback )` ：以每一个匹配的元素作为上下文来执行一个函数
  + `callback【Function】` ：回调函数， `this` 将指向 jQuery 对象的每一个 DOM 元素。
  + 函数将有一个隐含参数，其值为当前 DOM 元素在 jQuery 集合里的索引。
+ `length`：jQuery 对象中元素的个数。
+ `get([index]) / [index]` ：取出 jQuery 对象中的某一个 DOM 元素。
  + `[index]【Number】` ：可选参数，取出 jQuery 对象中 第 几 个位置上的 DOM 元素。若不填写，则代表所有的 DOM 元素。
+ `index( [selector|element] )`：获取到 DOM 元素在兄弟节点中的索引。
  + 传参数的情况：
    + `jQuery对象.index(selector)`：
    + 传入一个选择器字符串，用于查找 **在指定的 jQuery 对象中**，符合该选择器的 DOM 元素的索引。
    + `jQuery对象.index(element)`：
    + 传入一个 DOM 元素或者 jQuery 对象，用于查找 **在指定的 jQuery 对象中**，与 DOM 元素或者 jQuery 对象中的 DOM 元素相等的索引。
  + 不传参数的情况（常用）：
    + `jQuery对象.index()`
    + 查找当前 jQuery 对象中的 DOM 元素在兄弟节点中的索引。

### 2.4 基本行为的实例

这里举一个例子来使用上面的这些方法。

页面有四个按钮。

```html
<body>
  <button>测试1</button>
  <button>测试2</button>
  <button>测试4</button>
  <button id="btn03">测试3</button>
</body>
```

**需求：**

1. 统计一共有多少个按钮。
2. 取出第 2 个按钮的文本。
3. 输出所有按钮标签的文本。
4. 输出 id 等于 " btn03 " 的按钮在所有的按钮中的索引。

```js
// 1. 统计一共有多少个按钮
// 使用length属性
console.log($("button").length); // 4

// 2. 取出第 2 个按钮的文本
// 使用 get() 方法
console.log($("button").get(1).innerHTML);	// 测试2

// 3. 输出所有按钮标签的文本
// 使用 each() 方法
$("button").each(function(index){
  console.log("第"+index+"个的文本是"+this.innerHTML);
})
// 第0个的文本是测试1
// 第1个的文本是测试2
// 第2个的文本是测试4
// 第3个的文本是测试3

// 4. 输出 id 等于 " btn03 " 的按钮在所有的按钮中的索引。
// 使用 index() 方法
console.log($("#btn03").index());	// 3
```

现在可以补充一下 jQuery 目录。

![](https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/jQuery%E6%89%8B%E5%86%8C%E7%9B%AE%E5%BD%95-%E6%A0%87%E8%AE%B03.png)

## 四、选择器

这一章将介绍如何在 jQuery 中使用选择器，这个就是 CSS 中的元素选择器。

如果熟悉选择器的话，可以在这个网站练习，复习下 CSS 选择器。

+ https://flukeout.github.io/

### 4.1 基本选择器

基本选择器最常用的选择器，有下面几种。

| 名称       | 代码                      | 说明                         |
| ---------- | ------------------------- | ---------------------------- |
| id 选择器  | `$( "#id" )`              | 获取一个含有指定 id 的元素   |
| 标签选择器 | `$( "div" )`              | 获取一组指定标签的元素       |
| 类选择器   | `$( ".class" )`           | 获取一组含有指定类的元素     |
| 并集选择器 | `$( "sel1, sel2, sel3" )` | 获取符合任意一个选择器的元素 |
| 交集选择器 | `$( "sel1sel2sel3" )`     | 获取三个选择器都符合的元素   |

下面举例来使用他们。这里有一个页面。

```html
<body>
  <div id="div1" class="box">div1(class="box")</div>
  <div id="div2" class="box">div2(class="box")</div>
  <div id="div3">div3</div>
  <span class="box">span(class="box")</span>
  
  <ul>
    <li>AAAA</li>
    <li title="hello">BBBB(title="hello")</li>
    <li class="box">CCCC(class="box")</li>
    <li title="hello">DDDD(title="hello")</li>
  </ul>
</body>
```

**需求：**

1. 选择 id 为 div1 的元素。
2. 选择所有的 div 元素。
3. 选择所有 class 等于 box 的元素。
4. 选择所有 div 和 span 元素。
5. 选择所有 class 等于 box 的 div 元素。

```js
// 1. 选择 id 为 div1 的元素。使用id选择器
 console.log($("#div1"));
// jQuery.fn.init(1)
//  0: div#div1.box
//  length: 1

 // 2. 选择所有的 div 元素。使用标签选择器
 console.log($("div"));
// jQuery.fn.init(3)
//  0: div#div1.box
//  1: div#div2.box
//  2: div#div3
//  length: 3

 // 3. 选择所有 class 等于 box 的元素。使用类选择器
 console.log($(".box"));
// jQuery.fn.init(4)
//  0: div#div1.box
//  1: div#div2.box
//  2: span.box
//  3: li.box
//  length: 4

// 4. 选择所有 div 和 span 元素。使用并集选择器
console.log($("div, span"));
// jQuery.fn.init(4)
//  0: div#div1.box
//  1: div#div2.box
//  2: div#div3
//  3: span.box
//  length: 4

// 5. 选择所有 class 等于 box 的 div 元素。使用交集选择器
console.log($("div.box"));
// jQuery.fn.init(2)
//  0: div#div1.box
//  1: div#div2.box
```

### 4.2 层次选择器

层次选择器可以通过层级来查找父元素、子元素以及兄弟元素。层级选择器有下面几种：

| 名称           | 代码                  | 说明                         |
| -------------- | --------------------- | ---------------------------- |
| 子代选择器     | `$( "parent>child" )` | 获取到父元素的子代元素       |
| 后代选择器     | `$( "parent child" )` | 获取到父元素的所有后代元素   |
| 单个兄弟选择器 | `$( "pre+next" )`     | 获取到指定元素的后面一个元素 |
| 部分兄弟选择器 | `$( "parent~next" )`  | 获取到指定元素的后面所有元素 |

下面举例来使用他们，有一个页面如下：

```html
<body>
  <ul>
    <li>AAAA</li>
    <li class="box">CCCC</li>
    <li title="hello"><span>BBBB</span></li>
    <li title="hello"><span>DDDD</span></li>
    <span>EEEE</span>
  </ul>
</body>
```

**需求：**

1. 选择 ul 下的所有的 span 元素。
2. 选择 ul 下的子代 span 元素
3. 选择所有 class 等于 box 的元素。
4. 选择 class 为 box 的下一个兄弟 li 元素。
5. 选择 class 为 box 的后面所有兄弟 li 元素。

```js
// 1. 选择 ul 下的所有的 span 元素。
$("ul span").each(function () {
    console.log(this);
});
// <span>BBBB</span> <span>DDDD</span> <span>EEEE</span>


// 2. 选择 ul 下的子代 span 元素
$("ul>span").each(function () {
    console.log(this);
});
// <span>EEEE</span>

// 3. 选择 class 为 box 的下一个兄弟 li 元素。
$(".box+li").each(function () {
    console.log(this);
});
//之前的元素：<li class="box">CCCC</li>
// <li title="hello"><span>BBBB</span></li>

// 4. 选择 class 为 box 的后面所有兄弟 li 元素。
$(".box~li").each(function () {
    console.log(this);
});
//之前的元素：<li class="box">CCCC</li>
// <li title="hello"><span>BBBB</span></li> 
// <li title="hello"><span>DDDD</span></li>
```

### 4.3 过滤选择器

过滤选择器，在原有选择器匹配的元素中进一步进行过滤的选择器。

其中过滤选择器有分为：

+ 基本筛选——选择第几个 DOM 元素。
+ 内容筛选——对 DOM 元素里面的内容进行筛选
+ 可见性筛选——对 DOM 元素的是否可见进行筛选
+ 属性筛选——对 DOM 元素的 **是否含有某个属性** 或 **属性值等于某个值** 进行筛选
+ 子元素筛选——对 DOM 元素的子元素进行筛选

#### （1）基本筛选

| 编号 | 代码                   | 说明                           |
| ---- | ---------------------- | ------------------------------ |
| 1    | `:first`               | 选择匹配的第一个元素           |
| 2    | `:last`                | 选择匹配的最后一个元素         |
| 3    | `:not("选择器字符串")` | 去除所有与给定选择器匹配的元素 |
| 4    | `:even`                | 匹配所有索引值为偶数的元素     |
| 5    | `:odd`                 | 匹配所有索引值为奇数的元素     |
| 6    | `:eq(index)`           | 匹配一个给定索引值的元素       |
| 7    | `:gt(index)`           | 匹配所有大于给定索引值的元素   |
| 8    | `:lt(index)`           | 匹配所有小于给定索引值的元素   |

有一个页面如下：

```html
<body>
  <div id="div1" class="a1">div1</div>
  <div id="div2" class="a1">div2</div>
  <div id="div3" class="a1">div3</div>
  <div id="div4">div4</div>
</body>
```

下面分别使用上面的元素和方法：

```js
// 1.选择第一个元素 :first 
var $div = $("div:last");
console.log($div);  
// jQuery.fn.init(1)   
//  0: div#div1.a1     
//  length: 1

// 2.选择最后一个元素 :last
$div = $("div:last");
console.log($div);
// jQuery.fn.init(1)   
//  0: div#div4 
//  length: 1

// 3.选择class不是a1的div元素 :not(selector)
var $divs = $("div:not('.a1')");
console.log($divs);
// jQuery.fn.init(1)   
//  0: div#div4 
//  length: 1

// 4.选择偶数索引的div元素 :even
$divs = $("div:even");
console.log($divs);
// jQuery.fn.init(2)
//  0: div#div1.a1
//  1: div#div3.a1

// 5.选择奇数索引的div元素 :even
$divs = $("div:odd");
console.log($divs);
// jQuery.fn.init(2)
//  0: div#div2.a1
//  1: div#div4

// 6.选择索引为2的div元素 :eq(index)
$div = $("div:eq(2)");
console.log($div);
// jQuery.fn.init
//  0: div#div3.a1
//  length: 1

// 7.选择索引大于2的div元素 :gt(index)
$divs = $("div:gt(2)");
console.log($divs);
// jQuery.fn.init
//  0: div#div4
//  length: 1

// 8.选择索引小于2的div元素 :lt(index)
$divs = $("div:lt(2)");
console.log($divs);
// jQuery.fn.init(2)
//  0: div#div1.a1
//  1: div#div2.a1
//  length: 2
```

#### （2）内容筛选

内容筛选可以在原先元素对内容进一步筛选。

| 编号 | 代码                      | 说明                                 |
| ---- | ------------------------- | ------------------------------------ |
| 1    | `:contains("文本字符串")` | 匹配有指定文本字符串的元素           |
| 2    | `:has(“选择器字符串”)`    | 匹配含有选择器所匹配的元素的元素     |
| 3    | `:empty`                  | 匹配所有不包含子元素或者文本的空元素 |
| 4    | `:parent`                 | 匹配含有子元素或者文本的元素         |

有一个页面如下：

```html
<body>
  <div><span>111</span></div>
  <div><p>111</p></div>
  <div>222</div>
  <div></div>
</body>
```

下面分别使用上面的元素和方法：

```js
// 1.选择含有文本为 "111" 的div元素
var $elements = $("div:contains('111')");
console.log($elements);
// jQuery.fn.init(2) 
//  0: div#div1
//  1: div#div2

// 2.选择含有 span 标签的div元素
$elements = $("div:has(span)");
console.log($elements);

// 3.选择里面没有任何内容的div元素
$elements = $("div:empty");
console.log($elements);
// jQuery.fn.init
//  0: div#div4
//  length: 1

// 4.选择含有内容的div元素
$elements = $("div:parent");
console.log($elements);
// jQuery.fn.init(3)
//  0: div#div1
//  1: div#div2
//  2: div#div3
```

#### （3）可见性筛选

可见性筛选，就是在原先的元素中筛选出可见的和不可见的元素。

| 编号 | 代码       | 说明                                       |
| ---- | ---------- | ------------------------------------------ |
| 1    | `:hidden`  | 匹配所有不可见元素，或者type为hidden的元素 |
| 2    | `:visible` | 匹配所有的可见元素                         |

#### （4）子元素筛选

子元素筛选，就是对原先的元素中筛选出需要的子元素。因为涉及到子元素，所以一般都有子代或后代选择器。

<span style="color:red">下面所有传入参数都不是索引，都是从 1 开始计数。</span>

| 编号 | 代码                                               | 说明                                                         |
| ---- | -------------------------------------------------- | ------------------------------------------------------------ |
| 1    | `:first-child`                                     | 匹配所给的祖先选择器的第一个子元素                           |
| 2    | `:last-child`                                      | 匹配最后一个子元素                                           |
| 3    | `:nth-child(index|odd|even)`                       | 匹配其父元素下的 **第 index 个子元素** 或 **奇偶元素**       |
| 4    | `:nth-last-child(index|odd|even|formula)`          | 匹配其父元素下的 **倒数第 index 个子元素** <br />或 **奇偶元素** 或者 **符合某种公式的元素** |
| 5    | `element:first-of-type`                            | 匹配是在其父元素中是第一个 element 元素的元素                |
| 6    | `element:last-of-type`                             | 匹配是在其父元素中是最后一个 element 元素的元素              |
| 7    | `element:nth-of-type(index|even|odd|formula)`      | 匹配是在其父元素中是第几个 element 元素的元素                |
| 8    | `element:nth-last-of-type(index|even|odd|formula)` | 匹配是在其父元素中是 **倒数** 第几个 element 元素的元素      |
| 9    | `:only-child`                                      | 如果某个元素是父元素中唯一的子元素，那将会被匹配             |
| 10   | `:only-of-type`                                    | 先把父元素里子元素分类，然后如果哪一种类型的元素的数量只有一个，则选中他 |

---

首先页面如下：

```html
<body>
  <div id="div1">
    <div>div1的div标签</div>
    <div>
      <p>div1的p标签</p>
    </div>
  </div>

  <p>单独的p标签</p>
  <span>单独的span标签</span>

  <ul>
    <p>ul的p标签</p>
    <li>ul的li标签</li>
    <span>ul的span标签</span>
  </ul>
  
  <div id="div2">
    <p>div2的p标签</p>
    <span>div2的span标签</span>
  </div>
</body>
```

图片示例如下：

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E5%AD%90%E5%85%83%E7%B4%A0%E7%AD%9B%E9%80%89%E7%A4%BA%E4%BE%8B1.png" style="zoom:65%;" />

----

+ 第 2 行：是 p 标签而且是父元素的第一个元素的元素有三个：
  页面代码的第 5 行、第 13 行和第 19 行，而第 9 行不是。下面图片使用碧绿色标识。
+ 第 5 行：div 元素里的最后一个元素，而且是 span 元素的有：
  页面代码的第 20 行，而第 15 行不是，因为其父元素不是 div。

```js
// 选择父元素的第一个子元素是p标签的元素
$("p:first-child").css("background-color", "#bfa");

// 选择div元素里的最后一个元素是span标签的元素
$("div span:last-child").css("background-color", "#4169E1");

// 选择ul标签里的第二个子元素
$("ul :nth-child(2)").css("background-color", "#00FFFF");

// 选择ul标签里的倒数第一个个子元素
$("ul :nth-last-child(1)").css("background-color", "#FFE4C4");
```

图片示例如下：

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E5%AD%90%E5%85%83%E7%B4%A0%E7%AD%9B%E9%80%89%E7%A4%BA%E4%BE%8B2.png" style="zoom:65%;" />

---

+ 第 2 行：选择 p 标签第一次在这个父元素出现的元素，使用红色背景标识。
  + 页面代码里的第 4 ~ 6 行的 div 里只有一个且同时只出现过一次 p 标签；
  + 第 9 行的 p 标签，在 body 是第一次出现。
  + 第 12 ~ 16 行和第 18 ~ 21 行中都有 p 标签。
+ 第 5 行：选择 div 里在不同种类型的只有一个的元素，用红色边框标识。
  + 第 2 ~ 7 行中，因为里面的 div 类型有两个，所以不会选中。
  + 第 18 ~ 21 行中，里面的 span 类型和 p 类型都只有一个，所以会选中。
  + 第 4 ~ 6 行中，因为其满足了 `:first-child` 的条件，所以也满足 `:only-of-type` 的条件。、

```js
// 选择父元素里的第一次出现p类型的元素
$("p:first-of-type").css("background-color", "#bfa");

// 选择div里在不同种类型的只有一个的元素
$("div :only-of-type").css("border", "2px solid red");
```

图片示例如下：

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E5%AD%90%E5%85%83%E7%B4%A0%E7%AD%9B%E9%80%89%E7%A4%BA%E4%BE%8B3.png" style="zoom:65%;" />

#### （5）属性筛选

属性筛选就是筛选属性符合指定条件的元素。

| 编号 | 代码                                | 说明                                                       |
| ---- | ----------------------------------- | ---------------------------------------------------------- |
| 1    | `[attribute]`                       | 匹配含有指定属性的元素                                     |
| 2    | `[attribute=value]`                 | 匹配属性是指定的值的元素                                   |
| 3    | `[attribute!=value]`                | 匹配所有不含有指定的属性，<br />或者属性不等于特定值的元素 |
| 4    | `[attribute^=value]`                | 匹配属性的值是以指定值开头的元素                           |
| 5    | `[attribute$=value]`                | 匹配属性的值是以指定值结尾的元素                           |
| 6    | `[attribute*=value]`                | 匹配属性的值是包含指定值的元素                             |
| 7    | `[selector1][selector2][selectorN]` | 复合属性选择器，需要同时满足多个条件时使用。               |

首先页面如下，几个文本框：

```html
<body>
    <input id="input1" name="input1" /><br/>
    <input name="input1" /><br/>
    <input id="input3" name="input3" /><br/>
    <input id="input4" />
</body>
```

图片示例如下：

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E5%B1%9E%E6%80%A7%E7%AD%9B%E9%80%89%E7%A4%BA%E4%BE%8B1.png" style="zoom:67%;" />

---

+ 第 2 行：选择 id 属性的值不为 " input3 " 的元素，使用红色背景。
  + 页面的第 2 行和第 5 行的值都不为 “ input3 ”。
  + 而第 3 行的没有 id 属性，所以也匹配。
+ 第 5 行：选择既有 id 属性又有 name 属性的元素，使用黑色粗边框。
  + 页面的第 2 行和第 4 行的元素匹配。

```js
// 使用 [attribute!=value] 
$("input[id!='input3']").css("background-color", "red");

// 使用 [selector1][selector2][selectorN]
$("input[id][name]").css("border", "5px solid black");
```

图片示例如下：

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E5%B1%9E%E6%80%A7%E7%AD%9B%E9%80%89%E7%A4%BA%E4%BE%8B2.png" style="zoom:67%;" />

#### （6）表格隔行变色

在许多网站的表格的样式都会使用隔行变色，来美化表格。现在用 jQuery 来实现这个样式。

页面布局如下：

```html
<body>
  <table>
    <tr>
      <th>姓名</th>
      <th>工资</th>
      <th>入职时间</th>
      <th>操作</th>
    </tr>
    <tr>
      <td>Tom</td>
      <td>$3500</td>
      <td>2010-10-25</td>
      <td><a href="javascript:void(0);">删除</a></td>
    </tr>
    <tr>
      <td>Tom</td>
      <td>$3500</td>
      <td>2010-10-25</td>
      <td><a href="javascript:void(0);">删除</a></td>
    </tr>
    <tr>
      <td>Tom</td>
      <td>$3500</td>
      <td>2010-10-25</td>
      <td><a href="javascript:void(0);">删除</a></td>
    </tr>
    <tr>
      <td>Tom</td>
      <td>$3500</td>
      <td>2010-10-25</td>
      <td><a href="javascript:void(0);">删除</a></td>
    </tr>
    <tr>
      <td>Tom</td>
      <td>$3500</td>
      <td>2010-10-25</td>
      <td><a href="javascript:void(0);">删除</a></td>
    </tr>
    <tr>
      <td>Tom</td>
      <td>$3500</td>
      <td>2010-10-25</td>
      <td><a href="javascript:void(0);">删除</a></td>
    </tr>
  </table>
</body>

<style>
  table{
    border-collapse: collapse;
    border: 1px solid black;
    width: 500px;
  }
  table>tbody tr:first-child {
    border: 1px solid black;
    background-color:rgb(0, 162, 255);
  }
  
  th, td{
    border: 1px solid black;
    text-align: center;
  }
</style>
```

原始界面如下，这里的表头有原先的样式，不需要再改变：

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E8%A1%A8%E6%A0%BC%E9%9A%94%E8%A1%8C%E5%8F%98%E8%89%B2%E5%8E%9F%E5%A7%8B.png" style="zoom:70%;" />

所以我们需要在表格的第二行或者第三行开始变色。

+ 第二行开始变色，所选择的行数是【2，4，6】，n 是从 0 开始，则表达式是 `2n`。
+ 第三行开始变色，所选择的行数是【3，5，7】，n 是从 0 开始，则表达式是 `2n+3`。

 js 代码如下：

```js
// 第二行开始变色
// $("table>tbody tr:nth-child(2n)").css("background-color", "rgb(225, 225, 225)");

// 第三行开始变色
$("table>tbody tr:nth-child(2n+3)").css("background-color", "rgb(225, 225, 225)");
```

第三行开始变色示例如下：

![](https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E8%A1%A8%E6%A0%BC%E9%9A%94%E8%A1%8C%E5%8F%98%E8%89%B2%E7%A4%BA%E4%BE%8B.png)

### 4.4 表单选择器

表单选择器可以直接选择不同种的表单类型，还可以选择在指定状态的表单。

具体如下：

| 编号 | 代码                  | 说明                                                |
| ---- | --------------------- | --------------------------------------------------- |
| 1    | `:input`              | 匹配所有 input, textarea, select 和 button 标签     |
| 2    | `:text/:password`     | 匹配单行文本框 / 匹配密码文本框                     |
| 3    | `:radio/:checkbox`    | 匹配单选框 / 匹配多选框                             |
| 4    | `:submit`             | 匹配 type 的值为 submit 的 input 标签及 button 标签 |
| 5    | `:image/:file/:reset` | 匹配 type 的值为 image / file / reset 的 input 标签 |
| 6    | `:button`             | 匹配 type 的值为 button 的 input 标签及 button 标签 |

表单对象属性

| 编号 | 代码        | 说明                                                         |
| ---- | ----------- | ------------------------------------------------------------ |
| 1    | `:checked`  | 匹配所有选中的被选中元素<br />（复选框、单选框等，select 中的 option） |
| 2    | `:selected` | 匹配所有选中的 option 元素                                   |
| 3    | `:enabled`  | 匹配所有可用元素                                             |
| 4    | `:disabled` | 匹配所有不可用元素                                           |

### 4.5 Tab切换

这里做一个小功能，点击上面的标签栏选项，下面的页面进行切换。

页面图片如下所示：

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/Tab%E6%A0%87%E7%AD%BE%E5%88%87%E6%8D%A2.png" style="zoom:67%;" />

页面代码如下：

+ `visibility: hidden;` 与 `display: none;` 的区别：
  + 前者只是隐藏，但占据的位置还存在。
  + 后者是在页面上消失，会触发回流。

```html
<body>
  <ul id="tab">
    <li id="tab1">10元套餐</li>
    <li id="tab2">30元套餐</li>
    <li id="tab3">50元套餐</li>
  </ul>

  <div id="container">
    <div id="content1">2323</div>
    <div id="content2" style="visibility: hidden;">sss</div>
    <div id="content3" style="visibility: hidden;">yyy</div>
  </div>
</body>
</html>

<style>
  #content1, #content2, #content3{
    width: 306px;
    height: 200px;
    border: 3px solid black;
    position:absolute;
  }

  #content1, #tab1{
    background-color: aqua;
  }
  #content2, #tab2{
    background-color: #bfa;
  }
  #content3, #tab3{
    background-color: rebeccapurple;
  }

  #tab{
    width: 400px;
    list-style: none;
    padding: 0px;
    position: relative;
    top: 20px;
  }

  #tab>li{
    height: 100px;
    margin: 0px;
    width: 100px;
    display: inline-block;
  }
</style>
```

js 的代码如下：

+ 使用 `:visible` 来获取到当前显示的元素。
+ 使用 `jQuery对象.index()` 来获取到当前 Tab 标签的索引。
+ 使用 `:nth-child()` 来使用获取到的索引，切换页面。

```js
$("#tab>li").click(function () {
    $("#container :visible").css("visibility", "hidden");
    let temp = $(this).index() + 1;
    $("#container :nth-child(" + temp + ")").css("visibility", "visible");
})
```

需求：

1. 选择第一个 div 
2. 选择最后一个 class 为 box 的元素
3. 选择所有 class 属性不为 box 的 div

## 五、核心对象操作属性

这章将介绍使用核心对象来操作 DOM 元素的属性。

### 5.1 属性的增删

在 HTML 标签中，会有标签原本就有的属性，例如 id ，name 等；也会有自定义属性，例如 vue 里的 v-model。

下面这行代码中，id 是原有属性，test 是自定义属性。

`<div id="div1" test="test"></div>`

添加属性有两种方法：`attr()` 和 `prop()`

其形参都一致：

+ `name`：属性名；只会查找一次。
+ `properties`：普通对象；可以一次修改多个属性。
+ `key, value`：属性名，属性值；设置一个属性。
+ `key,function(index, attr)`：属性名，回调函数；
  + 函数里的 index 为当前 jQuery 对象里 DOM 元素的索引。
  + 函数里的 attr 为旧的属性值。

但两个使用场合不同：

+ `attr()` 的使用的原生方法是 `element.getAttribute()` ，其可以获得 DOM 元素上的 **所有属性**，包括自定义属性。
+ `prop()` 的使用的原生方式是 `element[xxx]` ，**其只能获得原有属性**。

使用上面的代码测试一下：

```js
let $div1 = $("#div1");

// 使用 prop()
console.log($div1.prop("id"));  // div1
console.log($div1.prop("test"));  // undefined

// 使用 attr()
console.log($div1.attr("id"));  // div1
console.log($div1.attr("test"));  // test
```

那么 `prop()` 就完全没有用了吗？ `attr()`的可以获得的属性就包含了 `prop()` 的。

其实 jQuery 的 `prop()` 和原生的 `element[xxx]` 都可以获得表单的当前状态。最典型的例子就是单选框和多选框。

<span style="color:red">因为我们点击单选框或者多选框时，DOM 元素中的 checked 的属性都不会改变。</span>

**总结：** 当属性值为布尔值时，例如 checked，selected，disabled，使用 `prop()` ，其他则使用 `attr()`

---

有添加当然也有删除：

| 编号 | 代码               | 说明         |
| ---- | ------------------ | ------------ |
| 1    | `removeAttr(name)` | 删除所有属性 |
| 2    | `removeProp(name)` | 删除原有属性 |

### 5.2 类的增删

类作为 DOM 元素的属性，也是可以操作的。可以进行增加、删除和切换。

+ `addClass/removeClass( class | fn )`
  + `class`：需要增加 / 删除的类名，如果是多个类名，需要传递数组。
  + `fn( index , class )`：回调函数。index 当前所遍历的对象在原先 jQuery 对象中的索引，class 为旧的 class 值。
+ `toggleClass(class | fn [,sw])`
  + `class`：需要切换的类名，如果是多个类名，需要传递数组。
  + `fn( index ,className ,state ) [,sw]`：回调函数，返回一个类名字符串或者类名数组。
    + index 当前所遍历的对象在原先 jQuery 对象中的索引；
    + className 为旧的 class 值；
    + state 为 `toggleClass()` 的第二个参数的值；
    + sw，可选参数，用于标识样式是增加还是删除。

### 5.3 文本的增改

jQuery 提供了三个方法来操作文本属性：

+ `html( [val|fn] )`：
  + `val`：用于设定HTML内容的值；
  + `function( index, html )`：此函数返回一个 HTML 字符串。自动传入两个参数，index 为元素在集合中的索引位置，html为原先的 HTML 的值。
  + 无参数：返回 jQuery 对象中第一个 DOM 元素的 HTML 的值，与 `element.innerHTML` 一致。
+ `text( [val|fn] )`：
  + `val`：用于设定文本内容的值；
  + `function( index, text )`：此函数返回一个文本字符串。自动传入两个参数，index 为元素在集合中的索引位置，text 为原先的 text 的值。
  + 无参数：返回 jQuery 对象中所有 DOM 元素的文本内容组合起来的文本。
+ `val( [val | fn | arr] )`：
  + `val`：要设置的值；
  + `function(index, value)`：此函数返回一个要设置的值。自动传入两个参数，index 为元素在集合中的索引位置，value 为原先的 value 值。
  + `arr`：数组，用于设置 check 和 select 的选项，**填入需要选中的选项的 name 值**。
  + 无参数：返回 jQuery 对象中第一个 DOM 元素的 value 的值，**若 DOM 元素是 select 下拉框元素，则会返回一个数组**。

## 六、核心对象操作样式

我们也可以对 jQuery 对象直接操作 css 样式，例如背景颜色、位置等。

### 6.1 直接操作css

+ 获取到的指定样式属性的属性值。
  + `.css( propertyName )`：传入一个属性名字符串。
  + `.css( propertyNames )`：传入一个属性名字符串数组。
+ 设置指定样式属性的属性值。
  + `.css( propertyName, value )`：传入一个属性名字符串和属性值字符串。
  + `.css( propertyName, function(index, value) )`：传入一个属性名字符串和一个回调函数。回调函数需要返回一个属性值字符串，自动传入两个参数，index 为元素在集合中的索引位置，value 为原先的 value 值。
  + `.css( properties )`：传入一个普通对象，用于一次设置多个属性的值。

### 6.2 操作元素的位置

操作元素的位置有四个方法，两个是操作元素在页面的位置，另外两个是操作滚动条位置。

#### （1）操作元素在页面的位置

操作元素在整个页面的坐标：

+ `.offset()`：返回一个对象，对象里有 left 和 top 属性。作用是得到当前元素的整个页面的坐标。对于设置了 `visibility:hidden` 的元素，仍然可以获取到坐标，但设置了`display:none` 的元素，获取不到其坐标。
+ `.offset( coordinates )`：传入一个普通对象，普通对象里需要有 left 和 top 属性。作用设置元素在整个页面的坐标。
+ `.offset( function(index, coords) )`：传入一个回调函数。该回调函数需要返回一个普通对象，普通对象里需要有 left 和 top 属性。函数里自动传入两个参数，index 为元素在集合中的索引位置，coords 为原先的坐标值。

获取元素在 **相对于偏移父元素的坐标**：

+ `.position()`：返回一个对象，对象里有 left 和 top 属性。

举一个例子：

有一个页面如下：

```html
<body>
  <div id="div1">
    <div id="div2">
    </div>
  </div>
</body>

</html>
<style>
  * {
    margin: 0px;
    padding: 0px;
  }

  #div2 {
    background-color: aqua;
    width: 100px;
    height: 100px;
    position: relative;
    top: 50px;
    /* z-index: 1; */
  }

  #div1 {
    background-color: rebeccapurple;
    width: 300px;
    height: 300px;
    top: 50px;
    left: 50px;
    position: absolute;
  }
</style>
```

页面示例如下：

![](https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/jQ%E7%9B%B8%E5%AF%B9%E8%B7%9D%E7%A6%BB%E5%92%8C%E7%BB%9D%E5%AF%B9%E8%B7%9D%E7%A6%BB.png)

然后使用上面的方法分别获得两个 div 的位置。

```js
var $div1 = $("#div1");
var $div2 = $("#div2");

// 大div的真实位置：
// {"top": 50,"left": 50 } 
console.log($div1.offset());

// 小div的真实位置：
// {"top": 100,"left": 50 } 
console.log($div2.offset());

// 大div相对于body的位置：
// {"top": 50,"left": 50 } 
console.log($div1.position());

// 小div相对于大div的位置：
// {"top": 50,"left": 0 } 
console.log($div2.position());
```

#### （2）操作页面的滚动

获取垂直滚动距离：

+ `.scrollLeft()`

设置垂直滚动距离：

+ `.scrollLeft( value )`

获取水平滚动距离：

+ `.scrollTop()`

设置垂直滚动距离：

+ `.scrollTop( value )`

可以使用这些方法来实现返回顶端的功能：

+ `$("html").scrollTop(0);`

之前提到过，如果子元素内容过多，父元素会产生滚动条，所以滚动条是 **属于父元素** 的。body 标签的内容过多，html 标签就产生滚动条。

如果需要平滑的返回顶端，原生 JS 提供了相对应的方法。

```js
$("#top").click(function () {
    window.scrollTo({
        top: 0,
        // 可以填写三个参数：
        // smooth(平滑滚动),instant(瞬间滚动),默认值auto
        behavior: "smooth"
    });
})
```

### 6.3 操作元素的尺寸

元素的尺寸分为三种类型，内容尺寸、内部尺寸和外部尺寸。

+ 内容尺寸：内容尺寸就是元素的 height 和 weight 值
  + `height( [val | fn] )`
  + `weight( [val | fn] )`
+ 内部尺寸：内部尺寸就是元素的内容尺寸加上 padding 的值。
  + `innerHeight()`
  + `innerWidth()`
+ 外部尺寸：外部尺寸就是在元素的内部尺寸加上 border 的值，也可以同时加上 margin 的值。
  + `outerHeight( [options] )`
  + `outerWidth( [options] )`
  + `options` ：可选参数，填写 true 时，就会加上 margin 的值。

举一个例子：

有一个页面如下：

+ div1 里有 div2 
+ div1 的宽度为 300，高度为 300
+ div1 的 margin 为 50，边框为 10，padding 为 30

```html
<body>
  <div id="div1">
    <div id="div2">
    </div>
  </div>
</body>

</html>
<style>
  * {
    margin: 0px;
    padding: 0px;
  }

  #div2 {
    background-color: aqua;
    width: 100px;
    height: 100px;
    position: relative;
  }

  #div1 {
    background-color: rebeccapurple;
    width: 300px;
    height: 300px;
    padding: 30px;
    border: 10px solid seagreen;
    position: absolute;
    margin: 50px;
  }
</style>
```

图片示例如下：

![](https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/jQ%E5%85%83%E7%B4%A0%E7%9A%84%E5%B0%BA%E5%AF%B8.png)

分别使用上面的函数：

```js
console.log($("#div1").height()); // 300
console.log($("#div1").innerHeight());  // 360 = 300 + 30(padding) * 2 
console.log($("#div1").outerHeight());  // 380 = 360 + 10(border) * 2
console.log($("#div1").outerHeight(true));  // 480 = 380 + 50(margin) * 2
```

## 七、总结

根据上面所学的内容，继续完善 jQuery 手册的标记。

![](https://github.com/hahg2000/picture/blob/Senior-JS/jQuery%E6%89%8B%E5%86%8C%E7%9B%AE%E5%BD%95-%E6%A0%87%E8%AE%B04.png)

