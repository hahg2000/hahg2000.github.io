# ES6-中

## 一、Promise

### 1.1 简介

Promise 是异步编程的一种解决方案，其解决了回调地狱问题。

回调地狱（Callback Hell）指的是回调函数里面又套了一层回调函数，使得代码可读性很差，就像下图所示。

<img src="https://raw.githubusercontent.com/hahg2000/picture/Senior-JS/%E5%9B%9E%E8%B0%83%E5%9C%B0%E7%8B%B1%E7%A4%BA%E4%BE%8B.png" style="zoom:50%;" />

所谓 `Promise`，简单说就是 **一个容器**，里面保存着 **某个未来才会结束** 的事件（通常是一个异步操作）的结果。有了 `Promise` 对象，就可以 **将异步操作以同步操作的流程表达出来**，避免了层层嵌套的回调函数。

Promise 对象有两个特点：

**（1）对象的状态不受外界影响。**

`Promise` 对象代表一个异步操作，有三种状态：

+ `pending`：进行中
+ `fulfilled`：已成功
+ `rejected`：已失败

**只有异步操作的结果，可以决定当前是哪一种状态**，任何其他操作都无法改变这个状态。这也是`Promise`这个名字的由来，它的英语意思就是 “承诺” ，表示其他手段无法改变。

**（2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。**

`Promise` 对象的状态改变，只有两种可能：

+ 从 `pending` 变为`fulfilled` ；

+ 从 `pending`变为 `rejected`。
+ 只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 `resolved`（已定型）。如果改变已经发生了，你再对 `Promise` 对象添加回调函数，也会立即得到这个结果。
+ 这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

---

`Promise` 也有一些缺点。

+ 首先，无法取消 `Promise`，**一旦新建它就会立即执行**，无法中途取消。

+ 其次，如果不设置回调函数，`Promise` 内部抛出的错误，**不会反应到外部**。
+ 最后，当处于 `pending` 状态时，**无法得知目前进展到哪一个阶段**（是刚刚开始还是即将完成）。

### 1.2 基本用法

ES6 规定，`Promise` 对象是一个构造函数，用来生成 `Promise` 实例。

下面代码创造了一个`Promise`实例。

```js
const promise = new Promise(function(resolve, reject) {
    // ... some code

    if (/* 异步操作成功 */){
        resolve(value);
    } else {
        reject(error);
    }
});
```

`Promise` 构造函数接受一个函数作为参数，该函数的两个形参分别是 `resolve` 和 `reject`。

+ `resolve` 函数的作用是，将 `Promise` 对象的状态 **从 “ 未完成 ” 变为 “ 成功 ”**（即从 pending 变为 resolved）。

+ `reject` 函数的作用是，将 `Promise` 对象的状态 **从 “ 未完成 ” 变为 “ 失败 ”**（即从 pending 变为 rejected）。

+ 两个函数都可以将其结果传出去。`resolve/reject( 结果 )`。

而我们需要使用 `promise对象.then( function(){}, function(){} )` 来指定这两个函数。

```js
promise.then(function(value) {
    // success
}, function(error) {
    // failure
});
```

下面举一个例子：

+ 第 1 ~ 8 行：将 Promise 封装进了函数里。
+ 第 12 ~ 14 行：指定 resolve 和 reject 函数。

```js
// 将Promise对象作为函数返回值
function timeout(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms, 'done');
        // 第三个参数将作为第一个函数的参数
        // 相当于 setTimeout( function( value ){ resolve( value ) }, ms );
    });
}

// 调用函数时Promise开始执行
// then 里的方法代表成功执行时输出resolve函数传进来的实参
timeout(100).then((value) => {
    console.log(value);
});
```

### 1.3 执行时机

Promise 对象一旦创建就会马上执行里面的回调函数，这里涉及到微任务和宏任务执行顺序，就不展开讲述了。

例如下面的代码：先输出了 Promise 的语句，再输出了普通 Javascript 语句，最后执行回调函数的语句。

```js
// 创建了一个Promise对象
let promise = new Promise(function(resolve, reject) {
    console.log('Promise');
    resolve();
});

// 指定了成功的回调函数
promise.then(function() {
    console.log('resolved.');
});

// 普通的JS语句
console.log('Hi!');

// 输出
// Promise
// Hi!
// resolved
```

### 1.4 使用场景

#### （1）封装Ajax

