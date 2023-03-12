# Vue-中之项目开发

## 一、评论项目

我们将做一个评论项目来详解组件通信。

写项目大致分为三个步骤：

+ 划分组件
+ 做出静态组件
+ 做出动态组件
  + 初始化显示数据
  + 交互动作

效果图大致为如下：

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/%E8%AF%84%E8%AE%BA%E5%B1%95%E7%A4%BA.png" style="zoom:40%;" />

### 1.1 划分组件

划分组件首先对一整个现有页面（不过一般情况为草图）进行划分。

一共在 App.vue 划分了三个模块，而 ShowCommet.vue 模块中在继续划分了多个模块。目录结构如下：

```
├─App.vue 【主模块】
│  ├─HeaderComment.vue 【头部模块】
│  ├─AddComment.vue 【添加评论模块】
│  ├─ShowComment.vue 【展示评论模块】
│  |  ├─CommentItem.vue 【评论单项模块】
│  |  ├─CommentItem.vue 【评论单项模块】
└─ └─ └─ 。。。。。。。。。【评论单项模块】
```

最终展示效果如下：

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/%E7%BB%84%E4%BB%B6%E5%88%92%E5%88%86.png" style="zoom:40%;" />

首先我已经写出了全部组件在一起的单页面。

::: details

```html
<div class="container">
  <!-- 头部提示信息 -->
  <div class="row">
    <div class="col">
      <div class="bg-primary bg-gradient text-white h1 p-3">
        请发表对Vue的留言
      </div>
    </div>
  </div>

  <!-- 评论功能区域 -->
  <div class="row">

    <!-- 添加评论区域 -->
    <div class="col">
      <div class="mb-3">
        <label for="nameInput" class="form-label">请输入你的名字</label>
        <input type="text" class="form-control" id="nameInput" placeholder="你的姓名">
      </div>
      <div class="mb-3">
        <label for="messageInput" class="form-label">请输入你的需要的留言</label>
        <textarea class="form-control" id="messageInput" rows="3"></textarea>
      </div>
    </div>

    <!-- 展示评论区域 -->
    <div class="col">
      <div class='row'>
        <div class='col-3'>评论展示</div>
      </div>
      <div class='border p-2'>
        <div class='row'>
          <div class='col fs-5'>
            xxx说：
          </div>
          <div class='col-2 p-0'>
            <button class='btn btn-primary btn-small'>删除</button>
          </div>
        </div>
        <div class='row' style='margin-left: 30px;'>
          不错
        </div>
      </div>
    </div>
  </div>
</div>
```

::: 

然后就将不同区域的放到不同的模块里。需要注意的是 template 标签里 **一定需要一个包含全部内容的 div 标签**。

::: details

```html
<!-- App.vue -->
<!-- 总模块 -->
<div id="app" class="container">
  <!-- 头部提示信息 -->
  <HeaderComment/>

  <!-- 评论功能区域 -->
  <div class="container row">
    <AddComment/>
    
    <!-- 展示评论区域 -->
    <ShowComment/>
  </div>
</div>

<!-- HeaderComment.vue -->
<template>
  <div class="row">
    <div class="col">
      <div class="bg-primary bg-gradient text-white h1 p-3">
        请发表对Vue的留言
      </div>
    </div>
  </div>
</template>

<!-- AddComment.vue -->
<template>
  <div class="col">
    <div class="mb-3">
      <label for="nameInput" class="form-label">请输入你的名字</label>
      <input type="text" class="form-control" id="nameInput" placeholder="你的姓名" />
    </div>
    <div class="mb-3">
      <label for="messageInput" class="form-label">请输入你的需要的留言</label>
      <textarea class="form-control" id="messageInput" rows="3"></textarea>
    </div>
    <button class="btn btn-primary">添加</button>
  </div>
</template>

<!-- ShowComment.vue -->
<template>
  <div class="col">
    <div class="row">
      <div class="col-3">评论展示</div>
    </div>
    <CommentItem />
  </div>
</template>

<!-- CommentItem.vue -->
<template>
  <div class="border p-2">
    <div class="row">
      <div class="col fs-5">xxx说：</div>
      <div class="col-2 p-0">
        <button class="btn btn-danger">删除</button>
      </div>
    </div>
    <div class="row" style="margin-left: 30px;">不错</div>
  </div>
</template>
```

:::

### 1.2 静态页面

然后我们就要将数据展示在初始页面上，即静态页面的生成。需要展示数据的是展示评论模块。

将评论数据放到哪个模块中会涉及到 **模块间通信问题**：这是 Vue 开发中需要考虑清楚的一个问题

+ 如果放到展示评论模块，则添加评论时需要将数据传到展示评论模块，这就会 **涉及到兄弟模块通信**，兄弟模块通信在原始 Vue 中需要 **自己手动转换为父子通信**，也就是转为下面这一点。
+ 如果放到总模块，展示评论模块 **监视** 父模块的数据，添加评论模块 **修改** 父模块的数据，成功解决了动态页面的问题。
+ 可以轻松使用 PubSubJS 库来实现兄弟间通信。

---

在 Vue 中父子通信是比较简单而且多样的通信。

+ 这里使用第一种：`prop`  传值
  + 父组件传给子组件数据是在子组件标签里 **添加属性** 。
  + 然后子组件所导出对象里添加 `props` 属性
  + 属性值可以有三种：
    + 每一个属性的属性值为 **【父组件传来的数据的类型】** 的对象
    + 每一个属性的属性值为 **【父组件传来的数据的一些配置对象】** 的对象（有点绕）
    + 字符串数组

在 App.vue 里的 ShowComment 标签里 **添加自定义属性**，然后该属性绑定到 data 里的数据。

```html {3,10}
<div class="container row">
  <AddComment />
  <ShowComment :comments='comments'/>
</div>
<script>
  export default {
    name: 'App',
    data() {
      return {
        comments:[  // 数据存放位置
          { name: 'Bob', message: 'Vue还不错' },
          { name: 'Tom', message: 'Vue So Eay' },
          { name: 'Tim', message: 'Vue So So' },
        ]
      }
    },
</script>
```

然后子组件就接收父组件传过来的数据。这里使用字符串数组，字符串的内容为子组件里 **属性的属性名**。

```js
export default {
  name: 'ShowComment',
  props: ['comments'],
  components: {
    CommentItem
  },
}
```

### 1.3 动态页面

