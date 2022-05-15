// 正则表达式 对比 https://deerchao.cn/tutorials/regex/diffs.html
// 正则表达式30分钟入门教程 https://deerchao.cn/tutorials/regex/regex.htm#more
// JS 运算符优先级 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
// MATLAB 运算符和特殊字符 https://ww2.mathworks.cn/help/matlab/matlab_prog/matlab-operators-and-special-characters.html
// JS 正则表达式否定匹配，正向前瞻 https://www.cnblogs.com/dong-xu/p/6926064.html 附件文章内容也很多
var TIDY = {
  正则: { //按处理顺序
    command: ['CM', new RegExp('\\n\\s*(' + cmd_arr.join('|') + ')\\b[^\\n]*', 'g')], // /\n\s*[\.\w]+[^\n]*/g],

    '\\\'': ['SL', /\\\'/g],  //slash quotation
    '\\\"': ['SL', /\\\"/g],  //slash quotation

    '/*'  : ['RB', /\/\*(.|\n)*?\*\//g],
    // '#{'  : ['RB', /#\{(.|\n)*?\}#/g],
    '%{'  : ['RB', /%\{(.|\n)*?%\}/g],
    '%'   : ['RF', /%[^\n]*/g],
    '#'   : ['RF', /#[^\n]*/g],
    '\/\/': ['RF', /\/\/[^\n]*/g], // '/*'  : ['RF', /[ \r]*[^\\]\/\*(.|\n)*?[^\\]\*\//g],

    '\''  : ['CE', /(?<=[^\w])\s*'.*?'/g], //如果碰到 a = 'I\'m' 或 W'*A - D*W' 怎么办 todo
    '"'   : ['ST', /".*?"/g],

    'stop': ['RB', /stop[\s\S]+(?=\n)/g],

    '...': ['NN', /\s*\.\.\.[^\n]*\n/g],

    'dot': ['DT', /[a-zA-Z]\w*(\.\w+)+/g],

    //优先级 1 圆括号 ( )
    ')=': ['BE', /\([^\(\[\{]*?\)\s*(?=\=[^\=])/g], // \=\*\/\>\<\&\|\%
    ']=': ['AE', /\[[^\(\[\{]*?\]\s*(?=\=[^\=])/g],
    '}=': ['OE', /\{[^\(\[\{]*?\}\s*(?=\=[^\=])/g],
    '(' : ['BR', /\([^\(\[\{]*?\)/g], // \=\*\/\>\<\&\|\%
    '[' : ['AR', /\[[^\(\[\{]*?\]/g],
    '{' : ['OB', /\{[^\(\[\{]*?\}/g],

    //这些是不是应该放在括号前面？括号不会乱，引号因转置，优先级考后 // todo

    'pi'        : ['PI', /\bpi\b/gi],
    'scientific': ['SN', /[\+\-]?\d(\.\d+)?e[\+\-]?\d+/gi],
    'complex'   : ['CP', /(([\+\-]\s*)?\d*(\.\d+)?\s*[\+\-]?)?\s*\d+(\.\d+)?[ij]\b/g], //虚数，ij专用，变量不得使用 //-i
    // 'complex': ['CP', /(([\+\-]\s*)?\d*(\.\d+)?)?[\+\-]?\s*\d*(\.\d?)?\d[ij]\b/g], //虚数，ij专用，变量不得使用

    // 下面四个放在括号后面有道理
    pickset   : ['PS', /\w+[ \t]*_\d{5}_BE_/g],
    actionline: ['AL', /(?<=\n)[ \t]*\w+_\d{5}_BR_[ \t;]*(_\d{5}_RF_)?[ \t]*(?=\n)/g],
    action    : ['AC', /\w+[ \t]*_\d{5}_BR_/g],
    'case'    : ['CA', /\bcase\s+[\+\-]?[\w\.]+/g],
    syms      : ['SY', /\bsyms\s+\w+(?=\n)/g],

    //优先级 2 矩阵转置和乘方：转置（.'）、共轭转置（'）、乘方（.^）、矩阵乘方（^）
    dottran: ['DZ', /\w+\s*\.\'/g],  // .' 矩阵转置
    tran   : ['DG', /\w+\s*\'/g],    // ' 矩阵共轭转置
    power  : ['DE', /[\w\.]+\s*\.\^\s*[\w\.]+/g],  // .^ 乘方
    mpower : ['MI', /[\w\.]+\s*\^\s*[\+\-]?[\w\.]+(?!\^)/g],    // ^ 矩阵乘方

    //优先级 3 一元加法（+）、—元减法（-）、取反（~）
    selfadd : ['SA', /\w+\s*([\+\-])\1/g],
    selfadd2: ['SA', /([\+\-])\1\s*\w+/g],

    //优先级 4 乘法（.*）、矩阵乘法（*）、右除（./）、左除（.\）、矩阵右除（/）、矩阵左除（\）
    times   : ['DM', /[\w\.]*\w+\s*\.\*\s*[\w\.]*\w+/g],  // .* 乘
    mtimes  : ['MU', /[\w\.]*\w+\s*\*\s*[\w\.]*\w+/g],    // * 矩阵乘
    rdivide : ['DR', /[\w\.]*\w+\s*\.\/\s*[\w\.]*\w+/g],  // 右除（./）
    ldivide : ['DL', /[\w\.]*\w+\s*\.\\\s*[\w\.]*\w+/g],  // 左除（.\）
    mrdivide: ['RD', /[\w\.]*\w+\s*\/\s*[\w\.]*\w+/g],    // 矩阵右除（/）
    mldivide: ['LD', /[\w\.]*\w+\s*\\\s*[\w\.]*\w+/g],    // 矩阵左除（\）

    //优先级 5 加法（+）、减法（-）、逻辑非（~）
    //存在连续+-，每次只处理一个
    '+'       : ['AD', /[\+\-]?[\w\.]+\s*[\+\-]\s*[\w\.]+/],
    '+noblank': ['AD', /[\w\.]+[\+\-][\w\.]+/], // '-'       : ['MN', /[\+\-]?[\w\.]+\s*\-\s*[\w\.]+/g],
    // '-noblank': ['MN', /[\w\.]+\-[\w\.]+/g],
    '~'       : ['NT', /[\~\!]\s*[\w\.]+/g],
    nagtive   : ['NG', /\-\s*[_a-zA-Z]([\w\.]*\w)*/g],      // 自负 -xxx

    //优先级 6 冒号运算符（:）
    '::': ['CC', /[\+\-\w\.]+\s*\:\s*[\+\-\w\.]+\s*\:\s*[\+\-\w\.]+/g],
    ':' : ['SC', /[\+\-\w\.]*\s*\:\s*[\+\-\w\.]*/g],

    //优先级 7 小于（<）、小于等于（<=）、大于（>）、大于等于（>=）、等于（==）、不等于（~=）
    condition: ['CN', /[\w\.]+\s*(\>|\>\=|\<|\<\=|\=\=|\~\=|\!\=)\s*[\w\.\+\-]+/g], //逻辑运算
    notequal : ['NE', /[\w\.]+\s*\~\=\s*[\w\.]+/g], //逻辑运算

    //优先级 8 逐元素逻辑与（&）
    //优先级 9 逐元素逻辑或（|）
    //优先级 10 避绕式逻辑与，或者捷径逻辑与（&&）
    //优先级 11 避绕式逻辑或，或者捷径逻辑或（||）
    '&|': ['LG', /\w+(\s*[\&\|]\s*\w+)+/g],
    '&&': ['DA', /\w+\s*\&\&\s*\w+/g],
    '||': ['DO', /\w+\s*\|\|\s*\w+/g],

    break   : ['BK', /\bbreak\b/g],
    continue: ['CT', /\bcontinue\b/g],

    output   : ['OP', /(?<=\n)[ \t]*[a-zA-Z]\w*[ \t]*(?=\n)/g],
    outputcal: ['OC', /(?<=\n)[ \t]*_\d{5}_(DZ|DG|DE|MI|SA|DM|MU|DR|DL|RD|LD|AD|MN|NT|CC|SC|CN|NE|LG|DA|DO)_[ \t]*(?=\n)/g],

    //inline block function
    anonymous_func: ['AF', /@_\d{5}_BR_\s*\w+(?=[,;\n])/g],
    '@func'       : ['SF', /@\s*\w+(?=[,;\n])/g],

    //下面是代码块
    assignment: ['AS', /\w+\s*[\+\-]?=\s*[\w\.\+\- ]+\;?/g], //赋值语句 s* `+`?`= s* \w
    multias   : ['MA', /_\d{5}_(AE|BE)_\s*[\+\-]?=\s*[\w\.\+\-]+;?/g], //赋值语句 s* `+`?`= s* \w

    return: ['RT', /\breturn\b(\s*\w+)?/g],
    if    : ['IF', /\bif\s+((?!\b(for|if|switch|try|while|arguments)\b)[\s\S])*?end/g],
    for   : ['FR', /\bfor\s+((?!\b(for|if|switch|try|while|arguments)\b)[\s\S])*?end/g], // elseif    : ['EI', /\belse\s+_\d{5}_IF_/g],
    while : ['WH', /\bwhile\s+((?!\b(for|if|switch|try|while|arguments)\b)[\s\S])*?end/g],
    switch: ['SW', /\bswitch((?!\b(for|if|switch|try|while|arguments)\b)[\s\S])*?end/g],
    try   : ['TY', /\btry\s+((?!\b(for|if|switch|try|while|arguments)\b)[\s\S])*?end/g],
    func  : ['FN', /\bfunction\s+((?!\b(for|if|switch|try|while|arguments)\b)[\s\S])*?end\w*/g],

    id: ['ID', /_\d{5}_[A-Z]{2}_/g]
  },
}
/*
特殊变量名表
变量名称	变量含义	变量名称	变量含义
ans	MATLAB 中的默认变量	i(j)	复数中的虚数单位
pi	圆周率	nargin	所用函数的输入变量数
eps	计算机中的最小数，PC 机上为 2的负 52 次方	nargout	所用函数的输出变量数
inf	无穷大，如 1/0	realmin	最小可用正实数
NaN	不定值，如 0/0 等	realmax	最大可用正实数

MATLAB 中的常用标点符号
名称	符号	功能
空格	 	用于输入变量之间的分隔符以及数组行元素之间的分隔符
逗号	,	用于要显示计算结果的命令之间的分隔符；用于输入变量之间的分隔符；用于数组行元素之间的分隔符
点号	.	用于数值中的小数点
分号	;	用于不显示命令行的结尾；用于不显示结果直接的分隔符；用户数组行元素之间的分隔
冒号	:	用于生成一维数值数组，表示一维数值的全部元素或多维数组某一维的全部元素
百分号	%	用于注释的前面，在它后面的命令不需要执行
单引号	'	用于括住字符串
圆括号	()	用于引用数组元素；用于函数输入变量列表；用于确定算术运算的先后次序
方括号	[]	用于构成向量和矩阵；用于函数输出列表
花括号	{}	用于构成元胞数组
下划线	_	用于一个变量、函数或文件名的连字符
续行号	...	用于把后面的行与该行连接以构成一个较长的命令
“At”号	@	用于放在函数名前形成函数句柄；用于放在目录名前形成用户对象类目录

MATLAB 关系运算符
关系运算符	描述
<	小于
<=	小于或等于
>	大于
>=	大于或等于
==	等于（请不要和赋值等号 = 混淆）
~=	不等于

MATLAB 支持的逻辑运算符和逻辑运算函数一览表
逻辑运算符	描述
&	逻辑与运算符，& 两边的表达式的结果都为 1 时返回 1，否则返回 0。
|	逻辑或运算符，| 两边的表达式结果有一个为 1 时返回 1，都为 0 时才返回 0。
~	逻辑非运算符，~ 会对表达式的结果进行取反操作。表达式为 1 时得到 0，为 0 时得到 1。
逻辑运算函数	描述
and(A, B)	逻辑与运算函数，A 和 B 都为 1 时返回 1，否则返回 0。
or(A, B)	逻辑或运算函数，A 和 B 有一个为 1 时返回 1，都为 0 时才返回 0。
not(A)	逻辑非运算，A 为 1 时返回 0，A 为 0 时返回 1。
xor(A, B)	异或运算函数，A 和 B 不同是返回 1，相同时返回 0。
向量运算函数	描述
any(A)	向量 A 中有非 0 元素时返回 1，矩阵 A 某一列有非 0 元素时返回 1。
all(A)	向量 A 中所有元素都为非 0 时返回 1，矩阵 A 中某列所有元素都为非 0 时返回 1。

MATLAB 常用的矩阵生成函数
矩阵	函数	矩阵	函数
全零矩阵	zeros()	友矩阵	compan()
单位矩阵	eye()	Hadamard 矩阵	hadamard()
全 1 矩阵	ones()	Hankel 矩阵	hankel()
均匀分布随机矩阵	rand()	Hilbert 矩阵	hilb()
正态分布随机矩阵	randn()	逆 Hilbert 矩阵	invhilb()
产生线性等分向量	linspace()	Magic 矩阵	magic()
产生对数等分向量	logspace()	Pascal 矩阵	pascal()
Wilkinson 特征值测试矩阵	wilkinson()	拓普利兹矩阵	toeplitz()

数组下标 end 是专用保留关键字
*/
var 缩写显示对照 = {}, 缩写
for(var desc in TIDY.正则){
  缩写 = TIDY.正则[desc][0]
  if(缩写显示对照[缩写]){
    // console.log(desc, 缩写, 'repeat', 缩写显示对照[缩写])
    缩写显示对照[缩写] += ' ' + desc
  }
  else{
    缩写显示对照[缩写] = desc
  }
}

// console.log(缩写显示对照)
var 语句对照 = 'AC|AF|AS|BF|BK|CA|CH|CS|CT|DC|LD|DT|DW|EI|EL|EX|FN|FR|IF|IM|NW|RT|YL|SA|SW|TY|WH|WT|YL'

function tidy(source_code){
  TIDY.source_g = {}
  TIDY.source_i = 10000
  TIDY.changed  = false

  var t0 = $.MS()
  let s  = '\n' + source_code + '\n'

  s = 替换(s, 'command')

  s = 替换(s, '\\\'')
  s = 替换(s, '\\\"')
  s = 替换(s, '/*')           //替换注释
  s = 替换(s, '%{')           //替换注释
  s = 替换(s, '%')            //替换注释
  s = 替换(s, '#')            //替换注释
  s = 替换(s, '\/\/')         //替换注释

  s = 替换引号对(s)

  s = 替换(s, 'stop')         //程序终止

  s = 替换(s, '...')          //替换mablab续行

  s = 替换(s, 'dot')

  var b = true
  var s0

  s = 替换括号(s)
  b = true
  while(b){
    s0 = s

    s = 替换语句(s)
    s = 替换代码块(s)

    if(s == s0){
      b = false
    }
  }

  s = s.slice(1, -1)

  var restor_code = 全部复原(s)

  if(source_code != restor_code){
    let source_arr = source_code.split(/\n/g)
    let restor_arr = restor_code.split(/\n/g)
    for(let i = 0, l = source_arr.length; i < l; i++){
      if(source_arr[i] != restor_arr[i]){
        console.log('代码差异', i, source_arr[i], restor_arr[i])
        break
      }
    }
  }
  else{
    // console.log('代码完全复原')
  }

  // console.log('耗时', $.MS() - t0, '毫秒')

  return s
}

function 替换括号(s){
  let changed = true
  let i       = 200
  var arr     = ')=,]=,}=,[,(,{'.split(',')
  var new_code
  while(changed && i--){
    changed = false

    arr.forEach(括号 => {
      while(true){
        new_code = 替换迭代(s, 括号)
        if(new_code != s){
          s       = new_code
          changed = true
        }
        else{
          break
        }
      } //嵌套
    })
  }

  if(i <= 1){
    console.debug('有问题：替换括号冒号 循环了', 200 - i, '轮')
  }

  return s
}

function 替换迭代(s, reg_s){
  TIDY.changed = false
  var group    = TIDY.正则[reg_s][0]
  s            = s.replace(TIDY.正则[reg_s][1], s => {
    TIDY.changed = true

    s = 替换语句(s, reg_s)

    var group_ob
    if(reg_s == '{'){
      if(/_\d{5}_KV_/.test(s)){
        group_ob = 'OB'
      }
      else if(/,/.test(s)){
        group_ob = 'OB'
      }
      else if(!s.replace(/[\{\}]/g, '').trim()){
        // 内容为空，两种都有可能，显示时再处理
        group_ob = 'BL'
      }
      else{
        group_ob = 'OB'
      }
    }

    group_ob = group_ob || group

    let uuid = saveUuid(group_ob, s)

    if(group == '('){
      uuid += ' '
    }

    return uuid
  })

  return s
}

function 替换语句(s, reg_s){

  s = 替换(s, 'pi')          //pi PI
  s = 替换(s, 'scientific')  //科学计数法
  s = 替换(s, 'complex')     //虚数

  s = 替换(s, 'pickset')
  s = 替换(s, 'actionline')
  s = 替换(s, 'action')
  s = 替换(s, 'case')       // 避免 case -1
  s = 替换(s, 'syms')

  //优先级 2 矩阵转置和乘方：转置（.'）、共轭转置（'）、乘方（.^）、矩阵乘方（^）
  s = 替换(s, 'dottran')
  s = 替换(s, 'tran')
  s = 替换(s, 'power')
  s = 替换(s, 'mpower')

  //优先级 3 一元加法（+）、—元减法（-）、取反（~）
  s = 替换(s, 'selfadd')     //替换后置递增(运算符在后)
  s = 替换(s, 'selfadd2')    //替换前置递增

  //优先级 4 乘法（.*）、矩阵乘法（*）、右除（./）、左除（.\）、矩阵右除（/）、矩阵左除（\）
  while(true){
    let m = s.match(/[\w\.]*\w+\s*(\.\*|\*|\.\/|\.\\|\/|\\)\s*[\w\.]*\w+/)

    if(!m){
      break
    }

    // console.log('dodo', m, s)
    let s0 = s
    switch(m[1]){
      case '.*':
        s = 替换(s, 'times')
        break
      case '*':
        s = 替换(s, 'mtimes')
        break
      case './':
        s = 替换(s, 'rdivide')
        break
      case '.\\':
        s = 替换(s, 'ldivide')
        break
      case '/':
        s = 替换(s, 'mrdivide')
        break
      case '\\':
        s = 替换(s, 'mldivide')
        break
    }

    if(s0 == s){
      break
    }
  }

  //优先级 5 加法（+）、减法（-）、逻辑非（~）
  s = 替换(s, reg_s == '[' ? '+noblank' : '+')
  // s = s.replace(/\bend\s*-/g, '-') //what ?? 避免出现end-1，直接用-1替代
  // s = 替换(s, reg_s == '[' ? '-noblank' : '-')
  s = 替换(s, '~')
  s = 替换(s, 'nagtive')

  //优先级 6 冒号运算符（:）
  s = 替换(s, '::')
  s = 替换(s, ':')

  //优先级 7 小于（<）、小于等于（<=）、大于（>）、大于等于（>=）、等于（==）、不等于（~=）
  s = 替换(s, 'condition')
  s = 替换(s, 'notequal')

  //优先级 8 逐元素逻辑与（&）
  //优先级 9 逐元素逻辑或（|）
  //优先级 10 避绕式逻辑与，或者捷径逻辑与（&&）
  //优先级 11 避绕式逻辑或，或者捷径逻辑或（||）
  s = 替换(s, '&&')
  s = 替换(s, '||')
  s = 替换(s, '&|')

  s = 替换(s, 'break')
  s = 替换(s, 'continue')

  s = 替换(s, 'outputcal')
  s = 替换(s, 'output')
  return s
}

function 替换引号对(s){
  let sign_s
  let i      = 200
  let last_s = -2
  //2种并列类型' " ，先出现，先处理
  while((sign_s = find_sign()) && i--){
    s = 替换(s, sign_s)
  }

  return s

  function find_sign(){
    let s0 = $.F(s, '\'')
    let s1 = $.F(s, '"')
    let a  = []
    if(s0){
      a.push(s0)
    }
    if(s1){
      a.push(s1)
    }

    if(!a.length){
      return
    }

    let min = Math.min(...a)

    if(min == last_s){
      return
    }

    last_s = min

    switch(min){
      case s0:
        return '\''
      case s1:
        return '"'
    }
  }
}

function 替换代码块(s){
  var source = s

  s = 替换(s, 'anonymous_func')
  s = 替换(s, '@func')

  s = 替换(s, 'multias') //[V,D] = eig(B)
  s = 替换(s, 'assignment') //A(:,:,1) = [2 0; 0 0]

  s = 替换(s, 'return')
  s = 替换(s, 'if')
  s = 替换(s, 'for')
  s = 替换(s, 'while')
  s = 替换(s, 'switch')

  s = 替换(s, 'try')
  s = 替换(s, 'func')

  return s
}

function 替换case_del(s){
  if(/case\s+[\w\u4e00-\u9fa5]+\s*\:/.test(s) && !/\}/g.test(s.slice(0, -1))){
    //拆分case片段
    s      = s.slice(0, -1)
    var a  = []
    var df = ''
    var i  = s.search(/\bdefault\s*\:/)
    var uuid
    if(i >= 0){
      uuid = saveUuid('DF', s.slice(i))
      df   = uuid
      s    = s.slice(0, i)
    }

    var case_a = s.split('case')
    a.push(case_a[0])
    case_a.slice(1).forEach(s => {
      uuid = saveUuid('CA', 'case' + s.slice(0, -1))
      a.push(uuid)
      a.push(s.slice(-1))
    })

    a.push(df)
    a.push('}')

    s = a.join('')
  }

  return s
}

function 替换(s, reg_s){
  var group = TIDY.正则[reg_s][0]
  let s1    = ''
  while(s != s1){
    s1 = s
    s  = s1.replace(TIDY.正则[reg_s][1], s => {
      if(('+' == reg_s[0] || '-' == reg_s[0]) && /end/.test(s)){
        return s
      }

      if('action' == reg_s.slice(0, 6) && s.slice(0, 6) == 'switch'){
        return s
      }

      if('output' == reg_s && s.slice(0, 6) == 'switch'){
        return s
      }

      if('output' == reg_s && s == 'return'){
        return s
      }

      if('output' == reg_s && /end/.test(s)){
        return s
      }

      if(group == 'AC'){
        if(/_\d{5}_BR_/g.test(s.slice(0, 10))){
          // 应对fun = @(x)sin(cosh(x))，不把sin前的部分包含进去
          let uuid = saveUuid(group, s.slice(10))
          return s.slice(0, 10) + uuid
        }
      }

      let uuid = saveUuid(group, s)

      return uuid
    })
  }

  return s
}

function 全部复原(s, beautify){
  // old_s = s
  let i = 10000

  if(beautify){
    s = s.replace(/[\s\n]+/g, '\n')
    s = s.replace(/\n(\s*_\d{5}_(FR|WH|SW|IF|FN)_)/g, '\n\n$1\n')

    s = 单级复原(s, beautify, 1)
    s = s.replace(/\}\n\n([ \t]*)else/g, '}\n$1else')
    s = s.replace(/else\s+if/g, 'else if')
    s = s.replace(/\{([^\{\}]+)\nfor/g, '{$1for')
    s = s.replace(/;[ \t]*/g, '; ')
    // s = s.replace(/\b(var|for|if|else|while|do|switch|case|default|case|break|continue|function|in|return)\b/g, '<span class="c">$1</span>')
    // s = s.replace(/\n/g, '<br>')
    // s = s.replace(/\s\s/g, ' &nbsp; ')
  }
  else{
    while(TIDY.正则.id[1].test(s) && i--){
      s = 单级复原(s)
    }

    // s = s.replace(/</g, '&lt;')
    // s = s.replace(/>/g, '&bt;')
  }

  return s
}

function 单级复原(s = 'root', beautify, level){
  if(s == 'root'){
    return getRoot()
  }

  return s.replace(TIDY.正则.id[1], function(uuid){
    var group = getGroup(uuid)
    var c     = getUuidCode(group, uuid)
    if(beautify){
      switch(group){
        case 'RF':
          return ''
        // case 'OB':
        // case 'BL':
        //   var blank = '                                                        '
        //   c         = c.replace(/^\s*\{\s*|\s*\}$/g, ' ')
        //   c         = c.replace(/[\s\n]+/g, '\n' + blank.slice(0, level * 2))
        //   c         = c.replace(/\n(\s*_\d{5}_(WH|SW|IF|FN)_)/g, '\n\n$1\n') //加入空行
        //   c         = '{' + c.slice(0, -2) + '}'
        //   // console.log(c)
        //   return 单级复原(c, beautify, level + 1)
        // case 'BR':
        //   c = c.replace(/^\s*\(\s*/g, '(')
        //   c = c.replace(/^\s*\)$/g, ')')
        //   break
        // case 'AS':
        //   c = c.replace(/\s*([\+\-\*\/\%]?)=\s*([\+\-]?)\s*/g, ' $1= $2')
        //   break
        // case 'CN':
        //   c = c.replace(/([\+\-]?)\s*(\w+)\s*(\&\&|\|\||\>|\>\=|\<|\<\=|\=\=\=|\=\=|\!\=\=|\!\=)\s*([\+\-]?)\s*/g, '$1$2 $3 $4')
        //   break
        // case 'DC':
        //   c = c.replace(/var\s+/g, 'var ')
        //   break
        // case 'RT':
        //   c = c.replace(/return\s*/g, 'return ')
        //   break
      }
      return 单级复原(c, beautify, level)
    }
    else{
      return c
    }
  })
}

function inObject(search, object){
  for(let i in object){
    if(object[i] === search){
      return i
    }
  }
  return false
}

function bindResize(eobj){
  var sentense_eobj   = eobj.FATHER
  var block_eobj      = sentense_eobj.FATHER
  var sentense_height = getMiniHeight(sentense_eobj)
  var block_height    = getMiniHeight(block_eobj) //.context.scrollHeight

  if(block_eobj.level > 折叠层级){
    zoomOut(block_height, sentense_height)
  }
  else{
    zoomIn(block_height)
  }

  function zoomIn(block_height){
    block_eobj.S({
      H : block_height,
      O : 'hidden',
      TS: 动画效果,
    })
    //动画结束，高度自适应
    eobj.timer = setTimeout(function(){
      block_eobj.S({
        H: '',
        O: '',
      })
    }, 动画效果 || 10)

    eobj.I(' - ')
  } // 放大

  function zoomOut(block_height, sentense_height){ //缩小
    if(!block_eobj.H_){
      block_eobj.S({
        H: block_height
      })
      //给定高度后，需要等待生效
      setTimeout(function(){
        block_eobj.S({
          H : sentense_height,
          O : 'hidden',
          TS: 动画效果,
        })

        eobj.I(' + ')
      }, 10)
    }
    else{
      clearTimeout(eobj.timer)
      block_eobj.S({
        H : sentense_height,
        O : 'hidden',
        TS: 动画效果,
      })

      eobj.I(' + ')
    }
  }

  return eobj.down(function(eobj){
    // console.log(eobj.FATHER.sentence)
    // console.log(eobj.FATHER.FATHER.sentence)
    // console.log(eobj.FATHER.FATHER.FATHER.sentence)

    var sentense_height = getMiniHeight(sentense_eobj)
    var block_height    = getMiniHeight(block_eobj) //block_eobj.context.scrollHeight
    if(block_eobj.H_ == sentense_height){
      zoomIn(block_height)
    }
    else{
      zoomOut(block_height, sentense_height)
    }
  })
}

function getMiniHeight(eobj){
  return eobj.context.scrollHeight //37
}

function moveLine(target_eobj){
  if(!target_eobj){
    console.log(1522)
  }
  var l = target_eobj.context.offsetLeft + 图形区域.context.offsetLeft
  if($.TRIM(target_eobj.I_) == '}'){
    l += 样式.语句区.ML - (target_eobj.ML_ || 0)
  }
  图形区域.焦点标注线.S({
    L: l,
    T: target_eobj.context.offsetTop + +图形区域.context.offsetTop - 图形区域.焦点标注线.H_ - 图形区域.context.scrollTop,
  }).V()
}

function sentence2piece(s){
  //拆分字符片段
  var a = []
  while(s){
    var i = s.search(/_\d{5}_[A-Z]{2}_/)
    if(i == -1){
      a.push(s)
      break
    }

    if(i > 0){
      a.push(s.slice(0, i))
    }

    a.push(s.slice(i, i + 10))
    s = s.slice(i + 10)
  }

  return a
}

function block2sentence(blockcode){
  //拆分代码块->句子
  //每句有且仅有一个uuid
  return blockcode.replace(/(^\s*|\s*$)/g, '').split(/[\s;]+/g)
}

function getColor(group){
  switch(group){
    case 'AR':
      return '#fedc6b'
    case 'RT':
    case 'AC':
      return '#72cf51'
    case 'RF':
      return '#bbb'
    case 'DC':
    case 'AS':
      return '#fec36b'
    case 'IF':
    case 'EI':
    case 'EL':
    case 'SW':
    case 'CA':
    case 'DF':
      return '#18B7A9'
    case 'FR':
    case 'WH':
      return '#6fcefe'
    case 'FN':
      return '#f0946b'
    default:
      return '#eaa'
  }
}

function setRoot(str){
  return TIDY['source_g'].root = str
}

function getRoot(){
  return TIDY['source_g'].root
}

function getUuidCode(group, uuid){
  return TIDY['source_g'][group][uuid]
}

function saveUuid(group = 'root', str){
  var g = TIDY['source_g']

  if(group == 'root'){
    g.root = str
    return 'root'
  }
  if(!g[group]){
    g[group] = {}
  }

  var i    = TIDY['source_i']++
  let uuid = '_' + i + '_' + group + '_'

  g[group][uuid] = str

  // console.log(group, uuid, str)
  return uuid
}

function replaceUuid(uuid = 'root', str){
  if(uuid == 'root'){
    setRoot(str)
  }
  else{
    var group = getGroup(uuid)
    if(!TIDY['source_g'][group]){
      TIDY['source_g'][group] = {}
    }

    TIDY['source_g'][group][uuid] = str
  }
}

function showSampleOnly(例句分类, bool){
  var eobj
  for(var k in 样板配色集){
    eobj = 样板配色集[k][2]
    if(k == 例句分类){
      eobj.V(bool || eobj.isH())
    }
    else{
      eobj.H()
    }
  }
}

function getGroup(uuid){
  return uuid.slice(7, 9) // (-4, -2)
}