```js
const getJSON = function(url) {
    // 创建Promise对象
    const promise = new Promise(function(resolve, reject){
        // 定义方法
        const handler = function() {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        };
        // XMLHttpRequest请求
        const client = new XMLHttpRequest();
        client.open("GET", url);
        client.onreadystatechange = handler;
        client.responseType = "json";
        client.setRequestHeader("Accept", "application/json");
        client.send();
    });
	// 将对象返回出去
    return promise;
};
```

#### （2）异步加载图片

```js
function loadImageAsync(url) {
    return new Promise(function(resolve, reject) {
        const image = new Image();

        // 图片加载事件
        image.onload = function() {
            resolve(image);
        };

        // 图片加载失败事件
        image.onerror = function() {
            reject(new Error('Could not load image at ' + url));
        };

        // 设置图片的url
        image.src = url;
    });
}
```

### 1.5 特殊的用法

`resolve` 函数的参数除了正常的值以外，还可能是 **另一个 Promise 实例**，比如像下面这样.

```js
const p1 = new Promise(function (resolve, reject) {
    // ...
});

const p2 = new Promise(function (resolve, reject) {
    // ...
    resolve(p1);
})
```

注意，这时 `p1` 的状态就会传递给 `p2`，也就是说，`p1` 的状态决定了 `p2` 的状态。如果 `p1` 的状态是`pending`，那么 `p2` 的回调函数就会等待 `p1` 的状态改变；如果`p1`的状态已经是 `resolved` 或者`rejected`，那么 `p2` 的 **回调函数将会立刻执行**。

下面举一个例子：

+ 第 1 ~ 3 行：新建了一个 Promise 对象，对象里面有一个定时器任务，**在 3 秒后变为失败对象**。
+ 第 5 ~ 7 行：新建了一个 Promise 对象，对象里面有一个定时器任务，**在 1 秒后并且 p1 状态确定后变为成功对象**。
+ 输出步骤：
  + 一秒后，p2 开始等待 p1 结束，然后就可以执行 `resolve(p1)` 方法，该方法作用输出 p1 对象。
  + 三秒后，p1 开始执行定时器的回调函数，其新建了一个错误对象，并传给了 `reject()` 方法。
  + p1 开始执行  `reject()` 方法。
  + 因为 p2 使用到了 p1 对象，p2 又有 `catch()` 方法，所以 p2 捕获到了 p1 抛出的错误，而错误的信息为 【fail】。

```js
const p1 = new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(p1), 1000)
})

p2
    .then(result => console.log(result))
    .catch(error => console.log(error))
// Error: fail
```

### 1.6 then方法

每一个 Promise 实例具有 `then` 方法，也就是说，`then` 方法是定义在原型对象 `Promise.prototype` 上的。

它的作用是为 Promise 实例 **添加状态改变时的回调函数**。

前面说过，`then` 方法的第一个参数是 `resolved` 状态的回调函数，第二个参数是 `rejected` 状态的回调函数，它们都是可选的。

`then` 方法返回的是一个新的 `Promise` 实例（注意，不是原来那个 `Promise` 实例）。因此可以采用链式写法，即 `then` 方法后面再调用另一个 `then` 方法。

```js
getJSON("/posts.json").then(function(json) {
    return json.post;
}).then(function(post) {
    // ...
}).then(function(post) {
    // ...
});
```

采用链式的 `then`，可以指定一组 **按照次序调用** 的回调函数。这时就很好解决了回调地狱问题，其代码都是链式来写的。

这时，前一个回调函数，有可能返回的还是一个 `Promise` 对象（即有异步操作），这时后一个回调函数，就会等待该`Promise`对象的状态发生变化，才会被调用。

例如下面代码中，第一个 `then` 方法指定的回调函数，返回的是另一个 `Promise` 对象。这时，第二个 `then` 方法指定的回调函数，就会等待这个新的 `Promise` 对象状态 **发生变化**。

如果变为`resolved`，就调用第一个回调函数——第 5 ~ 7 行，如果状态变为`rejected`，就调用第二个回调函数。第 7 ~ 9 行。

```js
getJSON("/post/1.json").then(function(post) {
    // 返回了一个Promise对象
    return getJSON(post.commentURL);
    // 下面的代码将由上面return的结果决定
}).then(function (comments) {
    console.log("resolved: ", comments);
}, function (err){
    console.log("rejected: ", err);
});
```