如果需要对数据进行操作，一般不会在子组件直接修改数据，因为父组件会不知道是哪个子组件修改了数据，不便于管理。所以现在需要遵循一个准则：【**数据在哪个组件，更新这个数据的方法就写在哪个组件里**】。所以我们要将方法传到子组件里，**子组件来调用**。（有点类似于回调函数？）

首先先在父组件定义方法：第 13 行，添加评论的实现就是往数组里添加数据。

```js {13}
export default {
  name: 'App',
  data() {
    return {
      comments:[  // 数据在哪个组件，更新这个数据的方法就写在哪个组件里
        { name: 'Bob', message: 'Vue还不错' },
        { name: 'Tom', message: 'Vue So Eay' },
        { name: 'Tim', message: 'Vue So So' },
      ]
    }
  },
  methods: {
    addComment(comment){
      this.comments.unshift(comment)
    },
  }
}
```

然后在页面上的子组件添加属性，将方法传递给子组件。

```html {2}
<!-- App.vue -->
<div class="container row">
  <AddComment :addComment='addComment'/>
  <ShowComment />
</div>
```

然后在子组件里接收数据，这里使用了第二种来接收数据——每一个属性的属性值为 **【父组件数据的一些配置对象】** 的对象。也就是说第 5 ~ 6 行是配置对象里的配置选项。

配置选项有 种：

+ ` type` ：指明传过来的 **数据类型** .
+ `required: true/false` ：是否必要。
+ `validator: 返回布尔值的方法` ：自定义验证方法
+ `default: 基本类型/有返回值的方法` ：指定默认值
+ 前面三个选项有其一不满足时，**Vue 会在浏览器控制台中警告你**，这在开发一个会被别人用到的组件时十分有用。
+ 如果只想指明 type ，可以简写成 `数据名: 数据类型 ` ，例如 `addComment: Function` 。

```js
export default {
  name: 'AddComment',
  props: {
    addComment: {
      type: Function,
      required: true,
    },
  },
```

## 二、任务项目

使用 props 传递数据，虽然很简单易用，但依然有缺点，就是 **隔代传递数据较冗余**。

现在使用以下界面和功能：

+ 每日任务功能，可以添加和删除任务。

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/%E4%BB%BB%E5%8A%A1%E9%A1%B9%E7%9B%AE%E7%95%8C%E9%9D%A2.png" style="zoom:50%;" />

### 2.1 划分模块

这里将上图划分为三个模块：

+ `TodoHeader` ：添加任务模块
+ `TodoList` ：展示任务模块
  + `TodoItem` ：每一个任务模块
+ `TodoFooter` ：任务功能模块

### 2.2 静态页面

我们需要将 App.vue 的数据传递到 `TodoList` 模块。将 item 和 index 传递给 `TodoItem` 组件里。

```html
<!-- App.vue -->
<todo-list :toDoData='toDoData' />

<!-- TodoList.vue -->
 <todo-item v-for="(item, index) in toDoData" :key="index" 
    :item='item' :index='index' />
```

### 2.3 动态页面

这里就会很明显地感受到隔代传值的麻烦，假设我们现在实现删除功能，然后删除数据的方法是写在 App.vue 里，我们需要先传给 `TodoList` ，才能传给 `TodoItem`。

```html {3,20,24}
<!-- App.vue --> 
<!-- 传递给 TodoList --> 
<todo-list :toDoData='toDoData' 
           :deleteOneItem='deleteOneItem' />

<script>
  export default {
    name: 'App',
    methods: {
      deleteOneItem(index){
        if(window.confirm(`是否需要删除 ${this.toDoData[index].toDoMessage}?`)){
          this.toDoData.splice(index, 1)
        }
      },
    }
</script>

<!-- TodoList.vue -->
<!-- 不使用数据直接，传递给 TodoItem --> 
<todo-item v-for="(item, index) in toDoData" :key="index" 
    :item='item' :index='index' 
    :deleteOneItem='deleteOneItem' />

<!-- TodoItem.vue -->
<button class="btn btn-danger btn-sm" style="height: 40px;" 
        @click="deleteOneItem(index)" >
  删除
</button>
```

### 2.4 总结

父子组件最重要的一点是子组件如果要修改父组件传递过来的值，**一定是调用父组件的方法来修改**。

（尚硅谷里的视频是使用 v-model 来绑定 props 里的数据，因为 Vue 没有监视到，所以没有报错，但不代表符合 Vue 本身的设计思想）

### 2.5 自定义事件

是不是觉得使用标签属性来传递方法有点麻烦，同一个方法名需要 Ctrl + v 三遍，而且方法名比基本类型数据的名称长很多，方法传递多了就像上面代码中的标签一样，一个标签四五行代码。

Vue 有一种方法专门传递方法——**自定义事件**。（自定义事件也只符合父子通信）

+ 绑定事件监听：
  + 自动绑定： `@事件名 = 回调函数`
  + 手动绑定： `this.$refs.组件名.$on( '事件名', 回调函数 )`
+ 触发事件：
  + `this.$emit( '事件名', 自定义参数 )`

现在使用这个来实现添加评论。

+ 第 2 中定义了 add_data 事件，事件的命名最好使用 **下划线命名法**，因为 HTML 页面不分大小写，防止无法触发事件。

```html
<!-- App.vue -->
<todo-header @add_data='addData' />

<script>
	export default {
  name: 'App',
    methods: {
      addData(message){
        this.toDoData.unshift({ toDoMessage: message, isDone: false })
      }
    }
  }
</script>
```

+ 第 5 行：然后在 TodoHeader.vue 里触发事件，并传递参数。

```html {5}
<div class="col">
  <input type="text" class="form-control" 
         placeholder="请输入你的任务，按回车确认" 
         v-model="addItem" 
         @keydown.enter="$emit('add_data', addItem)" />
</div>
```

### 2.6 使用第三方库

在设计模式里有一种模式就是观察者模式，其另一种说法就是消息订阅发布模式，就像在 b 站上看视频，只要你订阅了某个 up 主，其发布的消息你都能接收到，但没订阅过的用户一定接收不到。

