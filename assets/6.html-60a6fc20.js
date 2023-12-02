import{_ as d,W as n,X as a,a2 as t,Y as e,Z as o}from"./framework-0bc3c581.js";const c={},r=t(`<h1 id="using-typeclasses" tabindex="-1"><a class="header-anchor" href="#using-typeclasses" aria-hidden="true">#</a> 第 6 章：使用类型类</h1><p>类型类（typeclass）跻身于 <code>Haskell</code> 最强大功能之列：它们（typeclasses）允许你定义通用接口，而其（这些接口）为各种不同的类型（type）提供一组公共特性集。类型类是某些基本语言特性的核心，比如相等性测试（equalitytesting）和数值操作符（numeric operators）。在讨论到底类型类是什么之前，我想解释下他们的作用（the need for them）。</p><h2 id="the-need-for-typeclasses" tabindex="-1"><a class="header-anchor" href="#the-need-for-typeclasses" aria-hidden="true">#</a> 类型类的作用</h2><p>假设因为某个原因， <code>Haskell</code> 语言的设计者拒绝实现相等性测试 <code>==</code> ，因此我们决定实现自己的 <code>==</code> 操作。 你的应用由一个简单的 <code>Color</code> 类型组成。 首先你尝试一下，像这样：</p><pre><code>-- file: ch06/naiveeq.hs
data Color = Red | Green | Blue

colorEq :: Color -&gt; Color -&gt; Bool
colorEq Red   Red   = True
colorEq Green Green = True
colorEq Blue  Blue  = True
colorEq _     _     = False
</code></pre><p>让我们在 ghci 里测试一下：</p><pre><code>Prelude&gt; :l naiveeq.hs
[1 of 1] Compiling Main             ( naiveeq.hs, interpreted )
Ok, modules loaded: Main.
*Main&gt; colorEq Green Green
True
*Main&gt; colorEq Red Red
True
*Main&gt; colorEq Red Green
False
</code></pre><p>现在，假设你想要添加 <code>String</code> 的相等性测试(equality testing)。 因为一个 <code>Haskell</code> 的 <code>String</code> 其实是字符们（characters）的列表(即[char])，所以我们可以写一个小函数来运行那个测试(相等性测试)。为了简单（偷懒）起见，我们作一下弊：使用 <code>==</code> 操作符。</p><pre><code>-- file: ch06/naiveeq.hs
stringEq :: [Char] -&gt; [Char] -&gt; Bool

-- Match if both are empty
stringEq [] [] = True

-- If both start with the same char, check the rest
stringEq (x:xs) (y:ys) = x == y &amp;&amp; stringEq xs ys

-- Everything else doesn&#39;t match
stringEq _ _ = False
</code></pre><p>让我们运行一下：</p><pre><code>Prelude&gt; :l naiveeq.hs
[1 of 1] Compiling Main             ( naiveeq.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; stringEq &quot;&quot; &quot;&quot;
True

*Main&gt; stringEq &quot;&quot; []
True

*Main&gt; stringEq &quot;&quot; [&quot;&quot;]
&lt;interactive&gt;:5:14:
Couldn&#39;t match expected type \`Char&#39; with actual type \`[Char]&#39;
In the expression: &quot;&quot;
In the second argument of \`stringEq&#39;, namely \`[&quot;&quot;]&#39;
In the expression: stringEq &quot;&quot; [&quot;&quot;]
</code></pre><p>现在你应该能看出一个问题了吧：我们不得不为各个不同类型（type）实现一坨带有不同名字的函数（function），以便我们有能力用其进行比较。这种做法非常低效，而且烦人。 如果我们能用 <code>==</code> 对比任何类型的值，就再方便不过了。</p><p>同时，我们能定义一些通用（generic）函数，比如基于 <code>==</code> 的 <code>/=</code> ，其能对几乎任何东西（anything）合法。通过写一个通用函数，其能比较所有的东西，也能使我们的代码一般化（generic）：如果一段代码仅需要比较（compare）一些东西，然后他应该就能够接受任何数据类型，而对其（这些类型）编译器是知道如何比较的。</p><p>而且更进一步，如果以后新类型被添加进来，现有的代码不应该被修改。而Haskell 的类型类（typeclass）就是被设计成处理上面的这些破事的。</p><h2 id="what-are-typeclasses" tabindex="-1"><a class="header-anchor" href="#what-are-typeclasses" aria-hidden="true">#</a> 什么是类型类？</h2><p>类型类定义了一系列函数，而这些函数对于不同类型的值使用不同的函数实现。它和面向对象（object-oriented）语言的对象（objects）有些类似，但是他们是完全不同的。</p><p>[huangz，labyrlnth，YenvY等译者注：这里原文是将&quot;面向对象编程中的对象&quot;和 Haskell 的类型类进行类比，但实际上这种类比并不太恰当，类比成接口和多态方法更适合一点。] [sancao2译注:我觉得作者不是不知道类型类应该与接口和多态方法类比，他这么说的原因是下面他自己的注释&quot;When is a class not a class?&quot;里面说的，因为类型类的关键词是class，传统面向对象编程里面的关键词也是class。]</p><p>让我们使用类型类来解决我们章节前面相等性测试的困局。首先，我们定义类型类本身。 我们需要一个函数，其接受两个参数。每个参数拥有相同的类型，然后返回一个 <code>Bool</code> 类型以指示他们是否相等。我们不关心这些类型到底是什么，但我需要的是同一个类型的两项(items)。</p><p>下面是我们的类型的初定义：</p><pre><code>-- file: ch06/eqclasses.hs
class BasicEq a where
    isEqual :: a -&gt; a -&gt; Bool
</code></pre><p>这个定义说，我们申明（使用 <code>class</code> 关键字）了一个类型类（typeclass），其名字叫 <code>BasicEq</code> 。接着我们将引用（refer to）实例类型（instance types），带着字母 <code>a</code> 作名字。 一个类型类的实例类型可以是任何类型，只要其（实例类型）实现了类型类中定义的函数。这个类型类定义了一个函数(<code>isEqual</code>)，而这个函数接受两个参数，他们（这俩参数）对应于实例类型即 <code>a</code> ，并且返回一个 <code>Bool</code> 型。</p><p>在定义的第一行，参数（实例类型）的名字是任选的。就是说，我们能使用任意名字。关键之处在于，当我们列出函数的类型时，我们必须使用相同的名字引用实例类型们（instance types）。 比如说，我们使用 <code>a</code> 来表示实例类型，那么函数签名中也必须使用 <code>a</code> 来代表这个实例类型。</p><p>让我们在 <code>ghci</code> 看一下 <code>isEqual</code> 的类型。 回想一下，在 <code>ghci</code> 我们能用 <code>:type</code> （简写 <code>:t</code> ）来查看某些东西的类型。</p><pre><code>Prelude&gt; :load eqclasses.hs
[1 of 1] Compiling Main             ( eqclasses.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; :type isEqual
isEqual :: (BasicEq a) =&gt; a -&gt; a -&gt; Bool
</code></pre><p>这种方式让我们读出：＂对于所有的类型 <code>a</code> ，只要 <code>a</code> 是 <code>BasicEq</code> 的一个实例， <code>isEqual</code> 就能接受两个类型为 <code>a</code> 的参数，并返回一个 <code>Bool</code> 。＂ 让我们快速地浏览一遍为某个特定类型定义的 <code>isEqual</code> 吧。</p><pre><code>-- file: ch06/eqclasses.hs
instance BasicEq Bool where
    isEqual True  True  = True
    isEqual False False = True
    isEqual _     _     = False
</code></pre><p>你能用 <code>ghci</code> 来验证我们基于 <code>Bool</code> 类的 <code>isEqual</code> ，而不是基于其他实例类型的。</p><pre><code>*Main&gt; isEqual True True
True

*Main&gt; isEqual False True
False

*Main&gt; isEqual &quot;hello&quot; &quot;moto&quot;

&lt;interactive&gt;:5:1:
    No instance for (BasicEq [Char])
          arising from a use of \`isEqual&#39;
    Possible fix: add an instance declaration for (BasicEq [Char])
    In the expression: isEqual &quot;hello&quot; &quot;moto&quot;
    In an equation for \`it&#39;: it = isEqual &quot;hello&quot; &quot;moto&quot;
</code></pre><p>注意，当我们试图比较两个字符串，ghci抱怨到，&quot;我们没有提供基于 <code>[Char]</code> 实例类型的 <code>BasicEq</code> ，所以他不知道如何去比较 <code>[Char]</code> 。&quot;并且其建议（&quot;<code>Possible fix</code>&quot;）我们可以通过定义基于 <code>[Char]</code> 实例类型的 <code>BasicEq</code> 。</p><p>稍后的一节我们将会详细介绍定义实例（instances）。 不过，首先让我们继续看定义类型类(typeclass)。在这个例子中，一个＂不相等＂（not-equal-to）函数可能很有用。这里我们可以做的是，定义一个带两个函数的类型类（typeclass）：</p><pre><code>-- file: ch06/eqclasses.hs
class BasicEq2 a where
    isEqual2    :: a -&gt; a -&gt; Bool
    isNotEqual2 :: a -&gt; a -&gt; Bool
</code></pre><p>如果有人要提供一个 <code>BasicEq2</code> 的实例（instance），那么他将要定义两个函数： <code>isEqual2</code> 和 <code>isNotEqual2</code> 。 当我们定义好以上的 <code>BasicEq2</code> ， 看起来我们为自己制造了额外的工作。从逻辑上讲，如果我们知道 <code>isEqual2</code> 或 <code>isNotEqual2</code> 返回的是什么，那么我们就可以知道另外一个函数的返回值，对于所有（输入）类型来说。</p><p>为了避免让类型类的用户为所有类型都定义两个函数，我们可以提供他们（两个函数）的默认实现。然后，用户只要自己实现其中一个就可以了。 这里的例子展示了如何实现这种手法。</p><pre><code>-- file: ch06/eqclasses.hs
class BasicEq3 a where
    isEqual3 :: a -&gt; a -&gt; Bool
    isEqual3 x y = not (isNotEqual3 x y)

    isNotEqual3 :: a -&gt; a -&gt; Bool
    isNotEqual3 x y = not (isEqual3 x y)
</code></pre><p>人们实现这个类型类必须提供至少一个函数的实现。当然他们可以实现两个，如果他们乐意，但是他们不必被强制（这么做）。虽然我们提供两个函数的默认实现，每个函数取决于另外一个来计算答案。如果我们不指定至少一个，所产生的代码将是一个无尽循环。因此，至少得有一个函数总是要被实现。</p><p>以下是将 <code>Bool</code> 作为 <code>BasicEq3</code> 实例类型的例子。</p><pre><code>-- file: ch06/eqclasses.hs
instance BasicEq3 Bool where
    isEqual3 False False = True
    isEqual3 True  True  = True
    isEqual3 _     _     = False
</code></pre><p>我们只要定义 <code>isEqual3</code> 函数，就可以&quot;免费&quot;得到 <code>isNotEqual3</code> ：</p><pre><code>Prelude&gt; :load eqclasses.hs
[1 of 1] Compiling Main             ( eqclasses.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; isEqual True True
True

*Main&gt; isEqual False False
True

*Main&gt; isNotEqual False True
True
</code></pre><p>用 <code>BasicEq3</code> ，我们提供了一个类型类(class)，其行为类似于 <code>Haskell</code> 原生的 <code>==</code> 和 <code>/=</code> 操作符。 事实上，这些操作符本来就是被一个类型类定义的，其看起来几乎等价于 <code>BasicEq3</code> 。 &quot;Haskell 98 Report&quot;定义了一个类型类，它实现了相等性比较(equality comparison)。这是内建类型类 <code>Eq</code> 的代码。 注意到他和我们的 <code>BasicEq3</code> 类型类多么相似呀。</p><pre><code>class  Eq a  where
 (==), (/=) :: a -&gt; a -&gt; Bool

    -- Minimal complete definition:
    --     (==) or (/=)
 x /= y     =  not (x == y)
 x == y     =  not (x /= y)
</code></pre><h2 id="declaring-typeclass-instances" tabindex="-1"><a class="header-anchor" href="#declaring-typeclass-instances" aria-hidden="true">#</a> 定义类型类实例</h2><p>现在你知道了怎么定义一个类型类，是时候学习一下怎么定义某个类型类的实例(instance)。回忆一下那些用于创造某个特定类型类的实例的类型们(types)，他们是通过实现对那个类型类必须的函数来实现的。回忆一下我们位于章节前面的尝试(attemp)，针对 <code>Color</code> 类型创造的相等性测试。</p><p>那么让我们看看我们要怎样创造同样的 <code>Color</code> 类型，作为 <code>BasicEq3</code> 类型类的一员。</p><pre><code>-- file: ch06/naiveeq.hs
instance BasicEq3 Color where
    isEqual3 Red Red = True
    isEqual3 Blue Blue = True
    isEqual3 Green Green = True
    isEqual3 _ _ = False
</code></pre><p>注意，这里的函数定义和之前 &quot;类型类的作用&quot; 章节的 <code>colorEq</code> 函数定义实际上没有什么不同。 事实上，它的实现就是等价的。 然而，在本例中，我们能将 <code>isEqual3</code> 使用于*任何*类型上，只要其(该类型)声明成 <code>BasicEq3</code> 的一个实例(instance)， 而不仅仅限于 <code>Color</code> 一类。我们能定义相等性测试，针对任何东西，从数值到图形，通过采用相同的基本模式(basic pattern)的方式。 事实上，我们将会在 &quot;相等性，有序和对比&quot; 章节中看到，这就是你能使Haskell的 <code>==</code> 操作符作用于你自己的类型的方式。</p><p>还要注意到，虽然 <code>BasicEq3</code> 类型类定义了两个函数 <code>isEqual</code> 和 <code>isNotEqual</code> ， 但是我们只实现了其中的一个，在 <code>Color</code> 的例子中。那得归功于包含于 <code>BasicEq3</code> 中的默认实现。 即使我们没有显式地定义 <code>isNotEqual3</code> ， 编译器也会自动地使用 <code>BasicEq3</code> 声明中的默认实现。</p><h2 id="important-built-in-typeclasses" tabindex="-1"><a class="header-anchor" href="#important-built-in-typeclasses" aria-hidden="true">#</a> 重要的内置类型类</h2><p>前面两节我们分别讨论了(如何)定义你自己的类型类(typeclass)，以及如何创造你自己的类型类实例(type instance)。</p><p>是时候介绍几个作为 <code>Prelude</code> 库一部分的类型类。如本章开始时所说的，类型类处于 Haskell 语言某些重要特性的中心。我们将讨论最常见的几个。 更多细节，&quot;Haskell library reference&quot; 是一个很好的资源。其将给你介绍类型类，并且将一直告诉你什么函数是你必须要实现的以获得一份完整的定义。</p><h3 id="show" tabindex="-1"><a class="header-anchor" href="#show" aria-hidden="true">#</a> Show</h3><p><code>Show</code> 类型类用于将值(values)转换为字符串(Strings)，其最常用的（功能）可能是将数值(numbers)转换成字符串，但是他被定义成如此多类型以至于能转化相当多东西。如果你已经定义了你自己的类型们(types)，创造他们(types) <code>Show</code> 的实例，将会使他们能够在 <code>ghci</code> 中展示或者在程序中打印出来。 <code>Show</code> 类型类中最重要的函数是 <code>show</code> 。 其接受一个参数，以用于数据(data)转换，并返回一个 <code>String</code>，以代表这个数据(data)。</p><pre><code>Main&gt; :type show
show :: Show a =&gt; a -&gt; String
</code></pre><p>让我们看看一些例子，关于转化数值到字符串的。</p><pre><code>Main&gt; show 1
&quot;1&quot;

Main&gt; show [1, 2, 3]
&quot;[1,2,3]&quot;

Main&gt; show (1, 2)
&quot;(1,2)&quot;
</code></pre><p>记住 <code>ghci</code> 显示出结果，就像你进入一个Haskell的程序。 所以表达式 <code>show 1</code> 返回一个包含数字 <code>1</code> 的单字符的字符串。即引号不是字符串本身的一部分。 我们将使用 <code>putStrLn</code> 明确这一点。</p><pre><code>ghci&gt; putStrLn (show 1)
1
ghci&gt; putStrLn (show [1,2,3])
[1,2,3]
</code></pre><p>你也可以将 <code>show</code> 用在 <code>String</code> 上面。</p><pre><code>ghci&gt; show &quot;Hello!&quot;
&quot;\\&quot;Hello!\\&quot;&quot;
ghci&gt; putStrLn (show &quot;Hello!&quot;)
&quot;Hello!&quot;
ghci&gt; show [&#39;H&#39;, &#39;i&#39;]
&quot;\\&quot;Hi\\&quot;&quot;
ghci&gt; putStrLn (show &quot;Hi&quot;)
&quot;Hi&quot;
ghci&gt; show &quot;Hi, \\&quot;Jane\\&quot;&quot;
&quot;\\&quot;Hi, \\\\\\&quot;Jane\\\\\\&quot;\\&quot;&quot;
ghci&gt; putStrLn (show &quot;Hi, \\&quot;Jane\\&quot;&quot;)
&quot;Hi, \\&quot;Jane\\&quot;&quot;
</code></pre><p>运行 <code>show</code> 于 <code>String</code> 之上，可能使你感到困惑。 因为 <code>show</code> 生成了一个结果，其相配（suitable）于Haskell的字面值(literal)， 或者说，<code>show</code> 添加了引号和转义符号(&quot;&quot;)，其适用于Haskell程序内部。 <code>ghci</code> 也用 <code>show</code> 来显示结果，所以引号和转义符号被添加了两次。 使用 <code>putStrLn</code> 能帮助你明确这种差异。</p><p>你能轻易地定义你自己的 <code>Show</code> 实例，如下。</p><pre><code>-- file: ch06/naiveeq.hs
instance Show Color where
    show Red   = &quot;Red&quot;
    show Green = &quot;Green&quot;
    show Blue  = &quot;Blue&quot;
</code></pre><p>上面的例子定义了 <code>Show</code> 类型类的实例，其针对我们章节前面的定义的类型 <code>Color</code> 。</p><div class="hint-container note"><p class="hint-container-title">Note</p><p><code>Show</code> 类型类</p><p><code>show</code> 经常用于定义数据(data)的字符串(<code>String</code>)表示，其非常有利于机器使用用 <code>Read</code> 类型类解析回来。Haskell程序员经常写自己的函数去格式化(format)数据以漂亮的方式为终端用户呈现，如果这种表示方式有别于 <code>Show</code> 预期的输出。</p></div><p>因此，如果你定义了一种新的数据类型，并且希望通过 ghci 来显示它，那么你就应该将这个类型实现为 <code>Show</code> 类型类的实例，否则 ghci 就会向你抱怨，说它不知道该怎样用字符串的形式表示这种数据类型：</p><pre><code>Main&gt; data Color = Red | Green | Blue;

Main&gt; show Red

&lt;interactive&gt;:10:1:
    No instance for (Show Color)
        arising from a use of \`show&#39;
    Possible fix: add an instance declaration for (Show Color)
    In the expression: show Red
    In an equation for \`it&#39;: it = show Red

Prelude&gt; Red

&lt;interactive&gt;:5:1:
    No instance for (Show Color)
        arising from a use of \`print&#39;
    Possible fix: add an instance declaration for (Show Color)
    In a stmt of an interactive GHCi command: print it
</code></pre><p>通过实现 <code>Color</code> 类型的 <code>show</code> 函数，让 <code>Color</code> 类型成为 <code>Show</code> 的类型实例，可以解决以上问题：</p><pre><code>-- file: ch06/naiveeq.hs
instance Show Color where
    show Red   = &quot;Red&quot;
    show Green = &quot;Green&quot;
    show Blue  = &quot;Blue&quot;
</code></pre><p>当然， <code>show</code> 函数的打印值并不是非要和类型构造器一样不可，比如 <code>Red</code> 值并不是非要表示为 <code>&quot;Red&quot;</code> 不可，以下是另一种实例化 <code>Show</code> 类型类的方式：</p><pre><code>-- file: ch06/naiveeq.hs
instance Show Color where
    show Red   = &quot;Color 1: Red&quot;
    show Green = &quot;Color 2: Green&quot;
    show Blue  = &quot;Color 3: Blue&quot;
</code></pre><h3 id="read" tabindex="-1"><a class="header-anchor" href="#read" aria-hidden="true">#</a> Read</h3><p><code>Read</code> 类型类，本质上 和 <code>Show</code> 类型类相反: 其(<code>Read</code>)最有用的函数是 <code>read</code>，它接受一个字符串作为参数，对这个字符串进行解析(parse)，并返回一个值。这个值的类型为 <code>Read</code> 实例类型的成员（所有实例类型中的一种）。</p><pre><code>Prelude&gt; :type read
read :: Read a =&gt; String -&gt; a
</code></pre><p>这是一个例子，展示了 <code>read</code> 和 <code>show</code> 函数的用法:</p><pre><code>-- file: ch06/read.hs
main = do
  putStrLn &quot;Please enter a Double:&quot;
  inpStr &lt;- getLine
  let inpDouble = (read inpStr)::Double
  putStrLn (&quot;Twice &quot; ++ show inpDouble ++ &quot; is &quot; ++ show (inpDouble * 2))
</code></pre><p>测试结果如下：</p><pre><code>Prelude&gt; :l read.hs
[1 of 1] Compiling Main             ( read.hs, interpreted )
Ok, modules loaded: Main.
*Main&gt; main
Please enter a Double:
123.213
Twice 123.213 is 246.426
</code></pre><p>这是一个简单的例子，关于 <code>read</code> 和 <code>show</code>。 请注意，我们给出了一个显式的 <code>Double</code> 类型，当运行 <code>read</code> 函数的时候。</p><p>那是因为 <code>read</code> 会返回任意类型的值(a value of type) <code>Read a =&gt; a</code> ，并且 <code>show</code> 期望任意类型的值 <code>Show a =&gt; a</code> 。 存在着许许多多类型(type)，其拥有定义于 <code>Read</code> 和 <code>Show</code> 之上的实例(instance)。</p><p>不知道一个特定的类型，编译器必须从许多类型中猜出那个才是必须的(needed)。在上面的这种情况下，他可能会经常选择 <code>Integer</code> 类型。如果我们想要接受的是浮点输入，他就不会正常工作，所以我们提供了一个显式的类型。</p><div class="hint-container note"><p class="hint-container-title">Note</p><p>关于默认值的笔记</p><p>在大多数情况下，如果显式的 <code>Double</code> 类型标记被忽略了，编译器会拒绝猜测一个通用的类型，并仅仅返回一个错误。他能默认以 <code>Integer</code> 类型这件事请是个特例。 他起因于以下事实:字面值 <code>2</code> (在程序中 <code>inpDouble * 2</code>)被当成 <code>Integer</code> 除非他得到一个不同类型的期望。]</p></div><p>你能看到相同的效果在起作用，如果你试着在 <code>ghci</code> 命令行中使用 <code>read</code> 。 <code>ghci</code> 内部使用 <code>show</code> 来展示结果，意味着你可能同样会碰到一样会碰到模棱两可的类型问题。你将须要显式地指定类型于 <code>read</code> 的结果在 <code>ghci</code> 当中，如下。</p><pre><code>Prelude&gt; read &quot;3&quot;

&lt;interactive&gt;:5:1:
    Ambiguous type variable \`a0&#39; in the constraint:
          (Read a0) arising from a use of \`read&#39;
    Probable fix: add a type signature that fixes these type variable(s)
    In the expression: read &quot;3&quot;
    In an equation for \`it&#39;: it = read &quot;3&quot;

Prelude&gt; (read &quot;3&quot;)::Int
3

Prelude&gt; :type it
it :: Int

Prelude&gt; (read &quot;3&quot;)::Double
3.0

Prelude&gt; :type it
it :: Double
</code></pre><p>注意，在第一次调用 <code>read</code> 的时候，我们并没有显式地给定类型签名，这时对 <code>read &quot;3&quot;</code> 的求值会引发错误。 这是因为有非常多的类型都是 <code>Read</code> 的实例，而编译器在 <code>read</code> 函数读入 <code>&quot;3&quot;</code> 之后，不知道应该将这个值转换成什么类型，于是编译器就会向我们发牢骚。</p><p>因此，为了让 <code>read</code> 函数返回正确类型的值，必须给它指示正确的类型。</p><p>回想一下， <code>read</code> 函数的类型签名: <code>(Read a) =&gt; String -&gt; a</code> 。 <code>a</code> 在这里是 <code>Read</code> 类型类的任何实例类型。 其特定的解析函数被调用取决于 <code>read</code> 返回值的期望类型。 让我们看看他是怎么工作的。</p><pre><code>ghci&gt; (read &quot;5.0&quot;)::Double
5.0
ghci&gt; (read &quot;5.0&quot;)::Integer
*** Exception: Prelude.read: no parse
</code></pre><p>注意到错误(将发生)当你试图解析 <code>5.0</code> 作为一个整数 <code>Integer</code> 。解释器选择了一个不同的 <code>Read</code> 实例： 当返回值的期望是 <code>Integer</code> ，而他做的却是期望得到一个 <code>Double</code> 。 <code>Integer</code> 的解析器不能接受小数点，从而抛出一个异常。</p><p><code>Read</code> 类型提供了一些相当复杂的解析器。你可以定义一个简单的解析器，通过提供 <code>readsPrec</code> 函数的实现。你的实现能返回一个列表(list)：该列表在解析成功时包含一个元组(tuple)，在解析失败时为空。下面是一个实现的例子。</p><pre><code>-- file: ch06/naiveeq.hs
instance Read Color where
    -- readsPrec is the main function for parsing input
    readsPrec _ value =
        -- We pass tryParse a list of pairs.  Each pair has a string
        -- and the desired return value.  tryParse will try to match
        -- the input to one of these strings.
        tryParse [(&quot;Red&quot;, Red), (&quot;Green&quot;, Green), (&quot;Blue&quot;, Blue)]
        where tryParse [] = []    -- If there is nothing left to try, fail
              tryParse ((attempt, result):xs) =
                   -- Compare the start of the string to be parsed to the
                   -- text we are looking for.
                   if (take (length attempt) value) == attempt
                      -- If we have a match, return the result and the
                      -- remaining input
                      then [(result, drop (length attempt) value)]
                      -- If we don&#39;t have a match, try the next pair
                      -- in the list of attempts.
                      else tryParse xs
</code></pre><p>运行测试一下:</p><pre><code>*Main&gt; :l naiveeq.hs
[1 of 1] Compiling Main             ( naiveeq.hs, interpreted )
Ok, modules loaded: Main.
*Main&gt; (read &quot;Red&quot;)::Color
Color 1: Red
*Main&gt; (read &quot;Green&quot;)::Color
Color 2: Green
*Main&gt; (read &quot;Blue&quot;)::Color
Color 3: Blue
*Main&gt; (read &quot;[Red]&quot;)::Color
*** Exception: Prelude.read: no parse
*Main&gt; (read &quot;[Red]&quot;)::[Color]
[Color 1: Red]
*Main&gt; (read &quot;[Red,Green,Blue]&quot;)::[Color]
[Color 1: Red,Color 2: Green,Color 3: Blue]
*Main&gt; (read &quot;[Red, Green, Blue]&quot;)::[Color]
*** Exception: Prelude.read: no parse
</code></pre><p>注意到最后的尝试产生了错误。那是因为我们的编译器没有聪明到可以处理置位(leading，包括前置和后置)的空格。你可以改进他，通过些改你的 <code>Read</code> 实例以忽略任何置位的空格。这在Haskell程序中是常见的做法。</p><h3 id="使用-read-和-show-进行序列化" tabindex="-1"><a class="header-anchor" href="#使用-read-和-show-进行序列化" aria-hidden="true">#</a> 使用 <code>Read</code> 和 <code>Show</code> 进行序列化</h3><p>很多时候，程序需要将内存中的数据保存为硬盘上的文件以备将来获取，或者通过网络发送出去。把内存中的数据转化成为，为存储目的，序列的过程，被称为 <code>序列化</code> 。</p><p>通过将类型实现为 <code>Read</code> 和 <code>Show</code> 的实例类型， <code>read</code> 和 <code>show</code> 两个函数可以成为非常好的序列化工具。 <code>show</code> 函数生成的输出是人类和机器皆可读的。 大部分 <code>show</code> 输出也是对Haskell语法合法的，虽然他取决于人们如何写 <code>Show</code> 实例来达到这个结果。</p><div class="hint-container note"><p class="hint-container-title">Note</p><p>解析超大（large）字符串</p><p>字符串处理在Haskell中通常是惰性的，所以 <code>read</code> 和 <code>show</code> 能被无意外地用于很大的数据结构。 Haskell中内建的 <code>read</code> 和 <code>show</code> 实例被实现成高效的纯函数。 如果想知道怎么处理解析的异常，请参考&quot;19章 错误处理&quot;。</p></div><p>作为例子，以下代码将一个内存中的列表序列化到文件中：</p><pre><code>Prelude&gt; let years = [1999, 2010, 2012]

Prelude&gt; show years
&quot;[1999,2010,2012]&quot;

Prelude&gt; writeFile &quot;years.txt&quot; (show years)
</code></pre><p><code>writeFile</code> 将给定内容写入到文件当中，它接受两个参数，第一个参数是文件路径，第二个参数是写入到文件的字符串内容。</p><p>观察文件 <code>years.txt</code> 可以看出， <code>(show years)</code> 所产生的文本被成功保存到了文件当中：</p><pre><code>$ cat years.txt
[1999,2010,2012]
</code></pre><p>使用以下代码可以对 <code>years.txt</code> 进行反序列化操作：</p><pre><code>Prelude&gt; input &lt;- readFile &quot;years.txt&quot;

Prelude&gt; input                  -- 读入的字符串
&quot;[1999,2010,2012]&quot;

Prelude&gt; (read input)::[Int]    -- 将字符串转换成列表
[1999,2010,2012]
</code></pre><p><code>readFile</code> 读入给定的 <code>years.txt</code> ，并将它的内存传给 <code>input</code> 变量。 最后，通过使用 <code>read</code> ，我们成功将字符串反序列化成一个列表。</p><h3 id="numeric-types" tabindex="-1"><a class="header-anchor" href="#numeric-types" aria-hidden="true">#</a> 数值类型</h3><p>Haskell 有一个非常强大的数值类型集合：从速度飞快的 32 位或 64 位整数，到任意精度的有理数，无所不包。 你可能知道操作符(比如 <code>(+)</code>)能作用于所有的这些类型。 这个特性是用类型(typeclass)类实现的。作为附带的好处，他(Haskell)允许你定义自己的数值类型，并且把他们当做Haskell的一等公民(first-class citizens)。</p><p>让我们开始讨论，关于围绕在数值类型(numberic types)周围的类型类们(typeclass)，用以类型们(type)本身的检查(examination)。以下表格显示了 Haskell 中最常用的一些数值类型。请注意，存在这更多数值类型用于特定的目的，比如提供接口给 <code>C</code> 。</p><hr><p><strong>表格 6.1 ： 部分数值类型</strong></p><table><thead><tr><th>类型</th><th>介绍</th></tr></thead><tbody><tr><td>Double</td><td>双精度浮点数。表示浮点数的常见选择。</td></tr><tr><td>Float</td><td>单精度浮点数。通常在对接 C 程序时使用。</td></tr><tr><td>Int</td><td>固定精度带符号整数；最小范围在 -2^29 至 2^29-1 。相当常用。</td></tr><tr><td>Int8</td><td>8 位带符号整数</td></tr><tr><td>Int16</td><td>16 位带符号整数</td></tr><tr><td>Int32</td><td>32 位带符号整数</td></tr><tr><td>Int64</td><td>64 位带符号整数</td></tr><tr><td>Integer</td><td>任意精度带符号整数；范围由机器的内存限制。相当常用。</td></tr><tr><td>Rational</td><td>任意精度有理数。保存为两个整数之比（ratio）。</td></tr><tr><td>Word</td><td>固定精度无符号整数。占用的内存大小和 <code>Int</code> 相同</td></tr><tr><td>Word8</td><td>8 位无符号整数</td></tr><tr><td>Word16</td><td>16 位无符号整数</td></tr><tr><td>Word32</td><td>32 位无符号整数</td></tr><tr><td>Word64</td><td>64 位无符号整数</td></tr></tbody></table><p>这是相当多的数值类型。 存在这某些操作符，比如加号 <code>(+)</code> ，其能在他们中的所有之上工作。 另外的一部分函数，比如 <code>asin</code> ，只能用于浮点数类型。</p><p>以下表格汇总了操作(operate)于不同类型的不同函数。当你读到表，记住，Haskell操作符们(operators)只是函数。 你可以通过 <code>(+) 2 3</code> 或者 <code>2 + 3</code> 得到相同的结果。按照惯例，当讲操作符当做函数时，他们被写在括号中，如下表 6.2。</p><hr><p><strong>表格 6.2 ： 部分数值函数和常量</strong></p><table><thead><tr><th>项</th><th>类型</th><th>模块</th><th>描述</th></tr></thead><tbody><tr><td>(+)</td><td><code>Num a =&gt; a -&gt; -&gt; a -&gt; a</code></td><td>Prelude</td><td>加法</td></tr><tr><td>(-)</td><td><code>Num a =&gt; a -&gt; a -&gt; a</code></td><td>Prelude</td><td>减法</td></tr><tr><td>(*)</td><td><code>Num a =&gt; a -&gt; a -&gt; a</code></td><td>Prelude</td><td>乘法</td></tr><tr><td>(/)</td><td><code>Fractional a =&gt; a -&gt; a -&gt; a</code></td><td>Prelude</td><td>份数除法</td></tr><tr><td>(**)</td><td><code>Floating a =&gt; a -&gt; a -&gt; a</code></td><td>Prelude</td><td>乘幂</td></tr><tr><td>(^)</td><td><code>(Num a,Integral b) =&gt; a -&gt; b-&gt; a</code></td><td>Prelude</td><td>计算某个的非负整数次方数</td></tr><tr><td>(^^)</td><td><code>(Fractional a, Integral b) =&gt; a -&gt; b -&gt; a</code></td><td>Prelude</td><td>分数的任意整数次方</td></tr><tr><td>(%)</td><td><code>Integral a =&gt; a -&gt; a -&gt; Ratio a</code></td><td>Data.Ratio</td><td>构成比率</td></tr><tr><td>(.&amp;.)</td><td><code>Bits a =&gt; a -&gt; a -&gt; a</code></td><td>Data.Bits</td><td>二进制并操作</td></tr><tr><td>(.|.)</td><td><code>Bits a =&gt; a -&gt; a -&gt; a</code></td><td>Data.Bits</td><td>二进制或操作</td></tr><tr><td>abs</td><td><code>Num a =&gt; a-&gt; a</code></td><td>Prelude</td><td>绝对值操作</td></tr><tr><td>approxRational</td><td><code>RealFrac a =&gt; a -&gt; a-&gt; Rational</code></td><td>Data.Ratio</td><td>通过分数的分子和分母计算出近似有理数</td></tr><tr><td>cos</td><td><code>Floating a =&gt; a -&gt; a</code></td><td>Prelude</td><td>余弦函数。另外还有acos 、 cosh和 acosh，类型和 cos一样。</td></tr><tr><td>div</td><td><code>Integral a =&gt; a -&gt; a -&gt; a</code></td><td>Prelude</td><td>整数除法，总是截断小数位。</td></tr><tr><td>fromInteger</td><td><code>Num a =&gt; Integer -&gt; a</code></td><td>Prelude</td><td>将一个值转换为任意数值类型。</td></tr><tr><td>fromIntegral</td><td><code>(Integral a, Num b) =&gt; a -&gt; b</code></td><td>Prelude</td><td>一个更通用的转换函数，将任意Integral值转为任意数值类型。</td></tr><tr><td>fromRational</td><td><code>Fractional a =&gt; Rational-&gt; a</code></td><td>Prelude</td><td>将一个有理数转换为分数。可能会有精度损失。</td></tr><tr><td>log</td><td><code>Floating a =&gt; a -&gt; a</code></td><td>Prelude</td><td>自然对数算法。</td></tr><tr><td>logBase</td><td><code>Floating a =&gt; a -&gt; a -&gt; a</code></td><td>Prelude</td><td>计算指定底数对数。</td></tr><tr><td>maxBound</td><td><code>Bounded a =&gt; a</code></td><td>Prelude</td><td>有限长度数值类型的最大值</td></tr><tr><td>minBound</td><td><code>Bounded a =&gt; a</code></td><td>Prelude</td><td>有限长度数值类型的最小值。</td></tr><tr><td>mod</td><td><code>Integral a =&gt; a -&gt; a -&gt; a</code></td><td>Prelude</td><td>整数取模。</td></tr><tr><td>pi</td><td><code>Floating a =&gt; a</code></td><td>Prelude</td><td>圆周率常量。</td></tr><tr><td>quot</td><td><code>Integral a =&gt; a -&gt; a-&gt; a</code></td><td>Prelude</td><td>整数除法；商数的分数部分截断为&gt; 0 。</td></tr><tr><td>recip</td><td><code>Fractional a =&gt; a -&gt; a</code></td><td>Prelude</td><td>分的倒数。</td></tr><tr><td>rem</td><td><code>Integral a =&gt; a -&gt; a -&gt; a</code></td><td>Prelude</td><td>整数除法的余数。</td></tr><tr><td>round</td><td><code>(RealFrac a,Integral b) =&gt; a -&gt; b</code></td><td>Prelude</td><td>四舍五入到最近的整数。</td></tr><tr><td>shift</td><td><code>Bits a =&gt; a -&gt; Int -&gt; a</code></td><td>Bits</td><td>输入为正整数，就进行左移。如果为负数，进行右移。</td></tr><tr><td>sin</td><td><code>Floating a =&gt; a -&gt; a</code></td><td>Prelude</td><td>正弦函数。还提供了asin 、 sinh和 asinh，和 sin类型一样</td></tr><tr><td>sqrt</td><td><code>Floating a =&gt; a -&gt; a</code></td><td>Prelude</td><td>平方根</td></tr><tr><td>tan</td><td><code>Floating a =&gt; a -&gt; a</code></td><td>Prelude</td><td>正切函数。还提供了atan 、 tanh和 atanh，和 tan类型一样。</td></tr><tr><td>toInteger</td><td><code>Integral a =&gt; a -&gt; Integer</code></td><td>Prelude</td><td>将任意Integral值转换为Integer</td></tr><tr><td>toRational</td><td><code>Real a =&gt; a -&gt; Rational</code></td><td>Prelude</td><td>从实数到有理数的有损转换</td></tr><tr><td>truncate</td><td><code>(RealFrac a,Integral b) =&gt; a -&gt; b</code></td><td>Prelude</td><td>向着零截断</td></tr><tr><td>xor</td><td><code>Bits a =&gt; a -&gt; a -&gt; a</code></td><td>Data.Bits</td><td>二进制异或操作</td></tr></tbody></table><p>&quot;数值类型及其对应的类型类&quot; 列举在下表 6.3。</p><hr><p><strong>表格 6.3 ： 数值类型的类型类实例</strong></p><p>+-------+-------+-------+-------+-------+-------+-------+-------+-------+ | 类型 | Bits | Bo | Flo | Fract | Int | Num | Real | Rea | | | | unded | ating | ional | egral | | | lFrac | +=<mark><mark><mark>+</mark></mark></mark>=+=<mark><mark><mark>+</mark></mark></mark>=+=<mark><mark><mark>+</mark></mark></mark>=+=<mark><mark><mark>+</mark></mark></mark>=+=======+ | D | &gt; X X | &gt; X X | &gt; X X | &gt; X X | &gt; X X | &gt; X X | &gt; X X | &gt; X X | | ouble | &gt; X X | &gt; X X | | &gt; | &gt; X X | &gt; X X | &gt; X X | &gt; | | Float | &gt; X | &gt; | | &gt; X | &gt; X | &gt; X X | &gt; X X | &gt; X | | Int | &gt; | &gt; X X | | | &gt; | &gt; X X | &gt; X X | | | Int16 | &gt; X X | &gt; X X | | | &gt; X X | &gt; X X | &gt; X X | | | Int32 | &gt; X X | | | | &gt; X X | &gt; X X | &gt; X X | | | Int64 | | | | | | | | | | In | | | | | | | | | | teger | | | | | | | | | | Rat | | | | | | | | | | ional | | | | | | | | | | or | | | | | | | | | | any | | | | | | | | | | Ratio | | | | | | | | | | Word | | | | | | | | | | W | | | | | | | | | | ord16 | | | | | | | | | | W | | | | | | | | | | ord32 | | | | | | | | | | W | | | | | | | | | | ord64 | | | | | | | | | +-------+-------+-------+-------+-------+-------+-------+-------+-------+</p><hr><p>表格 6.4 列举了一些数值类型之间进行转换的函数，以下表格是一个汇总：</p><hr><p><strong>表格 6.4 ： 数值类型之间的转换</strong></p><p>+---------+-------------------+---------+----------+---------------+ | 源类型 | 目标类型 | | | | +---------+-------------------+---------+----------+---------------+ | | Double, Float | Int, | &gt; | &gt; Rational | | | | Word | Integer | | +---------+-------------------+---------+----------+---------------+ | Double, | fromRational . | t | &gt; | &gt; toRational | | Float | toRational | runcate | truncate | &gt; | | Int, | fromIntegral | * | &gt; * | fromIntegral | | Word | fromIntegral | fromI | &gt; from | &gt; | | Integer | fromRational | ntegral | Integral | fromIntegral | | R | | fromI | &gt; N/A | &gt; N/A | | ational | | ntegral | &gt; | | | | | t | truncate | | | | | runcate | &gt; * | | | | | * | | | +---------+-------------------+---------+----------+---------------+</p><hr><p>6.4 表中 * 代表除了 <code>truncate</code> (向着零截断) 之外，还可以使用 <code>round</code> (最近整数)、 <code>ceiling</code> (上取整)或者 <code>floor</code> (下取整)的类型。</p><p>第十三章会说明，怎样用自定义数据类型来扩展数值类型。</p><h3 id="相等性-有序和对比" tabindex="-1"><a class="header-anchor" href="#相等性-有序和对比" aria-hidden="true">#</a> 相等性，有序和对比</h3><p>我们已经讨论过了算术符号比如 <code>(+)</code> 能用到不同数字的所有类型。 但是Haskell中还存在着某些甚至更加广泛使用的操作符。 最显然地，当然，就是相等性测试: <code>(==)</code> 和 <code>(/=)</code> ，这两操作符们都定义于 <code>Eq</code> 类(class)中。</p><p>存在着其他的比较操作符， 如 <code>&gt;=</code> 和 <code>&lt;=</code> ，其则由 <code>Ord</code> 类型类定义。 他们(<code>Ord</code>)是放在于单独类中是因为存在着某些类型，比如 <code>Handle</code> ，使在这些地方相等性测试有意义(make sense)，而表达特定的序(ording)一点意义都没有。</p><p>所有 <code>Ord</code> 实例都可以使用 <code>Data.List.sort</code> 来排序。</p><p>几乎所有 Haskell 内置类型都是 <code>Eq</code> 类型类的实例，而 <code>Ord</code> 类的实例类型也几乎一样多。</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>::: title Tip</p></div><p><code>Ord</code> 产生的排列顺序在某些时候是非常随意的， 比如对于 <code>Maybe</code> 而言， <code>Nothing</code> 就排在 <code>Just x</code> 之前， 这些都是随意决定的， 并没有什么特殊的意义。 :::</p><h2 id="自动派生" tabindex="-1"><a class="header-anchor" href="#自动派生" aria-hidden="true">#</a> 自动派生</h2><p>对于许多简单的数据类型， Haskell 编译器可以自动将类型派生（derivation）为 <code>Read</code> 、 <code>Show</code> 、 <code>Bounded</code> 、 <code>Enum</code> 、 <code>Eq</code> 和 <code>Ord</code> 的实例(instance)。 这节省了我们大量的精力用于手动写代码进行比较或者显示他们的类型。</p><p>以下代码将 <code>Color</code> 类型派生为 <code>Read</code> 、 <code>Show</code> 、 <code>Eq</code> 和 <code>Ord</code> 的实例：</p><pre><code>-- file: ch06/colorderived.hs
data Color = Red | Green | Blue
    deriving (Read, Show, Eq, Ord)
</code></pre><p>让我们看看这些派生实例们是怎么工作的：</p><pre><code>*Main&gt; show Red
&quot;Red&quot;

*Main&gt; (read &quot;Red&quot;)::Color
Red

*Main&gt; (read &quot;[Red, Red, Blue]&quot;)::[Color]
[Red,Red,Blue]

*Main&gt; Red == Red
True

*Main&gt; Data.List.sort [Blue, Green, Blue, Red]
[Red,Green,Blue,Blue]

*Main&gt; Red &lt; Blue
True
</code></pre><div class="hint-container note"><p class="hint-container-title">注</p><p>::: title Note</p></div><p>什么类型(types)能被自动派生?</p><p>Haskell标准要求编译器能自动派生这些指定类型类的实例。 :::</p><p>注意 <code>Color</code> 类型的排序位置由定义类型时值构造器的排序决定，即对应上面例子就是 <code>Red | Green | Blue</code> 的顺序。</p><p>自动派生并不总是可用的。 比如说，如果定义类型 <code>data MyType = MyType (Int -&gt; Bool)</code> ，那么编译器就没办法派生 <code>MyType</code> 为 <code>Show</code> 的实例，因为它不知道该怎么渲染(render)一个函数。 在上面这种情况下，我们会得到一个编译错误。</p><p>当我们自动派生某个类型类的一个实例时，在我们利用 <code>data</code> 关键词声明参考这个实例的类型时，也必须是给定类型类的实例（手动或自动地）。</p><p>举个例子，以下代码不能使用自动派生：</p><pre><code>-- file: ch06/cant_ad.hs
data Book = Book

data BookInfo = BookInfo Book
                deriving (Show)
</code></pre><p>ghci 会给出提示，说明 <code>Book</code> 类型也必须是 <code>Show</code> 的实例， <code>BookInfo</code> 才能对 <code>Show</code> 进行自动派生(<code>driving</code>)：</p><pre><code>Prelude&gt; :load cant_ad.hs
[1 of 1] Compiling Main             ( cant_ad.hs, interpreted )

ad.hs:4:27:
    No instance for (Show Book)
          arising from the &#39;deriving&#39; clause of a data type declaration
    Possible fix:
        add an instance declaration for (Show Book)
        or use a standalone &#39;deriving instance&#39; declaration,
        so you can specify the instance context yourself
    When deriving the instance for (Show BookInfo)
Failed, modules loaded: none.
</code></pre><p>相反，以下代码可以使用自动派生，因为它对 <code>Book</code> 类型也使用了自动派生，使得 <code>Book</code> 类型变成了 <code>Show</code> 的实例：</p><pre><code>-- file: ch06/ad.hs
data Book = Book
            deriving (Show)

data BookInfo = BookInfo Book
                deriving (Show)
</code></pre><p>使用 <code>:info</code> 命令在 ghci 中确认两种类型都是 <code>Show</code> 的实例：</p><pre><code>Prelude&gt; :load ad.hs
[1 of 1] Compiling Main             ( ad.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; :info Book
data Book = Book    -- Defined at ad.hs:1:6
instance Show Book -- Defined at ad.hs:2:23

*Main&gt; :info BookInfo
data BookInfo = BookInfo Book   -- Defined at ad.hs:4:6
instance Show BookInfo -- Defined at ad.hs:5:27
</code></pre><h2 id="类型类实战-让-json-更好用" tabindex="-1"><a class="header-anchor" href="#类型类实战-让-json-更好用" aria-hidden="true">#</a> 类型类实战：让 JSON 更好用</h2>`,156),s=e("p",null,[o("我们在 "),e("code",{class:"interpreted-text",role:"ref"},"representing-json-data-in-haskell"),o(" 一节介绍的 "),e("code",null,"JValue"),o(" 用起来还不够简便。 这里是一段由的经过截断(truncate)和整齐化(tidy)之后的实际 JSON 数据，由一个知名搜索引擎生成。")],-1),i=t(`<div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
    <span class="token property">&quot;query&quot;</span><span class="token operator">:</span> <span class="token string">&quot;awkward squad haskell&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;estimatedCount&quot;</span><span class="token operator">:</span> <span class="token number">3920</span><span class="token punctuation">,</span>
    <span class="token property">&quot;moreResults&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;results&quot;</span><span class="token operator">:</span>
    <span class="token punctuation">[</span><span class="token punctuation">{</span>
        <span class="token property">&quot;title&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Simon Peyton Jones: papers&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;snippet&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Tackling the awkward squad: monadic input/output ...&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;url&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://research.microsoft.com/~simonpj/papers/marktoberdorf/&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
        <span class="token property">&quot;title&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Haskell for C Programmers | Lambda the Ultimate&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;snippet&quot;</span><span class="token operator">:</span> <span class="token string">&quot;... the best job of all the tutorials I&#39;ve read ...&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;url&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://lambda-the-ultimate.org/node/724&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是进一步缩减片段的数据，并用 Haskell 表示：</p><pre><code>-- file: ch06/SimpleResult.hs
import SimpleJSON

result :: JValue
result = JObject [
    (&quot;query&quot;, JString &quot;awkward squad haskell&quot;),
    (&quot;estimatedCount&quot;, JNumber 3920),
    (&quot;moreResults&quot;, JBool True),
    (&quot;results&quot;, JArray [
        JObject [
        (&quot;title&quot;, JString &quot;Simon Peyton Jones: papers&quot;),
        (&quot;snippet&quot;, JString &quot;Tackling the awkward ...&quot;),
        (&quot;url&quot;, JString &quot;http://.../marktoberdorf/&quot;)
        ]])
    ]
</code></pre><p>由于 Haskell 不原生支持包含不同类型值的列表，我们不能直接表示包含不同类型值的 JSON 对象。 我们需要把每个值都用 JValue 构造器包装起来。 但这样我们的灵活性就受到了限制：如果我们想把数字 <code>3920</code> 转换成字符串 <code>&quot;3,920&quot;</code> ，我们就必须改变构造器，即我们使用它(JValue构造器)从 <code>JNumber</code> 构造器到 <code>JString</code> 构造器包装(wrap)数据。</p><p>Haskell 的类型类对这个问题提供了一个诱人的解决方案：</p><pre><code>-- file: ch06/JSONClass.hs
type JSONError = String

class JSON a where
    toJValue :: a -&gt; JValue
    fromJValue :: JValue -&gt; Either JSONError a

instance JSON JValue where
    toJValue = id
    fromJValue = Right
</code></pre><p>现在，我们无需再用 <code>JNumber</code> 等构造器去包装值了，直接使用 <code>toJValue</code> 函数即可。 如果我们更改值的类型，编译器会自动选择合适的 <code>toJValue</code> 实现以使用他。</p><p>我们也提供了 <code>fromJValue</code> 函数.它试图把 <code>JValue</code> 值转换成我们希望的类型。</p><h3 id="more-helpful-errors" tabindex="-1"><a class="header-anchor" href="#more-helpful-errors" aria-hidden="true">#</a> 让错误信息更有用</h3><p><code>fromJValue</code> 函数的返回类型为 <code>Either</code> 。 跟 <code>Maybe</code> 一样，这个类型是为我们预定义的。 我们经常用它来表示可能会失败的计算。</p><p>虽然 <code>Maybe</code> 也用作这个目的，但它在错误发生时没有给我们足够有用的信息：我们只得到一个 <code>Nothing</code> 。 虽然 <code>Either</code> 类型的结构相同，但是不同于 <code>Nothing</code> (相对于 <code>Maybe</code>)， &quot;坏事情发生&quot;构造器命名为 <code>Left</code> ，并且其还接受一个参数。</p><pre><code>-- file: ch06/DataEither.hs
data Maybe a = Nothing
             | Just a
               deriving (Eq, Ord, Read, Show)

data Either a b = Left a
                | Right b
                  deriving (Eq, Ord, Read, Show)
</code></pre><p>我们经常使用 <code>String</code> 作为 <code>a</code> 参数值的类型，所以在出错时我们能提供有用的描述。 为了说明在实际中怎么使用 <code>Either</code> 类型，我们来看一个简单的类型类的实例。</p><pre><code>-- file: ch06/JSONClass.hs
instance JSON Bool where
    toJValue = JBool
    fromJValue (JBool b) = Right b
    fromJValue _ = Left &quot;not a JSON boolean&quot;
</code></pre><p>[译注：读者若想在 <strong>ghci</strong> 中尝试 <code>fromJValue</code> ，需要为其提供类型标注，例如 <code>(fromJValue(toJValue True))::Either JSONError Bool</code> 。]</p><h3 id="making-an-instance-with-a-type-synonym" tabindex="-1"><a class="header-anchor" href="#making-an-instance-with-a-type-synonym" aria-hidden="true">#</a> 使用类型别名创建实例</h3><p>Haskell 98标准不允许我们用下面的形式声明实例，尽管它看起来没什么问题：</p><pre><code>-- file: ch06/JSONClass.hs
instance JSON String where
    toJValue               = JString

    fromJValue (JString s) = Right s
    fromJValue _           = Left &quot;not a JSON string&quot;
</code></pre><p>回忆一下， <code>String</code> 是 <code>[Char]</code> 的别名。 因此它的类型是 <code>[a]</code> ，并用 <code>Char</code> 替换了类型变量 <code>a</code> 。 根据 Haskell 98的规则，我们在声明实例的时候不允许提供一个类型替代类型变量。 也就是说，我们可以给 <code>[a]</code> 声明实例，但给 <code>[Char]</code> 不行。</p><p>尽管 GHC 默认遵守 Haskell 98标准，但是我们可以在文件顶部添加特殊格式的注释来解除这个限制。</p><pre><code>-- file: ch06/JSONClass.hs
{-# LANGUAGE TypeSynonymInstances #-}
</code></pre><p>这条注释是一条编译器指令，称为<em>编译选项（pragma）</em>，它告诉编译器允许这项语言扩展。 上面的代码因为 <code>TypeSynonymInstances</code> (&quot;同义类型的实例&quot;)这项语言扩展而合法。 我们在本章（本书）还会碰到更多的语言扩展。</p><p>[译注：作者举的这个例子实际上牵涉到了两个问题。 第一，Haskell 98不允许类型别名，这个问题可以通过上述方法解决。 第二，Haskell 98不允许 <code>[Char]</code> 这种形式的类型，这个问题需要通过增加另外一条编译选项 <code>{-# LANGUAGE FlexibleInstances #-}</code> 来解决。]</p><p>[sancao2译注，若没有 <code>{-# LANGUAGE FlexibleInstances #-}</code> 这条编译选项，就会产生下面的结果。 其实编译器的 <code>fix</code> 提示给大家了。</p><pre><code>Prelude&gt; :l JSONClass.hs  ../ch05/SimpleJSON.hs
[1 of 2] Compiling SimpleJSON       ( ../ch05/SimpleJSON.hs, interpreted )
[2 of 2] Compiling Main             ( JSONClass.hs, interpreted )

JSONClass.hs:16:10:
   Illegal instance declaration for \`JSON String&#39;
      (All instance types must be of the form (T a1 ... an)
      where a1 ... an are *distinct type variables*,
      and each type variable appears at most once in the instance head.
      Use -XFlexibleInstances if you want to disable this.)
   In the instance declaration for \`JSON String&#39;
Failed, modules loaded: SimpleJSON.
</code></pre><p>]</p><p>[Forec译注：在 Haskell 8.0.1 中，即使不添加 <code>{-# LANGUAGE TypeSynonymInstances #-}</code> 也不会出现问题，但 <code>{-# LANGUAGE FlexibleInstances #-}</code> 这条编译选项仍然需要。]</p><h2 id="living-in-an-open-world" tabindex="-1"><a class="header-anchor" href="#living-in-an-open-world" aria-hidden="true">#</a> 生活在开放世界</h2><p>Haskell 的有意地设计成允许我们任意创建类型类的实例，每当我们认为合适时。</p><pre><code>-- file: ch06/JSONClass.hs
doubleToJValue :: (Double -&gt; a) -&gt; JValue -&gt; Either JSONError a
doubleToJValue f (JNumber v) = Right (f v)
doubleToJValue _ _ = Left &quot;not a JSON number&quot;

instance JSON Int where
    toJValue = JNumber . realToFrac
    fromJValue = doubleToJValue round

instance JSON Integer where
    toJValue = JNumber . realToFrac
    fromJValue = doubleToJValue round

instance JSON Double where
    toJValue = JNumber
    fromJValue = doubleToJValue id
</code></pre><p>我们可以在任意地方添加新实例，而不仅限于在定义了类型类的模块中。 类型类系统的这个特性被称为<em>开放世界假设</em>（open world assumption）。 如果我们有方法表示&quot;这个类型类只存在这些实例&quot;，那我们将得到一个<em>封闭的</em>世界。</p><p>我们希望把列表(list)转为 JSON 数组(array)。 我们现在还不用关心实现细节，所以让我们暂时使用 <code>undefined</code> 作为函数内容。</p><pre><code>-- file: ch06/BrokenClass.hs
instance (JSON a) =&gt; JSON [a] where
    toJValue = undefined
    fromJValue = undefined
</code></pre><p>我们也希望能将键/值对列表转为 JSON 对象。</p><pre><code>-- file: ch06/BrokenClass.hs
instance (JSON a) =&gt; JSON [(String, a)] where
    toJValue = undefined
    fromJValue = undefined
</code></pre><h3 id="when-do-overlapping-instances-cause-problems" tabindex="-1"><a class="header-anchor" href="#when-do-overlapping-instances-cause-problems" aria-hidden="true">#</a> 什么时候重叠实例（Overlapping instances）会出问题？</h3><p>如果我们把这些定义放进文件中并在 <strong>ghci</strong> 里载入，初看起来没什么问题。</p><pre><code>*JSONClass&gt; :l BrokenClass.hs
[1 of 2] Compiling JSONClass        ( JSONClass.hs, interpreted )
[2 of 2] Compiling BrokenClass      ( BrokenClass.hs, interpreted )
Ok, modules loaded: JSONClass, BrokenClass
</code></pre><p>然而，一旦我们使用序对列表实例时，我们就&quot;跑&quot;(不是get，体会一下)进麻烦里面了(run in trouble)。</p><pre><code>*BrokenClass&gt; toJValue [(&quot;foo&quot;,&quot;bar&quot;)]

&lt;interactive&gt;:10:1:
    Overlapping instances for JSON [([Char], [Char])]
        arising from a use of ‘toJValue’
    Matching instances:
        instance JSON a =&gt; JSON [(String, a)]
            -- Defined at BrokenClass.hs:13:10
        instance JSON a =&gt; JSON [a] -- Defined at BrokenClass.hs:8:10
    In the expression: toJValue [(&quot;foo&quot;, &quot;bar&quot;)]
    In an equation for ‘it’: it = toJValue [(&quot;foo&quot;, &quot;bar&quot;)]
</code></pre><p>[sancao2译注:上面的抱怨说的是匹配了两个实例，编译器不知道选择哪一个。 <code>Matching instances: instance xxx, instance xxx</code> 。]</p><p><em>重叠实例</em>问题是由 Haskell 的&quot;开放世界假设&quot;的一个后果(a consequence)。 以下这个例子可以把问题展现得更清楚一些。</p><pre><code>-- file: ch06/Overlap.hs
{-# LANGUAGE FlexibleInstances #-}
class Borked a where
    bork :: a -&gt; String

instance Borked Int where
    bork = show

instance Borked (Int, Int) where
    bork (a, b) = bork a ++ &quot;, &quot; ++ bork b

instance (Borked a, Borked b) =&gt; Borked (a, b) where
    bork (a, b) = &quot;&gt;&gt;&quot; ++ bork a ++ &quot; &quot; ++ bork b ++ &quot;&lt;&lt;&quot;
</code></pre><p>我们有两个 <code>Borked</code> 类型类实例应用于序对(for pairs)：一个是 <code>Int</code> 序对，另一个是任意类型的序对，只要这个类型是 <code>Borked</code> 类型类的实例。</p><p>假设我们想把 <code>bork</code> 应用于 <code>Int</code> 序对。 为了这样做，编译器必须选择一个实例来用。 因为这些实例都是正确地紧挨着(right next to each other)，所以它似乎可以选择更相关的(specific)的实例。</p><p>但是， <code>GHC</code> 在默认情况下是保守的，且坚持(insist)只有一个可能的GHC 能使用的实例 。 因此如果我们尝试使用 <code>bork</code> 的话， 那么它将报错。</p><div class="hint-container note"><p class="hint-container-title">注</p><p>::: title Note</p></div><p>什么时候重叠实例要紧(matter)？</p><p>就像我们之前提到的，我们可以分散一个类型类的实例横跨于(across)几个模块中。 GHC 不会抱怨重叠实例的单单存在(mere existence)。 取而代之地，他会抱怨，只有当我们试图使用受影响的类型类的函数时，只有他被迫要去做决定采用哪个实例时。 :::</p><h3 id="relaxing-some-restrictions-on-typeclasses" tabindex="-1"><a class="header-anchor" href="#relaxing-some-restrictions-on-typeclasses" aria-hidden="true">#</a> 放松(relex)类型类的一些限制</h3><p>通常，我们不能写一个类型类实例，(仅)为了一个多态类型（polymorphic type）的特化版本（specialized version）。 <code>[Char]</code> 类型就是多态类型 <code>[a]</code> (其中的 <code>a</code>)特化成类型 <code>Char</code> 。 我们就这样被禁止声明 <code>[Char]</code> 为某个类型类的实例。 这&quot;高度地&quot;(highly)不方便，因为字符串无处不在于实际的代码中。</p><p><code>TypeSynonymInstances</code> (&quot;同义类型的实例&quot;)语言扩展取消了这个限制，并允许我们写这样的实例。</p><p>GHC 支持另外一个有用的语言扩展， <code>OverlappingInstances</code> （覆盖实例）。 它解决(原文为address)了在处理重叠实例时候我们碰到的问题。 如果存在多个重叠的实例去从中选择，这个扩展会&quot;采摘&quot;(pick)最相关的（specific）那一个。</p><p>[Forec译注：在 Haskell 8.0 后， <code>OverlappingInstances</code> 已被抛弃，可替代的方法是在实例中加上 <code>{-# OVERLAPPABLE #-}</code> ，如：</p><pre><code>instance {-# OVERLAPPABLE -#} Foo a =&gt; Foo [a] where
    foo = concat . intersperse &quot;, &quot; . map foo
</code></pre><p>]</p><p>我们经常使用这个扩展，同 <code>TypeSynonymInstances</code> 一起。 这里是一个例子。</p><pre><code>-- file: ch06/SimpleClass.hs
{-# LANGUAGE TypeSynonymInstances, OverlappingInstances, FlexibleInstances #-}

import Data.List

class Foo a where
    foo :: a -&gt; String

instance Foo a =&gt; Foo [a] where
    foo = concat . intersperse &quot;, &quot; . map foo

instance Foo Char where
    foo c = [c]

instance Foo String where
    foo = id
</code></pre><p>如果我们应用(apply) <code>foo</code> 于 <code>String</code> ，编译器会选择 <code>String</code> 相关的(specific)实现。 虽然我们有一个 <code>Foo</code> 的实例关于 <code>[a]</code> 和 <code>Char</code> ，但关于 <code>String</code> 的实例更相关，所以 GHC 选择它。</p><p>即使 <code>OverlappingInstances</code> (覆盖实例)扩展出于使能状态(enabled)，GHC仍将拒绝代码，若他找到一个以上等价地相关的（equally specific）实例。</p><div class="hint-container note"><p class="hint-container-title">注</p><p>::: title Note</p></div><p>何时去使用 <code>OverlappingInstances</code> 扩展?</p><p>这是一个重要的点：GHC认为 <code>OverlappingInstances</code> 会影响一个实例的声明，而不是一个位置，于此（位置）我们使用一个实例。 换句话说，当我们定义一个实例，其（这个实例）我们希望能（被）允许覆盖（overlap）于其他实例的时候，我们必须使能(enable)该扩展(<code>OverlappingInstances</code>)为这个模块，而其（这个模块）包含着定义。 当他编译这个模块的时候，GHC会记录那个实例为＂能被覆盖（overlap）以其他的模块＂的。 一旦我们引入(import)这个模块而使用他的实例，我们将不需要使能(enable) <code>OverlappingInstances</code> 编译选项在引入模块的时候：GHC将已经知道这个实例是被标记为＂对覆盖友好的＂(okay to overlap)，当他被定义的时候。 这种行为是很有用的，当我们在写一个库(library)的时候:我们能选择去创造可覆盖的(overlappable)实例，但是库的用户不必须使能(enable)任何特殊的语言扩展。 :::</p><h3 id="how-does-show-work-for-strings" tabindex="-1"><a class="header-anchor" href="#how-does-show-work-for-strings" aria-hidden="true">#</a> show是如何处理String的?</h3><p><code>OverlappingInstances</code> (覆盖实例)和 <code>TypeSynonymInstances</code> (&quot;同义类型的实例&quot;)语言扩展是特定于GHC的，而在定义上过去没有出现(present)于&quot;Haskell 98&quot;。 然而，大家熟悉的 <code>Show</code> 类型类，来自&quot;Haskell 98&quot;，以某种方法区别地&quot;渲染&quot;(render) <code>Char</code> 列表(list)和 <code>Int</code> 列表。 它达成这个（&quot;区别地渲染&quot;）通过一个聪明但简单的把戏(trick)。</p><p><code>Show</code> 类型类定义了两个方法：一个 <code>show</code> 方法，用于渲染单值(one value)和一个 <code>showList</code> 方法，用于渲染值的列表。 而 <code>showList</code> 的默认实现，渲染一个列表，以使用中括号们和逗号们的方式。</p><p><code>Show</code> 的实例对于 <code>[a]</code> 是使用 <code>showList</code> 实现的。 <code>Show</code> 的实例为 <code>[Char]</code> 提供一个特殊的 <code>showList</code> 实现。 其（该实现）使用双引号，并转义&quot;非ASCII可打印&quot;(non-ASCII-printable)的字符们。</p><p>[sancao2译注:上面那句 <code>[Char]</code> 原文没有 <code>[]</code> ，应该是错了。]</p><p>作为结果，如果有人对 <code>[Char]</code> 应用 <code>show</code> 函数，那么 <code>showList</code> 的实现会被选上，并且将会正确地渲染字符串，通过使用括号们。</p><p>至少有时，因而，我们就能克制对 <code>OverlappingInstances</code> (覆盖实例)扩展的需要，带着一点点(时间维度的)横向思维(lateral thinking)。</p><h2 id="how-to-give-a-type-a-new-identity" tabindex="-1"><a class="header-anchor" href="#how-to-give-a-type-a-new-identity" aria-hidden="true">#</a> 如何给类型以新身份（new identity）</h2><p>包括熟悉的 <code>data</code> 关键字以外，Haskell 提供我们另外一种方式来创建新类型，即采用 <code>newtype</code> 关键字。</p><pre><code>-- file: ch06/Newtype.hs
data DataInt = D Int
    deriving (Eq, Ord, Show)

newtype NewtypeInt = N Int
    deriving (Eq, Ord, Show)
</code></pre><p><code>newtype</code> 声明的目的是重命名一个存在着的类型，来给它一个独特的身份(id)。 像我们能看到的，它的用法和采用 <code>data</code> 关键字进行声明，在表面上很相似。</p><div class="hint-container note"><p class="hint-container-title">注</p><p>::: title Note</p></div><p>type 和 newtype 关键字</p><p>尽管他们的名字是类似的， <code>type</code> 和 <code>newtype</code> 关键字有不同的目的。 <code>type</code> 关键字给了我们另一种方式以引用(refer to)某个类型，就像昵称之于一个朋友。 我们和编译器都知道 <code>[Char]</code> 和 <code>String</code> 引用的是同一个类型。</p><p>比较起来(与 <code>type</code>)， <code>newtype</code> 关键字存在，以隐藏一个类型的本性(nature)。 考虑一个 <code>UniqueID</code> 类型。</p><pre><code>-- file: ch06/Newtype.hs
newtype UniqueID = UniqueID Int
    deriving (Eq)
</code></pre><p>编译器会视 <code>UniqueID</code> 为 一个不同的类型于 <code>Int</code> 。 作为一个 <code>UniqueID</code> 的用户，我们只知道它有一个&quot;唯一标识符&quot;(Unique ID，英语字面意思)；我们并不知道它被实现为一个 <code>Int</code> 。 :::</p><p>当我们声明一个 <code>newtype</code> 时，我们必须选择哪个潜在类型的类型类实例，而对其（该实例）我们想要暴露。 在这里，我们决定让 <code>NewtypeInt</code> 提供 <code>Int</code> 的 <code>Eq</code> 、 <code>Ord</code> 和 <code>Show</code> 实例。 作为一个结果，我们可以比较和打印 <code>NewtypeInt</code> 类型的值。</p><pre><code>*Main&gt; N 1 &lt; N 2
True
</code></pre><p>由于我们没有暴露 <code>Int</code> 的 <code>Num</code> 或 <code>Integral</code> 实例， <code>NewtypeInt</code> 类型的值并不是数字们。 例如，我们不能加他们。</p><pre><code>*Main&gt; N 313 + N 37

&lt;interactive&gt;:9:7:
    No instance for (Num NewtypeInt) arising from a use of ‘+’
    In the expression: N 313 + N 37
    In an equation for ‘it’: it = N 313 + N 37
</code></pre><p>跟用 <code>data</code> 关键字一样，我们可以用 <code>newtype</code> 的值构造器创建一个新值，或者模式匹配于存在的值。</p><p>如果 <code>newtype</code> 没用自动派生（deriving）来暴露一个类型类的潜在（underlying）类型实现的话，我们是自由的，或者去写一个新实例，或者干脆留那个类型类处于不实现状态。</p><h3 id="data-and-newtype" tabindex="-1"><a class="header-anchor" href="#data-and-newtype" aria-hidden="true">#</a> data 和 newtype 声明之间的区别</h3><p><code>newtype</code> 关键字存在着（exists）为了给现有类型以一个新的身份（id）。 它有更多的限制于其使用上，比起 <code>data</code> 关键字。 说白了， <code>newtype</code> 只能有一个值构造器，并且那个构造器须恰有一个字段(field)。</p><pre><code>-- file: ch06/NewtypeDiff.hs
-- 可以：任意数量的构造器和字段（这里的两个Int为两个字段(fields)）
data TwoFields = TwoFields Int Int

-- 可以：恰一个字段
newtype Okay = ExactlyOne Int

-- 可以：类型变量是没问题的
newtype Param a b = Param (Either a b)

-- 可以：记录语法是友好的
newtype Record = Record {
        getInt :: Int
    }

-- 不可以：没有字段
newtype TooFew = TooFew

-- 不可以：多于一个字段
newtype TooManyFields = Fields Int Int

-- 不可以：多于一个构造器
newtype TooManyCtors = Bad Int
                     | Worse Int
</code></pre><p>在此之上，还有另一个重要的区别于 <code>data</code> 和 <code>newtype</code> 之间。 一个类型，由 <code>data</code> 关键字创建，有一个簿记保持（book-keeping）的开销在运行时。 例如，追踪（track）某个值是由哪个值构造器创造的。 而另一方面， <code>newtype</code> 只能有一个构造器，所以不需要这个额外开销。 这使得它在运行时更省时间和空间。</p><p>因为 <code>newtype</code> 的构造器只在编译时使用，运行时甚至不存在，所以对于用 <code>newtype</code> 定义的类型和那些用 <code>data</code> 定义的类型来说，类型匹配在 <code>undefined</code> 上的表现不同。</p><p>为了理解这个不同点，让我们首先回顾一下，我们可能期望一个普通类型的什么行为。 我们已经非常熟悉，如果在运行时 <code>undefined</code> 被求值会导致崩溃。</p><pre><code>Prelude&gt; undefined
*** Exception: Prelude.undefined
</code></pre><p>这里有一个类型匹配，在其（类型匹配）中我们采用 &quot;<code>D</code> 构造器&quot; 构造一个 <code>DataInt</code> ，然后放 <code>undefined</code> 在内部。</p><pre><code>*Main&gt; case (D undefined) of D _ -&gt; 1
1
</code></pre><p>[sancao2译注:做这个实验要先加载&quot;Newtype.hs&quot;，其中定义了 <code>Ｄ</code> 。]</p><p>由于我们的模式匹配只对构造器而不检查载荷(payload)， <code>undefined</code> 保持未被求值状态，因而不会导致一个异常被抛出。</p><p>在这个例子中，我们没有同时使用 <code>D</code> 构造器，因而未被保护的 <code>undefined</code> 会被求值。 当模式匹配发生时，我们抛出异常。</p><pre><code>*Main&gt; case undefined of D _ -&gt; 1
*** Exception: Prelude.undefined
</code></pre><p>当我们使用 <code>N</code> 构造器以得到 <code>NewtypeInt</code> 值时，我们看到相同的行为：没有异常，就像使用 <code>DataInt</code> 类型的 <code>D</code> 构造器。</p><pre><code>*Main&gt; case (N undefined) of N _ -&gt; 1
1
</code></pre><p>决定性的（crucial）差异发生了，当我们从表达式中去掉 <code>N</code> ，并匹配于一个未保护的 <code>undefined</code> 时。</p><pre><code>*Main&gt; case undefined of N _ -&gt; 1
1
</code></pre><p>我们没有崩溃！由于不存在构造器于运行时，对 <code>N _</code> 的匹配实际上等效于对空白通配符 <code>_</code> 的匹配：由于这个通配符（ <code>_</code> ）总可以匹配，所以表达式不需要被求值。</p><div class="hint-container note"><p class="hint-container-title">注</p><p>::: title Note</p></div><p>关于 <code>newtype</code> 构造器的另一种看法</p><p>虽然，我们使用值（value）构造器，以得到一个 <code>newtype</code> ，其方式等同于一个类型被定义而其采用 <code>data</code> 关键词。 两者所做的是强迫一个值（value）处于（between）他的&quot;正常&quot;（normal）类型和他的 <code>newtype</code> 类型之间。</p><p>换句话说，当我们应用（apply） <code>N</code> 于一个表达式，我们强迫一个表达式从 <code>Int</code> 类型到 <code>NewtypeInt</code> 类型，对我们（we）和编译器（compiler）而言，但是，完全地（absolutely），没有事情发生于运行时（runtime）。</p><p>类似地，当我们匹配 <code>N</code> 构造器于一个模式中，我们强制一个表达式从 <code>NewtypeInt</code> 到 <code>Int</code> ，但是再次地不存在开销于运行时。 :::</p><h3 id="summary-the-three-ways-of-naming-types" tabindex="-1"><a class="header-anchor" href="#summary-the-three-ways-of-naming-types" aria-hidden="true">#</a> 总结：三种命名类型的方式</h3><p>这是一份简要重述（recap），关于 Haskell 的三种方式用来为类型提出（introduce）新名。</p><ul><li><code>data</code> 关键字提出（introduce）一个真正的代数（albegraic）数据类型。</li><li><code>type</code> 关键字给我们一个别名（synonym）去用，为一个存在着的（existing）类型。 我们可以交换地（interchangeably）使用这个类型和他的别名,</li><li><code>newtype</code> 关键字给予一个存在着的类型以一个独特的身份（distinct identity）。 这个原类型和这个新类型是不可交换的（interchangeable）。</li></ul><h2 id="json_typeclasses_without_overlapping_instances" tabindex="-1"><a class="header-anchor" href="#json_typeclasses_without_overlapping_instances" aria-hidden="true">#</a> JSON类型类,不带有重叠实例</h2><p>启用GHC的重叠实例支持是一个让我们的JSON库工作的既有效又快速的方法。 在更复杂的场景中，我们有时被迫面对这样一种情况：某个类型类有多个相关程度相同（equally good）实例。 在这种情况下，重叠实例们将不会帮助我，而我们将需要代之以几处 <code>newtype</code> 声明。 为了弄明白这涉及到了什么，让我们重构（rework）我们的JSON类型类实例们以使用 <code>newtype</code> 代替重叠实例。</p><p>我们的第一个任务，是帮助编译器区分 <code>[a]</code> 和 <code>[(String,[a])]</code> 。 前者（ <code>[a]</code> ）我们用来表示JSON数组们（arrays），而后者（ <code>[(String, [a])]</code> ）用来表示JSON对象们（objects）。 他们是这些类型们，其给我们制造了麻烦于我们学会 <code>OverlappingInstances</code> （覆盖实例）之前。 我们包装了（wrap up）列表（list）类型，以至于编译器不会视其为一个列表。</p><pre><code>-- file: ch06/JSONClass.hs
newtype JAry a = JAry {
      fromJAry :: [a]
      } deriving (Eq, Ord, Show)
</code></pre><p>当我们从自己的模块导出这个类型时，我们会导出该类型完整的细节。 我们的模块头部将看起来像这样：</p><pre><code>-- file: ch06/JSONClassExport.hs
module JSONClass
    (
      JAry(..)
    ) where
</code></pre><p>紧跟着 <code>Jary</code> 的&quot; <code>(..)</code> &quot;，意思是&quot;导出这个类型的所有细节&quot;。</p><div class="hint-container note"><p class="hint-container-title">注</p><p>::: title Note</p></div><p>一点稍微的偏差，相比于正常使用</p><p>通常地，当我们导出一个 <code>newtype</code> 的时候，我们 <em>不会</em> 导出这个类型的数据构造器，为了保持其细节的抽象（abstract）。 取而代之，我们会定义一个函数为我们应用（apply）该数据构造器。</p><pre><code>-- file: ch06/JSONClass.hs
jary :: [a] -&gt; JAry a
jary = JAry
</code></pre><p>于是，我们会导出类型构造器、解构函数和我们的构造函数，除了数据构造器。</p><pre><code>-- file: ch06/JSONClassExport.hs
module JSONClass
    (
      JAry(fromJAry)
    , jary
    ) where
</code></pre><p>当我们没有导出一个类型的数据构造器，我们库的顾客们就只能使用我们提供的函数们去构造和解构该类型的值。 这个特性为我们，这些库作者们，提供了自由去改变类型的内部表示形式（represention），如果我们需要去（这么做）。</p><p>如果我们导出数据构造器，顾客们很可能开始依赖于它，比方说使用它（数据构造器）在一些模式中。 如果哪天我们希望去修改这个类型的内部构造，我们将冒险打破任意代码，而其（这些代码）使用着该数据构造器。</p><p>在我们这里的情况下，我们得不到什么额外的好处，通过让数组的包装器保持抽象，所以我们就干脆地导出该类型的整个定义。 :::</p><p>我们提供另一个包装类型，而其隐藏了一个JSON对象的我们的表示形式（represention）。</p><pre><code>-- file: ch06/JSONClass.hs
newtype JObj a = JObj {
      fromJObj :: [(String, a)]
    } deriving (Eq, Ord, Show)
</code></pre><p>带着这些定义好的类型，我们制造一些小改动到我们的 <code>JValue</code> 类型的定义。</p><pre><code>-- file: ch06/JSONClass.hs
data JValue = JString String
            | JNumber Double
            | JBool Bool
            | JNull
            | JObject (JObj JValue)   -- was [(String, JValue)]
            | JArray (JAry JValue)    -- was [JValue]
              deriving (Eq, Ord, Show)
</code></pre><p>这个改动不会影响到 <code>JSON</code> 类型类的实例们，而那些我们已经写完。 但是我们还要为我们新的 <code>JAry</code> 和 <code>JObj</code> 类型编写实例。</p><pre><code>-- file: ch06/JSONClass.hs
jaryFromJValue :: (JSON a) =&gt; JValue -&gt; Either JSONError (JAry a)

jaryToJValue :: (JSON a) =&gt; JAry a -&gt; JValue

instance (JSON a) =&gt; JSON (JAry a) where
    toJValue = jaryToJValue
    fromJValue = jaryFromJValue
</code></pre><p>让我们缓慢地走过各个步骤，而这些步骤会转换一个 <code>JAry a</code> 到一个 <code>JValue</code> 。 给定一个列表，其中内部每一个元素都是一个 <code>JSON</code> 实例，转换它（前面的列表）到一个 <code>JValue</code> s 组成的列表是简单的。</p><pre><code>-- file: ch06/JSONClass.hs
listToJValues :: (JSON a) =&gt; [a] -&gt; [JValue]
listToJValues = map toJValue
</code></pre><p>取得这个值并包装他来得到一个 <code>JAry JValue</code> 的过程，实际上就是对其应用 <code>newtype</code> 的类型构造器。</p><pre><code>-- file: ch06/JSONClass.hs
jvaluesToJAry :: [JValue] -&gt; JAry JValue
jvaluesToJAry = JAry
</code></pre><p>(记住，这种做法没有任何性能代价。我们只是告诉编译器隐藏这个事实：我们正在使用一个列表。) 为了转化这个值成为一个 <code>JValue</code> ，我们应用另一个类型构造器。</p><p>::</p><p>: -- file: ch06/JSONClass.hs jaryOfJValuesToJValue :: JAry JValue -&gt; JValue jaryOfJValuesToJValue = JArray</p><p>组装这些代码片段，通过使用函数组合(function composition)，而我们得到一个简洁的单行（代码），用于转换得到一个 <code>JValue</code> 。</p><pre><code>-- file: ch06/JSONClass.hs
jaryToJValue = JArray . JAry . map toJValue . fromJAry
</code></pre><p>我们有更多的工作去做来实现从 <code>JValue</code> 到 <code>JAry a</code> 的转换，但是我们把它&quot;碎裂&quot;（break）成一些可重用的部分。 基本函数一目了然（straightforward）。</p><pre><code>-- file: ch06/JSONClass.hs
jaryFromJValue (JArray (JAry a)) =
    whenRight JAry (mapEithers fromJValue a)
jaryFromJValue _ = Left &quot;not a JSON array&quot;
</code></pre><p><code>whenRight</code> 函数会检查传给它的参数：如果第二个参数是用 <code>Right</code> 构造器创建的，以它为参数调用第一个参数指定的函数；如果第二个参数是 <code>Left</code> 构造器创建的，则将它保持原状返回，其它什么也不做。</p><pre><code>-- file: ch06/JSONClass.hs
whenRight :: (b -&gt; c) -&gt; Either a b -&gt; Either a c
whenRight _ (Left err) = Left err
whenRight f (Right a) = Right (f a)
</code></pre><p><code>mapEithers</code> 函数要更复杂一些。 它的行为就像 <code>map</code> 函数，但如果它遇到一个 <code>Left</code> 值，会直接返回该值，而不会继续积累 <code>Right</code> 值构成的列表。</p><pre><code>-- file: ch06/JSONClass.hs
mapEithers :: (a -&gt; Either b c) -&gt; [a] -&gt; Either b [c]
mapEithers f (x:xs) = case mapEithers f xs of
                        Left err -&gt; Left err
                        Right ys -&gt; case f x of
                                      Left err -&gt; Left err
                                      Right y -&gt; Right (y:ys)
mapEithers _ _ = Right []
</code></pre><p>由于隐藏在 <code>JObj</code> 类型中的列表元素有更细碎的结构，相应的，在它和 <code>JValue</code> 类型之间互相转换的代码就会有点复杂。 万幸的是，我们可以重用刚刚定义过的函数。</p><pre><code>-- file: ch06/JSONClass.hs
import Control.Arrow (second)

instance (JSON a) =&gt; JSON (JObj a) where
    toJValue = JObject . JObj . map (second toJValue) . fromJObj

    fromJValue (JObject (JObj o)) = whenRight JObj (mapEithers unwrap o)
      where unwrap (k,v) = whenRight ((,) k) (fromJValue v)
    fromJValue _ = Left &quot;not a JSON object&quot;
</code></pre><h3 id="练习题" tabindex="-1"><a class="header-anchor" href="#练习题" aria-hidden="true">#</a> 练习题</h3><ol><li>在 <strong>ghci</strong> 中加载 <code>Control.Arrow</code> 模块，弄清 <code>second</code> 函数的功能。</li><li><code>(,)</code> 是什么类型？在 <strong>ghci</strong> 中调用它时，它的行为是什么？ <code>(,,)</code> 呢？</li></ol><h2 id="the_dreaded_monomorphism_restriction" tabindex="-1"><a class="header-anchor" href="#the_dreaded_monomorphism_restriction" aria-hidden="true">#</a> 可怕的单一同态限定（monomorphism restriction）</h2><p>Haskell 98 有一个微妙的特性可能会在某些意想不到的情况下&quot;咬&quot;到我们。 下面这个简单的函数展示了这个问题。</p><pre><code>-- file: ch06/Monomorphism.hs
myShow = show
</code></pre><p>如果我们试图把它载入 <strong>ghci</strong> ，会产生一个奇怪的错误：</p><pre><code>Prelude&gt; :l Monomorphism.hs

[1 of 1] Compiling Main             ( Monomorphism.hs, interpreted )

Monomorphism.hs:2:10:
    No instance for (Show a0) arising from a use of ‘show’
    The type variable ‘a0’ is ambiguous
    Relevant bindings include
        myShow :: a0 -&gt; String (bound at Monomorphism.hs:2:1)
    Note: there are several potential instances:
        instance Show a =&gt; Show (Maybe a) -- Defined in ‘GHC.Show’
        instance Show Ordering -- Defined in ‘GHC.Show’
        instance Show Integer -- Defined in ‘GHC.Show’
        ...plus 22 others
    In the expression: show
    In an equation for ‘myShow’: myShow = show
    Failed, modules loaded: none.
</code></pre><p>错误信息中提到的 &quot;monomorphism restriction&quot; 是 Haskell 98 的一部分。 <em>单一同态</em>是多态（polymorphism）的反义词：它表明某个表达式只有一种类型。 Haskell 有时会强制使某些声明不像我们预想的那么多态。</p><p>我们在这里提单一同态是因为尽管它和类型类没有直接关系，但类型类给它提供了产生的环境。</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>::: title Tip</p></div><p>在实际代码中可能很久都不会碰到单一同态，因此我们觉得你没必要记住这部分的细节， 只要在心里知道有这么回事就可以了，除非 GHC 真的报告了跟上面类似的错误。 如果真的发生了，记得在这儿曾读过这个错误，然后回过头来看就行了。 :::</p><p>我们不会试图去解释单一同态限制。 Haskell 社区一致同意它并不经常出现；它解释起来很棘手（tricky)； 它几乎没什么实际用处；它唯一的作用就是坑人。 举个例子来说明它为什么棘手：尽管上面的例子违反了这个限制， 下面的两个编译起来却毫无问题。</p><pre><code>-- file: ch06/Monomorphism.hs
myShow2 value = show value

myShow3 :: (Show a) =&gt; a -&gt; String
myShow3 = show
</code></pre><p>上面的定义表明，如果 GHC 报告单一同态限制错误，我们有三个简单的方法来处理。</p><ul><li>显式声明函数参数，而不是隐性。</li><li>显式定义类型签名，而不是依靠编译器去推导。</li><li>不改代码，编译模块的时候用上 <code>NoMonomorphismRestriction</code> 语言扩展。 它取消了单一同态限制。</li></ul><p>没人喜欢单一同态限制，因此几乎可以肯定的是下一个版本的 Haskell 会去掉它。 但这并不是说加上 <code>NoMonomorphismRestriction</code> 就可以一劳永逸：有些编译器（包括一些老版本的 GHC）识别不了这个扩展，但用另外两种方法就可以解决问题。 如果这种可移植性对你不是问题，那么请务必打开这个扩展。</p><h2 id="conclusion" tabindex="-1"><a class="header-anchor" href="#conclusion" aria-hidden="true">#</a> 结论</h2><p>在这章，你学到了类型类有什么用以及怎么用它们。 我们讨论了如何定义自己的类型类，然后又讨论了一些 Haskell 库里定义的类型类。 最后，我们展示了怎么让 Haskell 编译器给你的类型自动派生出某些类型类实例。</p>`,169),l=[r,s,i];function p(u,h){return n(),a("div",null,l)}const q=d(c,[["render",p],["__file","6.html.vue"]]);export{q as default};
