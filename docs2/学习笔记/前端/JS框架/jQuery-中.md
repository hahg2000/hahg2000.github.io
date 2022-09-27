# jQuery-中

## 一、jQuery对象的筛选和查找

**筛选：** 在已查找出来的集合中进行再次过滤，过滤出不需要的。与并集选择器的功能相似。

**查找：** 以当前的集合为起点，进行向外查找需要的元素。或者说在当前元素的 DOM 节点树查找。

### 1.1 筛选

首先有以位置为条件的筛选：

+   `eq( index | -index )`
  + 获取当前链式操作中索引为 n 的 jQuery 对象，返回 jQuery 对象。
  + 参数大于0，正向选取；参数小于0，反向选取。
  + 类似的有 `get(index)`,不过 `get(index)` 返回的是 DOM 对象。
  + 与选择器 `:eq(index)` 类似。
+ `first()`
  + 获取第一个元素。
  + 与选择器 `:first` 类似。
+ `last()`
  + 获取最后一个元素。
  + 与选择器 `:last` 类似。

然后是以参数为条件的筛选：

+ `is( selector | selection | elements | fn)`：返回布尔值，判断当前 jQuery 对象是否符合参数条件。
  + `selector`：选择器字符串。
  + `selection`：jQuery 集合。
  + `elements`： 一个或者多个 DOM 元素。
  + `fn` ：`Function( Integer index, Element element ) => Boolean`

+ `hasClass(class)`
  + 检查当前的元素是否含有某个特定的类。
  + 与 `is("." + class)` 一样。
+ `fliter( selector | selection | elements | fn )`：返回 jQuery 对象，找到符合参数条件的元素。
  + `selector`：选择器字符串。
  + `selection`：jQuery 集合。
  + `elements`： 一个或者多个 DOM 元素。
  + `fn` ：`Function( Integer index, Element element ) => Boolean`
+ `not( selector | selection | fn )`：从匹配元素的集合中删除与指定表达式匹配的元素
  + `selector`：选择器字符串。
  + `selection`：jQuery 集合。
  + `fn` ：`Function( Integer index, Element element ) => Boolean`

也可以以孩子为条件筛选：

+ `has( selector | contained )`：选择包含特定后代的元素。
  + `selector`：选择器字符串。
  + `contained`：一个 DOM 元素。

下面举一个例子，来使用这些方法。

页面代码如下：

```html
<body>
  <ul>
    <li>AAA</li>
    <li title="hello">BBB</li>
    <li>CCC</li>
    <li title="hello">DDD</li>
    <li><span>EEE</span></li>
  </ul>
</body>
```

有如下需求：

1. 选择 li 标签的第一个元素；
2. 选择 li 标签的最后一个元素；
3. 选择 li 标签的第二个元素；
4. 选择 title 属性为 hello 的 li 标签；
5. 选择 title 属性不为 hello 的 li 标签；
6. 选择子元素有 span 标签的 li 标签。

jQuery 代码如下：

```js
// 1. li标签的第一个元素
console.log($lis.first().html());  // AAA

// 2. li标签的最后一个元素
console.log($lis.last().html());  // <span>EEE</span>

// 3. li标签的第二个元素
console.log($lis.eq(1).html());  // BBB

// 4. title属性为hello的li标签
console.log($lis.filter("[title='hello']").html());  // BBB

// 5. title属性不为hello的li标签
console.log($lis.filter(":not([title='hello'])"));  
console.log($lis.not("[title='hello']"));  

// 6. 子元素有span标签的li标签
console.log($lis.has("span").html()); // <span>EEE</span>
```

### 1.2 查找

**查找：**以当前的集合为起点，进行向外查找需要的元素。或者说在当前元素的 DOM 节点树查找。

首先是当前元素为起点，查找其拥有元素。

+ `children( [selector] )`：查找子代元素
  + `selector`：可选参数，选择器字符串。用于对子元素进行筛选。
+ `find( selector | element )`：查找后代元素
  + `selector`：选择器字符串。
  + `element`：DOM 元素或者 jQuery 对象。 

其次是当前元素为起点，查找其被哪些元素拥有。

+ `parent( [selector] )`：查找父元素
  + `selector`：可选参数，选择器字符串。用于对父元素进行筛选。
+ `.parents( [selector] )`：查找祖先元素。
  + `selector`：可选参数，选择器字符串。用于对祖先元素进行筛选。
+ `parentsUntil( [selector] | [selection] [, filter] )`：查找祖先元素，直到遇到符合指定选择器的元素，不包括匹配到的元素。
  + `selector`：可选参数，选择器字符串。
  + `selection`：可选参数，DOM 元素或者 jQuery 对象。在 jQuery 1.6 版本之后。
  + `filter`：可选参数，对查找结果进一步筛选。

然后是其次是当前元素为起点，查找其兄弟元素。

+ `next/prev( [selector] )`：查找下一个元素 / 查找上一个元素
  + `selector`：可选参数，选择器字符串。用于筛选。
+ `nextAll/prevAll( [selector] )`：查找 当前元素之后的所有元素 / 查找当前元素之前 的所有元素。
  + `selector`：可选参数，选择器字符串。用于筛选。

