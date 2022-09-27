# 原生JS-下

## 一、BOM

BOM，Browser Object Model，浏览器对象模型。BOM 可以使我们**通过 JS 来操作浏览器**。

BOM里有几个对象，我们可以 **通过这些对象来完成浏览器的操作**。

+ **Window**：代表的是整个浏览器的窗口，同时也是网页的 **全局对象**。
+ **Navigator**：代表的 **当前浏览器的信息**，通过该对象可以识别到不同的浏览器。
+ **Location**：代表 **当前浏览器的地址栏信息**。通过 Location可以获取到地址栏信息，或者操作浏览器跳转页面。
+ **History**：代表浏览器访问的当前网页的 **历史记录**，即可以进行后退和前进操作。
+ **Srceen**：代表用户的 **屏幕信息**，通过该对象可以获取到用户的显示器的相关的信息。

使用方式：这些 BOM 对象在浏览器中都是作为 window 对象的属性保存的，可以通过 window 对象来使用 `window.对象名` ，也可以直接使用 `对象名`。

### 1.1 Navigator

代表的 **当前浏览器的信息**，通过该对象可以识别到不同的浏览器。

+ 属性 `appName` ：早期可以使用其来识别浏览器，但现在已经过时，不能再识别浏览器。

+ 属性 `userAgent` ：现在 **一般使用其来识别浏览器**，但这个可以伪造。

### 1.2 History

+ 属性 `length` ：返回浏览器历史列表中的 **URL 数量**。

+ 方法 `back()` ：可以 **回退** 到上一个页面，和后退按钮功能一样。

+ 方法 `forward()` ：可以 **前进** 到下一个页面，和前进按钮功能一样。
+ 方法 `go(整数)` ：正数向前跳转指定数量页面，负数向后跳转指定数量页面。

### 1.3 Location

代表 **当前浏览器的地址栏信息**。通过 Location 可以获取到地址栏信息，或者操作浏览器跳转页面

---

例如假设有 **一个完整地址——href** 如下：

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/Location%E5%AE%8C%E6%95%B4%E5%9C%B0%E5%9D%80.png" style="zoom:80%;" />

Location 对象有很多属性可以直接获取到地址中的部分。

+ **协议部分——protocol**

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/Location-%E5%8D%8F%E8%AE%AE.png" style="zoom:80%;" />

+ **起源（起始）部分——origin**

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/Location-%E8%B5%B7%E6%BA%90.png" style="zoom:80%;" />

+ **主机部分——host**

  <img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/Location-%E4%B8%BB%E6%9C%BA.png" style="zoom:80%;" />

  + **主机名——hostname**

  <img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/Location-%E4%B8%BB%E6%9C%BA%E5%90%8D.png" style="zoom:80%;" />

  + **端口号——post**

  <img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/Location-%E7%AB%AF%E5%8F%A3%E5%8F%B7.png" style="zoom:80%;" />

+ **路径部分——pathname**

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/Location-%E8%B7%AF%E5%BE%84.png" style="zoom:80%;" />

+ **查询部分——search**

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/Location-%E6%9F%A5%E8%AF%A2.png" style="zoom:80%;" />

+ **哈希（锚点）部分——hash**

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/Location-%E5%93%88%E5%B8%8C.png" style="zoom: 80%;" />

---

其也有几个常用的方法：

+ `Location.assign("网站链接")` ：用于 **跳转到指定页面**。
  + 与 `Location = "网站链接"` 、 `Location.href= "网站链接"`  效果一致。
+ `Location.reload(布尔值)` ：用于 **刷新页面**，布尔值为 true 表示清空缓存强制刷新页面，不填值默认为 false。  
+ `Location.replace("网站链接")`  用于 **替换** 当前页面，**不会生成历史记录**，也就是说不能后退。

## 二、定时器

### 2.1 setInterval

+ setInterval 方法，定时调用，每隔一段时间来调用指定函数。

  `var intervalID = scope.setInterval(func, delay, [arg1, arg2, ...]);`

  + `intervalID` ：返回值，**非零数值**，**用于标识当前的定时器**。
  + `func`：每次执行的 **函数**。
  + `delay`：每次执行函数的 **间隔时间**。
  + `arg1, arg2, ...`：**可选**，当定时器 **执行完毕** 时，将这些值传入函数中。


+ clearInterval 方法，清除指定的定时器。

  `scope.clearInterval(intervalID)`

