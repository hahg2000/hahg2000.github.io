# jQuery-下

## 一、自定义jQuery插件

自定义jQuery插件就是往 jQuery 核心函数和 jQuery 对象添加自己的方法。

### 1.1 扩展核心函数

扩展核心函数使用的是 `$.extend()` 方法。

+ `jQuery.extend( [deep ], target, object1 [, objectN ] )`：将多个对象合并到一个对象里（工具方法）
  + `deep`：布尔值。默认为 false，不深度复制，后面的会覆盖前面的数据。如果为 true，则为深度复制，target 的真实值将会改变，并且 target 对象里的数据不会被后面对象覆盖。
  + `target`：对象。要扩展的对象，它将接收新属性。
  + `object1[, objectN ]` ：多个对象。包含需要要合并的对象。
  + 返回 target 对象，给 deep 参数为 false 的情况使用。
+ `jQuery.extend( object )`：为 jQuery 核心扩展方法。
  + `object` ：对象。对象名为方法名，对象值为方法体。

下面代码来扩展一个方法，传入两个数，返回两个数中最小的那个。

```js
let array = $.extend(
    {
        min: function (a, b) {
            return a < b ? a : b
        }
    }
);

console.log($.min(3, 2))  // 2
console.log($.min(3, 4))  // 3
```

### 1.2 扩展jQuery对象

我们也可以使用 `jQuery.fn.extend( object )` 来扩展 jQuery 对象

+ `jQuery.fn.extend( object )`：为 jQuery 核心扩展方法。
  + `object` ：对象。对象名为方法名，对象值为方法体。

我们在使用 jQuery 核心函数来获取文档节点时，经常想知道我们是否成功获取到文档节点，所以我们可以为每个 jQuery 对象扩展一个输出里面 DOM 节点的方法。

+ 第 12 行： `log()` 方法里的 `this` 指的是调用该方法的 jQuery 对象。
+ 第 13 行：`each()` 方法里的 `this` 指的是 jQuery 对象里的文档节点。 

```html
<body>
  <div>div1</div>
  <div>div2</div>
  <div>div3</div>
</body>

</html>
<script src='https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.6.0.js'></script>
<script>
  $.fn.extend({
    log : function (){
      this.each(function(){ 
        console.log(this)
      })
    }
  })

  $('div').log() 
  // <div>div1</div>
  // <div>div2</div>
  // <div>div3</div>
</script>
```

### 1.3 总结

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/jQuery%E6%89%8B%E5%86%8C%E7%9B%AE%E5%BD%95-%E6%A0%87%E8%AE%B05.png" style="zoom:80%;" />

## 二、京东商城示例

下面对已经做好的页面添加 JS 代码，实现所需的功能。

### 2.1 搜索栏实现

实现搜索栏需要知道搜索栏下面提示框的显示规则：

+ 显示时机：获取到焦点并且文本框的内容不为空。
+ 隐藏时机：失去焦点或者获取焦点时文本框内容为空。

```js
// 3. 搜索框
function search() {
    // 显示规则
    // 1.获取焦点并且输入的值不为空
    // 隐藏规则
    // 1.失去焦点
    // 2.输入的文本为空
    let $txtSearch = $('#txtSearch')

    // 同时绑定获取焦点和按键弹起事件
    $txtSearch.on('focus keyup', function () {
        // 获取到文本内容
        let value = $txtSearch.val().trim()

        // 如果为空则隐藏否则显示
        if (value === '') {
            $('#search_helper').hide()
        } else {
            $('#search_helper').show()
        }
    })

    // 失去焦点就隐藏
    $txtSearch.blur(function () {
        $('#search_helper').hide()
    })
}
```

### 2.2 实现移动小图片

下面几节都会完成下面所示的功能：

+ 小图片的移动；
+ 中图片的切换；
+ 大图片的改变；

图片示例如下：

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E4%BA%AC%E4%B8%9C%E5%95%86%E5%93%81%E5%9B%BE%E7%89%87%E7%A4%BA%E4%BE%8B.gif" style="zoom:50%;" />

小图片的移动与轮播图很类似，移动 left 值，并且不能图片不能移出。

思路是设置一个存储当前可向右移动数量的变量——`now_move_accout`。判断是否可以向右或者向左，就判断这个变量的值即可。

+ 向右时判断该变量是否大于零
+ 再设置一个常量——`MOVE_ACCOUNT`，该常量存放原始可向右移动数量的变量，判断是否可以向左移动，需要使用将 `MOVE_ACCOUNT` 与该变量 `now_move_accout` 比较，如果后者小于前者则代表向左可以移动。
+ 总的来说，now_move_accout 的范围为 [ 0 ,  MOVE_ACCOUNT ]。