### 1.7 catch方法

#### （1）用法

`Promise.prototype.catch()` 方法是下面两个方法的别名，用于指定发生错误时的回调函数。

+ `.then(null, rejection)` 
+ `.then(undefined, rejection)`

所以下面两条语句的作用是相等的。

```js
// 使用catch()方法
p.then((val) => console.log('fulfilled:', val))
    .catch((err) => console.log('rejected', err));

// 等同于
// 使用then(null, rejection)方法
p.then((val) => console.log('fulfilled:', val))
    .then(null, (err) => console.log("rejected:", err));
```

`reject()` 方法的作用，等同于抛出错误。例如下面代码中

+ 写法一：第 3 行调用了 `reject()` 方法，第 5 行因此就捕获到了错误信息。
+ 写法二：第 12 行在 `try` 语句块中抛出了错误，但被 `catch` 捕获，然后执行 `catch` 里面的语句，即 `resolve()` 方法，执行完该方法后就被 17 行捕获到了错误信息。（重复使用了两个触发 `catch()` 方式，即没有发挥到 `reject` 的全部作用，建议使用第一种）

```js
// 写法一
const promise = new Promise(function(resolve, reject) {
    reject(new Error('test'));
});
promise.catch(function(error) {
    console.log(error);
});

// 写法二
const promise = new Promise(function(resolve, reject) {
    try {
        throw new Error('test');
    } catch(e) {
        reject(e);
    }
});
promise.catch(function(error) {
    console.log(error);
});
```

如果 Promise 状态已经变成 `resolved`，再抛出错误是无效的，就像 1.1 简介所说的【一旦状态改变，就不会再变】，例如下面的代码：

+ 第 3 行：执行完了 `resolve()` 方法，Promise 的状态就是 fulfilled——已成功的，就算第 5 行抛出了一个错误，也不会去执行 `catch()` 方法。
+ 所以一般 `resolve()` 方法之后，就不再写代码。

```js
const promise = new Promise(function(resolve, reject) {
    // 这里执行完了resolve()方法
    resolve('ok');
    // 这里抛出了一个错误
    throw new Error('test');
});

promise
    .then(function(value) { console.log(value) })
    .catch(function(error) { console.log(error) });
// ok
```

#### （2）冒泡性质

Promise 对象的错误具有【冒泡】性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个 `catch` 语句捕获。例如下面的代码：

+ 第 2 行创建了一个 Promise 对象，该对象状态转成了 fulfilled ——成功状态。
+ 第 6 ~ 14 行然后定义了三个 `then()` 方法，因为 Promise 为成功状态，所以这三个 `then()` 方法都会执行。
+ 第 11 行抛出了一个异常，就一层一层往下找 `catch()` 方法。
+ 所以输出了【1】、【2】、【第二个报错了！】

```js
// 创建了一个Promise
const p1 = new Promise(function (resolve, reject) {
    resolve()
})

p1.then(function () {
    console.log('1')
}).then(function () {
    console.log('2')
    // 执行到这里抛出了一个错误
    throw new Error('第二个报错了！') 
}).then(function () {
    console.log('3')
}).catch(function (error) {
    // 处理前面Promise产生的错误
    console.log({ error })
});

// 输出
//  1
//  2
// {error: Error: 第二个报错了！}
```

所以一般来说，不要在 `then()` 方法里面定义 Reject 状态的回调函数（即 `then` 的第二个参数），比较推荐使用`catch` 方法。例如下面所示。

```js
// bad 使用了then的第二个参数
promise
    .then(function(data) {
    // success
}, function(err) {
    // error
});

// good 使用了catch方法
promise
    .then(function(data) { //cb
    // success
})
    .catch(function(err) {
    // error
});
```

#### （3）未捕获的情况

跟传统的 `try/catch` 代码块不同的是，如果没有使用 `catch()` 方法指定错误处理的回调函数，Promise 对象抛出的错误 **不会传递到外层代码**，即不会有任何反应。例如下面的代码：

+ 第 2 行定义了一个返回 Promise 对象的函数。
+ 第 9 行执行了这个函数并抛出了异常，但不会停止 Javascript 执行。同时指定了没有用到的 `then()` 方法。
+ 第 14 行开始执行定时器，并将回调函数放入循环队列里。两秒后成功输出了 123。