+ `nextUntil/ prevUntil( [selector] | [selection] [, filter] )`：查找 之后 / 之前 的元素，直到遇到符合指定选择器的元素，不包括匹配到的元素。
  + `selector`：可选参数，选择器字符串。
  + `selection`：可选参数，DOM 元素或者 jQuery 对象。在 jQuery 1.6 版本之后。
  + `filter`：可选参数，对查找结果进一步筛选。

+ `.siblings( [selector] )`：查找当前元素的兄弟节点
  + `selector`：可选参数，选择器字符串。

下面举一个例子来使用 `parentsUntil()` 方法。

有一个页面如下：

```html
<body>
  <ul id="t1" title="t1">
    <li id="t2" title="t2">
      <ul id="t3">
        <li id="t4" title="t4">
        </li>
      </ul>
    </li>
  </ul>
</body>
```

jQuery 代码如下：

+ 第一个输出：以 id 为 t4 的 li 元素为起点，找到祖先元素是 ul 且有 title 属性的元素。
  + 找到 id 为 t3 的 ul 元素，因为其父元素的父元素符合条件。
  + 找到 id 为 t2 的 li 元素，因为其父元素符合条件。
+ 第二个输出：在第 2 的条件下加上函数的第二个参数——筛选条件，就会对结果进一步筛选，这里保留的是 ul 元素。
+ 第三个输出：以 id 为 t4 的 li 元素为起点，找到祖先元素的 id 为 t3 的元素。只找到了起点的父元素符合标准，但是这个函数不会包括符合条件的元素，所以没有 DOM 元素找到。

```js
// 以id为t4的li元素为起点，找到祖先元素是ul且有title属性
console.log($("#t4").parentsUntil("ul[title]"));
// jQuery.fn.init(2)
//  0: ul#t3
//  1: li#t2

// 以id为t4的li元素为起点，找到祖先元素是ul且有title属性，最后查找到的元素是ul元素
console.log($("li[title='t4']").parentsUntil("ul[title]", "ul"));
// jQuery.fn.init(1)
//  0: ul#t3

// 以id为t4的li元素为起点，找到祖先元素的id为t3
console.log($("#t4").parentsUntil("#t3"));
// jQuery.fn.init(0)
```

## 二、全选练习

我们现在使用 jQuery 来完成 原生 JS 中的全选练习。

页面代码如下：

```html
<body>
  <form method="POST" action="">
    你喜欢的运动是？
    <br />
    <input type="checkbox" name="allCheckOrNot" id="allCheckOrNot" /> 全选/全不选
    <br />
    <input type="checkbox" name="items" value="足球" id="football" />
    <label for="football">足球</label>
    <input type="checkbox" name="items" value="篮球" id="basketball" />
    <label for="basketball">篮球</label>
    <input type="checkbox" name="items" value="羽毛球" id="badminton" />
    <label for="badminton">羽毛球</label>
    <input type="checkbox" name="items" value="乒乓球" id="tableTennis" />
    <label for="tableTennis">乒乓球</label>
    <br />
    <input type="button" id="checkedAllBtn" value="全 选" />
    <input type="button" id="checkedNoBtn" value="全 不 选" />
    <input type="button" id="checkedRevBtn" value="反 选" />
    <input type="button" id="sendBtn" value="提 交" />
  </form>
</body>
```

页面示例如下：

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E5%85%A8%E9%80%89%E7%BB%83%E4%B9%A0%E7%A4%BA%E4%BE%8B.png" style="zoom:80%;" />

#### （1）实现全选和全不选

1. 第 2 行：为全选按钮绑定单击监听。
2. 第 1 行，获取到 name 属性为 items 的多选框元素。
3. 第 3 行，再使用获取到的多选框元素全部设置为未选中。
4. 第 4 行，同时将上面的 全选/全不选 按钮勾上。

```js
var $items = $(":checkbox[name='items']");
$("#checkedAllBtn").click(function () {
    $items.prop("checked", true);
    $("#allCheckOrNot").prop("checked", true);
});
```

同理，全不选也是如此。

```js
$("#checkedNoBtn").click(function () {
    $items.prop("checked", false);
    $("#allCheckOrNot").prop("checked", false);
});
```

#### （2）实现反选

1. 第 3 ~ 5 行：我们可以使用 each() 函数来对每一个元素的选中状态进行反转。
2. 第 8 ~ 11 行：我们可以使用 jQuery 里的隐式循环来完成状态反转。
3. 第 13 ~ 17 行：当点击反选后，查找当前被选择的多选框的数量，来判断 全选/全不选 按钮是否选择，也可以使用第 18 行，直接将判断结果作为参数。

```js
$("#checkedRevBtn").click(function () {
    // 使用each()函数
    // $items.each(function (index, element) {
    //   element.checked = !element.checked;
    // })

    // 使用prop()的第二个参数
    $items.prop("checked", function(index, attr) {
        this.checked = !attr;
    });
	
    // 根据当前被选择的多选框的数量来判断 全选/全不选 按钮是否选择
    // if ($items.filter(":checked").length === $items.length) {
    //     $("#allCheckOrNot").prop("checked", true);
    // } else {
    //     $("#allCheckOrNot").prop("checked", false);
    // }
     $("#allCheckOrNot").prop("checked", $items.filter(":checked").length === $items.length);
})
```

#### （3）实现提交

提交功能很简单，使用 filter() 方法查找出已被选上的元素，再输出元素的 value 值。

```js
$("#sendBtn").click(function () {
    $items.filter(":checked").each(function (index, item) {
        console.log(this.value);
    });
});
```

