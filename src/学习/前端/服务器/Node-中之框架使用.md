# Node-中之框架使用

## 一、Express

原生的 http 在某些方面表现不足以应对我们的开发需求，所以我们就需要使用框架来加快我们的开发效率。

在 Node 中，有很多的 Web 开发框架，这里学习 express 为主。

### 1.1 安装使用

1. 创建一个新文件夹
2. 在文件夹目录的命令行中，创建 package.json 文件。
3. 然后执行 `npm install express --save` 命令。

### 1.2 入门

1. 先创建一个 app.js ，作为当前项目的主入口。我们需要在该文件里开启服务器。
2. 导入 express 模块。
   `var express = require('express')`
3. 创建服务器应用程序。这里变量名从原来的 server 改为了 app。
   现在为 `var app = express()`
   原来为 `var server = http.createServer()`
4. 开启监听端口操作。
   `app.listen(3000, ()=>{ console.log('app is running...')})`
5. 判断请求。直接使用 `app.get( '请求名', function(){} )` 即可，不需要自己使用 if 判断。

```js
app.get('/', function (request, response) {
  response.send('这里是主页！')
})

app.get('/test', function (request, response) {
  response.send('这里是测试页面！')
})
```

### 1.3 公开指定目录

公开指定目录调用一个 API 即可。

+ `app.use( '请求路径', express.static('需要开放的目录') )`
+ 例如：`app.use('/public/', express.static('./public/'))`，访问时输入的网址：`http://127.0.0.1:3000/public/a.js`
+ 如果不想每次访问 public 文件夹时都加上 “ /public ”，则可以直接省略第一个参数： `app.use( express.static('需要开放的目录') )`。
+ 例如：`app.use(express.static('./public/'))`，每次只需要访问 `http://127.0.0.1:3000/a.js` 即可。
+ 这里使用 `path.join()` 方法来填写需要开放的目录，这里先不详写，详情请看 **5.2 节**。

### 1.4 文件操作路径问题

对于填写文件路径的时候会下面几种方式：

+ 如果文件在同级目录上直接写文件名字： `<img src="纱路.jpg" alt="">`。
+ 这行是上面的完整写法，**建议使用**，“ ./ “ 代表当前目录： `<img src="./纱路.jpg" alt="">`
+ 如果文件在当前目录的磁盘根目录上，以 " / " 开头（很少使用）：`<img src="/纱路.jpg" alt="">`
  + 如果当前文件运行在服务器上，则就代表请求网络路径的图片。

+ 如果文件在其他磁盘上，则以磁盘开头（很少使用）：`<img src="c:/纱路.jpg" alt="">`。

### 1.5 与art-template结合

