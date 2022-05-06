## 一、表单

### 1.1 `<form>` 

`<form>` 标签有以下属性：

+ `accept-charset`：服务器接受的字符编码列表，使用空格分隔，默认与网页编码相同。
+ `action`：服务器接收数据的 URL。
+ `autocomplete`：如果用户没有填写某个控件，浏览器是否自动填写该值。取值分别为
  + `off` ：浏览器 **可能** 不会自动补全条目。在疑似登录表单中，浏览器倾向于忽略该属性，**因为要使用浏览器自带的密码补全**。
  + `on` ：自动填写。
+ `name`：表单的名称，应该在网页中是唯一的。
+ `method`：提交数据的 HTTP 方法。
+ `novalidate`：布尔属性，**表单提交时是否取消验证**，例如邮箱格式验证。
+ `target`：在哪个窗口展示服务器返回的数据，取值有 
  + `_self` ：当前窗口
  + `_blank` ：新建窗口
  + `_parent`：父窗口
  + `_top` ：顶层窗口
  + `<iframe>` 标签的 `name` 属性，即表单返回结果展示在 `<iframe>` 窗口。
+ `enctype`：当 `method` 属性等于`post`时，指定提交给服务器的 MIME 类型。取值为
  + `application/x-www-form-urlencoded` ：默认值
  + `multipart/form-data`：文件上传的情况
  + `text/plain` ：文本字符串。

### 1.2 `enctype` 属性

本节介绍 `enctype` 属性。其取值为：

（1）`application/x-www-form-urlencoded`

`application/x-www-form-urlencoded` 是默认类型。控件名和控件值都要转义：

+ 空格转为 `+` 号
+ 非数字和非字母转为 `%HH` 的形式
+ 换行转为CR LF
+ 控件名和控件值之间用 `=` 分隔。
+ 控件按照出现顺序排列，控件之间用 `&` 分隔。

（2）`multipart/form-data`

`multipart/form-data` 主要用于文件上传。

这个类型上传大文件时，会将文件分成多块传送，每一块的 HTTP 头信息都有 `Content-Disposition` 属性，值为 `form-data`，以及一个 `name` 属性，值为控件名。

### 1.3 `<fieldset>` 和 `<legend>`

+ `<fieldset>` ：表示控件的集合，用于将一组相关控件组合成一组，其样式是在外面显示一个边框。（有点丑就是了）

+ `<legend>` ：设置 `<fieldset>` 控件组的标题，通常是`<fieldset>`内部的第一个元素。其样式是嵌入在控件组的上边框里面。（个人觉得比较有创意的一个设计）

### 1.4 `<label>`

+ `<label>` 提供控件的文字说明，帮助用户理解控件的目的。
+ 其最大的作用是和 可点击控件绑定在一起，点击 `<label>` 就等于点击了绑定的控件。在小屏屏幕非常适用。
+ 指定属性就可以实现绑定：
  + `for`：绑定控件的 `id` 。
  + `form`：关联表单的id属性。设置了该属性后，`<label>` 可以放置在页面的任何位置，否则只能放在 `<form>` 内部。（应该很少使用）
  + 将控件写在 `<label>` 里，这时就不需要 `for` 和 `form` 属性了。很少使用，因为不好自定义化。例如下面代码。

```html
<label>用户名：
  <input type="text" name="user">
</label>
```

### 1.5 `<input>`

`<input>` 用来接收用户的输入。

有多种类型，取决于 `type` 属性的值，默认值是 `text`，表示一个输入框。下面简单说下 `type` 属性的取值。

#### （1）text

其有个属性——`pattern` ，指定输入需要匹配的正则表达式。

比如要求用户输入 4～8 个英文字符，可以写成 `pattern="[a-z]{4,8}"`。如果用户输入不符合要求，浏览器会弹出提示，不会提交表单。（提示是网页自带的，虽然不太好看，但在一些小项目中十分有用）

#### （2）search

`search` 表明该文本输入框用于搜索，基本等同于 `type="text"`。不同的地方是在输入的时候，输入框的尾部会显示 " X "，点击就会清空该输入框。

#### （3）button

`type="button"` 是没有默认行为的按钮，通常脚本指定 `click` 事件的监听函数来使用。

如果在表单点击 `<button>` 标签，会自动提交，如果不想提交，则需要改为 `<input>` 或者在 Javascript 里取消默认行为。

#### （4）**submit**

`type="submit"` 是表单的提交按钮。用户点击这个按钮，就会把表单提交给服务器。和 `<button>` 标签功能一致。

#### （5）**image**

`type="image"` 将一个图像文件作为提交按钮，行为和用法与 `type="submit"` 完全一致。

