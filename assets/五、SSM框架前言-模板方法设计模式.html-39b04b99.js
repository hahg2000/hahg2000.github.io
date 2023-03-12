import{_ as n,W as s,X as a,a2 as t}from"./framework-0bc3c581.js";const p={},e=t(`<h1 id="五、ssm框架前言-模板方法设计模式" tabindex="-1"><a class="header-anchor" href="#五、ssm框架前言-模板方法设计模式" aria-hidden="true">#</a> 五、SSM框架前言-模板方法设计模式</h1><h2 id="_5-1-引例" tabindex="-1"><a class="header-anchor" href="#_5-1-引例" aria-hidden="true">#</a> 5.1 引例</h2><p>​ 在现实生活中，完成某件事情是需要 n 个固定步骤的。如 “在淘宝网进行购物” 这件事情的完成一般需要三个步骤：登录网站、挑选商品、付款。但对于登录网站与付款这两步，每个人都是 <strong>差不多</strong> 的操作。但对于挑选商品来说，每个人挑选的商品都是不同的。</p><p>​ 在软件开发的过程同样存在这样的情况。某类的某个方法的实现，需要几个固定步骤，在这些固定步骤中，对于该类的不同对象，有些步骤的实现是固定不变的，有些是大相径庭的，有些是可变可不变的。对于这种情况，就适合使用模板方法设计模式编程。</p><p>​ 模板方法设计模式的定义是：定义一个操作中某种算法的框架，而将一些步骤延迟到子类中。模板方法模式使得子类在不该表一个算法结构的前提下，对某些步骤实现 <strong>个性化</strong> 定义。</p><h2 id="_5-2-模板方法程序的构成" tabindex="-1"><a class="header-anchor" href="#_5-2-模板方法程序的构成" aria-hidden="true">#</a> 5.2 模板方法程序的构成</h2><p>​ 在模板方法设计模式中，存在一个父类。其中包含两类方法：模板方法与步骤方法。</p><ul><li>模板方法，即实现某种算法的方法步骤。而这些步骤都是调用步骤方法完成的。</li><li>步骤方法，即完成模板方法的每个 <strong>阶段性</strong> 方法。每个步骤方法完成某一特定的、完成总算法的一部分功能。步骤方法有三种类型：抽象方法、最终方法与钩子方法。 <ul><li>抽象方法，是要求子类 <strong>必须</strong> 实现的方法，是完成模板方法的算法步骤中必须有子类完成的个性化定义。</li><li>最终方法，是子类 <strong>不能</strong> 重写的方法，对于所有子类都执行 <strong>一样</strong> 的方法。</li><li>钩子方法，是父类给出了默认实现，但子类也可以重写的方法。</li></ul></li></ul><h2 id="_5-3-程序举例" tabindex="-1"><a class="header-anchor" href="#_5-3-程序举例" aria-hidden="true">#</a> 5.3 程序举例</h2><h3 id="_5-3-1-定义父类" tabindex="-1"><a class="header-anchor" href="#_5-3-1-定义父类" aria-hidden="true">#</a> 5.3.1 定义父类</h3><p><strong>Shopping.java</strong>：先定义模板方法——用户登录、选择商品和付款，再定义步骤方法。用户登录为最终方法，子类不能重写所以使用 final 关键字；选择商品为抽象方法，子类必须实现所以使用 abstract 关键字。付款为钩子方法，子类可选择是否重写。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">Shopping</span> <span class="token punctuation">{</span>
	
	<span class="token comment">// 模板方法</span>
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">buyGoods</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token function">userLogin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token function">buy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token function">pay</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>

	<span class="token comment">// 子类不能重写的方法</span>
	<span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">void</span> <span class="token function">userLogin</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;用户登录&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
	
	<span class="token comment">// 子类必须实现</span>
	<span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">void</span> <span class="token function">buy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	
	<span class="token comment">// 钩子方法</span>
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">pay</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;使用银联卡支付&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-2-定义子类" tabindex="-1"><a class="header-anchor" href="#_5-3-2-定义子类" aria-hidden="true">#</a> 5.3.2 定义子类</h3><p>这里定义了两个子类，一个购买鞋子，一个购买衣服，其中购买衣服的子类重写了钩子方法。</p><p><strong>ClothesShopping.java</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ClothesShopping</span> <span class="token keyword">extends</span> <span class="token class-name">Shopping</span> <span class="token punctuation">{</span>

	<span class="token annotation punctuation">@Override</span>
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">buy</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;购买七匹狼男装&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
	
	<span class="token annotation punctuation">@Override</span>
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">pay</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;使用支付宝付款&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>ShoesShopping.java</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ShoesShopping</span> <span class="token keyword">extends</span> <span class="token class-name">Shopping</span> <span class="token punctuation">{</span>

	<span class="token annotation punctuation">@Override</span>
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">buy</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;购买红蜻蜓皮鞋&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-4-定义测试类" tabindex="-1"><a class="header-anchor" href="#_5-3-4-定义测试类" aria-hidden="true">#</a> 5.3.4 定义测试类</h3><p><strong>MyTest.java</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MyTest</span> <span class="token punctuation">{</span>
	<span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token class-name">Shopping</span> shoesShopping <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ShoesShopping</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		shoesShopping<span class="token punctuation">.</span><span class="token function">buyGoods</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;-----------------------&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token class-name">Shopping</span> clothesShopping <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ClothesShopping</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		clothesShopping<span class="token punctuation">.</span><span class="token function">buyGoods</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>运行结构如下图</p><img src="https://raw.githubusercontent.com/hahg2000/SSMPic/main/1612844148(1).png" style="zoom:85%;">`,23),o=[e];function c(i,l){return s(),a("div",null,o)}const d=n(p,[["render",c],["__file","五、SSM框架前言-模板方法设计模式.html.vue"]]);export{d as default};
