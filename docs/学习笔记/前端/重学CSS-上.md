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
| Sans-serif          | <span style="font-size: 150%; font-family:Arial">Arial</span> <br />Verdana <br />Helvetica |
| Monospace           | Courier New Lucida Console Monaco                            |
| Cursive             | Brush Script MT Lucida Handwriting                           |
| Fantasy             | Copperplate Papyrus                                          |
