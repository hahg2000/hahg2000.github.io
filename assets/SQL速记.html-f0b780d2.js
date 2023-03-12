import{_ as n,W as s,X as a,a2 as e}from"./framework-0bc3c581.js";const t={},p=e(`<h1 id="sql速记" tabindex="-1"><a class="header-anchor" href="#sql速记" aria-hidden="true">#</a> SQL速记</h1><h2 id="一、常见数据类型" tabindex="-1"><a class="header-anchor" href="#一、常见数据类型" aria-hidden="true">#</a> 一、常见数据类型</h2><table><thead><tr><th>代码</th><th>说明</th></tr></thead><tbody><tr><td><code>INT</code></td><td>整型</td></tr><tr><td><code>DECIMAL(10, 4)</code></td><td>十进制数字。全部数字数量 10 个，其中 4 个在小数点后面</td></tr><tr><td><code>VARCHAR(3)</code></td><td>可变长字符串。最长 3 个字符的可变字符串</td></tr><tr><td><code>BLOB</code></td><td>大量二进制数据</td></tr><tr><td><code>DATE</code></td><td>&quot; YYYY - MM - DD &quot;</td></tr><tr><td><code>TIMESTAMP</code></td><td>&quot; YYYY - MM - DD HH : MM : SS &quot;</td></tr></tbody></table><h2 id="二、设计表格" tabindex="-1"><a class="header-anchor" href="#二、设计表格" aria-hidden="true">#</a> 二、设计表格</h2><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token comment">-- 创建表格</span>
<span class="token keyword">CREATE</span> <span class="token keyword">TABLE</span> student <span class="token punctuation">(</span>
	student_id <span class="token keyword">INT</span> <span class="token keyword">PRIMARY</span> <span class="token keyword">KEY</span><span class="token punctuation">,</span>
	name <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">20</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
	major <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">20</span><span class="token punctuation">)</span>
  <span class="token comment">-- PRIMARY KEY(student_id)</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">-- 约束列</span>
<span class="token keyword">CREATE</span> <span class="token keyword">TABLE</span> student <span class="token punctuation">(</span>
	student_id <span class="token keyword">INT</span> <span class="token keyword">AUTO_INCREMENT</span><span class="token punctuation">,</span> <span class="token comment">-- 自动增长</span>
	name <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">20</span><span class="token punctuation">)</span> <span class="token keyword">UNIQUE</span><span class="token punctuation">,</span> <span class="token comment">-- 不重复值</span>
	major <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">20</span><span class="token punctuation">)</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span><span class="token punctuation">,</span> <span class="token comment">-- 不为空</span>
	gpa <span class="token keyword">DECIMAL</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">)</span> <span class="token keyword">DEFAULT</span><span class="token punctuation">(</span><span class="token number">0.00</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token comment">-- 默认值</span>
  <span class="token keyword">PRIMARY</span> <span class="token keyword">KEY</span><span class="token punctuation">(</span>student_id<span class="token punctuation">)</span> <span class="token comment">-- 主键</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">-- 展示表格结构</span>
<span class="token keyword">DESCRIBE</span> student<span class="token punctuation">;</span>

<span class="token comment">-- 删除表格</span>
<span class="token keyword">DROP</span> <span class="token keyword">TABLE</span> student<span class="token punctuation">;</span>

<span class="token comment">-- 增加列</span>
<span class="token keyword">ALTER</span> <span class="token keyword">TABLE</span> student <span class="token keyword">ADD</span> <span class="token keyword">COLUMN</span> gpa <span class="token keyword">DECIMAL</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">)</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span><span class="token punctuation">;</span>
<span class="token comment">-- 删除列</span>
<span class="token keyword">ALTER</span> <span class="token keyword">TABLE</span> student <span class="token keyword">DROP</span> <span class="token keyword">COLUMN</span> gpa<span class="token punctuation">;</span>
<span class="token comment">-- 修改列</span>
<span class="token keyword">ALTER</span> <span class="token keyword">TABLE</span> student <span class="token keyword">MODIFY</span> <span class="token keyword">COLUMN</span> gpa <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">30</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、管理数据" tabindex="-1"><a class="header-anchor" href="#三、管理数据" aria-hidden="true">#</a> 三、管理数据</h2><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token comment">-- 插入全部列数据</span>
<span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> student <span class="token keyword">VALUES</span> <span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">&#39;John&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;Math&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">-- 插入部分列数据</span>
<span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> student<span class="token punctuation">(</span>student_id<span class="token punctuation">,</span> name<span class="token punctuation">)</span> <span class="token keyword">VALUES</span> <span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token string">&#39;Bot&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">-- 更新数据</span>
<span class="token keyword">UPDATE</span> student 
<span class="token keyword">SET</span> name <span class="token operator">=</span> <span class="token string">&#39;Tom&#39;</span><span class="token punctuation">,</span> major <span class="token operator">=</span> <span class="token string">&#39;undecided&#39;</span> <span class="token comment">-- 同时更新多个数据</span>
<span class="token keyword">WHERE</span> student_id <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">OR</span> name <span class="token operator">=</span> <span class="token string">&#39;Kate&#39;</span> <span class="token comment">-- 指定复杂的条件</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、基础查询" tabindex="-1"><a class="header-anchor" href="#四、基础查询" aria-hidden="true">#</a> 四、基础查询</h2><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token keyword">SELECT</span> <span class="token operator">*</span>
<span class="token keyword">FROM</span> student
<span class="token keyword">ORDER</span> <span class="token keyword">BY</span> student_id <span class="token keyword">ASC</span><span class="token punctuation">;</span> <span class="token comment">-- 顺序排列</span>
<span class="token comment">-- ORDER BY student_id DESC;  逆序排列</span>

<span class="token comment">-- 多个排序依据，先按name排序，如果相同再按student_id排序</span>
<span class="token keyword">SELECT</span> <span class="token operator">*</span>
<span class="token keyword">FROM</span> student
<span class="token keyword">ORDER</span> <span class="token keyword">BY</span> name<span class="token punctuation">,</span> student_id <span class="token keyword">DESC</span><span class="token punctuation">;</span>
<span class="token keyword">LIMIT</span> <span class="token number">2</span><span class="token punctuation">;</span>  <span class="token comment">-- 限制查询结果的行数</span>


<span class="token comment">--查询操作符</span>
<span class="token comment">-- &lt; , &gt;, &lt;=, &gt;=, =, &lt;&gt;(不等于), AND, OR</span>

<span class="token comment">-- 查询在给定的数据里，查询major等于Math或者Art</span>
<span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> student
<span class="token keyword">WHERE</span> major <span class="token operator">in</span> <span class="token punctuation">(</span><span class="token string">&#39;Math&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;Art&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9),o=[p];function c(l,d){return s(),a("div",null,o)}const u=n(t,[["render",c],["__file","SQL速记.html.vue"]]);export{u as default};
