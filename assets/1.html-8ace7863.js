import{_ as i,W as d,X as r,Y as o,Z as e,$ as n,a2 as c,C as a}from"./framework-0bc3c581.js";const p={},l=c('<h1 id="第-1-章-入门" tabindex="-1"><a class="header-anchor" href="#第-1-章-入门" aria-hidden="true">#</a> 第 1 章：入门</h1><h2 id="haskell编程环境" tabindex="-1"><a class="header-anchor" href="#haskell编程环境" aria-hidden="true">#</a> Haskell编程环境</h2><p>在本书的前面一些章节里，我们有时候会以限制性的、简单的形式来介绍一些概念。 由于Haskell是一本比较深的语言，所以一次性介绍某个主题的所有特性会令人难以接受。 当基础巩固后，我们就会进行更加深入的学习。</p><p>在Haskell语言的众多实现中，有两个被广泛应用，Hugs和GHC。其中Hugs是一个解释器，主要用于教学。而GHC(Glasgow Haskell Compiler)更加注重实践，它编译成本地代码，支持并行执行，并带有更好的性能分析工具和调试工具。由于这些因素，在本书中我们将采用GHC。</p><p>GHC主要有三个部分组成。</p><ul><li><strong>ghc</strong>是生成本地原生代码的优化编译器。</li><li><strong>ghci</strong>是一个交互解释器和调试器。</li><li><strong>runghc</strong>是一个以脚本形式(并不要首先编译)运行Haskell代码的程序，</li></ul><div class="hint-container note"><p class="hint-container-title">注</p><p>::: title Note</p></div><p>我们如何称呼GHC的各个组件</p><p>当我们讨论整个GHC系统时，我们称之为GHC。而如果要引用到某个特定的命令，我们会直接用其名字标识，比如<strong>ghc</strong>，<strong>ghci</strong>，<strong>runghc</strong>。 :::</p>',9),s=o("em",null,"建议",-1),h={href:"http://www.haskell.org/ghc/download.html",target:"_blank",rel:"noopener noreferrer"},g={href:"http://www.haskell.org/ghc/distribution_packages.html",target:"_blank",rel:"noopener noreferrer"},u=o("p",null,"我们在[附录A]中提供了更多详细的信息介绍如何在各个流行平台上安装GHC。",-1),q=o("h2",{id:"初识解释器ghci",tabindex:"-1"},[o("a",{class:"header-anchor",href:"#初识解释器ghci","aria-hidden":"true"},"#"),e(" 初识解释器ghci")],-1),f=o("p",null,[o("strong",null,"ghci"),e("程序是GHC的交互式解释器。它可以让用户输入Haskell表达式并对其求值，浏览模块以及调试代码。如果你熟悉Python或是Ruby，那么ghci一定程度上和"),o("code",null,"python"),e("，"),o("code",null,"irb"),e("很像，这两者分别是Python和Ruby的交互式解释器。")],-1),m=o("pre",null,[o("code",null,`The ghci command has a narrow focus
We typically can not copy some code out of a haskell source file and paste it into ghci. This does not have a significant effect on debugging pieces of code, but it can initially be surprising if you are used to , say, the interactive Python interpreter.
`)],-1),k=o("strong",null,"ghci",-1),x=o("strong",null,"ghci",-1),H={href:"http://book.realworldhaskell.org/read/installing-ghc-and-haskell-libraries.html#install.win",target:"_blank",rel:"noopener noreferrer"},_=c(`<p>当我们运行<strong>ghci</strong>时，它会首先显示一个初始banner，然后就显示提示符<code>Prelude&gt;</code>。下载例子展示的是Linux环境下的6.8.3版本。</p><pre><code>$ ghci
GHCi, version 6.8.3: http://www.haskell.org/ghc/  :? for help
Loading package base ... linking ... done.
Prelude&gt;
</code></pre><p>提示符<code>Prelude</code>标识一个很常用的库<code>Prelude</code>已经被加载并可以使用。同样的，当加载了其他模块或是源文件时，它们也会在出现在提示符的位子。</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>::: title Tip</p></div><p>获取帮助信息</p><p>在ghci提示符输入 :?，则会显示详细的帮助信息。 :::</p><p>模块<code>Prelude</code>有时候被称为&quot;标准序幕&quot;(the standard prelude)，因为它的内容是基于Haskell 98标准定义的。通常简称它为&quot;序幕&quot;(the prelude)。</p><div class="hint-container note"><p class="hint-container-title">注</p><p>::: title Note</p></div><p>关于ghci的提示符</p><p>提示符经常是随着模块的加载而变化。因此经常会变得很长以至在单行中没有太多可视区域用来输入。</p><p>为了简单和一致起见，在本书中我们会用字符串 &#39;ghci&gt;&#39; 来替代ghci的默认提示符。</p><p>你可以用ghci的 <code>:set prompt</code> 来进行修改。</p><pre><code>Prelude&gt; :set prompt &quot;ghci&gt;&quot;
ghci&gt; 
</code></pre><p>:::</p><p>prelude模块中的类型，值和函数是默认直接可用的，在使用之前我们不需要额外的操作。然而如果需要其他模块中的一些定义，则需要使用<strong>ghci</strong>的**:module**方法预先加载。</p><pre><code>ghci&gt; :module + Data.Ratio
</code></pre><p>现在我们就可以使用<code>Data.Ratio</code>模块中的功能了。这个模块提供了一些操作有理数的功能。</p><h2 id="基本交互-把ghci当作一个计算器" tabindex="-1"><a class="header-anchor" href="#基本交互-把ghci当作一个计算器" aria-hidden="true">#</a> 基本交互: 把ghci当作一个计算器</h2><p>除了能提供测试代码片段的交互功能外，<strong>ghci</strong>也可以被当作一个桌面计算器来使用。我们可以很容易的表示基本运算，同时随着对Haskell了解的深入，也可以表示更加复杂的运算。即使是以如此简单的方式来使用这个解释器，也可以帮助我们了解更多关于Haskell是如何工作的。</p><h3 id="基本算术运算" tabindex="-1"><a class="header-anchor" href="#基本算术运算" aria-hidden="true">#</a> 基本算术运算</h3><p>我们可以马上开始输入一些表达式，看看<strong>ghci</strong>会怎么处理它们。基本的算术表达式类似于像C或是Python这样的语言：用中缀表达式，即操作符在操作数之间。</p><pre><code>ghci&gt; 2 + 2
4
ghci&gt; 31337 * 101
3165037
ghci&gt; 7.0 / 2.0
3.5
</code></pre><p>用中缀表达式是为了书写方便：我们同样可以用前缀表达式，即操作符在操作数之前。在这种情况下，我们需要用括号将操作符括起来。</p><pre><code>ghci&gt; 2 + 2
4
ghci&gt; (+) 2 2
4
</code></pre><p>上述的这些表达式暗示了一个概念，Haskell有整数和浮点数类型。整数的大小是随意的。下面例子中的<code>(^)</code>表示了整数的乘方。</p><pre><code>ghci&gt; 313 ^ 15
27112218957718876716220410905036741257
</code></pre><h3 id="算术奇事-quirk-负数的表示" tabindex="-1"><a class="header-anchor" href="#算术奇事-quirk-负数的表示" aria-hidden="true">#</a> 算术奇事(quirk),负数的表示</h3><p>在如何表示数字方面Haskell提供给我们一个特性：通常需要将负数写在括号内。当我们要表示不是最简单的表达式时，这个特性就开始发挥影响。</p><p>我们先开始表示简单的负数</p><pre><code>ghci&gt; -3
-3
</code></pre><p>上述例子中的<code>-</code>是一元表达式。换句话说，我们并不是写了一个数字&quot;-3&quot;；而是一个数字&quot;3&quot;，然后作用于操作符<code>-</code>。<code>-</code>是Haskell中唯一的一元操作符，而且我们也不能将它和中缀运算符一起使用。</p><pre><code>ghci&gt; 2 + -3

&lt;interactive&gt;:1:0:
    precedence parsing error
        cannot mix \`(+)&#39; [infixl 6] and prefix \`-&#39; [infixl 6] in the same infix expression
</code></pre><p>如果需要在一个中缀操作符附近使用一元操作符，则需要将一元操作符以及其操作数包含的括号内。</p><pre><code>ghci&gt; 2 + (-3)
-1
ghci&gt; 3 + (-(13 * 37))
-478
</code></pre><p>如此可以避免解析的不确定性。当在Haskell应用(apply)一个函数时，我们先写函数名，然后随之其参数，比如<code>f 3</code>。如果我们不用括号括起一个负数，就会有非常明显的不同的方式理解<code>f-3</code>：它可以是&quot;将函数f应用(apply)与数字-3&quot;，或者是&quot;把变量f减去3&quot;。</p><p><em>大多数</em>情况下，我们可以省略表达式中的空格(&quot;空&quot;字符比如空格或制表符tab)，Haskell也同样能正确的解析。但并不是所有的情况。</p><pre><code>ghci&gt; 2*3
6
</code></pre><p>下面的例子和上面有问题的负数的例子很像，然而它的错误信息并不一样。</p><pre><code>ghci&gt; 2*-3

&lt;interactive&gt;:1:1: Not in scope: \`*-&#39;
</code></pre><p>这里Haskell把<code>*-</code>理解成单个的操作符。Haskell允许用户自定义新的操作符（这个主题我们随后会讲到），但是我们未曾定义过<code>*-</code>。</p><pre><code>ghci&gt; 2*(-3)
-6
</code></pre><p>相比较其他的编程语言，这种对于负数不太一样的行为可能会很些怪异，然后它是一种合理的折中方式。Haskell允许用户在任何时候自定义新的操作符。这是一个并不深奥的语言特性，我们会在以后的章节中看到许多用户定义的操作符。语言的设计者们为了拥有这个表达式强项而接受了这个有一点累赘的负数表达语法。</p><h3 id="布尔逻辑-运算符以及值比较" tabindex="-1"><a class="header-anchor" href="#布尔逻辑-运算符以及值比较" aria-hidden="true">#</a> 布尔逻辑，运算符以及值比较</h3><p>Haskell中表示布尔逻辑的值有这么两个：<code>True</code>和<code>False</code>。名字中的大写很重要。作用于布尔值得操作符类似于C语言的情况：<code>(&amp;&amp;)</code>表示&quot;逻辑与&quot;，<code>(||)</code>表示&quot;逻辑或&quot;。</p><pre><code>ghci&gt; True &amp;&amp; False
False
ghci&gt; False || True
True
</code></pre><p>有些编程语言中会定义数字0和<code>False</code>同义，但是在Haskell中并没有这么定义，同样的，也Haskell也没有定义非0的值为<code>True</code>。</p><pre><code>ghci&gt; True &amp;&amp; 1

&lt;interactive&gt;:1:8:
    No instance for (Num Bool)
      arising from the literal \`1&#39; at &lt;interactive&gt;:1:8
    Possible fix: add an instance declaration for (Num Bool)
    In the second argument of \`(&amp;&amp;)&#39;, namely \`1&#39;
    In the expression: True &amp;&amp; 1
    In the definition of \`it&#39;: it = True &amp;&amp; 1
</code></pre><p>我们再一次看到了很翔实的错误信息。简单来说，错误信息告诉我们布尔类型，<code>Bool</code>，不是数字类型，<code>Num</code>的一个成员。错误信息有些长，这是因为<strong>ghci</strong>会定位出错的具体位置，并且给出了也许能解决问题的修改提示。</p><p>错误信息详细分析如下。</p><ul><li>&quot;No instance for (Num Bool)&quot; 告诉我们<strong>ghci</strong>尝试解析数字<code>1</code>为<code>Bool</code>类型但是失败。</li><li>&quot;arising from the literal \`1&#39;&quot; 表示是由于使用了数字<code>1</code>而引发了问题。</li><li>&quot;In the definition of \`it&#39;&quot; 引用了一个<strong>ghci</strong>的快捷方式。我们会在后面提到。</li></ul><div class="hint-container tip"><p class="hint-container-title">提示</p><p>::: title Tip</p></div><p>遇到错误信息不要胆怯</p><p>这里我们提到了很重要的一点，而且在本书的前面一些章节中我们会重复提到。即使遇到自己不理解的问题或者错误信息，也不必惊慌。刚开始的时候，你所要的做的仅仅是找出足够的信息来帮助解决问题。随着你经验的积累，你会发现错误信息中的一部分其实很容易理解，并不会像刚开始时那么晦涩难懂。</p><p>各种错误信息都有一个目的：通过提前的一些调试，帮助我们在真正运行程序之前能书写出正确的代码。如果你曾使用过其它更加宽松(permissive)的语言，这种方式可能会有些震惊(shock).所以，拿出你的耐心来。 :::</p><p>Haskell中大多数比较操作符和C语言以及受C语言影响的语言类似。</p><pre><code>ghci&gt; 1 == 1
True
ghci&gt; 2 &lt; 3
True
ghci&gt; 4 &gt;= 3.99
True
</code></pre><p>有一个操作符和C语言的相应的不一样，&quot;不等于&quot;。C语言中是用<code>!=</code>表示的，而Haskell是用<code>/=</code>表示的，它看上去很像数学中的<code>≠</code>。</p><p>另外，类C的语言中通常用<code>!</code>表示逻辑非的操作，而Haskell中用函数<code>not</code>。</p><pre><code>ghci&gt; not True
False
</code></pre><h3 id="运算符优先级以及结合性" tabindex="-1"><a class="header-anchor" href="#运算符优先级以及结合性" aria-hidden="true">#</a> 运算符优先级以及结合性</h3><p>类似于代数或是使用中缀操作符的编程语言，Haskell也有操作符优先级的概念。我们可以使用括号将部分表达显示的组合在一起，同时操作符优先级允许省略掉一些括号。比如乘法比加法优先级高，因此以下两个表达式效果是一样的。</p><pre><code>ghci&gt; 1 + (4 * 4)
17
ghci&gt; 1 + 4 * 4
17
</code></pre><p>Haskell给每个操作符一个数值型的优先级值，从1表示最低优先级，到9表示最高优先级。高优先级的操作符先于低优先级的操作符被应用(apply)。在<strong>ghci</strong>中我们可以用命令**:info**来查看某个操作符的优先级。</p><pre><code>ghci&gt; :info (+)
class (Eq a, Show a) =&gt; Num a where
  (+) :: a -&gt; a -&gt; a
  ...
    -- Defined in GHC.Num
infixl 6 +
ghci&gt; :info (*)
class (Eq a, Show a) =&gt; Num a where
  ...
  (*) :: a -&gt; a -&gt; a
  ...
    -- Defined in GHC.Num
infixl 7 *
</code></pre><p>这里我们需要找的信息是&quot;infixl 6 +&quot;，表示<code>(+)</code>的优先级是6。（其他信息我们稍后介绍。）&quot;infixl 7 *&quot;表示<code>(*)</code>的优先级为7。由于<code>(*)</code>比<code>(+)</code>优先级高，所以我们看到为什么<code>1 + 4 * 4</code>和<code>1 + (4 * 4)</code>值相同而不是<code>(1 + 4) * 4</code>。</p><p>Haskell也定义了操作符的结合性(associativity)。它决定了当一个表达式中多次出现某个操作符时是否是从左到右求值。<code>(+)</code>和<code>(*)</code>都是左结合，在上述的<strong>ghci</strong>输出结果中以<code>infixl</code>表示。一个右结合的操作符会以<code>infixr</code>表示。</p><pre><code>ghci&gt; :info (^)
(^) :: (Num a, Integral b) =&gt; a -&gt; b -&gt; a   -- Defined in GHC.Real
infixr 8 ^
</code></pre><p>优先级和结合性规则的组合通常称之为固定性(<em>fixity</em>)规则。</p><h3 id="未定义的变量以及定义变量" tabindex="-1"><a class="header-anchor" href="#未定义的变量以及定义变量" aria-hidden="true">#</a> 未定义的变量以及定义变量</h3><p>Haskell的标准库prelude定义了至少一个大家熟知的数学常量。</p><pre><code>ghci&gt; pi
3.141592653589793
</code></pre><p>然后我们很快就会发现它对数学常量的覆盖并不是很广泛。让我们来看下Euler数，<code>e</code>。</p><pre><code>ghci&gt; e

&lt;interactive&gt;:1:0: Not in scope: \`e&#39;
</code></pre><p>啊哈，看上去我们必须得自己定义。</p><pre><code>不要担心错误信息
以上“not in the scope”的错误信息看上去有点令人畏惧的。别担心，它所要表达的只是没有用e这个名字定义过变量。
</code></pre><p>使用<strong>ghci</strong>的<code>let</code>构造(contruct)，我们可以定义一个临时变量<code>e</code>。</p><pre><code>ghci&gt; let e = exp 1
</code></pre><p>这是指数函数<code>exp</code>的一个应用，也是如何调用一个Haskell函数的第一个例子。 像Python这些语言，函数的参数是位于括号内的，但Haskell不要那样。</p><p>既然<code>e</code>已经定义好了，我们就可以在数学表达式中使用它。我们之前用到的乘方操作符<code>(^)</code>是对于整数的。如果要用浮点数作为指数，则需要操作符<code>(**)</code>。</p><pre><code>ghci&gt; (e ** pi) - pi
19.99909997918947
</code></pre><div class="hint-container note"><p class="hint-container-title">注</p><p>::: title Note</p></div><p>这是ghci的特殊语法</p><p>ghci 中 <code>let</code> 的语法和常规的&quot;top level&quot;的Haskell程序的使用不太一样。我们会在章节&quot;初识类型&quot;里看到常规的语法形式。 :::</p><h3 id="处理优先级以及结合性规则" tabindex="-1"><a class="header-anchor" href="#处理优先级以及结合性规则" aria-hidden="true">#</a> 处理优先级以及结合性规则</h3><p>有时候最好显式地加入一些括号，即使Haskell允许省略。它们会帮助将来的读者，包括我们自己，更好的理解代码的意图。</p><p>更加重要的，基于操作符优先级的复杂的表达式经常引发bug。对于一个简单的、没有括号的表达式，编译器和人总是很容易的对其意图产生不同的理解。</p><p>不需要去记住所有优先级和结合性规则：在你不确定的时候，加括号是最简单的方法。</p><h2 id="ghci里的命令行编辑" tabindex="-1"><a class="header-anchor" href="#ghci里的命令行编辑" aria-hidden="true">#</a> ghci里的命令行编辑</h2><p>在大多数系统中，<strong>ghci</strong>有些命令行编辑的功能。如果你对命令行编辑还不熟悉，它将会帮你节省大量的时间。 基本操作对于类Unix系统和Windows系统都很常规。按下<strong>向上</strong>方向键会显示你输入的上一条命令；重复输入<strong>向上</strong>方向键则会找到更早的一些输入。可以使用<strong>向左</strong>和<strong>向右</strong>方向键在当前行移动。 在类Unix系统中(很不幸，不是Windows)，<strong>制表键</strong>(tab)可以完成输入了一部分的标示符。</p><p>[译者注：]制表符的完成功能其实在Windows下也是可以的。</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>::: title Tip</p></div><p>哪里可以找到更多信息</p><p>我们只是蜻蜓点水般的介绍了下命令行编辑功能。因为命令行编辑系统可以让你更加有效的工作，你可能会觉得进一步的学习会有帮助。</p>`,93),b=o("strong",null,"ghci",-1),y={href:"http://tiswww.case.edu/php/chet/readline/rltop.html#Documentation",target:"_blank",rel:"noopener noreferrer"},C=o("strong",null,"ghci",-1),w={href:"http://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/doskey.mspx",target:"_blank",rel:"noopener noreferrer"},v=c(`<h2 id="列表-lists" tabindex="-1"><a class="header-anchor" href="#列表-lists" aria-hidden="true">#</a> 列表(Lists)</h2><p>一个列表由方括号以及被逗号分隔的元素组成。</p><pre><code>ghci&gt; [1, 2, 3]
[1,2,3]
</code></pre><div class="hint-container note"><p class="hint-container-title">注</p><p>::: title Note</p></div><p>逗号是分隔符，不是终结符</p><p>有些语言在表示列表时会在右中括号前多一个逗号，但是Haskell没有这样做。如果多出一个逗号(比如 <code>[1,2,]</code> )，则会导致编译错误。 :::</p><p>列表可以是任意长度。空列表表示成<code>[]</code>。</p><pre><code>ghci&gt; []
[]
ghci&gt; [&quot;foo&quot;, &quot;bar&quot;, &quot;baz&quot;, &quot;quux&quot;, &quot;fnord&quot;, &quot;xyzzy&quot;]
[&quot;foo&quot;,&quot;bar&quot;,&quot;baz&quot;,&quot;quux&quot;,&quot;fnord&quot;,&quot;xyzzy&quot;]
</code></pre><p>列表里所有的元素必须是相同类型。在下面的例子中我们违反了这个规则：列表中前面两个是<code>Bool</code>类型，最后一个是字符类型。</p><pre><code>ghci&gt; [True, False, &quot;testing&quot;]

&lt;interactive&gt;:1:14:
    Couldn&#39;t match expected type \`Bool&#39; against inferred type \`[Char]&#39;
      Expected type: Bool
      Inferred type: [Char]
    In the expression: &quot;testing&quot;
    In the expression: [True, False, &quot;testing&quot;]
</code></pre><p>这次<strong>ghci</strong>的错误信息也是同样的很详细。它告诉我们无法把字符串转换为布尔类型，因此无法定义这个列表表达式的类型。</p><p>如果用*列举符号(enumeration notation)*来表示一系列元素，Haskell则会自动填充内容。</p><pre><code>ghci&gt; [1..10]
[1,2,3,4,5,6,7,8,9,10]
</code></pre><p>字符<code>..</code>在这里表示列举(enumeration)。它只能用于那些可以被列举的类型。 因此对于字符类型来说这就没意义了。 比如对于<code>[&quot;foo&quot;..&quot;quux&quot;]</code>，没有任何意思，也没有通用的方式来对其进行列举。</p><p>顺便提一下，上面例子生成了一个闭区间，列表包含了两个端点的元素。</p><p>当使用列举时，我们可以通过最初两个元素之间步调的大小，来指明后续元素如何生成。</p><pre><code>ghci&gt; [1.0,1.25..2.0]
[1.0,1.25,1.5,1.75,2.0]

ghci&gt; [1,4..15]
[1,4,7,10,13]

ghci&gt; [10,9..1]
[10,9,8,7,6,5,4,3,2,1]
</code></pre><p>上述的第二个例子中，终点元素并未包含的列表内，是由于它不属于我们定义的系列元素。</p><p>我们可以省略列举的终点(end point)。如果类型没有自然的&quot;上限&quot;(upper bound)，那么会生成无穷列表。 比如，如果在<strong>ghci</strong>终端输入<code>[1..]</code>，那么就会输出一个无穷的连续数列，因此你不得不强制关闭或是杀掉<strong>ghci</strong>进程。在后面的章节章节中我们会看在Haskell中无穷数列经常会用到。</p><div class="hint-container note"><p class="hint-container-title">注</p><p>::: title Note</p></div><p>列举浮点数时要注意的</p><p>下面的例子看上并不那么直观</p><pre><code>ghci&gt; [1.0..1.8]
[1.0,2.0]
</code></pre><p>为了避免浮点数舍入的问题，Haskell就从 <code>1.0</code> 到 <code>1.8+0.5</code> 进行了列举。</p><p>对浮点数的列举有时候会有点特别，如果你不得不用，要注意。浮点数在任何语言里都显得有些怪异(quirky)，Haskell也不例外。 :::</p><h3 id="列表的操作符" tabindex="-1"><a class="header-anchor" href="#列表的操作符" aria-hidden="true">#</a> 列表的操作符</h3><p>有两个常见的用于列表的操作符。连接两个列表时使用<code>(++)</code>。</p><pre><code>ghci&gt; [3,1,3] ++ [3,7]
[3,1,3,3,7]
ghci&gt; [] ++ [False,True] ++ [True]
[False,True,True]
</code></pre><p>更加基础的操作符是 <code>(:)</code>，用于增加一个元素到列表的头部。它读成&quot;cons&quot;（即&quot;construct&quot;的简称）。</p><pre><code>ghci&gt; 1 : [2,3]
[1,2,3]
ghci&gt; 1 : []
[1]
</code></pre><p>你可能会尝试<code>[1,2]:3</code>给列表末尾增加一个元素，然而<strong>ghci</strong>会拒绝这样的表达式并给出错误信息，因为<code>(:)</code>的第一个参数必须是单个元素同时第二个必须是一个列表。</p><h2 id="字符串和字符" tabindex="-1"><a class="header-anchor" href="#字符串和字符" aria-hidden="true">#</a> 字符串和字符</h2><p>如果你熟悉Perl或是C语言，你会发现Haskell里表示字符串的符号很熟悉。</p><p>双引号所包含的就表示一个文本字符串。</p><pre><code>ghci&gt; &quot;This is a string.&quot;
&quot;This is a string.&quot;
</code></pre>`,35),P=o("code",null,"'\\n'",-1),T=o("code",null,"'\\t'",-1),N={href:"http://book.realworldhaskell.org/read/characters-strings-and-escaping-rules.html",target:"_blank",rel:"noopener noreferrer"},I=c(`<pre><code>ghci&gt; putStrLn &quot;Here&#39;s a newline --&gt;\\n&lt;-- See?&quot;
Here&#39;s a newline --&gt;
&lt;-- See?
</code></pre><p>函数<code>putStrLn</code>用于打印一个字符串。</p><p>Haskell区分单个字符和文本字符串。单个字符用单引号包含。</p><pre><code>ghci&gt; &#39;a&#39;
&#39;a&#39;
</code></pre><p>事实上，文本字符串是单一字符的列表。下面例子展示了表示一个短字符串的痛苦方式，而<strong>ghci</strong>的显示结果却是我们很熟悉的形式。</p><pre><code>ghci&gt; let a = [&#39;l&#39;, &#39;o&#39;, &#39;t&#39;, &#39;s&#39;, &#39; &#39;, &#39;o&#39;, &#39;f&#39;, &#39; &#39;, &#39;w&#39;, &#39;o&#39;, &#39;r&#39;, &#39;k&#39;]
ghci&gt; a
&quot;lots of work&quot;
ghci&gt; a == &quot;lots of work&quot;
True
</code></pre><p><code>&quot;&quot;</code>表示空字符串，它和<code>[]</code>同义。</p><pre><code>ghci&gt; &quot;&quot; == []
True
</code></pre><p>既然字符串就是单一字符的列表，那么我们就可以用列表的操作符来构造一个新的字符串。</p><pre><code>ghci&gt; &#39;a&#39;:&quot;bc&quot;
&quot;abc&quot;
ghci&gt; &quot;foo&quot; ++ &quot;bar&quot;
&quot;foobar&quot;
</code></pre><h2 id="初识类型" tabindex="-1"><a class="header-anchor" href="#初识类型" aria-hidden="true">#</a> 初识类型</h2><p>尽管前面的内容里提到了一些类型方面的事情，但直到目前为止，我们还没有使用ghci 进行过任何类型方面的交互：即使不告诉 ghci输入是什么类型，它也会很高兴地接受传给它的输入。</p><p>需要提醒的是，在 Haskell里，所有类型名字都以大写字母开头，而所有变量名字都以小写字母开头。紧记这一点，你就不会弄错类型和变量。</p><p>我们探索类型世界的第一步是修改 ghci，让它在返回表达式的求值结果时，打印出这个结果的类型。使用 ghci 的 <code>:set</code>命令可以做到这一点：</p><pre><code>Prelude&gt; :set +t

Prelude&gt; &#39;c&#39;    -- 输入表达式
&#39;c&#39;             -- 输出值
it :: Char      -- 输出值的类型

Prelude&gt; &quot;foo&quot;
&quot;foo&quot;
it :: [Char]
</code></pre><p>注意打印信息中那个神秘的 <code>it</code> ：这是一个有特殊用途的变量， ghci将最近一次求值所得的结果保存在这个变量里。（这不是 Haskell语言的特性，只是 ghci 的一个辅助功能而已。）</p><p>Ghci 打印的类型信息可以分为几个部分：</p><ul><li>它打印出 <code>it</code></li><li><code>x :: y</code> 表示表达式 <code>x</code> 的类型为 <code>y</code></li><li>第二个表达式的值的类型为 <code>[Char]</code> 。（类型 <code>String</code> 是 <code>[Char]</code> 的一个别名，它通常用于代替 <code>[Char]</code> 。）</li></ul><p>以下是另一个我们已经见过的类型：</p><pre><code>Prelude&gt; 7 ^ 80
40536215597144386832065866109016673800875222251012083746192454448001
it :: Integer
</code></pre><p>Haskell 的整数类型为 <code>Integer</code> 。 <code>Integer</code> 类型值的长度只受限于系统的内存大小。</p><p>分数和整数看上去不太相同，它使用 <code>%</code> 操作符构建，其中分子放在操作符左边，而分母放在操作符右边：</p><pre><code>Prelude&gt; :m +Data.Ratio
Prelude Data.Ratio&gt; 11 % 29
11 % 29
it :: Ratio Integer
</code></pre><p>为了方便用户， ghci 允许我们对很多命令进行缩写，这里的 <code>:m</code> 就是 <code>:module</code> 的缩写，它用于载入给定的模块。</p><p>注意这个分数的类型信息：在 <code>::</code> 的右边，有两个单词，分别是 <code>Ratio</code> 和 <code>Integer</code> ，可以将这个类型读作&quot;由整数构成的分数&quot;。这说明，分数的分子和分母必须都是整数类型，如果用一些别的类型值来构建分数，就会造成出错：</p><pre><code>Prelude Data.Ratio&gt; 3.14 % 8

&lt;interactive&gt;:8:1:
    Ambiguous type variable \`a0&#39; in the constraints:
        (Fractional a0)
            arising from the literal \`3.14&#39; at &lt;interactive&gt;:8:1-4
        (Integral a0) arising from a use of \`%&#39; at &lt;interactive&gt;:8:6
        (Num a0) arising from the literal \`8&#39; at &lt;interactive&gt;:8:8
    Probable fix: add a type signature that fixes these type variable(s)
    In the first argument of \`(%)&#39;, namely \`3.14&#39;
    In the expression: 3.14 % 8
    In an equation for \`it&#39;: it = 3.14 % 8

Prelude Data.Ratio&gt; 1.2 % 3.4

&lt;interactive&gt;:9:1:
    Ambiguous type variable \`a0&#39; in the constraints:
        (Fractional a0)
            arising from the literal \`1.2&#39; at &lt;interactive&gt;:9:1-3
        (Integral a0) arising from a use of \`%&#39; at &lt;interactive&gt;:9:5
    Probable fix: add a type signature that fixes these type variable(s)
    In the first argument of \`(%)&#39;, namely \`1.2&#39;
    In the expression: 1.2 % 3.4
    In an equation for \`it&#39;: it = 1.2 % 3.4
</code></pre><p>尽管每次都打印出值的类型很方便，但这实际上有点小题大作了。因为在一般情况下，表达式的类型并不难猜，或者我们并非对每个表达式的类型都感兴趣。所以这里用 <code>:unset</code> 命令取消对类型信息的打印：</p><pre><code>Prelude Data.Ratio&gt; :unset +t

Prelude Data.Ratio&gt; 2
2
</code></pre><p>取而代之的是，如果现在我们对某个值或者表达式的类型不清楚，那么可以用 <code>:type</code> 命令显式地打印它的类型信息：</p><pre><code>Prelude Data.Ratio&gt; :type &#39;a&#39;
&#39;a&#39; :: Char

Prelude Data.Ratio&gt; &quot;foo&quot;
&quot;foo&quot;

Prelude Data.Ratio&gt; :type it
it :: [Char]
</code></pre><p>注意 <code>:type</code> 并不实际执行传给它的表达式，它只是对输入进行检查，然后将输入的类型信息打印出来。以下两个例子显示了其中的区别：</p><pre><code>Prelude Data.Ratio&gt; 3 + 2
5

Prelude Data.Ratio&gt; :type it
it :: Integer

Prelude Data.Ratio&gt; :type 3 + 2
3 + 2 :: Num a =&gt; a
</code></pre><p>在前两个表达式中，我们先求值 <code>3+2</code> ，再使用 <code>:type</code> 命令打印 <code>it</code> 的类型，因为这时 <code>it</code> 已经是 <code>3+2</code> 的结果 <code>5</code> ，所以 <code>:type</code> 打印这个值的类型 <code>it :: Integer</code> 。</p><p>另一方面，最后的表达式中，我们直接将 <code>3+2</code> 传给 <code>:type</code> ，而 <code>:type</code> 并不对输入进行求值，因此它返回表达式的类型 <code>3 + 2 :: Num a =&gt; a</code> 。</p><p>第六章会介绍更多类型签名的相关信息。</p><h2 id="行计数程序" tabindex="-1"><a class="header-anchor" href="#行计数程序" aria-hidden="true">#</a> 行计数程序</h2><p>以下是一个用 Haskell 写的行计数程序。如果暂时看不太懂源码也没关系，先照着代码写写程序，热热身就行了。</p><p>使用编辑器，输入以下内容，并将它保存为 <code>WC.hs</code> ：</p><pre><code>-- file: ch01/WC.hs
-- lines beginning with &quot;--&quot; are comments.

main = interact wordCount
    where wordCount input = show (length (lines input)) ++ &quot;\\n&quot;
</code></pre><p>再创建一个 <code>quux.txt</code> ，包含以下内容：</p><pre><code>Teignmouth, England
Paris, France
Ulm, Germany
Auxerre, France
Brunswick, Germany
Beaumont-en-Auge, France
Ryazan, Russia
</code></pre><p>然后，在 shell 执行以下代码：</p><pre><code>$ runghc WC &lt; quux.txt 
7
</code></pre><p>恭喜你！你刚完成了一个非常有用的行计数程序（尽管它非常简单）。后面的章节会继续介绍更多有用的知识，帮助你（读者）写出属于自己的程序。</p><p>[译注：可能会让人有点迷惑，这个程序明明是一个行计数（line count）程序， 为什么却命名为 WC（word count）呢？ 实际上，在接下来的练习小节中，读者需要对这个程序进行修改，将它的功能从行计数改为单词计数，因此这里程序被命名为 <code>WC.hs</code> 。]</p><h2 id="练习" tabindex="-1"><a class="header-anchor" href="#练习" aria-hidden="true">#</a> 练习</h2><ol><li>在<strong>ghci</strong>里尝试下以下的这些表达式看看它们的类型是什么？</li></ol><ul><li><code>5 + 8</code></li><li><code>3 * 5 + 8</code></li><li><code>2 + 4</code></li><li><code>(+) 2 4</code></li><li><code>sqrt 16</code></li><li><code>succ 6</code></li><li><code>succ 7</code></li><li><code>pred 9</code></li><li><code>pred 8</code></li><li><code>sin (pi / 2)</code></li><li><code>truncate pi</code></li><li><code>round 3.5</code></li><li><code>round 3.4</code></li><li><code>floor 3.7</code></li><li><code>ceiling 3.3</code></li></ul><ol start="2"><li>在<strong>ghci</strong>里输入**:?**以或许帮助信息。定义一个变量，比如<code>let x = 1</code>,然后输入<code>:show bindings</code>.你看到了什么？</li><li>函数<code>words</code>计算一个字符串中的单词个数。修改例子<code>WC.hs</code>，使得可以计算一个文件中的单词个数。</li><li>再次修改<code>WC.hs</code>，可以输出一个文件的字符个数。</li></ol>`,49);function G(R,D){const t=a("ExternalLinkIcon");return d(),r("div",null,[l,o("p",null,[e("在本书中，我们假定你在使用最新版6.8.2版本的GHC，这个版本是2007年发布的。大多数例子不要额外的修改也能在老的版本上运行。然而，我们"),s,e("使用最新版本。如果你是Windows或者Mac OS X操作系统，你可以使用预编译的安装包快速上手。你可以从"),o("a",h,[e("GHC下载页面"),n(t)]),e("找到合适的二进制包或者安装包。")]),o("p",null,[e("对于大多数的Linux版本，BSD提供版和其他Unix系列，你可以找到自定义的GHC二进制包。由于这些包要基于特性的环境编译，所以安装和使用显得更加容易。你可以在GHC的"),o("a",g,[e("二进制发布包页面"),n(t)]),e("找到相关下载。")]),u,q,f,m,o("p",null,[e("在类Unix系统中，我们在shell视窗下运行"),k,e('。而在Windows系统下，你可以通过开始菜单找到它。比如，如果你在Windows XP下安装了GHC，你应该从"所有程序"，然后"GHC"下找到'),x,e("。(参考"),o("a",H,[e("附录A章节Windows"),n(t)]),e("里的截图。)")]),_,o("p",null,[e("在类Unix系统下，"),b,e("使用功能强大并且可定制化的"),o("a",y,[e("GNU readline library"),n(t)]),e("。在Windows系统下，"),C,e("的命令行编辑功能是由"),o("a",w,[e("doskey command"),n(t)]),e("提供的。 :::")]),v,o("p",null,[e('像其他语言一样，那些不显而易见的字符(hard-to-see)需要"转意"(escaping)。Haskell中需要转意的字符以及转意规则绝大大部分是和C语言中的情况一样的。比如 '),P,e("表示换行，"),T,e("表示制表符。完整的详细列表可以参照"),o("a",N,[e("附录B：字符，字符串和转义规则"),n(t)]),e("。")]),I])}const B=i(p,[["render",G],["__file","1.html.vue"]]);export{B as default};
