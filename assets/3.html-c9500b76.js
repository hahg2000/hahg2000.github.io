import{_ as c,W as t,X as a,Y as o,Z as e,$ as d,a2 as i,C as s}from"./framework-0bc3c581.js";const r={},p=i(`<h1 id="第-3-章-定义类型并简化函数" tabindex="-1"><a class="header-anchor" href="#第-3-章-定义类型并简化函数" aria-hidden="true">#</a> 第 3 章：定义类型并简化函数</h1><h2 id="定义新的数据类型" tabindex="-1"><a class="header-anchor" href="#定义新的数据类型" aria-hidden="true">#</a> 定义新的数据类型</h2><p>尽管列表和元组都非常有用，但是，定义新的数据类型也是一种常见的需求，这种能力使得我们可以为程序中的值添加结构。</p><p>而且比起使用元组，对一簇相关的值赋予一个名字和一个独一无二的类型显得更有用一些。</p><p>定义新的数据类型也提升了代码的安全性：Haskell 不会允许我们混用两个结构相同但类型不同的值。</p><p>本章将以一个在线书店为例子，展示如何去进行类型定义。</p><p>使用 <code>data</code> 关键字可以定义新的数据类型：</p><pre><code>-- file: ch03/BookStore.hs
data BookInfo = Book Int String [String]
                deriving (Show)
</code></pre><p>跟在 <code>data</code> 关键字之后的 <code>BookInfo</code> 就是新类型的名字，我们称 <code>BookInfo</code> 为<em>类型构造器</em>。类型构造器用于指代（refer）类型。正如前面提到过的，类型名字的首字母必须大写，因此，类型构造器的首字母也必须大写。</p><p>接下来的 <code>Book</code> 是<em>值构造器</em>（有时候也称为数据构造器）的名字。类型的值就是由值构造器创建的。值构造器名字的首字母也必须大写。</p><p>在 <code>Book</code> 之后的 <code>Int</code> ， <code>String</code> 和 <code>[String]</code> 是类型的<em>组成部分</em>。组成部分的作用，和面向对象语言的类中的域作用一致：它是一个储存值的槽。（为了方便起见，我们通常也将组成部分称为域。）</p><p>在这个例子中， <code>Int</code> 表示一本书的 ID ，而 <code>String</code> 表示书名，而 <code>[String]</code> 则代表作者。</p><p><code>BookInfo</code> 类型包含的成分和一个 <code>(Int, String, [String])</code> 类型的三元组一样，它们唯一不相同的是类型。[译注：这里指的是整个值的类型，不是成分的类型。]我们不能混用结构相同但类型不同的值。</p><p>举个例子，以下的 <code>MagzineInfo</code> 类型的成分和 <code>BookInfo</code> 一模一样，但 Haskell 会将它们作为不同的类型来区别对待，因为它们的类型构构造器和值构造器并不相同：</p><pre><code>-- file: ch03/BookStore.hs
data MagzineInfo = Magzine Int String [String]
                   deriving (Show)
</code></pre><p>可以将值构造器看作是一个函数 ------ 它创建并返回某个类型值。在这个书店的例子里，我们将 <code>Int</code> 、 <code>String</code> 和 <code>[String]</code> 三个类型的值应用到 <code>Book</code> ，从而创建一个 <code>BookInfo</code> 类型的值：</p><pre><code>-- file: ch03/BookStore.hs
myInfo = Book 9780135072455 &quot;Algebra of Programming&quot;
              [&quot;Richard Bird&quot;, &quot;Oege de Moor&quot;]
</code></pre><p>定义类型的工作完成之后，可以到 ghci 里载入并测试这些新类型：</p><pre><code>Prelude&gt; :load BookStore.hs
[1 of 1] Compiling Main             ( BookStore.hs, interpreted )
Ok, modules loaded: Main.
</code></pre><p>再看看前面在文件里定义的 <code>myInfo</code> 变量：</p><pre><code>*Main&gt; myInfo
Book 9780135072455 &quot;Algebra of Programming&quot; [&quot;Richard Bird&quot;,&quot;Oege de Moor&quot;]
</code></pre><p>在 ghci 里面当然也可以创建新的 <code>BookInfo</code> 值：</p><pre><code>*Main&gt; Book 0 &quot;The Book of Imaginary Beings&quot; [&quot;Jorge Luis Borges&quot;]
Book 0 &quot;The Book of Imaginary Beings&quot; [&quot;Jorge Luis Borges&quot;]
</code></pre><p>可以用 <code>:type</code> 命令来查看表达式的值：</p><pre><code>*Main&gt; :type Book 1 &quot;Cosmicomics&quot; [&quot;Italo Calvino&quot;]
Book 1 &quot;Cosmicomics&quot; [&quot;Italo Calvino&quot;] :: BookInfo
</code></pre><p>请记住，在 ghci 里定义变量的语法和在源码文件里定义变量的语法并不相同。在 ghci 里，变量通过 <code>let</code> 定义：</p><pre><code>*Main&gt; let cities = Book 173 &quot;Use of Weapons&quot; [&quot;Iain M. Banks&quot;]
</code></pre><p>使用 <code>:info</code> 命令可以查看更多关于给定表达式的信息：</p><pre><code>*Main&gt; :info BookInfo
data BookInfo = Book Int String [String]
    -- Defined at BookStore.hs:2:6
    instance Show BookInfo -- Defined at BookStore.hs:3:27
</code></pre><p>使用 <code>:type</code> 命令，可以查看值构造器 <code>Book</code> 的类型签名，了解它是如何创建出 <code>BookInfo</code> 类型的值的：</p><pre><code>*Main&gt; :type Book
Book :: Int -&gt; String -&gt; [String] -&gt; BookInfo
</code></pre><h3 id="类型构造器和值构造器的命名" tabindex="-1"><a class="header-anchor" href="#类型构造器和值构造器的命名" aria-hidden="true">#</a> 类型构造器和值构造器的命名</h3><p>在前面介绍 <code>BookInfo</code> 类型的时候，我们专门为类型构造器和值构造器设置了不同的名字（ <code>BookInfo</code> 和 <code>Book</code> ），这样区分起来比较容易。</p><p>在 Haskell 里，类型的名字（类型构造器）和值构造器的名字是相互独立的。类型构造器只能出现在类型的定义，或者类型签名当中。而值构造器只能出现在实际的代码中。因为存在这种差别，给类型构造器和值构造器赋予一个相同的名字实际上并不会产生任何问题。</p><p>以下是这种用法的一个例子：</p><pre><code>-- file: ch03/BookStore.hs
-- 稍后就会介绍 CustomerID 的定义

data BookReview = BookReview BookInfo CustomerID String
</code></pre><p>以上代码定义了一个 <code>BookReview</code> 类型，并且它的值构造器的名字也同样是 <code>BookReview</code> 。</p><h2 id="类型别名" tabindex="-1"><a class="header-anchor" href="#类型别名" aria-hidden="true">#</a> 类型别名</h2><p>可以使用<em>类型别名</em>，来为一个已存在的类型设置一个更具描述性的名字。</p><p>比如说，在前面 <code>BookReview</code> 类型的定义里，并没有说明 <code>String</code> 成分是干什么用的，通过类型别名，可以解决这个问题：</p><pre><code>-- file: ch03/BookStore.hs
type CustomerID = Int
type ReviewBody = String

data BetterReview = BetterReview BookInfo CustomerID ReviewBody
</code></pre><p><code>type</code> 关键字用于设置类型别名，其中新的类型名字放在 <code>=</code> 号的左边，而已有的类型名字放在 <code>=</code> 号的右边。这两个名字都标识同一个类型，因此，类型别名<em>完全是</em>为了提高可读性而存在的。</p><p>类型别名也可以用来为啰嗦的类型设置一个更短的名字：</p><pre><code>-- file: ch03/BookStore.hs
type BookRecord = (BookInfo, BookReview)
</code></pre><p>需要注意的是，类型别名只是为已有类型提供了一个新名字，创建值的工作还是由原来类型的值构造器进行。[注：如果你熟悉 C 或者 C++ ，可以将 Haskell 的类型别名看作是 <code>typedef</code> 。]</p><h2 id="代数数据类型" tabindex="-1"><a class="header-anchor" href="#代数数据类型" aria-hidden="true">#</a> 代数数据类型</h2><p><code>Bool</code> 类型是<em>代数数据类型</em>（algebraic data type）的最简单也是最常见的例子。一个代数类型可以有多于一个值构造器：</p><p>::: literalinclude /code/ch03/Bool.hs :::</p><p>上面代码定义的 <code>Bool</code> 类型拥有两个值构造器，一个是 <code>True</code> ，另一个是 <code>False</code> 。每个值构造器使用 <code>|</code> 符号分割，读作&quot;或者&quot; ------ 以 <code>Bool</code> 类型为例子，我们可以说， <code>Bool</code> 类型由 <code>True</code> 值或者 <code>False</code> 值构成。</p><p>当一个类型拥有一个以上的值构造器时，这些值构造器通常被称为&quot;备选&quot;（alternatives）或&quot;分支&quot;（case）。同一类型的所有备选，创建出的的值的类型都是相同的。</p><p>代数数据类型的各个值构造器都可以接受任意个数的参数。[译注：不同备选之间接受的参数个数不必相同，参数的类型也可以不一样。]以下是一个账单数据的例子：</p><pre><code>-- file: ch03/BookStore.hs
type CardHolder = String
type CardNumber = String
type Address = [String]
data BillingInfo = CreditCard CardNumber CardHolder Address
                 | CashOnDelivery
                 | Invoice CustomerID
                   deriving (Show)
</code></pre><p>这个程序提供了三种付款的方式。如果使用信用卡付款，就要使用 <code>CreditCard</code> 作为值构造器，并输入信用卡卡号、信用卡持有人和地址作为参数。如果即时支付现金，就不用接受任何参数。最后，可以通过货到付款的方式来收款，在这种情况下，只需要填写客户的 ID 就可以了。</p><p>当使用值构造器来创建 <code>BillingInfo</code> 类型的值时，必须提供这个值构造器所需的参数：</p><pre><code>Prelude&gt; :load BookStore.hs
[1 of 1] Compiling Main             ( BookStore.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; :type CreditCard
CreditCard :: CardNumber -&gt; CardHolder -&gt; Address -&gt; BillingInfo

*Main&gt; CreditCard &quot;2901650221064486&quot; &quot;Thomas Gradgrind&quot; [&quot;Dickens&quot;, &quot;England&quot;]
CreditCard &quot;2901650221064486&quot; &quot;Thomas Gradgrind&quot; [&quot;Dickens&quot;,&quot;England&quot;]

*Main&gt; :type it
it :: BillingInfo
</code></pre><p>如果输入参数的类型不对或者数量不对，那么引发一个错误：</p><pre><code>*Main&gt; Invoice

&lt;interactive&gt;:7:1:
    No instance for (Show (CustomerID -&gt; BillingInfo))
        arising from a use of \`print&#39;
    Possible fix:
        add an instance declaration for (Show (CustomerID -&gt; BillingInfo))
    In a stmt of an interactive GHCi command: print it
</code></pre><p>ghci 抱怨我们没有给 <code>Invoice</code> 值构造器足够的参数。</p><p>[译注：原文这里的代码示例有错，译文已改正。]</p><h3 id="什么情况下该用元组-而什么情况下又该用代数数据类型" tabindex="-1"><a class="header-anchor" href="#什么情况下该用元组-而什么情况下又该用代数数据类型" aria-hidden="true">#</a> 什么情况下该用元组，而什么情况下又该用代数数据类型？</h3><p>元组和自定义代数数据类型有一些相似的地方。比如说，可以使用一个 <code>(Int, String, [String])</code> 类型的元组来代替 <code>BookInfo</code> 类型：</p><pre><code>*Main&gt; Book 2 &quot;The Wealth of Networks&quot; [&quot;Yochai Benkler&quot;]
Book 2 &quot;The Wealth of Networks&quot; [&quot;Yochai Benkler&quot;]

*Main&gt; (2, &quot;The Wealth of Networks&quot;, [&quot;Yochai Benkler&quot;])
(2,&quot;The Wealth of Networks&quot;,[&quot;Yochai Benkler&quot;])
</code></pre><p>代数数据类型使得我们可以在结构相同但类型不同的数据之间进行区分。然而，对于元组来说，只要元素的结构和类型都一致，那么元组的类型就是相同的：</p><pre><code>-- file: ch03/Distinction.hs
a = (&quot;Porpoise&quot;, &quot;Grey&quot;)
b = (&quot;Table&quot;, &quot;Oak&quot;)
</code></pre><p>其中 <code>a</code> 和 <code>b</code> 的类型相同：</p><pre><code>Prelude&gt; :load Distinction.hs
[1 of 1] Compiling Main             ( Distinction.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; :type a
a :: ([Char], [Char])

*Main&gt; :type b
b :: ([Char], [Char])
</code></pre><p>对于两个不同的代数数据类型来说，即使值构造器成分的结构和类型都相同，它们也是不同的类型：</p><pre><code>-- file: ch03/Distinction.hs
data Cetacean = Cetacean String String
data Furniture = Furniture String String

c = Cetacean &quot;Porpoise&quot; &quot;Grey&quot;
d = Furniture &quot;Table&quot; &quot;Oak&quot;
</code></pre><p>其中 <code>c</code> 和 <code>d</code> 的类型并不相同：</p><pre><code>Prelude&gt; :load Distinction.hs
[1 of 1] Compiling Main             ( Distinction.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; :type c
c :: Cetacean

*Main&gt; :type d
d :: Furniture
</code></pre><p>以下是一个更细致的例子，它用两种不同的方式表示二维向量：</p><p>::: literalinclude /code/ch03/AlgebraicVector.hs :::</p><p><code>Cartesian2D</code> 和 <code>Polar2D</code> 两种类型的成分都是 <code>Double</code> 类型，但是，这些成分表达的是不同的<em>意思</em>。因为 <code>Cartesian2D</code> 和 <code>Polar2D</code> 是不同的类型，因此 Haskell 不会允许混淆使用这两种类型：</p><pre><code>Prelude&gt; :load AlgebraicVector.hs
[1 of 1] Compiling Main             ( AlgebraicVector.hs, interpreted )
Ok, modules loaded: Main.
*Main&gt; Cartesian2D (sqrt 2) (sqrt 2) == Polar2D (pi / 4) 2

&lt;interactive&gt;:3:34:
    Couldn&#39;t match expected type \`Cartesian2D&#39;
with actual type \`Polar2D&#39;
    In the return type of a call of \`Polar2D&#39;
In the second argument of \`(==)&#39;, namely \`Polar2D (pi / 4) 2&#39;
In the expression:
    Cartesian2D (sqrt 2) (sqrt 2) == Polar2D (pi / 4) 2
</code></pre><p>错误信息显示， <code>(==)</code> 操作符只接受类型相同的值作为它的参数，在类型签名里也可以看出这一点：</p><pre><code>*Main&gt; :type (==)
(==) :: Eq a =&gt; a -&gt; a -&gt; Bool
</code></pre><p>另一方面，如果使用类型为 <code>(Double, Double)</code> 的元组来表示二维向量的两种表示方式，那么我们就有麻烦了：</p><pre><code>Prelude&gt; -- 第一个元组使用 Cartesian 表示，第二个元组使用 Polar 表示
Prelude&gt; (1, 2) == (1, 2)
True
</code></pre><p>类型系统不会察觉到，我们正错误地对比两种不同表示方式的值，因为对两个类型相同的元组进行对比是完全合法的！</p><p>关于该使用元组还是该使用代数数据类型，没有一劳永逸的办法。但是，有一个经验法则可以参考：如果程序大量使用复合数据，那么使用 <code>data</code> 进行类型自定义对于类型安全和可读性都有好处。而对于小规模的内部应用，那么通常使用元组就足够了。</p><h3 id="其他语言里类似代数数据类型的东西" tabindex="-1"><a class="header-anchor" href="#其他语言里类似代数数据类型的东西" aria-hidden="true">#</a> 其他语言里类似代数数据类型的东西</h3><p>代数数据类型为描述数据类型提供了一种单一且强大的方式。很多其他语言，要达到相当于代数数据类型的表达能力，需要同时使用多种特性。</p><p>以下是一些 C 和 C++ 方面的例子，说明怎样在这些语言里，怎么样实现类似于代数数据类型的功能。</p><h4 id="结构" tabindex="-1"><a class="header-anchor" href="#结构" aria-hidden="true">#</a> 结构</h4><p>当只有一个值构造器时，代数数据类型和元组很相似：它将一系列相关的值打包成一个复合值。这种做法相当于 C 和 C++ 里的 <code>struct</code> ，而代数数据类型的成分则相当于 <code>struct</code> 里的域。</p><p>以下是一个 C 结构，它等同于我们前面定义的 <code>BookInfo</code> 类型：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">struct</span> <span class="token class-name">book_info</span> <span class="token punctuation">{</span>
    <span class="token keyword">int</span> id<span class="token punctuation">;</span>
    <span class="token keyword">char</span> <span class="token operator">*</span>name<span class="token punctuation">;</span>
    <span class="token keyword">char</span> <span class="token operator">*</span><span class="token operator">*</span>authors<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>目前来说， C 结构和 Haskell 的代数数据类型最大的差别是，代数数据类型的成分是匿名且按位置排序的：</p><pre><code>--file: ch03/BookStore.hs
data BookInfo = Book Int String [String]
                deriving (Show)
</code></pre><p>按位置排序指的是，对成分的访问是通过位置来实行的，而不是像 C 那样，通过名字：比如 <code>book_info-&gt;id</code> 。</p><p>稍后的&quot;模式匹配&quot;小节会介绍如何访代数数据类型里的成分。在&quot;记录&quot;一节会介绍定义数据的新语法，通过这种语法，可以像 C 结构那样，使用名字来访问相应的成分。</p><h4 id="枚举" tabindex="-1"><a class="header-anchor" href="#枚举" aria-hidden="true">#</a> 枚举</h4><p>C 和 C++ 里的 <code>enum</code> 通常用于表示一系列符号值排列。代数数据类型里面也有相似的东西，一般称之为<em>枚举类型</em>。</p><p>以下是一个 <code>enum</code> 例子：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">enum</span> <span class="token class-name">roygbiv</span> <span class="token punctuation">{</span>
    red<span class="token punctuation">,</span>
    orange<span class="token punctuation">,</span>
    yellow<span class="token punctuation">,</span>
    green<span class="token punctuation">,</span>
    blue<span class="token punctuation">,</span>
    indigo<span class="token punctuation">,</span>
    violet<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以下是等价的 Haskell 代码：</p><p>::: literalinclude /code/ch03/Roygbiv.hs :::</p><p>在 ghci 里面测试：</p><pre><code>Prelude&gt; :load Roygbiv.hs
[1 of 1] Compiling Main             ( Roygbiv.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; :type Yellow
Yellow :: Roygbiv

*Main&gt; :type Red
Red :: Roygbiv

*Main&gt; Red == Yellow
False

*Main&gt; Green == Green
True
</code></pre><p><code>enum</code> 的问题是，它使用整数值去代表元素：在一些接受 <code>enum</code> 的场景里，可以将整数传进去，C 编译器会自动进行类型转换。同样，在使用整数的场景里，也可以将一个 <code>enum</code> 元素传进去。这种用法可能会造成一些令人不爽的 bug 。</p><p>另一方面，在 Haskell 里就没有这样的问题。比如说，不可能使用 <code>Roygbiv</code> 里的某个值来代替 <code>Int</code> 值[译注：因为枚举类型的每个元素都由一个唯一的值构造器生成，而不是使用整数表示。]：</p><pre><code>*Main&gt; take 3 &quot;foobar&quot;
&quot;foo&quot;

*Main&gt; take Red &quot;foobar&quot;

&lt;interactive&gt;:9:6:
    Couldn&#39;t match expected type \`Int&#39; with actual type \`Roygbiv&#39;
    In the first argument of \`take&#39;, namely \`Red&#39;
    In the expression: take Red &quot;foobar&quot;
    In an equation for \`it&#39;: it = take Red &quot;foobar&quot;
</code></pre><h4 id="联合" tabindex="-1"><a class="header-anchor" href="#联合" aria-hidden="true">#</a> 联合</h4><p>如果一个代数数据类型有多个备选，那么可以将它看作是 C 或 C++ 里的 <code>union</code> 。</p><p>以上两者的一个主要区别是， <code>union</code> 并不告诉用户，当前使用的是哪一个备选， <code>union</code> 的使用者必须自己记录这方面的信息（通常使用一个额外的域来保存），这意味着，如果搞错了备选的信息，那么对 <code>union</code> 的使用就会出错。</p><p>以下是一个 <code>union</code> 例子：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">enum</span> <span class="token class-name">shape_type</span> <span class="token punctuation">{</span>
    shape_circle<span class="token punctuation">,</span>
    shape_poly<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">struct</span> <span class="token class-name">circle</span> <span class="token punctuation">{</span>
    <span class="token keyword">struct</span> <span class="token class-name">vector</span> centre<span class="token punctuation">;</span>
    <span class="token keyword">float</span> radius<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">struct</span> <span class="token class-name">poly</span> <span class="token punctuation">{</span>
    <span class="token class-name">size_t</span> num_vertices<span class="token punctuation">;</span>
    <span class="token keyword">struct</span> <span class="token class-name">vector</span> <span class="token operator">*</span>vertices<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">struct</span> <span class="token class-name">shape</span>
<span class="token punctuation">{</span>
    <span class="token keyword">enum</span> <span class="token class-name">shape_type</span> type<span class="token punctuation">;</span>
    <span class="token keyword">union</span> <span class="token punctuation">{</span>
    <span class="token keyword">struct</span> <span class="token class-name">circle</span> circle<span class="token punctuation">;</span>
    <span class="token keyword">struct</span> <span class="token class-name">poly</span> poly<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> shape<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面的代码里， <code>shape</code> 域的值可以是一个 <code>circle</code> 结构，也可以是一个 <code>poly</code> 结构。 <code>shape_type</code> 用于记录目前 <code>shape</code> 正在使用的结构类型。</p><p>另一方面，Haskell 版本不仅简单，而且更为安全：</p><p>::: literalinclude /code/ch03/ShapeUnion.hs :::</p><p>[译注：原文的代码少了 <code>deriving (Show)</code> 一行，在 ghci 测试时会出错。]</p><p>注意，我们不必像 C 语言那样，使用 <code>shape_type</code> 域来手动记录 <code>Shape</code> 类型的值是由 <code>Circle</code> 构造器生成的，还是由 <code>Poly</code> 构造器生成， Haskell 自己有办法弄清楚一点，它不会弄混两种不同的值。其中的原因，下一节《模式匹配》就会讲到。</p><p>[译注：原文这里将 <code>Poly</code> 写成了 <code>Square</code> 。]</p><h2 id="模式匹配" tabindex="-1"><a class="header-anchor" href="#模式匹配" aria-hidden="true">#</a> 模式匹配</h2><p>前面的章节介绍了代数数据类型的定义方法，本节将说明怎样去处理这些类型的值。</p><p>对于某个类型的值来说，应该可以做到以下两点：</p><ul><li>如果这个类型有一个以上的值构造器，那么应该可以知道，这个值是由哪个构造器创建的。</li><li>如果一个值构造器包含不同的成分，那么应该有办法提取这些成分。</li></ul><p>对于以上两个问题， Haskell 有一个简单且有效的解决方式，那就是<em>类型匹配</em>。</p><p>模式匹配允许我们查看值的内部，并将值所包含的数据绑定到变量上。以下是一个对 <code>Bool</code> 类型值进行模式匹配的例子，它的作用和 <code>not</code> 函数一样：</p><p>::: literalinclude /code/ch03/myNot.hs :::</p><p>[译注：原文的文件名为 <code>add.hs</code> ，这里修改成 <code>myNot.hs</code> ，和函数名保持一致。]</p><p>初看上去，代码似乎同时定义了两个 <code>myNot</code> 函数，但实际情况并不是这样 ------ Haskell 允许将函数定义为<em>一系列等式</em>： <code>myNot</code> 的两个等式分别定义了函数对于输入参数在不同模式之下的行为。对于每行等式，模式定义放在函数名之后， <code>=</code> 符号之前。</p><p>为了理解模式匹配是如何工作的，来研究一下 <code>myNot False</code> 是如何执行的：首先调用 <code>myNot</code> ， Haskell 运行时检查输入参数 <code>False</code> 是否和第一个模式的值构造器匹配 ------ 答案是不匹配，于是它继续尝试匹配第二个模式 ------ 这次匹配成功了，于是第二个等式右边的值被作为结果返回。</p><p>以下是一个复杂一点的例子，这个函数计算出列表所有元素之和：</p><p>::: literalinclude /code/ch03/sumList.hs :::</p><p>[译注：原文代码的文件名为 <code>add.hs</code> 这里改为 <code>sumList.hs</code> ，和函数名保持一致。]</p><p>需要说明的一点是，在 Haskell 里，列表 <code>[1, 2]</code> 实际上只是 <code>(1:(2:[]))</code> 的一种简单的表示方式，其中 <code>(:)</code> 用于构造列表：</p><pre><code>Prelude&gt; []
[]

Prelude&gt; 1:[]
[1]

Prelude&gt; 1:2:[]
[1,2]
</code></pre><p>因此，当需要对一个列表进行匹配时，也可以使用 <code>(:)</code> 操作符，只不过这次不是用来构造列表，而是用来分解列表。</p><p>作为例子，考虑求值 <code>sumList [1, 2]</code> 时会发生什么：首先， <code>[1, 2]</code> 尝试对第一个等式的模式 <code>(x:xs)</code> 进行匹配，结果是模式匹配成功，并将 <code>x</code> 绑定为 <code>1</code> ， <code>xs</code> 绑定为 <code>[2]</code> 。</p><p>计算进行到这一步，表达式就变成了 <code>1 + (sumList [2])</code> ，于是递归调用 <code>sumList</code> ，对 <code>[2]</code> 进行模式匹配。</p><p>这一次也是在第一个等式匹配成功，变量 <code>x</code> 被绑定为 <code>2</code> ，而 <code>xs</code> 被绑定为 <code>[]</code> 。表达式变为 <code>1 + (2 + sumList [])</code> 。</p><p>再次递归调用 <code>sumList</code> ，输入为 <code>[]</code> ，这一次，第二个等式的 <code>[]</code> 模式匹配成功，返回 <code>0</code> ，整个表达式为 <code>1 + (2 + (0))</code> ，计算结果为 <code>3</code> 。</p><p>最后要说的一点是，标准函数库里已经有 <code>sum</code> 函数，它和我们定以的 <code>sumList</code> 一样，都可以用于计算表元素的和：</p><pre><code>Prelude&gt; :load sumList.hs
[1 of 1] Compiling Main             ( sumList.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; sumList [1, 2]
3

*Main&gt; sum [1, 2]
3
</code></pre><h3 id="组成和解构" tabindex="-1"><a class="header-anchor" href="#组成和解构" aria-hidden="true">#</a> 组成和解构</h3><p>让我们稍微慢下探索新特性的脚步，花些时间，了解构造一个值、和对这个值进行模式匹配之间的关系。</p><p>我们通过应用值构造器来构建值：表达式 <code>Book 9 &quot;Close Calls&quot; [&quot;John Long&quot;]</code> 应用 <code>Book</code> 构造器到值 <code>9</code> 、 <code>&quot;Close Calls&quot;</code> 和 <code>[&quot;John Long&quot;]</code> 上面，从而产生一个新的 <code>BookInfo</code> 类型的值。</p><p>另一方面，当对 <code>Book</code> 构造器进行模式匹配时，我们<em>逆转</em>（reverse）它的构造过程：首先，检查这个值是否由 <code>Book</code> 构造器生成 ------ 如果是的话，那么就对这个值进行探查（inspect），并取出创建这个值时，提供给构造器的各个值。</p><p>考虑一下表达式 <code>Book 9 &quot;Close Calls&quot; [&quot;John Long&quot;]</code> 对模式 <code>(Book id name authors)</code> 的匹配是如何进行的：</p><ul><li>因为值的构造器和模式里的构造器相同，因此匹配成功。</li><li>变量 <code>id</code> 被绑定为 <code>9</code> 。</li><li>变量 <code>name</code> 被绑定为 <code>Close Calls</code> 。</li><li>变量 <code>authors</code> 被绑定为 <code>[&quot;John Long&quot;]</code> 。</li></ul><p>因为模式匹配的过程就像是逆转一个值的构造（construction）过程，因此它有时候也被称为<em>解构</em>（deconstruction）。</p><p>[译注：上一节的《联合》小节里提到， Haskell 有办法分辨同一类型由不同值构造器创建的值，说的就是模式匹配。</p><p>比如 <code>Circle ...</code> 和 <code>Poly ...</code> 两个表达式创建的都是 <code>Shape</code> 类型的值，但第一个表达式只有在匹配 <code>(Circle vector double)</code> 模式时才会成功，而第二个表达式只有在 <code>(Poly vectors)</code> 时才会成功。这就是它们不会被混淆的原因。]</p><h3 id="更进一步" tabindex="-1"><a class="header-anchor" href="#更进一步" aria-hidden="true">#</a> 更进一步</h3><p>对元组进行模式匹配的语法，和构造元组的语法很相似。</p><p>以下是一个可以返回三元组中最后一个元素的函数：</p><p>::: literalinclude /code/ch03/third.hs :::</p><p>[译注：原文的源码文件名为 <code>Tuple.hs</code> ，这里改为 <code>third.hs</code> ，和函数的名字保持一致。]</p><p>在 ghci 里测试这个函数：</p><pre><code>Prelude&gt; :load third.hs
[1 of 1] Compiling Main             ( third.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; third (1, 2, 3)
3
</code></pre><p>模式匹配的&quot;深度&quot;并没有限制。以下模式会同时对元组和元组里的列表进行匹配：</p><p>::: literalinclude /code/ch03/complicated.hs :::</p><p>[译注：原文的源码文件名为 <code>Tuple.hs</code> ，这里改为 <code>complicated.hs</code> ，和函数的名字保持一致。]</p><p>在 ghci 里测试这个函数：</p><pre><code>Prelude&gt; :load complicated.hs
[1 of 1] Compiling Main             ( complicated.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; complicated (True, 1, [1, 2, 3], 5)
(1,[2,3])
</code></pre><p>对于出现在模式里的字面（literal）值（比如前面元组例子里的 <code>True</code> 和 <code>5</code> ），输入里的各个值必须和这些字面值相等，匹配才有可能成功。以下代码显示，因为输入元组和模式的第一个字面值 <code>True</code> 不匹配，所以匹配失败了：</p><pre><code>*Main&gt; complicated (False, 1, [1, 2, 3], 5)
*** Exception: complicated.hs:2:1-40: Non-exhaustive patterns in function complicated
</code></pre><p>这个例子也显示了，如果所有给定等式的模式都匹配失败，那么返回一个运行时错误。</p><p>对代数数据类型的匹配，可以通过这个类型的值构造器来进行。拿之前我们定义的 <code>BookInfo</code> 类型为例子，对它的模式匹配可以使用它的 <code>Book</code> 构造器来进行：</p><pre><code>-- file: ch03/BookStore.hs
bookID      (Book id title authors) = id
bookTitle   (Book id title authors) = title
bookAuthors (Book id title authors) = authors
</code></pre><p>在 ghci 里试试：</p><pre><code>Prelude&gt; :load BookStore.hs
[1 of 1] Compiling Main             ( BookStore.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; let book = (Book 3 &quot;Probability Theory&quot; [&quot;E.T.H. Jaynes&quot;])

*Main&gt; bookID book
3

*Main&gt; bookTitle book
&quot;Probability Theory&quot;

*Main&gt; bookAuthors book
[&quot;E.T.H. Jaynes&quot;]
</code></pre><p>字面值的比对规则对于列表和值构造器的匹配也适用： <code>(3:xs)</code> 模式只匹配那些不为空，并且第一个元素为 <code>3</code> 的列表；而 <code>(Book 3 title authors)</code> 只匹配 ID 值为 <code>3</code> 的那本书。</p><h3 id="模式匹配中的变量名命名" tabindex="-1"><a class="header-anchor" href="#模式匹配中的变量名命名" aria-hidden="true">#</a> 模式匹配中的变量名命名</h3><p>当你阅读那些进行模式匹配的函数时，经常会发现像是 <code>(x:xs)</code> 或是 <code>(d:ds)</code> 这种类型的名字。这是一个流行的命名规则，其中的 <code>s</code> 表示&quot;元素的复数&quot;。以 <code>(x:xs)</code> 来说，它用 <code>x</code> 来表示列表的第一个元素，剩余的列表元素则用 <code>xs</code> 表示。</p><h3 id="通配符模式匹配" tabindex="-1"><a class="header-anchor" href="#通配符模式匹配" aria-hidden="true">#</a> 通配符模式匹配</h3><p>如果在匹配模式中我们不在乎某个值的类型，那么可以用下划线字符 &quot;_&quot; 作为符号来进行标识，它也叫做<em>通配符</em>。它的用法如下。</p><pre><code>-- file: ch03/BookStore.hs
nicerID      (Book id _     _      ) = id
nicerTitle   (Book _  title _      ) = title
nicerAuthors (Book _  _     authors) = authors
</code></pre><p>于是，我们将之前介绍过的访问器函数改得更加简明了。现在能很清晰的看出各个函数究竟使用到了哪些元素。</p><p>在模式匹配里，通配符的作用和变量类似，但是它并不会绑定成一个新的变量。就像上面的例子展示的那样，在一个模式匹配里可以使用一个或多个通配符。</p><p>使用通配符还有另一个好处。如果我们在一个匹配模式中引入了一个变量，但没有在函数体中用到它的话，Haskell 编译器会发出一个警告。定义一个变量但忘了使用通常意味着存在潜在的 bug，因此这是个有用的功能。假如我们不准备使用一个变量，那就不要用变量，而是用通配符，这样编译器就不会报错。</p><h3 id="穷举匹配模式和通配符" tabindex="-1"><a class="header-anchor" href="#穷举匹配模式和通配符" aria-hidden="true">#</a> 穷举匹配模式和通配符</h3><p>在给一个类型写一组匹配模式时，很重要的一点就是一定要涵盖构造器的所有可能情况。例如，如果我们需要探查一个列表，就应该写一个匹配非空构造器 (😃 的方程和一个匹配空构造器 [] 的方程。</p><p>假如我们没有涵盖所有情况会发生什么呢。下面，我们故意漏写对 [] 构造器的检查。</p><pre><code>-- file: ch03/BadPattern.hs
badExample (x:xs) = x + badExample xs
</code></pre><p>如果我们将其作用于一个不能匹配的值，运行时就会报错：我们的软件有 bug！</p><pre><code>ghci&gt; badExample []
*** Exception: BadPattern.hs:4:0-36: Non-exhaustive patterns in function badExample
</code></pre><p>在上面的例子中，函数定义时的方程里没有一个可以匹配 [] 这个值。</p><p>如果在某些情况下，我们并不在乎某些特定的构造器，我们就可以用通配符匹配模式来定义一个默认的行为。</p><pre><code>-- file: ch03/BadPattern.hs
goodExample (x:xs) = x + goodExample xs
goodExample _      = 0
</code></pre><p>上面例子中的通配符可以匹配 [] 构造器，因此应用这个函数不会导致程序崩溃。</p><pre><code>ghci&gt; goodExample []
0
ghci&gt; goodExample [1,2]
3
</code></pre><h2 id="记录语法" tabindex="-1"><a class="header-anchor" href="#记录语法" aria-hidden="true">#</a> 记录语法</h2><p>给一个数据类型的每个成分写访问器函数是令人感觉重复而且乏味的事情。</p><pre><code>-- file: ch03/BookStore.hs
nicerID      (Book id _     _      ) = id
nicerTitle   (Book _  title _      ) = title
nicerAuthors (Book _  _     authors) = authors
</code></pre><p>我们把这种代码叫做&quot;样板代码（boilerplate code）&quot;：尽管是必需的，但是又长又烦。Haskell 程序员不喜欢样板代码。幸运的是，语言的设计者提供了避免这个问题的方法：我们在定义一种数据类型的同时，就可以定义好每个成分的访问器。（逗号的位置是一个风格问题，如果你喜欢的话，也可以把它放在每行的最后。）</p><pre><code>-- file: ch03/BookStore.hs
data Customer = Customer {
      customerID      :: CustomerID
    , customerName    :: String
    , customerAddress :: Address
    } deriving (Show)
</code></pre><p>以上代码和下面这段我们更熟悉的代码的意义几乎是完全一致的。</p><pre><code>-- file: ch03/AltCustomer.hs
data Customer = Customer Int String [String]
                deriving (Show)

customerID :: Customer -&gt; Int
customerID (Customer id _ _) = id

customerName :: Customer -&gt; String
customerName (Customer _ name _) = name

customerAddress :: Customer -&gt; [String]
customerAddress (Customer _ _ address) = address
</code></pre><p>Haskell 会使用我们在定义类型的每个字段时的命名，相应生成与该命名相同的该字段的访问器函数。</p><pre><code>ghci&gt; :type customerID
customerID :: Customer -&gt; CustomerID
</code></pre><p>我们仍然可以如往常一样使用应用语法来新建一个此类型的值。</p><pre><code>-- file: ch03/BookStore.hs
customer1 = Customer 271828 &quot;J.R. Hacker&quot;
            [&quot;255 Syntax Ct&quot;,
             &quot;Milpitas, CA 95134&quot;,
             &quot;USA&quot;]
</code></pre><p>记录语法还新增了一种更详细的标识法来新建一个值。这种标识法通常都会提升代码的可读性。</p><pre><code>-- file: ch03/BookStore.hs
customer2 = Customer {
              customerID = 271828
            , customerAddress = [&quot;1048576 Disk Drive&quot;,
                                 &quot;Milpitas, CA 95134&quot;,
                                 &quot;USA&quot;]
            , customerName = &quot;Jane Q. Citizen&quot;
            }
</code></pre><p>如果使用这种形式，我们还可以调换字段列表的顺序。比如在上面的例子里，name 和 address 字段的顺序就被移动过，和定义类型时的顺序不一样了。</p><p>当我们使用记录语法来定义类型时，还会影响到该类型的打印格式。</p><pre><code>ghci&gt; customer1
Customer {customerID = 271828, customerName = &quot;J.R. Hacker&quot;, customerAddress = [&quot;255 Syntax Ct&quot;,&quot;Milpitas, CA 95134&quot;,&quot;USA&quot;]}
</code></pre><p>让我们打印一个 BookInfo 类型的值来做个比较；这是没有使用记录语法时的打印格式。</p><pre><code>ghci&gt; cities
Book 173 &quot;Use of Weapons&quot; [&quot;Iain M. Banks&quot;]
</code></pre><p>我们在使用记录语法的时候&quot;免费&quot;得到的访问器函数，实际上都是普通的 Haskell 函数。</p><pre><code>ghci&gt; :type customerName
customerName :: Customer -&gt; String
ghci&gt; customerName customer1
&quot;J.R. Hacker&quot;
</code></pre><p>标准库里的 System.Time 模块就是一个使用记录语法的好例子。例如其中定义了这样一个类型：</p><pre><code>data CalendarTime = CalendarTime {
  ctYear                      :: Int,
  ctMonth                     :: Month,
  ctDay, ctHour, ctMin, ctSec :: Int,
  ctPicosec                   :: Integer,
  ctWDay                      :: Day,
  ctYDay                      :: Int,
  ctTZName                    :: String,
  ctTZ                        :: Int,
  ctIsDST                     :: Bool
}
</code></pre><p>假如没有记录语法，从一个如此复杂的类型中抽取某个字段将是一件非常痛苦的事情。这种标识法使我们在使用大型结构的过程中更方便了。</p><h2 id="参数化类型" tabindex="-1"><a class="header-anchor" href="#参数化类型" aria-hidden="true">#</a> 参数化类型</h2><p>我们曾不止一次地提到列表类型是多态的：列表中的元素可以是任何类型。我们也可以给自定义的类型添加多态性。只要在类型定义中使用类型变量就可以做到这一点。Prelude 中定义了一种叫做 <code>Maybe</code> 的类型：它用来表示这样一种值------既可以有值也可能空缺，比如数据库中某行的某字段就可能为空。</p><pre><code>-- file: ch03/Nullable.hs
data Maybe a = Just a
             | Nothing
译注：Maybe，Just，Nothing 都是 Prelude 中已经定义好的类型
这段代码是不能在 ghci 里面执行的，它简单地展示了标准库是怎么定义 Maybe 这种类型的
</code></pre><p>这里的变量 <code>a</code> 不是普通的变量：它是一个类型变量。它意味着 <code>\`Maybe</code> 类型使用另一种类型作为它的参数。从而使得 <code>Maybe</code> 可以作用于任何类型的值。</p><pre><code>-- file: ch03/Nullable.hs
someBool = Just True
someString = Just &quot;something&quot;
</code></pre><p>和往常一样，我们可以在 <strong>ghci</strong> 里试着用一下这种类型。</p><pre><code>ghci&gt; Just 1.5
Just 1.5
ghci&gt; Nothing
Nothing
ghci&gt; :type Just &quot;invisible bike&quot;
Just &quot;invisible bike&quot; :: Maybe [Char]
</code></pre><p><code>Maybe</code> 是一个多态，或者称作泛型的类型。我们向 <code>Maybe</code> 的类型构造器传入某种类型作为参数，例如 <code>\`Maybe Int</code> 或 <code>\`Maybe [Bool]</code>。 如我们所希望的那样，这些都是不同的类型（译注：可能省略了&quot;但是都可以成功传入作为参数&quot;）。</p><p>我们可以嵌套使用参数化的类型，但要记得使用括号标识嵌套的顺序，以便 Haskell 编译器知道如何解析这样的表达式。</p><pre><code>-- file: ch03/Nullable.hs
wrapped = Just (Just &quot;wrapped&quot;)
</code></pre><p>再补充说明一下，如果和其它更常见的语言做个类比，参数化类型就相当于 C++ 中的模板（template），和 Java 中的泛型（generics）。请注意这仅仅是个大概的比喻。这些语言都是在被发明之后很久再加上模板和泛型的，因此在使用时会感到有些别扭。Haskell 则是从诞生之日起就有了参数化类型，因此更简单易用。</p><h2 id="递归类型" tabindex="-1"><a class="header-anchor" href="#递归类型" aria-hidden="true">#</a> 递归类型</h2><p>列表这种常见的类型就是<em>递归</em>的：即它用自己来定义自己。为了深入了解其中的含义，让我们自己来设计一个与列表相仿的类型。我们将用 <code>Cons</code> 替换 <code>(:)</code> 构造器，用 <code>Nil</code> 替换 <code>[]</code> 构造器。</p><pre><code>-- file: ch03/ListADT.hs
data List a = Cons a (List a)
            | Nil
              deriving (Show)
</code></pre><p><code>List a</code> 在 <code>=</code> 符号的左右两侧都有出现，我们可以说该类型的定义引用了它自己。当我们使用 <code>Cons</code> 构造器创建一个值的时候，我们必须提供一个 <code>a</code> 的值作为参数一，以及一个 <code>List a</code> 类型的值作为参数二。接下来我们看一个实例。</p><p>我们能创建的 <code>List a</code> 类型的最简单的值就是 <code>Nil</code>。请将上面的代码保存为一个文件，然后打开 <strong>ghci</strong> 并加载它。</p><pre><code>ghci&gt; Nil
Nil
</code></pre><p>由于 <code>Nil</code> 是一个 <code>List a</code> 类型（译注：原文是 <code>List</code> 类型，可能是漏写了 <code>a</code>），因此我们可以将它作为 <code>Cons</code> 的第二个参数。</p><pre><code>ghci&gt; Cons 0 Nil
Cons 0 Nil
</code></pre><p>然后 <code>Cons 0 Nil</code> 也是一个 <code>List a</code> 类型，我们也可以将它作为 <code>Cons</code> 的第二个参数。</p><pre><code>ghci&gt; Cons 1 it
Cons 1 (Cons 0 Nil)
ghci&gt; Cons 2 it
Cons 2 (Cons 1 (Cons 0 Nil))
ghci&gt; Cons 3 it
Cons 3 (Cons 2 (Cons 1 (Cons 0 Nil)))
</code></pre><p>我们可以一直这样写下去，得到一个很长的 <code>Cons</code> 链，其中每个子链的末位元素都是一个 <code>Nil</code>。</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>::: title Tip</p></div><p>List 可以被当作是 list 吗？</p><p>让我们来简单的证明一下 <code>List a</code> 类型和内置的 list 类型 <code>[a]</code> 拥有相同的构型。让我们设计一个函数能够接受任何一个 [a] 类型的值作为输入参数，并返回 <code>List a</code> 类型的一个值。</p><pre><code>-- file: ch03/ListADT.hs
fromList (x:xs) = Cons x (fromList xs)
fromList []     = Nil
</code></pre><p>通过查看上述实现，能清楚的看到它将每个 <code>(:)</code> 替换成 <code>Cons</code>，将每个 <code>[]</code> 替换成 <code>Nil</code>。这样就涵盖了内置 list 类型的全部构造器。因此我们可以说二者是同构的，它们有着相同的构型。</p><pre><code>ghci&gt; fromList &quot;durian&quot;
Cons &#39;d&#39; (Cons &#39;u&#39; (Cons &#39;r&#39; (Cons &#39;i&#39; (Cons &#39;a&#39; (Cons &#39;n&#39; Nil)))))
ghci&gt; fromList [Just True, Nothing, Just False]
Cons (Just True) (Cons Nothing (Cons (Just False) Nil))
</code></pre><p>:::</p><p>为了说明什么是递归类型，我们再来看第三个例子------定义一个二叉树类型。</p><pre><code>-- file: ch03/Tree.hs
data Tree a = Node a (Tree a) (Tree a)
            | Empty
              deriving (Show)
</code></pre><p>二叉树是指这样一种节点：该节点有两个子节点，这两个子节点要么也是二叉树节点，要么是空节点。</p><p>这次我们将和另一种常见的语言进行比较来寻找灵感。以下是在 Java 中实现类似数据结构的类定义。</p><pre><code>class Tree&lt;A&gt;
{
    A value;
    Tree&lt;A&gt; left;
    Tree&lt;A&gt; right;

    public Tree(A v, Tree&lt;A&gt; l, Tree&lt;A&gt; r)
    {
    value = v;
    left = l;
    right = r;
    }
}
</code></pre><p>稍有不同的是，Java 中使用特殊值 <code>null</code> 表示各种&quot;没有值&quot;, 因此我们可以使用 <code>null</code> 来表示一个节点没有左子节点或没有右子节点。下面这个简单的函数能够构建一个有两个叶节点的树（叶节点这个词习惯上是指没有子节点的节点）。</p><pre><code>class Example
{
    static Tree&lt;String&gt; simpleTree()
    {
    return new Tree&lt;String&gt;(
            &quot;parent&quot;,
        new Tree&lt;String&gt;(&quot;left leaf&quot;, null, null),
        new Tree&lt;String&gt;(&quot;right leaf&quot;, null, null));
    }
}
</code></pre><p>Haskell 没有与 <code>null</code> 对应的概念。尽管我们可以使用 <code>Maybe</code> 达到类似的效果，但后果是模式匹配将变得十分臃肿。因此我们决定使用一个没有参数的 <code>Empty</code> 构造器。在上述 <code>Tree</code> 类型的 Java 实现中使用到 <code>null</code> 的地方，在 Haskell 中都改用 <code>Empty</code>。</p><pre><code>-- file: ch03/Tree.hs
simpleTree = Node &quot;parent&quot; (Node &quot;left child&quot; Empty Empty)
                           (Node &quot;right child&quot; Empty Empty)
</code></pre><h3 id="练习" tabindex="-1"><a class="header-anchor" href="#练习" aria-hidden="true">#</a> 练习</h3><ol><li>请给 <code>List</code> 类型写一个与 <code>fromList</code> 作用相反的函数：传入一个 <code>List a</code> 类型的值，返回一个 <code>[a]</code>。</li><li>请仿造 Java 示例，定义一种只需要一个构造器的树类型。不要使用 <code>Empty</code> 构造器，而是用 <code>Maybe</code> 表示节点的子节点。</li></ol><h2 id="报告错误" tabindex="-1"><a class="header-anchor" href="#报告错误" aria-hidden="true">#</a> 报告错误</h2><p>当我们的代码中出现严重错误时可以调用 Haskell 提供的标准函数 <code>error :: String -&gt; a</code>。我们将希望打印出来的错误信息作为一个字符串参数传入。而该函数的类型签名看上去有些特别：它是怎么做到仅从一个字符串类型的值就生成任意类型 <code>a</code> 的返回值的呢？</p><p>由于它的结果是返回类型 <code>a</code>，因此无论我们在哪里调用它都能得到正确类型的返回值。然而，它并不像普通函数那样返回一个值，而是立即中止求值过程，并将我们提供的错误信息打印出来。</p><p><code>mySecond</code> 函数返回输入列表参数的第二个元素，假如输入列表长度不够则失败。</p><pre><code>-- file: ch03/MySecond.hs
mySecond :: [a] -&gt; a

mySecond xs = if null (tail xs)
              then error &quot;list too short&quot;
              else head (tail xs)
</code></pre><p>和之前一样，我们来看看这个函数在 <strong>ghci</strong> 中的使用效果如何。</p><pre><code>ghci&gt; mySecond &quot;xi&quot;
&#39;i&#39;
ghci&gt; mySecond [2]
*** Exception: list too short
ghci&gt; head (mySecond [[9]])
*** Exception: list too short
</code></pre><p>注意上面的第三种情况，我们试图将调用 <code>mySecond</code> 的结果作为参数传入另一个函数。求值过程也同样中止了，并返回到 <strong>ghci</strong> 提示符。这就是使用 <code>error</code> 的最主要的问题：它并不允许调用者根据错误是可修复的还是严重到必须中止的来区别对待。</p><p>正如我们之前所看到的，模式匹配失败也会造成类似的不可修复错误。</p><pre><code>ghci&gt; mySecond []
*** Exception: Prelude.tail: empty list
</code></pre><h3 id="让过程更可控的方法" tabindex="-1"><a class="header-anchor" href="#让过程更可控的方法" aria-hidden="true">#</a> 让过程更可控的方法</h3><p>我们可以使用 <code>Maybe</code> 类型来表示有可能出现错误的情况。</p><p>如果我们想指出某个操作可能会失败，可以使用 <code>Nothing</code> 构造器。反之则使用 <code>Just</code> 构造器将值包裹起来。</p><p>让我们看看如果返回 <code>Maybe</code> 类型的值而不是调用 <code>error</code>，这样会给 <code>mySecond</code> 函数带来怎样的变化。</p><pre><code>-- file: ch03/MySecond.hs
safeSecond :: [a] -&gt; Maybe a

safeSecond [] = Nothing
safeSecond xs = if null (tail xs)
                then Nothing
                else Just (head (tail xs))
</code></pre><p>当传入的列表太短时，我们将 <code>Nothing</code> 返回给调用者。然后由他们来决定接下来做什么，假如调用 <code>error</code> 的话则会强制程序崩溃。</p><pre><code>ghci&gt; safeSecond []
Nothing
ghci&gt; safeSecond [1]
Nothing
ghci&gt; safeSecond [1,2]
Just 2
ghci&gt; safeSecond [1,2,3]
Just 2
</code></pre><p>复习一下前面的章节，我们还可以使用模式匹配继续增强这个函数的可读性。</p><pre><code>-- file: ch03/MySecond.hs
tidySecond :: [a] -&gt; Maybe a

tidySecond (_:x:_) = Just x
tidySecond _       = Nothing

译注：(_:x:_) 相当于 (_:(x:_))，考虑到列表的元素只能是同一种类型
     假想第一个 _ 是 a 类型，那么这个模式匹配的是 (a:(a:[a, a, ...])) 或 (a:(a:[]))
     即元素是 a 类型的值的一个列表，并且至少有 2 个元素
     那么如果第一个 _ 匹配到了 []，有没有可能使最终匹配到得列表只有一个元素呢？
     ([]:(x:_)) 说明 a 是列表类型，那么 x 也必须是列表类型，x 至少是 []
     而 ([]:([]:[])) -&gt; ([]:[[]]) -&gt; [[], []]，还是 2 个元素
</code></pre><p>第一个模式仅仅匹配那些至少有两个元素的列表（因为它有两个列表构造器），并将列表的第二个元素的值绑定给 变量 <code>x</code>。如果第一个模式匹配失败了，则匹配第二个模式。</p><h2 id="引入局部变量" tabindex="-1"><a class="header-anchor" href="#引入局部变量" aria-hidden="true">#</a> 引入局部变量</h2><p>在函数体内部，我们可以在任何地方使用 <code>let</code> 表达式引入新的局部变量。请看下面这个简单的函数，它用来检查我们是否可以向顾客出借现金。我们需要确保剩余的保证金不少于 100 元的情况下，才能出借现金，并返回减去出借金额后的余额。</p><pre><code>-- file: ch03/Lending.hs
lend amount balance = let reserve    = 100
                          newBalance = balance - amount
                      in if balance &lt; reserve
                         then Nothing
                         else Just newBalance
</code></pre><p>这段代码中使用了 <code>let</code> 关键字标识一个变量声明区块的开始，用 <code>in</code> 关键字标识这个区块的结束。每行引入了一个局部变量。变量名在 <code>=</code> 的左侧，右侧则是该变量所绑定的表达式。</p><div class="hint-container note"><p class="hint-container-title">注</p><p>::: title Note</p></div><p>特别提示</p><p>请特别注意我们的用词：在 <code>let</code> 区块中，变量名被绑定到了一个表达式而不是一个<em>值</em>。由于 Haskell 是一门惰性求值的语言，变量名所对应的表达式一直到被用到时才会求值。在上面的例子里，如果没有满足保证金的要求，就不会计算 <code>newBalance</code> 的值。</p><p>当我们在一个 <code>let</code> 区块中定义一个变量时，我们称之为*\`\`let\`\` 范围内*的变量。顾名思义即是：我们将这个变量限制在这个 <code>let</code> 区块内。</p><p>另外，上面这个例子中对空白和缩进的使用也值得特别注意。在下一节 &quot;The offside rule and white space in an expression&quot; 中我们会着重讲解其中的奥妙。 :::</p><p>在 <code>let</code> 区块内定义的变量，既可以在定义区内使用，也可以在紧跟着 <code>in</code> 关键字的表达式中使用。</p><p>一般来说，我们将代码中可以使用一个变量名的地方称作这个变量名的<em>作用域（scope）</em>。如果我们能使用，则说明在* 作用域*内，反之则说明<em>在作用域外</em> 。如果一个变量名在整个源代码的任意处都可以使用，则说明它位于<em>最顶层</em>的作用域。</p><h3 id="屏蔽" tabindex="-1"><a class="header-anchor" href="#屏蔽" aria-hidden="true">#</a> 屏蔽</h3><p>我们可以在表达式中使用嵌套的 <code>let</code> 区块。</p><pre><code>-- file: ch03/NestedLets.hs
foo = let a = 1
      in let b = 2
         in a + b
</code></pre><p>上面的写法是完全合法的；但是在嵌套的 <code>let</code> 表达式里重复使用相同的变量名并不明智。</p><pre><code>-- file: ch03/NestedLets.hs
bar = let x = 1
      in ((let x = &quot;foo&quot; in x), x)
</code></pre><p>如上，内部的 <code>x</code> 隐藏了，或称作<em>屏蔽（shadowing）</em>, 外部的 <code>x</code>。它们的变量名一样，但后者拥有完全不同的类型和值。</p><pre><code>ghci&gt; bar
(&quot;foo&quot;,1)
</code></pre><p>我们同样也可以屏蔽一个函数的参数，并导致更加奇怪的结果。你认为下面这个函数的类型是什么？</p><pre><code>-- file: ch03/NestedLets.hs
quux a = let a = &quot;foo&quot;
         in a ++ &quot;eek!&quot;
</code></pre><p>在函数的内部，由于 <code>let</code>-绑定的变量名 <code>a</code> 屏蔽了函数的参数，使得参数 <code>a</code> 没有起到任何作用，因此该参数可以是任何类型的。</p><pre><code>ghci&gt; :type quux
quux :: t -&gt; [Char]
</code></pre><div class="hint-container tip"><p class="hint-container-title">提示</p><p>::: title Tip</p></div><p>编译器警告是你的朋友</p><p>显然屏蔽会导致混乱和恶心的 bug，因此 GHC 设置了一个有用的选项 -fwarn-name-shadowing。如果你开启了这个功能，每当屏蔽某个变量名时，GHC 就会打印出一条警告。 :::</p><h3 id="where-从句" tabindex="-1"><a class="header-anchor" href="#where-从句" aria-hidden="true">#</a> where 从句</h3><p>还有另一种方法也可以用来引入局部变量：<code>where</code> 从句。<code>where</code> 从句中的定义在其<em>所跟随</em>的主句中有效。下面是和 <code>lend</code> 函数类似的一个例子，不同之处是使用了 <code>where</code> 而不是 <code>let</code>。</p><pre><code>-- file: ch03/Lending.hs
lend2 amount balance = if amount &lt; reserve * 0.5
                       then Just newBalance
                       else Nothing
    where reserve    = 100
          newBalance = balance - amount
</code></pre><p>尽管刚开始使用 <code>where</code> 从句通常会有异样的感觉，但它对于提升可读性有着巨大的帮助。它使得读者的注意力首先能集中在表达式的一些重要的细节上，而之后再补上支持性的定义。经过一段时间以后，如果再用回那些没有 <code>where</code> 从句的语言，你就会怀念它的存在了。</p><p>与 <code>let</code> 表达式一样，<code>where</code> 从句中的空白和缩进也十分重要。 在下一节 &quot;The offside rule and white space in an expression&quot; 中我们会着重讲解其中的奥妙。</p><h3 id="局部函数与全局变量" tabindex="-1"><a class="header-anchor" href="#局部函数与全局变量" aria-hidden="true">#</a> 局部函数与全局变量</h3><p>你可能已经注意到了，在 Haskell 的语法里，定义变量和定义函数的方式非常相似。这种相似性也存在于 <code>let</code> 和 <code>where</code> 区块里：定义局部<em>函数</em>就像定义局部<em>变量</em>那样简单。</p><pre><code>-- file: ch03/LocalFunction.hs
pluralise :: String -&gt; [Int] -&gt; [String]
pluralise word counts = map plural counts
    where plural 0 = &quot;no &quot; ++ word ++ &quot;s&quot;
          plural 1 = &quot;one &quot; ++ word
          plural n = show n ++ &quot; &quot; ++ word ++ &quot;s&quot;
</code></pre><p>我们定义了一个由多个等式构成的局部函数 <code>plural</code>。局部函数可以自由地使用其被封装在内的作用域内的任意变量：在本例中，我们使用了在外部函数 <code>pluralise</code> 中定义的变量 <code>word</code>。在 <code>pluralise</code> 的定义里，<code>map</code> 函数（我们将在下一章里再来讲解它的用法）将局部函数 <code>plural</code> 逐一应用于 <code>counts</code> 列表的每个元素。</p><p>我们也可以在代码的一开始就定义变量，语法和定义函数是一样的。</p><pre><code>-- file: ch03/GlobalVariable.hs
itemName = &quot;Weighted Companion Cube&quot;
</code></pre><h2 id="表达式里的缩进规则和空白字符" tabindex="-1"><a class="header-anchor" href="#表达式里的缩进规则和空白字符" aria-hidden="true">#</a> 表达式里的缩进规则和空白字符</h2><p>请看 <code>lend</code> 和 <code>lend2</code> 的定义表达式，左侧空出了一大块。这并不是随随便便写的，这些空白字符是有意义的。</p><p>Haskell 依据缩进来解析代码块。这种用排版来表达逻辑结构的方式通常被称作<em>缩进规则</em>。在源码文件开始的那一行，首个顶级声明或者定义可以从该行的任意一列开始，Haskell 编译器或解释器将记住这个缩进级别，并且随后出现的所有顶级声明也必须使用相同的缩进。</p><p>以下是一个顶级缩进规则的例子。第一个文件 <code>GoodIndent.hs</code> 执行正常。</p><pre><code>-- file: ch03/GoodIndent.hs
-- 这里是最左侧一列

    -- 顶级声明可以从任一列开始
    firstGoodIndentation = 1

    -- 只要所有后续声明也这么做！
    secondGoodIndentation = 2
</code></pre><p>第二个文件 <code>BadIndent.hs</code> 没有遵守规则，因此也不能正常执行。</p><pre><code>-- file: ch03/BadIndent.hs
-- 这里是最左侧一列

    -- 第一个声明从第 4 列开始
    firstBadIndentation = 1

-- 第二个声明从第 1 列开始，这样是非法的！
secondBadIndentation = 2
</code></pre><p>如果我们尝试在 <strong>ghci</strong> 里加载这两个文件，结果如下。</p><pre><code>ghci&gt; :load GoodIndent.hs
[1 of 1] Compiling Main             ( GoodIndent.hs, interpreted )
Ok, modules loaded: Main.
ghci&gt; :load BadIndent.hs
[1 of 1] Compiling Main             ( BadIndent.hs, interpreted )

BadIndent.hs:8:2: parse error on input \`secondBadIndentation&#39;
Failed, modules loaded: none.
</code></pre><p>紧跟着的（译注：一个或多个）空白行将被视作当前行的延续，比当前行缩进更深的紧跟着的行也是如此。</p><p><code>let</code> 表达式和 <code>where</code> 从句的规则与此类似。一旦 Haskell 编译器或解释器遇到一个 <code>let</code> 或 <code>where</code> 关键字，就会记住接下来第一个标记（token）的缩进位置。然后如果紧跟着的行是空白行或向右缩进更深，则被视作是前一行的延续。而如果其缩进和前一行相同，则被视作是同一区块内的新的一行。</p><pre><code>-- file: ch03/Indentation.hs
foo = let firstDefinition = blah blah
          -- 只有注释的行被视作空白行
                  continuation blah

          -- 减少缩进，于是下面这行就变成了一行新定义
          secondDefinition = yada yada

                  continuation yada
      in whatever
</code></pre><p>下面的例子演示了如何嵌套使用 <code>let</code> 和 <code>where</code>。</p><pre><code>-- file: ch03/letwhere.hs
bar = let b = 2
          c = True
      in let a = b
         in (a, c)
</code></pre><p>变量 <code>a</code> 只在内部那个 <code>let</code> 表达式中可见。它对外部那个 <code>let</code> 是不可见的。如果我们在外部使用变量 <code>a</code> 就会得到一个编译错误。缩进为我们和编译器提供了视觉上的标识，让我们可以一眼就看出来作用域中包含哪些东西。</p><pre><code>-- file: ch03/letwhere.hs
foo = x
    where x = y
            where y = 2
</code></pre><p>于此类似，第一个 <code>where</code> 从句的作用域即是定义 <code>foo</code> 的表达式，而第二个 <code>where</code> 从句的作用域则是第一个 <code>where</code> 从句。</p><p>在 <code>let</code> 和 <code>where</code> 从句中妥善地使用缩进能够更好地展现代码的意图。</p><h3 id="对制表符和空格说两句" tabindex="-1"><a class="header-anchor" href="#对制表符和空格说两句" aria-hidden="true">#</a> 对制表符和空格说两句</h3><p>在使用诸如 Emacs 这种能够识别 Haskell 代码的编辑器时，通常的默认配置是使用空格来表示缩进。如果你的编辑器不能识别 Haskell，建议您手工设置使用空格来表示缩进。</p><p>这么做的好处是可移植性。在一个使用等宽字体的编辑器里，类 Unix 系统和 Windows 系统对制表符的默认显示宽度并不一样，前者相当于 8 个字符宽度，而后者则相当于 4 个。这就意味着无论你自己认为制表符应该显示为多宽，你并不能保证别人的编辑器设置会尊重你的看法。使用制表符来表示缩进一定会在某些人的设置那里看起来一团糟。甚至还有可能导致编译错误，因为 Haskell 语言标准的实现是按照 Unix 风格制表符宽度来的。而使用空格则完全不用担心这个问题。</p><h3 id="the-offside-rule-is-not-mandatory" tabindex="-1"><a class="header-anchor" href="#the-offside-rule-is-not-mandatory" aria-hidden="true">#</a> 缩进规则并不是必需</h3><p>我们也可以使用显式的语法结构来代替排版，从而表达代码的意图。例如，我们先写一个左大括号，然后写几个赋值等式，每个等式之间用分号分隔，最后加上一个右大括号。下面这个两个例子所表达的意图是一模一样的。</p><pre><code>-- file: ch03/Braces.hs
bar = let a = 1
          b = 2
          c = 3
      in a + b + c

foo = let { a = 1;  b = 2;
        c = 3 }
      in a + b + c
</code></pre><p>当我们使用显式语法结构时，普通的排版不再起作用。就像在第二个例子中那样，我们可以随意的使用缩进而仍然保持正确。</p><p>显式语法结构可以用在任何地方替换普通排版。它对 <code>where</code> 从句乃至顶级声明也是有效的。但是请记住，尽管你可以这样用，但在 Hasekll 编程中几乎没有人会使用显式语法结构。</p><h2 id="case-表达式" tabindex="-1"><a class="header-anchor" href="#case-表达式" aria-hidden="true">#</a> Case 表达式</h2><p>函数定义并不是唯一我们能使用模式匹配的地方。<code>case</code> 结构使得我们还能在一个表达式内部使用模式匹配。如下面的例子所示，这个函数（定义在 <code>Data.Maybe</code> 里）能解构一个 <code>Maybe</code> 值，如果该值为 <code>Nothing</code> 还可以返回默认值。</p><pre><code>-- file: ch03/Guard.hs
fromMaybe defval wrapped =
    case wrapped of
      Nothing     -&gt; defval
      Just value  -&gt; value
</code></pre><p><code>case</code> 关键字后面可以跟任意表达式，这个表达式的结果即是模式匹配的目标。<code>of</code> 关键字标识着表达式到此结束，以及匹配区块的开始，这个区块将用来定义每种模式及其对应的表达式。</p><p>该区块的每一项由三个部分组成：一个模式，接着一个箭头 <code>-&gt;</code>，接着一个表达式；如果这个模式匹配中了，则计算并返回这个表达式的结果。这些表达式应当是同一类型的。第一个被匹配中的模式对应的表达式的计算结果即是 <code>case</code> 表达式的结果。匹配按自上而下的优先级进行。</p><p>如果使用通配符 <code>_</code> 作为最后一个被匹配的模式，则意味着&quot;如果上面的模式都没有被匹配中，就使用最后这个表达式&quot;。如果所有模式匹配都没中，我们会看到前面章节里出现过的运行时错误。</p><h2 id="新手在使用模式时常见的问题" tabindex="-1"><a class="header-anchor" href="#新手在使用模式时常见的问题" aria-hidden="true">#</a> 新手在使用模式时常见的问题</h2><p>在某些情况下，Haskell 新手会误解或误用模式。下面就是一些错误地使用模式匹配的例子。建议阅读时先自己想一想期望的结果是什么，然后看看实际的结果是否出乎你的意料。</p><h3 id="错误地对变量进行匹配" tabindex="-1"><a class="header-anchor" href="#错误地对变量进行匹配" aria-hidden="true">#</a> 错误地对变量进行匹配</h3><pre><code>-- file: ch03/BogusPattern.hs
data Fruit = Apple | Orange
             deriving (Show)

apple = &quot;apple&quot;

orange = &quot;orange&quot;

whichFruit :: String -&gt; Fruit

whichFruit f = case f of
                 apple  -&gt; Apple
                 orange -&gt; Orange
</code></pre><p>随意一瞥，这段代码的意思似乎是要检查 <code>f</code> 的值是 <code>apple</code> 还是 <code>orange</code>。</p><p>换一种写法可以让错误更加显而易见。（译注：原文的例子太晦涩，换了评论中一个较清楚的例子）</p><pre><code>-- file: ch03/BogusPattern.hs
whichFruit2 :: String -&gt; Fruit
whichFruit2 apple = Apple
whichFruit2 orange = Orange
</code></pre><p>这样写明白了吗？就是这里，显然 <code>apple</code> 并不是指在上层定义的那个变量名为 <code>apple</code> 的值，而是当前作用域的一个模式变量。</p><div class="hint-container note"><p class="hint-container-title">注</p><p>::: title Note</p></div><p>不可拒绝的模式</p><p>我们把这种永远会成功匹配的模式称作<em>不可拒绝</em>。普通的变量名和通配符 <code>_</code> 都属于不可拒绝的模式。 :::</p><p>上面那个函数的正确写法应该如此：</p><pre><code>-- file: ch03/BogusPattern.hs
betterFruit f = case f of
                  &quot;apple&quot;  -&gt; Apple
                  &quot;orange&quot; -&gt; Orange
</code></pre><p>我们针对字符串值 <code>&quot;apple&quot;</code> 和 <code>&quot;orange&quot;</code> 进行模式匹配，于是问题得到了解决。</p><h3 id="进行了错误的相等比较" tabindex="-1"><a class="header-anchor" href="#进行了错误的相等比较" aria-hidden="true">#</a> 进行了错误的相等比较</h3><p>如果我们想比较一个 <code>Tree</code> 类型的两个节点值，如果相等就返回其中一个应该怎么做？请看下面这个尝试。</p><pre><code>-- file: ch03/BadTree.hs
bad_nodesAreSame (Node a _ _) (Node a _ _) = Just a
bad_nodesAreSame _            _            = Nothing
</code></pre><p>一个命名在一组模式绑定中只能使用一次。将同一个变量放在多个位置并不意味着&quot;这些变量应该相等&quot;。要解决这类问题，我们需要使用 Haskell 的另一个重要的特性，<em>守卫</em>。</p><h2 id="使用守卫实现条件求值" tabindex="-1"><a class="header-anchor" href="#使用守卫实现条件求值" aria-hidden="true">#</a> 使用守卫实现条件求值</h2><p>模式匹配针对的是值长成什么样子，因此有着诸多局限。除此之外，我们常常需要在对函数体求值之前进行各种各样的检查。Haskell 也为此提供了<em>守卫</em>这个特性。我们将通过改写上面这个用来比较树的两个节点是否相等的这段函数来讲解它的使用方法。</p><pre><code>-- file: ch03/BadTree.hs
nodesAreSame (Node a _ _) (Node b _ _)
    | a == b     = Just a
nodesAreSame _ _ = Nothing
</code></pre><p>在上面的例子中，我们首先使用了模式匹配已确保值的形式是对的，然后使用了一个守卫来比较其中的一个部分。</p><p>一个模式后面可以跟着 0 个或多个 <code>Bool</code> 类型的守卫。我们引入了 <code>|</code> 这个符号来标识守卫的使用。即在它后面写一个守卫表达式，再写一个 <code>=</code> 符号（如果是 <code>case</code> 表达式则应该用 <code>-&gt;</code>），然后写上在这个守卫表达式的值为真的情况下将被使用的函数体。如果某个模式匹配成功，那么它后面的守卫将按照顺序依次被求值。如果其中的某个守卫值为真，那么使用它所对应的函数体作为结果。如果所有的守卫值都为假，那么模式匹配继续进行，即尝试匹配下一个模式。</p><p>当对守卫表达式求值时，它所对应的模式中提到的所有变量都会被绑定，因此能够使用。</p><p>下面是一个用守卫重构过的 <code>lend</code> 方法。</p><pre><code>-- file: ch03/Lending.hs
lend3 amount balance
     | amount &lt;= 0            = Nothing
     | amount &gt; reserve * 0.5 = Nothing
     | otherwise              = Just newBalance
    where reserve    = 100
          newBalance = balance - amount
</code></pre><p><code>otherwise</code> 看上去像是守卫表达式的某种特殊语法，但实际上它只是一个被绑定为值 <code>True</code> 的普通变量，这样写是为了提高可读性。</p><p>任何使用模式的地方都可以使用守卫。用模式匹配和守卫把方法写成一组等式会大大提高可读性。还记得我们在[条件求值&lt;&gt;_]{.title-ref}一节中定义的 <code>myDrop</code> 方法吗？</p><pre><code>-- file: ch02/myDrop.hs
myDrop n xs = if n &lt;= 0 || null xs
              then xs
              else myDrop (n - 1) (tail xs)
</code></pre><p>下面是用模式和守卫重构过的例子。</p><pre><code>-- file: ch02/myDrop.hs
niceDrop n xs | n &lt;= 0 = xs
niceDrop _ []          = []
niceDrop n (_:xs)      = niceDrop (n - 1) xs
</code></pre><p>这种格式的代码清楚的<em>依次</em>列举了我们对函数在不同情况下的不同用法的期望。如果使用 <code>if</code> 表达式，我们的想法很容易就被藏进某个函数里，而代码则会变得不可读。</p><h2 id="练习-1" tabindex="-1"><a class="header-anchor" href="#练习-1" aria-hidden="true">#</a> 练习</h2><p>1.写一个函数，用来计算一个列表元素的个数．出于测试要求，保证其输出的结果和标准函数 length 保持一致．</p><p>2.添加函数的类型签名于你的源文件．出于测试要求，再次加载源文件到ghci．</p><p>3.写一个函数，用来计算列表的平均值，即，列表元素的总和除以列表的长度．(你可能需要用到 fromIntegral 函数将列表长度变量从 integer 类型到 float 类型进行转换．)</p><p>4.将一个列表变成回文序列，即，他应该读起来完全一样，不管是从前往后还是从后往前．举个例子，考虑一个列表 [1,2,3]，你的函数应该返回 [1,2,3,3,2,1]．</p><p>5.写一个函数，用来确定他的输入是否是一个回文序列．</p><p>6.创造一个函数，用于排序一个包含许多列表的列表，其排序规则基于他的子列表的长度．（你可能要看看 Data.List 模块的 sortBy 函数．）</p><p>7.定义一个函数，其用一个分隔符将一个包含许多列表的列表连接在一起．函数类型定义如下：</p><p>::: literalinclude /code/ch03/Intersperse.hs :::</p><p>这个分割应该出现于列表的元素之间，除了最后一个元素末尾之外．你的函数需运行得如下所示：</p><pre><code>ghci&gt; :load Intersperse
[1 of 1] Compiling Main             ( Intersperse.hs, interpreted )
Ok, modules loaded: Main.
ghci&gt; intersperse &#39;,&#39; []
&quot;&quot;
ghci&gt; intersperse &#39;,&#39; [&quot;foo&quot;]
&quot;foo&quot;
ghci&gt; intersperse &#39;,&#39; [&quot;foo&quot;,&quot;bar&quot;,&quot;baz&quot;,&quot;quux&quot;]
&quot;foo,bar,baz,quux&quot;
</code></pre><p>8.使用我们在前面章节中定义的二叉树类型，写一个函数用于确定一棵二叉树的高度．高度的定义是从根节点到叶子节点经过的最大节点数．举个例子，<code>Empty</code> 这棵树的高度是0; <code>Node &quot;x&quot; Empty Empty</code> 这棵树的高度是1; <code>Node &quot;x&quot; Empty (Node &quot;y&quot; Empty Empty)</code> 这棵树的高度是2;依此类推．</p><p>9.考虑三个二维的点 a, b，和c．如果我们观察沿着线段ＡＢ（由a,b节点组成）和线段ＢＣ（由b,c节点组成）形成的角度，它或者转向（turn）左边，或者转向右边，或者组成一条直线．定义一个 Direction（方向）的数据类型反映这些可能的情况．</p><p>10.写一个函数，用于计算三个二维坐标点组成的转向（turn），并且返回其 Direction（方向）．</p><p>11.定义一个函数，输入二维坐标点的序列并计算其每个连续三个的（方向）Direction．考虑一个点的序列 [a,b,c,d,e]，他应该开始计算 [a,b,c]的转向(turn), 接着计算 [b,c,d]的转向，再是[c,d,e]的．你的函数应该返回一个Direction（方向）的序列．</p>`,381),l={href:"http://en.wikipedia.org/wiki/Convex_hull",target:"_blank",rel:"noopener noreferrer"},u={href:"http://en.wikipedia.org/wiki/Graham_scan",target:"_blank",rel:"noopener noreferrer"};function h(g,m){const n=s("ExternalLinkIcon");return t(),a("div",null,[p,o("p",null,[e("12.运用前面三个练习的代码，实现 Graham 扫描算法，用于扫描由二维点集构成的凸包．你能从 "),o("a",l,[e("Wikipedia"),d(n)]),e(" 上找到＂什么是凸包＂，以及 "),o("a",u,[e("＂Graham扫描算法＂"),d(n)]),e(" 的完整解释．")])])}const q=c(r,[["render",h],["__file","3.html.vue"]]);export{q as default};
