# 重学CSS-上

## 一、CSS颜色

### 1.1 RGB值

RGB（Red 红、 Green 绿、Blue 蓝）。每个参数（红色、绿色和蓝色）定义 0 到 255 之间的颜色强度。

常见的颜色的 RGB 值：

+ 红色 <Badge text="红色" color="rgb(255, 0, 0)"/>：rgb(255, 0, 0) 

+ 蓝色 <Badge text="蓝色" color="rgb(0, 0, 255)"/> ：rgb(0, 0, 255)

+ 浅绿 <Badge text="浅绿" color="rgb(60, 179, 113)"/>：rgb(60, 179, 113)

+ 粉色 <Badge text="粉色" color="rgb(238, 130, 238)"/>：rgb(238, 130, 238)

+ 橙色 <Badge text="橙色" color="rgb(255, 165, 0)"/>：rgb(255, 165, 0)

+ 浅紫 <Badge text="浅紫" color="rgb(106, 90, 205)"/>：rgb(106, 90, 205)

灰色阴影通常使用所有 3 个光源的相同值来定义：

+ 浅黑 <Badge text="浅黑" color="rgb(60, 60, 60)"/>：rgb(60, 60, 60)
+ 浅灰 <Badge text="浅灰" color="rgb(180, 180, 180)"/> ：rgb(180, 180, 180)

### 1.2 RGBA 值

RGBA 颜色值是 **具有 Alpha 通道** 的 RGB 颜色值的扩展 - 它指定颜色的不透明度。

::: warning

颜色透明度和设置 `opacity` 样式显示效果一致，而 `opacity` 属性会让其所有子元素都继承相同的透明度。

:::

### 1.3 十六进制

RGB 的每个值最大都为 255，换算成十六进制为 FF，15 * 16^1^ + 15 * 16^0^ = 15*16 + 15 = 255。

### 1.4 HSL

HSL 代表色相（hue）、饱和度（saturation）和亮度（lightness）。

一般表示颜色不会使用这个，但在调整电脑屏幕或者编辑图片时，会遇到相关的属性——饱和度，对比度和亮度。

+ 色相是色轮上从 0 到 360 的度数。0 是红色，120 是绿色，240 是蓝色。
+ 饱和度是一个百分比值，0% 表示灰色阴影，100% 表示全色。
+ 明度也是一个百分比，0% 是黑色，50% 既不亮也不暗，100% 是白色。

### 1.5 HSLA 值

HSLA 颜色值是 **具有 Alpha 通道** 的 HSL 颜色值的扩展 - 它指定颜色的不透明度。

## 二、CSS背景

### 2.1 背景图片

 `background-image` 属性指定用作元素背景的图像。

默认情况下，图像会在 x 轴和 y 轴重复。例如下面代码：

```css
p {
  background-image: url("paper.gif");
}
```

可以通过改变 `background-repeat` 属性来改变重复类型。其值有几种类型：

+ `repeat`：默认值，图片会在 x 轴和 y 轴重复。
+ `repeat-x`：只在 x 轴（水平）重复。
+ `repeat-y`：只在 y 轴（垂直）重复。
+ `space`：x 轴和 y 轴重复，但图片之间有间隔。
+ `round`：x 轴和 y 轴重复，但图片之间没有间隔。
+ `no-repeat`：不重复，只显示一个。需要额外的属性`background-position` 确定图片的位置。其值有三种类型：
  + 两个字符串组合：第一个字符串——`left` 、`right` 、`center` ；第二个字符串——`top` 、`center` 、`bottom`
  + 百分比：`x% y%`
  + 尺寸：`xpos ypos`

### 2.2 背景滚动

`background-attachment` 属性指定背景图像应该滚动还是固定（不会随着页面的其余部分滚动）。其值有三种类型：

+ `scroll` ：默认，会随着页面滚动。
+ `fixed` ：图片会一直固定在原位置，无论页面怎么滚动。
+ `local` ：图片会随着元素内容的滚动而滚动。

### 2.3 背景快速设置

为了缩短代码，还可以在一个属性——`background`中指定所有背景属性。

属性值的顺序为：

- `background-color`
- `background-image`
- `background-repeat`
- `background-attachment`
- `background-position`

可以省略其中一个或者多个值，例如下面代码：

+ 背景颜色为白色；
+ 背景图片为 `img_tree.png`
+ 背景图片不重复
+ 无设置背景滚动
+ 图片位置在右上方。

```css
body {
  background: #ffffff url("img_tree.png") no-repeat right top;
}
```