#### （4）实现 全选/全不选

全选/全不选也很简单，每次把四个按钮设置为 全选/全不选 按钮的选中状态。

```js
$("#allCheckOrNot").click(function () {
    $items.prop("checked", this.checked);
});
```

#### （5）实现自动勾选

与实现反选的代码的第 13 ~ 18 行一致。

```js
 $items.click(function () {
    // if ($items.filter(":checked").length === $items.length) {
    //   $("#allCheckOrNot").prop("checked", true);
    // } else {
    //   $("#allCheckOrNot").prop("checked", false);
    // }
    $("#allCheckOrNot").prop("checked", $items.filter(":checked").length === $items.length);
  });
```

## 三、文档处理

在运行 JS 文件时，一大部分的时间是查找 DOM 元素，前面已学过，还有一大部分的时间是操作 DOM 元素，接下来就介绍如何操作 DOM 元素，即文档处理。

### 3.1 插入子元素

插入当前元素的子元素，有四个方法。

+ `append( content [, content] )`：在当前元素的子元素 **末尾** 添加元素。
  + `append( function )`
+ `prepend( content [, content] )`：在当前元素的子元素 **开头** 添加元素。
  + `prepend( function )`

参数：

+ `content`： 可以是 HTML 字符串——htmlString，可以是DOM元素——Element，可以是文本元素——Text ，可以是元素数组——Array，也可以是 jQuery 对象——jQuery。
+ `function`： `Function( Integer index, String html ) => htmlString or Element or Text or jQuery`

---

+ `appendTo( target )`：将当前元素添加到指定目标元素的里面的最后面。
+ `prependTo( target )`：将当前元素添加到指定目标元素的里面的最前面。

参数：

+  **可以是选择器字符串——Selector**，可以是 HTML字符串——htmlString，可以是DOM元素——Element，可以是文本元素——Text ，可以是元素数组——Array，也可以是 jQuery 对象——jQuery

### 3.2 插入兄弟元素

在查找到的元素旁边插入元素。与上面的方法很类似。也有正插和反插。

+ `after( content [, content] )`：在当前元素的 **后面** 添加元素。
  + `after( function )`
+ `before( content [, content] )`：在当前元素的子元素 **前面** 添加元素。
  + `before( function )`

+ `insertAfter( target )`：将当前元素添加到指定目标元素的后面。
+ `insertBefore( target )`：将当前元素添加到指定目标元素的前面。

参数都与 3.1 节一致。

### 3.3 替换元素

替换元素有两种方法，分别为：

+ `replaceWith( newContent )`：将当前元素替换成 **参数所传的值**。
  + `newContent`：htmlString or Element or Array or jQuery
+ `replaceAll( target )`：将当前元素 **去替换** 参数所代表的元素。
  + `target`：**Selector** or jQuery or Array or Element

### 3.4 删除元素

删除元素有两种方法，分别为：

+ `empty()`：清空当前元素的 **所有子元素**。
+ `remove( [selector] )`：删除当前元素。不仅 DOM 元素被删除，而且绑定在元素的事件和附加数据都会被删除。不过其不会在 jQuery 对象中删除。
  + `selector`：选择器字符串，对当前元素筛选出需要删除的元素。
+ `.detach( [selector] )`：删除当前元素。虽然 DOM 元素被删除，但是绑定在元素的事件和附加数据都不会被删除。也不会在 jQuery 对象中删除。

### 3.5 示例

下面的示例使用上面所提到的方法。

页面代码如下：

```html
<body>
  <ul>
    <li>AAA</li>
    <li id="bbb">BBB</li>
    <li id="ccc">CCC</li>
    <li>DDD</li>
    <li>EEE</li>
  </ul>
</body>
```

起始页面如下：

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E6%96%87%E6%A1%A3%E5%A4%84%E7%90%86%E5%8E%9F%E5%A7%8B.png" style="zoom:70%;" />

jQuery 代码如下：

```js
//1. 往ul的第一个子元素前面添加元素
$("ul").prepend("<li>插入到第一个元素之前</li>");

//2. 往ul的最后一个子元素后面添加元素
$("ul").append("<li>插入到最后一个子元素之后</li>");

//3. 往 id 为 ccc 的 li 元素前面添加元素
$("#ccc").after("<li>插入到ccc之后</li>");

//4. 往 id 为 ccc 的 li 元素后面添加元素
$("#ccc").before("<li>插入到ccc之前</li>");

//5. 将 id 为 bbb 的元素替换
// $("<li>替换bbb</li>").replaceAll("#bbb");
$("#bbb").replaceWith("<li>替换bbb</li>");
```

执行完毕后的页面如下：

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E6%96%87%E6%A1%A3%E5%A4%84%E7%90%86%E8%BF%90%E8%A1%8C%E7%BB%93%E6%9E%9C.png" style="zoom:70%;" />

## 四、事件处理

jQuery 对事件处理分有几个方面：

+ 页面载入
+ 事件处理
+ ~~事件委派（3.0已全部弃用）~~
+ 事件切换
+ 事件

### 4.1 事件载入

事件载入在之前提过，就是 `$( document ).ready( function(){} )` 或者 `$( function(){} )`

其与 `window.onload( function(){} )`的区别是：

