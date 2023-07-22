import{_ as t,W as c,X as d,Y as e,Z as o,$ as p,a2 as n,C as s}from"./framework-0bc3c581.js";const i={},l=n(`<h1 id="第-4-章-函数式编程" tabindex="-1"><a class="header-anchor" href="#第-4-章-函数式编程" aria-hidden="true">#</a> 第 4 章：函数式编程</h1><h2 id="使用-haskell-思考" tabindex="-1"><a class="header-anchor" href="#使用-haskell-思考" aria-hidden="true">#</a> 使用 Haskell 思考</h2><p>初学 Haskell 的人需要迈过两个难关：</p><p>首先，我们需要将自己的编程观念从命令式语言转换到函数式语言上面来。这样做的原因并不是因为命令式语言不好，而是因为比起命令式语言，函数式语言更胜一筹。</p><p>其次，我们需要熟悉 Haskell 的标准库。和其他语言一样，函数库可以像杠杆那样，极大地提升我们解决问题的能力。因为 Haskell 是一门层次非常高的语言，而 Haskell 的标准库也趋向于处理高层次的抽象，因此对 Haskell 标准库的学习也稍微更难一些，但这些努力最终都会物有所值。</p><p>这一章会介绍一些常用的函数式编程技术，以及一些 Haskell 特性。还会在命令式语言和函数式语言之间进行对比，帮助读者了解它们之间的区别，并且在这个过程中，陆续介绍一些基本的 Haskell 标准库。</p><h2 id="一个简单的命令行程序" tabindex="-1"><a class="header-anchor" href="#一个简单的命令行程序" aria-hidden="true">#</a> 一个简单的命令行程序</h2><p>在本章的大部分时间里，我们都只和无副作用的代码打交道。为了将注意力集中在实际的代码上，我们需要开发一个接口程序，连接起带副作用的代码和无副作用的代码。</p><p>这个接口程序读入一个文件，将函数应用到文件，并且将结果写到另一个文件：</p><p>::: literalinclude /code/ch04/InteractWith.hs :::</p><p>这是一个简单但完整的文件处理程序。其中 <code>do</code> 关键字引入一个块，标识那些带有副作用的代码，比如对文件进行读和写操作。被 <code>do</code> 包围的 <code>&lt;-</code> 操作符效果等同于赋值。第七章还会介绍更多 I/O 方面的函数。</p><p>当我们需要测试其他函数的时候，我们就将程序中的 <code>id</code> 换成其他函数的名字。另外，这些被测试的函数的类型包含 <code>String -&gt; String</code> ，也即是，这些函数应该都接受并返回字符串值。</p><p>[译注： <code>id</code> 函数接受一个值，并原封不动地返回这个值，比如 <code>id &quot;hello&quot;</code> 返回值 <code>&quot;hello&quot;</code> ，而 <code>id 10</code> 返回值 <code>10</code> 。]</p><p>[译注：这一段最后一句的原文是&quot; ... need to have the type <code>String -&gt; String</code> ... &quot; ，因为 Haskell 是一种带有类型多态的语言，所以将&quot; have the type &quot; 翻译成 &quot; 包含 xx 类型 &quot;，而不是 &quot; 必须是 xx 类型 &quot;。</p><p>接下来编译这个程序：</p><pre><code>$ ghc --make InteractWith
[1 of 1] Compiling Main             ( InteractWith.hs, InteractWith.o )
Linking InteractWith ...
</code></pre><p>通过命令行运行这个程序。它接受两个文件名作为参数输入，一个用于读取，一个用于写入：</p><pre><code>$ echo &quot;hello world&quot; &gt; hello-in.txt

$ ./InteractWith hello-in.txt hello-out.txt

$ cat hello-in.txt 
hello world

$ cat hello-out.txt 
hello world
</code></pre><p>[译注：原书这里的执行过程少了写入内容到 <code>hello-in.txt</code> 的一步，导致执行会出错，所以这里加上 <code>echo ...</code> 这一步。另外原书执行的是 <code>Interact</code> 过程，也是错误的，正确的执行文件名应该是 <code>InteractWith</code> 。]</p><h2 id="热身-方便地分离多行文本" tabindex="-1"><a class="header-anchor" href="#热身-方便地分离多行文本" aria-hidden="true">#</a> 热身： 方便地分离多行文本</h2><p>Haskell提供一个内建函数，lines，让我们在行边界上分离一段文本字符串。它返回一个忽略了行终止字符的字符串列表。</p><pre><code>ghci&gt; :type lines
lines :: String -&gt; [String]
ghci&gt; lines &quot;line 1\\nline 2&quot;
[&quot;line 1&quot;,&quot;line 2&quot;]
ghci&gt; lines &quot;foo\\n\\nbar\\n&quot;
[&quot;foo&quot;,&quot;&quot;,&quot;bar&quot;]
</code></pre><p>尽管lines看上去有用，但它要工作的话仰赖于我们用&quot;文本模式&quot;去读一个文件。文本模式对于很多编程语言来说是一个很普遍的功能：当我们在Windows系统上读和写文件的时候它提供一个特别的行为。当我们用文本模式读取一个文件的时候，文件I/O库把行终止序列&quot;\\r\\n&quot;（回车后跟着一个换行）转换成&quot;\\n&quot;（单独一个换行），当我们写一个文件的时候，它（译注：文件I/O库）会做相反的事情。而在类Unix系统上，文本模式不会做任何的转换工作。这个不同之处会导致的结果是，如果我们在Windows系统上读取一个在类Unix系统上写入的文件，行终止符很可能会变得乱七八糟。（readFile和writeFile都在文本模式下操作的话）</p><pre><code>ghci&gt; lines &quot;a\\r\\nb&quot;
[&quot;a\\r&quot;,&quot;b&quot;]
</code></pre><p>lines函数仅仅在换行符处分离文本，留下回车跟在行的结尾处。如果我们在Linux或Unix上读取一个Windows生成的文本文件，我们将在每一行的结尾处得到尾随的回车。</p><p>我们舒适地用了Python提供的&quot;通用换行&quot;支持很长时间了：它透明地为我们处理Unix和Windows的行终止惯例。我们也想要用Haskell提供类似的支持。</p><p>因为到目前为止我们仅仅接触了少量的Haskell代码，所以我们将一步一步地讨论我们用Haskell实现上述支持的细节。</p><pre><code>-- file: ch04/SplitLines.hs
splitLines :: String -&gt; [String]
</code></pre><p>我们的函数类型签名标示它接受一个字符串，可能是具有某些未知的行终止惯例的文件的内容。它返回一个包含字符串的列表，列表的每一项代表文件中的每一行文本。</p><pre><code>-- file: ch04/SplitLines.hs
splitLines [] = []
splitLines cs =
    let (pre, suf) = break isLineTerminator cs
    in  pre : case suf of 
                (&#39;\\r&#39;:&#39;\\n&#39;:rest) -&gt; splitLines rest
                (&#39;\\r&#39;:rest)      -&gt; splitLines rest
                (&#39;\\n&#39;:rest)      -&gt; splitLines rest
                _                -&gt; []

isLineTerminator c = c == &#39;\\r&#39; || c == &#39;\\n&#39;
</code></pre><p>在我们深入细节之前，首先注意我们是怎么组织我们的代码的。我们首先呈现重要的代码片段，而把isLineTerminator函数的定义放在后面。因为我们给了这个辅助函数一个易读的名称，所以即使在我们读它的定义之前我们就能知道它是做什么用的。</p><p>Prelude定义了一个叫做break的函数，我们可以用它把一个列表分成两部分。它把一个函数作为它的第一个参数。这个函数必须去检查列表中的元素，并且返回一个Bool值来表示列表是否在那个元素处被一分为二。break函数返回一个对值（译注：即二元组），由一个谓词（译注：即一个返回Bool值的函数，下同）返回True（译注：第一次返回True）之前的元素构成的列表（前缀）和剩下的元素构成的列表组成（后缀）。</p><pre><code>ghci&gt; break odd [2,4,5,6,8]
([2,4],[5,6,8])
ghci&gt; :module +Data.Char
ghci&gt; break isUpper &quot;isUpper&quot;
(&quot;is&quot;,&quot;Upper&quot;)
</code></pre><p>因为我们一次只需要匹配单个的回车或换行，所以每次检查列表中的一个元素正是我们所需要的。</p><p>splitLines的第一个算式标示如果我们匹配到一个空的字符串，我们就没有进一步的工作可做了。</p><p>在第二个算式中，我们首先对输入的字符串应用break。前缀就是第一个行终止符之前的子字符串，后缀就是整个字符串余下的部分。这个后缀将包含可能存在的行终止符。</p><p>&quot;pre :&quot;表达式告诉我们应该在这个代表文本行的列表的头部加上pre所表示的值。然后我们用一个case表达式去检查后缀，我们来决定下一步做什么。case表达式的结果将被用作(:)函数的的二个参数来构造结果列表。</p><p>case表达式中的第一个模式匹配以一个回车紧接着一个换行符开始的字符串。变量rest被绑定到这个字符串余下的部分。其它的模式是相似的，因此它们应当容易理解。</p><p>以上对Haskell函数的散文式的描述不一定是容易理解的。我们可以借助ghci，观察不同情况下这个函数的行为，以获得更好的理解。</p><p>让我们从分割一个不包含任何行终止符的字符串开始。</p><pre><code>ghci&gt; splitLines &quot;foo&quot;
[&quot;foo&quot;]
</code></pre><p>这里，我们的break没找到一个行终止符，所以它返回的后缀是空的。</p><pre><code>ghci&gt; break isLineTerminator &quot;foo&quot;
(&quot;foo&quot;,&quot;&quot;)
</code></pre><p>因此在splitLines函数中的case表达式一定是匹配上了第四个分支，然后完成了求值。 再来一点儿更有趣的例子怎么样？</p><pre><code>ghci&gt; splitLines &quot;foo\\r\\nbar&quot;
[&quot;foo&quot;,&quot;bar&quot;]
</code></pre><p>首先我们的break给我们一个非空的后缀。</p><pre><code>ghci&gt; break isLineTerminator &quot;foo\\r\\nbar&quot;
(&quot;foo&quot;,&quot;\\r\\nbar&quot;)
</code></pre><p>因为这个后缀以一个回车紧接着一个换行符开始，我们匹配上了case表达式的第一个分支。这个求值结果让我们把pre绑定到&quot;foo&quot;，suf绑定到&quot;bar&quot;。我们递归地应用splitLines，这一次匹配上单独的&quot;bar&quot;。</p><pre><code>ghci&gt; splitLines &quot;bar&quot;
[&quot;bar&quot;]
</code></pre><p>结果是我们构造了一个头部的元素是&quot;foo&quot;，尾部的元素是&quot;bar&quot;的列表</p><pre><code>ghci&gt; &quot;foo&quot; : [&quot;bar&quot;]
[&quot;foo&quot;,&quot;bar&quot;]
</code></pre><p>这种在ghci中的实验是一种有效的理解和调试一段代码的行为的方法。它甚至有一个更重要的好处就是非刻意的（译注：不是特别理解这句话在原英文语境中的意思，暂且按照网页中的批注直译过来，原句：It has an even more important benefit that is almost accidental in nature.）。从ghci测试复杂的代码是困难的，所以我们将倾向于写更小的函数。这能更进一步改善我们的代码的可读性。</p><p>这种创建和复用小的、强大的代码片段的方式是函数式编程的基础。</p><h3 id="一个行终止转换程序" tabindex="-1"><a class="header-anchor" href="#一个行终止转换程序" aria-hidden="true">#</a> 一个行终止转换程序</h3><p>让我们把我们的splitLines函数和早先我们写的一个小框架联系起来。首先制作一份Interact.hs源文件的拷贝；让我们叫这个新文件FixLines.hs。把splitLines加到新的源码文件中。因为我们的函数必须产出一个单独的字符串，所以我们必须把这个表示行的列表拼接起来。Prelude提供一个unlines函数，它把一个字符串组成的列表串联起来，并且在每个字符串元素的末尾加上一个换行符。（译注：原文中代码注释命名有误，不是 SplitLines.hs 而是 FixLines.hs）</p><pre><code>-- file: ch04/FixLines.hs
fixLines :: String -&gt; String
fixLines input = unlines (splitLines input)
</code></pre><p>如果我们用fixLines替换这个id函数（译注：是指拷贝自Interact.hs的FixLines.hs中的id函数），我们可以把FixLines.hs编译成一个将文本文件的行终止转换成系统特定的行终止的可执行程序。</p><pre><code>$ ghc --make FixLines
[1 of 1] Compiling Main             ( FixLines.hs, FixLines.o )
Linking FixLines ...
</code></pre><p>如果你在一个Windows系统上面，找到并下载一个在Unix系统上创建的文本文件（比如 gpl-3.0.txt）。在记事本程序中打开它。里面的文本行应该都跑一起去了，导致它几乎不可读。用刚才你编译得到的FixLines命令处理这个文件，然后在记事本程序中打开此命令输出的文件。现在这个行终止符的问题应该被修正了。</p><p>在类Unix的系统上，编辑器隐藏了Windows的行终止符。使得验证FixLines是否消除了它们更加困难。这里有一些命令应该能帮助你。</p><pre><code>$ file gpl-3.0.txt
gpl-3.0.txt: ASCII English text
$ unix2dos gpl-3.0.txt
unix2dos: converting file gpl-3.0.txt to DOS format ...
$ file gpl-3.0.txt
gpl-3.0.txt: ASCII English text, with CRLF line terminators
</code></pre><h2 id="中缀函数" tabindex="-1"><a class="header-anchor" href="#中缀函数" aria-hidden="true">#</a> 中缀函数</h2><p>通常，当我们在Haskell中定义和应用一个函数的时候，我们写这个函数的名称，紧接着它的参数。这种表示法作为前缀被提及，因为这个函数的名称位于它的参数前面。</p><p>如果一个函数或构造器带两个或更多的参数，我们可以选择使用中缀形式，即我们把函数（名称）放在它的第一个和第二个参数之间。这允许我们把函数作为中缀操作符来使用。</p><p>要用中缀表示法定义或应用一个函数或值构造器，我们用重音符（有时被称为反引号）包围它的名称。这里有简单的中缀函数和中缀类型的定义。</p><pre><code>-- file: ch04/Plus.hs
a \`plus\` b = a + b

data a \`Pair\` b = a \`Pair\` b
                  deriving (Show)

-- we can use the constructor either prefix or infix
foo = Pair 1 2
bar = True \`Pair\` &quot;quux&quot;
</code></pre><p>因为中缀表示法纯粹是为了语法上的便利，因此它不会改变函数的行为。</p><pre><code>ghci&gt; 1 \`plus\` 2
3
ghci&gt; plus 1 2
3
ghci&gt; True \`Pair\` &quot;something&quot;
True \`Pair\` &quot;something&quot;
ghci&gt; Pair True &quot;something&quot;
True \`Pair\` &quot;something&quot;
</code></pre><p>中缀表示法经常对代码可读性有帮助。比如，Prelude定义了一个elem函数，它标示一个给定的值是否出现在一个列表中。如果我们用前缀表示法来使用elem，它构成的代码相当易读。</p><pre><code>ghci&gt; elem &#39;a&#39; &quot;camogie&quot;
True
</code></pre><p>如果我们换用中缀表示法，这段代码甚至会变得更容易理解。它清楚地标示我们正在检查左边的给定值是否出现在右边的列表里。</p><pre><code>ghci&gt; 3 \`elem\` [1,2,4,8]
False
</code></pre><p>我们在Data.List模块的一些有用的函数中看到了更明显的改进（译注：这里是指中缀表示法改进了代码可读性）。isPrefixOf函数告诉我们一个列表是否匹配另一个列表的开始部分。</p><pre><code>ghci&gt; :module +Data.List
ghci&gt; &quot;foo&quot; \`isPrefixOf\` &quot;foobar&quot;
True
</code></pre><p>相应地，isInfixOf和isSuffixOf函数匹配一个列表的中间和结尾处的任何地方。</p><pre><code>ghci&gt; &quot;needle&quot; \`isInfixOf\` &quot;haystack full of needle thingies&quot;
True
ghci&gt; &quot;end&quot; \`isSuffixOf\` &quot;the end&quot;
True
</code></pre><p>没有一个硬性的规则指示你什么时候应该用中缀表示法或是前缀表示法，尽管使用前缀表示法要普遍得多。在具体情况下选择使你的代码更可读的那一种表示法就是最好的。</p><div class="hint-container info"><p class="hint-container-title">相关信息</p><p>注意出现在不熟悉的语言中的常见符号。 一些其它的编程语言使用反引号，但是尽管看起来像，反引号在Haskell中的用途还是和Perl、Python以及Unix脚本中的用途不太像。 在Haskell中，我们能用反引号做的唯一合法的事情是让它们包裹函数名称。我们不能，比如，用它们围绕一个值是一个函数的复杂表达式。 如果我们能做这个可能是方便的，但那不是这个语言今天的模样。</p></div><h2 id="和列表打交道" tabindex="-1"><a class="header-anchor" href="#和列表打交道" aria-hidden="true">#</a> 和列表打交道</h2><p>作为函数式编程的基本组件，列表应该得到足够的重视。Prelude定义了很多函数来处理列表。它们当中的许多是不可或缺的工具，所以及早学习它们是很重要的。</p><p>不管怎样，这一节将学习很多函数。为什么要马上展示这么多函数？因为这些函数既容易学而且会经常使用。如果我们不知道有这样的工具箱，那么时间将浪费在编写那些在标准库中已经存在的简单函数上。因此深入学习列表模块中的函数是非常值得的。</p><p>Data.List模块包含所有的列表函数。Prelude只不过重新导出了这些在Data.List模块中的函数的大部分。还有一些有用的函数并没有被Prelude重新导出。下面学习列表函数的时候，将明确地提到那些只在Data.List中出现的。</p><pre><code>ghci&gt; :module +Data.List
</code></pre><p>因为这些函数没有什么复杂的或者代码量超过三行的，所有我们对它们只做简单的描述。实际上，快速和有用的学习方法是记住它们是如何定义的。</p><h3 id="基本的列表操作" tabindex="-1"><a class="header-anchor" href="#基本的列表操作" aria-hidden="true">#</a> 基本的列表操作</h3><p>length函数告诉我们一个列表中包含多少个元素。</p><pre><code>ghci&gt; :type length
length :: [a] -&gt; Int
ghci&gt; length []
0
ghci&gt; length [1,2,3]
3
ghci&gt; length &quot;strings are lists, too&quot;
22
</code></pre><p>如果需要检查列表是不是空的，用null函数。</p><pre><code>ghci&gt; :type null
null :: [a] -&gt; Bool
ghci&gt; null []
True
ghci&gt; null &quot;plugh&quot;
False
</code></pre><p>要访问列表的第一个元素，用head函数。</p><pre><code>ghci&gt; :type head
head :: [a] -&gt; a
ghci&gt; head [1,2,3]
1
</code></pre><p>相反，tail函数，返回列表中除了第一个其它所有的元素。</p><pre><code>ghci&gt; :type tail
tail :: [a] -&gt; [a]
ghci&gt; tail &quot;foo&quot;
&quot;oo&quot;
</code></pre><p>还有一个函数，last，返回列表的最后一个元素。</p><pre><code>ghci&gt; :type last
last :: [a] -&gt; a
ghci&gt; last &quot;bar&quot;
&#39;r&#39;
</code></pre><p>和last相反的是init，它返回列表中除了最后一个其它所有的元素。</p><pre><code>ghci&gt; :type init
init :: [a] -&gt; [a]
ghci&gt; init &quot;bar&quot;
&quot;ba&quot;
</code></pre><p>上面的一些函数应用在空列表上时会报错，因此当不知道一个列表是否为空的时候要小心了。它们会报告什么样的错误呢？</p><pre><code>ghci&gt; head []
*** Exception: Prelude.head: empty list
</code></pre><p>在ghci里试一试上面的每一个函数，看看哪些应用在空列表上时会崩溃？</p><h3 id="安全和明智地跟会崩溃的函数打交道" tabindex="-1"><a class="header-anchor" href="#安全和明智地跟会崩溃的函数打交道" aria-hidden="true">#</a> 安全和明智地跟会崩溃的函数打交道</h3><p>当我们想使用一个函数比如head时，如果我们传递一个空列表给它，很可能会破坏我们的工作，有效避免这个问题的方法是在使用head之前，检查传递给它的列表的长度。让我们举一个例子说明。</p><pre><code>-- file: ch04/EfficientList.hs
myDumbExample xs = if length xs &gt; 0
                   then head xs
                   else &#39;Z&#39;
</code></pre><p>如果用过像Perl或者Python这样的编程语言，这段代码看起来就是一种很自然地编写测试的方式。在底层，Python和Perl中的列表都是数组。所以它们必定能通过调用len(foo)或者是scalar(@foo)得知列表（数组）的长度。但是基于很多别的原因，把这些假设照搬到Haskell中不是一个好主意。</p><p>我们已经看过列表的数据类型定义好多次了，知道一个列表不会明确地存储它本身的长度。因此length函数的工作方式是遍历整个列表。</p><p>所以当我们只关心一个列表是不是为空时，调用length不是一个好的策略。如果我们处理的是一个有限的列表，它潜在地做了比我们想象的更多的事情。因为Haskell很容易创建无限列表，所以不小心使用了length函数可能导致无限循环。</p><p>一个更合适的替代方案是调用null函数，它执行的次数是确定不变的。更好的是，使用null能使我们的代码明确地标示出我们真正关心的列表的属性。下面举两个更好的例子。</p><pre><code>-- file: ch04/EfficientList.hs
mySmartExample xs = if not (null xs)
                    then head xs
                    else &#39;Z&#39;

myOtherExample (x:_) = x
myOtherExample [] = &#39;Z&#39;
</code></pre><h3 id="部分函数和全函数" tabindex="-1"><a class="header-anchor" href="#部分函数和全函数" aria-hidden="true">#</a> 部分函数和全函数</h3><p>如果一个函数只为合法输入的一个子集定义了返回值（函数返回的调用过程中产生的错误不属于返回值），这样的函数称作 <em>部分函数</em>（partial function）。类似的，对于整个输入域都能返回一个合法结果的函数，我们称之为 <em>全函数</em>（total function）。[译注：全函数是部分函数的特殊形式]</p><p>你应当了解你正在调用的函数是否为部分函数。对于部分函数而言，传入一个其无法处理的参数将导致错误，这也是Haskell程序能够简单明了避免错误的最主要的原因。[译注：为部分函数提供一个全函数的版本可能会导致问题处理层次的上浮，例如head函数在参数为空列表时抛出错误，如果我们定义safeHead函数对于空列表同样返回空列表，那么对于head函数所处的上一级函数，必须判断head函数返回的结果究竟是一个列表还是列表中的元素。]</p><p>有些使用Haskell的程序员会为部分函数加上unsafe的前缀，防止某些时候避免搬起石头砸自己的脚。标准的 <code>prelude</code> 定义了许多&quot;不安全&quot;的部分函数（例如head），却没有提供等价的&quot;安全&quot;的全函数，这可以说是标准 <code>prelude</code> 的不足。[译注：此处存在争议，有人认为&quot;不安全&quot;的前缀指的是该函数可能会突破类型系统的限制，比如 unsafePerformIO，unsafeCoerce 等，它们可能会导致程序完全不可预知的行为，这与在空列表上调用head有很大的区别]</p><h3 id="更多简单列表操作" tabindex="-1"><a class="header-anchor" href="#更多简单列表操作" aria-hidden="true">#</a> 更多简单列表操作</h3><p>Haskell用(++)表示&quot;追加&quot;函数。</p><pre><code>ghci&gt; :type (++)
(++) :: [a] -&gt; [a] -&gt; [a]
ghci&gt; &quot;foo&quot; ++ &quot;bar&quot;
&quot;foobar&quot;
ghci&gt; [] ++ [1,2,3]
[1,2,3]
ghci&gt; [True] ++ []
[True]
</code></pre><p>concat函数取一个包含列表的列表，这些列表中的元素具有相同的类型，它把这些列表连接在一起成为一个单一的列表。</p><pre><code>ghci&gt; :type concat
concat :: [[a]] -&gt; [a]
ghci&gt; concat [[1,2,3], [4,5,6]]
[1,2,3,4,5,6]
</code></pre><p>它会去掉一级的嵌套。（译注：每次调用concat会去除最外一层的方括号）</p><pre><code>ghci&gt; concat [[[1,2],[3]], [[4],[5],[6]]]
[[1,2],[3],[4],[5],[6]]
ghci&gt; concat (concat [[[1,2],[3]], [[4],[5],[6]]])
[1,2,3,4,5,6]
</code></pre><p>reverse函数返回一个元素以相反的顺序排列的新列表。</p><pre><code>ghci&gt; :type reverse
reverse :: [a] -&gt; [a]
ghci&gt; reverse &quot;foo&quot;
&quot;oof&quot;
</code></pre><p>针对包含Bool值的列表，and和or函数相当于用&amp;&amp;和||遍历这个列表并两两求值</p><pre><code>ghci&gt; :type and
and :: [Bool] -&gt; Bool
ghci&gt; and [True,False,True]
False
ghci&gt; and []
True
ghci&gt; :type or
or :: [Bool] -&gt; Bool
ghci&gt; or [False,False,False,True,False]
True
ghci&gt; or []
False
</code></pre><p>还有两个与and和or功能近似的函数，all和any，它们操作任何类型的列表。每一个带着一个谓词作为它的第一个参数；如果谓词对列表中的每个元素的判断都为真，all函数返回True，当对列表中的每个元素的谓词至少有一个成功了，any函数返回True。</p><pre><code>ghci&gt; :type all
all :: (a -&gt; Bool) -&gt; [a] -&gt; Bool
ghci&gt; all odd [1,3,5]
True
ghci&gt; all odd [3,1,4,1,5,9,2,6,5]
False
ghci&gt; all odd []
True
ghci&gt; :type any
any :: (a -&gt; Bool) -&gt; [a] -&gt; Bool
ghci&gt; any even [3,1,4,1,5,9,2,6,5]
True
ghci&gt; any even []
False
</code></pre><h3 id="产生子列表" tabindex="-1"><a class="header-anchor" href="#产生子列表" aria-hidden="true">#</a> 产生子列表</h3><p>take函数，在&quot;函数应用&quot;一节遇到过，返回一个由头k个元素组成的子列表。与它相反，drop，丢掉列表开头的k个元素。</p><pre><code>ghci&gt; :type take
take :: Int -&gt; [a] -&gt; [a]
ghci&gt; take 3 &quot;foobar&quot;
&quot;foo&quot;
ghci&gt; take 2 [1]
[1]
ghci&gt; :type drop
drop :: Int -&gt; [a] -&gt; [a]
ghci&gt; drop 3 &quot;xyzzy&quot;
&quot;zy&quot;
ghci&gt; drop 1 []
[]
</code></pre><p>splitAt函数组合了take和drop的功能，返回由一个列表产生的二元组，两部分是由原来的列表根据给定的索引分割而成。</p><pre><code>ghci&gt; :type splitAt
splitAt :: Int -&gt; [a] -&gt; ([a], [a])
ghci&gt; splitAt 3 &quot;foobar&quot;
(&quot;foo&quot;,&quot;bar&quot;)
</code></pre><p>takeWhile和dropWhile函数带着谓词：takeWhile从开头遍历一个列表，抽取使谓词返回True的元素组成一个新列表；dropWhile则是把使谓词返回True的元素丢掉。（译注：这里的表述容易引起歧义，实际上两个函数都是走到第一个使谓词返回False的元素处就停止操作了，即使这个元素后面还有使谓词返回True的元素，两个函数也不再take或drop了）</p><pre><code>ghci&gt; :type takeWhile
takeWhile :: (a -&gt; Bool) -&gt; [a] -&gt; [a]
ghci&gt; takeWhile odd [1,3,5,6,8,9,11]
[1,3,5]
ghci&gt; :type dropWhile
dropWhile :: (a -&gt; Bool) -&gt; [a] -&gt; [a]
ghci&gt; dropWhile even [2,4,6,7,9,10,12]
[7,9,10,12]
</code></pre><p>正如splitAt函数利用take和drop的结果组成一个二元组一样，break（已经在&quot;热身：方便地分离多行文本&quot;一节中看到过）和span函数利用takeWhile和dropWhile的结果组成二元组。</p><p>每个函数带着一个谓词，break提取列表中使谓词失败的元素组成二元组的首项，而span提取列表中使谓词成功的元素组成二元组的首项。</p><pre><code>ghci&gt; :type span
span :: (a -&gt; Bool) -&gt; [a] -&gt; ([a], [a])
ghci&gt; span even [2,4,6,7,9,10,11]
([2,4,6],[7,9,10,11])
ghci&gt; :type break
break :: (a -&gt; Bool) -&gt; [a] -&gt; ([a], [a])
ghci&gt; break even [1,3,5,6,8,9,10]
([1,3,5],[6,8,9,10])
</code></pre><h3 id="搜索列表" tabindex="-1"><a class="header-anchor" href="#搜索列表" aria-hidden="true">#</a> 搜索列表</h3><p>正如我们已经看到的，elem函数标示一个值是否出现在一个列表中。它有一个伴生的函数，notElem。</p><pre><code>ghci&gt; :type elem
elem :: (Eq a) =&gt; a -&gt; [a] -&gt; Bool
ghci&gt; 2 \`elem\` [5,3,2,1,1]
True
ghci&gt; 2 \`notElem\` [5,3,2,1,1]
False
</code></pre><p>对于更普遍的搜索操作，filter函数带着一个谓词，返回列表中使谓词成功的每一个元素。</p><pre><code>ghci&gt; :type filter
filter :: (a -&gt; Bool) -&gt; [a] -&gt; [a]
ghci&gt; filter odd [2,4,1,3,6,8,5,7]
[1,3,5,7]
</code></pre><p>在Data.List模块中，有三个谓词方法，isPrefixOf、isInfixOf和isSuffixOf，能让我们测试一下子列表在一个更大的列表中出现的位置。最容易的方式是把它们作为中缀使用。</p><p>isPrefixOf函数告诉我们左边的列表是否出现在右边的列表的开始处。</p><pre><code>ghci&gt; :module +Data.List
ghci&gt; :type isPrefixOf
isPrefixOf :: (Eq a) =&gt; [a] -&gt; [a] -&gt; Bool
ghci&gt; &quot;foo&quot; \`isPrefixOf\` &quot;foobar&quot;
True
ghci&gt; [1,2] \`isPrefixOf\` []
False
</code></pre><p>isInfixOf函数标示左边的列表是否是右边的列表的一个子列表。</p><pre><code>ghci&gt; :module +Data.List
ghci&gt; [2,6] \`isInfixOf\` [3,1,4,1,5,9,2,6,5,3,5,8,9,7,9]
True
ghci&gt; &quot;funk&quot; \`isInfixOf\` &quot;sonic youth&quot;
False
</code></pre><p>isSuffixOf函数的功能不再赘述。</p><pre><code>ghci&gt; :module +Data.List
ghci&gt; &quot;.c&quot; \`isSuffixOf\` &quot;crashme.c&quot;
True
</code></pre><h3 id="一次性处理多个列表" tabindex="-1"><a class="header-anchor" href="#一次性处理多个列表" aria-hidden="true">#</a> 一次性处理多个列表</h3><p>zip函数把两个列表压缩成一个单一的由二元组组成的列表。结果列表和被处理的两个列表中较短的那个等长。（译注：言下之意是较长的那个列表中的多出来的元素会被丢弃）</p><pre><code>ghci&gt; :type zip
zip :: [a] -&gt; [b] -&gt; [(a, b)]
ghci&gt; zip [12,72,93] &quot;zippity&quot;
[(12,&#39;z&#39;),(72,&#39;i&#39;),(93,&#39;p&#39;)]
</code></pre><p>更有用的是zipWith函数，它带两个列表作为参数并为从每个列表中抽取一个元素而组成的二元组提供一个函数，最后生成与较短的那个列表等长的新列表。</p><pre><code>ghci&gt; :type zipWith
zipWith :: (a -&gt; b -&gt; c) -&gt; [a] -&gt; [b] -&gt; [c]
ghci&gt; zipWith (+) [1,2,3] [4,5,6]
[5,7,9]
</code></pre><p>Haskell的类型系统使编写带有可变数量的参数的函数成为一个有趣的挑战。（译注：不知道此句和后面的内容有什么联系）。所以如果想把三个列表压缩在一起，要调用zip3或者zipWith3，可以类推到zip7和zipWith7。</p><h3 id="特殊的字符串处理函数" tabindex="-1"><a class="header-anchor" href="#特殊的字符串处理函数" aria-hidden="true">#</a> 特殊的字符串处理函数</h3><p>我们已经在&quot;热身：方便地分离多行文本&quot;一节中遇到过lines函数，它有个对应的函数，unlines。注意unlines总是在它处理的结果（译注：列表中的每个元素）的尾部放一个换行符。</p><pre><code>ghci&gt; lines &quot;foo\\nbar&quot;
[&quot;foo&quot;,&quot;bar&quot;]
ghci&gt; unlines [&quot;foo&quot;, &quot;bar&quot;]
&quot;foo\\nbar\\n&quot;
</code></pre><p>words函数利用任何空白字符分割一个字符串，它对应的函数，unwords，用一个空格字符把一个字符串构成的列表连接起来。</p><pre><code>ghci&gt; words &quot;the  \\r  quick \\t  brown\\n\\n\\nfox&quot;
[&quot;the&quot;,&quot;quick&quot;,&quot;brown&quot;,&quot;fox&quot;]
ghci&gt; unwords [&quot;jumps&quot;, &quot;over&quot;, &quot;the&quot;, &quot;lazy&quot;, &quot;dog&quot;]
&quot;jumps over the lazy dog&quot;
</code></pre><h3 id="练习题" tabindex="-1"><a class="header-anchor" href="#练习题" aria-hidden="true">#</a> 练习题</h3><ol><li>自己写一些安全的列表函数，确保它们不会出错。下面给一些类型定义的提示。</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;!-- --&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><pre><code>-- file: ch04/ch04.exercises.hs
safeHead :: [a] -&gt; Maybe a
safeTail :: [a] -&gt; Maybe [a]
safeLast :: [a] -&gt; Maybe a
safeInit :: [a] -&gt; Maybe [a]
</code></pre><ol start="2"><li>写一个和words功能近似的函数splitWith，要求带一个谓词和一个任意类型元素组成的列表，在使谓词返回False的元素处分割这个列表。</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;!-- --&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><pre><code>-- file: ch04/ch04.exercises.hs
splitWith :: (a -&gt; Bool) -&gt; [a] -&gt; [[a]]
</code></pre><ol start="3"><li>利用在&quot;一个简单的命令行框架&quot;一节中创建的命令行框架，编写一个打印输入数据的每一行的第一个单词的程序。</li><li>编写一个转置一个文件中的文本的程序。比如，它应该把&quot;hello\\nworld\\n&quot;转换成&quot;hw\\neo\\nlr\\nll\\nod\\n&quot;。</li></ol><h2 id="循环的表示" tabindex="-1"><a class="header-anchor" href="#循环的表示" aria-hidden="true">#</a> 循环的表示</h2><p>和传统编程语言不同， Haskell 既没有 <code>for</code> 循环，也没有 <code>while</code> 循环。那么，如果有一大堆数据要处理，该用什么代替这些循环呢？这一节就会给出这个问题的几种可能的解决办法。</p><h3 id="显式递归" tabindex="-1"><a class="header-anchor" href="#显式递归" aria-hidden="true">#</a> 显式递归</h3><p>通过例子进行比对，可以很直观地认识有 loop 语言和没 loop 语言之间的区别。以下是一个 C 函数，它将字符串表示的数字转换成整数：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">int</span> <span class="token function">as_int</span><span class="token punctuation">(</span><span class="token keyword">char</span> <span class="token operator">*</span>str<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token keyword">int</span> acc<span class="token punctuation">;</span> <span class="token comment">// accumulate the partial result</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span>acc <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> <span class="token function">isdigit</span><span class="token punctuation">(</span><span class="token operator">*</span>str<span class="token punctuation">)</span><span class="token punctuation">;</span> str<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        acc <span class="token operator">=</span> acc <span class="token operator">*</span> <span class="token number">10</span> <span class="token operator">+</span> <span class="token punctuation">(</span><span class="token operator">*</span>str <span class="token operator">-</span><span class="token char">&#39;0&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

<span class="token keyword">return</span> acc<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>既然 Haskell 没有 loop 的话，以上这段 C 语言代码，在 Haskell 里该怎么表达呢？</p><p>让我们先从类型签名开始写起，这不是必须的，但它对于弄清楚代码在干什么很有帮助：</p><pre><code>-- file: ch04/IntParse.hs
import Data.Char (digitToInt) -- we&#39;ll need ord shortly

asInt :: String -&gt; Int
</code></pre><p>C 代码在遍历字符串的过程中，渐增地计算结果。Haskell 代码同样可以做到这一点，而且，在 Haskell 里，使用函数已经足以表示 loop 计算了。[译注：在命令式语言里，很多迭代计算都是通过特殊关键字来实现的，比如 <code>do</code> 、 <code>while</code> 和 <code>for</code> 。]</p><pre><code>-- file: ch04/IntParse.hs
loop :: Int -&gt; String -&gt; Int

asInt xs = loop 0 xs
</code></pre><p><code>loop</code> 的第一个参数是累积器的变量，给它赋值 <code>0</code> 等同于 C 语言在 <code>for</code> 循环开始前的初始化操作。</p><p>在研究详细的代码前，先来思考一下我们要处理的数据：输入 <code>xs</code> 是一个包含数字的字符串，而 <code>String</code> 类型不过是 <code>[Char]</code> 的别名，一个包含字符的列表。因此，要遍历处理字符串，最好的方法是将它看作是列表来处理：它要么就是一个空字符串；要么就是一个字符，后面跟着列表的其余部分。</p><p>以上的想法可以通过对列表的构造器进行模式匹配来表达。先从最简单的情况 ------ 输入为空字符串开始：</p><pre><code>-- file: ch04/IntParse.hs
loop acc [] = acc
</code></pre><p>一个空列表并不仅仅意味着&quot;输入列表为空&quot;，另一种可能的情况是，对一个非空字符串进行遍历之后，最终到达了列表的末尾。因此，对于空列表，我们不是抛出错误，而是将累积值返回。</p><p>另一个等式处理列表不为空的情况：先取出并处理列表的当前元素，接着处理列表的其他元素。</p><pre><code>-- file: ch04/IntParse.hs
loop acc (x:xs) = let acc&#39; = acc * 10 + digitToInt x
                  in loop acc&#39; xs
</code></pre><p>程序先计算出当前字符所代表的数值，将它赋值给局部变量 <code>acc&#39;</code> 。然后使用 <code>acc&#39;</code> 和剩余列表的元素 <code>xs</code> 作为参数，再次调用 <code>loop</code> 函数。这种调用等同于在 C 代码中再次执行一次循环。</p><p>每次递归调用 <code>loop</code> ，累积器的值都会被更新，并处理掉列表里的一个元素。这样一直下去，最终输入列表为空，递归调用结束。</p><p>以下是 <code>IntParse</code> 函数的完整定义：</p><p>::: literalinclude /code/ch04/IntParse.hs :::</p><p>[译注：书本原来的代码少了对 <code>Data.Char</code> 的引用，会造成 <code>digitToInt</code> 查找失败。]</p><p>在 ghci 里看看程序的表现如何：</p><pre><code>Prelude&gt; :load IntParse.hs
[1 of 1] Compiling Main             ( IntParse.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; asInt &quot;33&quot;
33
</code></pre><p>在处理字符串表示的字符时，它运行得很好。不过，如果传给它一些不合法的输入，这个可怜的函数就没办法处理了：</p><pre><code>*Main&gt; asInt &quot;&quot;
0
*Main&gt; asInt &quot;potato&quot;
*** Exception: Char.digitToInt: not a digit &#39;p&#39;
</code></pre><p>在练习一，我们会想办法解决这个问题。</p><p><code>loop</code> 函数是尾递归函数的一个例子：如果输入非空，这个函数做的最后一件事，就是递归地调用自身。这个代码还展示了另一个惯用法：通过研究列表的结构，分别处理空列表和非空列表两种状况，这种方法称之为<em>结构递归</em>（structural recursion）。</p><p>非递归情形（列表为空）被称为&quot;基本情形&quot;（有时也叫终止情形）。当对函数进行递归调用时，计算最终会回到基本情形上。在数学上，这也称为&quot;归纳情形&quot;。</p><p>作为一项有用的技术，结构递归并不仅仅局限于列表，它也适用于其他代数数据类型，稍后就会介绍更多这方面的例子。</p><h3 id="对列表元素进行转换" tabindex="-1"><a class="header-anchor" href="#对列表元素进行转换" aria-hidden="true">#</a> 对列表元素进行转换</h3><p>考虑以下 C 函数， <code>square</code> ，它对数组中的所有元素执行平方计算：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">void</span> <span class="token function">square</span><span class="token punctuation">(</span><span class="token keyword">double</span> <span class="token operator">*</span>out<span class="token punctuation">,</span> <span class="token keyword">const</span> <span class="token keyword">double</span> <span class="token operator">*</span>in<span class="token punctuation">,</span> <span class="token class-name">size_t</span> length<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">size_t</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        out<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> in<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">*</span> in<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码展示了一个直观且常见的 loop 动作，它对输入数组中的所有元素执行同样的动作。以下是 Haskell 版本的 <code>square</code> 函数：</p><p>::: literalinclude /code/ch04/square.hs :::</p><p><code>square</code> 函数包含两个模式匹配等式。第一个模式解构一个列表，取出它的 <code>head</code> 部分和 <code>tail</code> 部分，并对第一个元素进行加倍操作，然后将计算所得的新元素放进列表里面。一直这样做下去，直到处理完整个列表为止。第二个等式确保计算会在列表为空时顺利终止。</p><p><code>square</code> 产生一个和输入列表一样长的新列表，其中每个新元素的值都是原本元素的平方：</p><pre><code>Prelude&gt; :load square.hs
[1 of 1] Compiling Main             ( square.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; let one_to_ten = [1.0 .. 10.0]

*Main&gt; square one_to_ten
[1.0,4.0,9.0,16.0,25.0,36.0,49.0,64.0,81.0,100.0]
</code></pre><p>以下是另一个 C 循环，它将字符串中的所有字母都设置为大写：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;ctype.h&gt;</span></span>

<span class="token keyword">char</span> <span class="token operator">*</span><span class="token function">uppercase</span><span class="token punctuation">(</span><span class="token keyword">const</span> <span class="token keyword">char</span> <span class="token operator">*</span>in<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token keyword">char</span> <span class="token operator">*</span>out <span class="token operator">=</span> <span class="token function">strdup</span><span class="token punctuation">(</span>in<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>out <span class="token operator">!=</span> <span class="token constant">NULL</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">size_t</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> out<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">!=</span> <span class="token char">&#39;\\0&#39;</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            out<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">toupper</span><span class="token punctuation">(</span>out<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">return</span> out<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以下是相等的 Haskell 版本：</p><p>::: literalinclude /code/ch04/upperCase.hs :::</p><p>代码从 <code>Data.Char</code> 模块引入了 <code>toUpper</code> 函数，如果输入字符是一个字母的话，那么函数就将它转换成大写：</p><pre><code>Prelude&gt; :module +Data.Char

Prelude Data.Char&gt; toUpper &#39;a&#39;
&#39;A&#39;

Prelude Data.Char&gt; toUpper &#39;A&#39;
&#39;A&#39;

Prelude Data.Char&gt; toUpper &#39;1&#39;
&#39;1&#39;

Prelude Data.Char&gt; toUpper &#39;*&#39;
&#39;*&#39;
</code></pre><p><code>upperCase</code> 函数和之前的 <code>square</code> 函数很相似：如果输入是一个空列表，那么它就停止计算，返回一个空列表。另一方面，如果输入不为空，那么它就对列表的第一个元素调用 <code>toUpper</code> 函数，并且递归调用自身，继续处理剩余的列表元素：</p><pre><code>Prelude&gt; :load upperCase.hs
[1 of 1] Compiling Main             ( upperCase.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; upperCase &quot;The quick brown fox jumps over the lazy dog&quot;
&quot;THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG&quot;
</code></pre><p>以上两个函数遵循了同一种处理列表的公共模式：基本情形处理（base case）空列表输入。而<em>递归情形</em>（recursive case）则处理列表非空时的情况，它对列表的头元素进行某种操作，然后递归地处理列表余下的其他元素。</p><h3 id="列表映射" tabindex="-1"><a class="header-anchor" href="#列表映射" aria-hidden="true">#</a> 列表映射</h3><p>前面定义的 <code>square</code> 和 <code>upperCase</code> 函数，都生成一个和输入列表同等长度的新列表，并且每次只对列表的一个元素进行处理。因为这种用法非常常见，所以 Haskell 的 <code>Prelude</code> 库定义了 <code>map</code> 函数来更方便地执行这种操作。 <code>map</code> 函数接受一个函数和一个列表作为参数，将输入函数应用到输入列表的每个元素上，并构建出一个新的列表。</p><p>以下是使用 <code>map</code> 重写的 <code>square</code> 和 <code>upperCase</code> 函数：</p><p>::: literalinclude /code/ch04/rewrite_by_map.hs :::</p><p>[译注：原文代码没有载入 <code>Data.Char</code> 中的 <code>toUpper</code> 函数。]</p><p>来研究一下 <code>map</code> 是如何实现的。通过查看它的类型签名，可以发现很多有意思的信息：</p><pre><code>Prelude&gt; :type map
map :: (a -&gt; b) -&gt; [a] -&gt; [b]
</code></pre><p>类型签名显示， <code>map</code> 接受两个参数：第一个参数是一个函数，这个函数接受一个 <code>a</code> 类型的值，并返回一个 <code>b</code> 类型的值[译注：这里只是说 <code>a</code> 和 <code>b</code> 类型可能不一样，但不是必须的。]。</p><p>像 <code>map</code> 这种接受一个函数作为参数、又或者返回一个函数作为结果的函数，被称为<em>高阶</em>函数。</p><p>因为 <code>map</code> 的抽象出现在 <code>square</code> 和 <code>upperCase</code> 函数，所以可以通过观察这两个函数，找出它们之间的共同点，然后实现自己的 <code>map</code> 函数：</p><p>::: literalinclude /code/ch04/myMap.hs :::</p><p>[译注：在原文的代码里，第二个等式的定义为 <code>myMap _ _ = []</code> ，这并不是完全正确的，因为它可以适配于第二个参数不为列表的情况，比如 <code>myMap f 1</code> 。因此，这里遵循标准库里 <code>map</code> 的定义，将第二个等式修改为 <code>myMap _ [] = []</code> 。]</p><p>在 ghci 测试这个 <code>myMap</code> 函数：</p><pre><code>Prelude&gt; :load myMap.hs
[1 of 1] Compiling Main             ( myMap.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; :module +Data.Char

*Main Data.Char&gt; myMap toUpper &quot;The quick brown fox&quot;
&quot;THE QUICK BROWN FOX&quot;
</code></pre><p>通过观察代码，并从中提炼出重复的抽象，是复用代码的一种良好方法。尽管对代码进行抽象并不是 Haskell 的&quot;专利&quot;，但高阶函数使得这种抽象变得非常容易。</p><h3 id="筛选列表元素" tabindex="-1"><a class="header-anchor" href="#筛选列表元素" aria-hidden="true">#</a> 筛选列表元素</h3><p>另一种对列表的常见操作是，对列表元素进行筛选，只保留那些符合条件的元素。</p><p>以下函数接受一个列表作为参数，并返回这个列表里的所有奇数元素。代码的递归情形比之前的 <code>map</code> 函数要复杂一些，它使用守卫对元素进行条件判断，只有符合条件的元素，才会被加入进结果列表里：</p><p>::: literalinclude /code/ch04/oddList.hs :::</p><p>[译注：这里将原文代码的 <code>oddList _ = []</code> 改为 <code>oddList [] = []</code> ，原因和上一小节修改 <code>map</code> 函数的代码一样。]</p><p>测试：</p><pre><code>Prelude&gt; :load oddList.hs
[1 of 1] Compiling Main             ( oddList.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; oddList [1 .. 10]
[1,3,5,7,9]
</code></pre><p>因为这种过滤模式也很常见，所以 <code>Prelude</code> 也定义了相应的函数 <code>filter</code> ：它接受一个谓词函数，并将它应用到列表里的每个元素，只有那些谓词函数求值返回 <code>True</code> 的元素才会被保留：</p><pre><code>Prelude&gt; :type odd
odd :: Integral a =&gt; a -&gt; Bool

Prelude&gt; odd 1
True

Prelude&gt; odd 2
False

Prelude&gt; :type filter
filter :: (a -&gt; Bool) -&gt; [a] -&gt; [a]

Prelude&gt; filter odd [1 .. 10]
[1,3,5,7,9]
</code></pre><p>[译注：谓词函数是指那种返回 <code>Bool</code> 类型值的函数。]</p><p>稍后的章节会介绍如何定义 <code>filter</code> 。</p><h3 id="处理集合并得出结果" tabindex="-1"><a class="header-anchor" href="#处理集合并得出结果" aria-hidden="true">#</a> 处理集合并得出结果</h3><p>将一个集合（collection）缩减（reduce）为一个值也是集合的常见操作之一。</p><p>对列表的所有元素求和，就是其中的一个例子：</p><p>::: literalinclude /code/ch04/mySum.hs :::</p><p><code>helper</code> 函数通过尾递归进行计算。 <code>acc</code> 是累积器（accumulator）参数，它记录了当前列表元素的总和。正如我们在 <code>asInt</code> 函数看到的那样，这种递归计算是纯函数语言里表示 loop 最自然的方式。</p><p>以下是一个稍微复杂一些的例子，它是一个 Adler-32 校验和的 JAVA 实现。Adler-32 是一个流行的校验和算法，它将两个 16 位校验和串联成一个 32 位校验和。第一个校验和是所有输入比特之和，加上一。而第二个校验和则是第一个校验和所有中间值之和。每次计算时，校验和都需要取模 <code>65521</code> 。（如果你不懂 JAVA ，直接跳过也没关系）：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Adler32</span>
<span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> base <span class="token operator">=</span> <span class="token number">65521</span><span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">int</span> <span class="token function">compute</span><span class="token punctuation">(</span><span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> data<span class="token punctuation">,</span> <span class="token keyword">int</span> offset<span class="token punctuation">,</span> <span class="token keyword">int</span> length<span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token keyword">int</span> a <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">,</span> b <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> offset<span class="token punctuation">;</span> i <span class="token operator">&lt;</span> offset <span class="token operator">+</span> length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            a <span class="token operator">=</span> <span class="token punctuation">(</span>a <span class="token operator">+</span> <span class="token punctuation">(</span>data<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">&amp;</span> oxff<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">%</span> base
            b <span class="token operator">=</span> <span class="token punctuation">(</span>a <span class="token operator">+</span> b<span class="token punctuation">)</span> <span class="token operator">%</span> base<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">return</span> <span class="token punctuation">(</span>b <span class="token operator">&lt;&lt;</span> <span class="token number">16</span><span class="token punctuation">)</span> <span class="token operator">|</span> a<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>尽管 Adler-32 是一个简单的校验和算法，但这个 JAVA 实现还是非常复杂，很难看清楚位操作之间的关系。</p><p>以下是 Adler-32 算法的 Haskell 实现：</p><p>::: literalinclude /code/ch04/Adler32.hs :::</p><p>在这段代码里， <code>shiftL</code> 函数实现逻辑左移， <code>(.&amp;.)</code> 实现二进制位的并操作， <code>(.|.)</code> 实现二进制位的或操作， <code>ord</code> 函数则返回给定字符对应的编码值。</p><p><code>helper</code> 函数通过尾递归来进行计算，每次对它的调用，都产生新的累积变量，效果等同于 JAVA 在 <code>for</code> 循环里对变量的赋值更新。当列表处理完毕，递归终止时，程序计算出校验和并将它返回。</p><p>和前面抽取出 <code>map</code> 和 <code>filter</code> 函数类似，从 <code>Adler32</code> 函数里面，我们也可以抽取出一种通用的抽象，称之为折叠（fold）：它对一个列表中的所有元素做某种处理，并且一边处理元素，一边更新累积器，最后在处理完整个列表之后，返回累积器的值。</p><p>有两种不同类型的折叠，其中 <code>foldl</code> 从左边开始进行折叠，而 <code>foldr</code> 从右边开始进行折叠。</p><h3 id="左折叠" tabindex="-1"><a class="header-anchor" href="#左折叠" aria-hidden="true">#</a> 左折叠</h3><p>以下是 <code>foldl</code> 函数的定义：</p><p>::: literalinclude /code/ch04/foldl.hs :::</p><p>[译注：这个函数在载入 ghci 时会因为命名冲突而被拒绝，编写函数直接使用内置的 <code>foldl</code> 就可以了。]</p><p><code>foldl</code> 函数接受一个步骤（step）函数，一个累积器的初始化值，以及一个列表作为参数。步骤函数每次使用累积器和列表中的一个元素作为参数，并计算出新的累积器值，这个过程称为步进（stepper）。然后，将新的累积器作为参数，再次进行同样的计算，直到整个列表处理完为止。</p><p>以下是使用 <code>foldl</code> 重写的 <code>mySum</code> 函数：</p><p>::: literalinclude /code/ch04/foldlSum.hs :::</p><p>因为代码里的 <code>step</code> 函数执行的操作不过是相加起它的两个输入参数，因此，可以直接将一个加法函数代替 <code>step</code> 函数，并移除多余的 <code>where</code> 语句：</p><p>::: literalinclude /code/ch04/niceSum.hs :::</p><p>为了进一步看清楚 <code>foldl</code> 的执行模式，以下代码展示了 <code>niceSum [1, 2, 3]</code> 执行时的计算过程：</p><pre><code>niceSum [1, 2, 3]
    == foldl (+) 0                   (1:2:3:[])
    == foldl (+) (0 + 1)             (2:3:[])
    == foldl (+) ((0 + 1) + 2)       (3:[])
    == foldl (+) (((0 + 1) + 2) + 3) []
    == (((0 + 1) + 2) + 3)
</code></pre><p>注意对比新的 <code>mySum</code> 定义比刚开始的定义节省了多少代码：新版本没有使用显式递归，因为 <code>foldl</code> 可以代替我们搞定了关于循环的一切。现在程序只要求我们回答两个问题：第一，累积器的初始化值是什么（<code>foldl</code> 的第二个参数）；第二，怎么更新累积器的值（<code>(+)</code> 函数）。</p><h3 id="为什么使用-fold-、-map-和-filter" tabindex="-1"><a class="header-anchor" href="#为什么使用-fold-、-map-和-filter" aria-hidden="true">#</a> 为什么使用 <code>fold</code> 、 <code>map</code> 和 <code>filter</code> ？</h3><p>回顾一下之前的几个例子，可以看出，使用 <code>fold</code> 和 <code>map</code> 等高阶函数定义的函数，比起显式使用递归的函数，并不总是能节约大量代码。那么，我们为什么要使用这些函数呢？</p><p>答案是，因为它们在 Haskell 中非常通用，并且这些函数都带有正确的、可预见的行为。</p><p>这意味着，即使是一个 Haskell 新手，他/她理解起 <code>fold</code> 通常都要比理解显式递归要容易。一个 <code>fold</code> 并不产生任何意外动作，但一个显式递归函数的所做作为，通常并不是那么显而易见的。</p><p>以上观点同样适用于其他高阶函数库，包括前面介绍过的 <code>map</code> 和 <code>filter</code> 。因为这些函数都带有定义良好的行为，我们只需要学习怎样使用这些函数一次，以后每次碰到使用这些函数的代码，这些知识都可以加快我们对代码的理解。这种优势同样体现在代码的编写上：一旦我们能熟练使用高阶函数，那么写出更简洁的代码自然就不在话下。</p><h3 id="从右边开始折叠" tabindex="-1"><a class="header-anchor" href="#从右边开始折叠" aria-hidden="true">#</a> 从右边开始折叠</h3><p>和 <code>foldl</code> 相对应的是 <code>foldr</code> ，它从一个列表的右边开始进行折叠。</p><p>::: literalinclude /code/ch04/foldr.hs :::</p><p>[译注：这个函数在载入 ghci 时会因为命名冲突而被拒绝，编写函数直接使用内置的 <code>foldr</code> 就可以了。]</p><p>可以用 <code>foldr</code> 改写在《左折叠》一节定义的 <code>niceSum</code> 函数：</p><p>::: literalinclude /code/ch04/niceSumFoldr.hs :::</p><p>这个 <code>niceSumFoldr</code> 函数在输入为 <code>[1, 2, 3]</code> 时，产生以下计算序列：</p><pre><code>niceSumFoldr [1, 2, 3]
    == foldr (+) 0 (1:2:3:[])
    == 1 +           foldr (+) 0 (2:3:[])
    == 1 + (2 +      foldr (+) 0 (3:[]))
    == 1 + (2 + (3 + foldr (+) 0 []))
    == 1 + (2 + (3 + 0))
</code></pre><p>可以通过观察括号的包围方式，以及累积器初始化值摆放的位置，来区分 <code>foldl</code> 和 <code>foldr</code> ：<code>foldl</code> 将处初始化值放在左边，括号也是从左边开始包围。另一方面，<code>foldr</code> 将初始化值放在右边，而括号也是从右边开始包围。</p><p>这里有一种可爱的凭直觉性的关于foldr如何工作的解释: 他用zero初始值替代了空列表，并且调用step函数替代列表的每个值构造器．</p><pre><code>1 : (2 : (3 : []))
1 + (2 + (3 + 0 ))
</code></pre><p>乍一看,比起foldl，foldr似乎不那么有用：一个从右边折叠的函数有什么用呢？ 还记得当年大明湖畔的 <code>filter</code> 函数吗？它可以用显式递归来定义：</p><p>::: literalinclude /code/ch04/filter.hs :::</p><p>[译注：这个函数在载入 ghci 时会因为命名冲突而被拒绝，编写函数直接使用内置的 <code>filter</code> 就可以了。]</p><p>除此之外， <code>filter</code> 还可以通过 <code>foldr</code> 来定义：</p><p>::: literalinclude /code/ch04/myFilter.hs :::</p><p>来仔细分析一下 <code>myFilter</code> 函数的定义：和 <code>foldl</code> 一样， <code>foldr</code> 也接受一个函数、一个基本情形和一个列表作为参数。通过阅读 <code>filter</code> 函数的类型签名可以得知， <code>myFilter</code> 函数的输入和输出都使用同类型的列表，因此函数的基本情形，以及局部函数 <code>step</code> ，都必须返回这个类型的列表。</p><p><code>myFilter</code> 里的 <code>foldr</code> 每次取出列表中的一个元素，并对他进行处理，如果这个元素经过条件判断为 <code>True</code> ，那么就将它放进累积的新列表里面，否则，它就略过这个元素，继续处理列表的其他剩余元素。</p><p>所有可以用 <code>foldr</code> 定义的函数，统称为<em>主递归</em>（primitive recursive）。很大一部分列表处理函数都是主递归函数。比如说， <code>map</code> 就可以用 <code>foldr</code> 定义：</p><p>::: literalinclude /code/ch04/myFoldrMap.hs :::</p><p>更让人惊奇的是， <code>foldl</code> 甚至可以用 <code>foldr</code> 来表示：</p><p>::: literalinclude /code/ch04/myFoldl.hs :::</p><p>一种思考 <code>foldr</code> 的方式是，将它看成是对输入列表的一种<em>转换</em>（transform）：它的第一个参数决定了该怎么处理列表的 <code>head</code> 和 <code>tail</code> 部分；而它的第二个参数则决定了，当遇到空列表时，该用什么值来代替这个空列表。</p><p>用 <code>foldr</code> 定义的恒等（identity）转换，在列表为空时，返回空列表本身；如果列表不为空，那么它就将列表构造器 <code>(:)</code> 应用于每个 <code>head</code> 和 <code>tail</code> 对（pair）：</p><p>::: literalinclude /code/ch04/identity.hs :::</p><p>最终产生的结果列表和原输入列表一模一样：</p><pre><code>Prelude&gt; :load identity.hs
[1 of 1] Compiling Main             ( identity.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; identity [1, 2, 3]
[1,2,3]
</code></pre><p>如果将 <code>identity</code> 函数定义中，处理空列表时返回的 <code>[]</code> 改为另一个列表，那么我们就得到了列表追加函数 <code>append</code> ：</p><p>::: literalinclude /code/ch04/append.hs :::</p><p>测试：</p><pre><code>Prelude&gt; :load append.hs
[1 of 1] Compiling Main             ( append.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; append &quot;the quick &quot; &quot;fox&quot;
&quot;the quick fox&quot;
</code></pre><p>这个函数的效果等同于 <code>(++)</code> 操作符：</p><pre><code>*Main&gt; &quot;the quick &quot; ++ &quot;fox&quot;
&quot;the quick fox&quot;
</code></pre><p><code>append</code> 函数依然对每个列表元素使用列表构造器，但是，当第一个输入列表为空时，它将第二个输入列表（而不是空列表元素）拼接到第一个输入列表的表尾。</p><p>通过前面这些例子对 <code>foldr</code> 的介绍，我们应该可以了解到， <code>foldr</code> 函数和《列表处理》一节所介绍的基本列表操作函数一样重要。由于 <code>foldr</code> 可以增量地处理和产生列表，所以它对于惰性数据处理也非常有用。</p><h3 id="左折叠、惰性和内存泄漏" tabindex="-1"><a class="header-anchor" href="#左折叠、惰性和内存泄漏" aria-hidden="true">#</a> 左折叠、惰性和内存泄漏</h3><p>为了简化讨论，本节的例子通常都使用 <code>foldl</code> 来进行，这对于普通的测试是没有问题的，但是，千万不要把 <code>foldl</code> 用在实际使用中。</p><p>这样做是因为， Haskell 使用的是非严格求值。如果我们仔细观察 <code>foldl (+) [1, 2, 3]</code> 的执行过程，就可以会从中看出一些问题：</p><pre><code>foldl (+) 0 (1:2:3:[])
          == foldl (+) (0 + 1)             (2:3:[])
          == foldl (+) ((0 + 1) + 2)       (3:[])
          == foldl (+) (((0 + 1) + 2) + 3) []
          ==           (((0 + 1) + 2) + 3)
</code></pre><p>除非被显式地要求，否则最后的表达式不会被求值为 <code>6</code> 。在表达式被求值之前，它会被保存在块里面。保存一个块比保存单独一个数字要昂贵得多，而被块保存的表达式越复杂，这个块占用的空间就越多。对于数值计算这样的廉价操作来说，块保存这种表达式所需的计算量，比直接求值这个表达式所需的计算量还多。最终，我们既浪费了时间，又浪费了金钱。</p><p>在 GHC 中，对块中表达式的求值在一个内部栈中进行。因为块中的表达式可能是无限大的，而 GHC 为栈设置了有限大的的容量，多亏这个限制，我们可以在 ghci 里尝试求值一个大的块，而不必担心消耗掉全部内存。</p><p>[译注：使用栈来执行一些可能无限大的操作，是一种常见优化和保护技术。这种用法减少了操作系统显式的上下文切换，而且就算计算量超出栈可以容纳的范围，那么最坏的结果就是栈崩溃，而如果直接使用系统内存，一旦请求超出内存可以容纳的范围，可能会造成整个程序崩溃，甚至影响系统的稳定性。]</p><pre><code>Prelude&gt; foldl (+) 0 [1..1000]
500500
</code></pre><p>可以推测出，在上面的表达式被求值之前，它创建了一个保存 1000 个数字和 999 个 <code>(+)</code> 操作的块。单单为了表示一个数字，我们就用了非常多的内存和 CPU ！</p><p>[译注：这些块到底有多大？算算就知道了：对于每一个加法表达式，比如 <code>x + y</code> ，都要使用一个块来保存。而这种操作在 <code>foldl (+) 0 [1..1000]</code> 里要执行 999 次，因此一共有 999 个块被创建，这些块都保存着像 <code>x + y</code> 这样的表达式。]</p><p>对于一个更大的表达式 ------ 尽管它并不是真的非常庞大， <code>foldl</code> 的执行会失败：</p><pre><code>ghci&gt; foldl (+) 0 [1..1000000]
*** Exception: stack overflow
</code></pre><p>对于小的表达式来说， <code>foldl</code> 可以给出正确的答案，但是，因为过度的块资源占用，它运行非常缓慢。我们称这种现象为<em>内存泄漏(space leak)</em>：代码可以正确地执行，但它占用了比实际所需多得多的内存。</p><p>对于大的表达式来说，带有内存泄漏的代码会造成运行失败，就像前面例子展示的那样。</p><p>内存泄漏是 Haskell 新手常常会遇到的问题，幸好的是，它非常容易避免。<code>Data.List</code> 模块定义了一个 <code>foldl&#39;</code> 函数，它和 <code>foldl</code> 的作用类似，唯一的区别是， <code>foldl&#39;</code> 并不创建块。以下的代码直观地展示了它们的区别：</p><pre><code>ghci&gt; foldl  (+) 0 [1..1000000]
*** Exception: stack overflow

ghci&gt; :module +Data.List

ghci&gt; foldl&#39; (+) 0 [1..1000000]
500000500000
</code></pre><p>综上所述，最好不要在实际代码中使用 <code>foldl</code> ：即使计算不失败，它的效率也好不到那里去。更好的办法是，使用 <code>Data.List</code> 里面的 <code>foldl&#39;</code> 来代替。</p><p>[译注：在我的电脑上，超出内存的 <code>foldl</code> 失败方式和书本列出的并不一样：</p><pre><code>Prelude&gt; foldl (+) 0 [1..1000000000]
&lt;interactive&gt;: internal error: getMBlock: mmap: Operation not permitted
(GHC version 7.4.2 for i386_unknown_linux)
Please report this as a GHC bug:  http://www.haskell.org/ghc/reportabug
已放弃
</code></pre><p>从错误信息看， GHC/GHCi 处理 <code>foldl</code> 的方式应该已经发生了变化。</p><p>如果使用 <code>foldl&#39;</code> 来执行计算，就不会出现任何问题：</p><pre><code>Prelude&gt; :module +Data.List

Prelude Data.List&gt; foldl&#39; (+) 0 [1..1000000000]
500000000500000000
</code></pre><p>就是这样。] [我(github:sancao2)的电脑上面行为还是&quot;Exception: stack overflow&quot;.</p><pre><code>➜  ch04  uname -a
Linux centos 3.10.0-229.20.1.el7.x86_64 #1 SMP Tue Nov 3 19:10:07 UTC 2015 x86_64 x86_64 x86_64 GNU/Linux
➜  ch04  ghci
GHCi, version 7.6.3: http://www.haskell.org/ghc/  :? for help
Loading package ghc-prim ... linking ... done.
Loading package integer-gmp ... linking ... done.
Loading package base ... linking ... done.
Prelude&gt; foldl (+) 0 [1..100000000]
*** Exception: stack overflow
</code></pre><p>]</p><h4 id="练习" tabindex="-1"><a class="header-anchor" href="#练习" aria-hidden="true">#</a> 练习</h4><p>1.运用 <code>fold</code> （运用合适的fold将会使你的代码更简单）重写并扩展位于＂显式递归＂章节的 <code>asInt</code> 函数．</p><pre><code>-- file: ch04/ch04.exercises.hs
asInt_fold :: String -&gt; Int
</code></pre><p>你函数的效果应该是这样的．</p><pre><code>ghci&gt; asInt_fold &quot;101&quot;
101
ghci&gt; asInt_fold &quot;-31337&quot;
-31337
ghci&gt; asInt_fold &quot;1798&quot;
1798
</code></pre><p>扩展你的函数以处理下面当调用错误时候出现的异常的情况．</p><pre><code>ghci&gt; asInt_fold &quot;&quot;
0
ghci&gt; asInt_fold &quot;-&quot;
0
ghci&gt; asInt_fold &quot;-3&quot;
-3
ghci&gt; asInt_fold &quot;2.7&quot;
*** Exception: Char.digitToInt: not a digit &#39;.&#39;
ghci&gt; asInt_fold &quot;314159265358979323846&quot;
564616105916946374
</code></pre><ol start="2"><li><code>asInt_fold</code> 函数使用 <code>error</code>, 因而调用者不能处理这些错误．重写他来修复这个问题．</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;!-- --&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><pre><code>-- file: ch04/ch04.exercises.hs
type ErrorMessage = String
asInt_either :: String -&gt; Either ErrorMessage Int
ghci&gt; asInt_either &quot;33&quot;
Right 33
ghci&gt; asInt_either &quot;foo&quot;
Left &quot;non-digit &#39;o&#39;&quot;
</code></pre><p>3.Prelude下面的函数 <code>concat</code> 将一个列表的列表连接成一个单独的列表．他的函数签名如下．</p><pre><code>--file: ch04/ch04.exercises.hs
concat :: [[a]] -&gt; [a]
</code></pre><p>用foldr写出你自己山寨的concat．</p><p>4.写出你自己山寨的 <code>takeWhile</code> 函数，首先用显式递归的手法，然后改成 <code>foldr</code> 形式．</p><ol start="5"><li><code>Data.List</code> 模块定义了一个函数, <code>groupBy</code>.其拥有如下签名．</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;!-- --&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><pre><code>-- file: ch04/ch04.exercises.hs
groupBy :: (a -&gt; a -&gt; Bool) -&gt; [a] -&gt; [[a]]
</code></pre><p>运用 <code>ghci</code> 加载 <code>Data.List</code> 模块以理解 <code>groupBy</code> 的行为，然后写出你自己山寨的 <code>fold</code> 实现．</p><ol start="6"><li>下面Prelude函数能用 <code>fold</code> 系列函数重写的函数有多少？</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;!-- --&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><pre><code>any

cycle

words

unlines
</code></pre><p>这些函数你能用 <code>foldl</code> 或者 <code>foldr</code> 重写，请问那种情况更合适？</p><h3 id="延伸阅读" tabindex="-1"><a class="header-anchor" href="#延伸阅读" aria-hidden="true">#</a> 延伸阅读</h3>`,353),r={href:"http://www.cs.nott.ac.uk/~gmh/fold.pdf",target:"_blank",rel:"noopener noreferrer"},u=n(`<h2 id="anonymous-lambda-functions" tabindex="-1"><a class="header-anchor" href="#anonymous-lambda-functions" aria-hidden="true">#</a> 匿名（lambda）函数</h2><p>在前面章节定义的函数中，很多函数都带有一个简单的辅助函数：</p><p>::: literalinclude /code/ch04/isInAny.hs :::</p><p>Haskell 允许我们编写完全匿名的函数，这样就不必再费力地为辅助函数想名字了。因为匿名函数从 lambda 演算而来，所以匿名函数通常也被称为 lambda 函数。</p><p>在 Haskell 中，匿名函数以反斜杠符号 <code>\\</code> 为开始，后跟函数的参数（可以包含模式），而函数体定义在 <code>-&gt;</code> 符号之后。其中， <code>\\</code> 符号读作 <em>lambda</em> 。</p><p>以下是前面的 <code>isInAny</code> 函数用 lambda 改写的版本：</p><p>::: literalinclude /code/ch04/isInAny2.hs :::</p><p>定义使用括号包裹了整个匿名函数，确保 Haskell 可以知道匿名函数体在那里结束。</p><p>匿名函数各个方面的行为都和带名称的函数基本一致，但是，匿名函数的定义受到几个严格的限制，其中最重要的一点是：普通函数可以通过多条语句来定义，而 lambda 函数的定义只能有一条语句。</p><p>只能使用一条语句的局限性，限制了在 lambda 定义中可使用的模式。一个普通函数，通常要使用多条定义，来覆盖各种不同的模式：</p><p>::: literalinclude /code/ch04/safeHead.hs :::</p><p>而 lambda 只能覆盖其中一种情形：</p><p>::: literalinclude /code/ch04/unsafeHead.hs :::</p><p>如果一不小心，将这个函数应用到错误的模式上，它就会给我们带来麻烦：</p><pre><code>Prelude&gt; :load unsafeHead.hs
[1 of 1] Compiling Main             ( unsafeHead.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; :type unsafeHead
unsafeHead :: [t] -&gt; t

*Main&gt; unsafeHead [1]
1

*Main&gt; unsafeHead []
*** Exception: unsafeHead.hs:2:14-24: Non-exhaustive patterns in lambda
</code></pre><p>因为这个 lambda 定义是完全合法的，它的类型也没有错误，所以它可以被顺利编译，而最终在运行期产生错误。这个故事说明，如果你要在 lambda 函数里使用模式，请千万小心，必须确保你的模式不会匹配失败。</p><p>另外需要注意的是，在前面定义的 <code>isInAny</code> 函数和 <code>isInAny2</code> 函数里，带有辅助函数的 <code>isInAny</code> 要比使用 lambda 的 <code>isInAny2</code> 要更具可读性。带有名字的辅助函数不会破坏程序的代码流（flow），而且它的名字也可以传达更多的相关信息。</p><p>相反，当在一个函数定义里面看到 lambda 时，我们必须慢下来，仔细阅读这个匿名函数的定义，弄清楚它都干了些什么。为了程序的可读性和可维护性考虑，我们在很多情况下都会避免使用 lambda 。</p><p>当然，这并不是说 lambda 函数完全没用，只是在使用它们的时候，必须小心谨慎。</p><p>很多时候，部分应用函数可以很好地代替 lambda 函数，避免不必要的函数定义，粘合起不同的函数，并产生更清晰和更可读的代码。下一节就会介绍部分应用函数。</p><h2 id="部分函数应用和柯里化" tabindex="-1"><a class="header-anchor" href="#部分函数应用和柯里化" aria-hidden="true">#</a> 部分函数应用和柯里化</h2><p>类型签名里的 <code>-&gt;</code> 可能会让人感到奇怪：</p><pre><code>Prelude&gt; :type dropWhile
dropWhile :: (a -&gt; Bool) -&gt; [a] -&gt; [a]
</code></pre><p>初看上去，似乎 <code>-&gt;</code> 既用于隔开 <code>dropWhile</code> 函数的各个参数（比如括号里的 <code>a</code> 和 <code>Bool</code> ），又用于隔开函数参数和返回值的类型（<code>(a -&gt; Bool) -&gt; [a]</code> 和 <code>[a]</code>）。</p><p>但是，实际上 <code>-&gt;</code> 只有一种作用：它表示一个函数接受一个参数，并返回一个值。其中 <code>-&gt;</code> 符号的左边是参数的类型，右边是返回值的类型。</p><p>理解 <code>-&gt;</code> 的含义非常重要：在 Haskell 中，<em>所有函数都只接受一个参数</em>。尽管 <code>dropWhile</code> 看上去像是一个接受两个参数的函数，但实际上它是一个接受一个参数的函数，而这个函数的返回值是另一个函数，这个被返回的函数也只接受一个参数。</p><p>以下是一个完全合法的 Haskell 表达式：</p><pre><code>Prelude&gt; :module +Data.Char

Prelude Data.Char&gt; :type dropWhile isSpace
dropWhile isSpace :: [Char] -&gt; [Char]
</code></pre><p>表达式 <code>dropWhile isSpace</code> 的值是一个函数，这个函数移除一个字符串的所有前缀空白。作为一个例子，可以将它应用到一个高阶函数：</p><pre><code>Prelude Data.Char&gt; map (dropWhile isSpace) [&quot; a&quot;, &quot;f&quot;, &quot;    e&quot;]
[&quot;a&quot;,&quot;f&quot;,&quot;e&quot;]
</code></pre><p>每当我们将一个参数传给一个函数时，这个函数的类型签名最前面的一个元素就会被&quot;移除掉&quot;。这里用函数 <code>zip3</code> 来做例子，这个函数接受三个列表，并将它们压缩成一个包含三元组的列表：</p><pre><code>Prelude&gt; :type zip3
zip3 :: [a] -&gt; [b] -&gt; [c] -&gt; [(a, b, c)]

Prelude&gt; zip3 &quot;foo&quot; &quot;bar&quot; &quot;quux&quot;
[(&#39;f&#39;,&#39;b&#39;,&#39;q&#39;),(&#39;o&#39;,&#39;a&#39;,&#39;u&#39;),(&#39;o&#39;,&#39;r&#39;,&#39;u&#39;)]
</code></pre><p>如果只将一个参数应用到 <code>zip3</code> 函数，那么它就会返回一个接受两个参数的函数。无论之后将什么参数传给这个复合函数，之前传给它的第一个参数的值都不会改变。</p><pre><code>Prelude&gt; :type zip3
zip3 :: [a] -&gt; [b] -&gt; [c] -&gt; [(a, b, c)]

Prelude&gt; :type zip3 &quot;foo&quot;
zip3 &quot;foo&quot; :: [b] -&gt; [c] -&gt; [(Char, b, c)]

Prelude&gt; :type zip3 &quot;foo&quot; &quot;bar&quot;
zip3 &quot;foo&quot; &quot;bar&quot; :: [c] -&gt; [(Char, Char, c)]

Prelude&gt; :type zip3 &quot;foo&quot; &quot;bar&quot; &quot;quux&quot;
zip3 &quot;foo&quot; &quot;bar&quot; &quot;quux&quot; :: [(Char, Char, Char)]
</code></pre><p>传入参数的数量，少于函数所能接受参数的数量，这种情况被称为函数的<em>部分应用</em>（partial application of the function）：函数正被它的其中几个参数所应用。</p><p>在上面的例子中， <code>zip3 &quot;foo&quot;</code> 就是一个部分应用函数，它以 <code>&quot;foo&quot;</code> 作为第一个参数，部分应用了 <code>zip3</code> 函数；而 <code>zip3 &quot;foo&quot; &quot;bar&quot;</code> 也是另一个部分应用函数，它以 <code>&quot;foo&quot;</code> 和 <code>&quot;bar&quot;</code> 作为参数，部分应用了 <code>zip3</code> 函数。</p><p>只要给部分函数补充上足够的参数，它就可以被成功求值：</p><pre><code>Prelude&gt; let zip3foo = zip3 &quot;foo&quot;

Prelude&gt; zip3foo &quot;bar&quot; &quot;quux&quot;
[(&#39;f&#39;,&#39;b&#39;,&#39;q&#39;),(&#39;o&#39;,&#39;a&#39;,&#39;u&#39;),(&#39;o&#39;,&#39;r&#39;,&#39;u&#39;)]

Prelude&gt; let zip3foobar = zip3 &quot;foo&quot; &quot;bar&quot;

Prelude&gt; zip3foobar &quot;quux&quot;
[(&#39;f&#39;,&#39;b&#39;,&#39;q&#39;),(&#39;o&#39;,&#39;a&#39;,&#39;u&#39;),(&#39;o&#39;,&#39;r&#39;,&#39;u&#39;)]

Prelude&gt; zip3foobar [1, 2, 3]
[(&#39;f&#39;,&#39;b&#39;,1),(&#39;o&#39;,&#39;a&#39;,2),(&#39;o&#39;,&#39;r&#39;,3)]
</code></pre><p>部分函数应用（partial function application）让我们免于编写烦人的一次性函数，而且它比起之前介绍的匿名函数要来得更有用。回顾之前的 <code>isInAny</code> 函数，以下是一个部分应用函数改写的版本，它既不需要匿名函数，也不需要辅助函数：</p><p>::: literalinclude /code/ch04/isInAny3.hs :::</p><p>表达式 <code>isInfixOf needle</code> 是部分应用函数，它以 <code>needle</code> 变量作为第一个参数，传给 <code>isInfixOf</code> ，并产生一个部分应用函数，这个部分应用函数的作用等同于 <code>isInAny</code> 定义的辅助函数，以及 <code>isInAny2</code> 定义的匿名函数。</p><p>部分函数应用被称为柯里化（currying），以逻辑学家 Haskell Curry 命名（Haskell 语言的命名也是来源于他的名字）。</p><p>以下是另一个使用柯里化的例子。先来回顾《左折叠》章节的 <code>niceSum</code> 函数：</p><p>::: literalinclude /code/ch04/niceSum.hs :::</p><p>实际上，并不需要完全应用 <code>foldl</code> [译注：完全应用是指提供函数所需的全部参数]，<code>niceSum</code> 函数的 <code>xs</code> 参数，以及传给 <code>foldl</code> 函数的 <code>xs</code> 参数，这两者都可以被省略，最终得到一个更紧凑的函数，它的类型也和原本的一样：</p><p>::: literalinclude /code/ch04/niceSumPartial.hs :::</p><p>测试：</p><pre><code>Prelude&gt; :load niceSumPartial.hs
[1 of 1] Compiling Main             ( niceSumPartial.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; niceSumPartial [1 .. 10]
55
</code></pre><h3 id="sections" tabindex="-1"><a class="header-anchor" href="#sections" aria-hidden="true">#</a> 节</h3><p>Haskell 提供了一种方便的符号快捷方式，用于对中序函数进行部分应用：使用括号包围一个操作符，通过在括号里面提供左操作对象或者右操作对象，可以产生一个部分应用函数。这种类型的部分函数应用称之为节（section）。</p><pre><code>Prelude&gt; (1+) 2
3

Prelude&gt; map (*3) [24, 36]
[72,108]

Prelude&gt; map (2^) [3, 5, 7, 9]
[8,32,128,512]
</code></pre><p>如果向节提供左操作对象，那么得出的部分函数就会将接收到的参数应用为右操作对对象，反之亦然。</p><p>以下两个表达式都计算 2 的 3 次方，但是第一个节接受的是左操作对象 <code>2</code> ，而第二个节接受的则是右操作对象 <code>3</code> 。</p><pre><code>Prelude&gt; (2^) 3
8

Prelude&gt; (^3) 2
8
</code></pre><p>之前提到过，通过使用反括号来包围一个函数，可以将这个函数用作中序操作符。这种用法可以让节使用函数：</p><pre><code>Prelude&gt; :type (\`elem\` [&#39;a&#39; .. &#39;z&#39;])
(\`elem\` [&#39;a&#39; .. &#39;z&#39;]) :: Char -&gt; Bool
</code></pre><p>上面的定义将 <code>[&#39;a&#39; .. &#39;z&#39;]</code> 传给 <code>elem</code> 作为第二个参数，表达式返回的函数可以用于检查一个给定字符值是否属于小写字母：</p><p>:</p><pre><code>Prelude&gt; (\`elem\` [&#39;a&#39; .. &#39;z&#39;]) &#39;f&#39;
True

Prelude&gt; (\`elem\` [&#39;a&#39; .. &#39;z&#39;]) &#39;1&#39;
False
</code></pre><p>还可以将这个节用作 <code>all</code> 函数的输入，这样就得到了一个检查给定字符串是否整个字符串都由小写字母组成的函数：</p><pre><code>Prelude&gt; all (\`elem\` [&#39;a&#39; .. &#39;z&#39;]) &quot;Haskell&quot;
False

Prelude&gt; all (\`elem\` [&#39;a&#39; .. &#39;z&#39;]) &quot;haskell&quot;
True
</code></pre><p>通过这种用法，可以再一次提升 <code>isInAny3</code> 函数的可读性：</p><p>::: literalinclude /code/ch04/isInAny4.hs :::</p><p>[译注：根据前面部分函数部分提到的技术，这个 <code>isInAny4</code> 的定义还可以进一步精简，去除 <code>haystack</code> 参数：</p><pre><code>import Data.List (isInfixOf)
isInAny4Partial needle = any (needle \`isInfixOf\`)
</code></pre><p>]</p><h2 id="as-模式" tabindex="-1"><a class="header-anchor" href="#as-模式" aria-hidden="true">#</a> As-模式</h2><p><code>Data.List</code> 模块里定义的 <code>tails</code> 函数是 <code>tail</code> 的推广，它返回一个列表的所有&quot;尾巴&quot;：</p><pre><code>Prelude&gt; :m +Data.List

Prelude Data.List&gt; tail &quot;foobar&quot;
&quot;oobar&quot;

Prelude Data.List&gt; tail (tail &quot;foobar&quot;)
&quot;obar&quot;

Prelude Data.List&gt; tails &quot;foobar&quot;
[&quot;foobar&quot;,&quot;oobar&quot;,&quot;obar&quot;,&quot;bar&quot;,&quot;ar&quot;,&quot;r&quot;,&quot;&quot;]
</code></pre><p><code>tails</code> 返回一个包含字符串的列表，这个列表保存了输入字符串的所有后缀，以及一个额外的空列表（放在结果列表的最后）。<code>tails</code> 的返回值总是带有额外的空列表，即使它的输入为空时：</p><pre><code>Prelude Data.List&gt; tails &quot;&quot;
[[]]
</code></pre><p>如果想要一个行为和 <code>tails</code> 类似，但是并不包含空列表后缀的函数，可以自己写一个：</p><p>::: literalinclude /code/ch04/suffixes.hs :::</p><p>[译注：在稍后的章节就会看到，有简单得多的方法来完成这个目标，这个例子主要用于展示 as-模式的作用。]</p><p>源码里面用到了新引入的 <code>@</code> 符号，模式 <code>xs@(_:xs&#39;)</code> 被称为 as-模式，它的意思是：如果输入值能匹配 <code>@</code> 符号右边的模式（这里是 <code>(_:xs&#39;)</code> ），那么就将这个值绑定到 <code>@</code> 符号左边的变量中（这里是 <code>xs</code> ）。</p><p>在这个例子里，如果输入值能够匹配模式 <code>(_:xs&#39;)</code> ，那么这个输入值这就被绑定为 <code>xs</code> ，它的 <code>tail</code> 部分被绑定为 <code>xs&#39;</code> ，而它的 <code>head</code> 部分因为使用通配符 <code>_</code> 进行匹配，所以这部分没有被绑定到任何变量。</p><pre><code>*Main Data.List&gt; tails &quot;foo&quot;
[&quot;foo&quot;,&quot;oo&quot;,&quot;o&quot;,&quot;&quot;]

*Main Data.List&gt; suffixes &quot;foo&quot;
[&quot;foo&quot;,&quot;oo&quot;,&quot;o&quot;]
</code></pre><p>As-模式可以提升代码的可读性，作为对比，以下是一个没有使用 as-模式的 <code>suffixes</code> 定义：</p><p>::: literalinclude /code/ch04/noAsPattern.hs :::</p><p>可以看到，使用 as-模式的定义同时完成了模式匹配和变量绑定两项工作。而不使用 as-模式的定义，则需要在对列表进行结构之后，在函数体里又重新对列表进行组合。</p><p>除了增强可读性之外， as-模式还有其他作用：它可以对输入数据进行共享，而不是复制它。在 <code>noAsPattern</code> 函数的定义中，当 <code>(x:xs)</code> 匹配时，在函数体里需要复制一个 <code>(x:xs)</code> 的副本。这个动作会引起内存分配。虽然这个分配动作可能很廉价，但它并不是免费的。相反，当使用 <code>suffixes</code> 函数时，我们通过变量 <code>xs</code> 重用匹配了 as-模式的输入值，因此就避免了内存分配。</p><h2 id="通过组合函数来进行代码复用" tabindex="-1"><a class="header-anchor" href="#通过组合函数来进行代码复用" aria-hidden="true">#</a> 通过组合函数来进行代码复用</h2><p>前面的 <code>suffixes</code> 函数实际上有一种更简单的实现方式。</p><p>回忆前面在《使用列表》一节里介绍的 <code>init</code> 函数，它可以返回一个列表中除了最后一个元素之外的其他元素。而组合使用 <code>init</code> 和 <code>tails</code> ，可以给出一个 <code>suffixes</code> 函数的更简单实现：</p><p>::: literalinclude /code/ch04/suffixes2.hs :::</p><p><code>suffixes2</code> 和 <code>suffixes</code> 函数的行为完全一样，但 <code>suffixes2</code> 的定义只需一行：</p><pre><code>Prelude&gt; :load suffixes2.hs
[1 of 1] Compiling Main             ( suffixes2.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; suffixes2 &quot;foobar&quot;
[&quot;foobar&quot;,&quot;oobar&quot;,&quot;obar&quot;,&quot;bar&quot;,&quot;ar&quot;,&quot;r&quot;]
</code></pre><p>如果仔细地观察，就会发现这里隐含着一个模式：我们先应用一个函数，然后又将这个函数得出的结果应用到另一个函数。可以将这个模式定义为一个函数：</p><p>::: literalinclude /code/ch04/compose.hs :::</p><p><code>compose</code> 函数可以用于粘合两个函数：</p><pre><code>Prelude&gt; :load compose.hs
[1 of 1] Compiling Main             ( compose.hs, interpreted )
Ok, modules loaded: Main.

*Main&gt; :m +Data.List

*Main Data.List&gt; let suffixes3 xs = compose init tails xs
</code></pre><p>通过柯里化，可以丢掉 <code>xs</code> 函数：</p><pre><code>*Main Data.List&gt; let suffixes4 = compose init tails
</code></pre><p>更棒的是，其实我们并不需要自己编写 <code>compose</code> 函数，因为 Haskell 已经内置在了 <code>Prelude</code> 里面，使用 <code>(.)</code> 操作符就可以组合起两个函数：</p><pre><code>*Main Data.List&gt; let suffixes5 = init . tails
</code></pre><p><code>(.)</code> 操作符并不是什么特殊语法，它只是一个普通的操作符：</p><pre><code>*Main Data.List&gt; :type (.)
(.) :: (b -&gt; c) -&gt; (a -&gt; b) -&gt; a -&gt; c

*Main Data.List&gt; :type suffixes5
suffixes5 :: [a] -&gt; [[a]]

*Main Data.List&gt; suffixes5 &quot;foobar&quot;
[&quot;foobar&quot;,&quot;oobar&quot;,&quot;obar&quot;,&quot;bar&quot;,&quot;ar&quot;,&quot;r&quot;]
</code></pre><p>在任何时候，都可以通过使用 <code>(.)</code> 来组合函数，并产生新函数。组合链的长度并没有限制，只要 <code>(.)</code> 符号右边函数的输出值类型适用于 <code>(.)</code> 符号左边函数的输入值类型就可以了。</p><p>也即是，对于 <code>f . g</code> 来说， <code>g</code> 的输出值必须是 <code>f</code> 能接受的类型，这样的组合就是合法的， <code>(.)</code> 的类型签名也显示了这一点。</p><p>作为例子，再来解决一个非常常见的问题：计算字符串中以大写字母开头的单词的个数：</p><pre><code>Prelude&gt; :module +Data.Char

Prelude Data.Char&gt; let capCount = length . filter (isUpper . head) . words

Prelude Data.Char&gt; capCount &quot;Hello there, Mon!&quot;
2
</code></pre><p>来逐步分析 <code>capCount</code> 函数的组合过程。因为 <code>(.)</code> 操作符是右关联的，因此我们从组合链的最右边开始研究：</p><pre><code>Prelude Data.Char&gt; :type words
words :: String -&gt; [String]
</code></pre><p><code>words</code> 返回一个 <code>[String]</code> 类型值，因此 <code>(.)</code> 的左边的函数必须能接受这个参数。</p><pre><code>Prelude Data.Char&gt; :type isUpper . head
isUpper . head :: [Char] -&gt; Bool
</code></pre><p>上面的组合函数在输入字符串以大写字母开头时返回 <code>True</code> ，因此 <code>filter (isUpper . head)</code> 表达式会返回所有以大写字母开头的字符串：</p><pre><code>Prelude Data.Char&gt; :type filter (isUpper . head)
filter (isUpper . head) :: [[Char]] -&gt; [[Char]]
</code></pre><p>因为这个表达式返回一个列表，而 <code>length</code> 函数用于统计列表的长度，所以 <code>length . filter (isUpper . head)</code> 就计算出了所有以大写字母开头的字符串的个数。</p><p>以下是另一个例子，它从 libpcap ------ 一个流行的网络包过滤库中提取 C 文件头中给定格式的宏名字。这些头文件带有很多以下格式的宏：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">DLT_EN10MB</span>      <span class="token expression"><span class="token number">1</span>       </span><span class="token comment">/* Ethernet (10Mb) */</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">DLT_EN3MB</span>       <span class="token expression"><span class="token number">2</span>       </span><span class="token comment">/* Experimental Ethernet (3Mb) */</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">DLT_AX25</span>        <span class="token expression"><span class="token number">3</span>       </span><span class="token comment">/* Amateur Radio AX.25 */</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们的目标是提取出所有像 <code>DLT_AX25</code> 和 <code>DLT_EN3MB</code> 这种名字。以下是程序的定义，它将整个文件看作是一个字符串，先使用 <code>lines</code> 对文件进行按行分割，再将 <code>foldr step []</code> 应用到各行当中，其中 <code>step</code> 辅助函数用于过滤和提取符合格式的宏名字：</p><p>::: literalinclude /code/ch04/dlts.hs :::</p><p>程序通过守卫表达式来过滤输入：如果输入字符串符合给定格式，就将它加入到结果列表里；否则，就略过这个字符串，继续处理剩余的输入字符串。</p><p>至于 <code>secondWord</code> 函数，它先取出一个列表的 <code>tail</code> 部分，得出一个新列表。再取出新列表的 <code>head</code> 部分，等同于取出一个列表的第二个元素。</p><p>[译注：书本的这个程序弱爆了，以下是 <code>dlts</code> 的一个更直观的版本，它使用 <code>filter</code> 来过滤输入，只保留符合格式的输入，而不是使用复杂且难看的显式递归和守卫来进行过滤：</p><p>::: literalinclude /code/ch04/dlts2.hs :::</p><p>]</p><h2 id="编写可读代码的提示" tabindex="-1"><a class="header-anchor" href="#编写可读代码的提示" aria-hidden="true">#</a> 编写可读代码的提示</h2><p>目前为止，我们知道 Haskell 有两个非常诱人的特性：尾递归和匿名函数。但是，这两个特性通常并不被使用。</p><p>对列表的处理操作一般可以通过组合库函数比如 <code>map</code> 、 <code>take</code> 和 <code>filter</code> 来进行。当然，熟悉这些库函数需要一定的时间，不过掌握这些函数之后，就可以使用它们写出更快更好更少 bug 的代码。</p><h2 id="库函数比尾递归更好的原因很简单-尾递归和命令式语言里的-loop-有同样的问题" tabindex="-1"><a class="header-anchor" href="#库函数比尾递归更好的原因很简单-尾递归和命令式语言里的-loop-有同样的问题" aria-hidden="true">#</a> 库函数比尾递归更好的原因很简单：尾递归和命令式语言里的 loop 有同样的问题</h2><p>它们太通用（general）了。在一个尾递归里，你可以同时执行过滤（filtering）、映射（mapping）和其他别的动作。这强迫代码的阅读者（可能是你自己）必须弄懂整个递归函数的定义，才能理解这个函数到底做了些什么。与此相反，<code>map</code> 和其他很多列表函数，都只专注于做<em>一件</em>事。通过这些函数，我们可以很快理解某段代码到底做了什么，以及整个程序想表达什么意思，而不是将时间浪费在关注细节方面。</p><p>折叠（fold）操作处于（完全通用化的）尾递归和（只做一件事的）列表处理函数之间的中间地带。折叠也很值得我们花时间去好好理解，它的作用跟组合起 <code>map</code> 和 <code>filter</code> 函数差不多，但比起显式递归来说，折叠的行为要来得更有规律，而且更可控。一般来说，可以通过组合函数来解决的问题，就不要使用折叠。另一方面，如果问题用组合函数没办法解决，那么使用折叠要比使用显式递归要好。</p><p>另一方面，匿名函数通常会对代码的可读性造成影响。一般来说，匿名函数都可以用 <code>let</code> 或者 <code>where</code> 定义的局部函数来代替。而且带名字的局部函数可以达到一箭双雕的效果：它使得代码更具可读性，且函数名本身也达到了文档化的作用。</p><h2 id="内存泄漏和严格求值" tabindex="-1"><a class="header-anchor" href="#内存泄漏和严格求值" aria-hidden="true">#</a> 内存泄漏和严格求值</h2><p>前面介绍的 <code>foldl</code> 函数并不是 Haskell 代码里唯一会造成内存泄漏的地方。</p><p>在这一节，我们使用 <code>foldl</code> 来展示非严格求值在什么情况下会造成问题，以及如何去解决这些问题。</p><h3 id="通过-seq-函数避免内存泄漏" tabindex="-1"><a class="header-anchor" href="#通过-seq-函数避免内存泄漏" aria-hidden="true">#</a> 通过 seq 函数避免内存泄漏</h3><p>我们称非惰性求值的表达式为<em>严格的</em>（strict）。 <code>foldl&#39;</code> 就是左折叠的严格版本，它使用特殊的 <code>seq</code> 函数来绕过 Haskell 默认的非严格求值：</p><p>::: literalinclude /code/ch04/strictFoldl.hs :::</p><p><code>seq</code> 函数的类型签名和之前看过的函数都有些不同，昭示了它的特殊身份：</p><pre><code>ghci&gt; :type seq
seq :: a -&gt; t -&gt; t
</code></pre><p>[译注：在 7.4.2 版本的 GHCi 里， <code>seq</code> 函数的类型签名不再使用 <code>t</code> ，而是像其他函数一样，使用 <code>a</code> 和 <code>b</code> 。</p><pre><code>Prelude&gt; :type seq
seq :: a -&gt; b -&gt; b
</code></pre><p>]</p><p>实际上， <code>seq</code> 函数的行为并没有那么神秘：它强迫（force）求值传入的第一个参数，然后返回它的第二个参数。</p><p>比如说，对于以下表达式：</p><pre><code>foldl&#39; (+) 1 (2:[])
</code></pre><p>它展开为：</p><pre><code>let new = 1 + 2
in new \`seq\` foldl&#39; (+) new []
</code></pre><p>它强迫 <code>new</code> 求值为 <code>3</code> ，然后返回它的第二个参数：</p><pre><code>foldl&#39; (+) 3 []
</code></pre><p>最终得到结果 <code>3</code> 。</p><p>因为 <code>seq</code> 的存在，这个创建过程没有用到任何块。</p><h3 id="seq-的用法" tabindex="-1"><a class="header-anchor" href="#seq-的用法" aria-hidden="true">#</a> seq 的用法</h3><p>本节介绍一些更有效地使用 <code>seq</code> 的指导规则。</p><p>要正确地产生 <code>seq</code> 的作用，表达式中被求值的第一个必须是 <code>seq</code> ：</p><pre><code>-- 错误：因为表达式中第一个被求值的是 someFunc 而不是 seq
-- 所以 seq 的调用被隐藏了在 someFunc 调用之下
hiddenInside x y = someFunc (x \`seq\` y)

-- 错误：原因和上面一样
hiddenByLet x y z = let a = x \`seq\` someFunc y
                    in anotherFunc a z

-- 正确： seq 被第一个求值，并且 x 被强迫求值
onTheOutside x y = x \`seq\` someFunc y
</code></pre><p>为了严格求值多个值，可以连接起 <code>seq</code> 调用：</p><pre><code>chained x y z = x \`seq\` y \`seq\` someFunc z
</code></pre><p>一个常见错误是，将 <code>seq</code> 用在没有关联的两个表达式上面：</p><pre><code>badExpression step zero (x:xs) =
    seq (step zero x)
            (badExpression step (step zero x) xs)
</code></pre><p><code>step zero x</code> 分别出现在 <code>seq</code> 的第一个参数和 <code>badExpression</code> 的表达式内， <code>seq</code> 只会对第一个 <code>step zero x</code> 求值，而它的结果并不会影响 <code>badExpression</code> 表达式内的 <code>step zero x</code> 。正确的用法应该是用一个 <code>let</code> 结果保存起 <code>step zero x</code> 表达式，然后将它分别传给 <code>seq</code> 和 <code>badExpression</code> ，做法可以参考前面的 <code>foldl&#39;</code> 的定义。</p><p><code>seq</code> 在遇到像数字这样的值时，它会对值进行求值，但是，一旦 <code>seq</code> 碰到构造器，比如 <code>(:)</code> 或者 <code>(,)</code> ，那么 <code>seq</code> 的求值就会停止。举个例子，如果将 <code>(1+2):[]</code> 传给 <code>seq</code> 作为它的第一个参数，那么 <code>seq</code> 不会对这个表达式进行求值；相反，如果将 <code>1</code> 传给 <code>seq</code> 作为第一个参数，那么它会被求值为 <code>1</code> 。</p><p>[译注：</p><p>原文说，对于 <code>(1+2):[]</code> 这样的表达式， <code>seq</code> 在求值 <code>(1+2)</code> 之后，碰到 <code>:</code> ，然后停止求值。但是根据原文网站上的评论者测试， <code>seq</code> 并不会对 <code>(1+2)</code> 求值，而是在碰到 <code>(1+2):[]</code> 时就直接停止求值。</p><p>这一表现可能的原因如下：虽然 <code>:</code> 是中序操作符，但它实际上只是函数 <code>(:)</code> ，而 Haskell 的函数总是前序的，因此 <code>(1+2):[]</code> 实际上应该表示为 <code>(:) (1+2) []</code> ，所以原文说&quot;<code>seq</code> 在碰到构造器时就会停止求值&quot;这一描述并没有出错，只是给的例子出了问题。</p><p>因为以上原因，这里对原文进行了修改。</p><p>]</p><p>如果有需要的话，也可以绕过这些限制：</p><pre><code>strictPair (a,b) = a \`seq\` b \`seq\` (a,b)

strictList (x:xs) = x \`seq\` x : strictList xs
strictList []     = []
</code></pre><p><code>seq</code> 的使用并不是无成本的，知道这一点很重要：它需要在运行时检查输入值是否已经被求值。必须谨慎使用 <code>seq</code> 。比如说，上面定义的 <code>strictPair</code> ，尽管它能顺利对元组进行强制求值，但它在求值元组所需的计算量上，加上了一次模式匹配、两次 <code>seq</code> 调用和一次构造新元组的计算量。如果我们检测这个函数的性能的话，就会发现它降低了程序的处理速度。</p><p>即使不考虑性能的问题， <code>seq</code> 也不是处理内存泄漏的万能药。可以进行非严格求值，但并不意味着非用它不可。对 <code>seq</code> 的不小心使用可能对内存泄漏并没有帮助，在更糟糕的情况下，它还会造成新的内存泄漏。</p><p>第二十五章会介绍关于性能和优化的内容，到时会说明更多 <code>seq</code> 的用法和细节。</p>`,164);function h(g,q){const a=s("ExternalLinkIcon");return c(),d("div",null,[l,e("p",null,[e("a",r,[o("A tutorial on the universality and expressiveness of fold"),p(a)]),o(" 是一篇关于 fold 的优秀且深入的文章。它使用了很多例子来展示如何通过简单的系统化计算技术，将一些显式递归的函数转换成 fold 。")]),u])}const k=t(i,[["render",h],["__file","4.html.vue"]]);export{k as default};