```js
// 一个返回Promise对象的函数
const someAsyncThing = function() {
    return new Promise(function(resolve, reject) {
        // 下面一行会报错，因为x没有声明
        resolve(x + 2);
    });
};

someAsyncThing().then(function() {
    console.log('everything is great');
});

// 定时器
setTimeout(() => { console.log(123) }, 2000);
// Uncaught (in promise) ReferenceError: x is not defined
// 123
```

如果 Javascript 在 Node v14 中运行，会也会有上面的结果。

原理：Node.js 有一个 `unhandledRejection` 事件，专门监听未捕获的 `reject` 错误，上面的脚本会触发这个事件的监听函数，可以在监听函数里面抛出错误。

而在 Node v16.13.1 已经移出这个事件，也就是说 **报错后就不再继续执行 Javascript**。

而我们仍然可以在浏览器中使用它。例如下面的代码，使用 `addEventListener()` 方法监听未捕获的 `reject` 错误：

```js
window.addEventListener('unhandledrejection', function (event) {
    // ...您的代码可以处理未处理的拒绝...

    // 防止默认处理（例如将错误输出到控制台）
    event.preventDefault();
});
```

### 1.8 finally方法

#### （1）用法

`finally()` 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。**该方法是 ES2018 引入标准的。**

下面是一个例子，服务器使用 Promise 处理请求，然后使用 `finally` 方法 **关掉服务器**。就像 Java 里面的读写流或者是连接，无论执行了什么都需要关闭。

```js
server.listen(port)
    .then(function () {
    // ...
})
    .finally(server.stop);
```

`finally` 方法不接受任何参数，无法知道之前的状态，所以里面的操作，是与状态无关的，不依赖于 Promise 的执行结果。如同 Java ，当我们执行到了 finally 代码块无法知道前面的语句是成功执行还是报错执行。

#### （2）另一种写法

`finally` 本质上是 `then` 方法的特例。下面的代码中，如果不使用 `finally` 方法，同样的语句需要为成功和失败两种情况各写一次。有了 `finally` 方法，则只需要写一次。

```js
promise
    .finally(() => {
    // 语句
});

// 等同于
promise
    .then(
    result => {
        // 语句
        return result;
    },
    error => {
        // 语句
        throw error;
    }
);
```

#### （3）返回值

从上面的实现还可以看到，`finally` 方法总是会返回原来的值，参数也会保存。

```js
Promise.resolve(2).then(() => {}, () => {})
// 这里是then()方法的返回值，then()方法成功执行，所以状态为成功，下面同理
// [[PromiseState]]: "fulfilled"
// [[PromiseResult]]: undefined

Promise.resolve(2).finally(() => {})
// [[PromiseState]]: "fulfilled"
// [[PromiseResult]]: 2

Promise.reject(3).then(() => {}, () => {})
// [[PromiseState]]: "fulfilled"
// [[PromiseResult]]: undefined

Promise.reject(3).finally(() => {})
// 这里是finally()方法的返回值，因为会返回原来的值，即返回Promise.reject(3)对象
// 因为没有指定catch()方法，所以会抛出错误。
[[PromiseState]]: "rejected"
[[PromiseResult]]: 3
(x):Uncaught (in promise) 3
```

### 1.9 all方法

#### （1）用法

`Promise.all()` 方法用于将多个 Promise 实例，**包装成一个新的 Promise 实例**。例如下面所示：

```js
const p = Promise.all([p1, p2, p3]);
```

如果数组里的元素不是 Promise 对象，就会调用 `Promise.resolve()` 来使这些元素变为 Promise 。方法里的参数可以不是数组，但必须具有 Iterator 接口，且 **里面的每个成员都是 Promise 实例**。

#### （2）状态的决定

+ `p` 的状态由`p1`、`p2`、`p3` 决定，分成两种情况。

（1）只有 `p1`、`p2`、`p3` 的状态都变成 `fulfilled`，`p` 的状态才会变成 `fulfilled`，

（2）只要`p1`、`p2`、`p3` 之中有一个被 `rejected`，`p` 的状态就变成 `rejected`。

简单来说，就是数组里的状态 **并运算**，只要有一个 `rejected` 状态就是 `rejected`。

#### （3）返回值

`all()` 方法返回给 `then()` 或者 `catch()` 的数据根据 **其状态来决定的**。

