# 原生JS-中

## 一、DOM简介

HTML 中常用的结点：

+ 文档节点：整个 HTML 文档；
+ 元素节点：HTML 文档中的 HTML 标签；
+ 属性节点：元素的属性；
+ 文本节点：HTML 标签中的文本内容。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/HTML%E5%B8%B8%E7%94%A8%E8%8A%82%E7%82%B9.png" style="zoom:60%;" />

节点的属性：

| 节点类型 | nodeName               | nodeType | nodeValue    |
| -------- | ---------------------- | -------- | ------------ |
| 文档节点 | #document              | 9        | null         |
| 元素节点 | 标签名（div，html）    | 1        | null         |
| 属性节点 | 属性名（class，style） | 2        | 属性值       |
| 文本节点 | #text                  | 3        | **文本内容** |

## 二、文档加载顺序

浏览器在加载一个页面时，是按照 **自上向下** 的顺序加载的。

所以如果将 script 标签写到页面的上边，在代码执行时，页面还没加载出来，一些获取节点的操作就会 **报错**。

解决这个问题的方法是使用 `window.onload = function(){}` 。

为 window 绑定一个 onload 事件，该事件的对应的函数会在 <span style="color:red">页面加载完成</span> 之后执行。这样就可以确保所有的节点已经加载完成。

## 三、获取元素节点

#### （1）通过 document 对象调用

+ `document.getElementById()` ：通过 <span style="color:red">id</span> 属性获取到 <span style="color:red">一个</span> 元素节点对象。
+ `document.getElementsByName()` ：通过<span style="color:red">标签名</span> 获取到 <span style="color:red">一组</span> 元素节点对象。
+ `document.getElementsByTagName()` ：通过 <span style="color:red">name</span> 属性获取到 <span style="color:red">一组</span> 元素节点对象。

#### （2）通过具体的元素节点调用

+ `getElementsByTagName()` 
  + **方法**，返回当前节点里的指定标签名节点
+ `childNodes`
  + **属性**，表示当前节点的所有 **子节点**，包括元素节点和文本节点。
+ `firstChild` 和 `lastChild` 
  + **属性**，表示当前节点的第一个 **节点** 和最后一个 **节点**。

```html
<body>
  <ul id="place1">
    <li>北京</li>
    <li>上海</li>
    <li>广州</li>
  </ul>
  <ul id="place2"><li>北京</li><li>上海</li><li>广州</li></ul>
</body>
</html>
<script>
  var placeList1 = document.getElementById("place1");
  var placeList2 = document.getElementById("place2");

  // 7
  console.log(placeList1.childNodes.length);
  // 3
  console.log(placeList2.childNodes.length);
</script>
```

7 个节点包括了空白文本，如下图所示。

