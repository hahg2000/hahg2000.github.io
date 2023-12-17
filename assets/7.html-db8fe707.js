const e=JSON.parse('{"key":"v-78c27012","path":"/%E5%AD%A6%E4%B9%A0/Haskell%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3/7.html","title":"第 7 章：I/O","lang":"zh-CN","frontmatter":{"description":"第 7 章：I/O 就算不是全部，绝大多数的程序员显然还是致力于从外界收集数据，处理这些数据，然后把结果传回外界。也就是说，关键就是输入输出。 Haskell的I/O系统是很强大和富有表现力的。 它易于使用，也很有必要去理解。Haskell严格地把纯代码从那些会让外部世界发生事情的代码中分隔开。就是说，它给纯代码提供了完全的副作用隔离。除了帮助程序员推断他们自己代码的正确性，它还使编译器可以自动采取优化和并行化成为可能。 我们将用简单标准的I/O来开始这一章。然后我们要讨论下一些更强大的选项，以及提供更多I/O是怎么适应纯的，惰性的，函数式的Haskell世界的细节。","head":[["meta",{"property":"og:url","content":"https://hahg2000.github.io/%E5%AD%A6%E4%B9%A0/Haskell%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3/7.html"}],["meta",{"property":"og:title","content":"第 7 章：I/O"}],["meta",{"property":"og:description","content":"第 7 章：I/O 就算不是全部，绝大多数的程序员显然还是致力于从外界收集数据，处理这些数据，然后把结果传回外界。也就是说，关键就是输入输出。 Haskell的I/O系统是很强大和富有表现力的。 它易于使用，也很有必要去理解。Haskell严格地把纯代码从那些会让外部世界发生事情的代码中分隔开。就是说，它给纯代码提供了完全的副作用隔离。除了帮助程序员推断他们自己代码的正确性，它还使编译器可以自动采取优化和并行化成为可能。 我们将用简单标准的I/O来开始这一章。然后我们要讨论下一些更强大的选项，以及提供更多I/O是怎么适应纯的，惰性的，函数式的Haskell世界的细节。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-12-17T11:18:34.000Z"}],["meta",{"property":"article:modified_time","content":"2023-12-17T11:18:34.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"第 7 章：I/O\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2023-12-17T11:18:34.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":2,"title":"Haskell经典I/O","slug":"haskell经典i-o","link":"#haskell经典i-o","children":[{"level":3,"title":"Pure vs. I/O","slug":"pure-vs-i-o","link":"#pure-vs-i-o","children":[]},{"level":3,"title":"为什么纯不纯很重要？","slug":"为什么纯不纯很重要","link":"#为什么纯不纯很重要","children":[]}]},{"level":2,"title":"使用文件和句柄（Handle）","slug":"使用文件和句柄-handle","link":"#使用文件和句柄-handle","children":[{"level":3,"title":"关于 openFile 的更多信息","slug":"关于-openfile-的更多信息","link":"#关于-openfile-的更多信息","children":[]},{"level":3,"title":"关闭句柄","slug":"关闭句柄","link":"#关闭句柄","children":[]},{"level":3,"title":"Seek and Tell","slug":"seek-and-tell","link":"#seek-and-tell","children":[]},{"level":3,"title":"标准输入，输出和错误","slug":"标准输入-输出和错误","link":"#标准输入-输出和错误","children":[]},{"level":3,"title":"删除和重命名文件","slug":"删除和重命名文件","link":"#删除和重命名文件","children":[]},{"level":3,"title":"临时文件","slug":"临时文件","link":"#临时文件","children":[]}]},{"level":2,"title":"扩展例子：函数式I/O和临时文件","slug":"扩展例子-函数式i-o和临时文件","link":"#扩展例子-函数式i-o和临时文件","children":[]},{"level":2,"title":"惰性I/O","slug":"惰性i-o","link":"#惰性i-o","children":[{"level":3,"title":"hGetContents","slug":"hgetcontents","link":"#hgetcontents","children":[]},{"level":3,"title":"readFile和writeFile","slug":"readfile和writefile","link":"#readfile和writefile","children":[]},{"level":3,"title":"一言以蔽惰性输出","slug":"一言以蔽惰性输出","link":"#一言以蔽惰性输出","children":[]},{"level":3,"title":"interact","slug":"interact","link":"#interact","children":[]},{"level":3,"title":"interact 过滤器","slug":"interact-过滤器","link":"#interact-过滤器","children":[]}]},{"level":2,"title":"The IO Monad","slug":"the-io-monad","link":"#the-io-monad","children":[{"level":3,"title":"动作（Actions）","slug":"动作-actions","link":"#动作-actions","children":[]},{"level":3,"title":"串联化（Sequencing）","slug":"sequencing","link":"#sequencing","children":[]},{"level":3,"title":"Return的本色","slug":"the-nature-of-return","link":"#the-nature-of-return","children":[]}]},{"level":2,"title":"Haskell 实际上是命令式的吗？","slug":"haskell-实际上是命令式的吗","link":"#haskell-实际上是命令式的吗","children":[]},{"level":2,"title":"惰性I/O的副作用","slug":"惰性i-o的副作用","link":"#惰性i-o的副作用","children":[]},{"level":2,"title":"缓冲区（Buffering）","slug":"缓冲区-buffering","link":"#缓冲区-buffering","children":[{"level":3,"title":"缓冲区模式","slug":"缓冲区模式","link":"#缓冲区模式","children":[]},{"level":3,"title":"刷新缓冲区","slug":"刷新缓冲区","link":"#刷新缓冲区","children":[]}]},{"level":2,"title":"读取命令行参数","slug":"读取命令行参数","link":"#读取命令行参数","children":[]},{"level":2,"title":"环境变量","slug":"环境变量","link":"#环境变量","children":[]}],"git":{"createdTime":1702811914000,"updatedTime":1702811914000,"contributors":[{"name":"hahg2000","email":"61403802+hahg2000@users.noreply.github.com","commits":1}]},"readingTime":{"minutes":46.16,"words":13847},"filePathRelative":"学习/Haskell中文文档/7.md","localizedDate":"2023年12月17日","excerpt":"<h1> 第 7 章：I/O</h1>\\n<p>就算不是全部，绝大多数的程序员显然还是致力于从外界收集数据，处理这些数据，然后把结果传回外界。也就是说，关键就是输入输出。</p>\\n<p>Haskell的I/O系统是很强大和富有表现力的。 它易于使用，也很有必要去理解。Haskell严格地把纯代码从那些会让外部世界发生事情的代码中分隔开。就是说，它给纯代码提供了完全的副作用隔离。除了帮助程序员推断他们自己代码的正确性，它还使编译器可以自动采取优化和并行化成为可能。</p>\\n<p>我们将用简单标准的I/O来开始这一章。然后我们要讨论下一些更强大的选项，以及提供更多I/O是怎么适应纯的，惰性的，函数式的Haskell世界的细节。</p>","autoDesc":true}');export{e as data};
