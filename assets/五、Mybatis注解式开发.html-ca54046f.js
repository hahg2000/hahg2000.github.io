const e=JSON.parse('{"key":"v-67e33bdc","path":"/%E5%AD%A6%E4%B9%A0/%E5%90%8E%E7%AB%AF/SSM%E6%A1%86%E6%9E%B6/MyBatis3/%E4%BA%94%E3%80%81Mybatis%E6%B3%A8%E8%A7%A3%E5%BC%8F%E5%BC%80%E5%8F%91.html","title":"五、Mybatis注解式开发","lang":"zh-CN","frontmatter":{"description":"五、Mybatis注解式开发 ​\\tmybatis 的注解，主要是用于替换映射文件。而映射文件中无非存放着增、删、改、查的SQL映射标签。所以，mybatis注解，就是要替换映射文件中的 SQL 标签。 ​\\tmybatis 官方文档中指出，若要真正想发挥 mybatis 功能，还是要用映射文件。即 mybatis 官方并不建议通过注解方式来使用 mybatis。 5.1注解的基础知识 以下注解知识的讲解，均使用使用@Overide、@Deprecated（过时）、@SuppressWarnings举例。","head":[["meta",{"property":"og:url","content":"https://hahg2000.github.io/%E5%AD%A6%E4%B9%A0/%E5%90%8E%E7%AB%AF/SSM%E6%A1%86%E6%9E%B6/MyBatis3/%E4%BA%94%E3%80%81Mybatis%E6%B3%A8%E8%A7%A3%E5%BC%8F%E5%BC%80%E5%8F%91.html"}],["meta",{"property":"og:title","content":"五、Mybatis注解式开发"}],["meta",{"property":"og:description","content":"五、Mybatis注解式开发 ​\\tmybatis 的注解，主要是用于替换映射文件。而映射文件中无非存放着增、删、改、查的SQL映射标签。所以，mybatis注解，就是要替换映射文件中的 SQL 标签。 ​\\tmybatis 官方文档中指出，若要真正想发挥 mybatis 功能，还是要用映射文件。即 mybatis 官方并不建议通过注解方式来使用 mybatis。 5.1注解的基础知识 以下注解知识的讲解，均使用使用@Overide、@Deprecated（过时）、@SuppressWarnings举例。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-03-12T04:21:01.000Z"}],["meta",{"property":"article:modified_time","content":"2023-03-12T04:21:01.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"五、Mybatis注解式开发\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2023-03-12T04:21:01.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":2,"title":"5.1注解的基础知识","slug":"_5-1注解的基础知识","link":"#_5-1注解的基础知识","children":[{"level":3,"title":"5.1.1注解的基础语法","slug":"_5-1-1注解的基础语法","link":"#_5-1-1注解的基础语法","children":[]},{"level":3,"title":"5.1.2注解的注解","slug":"_5-1-2注解的注解","link":"#_5-1-2注解的注解","children":[]},{"level":3,"title":"5.1.3注解的属性","slug":"_5-1-3注解的属性","link":"#_5-1-3注解的属性","children":[]}]},{"level":2,"title":"5.2 Mybatis注解","slug":"_5-2-mybatis注解","link":"#_5-2-mybatis注解","children":[{"level":3,"title":"5.2.1@Insert","slug":"_5-2-1-insert","link":"#_5-2-1-insert","children":[]},{"level":3,"title":"5.2.2 @SelectKey","slug":"_5-2-2-selectkey","link":"#_5-2-2-selectkey","children":[]},{"level":3,"title":"5.2.3 @Delete","slug":"_5-2-3-delete","link":"#_5-2-3-delete","children":[]},{"level":3,"title":"5.2.4 @Update","slug":"_5-2-4-update","link":"#_5-2-4-update","children":[]},{"level":3,"title":"5.2.5 @Select","slug":"_5-2-5-select","link":"#_5-2-5-select","children":[]},{"level":3,"title":"5.2.6 删除映射文件","slug":"_5-2-6-删除映射文件","link":"#_5-2-6-删除映射文件","children":[]},{"level":3,"title":"5.2.7 修改主配置文件","slug":"_5-2-7-修改主配置文件","link":"#_5-2-7-修改主配置文件","children":[]}]}],"git":{"createdTime":1678594861000,"updatedTime":1678594861000,"contributors":[{"name":"hahg2000","email":"61403802+hahg2000@users.noreply.github.com","commits":1}]},"readingTime":{"minutes":4.7,"words":1411},"filePathRelative":"学习/后端/SSM框架/MyBatis3/五、Mybatis注解式开发.md","localizedDate":"2023年3月12日","excerpt":"<h1> 五、Mybatis注解式开发</h1>\\n<p>​\\t<span style=\\"color:red\\">mybatis 的注解，主要是用于替换映射文件。</span>而映射文件中无非存放着增、删、改、查的SQL映射标签。所以，mybatis注解，就是要替换映射文件中的 SQL 标签。</p>\\n<p>​\\tmybatis 官方文档中指出，若要真正想发挥 mybatis 功能，还是要用映射文件。即 mybatis 官方并不建议通过注解方式来使用 mybatis。</p>\\n<h2> 5.1注解的基础知识</h2>\\n<p>以下注解知识的讲解，均使用使用@Overide、@Deprecated（过时）、@SuppressWarnings举例。</p>","autoDesc":true}');export{e as data};
