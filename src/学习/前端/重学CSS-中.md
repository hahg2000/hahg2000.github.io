# 重学CSS-中

重学（大嘘），下面的其实都没学过😵

## 一、网页字体

Web 字体允许 Web 设计人员使用未安装在用户计算机上的字体。只需将字体文件包含在您的网络服务器上，它会在需要时自动下载给用户。

在需要使用的时候，使用 `@font-face` 定义。

| 描述符        | 值                                                           | 说明                                                      |
| :------------ | :----------------------------------------------------------- | :-------------------------------------------------------- |
| font-family   | 字体名字                                                     | 必须                                                      |
| src           | URL                                                          | 必须，指定字体的源地址                                    |
| font-stretch  | `normal condensed ultra-condensed extra-condensed semi-condensed expanded semi-expanded extra-expanded ultra-expanded` | 可选，指定字体是否拉伸或者压缩                            |
| font-style    | `normal italic oblique`                                      | 可选，指定字体是否为斜体                                  |
| font-weight   | `normal bold 100 200 300 400 500 600 700 800 900`            | 可选，指定字体的加粗程度                                  |
| unicode-range | unicode-range                                                | 可选，指定字体支持的UNICODE 字符范围。默认是 "U+0-10FFFF" |

## 二、2D 变换

CSS 2D变换可以在屏幕平面上的移动、旋转、缩放和倾斜元素。使用的是 `transform` 属性，其值有多种：

| 描述符                                                       | 说明                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `translate(x, y)`                                            | 往 x 轴平移 x 长度，正方向为右；往 y 轴平移 y 长度，正方向为下 |
| `translateX(n)`                                              | 往 x 轴平移 x 长度，正方向为右                               |
| `translateY(n)`                                              | 往 y 轴平移 y 长度，正方向为下                               |
| `rotate(angle)`                                              | 以元素中心旋转指定角度，正数为顺时针旋转，负数为逆时针旋转   |
| `scale(x,y)`                                                 | 增加元素 x 倍宽度；增加元素 y 倍高度                         |
| `scaleX(x)`                                                  | 增加元素 x 倍宽度                                            |
| `scaleX(y)`                                                  | 增加元素 y 倍高度                                            |
| `skew(x-angle, y-angle)`                                     | 以元素中心倾斜元素指定角度，沿 x 轴倾斜 x 度，沿 y 轴倾斜 y 度。类似于将长方形倾斜成平行四边形 |
| `skewX(angle)`                                               | 沿 x 轴倾斜 x 度                                             |
| `skewY(angle)`                                               | 沿 y 轴倾斜 y 度                                             |
| `matrix( scaleX(), skewY(), skewX(), scaleY(), translateX(), translateY() )` | 一次性定义元素的所有动作                                     |

## 三、3D 变换

在 `transform` 属性里，您可以使用以下 3D 转换方法：

- `rotateX()` ：以给定的角度围绕其 X 轴（水平轴）旋转元素，例如将屏幕向着使用者的方向盖住。
- `rotateY()` ：以给定的角度围绕其 Y 轴（垂直轴）旋转元素，例如将屏幕向着
- `rotateZ()` ：以给定的角度围绕其 Z 轴（正方向指向使用者）旋转元素，与 `rotate(angle)` 效果一致。

::: normal-demo 3D变换

```html
<div>
  原始元素
</div>

<div id="rX">
  这是3D变换X轴
</div>

<div id="rY">
  这是3D变换Y轴
</div>

<div id="rZ">
  这是3D变换Z轴
</div>
```

```css
div {
  width: 300px;
  height: 100px;
  background-color: yellow;
  border: 1px solid black;
  margin-bottom: 10px;
}

#rX:hover {
  transform: rotateX(40deg);
}

#rY:hover {
  transform: rotateY(40deg);
}

#rZ:hover {
  transform: rotateZ(40deg);
}
```

:::

3D 变化还有其他的相关属性：

| 描述符              | 属性值                                    | 说明                                                         |
| ------------------- | ----------------------------------------- | ------------------------------------------------------------ |
| transform-origin    | `x-axis y-axis z-axis`                    | 用来改变元素变形的原点，默认为元素中心                       |
| transform-style     | `flat 位于平面 \| preserve-3d 位于3D空间` | 设置 **子元素** 是位于 3D 空间中还是平面中                   |
| perspective         | `length \| none`                          | 指定了观察者与 z=0 平面的距离，使具有三维位置变换的元素产生透视效果 |
| perspective-origin  | `x-axis y-axis`                           | 指定了观察者的位置，用作 perspective 属性的消失点。（不过一般不会改变观察者的位置吧） |
| backface-visibility | `visible \| hidden`                       | 指定当元素背面朝向观察者时是否产生透视（可见）               |

下面演示下 `perspective` 的效果：

::: normal-demo perspective效果

```html
<table>
  <tbody>
    <tr>
      <th><code>perspective: 250px;</code>
      </th>
      <th><code>perspective: 350px;</code>
      </th>
    </tr>
    <tr>
      <td>
        <div class="container">
          <div class="cube pers250">
            <div class="face front">1</div>
            <div class="face back">2</div>
            <div class="face right">3</div>
            <div class="face left">4</div>
            <div class="face top">5</div>
            <div class="face bottom">6</div>
          </div>
        </div>
      </td>
      <td>
        <div class="container">
          <div class="cube pers350">
            <div class="face front">1</div>
            <div class="face back">2</div>
            <div class="face right">3</div>
            <div class="face left">4</div>
            <div class="face top">5</div>
            <div class="face bottom">6</div>
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <th><code>perspective: 500px;</code>
      </th>
      <th><code>perspective: 650px;</code>
      </th>
    </tr>
    <tr>
      <td>
        <div class="container">
          <div class="cube pers500">
            <div class="face front">1</div>
            <div class="face back">2</div>
            <div class="face right">3</div>
            <div class="face left">4</div>
            <div class="face top">5</div>
            <div class="face bottom">6</div>
          </div>
        </div>
      </td>
      <td>
        <div class="container">
          <div class="cube pers650">
            <div class="face front">1</div>
            <div class="face back">2</div>
            <div class="face right">3</div>
            <div class="face left">4</div>
            <div class="face top">5</div>
            <div class="face bottom">6</div>
          </div>
        </div>
      </td>
    </tr>
  </tbody>
</table>	
```