## 三、CSS 边框

### 3.1 边框样式

边框样式有几种：

- `dotted` - <span style='border-style: dotted;'> 定义虚线边框 </span>
- `dashed`- <span style='border-style: dotted;'> 定义更长的虚线边框 </span>
- `solid`- <span style='border-style: solid;'> 定义实心边框 </span>
- `double`- <span style='border-style: double;'> 定义双边框 </span>
- `groove`- <span style='border-style: groove;'> 定义 3D 凹槽边框 </span>。边框有凹进去的感觉。
- `ridge`- <span style='border-style: ridge;'> 定义 3D 凸槽边框 </span>。边框有凸起来的感觉
- `inset`- <span style='border-style: inset;'> 定义 3D 插入边框 </span>。里面的区域会有凹进去的感觉。
- `outset`- <span style='border-style: outset;'> 定义 3D 推出边界 </span>。里面的区域会有凸起来的感觉
- `none`- 定义无边界
- `hidden`- 定义隐藏边框

### 3.2 边框缩写

可以使用边框缩写，快速定义出边框。

该`border`属性是以下单个边框属性的简写属性：

- `border-width`
- `border-style`（必需的）
- `border-color` 

## 四、CSS宽度和高度

在响应式页面会使用到两类属性——限制最小尺寸和限制最大尺寸。

### 4.1 最小尺寸

可以限制宽度和长度的最小尺寸，当窗口小于最小尺寸，会出现滚动条，防止元素过度缩小而变形。

+ `min-width`
+ `min-height`

### 4.2 最大尺寸

可以限制宽度和长度的最大尺寸，当窗口大于最大尺寸，元素不会改变，小于最大尺寸会自动变小，不会出现滚动条。

响应式布局最常使用的一类属性。

+ `max-width`
+ `max-height`

## 五、CSS外轮廓

外轮廓 `outline` 的起始位置是 `margin` 的所在位置。如果想改变起始位置，需要使用到 `outline-offset` 轮廓偏移属性。

轮廓绘制在元素边框之外，并且 **可能与其他内容重叠**。轮廓不是元素尺寸的一部分，所以元素的总宽度和高度不受轮廓宽度的影响。

外轮廓的样式和边框的样式一致。也有缩写。

`outline` 是用于设置外轮廓的简写属性：

- `outline-width`
- `outline-style`（必需的）
- `outline-color`

## 六、CSS文本

### 6.1 文本对齐

+ 全部文本对齐 `text-align` ，其有四个值：
  + `center` ：居中对齐
  + `left` ：左对齐
  + `right` ：右对齐
  + `justify` ：居中对齐，但
+ 最后一行文本对齐 `text-align-last` ，其值和上面一致，但只改变文字最后一行。

### 6.2 文本方向

 `direction` 和 `unicode-bidi` 都决定文本的方向

+ `direction` ：文字摆放位置，文字左对齐或者右对齐，不会改变文字。与 `dir` 属性一致
+ `unicode-bidi` ：根据 Unicode 双向算法 （不知道什么算法）算出当前文字是否需要逆向显示。与 `<bdo>` 标签一致。

### 6.3 文字装饰线

五个属性可以修改文字装饰线：

+ `text-decoration-line` ：装饰线的位置
  + `overline` ：顶端
  + `line-through` ：中间
  + `underline` ：底部
  + 上面的几个组合
+ `text-decoration-color` ：装饰线的颜色
+ `text-decoration-style` ：装饰线的种类
  + `solid` ：单条实体线
  + `double` ：双条实体线
  + `dotted` ：点状虚线
  + `dashed` ：短横虚线
  + `wavy` ：波浪线
+ `text-decoration-thickness` ：装饰线粗细

缩写属性 `text-decoration` ：

- `text-decoration-line`（必需的）
- `text-decoration-color`（可选的）
- `text-decoration-style`（可选的）
- `text-decoration-thickness`（可选的）

### 6.4 文本间距

+ `text-indent` ：第一行的文本缩进
+ `letter-spacing` ：每个字母的间隔
+ `line-height` ：行间距
+ `word-spacing` ：每个单词的间隔
+ `white-space` ：处理空白（空格和换行）的方式
  + `normal` ：每处多个空格和换行合并成一个空格，文本自动换行。
  + `nowrap` ：每处多个空格和换行合并成一个空格，但不换行。
  + `pre` ：多个空格和换行原样输出，不自动换行。
  + `pre-wrap` ：多个空格和换行原样输出，同时自动换行。
  + `pre-line` ：多个空格合并，但换行不变，同时自动换行。