这样就不用为 `<a>` 标签下再套一个 `<img>` 了

```html
<input type="image" alt="登陆" src="login-button.png">

<a href="#"><img src="./小司惊讶1.png" ></a>
```

::: tip

其最重要的一个功能是，在点击图像按钮提交时，会自动额外提交两个参数 `x` 和 `y` 到服务器，这个功能通常用来地图类型的操作，让服务器知道用户点击了地图的哪个部分。

:::

#### （6）reset

+ `type="reset"` 是一个重置按钮，用户点击以后，所有表格控件重置为初始值。

```html
<input type="reset" value="重置">
```

但和 Vue 的双向绑定不太兼容，重置的只是文本框的内容，但 Vue 里的数据依然存在。

#### （7）email

`type="email"` 是一个只能输入电子邮箱的文本输入框。

表单提交之前，浏览器会自动验证是否符合电子邮箱的格式，如果不符合就会显示提示，无法提交到服务器。

该类型还可以搭配 `<datalist>` 标签，提供输入的备选项。例如下面代码。

```html
<input type="email" size="40" list="defaultEmails">

<datalist id="defaultEmails">
  <option value="jbond007@mi6.defence.gov.uk">
  <option value="jbourne@unknown.net">
  <option value="nfury@shield.org">
  <option value="tony@starkindustries.com">
  <option value="hulk@grrrrrrrr.arg">
</datalist>
```

#### （8）file

`type="file"` 是一个文件选择框，允许用户选择一个或多个文件，常用于文件上传功能。其可以有以下属性：

- `accept`：允许选择的文件类型，使用逗号分隔
  - 其值可以使用 MIME 类型（比如`image/jpeg`）
  - 也可以使用后缀名（比如`.doc`）
  - 还可以使用 `audio/*`（任何音频文件）、`video/*`（任何视频文件）、`image/*`（任何图像文件）。
- `capture`：用于捕获图像或视频数据的源，常用于手机端页面。取值有：
  -  `user`：前置摄像头和/或麦克风
  - `environment` ：后置摄像头和/或麦克风

下面为 MDN 的一段代码，原生 Javascript 实现上传文件的预览。

::: info 全部代码

```html {97,121}
<!DOCTYPE html>
<html>

<head>
  <title>Complete file example</title>
  <style>
    html {
      font-family: sans-serif;
    }

    form {
      width: 600px;
      background: #ccc;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid black;
    }

    form ol {
      padding-left: 0;
    }

    form li,
    div>p {
      background: #eee;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      list-style-type: none;
      border: 1px solid black;
    }

    form img {
      height: 64px;
      order: 1;
    }

    form p {
      line-height: 32px;
      padding-left: 10px;
    }

    form label,
    form button {
      background-color: #7f9ccb;
      padding: 5px 10px;
      border-radius: 5px;
      border: 1px ridge black;
      font-size: 0.8rem;
      height: auto;
    }

    form label:hover,
    form button:hover {
      background-color: #2d5ba3;
      color: white;
    }

    form label:active,
    form button:active {
      background-color: #0d3f8f;
      color: white;
    }
  </style>
</head>

<body>
  <form>
    <div>
      <label for="image_uploads">Choose images to upload (PNG, JPG)</label>
      <input type="file" id="image_uploads" name="image_uploads" accept=".jpg, .jpeg, .png" multiple />
    </div>
    <div class="preview">
      <p>No files currently selected for upload</p>
    </div>
    <div>
      <button>Submit</button>
    </div>
  </form>
  <script>
    const input = document.querySelector('input')
    const preview = document.querySelector('.preview')

    // 将 input 设置为看不见
    input.style.opacity = 0

    // 绑定监听，在选择文件完成后触发
    input.addEventListener('change', updateImageDisplay)

    function updateImageDisplay() {
      // 移除之前存在的元素
      while (preview.firstChild) {
        preview.removeChild(preview.firstChild)
      }

      // 获取上传文件的详情信息
      const curFiles = input.files

      // 处理没有选择文件的情况
      if (curFiles.length === 0) {
        const para = document.createElement('p')
        para.textContent = 'No files currently selected for upload'
        preview.appendChild(para)
      } else {
        // 创建列表
        const list = document.createElement('ol')
        preview.appendChild(list)

        // 遍历所有文件信息
        for (const file of curFiles) {
          const listItem = document.createElement('li')
          const para = document.createElement('p')

          // 判断是否符合规定的格式
          if (validFileType(file)) {
            para.textContent = `File name ${file.name
              }, file size ${returnFileSize(file.size)}.`
            const image = document.createElement('img')

            // 将file对象提取成URL
            image.src = URL.createObjectURL(file)

            listItem.appendChild(image)
            listItem.appendChild(para)
          } else {
            para.textContent = `File name ${file.name}: Not a valid file type. Update your selection.`
            listItem.appendChild(para)
          }

          list.appendChild(listItem)
        }
      }
    }

    // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
    const fileTypes = [
      'image/apng',
      'image/bmp',
      'image/gif',
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/svg+xml',
      'image/tiff',
      'image/webp',
      `image/x-icon`,
    ]

    function validFileType(file) {
      return fileTypes.includes(file.type)
    }

    function returnFileSize(number) {
      if (number < 1024) {
        return number + 'bytes'
      } else if (number > 1024 && number < 1048576) {
        return (number / 1024).toFixed(1) + 'KB'
      } else if (number > 1048576) {
        return (number / 1048576).toFixed(1) + 'MB'
      }
    }
  </script>
</body>

</html>
```

