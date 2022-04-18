//https://www.docin.com/p-65461705.html

// solve('a*x^2+b*x+c=0') //求一元二次方程根的通式
// ans: 1/2/啊*（-b+(b^2-4*a*c)^(1/2)
//
// syms a y;
// dsolve('Dy=a*y')       //求微分方程解的通式
// ans: C1*exp(a*t)
//
// x=sym('x')
// diff(cos(x)^2)         //求导数
// ans: -2*cos(x)*sin(x)
//
// syms x a b
// int (x^2,a,b)          //求定积分
// ans: 1/3*b^3-1/3*a^3
//
// 1、基本运算符
// +   -   *   \   /   ^
// .*  ./   .\  .^
// '   .'

// 2、关系运算符
// ==     ～=

// 3、三角函数、双曲函数及其反函数
// 除了atan2 近能用于数值计算，其余都能永固符号计算

// 4、指数、对数函数
// sqrt   exp   expm    log   log2    log10   ln

// 5、复数函数
// conj   real   imag    abs

// 6、矩阵函数
// diag   triu    tril    inv   det   rank    rref    null
// colspace   poly    expm    eig

// 因式分解
// 同类项合并
// 符号表达式展开、化简
// 通分、符号替换

// collect                        // 同类项合并
// syms x t
// f = (x-1)*(x-2)*(x-3)
// collect(f)
// ans: x^3-6*x^2+11*x-6

// expand                         // 符号表达式展开
// syms x y
// f = (x+y)^3
// expand(f)
// ans: x^3+3*x^2*y+3*x*y^2+y^3
// f = cos(x-y)
// expand(f)
// ans: cos(x)*cos(y)+sin(x)*sin(y)

// horner                         // 转换成嵌套形式
// syms x y
// f = X^3-6*x^2+11*x-6
// horner(f)
// ans: -6+(11+(-6+x)*x)*x

// factor
// n = 1:9
// x = x(ones(size(n)))
// p = x.^n+1
// [p;factor(p)]
// x^9+1 -> (x+1)*(x^2-x+1)*(x^6-x^3+1)

//simplify                        // 简化
//simple                          // 简化

// eig                            // 符号特征值
// jordan                         // 约当标准型
// svd                            // 约当标准型

// 微积分
// limit                          // 求极限
// diff                           // 求微分
// syms a x
// f = sin(a*x)
// diff(f)                // 一阶微分
// ans: cos(a*x)*a
// diff(f,2)              // 二阶微分
// ans: -sin(a*x)*a^2

// int                            // 积分
// syms x
// r1=int(-2*x/(1+x^2)^2)          // 不定积分
// r2=int(-2*x/(1+x^2)^2,1,2)      // 定积分
// r1: 1/(1+x^2)
// r2: -3/10

// symsum                           // 级数求和
// taylor                           // 泰勒级数

// fourier                          // fourier变换
// laplace                          // laplace变换
// z                                // z变换

// 符号方程求解
// 代数方程
// S=solve('u*y^2+v*z+w=0','y+z+w=0','y','z')
// S.y: -1/2/u*(-2*u*w-v+(4*u*w*v+v^2-4*u*w)^(1/2))-w
// S.y: -1/2/u*(-2*u*w-v-(4*u*w*v+v^2-4*u*w)^(1/2))-w
// S.z: -1/2/u*(-2*u*w-v+(4*u*w*v+v^2-4*u*w)^(1/2))
// S.z: -1/2/u*(-2*u*w-v-(4*u*w*v+v^2-4*u*w)^(1/2))

// 微分方程
// y = dsolve('x*D2y-2*Dy=x^2','y(0)=0,y(5)=0','x')
// Sy=simple(y)
// y: 1/3*x^3*log(x)-1/9*x^3+1/3*(1/3-125/124*log(5))*x^3+125/372*log(5)
// Sy: (1/3*log(x)-125/372*log(5))*x^3+125/372*log(5)

