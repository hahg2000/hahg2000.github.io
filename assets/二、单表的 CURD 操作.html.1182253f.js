const e=JSON.parse('{"key":"v-8572321a","path":"/%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/%E5%90%8E%E7%AB%AF/SSM%E6%A1%86%E6%9E%B6/MyBatis3/%E4%BA%8C%E3%80%81%E5%8D%95%E8%A1%A8%E7%9A%84%20CURD%20%E6%93%8D%E4%BD%9C.html","title":"\u4E8C\u3001\u5355\u8868\u7684 CURD \u64CD\u4F5C","lang":"zh-CN","frontmatter":{"tags":["SSM\u6846\u67B6","\u5B66\u4E60","MyBatis"],"readingTime":true,"autoNext":"\u4E09\u3001\u5173\u8054\u5173\u7CFB\u67E5\u8BE2","summary":"\u4E8C\u3001\u5355\u8868\u7684 CURD \u64CD\u4F5C \u200B\\tCURD \u64CD\u4F5C\uFF0C\u5373\u6307\u5BF9\u6570\u636E\u5E93\u4E2D\u5B9E\u4F53\u5BF9\u8C61\u7684 \u589E Create\u3001\u6539 Update\u3001\u67E5 Read\u3001\u5220 Delete \u64CD\u4F5C\u3002 2.1 \u81EA\u5B9A\u4E49 Dao \u63A5\u53E3\u5B9E\u73B0\u7C7B 2.1.1 \u4FEE\u6539 Dao \u63A5\u53E3 IStudentDao.java\uFF1A\u589E\u52A0 \u589E \u3001\u6539 \u3001\u67E5 \u3001\u5220 \u8FD9\u56DB\u4E2A\u63A5\u53E3\u65B9\u6CD5 2.1.2 \u5B9E\u73B0\u63D2\u5165\u540E\u83B7\u53D6 id \u65B9\u6CD5 \uFF081\uFF09\u4FEE\u6539\u6620\u5C04\u6587\u4EF6 \u200B\\t","head":[["meta",{"property":"og:url","content":"https://vuepress-theme-hope-v2-demo.mrhope.site/%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/%E5%90%8E%E7%AB%AF/SSM%E6%A1%86%E6%9E%B6/MyBatis3/%E4%BA%8C%E3%80%81%E5%8D%95%E8%A1%A8%E7%9A%84%20CURD%20%E6%93%8D%E4%BD%9C.html"}],["meta",{"property":"og:site_name","content":"HAHG\u7684\u535A\u5BA2"}],["meta",{"property":"og:title","content":"\u4E8C\u3001\u5355\u8868\u7684 CURD \u64CD\u4F5C"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:updated_time","content":"2022-09-27T14:47:05.000Z"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:tag","content":"SSM\u6846\u67B6"}],["meta",{"property":"article:tag","content":"\u5B66\u4E60"}],["meta",{"property":"article:tag","content":"MyBatis"}],["meta",{"property":"article:modified_time","content":"2022-09-27T14:47:05.000Z"}]]},"excerpt":"","headers":[{"level":2,"title":"2.1 \u81EA\u5B9A\u4E49 Dao \u63A5\u53E3\u5B9E\u73B0\u7C7B","slug":"_2-1-\u81EA\u5B9A\u4E49-dao-\u63A5\u53E3\u5B9E\u73B0\u7C7B","children":[{"level":3,"title":"2.1.1 \u4FEE\u6539 Dao \u63A5\u53E3","slug":"_2-1-1-\u4FEE\u6539-dao-\u63A5\u53E3","children":[]},{"level":3,"title":"2.1.2 \u5B9E\u73B0\u63D2\u5165\u540E\u83B7\u53D6 id \u65B9\u6CD5","slug":"_2-1-2-\u5B9E\u73B0\u63D2\u5165\u540E\u83B7\u53D6-id-\u65B9\u6CD5","children":[]},{"level":3,"title":"2.1.3 \u5220\u9664\u6570\u636E","slug":"_2-1-3-\u5220\u9664\u6570\u636E","children":[]},{"level":3,"title":"2.1.4 \u4FEE\u6539\u6570\u636E","slug":"_2-1-4-\u4FEE\u6539\u6570\u636E","children":[]},{"level":3,"title":"2.1.5 \u67E5\u8BE2\u6240\u6709\u5BF9\u8C61-\u8FD4\u56DE List","slug":"_2-1-5-\u67E5\u8BE2\u6240\u6709\u5BF9\u8C61-\u8FD4\u56DE-list","children":[]},{"level":3,"title":"2.1.6 \u67E5\u8BE2\u6240\u6709\u5BF9\u8C61-\u8FD4\u56DE Map","slug":"_2-1-6-\u67E5\u8BE2\u6240\u6709\u5BF9\u8C61-\u8FD4\u56DE-map","children":[]},{"level":3,"title":"2.1.7 \u67E5\u8BE2\u5355\u4E2A\u5BF9\u8C61","slug":"_2-1-7-\u67E5\u8BE2\u5355\u4E2A\u5BF9\u8C61","children":[]},{"level":3,"title":"2.1.8 \u6A21\u7CCA\u67E5\u8BE2","slug":"_2-1-8-\u6A21\u7CCA\u67E5\u8BE2","children":[]}]},{"level":2,"title":"2.2 \u5C5E\u6027\u540D\u4E0E\u5B57\u6BB5\u540D\u4E0D\u4E00\u81F4\u7684\u89E3\u51B3","slug":"_2-2-\u5C5E\u6027\u540D\u4E0E\u5B57\u6BB5\u540D\u4E0D\u4E00\u81F4\u7684\u89E3\u51B3","children":[{"level":3,"title":"2.1.1 \u4FEE\u6539 Student \u8868","slug":"_2-1-1-\u4FEE\u6539-student-\u8868","children":[]},{"level":3,"title":"2.1.2 \u4FEE\u6539\u6620\u5C04\u6587\u4EF6","slug":"_2-1-2-\u4FEE\u6539\u6620\u5C04\u6587\u4EF6","children":[]},{"level":3,"title":"2.1.3 \u76F4\u63A5\u8FD0\u884C","slug":"_2-1-3-\u76F4\u63A5\u8FD0\u884C","children":[]},{"level":3,"title":"2.1.4 \u4F7F\u7528\u522B\u540D","slug":"_2-1-4-\u4F7F\u7528\u522B\u540D","children":[]},{"level":3,"title":"2.1.5 \u4F7F\u7528\u7ED3\u679C\u6620\u5C04 resultMap","slug":"_2-1-5-\u4F7F\u7528\u7ED3\u679C\u6620\u5C04-resultmap","children":[]}]},{"level":2,"title":"2.3 Mappper \u52A8\u6001\u4EE3\u7406","slug":"_2-3-mappper-\u52A8\u6001\u4EE3\u7406","children":[{"level":3,"title":"2.3.1 \u6620\u5C04\u6587\u4EF6\u7684 namespace","slug":"_2-3-1-\u6620\u5C04\u6587\u4EF6\u7684-namespace","children":[]},{"level":3,"title":"2.3.2 Dao \u63A5\u53E3\u65B9\u6CD5\u540D","slug":"_2-3-2-dao-\u63A5\u53E3\u65B9\u6CD5\u540D","children":[]},{"level":3,"title":"2.3.3 Dao \u5BF9\u8C61\u7684\u83B7\u53D6","slug":"_2-3-3-dao-\u5BF9\u8C61\u7684\u83B7\u53D6","children":[]},{"level":3,"title":"2.3.4 \u6DFB\u52A0\u7EC6\u8282","slug":"_2-3-4-\u6DFB\u52A0\u7EC6\u8282","children":[]},{"level":3,"title":"2.3.5 \u591A\u67E5\u8BE2\u6761\u4EF6\u65E0\u6CD5\u6574\u4F53\u63A5\u6536\u95EE\u9898\u7684\u89E3\u51B3","slug":"_2-3-5-\u591A\u67E5\u8BE2\u6761\u4EF6\u65E0\u6CD5\u6574\u4F53\u63A5\u6536\u95EE\u9898\u7684\u89E3\u51B3","children":[]}]},{"level":2,"title":"2.4\u52A8\u6001SQL","slug":"_2-4\u52A8\u6001sql","children":[{"level":3,"title":"2.4.1 <if/> \u6807\u7B7E","slug":"_2-4-1-if-\u6807\u7B7E","children":[]},{"level":3,"title":"2.4.2 <where/> \u6807\u7B7E","slug":"_2-4-2-where-\u6807\u7B7E","children":[]},{"level":3,"title":"2.4.3 <choose/> \u6807\u7B7E","slug":"_2-4-3-choose-\u6807\u7B7E","children":[]},{"level":3,"title":"2.4.4 <foreach/> \u6807\u7B7E-\u904D\u5386\u6570\u7EC4","slug":"_2-4-4-foreach-\u6807\u7B7E-\u904D\u5386\u6570\u7EC4","children":[]},{"level":3,"title":"2.4.4 <foreach/> \u6807\u7B7E-\u904D\u5386\u57FA\u672C\u7C7B\u578B\u7684List","slug":"_2-4-4-foreach-\u6807\u7B7E-\u904D\u5386\u57FA\u672C\u7C7B\u578B\u7684list","children":[]},{"level":3,"title":"2.4.5 <foreach/> \u6807\u7B7E-\u904D\u5386\u6CDB\u578B\u7684List","slug":"_2-4-5-foreach-\u6807\u7B7E-\u904D\u5386\u6CDB\u578B\u7684list","children":[]},{"level":3,"title":"2.4.6 <sql/> \u6807\u7B7E","slug":"_2-4-6-sql-\u6807\u7B7E","children":[]}]}],"git":{"createdTime":1664290025000,"updatedTime":1664290025000,"contributors":[{"name":"hahg2000","email":"61403802+hahg2000@users.noreply.github.com","commits":1}]},"readingTime":{"minutes":18.51,"words":5553},"filePathRelative":"\u5B66\u4E60\u7B14\u8BB0/\u540E\u7AEF/SSM\u6846\u67B6/MyBatis3/\u4E8C\u3001\u5355\u8868\u7684 CURD \u64CD\u4F5C.md","localizedDate":"2022\u5E749\u670827\u65E5"}');export{e as data};