### 6.5 文字阴影

`text-shadow` 属性为文本添加阴影，其值有四个值

+ `h-shadow` ：横向阴影
+ `v-shadow` ：竖向阴影
+ `blur-radius` ：模糊半径，半径越大，模糊程度就越明显。
+ `color` ：阴影的颜色。

例如下面代码：代表 2px 的横向阴影和 2px 的竖向阴影，模糊半径为 8px ，阴影颜色为红色。

```css
h1 {
  text-shadow: 2px 2px 8px #FF0000;
}
```

##  七、CSS字体

### 7.1 字体系列

字体总体分为五部分：

+ **Serif**（衬线）：每一个字母都有边缘都有一个小笔划
+ **Sans-serif** （无衬线）：干净的线条，没有附加小笔划。
+ **Monospace** （等宽字体）：每个字母都有相同的宽度。（个人觉得代码字体使用这类较好）
+ **Cursive** （草书）：其模仿人类的笔迹。
+ **Fantasy** （想象）：俏皮的、可爱的字体。

下面为五个字体的演示：

| Generic Font Family | Examples of Font Names                                       |
| :------------------ | :----------------------------------------------------------- |
| Serif               | <span style="font-size: 150%; font-family:'Times New Roman'">Times New Roman</span> <br /><span style="font-size: 150%; font-family:Georgia">Georgia</span> <br /><span style="font-size: 150%; font-family:Garamond">Garamond</span> |
| Sans-serif          | <span style="font-size: 150%; font-family:Arial">Arial</span> <br /><span style="font-size: 150%; font-family:Verdana ">Verdana</span> <br /><span style="font-size: 150%; font-family:Helvetica">Helvetica</span> |
| Monospace           | <span style="font-size: 150%; font-family:'Courier New'">Courier New</span> <br /><span style="font-size: 150%; font-family:'Lucida Console'">Lucida Console</span> <br /><span style="font-size: 150%; font-family:'Monaco'">Monaco</span> |
| Cursive             | <span style="font-size: 150%; font-family:'Brush Script MT'">Brush Script MT</span> <br /><span style="font-size: 150%; font-family:'Lucida Handwriting'">Lucida Handwriting</span>  （个人最喜欢的一种英语书写方式） |
| Fantasy             | <span style="font-size: 150%; font-family:'Papyrus'"> Papyrus</span> |

::: warning

如果定义字体的话，需要准备多个备选字体，以确保浏览器或者操作系统之间的最大兼容性

:::

### 7.2 字体大小

文字大小可以使用像素单位，也可以使用基准单位 （em）

1em 等于当前字体大小。浏览器中的默认文本大小为 16 像素。因此，1em 的默认大小是 16px。

例如下面代码：像素单位和基准单位可以互换

```css
h1 {
  font-size: 2.5em; /* 40px/16=2.5em */
}

h2 {
  font-size: 1.875em; /* 30px/16=1.875em */
}

p {
  font-size: 0.875em; /* 14px/16=0.875em */
}
```

如果想字体大小适用于所有浏览器，则需要为 `<body>` 元素设置默认字体的大小百分比。例如下面代码：

```css
body {
  font-size: 100%;
}

h1 {
  font-size: 2.5em;
}

h2 {
  font-size: 1.875em;
}

p {
  font-size: 0.875em;
}
```

文本大小可以设置视口宽度 `vw` 单位，即字体占用窗口的多少。这样，文本大小将跟随浏览器窗口的大小，例如下面代码：

```html
<h1 style="font-size:10vw">Hello World</h1>
```

显示效果如下：改变浏览器的窗口大小查看效果。

<span style="font-size:10vw">Hello World</span>

### 7.3 字体缩写

`font`属性是以下的简写属性：

- `font-style`
- `font-variant`
- `font-weight`
- **`font-size/line-height`**
- **`font-family`**

**注意：** `font-size` 和 `font-family` 是必需的。如果缺少其他值之一，则使用它们的默认值。

例如下面代码：

+ 斜体

+ 全部字母小写
+ 加粗
+ 字体大小 12 px / 字体行高 30 px
+ 字体 Georgia 和 serif

```css
p.b {
  font: italic small-caps bold 12px/30px Georgia, serif;
}
```

## 八、CSS链接

可以设置 `cursor` 属性当鼠标移动到链接上面，鼠标光标的样式。

例如下面代码：