```css
/* Shorthand classes for different perspective values */
.pers250 {
  perspective: 250px;
}

.pers350 {
  perspective: 350px;
}

.pers500 {
  perspective: 500px;
}

.pers650 {
  perspective: 650px;
}

/* Define the container div, the cube div, and a generic face */
.container {
  width: 200px;
  height: 200px;
  margin: 75px 0 0 75px;
  border: none;
}

.cube {
  width: 100%;
  height: 100%;
  backface-visibility: visible;
  perspective-origin: 150% 150%;
  transform-style: preserve-3d;
}

.face {
  display: block;
  position: absolute;
  width: 100px;
  height: 100px;
  border: none;
  line-height: 100px;
  font-family: sans-serif;
  font-size: 60px;
  color: white;
  text-align: center;
}

/* Define each face based on direction */
.front {
  background: rgba(0, 0, 0, 0.3);
  transform: translateZ(50px);
}

.back {
  background: rgba(0, 255, 0, 1);
  color: black;
  transform: rotateY(180deg) translateZ(50px);
}

.right {
  background: rgba(196, 0, 0, 0.7);
  transform: rotateY(90deg) translateZ(50px);
}

.left {
  background: rgba(0, 0, 196, 0.7);
  transform: rotateY(-90deg) translateZ(50px);
}

.top {
  background: rgba(196, 196, 0, 0.7);
  transform: rotateX(90deg) translateZ(50px);
}

.bottom {
  background: rgba(196, 0, 196, 0.7);
  transform: rotateX(-90deg) translateZ(50px);
}

/* Make the table a little nicer */
th, p, td {
  background-color: #EEEEEE;
  padding: 10px;
  font-family: sans-serif;
  text-align: left;
}
```

:::

## 四、过渡

CSS 过渡会在指定的持续时间内 **平滑地更改属性值**。

要创建过渡效果，您必须指定两件事：

- 要添加效果的 CSS 属性
- 效果的持续时间

使用到的属性：

- `transition-delay` ：指定过渡效果的延迟时间
- `transition-duration` ：指定完成过渡效果需要多少秒
- `transition-property` ：指定过渡效果所针对的 CSS 属性的名称
- `transition-timing-function` ：指定过渡效果的速度曲线
  - `ease` - 默认，以最快速度加速到比匀速还快的速度，然后最后以最快速度减速到几乎为零的速度
  - `linear` - 匀速
  - `ease-in`- 最开始从零加速到匀速
  - `ease-out`- 最开始均速，然后最后速度减到零
  - `ease-in-out`- 先加速然后减速，但加速度没有 `ease` 大，比较缓和。
  - `cubic-bezier()` ：贝塞尔曲线，自定义过渡效果。
- `transition` ：过渡缩写
  - 其值：`[ property duration timing-function delay ]`
  - 例如：`width 2s linear 1s;` ；宽度改变时产生过渡效果，2 秒完成效果，均速变化，1秒延迟

## 五、动画

CSS 动画可以不使用 JavaScript 或 Flash 的情况下制作 HTML 元素的动画

在本章中，您将了解以下属性：

- `@keyframes`
- `animation-name`
- `animation-duration`
- `animation-delay`
- `animation-iteration-count`
- `animation-direction`
- `animation-timing-function`
- `animation-fill-mode`
- `animation`

### （1）@keyframes

`@keyframes` 用于定义动画的具体显示效果。

三种定义形式：百分比定义、起点终点定义 和 两种结合

+ 百分比定义：将动画效果的时间分为一百份，**定义某个时间的样式**。

```css
@keyframes example {
  0%   {background-color: red;}
  25%  {background-color: yellow;}
  50%  {background-color: blue;}
  100% {background-color: green;}
}
```

+ 起点终点定义：定义 **起始样式** 和 **最终样式**，然后让其自动变化。

```css
@keyframes example {
  from {background-color: red;}
  to {background-color: yellow;}
}
```

+ 两种结合：

```css
@keyframes example {
  from { margin-top: 50px; }
  50%  { margin-top: 150px } 
  to   { margin-top: 100px; }
}
```

### （2）animation-delay

指定动画开始的延迟，与过渡类似。`animation-delay: 2s;`

### （3）animation-iteration-count

指定动画应运行的次数，可以设置为无限制。

`animation-iteration-count: number | infinite`

### （4）animation-direction

指定动画是否应该向前、向后或交替循环播放。

动画方向属性可以具有以下值：

- `normal`- 动画正常播放，默认值
- `reverse`- 动画反向播放
- `alternate `- 动画先正常播放，再反向播放，配合运行无限制次数，可实现无缝动画效果
- `alternate-reverse`- 动画先反向播放，再正常播放

### （5）animation-timing-function

指定动画的速度曲线，与过渡类似。animation-timing-function 属性可以具有以下值：

- `ease`
- `linear`
- `ease-in`
- `ease-out`
- `ease-in-out`
- `cubic-bezier(n,n,n,n)`

### （6）animation-fill-mode

指定动画开始前和结束后的样式。

`animation-fill-mode` 属性可以具有以下值：

- `none` - 默认值。动画在执行之前或之后不会对元素应用任何样式
- `forwards` - 元素将保留最后一个关键帧设置的样式值，也就是保留动画结束后的样式——`100%` 的样式。
- `backwards` - 元素将获取第一个关键帧设置的样式值，并在动画延迟期间保留此值，也就是不保留原来的样式，直接应用动画前的样式——`0%` 的样式
- `both` - `forwards` 和 `backwards` 的结合，也就是说无法看到元素原始的样式。