:::

上面代码有两处重点：

+ 第 97 行：当上传文件后，可以使用 `元素.files` 获取上传文件的信息。
+ 第 121 行：使用了 `URL.createObjectURL(file)` ，可以使用 `file` 对象生成 URL，可以使用这个 URL 访问到文件，例如放到 `<iframe>` 和 `<img>` 的  `src` 属性里。

#### （9）**range**

`type="range"` 是一个滑块，用户拖动滑块，选择给定范围之中的一个数值。常见的例子是调节音量。

例如下面的代码：会产生一个最小值为 `0`、最大值为 `11` 的滑块区域。

```html
<input type="range" id="start" name="volume"
         min="0" max="11">
```

滑块的值就是 `<input>` 的 `value` 属性，可以通过设置 `value` 属性来设置默认位置。

该类型与 `<datalist>` 标签配合使用，可以在滑动区域产生刻度。（`datalist` 的多种用法）

```html
<input type="range" list="tickmarks">

<datalist id="tickmarks">
  <option value="0">
  <option value="10">
  <option value="20">
  <option value="30">
  <option value="40">
  <option value="50">
  <option value="60">
  <option value="70">
  <option value="80">
  <option value="90">
  <option value="100">
</datalist>
```

#### （10）tel

`type="tel"` 表示该输入框是输入电话号码的。

由于全世界的电话号码格式都不相同，因此浏览器没有默认的验证模式，大多数时候需要自定义验证。

#### （11）color

`type="color"` 是一个选择颜色的控件，其值的格式是 `#rrggbb` 。

十分有用的一个控件，用户可以使用吸色笔来获取颜色。

#### （12）date

`type="date"` 是一个用来输入日期的输入框，点击输入框后会弹出日历，可以使用其来选择日期，也可以手动输入，其值的格式为 `YYYY-MM-DD`。

其还有两个配套属性：

- `max`：可以允许的最晚日期。
- `min`：可以允许的最早日期。

+ `step`：步长值，一个数字，以天为单位。换句话说，可选的日期是该值的倍数。

但在获取需要判断是否是空串，因为如果手动输入不正确的日期格式，例如 2022 年 2 月 30 日，文本框的值就为空串。

#### （13）time

`type="time"` 是一个用来输入时间的输入框，可以输入时分秒，其中值的是 `hh:mm:ss`。

时间选择器的形式则随浏览器不同而不同，谷歌浏览器是不能选择秒数。

#### （14）month

`type="month"` 是一个只能输入年份和月份的输入框，其值的格式为 `YYYY-MM`。比 `date` 少了日份。

#### （15）week

`type="week"` 是一个输入一年中第几周的输入框。格式为 `YYYY-Www`，比如 `2018-W18` 表示2018年第18周。

（不太常用的一个控件，不知道什么场合用到过。）

#### （16）datetime-local

`type="datetime-local"` 是一个时间输入框，可以同时输入年月日和时分，格式为 `yyyy-MM-ddThh:mm` 。例如 `2018-06-07T00:00` ，T 作为分隔符。

### 1.6 `<select>` 

`<select>` 标签里可以有 `<optgroup>` ，用来对 `<option>`  进行分组，。

`<optgroup>` 指定该分组的标题，标题会加粗显示，但是用户无法选中。

例如下面代码：其可以添加两个属性，`label` ——标题的名字， `disabled` ——是否禁用该组的选项

```html
<label>宠物：
  <select name="pets" multiple size="4">
    <optgroup label="四条腿的宠物">
      <option value="dog">狗</option>
      <option value="cat">猫</option>
    </optgroup>
    <optgroup label="鸟类">
      <option value="parrot">鹦鹉</option>
      <option value="thrush">画眉</option>
    </optgroup>
  </select>
</label>
```

### 1.7 `<datalist>`

`<datalist>` 用于为控件提供提示信息，它的内部使用`<option>`，生成每个菜单项。