+ `all()` 方法的状态如果为 `fulfilled`，则 **返回的是一个数组**，数组里的元素是每一个 Promise 对象的返回值，即 `resolve()` 方法的参数。
+ `all()` 方法的状态如果为 `rejected`，则只会第一个被 `reject` 的 **实例的返回值**，即 `reject()` 方法的参数。

例如下面的代码：

+ 示例一：第 2 行的 p1 的状态为失败，所以所以直接调用 p 的 `catch()` 方法，输出了 2。
+ 示例二：第 16 行的 p2 状态为成功，`all()` 方法里参数数组的其他两个元素不是 Promise 对象所以调用了 `Promise.resolve()` 方法，也使他们变成了 **成功状态的 Promise 对象**，所以 p 的最终状态为成功。
  又因为 p1 的返回值为 2，所以输出数组——[ 1，**2**，3 ]

```js
// 示例一
const p1 = new Promise(function (resolve, reject) {
    reject(2);
})
const p = Promise.all([1, p1, 3]);

p.then(function (result) {
    console.log(result);
}).catch(function (error) {
    console.log(error);
})
// 2

// 示例二
const p1 = new Promise(function (resolve, reject) {
    resolve(2);
})
const p = Promise.all([1, p1, 3]);

p.then(function (result) {
    console.log(result);
}).catch(function (error) {
    console.log(error);
})
// [1, 2, 3]
```

#### （4）注意事项

注意，如果作为参数的 Promise 实例，自己定义了 `catch()` 方法，那么它一旦被 `rejected`，并不会触发`Promise.all()` 的 `catch()` 方法。

换句话来说，就是如果参数定义了 `catch()` 方法，如果变成了 `rejected` 状态，就会 **马上** 被自己的 `catch()` 方法捕获。

然后 `catch()` 方法执行成功就会返回一个状态为 `fulfilled` 的 Promise 对象，所以就不会触发 `all()` 方法返回对象的 `catch()` 方法。

例如下面代码，定义一个 Promise 对象 p1 ，其状态将变为 `fulfilled` ，并指定了 `then()` 方法；再定义 一个 Promise 对象 p2 ，其状态将变为 `rejected` ，并指定了 `catch()` 方法。最后将他们一起作为 `all()` 方法的参数。

```js
const p1 = new Promise((resolve, reject) => {
    resolve('hello');
})
.then(result => console.log('p1结果为' + result))

const p2 = new Promise((resolve, reject) => {
    throw new Error('未知错误');
})
.catch(err => console.log('p2错误为' + err));

Promise.all([p1, p2])
    .then(result =>console.log('all()结果为：【' + result + '】'))
    .catch(err => console.log('all()错误为' + err));

// p1结果为hello
// p2错误为Error: 未知错误
// all()结果为:【,】
```

最后分别输出了 【p1结果为hello； p2错误为Error: 未知错误；all()结果为,】

解析第三个输出：

+ 因为 p1 和 p2 分别执行了 `then()` 和 `catch()` 方法，所以 p1 和 p2 的状态都成功状态；
+ 又因为 `then()` 和 `catch()` 方法都会返回一个**新的 Promise 对象**，这个新的 Promise 对象又没有指定返回值，所以在 `all()` 方法里的 result 参数为 " [undefined, undefined] "。
+ 在使用 `console.log()` 的时候，因为前后都拼接了字符串，所以自动调用 `toString()` 方法，该方法会自动将 “ [ ” 和 ” ] “ 以及 ” undefined “ 去掉，组成字符串。

如果第 9 行注释掉，p2 没有了 `catch()` 方法，`all()` 方法的 `catch()` 方法就会捕获到。

```js
const p1 = new Promise((resolve, reject) => {
    resolve('hello');
})
.then(result => console.log('p1结果为' + result))

const p2 = new Promise((resolve, reject) => {
    throw new Error('未知错误');
})
// 注释掉了这句
// .catch(err => console.log('p2错误为' + err));

Promise.all([p1, p2])
    .then(result =>console.log('all()结果为：【' + result + '】'))
    .catch(err => console.log('all()错误为' + err));
```

### 1.10 any方法

#### （1）用法

ES2021（ES12）引入了 `Promise.any()` 方法。该方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例返回。

```js
const p = Promise.any([p1, p2, p3]);
```

#### （2）状态的决定

在 1.9 节中的 `all()` 方法是并运算，这节的 `any()` 方法是 **或运算**。

只要有一个状态为 `fulfilled` ，新的 Promise 对象就是 `fulfilled`