::: normal-demo 动画效果

```html
<div class="test">
  <span class="mode1">none</span>
  <span class="mode2">forwards</span>
  <span class="mode3">backwards</span>
  <span class="mode4">both</span>
</div>
```

```css
.test span {
  display: block;
  width: 100px;
  height: 100px;
  font-size: 18px;
  color: #000;
  line-height: 100px;
  text-align: center;
  border-radius: 100%;
  background: #ac2aef;
  animation-name: move;
  animation-duration: 5s;
  animation-delay: 2s;
  animation-timing-function: ease-in;
}
.mode1 {
  animation-fill-mode: none;
}
.mode2 {
  animation-fill-mode: forwards;
}
.mode3 {
  animation-fill-mode: backwards;
}
.mode4 {
  animation-fill-mode: both;
}
@keyframes move {
  0% {
    background: #fffa90;
    transform: translateX(0) scale(1);
  }
  100% {
    background: #4cd826;
    transform: translateX(200px) scale(0.5);
  }
}
```

:::

### （7）animation-play-state

`animation-play-state` 属性指定动画是正在运行还是暂停，在 JavaScript 中使用此属性可在循环中间暂停动画。

`animation-play-state: paused | running`

### （8）animation

`animation` 指定了动画属性的缩写：

+ `animation-name`
+ `animation-duration`
+ `animation-timing-function`
+ `animation-delay`
+ `animation-iteration-count`
+ `animation-direction`
+ `animation-fill-mode`
+ `animation-play-state`

例如下面代码：

+ 动画的名字是 `example`
+ 指定时间 5 秒
+ 均速动画效果
+ 2 秒延迟
+ 无限制动画
+ 动画先正常播放，再反向播放

```css
div {
  animation: example 5s linear 2s infinite alternate;
}
```

## 六、文字提示

接下来将使用 CSS 来制造一个简单的工具——文字提示

1. 首先定义出基本的 HTML 元素

```html
<div class="tooltip">
  <span>Hover over me</span>
  <span class="tooltiptext">Tooltip text</span>
</div>
```

2. 定义显示出来文字的样式

位置设置为 `relative` ，为了给提示信息定位；将 `<span>` 为块元素；设置下边框为点状，提示用户有提示信息。

```css
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black; 
}
```

3. 定义隐藏文字的样式

可见性为不可见；黑背景，白色字，圆角边框等；位置设置为 `absolute` 

```css
.tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  border-radius: 6px;
  color: #fff;
  text-align: center;
  padding: 5px 0;

  position: absolute;
  z-index: 1;
}
```

4. 然后设置鼠标移到文字后的样式

```css
.tooltiptext {
  visibility: visible;
}
```

5. 调整文字提示的位置，上下左右都可以，看需求来决定。`top` 属性偏移 5px 来对齐显示文字的 `padding` ，然后向右平移一个元素宽度加上一点空距。

```css {13,14}
.tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  border-radius: 6px;
  color: #fff;
  text-align: center;
  padding: 5px 0;

  position: absolute;
  z-index: 1;
  
  top: -5px;
  left: 105%;
}
```

6. 添加提示箭头。首先定义 `::after` 伪元素的 `content` 来使边框显示。然后定义 `absolute` 使伪元素不被原元素撑大。其次将伪元素移动到指定位置。最后将边框定义三个方向透明，一个方向有颜色。**当元素无内容时，边框就会是三角形**。

```css
.tooltiptext::after {
  content: ' ';
  position: absolute;
  
  top: 50%;
  right: 100%;
  margin-top: -5px;
  
  border-width: 5px;
  border-style: solid;
  border-color: transparent black transparent transparent;
}
```

7. 添加过渡效果

```css
.tooltiptext {
  opacity: 0;
  transition: opacity 1s;
}

.tooltip:hover .tooltiptext {
  opacity: 1;
}
```

::: normal-demo 文字提示效果

```html
<div class="tooltip">
  <span>Hover over me</span>
  <span class="tooltiptext">Tooltip text</span>
</div>
```

```css
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
  visibility: visible;
  width: 120px;
  background-color: black;
  border-radius: 6px;
  color: #fff;
  text-align: center;
  padding: 5px 0;

  position: absolute;
  z-index: 1;

  top: -5px;
  left: 105%;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}

.tooltiptext::after {
  content: ' ';
  position: absolute;
  top: 50%;
  right: 100%;
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent black transparent transparent;
}

.tooltiptext {
  opacity: 0;
  transition: opacity 1s;
}

.tooltip:hover .tooltiptext {
  opacity: 1;
}
```

:::

## 七、图片样式

### （1）图片滤镜

::: normal-demo 图片滤镜