+ 加载的时机不同，前者是仅在 DOM 树加载完成时调用，不包括图片等一些页面资源。后者则是在页面全部资源加载完成后执行。
+ 绑定事件数量不同，前者可以绑定多个 `ready` 事件，后者则只能绑定一个 `load` 的事件。

下面举一个例子：有一个页面，页面里只有一张图片，图片是百度的 logo。

```html
<body>
  <img
    src="https://bkimg.cdn.bcebos.com/pic/b8014a90f603738da97755563251a751f81986184626?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2UyNzI=,g_7,xp_5,yp_5/format,f_auto"
    alt="" />
</body>
```

然后分别调用上面的所提到的方法。

1. 无论是 `onload` 和 `ready` 事件都会加入到循环队列里，所以第 9 行先输出。
2. 然后 `ready` 事件先于 `onload` 事件所以会先输出第 6 行，最后输出第 2 行。 

```js
window.onload = function () {
    console.log("onload",$("img").width());
};

$(function () {
    console.log("ready",$("img").width());
});

console.log("执行js代码");

// 分别输出
// 1. 执行js代码
// 2. ready 0
// 3. onload 2032
```

### 4.2 事件处理

事件处理包括事件绑定和解除以及触发。

#### （1）事件绑定

+ `.on( events [, selector ] [, data ] [, handler ] )`：为元素绑定指定的事件。
  + `events`：事件字符串。
  + `selector`：选择器字符串，用于筛选当前 jQuery 对象，可以实现事件委托功能。
  + `data`：触发事件时要传递给 `event.data` 中的处理程序的数据。
  + `handler`：当事件触发时，所执行的回调函数。
+ `.one( events [, selector ] [, data ] [, handler ] )`：为元素绑定一次性事件。

#### （2）事件解除

+ `.off( events [, selector ] [, handler ] )`：为元素解除指定的事件。
  + 如果需要解除当前元素的所有委托，可以执行代码 `$( "selector" ).off( "events", "**" );`

#### （3）事件触发

使用 JS 来修改 DOM 元素不会触发事件，所以需要手动触发事件。

+ `.trigger( eventType [, extraParameters ] )`：模拟真实的触发事件，会在 DOM 树上触发事件的冒泡和委托。
  + `eventType`：触发的事件字符串
  + `extraParameters`：数组或者普通对象。触发事件后传递给回调函数的数据。
+ `.triggerHandler( eventType [, extraParameters ] )`：只会触发指定的事件，不会触发事件的冒泡和委托。

### 4.3 事件的切换

事件的切换提供了两个方面：鼠标移出移入和元素的显示隐藏

+ `hover( [ handlerIn, ] handlerOut )`：鼠标移出移入，与 `jQuery对象.mouseenter().mouseleave()` 作用一致。
  + `handlerIn`：鼠标移入所执行的回调函数。
  + `handlerOut`：鼠标移出所执行的回调函数。
+ `toggle( duration [, easing ] [, complete ] )`：设置显示隐藏元素的效果。
  + `duration`：字符串或者整型。效果执行的时间。
  + `easing`：效果执行过程中的速率变化。默认为 `swing`，执行速率先增大再减少。可选参数`linear` ，执行速率不变。
  + `complete`：效果运行完毕后，执行的回调函数。
+ `toggle( display )`：设置元素是否显示。
  + `display`：布尔值，用于设置元素是否显示。

### 4.4 事件

大多数事件都可以像单击事件 `click()` 那样直接调用方法来绑定，不需要必须使用 `on()` 方法来绑定。

#### （1）鼠标移入移出

鼠标移入移出，jQuery 提供了两对方法：

+ `mouseover( [eventData], handler )`：在移动到当前元素触发，**移动其子元素也会触发**。
+ `mouseout( [eventData], handler )`：在移出当前元素触发，**移出其子元素也会触发**。
  + `eventData`：任何类型，传递给回调函数的参数。
  + `handler`：回调函数，当事件触发时执行的函数。

---

+ `mouseenter( [eventData], handler )`：在移动到当前元素触发，**移动其子元素不会触发**。
+ `mouseleave( [eventData], handler )`：在移出当前元素触发，**移出其子元素不会触发**。

#### （2）event对象

当触发事件时，会有一个隐式参数 event 对象。

+ 我们可以使用其对象里有许多有用的数据。例如 `event.offsetX` 、`event.target`。
+ 我们可以通过其来阻止事件冒泡。使用`event.stopPropagation()` 方法。
+ 我们可以通过其来阻止浏览器的默认行为。使用 `event.preventDefault()` 方法。

## 五、添加删除记录

下面做原生 JS 所做过的练习——添加删除记录。

### 5.1 页面布局

页面代码如下：

```html
<body>
  <table border="1" style="position: relative;left: 35%;" id="userTable">
    <tr>
      <th>名字</th>
      <th>邮箱</th>
      <th>年龄</th>
      <th>操作</th>
    </tr>

    <tr>
      <td>Tom</td>
      <td>123@qq.com</td>
      <td>13</td>
      <td><a href="javascript:;">delete</a></td>
    </tr>
    <tr>
      <td>Jack</td>
      <td>456@qq.com</td>
      <td>16</td>
      <td><a href="javascript:;">delete</a></td>
    </tr>
    <tr>
      <td>Tim</td>
      <td>789@qq.com</td>
      <td>21</td>
      <td><a href="javascript:;">delete</a></td>
    </tr>
  </table>

  <form style="position: relative;left: 35%; padding-top: 50px;" id="addForm">
    姓名：<input type="text" name="" id="name" /><br />
    邮箱：<input type="text" name="" id="email" /><br />
    年龄：<input type="text" name="" id="age" /><br />
    <button type="button" id="addBtn">添加</button>
  </form>
</body>
```