**我们也可以使用这个模式来作为组件间通信**。使用消息订阅发布模式的第三方库有很多，我们这里使用 [PubSubJS](https://github.com/mroderick/PubSubJS) 

在使用他之前需要搞清两个概念——**发布者** 和 **订阅者**。

+ 发布者：类似于触发监听，一般是子组件。
+ 订阅者：类似于绑定监听，一般是父组件。只有触发监听，绑定监听才有效；只有发布者发布了内容，订阅者才有内容可以看。

他的使用方式也很简单：

+ 发布消息： `PubSub.publish('消息名称', 自定义参数)` 
+ 订阅消息： `PubSub.subscribe('消息名称', (msg, data) => {})`
  + `msg` ：消息名称
  + `index` ：传过来的数据

使用这个库来改进删除单项任务：

+  App.vue 中订阅消息：在挂载页面的时候订阅消息

```js
mounted() {
  PubSub.subscribe('deleteOneItem', (msg, index) => {
    if(window.confirm(`是否需要删除 ${this.toDoData[index].toDoMessage} ？`)) {
      this.toDoData.splice(index, 1)
      console.log(msg);
    }
  })
},
```

+ TodoItem.vue 中发布消息

```js
methods: {
  deleteOneItem(index){
    PubSub.publish('deleteOneItem', index)
  }
},
```

## 三、插槽

插槽在 Vue 2.6.0 有较大的更新。所以需要辨别一下自己所使用的 Vue 版本。

插槽顾名思义就是一个可以插入组件的凹槽，只要符合就可以插上。

**凹槽在子组件，插入凹槽的东西在父组件，是父子组件通信的一种方式**，不过通信的数据为标签。

### 3.1 默认插槽

最基本的插槽就是默认插槽。普通子组件在父组件使用一般只是单标签，就像下面第一章评论项目的静态页面所示。

```html
<!-- 总模块 -->
<div id="app" class="container">
  <!-- 头部提示信息 -->
  <HeaderComment/>

  <!-- 评论功能区域 -->
  <div class="container row">
    
    <AddComment/>
    
    <!-- 展示评论区域 -->
    <ShowComment/>
  </div>
</div>
```

这时可以看作插入凹槽的内容为空，和写双标签但里面的内容为空一样的效果

```html
<div id="app" class="container">
  <!-- 头部提示信息 -->
  <HeaderComment/>

  <!-- 一样的效果 -->
  <HeaderComment></HeaderComment>
</div>
```

但一旦我们将数据放到标签里，再在子组件里定义 slot 标签，将会成功的将数据传递到子组件。

```html
<!-- App.vue -->
<div id="app" class="container">
  <HeaderComment>这是插槽的内容</HeaderComment>
</div>

<!-- HeaderComment.vue -->
<div class="container p-0">
  <!-- 这里将会显示【这是插槽的内容】 -->
  <slot></slot>
</div>
```

### 3.2 具名插槽

上面默认插槽最不经常用，因为标签里的数据不一定只有一个。最常用的是具名插槽。

+ 定义数据：我们需要定义一些内容，插入到凹槽中。
  + 用法：在 template 标签里添加 v-slot 属性来为当前内容命名。
  + **Vue 规定含有 v-slot 属性的标签一定要是 template 标签。** （除了 3.4 节所提到的一种情况）

```html
<template v-slot:插槽名>
  <!-- 。。。 -->
</template>
```

+ 定义凹槽：我们要将数据按照自己的需求填入凹槽里。
  + 用法： `<slot name='插槽名'></slot>`

下面将普通页面使用插槽显示：

+ 第 12 行中的内容没有表明是哪个插槽，所以其作为默认插槽，如果子组件也有 **没有指明名字的插槽**，后备内容就会传过去。

```html
<!-- 父组件里面 -->

<!-- 子组件标签 -->
<sub-component>
  
  <!-- 头部数据 -->
  <template v-slot:header>
    <h1>这里是header的插槽内容</h1>
  </template>

  <!-- 无名数据 -->
  <p>这里是默认插槽的插槽内容</p>

  <!-- 尾部数据 -->
  <template v-slot:footer>
    <p>这里是footer的插槽内容</p>
  </template>
</sub-component>
```

然后子组件里只要将 slot 标签按自己需求摆放即可。

```html
<!-- 子组件 -->
<template>
  <div>
    <!-- 头部数据展示在这里 -->
    <slot name="header"></slot>
    
    <!-- 尾部数据展示在这里 -->
    <slot name="footer"></slot>
    
    <!-- 无名数据展示在这里 -->
    <slot></slot>
  </div>
</template>
```

### 3.3 后备内容

如果父组件没有传数据过来，子组件不能就这样坐视不管，所以子组件可以指定一个后备内容。

用法：在子组件的 slot 标签里直接写下后备内容。

```html
<!-- 父组件 -->
<sub-component>
  <!-- 头部数据但里面没有内容 -->
  <template v-slot:header>
  </template>
</sub-component>

<!-- 子组件 -->
<slot name='header'>这里是header的后备内容</slot>
```

### 3.4 插槽作用域

一天，当你在子组件里使用了当前组件的数据来定义后备内容时。

```html
<!-- 子组件 -->
<template>
  <div>
    <!-- 使用data里的数据时 -->
    <slot>{{userInfo.name}}</slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo:{
        name: '张三',
        age: 18
      }
    }
  },
}
</script>
```

这时需求是当不显示用户年龄时，显示用户姓名；当显示用于年龄时，不显示用户姓名。

所以现在你需要在父组件使用子组件的数据 userInfo 里来获得年龄数据。一般我们会这样错误的使用，例如下面代码。因为数据是 **父组件渲染完成再传递给子组件**，而不是将数据传递给子组件再去渲染数据。

```html
<!-- 父组件 -->
<sub-component>
  <!-- 无数据显示 -->
  {{userInfo.age}}
</sub-component>
```

所以我们需要将 userInfo 传递给父组件，则需要在子标签添加属性，就和父组件传值给子组件一样。

```html
<!-- 子组件 -->
<template>
  <div>
    <slot :userInfo='userInfo'>{{userInfo.name}}</slot>
  </div>
</template>
```

然后父组件在 slot 属性后面添加赋值，就可以接收到子组件传过来的数据。传过来的是插槽数据对象，里面的每一个键值对都是子组件写的属性。这样就可以使用到子组件的数据了。

```html
<base-layout v-slot:default="slotProps">
  
<!--
	如果不只有一个插槽，v-slot必须写在template标签上，例如下面代码

  <template v-slot:default="slotProps">
  	{{slotProps.userInfo.age}}
  </template>

	现在这种写法，是因为这里当前只有一个默认插槽
-->
</base-layout>
```

### 3.5 一些语法糖

#### （1）解构插槽数据对象

容易知道，Vue 指令后面的赋值语句，都会解析成 Javascript 代码，就像 v-show 指令。所以我们可以使用 ES2015 中的 **对象解构来抽取 一部分插槽数据对象里的 属性**。

例如 3.4 节的代码中，子组件传过来的数据我就只想使用 userInfo ，但我每次 **都要调用 slotProps 对象才可以获取到 userInfo**，不太方便。我们就可以将 slotProps 对象解构。

（对象解构：简单来说，就是将对象里的部分属性单独提取出来，详情可以参考 [[阮一峰]ES6变量的解构赋值](https://wangdoc.com/es6/destructuring.html)）

```html {1,3}
<base-layout v-slot:default="{ userInfo }">
  <!-- 解构后的用法 -->
  {{userInfo.age}}
  
  <!-- 解构前的用法
  {{slotProps.userInfo.age}} 
	-->
  
  <!-- 其实执行了下面Javascript代码
	{ userInfo } = { 'userInfo': { name: '张三', age: 18  } } 
	-->
</base-layout>
```

根据解构的语法，还可以对其 **重命名** 和 **设置默认值**。

```html
<!-- 对属性进行重命名 -->
<base-layout v-slot:default="{ userInfo: user }">
	{{user.age}}
</base-layout>

<!-- 设置默认值，当没数据传过来时显示，父组件插槽的后备内容 -->
<base-layout v-slot="{ userInfo= { age: 1 } }">
	{{userInfo.age}}
</base-layout>
```

#### （2）解构遇到的问题

上一个代码块的第 7 行——**设置解构默认值** 的 标签里使用的是 `v-slot` 而不是第 2 行的 `v-slot:default` 。如果使用了 `v-slot:default` ，就会报下面的错。（可能是一些小瑕疵之类的？）

```shell
报错提示：
Module Error (from ./node_modules/vue-loader/lib/loaders/templateLoader.js):
(Emitted value instead of an instance of Error)

Errors compiling template:

invalid expression: Invalid shorthand property initializer in

{ userInfo= { age: '1'} }

Raw expression: v-slot:default=" { userInfo= { age: '1'} } "
```

#### （3）具名插槽的缩写

对于有名字的插槽，前面的 `v-slot` 可以改为 `#` 。例如将第（1）点的代码：

（第（2）点所提到的问题这时使用缩写却没有问题）

```html
<!-- 使用缩写：对属性进行重命名 -->
<base-layout #default="{ userInfo: user }">
	{{user.age}}
</base-layout>

<!-- 使用缩写：设置默认值 -->
<base-layout #default="{ userInfo= { age: 1 } }">
	{{userInfo.age}}
</base-layout>
```

## 四、AJAX请求

我们在使用了 jQuery 时使用过其包装的 AJAX，现在我们可以使用一个更高级先进的 AJAX —— **Axios**。

> # Axios 是什么?
>
> Axios 是一个基于 *[promise](https://javascript.info/promise-basics)* 网络请求库，作用于 [`node.js`](https://nodejs.org/) 和浏览器中。 它是 *[isomorphic](https://www.lullabot.com/articles/what-is-an-isomorphic-application)* 的(即同一套代码可以运行在浏览器和node.js中)。在服务端它使用原生 node.js `http` 模块, 而在客户端 (浏览端) 则使用 XMLHttpRequests。

+ [Axios 官网](https://axios-http.com/zh/)
+ [Github 仓库](https://github.com/axios/axios)

我们尝试使用其来做一个小东西来使用 axios。当在文本框输入时，下面就会提示在 Github 搜索中最多星的仓库。

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/axios%E5%B0%8F%E6%A1%88%E4%BE%8B.png" style="zoom:60%;" />

### 4.1 页面布局

页面里就只有一个文本框加一个显示文字的区域。为了好看点，所以加上了 v-if 实现的 Loading 和需要显示数据的切换。

```html
<template>
  <div id="app">
    <input type="text" v-model="searchName" />
    <p v-if="isLoading">Loading</p>
    <p v-else>
      The Most Stars repositoriy is
      <a :href="MostStarsRepUrl">{{MostStarsRepName}}</a>
    </p>
  </div>
</template>
```

### 4.2 实现

实现的思路是：观察文本框的值即 searchName 变量，**如果文本框的值改变了就发送新的网络请求**。

> 至于为什么不能使用计算属性？**因为 computed 禁止将自己改成异步方法**
>
> 下面摘自思否的一个 [问题](https://segmentfault.com/q/1010000014139503?utm_source=tag-newest)：
>
> 在 eslint-plugin-vue 里找到了一些 [说明](https://link.segmentfault.com/?enc=XC628vNdhcj4P%2BA0ogH9ZA%3D%3D.N%2Fsd0sDp3vvVzEr2Doj%2F4eXx5q%2Bzr4sMevhp1iff2FCq1G23Bm6PUGyXRj7xu0v7uTJoczJJnXfmMQLq9m5KU%2Fi5VfMM3HfGR%2FtpTnJApYmdEvz53zsfqKT6wgsO62Hl%2FEq5BYgaFZvjFveLgAgziA%3D%3D)
>
> Computed properties should be synchronous(**计算属性需要是同步的**). Asynchronous actions inside them may not work as expected and can lead to an unexpected behaviour, that's why you should avoid them. If you need async computed properties you might want to consider using additional plugin vue-async-computed
>
> 错误示范：
>
> ```js
> // 错误示范
> async get () {
>     var result = await getDetails(this.param)
>     return result
> }
> ```

我们使用到的是 Github 的一个 Search API：https://api.github.com/search/repositories 。我们使用 API 的两个参数：

+ `q` ：**所需要查询的关键字**
+ `sort` ：**排序类别**；默认为 `best match` 最佳匹配，可以选择 `stars` 星星数，`forks` 克隆数 ， `help-wanted-issues` 问题数，`updated` 更新数。
+ [更多参数详情](https://docs.github.com/en/rest/reference/search#search-repositories)

+ 所以我们最后需要的使用到的链接是：
   `https://api.github.com/search/repositories?q=${newValue}&sort=stars` 。
  + `${newValue}` ：使用到是观察变量所传递过来的 **新值**。


然后 axios 的使用也和 jQuery 的 Ajax 差不多一致。

1. **决定请求类型**：Get 还是 Post 或者是其他的。
2. **决定请求路径**
3. 决定请求配置（可选）
4. **决定成功和失败的回调函数。**

```js
// 引入Axios
import axios from 'axios'
export default {
  name: 'App',
  data() {
    return {
      // 是否正在加载
      isLoading: true,
      // 最多星的仓库链接
      MostStarsRepUrl: '',
      // 最多星的仓库名字
      MostStarsRepName: '',
      // 输入框输入的值
      searchName: '',
    }
  },
  watch: {
    // 观察输入框的变化
    searchName(newValue){
      axios
        .get( // 决定请求类型
          `https://api.github.com/search/repositories?q=${newValue}&sort=stars`	// 决定请求路径
        ) 
        .then((response) => { // 决定成功和失败的回调函数
          let data = response.data.items

          // 分别更新仓库名和链接
          this.MostStarsRepName = data[0].name
          this.MostStarsRepUrl = data[0].html_url

          // 改变当前加载状态
          this.isLoading = false
        }).catch((error)=>{
          console.log(error);
        })
    }
  },
}
```

如果不想使用模板字符串来拼接参数，也可以 **使用 Axios 中的 params 参数**，可以改写成下面代码：

```js
axios(
  {
    method: 'get',
    url: 'https://api.github.com/search/repositories',
    params:{
      q: newValue,
      sort: 'stars'
    }
  }
)
.then((response) => {
  // 。。。
}
```

### 4.3 搜索Github用户案例

我们接下来使用 Axios 来制作一个根据文本框的内容搜索相应的用户，并显示他们的名字和头像，显示效果如下。

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/axios%E6%90%9C%E7%B4%A2%E7%94%A8%E6%88%B7%E6%A1%88%E4%BE%8B.png" style="zoom:50%;" />

#### （1）页面布局

页面布局很简单，上面一个提示信息加文本框，下面使用 `v-for` 遍历所有的数据。这里使用的是 Bootstrap，所以会自动设置为弹性（flex）布局，根据内容自动换行，所以直接 `v-for` 遍历 li 标签即可。

```html
<template>
  <div id="app" class="container">
    <div class="row">
      <div class="col-6 text-center mx-auto">
        <p>请输入您需要搜索的用户名称</p>
      </div>
    </div>
    <div class="row">
      <div class="col-6 mx-auto">
        <input type="text" v-model="searchName" class="form-control" />
      </div>
    </div>
    <p v-if="isLoading">Loading</p>
    <div class="container m-4" v-else>
      <div class="row">
        <div class="col-4 border" v-for="(item, index) in userList" :key="index">
          <div class="m-3">
            <a :href="item.html_url">
              <img :src="item.avatar_url" width="200px" />
            </a>
            <p>
              <a :href="item.html_url">{{item.login}}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

#### （2）实现功能

这里使用的是观察属性的另一种写法——**属性值为配置选项的对象**。 watch 有一些配置可选，例如第 3 行的 deep，深度监视选项，会监视到对象里面变化，**如果需要监视数组里面变化不可用这个**，需要使用 Vue 为数组重写了的一些方法。

```js
watch: {
  searchName: {
    deep: true,
      handler(newValue) {
      // 更改为正在加载的状态
      this.isLoading = true
      axios
        .get(`https://api.github.com/search/users?q=${newValue}`)
        .then((response) => {
        let items = response.data.items
        // 更新全部数组
        this.userList = items
        // 更改为加载完成状态
        this.isLoading = false
      })
        .catch((error) => {
        console.log(error)
      })
    },
  },
},
```

## 五、路由

现在 Vue 的实际应用中，比较流行的是 **SPA**（Single Page Application，单页应用程序）。只有第一次会加载页面，以后的每次请求，仅仅是获取必要的数据，不再刷新页面。

### 5.1 基本路由

如果使用 Vue 脚手架—— vue@cli 来创建项目，然后勾选路由选项，基本路由就会自动帮你创建好。

这时可以发觉到 Vue 项目里的文件夹多了两个，一个是【views】，另一个是【router】。（其实在 NodeJS 项目中也使用过这两个文件夹）

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/%E8%B7%AF%E7%94%B1%E9%A1%B9%E7%9B%AE%E7%9A%84%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84.png" style="zoom:70%;" />

+ **views**：用于给路由器切换不同的页面，而页面由不同的组件组成，虽然两者的语法一致。
+ **router**：用于配置路由器。

主要的内容是如何配置路由器。

+ 第 2 ~ 4 行：**引入 Vue 和 VueRouter 路由**，因为需要注册路由到 Vue 里。（类似于 NodeJS 中配置中间件）；根据需要引入所需模块。
+ 第 7 行：**注册路由**。
+ 第 10 ~ 22 行：**自定义路由表**，可以像第 20 行中按需加载模块，只有访问到指定链接才会去引入模块。
  + **语法：** `path` ：访问路径
  + `name` ：当前路由的名字
  + `component` ：需要加载的模块
+ 第 25 行：**将路由表放到路由器里**。
+ 第 30 行：**导出路由**，并用于给 main.js 加载路由模块（最重要，但脚手架已经帮你写好了。一般 main.js 不需要改动）

```js
// 引入所需模块
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

// 注册路由
Vue.use(VueRouter)

// 自定义路由表
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // 按需注册
    component: () => import('../views/About.vue')
  }
]