```html
<svg id="test" xmlns="http://www.w3.org/2000/svg" width="128px" height="128px" viewBox="0 0 128 128" data-name="Layer 1" id="Layer_1"><defs><style>.cls-1{fill:#00adfe;}.cls-2,.cls-3{fill:#fff;}.cls-2{opacity:0.3;}.cls-10,.cls-4{fill:#393c54;}.cls-4{opacity:0.1;}.cls-5{fill:#f85565;}.cls-6{fill:#f8dc25;}.cls-7{fill:#4bc190;}.cls-8{fill:#356cb6;}.cls-9{fill:none;stroke:#515570;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><title/><circle class="cls-1" cx="64" cy="64" r="60"/><circle class="cls-2" cx="64" cy="64" r="48"/><path class="cls-3" d="M109.39,68.76A17.56,17.56,0,0,0,91.82,51.2a18.1,18.1,0,0,0-3.85.43,26.19,26.19,0,0,0-40-10A16.33,16.33,0,0,0,24.82,59a8.78,8.78,0,0,0-3.37,15.75,21,21,0,0,0,24.86,28.09,11.37,11.37,0,0,0,19.21,3.8A21,21,0,0,0,99.13,89.81,21.27,21.27,0,0,0,98.56,85,17.56,17.56,0,0,0,109.39,68.76Z"/><path class="cls-4" d="M109.39,68.76A17.56,17.56,0,0,0,91.82,51.2a18.1,18.1,0,0,0-3.85.43,26.19,26.19,0,0,0-40-10A16.33,16.33,0,0,0,24.82,59a8.78,8.78,0,0,0-3.37,15.75,21,21,0,0,0,24.86,28.09,11.37,11.37,0,0,0,19.21,3.8A21,21,0,0,0,99.13,89.81,21.27,21.27,0,0,0,98.56,85,17.56,17.56,0,0,0,109.39,68.76Z"/><path class="cls-3" d="M106.53,60.49c-.07-.48-.18-1.09-.32-1.78A17.51,17.51,0,0,0,91.82,51.2a18.1,18.1,0,0,0-3.85.43,26.19,26.19,0,0,0-40-10A16.33,16.33,0,0,0,24.82,59a8.8,8.8,0,0,0-6.47,5.5A9.88,9.88,0,0,0,29.41,71,17.89,17.89,0,0,0,59.08,88.19a17.77,17.77,0,0,0,32.73-9.6,18,18,0,0,0-.35-3.47,12.93,12.93,0,0,0,15.07-14.63Z"/><path class="cls-5" d="M97.22,14A59.64,59.64,0,0,0,81.14,6.5,72.93,72.93,0,0,0,43.69,58.18L56.76,60.5A59.72,59.72,0,0,1,97.22,14Z"/><path class="cls-6" d="M97.23,14.05A60,60,0,0,0,56.76,60.5l13.08,2.32a46.53,46.53,0,0,1,39.61-38A60,60,0,0,0,97.23,14.05Z"/><path class="cls-7" d="M118,37.83a60,60,0,0,0-8.55-13,46.42,46.42,0,0,0-39.61,38l13.08,2.32a33.13,33.13,0,0,1,32.63-27.41C116.36,37.73,117.18,37.77,118,37.83Z"/><path class="cls-4" d="M82.92,65.14a33.14,33.14,0,0,1,4.63-12A13,13,0,0,0,71,54.11a16.49,16.49,0,0,0-10.21-3.56h-.33a12.94,12.94,0,0,0-8-8.74A12.63,12.63,0,0,0,49,41a73.4,73.4,0,0,0-5.26,17.14L56.76,60.5h0l13.08,2.32h0Z"/><path class="cls-8" d="M70,123.7a59.86,59.86,0,0,0,10-1.87V76H70Z"/><path class="cls-8" d="M40,119a59.62,59.62,0,0,0,10,3.35V76H40Z"/><path class="cls-3" d="M83,55.21A9,9,0,0,0,71.4,60.5h0a12.42,12.42,0,0,0-14.55-5.3A9,9,0,1,0,49,63a12.44,12.44,0,0,0,23.42,8.41A12.7,12.7,0,0,0,73,69.49,9,9,0,1,0,83,55.21Z"/><path class="cls-9" d="M66,72a4,4,0,0,0,4,4H80"/><path class="cls-9" d="M53.67,72a4,4,0,0,1-4,4H40"/><path class="cls-10" d="M52.45,94a1,1,0,0,1-.94-1.06,8.56,8.56,0,0,1,17,0A1,1,0,0,1,67.55,94Z"/><path class="cls-5" d="M65.75,94a6.06,6.06,0,0,0-11.5,0Z"/><path class="cls-8" d="M36,110a2,2,0,0,1-4,0c0-1.1.9-3.41,2-3.41S36,108.9,36,110Z"/><path class="cls-8" d="M58.67,119a2,2,0,0,1-4,0c0-1.1.89-3.41,2-3.41S58.67,117.9,58.67,119Z"/><path class="cls-8" d="M66,115.41a2,2,0,0,1-4,0c0-1.1.9-3.41,2-3.41S66,114.31,66,115.41Z"/><path class="cls-8" d="M87.55,115.41a2,2,0,0,1-4,0c0-1.1.9-3.41,2-3.41S87.55,114.31,87.55,115.41Z"/></svg>
<p id='text'>原始</p>
```

```css
svg {
  width: 150px;
  height: 150px;
  border: 2px solid rgb(93, 195, 254);
  display: block;
}
.grayscale {
  filter: grayscale(100%);
}
.invert {
  filter: invert(100%);
}
.saturate {
  filter: saturate(7);
}
.sepia {
  filter: sepia(100%);
}
```

```js
let svg = document.getElementById('test')
let p = document.getElementById('text')
let count = 0
let classNameArray = [
  {
    en: '',
    zh: '原始',
  },
  {
    en: 'grayscale',
    zh: '灰度',
  },
  {
    en: 'invert',
    zh: '反色',
  },
  {
    en: 'saturate',
    zh: '饱和',
  },
  {
    en: 'sepia',
    zh: '深褐色',
  },
]
svg.addEventListener('click', () => {
  count = (count + 1) % classNameArray.length
  svg.setAttribute('class', classNameArray[count].en)
  p.innerText = classNameArray[count].zh
})
```

:::

### （2）图片镜像

图片镜像使用的是一个奇怪的技巧。使用的是 `scaleX` 属性，这个属性原本是用来改变元素的宽度的，然后里面的值填 `-1` 即 `transform: scaleX(-1);` ，就可以实现图片左右镜像。上下镜像也类似。

::: normal-demo 图片镜像