```html
<span style="cursor: auto">auto</span><br>
<span style="cursor: crosshair">crosshair</span><br>
<span style="cursor: default">default</span><br>
<span style="cursor: e-resize">e-resize</span><br>
<span style="cursor: help">help</span><br>
<span style="cursor: move">move</span><br>
<span style="cursor: n-resize">n-resize</span><br>
<span style="cursor: ne-resize">ne-resize</span><br>
<span style="cursor: nw-resize">nw-resize</span><br>
<span style="cursor: pointer">pointer</span><br>
<span style="cursor: progress">progress</span><br>
<span style="cursor: s-resize">s-resize</span><br>
<span style="cursor: se-resize">se-resize</span><br>
<span style="cursor: sw-resize">sw-resize</span><br>
<span style="cursor: text">text</span><br>
<span style="cursor: w-resize">w-resize</span><br>
<span style="cursor: wait">wait</span>
```

下面为代码演示：

+ <span style="cursor: auto">auto 自动</span>
+ <span style="cursor: crosshair">crosshair 十字准星</span> 
+ <span style="cursor: default">default 默认</span>
+ <span style="cursor: e-resize">e-resize 东向准星</span>
+ <span style="cursor: w-resize">w-resize 西向准星</span>
+ <span style="cursor: n-resize">n-resize 北向准星</span>
+ <span style="cursor: s-resize">s-resize 南向准星</span>
+ <span style="cursor: ne-resize">ne-resize 东北准星</span>
+ <span style="cursor: nw-resize">nw-resize 西北准星</span>
+ <span style="cursor: se-resize">se-resize 东南准星</span>
+ <span style="cursor: sw-resize">sw-resize 西南准星</span>
+ <span style="cursor: help">help 帮助准星</span>
+ <span style="cursor: move">move 移动准星</span>
+ <span style="cursor: pointer">pointer 点击准星</span>
+ <span style="cursor: progress">progress 加载准星</span>
+ <span style="cursor: text">text 输入准星</span>
+ <span style="cursor: wait">wait 等待准星</span>

## 九、CSS列表

列表有一个 `list-style-position` 属性，该属性设置列表是在文字里面还是外面。

**属性值：`inside` —— 文字里面；`outside` ——文字外面（默认值）**

虽然列表放到文字里面，但原来的边距不会改变。所以 `inside` 的效果是 `outside` 的基础上再缩进。例如下面代码。

:::  normal-demo outside代码演示

```html
<ul style="list-style-position: outside;">
  <li>
    Coffee - A brewed drink prepared from roasted coffee beans, which are
    the seeds of berries from the Coffea plant
  </li>
  <li>
    Tea - An aromatic beverage commonly prepared by pouring hot or boiling
    water over cured leaves of the Camellia sinensis, an evergreen shrub
    (bush) native to Asia
  </li>
</ul>
```

:::

::: normal-demo inside代码演示

```html
<ul style="list-style-position: inside;">
  <li>
    Coffee - A brewed drink prepared from roasted coffee beans, which are
    the seeds of berries from the Coffea plant
  </li>
  <li>
    Tea - An aromatic beverage commonly prepared by pouring hot or boiling
    water over cured leaves of the Camellia sinensis, an evergreen shrub
    (bush) native to Asia
  </li>
</ul>
```

:::


列表速记的属性分别为：

+ `list-style-image`（将图像指定为列表项标记）

- `list-style-type`（如果指定了 `list-style-image`，如果由于某种原因无法显示图像，将显示该属性的值）
- `list-style-position`（指定列表项标记应出现在内容流内部还是外部）

## 十、CSS表格

表格可以设置以下属性：