// 将路由表放到路由器里
const router = new VueRouter({
  routes
})

// 导出路由
export default router
```

那如何在页面上显示呢？使用 **router-link 标签** 来导航路由，该标签的基础样式与 a 标签相同；使用 **router-view 标签** 来显示路由。

```html
<div id="app" style="height: 400px;">
  <div class="container p-3 h-100">
    <div class="row">
      <h1>这是标题</h1>
    </div>
    <div class="row h-75">
      <div class="col-3 border border-2">
        <!-- 导航路由 -->
        <router-link to="/home">Home</router-link><br/>
        <router-link to="/next">Next</router-link>
      </div>
      <div class="col-9 border border-2">
        <!-- 显示路由 -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</div>
```

显示效果如下：

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/%E5%9F%BA%E7%A1%80%E8%B7%AF%E7%94%B1%E6%98%BE%E7%A4%BA%E6%95%88%E6%9E%9C.png" style="zoom:40%;" />

还有一个细节是，被选中的 `router-link` 标签会加上 `router-link-active` 和 `router-link-exact-active` 类。这两个区别是：

+ `router-link-active` ：当前路由链接的父链接就会加上（包括自己），可能有多个标签拥有。
+ `router-link-exact-active` ：只有当前的路由链接会加上，只会有一个标签拥有。
+ 我们可以根据这个来识别当前所在的路由以及当前路由的父链接。

### 5.2 嵌套路由

嵌套路由就是在当前路由链接中又有子链接。

使用方式：在一个路由链接中，添加 children 数组，也就是子路由表，数组里的每一项也是路由链接。例如下面第 7 ~ 16 行。

```js {7-16}
const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    // 使用嵌套路由
    children:[
      {
        path: 'message',
        component: () => import('../views/Message.vue')
      },
      {
        path: 'news',
        component: () => import('../views/News.vue')
      }
    ]
  },
]
```

子路由的 path 的写法有两种：

+ 绝对路径：拼接父链接，较少使用。第 9 行可以改写成 ：`path: '/home/message'`
+ 相对路径：相对于父链接里面的的链接，推荐使用，例如第 9 行和第 13 行。 **这样无须设置嵌套的路径**。
+ 第一次进入路由，会什么都不显示，因为这时没有链接到任何路由。如果你想一开始就显示内容，你就需要配置空路径，例如第 10 ~ 13 行。

```js {10-13}
children:[
  {
    path: 'message',
    component: () => import('../views/Message.vue')
  },
  {
    path: 'news',
    component: () => import('../views/News.vue')
  },
  { // 配置空路径 
    path: '',
    component: () => import('../views/News.vue')
  }
]
```

### 5.3 保持路由状态

如果有这样的需求：在页面间切换，输入框的值不会消失，例如填写个人信息之类的。

我们可以在 router-view 标签外面加上 keep-alive，就可以缓存路由状态。

```html
<keep-alive>
  <router-view></router-view>