```html
<svg xmlns="http://www.w3.org/2000/svg" width="128px" height="128px" viewBox="0 0 128 128" data-name="Layer 1" id="Layer_1"><defs><style>.cls-1{fill:#00adfe;}.cls-2,.cls-3{fill:#fff;}.cls-2{opacity:0.3;}.cls-10,.cls-4{fill:#393c54;}.cls-4{opacity:0.1;}.cls-5{fill:#f85565;}.cls-6{fill:#f8dc25;}.cls-7{fill:#4bc190;}.cls-8{fill:#356cb6;}.cls-9{fill:none;stroke:#515570;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><title/><circle class="cls-1" cx="64" cy="64" r="60"/><circle class="cls-2" cx="64" cy="64" r="48"/><path class="cls-3" d="M109.39,68.76A17.56,17.56,0,0,0,91.82,51.2a18.1,18.1,0,0,0-3.85.43,26.19,26.19,0,0,0-40-10A16.33,16.33,0,0,0,24.82,59a8.78,8.78,0,0,0-3.37,15.75,21,21,0,0,0,24.86,28.09,11.37,11.37,0,0,0,19.21,3.8A21,21,0,0,0,99.13,89.81,21.27,21.27,0,0,0,98.56,85,17.56,17.56,0,0,0,109.39,68.76Z"/><path class="cls-4" d="M109.39,68.76A17.56,17.56,0,0,0,91.82,51.2a18.1,18.1,0,0,0-3.85.43,26.19,26.19,0,0,0-40-10A16.33,16.33,0,0,0,24.82,59a8.78,8.78,0,0,0-3.37,15.75,21,21,0,0,0,24.86,28.09,11.37,11.37,0,0,0,19.21,3.8A21,21,0,0,0,99.13,89.81,21.27,21.27,0,0,0,98.56,85,17.56,17.56,0,0,0,109.39,68.76Z"/><path class="cls-3" d="M106.53,60.49c-.07-.48-.18-1.09-.32-1.78A17.51,17.51,0,0,0,91.82,51.2a18.1,18.1,0,0,0-3.85.43,26.19,26.19,0,0,0-40-10A16.33,16.33,0,0,0,24.82,59a8.8,8.8,0,0,0-6.47,5.5A9.88,9.88,0,0,0,29.41,71,17.89,17.89,0,0,0,59.08,88.19a17.77,17.77,0,0,0,32.73-9.6,18,18,0,0,0-.35-3.47,12.93,12.93,0,0,0,15.07-14.63Z"/><path class="cls-5" d="M97.22,14A59.64,59.64,0,0,0,81.14,6.5,72.93,72.93,0,0,0,43.69,58.18L56.76,60.5A59.72,59.72,0,0,1,97.22,14Z"/><path class="cls-6" d="M97.23,14.05A60,60,0,0,0,56.76,60.5l13.08,2.32a46.53,46.53,0,0,1,39.61-38A60,60,0,0,0,97.23,14.05Z"/><path class="cls-7" d="M118,37.83a60,60,0,0,0-8.55-13,46.42,46.42,0,0,0-39.61,38l13.08,2.32a33.13,33.13,0,0,1,32.63-27.41C116.36,37.73,117.18,37.77,118,37.83Z"/><path class="cls-4" d="M82.92,65.14a33.14,33.14,0,0,1,4.63-12A13,13,0,0,0,71,54.11a16.49,16.49,0,0,0-10.21-3.56h-.33a12.94,12.94,0,0,0-8-8.74A12.63,12.63,0,0,0,49,41a73.4,73.4,0,0,0-5.26,17.14L56.76,60.5h0l13.08,2.32h0Z"/><path class="cls-8" d="M70,123.7a59.86,59.86,0,0,0,10-1.87V76H70Z"/><path class="cls-8" d="M40,119a59.62,59.62,0,0,0,10,3.35V76H40Z"/><path class="cls-3" d="M83,55.21A9,9,0,0,0,71.4,60.5h0a12.42,12.42,0,0,0-14.55-5.3A9,9,0,1,0,49,63a12.44,12.44,0,0,0,23.42,8.41A12.7,12.7,0,0,0,73,69.49,9,9,0,1,0,83,55.21Z"/><path class="cls-9" d="M66,72a4,4,0,0,0,4,4H80"/><path class="cls-9" d="M53.67,72a4,4,0,0,1-4,4H40"/><path class="cls-10" d="M52.45,94a1,1,0,0,1-.94-1.06,8.56,8.56,0,0,1,17,0A1,1,0,0,1,67.55,94Z"/><path class="cls-5" d="M65.75,94a6.06,6.06,0,0,0-11.5,0Z"/><path class="cls-8" d="M36,110a2,2,0,0,1-4,0c0-1.1.9-3.41,2-3.41S36,108.9,36,110Z"/><path class="cls-8" d="M58.67,119a2,2,0,0,1-4,0c0-1.1.89-3.41,2-3.41S58.67,117.9,58.67,119Z"/><path class="cls-8" d="M66,115.41a2,2,0,0,1-4,0c0-1.1.9-3.41,2-3.41S66,114.31,66,115.41Z"/><path class="cls-8" d="M87.55,115.41a2,2,0,0,1-4,0c0-1.1.9-3.41,2-3.41S87.55,114.31,87.55,115.41Z"/></svg>
```

```css
svg:hover {
	transform: scaleX(-1);
}
```

:::

### （3）图片反射

图片反射类似于上面的图片镜像，但反射出来的图片是在图片的周围，而且无占用体积，最重要的是此功能是非标准的，不推荐使用。

+ 图像下方的反射，并偏移 20px

```css
img {
  -webkit-box-reflect: below 20px;
}
```

## 八、对象适应

`object-fit` 属性用于指定如何调整 `<img>` 或 `<video>` 的大小以适合其容器。

如果对图片直接设置宽度和高度，图片会被压缩或者拉伸，**其原始纵横比被破坏**。

这是 `object-fit` 属性的来源。`object-fit` 属性可以采用以下值之一：

- `fill` - 默认。直接调整图像大小到指定数值，图像将被拉伸或挤压以适应。
- `contain` - 图像保持其纵横比，但调整大小尽量适应给定尺寸，一般只会有高度或者宽度符合。
- `cover` - 图像将 **被剪裁** 保持以其纵横比，并同时填充元素的整个内容框
- `none` - 图像将直接被裁剪，但未调整大小
- `scale-down` - 比较 `none` 与 ` contain` 哪一个尺寸更小，就应用哪一个属性

::: normal-demo 对象适应