需要注意的是在页面利用 **按钮** 来启动定时器，在执行定时器参数里的函数时，**需要判断之前是否已经创建过定时器**，防止多次点击按钮导致**开启多个定时器**。

### 2.2 setTimeout

+ setTimeout 方法，延时调用，隔一段时间才调用指定函数。

  `var timeoutID = scope.setTimeout(function[, delay, arg1, arg2, ...]);`

  + `timeoutID` ：返回值，**非零数值**，**用于标识当前的定时器**。与 `intervalID` **公用** 一个 ID 池。
  + `func`：每次执行的 **函数**。
  + `delay`：**可选**，执行指定函数的 **间隔时间**，若不填写则代表立即执行。
  + `arg1, arg2, ...`：**可选**，当定时器 **执行完毕** 时，将这些值传入函数中。

### 2.3 定时调用小练习

现在使用定时器来完善之前 “ 用键盘移动 div ” 练习。

思路：

1. 将用户按下的键置为全局变量，命名为 direction。
2. 使用定时器每隔一段极短的时间来判断 direction，并 **移动 div**。
3. 当用户按下一次键盘时，改变 direction 的值。
4. 当用户松开键盘时，direction 置为空值。

在这个思路里，定时器就像马达，驱动 div **不断地向前**，而键盘事件就像方向盘，**改变 div 的方向**。

::: warning

虽然这个思路可以基本解决键盘事件的 DAS 问题，但如果点击键盘较快时，也会有相应的卡顿。

:::

```js
// 定义初始速度
var speed = 10;
// 将用户按下的键置为全局变量
var direction = null;
var box1 = document.getElementById("box1");

// 使用定时器
var timer = setInterval(function () {
  
    // 判断按下是哪个方向键
    if (direction == "ArrowLeft") {
        box1.style.left = box1.offsetLeft - speed + "px";
    }
    if (direction == "ArrowUp") {
        box1.style.top = box1.offsetTop - speed + "px";
    }
    if (direction == "ArrowRight") {
        box1.style.left = box1.offsetLeft + speed + "px";
    }
    if (direction == "ArrowDown") {
        box1.style.top = box1.offsetTop + speed + "px";
    }
// 每隔一段极短的时间
}, 10)

// 当用户按下一次键盘时，改变 direction 的值
document.onkeydown = function () {
    direction = event.key;
}

// 当用户松开键盘时，direction 置为空值
document.onkeyup = function () {
    direction = null;
}
```

### 2.4 定时器应用一

这里使用定时器做出当按下按钮时 div 自动往一个方向移动的效果，要求可以停在某一个位置。

步骤：

1. 获取 div 、button 元素节点。
2. 为 button 绑定单击事件。
3. 在 button 单击事件的响应函数启动定时器。
4. 在定时器中的回调函数，不断地获取 div 当前的位置，进行计算后再赋值给 div。
5. 判断计算后的值是否超过指定的值，如果超过则停止定时器。

第 19 ~ 21 行中，<u>为了确保准确无误地停到指定位置</u>，需要在最后一次移动进行 **矫正 div 的位置**。

```js
// 1.获取 div 、button 元素节点。
var box1 = document.getElementById("box1");
var btn01 = document.getElementById("btn01");
var timer = null;
var speed = 10;
// 2.为 button 绑定单击事件。
btn01.onclick = function () {
    // 根据2.1节所说，需要判断之前是否已经创建过定时器
    if (timer != null) {
        return;
    }
    // 3.启动定时器
    timer = setInterval(function () {
        // 4.不断地获取 div 当前的位置
        var oldValue = parseInt(getComputedStyle(box1, null).left);
        // 进行计算
        var newValue = oldValue + speed;
		// 矫正 div 的位置
        if (newValue >= 800) {
            newValue = 800;
        }
       	// 赋值给 div
        box1.style.left = newValue + "px";
		
        // 判断计算后的值是否超过指定的值
        if (newValue == 800) {
            // 如果超过则停止定时器
            clearInterval(timer);
        }
    }, 30);
}
```

### 2.5 定时器应用二

现在需要把上面的代码封装成一个函数，来实现 div 的 **位置** 随意变化，div 的 **宽度** 和 **长度** 随意变化。

首先需要把上面的代码写死的地方找出来，如下图所示。