</keep-alive>
```

在 Vue 的开发工具里可以看到 Home 组件被缓存了，并设置了 inactive 状态。

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/%E7%BC%93%E5%AD%98%E8%B7%AF%E7%94%B1%E7%8A%B6%E6%80%81%E6%95%88%E6%9E%9C.png" style="zoom:70%;" />

### 5.4 向路由传递数据

我们可以在路由链接后面添加指定格式的字符串来传递数据，就像 GET 请求一样。

+ `/` ：使用斜杆来传递数据。
  + 使用斜杆来传递数据需要 **提前表明数据的变量名**：例如需要传递 id 数据。需要修改路由表—— `/router/index.js` 中的路由链接。
  + **设置变量名：**将原本的 `path: 'news'` 改为 `path: 'news/:id'` ，这就表明你将来传递数据的变量名为 id。
  + **传递数据：** `  <router-link to="/home/news/10086" >News</router-link>`
  + **使用数据：** 使用 `$route` 里的 `params` 对象来获取传递过来的数据。例如 `$route.params.id` 

+ `?` ：使用问号来传递数据。
  + 使用斜杆来传递数据 **不需要表明数据的变量名** 。
  + **传递数据：** 与 GET 请求的方式一致。 `<router-link to="/home/news?id=10086&name=hahg" >News</router-link>`
  + 使用数据：使用 `$route` 里的 `query` 对象来获取传递过来的数据。例如 `$route.query.id` 

+ `$route` ：表示当前路由对象，有需要有用的信息，例如下面图片所示。

---

使用斜杆依然还有个问题，就是组件复用问题，在同一个路由中传递不同数据，页面不会更新，而使用问号没有这个问题，例如下面动图：

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/%E8%B7%AF%E7%94%B1%E7%BB%84%E4%BB%B6%E5%A4%8D%E7%94%A8%E7%A4%BA%E6%84%8F.gif" style="zoom:50%;" />

官网解释：

> 在切换路由时，因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。**不过，这也意味着组件的生命周期钩子不会再被调用，例如 mounted** 

解决方法：

+ 官网推荐：
  + 使用 watch 选项来观察 `$route` （当前路由）对象的变化
  + 使用 `beforeRouteUpdate` 生命周期
+ 其他方法：在路由视图标签的 key 属性上绑定一个独一无二的值，例如当前的路由链接 `$route.path` 或者时间戳。

### 5.5 编程式路由导航

如果说使用 router-link 标签，其样式就不好编写，所以我们一般不使用该标签，一般我们会手动导航到自己所需要的位置。

例如使用按钮，然后为按钮绑定单击监听，然后在定义回调函数的里面对路由进行操作。对路由操作的方法有三种：

+ `this.$router.push( path )` ：跳转到指定路径，即在路由访问历史中推入一个路径。
+ `this.$router.replace( path )` ：将当前页面替换成指定路径，即在路由访问历史中将当前历史替换成新的记录。
+ `this.$router.back()/forward()` ：回调到 上一个路由 / 下一个路由
+ `this.$router.go(整数)` ：正数代表前进，负数代表后退，数值代表跳转的数量。

使用编程式路由后的样式编写结果：

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/%E7%BC%96%E7%A8%8B%E5%BC%8F%E8%B7%AF%E7%94%B1%E4%BD%BF%E7%94%A8%E6%A0%B7%E5%BC%8F.png" style="zoom:45%;" />

## 六、Vuex

### 6.1 介绍

+ [官方网站](https://vuex.vuejs.org/zh/)

+ Vuex 是一个专为 Vue.js 应用程序开发的 **状态管理模式**。

+ 状态也称为保持数据，也就是将数据保持到全局里面，Vuex 就可以对全局数据进行管理。

这个状态自管理应用包含以下几个部分：

- **state**，驱动应用的数据源；
- **view**，以声明方式将 **state** 映射到视图；
- **actions**，响应在 **view** 上的用户输入导致的状态变化。

以下是一个表示 **“单向数据流”** 理念的简单示意：突出一个单向

+ 在 View 中不能直接操作 State 里的数据。
+ 在 Actions 中也不能直接操作 View。
+ 在 State 中也不能去直接触发 Actions.

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/vuex%E5%8D%95%E5%90%91%E6%95%B0%E6%8D%AE%E6%B5%81.png" style="zoom:40%;" />

### 6.2 所解决的问题

但是，当我们的应用遇到 **多个组件共享 状态 / 数据** 时，单向数据流的简洁性很容易被破坏：

- 多个视图依赖于同一状态。
- 来自不同视图的行为需要变更同一状态。

多个 组件 / 视图 如果想获取 State 里的值，则需要将数据传递到各个组件里；更新 State 里的数据就必须将 Actions 的各个方法分发到各个组件里。这就和第二章任务项目一样繁琐冗余。

> Vuex 的设计思想：因此，我们为什么不把组件的共享状态抽取出来，以一个 **全局单例模式管理**呢？在这种模式下，我们的组件树构成了一个巨大的 “ 视图 ”，**不管在树的哪个位置，任何组件都能获取状态或者触发行为！**

### 6.3 安装

直接使用脚手架就可以自动安装，安装完成后就会多出一个 store 文件夹，文件夹里面有一个 index.js，index.js 里面就是基本的框架。

```js
// 引入模块
import Vue from 'vue'
import Vuex from 'vuex'