```html
<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" id="Layer_1"><defs><style>.cls-1{fill:#00adfe;}.cls-2,.cls-3{fill:#fff;}.cls-2{opacity:0.3;}.cls-10,.cls-4{fill:#393c54;}.cls-4{opacity:0.1;}.cls-5{fill:#f85565;}.cls-6{fill:#f8dc25;}.cls-7{fill:#4bc190;}.cls-8{fill:#356cb6;}.cls-9{fill:none;stroke:#515570;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><title/><circle class="cls-1" cx="64" cy="64" r="60"/><circle class="cls-2" cx="64" cy="64" r="48"/><path class="cls-3" d="M109.39,68.76A17.56,17.56,0,0,0,91.82,51.2a18.1,18.1,0,0,0-3.85.43,26.19,26.19,0,0,0-40-10A16.33,16.33,0,0,0,24.82,59a8.78,8.78,0,0,0-3.37,15.75,21,21,0,0,0,24.86,28.09,11.37,11.37,0,0,0,19.21,3.8A21,21,0,0,0,99.13,89.81,21.27,21.27,0,0,0,98.56,85,17.56,17.56,0,0,0,109.39,68.76Z"/><path class="cls-4" d="M109.39,68.76A17.56,17.56,0,0,0,91.82,51.2a18.1,18.1,0,0,0-3.85.43,26.19,26.19,0,0,0-40-10A16.33,16.33,0,0,0,24.82,59a8.78,8.78,0,0,0-3.37,15.75,21,21,0,0,0,24.86,28.09,11.37,11.37,0,0,0,19.21,3.8A21,21,0,0,0,99.13,89.81,21.27,21.27,0,0,0,98.56,85,17.56,17.56,0,0,0,109.39,68.76Z"/><path class="cls-3" d="M106.53,60.49c-.07-.48-.18-1.09-.32-1.78A17.51,17.51,0,0,0,91.82,51.2a18.1,18.1,0,0,0-3.85.43,26.19,26.19,0,0,0-40-10A16.33,16.33,0,0,0,24.82,59a8.8,8.8,0,0,0-6.47,5.5A9.88,9.88,0,0,0,29.41,71,17.89,17.89,0,0,0,59.08,88.19a17.77,17.77,0,0,0,32.73-9.6,18,18,0,0,0-.35-3.47,12.93,12.93,0,0,0,15.07-14.63Z"/><path class="cls-5" d="M97.22,14A59.64,59.64,0,0,0,81.14,6.5,72.93,72.93,0,0,0,43.69,58.18L56.76,60.5A59.72,59.72,0,0,1,97.22,14Z"/><path class="cls-6" d="M97.23,14.05A60,60,0,0,0,56.76,60.5l13.08,2.32a46.53,46.53,0,0,1,39.61-38A60,60,0,0,0,97.23,14.05Z"/><path class="cls-7" d="M118,37.83a60,60,0,0,0-8.55-13,46.42,46.42,0,0,0-39.61,38l13.08,2.32a33.13,33.13,0,0,1,32.63-27.41C116.36,37.73,117.18,37.77,118,37.83Z"/><path class="cls-4" d="M82.92,65.14a33.14,33.14,0,0,1,4.63-12A13,13,0,0,0,71,54.11a16.49,16.49,0,0,0-10.21-3.56h-.33a12.94,12.94,0,0,0-8-8.74A12.63,12.63,0,0,0,49,41a73.4,73.4,0,0,0-5.26,17.14L56.76,60.5h0l13.08,2.32h0Z"/><path class="cls-8" d="M70,123.7a59.86,59.86,0,0,0,10-1.87V76H70Z"/><path class="cls-8" d="M40,119a59.62,59.62,0,0,0,10,3.35V76H40Z"/><path class="cls-3" d="M83,55.21A9,9,0,0,0,71.4,60.5h0a12.42,12.42,0,0,0-14.55-5.3A9,9,0,1,0,49,63a12.44,12.44,0,0,0,23.42,8.41A12.7,12.7,0,0,0,73,69.49,9,9,0,1,0,83,55.21Z"/><path class="cls-9" d="M66,72a4,4,0,0,0,4,4H80"/><path class="cls-9" d="M53.67,72a4,4,0,0,1-4,4H40"/><path class="cls-10" d="M52.45,94a1,1,0,0,1-.94-1.06,8.56,8.56,0,0,1,17,0A1,1,0,0,1,67.55,94Z"/><path class="cls-5" d="M65.75,94a6.06,6.06,0,0,0-11.5,0Z"/><path class="cls-8" d="M36,110a2,2,0,0,1-4,0c0-1.1.9-3.41,2-3.41S36,108.9,36,110Z"/><path class="cls-8" d="M58.67,119a2,2,0,0,1-4,0c0-1.1.89-3.41,2-3.41S58.67,117.9,58.67,119Z"/><path class="cls-8" d="M66,115.41a2,2,0,0,1-4,0c0-1.1.9-3.41,2-3.41S66,114.31,66,115.41Z"/><path class="cls-8" d="M87.55,115.41a2,2,0,0,1-4,0c0-1.1.9-3.41,2-3.41S87.55,114.31,87.55,115.41Z"/></svg>
```

```css
svg {
	height: 50px;
  width: 80px;
}
```

:::

在属性值为 `cover` 和 `none` 时，图片会被裁剪，可以使用 `object-position` 来指定图片裁剪的部分。

+ 默认值为 ` 50% 50%`
+ 第一个值是 x 轴偏移量，也就是偏移宽度
+ 第二个值是 y 轴偏移量，也就是偏移高度

## 九、图片遮罩

创建一个遮罩层以放置在元素上以隐藏元素的某些部分

使用图片遮罩步骤：

1. 定义遮罩的图片，图片的黑色部分将会自动变成透明
2. 然后定义遮罩图片的样式。

```css
.mask1 {
  -webkit-mask-image: url(w3logo.png);
  -webkit-mask-repeat: no-repeat;
  
  mask-image: url(w3logo.png);
  mask-repeat: no-repeat;
}
```