页面图片示例如下：

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%B7%BB%E5%8A%A0%E5%88%A0%E9%99%A4%E8%AE%B0%E5%BD%95%E7%95%8C%E9%9D%A2.png" style="zoom:80%;" />

实现的功能：

1. 在文本框中输入信息后点击按钮就可以添加到表格中。
2. 点击删除按钮就可以删除当前行数据。

### 5.2 jQuery代码

#### （1）提交信息

1. 第 1 行：为提交按钮绑定单击事件
2. 第 2 ~ 4 行：当点击提交按钮时，分别获取姓名、email 和 年龄的文本框的内容。
3. 第 6 行：使用 html 字符串作为参数，将其包装成 jQuery 对象，以便调用其里面的方法。
4. 第 7 ~ 10 行：使用了 jQuery 的特性——链式调用来逐步往 tr 标签里添加内容。
5. 第 11 行：因为当前有的是添加的数据，所以直接调用 `appendTo()` 方法来添加到表格里面，不需要先存到一个变量里，再调用 `append()` 方法。

```js
$("#addBtn").click(function () {
    let name = $("#name").val();
    let email = $("#email").val();
    let age = $("#age").val();

    $("<tr></tr>")
      .append("<td>" + name + "</td>")
      .append("<td>" + email + "</td>")
      .append("<td>" + age + "</td>")
      .append("<td><a href='javascript:;'>delete</a></td>")
      .appendTo("#userTable>tbody");
  });
```

#### （2）删除当前行

实现删除当前行，需要为每一个删除按钮绑定单击事件，如果要为新添加的数据也绑定同样的单击事件，就要事件委托，用  `on()` 方法。

+ 第 1 行：方法的第二个参数传入 " a " ，意思是将 a 标签的单击事件委托给 userTable 元素。
+ 第 5 ~ 7 行：使用 `:contains()` 选择器来获取到 ” 名字 “ 所在列的索引。
+ 第 10 行：根据名字索引，提取出当前行的名字信息。
+ 第 12 ~ 14 行：弹出提示框。

```js
$("#userTable").on("click", "a", function () {
    let $tr = $(this).parents("tr");

    // 获取到名字的列索引
    let nameIndex = $tr.prevAll(":last")
    .children(":contains('名字')")
    .index();

    // 根据列索引取出提示的名字
    let name = $tr.children(":eq(" + nameIndex + ")").html();
    
    if (confirm("请问是要删除 " + name + " 吗？")) {
        $tr.remove();
    }
});
```

## 六、效果

### 6.1 内置动画

#### （1）淡入淡出

淡入淡出的动画效果是：改变元素的透明度，最后将元素改变 `display:none`。

+ `fadeIn/fadeout/fadeToggle( [duration ] [, easing ] [, complete ] )`：显示 / 隐藏 / 动画切换 元素
  + `duration`：字符串或者整型。效果执行的时间。字符串可选："slow"，"normal"， "fast"。
  + `easing`：效果执行过程中的速率变化。默认为 `swing`，执行速率先增大再减少。可选参数`linear` ，执行速率不变。
  + `complete`：效果运行完毕后，执行的回调函数。
+ `fadeIn/fadeout/fadeToggle( options )`
  + `options`：普通对象。设置方法的一些参数。

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E6%B7%A1%E5%85%A5%E6%B7%A1%E5%87%BA%E7%A4%BA%E6%84%8F%E5%9B%BE.gif" style="zoom:70%;" />

#### （2）缩小放大

缩小放大的动画效果是：改变元素的高度，最后将元素改变 `display:none`。

+ `slideUp/slideDown/slideToggle( [duration ] [, easing ] [, complete ] )`：显示 / 隐藏 / 动画切换 元素。
+ `slideUp/slideDown/slideToggle( options )`

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E7%BC%A9%E5%B0%8F%E6%94%BE%E5%A4%A7%E7%A4%BA%E6%84%8F%E5%9B%BE.gif" style="zoom:70%;" />

#### （3）显示隐藏

显示隐藏的动画效果是：改变元素的高度和高度，最后将元素改变 `display:none`。

+ `show/hide/toggle( [duration ] [, easing ] [, complete ] )`：显示 / 隐藏 / 动画切换 元素。
+ `show/hide/toggle( options )`
+ `show/hide/toggle()`：立即 显示 / 隐藏 / 动画切换 元素。

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E6%98%BE%E7%A4%BA%E9%9A%90%E8%97%8F%E7%A4%BA%E6%84%8F%E5%9B%BE.gif" style="zoom:70%;" />



### 6.2 自定义动画

我们可以使用自定义动画来做出我们自己所需的动画。

+ `animate( properties [, duration ] [, easing ] [, complete ] )`
  + `properties`：执行完动画的最终数据。若不知道最终数据，可以使用 `+= / -=` 等符号来直接设置所移动的距离。
  + `duration`：字符串或者整型。效果执行的时间。字符串可选："slow"，"normal"， "fast"。
  + `easing`：效果执行过程中的速率变化。默认为 `swing`，执行速率先增大再减少。可选参数`linear` ，执行速率不变。
  + `complete`：效果运行完毕后，执行的回调函数。