| 属性                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [border](https://www.w3schools.com/cssref/pr_border.asp)     | 设置边框缩写 【 `border-width` | `border-style` 必需的 | `border-color` 】 |
| [border-collapse](https://www.w3schools.com/cssref/pr_border-collapse.asp) | 设置边框是否重合【separate\|collapse】                       |
| [border-spacing](https://www.w3schools.com/cssref/pr_border-spacing.asp) | 设置边框之间的空隙【length 左右 \| length 上下】，           |
| [caption-side](https://www.w3schools.com/cssref/pr_tab_caption-side.asp) | 设置标题在表格上方还是下方 【top \| bottom】                 |
| [empty-cells](https://www.w3schools.com/cssref/pr_tab_empty-cells.asp) | 设置表格中的空格是否显示边框和背景 【show \| hide】          |
| [table-layout](https://www.w3schools.com/cssref/pr_tab_table-layout.asp) | 设置单元格宽度算法【auto 随着内容变化 \| fixed 固定宽度】    |

## 十一、CSS显示

| Property                                                     | 描述                                  |
| :----------------------------------------------------------- | :------------------------------------ |
| [display](https://www.w3schools.com/cssref/pr_class_display.asp) | 设置元素是否存在【none \| 其他值】    |
| [visibility](https://www.w3schools.com/cssref/pr_class_visibility.asp) | 设置元素是否显示【visible \| hidden】 |

## 十二、CSS定位

CSS 定位有五种：

- `static` ：静态，默认值
- `relative` ：相对定位，相对于其原始位置定位
- `fixed` ：固定定位，一直在宽口的一个位置里
- `absolute` ：绝对定位，相对于设置了 `relative` 属性的父元素定位，如果都没有设置则相对于 `body` 定位。
- `sticky` ：粘性定位，当元素将要超出宽口页面时，固定在页面最上面

定位时会使用到四个属性来进行具体定位：

+ `bottom` ：以底部为负半轴，进行偏移。`-5px` 代表向下偏移 5px ；`5px` 代表向上偏移 5px
+ `top` ：以顶部为负半轴，进行偏移
+ `right` ：以右边为负半轴，进行偏移
+ `left` ：以左边为负半轴，进行偏移

另外还有一个属性可以裁剪图片：

- `clip` 属性允许您指定一个矩形来裁剪绝对定位的元素。
- 【 auto 自动 | (top, right, bottom, left) 矩形的】

例如，`rect(10px,100px,50px,10px)` 代表矩形位置——

+ top 和 left 组合成矩形开始裁剪的位置，即 在 10px，10px 开始裁剪。
+ right 代表矩形向右长度 100px
+ bottom 代表矩形向下长度 50 px

## 十三、CSS浮动

### （1）浮动对齐

当两个元素浮动在同一行时，高度不会自动对齐。除非直接设置高度，但这样子过于死板，这时需要使用到 `Flexbox` ，这个之后会详细描述。

例如下面代码：第 5 ~ 8 行，装浮动元素的容器设置为 `flex` ，并设置 `flex-wrap` 为 `nowrap`

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .flex-container {
        display: flex;
        flex-wrap: nowrap;
      }

      .flex-container .box {
        width: 50%;
        margin: 10px;
      }
    </style>
  </head>
  <body>
    <div class="flex-container">
      <div class="box">Box 1 - This is some text to make sure that the content gets really tall. This is some text to make sure that the content gets really tall.</div>
      <div class="box">Box 2 - My height will follow Box 1.</div>
    </div>

  </body>
</html>
```

### （2）导航栏

一般也会使用浮动来制作导航栏。

例如水平导航栏：

::: normal-demo 水平导航栏

```html
<ul>
  <li><a href="#home" class="active">Home</a></li>
  <li><a href="#news">News</a></li>
  <li><a href="#contact">Contact</a></li>
  <li><a href="#about">About</a></li>
</ul>
```

```css
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333;
}

/* 设置左浮动 */
li {
  float: left;
}

/* 设置内联块 */
li a {
  display: inline-block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

li a:hover {
  background-color: #111;
}

.active {
  background-color: red;
}
```

:::

例如垂直导航栏：

::: normal-demo 垂直导航栏

```html
<div class="clearfix">
  <!-- 侧边栏 -->
  <div class="column menu">
    <ul>
      <li>The Flight</li>
      <li>The City</li>
      <li>The Island</li>
      <li>The Food</li>
    </ul>
  </div>

  <!-- 主体内容 -->
  <div class="column content">
    <h1>The City</h1>
    <p>
      Chania is the capital of the Chania region on the island of Crete. The
      city can be divided in two parts, the old town and the modern city.
    </p>
    <p>
      You will learn more about web layout and responsive web pages in a
      later chapter.
    </p>
  </div>
</div>
```

```css
* {
  box-sizing: border-box;
}

.column {
  float: left;
  padding: 15px;
}

/* 清楚浮动并对齐 */
.clearfix::after {
  content: '';
  clear: both;
  display: table;
}

.menu {
  width: 25%;
}

.content {
  width: 75%;
}

.menu ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.menu li {
  padding: 8px;
  margin-bottom: 8px;
  background-color: #33b5e5;
  color: #ffffff;
}

.menu li:hover {
  background-color: #0099cc;
}
```

::: 

## 十四、CSS伪类和伪元素

+ 伪类：伪类用于定义元素的特殊状态和定义指定位置的元素

例如：`a:link` ——定义 `<a>` 标签点击后的样式

`a:first-child`  ——定义第一个 `<a>` 元素的样式。

有一个很好的例子使用 `:focus` ，当用户点击文本框后产生文本框边框动画效果：

::: normal-demo 文本框边框动画

```html
<input type="text" value="John">
```


```css
input[type=text] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 3px solid #ccc;
  -webkit-transition: 0.5s;
  transition: 0.5s;
  outline: none;
}
input[type=text]:focus {
  border: 3px solid #555;
}
```
:::


+ 伪元素：伪元素用于设置元素的 **指定部分** 的样式。所有伪元素如下表所示。

| 选择器                                                       | 例子              | 例子描述                         |
| :----------------------------------------------------------- | :---------------- | :------------------------------- |
| [::after](https://www.w3schools.com/cssref/sel_after.asp)    | `p::after`        | 选择在每个 `<p>` 元素 **最后面** |
| [::before](https://www.w3schools.com/cssref/sel_before.asp)  | `p::before`       | 选择在每个 `<p>` 元素 **最前面** |
| [::first-letter](https://www.w3schools.com/cssref/sel_firstletter.asp) | `p::first-letter` | 选择每个 `<p>` 元素第一个字母    |
| [::first-line](https://www.w3schools.com/cssref/sel_firstline.asp) | `p::first-line`   | 选择每个 `<p>` 元素第一行内容    |
| [::marker](https://www.w3schools.com/cssref/sel_marker.asp)  | `::marker`        | 选择每个列表的列表项             |
| [::selection](https://www.w3schools.com/cssref/sel_selection.asp) | `p::selection`    | 更改当使用鼠标选择文字的样式     |

::: warning

**双冒号表示法 ——** `::first-line`与 `:first-line`

双冒号取代了 CSS3 中伪元素的单冒号表示法。这是 W3C 试图区分 **伪类** 和**伪元素**的尝试。

单冒号语法用于 CSS2 和 CSS1 中的伪类和伪元素。

:::

## 十五、属性选择器

| 选择器                                                       | 解释                                             | 例子                 | 例子描述                                      |
| :----------------------------------------------------------- | ------------------------------------------------ | :------------------- | :----------------------------------------------------------- |
| [attribute](https://www.w3schools.com/cssref/sel_attribute.asp) | 选择拥有某个属性的元素                           | `[target]`           | 选择拥有 target 属性的元素                                   |
| [attribute=value](https://www.w3schools.com/cssref/sel_attribute_value.asp) | 选择属性值是指定值的元素                         | `[target=_blank]`    | 选择 target 属性值为 \_blank 的元素                           |
| [attribute~=value](https://www.w3schools.com/cssref/sel_attribute_value_contains.asp) | 选择属性值里拥有指定单词的元素                   | `[title~=flower]`    | 选择 title 属性值有 flower 单词的元素，例如 summer flower    |
| [attribute\|=value](https://www.w3schools.com/cssref/sel_attribute_value_lang.asp) | 选择属性值里拥有指定值或者使用连词符号开头的元素 | `[lang\|=en]`       | 选择 lang 属性值是 en 或者使用连词 en 开头的元素。例如 en-US |
| [attribute\^=value](https://www.w3schools.com/cssref/sel_attr_begin.asp) | 选择属性值是指定值开头的元素                     | `a[href^="https"]` | 选择是 a 标签且 href 属性值是 https 开头的元素                  |
| [attribute\$=value](https://www.w3schools.com/cssref/sel_attr_end.asp)     | 选择属性值是指定值结尾的元素 |`a[href$=".pdf"]`|选择是 a 标签且 href 属性值是 pdf 结尾|
| [attribute\*=value](https://www.w3schools.com/cssref/sel_attr_contain.asp) | 选择属性值包含指定值的元素 | `a[href*="te"]` | 选择是 a 标签且 href 属性值包含 te 的元素，例如 `test` 、`mytest` |

## 十六、计数器

我们也可以通过 CSS 来创建编号。使用步骤如下：

1. 在 **需要编号的容器** 定义 `counter-reset` 属性，该属性创建或重置计数器，属性值的第一个单词为计数器变量名，第二个单词为起始数字。下面代码设置变量名为 `section` ，从 3 开始计数（不包括 3 ）。

```css
.container {
  counter-reset: section 3;
}
```

2. 设置每次递增的数量—— `counter-increment` ；属性值第一单词为计数器变量，第二个为递增的数量。下面代码设置列表每次递增 2。

```css
h2:before {
  counter-reset: section;
  counter-increment: section 2;
}
```

3. 设置列表的内容—— `content` ；`counter()` 或 `counters()` 表示计数器变量占位符。下面设置列表内容为 `Section X.`

```css
h2:before {
  counter-increment: section 2;
  content: "Section " counter(section) ". ";
}
```

运行效果如下：

::: normal-demo 计数器运行效果

```html
<div class="container">
  <h2>HTML Tutorial</h2>
  <h2>CSS Tutorial</h2>
  <h2>JavaScript Tutorial</h2>
  <h2>Bootstrap Tutorial</h2>
  <h2>SQL Tutorial</h2>
  <h2>PHP Tutorial</h2>
</div>
```

```css
.container {
  counter-reset: section 3;
}

h2:before {
  counter-increment: section 2;
  content: "Section " counter(section) ". ";
}
```

:::

## 十七、单位

单位分为 **绝对单位** 和 **相对单位**

**绝对单位：**不建议在屏幕上使用绝对长度单位，因为屏幕尺寸变化很大。但是，如果输出介质已知，例如打印布局，则可以使用它们。

| Unit | Description                |
| :--- | :------------------------- |
| cm   | 厘米                       |
| mm   | 毫米                       |
| in   | 英寸 (1in = 96px = 2.54cm) |
| px   | 像素 (1px = 1/96th of 1in) |
| pt   | 点 (1pt = 1/72 of 1in)     |
| pc   | 派卡 (1pc = 12 pt)         |

相对长度：相对长度单位指定相对于另一个长度属性的长度。相对长度单位在不同的渲染介质之间可以更好地缩放。

| Unit | Description                                               |
| :--- | :-------------------------------------------------------- |
| em   | 相对于元素的字体大小 (2em 代表当前字体大小的两倍)         |
| ex   | 相对于字符 “ x ” 的高度，通常为字体尺寸的一半  (很少使用) |
| ch   | 相对于 "0" 的宽度                                         |
| rem  | 相对于根节点的字体大小                                    |
| vw   | 相对于视窗宽度的 1%                                       |
| vh   | 相对于视窗高度的 1%                                       |
| vmin | Relative to 1% of viewport's* smaller dimension           |
| vmax | Relative to 1% of viewport's* larger dimension            |
| %    | 相对于父元素                                              |

## 十八、数学函数

+ `calc()`  ：括号里填写数学表达式，计算结果为 CSS 里的属性值，里面表达式可以使用 + - * /。

例如下面代码，计算元素的宽度来实现居中显示。

```css {4}
#div1 {
  position: absolute;
  left: 50px;
  /* 宽度 = 100% - 左偏移距离50px - 右偏移距离50px => 居中显示 */
  width: calc(100% - 100px);
}
```

::: normal-demo 效果展示

```html
<h1>The calc() Function</h1>

<p>Create a div that stretches across the window, with a 50px gap between both sides of the div and the edges of the window:</p>

<div id="div1">Some text...</div>
```

```css
#div1 {
  position: absolute;
  left: 50px;
  width: calc(100% - 100px);
  border: 1px solid black;
  background-color: yellow;
  padding: 10px;
}
```

:::

+ `max()` 函数：使用括号里的最大值作为属性值
+ `min()` 函数：使用括号里的最小值作为属性值。

（上面两个函数有点像 `min-width` 之类的属性）

## 十九、CSS圆角

`border-radius` 给元素添加圆角，可以有 1 ~ 4 个值。

+ 【↖、↗、↘、↙】
+ 【↖、↗ ↙、↘】
+ 【↖ ↘、↗ ↙】
+ 【↖ ↗ ↘ ↙】

::: normal-demo 圆角效果

```html
<h1>The border-radius Property</h1>

<p>Four values - border-radius: 15px 50px 30px 5px:</p>
<p id="rcorners1"></p>

<p>Three values - border-radius: 15px 50px 30px:</p>
<p id="rcorners2"></p>

<p>Two values - border-radius: 15px 50px:</p>
<p id="rcorners3"></p>

<p>One value - border-radius: 15px:</p>
<p id="rcorners4"></p>
```

```css
#rcorners1 {
  border-radius: 15px 50px 30px 5px;
  background: #04aa6d;
  padding: 20px; 
  width: 200px;
  height: 150px; 
}

#rcorners2 {
  border-radius: 15px 50px 30px;
  background: #04aa6d;
  padding: 20px; 
  width: 200px;
  height: 150px; 
}

#rcorners3 {
  border-radius: 15px 50px;
  background: #04aa6d;
  padding: 20px; 
  width: 200px;
  height: 150px; 
} 

#rcorners4 {
  border-radius: 15px;
  background: #04aa6d;
  padding: 20px; 
  width: 200px;
  height: 150px; 
} 
```

:::

## 二十、边框图像

使用 CSS `border-image` 属性，您可以将图片设置为元素周围的边框。如果要 `border-image`工作，元素还需要  `border `属性。

`border-image` 属性值有五个值：

| 属性值              | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |
| border-image-source | 指定源图片                                                   |
| border-image-slice  | 指定如何分隔图片，将图片分割成九个部分                       |
| border-image-width  | 指定展示的图片宽度，注意图片会溢出边框限制                   |
| border-image-outset | 指定图片往外偏移的长度。可以分别指定上下左右偏移长度。属性值可以不带单位，表示边框的倍数 |
| border-image-repeat | 指定边框重复的类型。有 stretch 拉伸、repeat 重复、round 挤压、space 松散的 |

## 二十一、CSS 多背景

### （1）基本属性

+ 在 CSS 可以设置多个图片作为元素背景。`background-image: url(img_flwr.gif), url(paper.gif);`
+ 也可以在 `background` 属性设置多个图片背景。例如下面代码，两张图片都设置了图片源、图片位置和重复类型

```css
#example1 {
  background: url(img_flwr.gif) right bottom no-repeat, url(paper.gif) left top repeat;
}
```

+ 使用 `background-size` 来设置背景图片的大小。可以使用三个值：
  + `no-repeat` ：原始大小
  + `contain` ：宽度和高度尽量撑满元素，所以有些区域会覆盖不到。
  + `cover` ：图片将覆盖整个元素，所以图片一部分会不可见。
  + 效果示例：https://www.w3schools.com/css/tryit.asp?filename=trycss3_background-size_contain
  + 其可以和 `background` 属性一样设置多个值来调整多个背景大小。

### （2）实际使用

+ 全尺寸背景图像：在博客中经常使用。其有如下要求：
  + 用图像填充整个页面（无空白，有空白就很难看了）
  + 根据需要缩放图像（尽量多得显示背景图片）
  + 页面居中图片
  + 不要导致滚动条（只是背景图片，不是显示图片）

所以代码如下：

```css
html {
  background: url(img_man.jpg) no-repeat center fixed;
  background-size: cover;
}
```

+ `background-origin` ：指定背景图片的起始位置。该属性采用三个不同的值：
  - `border-box` - 背景图片从 border 边框的左上角开始
  - `padding-box` - （默认）背景图像从 padding 的左上角开始
  - `content-box` - 背景图片从内容的左上角开始，不包括 padding
+ `background-clip` ：指定背景的绘画区域。该属性采用三个不同的值：
  + `border-box` - （默认）背景被绘制到边框
  + `padding-box` - 背景被绘制到填充，不会绘制到边框
  + `content-box` - 背景在内容框内绘制，不会绘制到填充

::: normal-demo 背景的绘画区域

```html
<div id="example1">
  <p>背景被绘制到边框</p>
</div>

<div id="example2">
  <p>背景被绘制到填充，不会绘制到边框</p>
</div>

<div id="example3">
  <p>背景在内容框内绘制，不会绘制到填充</p>
</div>
```

```css
#example1 {
  border: 15px dotted black;
  padding: 35px;
  background: orange;
}

#example2 {
  border: 15px dotted black;
  padding: 35px;
  background: orange;
  background-clip: padding-box;
}

#example3 {
  border: 15px dotted black;
  padding: 35px;
  background: orange;
  background-clip: content-box;
}
```

:::

## 二十二、颜色关键词

颜色有三个关键词：

+ `transparent` ：使颜色透明，等价于 rgba(0,0,0,0)。

+ `currentcolor` 关键字就像一个变量，它保存元素颜色属性的当前值。如果您希望特定颜色在元素或页面中保持一致，就可以使用该关键字。

例如下面代码，设置了 `<div>` 的文本颜色为蓝色，如果边框想和文本一样的颜色，可以使用 `currentcolor` 

```css
div {
  color: blue;
  border: 10px solid currentcolor;
}
```

+ `inherit` 关键字指定属性应从其父元素继承其值。