----

也可以使用线性渐变或者径向渐变作为遮罩。

```css
.mask {
  -webkit-mask-image: linear-gradient(black, transparent);
  mask-image: linear-gradient(black, transparent);
  
  -webkit-mask-image: radial-gradient(circle, black 50%, rgba(0, 0, 0, 0.5) 50%);
  mask-image: radial-gradient(circle, black 50%, rgba(0, 0, 0, 0.5) 50%);
}
```

效果如下：

:::  normal-demo 渐变遮罩

```html
<div id="mask1">
  <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" id="Layer_1"><defs><style>.cls-1{fill:#00adfe;}.cls-2,.cls-3{fill:#fff;}.cls-2{opacity:0.3;}.cls-10,.cls-4{fill:#393c54;}.cls-4{opacity:0.1;}.cls-5{fill:#f85565;}.cls-6{fill:#f8dc25;}.cls-7{fill:#4bc190;}.cls-8{fill:#356cb6;}.cls-9{fill:none;stroke:#515570;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><title/><circle class="cls-1" cx="64" cy="64" r="60"/><circle class="cls-2" cx="64" cy="64" r="48"/><path class="cls-3" d="M109.39,68.76A17.56,17.56,0,0,0,91.82,51.2a18.1,18.1,0,0,0-3.85.43,26.19,26.19,0,0,0-40-10A16.33,16.33,0,0,0,24.82,59a8.78,8.78,0,0,0-3.37,15.75,21,21,0,0,0,24.86,28.09,11.37,11.37,0,0,0,19.21,3.8A21,21,0,0,0,99.13,89.81,21.27,21.27,0,0,0,98.56,85,17.56,17.56,0,0,0,109.39,68.76Z"/><path class="cls-4" d="M109.39,68.76A17.56,17.56,0,0,0,91.82,51.2a18.1,18.1,0,0,0-3.85.43,26.19,26.19,0,0,0-40-10A16.33,16.33,0,0,0,24.82,59a8.78,8.78,0,0,0-3.37,15.75,21,21,0,0,0,24.86,28.09,11.37,11.37,0,0,0,19.21,3.8A21,21,0,0,0,99.13,89.81,21.27,21.27,0,0,0,98.56,85,17.56,17.56,0,0,0,109.39,68.76Z"/><path class="cls-3" d="M106.53,60.49c-.07-.48-.18-1.09-.32-1.78A17.51,17.51,0,0,0,91.82,51.2a18.1,18.1,0,0,0-3.85.43,26.19,26.19,0,0,0-40-10A16.33,16.33,0,0,0,24.82,59a8.8,8.8,0,0,0-6.47,5.5A9.88,9.88,0,0,0,29.41,71,17.89,17.89,0,0,0,59.08,88.19a17.77,17.77,0,0,0,32.73-9.6,18,18,0,0,0-.35-3.47,12.93,12.93,0,0,0,15.07-14.63Z"/><path class="cls-5" d="M97.22,14A59.64,59.64,0,0,0,81.14,6.5,72.93,72.93,0,0,0,43.69,58.18L56.76,60.5A59.72,59.72,0,0,1,97.22,14Z"/><path class="cls-6" d="M97.23,14.05A60,60,0,0,0,56.76,60.5l13.08,2.32a46.53,46.53,0,0,1,39.61-38A60,60,0,0,0,97.23,14.05Z"/><path class="cls-7" d="M118,37.83a60,60,0,0,0-8.55-13,46.42,46.42,0,0,0-39.61,38l13.08,2.32a33.13,33.13,0,0,1,32.63-27.41C116.36,37.73,117.18,37.77,118,37.83Z"/><path class="cls-4" d="M82.92,65.14a33.14,33.14,0,0,1,4.63-12A13,13,0,0,0,71,54.11a16.49,16.49,0,0,0-10.21-3.56h-.33a12.94,12.94,0,0,0-8-8.74A12.63,12.63,0,0,0,49,41a73.4,73.4,0,0,0-5.26,17.14L56.76,60.5h0l13.08,2.32h0Z"/><path class="cls-8" d="M70,123.7a59.86,59.86,0,0,0,10-1.87V76H70Z"/><path class="cls-8" d="M40,119a59.62,59.62,0,0,0,10,3.35V76H40Z"/><path class="cls-3" d="M83,55.21A9,9,0,0,0,71.4,60.5h0a12.42,12.42,0,0,0-14.55-5.3A9,9,0,1,0,49,63a12.44,12.44,0,0,0,23.42,8.41A12.7,12.7,0,0,0,73,69.49,9,9,0,1,0,83,55.21Z"/><path class="cls-9" d="M66,72a4,4,0,0,0,4,4H80"/><path class="cls-9" d="M53.67,72a4,4,0,0,1-4,4H40"/><path class="cls-10" d="M52.45,94a1,1,0,0,1-.94-1.06,8.56,8.56,0,0,1,17,0A1,1,0,0,1,67.55,94Z"/><path class="cls-5" d="M65.75,94a6.06,6.06,0,0,0-11.5,0Z"/><path class="cls-8" d="M36,110a2,2,0,0,1-4,0c0-1.1.9-3.41,2-3.41S36,108.9,36,110Z"/><path class="cls-8" d="M58.67,119a2,2,0,0,1-4,0c0-1.1.89-3.41,2-3.41S58.67,117.9,58.67,119Z"/><path class="cls-8" d="M66,115.41a2,2,0,0,1-4,0c0-1.1.9-3.41,2-3.41S66,114.31,66,115.41Z"/><path class="cls-8" d="M87.55,115.41a2,2,0,0,1-4,0c0-1.1.9-3.41,2-3.41S87.55,114.31,87.55,115.41Z"/></svg>
</div>

<div id="mask2">
  <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" id="Layer_1" width='130' height='130' ><defs><style>.cls-1{fill:#00adfe;}.cls-2,.cls-3{fill:#fff;}.cls-2{opacity:0.3;}.cls-10,.cls-4{fill:#393c54;}.cls-4{opacity:0.1;}.cls-5{fill:#f85565;}.cls-6{fill:#f8dc25;}.cls-7{fill:#4bc190;}.cls-8{fill:#356cb6;}.cls-9{fill:none;stroke:#515570;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><title/><circle class="cls-1" cx="64" cy="64" r="60"/><circle class="cls-2" cx="64" cy="64" r="48"/><path class="cls-3" d="M109.39,68.76A17.56,17.56,0,0,0,91.82,51.2a18.1,18.1,0,0,0-3.85.43,26.19,26.19,0,0,0-40-10A16.33,16.33,0,0,0,24.82,59a8.78,8.78,0,0,0-3.37,15.75,21,21,0,0,0,24.86,28.09,11.37,11.37,0,0,0,19.21,3.8A21,21,0,0,0,99.13,89.81,21.27,21.27,0,0,0,98.56,85,17.56,17.56,0,0,0,109.39,68.76Z"/><path class="cls-4" d="M109.39,68.76A17.56,17.56,0,0,0,91.82,51.2a18.1,18.1,0,0,0-3.85.43,26.19,26.19,0,0,0-40-10A16.33,16.33,0,0,0,24.82,59a8.78,8.78,0,0,0-3.37,15.75,21,21,0,0,0,24.86,28.09,11.37,11.37,0,0,0,19.21,3.8A21,21,0,0,0,99.13,89.81,21.27,21.27,0,0,0,98.56,85,17.56,17.56,0,0,0,109.39,68.76Z"/><path class="cls-3" d="M106.53,60.49c-.07-.48-.18-1.09-.32-1.78A17.51,17.51,0,0,0,91.82,51.2a18.1,18.1,0,0,0-3.85.43,26.19,26.19,0,0,0-40-10A16.33,16.33,0,0,0,24.82,59a8.8,8.8,0,0,0-6.47,5.5A9.88,9.88,0,0,0,29.41,71,17.89,17.89,0,0,0,59.08,88.19a17.77,17.77,0,0,0,32.73-9.6,18,18,0,0,0-.35-3.47,12.93,12.93,0,0,0,15.07-14.63Z"/><path class="cls-5" d="M97.22,14A59.64,59.64,0,0,0,81.14,6.5,72.93,72.93,0,0,0,43.69,58.18L56.76,60.5A59.72,59.72,0,0,1,97.22,14Z"/><path class="cls-6" d="M97.23,14.05A60,60,0,0,0,56.76,60.5l13.08,2.32a46.53,46.53,0,0,1,39.61-38A60,60,0,0,0,97.23,14.05Z"/><path class="cls-7" d="M118,37.83a60,60,0,0,0-8.55-13,46.42,46.42,0,0,0-39.61,38l13.08,2.32a33.13,33.13,0,0,1,32.63-27.41C116.36,37.73,117.18,37.77,118,37.83Z"/><path class="cls-4" d="M82.92,65.14a33.14,33.14,0,0,1,4.63-12A13,13,0,0,0,71,54.11a16.49,16.49,0,0,0-10.21-3.56h-.33a12.94,12.94,0,0,0-8-8.74A12.63,12.63,0,0,0,49,41a73.4,73.4,0,0,0-5.26,17.14L56.76,60.5h0l13.08,2.32h0Z"/><path class="cls-8" d="M70,123.7a59.86,59.86,0,0,0,10-1.87V76H70Z"/><path class="cls-8" d="M40,119a59.62,59.62,0,0,0,10,3.35V76H40Z"/><path class="cls-3" d="M83,55.21A9,9,0,0,0,71.4,60.5h0a12.42,12.42,0,0,0-14.55-5.3A9,9,0,1,0,49,63a12.44,12.44,0,0,0,23.42,8.41A12.7,12.7,0,0,0,73,69.49,9,9,0,1,0,83,55.21Z"/><path class="cls-9" d="M66,72a4,4,0,0,0,4,4H80"/><path class="cls-9" d="M53.67,72a4,4,0,0,1-4,4H40"/><path class="cls-10" d="M52.45,94a1,1,0,0,1-.94-1.06,8.56,8.56,0,0,1,17,0A1,1,0,0,1,67.55,94Z"/><path class="cls-5" d="M65.75,94a6.06,6.06,0,0,0-11.5,0Z"/><path class="cls-8" d="M36,110a2,2,0,0,1-4,0c0-1.1.9-3.41,2-3.41S36,108.9,36,110Z"/><path class="cls-8" d="M58.67,119a2,2,0,0,1-4,0c0-1.1.89-3.41,2-3.41S58.67,117.9,58.67,119Z"/><path class="cls-8" d="M66,115.41a2,2,0,0,1-4,0c0-1.1.9-3.41,2-3.41S66,114.31,66,115.41Z"/><path class="cls-8" d="M87.55,115.41a2,2,0,0,1-4,0c0-1.1.9-3.41,2-3.41S87.55,114.31,87.55,115.41Z"/></svg>
</div>
```

```css
#mask1 svg{
  -webkit-mask-image: linear-gradient(black, transparent);
  mask-image: linear-gradient(black, transparent);
}

#mask2 svg {
  -webkit-mask-image: radial-gradient(circle, black 30%, rgba(0, 0, 0, 0.1) 70%);
  mask-image: radial-gradient(circle, black 30%, rgba(0, 0, 0, 0.1) 70%);
}
```

:::

可以使用 svg 来定义遮罩图片，但需要指定格式。

1. 指定遮罩图片的宽度和长度。
2. `<mask>` 里面指定遮罩的图形，这里图形是三角形。
3. `<image>` 指定被遮罩的图片。

```html
<svg width="600" height="400">
  <mask id="svgmask1">
    <polygon fill="#ffffff" points="200 0, 400 400, 0 400"></polygon>
  </mask>
  <image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img_5terre.jpg" mask="url(#svgmask1)"></image>
</svg>
```