我们也可以在需要时停止动画。

+ `stop( [clearQueue ] [, jumpToEnd ] )`：停止动画。
  + `clearQueue`：是否清除动画队列。
  + `jumpToEnd`：是否立即完成当前这一步的动画。
+ `finish( [queue] )`：停止动画。清除动画队列，立即完成动画队列里的动画。
  + `queue`：停止动画的队列名称。

我们也可以对动画效果进行延迟。

+ `delay( duration [, queueName ] )`：延迟执行动画。
  + `duration`：整型，延迟的时间。
  + `queue`：停止动画的队列名称。

## 七、轮播图

### 7.1 简介

我们使用 jQuery 做一个较完整的轮播图。

轮播图效果如下：

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/jQ%E8%BD%AE%E6%92%AD%E5%9B%BE%E7%A4%BA%E4%BE%8B.gif" style="zoom:60%;" />

### 7.2 页面布局

```html
<body>
  <div id="outer">
    <div id="leftBtn"><a href="javascript:;"><img src="左箭头.png" /></a></div>
    <div id="rightBtn"><a href="javascript:;"><img src="右箭头.png" /></a></div>
    <ul id="imgList">
      <li><img src="../图片/A4.JPG" /></li>
      <li><img src="../图片/A1.JPG" /></li>
      <li><img src="../图片/A2.JPG" /></li>
      <li><img src="../图片/A3.JPG" /></li>
      <li><img src="../图片/A4.JPG" /></li>
      <li><img src="../图片/A1.JPG" /></li>
    </ul>
    <ul id="nav">
      <li><a href="javascript:;" style="background-color: red;"></a></li>
      <li><a href="javascript:;"></a></li>
      <li><a href="javascript:;"></a></li>
      <li><a href="javascript:;"></a></li>
    </ul>
  </div>
</body>

<style>
  #imgList img {
    width: 500px;
  }

  #outer {
    width: 500px;
    height: 400px;
    border: 5px solid rebeccapurple;
    position: relative;
    display: block;
    left: 400px;
    overflow: hidden;
    margin: 0px;
    padding: 0px;
  }

  #imgList {
    list-style: none;
    margin: 0px;
    padding: 0px;
    position: absolute;
  }

  #imgList li {
    display: inline-block;
    position: relative;
    margin: 1px;
  }

  #nav {
    z-index: 1;
    position: relative;
    list-style: none;
    height: 30px;
    top: 340px;
    left: 139px;
  }

  #nav li {
    display: inline-block;

  }

  #nav a {
    background-color: #f5804e;
    display: block;
    width: 20px;
    height: 20px;
    border: 3px solid royalblue;
  }

  #leftBtn,
  #rightBtn {
    position: absolute;
    z-index: 1;
    opacity: 60%;
    top: 185px;
  }

  #rightBtn {
    left: 468px;
  }
</style>
```

### 7.3 实现翻页

首先做出平滑翻页的效果，我们需要使用到自定义动画。

1. 为了可扩展性，我们需要定义几个常量——图片的数量和图片的。并且自动设置 ul 标签的宽度。

```js
// 图片的总数量
const IMG_NUM = $imgList.children().length;

// 一张图片的总宽度（包括边框和边距）
const IMG_WIDTH = $("#imgList").children().width() + 7;

// 动态设置ul的宽度
$imgList.width(IMG_WIDTH * IMG_NUM);
```

2. 下面的第 6 行：考虑到复用，我们需要将向右动画和向左动画分别封装成一个函数。
3. 下面的第 6 行：函数的参数有两个，一个是跳转的图片数量，另一个是跳转所花费的时间。
4. 下面的第 8 行：有了跳转的图片数量，就可以计算出跳转到的 left 值。
5. 下面的第 11 行：知道了最终 left 值，就可以执行动画了。

```js
/**
 * @description: 执行向右翻页效果
 * @param {Number} number
 * @param {Number} speed
 */  
function rightMove(number, speed) {
    // 根据跳转的数量来计算出目标left值
    let targetLeft = IMG_WIDTH * number;

    // 执行动画效果
    $imgList.animate({ left: "-=" + targetLeft }, speed, function () {
      // 变化当前图片的索引
      imgIndex += number;

      // 计算出执行动画效果后的left值
      let currentLeft = - imgIndex * IMG_WIDTH;

      // 如果是最后一张图片则跳转到第二张图片
      if (currentLeft === LAST_LEFT) {
        $imgList.css("left", SECOND_LEFT);
        imgIndex = 1;
      }
```

6. 上面的第 13 行，我使用一个变量来存放当前所展示的图片的索引值，之后用于同步下面小方框的动画。当执行完效果后当前图片的索引。
7. 上面的第 16 行，执行完效果后就计算出当 left 的值。
8. 上面的第 19 ~ 22 行，根据 left 的值来判断是否为图片列表的最后一张，如果是最后一张则跳转到第二张，可以参考下面的图片示例。

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E8%BD%AE%E6%92%AD%E5%9B%BE%E5%BE%AA%E7%8E%AF%E7%A4%BA%E6%84%8F.png" style="zoom:80%;" />

8. 向左的也是如此，判断当前的 left 的值是否为图片列表的第一张，如果是第一章则跳转到倒数第二张。如下面的代码所示。

