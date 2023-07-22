import{_ as e,W as o,X as d,a2 as c}from"./framework-0bc3c581.js";const t={},a=c(`<h1 id="types_and_functions" tabindex="-1"><a class="header-anchor" href="#types_and_functions" aria-hidden="true">#</a> 第 2 章：类型和函数</h1><h2 id="why_care_about_types" tabindex="-1"><a class="header-anchor" href="#why_care_about_types" aria-hidden="true">#</a> 类型是干什么用的？</h2><p>Haskell 中的每个函数和表达式都带有各自的类型，通常称一个表达式拥有类型 <code>T</code> ，或者说这个表达式的类型为 <code>T</code> 。举个例子，布尔值 <code>True</code> 的类型为 <code>Bool</code> ，而字符串 <code>&quot;foo&quot;</code> 的类型为 <code>String</code> 。一个值的类型标识了它和该类型的其他值所共有的一簇属性（property），比如我们可以对数字进行相加，对列表进行拼接，诸如此类。</p><p>在对 Haskell 的类型系统进行更深入的探讨之前，不妨先来了解下，我们为什么要关心类型 ------ 也即是，它们是干什么用的？</p><p>在计算机的最底层，处理的都是没有任何附加结构的字节（byte）。而类型系统在这个基础上提供了<em>抽象</em>：它为那些单纯的字节加上了意义，使得我们可以说&quot;这些字节是文本&quot;，&quot;那些字节是机票预约数据&quot;，等等。</p><p>通常情况下，类型系统还会在标识类型的基础上更进一步：它会阻止我们混合使用不同的类型，避免程序错误。比如说，类型系统通常不会允许将一个酒店预约数据当作汽车租凭数据来使用。</p><p>引入抽象的使得我们可以忽略底层细节。举个例子，如果程序中的某个值是一个字符串，那么我不必考虑这个字符串在内部是如何实现的，只要像操作其他字符串一样，操作这个字符串就可以了。</p><p>类型系统的一个有趣的地方是，不同的类型系统的表现并不完全相同。实际上，不同类型系统有时候处理的还是不同种类的问题。</p><p>除此之外，一门语言的类型系统，还会深切地影响这门语言的使用者思考和编写程序的方式。而 Haskell 的类型系统则允许程序员以非常抽象的层次思考，并写出简洁、高效、健壮的代码。</p><h2 id="haskell_s_type_system" tabindex="-1"><a class="header-anchor" href="#haskell_s_type_system" aria-hidden="true">#</a> Haskell 的类型系统</h2><p>Haskell 中的类型有三个有趣的方面：首先，它们是强（strong）类型的；其次，它们是静态（static）的；第三，它们可以通过自动推导（automatically inferred）得出。</p><p>后面的三个小节会分别讨论这三个方面，介绍它们的长处和短处，并列举 Haskell 类型系统的概念和其他语言里相关构思之间的相似性。</p><h3 id="strong_types" tabindex="-1"><a class="header-anchor" href="#strong_types" aria-hidden="true">#</a> 强类型</h3><p>Haskell 的强类型系统会拒绝执行任何无意义的表达式，保证程序不会因为这些表达式而引起错误：比如将整数当作函数来使用，或者将一个字符串传给一个只接受整数参数的函数，等等。</p><p>遵守类型规则的表达式被称为是&quot;类型正确的&quot;（well typed），而不遵守类型规则、会引起类型错误的表达式被称为是&quot;类型不正确的&quot;（ill typed）。</p><p>Haskell 强类型系统的另一个作用是，它不会自动地将值从一个类型转换到另一个类型（转换有时又称为强制或变换）。举个例子，如果将一个整数值作为参数传给了一个接受浮点数的函数，C 编译器会自动且静默（silently）地将参数从整数类型转换为浮点类型，而 Haskell 编译器则会引发一个编译错误。</p><p>要在 Haskell 中进行类型转换，必须显式地使用类型转换函数。</p><p>有些时候，强类型会让某种类型代码的编写变得困难。比如说，一种编写底层 C 代码的典型方式就是将一系列字节数组当作复杂的数据结构来操作。这种做法的效率非常高，因为它避免了对字节的复制操作。因为 Haskell 不允许这种形式的转换，所以要获得同等结构形式的数据，可能需要进行一些复制操作，这可能会对性能造成细微影响。</p><p>强类型的最大好处是可以让 bug 在代码实际运行之前浮现出来。比如说，在强类型的语言中，&quot;不小心将整数当成了字符串来使用&quot;这样的情况不可能出现。</p><p>[注意：这里说的&quot;bug&quot;指的是类型错误，和我们常说的、通常意义上的 bug 有一些区别。]</p><h3 id="static_types" tabindex="-1"><a class="header-anchor" href="#static_types" aria-hidden="true">#</a> 静态类型</h3><p>静态类型系统指的是，编译器可以在编译期（而不是执行期）知道每个值和表达式的类型。Haskell 编译器或解释器会察觉出类型不正确的表达式，并拒绝这些表达式的执行：</p><pre><code>Prelude&gt; True &amp;&amp; &quot;False&quot;

&lt;interactive&gt;:2:9:
    Couldn&#39;t match expected type \`Bool&#39; with actual type \`[Char]&#39;
    In the second argument of \`(&amp;&amp;)&#39;, namely \`&quot;False&quot;&#39;
    In the expression: True &amp;&amp; &quot;False&quot;
    In an equation for \`it&#39;: it = True &amp;&amp; &quot;False&quot;
</code></pre><p>类似的类型错误在之前已经看过了：编译器发现值 <code>&quot;False&quot;</code> 的类型为 <code>[Char]</code> ，而 <code>(&amp;&amp;)</code> 操作符要求两个操作对象的类型都为 <code>Bool</code> ，虽然左边的操作对象 <code>True</code> 满足类型要求，但右边的操作对象 <code>&quot;False&quot;</code> 却不能匹配指定的类型，因此编译器以&quot;类型不正确&quot;为由，拒绝执行这个表达式。</p><p>静态类型有时候会让某种有用代码的编写变得困难。在 Python 这类语言里， duck typing 非常流行， 只要两个对象的行为足够相似，那么就可以在它们之间进行互换。 幸运的是， Haskell 提供的 typeclass 机制以一种安全、方便、实用的方式提供了大部分动态类型的优点。Haskell 也提供了一部分对全动态类型（truly dynamic types）编程的支持，尽管用起来没有专门支持这种功能的语言那么方便。</p><p>Haskell 对强类型和静态类型的双重支持使得程序不可能发生运行时类型错误，这也有助于捕捉那些轻微但难以发现的小错误，作为代价，在编程的时候就要付出更多的努力[译注：比如纠正类型错误和编写类型签名]。Haskell 社区有一种说法，一旦程序编译通过，那么这个程序的正确性就会比用其他语言来写要好得多。（一种更现实的说法是，Haskell 程序的小错误一般都很少。）</p><p>使用动态类型语言编写的程序，常常需要通过大量的测试来预防类型错误的发生，然而，测试通常很难做到巨细无遗：一些常见的任务，比如重构，非常容易引入一些测试没覆盖到的新类型错误。</p><p>另一方面，在 Haskell 里，编译器负责检查类型错误：编译通过的 Haskell 程序是不可能带有类型错误的。而重构 Haskell 程序通常只是移动一些代码块，编译，修复编译错误，并重复以上步骤直到编译无错为止。</p><p>要理解静态类型的好处，可以用玩拼图的例子来打比方：在 Haskell 里，如果一块拼图的形状不正确，那么它就不能被使用。另一方面，动态类型的拼图全部都是 1 x 1 大小的正方形，这些拼图无论放在那里都可以匹配，为了验证这些拼图被放到了正确的地方，必须使用测试来进行检查。</p><h3 id="type_inference" tabindex="-1"><a class="header-anchor" href="#type_inference" aria-hidden="true">#</a> 类型推导</h3><p>关于类型系统，最后要说的是，Haskell 编译器可以自动推断出程序中几乎所有表达式的类型[注：有时候要提供一些信息，帮助编译器理解程序代码]。这个过程被称为类型推导（type inference）。</p><p>虽然 Haskell 允许我们显式地为任何值指定类型，但类型推导使得这种工作通常是可选的，而不是非做不可的事。</p><h2 id="what_to_expect_from_type_system" tabindex="-1"><a class="header-anchor" href="#what_to_expect_from_type_system" aria-hidden="true">#</a> 正确理解类型系统</h2><p>对 Haskell 类型系统能力和好处的探索会花费好几个章节。在刚开始的时候，处理 Haskell 的类型可能会让你觉得有些麻烦。</p><p>比如说，在 Python 和 Ruby 里，你只要写下程序，然后测试一下程序的执行结果是否正确就够了，但是在 Haskell ，你还要先确保程序能通过类型检查。那么，为什么要多走这些弯路呢？</p><p>答案是，静态、强类型检查使得 Haskell 更安全，而类型推导则让它更精炼、简洁。这样得出的的结果是，比起其他流行的静态语言，Haskell 要来得更安全，而比起其他流行的动态语言， Haskell 的表现力又更胜一筹。</p><p>这并不是吹牛，等你看完这本书之后就会了解这一点。</p><p>修复编译时的类型错误刚开始会让人觉得增加了不必要的工作量，但是，换个角度来看，这不过是提前完成了调试工作：编译器在处理程序时，会将代码中的逻辑错误一一展示出来，而不是一声不吭，任由代码在运行时出错。</p><p>更进一步来说，因为 Haskell 里值和函数的类型都可以通过自动推导得出，所以 Haskell 程序既可以获得静态类型带来的所有好处，而又不必像传统的静态类型语言那样，忙于添加各种各样的类型签名[译注：比如 C 语言的函数原型声明] ------</p><p>在其他语言里，类型系统为编译器服务；而在 Haskell 里，类型系统为你服务。唯一的要求是，你需要学习如何在类型系统提供的框架下工作。</p><p>对 Haskell 类型的运用将遍布整本书，这些技术将帮助我们编写和测试实用的代码。</p><h2 id="some_common_basic_types" tabindex="-1"><a class="header-anchor" href="#some_common_basic_types" aria-hidden="true">#</a> 一些常用的基本类型</h2><p>以下是 Haskell 里最常用的一些基本类型，其中有些在之前的章节里已经看过了：</p><p><code>Char</code></p><p>单个 Unicode 字符。</p><p><code>Bool</code></p><p>表示一个布尔逻辑值。这个类型只有两个值： <code>True</code> 和 <code>False</code> 。</p><p><code>Int</code></p><p>带符号的定长（fixed-width）整数。这个值的准确范围由机器决定：在 32 位机器里， <code>Int</code> 为 32 位宽，在 64 位机器里， <code>Int</code> 为 64 位宽。Haskell 保证 <code>Int</code> 的宽度不少于 28 位。（数值类型还可以是 8 位、16 位，等等，也可以是带符号和无符号的，以后会介绍。）</p><p><code>Integer</code></p><p>不限长度的带符号整数。 <code>Integer</code> 并不像 <code>Int</code> 那么常用，因为它们需要更多的内存和更大的计算量。另一方面，对 <code>Integer</code> 的计算不会造成溢出，因此使用 <code>Integer</code> 的计算结果更可靠。</p><p><code>Double</code></p><p>用于表示浮点数。长度由机器决定，通常是 64 位。（Haskell 也有 <code>Float</code> 类型，但是并不推荐使用，因为编译器都是针对 <code>Double</code> 来进行优化的，而 <code>Float</code> 类型值的计算要慢得多。）</p><p>在前面的章节里，我们已经见到过 <code>::</code> 符号。除了用来表示类型之外，它还可以用于进行<em>类型签名</em>。比如说， <code>exp :: T</code> 就是向 Haskell 表示， <code>exp</code> 的类型是 <code>T</code> ，而 <code>:: T</code> 就是表达式 <code>exp</code> 的类型签名。如果一个表达式没有显式地指名类型的话，那么它的类型就通过自动推导来决定：</p><pre><code>Prelude&gt; :type &#39;a&#39;
&#39;a&#39; :: Char

Prelude&gt; &#39;a&#39;            -- 自动推导
&#39;a&#39;

Prelude&gt; &#39;a&#39; :: Char    -- 显式签名
&#39;a&#39;
</code></pre><p>当然了，类型签名必须正确，否则 Haskell 编译器就会产生错误：</p><pre><code>Prelude&gt; &#39;a&#39; :: Int     -- 试图将一个字符值标识为 Int 类型

&lt;interactive&gt;:7:1:
    Couldn&#39;t match expected type \`Int&#39; with actual type \`Char&#39;
    In the expression: &#39;a&#39; :: Int
    In an equation for \`it&#39;: it = &#39;a&#39; :: Int
</code></pre><h2 id="function_application" tabindex="-1"><a class="header-anchor" href="#function_application" aria-hidden="true">#</a> 调用函数</h2><p>要调用一个函数，先写出它的名字，后接函数的参数：</p><pre><code>Prelude&gt; odd 3
True

Prelude&gt; odd 6
False
</code></pre><p>注意，函数的参数不需要用括号来包围，参数和参数之间也不需要用逗号来隔开[译注：使用空格就可以了]：</p><pre><code>Prelude&gt; compare 2 3
LT

Prelude&gt; compare 3 3
EQ

Prelude&gt; compare 3 2
GT
</code></pre><p>Haskell 函数的应用方式和其他语言差不多，但是格式要来得更简单。</p><p>因为函数应用的优先级比操作符要高，因此以下两个表达式是相等的：</p><pre><code>Prelude&gt; (compare 2 3) == LT
True

Prelude&gt; compare 2 3 == LT
True
</code></pre><p>有时候，为了可读性考虑，添加一些额外的括号也是可以理解的，上面代码的第一个表达式就是这样一个例子。另一方面，在某些情况下，我们<em>必须</em>使用括号来让编译器知道，该如何处理一个复杂的表达式：</p><pre><code>Prelude&gt; compare (sqrt 3) (sqrt 6)
LT
</code></pre><p>这个表达式将 <code>sqrt 3</code> 和 <code>sqrt 6</code> 的计算结果分别传给 <code>compare</code> 函数。如果将括号移走， Haskell 编译器就会产生一个编译错误，因为它认为我们将四个参数传给了只需要两个参数的 <code>compare</code> 函数：</p><pre><code>Prelude&gt; compare sqrt 3 sqrt 6

&lt;interactive&gt;:17:1:
    The function \`compare&#39; is applied to four arguments,
    but its type \`a0 -&gt; a0 -&gt; Ordering&#39; has only two
    In the expression: compare sqrt 3 sqrt 6
    In an equation for \`it&#39;: it = compare sqrt 3 sqrt 6
</code></pre><h2 id="useful_composite_data_types_lists_and_tuples" tabindex="-1"><a class="header-anchor" href="#useful_composite_data_types_lists_and_tuples" aria-hidden="true">#</a> 复合数据类型：列表和元组</h2><p>复合类型通过其他类型构建得出。列表和元组是 Haskell 中最常用的复合数据类型。</p><p>在前面介绍字符串的时候，我们就已经见到过列表类型了： <code>String</code> 是 <code>[Char]</code> 的别名，而 <code>[Char]</code> 则表示由 <code>Char</code> 类型组成的列表。</p><p><code>head</code> 函数取出列表的第一个元素：</p><pre><code>Prelude&gt; head [1, 2, 3, 4]
1

Prelude&gt; head [&#39;a&#39;, &#39;b&#39;, &#39;c&#39;]
&#39;a&#39;

Prelude&gt; head []
*** Exception: Prelude.head: empty list
</code></pre><p>和 <code>head</code> 相反， <code>tail</code> 取出列表里除了第一个元素之外的其他元素：</p><pre><code>Prelude&gt; tail [1, 2, 3, 4]
[2,3,4]

Prelude&gt; tail [2, 3, 4]
[3,4]

Prelude&gt; tail [True, False]
[False]

Prelude&gt; tail &quot;list&quot;
&quot;ist&quot;

Prelude&gt; tail []
*** Exception: Prelude.tail: empty list
</code></pre><p>正如前面的例子所示， <code>head</code> 和 <code>tail</code> 函数可以处理不同类型的列表。将 <code>head</code> 应用于 <code>[Char]</code> 类型的列表，结果为一个 <code>Char</code> 类型的值，而将它应用于 <code>[Bool]</code> 类型的值，结果为一个 <code>Bool</code> 类型的值。 <code>head</code> 函数并不关心它处理的是何种类型的列表。</p><p>因为列表中的值可以是任意类型，所以我们可以称列表为类型<em>多态</em>（polymorphic）的。当需要编写带有多态类型的代码时，需要使用<em>类型变量</em>。这些类型变量以小写字母开头，作为一个占位符，最终被一个具体的类型替换。</p><p>比如说， <code>[a]</code> 用一个方括号包围一个类型变量 <code>a</code> ，表示一个&quot;类型为 <code>a</code> 的列表&quot;。这也就是说&quot;我不在乎列表是什么类型，尽管给我一个列表就是了&quot;。</p><p>当需要一个带有具体类型的列表时，就需要用一个具体的类型去替换类型变量。比如说， <code>[Int]</code> 表示一个包含 <code>Int</code> 类型值的列表，它用 <code>Int</code> 类型替换了类型变量 <code>a</code> 。又比如， <code>[MyPersonalType]</code> 表示一个包含 <code>MyPersonalType</code> 类型值的列表，它用 <code>MyPersonalType</code> 替换了类型变量 <code>a</code> 。</p><p>这种替换还还可以递归地进行： <code>[[Int]]</code> 是一个包含 <code>[Int]</code> 类型值的列表，而 <code>[Int]</code> 又是一个包含 <code>Int</code> 类型值的列表。以下例子展示了一个包含 <code>Bool</code> 类型的列表的列表：</p><pre><code>Prelude&gt; :type [[True], [False, False]]
[[True], [False, False]] :: [[Bool]]
</code></pre><p>假设现在要用一个数据结构，分别保存一本书的出版年份 ------ 一个整数，以及这本书的书名 ------ 一个字符串。很明显，列表不能保存这样的信息，因为列表只能接受类型相同的值。这时，我们就需要使用元组：</p><pre><code>Prelude&gt; (1964, &quot;Labyrinths&quot;)
(1964,&quot;Labyrinths&quot;)
</code></pre><p>元组和列表非常不同，它们的两个属性刚刚相反：列表可以任意长，且只能包含类型相同的值；元组的长度是固定的，但可以包含不同类型的值。</p><p>元组的两边用括号包围，元素之间用逗号分割。元组的类型信息也使用同样的格式：</p><pre><code>Prelude&gt; :type (True, &quot;hello&quot;)
(True, &quot;hello&quot;) :: (Bool, [Char])

Prelude&gt; (4, [&#39;a&#39;, &#39;m&#39;], (16, True))
(4,&quot;am&quot;,(16,True))
</code></pre><p>Haskell 有一个特殊的类型 <code>()</code> ，这种类型只有一个值 <code>()</code> ，它的作用相当于包含零个元素的元组，类似于 C 语言中的 <code>void</code> ：</p><pre><code>Prelude&gt; :t ()
() :: ()
</code></pre><p>通常用元组中元素的数量作为称呼元组的前缀，比如&quot;2-元组&quot;用于称呼包含两个元素的元组，&quot;5-元组&quot;用于称呼包含五个元素的元组，诸如此类。Haskell 不能创建 1-元组，因为 Haskell 没有相应的创建 1-元组的语法（notion）。另外，在实际编程中，元组的元素太多会让代码变得混乱，因此元组通常只包含几个元素。</p><p>元组的类型由它所包含元素的数量、位置和类型决定。这意味着，如果两个元组里都包含着同样类型的元素，而这些元素的摆放位置不同，那么它们的类型就不相等，就像这样：</p><pre><code>Prelude&gt; :type (False, &#39;a&#39;)
(False, &#39;a&#39;) :: (Bool, Char)

Prelude&gt; :type (&#39;a&#39;, False)
(&#39;a&#39;, False) :: (Char, Bool)
</code></pre><p>除此之外，即使两个元组之间有一部分元素的类型相同，位置也一致，但是，如果它们的元素数量不同，那么它们的类型也不相等：</p><pre><code>Prelude&gt; :type (False, &#39;a&#39;)
(False, &#39;a&#39;) :: (Bool, Char)

Prelude&gt; :type (False, &#39;a&#39;, &#39;b&#39;)
(False, &#39;a&#39;, &#39;b&#39;) :: (Bool, Char, Char)
</code></pre><p>只有元组中的数量、位置和类型都完全相同，这两个元组的类型才是相同的：</p><pre><code>Prelude&gt; :t (False, &#39;a&#39;)
(False, &#39;a&#39;) :: (Bool, Char)

Prelude&gt; :t (True, &#39;b&#39;)
(True, &#39;b&#39;) :: (Bool, Char)
</code></pre><p>元组通常用于以下两个地方：</p><ul><li>如果一个函数需要返回多个值，那么可以将这些值都包装到一个元组中，然后返回元组作为函数的值。</li><li>当需要使用定长容器，但又没有必要使用自定义类型的时候，就可以使用元组来对值进行包装。</li></ul><h2 id="functions_over_lists_and_tuples" tabindex="-1"><a class="header-anchor" href="#functions_over_lists_and_tuples" aria-hidden="true">#</a> 处理列表和元组的函数</h2><p>前面的内容介绍了如何构造列表和元组，现在来看看处理这两种数据结构的函数。</p><p>函数 <code>take</code> 和 <code>drop</code> 接受两个参数，一个数字 <code>n</code> 和一个列表 <code>l</code> 。</p><p><code>take</code> 返回一个包含 <code>l</code> 前 <code>n</code> 个元素的列表：</p><pre><code>Prelude&gt; take 2 [1, 2, 3, 4, 5]
[1,2]
</code></pre><p><code>drop</code> 则返回一个包含 <code>l</code> 丢弃了前 <code>n</code> 个元素之后，剩余元素的列表：</p><pre><code>Prelude&gt; drop 2 [1, 2, 3, 4, 5]
[3,4,5]
</code></pre><p>函数 <code>fst</code> 和 <code>snd</code> 接受一个元组作为参数，返回该元组的第一个元素和第二个元素：</p><pre><code>Prelude&gt; fst (1, &#39;a&#39;)
1

Prelude&gt; snd (1, &#39;a&#39;)
&#39;a&#39;
</code></pre><h3 id="passing_an_expression_to_function" tabindex="-1"><a class="header-anchor" href="#passing_an_expression_to_function" aria-hidden="true">#</a> 将表达式传给函数</h3><p>Haskell 的函数应用是左关联的。比如说，表达式 <code>a b c d</code> 等同于 <code>(((a b) c) d)</code> 。要将一个表达式用作另一个表达式的参数，那么就必须显式地使用括号来包围它，这样编译器才会知道我们的真正意思：</p><pre><code>Prelude&gt; head (drop 4 &quot;azety&quot;)
&#39;y&#39;
</code></pre><p><code>drop 4 &quot;azety&quot;</code> 这个表达式被一对括号显式地包围，作为参数传入 <code>head</code> 函数。</p><p>如果将括号移走，那么编译器就会认为我们试图将三个参数传给 <code>head</code> 函数，于是它引发一个错误：</p><pre><code>Prelude&gt; head drop 4 &quot;azety&quot;

&lt;interactive&gt;:26:6:
    Couldn&#39;t match expected type \`[t1 -&gt; t2 -&gt; t0]&#39;
    with actual type \`Int -&gt; [a0] -&gt; [a0]&#39;
    In the first argument of \`head&#39;, namely \`drop&#39;
    In the expression: head drop 4 &quot;azety&quot;
    In an equation for \`it&#39;: it = head drop 4 &quot;azety&quot;
</code></pre><h2 id="function_types" tabindex="-1"><a class="header-anchor" href="#function_types" aria-hidden="true">#</a> 函数类型</h2><p>使用 <code>:type</code> 命令可以查看函数的类型[译注：缩写形式为 <code>:t</code> ]：</p><pre><code>Prelude&gt; :type lines
lines :: String -&gt; [String]
</code></pre><p>符号 <code>-&gt;</code> 可以读作&quot;映射到&quot;，或者（稍微不太精确地），读作&quot;返回&quot;。函数的类型签名显示， <code>lines</code> 函数接受单个字符串，并返回包含字符串值的列表：</p><pre><code>Prelude&gt; lines &quot;the quick\\nbrown fox\\njumps&quot;
[&quot;the quick&quot;,&quot;brown fox&quot;,&quot;jumps&quot;]
</code></pre><p>结果表示， <code>lines</code> 函数接受一个字符串作为输入，并将这个字符串按行转义符号分割成多个字符串。</p><p>从 <code>lines</code> 函数的这个例子可以看出：函数的类型签名对于函数自身的功能有很大的提示作用，这种属性对于函数式语言的类型来说，意义重大。</p><p>[译注： <code>String -&gt; [String]</code> 的实际意思是指 <code>lines</code> 函数定义了一个从 <code>String</code> 到 <code>[String]</code> 的函数映射，因此，这里将 <code>-&gt;</code> 的读法 <code>to</code> 翻译成&quot;映射到&quot;。]</p><h2 id="purity" tabindex="-1"><a class="header-anchor" href="#purity" aria-hidden="true">#</a> 纯度</h2><p><em>副作用</em>指的是，函数的行为受系统的全局状态所影响。</p><p>举个命令式语言的例子：假设有某个函数，它读取并返回某个全局变量，如果程序中的其他代码可以修改这个全局变量的话，那么这个函数的返回值就取决于这个全局变量在某一时刻的值。我们说这个函数带有副作用，尽管它并不亲自修改全局变量。</p><p>副作用本质上是函数的一种不可见的（invisible）输入或输出。Haskell 的函数在默认情况下都是无副作用的：函数的结果只取决于显式传入的参数。</p><p>我们将带副作用的函数称为&quot;不纯（impure）函数&quot;，而将不带副作用的函数称为&quot;纯（pure）函数&quot;。</p><p>从类型签名可以看出一个 Haskell 函数是否带有副作用 ------ 不纯函数的类型签名都以 <code>IO</code> 开头：</p><pre><code>Prelude&gt; :type readFile
readFile :: FilePath -&gt; IO String
</code></pre><h2 id="haskell_source_files_and_writing_simple_function" tabindex="-1"><a class="header-anchor" href="#haskell_source_files_and_writing_simple_function" aria-hidden="true">#</a> Haskell 源码，以及简单函数的定义</h2><p>既然我们已经学会了如何应用函数，那么是时候回过头来，学习怎样去编写函数。</p><p>因为 ghci 只支持 Haskell 特性的一个非常受限的子集，因此，尽管可以在 ghci 里面定义函数，但那里并不是编写函数最适当的环境。更关键的是， ghci 里面定义函数的语法和 Haskell 源码里定义函数的语法并不相同。综上所述，我们选择将代码写在源码文件里。</p><p>Haskell 源码通常以 <em>.hs</em> 作为后缀。我们创建一个 <code>add.hs</code> 文件，并将以下定义添加到文件中：</p><p>::: literalinclude /code/ch02/add.hs :::</p><p>[译注：原书代码里的路径为 <code>ch03/add.hs</code> ，是错误的。]</p><p><code>=</code> 号左边的 <code>add a b</code> 是函数名和函数参数，而右边的 <code>a + b</code> 则是函数体，符号 <code>=</code> 表示将左边的名字（函数名和函数参数）定义为右边的表达式（函数体）。</p><p>将 <code>add.hs</code> 保存之后，就可以在 ghci 里通过 <code>:load</code> 命令（缩写为 <code>:l</code> ）载入它，接着就可以像使用其他函数一样，调用 <code>add</code> 函数了：</p><pre><code>Prelude&gt; :load add.hs
[1 of 1] Compiling Main             ( add.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; add 1 2  -- 包载入成功之后 ghci 的提示符会发生变化
3
</code></pre><p>[译注：你的当前文件夹（CWD）必须是 <code>ch02</code> 文件夹，否则直接载入 <code>add.hs</code> 会失败]</p><p>当以 <code>1</code> 和 <code>2</code> 作为参数应用 <code>add</code> 函数的时候，它们分别被赋值给（或者说，绑定到）函数定义中的变量 <code>a</code> 和 <code>b</code> ，因此得出的结果表达式为 <code>1 + 2</code> ，而这个表达式的值 <code>3</code> 就是本次函数应用的结果。</p><p>Haskell 不使用 <code>return</code> 关键字来返回函数值：因为一个函数就是一个单独的表达式（expression），而不是一组陈述（statement），求值表达式所得的结果就是函数的返回值。（实际上，Haskell 有一个名为 <code>return</code> 的函数，但它和命令式语言里的 <code>return</code> 不是同一回事。）</p><h3 id="just_what_is_a_variable_anyway" tabindex="-1"><a class="header-anchor" href="#just_what_is_a_variable_anyway" aria-hidden="true">#</a> 变量</h3><h2 id="在-haskell里-可以使用变量来赋予表达式名字-一旦变量绑定了-也即是-关联起-某个表达式-那么这个变量的值就不会改变" tabindex="-1"><a class="header-anchor" href="#在-haskell里-可以使用变量来赋予表达式名字-一旦变量绑定了-也即是-关联起-某个表达式-那么这个变量的值就不会改变" aria-hidden="true">#</a> 在 Haskell 里，可以使用变量来赋予表达式名字：一旦变量绑定了（也即是，关联起）某个表达式，那么这个变量的值就不会改变</h2><p>我们总能用这个变量来指代它所关联的表达式，并且每次都会得到同样的结果。</p><p>如果你曾经用过命令式语言，就会发现 Haskell 的变量和命令式语言的变量很不同：在命令式语言里，一个变量通常用于标识一个内存位置（或者其他类似的东西），并且在任何时候，都可以随意修改这个变量的值。因此在不同时间点上，访问这个变量得出的值可能是完全不同的。</p><p>对变量的这两种不同的处理方式产生了巨大的差别： 在 Haskell 程序里面， 当变量和表达式绑定之后， 我们总能将变量替换成相应的表达式。 但是在声明式语言里面就没有办法做这样的替换，因为变量的值可能无时不刻都处在改变当中。</p><p>举个例子，以下 Python 脚本打印出值 <code>11</code> ：</p><pre><code>x = 10
x = 11
print(x)
</code></pre><p>[译注：这里将原书的代码从 <code>print x</code> 改为 <code>print(x)</code> ，确保代码在 Python 2 和 Python 3 都可以顺利执行。]</p><p>然后，试着在 Haskell 里做同样的事：</p><p>::: literalinclude /code/ch02/Assign.hs :::</p><p>但是 Haskell 并不允许做这样的多次赋值：</p><pre><code>Prelude&gt; :load Assign
[1 of 1] Compiling Main             ( Assign.hs, interpreted )

Assign.hs:3:1:
    Multiple declarations of \`x&#39;
    Declared at: Assign.hs:2:1
                 Assign.hs:3:1
Failed, modules loaded: none.
</code></pre><h3 id="conditional_evaluation" tabindex="-1"><a class="header-anchor" href="#conditional_evaluation" aria-hidden="true">#</a> 条件求值</h3><p>和很多语言一样，Haskell 也有自己的 <code>if</code> 表达式。本节先说明怎么用这个表达式，然后再慢慢介绍它的详细特性。</p><p>我们通过编写一个个人版本的 <code>drop</code> 函数来熟悉 <code>if</code> 表达式。先来回顾一下 <code>drop</code> 的行为：</p><pre><code>Prelude&gt; drop 2 &quot;foobar&quot;
&quot;obar&quot;

Prelude&gt; drop 4 &quot;foobar&quot;
&quot;ar&quot;

Prelude&gt; drop 4 [1, 2]
[]

Prelude&gt; drop 0 [1, 2]
[1,2]

Prelude&gt; drop 7 []
[]

Prelude&gt; drop (-2) &quot;foo&quot;
&quot;foo&quot;
</code></pre><p>从测试代码的反馈可以看到。当 <code>drop</code> 函数的第一个参数小于或等于 <code>0</code> 时， <code>drop</code> 函数返回整个输入列表。否则，它就从列表左边开始移除元素，一直到移除元素的数量足够，或者输入列表被清空为止。</p><p>以下是带有同样行为的 <code>myDrop</code> 函数，它使用 <code>if</code> 表达来决定该做什么。而代码中的 <code>null</code> 函数则用于检查列表是否为空：</p><p>::: literalinclude /code/ch02/myDrop.hs :::</p><p>在 Haskell 里，代码的缩进非常重要：它会延续（continue）一个已存在的定义，而不是新创建一个。所以，不要省略缩进！</p><p>变量 <code>xs</code> 展示了一个命名列表的常见模式： <code>s</code> 可以视为后缀，而 <code>xs</code> 则表示&quot;复数个 <code>x</code> &quot;。</p><p>先保存文件，试试 <code>myDrop</code> 函数是否如我们所预期的那样工作：</p><pre><code>[1 of 1] Compiling Main             ( myDrop.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; myDrop 2 &quot;foobar&quot;
&quot;obar&quot;

*Main&gt; myDrop 4 &quot;foobar&quot;
&quot;ar&quot;

*Main&gt; myDrop 4 [1, 2]
[]

*Main&gt; myDrop 0 [1, 2]
[1,2]

*Main&gt; myDrop 7 []
[]

*Main&gt; myDrop (-2) &quot;foo&quot;
&quot;foo&quot;
</code></pre><p>好的，代码正如我们所想的那样运行，现在是时候回过头来，说明一下 <code>myDrop</code> 的函数体里都干了些什么：</p><p><code>if</code> 关键字引入了一个带有三个部分的表达式：</p><ul><li>跟在 <code>if</code> 之后的是一个 <code>Bool</code> 类型的表达式，它是 <code>if</code> 的条件部分。</li><li>跟在 <code>then</code> 关键字之后的是另一个表达式，这个表达式在条件部分的值为 <code>True</code> 时被执行。</li><li>跟在 <code>else</code> 关键字之后的又是另一个表达式，这个表达式在条件部分的值为 <code>False</code> 时被执行。</li></ul><p>我们将跟在 <code>then</code> 和 <code>else</code> 之后的表达式称为&quot;分支&quot;。不同分支之间的类型必须相同。像是 <code>if True then 1 else &quot;foo&quot;</code> 这样的表达式会产生错误，因为两个分支的类型并不相同：</p><pre><code>Prelude&gt; if True then 1 else &quot;foo&quot;

&lt;interactive&gt;:2:14:
    No instance for (Num [Char])
        arising from the literal \`1&#39;
    Possible fix: add an instance declaration for (Num [Char])
    In the expression: 1
    In the expression: if True then 1 else &quot;foo&quot;
    In an equation for \`it&#39;: it = if True then 1 else &quot;foo&quot;
</code></pre><p>记住，Haskell 是一门以表达式为主导（expression-oriented）的语言。在命令式语言中，代码由陈述（statement）而不是表达式组成，因此在省略 <code>if</code> 语句的 <code>else</code> 分支的情况下，程序仍是有意义的。但是，当代码由表达式组成时，一个缺少 <code>else</code> 分支的 <code>if</code> 语句，在条件部分为 <code>False</code> 时，是没有办法给出一个结果的，当然这个 <code>else</code> 分支也不会有任何类型，因此，省略 <code>else</code> 分支对于 Haskell 是无意义的，编译器也不会允许这么做。</p><p>程序里还有几个新东西需要解释。其中， <code>null</code> 函数检查一个列表是否为空：</p><pre><code>Prelude&gt; :type null
null :: [a] -&gt; Bool

Prelude&gt; null []
True

Prelude&gt; null [1, 2, 3]
False
</code></pre><p>而 <code>(||)</code> 操作符对它的 <code>Bool</code> 类型参数执行一个逻辑或（logical or）操作：</p><pre><code>Prelude&gt; :type (||)
(||) :: Bool -&gt; Bool -&gt; Bool

Prelude&gt; True || False
True

Prelude&gt; True || True
True
</code></pre><p>另外需要注意的是， <code>myDrop</code> 函数是一个递归函数：它通过调用自身来解决问题。关于递归，书本稍后会做更详细的介绍。</p><p>最后，整个 <code>if</code> 表达式被分成了多行，而实际上，它也可以写成一行：</p><p>::: literalinclude /code/ch02/myDropX.hs :::</p><p>[译注：原文这里的文件名称为 <code>myDrop.hs</code> ，为了和之前的 <code>myDrop.hs</code> 区别开来，这里修改文件名，让它和函数名 <code>myDropX</code> 保持一致。]</p><pre><code>Prelude&gt; :load myDropX.hs
[1 of 1] Compiling Main             ( myDropX.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; myDropX 2 &quot;foobar&quot;
&quot;obar&quot;
</code></pre><p>这个一行版本的 <code>myDrop</code> 比起之前的定义要难读得多，为了可读性考虑，一般来说，总是应该通过分行来隔开条件部分和两个分支。</p><p>作为对比，以下是一个 Python 版本的 <code>myDrop</code> ，它的结构和 Haskell 版本差不多：</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">myDrop</span><span class="token punctuation">(</span>n<span class="token punctuation">,</span> elts<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">while</span> n <span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token keyword">and</span> elts<span class="token punctuation">:</span>
        n <span class="token operator">=</span> n <span class="token operator">-</span><span class="token number">1</span>
        elts <span class="token operator">=</span> elts<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">:</span><span class="token punctuation">]</span>
    <span class="token keyword">return</span> elts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="understanding_evaluation_by_example" tabindex="-1"><a class="header-anchor" href="#understanding_evaluation_by_example" aria-hidden="true">#</a> 通过示例了解求值</h2><p>前面对 <code>myDrop</code> 的描述关注的都是表面上的特性。我们需要更进一步，开发一个关于函数是如何被应用的心智模型：为此，我们先从一些简单的示例出发，逐步深入，直到搞清楚 <code>myDrop 2 &quot;abcd&quot;</code> 到底是怎样求值为止。</p><p>在前面的章节里多次谈到，可以使用一个表达式去代换一个变量。在这部分的内容里，我们也会看到这种替换能力：计算过程需要多次对表达式进行重写，并将变量替换为表达式，直到产生最终结果为止。为了帮助理解，最好准备一些纸和笔，跟着书本的说明，自己计算一次。</p><h3 id="lazy_evaluation" tabindex="-1"><a class="header-anchor" href="#lazy_evaluation" aria-hidden="true">#</a> 惰性求值</h3><p>先从一个简单的、非递归例子开始，其中 <code>mod</code> 函数是典型的取模函数：</p><p>::: literalinclude /code/ch02/isOdd.hs :::</p><p>[译注：原文的文件名为 <code>RoundToEven.hs</code> ，这里修改成 <code>isOdd.hs</code> ，和函数名 <code>isOdd</code> 保持一致。]</p><p>我们的第一个任务是，弄清楚 <code>isOdd (1 + 2)</code> 的结果是如何求值出的。</p><p>在使用<em>严格</em>求值的语言里，函数的参数总是在应用函数之前被求值。以 <code>isOdd</code> 为例子：子表达式 <code>(1 + 2)</code> 会首先被求值，得出结果 <code>3</code> 。接着，将 <code>3</code> 绑定到变量 <code>n</code> ，应用到函数 <code>isOdd</code> 。最后， <code>mod 3 2</code> 返回 <code>1</code> ，而 <code>1 == 1</code> 返回 <code>True</code> 。</p><p>Haskell 使用了另外一种求值方式 ------ <em>非严格</em>求值。在这种情况下，求值 <code>isOdd (1 + 2)</code> <em>并不会</em>即刻使得子表达式 <code>1 + 2</code> 被求值为 <code>3</code> ，相反，编译器做出了一个&quot;承诺&quot;，说，&quot;当真正有需要的时候，我有办法计算出 <code>isOdd (1 + 2)</code> 的值&quot;。</p><p>用于追踪未求值表达式的记录被称为块（thunk）。这就是事情发生的经过：编译器通过创建块来延迟表达式的求值，直到这个表达式的值真正被需要为止。如果某个表达式的值不被需要，那么从始至终，这个表达式都不会被求值。</p><p>非严格求值通常也被称为<em>惰性求值</em>。[注：实际上，&quot;非严格&quot;和&quot;惰性&quot;在技术上有些细微的差别，但这里不讨论这些细节。]</p><h3 id="a_more_involved_example" tabindex="-1"><a class="header-anchor" href="#a_more_involved_example" aria-hidden="true">#</a> 一个更复杂的例子</h3><p>现在，将注意力放回 <code>myDrop 2 &quot;abcd&quot;</code> 上面，考察它的结果是如何计算出来的：</p><pre><code>Prelude&gt; :load &quot;myDrop.hs&quot;
[1 of 1] Compiling Main             ( myDrop.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; myDrop 2 &quot;abcd&quot;
&quot;cd&quot;
</code></pre><p>当执行表达式 <code>myDrop 2 &quot;abcd&quot;</code> 时，函数 <code>myDrop</code> 应用于值 <code>2</code> 和 <code>&quot;abcd&quot;</code> ，变量 <code>n</code> 被绑定为 <code>2</code> ，而变量 <code>xs</code> 被绑定为 <code>&quot;abcd&quot;</code> 。将这两个变量代换到 <code>myDrop</code> 的条件判断部分，就得出了以下表达式：</p><pre><code>*Main&gt; :type 2 &lt;= 0 || null &quot;abcd&quot;
2 &lt;= 0 || null &quot;abcd&quot; :: Bool
</code></pre><p>编译器需要对表达式 <code>2 &lt;= 0 || null &quot;abcd&quot;</code> 进行求值，从而决定 <code>if</code> 该执行哪一个分支。这需要对 <code>(||)</code> 表达式进行求值，而要求值这个表达式，又需要对它的左操作符进行求值：</p><pre><code>*Main&gt; 2 &lt;= 0
False
</code></pre><p>将值 <code>False</code> 代换到 <code>(||)</code> 表达式当中，得出以下表达式：</p><pre><code>*Main&gt; :type False || null &quot;abcd&quot;
False || null &quot;abcd&quot; :: Bool
</code></pre><p>如果 <code>(||)</code> 左操作符的值为 <code>True</code> ，那么 <code>(||)</code> 就不需要对右操作符进行求值，因为整个 <code>(||)</code> 表达式的值已经由左操作符决定了。[译注：在逻辑或计算中，只要有一个变量的值为真，那么结果就为真。]另一方面，因为这里左操作符的值为 <code>False</code> ，那么 <code>(||)</code> 表达式的值由右操作符的值来决定：</p><pre><code>*Main&gt; null &quot;abcd&quot;
False
</code></pre><p>最后，将左右两个操作对象的值分别替换回 <code>(||)</code> 表达式，得出以下表达式：</p><pre><code>*Main&gt; False || False
False
</code></pre><p>这个结果表明，下一步要求值的应该是 <code>if</code> 表达式的 <code>else</code> 分支，而这个分支包含一个对 <code>myDrop</code> 函数自身的递归调用： <code>myDrop (2 - 1) (tail &quot;abcd&quot;)</code> 。</p><h3 id="recursion" tabindex="-1"><a class="header-anchor" href="#recursion" aria-hidden="true">#</a> 递归</h3><p>当递归地调用 <code>myDrop</code> 的时候， <code>n</code> 被绑定为块 <code>2 - 1</code> ，而 <code>xs</code> 被绑定为 <code>tail &quot;abcd&quot;</code> 。</p><p>于是再次对 <code>myDrop</code> 函数进行求值，这次将新的值替换到 <code>if</code> 的条件判断部分：</p><pre><code>*Main&gt; :type (2 - 1) &lt;= 0 || null (tail &quot;abcd&quot;)
(2 - 1) &lt;= 0 || null (tail &quot;abcd&quot;) :: Bool
</code></pre><p>对 <code>(||)</code> 的左操作符的求值过程如下：</p><pre><code>*Main&gt; :type (2 - 1)
(2 - 1) :: Num a =&gt; a

*Main&gt; 2 - 1
1

*Main&gt; 1 &lt;= 0
False
</code></pre><p>正如前面&quot;惰性求值&quot;一节所说的那样， <code>(2 - 1)</code> 只有在真正需要的时候才会被求值。同样，对右操作符 <code>(tail &quot;abcd&quot;)</code> 的求值也会被延迟，直到真正有需要时才被执行：</p><pre><code>*Main&gt; :type null (tail &quot;abcd&quot;)
null (tail &quot;abcd&quot;) :: Bool

*Main&gt; tail &quot;abcd&quot;
&quot;bcd&quot;

*Main&gt; null &quot;bcd&quot;
False
</code></pre><p>因为条件判断表达式的最终结果为 <code>False</code> ，所以这次执行的也是 <code>else</code> 分支，而被执行的表达式为 <code>myDrop (1 - 1) (tail &quot;bcd&quot;)</code> 。</p><h3 id="ending_the_recursion" tabindex="-1"><a class="header-anchor" href="#ending_the_recursion" aria-hidden="true">#</a> 终止递归</h3><p>这次递归调用将 <code>1 - 1</code> 绑定到 <code>n</code> ，而 <code>xs</code> 被绑定为 <code>tail &quot;bcd&quot;</code> ：</p><pre><code>*Main&gt; :type (1 - 1) &lt;= 0 || null (tail &quot;bcd&quot;)
(1 - 1) &lt;= 0 || null (tail &quot;bcd&quot;) :: Bool
</code></pre><p>再次对 <code>(||)</code> 操作符的左操作对象求值：</p><pre><code>*Main&gt; :type (1 - 1) &lt;= 0
(1 - 1) &lt;= 0 :: Bool
</code></pre><p>最终，我们得出了一个 <code>True</code> 值！</p><pre><code>*Main&gt; True || null (tail &quot;bcd&quot;)
True
</code></pre><p>因为 <code>(||)</code> 的右操作符 <code>null (tail &quot;bcd&quot;)</code> 并不影响表达式的计算结果，因此它没有被求值，而整个条件判断部分的最终值为 <code>True</code> 。于是 <code>then</code> 分支被求值：</p><pre><code>*Main&gt; :type tail &quot;bcd&quot;
tail &quot;bcd&quot; :: [Char]
</code></pre><h3 id="returning_from_the_recursion" tabindex="-1"><a class="header-anchor" href="#returning_from_the_recursion" aria-hidden="true">#</a> 从递归中返回</h3><p>请注意，在求值的最后一步，结果表达式 <code>tail &quot;bcd&quot;</code> 处于第二次对 <code>myDrop</code> 的递归调用当中。</p><p>因此，表达式 <code>tail &quot;bcd&quot;</code> 作为结果值，被返回给对 <code>myDrop</code> 的第二次递归调用：</p><pre><code>*Main&gt; myDrop (1 - 1) (tail &quot;bcd&quot;) == tail &quot;bcd&quot;
True
</code></pre><p>接着，第二次递归调用所得的值（还是 <code>tail &quot;bcd&quot;</code> ），它被返回给第一次递归调用：</p><pre><code>*Main&gt; myDrop (2 - 1) (tail &quot;abcd&quot;) == tail &quot;bcd&quot;
True
</code></pre><p>然后，第一次递归调用也将 <code>tail &quot;bcd&quot;</code> 作为结果值，返回给最开始的 <code>myDrop</code> 调用：</p><pre><code>*Main&gt; myDrop 2 &quot;abcd&quot; == tail &quot;bcd&quot;
True
</code></pre><p>最终计算出结果 <code>&quot;cd&quot;</code> ：</p><pre><code>*Main&gt; myDrop 2 &quot;abcd&quot;
&quot;cd&quot;

*Main&gt; tail &quot;bcd&quot;
&quot;cd&quot;
</code></pre><p>注意，在从递归调用中退出并传递结果值的过程中， <code>tail &quot;bcd&quot;</code> 并不会被求值，只有当它返回到最开始的 <code>myDrop</code> 之后， ghci 需要打印这个值时， <code>tail &quot;bcd&quot;</code> 才会被求值。</p><h3 id="学到了什么" tabindex="-1"><a class="header-anchor" href="#学到了什么" aria-hidden="true">#</a> 学到了什么？</h3><p>这一节介绍了三个重要的知识点：</p><ul><li>可以通过代换（substitution）和重写（rewriting）去了解 Haskell 求值表达式的方式。</li><li>惰性求值可以延迟计算直到真正需要一个值为止，并且在求值时，也只执行可以确立出（establish）值的那部分表达式。[译注：比如之前提到的， <code>(||)</code> 的左操作对象的值为 <code>True</code> 时，就无需对右操作对象估值的情况。]</li><li>函数的返回值可能是一个块（一个被延迟计算的表达式）。</li></ul><h2 id="polymorphism_in_haskell" tabindex="-1"><a class="header-anchor" href="#polymorphism_in_haskell" aria-hidden="true">#</a> Haskell 里的多态</h2><p>之前介绍列表的时候提到过，列表是类型多态的，这一节会说明更多这方面的细节。</p><p>如果想要取出一个列表的最后一个元素，那么可以使用 <code>last</code> 函数。 <code>last</code> 函数的返回值和列表中的元素的类型是相同的，但是， <code>last</code> 函数并不介意输入的列表是什么类型，它对于任何类型的列表都可以产生同样的效果：</p><pre><code>Prelude&gt; last [1, 2, 3, 4, 5]
5

Prelude&gt; last &quot;baz&quot;
&#39;z&#39;
</code></pre><p><code>last</code> 的秘密就隐藏在类型签名里面：</p><pre><code>Prelude&gt; :type last
last :: [a] -&gt; a
</code></pre><p>这个类型签名可以读作&quot; <code>last</code> 接受一个列表，这个列表里的所有元素的类型都为 <code>a</code> ，并返回一个类型为 <code>a</code> 的元素作为返回值&quot;，其中 <code>a</code> 是类型变量。</p><p>如果函数的类型签名里包含类型变量，那么就表示这个函数的某些参数可以是任意类型，我们称这些函数是多态的。</p><p>如果将一个类型为 <code>[Char]</code> 的列表传给 <code>last</code> ，那么编译器就会用 <code>Char</code> 代换 <code>last</code> 函数类型签名中的所有 <code>a</code> ，从而得出一个类型为 <code>[Char] -&gt; Char</code> 的 <code>last</code> 函数。而对于 <code>[Int]</code> 类型的列表，编译器则产生一个类型为 <code>[Int] -&gt; Int</code> 类型的 <code>last</code> 函数，诸如此类。</p><p>这种类型的多态被称为<em>参数</em>多态。可以用一个类比来帮助理解这个名字：就像函数的参数可以被绑定到一个实际的值一样，Haskell 的类型也可以带有参数，并且在稍后可以将这些参数绑定到其它实际的类型上。</p><p>当看见一个参数化类型（parameterized type）时，这表示代码并不在乎实际的类型是什么。另外，我们还可以给出一个更强的陈述：没有办法知道参数化类型的实际类型是什么，也不能操作这种类型的值；不能创建这种类型的值，也不能对这种类型的值进行探查（inspect）。</p><p>参数化类型唯一能做的事，就是作为一个完全抽象的&quot;黑箱&quot;而存在。稍后的内容会解释为什么这个性质对参数化类型来说至关重要。</p><p>参数多态是 Haskell 支持的多态中最明显的一个。Haskell 的参数多态直接影响了 Java 和 C# 等语言的泛型（generic）功能的设计。Java 泛型中的类型变量和 Haskell 的参数化类型非常相似。而 C++ 的模板也和参数多态相去不远。</p><p>为了弄清楚 Haskell 的多态和其他语言的多态之间的区别，以下是一些被流行语言所使用的多态形式，这些形式的多态都没有在 Haskell 里出现：</p><p>在主流的面向对象语言中，<em>子类</em>多态是应用得最广泛的一种。C++ 和 Java 的继承机制实现了子类多态，使得子类可以修改或扩展父类所定义的行为。Haskell 不是面向对象语言，因此它没有提供子类多态。</p><p>另一个常见的多态形式是<em>强制</em>多态（coercion polymorphism），它允许值在类型之间进行隐式的转换。很多语言都提供了对强制多态的某种形式的支持，其中一个例子就是：自动将整数类型值转换成浮点数类型值。既然 Haskell 坚决反对自动类型转换，那么这种多态自然也不会出现在 Haskell 里面。</p><p>关于多态还有很多东西要说，本书第六章会再次回到这个主题。</p><h3 id="reasoning_about_polymorphic_functions" tabindex="-1"><a class="header-anchor" href="#reasoning_about_polymorphic_functions" aria-hidden="true">#</a> 对多态函数进行推理</h3><p>前面的《函数类型》小节介绍过，可以通过查看函数的类型签名来了解函数的行为。这种方法同样适用于对多态类型进行推理。</p><p>以 <code>fst</code> 函数为例子：</p><pre><code>Prelude&gt; :type fst
fst :: (a, b) -&gt; a
</code></pre><p>首先，函数签名包含两个类型变量 <code>a</code> 和 <code>b</code> ，表明元组可以包含不同类型的值。</p><p>其次， <code>fst</code> 函数的结果值的类型为 <code>a</code> 。前面提到过，参数多态没有办法知道输入参数的实际类型，并且它也没有足够的信息构造一个 <code>a</code> 类型的值，当然，它也不可以将 <code>a</code> 转换为 <code>b</code> 。因此，这个函数唯一合法的行为，就是返回元组的第一个元素。</p><h3 id="further_reading" tabindex="-1"><a class="header-anchor" href="#further_reading" aria-hidden="true">#</a> 延伸阅读</h3><p>前一节所说的 <code>fst</code> 函数的类型推导行为背后隐藏着非常高深的数学知识，并且可以延伸出一系列复杂的多态函数。有兴趣的话，可以参考 Philip Wadler 的 Theorems for free 论文。</p><h2 id="the_type_of_a_function_of_more_than_one_argument" tabindex="-1"><a class="header-anchor" href="#the_type_of_a_function_of_more_than_one_argument" aria-hidden="true">#</a> 多参数函数的类型</h2><p>截至目前为止，我们已经见到过一些函数，比如 <code>take</code> ，它们接受一个以上的参数：</p><pre><code>Prelude&gt; :type take
take :: Int -&gt; [a] -&gt; [a]
</code></pre><p>通过类型签名可以看到， <code>take</code> 函数和一个 <code>Int</code> 值以及两个列表有关。类型签名中的 <code>-&gt;</code> 符号是右关联的： Haskell 从右到左地串联起这些箭头，使用括号可以清晰地标示这个类型签名是怎样被解释的：</p><p>::: literalinclude /code/ch02/Take.hs :::</p><p>从这个新的类型签名可以看出， <code>take</code> 函数实际上只接受一个 <code>Int</code> 类型的参数，并返回另一个函数，这个新函数接受一个列表作为参数，并返回一个同类型的列表作为这个函数的结果。</p><p>以上的说明都是正确的，但要说清楚隐藏在这种变换背后的重要性并不容易，在《部分函数应用和柯里化》一节，我们会再次回到这个主题上。目前来说，可以简单地将类型签名中最后一个 <code>-&gt;</code> 右边的类型看作是函数结果的类型，而将前面的其他类型看作是函数参数的类型。</p><p>了解了这些之后，现在可以为前面定义的 <code>myDrop</code> 函数编写类型签名了：</p><pre><code>myDrop :: Int -&gt; [a] -&gt; [a]
</code></pre><h2 id="练习" tabindex="-1"><a class="header-anchor" href="#练习" aria-hidden="true">#</a> 练习</h2><p>1.Haskell 提供了一个标准函数, last :: [a] -&gt; a, 其返回一个列表的最后一个元素．单就从他的类型看, 这个函数拥有的合理行为是怎样的(忽略崩溃和无限循环)？ 有哪些少数的事情这个函数显然不能做到?</p><p>2.写一个函数 lastButOne, 返回列表倒数第二个元素.</p><p>3.加载 lastButOne 函数到 ghci, 并且尝试在不同长度的列表上测试. 当你传入的函数过短时候，发生了什么?</p><h2 id="why_the_fuss_over_purity" tabindex="-1"><a class="header-anchor" href="#why_the_fuss_over_purity" aria-hidden="true">#</a> 为什么要对纯度斤斤计较？</h2><p>很少有语言像 Haskell 那样，默认使用纯函数。这个选择不仅意义深远，而且至关重要。</p><p>因为纯函数的值只取决于输入的参数，所以通常只要看看函数的名字，还有它的类型签名，就能大概知道函数是干什么用的。</p><p>以 <code>not</code> 函数为例子：</p><pre><code>Prelude&gt; :type not
not :: Bool -&gt; Bool
</code></pre><p>即使抛开函数名不说，单单函数签名就极大地限制了这个函数可能有的合法行为：</p><ul><li>函数要么返回 True ，要么返回 False</li><li>函数直接将输入参数当作返回值返回</li><li>函数对它的输入值求反</li></ul><p>除此之外，我们还能肯定，这个函数不会干以下这些事情：读取文件，访问网络，或者返回当前时间。</p><p>纯度减轻了理解一个函数所需的工作量。一个纯函数的行为并不取决于全局变量、数据库的内容或者网络连接状态。纯代码（pure code）从一开始就是模块化的：每个函数都是自包容的，并且都带有定义良好的接口。</p><p>将纯函数作为默认的另一个不太明显的好处是，它使得与<em>不纯</em>代码之间的交互变得简单。一种常见的 Haskell 风格就是，将带有副作用的代码和不带副作用的代码分开处理。在这种情况下，不纯函数需要尽可能地简单，而复杂的任务则交给纯函数去做。</p><p>软件的大部分风险，都来自于与外部世界进行交互：它需要程序去应付错误的、不完整的数据，并且处理恶意的攻击，诸如此类。Haskell 的类型系统明确地告诉我们，哪一部分的代码带有副作用，让我们可以对这部分代码添加适当的保护措施。</p><p>通过这种将不纯函数隔离、并尽可能简单化的编程风格，程序的漏洞将变得非常少。</p><h2 id="conculsion" tabindex="-1"><a class="header-anchor" href="#conculsion" aria-hidden="true">#</a> 回顾</h2><p>这一章对 Haskell 的类型系统以及类型语法进行了快速的概览，了解了基本类型，并学习了如何去编写简单的函数。这章还介绍了多态、条件表达式、纯度和惰性求值。</p><p>这些知识必须被充分理解。在第三章，我们就会在这些基本知识的基础上，进一步加深对 Haskell 的理解。</p>`,292),n=[a];function p(r,l){return o(),d("div",null,n)}const u=e(t,[["render",p],["__file","2.html.vue"]]);export{u as default};