1. box1——对哪个对象操作；
2. left——对对象的哪个属性操作；
3. 800——对象移动的终点是哪里；
4. speed——虽然没有写死，但其需要个性化。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/div%E7%A7%BB%E5%8A%A8%E5%B0%81%E8%A3%85%E5%87%BD%E6%95%B0%E7%9A%84%E5%86%99%E6%AD%BB%E9%83%A8%E5%88%86.png" style="zoom:80%;" />

由上面的几点可以总结出函数的形参。

1. `obj`：需要操作的 **对象**；
2. `attr`：需要操作的 **属性**；
3. `target`：操作的 **终止条件**
4. `speed`：**正整数**，div 移动的 **速度**，移动的方向根据当前位置和目标位置进行判断。
5. `callback` ：**回调函数**，当 div 移动完成后需要执行的函数。

```js
// 1. obj：需要操作的对象；
// 2. attr：需要操作的属性；
// 3. target：操作的终止条件
// 4. speed：正整数，div 移动的速度，移动的方向根据当前位置和目标位置进行判断。
// 5. callback ：回调函数，当 div 移动完成后需要执行的函数。
function moveDiv(obj, attr, target, speed, callback) {
```

然后需要解决一个问题，如何容易地存取多个定时器，每次定义新的变量，不好准确地找到需要操作的定时器。

解决方案是：因为 obj 对象是独一无二的，所以可以将定时器的 TimeID 存放到 obj 的属性里。

+ 第 19 行 ~ 20 行中，利用 moreThenZero 变量来得知当前 speed 是否大于零，再使用此变量分别乘上 newValue 和 target，就可以无论 speed 大于零或者小于零，都可以使用 `moreThenZero*newValue >= moreThenZero*target` 来判断是否到达目的条件。

+ 第 28 行，为了使 `callback` 参数变为可选参数，使用 `callback && callback();` 
  这句代码的意思是如果 `callback` 为空，则不执行 `callback()` ，否则就执行。

```js
function moveDiv(obj, attr, target, speed, callback) {
    var moreThenZero = 1;
    // 判断之前是否存在定时器
    if (obj.timer) {
        clearInterval(obj.timer);
    }
    // 获取相应属性的值
    var currentValue = parseInt(getComputedStyle(obj, null)[attr]);
    // 判断div移动方向
    if (currentValue > target) {
        moreThenZero = -1;
        speed = -speed;
    }
    // 将定时器ID存放到对象的属性里
    obj.timer = setInterval(function () {
        var oldValue = parseInt(getComputedStyle(obj, null)[attr]);
        var newValue = oldValue + speed;
		// 判断当前是否到达目标位置，并修正位置
        if (moreThenZero*newValue >= moreThenZero*target) {
            newValue = target;
        }
		// 
        obj.style[attr] = newValue + "px";
		// 如果到达则停止定时器
        if (newValue == target) {
            clearInterval(obj.timer);
            // 在定时器结束后执行函数
  			callback && callback();
        }
    }, 30);
}
```

### 2.6 轮播图

<u>这里使用定时器做出一个轮播图，下面的导航栏可以改变轮播图的图片</u>。

下面的 Gif 动图是之前一种比较多网站使用的轮播图类型——最后一张到第一张的动画方向是不一样的。

<img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E8%BD%AE%E6%92%AD%E5%9B%BE.gif" style="zoom: 50%;" />

#### （1）页面布局

页面布局使用了两个 ul 标签，一个用来 **显示图片**，一个用来 **显示导航栏**。

其实显示图片用 div 标签更好，<u>因为 ul 中的每个 li 之间都会有无法取消的 6px 的边距</u>，导致不好计算偏移量。

```html
<body>
  <div id="outer">
    <ul id="imgList">
      <li><img src="../图片/A1.JPG" /></li>
      <li><img src="../图片/A2.JPG" /></li>
      <li><img src="../图片/A3.JPG" /></li>
      <li><img src="../图片/A4.JPG" /></li>
    </ul>
    <ul id="nav">
      <li><a href="javascript:;"></a></li>
      <li><a href="javascript:;"></a></li>
      <li><a href="javascript:;"></a></li>
      <li><a href="javascript:;"></a></li>
    </ul>
  </div>
</body>
```

#### （2）加上样式

```html
<style>
  img {
    width: 500px;
  }

  #outer {
    width: 500px;
    height: 400px;
    border: 5px solid rebeccapurple;
    position: relative;
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
    transition: left 0.8s;
  }

  #imgList li {
    display: inline-block;
    position: relative;
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
</style>
```

