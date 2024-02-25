import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as d,o as s,c as a,a as e,b as t,d as c,f as n}from"./app-Chw2KLnS.js";const r={},l=n(`<h1 id="第-20-章-使用-haskell-进行系统编程" tabindex="-1"><a class="header-anchor" href="#第-20-章-使用-haskell-进行系统编程"><span>第 20 章：使用 Haskell 进行系统编程</span></a></h1><p>目前为止，我们讨论的大多数是高阶概念。 Haskell 也可以用于底层系统编程。完全可以使用 Haskell 编写使用操作系统底层接口的程序。</p><p>本章中，我们将尝试一些很有野心的东西：编写一种类似 Perl 实际上是合法的 Haskell 的&quot;语言&quot;，完全使用 Haskell 实现，用于简化编写 shell 脚本。我们将实现管道，简单命令调用，和一些简单的工具用于执行由 <code>grep</code> 和 <code>sed</code> 处理的任务。</p><p>有些模块是依赖操作系统的。本章中，我们将尽可能使用不依赖特殊操作系统的通用模块。不过，本章将有很多内容着眼于 POSIX 环境。 POSIX 是一种类 Unix 标准， 如 Linux ，FreeBSD ，MacOS X ，或 Solaris 。Windows 默认情况下不支持 POSIX ，但是 Cygwin 环境为 Windows 提供了 POSIX 兼容层。</p><h2 id="调用外部程序" tabindex="-1"><a class="header-anchor" href="#调用外部程序"><span>调用外部程序</span></a></h2><p>Haskell 可以调用外部命令。为了这么做，我们建议使用 <code>System.Cmd</code> 模块中的 <code>rawSystem</code> 。其用特定的参数调用特定的程序，并将返回程序的退出状态码。你可以在 ghci 中练习一下。</p><pre><code>ghci&gt; :module System.Cmd
ghci&gt; rawSystem &quot;ls&quot; [&quot;-l&quot;, &quot;/usr&quot;]
Loading package old-locale-1.0.0.0 ... linking ... done.
Loading package old-time-1.0.0.0 ... linking ... done.
Loading package filepath-1.1.0.0 ... linking ... done.
Loading package directory-1.0.0.0 ... linking ... done.
Loading package unix-2.3.0.0 ... linking ... done.
Loading package process-1.0.0.0 ... linking ... done.
total 124
drwxr-xr-x   2 root root  49152 2008-08-18 11:04 bin
drwxr-xr-x   2 root root   4096 2008-03-09 05:53 games
drwxr-sr-x  10 jimb guile  4096 2006-02-04 09:13 guile
drwxr-xr-x  47 root root   8192 2008-08-08 08:18 include
drwxr-xr-x 107 root root  32768 2008-08-18 11:04 lib
lrwxrwxrwx   1 root root      3 2007-09-24 16:55 lib64 -&gt; lib
drwxrwsr-x  17 root staff  4096 2008-06-24 17:35 local
drwxr-xr-x   2 root root   8192 2008-08-18 11:03 sbin
drwxr-xr-x 181 root root   8192 2008-08-12 10:11 share
drwxrwsr-x   2 root src    4096 2007-04-10 16:28 src
drwxr-xr-x   3 root root   4096 2008-07-04 19:03 X11R6
ExitSuccess
</code></pre><p>此处，我们相当于执行了 shell 命令 <code>ls -l /usr</code> 。 <code>rawSystem</code> 并不从字符串解析输入参数或是扩展通配符[^1] 。取而代之，其接受一个包含所有参数的列表。如果不想提供参数，可以像这样简单地输入一个空列表。</p><pre><code>ghci&gt; rawSystem &quot;ls&quot; []
calendartime.ghci  modtime.ghci    rp.ghci    RunProcessSimple.hs
cmd.ghci       posixtime.hs    rps.ghci   timediff.ghci
dir.ghci       rawSystem.ghci  RunProcess.hs  time.ghci
ExitSuccess
</code></pre><h2 id="目录和文件信息" tabindex="-1"><a class="header-anchor" href="#目录和文件信息"><span>目录和文件信息</span></a></h2><p><code>System.Directory</code> 模块包含了相当多可以从文件系统获取信息的函数。你可以获取某目录包含的文件列表，重命名或删除文件，复制文件，改变当前工作路径，或者建立新目录。 <code>System.Directory</code> 是可移植的，在可以跑 GHC 的平台都可以使用。</p>`,11),u={href:"http://hackage.haskell.org/package/directory-1.0.0.0/docs/System-Directory.html",target:"_blank",rel:"noopener noreferrer"},m=n(`<pre><code>ghci&gt; :module System.Directory
ghci&gt; setCurrentDirectory &quot;/etc&quot;
Loading package old-locale-1.0.0.0 ... linking ... done.
Loading package old-time-1.0.0.0 ... linking ... done.
Loading package filepath-1.1.0.0 ... linking ... done.
Loading package directory-1.0.0.0 ... linking ... done.
ghci&gt; getCurrentDirectory
&quot;/etc&quot;
ghci&gt; setCurrentDirectory &quot;..&quot;
ghci&gt; getCurrentDirectory
&quot;/&quot;
</code></pre><p>此处我们看到了改变工作目录和获取当前工作目录的命令。它们类似 POSIX shell 中的 <code>cd</code> 和 <code>pwd</code> 命令。</p><pre><code>ghci&gt; getDirectoryContents &quot;/&quot;
[&quot;.&quot;,&quot;..&quot;,&quot;lost+found&quot;,&quot;boot&quot;,&quot;etc&quot;,&quot;media&quot;,&quot;initrd.img&quot;,&quot;var&quot;,&quot;usr&quot;,&quot;bin&quot;,&quot;dev&quot;,&quot;home&quot;,&quot;lib&quot;,&quot;mnt&quot;,&quot;proc&quot;,&quot;root&quot;,&quot;sbin&quot;,&quot;tmp&quot;,&quot;sys&quot;,&quot;lib64&quot;,&quot;srv&quot;,&quot;opt&quot;,&quot;initrd&quot;,&quot;vmlinuz&quot;,&quot;.rnd&quot;,&quot;www&quot;,&quot;ultra60&quot;,&quot;emul&quot;,&quot;.fonts.cache-1&quot;,&quot;selinux&quot;,&quot;razor-agent.log&quot;,&quot;.svn&quot;,&quot;initrd.img.old&quot;,&quot;vmlinuz.old&quot;,&quot;ugid-survey.bulkdata&quot;,&quot;ugid-survey.brief&quot;]
</code></pre><p><code>getDirectoryContents</code> 返回一个列表，包含给定目录的所有内容。注意，在 POSIX 系统中，这个列表通常包含特殊值 &quot;.&quot; 和 &quot;..&quot; 。通常在处理目录内容时，你可能会希望将他们过滤出去，像这样：</p><pre><code>ghci&gt; getDirectoryContents &quot;/&quot; &gt;&gt;= return . filter (\`notElem\` [&quot;.&quot;, &quot;..&quot;])
[&quot;lost+found&quot;,&quot;boot&quot;,&quot;etc&quot;,&quot;media&quot;,&quot;initrd.img&quot;,&quot;var&quot;,&quot;usr&quot;,&quot;bin&quot;,&quot;dev&quot;,&quot;home&quot;,&quot;lib&quot;,&quot;mnt&quot;,&quot;proc&quot;,&quot;root&quot;,&quot;sbin&quot;,&quot;tmp&quot;,&quot;sys&quot;,&quot;lib64&quot;,&quot;srv&quot;,&quot;opt&quot;,&quot;initrd&quot;,&quot;vmlinuz&quot;,&quot;.rnd&quot;,&quot;www&quot;,&quot;ultra60&quot;,&quot;emul&quot;,&quot;.fonts.cache-1&quot;,&quot;selinux&quot;,&quot;razor-agent.log&quot;,&quot;.svn&quot;,&quot;initrd.img.old&quot;,&quot;vmlinuz.old&quot;,&quot;ugid-survey.bulkdata&quot;,&quot;ugid-survey.brief&quot;]
</code></pre><p>::: Tip tip</p><p>更细致的讨论如何过滤 <code>getDirectoryContents</code> 函数的结果，请参考 <code>第八章：高效文件处理、正则表达式、文件名匹配 &lt;./8&gt;</code>{.interpreted-text role=&quot;doc&quot;}</p>`,7),p=e("p",null,[e("code",{class:"interpreted-text",role:"samp"},'filter (\\`notElem\\` [".", ".."])'),t(" 这段代码是否有点莫名其妙？也可以写作 "),e("code",{class:"interpreted-text",role:"samp"},'filter (\\c -> not $ elem c [".", ".."])'),t(" 。反引号让我们更有效的将第二个参数传给 "),e("code",null,"notElem"),t(' ；在 "中序函数" 一节中有关于反引号更详细的信息。 :::')],-1),g=e("p",null,"也可以向系统查询某些路径的位置。这将向底层操作系统发起查询相关信息。",-1),h=e("pre",null,[e("code",null,`ghci> getHomeDirectory
"/home/bos"
ghci> getAppUserDataDirectory "myApp"
"/home/bos/.myApp"
ghci> getUserDocumentsDirectory
"/home/bos"
`)],-1),f=e("h2",{id:"终止程序",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#终止程序"},[e("span",null,"终止程序")])],-1),C=e("p",null,'开发者经常编写独立的程序以完成特定任务。这些独立的部分可能会被组合起来完成更大的任务。一段 shell 脚本或者其他程序将会执行它们。发起调用的脚本需要获知被调用程序是否执行成功。Haskell 自动为异常退出的程序分配一个 "不成功" 的状态码。',-1),k=e("p",null,[t("不过，你需要对状态码进行更细粒度的控制。可能你需要对不同类型的错误返回不同的代码。 "),e("code",null,"System.Exit"),t(" 模块提供一个途径可以在程序退出时返回特定的状态码。通过调用 "),e("code",{class:"interpreted-text",role:"samp"},"exitWith ExitSuccess"),t(" 表示程序执行成功（POSIX 系统中的 0）。或者可以调用 "),e("code",{class:"interpreted-text",role:"samp"},"exitWith (ExitFailure 5)"),t(" ，表示将在程序退出时向系统返回 "),e("code",null,"5"),t(" 作为状态码。")],-1),q=n(`<h2 id="日期和时间" tabindex="-1"><a class="header-anchor" href="#日期和时间"><span>日期和时间</span></a></h2><p>从文件时间戳到商业事务的很多事情都涉及到日期和时间。除了从系统获取日期时间信息之外，Haskell 提供了很多关于时间日期的操作方法。</p><h3 id="clocktime-和-calendartime" tabindex="-1"><a class="header-anchor" href="#clocktime-和-calendartime"><span>ClockTime 和 CalendarTime</span></a></h3><p>在 Haskell 中，日期和时间主要由 <code>System.Time</code> 模块处理。它定义了两个类型： <code>ClockTime</code> 和 <code>CalendarTime</code> 。</p><p><code>ClockTime</code> 是传统 POSIX 中时间戳的 Haskell 版本。 <code>ClockTime</code> 表示一个相对于 UTC 1970 年 1 月 1 日 零点的时间。负值的 <code>ClockTime</code> 表示在其之前的秒数，正值表示在其之后的秒数。</p><p><code>ClockTime</code> 便于计算。因为它遵循协调世界时（Coordinated Universal Time，UTC），其不必调整本地时区、夏令时或其他时间处理中的特例。每天是精确的 (60 * 60 * 24) 或 86,400 秒[^2]，这易于计算时间间隔。举个例子，你可以简单的记录某个程序开始执行的时间和其结束的时间，相减即可确定程序的执行时间。如果需要的话，还可以除以 3600，这样就可以按小时显示。</p><p>使用 <code>ClockTime</code> 的典型场景：</p><blockquote><ul><li>经过了多长时间？</li><li>相对此刻 14 天前是什么时间？</li><li>文件的最后修改时间是何时？</li><li>当下的精确时间是何时？</li></ul></blockquote><p>ClockTime 善于处理这些问题，因为它们使用无法混淆的精确时间。但是， <code>ClockTime</code> 不善于处理下列问题：</p><blockquote><ul><li>今天是周一吗？</li><li>明年 5 月 1 日是周几？</li><li>在我的时区当前是什么时间，考虑夏令时。</li></ul></blockquote><p><code>CalendarTime</code> 按人类的方式存储时间：年，月，日，小时，分，秒，时区，夏令时信息。很容易的转换为便于显示的字符串，或者以上问题的答案。</p><p>你可以任意转换 <code>ClockTime</code> 和 <code>CalendarTime</code> 。Haskell 将 <code>ClockTime</code> 可以按本地时区转换为 <code>CalendarTime</code> ，或者按 <code>CalendarTime</code> 格式表示的 UTC 时间。</p><h4 id="使用-clocktime" tabindex="-1"><a class="header-anchor" href="#使用-clocktime"><span>使用 ClockTime</span></a></h4><p><code>ClockTime</code> 在 <code>System.Time</code> 中这样定义：</p><pre><code>data ClockTime = TOD Integer Integer
</code></pre><p>第一个 <code>Integer</code> 表示从 Unix 纪元开始经过的秒数。第二个 <code>Integer</code> 表示附加的皮秒数。因为 Haskell 中的 <code>ClockTime</code> 使用无边界的 <code>Integer</code> 类型，所以其能够表示的数据范围仅受计算资源限制。</p><p>让我们看看使用 <code>ClockTime</code> 的一些方法。首先是按系统时钟获取当前时间的 <code>getClockTime</code> 函数。</p><pre><code>ghci&gt; :module System.Time
ghci&gt; getClockTime
Loading package old-locale-1.0.0.0 ... linking ... done.
Loading package old-time-1.0.0.0 ... linking ... done.
Mon Aug 18 12:10:38 CDT 2008
</code></pre><p>如果一秒钟再次运行 <code>getClockTime</code> ，它将返回一个更新后的时间。这条命令会输出一个便于观察的字符串，补全了周相关的信息。这是由于 <code>ClockTime</code> 的 <code>Show</code> 实例。让我们从更底层看一下 <code>ClockTime</code> ：</p><pre><code>ghci&gt; TOD 1000 0
Wed Dec 31 18:16:40 CST 1969
ghci&gt; getClockTime &gt;&gt;= (\\(TOD sec _) -&gt; return sec)
1219079438
</code></pre><p>这里我们先构建一个 <code>ClockTime</code> ，表示 UTC 时间 1970 年 1 月 1 日午夜后 1000 秒这个时间点。在你的时区这个时间相当于 1969 年 12 月 31 日晚。</p><p>第二个例子演示如何从 <code>getClockTime</code> 返值中将秒数取出来。我们可以像这样操作它：</p><pre><code>ghci&gt; getClockTime &gt;&gt;= (\\(TOD sec _) -&gt; return (TOD (sec + 86400) 0))
Tue Aug 19 12:10:38 CDT 2008
</code></pre><p>这将显精确示你的时区 24 小时后的时间，因为 24 小时等于 86,400 秒。</p><h4 id="使用-calendartime" tabindex="-1"><a class="header-anchor" href="#使用-calendartime"><span>使用 CalendarTime</span></a></h4><p>正如其名字暗示的， <code>CalendarTime</code> 按日历上的方式表示时间。它包括年、月、日等信息。 <code>CalendarTime</code> 和其相关类型定义如下：</p><pre><code>data CalendarTime = CalendarTime
   {ctYear :: Int,         -- Year (post-Gregorian)
    ctMonth :: Month, 
    ctDay :: Int,          -- Day of the month (1 to 31)
    ctHour :: Int,         -- Hour of the day (0 to 23)
    ctMin :: Int,          -- Minutes (0 to 59)
    ctSec :: Int,          -- Seconds (0 to 61, allowing for leap seconds)
    ctPicosec :: Integer,  -- Picoseconds
    ctWDay :: Day,         -- Day of the week
    ctYDay :: Int,         -- Day of the year (0 to 364 or 365)
    ctTZName :: String,    -- Name of timezone
    ctTZ :: Int,           -- Variation from UTC in seconds
    ctIsDST :: Bool        -- True if Daylight Saving Time in effect
   }

data Month = January | February | March | April | May | June 
             | July | August | September | October | November | December

data Day = Sunday | Monday | Tuesday | Wednesday
           | Thursday | Friday | Saturday
</code></pre><p>关于以上结构有些事情需要强调：</p><blockquote><ul><li><code>ctWDay</code>, <code>ctYDay</code>, <code>ctTZName</code> 是被创建 <code>CalendarTime</code> 的库函数生成的，但是并不参与计算。如果你手工创建一个 <code>CalendarTime</code> ，不必向其中填写准确的值，除非你的计算依赖于它们。</li><li>这三个类型都是 <code>Eq</code>, <code>Ord</code>, <code>Read</code>, <code>Show</code> 类型类的成员。另外， <code>Month</code> 和 <code>Day</code> 都被声明为 <code>Enum</code> 和 <code>Bounded</code> 类型类的成员。更多的信息请参考 &quot;重要的类型类&quot; 这一章节。</li></ul></blockquote><p>有几种不同的途径可以生成 <code>CalendarTime</code> 。可以像这样将 <code>ClockTime</code> 转换为 <code>CalendarTime</code> ：</p><pre><code>ghci&gt; :module System.Time
ghci&gt; now &lt;- getClockTime
Loading package old-locale-1.0.0.0 ... linking ... done.
Loading package old-time-1.0.0.0 ... linking ... done.
Mon Aug 18 12:10:35 CDT 2008
ghci&gt; nowCal &lt;- toCalendarTime now
CalendarTime {ctYear = 2008, ctMonth = August, ctDay = 18, ctHour = 12, ctMin = 10, ctSec = 35, ctPicosec = 804267000000, ctWDay = Monday, ctYDay = 230, ctTZName = &quot;CDT&quot;, ctTZ = -18000, ctIsDST = True}
ghci&gt; let nowUTC = toUTCTime now
ghci&gt; nowCal
CalendarTime {ctYear = 2008, ctMonth = August, ctDay = 18, ctHour = 12, ctMin = 10, ctSec = 35, ctPicosec = 804267000000, ctWDay = Monday, ctYDay = 230, ctTZName = &quot;CDT&quot;, ctTZ = -18000, ctIsDST = True}
ghci&gt; nowUTC
CalendarTime {ctYear = 2008, ctMonth = August, ctDay = 18, ctHour = 17, ctMin = 10, ctSec = 35, ctPicosec = 804267000000, ctWDay = Monday, ctYDay = 230, ctTZName = &quot;UTC&quot;, ctTZ = 0, ctIsDST = False}
</code></pre><p>用 <code>getClockTime</code> 从系统获得当前的 <code>ClockTime</code> 。接下来， <code>toCalendarTime</code> 按本地时间区将 <code>ClockTime</code> 转换为 <code>CalendarTime</code> 。 <code>toUTCtime</code> 执行类似的转换，但其结果将以 UTC 时区表示。</p><p>注意， <code>toCalendarTime</code> 是一个 <code>IO</code> 函数，但是 <code>toUTCTime</code> 不是。原因是 <code>toCalendarTime</code> 依赖本地时区返回不同的结果，但是针对相同的 <code>ClockTime</code> ， <code>toUTCTime</code> 将始终返回相同的结果。</p><p>很容易改变一个 <code>CalendarTime</code> 的值</p><pre><code>ghci&gt; nowCal {ctYear = 1960}
CalendarTime {ctYear = 1960, ctMonth = August, ctDay = 18, ctHour = 12, ctMin = 10, ctSec = 35, ctPicosec = 804267000000, ctWDay = Monday, ctYDay = 230, ctTZName = &quot;CDT&quot;, ctTZ = -18000, ctIsDST = True}
ghci&gt; (\\(TOD sec _) -&gt; sec) (toClockTime nowCal)
1219079435
ghci&gt; (\\(TOD sec _) -&gt; sec) (toClockTime (nowCal {ctYear = 1960}))
-295685365
</code></pre><p>此处，先将之前的 <code>CalendarTime</code> 年份修改为 1960 。然后用 <code>toClockTime</code> 将其初始值转换为一个 <code>ClockTime</code> ，接着转换新值，以便观察其差别。注意新值在转换为 <code>ClockTime</code> 后显示了一个负的秒数。这是意料中的， <code>ClockTime</code> 表示的是 UTC 时间 1970 年 1 月 1 日午夜之后的秒数。</p><p>也可以像这样手工创建 <code>CalendarTime</code> ：</p><pre><code>ghci&gt; let newCT = CalendarTime 2010 January 15 12 30 0 0 Sunday 0 &quot;UTC&quot; 0 False
ghci&gt; newCT
CalendarTime {ctYear = 2010, ctMonth = January, ctDay = 15, ctHour = 12, ctMin = 30, ctSec = 0, ctPicosec = 0, ctWDay = Sunday, ctYDay = 0, ctTZName = &quot;UTC&quot;, ctTZ = 0, ctIsDST = False}
ghci&gt; (\\(TOD sec _) -&gt; sec) (toClockTime newCT)
1263558600
</code></pre><p>注意，尽管 2010 年 1 月 15 日并不是一个周日 -- 并且也不是一年中的第 0 天 -- 系统可以很好的处理这些情况。实际上，如果将其转换为 <code>ClockTime</code> 后再转回 <code>CalendarTime</code> ，你将发现这些域已经被正确的处理了。</p><pre><code>ghci&gt; toUTCTime . toClockTime $ newCT
CalendarTime {ctYear = 2010, ctMonth = January, ctDay = 15, ctHour = 12, ctMin = 30, ctSec = 0, ctPicosec = 0, ctWDay = Friday, ctYDay = 14, ctTZName = &quot;UTC&quot;, ctTZ = 0, ctIsDST = False}
</code></pre><h4 id="clocktime-的-timediff" tabindex="-1"><a class="header-anchor" href="#clocktime-的-timediff"><span>ClockTime 的 TimeDiff</span></a></h4><p>以对人类友好的方式难于处理 ClockTime 值之间的差异， <code>System.Time</code> 模块包括了一个 <code>TimeDiff</code> 类型。 <code>TimeDiff</code> 用于方便的处理这些差异。其定义如下：</p><pre><code>data TimeDiff = TimeDiff
   {tdYear :: Int,
    tdMonth :: Int,
    tdDay :: Int,
    tdHour :: Int,
    tdMin :: Int,
    tdSec :: Int,
    tdPicosec :: Integer}
</code></pre><p><code>diffClockTimes</code> 和 <code>addToClockTime</code> 两个函数接收一个 <code>ClockTime</code> 和一个 <code>TimeDiff</code> 并在内部将 <code>ClockTime</code> 转换为一个 UTC 时区的 <code>CalendarTime</code> ，在其上执行 <code>TimeDiff</code> ，最后将结果转换回一个 <code>ClockTime</code> 。</p><p>看看它怎样工作：</p><pre><code>ghci&gt; :module System.Time
ghci&gt; let feb5 = toClockTime $ CalendarTime 2008 February 5 0 0 0 0 Sunday 0 &quot;UTC&quot; 0 False
Loading package old-locale-1.0.0.0 ... linking ... done.
Loading package old-time-1.0.0.0 ... linking ... done.
ghci&gt; feb5
Mon Feb  4 18:00:00 CST 2008
ghci&gt; addToClockTime (TimeDiff 0 1 0 0 0 0 0) feb5
Tue Mar  4 18:00:00 CST 2008
ghci&gt; toUTCTime $ addToClockTime (TimeDiff 0 1 0 0 0 0 0) feb5
CalendarTime {ctYear = 2008, ctMonth = March, ctDay = 5, ctHour = 0, ctMin = 0, ctSec = 0, ctPicosec = 0, ctWDay = Wednesday, ctYDay = 64, ctTZName = &quot;UTC&quot;, ctTZ = 0, ctIsDST = False}
ghci&gt; let jan30 = toClockTime $ CalendarTime 2009 January 30 0 0 0 0 Sunday 0 &quot;UTC&quot; 0 False
ghci&gt; jan30
Thu Jan 29 18:00:00 CST 2009
ghci&gt; addToClockTime (TimeDiff 0 1 0 0 0 0 0) jan30
Sun Mar  1 18:00:00 CST 2009
ghci&gt; toUTCTime $ addToClockTime (TimeDiff 0 1 0 0 0 0 0) jan30
CalendarTime {ctYear = 2009, ctMonth = March, ctDay = 2, ctHour = 0, ctMin = 0, ctSec = 0, ctPicosec = 0, ctWDay = Monday, ctYDay = 60, ctTZName = &quot;UTC&quot;, ctTZ = 0, ctIsDST = False}
ghci&gt; diffClockTimes jan30 feb5
TimeDiff {tdYear = 0, tdMonth = 0, tdDay = 0, tdHour = 0, tdMin = 0, tdSec = 31104000, tdPicosec = 0}
ghci&gt; normalizeTimeDiff $ diffClockTimes jan30 feb5
TimeDiff {tdYear = 0, tdMonth = 12, tdDay = 0, tdHour = 0, tdMin = 0, tdSec = 0, tdPicosec = 0}
</code></pre><p>首先我们生成一个 <code>ClockTime</code> 表示 UTC 时间 2008 年 2 月 5 日。注意，若你的时区不是 UTC，按你本地时区的格式，当其被显示的时候可能是 2 月 4 日晚。</p><p>其次，我们用 <code>addToClockTime</code> 在其上加一个月。2008 是闰年，但系统可以正确的处理，然后我们得到了一个月后的相同日期。使用 <code>toUTCTime</code> ，我们可以看到以 UTC 时间表示的结果。</p><p>第二个实验，设定一个表示 UTC 时间 2009 年 1 月 30 日午夜的时间。2009 年不是闰年，所以我们可能很好奇其加上一个月是什么结果。因为 2009 年没有 2 月 29 日和 2 月 30 日，所以我们得到了 3 月 2 日。</p><p>最后，我们可以看到 <code>diffClockTimes</code> 怎样通过两个 <code>ClockTime</code> 值得到一个 <code>TimeDiff</code> ， 尽管其只包含秒和皮秒。 <code>normalizeTimeDiff</code> 函数接受一个 <code>TimeDiff</code> 将其重新按照人类的习惯格式化。</p><h3 id="文件修改日期" tabindex="-1"><a class="header-anchor" href="#文件修改日期"><span>文件修改日期</span></a></h3><p>很多程序需要找出某些文件的最后修改日期。 <code>ls</code> 和图形化的文件管理器是典型的需要显示文件最后变更时间的程序。 <code>System.Directory</code> 模块包含一个跨平台的 <code>getModificationTime</code> 函数。其接受一个文件名，返回一个表示文件最后变更日期的 <code>ClockTime</code> 。例如：</p><pre><code>ghci&gt; :module System.Directory
ghci&gt; getModificationTime &quot;/etc/passwd&quot;
Loading package old-locale-1.0.0.0 ... linking ... done.
Loading package old-time-1.0.0.0 ... linking ... done.
Loading package filepath-1.1.0.0 ... linking ... done.
Loading package directory-1.0.0.0 ... linking ... done.
Fri Aug 15 08:29:48 CDT 2008
</code></pre><p>POSIX 平台不仅维护变更时间 (被称为 mtime)， 还有最后读或写访问时间 (atime)以及最后状态变更时间 (ctime)。这是 POSIX 平台独有的，所以跨平台的 <code>System.Directory</code> 模块无法访问它。取而代之，需要使用 <code>System.Posix.Files</code> 模块中的函数。下面有一个例子：</p><pre><code>-- file: ch20/posixtime.hs
-- posixtime.hs

import System.Posix.Files
import System.Time
import System.Posix.Types

-- | Given a path, returns (atime, mtime, ctime)
getTimes :: FilePath -&gt; IO (ClockTime, ClockTime, ClockTime)
getTimes fp =
    do stat &lt;- getFileStatus fp
       return (toct (accessTime stat),
               toct (modificationTime stat),
               toct (statusChangeTime stat))

-- | Convert an EpochTime to a ClockTime
toct :: EpochTime -&gt; ClockTime
toct et = 
    TOD (truncate (toRational et)) 0
</code></pre><p>注意对 <code>getFileStatus</code> 的调用。 这个调用直接映射到 C 语言的 <code>stat()</code> 函数。其返回一个包含了大量不同种类信息的值，包括文件类型、权限、属主、组、和我们感性去的三种时间值。 <code>System.Posix.Files</code> 提供了 <code>accessTime</code> 等多个函数，可以将我们感兴趣的时间从 <code>getFileStatus</code> 返回的 <code>FileStatus</code> 类型中提取出来。</p><blockquote><p><code>accessTime</code> 等函数返回一个POSIX 平台特有的类型，称为 <code>EpochTime</code> ， 可以通过 <code>toct</code> 函数转换 <code>ClockTime</code> 。 <code>System.Posix.Files</code> 模块同样提供了 <code>setFileTimes</code> 函数，以设置文件的 <code>atime</code> 和 <code>mtime</code> 。[^3]</p></blockquote><h2 id="延伸的例子-管道" tabindex="-1"><a class="header-anchor" href="#延伸的例子-管道"><span>延伸的例子: 管道</span></a></h2><p>我们已经了解了如何调用外部程序。有时候需要更多的控制。比如获得程序的标准输出、提供输入，甚至将不同的外部程序串起来调用。管道有助于实现所有这些需求。管道经常用在 shell 脚本中。 在 shell 中设置一个管道，会调用多个程序。第一个程序的输入会做为第二个程序的输入。其输出又会作为第三个的输入，以此类推。最后一个程序通常将输出打印到终端，或者写入文件。下面是一个 POSIX shell 的例子，演示如何使用管道：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">ls</span> /etc <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">&#39;m.*ap&#39;</span> <span class="token operator">|</span> <span class="token function">tr</span> a-z A-Z
IDMAPD.CONF
MAILCAP
MAILCAP.ORDER
MEDIAPRM
TERMCAP
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这条命令运行了三个程序，使用管道在它们之间传输数据。它以 <code>ls/etc</code> 开始，输出是 <code>/etc</code> 目录下全部文件和目录的列表。 <code>ls</code> 的输出被作为 <code>grep</code> 的输入。我们想 <code>grep</code> 输入一条正则使其只输出以 &#39;m&#39; 开头并且在某处包含 &quot;ap&quot; 的行。最后，其结果被传入 <code>tr</code> 。我们给 <code>tr</code> 设置一个选项，使其将所有字符转换为大写。 <code>tr</code> 的输出没有特殊的去处，所以直接在屏幕显示。</p><p>这种情况下，程序之间的管道线路由 shell 设置。我们可以使用 Haskell 中的 POSIX 工具实现同的事情。</p><p>在讲解如何实现之前，要提醒你一下， <code>System.Posix</code> 模块提供的是很低阶的 Unix 系统接口。无论使用何种编程语言，这些接口都可以相互组合，组合的结果也可以相互组合。这些低阶接口的完整性质可以用一整本书来讨论，这章中我们只会简单介绍。</p><h3 id="使用管道做重定向" tabindex="-1"><a class="header-anchor" href="#使用管道做重定向"><span>使用管道做重定向</span></a></h3><p>POSIX 定义了一个函数用于创建管道。这个函数返回两个文件描述符（FD），与 Haskell 中的句柄概念类似。一个 FD 用于读端，另一个用于写端。任何从写端写入的东西，都可以从读端读取。这些数据就是&quot;通过管道推送&quot;的。在 Haskell 中，你可以通过 <code>createPipe</code> 使用这个接口。</p><p>在外部程序之间传递数据之前，要做的第一步是建立一个管道。同时还要将一个程序的输出重定向到管道，并将管道做为另一个程序的输入。 Haskell 的 <code>dupTo</code> 函数就是做这个的。其接收一个 FD 并将其拷贝为另一个 FD 号。 POSIX 的标准输入、标准输出和标准错误的 FD 分别被预定义为 0, 1, 2 。将管道的某一端设置为这些 FD 号，我们就可以有效的重定向程序的输入和输出。</p><p>不过还有问题需要解决。我们不能简单的只是在某个调用比如 <code>rawSystem</code> 之前使用 <code>dupTo</code> ，因为这回混淆我们的 Haskell 主程序的输入和输出。此外， <code>rawSystem</code> 会一直阻塞直到被调用的程序执行完毕，这让我们无法启动并行执行的进程。 为了解决这个问题，可以使用 <code>forkProcess</code> 。这是一个很特殊的函数。它实际上生成了一份当前进程的拷贝，并使这两份进程同时运行。 Haskell 的 <code>forkProcess</code> 函数接收一个函数，使其在新进程（称为子进程）中运行。我们让这个函数调用 <code>dupTo</code> 。之后，其调用 <code>executeFile</code> 调用真正希望执行的命令。这同样也是一个特殊的函数：如果一切顺利，他将不会返回。这是因为 <code>executeFile</code> 使用一个不同的程序替换了当前执行的进程。最后，初始的 Haskell 进程调用 <code>getProcessStatus</code> 以等待子进程结束，并获得其状态码。</p><p>在 POSIX 系统中，无论何时你执行一条命令，不关是在命令上上敲 <code>ls</code> 还是在 Haskell 中使用 <code>rawSystem</code> ，其内部机理都是调用 <code>forkProcess</code> , <code>executeFile</code> , 和 <code>getProcessStatusa</code> (或是它们对应的 C 函数)。为了使用管道，我们复制了系统启动程序的进程，并且加入了一些调用和重定向管道的步骤。</p><p>还有另外一些辅助步骤需要注意。当调用 <code>forkProcess</code> 时，&quot;几乎&quot;和程序有关的一切都被复制<a href="%E7%BA%BF%E7%A8%8B%E6%98%AF%E4%B8%80%E4%B8%AA%E4%B8%BB%E8%A6%81%E4%BE%8B%E5%A4%96%EF%BC%8C%E5%85%B6%E4%B8%8D%E4%BC%9A%E8%A2%AB%E5%A4%8D%E5%88%B6%EF%BC%8C%E6%89%80%E4%BB%A5%E8%AF%B4%22%E5%87%A0%E4%B9%8E%22%E3%80%82">^4</a> 。包括所有已经打开的文件描述符（句柄）。程序通过检查管道是否传来文件结束符判断数据接收是否结束。写端进程关闭管道时，读端程序将收到文件结束符。然而，如果同一个写端文件描述符在多个进程中同时存在，则文件结束符要在所有进程中都被关闭才会发送文件结束符。因此，我们必须在子进程中追踪打开了哪些文件描述符，以便关闭它们。同样，也必须尽早在主进程中关闭子进程的写管道。</p><p>下面是一个用 Haskell 编写的管道系统的初始实现：</p><pre><code>-- file: ch20/RunProcessSimple.hs

{-# OPTIONS_GHC -XDatatypeContexts #-}
{-# OPTIONS_GHC -XTypeSynonymInstances #-}
{-# OPTIONS_GHC -XFlexibleInstances #-}

module RunProcessSimple where

--import System.Process
import Control.Concurrent
import Control.Concurrent.MVar
import System.IO
import System.Exit
import Text.Regex.Posix
import System.Posix.Process
import System.Posix.IO
import System.Posix.Types
import Control.Exception

{- | The type for running external commands.  The first part
of the tuple is the program name.  The list represents the
command-line parameters to pass to the command. -}
type SysCommand = (String, [String])

{- | The result of running any command -}
data CommandResult = CommandResult {
    cmdOutput :: IO String,              -- ^ IO action that yields the output
    getExitStatus :: IO ProcessStatus    -- ^ IO action that yields exit result
    }

{- | The type for handling global lists of FDs to always close in the clients
-}
type CloseFDs = MVar [Fd]

{- | Class representing anything that is a runnable command -}
class CommandLike a where
    {- | Given the command and a String representing input,
         invokes the command.  Returns a String
         representing the output of the command. -}
    invoke :: a -&gt; CloseFDs -&gt; String -&gt; IO CommandResult

-- Support for running system commands
instance CommandLike SysCommand where
    invoke (cmd, args) closefds input =
        do -- Create two pipes: one to handle stdin and the other
           -- to handle stdout.  We do not redirect stderr in this program.
           (stdinread, stdinwrite) &lt;- createPipe
           (stdoutread, stdoutwrite) &lt;- createPipe

           -- We add the parent FDs to this list because we always need
           -- to close them in the clients.
           addCloseFDs closefds [stdinwrite, stdoutread]

           -- Now, grab the closed FDs list and fork the child.
           childPID &lt;- withMVar closefds (\\fds -&gt;
                          forkProcess (child fds stdinread stdoutwrite))

           -- Now, on the parent, close the client-side FDs.
           closeFd stdinread
           closeFd stdoutwrite

           -- Write the input to the command.
           stdinhdl &lt;- fdToHandle stdinwrite
           forkIO $ do hPutStr stdinhdl input
                       hClose stdinhdl

           -- Prepare to receive output from the command
           stdouthdl &lt;- fdToHandle stdoutread

           -- Set up the function to call when ready to wait for the
           -- child to exit.
           let waitfunc = 
                do status &lt;- getProcessStatus True False childPID
                   case status of
                       Nothing -&gt; fail $ &quot;Error: Nothing from getProcessStatus&quot;
                       Just ps -&gt; do removeCloseFDs closefds 
                                          [stdinwrite, stdoutread]
                                     return ps
           return $ CommandResult {cmdOutput = hGetContents stdouthdl,
                                   getExitStatus = waitfunc}

        -- Define what happens in the child process
        where child closefds stdinread stdoutwrite = 
                do -- Copy our pipes over the regular stdin/stdout FDs
                   dupTo stdinread stdInput
                   dupTo stdoutwrite stdOutput

                   -- Now close the original pipe FDs
                   closeFd stdinread
                   closeFd stdoutwrite

                   -- Close all the open FDs we inherited from the parent
                   mapM_ (\\fd -&gt; catch (closeFd fd) (\\(SomeException e) -&gt; return ())) closefds

                   -- Start the program
                   executeFile cmd True args Nothing

-- Add FDs to the list of FDs that must be closed post-fork in a child
addCloseFDs :: CloseFDs -&gt; [Fd] -&gt; IO ()
addCloseFDs closefds newfds =
    modifyMVar_ closefds (\\oldfds -&gt; return $ oldfds ++ newfds)

-- Remove FDs from the list
removeCloseFDs :: CloseFDs -&gt; [Fd] -&gt; IO ()
removeCloseFDs closefds removethem =
    modifyMVar_ closefds (\\fdlist -&gt; return $ procfdlist fdlist removethem)

    where
    procfdlist fdlist [] = fdlist
    procfdlist fdlist (x:xs) = procfdlist (removefd fdlist x) xs

    -- We want to remove only the first occurance ot any given fd
    removefd [] _ = []
    removefd (x:xs) fd 
        | fd == x = xs
        | otherwise = x : removefd xs fd

{- | Type representing a pipe.  A &#39;PipeCommand&#39; consists of a source
and destination part, both of which must be instances of
&#39;CommandLike&#39;. -}
data (CommandLike src, CommandLike dest) =&gt; 
     PipeCommand src dest = PipeCommand src dest 

{- | A convenient function for creating a &#39;PipeCommand&#39;. -}
(-|-) :: (CommandLike a, CommandLike b) =&gt; a -&gt; b -&gt; PipeCommand a b
(-|-) = PipeCommand

{- | Make &#39;PipeCommand&#39; runnable as a command -}
instance (CommandLike a, CommandLike b) =&gt;
         CommandLike (PipeCommand a b) where
    invoke (PipeCommand src dest) closefds input =
        do res1 &lt;- invoke src closefds input
           output1 &lt;- cmdOutput res1
           res2 &lt;- invoke dest closefds output1
           return $ CommandResult (cmdOutput res2) (getEC res1 res2)

{- | Given two &#39;CommandResult&#39; items, evaluate the exit codes for
both and then return a &quot;combined&quot; exit code.  This will be ExitSuccess
if both exited successfully.  Otherwise, it will reflect the first
error encountered. -}
getEC :: CommandResult -&gt; CommandResult -&gt; IO ProcessStatus 
getEC src dest =
    do sec &lt;- getExitStatus src
       dec &lt;- getExitStatus dest
       case sec of
            Exited ExitSuccess -&gt; return dec
            x -&gt; return x

{- | Execute a &#39;CommandLike&#39;. -}
runIO :: CommandLike a =&gt; a -&gt; IO ()
runIO cmd =
    do -- Initialize our closefds list
       closefds &lt;- newMVar []

       -- Invoke the command
       res &lt;- invoke cmd closefds []

       -- Process its output
       output &lt;- cmdOutput res
       putStr output

       -- Wait for termination and get exit status
       ec &lt;- getExitStatus res
       case ec of
            Exited ExitSuccess -&gt; return ()
            x -&gt; fail $ &quot;Exited: &quot; ++ show x
</code></pre><p>在研究这个函数的运作原理之前， 让我们先来在 <code>ghci</code> 里面尝试运行它一下：</p><pre><code>ghci&gt; runIO $ (&quot;pwd&quot;, []::[String])
/Users/Blade/sandbox

ghci&gt; runIO $ (&quot;ls&quot;, [&quot;/usr&quot;])
NX
X11
X11R6
bin
include
lib
libexec
local
sbin
share
standalone

ghci&gt; runIO $ (&quot;ls&quot;, [&quot;/usr&quot;]) -|- (&quot;grep&quot;, [&quot;^l&quot;])
lib
libexec
local

ghci&gt; runIO $ (&quot;ls&quot;, [&quot;/etc&quot;]) -|- (&quot;grep&quot;, [&quot;m.*ap&quot;]) -|- (&quot;tr&quot;, [&quot;a-z&quot;, &quot;A-Z&quot;])
COM.APPLE.SCREENSHARING.AGENT.LAUNCHD  
</code></pre><p>我们从一个简单的命令 <code>pwd</code> 开始，它会打印当前工作目录。我们将 [] 做为参数列表，因为 <code>pwd</code> 不需要任何参数。由于使用了类型类， Haskell 无法自动推导出 [] 的类型，所以我们说明其类型为字符串组成的列表。</p><p>下面是一个更复杂些的例子。我们执行了 <code>ls</code> ，将其输出传入 <code>grep</code> 。最后我们通过管道，调用了一个与本节开始处 shell 内置管道的例子中相同的命令。不像 shell 中那样舒服，但是相对于 shell 我们的程序始终相对简单。</p><p>让我们读一下程序。起始处的 <code>OPTIONS_GHC</code> 语句，作用与 ghc 或 ghci 开始时传入 <code>-fglasgow-exts</code> 参数相同。我们使用了一个 GHC 扩展，以允许使用 <code>(String, [String])</code> 类型作为一个类型类的实例[^5] 。将此类声明加入源码文件，就不用在每次调用这个模块的时候都要记得手工打开编译器开关。</p><p>在载入了所需模块之后，定义了一些类型。首先，定义 <code>type SysCommand = (String, [String])</code> 作为一个别名。这是系统将接收并执行的命令的类型。例子中的每条领命都要用到这个类型的数据。 <code>CommandResult</code> 命令用于表示给定命令的执行结果， <code>CloseFDs</code> 用于表示必须在新的子进程中关闭的文件描述符列表。</p><p>接着，定义一个类称为 <code>CommandLike</code> 。这个类用来跑 &quot;东西&quot; ，这个&quot;东西&quot; 可以是独立的程序，可以是两个程序之间的管道，未来也可以跑纯 Haskell 函数。任何一个类型想为这个类的成员，只需实现一个函数 -- <code>invoke</code> 。这将允许以 <code>runIO</code> 启动一个独立命令或者一个管道。这在定义管道时也很有用，因为我们可以拥有某个管道的读写两端的完整调用栈。</p><p>我们的管道基础设施将使用字符串在进程间传递数据。我们将通过 <code>hGetContents</code> 获得 Haskell 在延迟读取方面的优势，并使用 <code>forkIO</code> 在后台写入。这种设计工作得不错，尽管传输速度不像将两个进程的管道读写端直接连接起来那样快[^6] 。但这让实现很简单。我们仅需要小心，不要做任何会让整个字符串被缓冲的操作，把接下来的工作完全交给 Haskell 的延迟特性。</p><p>接下来，为 <code>SysCommand</code> 定义一个 <code>CommandLike</code> 实例。我们创建两个管道：一个用来作为新进程的标准输入，另一个用于其标准输出。将产生两个读端两个写端，四个文件描述符。我们将要在子进程中关闭的文件描述符加入列表。这包括子进程标准输入的写端，和子进程标准输出的读端。接着，我们 <code>fork</code> 出子进程。然后可以在父进程中关闭相关的子进程文件描述符。 <code>fork</code> 之前不能这样做，因为那时子进程还不可用。获取 <code>stdinwrite</code> 的句柄，并通过 <code>forkIO</code> 启动一个现成向其写入数据。接着定义 <code>waitfunc</code> , 其中定义了调用这在准备好等待子进程结束时要执行的动作。同时，子进程使用 <code>dupTo</code> ，关闭其不需要的文件描述符。并执行命令。</p><p>然后定义一些工具函数用来管理文件描述符。此后，定义一些工具用于建立管道。首先，定义一个新类型 <code>PipeCommand</code> ，其有源和目的两个属性。源和目的都必须是 <code>CommandLike</code> 的成员。为了方便，我们还定义了 <code>-|-</code> 操作符。然后使 <code>PipeCommand</code> 成为 <code>CommandLike</code> 的实例。它调用第一个命令并获得输出，将其传入第二个命令。之后返回第二个命令的输出，并调用 <code>getExitStatus</code> 函数等待命令执行结束并检查整组命令执行之后的状态码。</p><p>最后以定义 <code>runIO</code> 结束。这个函数建立了需要在子进程中关闭的 FDS 列表，执行程序，显示输出，并检查其退出状态。</p><h3 id="更好的管道" tabindex="-1"><a class="header-anchor" href="#更好的管道"><span>更好的管道</span></a></h3><p>上个例子中解决了一个类似 shell 的管道系统的基本需求。但是为它加上下面这些特点之后就更好了：</p><blockquote><ul><li>支持更多的 shell 语法。</li><li>使管道同时支持外部程序和正规 Haskell 函数，并使二者可以自由的混合使用。</li><li>以易于 Haskell 程序利用的方式返回标准输出和退出状态码。</li></ul></blockquote><p>幸运的是，支持这些功能的代码片段已经差不多就位了。只需要为 <code>CommandLike</code> 多加入几个实例，以及一些类似 <code>runIO</code> 的函数。下面是修订后实现了以上功能的例子代码：</p><pre><code>-- file: ch20/RunProcess.hs
{-# OPTIONS_GHC -XDatatypeContexts #-}
{-# OPTIONS_GHC -XTypeSynonymInstances #-}
{-# OPTIONS_GHC -XFlexibleInstances #-}

module RunProcess where

import System.Process
import Control.Concurrent
import Control.Concurrent.MVar
import Control.Exception
import System.Posix.Directory
import System.Directory(setCurrentDirectory)
import System.IO
import System.Exit
import Text.Regex
import System.Posix.Process
import System.Posix.IO
import System.Posix.Types
import Data.List
import System.Posix.Env(getEnv)

{- | The type for running external commands.  The first part
of the tuple is the program name.  The list represents the
command-line parameters to pass to the command. -}
type SysCommand = (String, [String])

{- | The result of running any command -}
data CommandResult = CommandResult {
    cmdOutput :: IO String,              -- ^ IO action that yields the output
    getExitStatus :: IO ProcessStatus    -- ^ IO action that yields exit result
    }

{- | The type for handling global lists of FDs to always close in the clients
-}
type CloseFDs = MVar [Fd]

{- | Class representing anything that is a runnable command -}
class CommandLike a where
    {- | Given the command and a String representing input,
         invokes the command.  Returns a String
         representing the output of the command. -}
    invoke :: a -&gt; CloseFDs -&gt; String -&gt; IO CommandResult

-- Support for running system commands
instance CommandLike SysCommand where
    invoke (cmd, args) closefds input =
        do -- Create two pipes: one to handle stdin and the other
           -- to handle stdout.  We do not redirect stderr in this program.
           (stdinread, stdinwrite) &lt;- createPipe
           (stdoutread, stdoutwrite) &lt;- createPipe

           -- We add the parent FDs to this list because we always need
           -- to close them in the clients.
           addCloseFDs closefds [stdinwrite, stdoutread]

           -- Now, grab the closed FDs list and fork the child.
           childPID &lt;- withMVar closefds (\\fds -&gt;
                          forkProcess (child fds stdinread stdoutwrite))

           -- Now, on the parent, close the client-side FDs.
           closeFd stdinread
           closeFd stdoutwrite

           -- Write the input to the command.
           stdinhdl &lt;- fdToHandle stdinwrite
           forkIO $ do hPutStr stdinhdl input
                       hClose stdinhdl

           -- Prepare to receive output from the command
           stdouthdl &lt;- fdToHandle stdoutread

           -- Set up the function to call when ready to wait for the
           -- child to exit.
           let waitfunc = 
                do status &lt;- getProcessStatus True False childPID
                   case status of
                       Nothing -&gt; fail $ &quot;Error: Nothing from getProcessStatus&quot;
                       Just ps -&gt; do removeCloseFDs closefds 
                                          [stdinwrite, stdoutread]
                                     return ps
           return $ CommandResult {cmdOutput = hGetContents stdouthdl,
                                   getExitStatus = waitfunc}

        -- Define what happens in the child process
        where child closefds stdinread stdoutwrite = 
                do -- Copy our pipes over the regular stdin/stdout FDs
                   dupTo stdinread stdInput
                   dupTo stdoutwrite stdOutput

                   -- Now close the original pipe FDs
                   closeFd stdinread
                   closeFd stdoutwrite

                   -- Close all the open FDs we inherited from the parent
                   mapM_ (\\fd -&gt; catch (closeFd fd) (\\(SomeException e) -&gt; return ())) closefds

                   -- Start the program
                   executeFile cmd True args Nothing

{- | An instance of &#39;CommandLike&#39; for an external command.  The String is
passed to a shell for evaluation and invocation. -}
instance CommandLike String where
    invoke cmd closefds input =
        do -- Use the shell given by the environment variable SHELL,
           -- if any.  Otherwise, use /bin/sh
           esh &lt;- getEnv &quot;SHELL&quot;
           let sh = case esh of
                       Nothing -&gt; &quot;/bin/sh&quot;
                       Just x -&gt; x
           invoke (sh, [&quot;-c&quot;, cmd]) closefds input

-- Add FDs to the list of FDs that must be closed post-fork in a child
addCloseFDs :: CloseFDs -&gt; [Fd] -&gt; IO ()
addCloseFDs closefds newfds =
    modifyMVar_ closefds (\\oldfds -&gt; return $ oldfds ++ newfds)

-- Remove FDs from the list
removeCloseFDs :: CloseFDs -&gt; [Fd] -&gt; IO ()
removeCloseFDs closefds removethem =
    modifyMVar_ closefds (\\fdlist -&gt; return $ procfdlist fdlist removethem)

    where
    procfdlist fdlist [] = fdlist
    procfdlist fdlist (x:xs) = procfdlist (removefd fdlist x) xs

    -- We want to remove only the first occurance ot any given fd
    removefd [] _ = []
    removefd (x:xs) fd 
        | fd == x = xs
        | otherwise = x : removefd xs fd

-- Support for running Haskell commands
instance CommandLike (String -&gt; IO String) where
    invoke func _ input =
       return $ CommandResult (func input) (return (Exited ExitSuccess))

-- Support pure Haskell functions by wrapping them in IO
instance CommandLike (String -&gt; String) where
    invoke func = invoke iofunc
        where iofunc :: String -&gt; IO String
              iofunc = return . func

-- It&#39;s also useful to operate on lines.  Define support for line-based
-- functions both within and without the IO monad.

instance CommandLike ([String] -&gt; IO [String]) where
    invoke func _ input =
           return $ CommandResult linedfunc (return (Exited ExitSuccess))
       where linedfunc = func (lines input) &gt;&gt;= (return . unlines)

instance CommandLike ([String] -&gt; [String]) where
    invoke func = invoke (unlines . func . lines)

{- | Type representing a pipe.  A &#39;PipeCommand&#39; consists of a source
and destination part, both of which must be instances of
&#39;CommandLike&#39;. -}
data (CommandLike src, CommandLike dest) =&gt; 
     PipeCommand src dest = PipeCommand src dest 

{- | A convenient function for creating a &#39;PipeCommand&#39;. -}
(-|-) :: (CommandLike a, CommandLike b) =&gt; a -&gt; b -&gt; PipeCommand a b
(-|-) = PipeCommand

{- | Make &#39;PipeCommand&#39; runnable as a command -}
instance (CommandLike a, CommandLike b) =&gt;
         CommandLike (PipeCommand a b) where
    invoke (PipeCommand src dest) closefds input =
        do res1 &lt;- invoke src closefds input
           output1 &lt;- cmdOutput res1
           res2 &lt;- invoke dest closefds output1
           return $ CommandResult (cmdOutput res2) (getEC res1 res2)

{- | Given two &#39;CommandResult&#39; items, evaluate the exit codes for
both and then return a &quot;combined&quot; exit code.  This will be ExitSuccess
if both exited successfully.  Otherwise, it will reflect the first
error encountered. -}
getEC :: CommandResult -&gt; CommandResult -&gt; IO ProcessStatus 
getEC src dest =
    do sec &lt;- getExitStatus src
       dec &lt;- getExitStatus dest
       case sec of
            Exited ExitSuccess -&gt; return dec
            x -&gt; return x

{- | Different ways to get data from &#39;run&#39;.

 * IO () runs, throws an exception on error, and sends stdout to stdout

 * IO String runs, throws an exception on error, reads stdout into
   a buffer, and returns it as a string.

 * IO [String] is same as IO String, but returns the results as lines

 * IO ProcessStatus runs and returns a ProcessStatus with the exit
   information.  stdout is sent to stdout.  Exceptions are not thrown.

 * IO (String, ProcessStatus) is like IO ProcessStatus, but also
   includes a description of the last command in the pipe to have
   an error (or the last command, if there was no error)

 * IO Int returns the exit code from a program directly.  If a signal
   caused the command to be reaped, returns 128 + SIGNUM.

 * IO Bool returns True if the program exited normally (exit code 0,
   not stopped by a signal) and False otherwise.

-}
class RunResult a where
    {- | Runs a command (or pipe of commands), with results presented
       in any number of different ways. -}
    run :: (CommandLike b) =&gt; b -&gt; a

-- | Utility function for use by &#39;RunResult&#39; instances
setUpCommand :: CommandLike a =&gt; a -&gt; IO CommandResult
setUpCommand cmd = 
    do -- Initialize our closefds list
       closefds &lt;- newMVar []

       -- Invoke the command
       invoke cmd closefds []

instance RunResult (IO ()) where
    run cmd = run cmd &gt;&gt;= checkResult

instance RunResult (IO ProcessStatus) where
    run cmd = 
        do res &lt;- setUpCommand cmd

           -- Process its output
           output &lt;- cmdOutput res
           putStr output

           getExitStatus res

instance RunResult (IO Int) where
    run cmd = do rc &lt;- run cmd
                 case rc of
                   Exited (ExitSuccess) -&gt; return 0
                   Exited (ExitFailure x) -&gt; return x
                   (Terminated x _) -&gt; return (128 + (fromIntegral x))
                   Stopped x -&gt; return (128 + (fromIntegral x))

instance RunResult (IO Bool) where
    run cmd = do rc &lt;- run cmd
                 return ((rc::Int) == 0)

instance RunResult (IO [String]) where
    run cmd = do r &lt;- run cmd
                 return (lines r)

instance RunResult (IO String) where
    run cmd =
        do res &lt;- setUpCommand cmd

           output &lt;- cmdOutput res

           -- Force output to be buffered
           evaluate (length output)

           ec &lt;- getExitStatus res
           checkResult ec
           return output

checkResult :: ProcessStatus -&gt; IO ()
checkResult ps =
    case ps of
         Exited (ExitSuccess) -&gt; return ()
         x -&gt; fail (show x)

{- | A convenience function.  Refers only to the version of &#39;run&#39;
that returns @IO ()@.  This prevents you from having to cast to it
all the time when you do not care about the result of &#39;run&#39;.
-}
runIO :: CommandLike a =&gt; a -&gt; IO ()
runIO = run

------------------------------------------------------------
-- Utility Functions
------------------------------------------------------------
cd :: FilePath -&gt; IO ()
cd = setCurrentDirectory

{- | Takes a string and sends it on as standard output.
The input to this function is never read. -}
echo :: String -&gt; String -&gt; String
echo inp _ = inp

-- | Search for the regexp in the lines.  Return those that match.
grep :: String -&gt; [String] -&gt; [String]
grep pat = filter (ismatch regex)
    where regex = mkRegex pat
          ismatch r inp = case matchRegex r inp of
                            Nothing -&gt; False
                            Just _ -&gt; True

{- | Creates the given directory.  A value of 0o755 for mode would be typical.
An alias for System.Posix.Directory.createDirectory. -}
mkdir :: FilePath -&gt; FileMode -&gt; IO ()
mkdir = createDirectory

{- | Remove duplicate lines from a file (like Unix uniq).
Takes a String representing a file or output and plugs it through 
lines and then nub to uniqify on a line basis. -}
uniq :: String -&gt; String
uniq = unlines . nub . lines

-- | Count number of lines.  wc -l
wcL, wcW :: [String] -&gt; [String]
wcL inp = [show (genericLength inp :: Integer)]

-- | Count number of words in a file (like wc -w)
wcW inp = [show ((genericLength $ words $ unlines inp) :: Integer)]

sortLines :: [String] -&gt; [String]
sortLines = sort

-- | Count the lines in the input
countLines :: String -&gt; IO String
countLines = return . (++) &quot;\\n&quot; . show . length . lines
</code></pre><p>主要改变是：</p><blockquote><ul><li><code>String</code> 的 <code>CommandLike</code> 实例，以便在 shell 中对字符串进行求值和调用。</li><li><code>String -&gt; IO String</code> 的实例，以及其它几种相关类型的实现。这样就可以像处理命令一样处理 Haskell 函数。</li><li><code>RunResult</code> 类型类，定义了一个 <code>run</code> 函数，其可以用多种不同方式返回命令的相关信息。</li><li>一些工具函数，提供了用 Haskell 实现的类 Unix shell 命令。</li></ul></blockquote><p>现在来试试这些新特性。首先确定一下之前例子中的命令是否还能工作。然后，使用新的类 shell 语法运行一下。</p><pre><code>ghci&gt; :load RunProcess.hs
[1 of 1] Compiling RunProcess       ( RunProcess.hs, interpreted )
Ok, modules loaded: RunProcess.

ghci&gt; runIO $ (&quot;ls&quot;, [&quot;/etc&quot;]) -|- (&quot;grep&quot;, [&quot;m.*ap&quot;]) -|- (&quot;tr&quot;, [&quot;a-z&quot;, &quot;A-Z&quot;])
Loading package array-0.5.0.0 ... linking ... done.
Loading package deepseq-1.3.0.2 ... linking ... done.
Loading package bytestring-0.10.4.0 ... linking ... done.
Loading package containers-0.5.5.1 ... linking ... done.
Loading package filepath-1.3.0.2 ... linking ... done.
Loading package old-locale-1.0.0.6 ... linking ... done.
Loading package time-1.4.2 ... linking ... done.
Loading package unix-2.7.0.1 ... linking ... done.
Loading package directory-1.2.1.0 ... linking ... done.
Loading package process-1.2.0.0 ... linking ... done.
Loading package transformers-0.3.0.0 ... linking ... done.
Loading package mtl-2.1.3.1 ... linking ... done.
Loading package regex-base-0.93.2 ... linking ... done.
Loading package regex-posix-0.95.2 ... linking ... done.
Loading package regex-compat-0.95.1 ... linking ... done.
COM.APPLE.SCREENSHARING.AGENT.LAUNCHD

ghci&gt; runIO $ &quot;ls /etc&quot; -|- &quot;grep &#39;m.*ap&#39;&quot; -|- &quot;tr a-z A-Z&quot;
COM.APPLE.SCREENSHARING.AGENT.LAUNCHD
</code></pre><p>输入起来容易多了。试试使用 Haskell 实现的 grep 来试一下其它的新特性：</p><pre><code>ghci&gt; runIO $ &quot;ls /usr/local/bin&quot; -|- grep &quot;m.*ap&quot; -|- &quot;tr a-z A-Z&quot;
DUMPCAP
MERGECAP
NMAP

ghci&gt; run $ &quot;ls /usr/local/bin&quot; -|- grep &quot;m.*ap&quot; -|- &quot;tr a-z A-Z&quot; :: IO String
&quot;DUMPCAP\\nMERGECAP\\nNMAP\\n&quot;

ghci&gt; run $ &quot;ls /usr/local/bin&quot; -|- grep &quot;m.*ap&quot; -|- &quot;tr a-z A-Z&quot; :: IO [String]
[&quot;DUMPCAP&quot;,&quot;MERGECAP&quot;,&quot;NMAP&quot;]

ghci&gt; run $ &quot;ls /usr&quot; :: IO String
&quot;X11\\nX11R6\\nbin\\ninclude\\nlib\\nlibexec\\nlocal\\nsbin\\nshare\\nstandalone\\ntexbin\\n&quot;

ghci&gt; run $ &quot;ls /usr&quot; :: IO Int
X11
X11R6
bin
include
lib
libexec
local
sbin
share
standalone
texbin
0

ghci&gt; runIO $ echo &quot;Line1\\nHi, test\\n&quot; -|- &quot;tr a-z A-Z&quot; -|- sortLines
HI, TEST
LINE1
</code></pre><h3 id="关于管道-最后说几句" tabindex="-1"><a class="header-anchor" href="#关于管道-最后说几句"><span>关于管道，最后说几句</span></a></h3><p>我们开发了一个精巧的系统。前面时醒过， POSIX 有时会很复杂。另外要强调一下：要始终注意确保先将这些函数返回的字符串求值，然后再尝试获取子进程的退出状态码。子进程经常要等待写出其所有输出之后才能退出，如果搞错了获取输出和退出状态码的顺序，你的程序会挂住。</p>`,95),T=e("code",null,"HSH",-1),S=e("code",null,"HSH",-1),y=e("code",null,"HSH",-1),x=e("code",null,"HSH",-1),D=e("code",null,"HSH",-1),w={href:"http://software.complete.org/hsh%E8%AE%BF%E9%97%AE",target:"_blank",rel:"noopener noreferrer"},I=e("code",null,"HSH",-1),P=n("<p><strong>注</strong></p><p>[^1]: 也有一个 <code>system</code> 函数，接受单个字符串为参数，并将其传入 shell 解析。我们推荐使用 <code>rawSystem</code> ，因为某些字符在 shell 中具有特殊含义，可能会导致安全隐患或者意外的行为。</p><p>[^2]: 可能有人会注意到 UTC 定义了不规则的闰秒。在 Haskell 使用的 POSIX 标准中，规定了在其表示的时间中，每天必须都是精确的 86,400 秒，所以在执行日常计算时无需担心闰秒。精确的处理闰秒依赖于系统而且复杂，不过通常其可以被解释为一个&quot;长秒&quot;。这个问题大体上只是在执行精确的亚秒级计算时才需要关心。</p><p>[^3]: POSIX 系统上通常无法设置 <code>ctime</code> 。</p><p>[^5]: Haskell 社区对这个扩展支持得很好。 Hugs 用户可以通过 <code>hugs -98 +o</code> 使用。</p><p>[^6]: Haskell 的 HSH 库提供了与此相近的 API ，使用了更高效（也更复杂）的机构将外部进程使用管道直接连接起来，没有要传给 Haskell 处理的数据。shell 采用了相同的方法，而且这样可以降低处理管道的 CPU 负载。</p>",6);function b(O,E){const o=d("ExternalLinkIcon");return s(),a("div",null,[l,e("p",null,[e("a",u,[t("System.Directory 的库文档"),c(o)]),t(" 中含有一份详尽的函数列表。让我们通过 ghci 来对其中一些进行演示。这些函数大多数简单的等价于其对应的 C 语言库函数或 shell 命令。")]),m,p,g,h,f,C,k,q,e("p",null,[t("本章中，我们从零开始开发了一个精简版的 "),T,t(" 。如果你希望使程序具有这样类 shell 的功能，我们推荐使用 "),S,t(" 而非上面开发的例子，因为 "),y,t(" 的实现更加优化。"),x,t(" 还有一个数量庞大的工具函数集和更多功能，但其背后的代码也更加庞大和复杂。其实例子中很多工具函数的代码我们是直接从 "),D,t(" 抄过来的。可以从 "),e("a",w,[t("http://software.complete.org/hsh访问"),c(o)]),t(),I,t(" 的源码。")]),P])}const H=i(r,[["render",b],["__file","20.html.vue"]]),L=JSON.parse('{"path":"/%E5%AD%A6%E4%B9%A0/Haskell%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3/20.html","title":"第 20 章：使用 Haskell 进行系统编程","lang":"zh-CN","frontmatter":{"description":"第 20 章：使用 Haskell 进行系统编程 目前为止，我们讨论的大多数是高阶概念。 Haskell 也可以用于底层系统编程。完全可以使用 Haskell 编写使用操作系统底层接口的程序。 本章中，我们将尝试一些很有野心的东西：编写一种类似 Perl 实际上是合法的 Haskell 的\\"语言\\"，完全使用 Haskell 实现，用于简化编写 shel...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/%E5%AD%A6%E4%B9%A0/Haskell%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3/20.html"}],["meta",{"property":"og:site_name","content":"博客演示"}],["meta",{"property":"og:title","content":"第 20 章：使用 Haskell 进行系统编程"}],["meta",{"property":"og:description","content":"第 20 章：使用 Haskell 进行系统编程 目前为止，我们讨论的大多数是高阶概念。 Haskell 也可以用于底层系统编程。完全可以使用 Haskell 编写使用操作系统底层接口的程序。 本章中，我们将尝试一些很有野心的东西：编写一种类似 Perl 实际上是合法的 Haskell 的\\"语言\\"，完全使用 Haskell 实现，用于简化编写 shel..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-02-25T04:39:03.000Z"}],["meta",{"property":"article:author","content":"hahg"}],["meta",{"property":"article:modified_time","content":"2024-02-25T04:39:03.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"第 20 章：使用 Haskell 进行系统编程\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-02-25T04:39:03.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"hahg\\"}]}"]]},"headers":[{"level":2,"title":"调用外部程序","slug":"调用外部程序","link":"#调用外部程序","children":[]},{"level":2,"title":"目录和文件信息","slug":"目录和文件信息","link":"#目录和文件信息","children":[]},{"level":2,"title":"终止程序","slug":"终止程序","link":"#终止程序","children":[]},{"level":2,"title":"日期和时间","slug":"日期和时间","link":"#日期和时间","children":[{"level":3,"title":"ClockTime 和 CalendarTime","slug":"clocktime-和-calendartime","link":"#clocktime-和-calendartime","children":[]},{"level":3,"title":"文件修改日期","slug":"文件修改日期","link":"#文件修改日期","children":[]}]},{"level":2,"title":"延伸的例子: 管道","slug":"延伸的例子-管道","link":"#延伸的例子-管道","children":[{"level":3,"title":"使用管道做重定向","slug":"使用管道做重定向","link":"#使用管道做重定向","children":[]},{"level":3,"title":"更好的管道","slug":"更好的管道","link":"#更好的管道","children":[]},{"level":3,"title":"关于管道，最后说几句","slug":"关于管道-最后说几句","link":"#关于管道-最后说几句","children":[]}]}],"git":{"createdTime":1708835943000,"updatedTime":1708835943000,"contributors":[{"name":"hahg2000","email":"61403802+hahg2000@users.noreply.github.com","commits":1}]},"readingTime":{"minutes":32.49,"words":9748},"filePathRelative":"学习/Haskell中文文档/20.md","localizedDate":"2024年2月25日","excerpt":"\\n<p>目前为止，我们讨论的大多数是高阶概念。 Haskell 也可以用于底层系统编程。完全可以使用 Haskell 编写使用操作系统底层接口的程序。</p>\\n<p>本章中，我们将尝试一些很有野心的东西：编写一种类似 Perl 实际上是合法的 Haskell 的\\"语言\\"，完全使用 Haskell 实现，用于简化编写 shell 脚本。我们将实现管道，简单命令调用，和一些简单的工具用于执行由 <code>grep</code> 和 <code>sed</code> 处理的任务。</p>\\n<p>有些模块是依赖操作系统的。本章中，我们将尽可能使用不依赖特殊操作系统的通用模块。不过，本章将有很多内容着眼于 POSIX 环境。 POSIX 是一种类 Unix 标准， 如 Linux ，FreeBSD ，MacOS X ，或 Solaris 。Windows 默认情况下不支持 POSIX ，但是 Cygwin 环境为 Windows 提供了 POSIX 兼容层。</p>","autoDesc":true}');export{H as comp,L as data};