![](https://raw.githubusercontent.com/hahg2000/SSMPic/main/ul%E7%9A%84childNodes%E7%A4%BA%E4%BE%8B.png)

---

那如果不想获取到文本节点，可以使用下面几个方法：

+ `children`
  + **属性**，表示当前节点的所有 **子元素节点**。
+ `firstElementChild` 和 `lastElementChild` 
  + **属性**，表示当前节点的第一个 **元素节点** 和最后一个 **元素节点**。

#### （3）获取父节点和兄弟节点

我们在为 **多个按钮** 绑定事件时，每次都要执行重复的操作，所以可以将其封装成一个函数。

由之前的文档可知，方法也是个对象，也可以赋值给一个属性。

```js
function myBtnClick(idStr, myFunc) {
    // 获取传进来的id值的按钮
	var btn = document.getElementById(idStr);
    // 为按钮的onclick属性绑定函数
	btn.onclick = myFunc;
}
```

+ `parentNode` 
  + **属性**，表示当前节点的父节点（只有一个）。
+ `previousSibling` 与 `previousElementSibling`
  + **属性**，表示当前节点的前一个 **节点** 与 **元素节点**。
+ `nextSibling` 与 `nextElementSibling`
  + **属性**，表示当前节点的下一个 **节点** 与 **元素节点**。

## 四、全选练习

使用上面所学的知识，实现以下界面和功能：

![](https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E5%85%A8%E9%80%89%E7%BB%83%E4%B9%A0%E7%A4%BA%E4%BE%8B.png)

+ 点击 " 全选 "，下面四个多选框全部选上。
+ 点击 " 全不选 " ，下面四个多选框全部取消选择。
+ 点击 " 反选 "，下面四个多选框全部反向选择。
+ 点击 " 提交 "，弹出所选多选框的值。
+ 点击 " 全选/全不选 "，在全选和全不选中切换。当下面四个多选框全部选上时，该按钮也应该自动选上。

#### （1）页面布局

```html
<form method="POST" action="">
    你喜欢的运动是？
    <br />
    <input type="checkbox" name="allCheckOrNot" id="allCheckOrNot"/> 全选/全不选
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
```

#### （2）编写事件响应函数

因为每个框都需要监听点击事件，所以可以使用第三章的第（3）节所提到的方式。

```js
function myClick(idStr, myFunc) {
    var btn = document.getElementById(idStr);
    btn.onclick = myFunc;
}
```

#### （3）实现全选和全不选

实现步骤如下：

1. 为 checkedAllBtn 按钮绑定单击事件响应函数；
2. 获取四个多选框的节点；
3. 将四个多选框变为选择状态；

```js
// 全选
myClick("checkedAllBtn", function () {
    // 获取四个多选框的节点
    var allCheckBox = document.getElementsByName("items");

    // 方法一
    allCheckBox.forEach(function (currebtValue, index) {
        // 将四个多选框变为选择状态
        currebtValue.checked = true;
    });

    // 方法二
    // for (let index = 0; index < allCheckBox.length; index++) {
    //   element = allCheckBox[index];
    //   element.checked = true;
    // }
});
```

这里可以使用 `forEach` 方法来遍历。而全不选将第 9 行改为 `currebtValue.checked = false` 即可。

#### （4）实现反选

实现步骤如下：

1. 为 checkedRevBtn 按钮绑定单击事件响应函数；
2. 获取四个多选框的节点；
3. 将四个多选框的选择状态取反；

```js
// 反选
myClick("checkedRevBtn", function () {
    // 获取四个多选框的节点
    var allCheckBox = document.getElementsByName("items");
    
    allCheckBox.forEach(function (currebtValue, index) {
        // 将四个多选框的选择状态取反
        currebtValue.checked = !currebtValue.checked;
    });
});
```

#### （5）实现提交

实现步骤如下：

1. 为 sendBtn 按钮绑定单击事件响应函数；
2. 获取四个多选框的节点；
3. 判断四个多选框的选择状态，如果选上了就弹出提示；

```js
  // 提交
myClick("sendBtn", function () {
    // 获取四个多选框的节点
    var allCheckBox = document.getElementsByName("items");

    for (let index = 0; index < allCheckBox.length; index++) {
        element = allCheckBox[index];
        // 判断四个多选框的选择状态
        if (element.checked == true) {
            // 如果选上了就弹出提示
            alert(element.value);
        }
    }
});
```

#### （6）实现"全选/全不选"

实现步骤如下：

1. 为 sendBtn 按钮绑定单击事件响应函数；
2. 获取四个多选框的节点；
3. 判断该多选框的选择状态，如果是选中的，则将四个多选框设置为选中，反之也如此；
   也就是说 <u>该多选框的选择状态和四个多选框的状态是一致的</u>。

```js
// 全选/全不选
myClick("allCheckOrNot", function () {
    // 获取四个多选框的节点
    var allCheckBox = document.getElementsByName("items");
    
    for (let index = 0; index < allCheckBox.length; index++) {
        element = allCheckBox[index];
        // 设置相同的选择状态
        element.checked = this.checked;
    }
})
```

这里第 9 行使用了 `this` 。当点击该多选框时，就会调用该方法。而以 方法形式 调用时，`this` 是 **调用方法的对象**，即该多选框，所以可以用 `this.checked` 获取到该多选框的状态；

---

还有一种实现方法：根据该多选框的状态来 **触发之前所定义按钮的事件**。

```js
// 全选/全不选
myClick("allCheckOrNot", function () {
    // 获取到两个功能的按钮
    var checkedAllBtn = document.getElementById("checkedAllBtn");
    var checkedNoBtn = document.getElementById("checkedNoBtn");
    
    // 如果是选中状态
    if(this.checked == true){
       // 触发全选按钮 
       checkedAllBtn.click();
    }else{
       // 否则就触发全不选按钮
       checkedNoBtn.click();
    }
})
```

#### （6）实现自动勾选

因为每次点击下面四个多选框，都要进行判断，判断是否为全选状态。

<u>但判断全选状态需要四个都要进行判断，很麻烦，那就反过来判断不是全选状态。</u>

得出以下公式：因为式子的右边都是 **或运算**，所以只有有一个 btn 为 0 ，括号里的就为 1，再进行取反就为 0，即只有全部 btn 为 1 ，右边才等于 1。
$$
btn1 \land btn2 \land btn3 \land btn4 = \neg(\neg btn1 \lor \neg btn2 \lor \neg btn3 \lor \neg btn4 )
$$
实现步骤如下：

1. 获取四个多选框的节点；
2. 为四个多选框绑定单击事件响应函数；
3. 在执行的函数里，循环判断是否有 **没选中** 的多选框，如果有则将 “ 全选/全不选 ” 设置 **未选中** 状态，否则设置选中状态。

```js
// 获取四个多选框的节点
var allCheckBox = document.getElementsByName("items");
// 为四个多选框绑定单击响应事件；
for (let index = 0; index < allCheckBox.length; index++) {
    element = allCheckBox[index];
    element.onclick = function () {
        for (let j = 0; j < allCheckBox.length; j++) {
            if( allCheckBox[j].checked != true){
                // 设置未选中状态
                allCheckOrNot.checked = false;
                // 退出函数
                return;
            }
        }
        // 能执行到这行代码，代表四个都选中
        allCheckOrNot.checked = true;
    }
}
```

## 五、DOM剩余方法

下面介绍 DOM 剩余的常见方法。

1. 获取到 html 根标签。

```js
// 获取到html根标签
var html = document.documentElement;
```

2. 获取到 body 标签。

```js
// 获取到 body 标签
var body = document.body;
console.log(body);
```

3. 获取到 **所有元素节点**。

```js
// 代表页面中的全部元素节点
var all1 = document.all;
var all2 = document.getElementsByTagName("*");
```

4. 根据 **CSS 选择器** 查询元素节点。

+ `document.querySelector(" ")` 若有多个匹配的元素，只会查找出来第一个。
+ `document.querySelectorAll(" ")` 会将查询出来的元素 **封装成一个数组**，即使只有一个也是如此。

```js
// 查找id为box1下的一个div标签
var box1div = document.querySelector("#box1 div");

// 只用id查找元素也是可以的
var box1 = document.querySelector("#box1");

// 查找指定的所有标签
var divs = document.querySelectorAll("div");
```

## 六、DOM增删改

#### （1）创建新节点

+ `document.createElement("标签名")` ：传入一个标签名字符串，然后就会返回一个元素节点对象。

+ `document.createTextNode("文本内容")` ：传入一个文本内容字符串，然后就会返回一个文本节点对象。

#### （2）添加子节点

+ `父节点.appendChild(子节点)` ：向父节点中插入一个子节点。
+ `父节点.insertBefore(新节点, 旧节点)` ：在指定的节点中插入新节点。

#### （3）替换子节点

+ `父节点.replaceChild(新节点, 旧节点)` ：使用指定的新节点替换已有的子节点。

#### （4）删除子节点

+ `父节点.removeChild(子节点)` ：删除指定的子节点。
+ `子节点.parentNode.removeChild(子节点)` ：使用自己删除自己。

#### （5）添加子节点的折中方式

若需要添加的子节点有两层结构，例如下面所示，在 ul 标签里添加一个 li 标签。

若直接 `父节点.innerHTML += "子节点字符串"` 则会更新父节点的 **所有子节点**。

则最外层父节点添加子节点可以使用 `appendChild()` 方法，而创建需要添加的子节点就可以使用 `子节点.innerHTML = "节点字符串"` 。

```html
 <ul>
    <!-- 需要添加的节点
    <li><a href="">链接</a></li> -->
 </ul>
```

具体实现的代码如下：

```js
// 获取需要添加节点的父节点ul
var ul = document.querySelector("ul");
// 创建一个li元素节点
var li = document.createElement("li");

// 直接使用 innerHTML 来添加a元素节点和文本节点
li.innerHTML = "<a href=''>链接</a>";

// 往父节点中添加li子节点
ul.appendChild(li);
```

## 七、添加删除记录练习

根据上面所学的知识，完成一个添加删除记录的小功能，界面如下图所示。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%B7%BB%E5%8A%A0%E5%88%A0%E9%99%A4%E8%AE%B0%E5%BD%95%E7%95%8C%E9%9D%A2.png" style="zoom:80%;" />

具体功能如下：

+ 点击 Delete 链接后，弹出提示框，点击确认后删除该行记录。
+ 在下面的表单填写信息后，点击提交，将填写的信息添加到表格里。

### 7.1 页面布局

上面一块使用 table 标签，下面使用 form 标签（其实不使用也是可以的）。

这里需要注意的是 a 标签，需要取消默认行为，但有要 **可以点击的效果**。a 标签取消默认行为有两种方式：

+ 在使用函数来绑定事件时，返回 false。这个取消默认行为可以用到其他组件上，例如取消 form 表单提交。
+ 直接在 a 标签的 href 里写上 `javascript:;` 。

```html
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

<form action="" style="position: relative;left: 35%; padding-top: 50px;" id="addForm">
    姓名：<input type="text" name="" id="name" /><br />
    邮箱：<input type="text" name="" id="email" /><br />
    年龄：<input type="text" name="" id="age" /><br />
    <button id="addBtn">添加</button>
</form>
```

### 7.2 实现删除功能

实现删除功能，需要如下几个步骤：

1. 获取到每个 a 标签的元素节点；
2. 为每个节点绑定单击事件响应函数；
3. 在事件的响应函数里获取到当前行的数据，并弹出带有该行信息的提示框；
4. 移除该行。

---

+ 第 6 行，使用自己写的一个函数，**根据列名查找出列的索引**，即使临时改了列之间的顺序，这段代码也不需要改。
+ 第 14 行，`confirm("提示信息")` ，该方法可以弹出有确认和取消按钮的提示框，**点击确认时该方法返回 true**。

```js
// 获取到每个 a 标签的元素节点
var aTag = document.querySelectorAll("#userTable a");
// 使用循环为每个节点绑定单击事件
for (var i = 0; i < aTag.length; i++) {
    var element = aTag[i];
    element.onclick = function () {
        // 获取到列名为"名字"的索引
        var nameIndex = findThTagIndex("名字");
        // 获取到 tr 元素节点
        var trTag = this.parentNode.parentNode;
        // 根据索引获取到指定的信息
        var nameStr = trTag.children[nameIndex].innerHTML;
        // 点击确认就自删
        if (confirm("请问需要删除" + nameStr + "吗？")) {
            trTag.parentNode.removeChild(trTag);
        }
    }
}

function findThTagIndex(str) {
    // 获取到 th 元素节点
    var thTag = document.querySelectorAll("#userTable th");
    for (let i = 0; i < thTag.length; i++) {
        var element = thTag[i];
        // 根据传进来的字符串比较
        if (str == element.innerHTML) {
            return i;
        }
    }
    return -1;
}
```

### 7.3 实现添加功能

添加记录功能需要实现如下几个步骤：

1. 获取到三个 input 的值。
2. 获取到 tbody 元素节点，即 table 标签下的第一个子元素节点。
   （注意：我们自己没有写 tbody 标签，但浏览器会 **自动创建** tbody 标签如下图所示，而我们添加节点是需要往 tbody 标签）

3. 使用 input 的值创建 tr 和 td 节点。
4. 单独创建 a 标签，绑定单击事件响应函数，这里已经将那段代码封装成了一个函数，函数名为 deleteClick。
5. 将创建的 tr 节点添加到 tbody 标签中。
6. 若 input 标签外面有 form 标签，最后需要 `return false` 来结束默认行为。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/table%E9%87%8C%E7%9A%84tbody.png" style="zoom:80%;" />

```js
var addBtn = document.querySelector("#addBtn");
addBtn.onclick = function () {
    // 获取到三个 input 的值
    var inputTag = document.querySelectorAll("#addForm input");
    // 获取到 tbody 元素节点
    var userTbody = document.querySelector("#userTable").children[0];

    // 创建 tr 元素节点
    var trTag = document.createElement("tr");
    // 使用循环创建 td 元素节点
    for (let index = 0; index < inputTag.length; index++) {
        const element = inputTag[index];
        var tdStr = "<td>" + element.value + "</td>";
        // 使用 innerHTML 来往 tr 节点中添加 td 节点
        trTag.innerHTML += tdStr;
    }
    var doStr = "<td><a href='javascript:;'>delete</a></td>"
    trTag.innerHTML += doStr;
    
    var a = trTag.getElementsByTagName("a")[0];
    // 为 a 标签添加单击事件
    a.onclick = deleteClick;

    // 将创建的 tr 节点添加到 tbody 标签中
    userTbody.appendChild(trTag);
    // 取消默认行为
    return false;
}
```

### 7.4 a标签索引问题

上面有一段代码，第 7 行中，用的是 `this` ，而能不能使用 `aTag[i]` 代替呢？

```js
for (var i = 0; i < aTag.length; i++) {
    var element = aTag[i];
    element.onclick = function () {
        // 获取到列名为"名字"的索引
        var nameIndex = findThTagIndex("名字");
        // 获取到 tr 元素节点
        var trTag = this.parentNode.parentNode;
        // var trTag = aTag[i].parentNode.parentNode;
        // 根据索引获取到指定的信息
        var nameStr = trTag.children[nameIndex].innerHTML;
        // 点击确认就自删
        if (confirm("请问需要删除" + nameStr + "吗？")) {
            trTag.parentNode.removeChild(trTag);
        }
    }
}
```

当然是不能的，for 循环在页面加载完成后，就会 **立即执行**，但元素节点的单击事件只有在单击时才会触发。

也就是说当你去触发单击事件时，i 已经变成 3，即跳出循环的那个条件。除非这个索引是可以随时可以调用的，例如全局变量、标签的 id 属性。

## 八、操作内联样式

这章将介绍如何使用 Javascript 操作 **内联** 样式。内联样式的优先级是高于样式表（style 标签里的）。

### 8.1 修改元素样式

修改元素的样式可以通过 `元素节点.style.样式名 = 样式值` 来修改。

而对于样式名中有 " - " 号的，需要改用驼峰命名，例如 background-color 改为 backgroundColor。 

`!important` ：在样式表里的样式添加这行代码，可以使其 **优先级高于内联样式**。

### 8.2 读取元素样式

读取元素样式可以使用上面提到的代码 `元素节点.style.样式名` ，但这个 **只能读取到内联样式**，**不能读取到样式表里的样式**。

---

使用 `window.getComputedStyle("元素节点, 伪元素")` 来获取到一个对象，**对象里封装了元素当前的样式**。伪元素我们一般不会去使用，所以第二个参数一般为 null。

正如其方法名，获取计算过的样式，当你的宽度或者长度为自动时，会获取到当前元素的 **真实长度**，即会随着浏览器窗口大小的改变而变化。

### 8.3 其他样式相关属性

#### （1）可见宽度和可见长度

可见属性包括内容区加上内边距，返回的是一个数值，**不带单位**。

+ `clientWidth` 可见宽度 = width + 2 * padding；
+ `clientHeight` 可见高度 = height + 2 * padding；

```html
<body>
  <div id="box1">这是box1</div>
</body>

</html>
<style>
  #box1 {
    background-color: yellow;
    width: 100px;
    height: 130px;
    padding: 20px;
    margin: 10px;
    border: 10px solid rebeccapurple;
  }
</style>
<script>
  var box1 = document.querySelector("#box1");
  // 输出 170 ，170 = 130 + 2 * 20
  console.log(box1.clientHeight);
   // 输出 140 ，140 = 100 + 2 * 20
  console.log(box1.clientWidth);
</script>
```

#### （2）补偿宽度和补偿高度

补偿属性包括内容区加上内边距再加上 **边框宽度**。

+ `offsetWidth` 补偿宽度 = width + 2 * padding + 2 * border；
+ `offsetHeight` 补偿高度 = height + 2 * padding + 2 * border；

```html
<body>
  <div id="box1">这是box1</div>
</body>

</html>
<style>
  #box1 {
    background-color: yellow;
    width: 100px;
    height: 130px;
    padding: 20px;
    margin: 10px;
    border: 10px solid rebeccapurple;
  }
</style>
<script>
  var box1 = document.querySelector("#box1");
  // 输出 190 ，190 = 130 + 2 * 20 + 2 * 10
  console.log(box1.offsetHeight);
  // 输出 160 ，140 = 100 + 2 * 20 + 2 * 10
  console.log(box1.offsetWidth);
</script>
```

#### （3）定位父元素

`元素节点.offsetParent` 用于获取 **离当前元素节点最近** 的 **开启了定位** 的 父元素节点。

下面的例子中，有两个 div 父元素，一个开启了定位，一个没有开启定位。没有开启定位的会往上寻找，直到查找到 body 标签，正如 第 17 行代码所示。

```html
<body>
  <div>
    <div id="box1">这是box1</div>
  </div>

  <div style="position: relative;">
    <div id="box2">这是box2</div>
  </div>
</body>
</html>

<script>
  var box1 = document.querySelector("#box1");
  var box2 = document.querySelector("#box2");

  // body 元素节点
  console.log(box1.offsetParent);
  // box2 元素节点
  console.log(box2.offsetParent);
</script>
```

#### （4）向上偏移量和向左偏移量

+ `元素节点.offsetTop` ：获取与定位父元素 **向上偏移量**；

+ `元素节点.offsetLeft` ：获取与定位父元素 **向左偏移量**。

#### （5）滚动属性

根据第（1）点，若子元素内容过多，其父元素就会出现滚动条，而 `clientHeight` 只是可见高度，**无法获取到滚动条外的内容**，则可以使用下面两个属性。

+ `父节点.scrollHeight` ：可以获取到子节点的 **全部高度**。
+ `父节点.scrollWidth` ：可以获取到子节点的 **全部宽度**。

而我们可以使用下面两个属性来获取到滚动条已经滚动的距离：

+ `父节点.scrollLeft` ：可以获取到滚动条离开最左端的距离，即 **向右滑的距离**。
+ `父节点.scrollTop` ：可以获取到滚动条离开最上端的距离，即 **向下滑的距离**。

下面例子中，我定义了一个 id 为 box3 的 div 标签，里面有一个 id 为 box4 的 div 标签。id 为 box4 的 div 标签的宽度和长度都比 box3 的大。

```html
<body>
  <button id="btn">按钮</button>
  <div id="box3">
    <div id="box4"></div>
  </div>
</body>
</html>

<style>
  #box3 {
    background-color: #55df63;
    width: 100px;
    height: 200px;
    overflow: auto;
  }

  #box4 {
    background-color: rebeccapurple;
    width: 200px;
    height: 300px;
  }
</style>

<script>
  var box3 = document.querySelector("#box3");
  var box4 = document.querySelector("#box4");
  var btn = document.querySelector("#btn");

  btn.onclick = function () {
    // 183 原本是200但因为有滚动条
    console.log(box3.clientHeight);
    // 300 box4的全部高度
    console.log(box3.scrollHeight);
    // 获取到向右滑的距离
    console.log(box3.scrollLeft);
    // 向下滑的距离
    console.log(box3.scrollTop);
  }
</script>
```

---

从上面介绍的属性可以总结出一个规律：**判断滚动条是否滚到底端**，具体可以使用如下表达式。

+ `this.scrollHeight - this.scrollTop == this.clientHeight`
+ 全部高度 - 已经滚动的距离 == 可见高度

+ 我们可以使用其规律来实现阅读协议的功能。

###  8.4 阅读协议示例

根据规律来完成阅读协议的功能：

<u>界面如下图所示，实现当滚动条滑到最底下时，多选框和按钮变为可点击状态。</u>

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E9%98%85%E8%AF%BB%E5%8D%8F%E8%AE%AE%E7%95%8C%E9%9D%A2.png" style="zoom:80%;" />

#### （1）页面布局

+ 第 1 ~ 14 行：两个 div 标签，box2 的内容较多导致 box1 出现滚动条。
+ 第 15 ~ 17 行：一个多选框，一行提示文字，一个按钮。

```html
<div id="box1" class="center">
    <div id="box2">
      这是协议内容！！这是协议内容！！
      这是协议内容！！这是协议内容！！
      这是协议内容！！这是协议内容！！
      这是协议内容！！这是协议内容！！
      这是协议内容！！这是协议内容！！
      这是协议内容！！这是协议内容！！
      这是协议内容！！这是协议内容！！
      这是协议内容！！这是协议内容！！
      这是协议内容！！这是协议内容！！
      这是协议内容！！这是协议内容！！
    </div>
</div>
<input type="checkbox" disabled class="center"/>
<span class="center">我已认真阅读协议内容</span>
<button disabled class="center">确认</button>
```

#### （2）功能的实现

实现功能的步骤如下：

1. 获取 box1 、多选框、按钮的元素节点。
2. 为 box1 绑定滚动监听事件。
3. 在事件的响应函数中，判断当前是否到最底下，如果是则改变多选框和按钮的状态。

```js
// 获取 box1 、多选框、按钮的元素节点
var cheackbox = document.getElementsByTagName("input")[0];
var box1 = document.getElementById("box1");
var btn = document.getElementsByTagName("button")[0];
// 为 box1 绑定滚动监听事件
box1.onscroll = function () {
    // 判断当前是否到最底下
    if(box1.scrollHeight - box1.scrollTop == box1.clientHeight){
        // 如果是则改变多选框和按钮的状态
        cheackbox.disabled = false;
        btn.disabled = false;
    }
}
```

## 九、事件

### 9.1 事件对象

#### （1）引入

首先实现一个小功能：在一个区域中移动鼠标，下面显示鼠标所在的坐标，如下图所示。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%98%BE%E7%A4%BA%E9%BC%A0%E6%A0%87%E5%9D%90%E6%A0%87%E7%95%8C%E9%9D%A2.png" style="zoom:80%;" />

很容易想到，使用的事件为鼠标移动事件，即 `onmousemove` ，但如何知道鼠标所在的位置呢？

答：我们肯定不知道，但浏览器知道，所以需要获取到浏览器给我们提供的数据。

#### （2）获取事件对象

**事件对象：**

+ 当事件的响应函数被触发时，浏览器每次都会将一个事件对象 **作为实参传递进响应函数中**。
+ 在事件对象中封装了 **当前事件相关的一切信息**，比如：鼠标的坐标、键盘哪个按钮被按下、鼠标滚轮滚动的方向等等。

`clientX` 与 `clientY` ：鼠标指针在元素（DOM）中的坐标。

`screenX ` 与 `screenY` ：鼠标指针相对于 **全局（屏幕）**的坐标。（浏览器中全屏后的坐标）

但我们需要的是鼠标相对于在区域中的坐标，这时需要一些换算。

【相对于在区域中的坐标 = 鼠标的相对于文档坐标 - 区域相对于文档的偏移量】

```js
var areaDiv = document.getElementById("areaDiv");
var showMsg = document.getElementById("showMsg");

areaDiv.onmousemove = function (event) {
    showMsg.innerHTML = "x = " + (event.clientX-areaDiv.offsetTop) + " , y = " + (event.clientY-areaDiv.offsetLeft);
}
```

---

这里说一下一个简便的式子，用于判断两个数哪个不为空，并把不为空的数赋值给变量。

举个例子：从表单中获取到了用户信息，如果用户没有填写年龄，则填入默认年龄。

```js
// 定义默认年龄
var ageDefault = 18;
// 定义一个没有年龄属性的对象
var person1 = {
    name:"小红",
}
var age1 = person1.age || ageDefault;
// 输出 18
console.log(age1);

// 定义一个有年龄属性的对象
var person2 = {
    name:"小明",
    age:20
}
var age2 = person2.age || ageDefault;
// 输出 20
console.log(age2);
```

### 9.2 div随着鼠标移动

这里实现一个小功能：div 块随着鼠标移动。

这里需要明确的是：鼠标移动的事件 **不是绑定给 div 块的**，而是 **绑定给 div 的父容器**。因为当鼠标移动过快时，会移出 div 块，导致 div 块移动失败。

#### （1）初步实现

页面布局如下：

+ box1 为父容器；
+ box1 里有 box2 和 box3；
+ 我们需要 **移动的是 box2** ，而 box3 的作用是把 box1 **显示滚动条**；
+ 获取到事件对象里的 `clientX` 和 `clientY` 并修改成 box2 的位置，如 第 33 行和第 34 行。

```html
<body>
  <div id="box1">
    <div id="box2"></div>
    <div id="box3"></div>
  </div>
</body>
</html>
<style>
  #box1 {
    background-color: antiquewhite;
    width: 400px;
    height: 400px;
    overflow: auto;
  }

  #box2 {
    width: 150px;
    height: 150px;
    position: relative;
    background-color: rgb(10, 238, 227);
  }

  #box3 {
    width: 600px;
    height: 600px;
  }
</style>

<script>
  var box2 = document.getElementById("box2");
  var box1 = document.getElementById("box1");
  // 绑定给父容器
  box1.onmousemove = function (event) {
    box2.style.left = event.clientX + "px";
    box2.style.top = event.clientY + "px";
  }
</script>
```

效果如下：（鼠标指针没有显示出来）

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/div%E9%9A%8F%E7%9D%80%E9%BC%A0%E6%A0%87%E7%A7%BB%E5%8A%A8%E7%95%8C%E9%9D%A2.png" style="zoom: 67%;" />

#### （2）完善功能

但我们往下滑动滚动条时，指针会相对于 div 块向下一段距离。

这是因为当我们下滑滚动条时，`event.clientX` 没有变化，所以 div 块的 **位置没有发生改变**，即当滑动滚动条时，div 块没有动。

我们需要 div 块随着滚动条下滑，所以需要加上 **滚动条滑动的距离**。

具体图片示例如下：

<img src="E:\原生JS\div随着鼠标移动改进.png" alt="div随着鼠标移动改进" style="zoom:80%;" />

改正的代码如下：

```js
var box2 = document.getElementById("box2");
var box1 = document.getElementById("box1");
box1.onmousemove = function (event) {
    box2.style.left = (event.clientX + box1.scrollLeft) + "px";
    box2.style.top = (event.clientY + box1.scrollTop) + "px";
}
```

### 9.3 事件的冒泡

事件的冒泡：**当最里层的元素上的事件被触发时，其祖先元素的相同事件也会被触发。**

下面举个例子：

+ 有三个 div ，id 分别为 box1、box2、box3。
+ box1 里有 box2 ，box2 里有 box3。
+ 三个 div 都有点击事件。

```html
<body>
  <div id="box1">
    这是box1
    <div id="box2">
      这是box2
      <div id="box3">
        这是box3
      </div>
    </div>
  </div>
</body>

</html>

<style>
  #box1{
    height: 400px;
    width: 400px;
    background-color: #03f1eb;
  }

  #box2{
    height: 300px;
    width: 300px;
    background-color: #8455e6;
  }
  #box3{
    height: 200px;
    width: 200px;
    background-color: #36a6e2;
  }
</style>
<script>
  var box1 = document.getElementById("box1");
  var box2 = document.getElementById("box2");
  var box3 = document.getElementById("box3");

  box1.onclick = function () {
    console.log("box1");
  }
  box2.onclick = function () {
    console.log("box2");
  }
  box3.onclick = function () {
    console.log("box3");
  }
</script>
```

当点击 **最里层 box3** 时 ，控制台输出了 box3、box2、box1，如下图所示：

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E4%BA%8B%E4%BB%B6%E5%86%92%E6%B3%A1%E7%BB%93%E6%9E%9C.png" style="zoom:67%;" />

如果不需要冒泡的话写这行代码即可：`event.cancelBubble = true;`

### 9.4 事件的委派

在第七章添加删除记录练习中，我们使用 for 循环为每一个超链接都绑定了一个单击响应函数，这些操作比较麻烦，而且新添加的超链接 **必须重新绑定**。

我们希望，**只绑定一次事件，就可以应用到多个元素中**，即使元素是新添加的。我们可以尝试将其绑定给元素的共同的祖先元素。

事件的委派：

+ 指将事件统一绑定给元素的共同的祖先元素，这样当 **在子元素触发祖先元素的事件 **时，祖先元素也能感知到，即使子元素没有绑定事件。

+ 但给祖先元素的绑定事件，可能触发一些不期望的结果。
  例如给祖先元素绑定单击事件，即使没单击子元素，也会触发单击事件。

+ 这时我们需要使用 `event.target` 判断当前点击的元素是否为我们需要的元素。
+ `event.target` ：返回的是一个元素节点，可以根据 id 值、class 值和标签名来判断。

::: warning

使用 `event.target.nodeName` 返回的是 **大写字母** 的标签名。

:::

```html
<body>
  <ul>
    <li>
      <a href="javascript:;">li1</a>
    </li>
    <li>
      <a href="javascript:;">li2</a>
    </li>
    <li>
      <a href="javascript:;">li3</a>
    </li>
  </ul>
</body>

</html>

<style>
  ul {
    background-color: #bfa;
  }
</style>
<script>
  var ul = document.getElementsByTagName("ul")[0];

  ul.onclick = function () {
    console.log(event.target.tagName);
    if (event.target.nodeName == "A") {
      console.log("触发onclick");
    }
  }
</script>
```

### 9.5 事件的绑定

我们经常使用 `元素对象.onclick = function(){}` 来绑定单击事件，但这种方式 <span style="color:red">只能绑定一个响应函数</span>，若需要绑定 **多个响应函数**，则需要使用下面这个函数。

`元素节点.addEventListener(type, listener, useCapture (, options) )` ：

- type：事件的 **字符串**，前面不需要 on。
- listener：**回调函数**，当事件触发时该函数会被调用。
- useCapture：**布尔值**，表示是否在 **捕获阶段** 触发事件，一般为 false。
- options【可选】： 一个指定有关 `listener`属性的可选参数**对象**。
- **最后绑定的函数的最先执行**

### 9.6 事件的传播

关于事件的传播网景公司和微软公司有不同的理解：

- 微软公司认为事件应该是由内向外传播。
- 网景公司认为事件应该是由外向内传播。
- W3C综合了两个公司的方案将事件分为了三个阶段：
  - 捕获阶段：顾名思义，就是 **捕获触发事件的元素节点**。在捕获阶段时，从最外层的祖先元素开始，向目标元素进行事件的捕获。
  - 目标阶段：事件捕获到了目标元素，捕获结束 **开始在目标元素上触发事件**。此阶段处于中间阶段，可以归于捕获阶段也可以归于冒泡阶段，默认归于冒泡阶段。
  - 冒泡阶段：**事件从目标元素向其祖先元素传递**，依次触发祖先元素上的事件。

![](https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E4%BA%8B%E4%BB%B6%E7%9A%84%E4%BC%A0%E6%92%AD%E7%A4%BA%E4%BE%8B.png)

而如果想在捕获阶段触发事件，即最先从祖先元素触发事件，将第三个参数设为 true 即可。

`元素节点.addEventListener(type, listener, true)`。

### 9.7 拖拽练习

这里利用学过的知识，实现拖拽 div 块的功能。

鼠标进行拖拽操作需要三个步骤：

1. 鼠标按下不放——使用 `onmousedown`
2. 鼠标进行移动——使用 `onmouserover`
3. 鼠标松开——使用 `onmouseup`

根据 9.1 节中 div 随着鼠标移动的使用，发现鼠标无论点击哪里，div 的左上角的点都会 **移动到鼠标一样的坐标**。

这是因为我们每次都是获取到鼠标的坐标，再用鼠标的坐标设置 div 位置。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%8B%96%E6%8B%BD%E6%95%88%E6%9E%9C%E5%9B%BE.png" alt="img" style="zoom:80%;" />

根据上图可知，我们只要将 div 的位置偏移一下，就是想要的效果。**偏移量是鼠标在 div 中的坐标**。

------

第 7 ~ 8 行：分别获取到鼠标相对于 div 的坐标。这个坐标在鼠标移动的过程中是 **不会改变** 的，所以不写在 `onmousemove` 里面。

第 12 ~ 13 行：利用 <u>真实坐标 减去 鼠标相对于div的坐标</u> ，来改变 box1 的位置。

第 17 行：为了防止不同层级的 div 干扰，鼠标松开事件绑定给文档节点。

第 19 行：不但把按下事件置为空，也 **把松开事件置为空**，防止干扰到文档的其他操作。

```js
// 获取 box1 元素节点
var box1 = document.getElementById("box1");

// 为 box1 绑定鼠标按下事件
box1.onmousedown = function (event) {
    // 获取到鼠标相对于 div 的坐标
    var mouseXOffset = event.clientX-box1.offsetLeft;
    var mouseYOffset = event.clientY-box1.offsetTop;
    // 绑定鼠标移动事件，开始拖拽
    document.onmousemove = function (event) {
        // 在事件触发的真实坐标上减去鼠标相对于div的坐标
        box1.style.left = (event.clientX - mouseXOffset) + "px";
        box1.style.top = (event.clientY - mouseYOffset) + "px";
    }

    // 为了防止干扰，鼠标松开事件绑定给文档节点
    document.onmouseup = function(){
        document.onmousemove = null;
        document.onmouseup = null;
    }
}
```

------

但仍然有点小缺陷，是有关浏览器方面的。

但我们页面有文字时，进行拖拽，会产生把文字的影子拖出来的效果，如下图所示，然后在文本框释放鼠标，会把文字复制到里面。这是浏览器方便人们来搜索而产生的功能。现在需要取消它。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E6%96%87%E5%AD%97%E8%A2%AB%E6%8B%96%E6%8B%BD%E7%9A%84%E6%95%88%E6%9E%9C.png" alt="img" style="zoom:80%;" />

在 `box1.onmousedown` 的响应函数的最后添加 `return false;` 取消默认行为即可。

------

现在考虑复用问题，需要把响应函数单独提取出来。参数为 **元素节点**，作用是为指定的元素节点实现拖拽功能。

```js
function dragDiv(divNode) {
    divNode.onmousedown = function () {

        var mouseXOffset = event.clientX - divNode.offsetLeft;
        var mouseYOffset = event.clientY - divNode.offsetTop;

        document.onmousemove = function () {
            divNode.style.left = (event.clientX - mouseXOffset) + "px";
            divNode.style.top = (event.clientY - mouseYOffset) + "px";
        }

        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        }
        return false;
    }
}
```

### 9.8 滚轮事件

#### （1）引入

现在做一个小功能，div 的长度随着滚轮滚动而变化，向下滑变长，向上滑变短。

#### （2）功能的实现

我们使用 `onwheel` 事件来监听滚轮滑动。

其事件有两个属性：

- deltaX：返回 double 值，该值表示滚轮的 **横向** 滚动量，正数向右，负数向左；
- deltaY：返回 double 值，该值表示滚轮的 **纵向** 滚动量，正数向下，负数向上。

::: tip

我们可以根据其符号来判断滚轮是向上滑还是向下滑。

:::

第 3 行：我们将每次滑动的距离 **提取到一个变量** 里，方便之后的更改。

第 7 行和第 10 行：记住最后加上**单位** ” px “。

第 13 行：可以将第 5 ~ 11 行，写成一句代码。使用 Math 对象的绝对值来 **提取出 deltaY 的符号**，将乘上变量 speed 来改变 speed 的符号。

```js
box1.onwheel = function () {
    // 设定 div 滑动的速度为 10
    var speed = 10;
    // 如果deltaY大于0，则代表下滑
    if(event.deltaY > 0){
        // 高度增加
        box1.style.height = (box1.clientHeight + speed) + "px"; 
    }else{
        // 否则高度减少
        box1.style.height = (box1.clientHeight - speed) + "px";
    }
    // 另一种写法
    // box1.style.height = (currentHeight + speed * Math.abs(event.deltaY) / event.deltaY) + "px";
}
```

---

这里依然需要注意的一点是，当页面出现了滚动条时，在 div 里滑动滚动条时，页面的滚动条也同时会动。

一些逆天的网站会忽视这点，导致用户的使用体验极差。我们需要做的就是在滑动 div 时，页面不进行滚动，也就是 **取消默认行为**。

最后面加上 `return false;`

### 9.9 键盘事件

#### （1）概述

键盘事件一般只会给 **能获得焦点对象**，例如**文本框**，也包括**文档 document** 。

- `onkeydown`：按键被按下
  - 如果按键一直被按下，则会一直触发。
  - 这个事件会有两个隐含参数——DAS、ARR。
  - DAS：the Delay before the Auto Shifting occurs，在重复按键之前的延迟。也就是在打出重复字母之前的卡顿时间。
  - ARR：Auto Repeat Rate，重复按键的速度。也就是按下按键后一秒钟出多少字母。
- `onkeyup` ：按键被松开
  - 只有第一次被松开才会被触发。

---

可以使用几种属性来获取到当前用户按下的按键。

- `event.`code ：返回一个 DOMString，其 code 值代表触发事件的 **物理按键**。 例如无论按下是大写字母 S还是小写字母s，值都为`KeyS` 。 按下 **字母上面的数字键** 1，值为 Digit1；按下**小键盘的数字键** 1，值为 Numpad1。
- `event.key` ：返回一个 DOMString，其 key 值代表触发事件的 **逻辑按键**。 例如无论是按下字母上面的数字键还是按下小键盘的数字键，值为 ” 2 “；**字母区分大小写**。
- `ctrlKey` 、`altKey` 、`shiftKey` 、`metaKey` ：返回 Boolean 值，分别用于检测 Ctrl 、Alt、Shift、Meta（Win键） 键是否被按下。

结合上面几个属性以及 **取消文本框的默认行为**，可以做出只能输入数字的文本框。

- 文本框的默认行为就是在文本框里填入键盘按下的键。

#### （2）div随着键盘移动

这里做一个小练习，div 随着键盘移动，按住 Ctrl 可以进行加速。

- 第 4 行，将默认速度设置为 **全局变量**。
- 第 7 行，将默认速度的值给一个 **局部变量**，用于后面的更改以及便于还原为原来的速度。
- 第 12 行，如果按下了 Ctrl 键则将当前速度置为 100。
- 第 15 ~ 27 行，**判断按下了键盘的哪个方向键**，将使用当前速度进行移动。

```js
// 获取 div 元素节点
var box1 = document.getElementById("box1");
// 设置默认速度
var speed = 10;
// 为文档绑定键盘事件
document.onkeydown = function () {
    var currentSpeed = speed;

    // 判断是否按下了 ctrl 键
    if(event.ctrlKey){
        // 如果按下了就改变当前速度
        currentSpeed = 100;
    }

    // 判断按下是哪个方向键
    if(event.key == "ArrowLeft"){
        box1.style.left = box1.offsetLeft - currentSpeed + "px";
    }
    if(event.key == "ArrowUp"){
        box1.style.top = box1.offsetTop - currentSpeed + "px";
    }
    if(event.key == "ArrowRight"){
        box1.style.left = box1.offsetLeft + currentSpeed + "px";
    }
    if(event.key == "ArrowDown"){
        box1.style.top = box1.offsetTop + currentSpeed + "px";
    }
}
```

这里有一个缺陷是：不能在 div 移动过程中按下 Ctrl 键来加速，只能在最开头的时候加速，但可以松开 Ctrl 键来减速。