#### （3）实现功能1

实现步骤：

1. **动态设置 ul 的宽度**，让全部图片可以排成一行。
2. **动态居中 nav**。
   （因为这里使用了 ul ，一些便捷的居中方式不能使用。居中的方式详情：[14种CSS实现水平或垂直居中的技巧——书圈微信公众号](https://mp.weixin.qq.com/s?__biz=MzI5MzIwNDI1MQ==&mid=2650178007&idx=4&sn=2ce4e1b0496881733bb785e6a6e3dd52&chksm=f47799a3c30010b5e0655c5b240e5547d726cb73de064317422d09bf317538ce9f4b344bdb57&mpshare=1&scene=24&srcid=0802o3W8cY7tKodrUAwhKozp&sharer_sharetime=1627863283992&sharer_shareid=5cdf85a6aef659db44daceadd8dbadd4&ascene=14&devicetype=android-29&version=28000753&nettype=WIFI&abtest_cookie=AAACAA%3D%3D&lang=zh_CN&exportkey=A1%2FcU8hATs3izBbtthw2XJc%3D&pass_ticket=IXU1eh1bx0YPWt8nYD7cejFNa%2FoGdZ1%2F0RbUPcGuWnPrLufZ2UWKCArVoEem5hN9&wx_header=1)
3. 初始化 nav 的状态。
4. **为每一个 nav 的子元素绑定单击响应事件**。
5. **开启定时器**，使图片运动起来。

这里需要解决一些问题。

1. **如何得知用户点击的是哪一个导航栏按钮？**
   答：为每一个导航栏按钮绑定一个 index 属性，然后使用 `this.index` 取出来。
2. **如何让导航栏与图片动画一致？**
   答：使用全局变量 imgIndex 来同步。
3. **如果点击了按钮，需要等下一次定时器运转才会变化图片。**
   答：在单击响应函数里，手动改变图片。
4. **如何动态设置 ul 标签的宽度？**
   答：`(一个图片的宽度 + 6 ) * 图片的数量`

```js
// 分别获取所取的元素
var imgList = document.getElementById("imgList");
var imgArr = document.getElementsByTagName("img");
var imgWidthStr = getComputedStyle(imgArr[0], null).width;
var navLi = document.getElementById("nav").children;
var aArr = document.getElementsByTagName("a");

// 使用全局变量 imgIndex
var imgIndex = 0;
// 动态设置 ul 的宽度
imgList.style.width = (imgList.children[0].offsetWidth + 6) * imgArr.length + "px";
// 初始化 nav 的状态
aArr[imgIndex].style.backgroundColor = "black";

// 设置nav的颜色
function setNav() {
    for (let i = 0; i < aArr.length; i++) {
        aArr[i].style.backgroundColor = "#f5804e";
    }
    aArr[imgIndex].style.backgroundColor = "black";
}

// 为每一个 nav 的子元素绑定单击响应事件
for (let i = 0; i < navLi.length; i++) {
    // 为每一个导航栏按钮绑定一个 index 属性
    navLi[i].index = i;
    navLi[i].onclick = function () {
        imgIndex = this.index;
      	setNav();
        var newLeft = -(parseInt(imgWidthStr) + 6) * imgIndex;
        if (Math.abs(newLeft) >= parseInt(imgWidthStr) * imgArr.length) {
            newLeft = 0;
        }
        imgList.style.left = newLeft + "px";
    };
}

setInterval(function () {
    setNav();
    var newLeft = -(parseInt(imgWidthStr) + 6) * imgIndex;
    imgList.style.left = newLeft + "px";
    imgIndex++;
    imgIndex = imgIndex % imgArr.length;
}, 2000);
```

但这种使用 CSS 样式来做出过渡效果，有两个缺点，<u>比如说现在的需求改变，改成图片看起来是一直向左移动的效果</u>，如下动图所示。

其需求核心的做法是 <u>在最后一张图片的后面再添加第一张图片</u>，在显示第二个第一张图片时瞬间换成第一个第一张图片。

![](https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E8%BD%AE%E6%92%AD%E5%9B%BE%E7%A4%BA%E6%84%8F%E5%9B%BE2.gif)

1. 动画效果无法设置为只向左移动才有。**只有变化了 left 属性，transition 属性就会起作用**。

我解决这个问题的思路是：在显示第二个第一张图片时将 left 属性去掉，<u>利用 right 属性瞬间换成第一个第一张图片</u>，然后再将 left 属性加上，right 属性去除。

但加上 left 属性和去除 right 属性的时机是 <u>第二个第一张图片展示完成</u>后，但 <u>页面渲染是在定时器的里的回调函数完整地执行完成一次才会执行</u>，所以要么是第一张图片停留两倍的时间，要么就是从第一个第一张图片到第二张图片的过渡效果没有（因为第一个第一张图片的 left 属性是空，而不是 0px）。

2. 动画效果与定时器时间 **重复**

在进行图片进行动画效果的同时，定时器也在计时，就会导致每张图片的展示时间需要进行计算，即 图片展示时间 = 定时器延时 - 动画效果时间。

当然优点很明显，方便易用。

#### （4）实现功能2

现在使用 第 2.5 节定时器应用二 中的 `moveDiv()` 函数来执行动画效果，即使用 JS 来做动画。

实现步骤：与上述一致，但一些细节需要注意：

1. 第 18 ~ 23 行：因为图片比导航栏多一个，所以需要在设置 nav 的选中之前进行判断，判断是否为第二个第一张图片，如果是则 `imgIndex` 归为 0，并 **将图片瞬间移动到第一张图片**。


详情的 JS 运行机制可以参考下面两个网站：

[从浏览器多进程到JS单线程，JS运行机制最全面的一次梳理——segmentfault](https://segmentfault.com/a/1190000012925872)

 [从输入URL到页面加载的过程？如何由一道题完善自己的前端知识体系！——segmentfault](https://segmentfault.com/a/1190000013662126)

```js
// 分别获取所取的元素
var imgList = document.getElementById("imgList");
var imgArr = document.getElementsByTagName("img");
var imgWidthStr = getComputedStyle(imgArr[0], null).width;
var navLi = document.getElementById("nav").children;
var aArr = document.getElementsByTagName("a");

// 使用全局变量 imgIndex
var imgIndex = 0;
// 动态设置 ul 的宽度
imgList.style.width = (imgList.children[0].offsetWidth + 6) * imgArr.length + "px";
// 初始化 nav 的状态
aArr[imgIndex].style.backgroundColor = "black";

// 设置nav的颜色
function setNav(imgIndex) {
  // 判断是否为第二个第一张图片
  if (imgIndex == aArr.length) {
    // 如果是，则nav显示第一张图片
    imgIndex = 0;
    // 将图片瞬间移动到第一张图片
    imgList.style.left = "0px";
  }
  for (let i = 0; i < aArr.length; i++) {
    aArr[i].style.backgroundColor = "";
  }
  aArr[imgIndex].style.backgroundColor = "black";
}

// 为每一个 nav 的子元素绑定单击响应事件
for (let i = 0; i < navLi.length; i++) {
  // 为每一个导航栏按钮绑定一个 index 属性
  navLi[i].index = i;
  navLi[i].onclick = function () {
    // 当点击时，停止定时器，防止动画效果运行时跳转到下一张
    clearInterval(imgTimer);
    imgIndex = this.index;
    setNav(imgIndex);
    // 在动画效果运行后继续启动定时器
    moveDiv(imgList, "left", -imgIndex * (parseInt(imgWidthStr) + 6), 50, function () {
      autoChangeImg();
    });
  };
}
var imgTimer;
autoChangeImg();
function autoChangeImg() {
  imgTimer = setInterval(
    function () {
      imgIndex++;
      imgIndex %= imgArr.length;

      moveDiv(imgList, "left", -imgIndex * (parseInt(imgWidthStr) + 6), 30, function () {
        setNav(imgIndex)
      })
    }, 1500)
}
```

## 三、类的操作

对于元素类的获取，一般使用元素的两个属性：`Element.className` 和 `Element.classList`

+ `Element.className`  ：返回的是 **字符串类型**，添加和删除类都需要使用到正则表达式，较麻烦。
+ `Element.classList`  ：返回的是 **数组类型**，可以使用 `remove("类名")` 来移除指定的类，可以使用 `add("类名")` 来添加指定的类。

#### （1）使用className

以下几个函数可以判断类名是否存在、添加类、删除类和切换类。

```js
/*
 * 判断一个元素中是否含有指定的class属性值
 * 如果有该class，则返回true，没有则返回false
 * 参数:
 * obj 要添加class属性的元素
 * cn 要添加的class值
 */
function hasClass(obj, cn) {
    
	//判断obj中有没有cn class
	//创建一个正则表达式
	//var reg = /\bb2\b/;
	var reg = new RegExp("\\b" + cn + "\\b");

	return reg.test(obj.className);
}

/*
 * 删除一个元素中的指定的class属性
 */
function removeClass(obj, cn) {
	//创建一个正则表达式
	var reg = new RegExp("\\b" + cn + "\\b");

	//删除class
	obj.className = obj.className.replace(reg, "");
}

/*
 * 定义一个函数，用来向一个元素中添加指定的class属性值
 */
function addClass(obj, cn) {

	//检查obj中是否含有cn
	if(!hasClass(obj, cn)) {
		obj.className += " " + cn;
	}
}

/*
 * toggleClass可以用来切换一个类
 * 	如果元素中具有该类，则删除
 * 	如果元素中没有该类，则添加
 */
function toggleClass(obj, cn) {

	//判断obj中是否含有cn
	if(hasClass(obj, cn)) {
		//有，则删除
		removeClass(obj, cn);
	} else {
		//没有，则添加
		addClass(obj, cn);
	}
}
```

#### （2）使用classList

判断元素中是否有指定的类，需要将 classList 进行 **循环遍历**。

```js
function changeClassList(obj, attr) {
    var classList = obj.classList;
    var hasAttr = false;
    for (var i = 0; i < classList.length; i++) {
        if (classList[i] === attr) {
            obj.classList.remove(attr);
            hasAttr = true;
        }
    }
    if (!hasAttr) {
        obj.classList.add(attr);
    }
}
```

#### （3）二级列表练习1

利用切换类来做出二级列表的效果，效果如下动图所示。

![](https://raw.githubusercontent.com/hahg2000/SSMPic/main/%E4%BA%8C%E7%BA%A7%E5%88%97%E8%A1%A8%E7%A4%BA%E6%84%8F%E5%9B%BE.gif)

这个效果是调整 div 的高度来实现的。

这个有两种实现方式，和上面的一致，一是使用 CSS 样式来做出过渡效果，二是使用 JS 做出过渡效果。

---

现在使用 CSS 样式来做出过渡效果，如果直接在两个类之间切换，需要两个类之间都需要 height 属性。

这里的示例中：每一个 div 都有 baseDiv 类，然后根据切换类来切换二级列表的折叠状态。折叠状态的类是 " fold "，展开状态的类是 ” openMenu “。

```html
<style>
    .baseDiv{
        transition: height 1s;
        overflow: hidden;
    }

    .fold {
        height: 32px;
    }

    .openMenu {
        height: 128px;
    }
</style>
<script>
    var menuItem = document.getElementsByClassName("menuItem");

    for (var i = 0; i < menuItem.length; i++) {
        menuItem[i].onclick = function () {
            var classList = this.parentElement.classList;
            for (var j = 0; j < classList.length; j++){
                var tempClass = classList[j];
                if(tempClass == "openMenu"){
                    classList.remove(tempClass);
                    classList.add("fold");
                    break;
                }
                if(tempClass == "fold"){
                    classList.remove(tempClass);
                    classList.add("openMenu");
                }
            }
        }
    }

</script>
```

---

如果是类与无类之间切换，则需要手动改变 height 的值来实现，较麻烦。本质上还是调整 style 来让过渡效果起作用。

#### （4）二级列表练习2

现在使用 JS 做出过渡效果，同时加上一个要求：**每次只能开一个二级列表**。

思路比较简单：将当前打开的 div 元素存放到全局变量中，每次点击关闭全局变量里的元素，打开现在点击的元素。

第 8 ~ 10行：关闭已打开的元素。为了统一就使用了 `toggleMenu()` 函数来执行动画效果，`toggleMenu()` 函数里又调用 `changeClassList()` 函数来切换对象的类。

但需要两个条件满足，上次点击元素的类才需要切换：

一：上次点击元素不是现在点击的元素，如果是的话，元素的类就会切换两次，相当于原地踏步。

二：上次点击元素已经关闭，已经不用再切换类了。

```js
var menuItemList = document.getElementsByClassName("menuItem");
// 全局变量存放已打开的元素
var openDiv = menuItemList[0].parentNode;
for (var i = 0; i < menuItemList.length; i++) {
    menuItemList[i].onclick = function () {
        var parentDiv = this.parentNode;
        
        // 判断上次点击的元素是否等于现在点击的元素
        // 以及是否已经关闭
        if (parentDiv != openDiv && !hasClass(openDiv, "closeItem")) {
            toggleMenu(openDiv);
        }

        //切换菜单的显示状态
        toggleMenu(parentDiv);
        // 改变全局变量的值
        openDiv = parentDiv;
    };
};

function changeClassList(obj, attr) {
    var classList = obj.classList;
    var hasAttr = false;
    for (var i = 0; i < classList.length; i++) {
        if (classList[i] === attr) {
            obj.classList.remove(attr);
            hasAttr = true;
        }
    }
    // 遍历完全部才知道当前元素没有指定属性
    if (!hasAttr) {
        obj.classList.add(attr);
    }
}

function toggleMenu(obj) {
    //在切换类之前，获取元素的高度
    var begin = obj.offsetHeight;

    //切换parentDiv的显示
    changeClassList(obj, "closeItem");

    //在切换类之后获取一个高度
    var end = obj.offsetHeight;
    //动画效果就是将高度从begin向end过渡
    //将元素的高度重置为begin
    obj.style.height = begin + "px";

    // 执行动画，从bengin向end过渡
    move(obj, "height", end, 30, function () {
        //动画执行完毕，内联样式已经没有存在的意义了，删除之
        obj.style.height = "";
    });
    // toggleClass(obj, "closeItem");
}
```

## 四、JSON

### 4.1 JSON简介

JS 中的对象只有 JS 自己认识，其他语言不认识。<u>那需要找到一个大部分语言都有的类型</u>，再将 JS 中的对象转换成这个类型。这个类型就是 **字符串**。

JSON，JavaScript Object Natation，对象表示法。JSON 就是个特殊的字符串，<u>这个字符串可以被任意的语言所识别，并且可以转换为任意语言中的对象</u>，JSON 在开发中 **主要用来数据的交互**。

JSON 和 JS 对象的格式一样，只不过 JSON 字符串中的属性名必须加 **双引号**，因为每个对象的属性名原本都是字符串类型，都需要加上双引号，但为了方便使用，允许省略双引号。

### 4.2 JSON分类

1. 对象 `{"name":"xxx"}`
2. 数组 `[1,2,"hello"]`

---

> **JSON** 是一种语法，用来序列化对象、数组、数值、字符串、布尔值和 null。
>
> 它基于 JavaScript 语法，但与之不同：JavaScript不是JSON，JSON也不是JavaScript。
>
> ——MDN Web Docs

所以 JSON 中允许出现的值有：

1. **普通对象**
2. **数组**
3. 数值
4. 字符串
5. 布尔值
6. null

### 4.3 JSON的使用

JSON的使用涉及到两个方面：JSON字符串 ==> JS 对象、JS 对象 ==> JSON 字符串

1. JSON字符串 ==> JS 对象：`JSON.parse("text[, reviver]")` 
   + `text` ：要被解析成 JavaScript 值的字符串。
   + `reviver` ：转换器, 如果传入该参数(函数)，**可以用来修改解析生成的原始值**，调用时机在 parse 函数返回之前。
   + 解析字符串也可以使用 `eval( "(" + "JSON字符串" + ")" )`，但尽量少用，因为有安全隐患。
2. JS 对象 ==> JSON 字符串：`JSON.stringify(value[, replacer [, space]])`
   + `value` ：将要序列化成 一个 JSON 字符串的值。
   + `replacer`：如果该参数是一个函数，则在序列化过程中，<u>被序列化的值的每个属性都会经过该函数的转换和处理</u>；
     如果该参数是一个数组，则 <u>只有包含在这个数组中的属性名</u> 才会被序列化到最终的 JSON 字符串中；
     如果该参数为 null 或者未提供，则<u>对象所有的属性都会被序列化</u>。
   + `space` ：指定缩进用的空白字符串，用于美化输出（pretty-print）；
     如果参数是个数字，它代表有多少的空格；上限为10。该值若小于1，则意味着没有空格；
     如果该参数为字符串（当字符串长度超过10个字母，取其前10个字母），该字符串将被作为空格；
     如果该参数没有提供（或者为 null），将没有空格。

http://www.dogfight360.com/blog/475/