#### （3）返回值

其返回值与 `all()` 方法一致。

+ `any()` 方法的状态如果为 `rejected`，其返回值则是一个字符串，【AggregateError: All promises were rejected】。
+ `any()` 方法的状态如果为 `fulfilled`，其返回值则是第一个被 `resolved` 的实例的返回值，即 `resolved()` 方法的参数。

例如下面的代码所示：

+ 定义了两个状态都会转换为 `rejected` 的 Promise 对象。
+ 然后将他们放在 `any()` 方法中，最后输出了指定字符串。

```js
const p1 = new Promise(function (resolve, reject) {
    reject(2);
})

const p2 = new Promise(function (resolve, reject) {
    reject(3);
})

const p = Promise.any([p1, p2]);

p.then(function (result) {
    console.log(result);
}).catch(function (error) {
    console.log(error);
})
// 输出：AggregateError: All promises were rejected

// 如果是 const p = Promise.any([p1, p2, 1]);
// 则会输出：1
```

### 1.11 race方法

`Promise.race()` 方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

而这个新的 Promise 对象的状态，就像其名字所意，新的 Promise 对象的状态由多个 Promise 对象中 **最先改变** 的状态决定。就像赛跑一样。

例如下面的代码：

+ 定义了三个 Promise 对象，对象状态分别在 1s，0.5s，2s 后确定。
+ p2 的状态最先改变，执行了 `reject()` 方法，变成 `rejected` 状态。
+ 所以 p 的状态就是 p2 的 `rejected` 状态，所以执行了 `catch()` 方法。

```js
const p1 = new Promise(function(resolve){
    setTimeout(() => resolve('1'), 1000)
})

const p2 = new Promise(function(resolve, reject){
    setTimeout(() => reject('2'), 500)
})

const p3 = new Promise(function(resolve){
    setTimeout(() => resolve('3'), 2000)
})

const p = Promise.race([p1, p2, p3]);

p.then(function(result){
    console.log('p的结果为' + result);
}).catch(function(error){
    console.log('p的错误为' + error);
})
// 输出：p的错误为2
```

如果同时确定了状态，则由参数里的 **元素的排列顺序** 来决定。

例如下面代码所示：p1、p2、p3 都马上确定了状态，但由于 p2 在最前面，所以输出了 p2 的返回值。

```js
const p1 = new Promise(function(resolve){
    resolve('1')
})

const p2 = new Promise(function(resolve, reject){
    resolve('2')
})

const p3 = new Promise(function(resolve){
    resolve('3')
})

const p = Promise.race([p2, p1, p3]);

p.then(function(result){
    console.log('p的结果为' + result);
}).catch(function(error){
    console.log('p的错误为' + error);
})
// 输出：p的结果为2
```

### 1.12 resolve方法

有时需要将现有对象转为 Promise 对象，`Promise.resolve()` 方法就起到这个作用。

`Promise.resolve()` 等价于下面的写法。

```js
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

`Promise.resolve()`方法的参数分成四种情况。

1. **参数是一个 Promise 实例**

如果参数是 Promise 实例，那么`Promise.resolve` 将 **原封不动地返回这个实例**。

2. **参数是一个 thenable 对象**

thenable 对象指的是具有 then 方法的对象，比如下面的代码的第 1 行。

而 `Promise.resolve()` 方法会将这个对象转为 Promise 对象，然后就 **立即执行** `thenable` 对象的 `then()` 方法。

比如第 7 行 thenable 对象传给了 `resolve()` 方法，返回了一个状态为 `fulfilled` 的 Promise 对象。所以为该 Promise 对象指定 `then()` 方法后就马上执行。

```js
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};

let p1 = Promise.resolve(thenable);

p1.then(function (value) {
  console.log(value);  // 42
});
```

3. **参数不是具有then()方法的对象，或根本就不是对象**

如果参数是一个原始值，或者是一个不具有 `then()` 方法的对象，则 `Promise.resolve()` 方法返回一个新的 Promise 对象，状态为 `fulfilled`。

```js
const p = Promise.resolve('Hello');

p.then(function (result) {
    console.log(result)
});
// Hello
```

上面代码生成一个新的 Promise 对象的实例 p。由于字符串 Hello 不是具有 then() 方法的对象，也不是对象，所以返回 Promise 实例的状态一开始就是 `fulfilled`，所以回调函数 `then()` 会立即执行。

4. 不带有任何参数

`Promise.resolve()` 方法允许调用时不带参数，直接返回一个 `resolved` 状态的 Promise 对象。

所以，如果希望得到一个 Promise 对象，比较方便的方法就是直接调用`Promise.resolve()`方法。

```js
const p = Promise.resolve();