// 配置模块
Vue.use(Vuex)

// 导出Store
export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
```

而在 main.js 自动挂载到了 App 上。

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,	// 挂载到App上
  render: h => h(App)
}).$mount('#app')
```

### 6.4 相关概念

在 index.js 里出现了几个陌生单词，其实都需要使用到。

+ `State` ：中文翻译【状态】，数据源，存放数据的地方。
+ `Getter` ：中文翻译【计算属性的Get】，需要自己添加，可以进行计算的数据源，与 Vue 里面的计算属性一致。
+ `Mutation` ：中文翻译【数据改变】，存放改变 State 里数据的方法，State 里数据的唯一办法是触发 Mutation。
+ `Action` ：中文翻译【行为】，存放触发 Mutation 的方法，最重要的是 Action 可以包含任意异步操作，例如定时器操作之类的。
+ `modules` ：中文翻译【模块】，用于存放子模块。Vuex 允许我们将 store 分割成 **模块（module）**。每个模块拥有自己的 state、mutation、action、getter。

根据官方的图可以大概知道他们的关系。

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/vuex%E6%B5%81%E7%A8%8B%E5%9B%BE.png" style="zoom:80%;" />

### 6.5 计数器实例

我们试着做一下官方计数器示例。这个示例就是点击按钮使中间的数字递增。

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/%E8%AE%A1%E6%95%B0%E5%99%A8%E6%98%BE%E7%A4%BA%E6%95%88%E6%9E%9C.png" style="zoom:60%;" />