let SYMS = {
  正则: { //按处理顺序
    //优先级 1 圆括号 ( )
    '(': ['BR', /\([^\(\[\{]*?\)/g], // \=\*\/\>\<\&\|\%
    '[': ['AR', /\[[^\(\[\{]*?\]/g],
    '{': ['OB', /\{[^\(\[\{]*?\}/g],

    //这些是不是应该放在括号前面？括号不会乱，引号因转置，优先级考后 // todo

    pi        : ['PI', /\bpi\b/gi],
    scientific: ['SN', /[\+\-]?\d(\.\d+)?e[\+\-]?\d+/gi],
    complex   : ['CP', /(([\+\-]\s*)?\d*(\.\d+)?\s*[\+\-]?)?\s*\d+(\.\d+)?[ij]\b/g], //虚数，ij专用，变量不得使用 //-i

    action    : ['AC', /\w+[ \t]*_\d{5}_BR_/g],

    //优先级 2 矩阵转置和乘方：转置（.'）、共轭转置（'）、乘方（.^）、矩阵乘方（^）
    dottran: ['DZ', /\w+\s*\.\'/g],  // .' 矩阵转置
    tran   : ['DG', /\w+\s*\'/g],    // ' 矩阵共轭转置
    power  : ['DE', /[\w\.]+\s*\.\^\s*[\w\.]+/g],  // .^ 乘方
    mpower : ['MI', /[a-z]\s*\^\s*[\w\.]+(?!\^)/ig],    // ^ 矩阵乘方
    mpower2: ['MI', /_\d{5}_BR_\s*\^\s*[\w\.]+(?!\^)/g],    // ^ 矩阵乘方

    //优先级 3 一元加法（+）、—元减法（-）、取反（~）

    //优先级 4 乘法（.*）、矩阵乘法（*）、右除（./）、左除（.\）、矩阵右除（/）、矩阵左除（\）
    times   : ['DM', /[\+\-]?\s*[\w\.]*\w+\s*\.\*\s*[\w\.]*\w+/],  // .* 乘
    mtimes  : ['MU', /[\+\-]?\s*[\w\.]*\w+\s*\*\s*[\w\.]*\w+/],    // * 矩阵乘
    rdivide : ['DR', /[\w\.]*\w+\s*\.\/\s*[\w\.]*\w+/],  // 右除（./）
    ldivide : ['DL', /[\w\.]*\w+\s*\.\\\s*[\w\.]*\w+/],  // 左除（.\）
    mrdivide: ['RD', /[\w\.]*\w+\s*\/\s*[\w\.]*\w+/],    // 矩阵右除（/）
    mldivide: ['LD', /[\w\.]*\w+\s*\\\s*[\w\.]*\w+/],    // 矩阵左除（\）

    //优先级 5 加法（+）、减法（-）、逻辑非（~）
    //存在连续+-，每次只处理一个
    '+'       : ['AD', /[\+\-]?[\w\.]+\s*[\+\-]\s*[\w\.]+/],
    '+noblank': ['AD', /[\w\.]+[\+\-][\w\.]+/], // '-'       : ['MN', /[\+\-]?[\w\.]+\s*\-\s*[\w\.]+/g],
    // '-noblank': ['MN', /[\w\.]+\-[\w\.]+/g],
    '~'       : ['NT', /[\~\!]\s*[\w\.]+/g],

    //优先级 6 冒号运算符（:）

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

    //下面是代码块
    assignment: ['AS', /\w+\s*[\+\-]?=\s*[\w\.\+\- ]+\;?/g], //赋值语句 s* `+`?`= s* \w
    multias   : ['MA', /_\d{5}_(AE|BE)_\s*[\+\-]?=\s*[\w\.\+\-]+;?/g], //赋值语句 s* `+`?`= s* \w

    id     : ['ID', /_\d{5}_[A-Z]{2}_/g],
    id_only: ['ID', /^_\d{5}_\w\w_$/g]
  },
}

function analysis(source_code){
  if(typeof(source_code)!='string'){
    return source_code
  }

  SYMS.source_g = {}
  SYMS.source_i = 10000
  SYMS.changed  = false

  var t0 = $.MS()
  let s  = source_code

  // s = 替换引号对(s)

  var s0

  s = 替换括号(s)
  while(1){
    s0 = s

    s = 替换语句(s)
    s = 替换代码块(s)

    if(s == s0){
      break
    }
  }

  // console.log('结果')
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
  var arr     = '[,(,{'.split(',')
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
  SYMS.changed = false
  var group    = SYMS.正则[reg_s][0]
  s            = s.replace(SYMS.正则[reg_s][1], s => {
    SYMS.changed = true

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

  s = 替换(s, 'action')     //虚数

  //优先级 2 矩阵转置和乘方：转置（.'）、共轭转置（'）、乘方（.^）、矩阵乘方（^）
  s = 替换(s, 'dottran')
  s = 替换(s, 'tran')
  s = 替换(s, 'power')
  s = 替换(s, 'mpower')
  s = 替换(s, 'mpower2')

  //优先级 3 一元加法（+）、—元减法（-）、取反（~）

  //优先级 4 乘法（.*）、矩阵乘法（*）、右除（./）、左除（.\）、矩阵右除（/）、矩阵左除（\）
  while(true){
    let m = s.split(/(\.\*|\*|\.\/|\.\\|\/|\\)/g)
    if(m.length<3){
      break
    }
    // console.log('优先级 4', m, s)
    //
    // console.log('dodo', m, s)
    let s0 = s
    let s1 = m.slice(0, m.length-3).join('')
    let s2 = m.slice(m.length-3).join('')
    switch(m[m.length-2]){
      case '.*':
        s = s1 + 替换(s2, 'times', 'once')
        break
      case '*':
        s = s1 + 替换(s2, 'mtimes', 'once')
        break
      case './':
        s = s1 + 替换(s2, 'rdivide', 'once')
        break
      case '.\\':
        s = s1 + 替换(s2, 'ldivide', 'once')
        break
      case '/':
        s = s1 + 替换(s2, 'mrdivide', 'once')
        break
      case '\\':
        s = s1 + 替换(s2, 'mldivide', 'once')
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

  //优先级 6 冒号运算符（:）

  //优先级 7 小于（<）、小于等于（<=）、大于（>）、大于等于（>=）、等于（==）、不等于（~=）
  s = 替换(s, 'condition')
  s = 替换(s, 'notequal')

  //优先级 8 逐元素逻辑与（&）
  //优先级 9 逐元素逻辑或（|）
  //优先级 10 避绕式逻辑与，或者捷径逻辑与（&&）
  //优先级 11 避绕式逻辑或，或者捷径逻辑或（||）
  s = 替换(s, '&|')
  s = 替换(s, '&&')
  s = 替换(s, '||')

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

  // s = 替换(s, 'anonymous_func')
  // s = 替换(s, '@func')

  s = 替换(s, 'multias') //[V,D] = eig(B)
  s = 替换(s, 'assignment') //A(:,:,1) = [2 0; 0 0]

  return s
}

function 替换(s, reg_s, once){
  // console.log(reg_s)
  var group = SYMS.正则[reg_s][0]
  let s1    = ''
  while(s != s1){
    s1 = s
    s  = s1.replace(SYMS.正则[reg_s][1], s => {
      if(('+' == reg_s[0] || '-' == reg_s[0]) && /end/.test(s)){
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

    if(once){
      break
    }
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
    while(SYMS.正则.id[1].test(s) && i--){
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

  return s.replace(SYMS.正则.id[1], function(uuid){
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

function setRoot(str){
  return SYMS['source_g'].root = str
}

function getRoot(){
  return SYMS['source_g'].root
}

function getUuidCode(group, uuid){
  return SYMS['source_g'][group][uuid]
}

function saveUuid(group = 'root', str){
  var g = SYMS['source_g']

  if(group == 'root'){
    g.root = str
    return 'root'
  }
  if(!g[group]){
    g[group] = {}
  }

  var i    = SYMS['source_i']++
  let uuid = '_' + i + '_' + group + '_'

  g[group][uuid] = str

  // console.log(group, uuid, str)
  return uuid
}

function getGroup(uuid){
  return uuid.slice(7, 9) // (-4, -2)
}

function trans2MathJax(s, fgroup = []){
  // 公式使用参考 https://www.cnblogs.com/q735613050/p/7253073.html
  var REG = SYMS.正则

  var i = 100000
  var j, act, fun, arg

  var id_reg = REG.id[1]
  while(id_reg.test(s) && i--){
    j = 0
    s = s.replace(id_reg, function(uuid){
      j++
      var group  = getGroup(uuid)
      var source = getUuidCode(group, uuid)

      var c = source.trim()

      var a
      switch(group){
        case 'AS':
          break
        case 'BR':
          if(/RD/.test(fgroup[0])){
            c = c.slice(1, -1)
          }

          if(/MI/.test(fgroup[0])){ //&& j != 1
            // console.log(c, j)
            if(j != 1 || /_\d{5}_MI_/.test(c)){
              c = c.slice(1, -1)
            }
          }

          if(c[0] == '('){
            c = ' \\left(' + c.slice(1, -1) + ' \\right)'
          }

          break
        case 'CN':
          a = c.match(/[\>\<\=\~\!]+/)
          c = ['cn(', c.slice(0, a.index), ',"', a[0], '",', c.slice(a.index + a[0].length), ')'].join('')
          break
        case 'CP':
          // a = c.split(/\b/g)
          // a = c.slice(0, -1)
          c      = c.replace(/\s*/g, '')
          let im = c.match(/[\+\-]?\s*\d*(\.\d+)?[ij]/g)
          let re = +c.replace(im[0], '')
          im     = im[0].slice(0, -1) || 1
          im     = im == '-' || im == '+' ? +(im + '1') : +im
          c      = ['complex(', re, ',', im, ')'].join('')
          break
        case 'DA':
          a = c.match(/&&/)
          c = ['doubleand(', c.slice(0, a.index), ',', c.slice(a.index + a[0].length), ')'].join('')
          break
        case 'DE':
          a = c.match(/\.\^/)
          c = ['M.power(', c.slice(0, a.index), ',', c.slice(a.index + a[0].length), ')'].join('')
          break
        case 'DG':
          a = c.match(/\'/)
          c = ['M.ctranspose(', c.slice(0, a.index), ')'].join('')
          break
        case 'DL':
          a = c.split(/\s*\.\\\s*/g)
          c = ['M.ldivide(', a[0], ',', a[1], ')'].join('')
          break
        case 'DM':
          a = c.match(/\.\*/)
          c = ['M.times(', c.slice(0, a.index), ',', c.slice(a.index + a[0].length), ')'].join('')
          break
        case 'DO':
          a = c.match(/\|\|/)
          c = ['doubleor(', c.slice(0, a.index), ',', c.slice(a.index + a[0].length), ')'].join('')
          break
        case 'DR':
          a = c.split(/\s*\.\/\s*/g)
          c = ['M.rdivide(', a[0], ',', a[1], ')'].join('')
          break
        case 'DZ':
          a = c.match(/\.\'/)
          c = ['M.transpose(', c.slice(0, a.index), ')'].join('')
          break
        case 'LD':
          a = c.match(/\\/)
          c = '\\frac{' + c.slice(0, a.index) + '}{' + c.slice(a.index + a[0].length) + '}'
          break
        case 'LG':
          c = c.replace(/\|/g, '||')
          c = c.replace(/\&/g, '&&')
          break
        case 'MA':
          act = c.slice(-1) == ';' ? 'multias' : 'multiasshow'
          c   = c.slice(-1) == ';' ? c.slice(0, -1) : c
          a   = c.split(/\s*\=\s*/g)

          a[1] = a[1].replace(/_\d{5}_AR_/, s => {
            return 'ndarray(' + s + ')'
          })

          c = [act, '(', a[0], ',', a[1], ')'].join('')
          break
        case 'MI':
          a = c.match(/\^/)
          c = '{' + c.slice(0, a.index) + '}^{' + c.slice(a.index + a[0].length) + '}'
          // c = ['M.mpower(', , ',', , ')'].join('')
          break
        case 'MN': //被add代替
          a = c.split(/\s*\-\s*/g)
          if(a.length == 3){
            c = ['M.minus(M.mtimes(', a[1], ', -1),', a[2], ')'].join('')
          }
          else{
            c = ['M.minus(', a[0], ',', a[1], ')'].join('')
          }
          break
        case 'MU':
          a = c.split(/\s*\*\s*/g)
          c = a[0] + '' + a[1]
          // if(a[0][0] == '-'){
          //   c = ['M.mtimes(M.mtimes(', a[1].slice(1), ', -1),', a[2], ')'].join('')
          // }
          // else{
          //   c = ['M.mtimes(', a[0], ',', a[1], ')'].join('')
          // }
          break
        case 'NE':
          c = c.replace(/\s*\~\=\s*/, '!=')
          break
        case 'NT':
          c = c.replace(/\s*\~\s*/, '!')
          break
        case 'OB':
          // if(fgroup[0] == 'CA'){
          //   a = c.slice(1, -1).split(',')
          //   c = a.join(':\ncase ')
          // }
          // else{
          //   a = c.slice(1, -1).split(';')
          //   c = '[' + a.join(',') + ']'
          // }
          break
        case 'RD':
          a = c.match(/\//)
          c = '\\frac{' + c.slice(0, a.index) + '}{' + c.slice(a.index + a[0].length) + '}'
          break
        case 'PI':
          c = '\\pi'
          break
        default:
      }

      return trans2MathJax(c, [group, ...fgroup])
    })
  }

  return s
}

function trans2MathObj(uuid, fgroup = [], j = 0){
  uuid = uuid.trim()
  if(!/^_\d{5}_\w\w_$/g.test(uuid)){
    // console.error('trans2MathObj only accept uuid', s)
    return uuid
  }

  var act, fun, arg, obj = {}

  var group  = getGroup(uuid)
  var source = getUuidCode(group, uuid)
  var fgroup = fgroup.slice()
  var current_fgroup = fgroup.slice()
  fgroup.unshift(group)

  var obj = {
    uuid,
    group,
    fgroup:current_fgroup,
    source
  }

  var c = source.trim()

  var a
  switch(group){
    case 'AC':
      obj.p1 = trans2MathObj(c.slice(0, -10).trim(), fgroup)
      obj.p2 = trans2MathObj(c.slice(-10), fgroup, j = 1)
      break
    case 'AD':
      a = c.match(/\+|\-/)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      obj.p2 = trans2MathObj(a[0], fgroup, j = 1)
      obj.p3 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 2)
      break
    case 'AS':
      a            = c.split(/\s*\=\s*/)
      obj.p1 = trans2MathObj(a[0], fgroup)
      obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'BR':
      c = c.slice(1, -1)
      obj.p1 = trans2MathObj(c, fgroup)
      break
    case 'CN':
      a = c.match(/[\>\<\=\~\!]+/)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      obj.p2 = trans2MathObj(a[0], fgroup, j = 1)
      obj.p3 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 2)
      break
    case 'CP':
      c      = c.replace(/\s*/g, '')
      let im = c.match(/[\+\-]?\s*\d*(\.\d+)?[ij]/g)
      let re = +c.replace(im[0], '')
      im     = im[0].slice(0, -1) || 1
      im     = im == '-' || im == '+' ? +(im + '1') : +im
      obj.p1 = trans2MathObj(re, fgroup)
      obj.p2 = trans2MathObj(im, fgroup, j = 1)
      break
    case 'DA':
      a = c.match(/&&/)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'DE':
      a = c.match(/\.\^/)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'DG':
      a = c.match(/\'/)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      break
    case 'DL':
      a = c.split(/\s*\.\\\s*/g)
      obj.p1 = trans2MathObj(a[0], fgroup)
      obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'DM':
      a = c.match(/\.\*/)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'DO':
      a = c.match(/\|\|/)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'DR':
      a = c.split(/\s*\.\/\s*/g)
      obj.p1 = trans2MathObj(a[0], fgroup)
      obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'DZ':
      a = c.match(/\.\'/)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      break
    case 'LD':
      a = c.match(/\\/)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'LG':
      c = c.replace(/\|/g, '||')
      c = c.replace(/\&/g, '&&')
      a = c.split(/\s*(\|\||\&\&)\s*/g)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'MA':
      c   = c.slice(-1) == ';' ? c.slice(0, -1) : c
      a   = c.split(/\s*\=\s*/g)
      obj.p1 = trans2MathObj(a[0], fgroup)
      obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'MI':
      a = c.match(/\^/)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'MN': //被add代替
      a = c.split(/\s*\-\s*/g)
      obj.p1 = trans2MathObj(a[0], fgroup)
      obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'MU':
      a = c.split(/\s*\*\s*/g)
      obj.p1 = trans2MathObj(a[0], fgroup)
      obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'NE':
      c = c.replace(/\s*\~\=\s*/, '!=')
      a = c.split(/\s*\!\=\s*/g)
      obj.p1 = trans2MathObj(a[0], fgroup)
      obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'NT':
      c = c.replace(/\s*\~\s*/, '!')
      a = c.split(/\s*\!\s*/g)
      obj.p1 = trans2MathObj(a[0], fgroup)
      obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'OB':
      break
    case 'RD':
      a = c.match(/\//)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'PI':
      obj.p1 = trans2MathObj(c, fgroup)
      break
    default:
  }

  return obj
}

function obj2mathjax(obj, n){
  if(typeof(obj)!='object' || !obj.group){
    // console.log('pass', obj)
    return obj
  }
  let str = ''
  switch(obj.group){
    case 'AC':
      str = obj2mathjax(obj.p1, 1)+obj2mathjax(obj.p2, 2)
      // obj.p1 = trans2MathObj(c.slice(0, -10).trim(), fgroup)
      // obj.p2 = trans2MathObj(c.slice(-10), fgroup, j = 1)
      break
    case 'AD':
      str = obj2mathjax(obj.p1, 1)+obj.p2+obj2mathjax(obj.p3, 3)
      // a = c.match(/\+|\-/)
      // obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      // obj.p2 = trans2MathObj(a[0], fgroup, j = 1)
      // obj.p3 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 2)
      break
    case 'AS':
      str = obj2mathjax(obj.p1, 1)+'='+obj2mathjax(obj.p2, 2)
      // a            = c.split(/\s*\=\s*/)
      // obj.p1 = trans2MathObj(a[0], fgroup)
      // obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'BR':
      if(/DR|DL|RD/.test(obj.fgroup[0])){
        str = obj2mathjax(obj.p1, 1)
      }
      else if(/MI/.test(obj.fgroup[0]) && n==2){
        str = obj2mathjax(obj.p1, 1)
      }
      else{
        // console.log('BR', obj.fgroup[0], obj.p1)
        str = ' \\left('+obj2mathjax(obj.p1, 1)+' \\right)'
      }

      // c = c.slice(1, -1)
      // obj.p1 = trans2MathObj(c, fgroup)s
      break
    case 'CN':
      str = obj2mathjax(obj.p1, 1)+obj.p2+obj2mathjax(obj.p3, 3)
      // a = c.match(/[\>\<\=\~\!]+/)
      // obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      // obj.p2 = trans2MathObj(a[0], fgroup, j = 1)
      // obj.p3 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 2)
      break
    case 'CP':
      let imag = obj2mathjax(obj.p3, 3)
      let sign = imag[0]=='-' ? '-' : '+'
      str = obj2mathjax(obj.p1, 1)+obj.p2+sign+obj2mathjax(obj.p3, 3)+'i'

      // c      = c.replace(/\s*/g, '')
      // let im = c.match(/[\+\-]?\s*\d*(\.\d+)?[ij]/g)
      // let re = +c.replace(im[0], '')
      // im     = im[0].slice(0, -1) || 1
      // im     = im == '-' || im == '+' ? +(im + '1') : +im
      // obj.p1 = trans2MathObj(re, fgroup)
      // obj.p2 = trans2MathObj(im, fgroup, j = 1)
      break
    case 'DA':
      str = obj2mathjax(obj.p1, 1)+'&&'+obj2mathjax(obj.p2, 2)

      // a = c.match(/&&/)
      // obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      // obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'DE':
      str = '{'+obj2mathjax(obj.p1, 1)+'}.^{'+obj2mathjax(obj.p2, 2)+'}'

      // a = c.match(/\.\^/)
      // obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      // obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'DG':
      str = '{'+obj2mathjax(obj.p1, 1)+"}'"

      // a = c.match(/\'/)
      // obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      break
    case 'DL':
      str = ' \\frac{'+obj2mathjax(obj.p1, 1)+'}{'+obj2mathjax(obj.p2, 2)+'}'

      // a = c.split(/\s*\.\\\s*/g)
      // obj.p1 = trans2MathObj(a[0], fgroup)
      // obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'DM':
      // a = c.match(/\.\*/)
      // obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      // obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'DO':
      // a = c.match(/\|\|/)
      // obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      // obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'DR':
      str = ' \\frac{'+obj2mathjax(obj.p1, 1)+'}{'+obj2mathjax(obj.p2, 2)+'}'

      // a = c.split(/\s*\.\/\s*/g)
      // obj.p1 = trans2MathObj(a[0], fgroup)
      // obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'DZ':
      // a = c.match(/\.\'/)
      // obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      break
    case 'LD':
      // a = c.match(/\\/)
      // obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      // obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'LG':
      // c = c.replace(/\|/g, '||')
      // c = c.replace(/\&/g, '&&')
      // a = c.split(/\s*(\|\||\&\&)\s*/g)
      // obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      // obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'MA':
      // c   = c.slice(-1) == ';' ? c.slice(0, -1) : c
      // a   = c.split(/\s*\=\s*/g)
      // obj.p1 = trans2MathObj(a[0], fgroup)
      // obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'MI':
      str = '{'+obj2mathjax(obj.p1, 1)+'}^{'+obj2mathjax(obj.p2, 2)+'}'

      // a = c.match(/\^/)
      // obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      // obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'MN': //被add代替
      // a = c.split(/\s*\-\s*/g)
      // obj.p1 = trans2MathObj(a[0], fgroup)
      // obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'MU':
      str = obj2mathjax(obj.p1, 1)+obj2mathjax(obj.p2, 2)

      // a = c.split(/\s*\*\s*/g)
      // obj.p1 = trans2MathObj(a[0], fgroup)
      // obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'NE':
      // c = c.replace(/\s*\~\=\s*/, '!=')
      // a = c.split(/\s*\!\=\s*/g)
      // obj.p1 = trans2MathObj(a[0], fgroup)
      // obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'NT':
      // c = c.replace(/\s*\~\s*/, '!')
      // a = c.split(/\s*\!\s*/g)
      // obj.p1 = trans2MathObj(a[0], fgroup)
      // obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'OB':
      break
    case 'RD':
      str = ' \\frac{'+obj2mathjax(obj.p1, 1)+'}{'+obj2mathjax(obj.p2, 2)+'}'

      // a = c.match(/\//)
      // obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      // obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'PI':
      str = ' \\pi '

      // obj.p1 = trans2MathObj(c, fgroup)
      break
    default:
  }

  return str
}