p.then(function () {
    // ...
});
```

需要注意的是，立即 `resolve()` 的 Promise 对象，是在本轮 “ 事件循环 ”（event loop）的结束时执行回调函数 `then()` 或者 `catch()`，也就是说在第一轮宏任务执行完成后。

```js
// 第一轮宏任务[1]
setTimeout(function () {
    // 第二轮宏任务[1]
    console.log('four');
}, 0);

new Promise((resolve) => {
    // 第一轮宏任务[2]
    console.log('one');
    resolve();
}).then(function () {
    // 第一轮微任务[1]
    console.log('three');
});

// 第一轮宏任务[3]
console.log('two');

// one
// two
// three
// four
```

## 二、Symbol

### 2.1 简介

Symbol 的中文意思是 **代表、象征**，其又是一个 **新的原始数据类型**，所以这个类型的变量都是独一无二的。

如果使用这个特性来定义对象里属性的 **属性名**，那么就永远不会覆盖掉之前的属性。（命名困难症福音？）

### 2.2 基本用法

Symbol 值通过 Symbol 函数生成。Symbol 因为是 基本 / 原始 数据类型，不是对象等引用类型，所以 **首字母小写**。

```js
let s = Symbol();

typeof s
// "symbol"
// 注意：首字母小写
```

`Symbol` 函数可以接受 **一个字符串** 作为参数，表示对 Symbol 实例的 **描述**，主要是为了在控制台或者一些地方区分他们。

例如下面的代码中，两个 Symbol 的标识符都使用 **不同的字符串**。他们的 `toString()` 方法就是输出 `Symbol(字符串)` 。

```js
let s1 = Symbol('foo');
let s2 = Symbol('bar');

s1 // Symbol(foo)
s2 // Symbol(bar)

s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(bar)"
```

如果 `Symbol()` 方法里的参数不是字符串的话，会调用该参数的 `toString` 方法。例如下面的代码，括号里的内容和单独使用 `toString()` 方法一样。

```js
let a = Symbol([undefined, 1])

console.log(a.toString());  // Symbol(,1)

console.log([undefined, 1].toString()); // ,1
```

Symbol 的标识符可能会相等，但他们的值一定不相等。就像名字相等的两个人，但他们的身份证号一定不一样。例如下面代码中，不论是无参数的情况还是有参数的情况，两个 Symbol 的值一定不相等。

```js
// 没有参数的情况
let s1 = Symbol();
let s2 = Symbol();

s1 === s2 // false

// 有参数的情况
let s1 = Symbol('foo');
let s2 = Symbol('foo');

s1 === s2 // false
```

### 2.3 description

如果我们想获取到 Symbol 里的标识符，需要用到 [ES2019（ES10）](https://github.com/tc39/proposal-Symbol-description) 提供的一个实例属性 `description`，直接返回 Symbol 的描述。

```js
const sym = Symbol('foo');

sym.description // "foo"
```

### 2.4 作为属性名

由于每一个 Symbol 值都是不相等的，这意味着 Symbol 值可以作为标识符，用于对象的属性名，就能保证不会出现同名的属性。这对于 **一个对象由多个模块构成** 的情况非常有用，能防止 **某一个键被不小心改写或覆盖**。

作为属性名的使用方法如下：

1. 动态添加到对象里
2. 创建时添加到对象里。注意这里需要使用到 `[mySymbol]` 才能成功取到 Symbol 对象的具体数据。
3. 使用内置方法 `Object.defineProperty()`

```js
let mySymbol = Symbol();

// 第一种写法
let a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
let a = {
  [mySymbol]: 'Hello!'
};

// 第三种写法
let a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 以上写法都得到同样结果
a[mySymbol] // "Hello!"
```

注意，Symbol 值作为对象属性名时，不能用点运算符。

因为 **点运算符后面总是字符串**，所以不会读取 Symbol 的值也就是变量里的内容，而是将变量转换为字符串类型后再存到对象里。

```js
// 示例
let obj = {}

// 想添加 name:'张三'
let b = 'name'
obj.b = '张三'