#### （1）State

因为数据初始化不需要计算，所以中间的数字存放到 state 里。

然后使用 `this.$store.state.变量名` 来获取，当配置了 Vuex ，每一个组件里都拥有一个对象 `$store` ，里面存放了 Vuex 的数据。

```js
// store/index.js
export default new Vuex.Store({
  state: {
    number: 0
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})

// 页面中显示
// <p>{{$store.state.number}}</p>
```

#### （2）Actions

接下来实现按钮功能，我们来通过调用 Actions【行动】来触发 Mutation 【数据改变】。所以我们先要定义好 Actions。（虽然我们也可以直接在组件中直接修改 State 里的数据但不推荐这样子做，而且开启严格模式将会报错）

+ Actions 里的每一个方法的第一个参数会自动传递，参数值为 context 上下文对象，里面有很多有关 Vuex 的信息。

+ 但我们暂不需要那么多东西，所以可以使用对象解构，提取出我们需要使用到的 `commit()` 方法。
+ 最后的代码： `commit( 'Mutation里的方法名' )` 
+ 当传递参数时，官网推荐使用对象来传递，这样子更易读。
  `commit( 'Mutation里的方法名', { 变量名: 变量值 } )`

#### （3）Mutation

我们在写 Actions 的方法时需要使用到 Mutation 里的方法名，所以还再需要设计一下 Mutation 里的方法。

+ Mutation 里的方法只注重数据的变化，而不注重业务的逻辑。
+ number 变量是个整型，所以其数据变化只有增加和减少指定的数，而这里我们没有文本框让用户输入所变化的数，所以这里数据变化就变成了加一和减一。
+ 每一个方法的第一个参数会自动传递，参数值为 state 对象，我们就可以直接操作他。

```js
mutations: {
  INCREASEONE( state ) {
    state.number++;
  },
  DECREASEONE( state ) {
      state.number--;
  }
}
```

然后我们的 Actions 也可以完成了。

```js
actions: {
  increaseOne( { commit } ) {
    commit('INCREASEONE')
  },
  decreaseOne( { commit } ) {
    commit('DECREASEONE')
  }
}
```

#### （4）触发Actions

现在我们已经完成了 Vuex 里的内容，现在只需在组件中触发 Actions 就完成了整个流程。

+ 使用 `this.$store.dispatch( 'Action中的方法名' )` 来触发 Actions。

```js
export default {
  methods:{
    addOne(){
      this.$store.dispatch('increaseOne')
    },
    reduceOne(){
      this.$store.dispatch('decreaseOne')
    }
  }
}
```

#### （5）Getters

还有一个功能：偶数时增加一。我们这样实现：

+ 定义一个变量 `isOdd` ：来监视 State 里 number 变量的改变，从而来确定当前数字的奇偶性。
+ 然后每一使用这个变量来判断当前是否符合加一条件。
+ 我们需要使用到 Vuex 里 Getters 。

```js
getters: {
  isOdd(state) {
    // 确定数字的奇偶性
    return state.number % 2 === 0
  },
},
actions: {
  increaseIfOdd({ commit, getters }) {
    // 根据isOdd变量来确定是否增加一
    if(getters.isOdd){
      commit('INCREASEONE')
    }
  }
}
```

#### （6）异步操作

在 Vuex 的 Mutation 中一定只能同步操作，如果需要异步操作则放到 Actions 里。例如下面实现过一秒后加一。

```js
actions: {
  increaseSync({ commit }){
    setTimeout(() => {
      commit('INCREASEONE')
    }, 1000)
  }
}
```

#### （7）开发工具查看

我们可以使用 Vue 的开发工具来查看 Vuex 的使用情况，但其只能以 Mutation 的触发情况来监视 State 和 Getter 的数据，如下图所示。