例如下面代码：

```html
<label for="ice-cream-choice">冰淇淋：</label>
<input type="text" list="ice-cream-flavors" id="ice-cream-choice" name="ice-cream-choice">

<datalist id="ice-cream-flavors">
  <option value="巧克力">
  <option value="椰子">
  <option value="薄荷">
  <option value="草莓">
  <option value="香草">
</datalist>
```

`<option>` 标签还可以加入 `label` 属性，作为说明文字。Chrome 浏览器会将其显示在提示信息的下一行。

提示功能在搜索框比较实用，但由于提示信息过于简洁，一般不使用，只有一些简单的项目使用到。

### 1.8 `<progress>` 和 `<meter>`

`<progress>` 浏览器通常会将显示为进度条，其有两个属性：

- `max`：进度条的最大值，应该是一个大于 0 的浮点数。默认值为1。
- `value`：进度条的当前值。它必须是 0 和 `max` 属性之间的一个有效浮点数。
  - 如果省略了 `max` 属性，该值则必须在 `0` 和 `1` 之间。
  - 如果省略了 `value` 属性，则进度条会出现滚动，表明正在进行中，无法知道完成的进度。

`<meter>`  也是进度条，但这个会自动显示颜色。Chrome 浏览器会三种颜色，分别为绿色、黄色和红色。其有多个属性：

- `min`：范围的下限，必须小于 `max` 属性。如果省略，则默认为 0。
- `max`：范围的上限，必须大于 `min` 属性。如果省略，则默认为 1。
- `value`：当前值，必须在 `min` 属性和 `max` 属性之间。如果省略，则默认为 0。
- `low`：表示 “ 低端 ” 的上限门槛值，即超过这个值代表中端和高端。如果省略，则等于`min`属性。
- `high`：表示 “ 高端 ” 的下限门槛值，即低于这个值代表低端和终端。如果省略，则等于`max`属性。
- `optimum`：指定最佳值，必须在 `min` 属性和 `max` 属性之间。它应该与 `low` 属性和 `high` 属性一起使用，表示最佳范围，即最佳值在哪个范围，这个范围就会显示绿色。如果省略，则等于 `min` 和 `max` 的中间值。
  （因为最佳值各有不同，如果代表仓库存量，则高端为绿色，如果代表水库水位，则低端为绿色）
- `form`：关联表单的`id`属性。

### 1.9 `<dialog>`

`<dialog>` 标签表示一个可以关闭的对话框。其默认关闭，需要打开则添加 `open` 属性

```html
<dialog open>
  Hello world
</dialog>
```

`<dialog>` 可以使用 Javascript 的 `Dialog.showModal()` 和 `Dialog.close()` 两个方法，用于打开/关闭对话框。

```js
const modal = document.querySelector('dialog');

// 对话框显示，相当于增加 open 属性
modal.showModal();

// 对话框关闭，相当于移除 open 属性
modal.close();
```

`Dialog.showModal()` 方法唤起对话框时，会有一个透明层，阻止用户与对话框外部的内容互动。

CSS 提供了一个 Dialog 元素的 `::backdrop` 伪类，用于选中这个透明层，因此可以编写样式让透明层变得可见。例如下面代码：

```css
dialog::backdrop {
  background-color: black;
  opacity: 0.5;
}
```

其有两个事件可以监听：

- `close`：对话框关闭时触发。
- `cancel`：用户按下 `esc` 键关闭对话框时触发。

（Bootstrap 里的模态框是将透明层和内容层分开的，这样容易实现：用户点击透明层，就关闭对话框，如果在原生的标签实现，需要获取点击的坐标进行比较）

### 1.10 `<details>` 和 `<summary>`

`<details>` 标签用来折叠内容，浏览器会折叠显示该标签的内容。

上面的代码在浏览器里面，会折叠起来，显示`Details`，前面有一个三角形，就像下面这样。在 Vuepress 里也使用到过这种样式。

```html
▶ Details
```

点击这段文本，折叠的文本就会展开，显示详细内容。

```
▼ Details
这是一段解释文本。
```

`<details>` 标签的 `open` 属性，用于默认打开折叠。`<summary>` 标签用来定制折叠内容的标题。例如下面代码：

```html
<details open>
  <summary>这是标题</summary>
  这是一段解释文本。
</details>
```

展示效果如下：

```
▼ 这是标题
这是一段解释文本。
```

`Details` 元素可以添加 `toggle ` 事件，打开或关闭折叠时，都会触发这个事件。

```js
details.addEventListener('toggle', event => {
  if (details.open) {
    /* 展开状况 */
  } else {
    /* 折叠状态 */
  }
});
```