// 但不是想要的输出
console.log(obj);	// { b: "张三" }

// 实践
const mySymbol = Symbol();

// 想添加 Symbol() : 'Hello!'
const a = {};
a.mySymbol = 'Hello!';

// 取不到
a[mySymbol] // undefined
// 成功取到
a['mySymbol'] // "Hello!"
```

同理，在对象的内部，使用 Symbol 值定义属性时，Symbol 值必须放在方括号之中。方括号的作用就是取 **变量的里具体数据**，而变量里的具体数据就是我们需要使用的 Symbol 对象。

```js
let s = Symbol();

let obj = {
  // 这里需要使用 []
  [s]: function (arg) { ... }
};

obj[s](123);
```

### 2.5 消除魔术字符串

魔术字符串指的是，在代码之中 **多次出现**、与 **代码形成强耦合** 的某一个具体的字符串或者数值。风格良好的代码，应该尽量消除魔术字符串，改由含义清晰的变量代替。

例如下面的代码：第 5 行和第 14 行都使用到了【Triangle】字符串，如果想修改的话需要修改两处地方。

```js
function getArea(shape, options) {
    let area = 0;
    switch (shape) {
        case 'Triangle': // 魔术字符串
            area = .5 * options.width * options.height;
            break;
            /* ... more code ... */
    }
    return area;
}

// 魔术字符串
getArea('Triangle', { width: 100, height: 100 }); 
```

所以将这个字符串提取出来后，改进后的代码如下：

```js
// 将字符串提取出来
const shapeType = {
    triangle: 'Triangle'
};

function getArea(shape, options) {
    let area = 0;
    switch (shape) {
        // 直接调用对象的属性
        case shapeType.triangle:
            area = .5 * options.width * options.height;
            break;
    }
    return area;
}

// 直接调用对象的属性
getArea(shapeType.triangle, { width: 100, height: 100 });
```

但我们仍然可以使用魔术字符串来成功调用这个方法—— `getArea('Triangle', { width: 100, height: 100 }); ` 

所以我们需要进一步限制该方法，就是使用 Symbol 对象来作为 case 的判断条件。将第 2 行代码改为下面所示：

```js
// 将变量值定义为Symbol对象
const shapeType = {
    triangle: Symbol('Triangle')
};
```

### 2.6 属性名的遍历

Symbol 作为属性名，遍历对象的时候，该属性不会出现在`for...in`、`for...of` 循环中，也不会被`Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()` 返回。

例如下面的代码：使用了两个 Symbol 对象作为属性名，使用 `for...in` 和 `Object.keys()` **遍历属性名**时，会发现遍历不出来，就像没有这个属性一样。

```js
const name = Symbol('name');

const age = Symbol('age');

const person = {
    [name]: '张三',
    [age]: 18,
    gender: '男'
}

for (let index in person) {
    console.log(index); // gender
}

Object.keys('person');  // gender
```

但是，它也不是私有属性，有一个 `Object.getOwnPropertySymbols()` 方法，可以获取指定对象的 **所有 Symbol 属性名**。该方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。

我们可以通过这个方法来获取到对象里的数据，虽然一般不会这样操作。

```js
// 取出所有Symbol属性名
//[Symbol(name), Symbol(age)]
let symbols = Object.getOwnPropertySymbols(person); 

// 根据Symbol属性名取出属性值
// 张三
console.log(person[symbols[0]]);  
```

`Reflect.ownKeys()` 方法可以 **返回所有类型的键名**，包括 **常规键名和 Symbol 键名**。

```js
let keys = Reflect.ownKeys(person)

console.log(keys);  
// [gender, Symbol(name), Symbol(age)]
```

由于以 Symbol 值作为键名，不会被常规方法遍历得到。我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法。（只要不容易被找到，那就是内部的方法？）

### 2.7 for方法

Symbol 对象就像账号密码，只有你一个人知道，你忘了就好比接收 Symbol 对象的变量被删除或者被覆盖，就很难再找回。但你密码同时也存在服务器里，所以需要点击忘记密码来找出。

而 Symbol 对象的值找回需要使用 `Symbol.for()` 或者 `Symbol.keyFor()` 。

+ `Symbol.for('字符串')` ：搜索有没有以该字符串作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就 **新建一个以该字符串为名称的 Symbol 值**，并将其注册到全局。

```js
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');

s1 === s2 // true
```

+ `Symbol.keyfor('字符串')`：