![](https://raw.githubusercontent.com/hahg2000/picture/vue/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7%E4%B8%AD%E7%9A%84Vuex.png)

#### （8）简化写法

在下面写完的代码中可以看到，如果一些代码逻辑较为简单，则代码表现出重复，这是我们可以使用辅助函数来简化代码。

```js
methods:{
  addOne(){
    this.$store.dispatch('increaseOne')
  },
  reduceOne(){
    this.$store.dispatch('decreaseOne')
  },
  addOneIfOdd(){
    this.$store.dispatch('increaseIfOdd')
  },
  addOneAfterOneSec(){
    this.$store.dispatch('increaseSync')
  }
}
```

+ 可以使用到的辅助函数有 `mapState()` ， `mapGetters()` ， `mapActions()` 和 `mapMutations()` 
+ 函数需要传递一个对象或者数组
  + 传递对象：`{ 组件的方法名: Actions 里的方法名 }`
  + 传递数组：`[ 'Actons的方法名' ]` 。需要组件里的方法名和 Actions 里的方法名一致。
+ 使用辅助函数的代码：

```js
methods: {
  ...mapActions({
    addOne: 'increaseOne',
    reduceOne: 'decreaseOne',
    addOneIfOdd: 'increaseIfOdd',
    addOneAfterOneSec: 'increaseSync'
  })
},
```

#### （9）详细图解

我们接下来完善详细的官方图。

![](https://raw.githubusercontent.com/hahg2000/picture/vue/vuex%E6%B5%81%E7%A8%8B%E5%9B%BE%E5%AE%8C%E6%95%B4%E7%89%88.png)

### 6.6 改进任务项目

花了近一个小时将任务模块改造成使用 Vuex 的模式。 没什么难点，但建议从头做起，如果在原来的基础上改，比较费劲。

下面粘贴一下源代码：

:::detail

store 文件夹里的 index.js：

```js
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    toDoData: [
      { toDoMessage: '吃饭', isDone: false },
      { toDoMessage: '睡觉', isDone: true },
      { toDoMessage: '玩游戏', isDone: true },
    ],
  },
  mutations: {
    ADDDATA(state, payload) {
      state.toDoData.unshift(payload.ItemData)
    },
    DELETADATA( state, payload ){
      
      if(payload !== undefined){
        state.toDoData.splice(payload.index, 1)
      }else{
        state.toDoData.splice(0, state.toDoData.length)
      }
    },
    CHANGEISDONE( state, payload ){
      if(payload.index === undefined){
        state.toDoData.forEach((item) => item.isDone = payload.checked)
      }else{
        state.toDoData[payload.index].isDone = payload.checked
      }
    },
    CLEARALLCHECKED( state ){
      state.toDoData = state.toDoData.filter((item) => !item.isDone)
    }
  },
  actions: {
    addItem({ commit },  ItemData ) {
      commit('ADDDATA', { ItemData } )
    },
    deleteOneItem({ commit }, index ){
      commit('DELETADATA', { index })
    },
    deleteAllItem({ commit }){
      commit('DELETADATA')
    },
    changeAllIsDone({ commit }, checked){
      commit('CHANGEISDONE', { checked })
    },
    changeOneIsDone({ commit }, ItemCheckedData ){
      commit('CHANGEISDONE', ItemCheckedData)
    },
    clearAllChecked({ commit }){
      commit('CLEARALLCHECKED')
    }
  },
  getters:{
    checkedAmount( state ){
      return state.toDoData.reduce(
        (preTotal, todoItem) => preTotal + (todoItem.isDone ? 1 : 0),
        0
      )
    }
  }
})
```

组件的代码：

+ 头部组件：

```html
<!-- TodoHeader.vue -->
<template>
  <div class="container p-0">
    <div class="row mt-3">
      <div class="col">
        <input type="text" class="form-control" 
               placeholder="请输入你的任务，按回车确认" 
               v-model="inputTodo" @keydown.enter="addItem" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    components: {},
    data() {
      return {
        inputTodo:''
      }
    },
    methods:{
      addItem(){
        this.$store.dispatch('addItem', { toDoMessage : this.inputTodo, isDone: false } )
      }
    }
  }
</script>
```

+ 展示任务组件：

```html
<!-- TodoList.vue -->
<template>
  <div class="container mt-4">
    <todo-item v-for="(item, index) in toDoData" :key="index" :item="item" :index="index" />
  </div>
</template>

<script>
  import TodoItem from './TodoItem.vue'
  import { mapState } from 'vuex'
  export default {
    name: '',
    components: {
      TodoItem,
    },
    computed: {
      ...mapState(['toDoData']),
    },
  }
</script>
```

+ 展示单任务组件

```html
<!-- TodoItem.vue -->
<template>
  <div class="row border rounded align-items-center" style="height: 50px">
    <div class="col-1">
      <input type="checkbox" class="form-check-input" v-model="isChecked"/>
    </div>
    <div class="col text-start">
      <span>{{item.toDoMessage}}</span>
    </div>
    <div class="col-2">
      <button class="btn btn-danger btn-sm" style="height: 40px;" @click="deleteOneItem(index)">删除</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TodoItem',
    props: {
      item: Object,
      index: Number,
    },
    components: {},
    computed: {
      isChecked:{
        get(){
          return this.item.isDone
        },
        set(value){
          this.$store.dispatch('changeOneIsDone', { index: this.index, checked: value })
        }
      }
    },
    methods: {
      deleteOneItem(index) {
        this.$store.dispatch('deleteOneItem', index)
      },
    },
  }
</script>
```

+ 尾部组件：

```html
<!-- TodoFooter.vue -->
<template>
  <div class="container mt-4 mb-3">
    <div class="row">
      <div class="col-1">
        <input type="checkbox" class="form-check-input" v-model="isAllChecked" />
      </div>
      <div class="col text-start">
        <span class>已完成{{checkedAmount}}/总数{{toDoData.length}}</span>
      </div>
      <div class="col-4">
        <button class="btn btn-danger btn-sm" @click='clearAllChecked'>清除已完成的任务</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'

  export default {
    name: '',
    components: {},
    computed: {
      ...mapGetters(['checkedAmount']),
      ...mapState(['toDoData']),
      isAllChecked: {
        get() {
          return (
            this.checkedAmount === this.toDoData.length &&
            this.toDoData.length > 0
          )
        },
        set(value) {
          this.$store.dispatch('changeAllIsDone', value)
        },
      },
    },
    methods: {
      ...mapActions(['clearAllChecked'])
    },
  }
</script>
```

+ 总模块：

```html
<!-- App.vue -->
<template>
  <div id="app" class="container w-50 border mt-3">
    <todo-header />
    <todo-list/>
    <todo-footer/>
  </div>
</template>

<script>
  import TodoFooter from './components/TodoFooter.vue'
  import TodoHeader from './components/TodoHeader.vue'
  import TodoList from './components/TodoList.vue'

  export default {
    name: 'App',
    components: {
      TodoFooter,
      TodoHeader,
      TodoList,
    },
  }
</script>
```

:::

