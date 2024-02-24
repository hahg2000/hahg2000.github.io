# 重学HTML-上

## 一、前言

在【2022年4月17日】的时候，终于完成了大部分的论文工作，可以开始找实习了。现在首先要去记熟一些基本概念，查缺补漏，所以开始重新回顾HTML的知识。

注：该笔记并不会包含HTML的所有知识，因为有些之前学习过了就不会再写进笔记里。[学习链接](https://wangdoc.com/html/intro.html)

### 1.1 不太严谨的HTML

HTML 语言和 Javascript 语言都不太严谨。

+ HTML 语言里的标签和属性不区分大小写。
  + 也就是说你可以在一个单词里随意使用大小写——`dIv`  而不报错。但为了规范一般 **全使用小写**。
  + 属性也不区分大小写，`onclick`和 `onClick` 是同一个属性；属性值可以使用双引号也可以使用单引号，但 **一般会使用双引号**。
+ HTML 语言会忽略缩进和换行，无论你的格式写得怎么样显示效果都 **差不多**。如果你想文字换行，可不能像普通那样敲一个回车就完事。

### 1.2 块级元素与行内元素

上面说到了你文字不能直接敲回车换行，现在就有了一个解决方案，使用块级元素。

注意，块级元素在 HTML 4.1 版本之前才用，HTML5 后采用一个更复杂的 [内容类别](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/Content_categories) 代替。

块级元素顾名思义就是该元素占据了页面的那一行块，其他的元素就被挤到了上面和下面，就有了换行效果。

那么哪些是主要的块级元素呢？

+ 两大列表六大标题——【ul，ol，（li）】，【h1~h6】
+ 表格表单分割线——【table，form，hr】
+ 文档分区块引用——【div，blockquote】

---

然后在 HTML5 后将标签需要符合的规则分为三类：

+ 主要规则：该规则将有许多元素符合。
+ 表单相关的规则：表单相关元素才需要符合规则。
+ 特殊规则：仅有一些特殊的元素才需要符合的规则。

网页的第一个标签通常是`<!doctype>`，表示文档类型，告诉浏览器如何解析网页。

### 1.3 最初始的标签

最初始的标签有几个：`<!doctype>`  、`<html>` 、`<head>` 、`<body>`

+ `<!doctype>`

网页的第一个标签通常是 `<!doctype>`，表示文档类型，告诉浏览器如何解析网页。

如果想浏览器按照 HTML 5 的规则处理网页，声明doctype为html即可。

有时，该标签采用 **完全大写** 的形式，以便区别于正常的 HTML 标签。因为`<!doctype>`本质上不是标签，更像一个处理指令。

```html
<!doctype html>
<!DOCTYPE html>
```

+ `<html>`

\<html\> 标签是网页的顶层容器，即标签树结构的顶层节点，也称为根元素（root element），其他元素都是它的子元素。**一个网页只能有一个 `<html>` 标签**。

该标签的`lang`属性，表示网页内容默认的语言。

```
<html lang="zh-CN">
```

+ `<head>`

`<head>` 标签是一个容器标签，用于放置网页的元信息。**它的内容不会出现在网页上，而是为网页渲染提供额外信息**。`<head>` 是 `<html>` 的第一个子元素。如果网页不包含 `<head>`，浏览器会 **自动创建一个**。

`<head>`的子元素一般有下面七个。

- `<meta>`：设置网页的元数据。
- `<link>`：连接外部样式表。
- `<title>`：设置网页标题。
- `<style>`：放置内嵌的样式表。
- `<script>`：引入脚本。
- `<noscript>`：浏览器不支持脚本时，所要显示的内容。
- `<base>`：设置网页内部相对 URL 的计算基准。

### 1.4 head标签的子标签

+ `<meta>`：。meta 翻译为 元。想到了元宇宙——Metaverse 。**用于设置网页的基本配置**。

该标签有五个属性。

1. charset：用来指定网页的编码方式。`<meta charset="utf-8">`

2. name 与 content ：两个一起使用的属性，**可以标注网页的一些信息**。name 属性的值有很多种类，**大部分涉及浏览器内部工作机制，或者特定的使用场景**。

例如下面 `description` 是网页内容的描述，`keywords` 是网页内容的关键字，`author` 是网页作者。

```html
<head>
  <meta name="description" content="HTML 语言入门">
  <meta name="keywords" content="HTML,教程">
  <meta name="author" content="张三">
</head>
```

3. http-equiv 与 content ：`http-equiv` 属性用来**覆盖 HTTP 回应的头信息字段**，`content` 属性是**对应的字段内容**。这两个属性与 HTTP 协议相关，属于高级用法，尚未搞懂。

+ `<title>` 标签用于指定网页的标题，会 **显示在浏览器窗口的标题栏**。`<title>` 标签的内部，不能再放置其他标签，只能放置无格式的纯文本。

```html
<head>
  <title>网页标题</title>
</head>
```

一般个人博客会根据打开者的焦点是否在本页面来切换标题，达到很有趣的效果。或者是标题滚动效果。

使用的是 `visibilitychange` 事件，当浏览器切换标签页或者最小化时，`document.visibilityState` 属性就会从 `visible`  变成 `hidden` 。所以代码可以这样写。

```js
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState == 'hidden') {
    document.title = '快给我回来';
  } else {
    document.title = '你终于回来了！QAQ';
  }
});
```

### 1.4 body标签

`<body>` 标签是一个容器标签，用于放置网页的主体内容。**浏览器显示的页面内容，都放置在它的内部**。

### 1.5 空格和换行

前面提到 HTML 语言会忽略缩进和换行，对空格也有特殊的处理方式。

+ 文字的 **左右空格会被省略**：`<标签> （多个空格）文字（多个空格）</标签>  => <标签>文字</标签>`
+ 文字中的空格 **最多为一个**：`<标签>文（多个空格）字</标签>  => <标签>文 字</标签>`
+ **换行也会被看成空格**。

### 1.6 URL 

URL 是 “ 统一资源定位符 ”（Uniform Resource Locator）的首字母缩写，中文译为 “ 网址 ”，**表示各种资源的互联网地址**。

注意：url、uri 和 urn 是不同的。

网址的各个部分都有不同的含义，具体可以参看 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Location#result) ，或者 原生JS-下 1.3节。

例如完整地址：`https://www.example.com:80/path/to/myfile.html?key1=value1&key2=value2#anchor`

+ 协议：`https://`
+ 主机：`www.example.com:80`
  + 主机名：`www.example.com`
  + 端口号：`80`
+ 路径：`/path/to/myfile.html`
+ 查询参数：`key1=value1&key2=value2`
+ 锚点：`#anchor`

### 1.7 URL所出现的字符

URL 的各个组成部分，只能使用以下这些字符。

| 类型         | 包含                                          |
| :----------- | :-------------------------------------------- |
| 保留字符     | `;` `,` `/` `?` `:` `@` `&` `=` `+` `$`       |
| 非转义的字符 | 字母 数字 `-` `_` `.` `!` `~` `*` `'` `(` `)` |
| 数字符号     | `#`                                           |

其他的字符都需要转义，但浏览器会 **将转义字符展示出来**，例如在百度输入中文字，会发现地址栏上也会显示中文，但 **复制网址出来其实是转义字符**。

### 1.8 base标签

`<base>` 标签指定网页内部的 **所有相对 URL 的计算基准**。

整张网页 **只能有一个 `<base>` 标签**，而且只能放在 `<head>` 里面。它是单独使用的标签，没有闭合标签。

```html
<head>
	<base href="https://www.example.com/files/" target="_blank">
</head>
```

例如现在有一个 a 链接。`<a href="a.html">点击</a>`

点击后就会在新标签页打开 `https://www.example.com/files/a.html`

### 1.9 id属性的另一种用法

`id` 属性的值还可以在最前面加上`#`，放到 URL 中作为锚点，**定位到该元素在网页内部的位置**。

比如，用户访问网址 `https://foo.com/index.html#bar` 的时候，浏览器会自动将页面滚动到 `bar` 的位置，让用户第一眼就看到这部分内容。

### 1.10 焦点跳转的顺序——tabindex

`tabindex` 的属性按下 Tab 键后焦点跳转的顺序（一般也不会有网址专门对这个进行优化吧。。。）

`tabindex` 属性的值是一个整数：

- 负整数：该元素可以获得焦点，但 **不参与 Tab 键对网页元素的遍历**。这个值通常是`-1`。
- `0`：该元素参与 Tab 键的遍历，顺序由浏览器指定，通常是 **按照其在网页里面出现的位置。**
- 正整数：**网页元素按照从小到大的顺序**（1、2、3、……），参与 Tab 键的遍历。如果多个元素的 `tabindex`属性相同，则按照在网页源码里面出现的顺序遍历。

### 1.11 获取焦点的快捷键——accesskey

`accesskey` 属性 **指定网页元素获得焦点的快捷键**，但对于一些标签来说是点击效果，例如按钮、单选框和多选框。

`accesskey` 值就是按下的键，获得焦点需要同时按下 Alt + 某个键。例如下面按下 Alt + u ，则会弹出警告框。

```html
<button onclick='alert("您按下我了")' accesskey='u'>按下我</button>
```

### 1.12 文字的配置——lang,dir

`lang` 属性 **表明网页元素使用的语言**，但不会对实际显示效果有什么影响。

`lang`属性的值，必须符合 [BCP47](https://www.ietf.org/rfc/bcp/bcp47.txt) 的标准。下面是一些常见的语言代码。

- zh：中文
- zh-Hans：简体中文
- zh-Hant：繁体中文
- en：英语
- en-US：美国英语
- en-GB：英国英语
- es：西班牙语
- fr：法语

`dir`属性 **表示文字的阅读方向**，有三个可能的值。

- `ltr`：从左到右阅读，比如英语。
- `rtl`：从右到左阅读，阿拉伯语、波斯语、希伯来语都属于这一类。
- `auto`：浏览器根据内容的解析结果，自行决定。

设置 dir 属性效果就是 **页面进行了左右对称**。

（小投机：如果想将文字从左顶格变为右顶格，直接设置该属性为 `rtl` 即可）

### 1.13 两个不太有用的属性——contenteditable和spellcheck

`contenteditable` ：允许用户修改内容，和文本框差不多功能？

其属性值：

- `true` 或空字符串：内容可以编辑
- `false`：不可以编辑

`spellcheck` ：编辑内容时，拼错的单词下面会显示红色的波浪线。（鸡肋功能）

其属性值：

- `true`：打开拼写检查
- `false`：关闭拼写检查

### 1.14 字符编码

网页包含了大量的文字，浏览器必须知道这些文字的编码方法，才能把文字还原出来。

一般情况下，服务器向浏览器发送 HTML 网页文件时，会 **通过 HTTP 头信息**，声明网页的编码方式。

+ 通常会设置为 `Content-Type: text/html; charset=UTF-8`
+ 网页内部也会再用 `<meta>` 标签，再次声明网页的编码。`<meta charset="UTF-8">`

HTML 允许使用 **Unicode 码点** 表示字符，浏览器会自动将码点转成对应的字符。

**字符的码点表示法**

+ &#**N**;（十进制，N代表 ASCII码）
+ &#x**N**;（十六进制，N代表 ASCII码）

```html
<p>hello</p>
<!-- 等同于十进制 -->
<p>&#104;&#101;&#108;&#108;&#111;</p>
<!-- 等同于十六进制 -->
<p>&#x68;&#x65;&#x6c;&#x6c;&#x6f;</p>
```

注意，**HTML 标签本身不能使用码点表示**，否则浏览器会认为这是所要显示的文本内容，而不是标签。

**字符的实体表示法**

数字表示法的不方便之处，在于 **必须知道每个字符的 ASCII码**，很难记忆。

为了能够快速输入，HTML 为一些特殊字符，规定了容易记忆的名字，**允许通过名字来表示它们**，这称为实体表示法（entity）。

+ `<`：`&lt` 【Less Then】

+ `>`：`&gt` 【Great Then】
+ `"`：`&quot` 【quotation mark】引号
+ `'`：`&apos` 【apostrophos】希腊语，撇号
+ `&`：`&amp` 【ampersand】拉丁语，和号
+ `©`：`&copy` 【copyright】版权
+ `#`：`&num` 【number sign】数字符号，也有其他叫法
+ `§`：`&sect` 【section sign】节符号
+ `¥`：`&yen` 【Yen and yuan sign】日语和人民名符号
+ `$`：`&dollar` 美元
+ `£`：`&pound` 英镑
+ `¢`：`&cent` 美分
+ `%`：`&percnt` 【percent sign】百分号
+ `*`：`$ast` 【asterisk】拉丁语，星号
+ `@`：`&commat` 【commercial at】商业At
+ `^`：`&Hat` 【Caret】插入符号
+ `±`：`&plusmn` 【plus–minus sign】加减号
+ 空格：`&nbsp` 【non-breaking space】不间断空格

注意最后一个是不间断空格，也就是说在文字中间添加这个空格，浏览器依然认为是一个字符串，所以 **使用这个空格可以保留原有格式，而不会被省略**。

`<div>s&nbsp;&nbsp;&nbsp;s</div>` 显示出来 `s   s`

## 二、标签

### 2.1 页面语义标签

在 HTML5 中新增了几个标签，和 div 没有区别，只是他们 **被赋予了一些特殊含义**，用于区分页面不同区域。

#### （1）`<header>`

`<header>` 标签可以用在多个场景，既可以表示整个网页的头部，也可以表示一篇文章或者一个区块的头部。

+ 如果用在 **网页的头部**，就称为 “ 页眉 ” 。网站导航和搜索栏通常会放在 `<header>` 里面。

例如下面代码：

```html
<header>
  <h1>公司名称</h1>
  <ul>
    <li><a href="/home">首页</a></li>
    <li><a href="/about">关于</a></li>
    <li><a href="/contact">联系</a></li>
  </ul>
</header>
```

+ 如果 `<header>` 用在 **文章的头部**，则可以把文章标题、作者等信息放进去。

```html
<article>
  <header>
    <h2>文章标题</h2>
    <p>张三，发表于2010年1月1日</p>
  </header>
</article>
```

#### （2）`<footer>`

`<footer>` 标签 **表示网页、文章或章节的尾部**。如果用于整张网页的尾部，就称为 “ 页尾 ”，通常包含版权信息或者其他相关信息。

```html
<body>
  <footer>
    <p>© 2018 xxx 公司</p>
  </footer>
</body>
```

`<footer>` 也可以放在文章里面。

```html
<article>
  <footer>
    <p>© 禁止转贴</p>
  </footer>
</article>
```

#### （3）`<main>`

`<main>`标签表示 **页面的主体内容**，**一个页面只能有一个`<main>`**。

下面代码就是最典型的页面结构，有点像 Word 文档的格式了。

```html
<body>
  <header>页眉</header>
  
  <main>
    <article>文章</article>
  </main>
  
  <footer>页尾</footer>
</body>
```

#### （4）`<article>`

`<article>`标签表示页面里面一段完整的内容，通常用来表示 **一篇文章或者一个论坛帖子**。

它可以有自己的标题（`<h1>` 到 `<h6>`）。

```html
<article>
  <h1>文章标题</h1>
  <p>文章内容</p>
</article>
```

#### （5）`<aside>`

`<aside>` 标签用来放置与网页或文章主要内容 **间接相关的部分**。

网页级别的`<aside>`，可以用来放置侧边栏；文章级别的`<aside>`，可以用来放置补充信息、评论或注释。

下面是网页级别的 `<aside>` 的例子。

```html
<body>
  <main>主体内容</main>
  <aside>侧边栏</aside>
</body>
```

下面是文章评注的例子。

```html
<article>
  <p>第一段</p>

  <aside>
    <p>本段需要重点修改</p>
  </aside>
</article>
```

#### （6） `<section>`

`<section>` 标签表示一个 **含有主题的独立部分**，通常用在文档里面表示一个章节。比如`<article>`可以包含多个`<section>`。`<section>` 很适合幻灯片展示的页面，每个`<section>`代表一个幻灯片。

下面为作为章节的例子：

```html
<article>
  <h1>文章标题</h1>
  
  <section>
    <h2>第一章</h2>
    <p>...</p>
  </section>
  
  <section>
    <h2>第二章</h2>
    <p>...</p>
  </section>
</article>
```

**但 `<section>` 也可以含有多个 `<article>` 标签**，这是表示该章节有几篇独立的文章。

#### （7）`<nav>`

`<nav>`标签用于放置页面或文档的 **导航信息**。一般来说，`<nav>` 往往放置在 `<header>` 里面，不适合放入`<footer>`。

```html
<header>
  <nav>
    <ol>
      <li><a href="item-a">商品 A</a></li>
      <li><a href="item-b">商品 B</a></li>
    </ol>
  </nav>
</header>
```

#### （8）`<hgroup>`

如果主标题包含多级标题（比如带有副标题），那么可以使用 `<hgroup>` 标签，将多级标题放在其中。

```html
<hgroup>
  <h1>过好每一天</h1>
  <h2>——观《日常》京都动漫有感</h2>
</hgroup>
```

注意，`<hgroup> `只能包含 `<h1>` ~ `<h6>`，**不能包含其他标签**。

### 2.2 普通标签

#### （1）换行的讲究

上面提到过文本之间可以添加空格了，现在也可以添加换行了

+ `<br>` 让网页产生一个换行效果。该标签是单独使用的，没有闭合标签。

```html
hello<br>world
```

浏览器渲染上面代码时，会分成两行，`hello` 和 `world` 各占一行。`<br>` 对于诗歌和地址的换行非常有用。

```html
<p>
  床前明月光，<br>
  疑是地上霜。<br>
  举头望明月，<br>
  低头思故乡。
</p>
```

但 `<br>` 标签最好只用于文本换行，不建议用作元素之间分隔。例如下面：

```html
<!-- 错误示范 -->
<p>第一段</p>
<br>
<br>
<p>第二段</p>
```

+ `<wbr>` 标签跟 `<br>` 很相似，表示一个预设置的换行。如果一行的宽度足够，则不换行；如果宽度不够，则在 `<wbr>` 的位置的断行。

它是为了防止浏览器在一个很长的字符串中间，不正确地换行。

```html
<p>
我要做<wbr>爱学习的<wbr>好孩子
</p>
```

#### （2）过时的横线

`<hr>` 用来在一篇文章中分隔两个不同的主题，浏览器会将其渲染为一根水平线。该标签是单独使用的，没有闭合标签。该标签是历史遗留下来的，建议尽量避免使用。

因为现在 HTML5 主张将 HTML 标签和 CSS 样式分离开，也就是说 **标签只起到分隔页面的作用，而没有显示效果**。

```html
<p>第一个主题</p>
<hr>
<p>第二个主题</p>
```

#### （3）两组样式相近的标签

两对样式相近的标签：【 `<strong>` 与  `<b>` 】和【`<em>` 与 `<i>` 与 `<cite>`】

+  `<strong>` 与  `<b>`  显示效果都是加粗，但 `<b>` 标签无法得知其含义，而 `<strong>` 标签里的 strong 单词就表明了 **该文字是重点** 。
+ `<em>` 与 `<i>` 与 `<cite>` 显示效果都是斜体，但他们的含义都不同。
  + `<em>` ：emphasize 的缩写，含义为强调，**表示强调所选文字**。例如 " Just *do* it already! " ，对 do 这个动作进行强调。
  + `<i>` ：italic 的缩写，**没什么特殊含义，常用作于区分文本**，就像外来词，虚构人物的思想。例如 "The *Queen Mary* sailed last night" 。不是强调 “ Queen Mary ” 这个名字，只是表明，谈论的对象不是我们平常想的名叫玛丽的女王，而是一艘名字叫玛丽的船。
  + `<cite>` ：表示一个作品的引用，就像中文的书名号，例如 " *Different Seasons*  is a famous book " ，《四季奇谭》是一本著名的书。也可以表示人名等专有名词。

#### （4）数学公式标签

三个数学公式标签： `<sub>`，`<sup>`，`<var>`  ——上标，下标，公式的变量。

+ `<var>` ：尽管该行为取决于浏览器，但通常使用当前字体的 **斜体形式** 显示。

```html
<p>勾股定理是
  <var>a</var><sup>2</sup> + 
  <var>b</var><sup>2</sup> = 
  <var>c</var><sup>2</sup>
</p>
```

显示效果为【勾股定理是 *a*^2^ + *b*^2^ = *c*^2^ 】

#### （5）批改文章标签

四个批改文章标签：`<u>` ， `<s>` ，`<del>` ，`<ins>` 

+ `<u>` ：浏览器默认以 **下划线** 渲染内容，其含义在 HTML5 被定义为拼写错误。**一般会和 CSS 样式画出红色波浪下划线** 。具体如下代码。

```html
<body>
  <p>This paragraph includes a <u class="spelling">wrnogly</u> spelled word.</p>
</body>

<style>
  u.spelling {
    text-decoration: red wavy underline;
  }
</style>
```

+ `<s>`  元素来表示 **不再相关，或者不再准确的事情**，显示效果为 **删除线**，例如下面代码。但表示文档编辑时，不提倡使用 `<s>` 。 

```html
<body>
  <p>
    <s>虽然人工智能在围棋方面还没战胜人类</s>，但不久的将来一定会超越人类。
  </p>
</body>
```

+ 如果在编辑文档的时候，建议使用 `<del>` 和 `<ins>` 。

`<ins>` 表示当前文字是插入的，显示效果是 **下划线** 。而 `<del>` 表示当前文字是需要删除的，显示效果是 **删除线**。

#### （6）引用标签

如果需要引用别人的话，可以使用 `<blockquote>` 和 `<q>`

+ `<blockquote>` 会有像 `<p>` 标签类似的 **分隔周围文字**，但 `<blockquote>` 同时有缩进。
+  `<q>` 会 **自动在文字两端加上双引号**。

#### （7）计算机相关标签

有三个标签会可以用于输出计算机相关的内容：`<code>` ，`<kbd>`，`<samp>` 。三个标签都会让文字变成 **等宽字体** ，现在等宽字体是 Times New Roman。（其实没什么大作用，应该没有人用新罗马字体看代码吧了，Markdown 永远的神）

+ `<code>` ：用于标记 **代码部分**。例如 `<code>console.log()</code>的作用是在控制台输出内容。`
+ `<kbd>` ：用于标记 **键盘的按键**。例如 `可以按下 <kbd>Ctrl</kbd> + <kbd>V</kbd> 复制东西。`

+ `<samp>` ：用于表示 **计算机程序输出内容**。例如下面代码：

```html
<p>如果使用没有定义的变量，浏览器会报错：
  <samp>Uncaught ReferenceError: foo is not defined</samp>。
</p>
```

#### （8）日期地址标签

有四个与日期地址相关的标签：`<time>` ， `<data>` ，`<address>`

+ `<time>` 标签常用 `datetime` 属性， **指定机器可读的日期**，可以有多种格式。
  + 例如，`<p>音乐会在<time datetime="20:00">晚上八点</time>开始。</p>`

+ `<data>`标签常用 `value` 属性。 `<data>` 标签与 `<time>` 类似，也是提供机器可读的内容，但是 **用于非时间的场合**。
  + 例如，`<p>本次50米比赛第一名是<data value="6.89">张三</data></p>。`  value 里的值代表张三的成绩。
+ `<address>` 标签是一个块级元素，表示 **某人或某个组织的联系方式**。常用于 `<footer>` 里面。

#### （9）比较有用的标签

后面有几个比较有用的标签，因为其样式都需要 CSS 实现。

首先是 `<abbr>` 和 `<dfn>`

+ `<abbr>` 【abbreviation】的缩写，中文意思是【缩写】。**表示标签内容是一个缩写**，经常和 `title` 属性给出缩写的完整形式。
  + Chrome 浏览器会对该标签提供圆点下划线。
  + 使用 CSS 样式则是 `text-decoration: black dotted underline;`
+ `<dfn>` 表示标签内容是一个术语（definition）。通常术语也是缩写，所以可以和 `<abbr>` 一起使用。

然后是 `<ruby>` ，表示文字的 **语音注释**，比如汉语拼音和日语的片假名，以小字体显示在文字的上方。

和该标签配套的是 `<rp>` 和 `<rt>`。

+ `<rp>` ：为不支持语音注释的浏览器，**提供一个兼容方案**。和 `<img>` 标签的 `alt` 属性一样。
+ `<rt>` ：标签用于 **放置语音注释**。

使用方法例如下面：

```html
<!-- 简单写法 -->
<ruby>
	汉<rt>han</rt>
	字<rt>zi</rt>
</ruby>

<!-- 有替换写法 -->
<ruby>
	汉
  <rp>(</rp>
  <rt>han</rt>
  <rp>)</rp>
	字
  <rp>(</rp>
  <rt>zi</rt>
  <rp>)</rp>
</ruby>
```

#### （10）倒转字符串的标签

如果想将字符串倒出来，需要使用这句 JS 语句 `a.split('').reverse().join('')` 。

当然也可以使用 `<bdo>` 和 `<bdi>` 。

+ `<bdo>` 表示 **文字方向可能有变**，常与 `dir` 属性一起使用，其有两个值，`ltr` 表示从左到右，是我们平常用的； `rtl` 表示从右到左，是牌匾之类上的字。
+ `<bdi>` 用于 **不确定文字方向的情况**，由浏览器决定。

#### （11）术语列表

有三个标签用作术语的列表：`<dl>` 、`<dt>` 、`<dd>`

+ `<dl>` ： 表示一组术语的列表（description list）
  + `<dt>` ：术语名（description term）
  + `<dd>`：术语解释（description detail）

例如下面代码：

```html
<dl>
  <dt>CPU</dt>
  <dd>中央处理器</dd>

  <dt>Memory</dt>
  <dd>内存</dd>

  <dt>Hard Disk</dt>
  <dd>硬盘</dd>
</dl>
```

#### （12）内置窗口标签

`<iframe>` 标签用于在网页里面嵌入其他网页。

+ `sandbox` 嵌入的网页 **默认具有正常权限**，比如执行脚本、提交表单、弹出窗口等。如果嵌入的网页是其他网站的页面，你不了解对方会执行什么操作，因此就存在安全风险。为了限制 `<iframe>` 的风险，HTML 提供了  `sandbox`  属性，允许设置嵌入的网页的权限，等同于提供了一个隔离层，即 “ 沙箱 ”。
  + 其值可以设置具体的值，表示逐项打开限制。
  + `allow-forms`：**允许提交表单**。
  + `allow-modals`：**允许提示框**，即允许执行 `window.alert()` 等会产生弹出提示框的 JavaScript 方法。（在浏览器没有出 “ 不再弹出此页面的提示框 ” 选项之前，弹出提示框陷阱是比较烦人的 ）
  + `allow-scripts`：**允许嵌入的网页运行脚本**，但不创建弹出窗口。（强制建议不允许，因为可能会将外面的 `sandbox` 属性修改，这样隔离层就会失效）
+ `loading` 属性：可以触发 `<iframe>` 网页的懒加载，其取值和图片懒加载一致。**但火狐依然不支持**。
  + 如果 `<iframe>` 是隐藏的，则 `loading` 属性无效，将会立即加载。（隐藏了但会加载，不隐藏就会不被加载？比较诡异）
  + 三个条件谷歌浏览器将认为 `<iframe>` 是隐藏的。
    + `<iframe>` 的 **宽度和高度为 4 像素或更小**。
    + **样式设为 `display: none` 或 `visibility: hidden`。**
    + 使用定位坐标为负 `X` 或负 `Y`，**将 `<iframe`> 放置在屏幕外**。


### 2.2 图片标签

#### （1）`<img>`

`<img>` 标签用于插入图片，最常用。其有三个高级属性（平时不经常用）——`referrerpolicy` ，`crossorigin` ，`loading`

+ `referrerpolicy` ：在加载图片发送 HTTP 请求时，配置 **是否带 Referer 的头信息**。
+ `crossorigin` ：设置是否 **跨域来下载图片**，其有两个值：
  + `anonymous`：跨域请求不带有用户凭证（通常是 Cookie）。
  + `use-credentials`：跨域请求带有用户凭证。
+ `loading` ：**设置图片是否懒加载**，只有滚动到图片位置，图片才会加载。其有两个值：
  + `lazy`：启用懒加载。
  + `eager`：立即加载资源，无论它在页面上的哪个位置。默认配置。

使用这个属性需要注意两个点：

1. 如果页面是图片撑起来的，懒加载可能会导致布局错乱，所以使用这个属性的时候，**最好指定图片的高和宽固定住图片**。
2. load 事件 **不会等到所有图片加载完成才触发**，也就是说设置了懒加载，load 事件依然和之前一样触发，不会因为部分图片没有加载而不触发。（虽然图片没有加载但图片的标签已加载完成）。

#### （2）`<figure>`

这个标签理解为一个图像区域，将 **图像和相关信息** 封装在一起，例如图片名字、图片作者等。

+ `<figcaption>` 是它的可选子元素，放置图片的相关信息。

```html
<figure>
  <img src="https://zh.moegirl.org.cn/%E5%B9%B8%E8%BF%90%E6%98%9F">
  <figcaption>幸运星</figcaption>
</figure>
```

#### （3）响应式图像

有两个实现响应式图像的属性：`srcset` 和 `size`

+ `srcset` ：根据不同像素密度的屏幕显示不同的图片
  + 属性值是多个 **图像的 URL** 加上 **像素密度的描述符** 的字符串。例如下面代码。
  + `1x` 表示单倍，`2x` 表示两倍。

```html
<img srcset="foo-320w.jpg,
             foo-480w.jpg 1.5x,
             foo-640w.jpg 2x"
     src="foo-640w.jpg">
```

+ `size` ：根据屏幕大小显示不同宽度的图片。
  + 其属性值格式：`(max-width: 440px) 100vw` ，当屏幕宽度小于 **440 px** 时，图片 **100%** 宽度。
  + 需要和 `srcset` 属性同时使用。
+ `srcset` 和 `size` 使用时，其格式变为 `foo-160.jpg 160w` ，w 代表 **图片宽度** 160px 。

举一个例子：例如某张图片在 **480 px 宽度** 的设备显示，符合 `size` 属性值的第二个选项，即图片 33% 宽度，算出来得 160 px；然后根据显示宽度对应 `srcset` 属性值的第一个选项，显示 `foo-160.jpg`  图片。

```html
<img sizes="(max-width: 440px) 100vw,
            (max-width: 900px) 33vw,
            254px"
     srcset="foo-160.jpg 160w,
             foo-320.jpg 320w,
             foo-640.jpg 640w,
             foo-1280.jpg 1280w"     
     src="foo-1280.jpg">
```

---

但如果有多个显示组合，上面两个属性就不够了。这时需要 `<picture>` 标签。

+ `<picture>` 是一个容器标签，内部使用 `<source>` 和 `<img>`，指定 **不同情况下加载的图像**。
  + `<source>` ：用于放置替换方案
  + `<img>` ：放置原始图片

例如下面代码：

+ `media` 属性放置 **显示条件**，其实也可以使用 `size` 属性。
+ `srcset` 属性表明 **显示的图片**
+ 下面代码的意思：宽度不超过 500 px，则显示垂直的图片；宽度不小于 501 px，则显示水平的图片。

```html
<picture>
  <source media="(max-width: 500px)" srcset="cat-vertical.jpg">
  <source media="(min-width: 501px)" srcset="cat-horizontal.jpg">
  <img src="cat.jpg" alt="cat">
</picture>
```

也可以同时 **根据像素密度显示图片**。例如下面代码：

+ 当宽度不小于 990 px 时，则显示 `homepage-person@desktop` 的图片，然后再根据像素密度决定显示的图片。

```html
<picture>
  <source srcset="homepage-person@desktop.png,
                  homepage-person@desktop-2x.png 2x"
          media="(min-width: 990px)">
  <source srcset="homepage-person@tablet.png,
                  homepage-person@tablet-2x.png 2x"
          media="(min-width: 750px)">
  <img srcset="homepage-person@mobile.png,
               homepage-person@mobile-2x.png 2x"
       alt="Shopify Merchant, Corrine Anestopoulos">
</picture>
```

除了响应式图像，`<picture>` 标签还可以 **展示不同格式的图片**。一般用于解决浏览器的兼容问题。

+ 例如下面代码：如果浏览器支持 Webp 格式，就加载这种格式的图像，否则加载 PNG 图像。

```html
<picture>
  <source type="image/webp" srcset="logo.webp"> 
  <img src="logo.png" alt="ACME Corp">
</picture>
```

### 2.3 链接标签

#### （1）普通链接

链接标签主要功能在其属性。

+ `href` ：不仅可以指定跳转网址，也可以指定锚点。例如 `<a href="#demo">示例</a>`
+ `hreflang` ：给出链接的网址所使用的语言，纯粹是提示性的，没有实际功能，和 `lang` 属性一样。

+ `target` ：指定如何展示打开的链接，其不同的值不同的作用：
  + 如果是普通字符串，则 **在新的标签页打开，并以这个字符串作为标题**，但如果链接打开的网址已有标题，则会覆盖。
  + `_self`：当前标签页打开，默认值。
  + `_blank`：新标签页打开。
  + `_parent`：上层窗口打开，这通常用于从父窗口打开的子窗口，或者 `<iframe>` 里面的链接。如果当前窗口没有上层窗口，这个值等同于`_self`。
  + `_top`：顶层窗口打开。如果当前窗口就是顶层窗口，这个值等同于`_self`。

+ `rel` ：**说明链接与当前页面的关系**，该属性常见的值：
  + `alternate`：当前文档的另一种形式，比如翻译。
  + `author`：作者链接。
  + `bookmark`：用作书签的永久地址。
  + `external`：当前文档的外部参考文档。
  + `help`：帮助链接。
  + `license`：许可证链接。
  + `search`：文档的搜索链接。
  + `tag`：文档的标签链接。
  + `next`：系列文档的下一篇。
  + `prev`：系列文档的上一篇。
  + `nofollow`：告诉搜索引擎忽略该链接，主要用于用户提交的内容，防止有人企图通过添加链接，提高该链接的搜索排名。
  + `noreferrer`：告诉浏览器打开链接时，不要将当前网址作为 HTTP 头信息的 `Referer` 字段发送出去，这样可以隐藏点击的来源。
  + `noopener`：告诉浏览器打开链接时，不让当前窗口使用 `window.opener` 引用原始窗口，这样就提高了安全性。
+ `referrerpolicy` ：设定点击链接时，浏览器发送 HTTP 头信息的 `Referer` 字段的行为。
+ `ping` ：指定一个网址；用户点击的时候，会 **向该网址发出一个 POST 请求**，通常用于跟踪用户的行为。
  + 可以指定一个专门追踪用户行为的网址，这样就可以知道用户点击了哪些网址。（广告网站之类的）
  + 发出的 POST 请求，其 HTTP 表头有一些特殊的键值对。例如下面代码，多出了 `ping-from` ——行为发生的页面；`ping-to` —— `href` 的网址；`content-type` ——表明发送请求的类型。
  + **注意：火狐浏览器默认不支持，需要手动打开。**

```
headers: {
  'ping-from': 'http://localhost:3000/',
  'ping-to': 'http://localhost:3000/other'
  'content-type': 'text/ping'
  // ...other headers
},
```

+ `download` ：表明 **当前链接用于下载**，而不是跳转到另一个 URL。
  + 注意，`download` 只在链接与网址同源时，防止网址被黑客入侵修改 `download` 的值。
  + `download` 可以设置值来确定下载的文件名。如果服务器的 HTTP 的响应头信息设置了 `Content-Disposition` 字段，那么该字段优先，下载时将显示其设置的文件名。

#### （2）联系链接

联系链接一般是国外用的比较多，例如邮箱链接和电话链接。

+ `mailto` 协议：用户点击后，**浏览器会打开默认的邮件程序**。该值将用以下格式来解析。

  + `mailto:[发送到的邮箱地址]?cc=[抄送的邮箱地址]&subject=[主题]&body=[邮件内容]`

+ 不指定邮箱也是允许的，就像下面代码这样。这时需要用户手动输入目标邮箱。

  ```
  <a href="mailto:">告诉朋友</a>
  ```

+ `tel` 协议：**创建电话链接**。用户点击该链接，会唤起电话，可以进行拨号。

  ```
  <a href="tel:13312345678">13312345678</a>
  ```

#### （3）加载资源链接

加载 CSS 资源时使用的是 `<link>` 。如果想预加载资源，需要用属性 `rel` ，其值有几个类型。

+ `preload` ：告诉浏览器 **尽快下载并缓存资源**。可知指定不同的资源，例如 Javascript、视频等。但需要其他属性配合：

  + `as` ：**指定预处理资源的类型**。例如预加载 Javascript 脚本 `<link rel="preload" href="main.js" as="script">` 。
  + `type` ：**进一步明确 MIME 类型**。例如预加载 MP4 编码的视频 `<link rel="preload" href="a.mp4" as="video" type="video/mp4">`
  + 注意，所有预下载的资源，只是下载到浏览器的缓存，并没有执行。如果希望资源预下载后立刻执行，可以使用 `onload` 事件。

  ```html
  <link rel="preload" as="style" href="async_style.css" onload="this.rel='stylesheet'">
  ```

+ `prefetch` ：**建议** 浏览器预加载该资源。当连接速度很慢时，浏览器可以不下载该资源。

+ `preconnect`  ：要求浏览器提前与某个域名建立 **TCP 连接**。例如知道用户马上要登录。
+ `dns-prefetch` ：要求浏览器提前 **执行某个域名的 DNS 解析**。
+ `prerender` ：要求浏览器 **提前渲染页面**。用户点击链接时，就会立即呈现该页面。如果确定用户下一步会访问该页面，则非常有用，例如提前加载登录页面。

---

如果 **指定加载资源的条件**，使用 `media` 属性。

例如下面代码，打印时加载  `print.css` ；移动设备访问时（设备宽度小于600像素）加载 `mobile.css` 

```html
<link href="print.css" rel="stylesheet" media="print">
<link href="mobile.css" rel="stylesheet" media="screen and (max-width: 600px)">
```

#### （4）加载脚本链接

`<script>` 的 `type` 属性也可以设成 `module`，表示这是一个 ES6 模块，不是传统脚本。

对于不支持 ES6 模块的浏览器，可以设 `nomodule` 属性。这个属性通常与 `type="module"` 配合使用，**作为老式浏览器的回退方案**。例如下面代码：

```html
<script type="module" src="main.js"></script>
<script nomodule src="fallback.js"></script>
```

`<noscript>` 用于浏览器 **不支持或关闭 JavaScript 时**，所要显示的内容。

#### （5）`<object>`

`<object>` ：插入外部资源，主要由浏览器插件处理。最常用的是显示 PDF 文件。（显示 PDF 文件也可以使用 `iframe` ）

内部还可以使用 `<param>` 标签，给出插件所需要的运行参数。（虽然不知道有什么用。。。）

```html
<object data="movie.swf" type="application/x-shockwave-flash">
  <param name="foo" value="bar">
</object>
```

### 2.4 表格标签

表格标签 `<table>` 里可以有不同的子标签进行组合：

+ 一个可选的 `<caption>`  元素：指定表格的名字，类似于表题。
+ 零个或多个的 `<colgroup>` 元素：指定列的格式，可以改变一列的样式。
  + 其里面有多个 `<col>` ，其 `span` 属性指定该列的宽度。
+ 一个可选的 `<thead>` 元素：指定表的表头。至于为什么是可选的，是因为表的主体里也可以充当表头。
+ 零个或多个 `<tbody>` 或者 零个或多个 `<tr>` 
  + 直接使用 `<tr>` 时，浏览器会自动加上 `<tbody>` ，所以当需要查找 `<tr>` 元素，则正确查找：`$('table>tbody>tr')` ；错误查找：`$('table>tr')`
  + 为了规范，建议在 `<tr>` 外面加上 `<tbody>` 。
  + `<tr>` 里面可以使用两个子标签：
    + `<th>` ：表示该单元格是标题，会加粗显示。
    + `<td>` ：表示该单元格是数据。
    + `colspan` 属性：跨越的列数，即列的宽度。
    + `rowspan` 属性：跨越的行数，即行的宽度。
    + `headers` 属性：语义属性，表明哪个单元格对应哪个表头。
    + `scope` 属性：`<th>` 专用，表明当前是行标题还是列标题
+ 一个可选的 `<tfoot>` 元素：语义标签，定义了一组表格中各列的汇总行，也称为表尾。