```js
function move_mini_image() {
    // 获取到图片的总数量
    const IMG_ACCOUNT = $('#icon_list').children().length

    // 获取到显示的图片数量
    const SHOW_IMG_ACCOUNT = 5

    // 向右可移动的数量
    const MOVE_ACCOUNT = IMG_ACCOUNT - SHOW_IMG_ACCOUNT

    // 一张图片的宽度
    const ONE_IMG_WIDTH = $('#icon_list').children().width()

    // 现在可以移动的图片的数量
    let now_move_accout = MOVE_ACCOUNT

    // 获取后退按钮
    let $backword = $('#preview>h1>a:first')

    // 获取前进按钮
    let $forwardword = $('#preview>h1>a:last')

    // 初始化两个按钮
    // 前进不可用(默认)
    // 后退看条件可用
    if (now_move_accout > 0) {
        $forwardword.attr('class', 'forward')
    }

    // 当点击前进按钮时判断现在可移动数量是否大于零
    $forwardword.click(function () {
        if (now_move_accout > 0) {
            $('#icon_list').css('left', '-=' + ONE_IMG_WIDTH)

            // 向右移动了一个，向左一定可用
            $backword.attr('class', 'backward')
            now_move_accout--
        }

        if (now_move_accout <= 0) {
            $forwardword.attr('class', 'forward_disabled')
        }
    })

    // 当点击后退按钮时判断现在可移动数量是否小于向右可移动的数量
    $backword.click(function () {
        if (now_move_accout < MOVE_ACCOUNT) {
            $('#icon_list').css('left', '+=' + ONE_IMG_WIDTH)
            // 向右移动了一个，向左一定可用
            $backword.attr('class', 'backward')
            now_move_accout++
        }
        if (now_move_accout >= MOVE_ACCOUNT) {
            $backword.attr('class', 'backward_disabled')
        }
    })
}
```

### 2.3 实现切换中图片

切换中图片的时机是鼠标移动到小图片。所以给每一个小图片添加鼠标移动事件。

+ 这里找到中图片的链接规律：在小图片的图片名称后缀加上 “ -m ”

+ 鼠标移入时移出上一张浏览图片的边框样式，加上这一张的边框样式，使用户得知现在浏览的是那张图片。
+ 鼠标移出时，不需要改变边框样式，因为为了实现长时间停留的效果。

```js
// 当鼠标移到小图片时，中图片实时更新
function change_medium_image() {

    let $icon_list = $('#icon_list')

    // 获取到所以小图片
    let $icon_list_items = $icon_list.children()

    // 现在所浏览的图片的索引
    let now_img_index = 0

    // 添加鼠标移入事件
    $icon_list_items.mouseenter(
        function () {
            // 将之前浏览的图片的样式去除
            $icon_list
                .children(':eq(' + now_img_index + ')')
                .children()
                .removeClass('hoveredThumb')

            // 更新图片索引
            now_img_index = $(this).index()

            // 移动到的小图片添加边框样式
            $(this).children().addClass('hoveredThumb')

            let img_src = $(this).children().attr('src').replace('.jpg', '-m.jpg')

            // 改变图片的链接
            $('#mediumImg').attr('src', img_src)
        }
    )
}
```

### 2.4 实现放大图片

放大图片并不是真的将图片放大，而是将大图片显示出来，因为将中图片放大，图片可能会有模糊感，除非中图片分辨率较大。

所以移入中图片时：

+ 显示遮盖的方框。
+ 方框会随着鼠标移动，且不能超出边框。
+ 显示大图片的元素块显示。
+ 大图片会根据方框的位置移动图片。

移出中图片时：

+ 将遮盖的方框和大图片的元素块隐藏。

---

主要代码如下：

+ 第 25 行：页面默认显示正在加载的图片，用于表示当前图片正在加载。而放大图片功能则需要大图片加载完成，所以可以 **为大图片绑定加载事件**。
+ 第 35 ~ 55 行：设置方框的位置，而且不让其超出边框。
+ 第 57 ~ 62 行：根据下面的公式，按比例出大图片所移动的 left 值。

$$
\begin{array}{ll}
\frac{方框的left值}{中图片的宽度} = -\frac{大图片的left值}{大图片的宽度}\\
(添加多个负号是因为方框与大图片的移动方向相反) \\
\therefore 大图片的left值 = - 方框的left值 \div 中图片的宽度 \times 大图片的宽度
\end{array}
$$

```js
// 显示覆盖方块
  function enlarge_image() {
    let $mask = $('#mask')
    let mask_width = $mask.width()
    let mask_height = $mask.height()
    let $maskTop = $('#maskTop')
    let $largeImg = $('#largeImg')
    let $largeImgContainer = $('#largeImgContainer')

    $maskTop.hover(
      function () {
        // 方框显示
        $mask.show()

        // 计算出大图片的链接
        let large_img_src = $('#mediumImg').attr('src').replace('-m', '-l')

        // 大图片的元素块显示
        $largeImgContainer.show()

        // 加载大图
        $largeImg.attr('src', large_img_src)

        // 绑定大图片加载事件
        $largeImg.on('load', function () {
          // 隐藏加载图标
          $('#loading').hide()

          // 显示大图
          $largeImg.show()

          // 为中图片的整个范围绑定鼠标移动事件
          $maskTop.mousemove(function (event) {

            // left 和 top 为方框的位置
            let left = event.offsetX - mask_width / 2
            let top = event.offsetY - mask_height / 2

            // 分别判断方框是否超出边框，如果超出则纠正
            if (left < 0) {
              left = 0
            } else if (left > $maskTop.width() - mask_width) {
              left = $maskTop.width() - mask_height
            }
            if (top < 0) {
              top = 0
            } else if (top > $maskTop.height() - mask_height) {
              top = $maskTop.height() - mask_height
            }

            // 设置方框的位置
            $mask.css({
              left: left,
              top: top,
            })

            // 根据比例计算出大图片所移动的位置
            let largt_img_left = -(left / $maskTop.width()) * $largeImg.width()

            let largt_img_top = -(top / $maskTop.height()) * $largeImg.height()

            $largeImg.css({ left: largt_img_left, top: largt_img_top })
          })
        })
      },
      function () {
        // 隐藏方框和大图片的元素块
        $mask.hide()
        $largeImgContainer.hide()
      }
    )
  }
```

----

## 完