```js
/**
 * @description: 执行向左翻页效果
 * @param {Number} number
 * @param {Number} speed
 */  
function leftMove(number, speed) {
    // 执行动画效果
    $imgList.animate({ left: "+=" + IMG_WIDTH * number }, speed, function () {
      
      // 变化当前图片的索引
      imgIndex -= number;

      // 计算出执行动画效果后的left值
      let currentLeft = - imgIndex * IMG_WIDTH;

      // 如果是第一张图片则跳转到最后第二张图片
      if (currentLeft === FIRST_LEFT) {
        $imgList.css("left", LAST_SERCOND_LEFT);
        imgIndex = IMG_NUM - 2;
      }
```

### 7.4 实现自动翻页

实现循环翻页需要使用到定时器。

1. 为了解耦合，我定义了新的两个常量——自动播放的移动速度和每张图片停留的时间。
2. 下面的第 3 行，在定时器的回调函数里，调用 `rightMove()` 函数来以 **自动播放的移动速度 移动 1 张图片**。
3. 下面的第 4 行，而定时器的调用延迟为 自动播放的移动速度 + 每张图片停留的时间。

```js
// 启动定时器，定时执行动画效果
let timer = setInterval(function () {
    rightMove(1, AUTO_ANIMATE_SPEED);
}, AUTO_ANIMATE_SPEED + STAY_TIME);
```

### 7.5 同步更新状态栏

同步更新状态栏，也需要定时器，但开启两个定时器，效率比较差，所以决定将同步更新状态栏功能添加到向左移和向右移的函数里。

状态栏的布局如下：

```html
<ul id="nav">
    <li><a href="javascript:;" style="background-color: red;"></a></li>
    <li><a href="javascript:;"></a></li>
    <li><a href="javascript:;"></a></li>
    <li><a href="javascript:;"></a></li>
</ul>
```

1. 因为红色背景是 a 标签的，所以需要获取到所有 a 标签。
2. 下面的第 2 行，再根据获取的所有 a 标签设置空背景。
3. 下面的第 4 行，在设置指定的元素为红色背景。这里需要注意的是索引问题，因为下面的 nav 只有四个。索引的关系为下表。

| 图片的索引 | nav的索引 |
| ---------- | --------- |
| 1          | 0         |
| 2          | 1         |
| 3          | 2         |
| 4          | 3         |

4. 因为防止 nav 的索引越界，所以需要在最后面，即在更新完 imgIndex 的值之后添加下面的代码。

```js
// 设置nav的样式
$nav.children().children().css("background-color", "");
// imgIndex - 1 是因为eq()函数是从0开始计算的
$nav.children().children().eq(imgIndex - 1).css("background-color", "red");
```

完整的 `rightMove()` 方法如下：

```js {24-27}
/**
 * @description: 执行向右翻页效果
 * @param {Number} number
 * @param {Number} speed
 */  
function rightMove(number, speed) {
    // 根据跳转的数量来计算出目标left值
    let targetLeft = IMG_WIDTH * number;

    // 执行动画效果
    $imgList.animate({ left: "-=" + targetLeft }, speed, function () {
        // 变化当前图片的索引
        imgIndex += number;

        // 计算出执行动画效果后的left值
        let currentLeft = - imgIndex * IMG_WIDTH;

        // 如果是最后一张图片则跳转到第二张图片
        if (currentLeft === LAST_LEFT) {
            $imgList.css("left", SECOND_LEFT);
            imgIndex = 1;
        }

        // 设置nav的样式
        $nav.children().children().css("background-color", "");
        // imgIndex - 1 是因为eq()函数是从0开始计算的
        $nav.children().children().eq(imgIndex - 1).css("background-color", "red");
    });
}
```

### 7.6 点击状态栏跳转图片

1. 下面的第 1 行：为每个状态栏按钮绑定单击事件监听。
2. 下面的第 3 行：计算出当前的点击的按钮的索引。我们需要把用户新点击的索引与 `imgIndex` 比较，但我们通过 `$(this).index()` 获取到的是 **状态栏的索引**，而 `imgIndex` 的是 **图片的索引**。根据上面的规律，我们需要进行换算才能比较。
3. 下面的第 6 ~ 19 行：判断用户点击的是在当前的图片的左边还是右边，然后 **调用不同的方法** 移动到目标位置。

```js
$("#nav>li").click(function () {
    // 当前点击li的索引
    let newIndex = $(this).index() + 1;

    // 判断现在的图片位置是目标位置的左边还是右边
    if (newIndex < imgIndex) {
        // 计算出需要移动的图片数量
        let moveNum = imgIndex - newIndex;

        // 向左移指定的图片数量
        leftMove(moveNum, JUMP_ANIMATE_SPEED);

    } else if (newIndex > imgIndex) {
        // 计算出需要移动的图片数量
        let moveNum = newIndex - imgIndex;

        // 向右移指定的图片数量
        rightMove(moveNum, JUMP_ANIMATE_SPEED);
    }
})
```

### 7.7 快速翻页问题

+ 因为 jQuery 的动画效果会内置排队，所以不用担心快速点击时发生问题。
+ 如果不使用 jQuery 的动画，则需要加一个标识符，来标识现在是否在翻页。

### 7.8 完整代码

完整的 jQuery 代码如下：

::: details 点击查看全部代码

