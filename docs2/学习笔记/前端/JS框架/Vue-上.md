# Vue-上之基本使用

## 一、Vue简介

Vue (读音 /vjuː/，类似于 **view**) 是一套用于构建用户界面的**渐进式框架**。

渐进式：也就是说可以逐步让加插件让框架变大。

+ [Vue 3 官方文档](https://v3.cn.vuejs.org/)

+ [Vue 2 官方文档](https://cn.vuejs.org/v2/guide/)

优势：

+ 借鉴 Angular 的 **模板** 和 **数据绑定** 技术 
+ 借鉴 React 的 **组件化** 和 **虚拟 DOM** 技术。
+ （虽然这两个都没有学过）

其扩展插件：

+ **vue-cli: vue 脚手架** 
+ **vue-resource(axios): ajax 请求** 
+ **vue-router: 路由** 
+ **vuex: 状态管理** 
+ vue-lazyload: 图片懒加载
+ vue-scroller: 页面滑动相关

## 二、基本使用

### 2.1 入门

我们首先实现下面 GIF 图片的功能：

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/vue%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8.gif" style="zoom: 67%;" />

使用 Vue 步骤：

1. 引入 Vue.js
2. 创建 Vue 对象

   + el：指定 element（选择器）

   + data：初始化数据
3. 双向数据绑定：v-model
4. 显示数据：八字胡

例如下面代码：

+ 第 1 行：引入 Vue 文件
+ 第 12 行：使用 Vue 构造函数创建 Vue 示例，构造函数的参数里需要两个属性：
  + el：指定为哪个元素使用 Vue 语法。
  + data：所需要使用到的数据。
+ 第 4 行：使用 v-mode 双向绑定，将 Vue 示例里面的数据反映到页面 views 视图上。
  + 显示数据需要使用到八字胡语法，两个大括号，里面填数据属性名。

```html
<script src='../vue.js'></script>
<body>
  <div id='app'>  <!--views-->
    <input v-model="message" type="text" />
    <p>Hello {{message}}</p>
  </div>
</body>

</html>
<script>
  // 创建Vue示例
  const vm = new Vue({  // 配置对象
    el: '#app', // element：选择器
    data: { // model：数据
      message: ''
    }
  })
</script>
```

### 2.2 MVVM

> MVVM是 Model-View-ViewModel 的简写。它本质上就是 MVC 的改进版。MVVM 就是将其中的View 的状态和行为抽象化，让我们将视图 UI 和业务逻辑分开。

在 Vue 持续火热的时候，Vue 就以 MVVM 为其特点，但现在官网上已经没有下面这张宣传图了，因为 Vue 不是完全按照 MVVM 模式使用，但其清楚地说明了 Vue 的特点：

+ DOM Listeners：DOM 监听
+ Data Bindings：数据绑定

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/mvvm%E7%A4%BA%E4%BE%8B%E5%9B%BE.png" style="zoom:40%;" />

然后我们使用 jQuery 来实现上面的功能：

+ 很明显，在第 11 行，我们为 input 输入框 **加入了 input 监听**，对应 Vue 的 v-model ，也就是使用了上图的 **DOM Listeners**。
+ 然后在第 13 行从文本框获取到了数据，对应了上图的 **从 View 到 Model 的箭头**。
+ 最后在第 15 行将获取到的数据再赋值给文本框，对应了上图的 **从 Model 到 View 的箭头**。
+ 从上面可知 View 和 Model 都需要通过 VM 来处理。

```html
<!-- 视图 -->
<input type="text" id='app'>
<p></p>

<script src='../jquery-3.6.0.js'></script>
<script>
	// 获取DOM
    let $app = $('#app')
    
    // 为DOM加监听
    $app.on('input',function(event){
		// 获取目标的数据
        let message = $app.val()
        // 将数据赋值到指定区域
        $('p').first().text(message);
    })
</script>
```

### 2.3 模板语法

模板语法有两种：**双大括号插值** 和 **v- 指令**。

#### （1）双大括号插值

使用双大括号会在 Vue 示例里的 data 里获取数据，一般以文本形式显示，但也可以以 HTML 形式显示。

例如下面代码中，第 10 行的 message 是一个字符串，字符串的内容是 HTML 标签。

+ 使用 v-text ，相当于使用双大括号。
+ 使用 v-html，相当于将 message 解析成 HTML。不过很少场合使用。

```html
<div id="app">
    <p v-text="message"></p>
    <!-- 等价于 {{ message }} -->
    
    <p v-html="message"></p>
</div>

<script>
  var vm = new Vue({
    el: '#app',
    data: {
      message:'<h1>这是个h1标签</h1>',
    }
  })
</script>
```

最终结果如下：

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/v-html%E5%92%8Cv-text.png" style="zoom:50%;" />

#### （2）v-指令

使用 v-指令可以为 HTML 的 **属性 和 事件** 进行数据绑定。

属性数据绑定使用的是 `v-bind:属性名="数据属性名"` ，也可以简写为 `:bind属性名="数据属性名"` ，最常用绑定的属性是 href 和 src。

+ 其代码为 `<img :src="imgUrl" alt="">` 和 `<a :href="imgUrl">我是链接</a>`
+ v-bind 是 单向绑定，是因为你无法再进入 Vue 的示例对象再操作里面的数据。
+ 如果担心后面 **不小心改变 Model**，引起了 View 的改变，可以在 **之后再在也不改变的视图** 的外面包一层 `<div v-once></div>` 。

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/v-bind.png" style="zoom:40%;" />

+ 相反绑定了 v-model 的文本框，这个文本框就是 View 与 VM 通信的一个入口。

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/v-model.png" style="zoom:40%;" />

----

事件绑定使用的是 `v-on:事件名='方法名'` 指令，也可以简写为 `@click='方法名'`。其实和 onclick 差不多一样。

+ `<button v-on:click="changeUrl()"></button>`

### 2.4 计算属性

#### （1）计算属性的基本使用

计算属性的使用范围是当数据需要 **多个语句进行运算** 时，就可以使用。因为双大括号里面 **只能填写表达式**，而 **不可以写语句**。

```html
<!-- 下面都是正确的 -->
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<!-- 下面都是错误的 -->

<!-- 这是语句，不是表达式 -->
{{ var a = 1 }}

<!-- 流控制也不会生效，请使用三元表达式 -->
{{ if (ok) { return message } }}
```

例如下面图片示例中，我们需要将上面两个文本框的内容进行合并。

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/%E8%AE%A1%E7%AE%97%E5%B1%9E%E6%80%A7%E6%BC%94%E7%A4%BA.gif" style="zoom:50%;" />

计算属性使用方法也很简单：在 computed 对象里，定义一个方法，**方法名为数据的属性名**，里面方法的 **返回值为数据的属性值** 。所以上面图片的是实现代码如下：

这是页面：两个文本框分别与 Vue 示例的 data 里的两个变量绑定，然后用于显示的文本框与计算属性绑定

```html
<div id='app'>
    <!-- 页面 -->
    姓：<input type="text" v-model="firstName"><br/>
    名：<input type="text" v-model="secondName"><br/>
    使用计算属性——全名：<br/><input type="text" v-model="fullName1"><br/>
</div>
```

这是 Javascript 代码：第 9 ~ 12 行使用的是 ES6 新的方法声明形式。如果需要获取到 data 的变量，需要在变量的最前面加上 `this.` ，才可以获取得到。

```html {9-11}
<script>
    let vm = new Vue({
        el: '#app',
        data: {
            firstName: '',
            secondName: '',
        },
        computed: {
            fullName1(){
                // 使用this来获取框到data里的变量
                return this.firstName + ' ' + this.secondName
            }
        }, 
    })
</script>
```

计算属性执行方法的时机：

+ 第一次初始化时；
+ 当使用到的变量的值发生改变时。

就是因为计算属性会对使用到的属性进行监视，但这个会涉及到 **深度监视问题**。

#### （2）监视

因为计算属性的一个特点就是监视使用到的数据的变化，我们也可以使用 watch 监视来实现其功能。

开启对某个数据监视有两种方法，一个是在创建 Vue 实例时指定，另一个 Vue 实例创建完成后指定。

+ 第 8 行：在 watch 对象里插入方法，方法名为监视的属性。回调函数的两个参数，分别为 **新值** 和 **旧值**。
+ 第 16 行：使用 \$watch 来对实例里的某个数据监视。
  + `vm.$watch( expOrFn, callback, [options] )`
  + `{string | Function} expOrFn` ：需要监视的数据
  + `{Function | Object} callback` ：回调函数
  + `{Object} [options]` ：参数（可选）
  + 返回值：`{Function} unwatch` 取消观察函数。可以直接调用来停止观察 `unwatch() `

```js {9,16}
let vm = new Vue({
    el: '#app',
    data: {
        firstName: '',
        secondName: '',
        fullName2: ''
    },
    watch:{ // 在创建时监视firstName
        firstName(newValue, oldValue){
            this.fullName2 = newValue + ' ' + this.secondName
        }
    }
})

// 在创建Vue实例后指定
vm.$watch('secondName', function(newValue, oldValue){
    this.fullName2 = this.firstName + ' ' + newValue
})
```

#### （3）get和set

计算属性可以拥有 get 和 set 两个回调函数。

回调函数拥有三个特点：1. 你定义的 2. 你没有调用 3.但仍然执行了。

以及两个问题：1. 什么时候调用的？ 2. 用来做什么？只要回答了这两个问题，就会使用这个回调函数了。

+ getter：1. 在读取当前计算属性时触发。时机和之前一样，在第一次显示时。根据 **相关的数据计算** 并返回数据。如果不明示写出，默认就是 getter。
+ setter：1. 当属性值发生改变时触发，更新某些相关的数据。回调函数的参数为属性值的新值。

```js
computed: {
    fullName3:{
        get(){
            // 显示的时候，与之前一致
            return this.firstName + ' ' + this.secondName
        },
        set(value){
            // 当使用文本框改变时触发
            const name = value.split(' ')
            // 分别改变对应的数据
            this.firstName = name[0]
            this.secondName = name[1]
        }
    }
}
```

### 2.5 强制绑定style和class

上面 v-bind 指令可以绑定到 HTML 标签的属性，所以也可以 HTML 标签的 class 和 style 属性。

#### （1）绑定style属性

绑定到 style 属性的类型有三种：1. 字符串 2. 数组 3. 对象。

1. 字符串：代表类名。少用
2. 数组：多个类名，常用于动态添加类名。
3. 对象：{ 类名 : 布尔值 }，根据布尔值来增加和删除类名，常用于类的切换。

下面是页面代码，每一个 span 标签都与 Vue 实例的变量绑定。有三个类，分别为 aClass、bClass、cClass。

```html
<div id='app'>
    <span :class='a'>这是文字</span>
    <span :class='b'>这是文字</span>
    <span :class='c'>这是文字</span>
    <span :class='d'>这是文字</span>
</div>
<style>
    .aClass{
        background-color: #bfa;
    }

    .bClass{
        background-color: aqua;
    }

    .cClass{
        font-size: 40px;
    }
</style>
```

然后 Javascript 代码中：

+ a 变量：aClass 类名，实际上就是将 ' aClass ' 字符串赋值给 class 属性。
+ b 变量：**对象里面的属性值为 true 的，就会赋值到 class 属性里**，这是 bClass 赋值到了 class 属性里。
+ c 变量：**字符串数组**，也就是类名数组，在数组里的都会赋值到 class 属性。
+ d 变量：在数组里使用对象，与 b 变量一样的 class 属性，但这个较灵活，可以表明哪个类名不需要改变，哪个类名需要改变。这里是 bClass 不需要改变（虽然也可以改变），aClass 可以改变。

```js
var vm = new Vue({
    el: '#app',
    data: {
        a: 'aClass',
        b: { 'bClass': true, 'aClass': false },
        c: ['aClass', 'bClass'],
        d: ['bClass', { 'aClass': flag } ],
		flag: false
    },
})
```

渲染结果如下：

![](https://raw.githubusercontent.com/hahg2000/picture/vue/%E5%BC%BA%E5%88%B6%E7%BB%91%E5%AE%9Aclass.png)

::: warning

🟡 值得注意的是：使用 class 强制绑定并不会将原来的 class 属性改变，会在原来的添加上去， style 强制绑定 也是如此。

:::

#### （2）强制绑定style

强制绑定 style 与 class 类似，其接受两个类型的数据：

+ 对象
  + 一个对象可以拥有多个 **样式属性**，也称这个对象为样式对象。
  + 例如 `{ fontSize: '30px', color: 'red'}`。

+ 数组
  + 数组里可以填写多个 **样式对象**。
  + 例如 `[ { fontSize: '30px' }, { color: '#f2ff4b', backgroundColor: 'rgb(233 95 243)'} ]`

### 2.6 条件渲染

条件渲染有两个 v- 指令，都根据所绑定得数据来判断是否显示。

+ `v-if, v-else-if, v-else` ：将当前元素 **移除或插入到** HTML 页面上。
+ `v-show` ：切换当前元素的 `display` 属性。

```html
<div id='app'>
    <p v-if='flag'>成功</p>  <!-- 存在 -->
    <p v-else>失败</p>  <!-- 不存在 -->
    
    <p v-show='flag'>成功</p>  <!-- 显示 -->
    <p v-show='!flag'>失败</p>  <!-- 不显示 -->
</div>

<script>
  var vm = new Vue({
    el: '#app',
    data: {
      flag: true
    }
  })
</script>
```

需要注意的是 v-if 在切换时会 **复用已存在的元素** ，如果不想 Vue 复用，则需要在 HTML 标签上指定 key 属性。

### 2.7 列表渲染

#### （1）基本使用

想要循环出数组和对象里的所有数据，可以使用 `v-for` 。`v-for` 与数据绑定后，就自动传给你一些参数，你可以自定义选择接收。

+ 语法：`v-for="( 。。。) in persons" :key="index"`

+ 数组：
  + 一个参数：`item` —— 数组中的元素。
  + 两个参数：`item, index` ——数组中的元素和当前元素的下标
+ 对象：
  + 一个参数：`value ` ——对象里的每一个属性的 **属性值**。
  + 两个参数：`value, name` —— **属性名，属性值**。
  + 三个参数：`value, name, index` —— **属性值，属性名，下标** 。
+ 需要为 v-for 的每一个元素绑定一个独一无二的 key 值，用于给 Vue 识别，数组一般绑定为 index，对象一般绑定为 name 或者 index。

#### （2）问题

**一些问题**：Vue 对数组的监视较不敏感，所以容易造成下面的问题。数组的数据更新了，页面的却没有更新。

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/%E5%88%97%E8%A1%A8%E6%B8%B2%E6%9F%93%E4%B8%80%E4%BA%9B%E9%97%AE%E9%A2%98.png" style="zoom:50%;" />



代码如下：

```html
<body>
  <!-- 页面 -->
  <div id='app'>
    <ul>
      <li v-for="(item, index) in persons" :key="index">
        {{index}}. 姓名为{{item.name}}，年龄为{{item.age}}
        <button @click='updatePerson(index, { name: "泉此方" })'>更新</button>
      </li>
    </ul>
  </div>
</body>
<script>
  var vm = new Vue({
    el: '#app',
    data: {
      persons:[
        { name:'张三', age:20 },
        { name:'李四', age:18 },
        { name:'王五', age:22 },
        { name:'周六', age:17 },
      ]
    },
    methods: {
      updatePerson(index, obj){
        // 直接操作data中的数组
        this.persons[index] = obj
      }
    },
  })
</script>
```

所以 Vue 对一些方法进行了重写，如果使用这些方法来更新数组数据就会 **自动更新页面**。

这些方法是：

- `push()` ：添加数据到 **数组末尾**
- `pop()` ：删除 **数组末尾** 的数据
- `shift()` ：删除 **数组开头** 的数据
- `unshift()` ：添加数据到 **数组开头**
- `splice()` ：用于 **添加或删除** 数组中的元素
- `sort()` ：对数组进行 **排序**
- `reverse()` ：将数组 **反转**

所有将上面的代码的第 26 行改写成：`this.persons.splice(index, 1, obj)`

#### （3）列表的搜索和过滤

现在我们需要对 Vue 实例的数组数据进行排序和搜索，具体演示如下动图：主要功能就是可以根据输入框的内容进行搜索，并同时可以进行升序、降序和恢复原来的顺序。

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/%E5%88%97%E8%A1%A8%E6%90%9C%E7%B4%A2%E5%92%8C%E8%BF%87%E6%BB%A4.gif" style="zoom:60%;" />

首先页面布局和基本数据，因为我们需要获取文本框的值，所以需要使用 v-model 来双向绑定，将数据传入到 Vue 实例中。

```html {2,16}
<div id='app'>
    搜索姓名：<input type="text" v-model="searchString">
    <ul>
        <li v-for="(item, index) in people" :key="index">
            {{index}}. 姓名为{{item.name}}，年龄为{{item.age}}
        </li>
    </ul>
    <button>升序</button>
    <button>降序</button>
    <button>原来顺序</button>
</div>
<script>
    var vm = new Vue({
        el: '#app',
        data: {
            searchString: '',
            people:[
                { name:'Tom', age:20 },
                { name:'John', age:18 },
                { name:'Bob', age:22 },
                { name:'Timmy', age:17 },
            ],
        },
    })
</script>
```

然后我们需要对数组进去过滤，我们需要考虑几个方面：

+ 一般我们不会对原来的数据进行改变，所以 **渲染页面的数据一定是新的数组**。
+ 而这个新的数组是根据计算得出的，所以 **可以使用计算属性** 。
+ 我们可以使用 `filter()` 方法来过滤，回调函数传入数组里每一个元素，返回值布尔值，来 **判断当前元素是否符合条件** ，当前的条件是 **输入的值是数组中名字的子串** 。
+ 判断一个字符串是否是另一个字符串的子串，可以使用 `indexOf()` 方法，返回 -1 代表不是。

```js
// 将页面改为下面代码
// <li v-for="(item, index) in resultPeople" :key="index">

computed: {
    resultPeople(){
        // 进行过滤
        let filterResult = this.people.filter((element)=> {
            // 过滤的条件
            return element.name.indexOf(this.searchString) != -1
        })

        return filterResult
    }
},
```

然后再为三个按钮绑定事件监听。有两个想法：

1. 定义三个方法，**为每一个按钮绑定一个事件**。写法简单，但较冗余。
2. 定义一个方法，每一个按钮传入不同的数值，来判断其功能。写法较复杂，但简洁。

我们采用第二个方法。首先为绑定三个按钮单击事件。1 代表升序，-1 代表降序，0 代表原来顺序。

```html
<button @click='changeOrder(1)'>升序</button>
<button @click='changeOrder(-1)'>降序</button>
<button @click='changeOrder(0)'>原来顺序</button>
```

这里又遇到一个问题，如何使用方法来 **改变计算属性的值** ，因为我们列表是使用计算属性来渲染出来的。

而 **改变计算属性的值** 需要让其 **监视某个值**，一旦这个值发生改变，计算属性就会重新执行。正好我们传入的【1，-1，0】可以充当这个值。

所以在 data 加入变量 orderType，并在方法改变其值，如下第 11 行和第 15 行。

```js {11,15}
var vm = new Vue({
    el: '#app',
    data: {
        searchString: '',
        people:[
            { name:'Tom', age:20 },
            { name:'John', age:18 },
            { name:'Bob', age:22 },
            { name:'Timmy', age:17 },
        ],
        orderType: 0
    },
    methods: {
        changeOrder(flag){
            this.orderType = flag
        }
    },
})
```

最后在计算属性使用 orderType 变量。

+ `sort()` 方法：利用返回值来自定义排序规则。
  + 升序，排序完后第 1 个参数比第 2 个参数小，所以参数 person1 < 参数 person2，即 person1 - person2 为负数，所以需要

```js
computed: {
    resultPeople(){
        let filterResult = this.people.filter((element)=> {
            return element.name.indexOf(this.searchString) != -1
        })
		
        // 只有不是点击“原来顺序”都需要进行排序
        if(this.orderType != 0){
            filterResult.sort((person1, person2)=>{
                return (person1.age - person2.age) * this.orderType
            })
        }

        return filterResult
    }
},
```

### 2.8 事件处理

#### （1）事件监听

绑定事件监听语法：`v-on:事件名 = "方法名"` 也可以简写成 `@事件名 = "方法名"`。如果我们想获取到 event 事件对象，需要在方法参数里面添加 `$event` 。

（在看视频学习时发现一个事情，为绑定监听事件的回调函数时，Vue 也会从 data 里寻找方法，而不只只是从 methods 中寻找，例如下面示例）

+ 在指定事件的回调函数中，**如果没有参数则可以不写小括号 ” () “**。其会 **默认传入一个 event 对象**，就像原生 Javascript 一样。
+ 如果有自己的参数，想要获取就需要指定参数 `$event` ，如第 4 行所示。
+ 而且我将方法写到了 data 里，如第 9 行，仍然可以正确执行。

```html {4,9,11,14,17}
<div id='app'>
  <button @click='test1'>test1</button>
  <button @click='test2("message")'>test2</button>
  <button @click='test3("message", $event)'>test3</button>
</div>
<script>
  var vm = new Vue({
    el: '#app',
    data: {
      test1(event){
        console.log(event); // event对象
      },
      test2(message){
        console.log(message); // 自定义参数
      },
      test3(message, event){
        console.log(message, event);  // 自定义参数和event对象
      }
    },
  })
</script>
```

#### （2）事件修饰符

Vue 的设计中提及到：方法只有纯粹的 **数据逻辑或者说业务处理**，而不是去处理 DOM 事件细节。DOM 事件细节其中最常用的是 **停止冒泡** 或者 **阻止默认行为**。

+ 在事件的后面加上修饰符，例如，`@click.stop = '方法名'` 。

+ `.stop` ：停止冒泡
+ `.prevent` ：阻止默认行为
+ `.capture` ：事件按照捕获阶段传播

#### （3）按键修饰符

这类修饰符主要用于键盘事件上，例如 keyup、keydown 之类的

+ `.按键码` —— 例如 `.13` 【按下按键 a】：当前按键码已被弃用，不建议使用
+ `.按键名` —— 例如 `.enter` 【按下按键 Enter】：**Vue 所提供的按键名**
  + `.enter` ：Enter 回车
  + `.tab` ：Tab 缩进
  + `.delete` (捕获“删除”和“退格”键)
  + `.esc` ：Esc 退出
  + `.space` ：Space 空格
  + `.up` ：↑ 方向键上
  + `.down` ：↓ 方向键下
  + `.left` ：← 方向键左
  + `.right` ：→ 方向键右

### 2.9 自动收集表单

表单的收集一直是个头疼的问题，需要无论是原生还是 jQuery 都需要一个个获取表单项的数据。

Vue 则提供了 v-model，v-model 会将表单项的数据绑定到 Vue 实例的数据，就可以轻松获取到表单数据。

表单项的种类大致有：

+ 文本类型：`text ` 单行文本框 、`textarea ` 多行文本框
+ 选择类型：`radio` 单选按钮 、 `checkbox` 多选按钮 、`select > option`  下拉选择框
  + 单选绑定同一个 **字符串**。
  + 多选按钮绑定同一个 **数组**。
  + 下拉选择框如果单选绑定同一个字符串，多选绑定同一个数据。

下面是实例的页面布局：

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/%E8%A1%A8%E5%8D%95%E8%87%AA%E5%8A%A8%E6%94%B6%E9%9B%86%E9%A1%B5%E9%9D%A2.png" style="zoom:60%;" />

然后就对数据进行双向绑定：

```js
data: {
  // 用户名和密码的绑定
  userName: '',
  password: '',
      
  // 性别的绑定，这里指定了默认值“男”    
  gender: '男',
      
  // 爱好的绑定，多选框使用数组接收 
  hobby: [],
      
  // 城市v-for遍历    
  citys:[
    { id: 1, name: '深圳' },
    { id: 2, name: '广州' },
    { id: 3, name: '湖南' },
  ],
  
  // 选择的城市，传进来的是option的value值，这里是城市的id
  selectCity: '',
  // 介绍信息的绑定
  introduceMessage: ''
},
```

### 2.10 Vue 生命周期

Vue 的生命周期大致分为三个阶段：

+ 初始化显示
  + `beforeCreate` 
  + `created` 
  + `beforeMount` ：挂载之前。在这个阶段之前会将含有 Vue 特色的 数据解析成普通可显示的数据，然后存到内存中。
  + `Mounted` ：挂载完成。在这个阶段之前会将 `beforeMount` 存到内存中的数据一次性替换到页面上。**在此阶段一般会发送 AJax 请求，启动定时器等异步任务。**
+ 显示更新
  + `beforeUpdate` ：更新页面数据之前
  + 【Virtual DOM re-render and patch】：虚拟 DOM 更新并局部更新。【2022年1月5日 渣翻】
  + `updated` ：更新页面数据之后
+ 摧毁实例
  + `beforeDestroy` ：VM 实例摧毁之前，**主要用于做收尾工作，例如清除定时器**。
  + `destroyed` ：VM 实例摧毁之后

![](https://raw.githubusercontent.com/hahg2000/picture/vue/Vue%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.png)

### 2.11 过渡和动画

Vue 对过渡和动画的支持也很友好，也会对一些 CSS 库进行支持。

也可以做出一些比较高级的过渡效果，例如下面搜索框内容的效果。其他的过渡灵感可以参考 [官网](https://cn.vuejs.org/v2/guide/transitions.html)

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/Vue%E8%BF%87%E6%B8%A1%E5%92%8C%E5%8A%A8%E7%94%BB.gif" style="zoom:50%;" />

我们要使用过渡需要遵循 Vue 的规则：

1. 在需要动画效果的 **最外面** 添加一层 `<transition>` 标签，并添加 `name` 属性。
2. 里面的标签要有 **条件渲染**（使用 vvvvvvvvvvif）、**条件展示** （使用 v-show）、**动态组件** 和 **组件根节点** 之中其一。
3. 定义过渡进行时的效果和离开到达的状态，下面使用一张图来展示这六个阶段。
   1. 出现之前
   2. 出现过程
   3. 出现之后
   4. 消失之前
   5. 消失过程
   6. 消失之后

![](https://raw.githubusercontent.com/hahg2000/picture/vue/%E8%BF%87%E6%B8%A1%E7%9A%84%E9%98%B6%E6%AE%B5.png)

我们先做简单的文字淡入淡出。淡入的结果和淡出的开始就是原来的文字透明度所以 **可以不指定**。所以我们只需要指定淡入淡出过程、淡入开始和淡出的结束。

页面布局如下：

```html
<div id='app'>
  <!-- 添加transition标签并命名为xxx -->
  <transition name='xxx'>
    
    <!-- 添加条件展示 -->
    <div v-show="isShow">
      测试文字
    </div>
  </transition>

  <!-- 切换isShow -->
  <button @click='changeShow'>切换</button>
</div>
```

css 样式如下：

```css
/* 淡入过程 */
.xxx-enter-active,
/* 淡出过程 */
.xxx-leave-active {
  transition: opacity 1s;
}

/* 淡入的开始 */
.xxx-enter,
/* 淡出的结束 */
.xxx-leave-to{
  opacity: 0;
}
```

### 2.11 过滤器

Vue 提供了过滤器来对 **一些文本进行格式化**，类似管道过滤器模式。常见需要格式化的字符串有日期和在 Javascript 中我们可以导入一些第三方库来帮助我们来格式化字符串。

+ 早期最常用的是 MomentJS，但这个库已经在版本末期，不再有大的更新（类似于 jQuery）。

+ 现在常用的是 DayJS，下面就以 DayJS 来演示。[国内镜像官网](https://dayjs.gitee.io/zh-CN/)

过滤器使用方法：

+ 定义过滤器：使用 `Vue.filter( '过滤器名', ( value ) => {} )`
  + 回调函数的参数 `value` ，是将要过滤的字符串。
  + 需要返回过滤完后的字符串。
+ 使用过滤器：在两个大括号里的变量名的后面添加  `| 过滤器名`。
  + 其实就像调用方法一样。

下面就是日期过滤器的例子，这里想让外部来指定日期格式，所以多接收一个参数 `formatString`

```js
// 定义过滤器
Vue.filter('dateFormat', (value, formatString)=>{
  return dayjs(value).format(formatString)
})
```

然后在页面中使用过滤器。格式中字符的含义可以参考 [文档](https://dayjs.gitee.io/docs/zh-CN/display/format)

```html
<div id='app'>
  <p>初始数据为：{{date}}</p>
  <p>DayJS默认格式为：{{ date | dateFormat}}</p>
  <p>常用格式为：{{ date | dateFormat('YYYY年MM月DD日 HH:mm:ss')}}</p>
</div>
```

最终结果如下：

<img src="https://raw.githubusercontent.com/hahg2000/picture/vue/%E8%BF%87%E6%BB%A4%E5%99%A8%E7%BB%93%E6%9E%9C.png" style="zoom:60%;" />

### 2.12 指令

指令有两种：一个是 Vue 自带的指令；一个是自定义指令。

#### （1）自带指令

+ Vue 自带的指令：
  + 单向绑定 **文本数据**：`v-text` 、 `v-html`
  + 页面的 **显示** 和 **隐藏**：`v-if` 、`v-show`
  + 数据的 **遍历显示**：`v-for`
  + 绑定标签 **属性**：`v-bind`
  + 绑定标签 **事件**：`v-on`
  + 表单 **双向** 绑定：`v-model`
  + 获取到指定的标签：`ref`  。这个指令违背了 Vue 中的数据驱动的特性，因为我们可以不通过 data 来操作页面数据，也就是说 **Model 直接在 View 中获取到数据**，所以 **Vue 不是完全符合 MVVM 模式**，而是以 MVVM 模式作为灵感（官网中有提及，这就是为什么官网中没有了 2.2 节中的图片）
  +  防止原始内容在编译的时候出现： `v-clock` 。

**在 Vue 将内容挂载到页面上前，会显示原始内容**，例如双大括号之类的，我们需要防止这个情况发生。我们需要使用 `v-clock` 。

这个指令使用到了 Vue 指令的一些特性：**编译完成后指令消失**，就像 `v-text` ，将字符串放入标签后就看不到他了。

所以我们需要使用 **属性选择器** 来指定 **拥有这个指令的标签** 的样式为 `display: none` ，然后当指令消失时，样式也自动解绑。

```html
<style>
  [v-cloak] {
    display: none;
  }
</style>

<div id='app'>
  <p v-cloak>{{msg}}</p>
</div>
```

#### （2）自定义指令

我们可以自定义指令来帮助我们简化重复操作，就像方法一样。

自定义指令我们可以定义在 **全局** 和 **局部** 自定义指令，我们还可以指定指令的触发时机，一共有五个时机，`bind` 、`inserted` 、`update` 、`componentUpdated` 、`unbind`。

+ 全局指令：任意一个 Vue 实例都可以使用。
  + 使用方法：第一个参数为指令名称，第二个参数为对象，对象里的每一个属性都是钩子函数。
  + 每一个钩子函数都会传入四个参数：
    + `el` ：指令所绑定的标签元素，可以用来直接操作 DOM。
    + `binding` ：一个包含了许多信息的对象。
    + `vnode`：Vue 编译生成的虚拟节点。（暂时用不到）
    + `oldVnode`：上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。（这个暂时也用不到。）

```js
Vue.directive( '指令名称', {
  // 当被绑定的元素插入到 DOM 中时
  inserted: function ( el, binding ) {
    // 。。。,
  },
  update: function ( el, binding ) {
		// 。。。
  }
})
```

+ 局部指令：只有指定了 `directive` 选项的 Vue 实例可以使用。
  + 使用方法：在 Vue 的构造函数的对象里添加 `directive` 选项，**选项值是一个对象**，其中里面的 **属性名为指令名称**，属性值与上面方法的第二参数的值一致。

```js
var vm = new Vue({
  el: '#app',
  data: {
  },
  directives: {
    // 指令定义
    指令名称: {
      // 指令的钩子函数定义
      inserted: function ( el, binding ) {
        // 。。。,
      },
      update: function ( el, binding ) {
        // 。。。
      }
    }
}})
```

## 三、开发起步

我们开发项目后期需要按照各种插件以及使用模板，所以需要构建出项目的结构和创建配置。如果我们手动来配置非常麻烦，所以我们可以使用 `@vue/cli` 模块来帮助我们。

1. 首先安装模块。

> 记录遇到的问题：如果之前安装过 @vue/cli ，然后无法更新并且卸载 @vue/cli，首先在 node 安装路径下删除有名字为 vue 的三个文件【vue.ps1、vue、vue.cmd】，然后再进入当前文件夹里的【node_modules】，删除 @vue 下的 cli。
>
> ——2022年1月7日记录

```shell
npm install -g @vue/cli
# OR
yarn global add @vue/cli
```

2. 然后使用 `npm create 项目名` 命令创建目录。然后根据提示自定义项目。

3. 最后就可以写项目，使用一些命令来运行和打包项目以及运行代码检查。

~~~markdown
# hello-world

## 项目安装 Project setup 
```
npm install
```

### 编译并在开发环境开启热更新 Compiles and hot-reloads for development
```
npm run serve
```

### 编译并将文件最小化，用于生产环境 Compiles and minifies for production
```
npm run build
```

### 检查文件的格式 Lints and fixes files
```
npm run lint
```

### 自定义设置 Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
~~~

