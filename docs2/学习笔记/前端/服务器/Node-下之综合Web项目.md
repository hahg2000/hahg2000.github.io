# Node-下之综合Web项目

## 一、设计目录

首先先在项目里建立好项目结构：

+ 在 Window 列出项目结构在命令行中输入 `tree`
+ 列出结构并输出到文件 `tree >文件名.txt`

```
├─node_modules 【模块】
├─controllers 【控制层】
├─models 【模型】
├─public 【公开的文件】
│  ├─css
│  ├─img
│  └─js
├─views 【视图】
├─middlewares 【中间件】
├─app.js【入口文件】
├─router.js【路由文件】
├─package.json【包说明文件】
└─package-lock.json【包锁定文件】
```

上面主要为 MVC 模式的项目结构：

+ 控制层和路由的职责有所重复，所以也可以合并成只有路由。
+ 如果想保留控制层，那么在路由就只单单处理请求的分类，具体地处理请求将在控制层。

例如下面的代码。第 3 行，处理 “ / “ 的请求，然后 **将具体地处理交给控制层**；而第 6 行的控制层，就开始具体的操作，例如权限控制和返回页面。

+ 具体的项目参考：[CNodeJS Github仓库](https://github.com/cnodejs/nodeclub)

```js
// routes.js 处理请求的分类
var site = require('./controllers/site');
router.get('/', site.index);

// controllers/site.js 
exports.index = function (req, res, next) {
    // 处理请求主页
}
```

如果需要使用上面目录的文件夹时，需要 **在入口文件进行注册**。

+ view【视图文件夹】
  + `app.engine('html', require('express-art-template'))` 注册模板引擎
  + `app.set('views', path.join(__dirname, './views'))` 配置渲染目录
+ public【公开资源文件夹】
  + `app.use('/public/', express.static(path.join(__dirname, './public/')))`
+ router.js【路由文件】和 middlewares【中间件文件夹】
  + 使用他们都需要使用到 `app.use(请求路径, 所使用的模块)`
+ 解析 POST 数据

```js
app.use(express.urlencoded({ extended: false }))

app.use(express.json())
```

## 二、设计模型

一般模型 Model 是操作数据库，最常用的是操作 MySql 和 MongoDB。

### 2.1 操作MySql

在 Node 中篇中的第四章中有较详细地讲述，这里就列出大概模板。

```js
// 引入Mysql模块
var mysql = require('mysql')

// 创建连接池
var pool = mysql.createPool({
    connectionLimit: 1,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'tx',
    queueLimit: 1
})

// 在连接池获取连接
pool.getConnection(function(err, connection){
   	// 执行MySql语句
    connection.query( "select * from table", function(err, rows){
        // 获取到错误对象和数据对象
        if(err) {
            throw err;
        }else{
            console.log( rows );
        }
    });
    // 使用完连接后释放连接
    connection.release();
});
```

### 2.2 操作MongoDB

MongoDB 现在【2021年12月24日】尚不熟悉，所以一般不会去用 つ﹏⊂

```js
// 导入Mongoose模块
let mongoose = require('mongoose')

// 连接数据库
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/students');
}

// 获取模式
const { Schema } = mongoose;

// 使用模式创建具体的数据库模型，这里将自己自定义化
const studentsSchema = new Schema({
    id: { type:Number }, // String is shorthand for {type: String}
    name: String,
    gender: { type:Number, enum:[0, 1], default: 0 },
    age:{ type:Number },
    hobby: String
});

// 导出数据库模型，其他模块拿到数据库模型可以进行增删改查
module.exports = mongoose.model("Student_info", studentsSchema)
```

下面将使用导出的数据库模型：

```js
Students.findOne({ id: tempId }, function (err, data) {
    if (err) {
        response.status(500).send('Server error...')
    }

    response.render('修改学生信息.html', {
        updateStu: data,
    })
})
```

## 三、登录验证

现在对用户进行登录验证，最常见的是 token 验证，也就是将用户信息和一些相关数据进行加密，然后传给客户端，客户端再存到 cookie 里面。

然后 **每次请求** 浏览器都会 **自动** 将 cookie 里的信息传到服务端。服务端再根据 token 内容进行解密判断当前 token 是否合法。

（疑惑：不太知道一些互联网大企业如何来做这个事情才比较安全。最离谱的是 cf 活动页面复制 cookie 后退出再导入复制的 cookie，就可以直接登录）

---

我们的是 JWT 模块来生成 token，具体的官网 ：

+ [JWT的io网站](https://jwt.io/)：里面有不同语言使用的情况。
+ [JWT的node版本 Github仓库](https://github.com/auth0/node-jsonwebtoken)

使用也非常简单，首先 **加密用户输入的正确账号和密码**，也可以有一些标识，例如是否为管理员。

+ 引入模块： `const jwt = require('jsonwebtoken')`

+ `let token = jwt.sign(data, SECRET_KEY)`
  + 第一个参数为 **需要加密的内容**，可以为对象或者字符串。
  + 第二参数为 salt ，与数据一起加密，可以加大破解的难度。
+ 如果想要传给前端可以使用 `response.json(对象)` 方法来发送 JSON 格式的数据。
+ 在前端可以使用包装过的 AJAX 接收服务区传过来的数据，例如下面代码：
  + 第 4 行：使用了 `document.cookie = '对象名=对象值'` 来添加 cookie 里面。


```js
success:function(data){
    console.log(data.success);
    if(data.success){
        document.cookie = 'token=' + data.token
    }
}
```

+ 在前端发送请求到后端时，**cookie 会自动放到请求头**，但解析起来比较麻烦，所以我们需要另一个官方中间件 `cookie-parser`
+ 直接使用 `req.cookies` 就可以取出对象类型的 cookie。

```js
// 导入模块
const cookieParser = require('cookie-parser')

// 注册模块
app.use(cookieParser())

// 请求主页
app.get('/main', function (req, res) {

    const token = req.cookies.token

    // 解密token
    let decoded = jwt.verify(token, SECRET_KEY);

    // 在这里查询数据库然后比较
})
```

## 四、中间件

中间件就像污水处理厂一样，一步步处理请求。就像 JavaWeb 里的拦截器。

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E4%B8%AD%E9%97%B4%E4%BB%B6%E7%A4%BA%E6%84%8F%E5%9B%BE.png" style="zoom:70%;" />

下面来自定义并使用中间件。首先定义中间件 **需要按照其规定的方式来定义方法**。

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E4%B8%AD%E9%97%B4%E4%BB%B6%E5%87%BD%E6%95%B0.png" style="zoom:60%;" />

+ 第一个参数：前端发来的 request 请求。
+ 第二个参数：服务器返回的 response 响应。
+ 第三个参数：下一个中间件的回调函数，只有执行了该函数 `next()` 下一个中间件才可以执行。

例如下面代码中：定义了两个方法作为中间件，然后在第一个方法中往 request 里添加数据，在之后的中间件都可以获取到其里面的数据。

**这就是为什么配置一些中间件后，就可以直接在路由的 request 请求取出 cookie 和 POST 所携带的数据。**

```js
//。。。。

// 注册中间件
app.use(middleware1)
app.use(middleware2)

// 定义两个中间件函数
function middleware1(req, res, next){
  // 标识输出
  console.log('这是middleware1');
  // 往req里添加内容
  req.name = '张三';
  // 必写
  next()
}
function middleware2(req, res, next){
  // 取出req里的内容
  console.log('在middleware2中取出req的name:' + req.name);
  // 必写
  next()
}

// 最终路由
app.get('/', function(req, res){
   // 输出req里的内容
   console.log('在最后中取出req的name:' + req.name);
   res.end()
})

// 输出
// 这是middleware1
// 在middleware2中取出req的name:张三
// 在最后中取出req的name:张三
```