```js
let $imgList = $("#imgList");

let $nav = $("#nav");

// 图片的总数量
const IMG_NUM = $imgList.children().length;

// 一张图片的总宽度（包括边框和边距）
const IMG_WIDTH = $("#imgList").children().width() + 7;

// 第一张图片的left值
const FIRST_LEFT = 0;

// 第二张图片的left值
const SECOND_LEFT = -IMG_WIDTH;

// 最后一张图片的left值
const LAST_LEFT = -(IMG_NUM - 1) * IMG_WIDTH;

// 最后第二张图片的left值
const LAST_SERCOND_LEFT = LAST_LEFT + IMG_WIDTH;

// 自动播放的速度
const AUTO_ANIMATE_SPEED = 1000;

// 每张图片停留的时间
const STAY_TIME = 2000;

// 点击下面导航栏和左右按钮的速度
const JUMP_ANIMATE_SPEED = 500;

// 当前显示图片的索引
let imgIndex = 1;

// 动态设置ul的宽度
$imgList.width(IMG_WIDTH * $imgList.children().length);

// 将ul的left值设置为第二张图片
$imgList.css("left", SECOND_LEFT);

// 为左按钮绑定点击监听
$("#leftBtn").click(function () {
    leftMove(1, JUMP_ANIMATE_SPEED)
});

// 为右按钮绑定点击监听
$("#rightBtn").click(function () {
    rightMove(1, JUMP_ANIMATE_SPEED);
});

/**
   * @description: 执行向右翻页效果
   * @param {Number} number
   * @param {Number} speed
   */  
function rightMove(number, speed) {
    // 根据跳转的数量来计算出目标left值
    let targetLeft = IMG_WIDTH * number;

    // 执行动画效果
    $imgList.animate({ left: "-=" + targetLeft }, speed, function () {
        // 变化当前图片的索引
        imgIndex += number;

        // 计算出执行动画效果后的left值
        let currentLeft = - imgIndex * IMG_WIDTH;

        // 如果是最后一张图片则跳转到第二张图片
        if (currentLeft === LAST_LEFT) {
            $imgList.css("left", SECOND_LEFT);
            imgIndex = 1;
        }

        // 设置nav的样式
        $nav.children().children().css("background-color", "");
        // imgIndex - 1 是因为eq()函数是从0开始计算的
        $nav.children().children().eq(imgIndex - 1).css("background-color", "red");

    });
}

function leftMove(number, speed) {
    // 执行动画效果
    $imgList.animate({ left: "+=" + IMG_WIDTH * number }, speed, function () {

        // 变化当前图片的索引
        imgIndex -= number;

        // 计算出执行动画效果后的left值
        let currentLeft = - imgIndex * IMG_WIDTH;

        // 如果是第一张图片则跳转到最后第二张图片
        if (currentLeft === FIRST_LEFT) {
            $imgList.css("left", LAST_SERCOND_LEFT);
            imgIndex = IMG_NUM - 2;
        }

        // 设置nav的样式
        $nav.children().children().css("background-color", "");
        $nav.children().children().eq(imgIndex - 1).css("background-color", "red");
    });
}

$("#nav>li").click(function () {
    // 当前点击li的索引
    let newIndex = $(this).index() + 1;

    // 判断现在的图片位置是目标位置的左边还是右边
    if (newIndex < imgIndex) {
        // 计算出需要移动的图片数量
        let moveNum = imgIndex - newIndex;

        // 向左移指定的图片数量
        leftMove(moveNum, JUMP_ANIMATE_SPEED);

    } else if (newIndex > imgIndex) {
        // 计算出需要移动的图片数量
        let moveNum = newIndex - imgIndex;

        // 向右移指定的图片数量
        rightMove(moveNum, JUMP_ANIMATE_SPEED);
    }
})

// 启动定时器，定时执行动画效果
var timer = setInterval(function () {
    rightMove(1, AUTO_ANIMATE_SPEED);
}, AUTO_ANIMATE_SPEED + STAY_TIME);

// 实现当鼠标移动进去后停止播放，移出来后继续播放
$("#outer").hover(function () {
    clearInterval(timer); 
    console.log(timer);
}, function () {
    // clearInterval(timer); 
    timer = setInterval(function () {
        rightMove(1, AUTO_ANIMATE_SPEED);
    }, AUTO_ANIMATE_SPEED + STAY_TIME)
})
```

:::

## 八、多库共存

因为 jQuery 使用了 `$` 符号，所以如果有些库也需要使用  `$` 符号，就会产生冲突。

+ `jQuery.noConflict( [removeAll] )`：释放 `$` 符号的使用权。
  + `removeAll`：如果为 true ，则移出所有的 jQuery 核心函数和核心对象，包括 `jQuery` 和 `$`。

举一个例子：

+ 第 6 行释放 `$` 的使用权，所以第 8 行报错，第 9 行使用 `jQuery` 则不会报错
+ 第 11 行移出了所有的 jQuery 核心函数和核心对象，所以第 14 行代码也会报错

```js
var array = [];

console.log($.isArray(array));  // true
console.log(jQuery.isArray(array));  // true

jQuery.noConflict();	// 释放$的使用权

console.log($.isArray(array));  // 报错
console.log(jQuery.isArray(array));  // true

jQuery.noConflict(true);	// 移出jQuery核心函数和核心对象

console.log($.isArray(array));  // 报错
console.log(jQuery.isArray(array)); // 报错
```