我们需要将 art-template 与 express 结合一起编程。[官方文档](http://aui.github.io/art-template/zh-cn/express/index.html)

#### （1）安装

使用 art-template 当然需要安装他，还需要将一个连接 express 的模块。

```powershell
npm install --save art-template 
npm install --save express-art-template
```

#### （2）配置

首先先配置使用 art-template。

`app.engine('html', require('express-art-template'))`

+ 第一个参数：默认渲染文件名的后缀名。可以为 art，但由于编辑器对于 art 后缀名的文件支持不够（2021年11月7日 vscode不支持），所以首选 html。
+ 第二个参数：加载 express-art-template。该模块可以自动将 art-template 整合到 express，所以我们不需要再单独导入 art-template。

#### （3）使用

 + express 为 Respone 相应对象提供了一个方法 `render()`。
 + 使用该方法需要配置模板引擎，配置完才可以使用。
 + 语法结构：`response.render('html文件名', {模板数据})`
     - 第一个参数：因为 express 会自动到 views 文件夹里查找视图文件，所以直接写需要渲染的文件名即可。
     - 第二个参数：需要渲染到网页里的数据。
     - 如果想改变默认的 views 位置，使用该行代码 `app.set('views', '自定义路径')`。

### 1.6 改写留言板案例

使用 express 来改写之前的留言板案例。

#### （1）改写跳转展示页面

直接使用 `get()` 方法来处理 “ / ”请求，使用 `render()` 方法来读取文件并渲染页面，不需要再用读写文件操作。

::: warning
`render()` 方法执行完后会自动结束发送响应
:::

```javascript
var msg_data = [
{ name: '李四', message: '今天天气真好' },
{ name: '王五', message: '今天天气真好' },
{ name: '张三', message: '今天天气真好' },
]

app.get('/', function (request, response) {
    
  response.render('展示留言.html', {
  'msg_data' : msg_data
  })
})
```

#### （2）改写跳转留言页面

根据跳转留言页面请求来返回页面。

```javascript
app.get('/toLeaveMsg', function (request, response) {
  response.render('留言板.html')
})
```

#### （3）改写接受留言数据

express 提供了一个属性来获取 get 请求里面的数据。

+ 调用 `request.query` 

express 还提供了一个方法来跳转页面。不需要我们再自己设置状态码和头信息。

+ 调用 `response.redirect('跳转路径')` 

```javascript
app.get('/LeaveMsg', function (request, response) {

    // 之前的写法
    // var url = request.url
    // var urlObj = new URL(url, request.headers.referer).searchParams
    // var tempObj = {}
    // urlObj.forEach(function(value, key){
    // tempObj[key] = value
    // })

    // 现在的写法
    msg_data.push(request.query)

    // 之前的写法
    // response.statusCode = 302
    // response.setHeader('Location', '/')
    
    // 现在的写法
    // 跳转到 " / "
    response.redirect('/')
})
```

#### 1.7 接收post请求

+ 在 express v4.16 之前需要手动安装 `body-parser` 模块。
+ 安装： `npm install --save body-parser`

安装后需要进行两条语句的配置

```javascript
// 导入模块
var bodyParser = require('body-parser')

var express = require('express')

var app = express()

// 第一句配置：parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// 第二句配置：parse application/json
app.use(bodyParser.json())
```

+ 而在 v4.16 之后，express 自己实现了 body-parser 的功能，**所以不再需要额外安装 body-parser 了**。

直接将上面两条语句的变量改为 express 即可。

```javascript
// 第一句配置：parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// 第二句配置：parse application/json
app.use(express.json())
```

+ 配置成功后，直接调用 `request.body` 就可以获取到 post 请求的数据。

### 1.8 读取文件里的数据

现在我们将数据持久化到文件里。文件里的数据以 JSON 格式存放。

#### （1）新建json文件

新建一个 json 格式的文件，然后在里面存放数据。json 文件的需要注意几点

+ 变量名需要使用双引号
+ 变量值如果是字符串，需要使用双引号，不能单引号。
+ 最后一个元素的最后面不能多加一个逗号。

#### （2）解析文件数据

我们需要将文件里面的内容读取出来，一般都是 `data.toString()` 将读取出来的二进制数据转换为字符串。

+ 我们可以使用 `fs.readFile()` 方法的另一种重载。
+ `fs.readFile( '文件位置', '编码类型', (err, data)=>{} )`
+ 只要指定了编码格式，回调函数的 data 就会自动使用编码类型转为字符串。

因为读取出来的是字符串，想到转为数组或者对象，调用 `JSON.parse(data)` 即可。

## 二、CURD起步

现在我们使用 express 做一个学生信息增删改查的功能。

### 2.1 起步

首先进行路由设计。

| 功能      | 请求               | 请求类型 | 请求参数                     |
|---------|------------------|------|--------------------------|
| 跳转主页    | /students        | GET  | 无                        |
| 跳转到添加页面 | /students/new    | GET  | 无                        |
| 处理添加的数据 | /students/new    | POST | name,age,gender,hobby    |
| 跳转到修改页面 | /students/edit   | GET  | 无                        |
| 处理修改的数据 | /students/new    | POST | id,name,age,gender,hobby |
| 处理删除请求  | /students/delete | GET  | id                       |

### 2.2 提取路由模块

如果在主模块里面写一长串 `app.get('请求路径', (resquest, response)=>{})` 方法，则会不好管理。所以这里将一长串相似的代码共同封装成一个模块。

#### （1）原始写法

下面代码是单独一个文件的，里面涉及到的两个变量都需要声明。

+ fs 变量：导入文件模块即可。
+ app 变量：app 变量是 express 创建出来的一个服务器变量，如果新声明的话，就不是原来的那个服务器变量。这时就需要主模块传一个 app 变量。

```javascript
// router.js
app.get('/', function (request, response) {

    fs.readFile('./db.json', 'utf-8' , function(err, data){
        if(err){
            return   response.status(500).send('Server error')
        }
        response.render('展示留言.html', {
            'students_info' : JSON.parse(data)
        })
    })
})
```

+ 如果需要要将 app 变量导入，则需要将整个路由文件包装成一个模块，导出到主模块中。
+ 主模块再将 app 变量传入路由模块中。

```javascript
// router.js
// 将路由代码包装成一个模块导出
module.exports = function(app){
    app.get('/', function (request, response) {
        fs.readFile('./db.json', 'utf-8' , function(err, data){
            if(err){
                return response.status(500).send('Server error')
            }
            response.render('展示留言.html', {
                'students_info' : JSON.parse(data)
            })
        })
    })
}

// app.js
// 引入
var router = require('./router')

// 使用其方法，并将app变量传入
router(app)
```

#### （2）框架写法

express 自带了路由模块，我们可以直接使用。

+ 首先使用 `var router = express.Router()` 创建一个路由容器。
+ 然后使用 `router.get('请求路径', (request, response) => {}` 把路由挂载在路由容器里。
+ 最后使用 `module.exports = router` 导出路由容器。

完整的代码如下：

```javascript
var express = require('express')

var router = express.Router()

router.get('/', function (request, response) {
    fs.readFile('./db.json', 'utf-8', function (err, data) {
        if (err) {
            return response.status(500).send('Server error')
        }

        response.render('展示学生信息.html', {
            students_info: JSON.parse(data),
        })
    })
})

module.exports = router
```

而在主模块中则导入路由容器后，挂载在 app 服务器上。

```javascript
// 导入路由容器
var router = require('./router')

// 将路由容器挂载在 app 服务器
app.use(router)
```

::: warning
`app.use(router)` 建议写在最后面，不然可能会一些原因报错。具体的后面会介绍。
:::

### 2.3 封装操作数据模块

接下来将数据封装成文件，专门处理数据，不关心业务，与三层架构中 dao 层的功能一致。

#### （1）查询所有学生信息

文件读取出来的是字符串，所以需要将其转换为对象。

但其中有异步和同步问题。

+ 读文件一般为异步操作，所以当还没读取完文件时，服务器就发送到客户端了。
+ 如果读文件改为同步操作时，**所有服务器里的操作都需要等待文件读取完成**，性能不太高。
+ 所以数据模块会开放一个形参，用于接收主模块的操作，然后将这个形参用在读取完文件之后的回调函数里。

```javascript
// callback 用于与主模块通信
exports.findAllStudents = function(callback){
    fs.readFile(dbPath, 'utf-8', function(err, data){
        
        if(err){
            // 错误了，也将错误信息返回到主模块中
            // 也可以写成这种 callback(err, undefined)
            callback(err)
        }
        
        // 成功了，将数据返回到主模块中
        callback(null, JSON.parse(data))
    })
}
```

上面的两个参数——err 和 data 都是模仿原始读文件方法所传进来的参数。

+ 成功：err 为 null，data 为二进制数据。
+ 失败：err 为 错误对象，data 为 undefined。

#### （2）插入学生信息

插入学生信息需要三步：

1. 获取原始数据
2. **插入原始数据**
3. 将改变过后的结果写入源文件中

重点是第二个，需要插入数据，其步骤如下：

1. 因为读文件出来的是字符串，所以将字符串转换为数组或者对象。
2. 将读取出来的数据，进行添加。
3. 然后再写入文件里，写之前也需要将数据转换为字符串。

```javascript
// 增加学生信息
exports.saveInfo = function(student, callback){
    fs.readFile(dbPath, 'utf-8', function (err, data) {
        if (err) {
            // 错误了，也将错误信息返回到主模块中
            // 也可以写成这种 callback(err, undefined)
            callback(err)
        }

        // 将字符串转换为数组或者对象
        var tempData = JSON.parse(data)

        // 现在id使用随机数
        // 其实应该取已经到达过id之后
        student.id = (Math.random()*10).toFixed(0)

        // 添加信息到临时数据里
        tempData.push(student)

        // 然后再写入文件里
        fs.writeFile(dbPath, JSON.stringify(tempData), function(err, data){
            if(err){
                // 依旧将错误返回到主模块中
                callback(err)
            }
            callback()
        })
    })
}
```

#### （3）更新学生信息

更新学生信息需要四步：

1. 获取 post 请求数据；
2. 获取文件内学生的数据；
3. 更新学生的数据；
4. 再次写入文件中。

---

+ 因为页面的输入框为文本输入框，所以 post 请求所携带数据的 id 的类型为字符串，则需要先类型转换成整型。
+ 我们想让 Student 模块更纯粹，所以一些对数据的小操作先在模块外执行完毕，再传进模块里进行处理。

```javascript
  // 获取post表单提交
  var updateStu = request.body
  // 将id类型转换
  updateStu.id = parseInt(updateStu.id)
```

+ 对于源数据进行更新有两种方法：
  + `forEach( callbackfn:(value, index, array) => void )`：遍历整个数组，加判断来找出需要的数据。（仅限数据为数组类型）
  + `find( predicate:(value, index, array) => boolean )`：根据参数里函数返回的布尔值，来找到所需要的数据，这里返回的数据是浅拷贝。也就是说你修改返回的数据，源数据也会跟着更新。

```js
exports.updateStudent = function(newData, callback){
    fs.readFile(dbPath, 'utf8', function (err, data) {
        // 文件的源数据
        var tempData = JSON.parse(data)

        // 方法一
        // tempData.forEach(function(value, index) {
        //   if(value.id === newData.id){
        //     tempData[index] = newData
        //   }
        // })

        // 方法二
        var tempStu = tempData.find(function (item) {
            return item.id === newData.id
        })
        
        // 修改find()方法返回的数据
        for( var key in newData){
            tempStu[key] = newData[key]
        }
```

+ 直接将源数据再次写入文件即可。

```javascript
// 然后再写入文件里
fs.writeFile(dbPath, JSON.stringify(tempData), function (err, data) {
    if (err) {
        // 依旧将错误返回到主模块中
        callback(err)
    }
    callback()
})
```

#### （3）删除学生信息

删除学生信息有四步：

1. 先获取需要删除学生的 id；
2. 然后读取文件的数据；
3. 在读出来的数据里进行删除；
4. 最后在写入文件中。

---

+ 因为是 get 请求，获取学生 id直接使用 `request.query.id`。
+ 读文件和写文件与上面的一致。
+ 重点是删除数据
    - `findIndex( predicate:(value, index, array) => boolean )`：与 `find()` 用法一致，不过该方法执行的结果是返回元素的下标。
    - `splice( start, deleteCount )`：删除数组的元素。将上一个方法返回的下标，作为第一个参数，然后第二个参数为 1，代表只删除该下标的元素。
+ 疑惑：删除数据后是否刷新页面，如果刷新了页面，滚动条会重置，用户体验不好。如果不刷新的话，解决方案我觉得是前端和后端都需要执行删除数据的操作。待解决

```js
var deleteIndex = objData.findIndex(function(item){
    return item.id === stuId
})

objData.splice(deleteIndex, 1)
```

## 三、MongoDB

### 3.1 安装

下载打开后下一步下一步。

### 3.2 配置

我们首先感觉一下使用命令行来操作数据库。使用命令行操作数据库需要下面几步：

1. 配置环境变量
2. 在数据库安装位置的 **根磁盘** 上，新建一个文件夹【data】，进去【data】文件夹后再新建一个文件夹【db】。
3. 打开命令行，跳转到根磁盘，然后输入 `mongod` 开启服务器，**不要关闭当前命令行**。去【db】文件夹可以看见已经存放东西了。
4. 再打开一个命令行，输入 `mongo` ，将当前的命令行连接到数据库。如果成功了就会进入数据库的命令行模式。

### 3.3 基本命令

芒果数据库里面会涉及到一些用语：

+ `collection` —— 集合，对应 **普通数据库的表**。
+ `document` —— 文档，对应 **普通数据库的表中数据**

| 命令                      | 说明                   |
| ------------------------- | ---------------------- |
| `show dbs`                | 查询当前所有数据库     |
| `db`                      | 查看当前所在的数据库   |
| `use 数据库`              | 切换到其他数据库       |
| `show collections`        | 展示当前数据库的表     |
| `db.表名.insertOne(对象)` | 在指定的表插入数据     |
| ``db.表名.find()``        | 展示指定表中的所有数据 |

具体其他的命令可以参考 [官方文档](https://docs.mongodb.com/manual/crud/)

### 3.4 安装mongoose

mongoose 是将 MongoDB 进一步封装，更容易操作 MongoDB。

官方网站：[https://mongoosejs.com/](https://mongoosejs.com/)

在命令行输入 `npm install mongoose --save`

### 3.5 快速开始mongoose

最新版（v6.0.13）的 mongoose 文档使用了 ES6 语法，这里便于理解，先以 v4.x 的文档举例。

#### （1）v4.x

+ 第 2 行：引入模块并连接数据库，`test` 可以换成需要连接的数据库。**如果连接的数据库不存在，则会自动创建一个**，所以要小心创建了一个新的数据库。

+ 第 6 行：使用 mongoose 生成 Schema 模式，这里生成的 Schema 不是具体的模式，而是一个构造方法。
+ 第 9 ~ 20 行：使用 Schema 创造一个具体的博客模式，构造方法里面传入一个对象，**对象的属性名为列名，属性值为类型或者选项数组**。
+ 第 23 行：利用具体的模式创建 **数据库的模型**。
+ 然后就可以使用模型来任意操作数据库了。

```js
// 引入模块并连接数据库
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// 生成模式
var Schema = mongoose.Schema;

// 生成具体的一个模式
var blogSchema = new Schema({
  title:  String,
  author: String,
  body:   String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  }
});

// 利用具体的模式创建数据库的模型
var Blog = mongoose.model('Blog', blogSchema);
```

#### （2）v6.0.13

+ 第 2 行：引入模块并用 `const` 接收。
+ 第 4 ~ 9 行：使用了异步连接数据库
+ 第 12 行：使用对象解构来获取模式。

```js
// 引入模块
const mongoose = require('mongoose');

// 连接数据库
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/test');
}

// 获取模式
const { Schema } = mongoose;
```

+ 第 2 ~ 12 行：与 v4.x 的一致，使用 Schema 创造一个具体的博客模式。
+ 第 16 行：与 v4.x 的一致，利用具体的模式创建 **数据库的模型**。使用 `const` 来接收。

```javascript
// 生成具体的一个模式
const blogSchema = new Schema({
    title:  String, // String is shorthand for {type: String}
    author: String,
    body:   String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        votes: Number,
        favs:  Number
    }
});

// 利用具体的模式创建数据库的模型
const Blog = mongoose.model('Blog', blogSchema);
```

#### （3）示例

新建一个 js 文件进行测试。我们在一个数据库中新建学生表。

1. 依然是老三样，引入模块、连接数据库和获取模式。

```js
// 引入模块
const mongoose = require('mongoose');

// 连接数据库
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/test');
}

// 获取模式
const { Schema } = mongoose;
```

2. 设计表结构，其中我将性别的类型设成了整型，并且值只能 0 或 1。年龄设置了 3 ~ 60 岁的范围。详情可以查看 [官方文档](https://mongoosejs.com/docs/schematypes.html#schematype-options)，不同类型可以有不同的限制。

```js
const studentsSchema = new Schema({
    studentId: String, // String is shorthand for {type: String}
    studentName: String,
    studentGender: { type:Number, enum:[0, 1] },
    studentAge:{ type:Number, min:3, max: 60}
});
```

3. 然后使用具体的模式创建数据库的模型。如果想使用模型来创建一条数据，将模型作为一个构造函数，里面传入一个数据对象，如第 5 ~  10 行所示。

```js
// 利用具体的模式创建数据库的模型
const Students = mongoose.model('Students', studentsSchema);

// 使用模型框架新建一个学生记录
const student = new Students({
  studentId: "201815270",
  studentName: "张三",
  studentGender: 1,
  studentAge: 21
})
```

4. 创建了一条数据，然后我们需要将其保存到数据库里，我们需要使用数据的 `save()` 方法。

```js
student.save(function(err, result){
    if(err){
        console.log(err);
    }
	// 保存到数据库后的反馈信息
    console.log(result);
})
```

5. 存储结果如下：

![](https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/mongoDB%E7%A4%BA%E4%BE%8B%E5%AD%98%E5%82%A8%E7%BB%93%E6%9E%9C.png)

### 3.6 查询语句

查询语句与一般的数据库差不多一致。

#### （1）查询所有

使用 `find( function(err, result){} )` 方法。

```js
Students.find(function(err, result){
    if(err){
        throw err
    }
    console.log(result);
})
```

结果如下：

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/mongoDB%E6%9F%A5%E8%AF%A2%E6%89%80%E6%9C%89.png" style="zoom:60%;" />

#### （2）根据指定数值查询

如果想查找 **某一列符合指定数值的所有行**，使用 `find( { 列名: 指定数值 }, function(){} )`

例如，可以查找所有性别为 1 的行。

```js
Students.find({studentGender: 1}, function(err, result){
    if(err){
        throw err
    }
    console.log(result);
})
```

如果只想查找一行，可以使用 `findOne( { 列名: 指定数值 }, function(){} )` 方法。

#### （3）根据条件查询

如果想查询 **特定条件的行**，例如年龄小于 18 岁等。需要在 **属性值** 里使用特定的对象形式，例如`Students.find( {studentAge: { $lt: 18 }}, function(err, result){} )`。

下面将列举部分运算符：具体的可以参看 [MongoDB官方文档](https://docs.mongodb.com/manual/reference/operator/query/)

1. 比较运算符

| 代码   | 描述                   |
| :----- | :--------------------- |
| `$eq`  | 查询符合某个值         |
| `$ne`  | 查询不符合某个值       |
| `$gt`  | 查询大于某个值         |
| `$gte` | 查询大于或者等于某个值 |
| `$in`  | 查询是否在指定数组里   |
| `$nin` | 查询是否不在指定数组里 |
| `$lt`  | 查询小于某个值         |
| `$lte` | 查询小于或者等于某个值 |

2. 逻辑运算符

| 代码   | 描述                                   | 备注               |
| :----- | :------------------------------------- | ------------------ |
| `$and` | 查询同时符合 **多个条件**              | 其属性值为数组类型 |
| `$not` | 查询同时不符合 **某个** 条件表达式     |                    |
| `$nor` | 查询 **多个条件** 同时不符合           | 其属性值为数组类型 |
| `$or`  | 查询在 **多个条件** 中符合其中一个条件 | 其属性值为数组类型 |

例如，我需要查找年龄大于 18 但小于 22 的行。

```js
Students.find(
    {
        // 使用方法
        $and: [{ studentAge: { $gt: 18 } }, { studentAge: { $lt: 22 } }],
    },
    function (err, result) {
        if (err) {
            throw err
        }
        console.log(result)
    }
)
```

#### （4）查询后执行操作

其为了方便，也提供了在查询后的操作，例如查询后删除、查询后更新等。

+ Model.findOneAndDelete()：查询后删除
  + conditions «Object»：条件
  + [options] «Object»：选项
  + [callback] «Function»：回调函数
+ Model.findOneAndRemove()
  + 参数与用法与上面的一致
  + 该命令基于 MongoDB 命令行专属命令 `findAndModify()` 。

+ Model.findOneAndReplace()：查询后 **替换**
  + filter «Object» ：查询条件
  + [replacement] «Object» ：替换成的数据
  + [options] «Object» ：选项
  + [callback] «Function»：回调函数

+ Model.findOneAndUpdate()：查询后 **更新**
  + [conditions] «Object»：查询条件
  + [update] «Object»：更新的数据。mongoose 会 **自动封装** 成 `$set: { 属性名: 属性值 }`
  + [options] «Object» ：选项
  + [callback] «Function»：回调函数
  + 注意：建议直接使用 `$set` ，即使防止选项中有 `{ overwrite: true }` ，而导致原数据被覆盖。
  + 例如，将某个行的姓名改为【jason】： `Model.findOneAndUpdate(query, { $set: { name: 'jason' }}, options, callback)`

### 3.7 改造学生信息

我们现在使用 MongoDB 来改造之前的学生信息的案例。

#### （1）设计Student模块

Student 模块中不用再自己导出方法，直接导出模型即可，因为模型里就有我们需要用的方法。

```js
let mongoose = require('mongoose')

// 连接数据库
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/test');
}

// 获取模式
const { Schema } = mongoose;

// 使用模式创建具体的数据库模型
const studentsSchema = new Schema({
    id: String, // String is shorthand for {type: String}
    name: String,
    gender: { type:Number, enum:[0, 1], default: 0 },
    age:{ type:Number },
    hobby: String
});

// 导出数据库模型
module.exports = mongoose.model("Student_info", studentsSchema)
```

#### （2）修改查询

修改 `router.js` 的查询功能：直接改方法名即可。这就是封装的好处，里层的逻辑代码改变，外层的引用则不需要改变很多。

```js
router.get('/students', function (request, response) {
    // 修改的部分 findAllStudents => find
    Students.find(function (err, data) {
        if (err) {
            response.status(500).send('Server error...')
        }
        console.log(data);
        response.render('展示学生信息.html', {
            students_info: data,
        })
    })
})
```

#### （3）修改添加

添加部分修改较多：

+ 首先使用 `request.body` 来获取表单数据；
+ 然后再使用 `new Student( 具体数据 )` 来创建一条数据记录。
+ 最后使用 `数据记录.save( function(){} )` 来保存数据。

```js
router.post('/students/new', function (request, response) {
    request.body.id = parseInt((Math.random() * 10).toFixed(0))
    
	// 改变的部分
    new Students(request.body).save(function (err) {
        if (err) {
            response.status(500).send('Server error...')
        }
    })
    response.redirect('/students')
})
```

#### （4）修改更新

更新部分不需要太大改动：

+ 将 `request.body` 的 id 作为查找条件；
+ 将 `request.body` 本身作为更新对象。

```js
router.post('/students/edit', function (request, response) {
    // 获取post表单提交
    var updateStu = request.body
    
	// 改变的部分
    Students.findOneAndUpdate(
        { id: parseInt(updateStu.id) },
        { $set: updateStu },
        function (err, data) {
            if (err) {
                response.status(500).send('Server error...')
            }
        }
    )
    response.redirect('/students')
})
```

#### （5）修改删除

+ 将 post 请求传进来的 id 值作为查询条件

```js
router.get('/students/delete', function(request, response){
    var deleteId = parseInt(request.query.id)

    // 修改的部分
    Students.deleteStudentById(deleteId, function(err){
        if (err) {
            response.status(500).send('Server error...')
        }
        response.redirect('/students')
    })
})
```

## 四、Node连接Mysql

### 4.1 安装

如果想使用 Node 连接 Mysql，需要连接驱动。

`npm install mysql --save`

### 4.2 连接数据库

连接数据库有显式和隐式两种。

显式就需要直接写出来，如第 12 行 ~ 第 19 行：

```js
// 导入模块
var mysql      = require('mysql');

// 建立连接
var connection = mysql.createConnection({
    host     : 'example.org',
    user     : 'bob',
    password : 'secret'
});

// 开始连接
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
	
    console.log('connected as id ' + connection.threadId);
});
```

隐式连接 **直接执行查询语句**，就可以自动连接。

```js
connection.query('SELECT 1', function (error, results, fields) {
    if (error) throw error;
    // connected!
});
```

连接可以有一些选项，除了上面所提到的 `user` 登录用户，`password` 登录密码还有 `timezone` 时区、`connectTimeout` 连接超时时间等。。。详情可以查看 [Github文档](https://github.com/mysqljs/mysql#connection-options)

### 4.3 使用连接池

我们通常写项目时，通常会使用连接池，避免经常建立连接和断开连接。使用连接池也有显式使用和隐式使用。

```js
// 导入模块
var mysql = require('mysql');

// 建立连接池
var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'example.org',
    user            : 'bob',
    password        : 'secret',
    database        : 'my_db'
});
```

显式就直接调用 `pool.getConnection()` 方法，然后在其回调函数里使用获取到的连接。

```js
pool.getConnection(function(err, connection) {
    if (err) throw err; // 连接失败

    // 开始使用连接
    connection.query('SELECT something FROM sometable', function (error, results, fields) {
        
        // 当不做事时，释放连接
        connection.release();

        // 由于释放连接也可能发生错误，所以进行处理
        if (error) throw error;

        // 这里已经释放了连接，不能再使用连接
    });
});
```

隐式直接调用 `pool.query()` 方法，里面传入 Sql 语句，就自动使用连接来执行 Sql 语句。

```js
pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});
```

🔴 **【如果需要导出到其他模块使用，则需要使用到 ES6 以上的同步异步语法，待补充内容，或者就直接使用回调函数】** 

[参考资料](https://www.cnblogs.com/wuyoucao/p/7478871.html)

### 4.4 连接池事件

连接池添加了一些事件监听，可以在连接池 **触发了某个状态后** 执行操作。

+ 当在连接池拿到连接时；

```js
pool.on('acquire', function (connection) {
  console.log('Connection %d acquired', connection.threadId);
});
```

+ 当释放连接时：

```js
pool.on('release', function (connection) {
  console.log('Connection %d released', connection.threadId)
})
```

+ 当连接到连接池时：

```js
pool.on('connection', function (connection) {
  connection.query('SET SESSION auto_increment_increment=1')
});
```

### 4.5 释放连接

+ 如果想将连接归还回连接池，使用这条语句，`connection.release();`

+ 如果想结束所有的连接，并执行完循环队列，可以使用下面这条语句。

```js
pool.end(function (err) {
  // all connections in the pool have ended
});
```

+ 如果想立即结束连接，不执行循环队列里的内容，使用这条语句。`connection.destroy();`

### 4.5 查询语句

执行查询语句主要特点是可以像 MyBatis 使用占位符。

+ 使用占位符可以传递单个参数。

```js
connection.query('SELECT * FROM `books` WHERE `author` = ?', ['David'], function (error, results, fields) {
    // error ：如果查询过程出现错误
    // results ：查询结果
    // fields ：查询结果的所有参数
});
```

+ 使用转义字符传递多个参数。该模块自带了转义功能，你在方法中传的数据会自动与第一个参数自动拼接成 Sql 语句。

```js
var post  = {id: 1, title: 'Hello MySQL'};

// 第二个参数传入对象
var query = connection.query('INSERT INTO posts SET ?', post, function (error, results, fields) {
    if (error) throw error;
});

console.log(query.sql); 
// 自动将对象转换为Sql语句
// INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
```

🔵 具体的其他查询技巧，可以查看 [官方文档](https://github.com/mysqljs/mysql#escaping-query-values)

## 五、路径问题

### 5.1 遇到的问题

在以 Node 命令行运行 app.js 时，会遇到比较诡异的事情。

Javascript 文件中若使用相对路径来确定文件时，**相对的不是当前文件**，而是 **当前命令行的位置**。

但使用相对路径引入模块，相对的是当前文件。

（据说是使用 Node 开发命令行需要使用该特性）

例如 a.js 有如下代码：使用相对路径导入了一个 b 模块，然后在读取自己文件内容。

```js
const fs = require('fs')

// 将会输出 "This is b"
const b = require('./b')

fs.readFile('./a.js',function(err, data){
  if(err){
    console.log(err);
  }
  console.log(data.toString());
})
```

然后在命令行不加位置运行 a.js，会发现成功输出不报错。

```shell
# 不加位置运行 a.js
PS D:\node\test> node a.js
# 输出
This is b
const fs = require('fs')

// 将会输出 "This is b"
const b = require('./b')

fs.readFile('./a.js',function(err, data){
  if(err){
    console.log(err);
  }
  console.log(data);
})
```

如果加位置运行 a.js，模块导入成功，但文件读入不成功，报错原因是无法打开 `D:\node\a.js` ，很明显是读文件的时候以当前 Node 命令行作为基准位置。

```sh
# 不加位置运行 a.js
PS D:\node> node .\test\a.js
# 输出
执行了b.js
[Error: ENOENT: no such file or directory, open 'D:\node\a.js'] {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'open',
  path: 'D:\\历史学习\\杰2020-06笔记\\笔记\\html5\\node\\第一天\\a.js'
}
```

### 5.2 解决方案

Node 除了提供 `require` 和 `exports` 之外，还提供了两个有用的变量。

+  `__dirname` ：**动态获取** 到当前文件 **所属目录的绝对路径**
+ `__filename`：动态获取 到 **当前文件的绝对路径**。

上面的代码改写为：

```js
const fs = require('fs')

// 这里不用改
const b = require('./b')

// 引用path模块
const path = require('path')
// 使用__filename
fs.readFile(__filename,function(err, data){
  if(err){
    console.log(err);
  }
  console.log(data.toString());
})
```

然后开放指定目录的代码中，可以修改成

`app.use('/public/', express.static( path.join(__dirname + './public/')) )`

## 六、artTemplate模板继承

art-template 提供了模板继承和子模板。

+ 模板继承（Template inheritance）：简单说就是定义父模板，父模板里定义一个可以重写的内容，然后子模板选择可以重写或者直接使用父类的内容。就像 Java 里的方法重写【@Override】。
+ 子模板：简单来说就是定义一个模块，然后其他可以包含他。例如包含头部状态栏。

+ 两个都有相似之处，关键在于使用场景的不同。

### 6.1 子模板

子模板是用来被包含的，与父模块一起组成一个页面，有点像机器的零件。

例如下面有两段代码，用来表示头部和尾部。

```html
<!-- header.html -->
<p><h1>这是头部</h1></p>

<!-- footer.html -->
<p><h1>这是尾部</h1></p>
```

然后如果想使用这两段代码，在指定位置直接使用特定语法即可。

两个大括号，然后里面 `include '包含的文件名'`。

```html
<body>
  {{include './header.html'}}

  这是中间内容

  {{include './footer.html'}}
</body>
```

### 6.2 模板继承

模板继承注重于在父模板上挖坑，就像 Java 里的抽象类，挖的坑越多，子类自定义特性就越强。

例如下面的代码中，挖了两个坑，一个用于填写 style 标签，一个用于填写内容部分。如果子模板没有去填坑，可以指定默认值，就像 Java 里的普通方法继承。

```html
<body>
    {{ block 'style' }}
    {{ /block}}

    {{ block 'content' }}
    <p><h2>这是默认内容</h2></p>
	{{ /block}}
</body>
```

然后就开始看子模板的表演了。

+ 第 1 行【必写】：指定你继承的父模版。
+ 后面开始填坑，这里指定了 p 标签的字体颜色和主体内容。

```html
{{extend './index.html'}}
{{ block 'style' }}
<style>
   p {
   color: #bfc;
 }
</style>
{{/block}}

{{ block 'content' }}
  <p>这是子类内容</p>
{{ /block}}
```

注意这里 Node 渲染的是子模板，而不是 6.1 的父模板。

```js
app.get('/', function(request, response){
    response.render('children.html')
})
```

