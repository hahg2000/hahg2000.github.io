const e=JSON.parse('{"key":"v-0313247c","path":"/%E5%AD%A6%E4%B9%A0/%E5%90%8E%E7%AB%AF/SSM%E6%A1%86%E6%9E%B6/Spring4/%E4%B8%89%E3%80%81Spring%E4%B8%8EAOP.html","title":"三、Spring与AOP","lang":"zh-CN","frontmatter":{"description":"三、Spring与AOP 3.1 AOP 的引入 现在有个业务类，其实现了 IService 接口，里面有两个主业务逻辑方法和两个交叉业务逻辑。 此时提出一个问题：若有其它实现类同样也要调用这些事务、日志等处理方法怎么办？ 可以将业务逻辑作为父类，需要使用事务、日志的实现类就继承它即可。 将这些交叉业务逻辑代码放到专门的工具类或处理类中设置成静态方法，由主业务逻辑调用。","head":[["meta",{"property":"og:url","content":"https://hahg2000.github.io/%E5%AD%A6%E4%B9%A0/%E5%90%8E%E7%AB%AF/SSM%E6%A1%86%E6%9E%B6/Spring4/%E4%B8%89%E3%80%81Spring%E4%B8%8EAOP.html"}],["meta",{"property":"og:title","content":"三、Spring与AOP"}],["meta",{"property":"og:description","content":"三、Spring与AOP 3.1 AOP 的引入 现在有个业务类，其实现了 IService 接口，里面有两个主业务逻辑方法和两个交叉业务逻辑。 此时提出一个问题：若有其它实现类同样也要调用这些事务、日志等处理方法怎么办？ 可以将业务逻辑作为父类，需要使用事务、日志的实现类就继承它即可。 将这些交叉业务逻辑代码放到专门的工具类或处理类中设置成静态方法，由主业务逻辑调用。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-03-12T04:21:01.000Z"}],["meta",{"property":"article:modified_time","content":"2023-03-12T04:21:01.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"三、Spring与AOP\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2023-03-12T04:21:01.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":2,"title":"3.1 AOP 的引入","slug":"_3-1-aop-的引入","link":"#_3-1-aop-的引入","children":[]},{"level":2,"title":"3.2 AOP 概述","slug":"_3-2-aop-概述","link":"#_3-2-aop-概述","children":[{"level":3,"title":"3.2.1 AOP 简介","slug":"_3-2-1-aop-简介","link":"#_3-2-1-aop-简介","children":[]},{"level":3,"title":"3.2.2 AOP 编程术语","slug":"_3-2-2-aop-编程术语","link":"#_3-2-2-aop-编程术语","children":[]},{"level":3,"title":"3.2.3 AOP 编程环境搭建","slug":"_3-2-3-aop-编程环境搭建","link":"#_3-2-3-aop-编程环境搭建","children":[]}]},{"level":2,"title":"3.3 通知 Advice","slug":"_3-3-通知-advice","link":"#_3-3-通知-advice","children":[{"level":3,"title":"3.3.1 通知的用法步骤","slug":"_3-3-1-通知的用法步骤","link":"#_3-3-1-通知的用法步骤","children":[]},{"level":3,"title":"3.3.2 通知的其他用法","slug":"_3-3-2-通知的其他用法","link":"#_3-3-2-通知的其他用法","children":[]}]},{"level":2,"title":"3.4 顾问 Advisor","slug":"_3-4-顾问-advisor","link":"#_3-4-顾问-advisor","children":[{"level":3,"title":"3.4.1 名称匹配方法切入点顾问","slug":"_3-4-1-名称匹配方法切入点顾问","link":"#_3-4-1-名称匹配方法切入点顾问","children":[]},{"level":3,"title":"3.4.2 正则表达式方法切入点顾问","slug":"_3-4-2-正则表达式方法切入点顾问","link":"#_3-4-2-正则表达式方法切入点顾问","children":[]},{"level":3,"title":"3.4.2-1 正则表达式专题","slug":"_3-4-2-1-正则表达式专题","link":"#_3-4-2-1-正则表达式专题","children":[]}]},{"level":2,"title":"3.5 自动代理生成器","slug":"_3-5-自动代理生成器","link":"#_3-5-自动代理生成器","children":[{"level":3,"title":"3.5.1 默认advisor自动代理生成器","slug":"_3-5-1-默认advisor自动代理生成器","link":"#_3-5-1-默认advisor自动代理生成器","children":[]},{"level":3,"title":"3.5.2 Bean 名称自动代理生成器","slug":"_3-5-2-bean-名称自动代理生成器","link":"#_3-5-2-bean-名称自动代理生成器","children":[]}]},{"level":2,"title":"3.6 AspectJ 对 AOP 的实现","slug":"_3-6-aspectj-对-aop-的实现","link":"#_3-6-aspectj-对-aop-的实现","children":[{"level":3,"title":"3.6.1 AspectJ 的通知类型","slug":"_3-6-1-aspectj-的通知类型","link":"#_3-6-1-aspectj-的通知类型","children":[]},{"level":3,"title":"3.6.2 AspectJ 的开发环境","slug":"_3-6-2-aspectj-的开发环境","link":"#_3-6-2-aspectj-的开发环境","children":[]},{"level":3,"title":"3.6.3 AspectJ基于注解","slug":"_3-6-3-aspectj基于注解","link":"#_3-6-3-aspectj基于注解","children":[]},{"level":3,"title":"3.6.4 AspectJ 基于XML","slug":"_3-6-4-aspectj-基于xml","link":"#_3-6-4-aspectj-基于xml","children":[]}]}],"git":{"createdTime":1678594861000,"updatedTime":1678594861000,"contributors":[{"name":"hahg2000","email":"61403802+hahg2000@users.noreply.github.com","commits":1}]},"readingTime":{"minutes":35.2,"words":10560},"filePathRelative":"学习/后端/SSM框架/Spring4/三、Spring与AOP.md","localizedDate":"2023年3月12日","excerpt":"<h1> 三、Spring与AOP</h1>\\n<h2> 3.1 AOP 的引入</h2>\\n<p>现在有个业务类，其实现了 IService 接口，里面有两个主业务逻辑方法和两个交叉业务逻辑。</p>\\n<img src=\\"https://raw.githubusercontent.com/hahg2000/SSMPic/main/aop引入1.png\\" style=\\"zoom:60%;\\">\\n<hr>\\n<p>此时提出一个问题：若有其它实现类同样也要调用这些事务、日志等处理方法怎么办？</p>\\n<ol>\\n<li>可以将业务逻辑作为父类，需要使用事务、日志的实现类就继承它即可。</li>\\n<li>将这些交叉业务逻辑代码放到专门的工具类或处理类中设置成静态方法，由主业务逻辑调用。</li>\\n</ol>","autoDesc":true}');export{e as data};
