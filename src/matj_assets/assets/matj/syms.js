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

    action: ['AC', /\w+[ \t]*_\d{5}_BR_/g],

    //优先级 2 矩阵转置和乘方：转置（.'）、共轭转置（'）、乘方（.^）、矩阵乘方（^）
    dottran: ['DZ', /\w+\s*\.\'/g],  // .' 矩阵转置
    tran   : ['DG', /\w+\s*\'/g],    // ' 矩阵共轭转置
    power  : ['DE', /[\w\.]+\s*\.\^\s*[\w\.]+/g],  // .^ 乘方
    mpower : ['MI', /[\w\.]+\s*\^\s*[\w\.]+(?!\^)/g],    // ^ 矩阵乘方
    mpower2: ['MI', /_\d{5}_BR_\s*\^\s*[\w\.]+(?!\^)/g],    // ^ 矩阵乘方 mpower 覆盖 mpower2，多余吗？

    //优先级 3 一元加法（+）、—元减法（-）、取反（~）

    //优先级 4 乘法（.*）、矩阵乘法（*）、右除（./）、左除（.\）、矩阵右除（/）、矩阵左除（\）
    times   : ['DM', /[\w\.]*\w+\s*\.\*\s*[\w\.]*\w+/],  // .* 乘
    mtimes  : ['MU', /[\w\.]*\w+\s*\*\s*[\w\.]*\w+/],    // * 矩阵乘
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
    nagtive   : ['NG', /\-\s*[_a-zA-Z]([\w\.]*\w)*/g],      // 自负 -xxx

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

let LIMIT = {
  特定形式mn      : (output, f, n, a, ng) => {
    let x = n.p1.p1.p1.p2
    let y = n.p2.p1.p1.p2
    output.push(`Numerator factorization into polynomials: ${ng}$(x-1)(x^{${x}-1}+x^{${x}-2}+...+1)$`)
    output.push(`Denominator factorization into polynomials: $(x-1)(x^{${y}-1}+x^{${y}-2}+...+1)$`)
    result = `${x}/${y}`
    output.push(`The limit value is: ${result}`)
    return result
  },
  特定形式sin_tan : (output, f, n, a, ng) => {
    let f1 = f.replace(str2reg('1/sin(x)-1/tan(x)'), '(1-cos(x))/sin(x)')
    let n1 = str2obj(ng + f1)
    output.push('Convert to: ' + M.mathjax(n1))
    let n2 = objSimplify(n1)
    output.push('Convert to: ' + M.mathjax(n2))
    let f2 = obj2str(n2)
    return M.limit2(output, f2, n2, a)
    // return result
  },
  特定形式tan_sin : (output, f, n, a, ng) => {
    let f1 = f.replace(str2reg('tan(x)-sin(x)'), 'tan(x)*(1-cos(x))')
    let n1 = str2obj(ng + f1)
    output.push('Convert to: ' + M.mathjax(n1))
    // let n2 = objSimplify(n1)
    // output.push('Convert to: ' + M.mathjax(n2))
    return M.limit2(output, '', n1, a)
    // return result
  },
  特定形式sin_pi  : (output, f, n, a, ng) => {
    output.push('Convert non-zero limit to zero limit')

    f = M.transferLimit(f, a)
    a = 0
    n = str2obj(f)

    output.push(M.mathjaxLim(n, a, ng))

    f = f.replace(str2reg('sin(pi*(x+1))'), '-sin(pi*x)')
    f = f.replace(/\+\-/g, '-')
    f = f.replace(/\+\+/g, '+')
    f = f.replace(/\-\-/g, '+')
    if(f[0] == '-'){
      f  = f.slice(1)
      ng = ng == '' ? '-' : ''
    }
    n = str2obj(f)

    output.push('Simplify continue')
    output.push(M.mathjaxLim(n, a, ng))

    return M.limit2(output, f, n, a, ng)
    //LIMIT.特定形式sin_tan(output, f, n, a, ng)
  },
  特定形式tan_pi_2: (output, f, n, a, ng) => {
    output.push('Convert non-zero limit to zero limit')

    f = M.transferLimit(f, a)
    a = 0
    n = str2obj(f)

    output.push(M.mathjaxLim(n, a, ng))

    output.push('Simplify continue')
    if(str2reg('tan((pi*(x+1))/2)').test(f)){
      f = f.replace('tan((pi*(x+1))/2)', 'tan(pi*x/2+pi/2)')
    }
    else{
      f = f.replace('tan(pi*(x+1)/2)', 'tan(pi*x/2+pi/2)')
    }
    n = str2obj(f)
    output.push(M.mathjaxLim(n, a, ng))

    output.push('Simplify continue')
    f = f.replace('*tan(pi*x/2+pi/2)', '/tan(-pi*x/2)')
    f = f.replace('/tan(pi*x/2+pi/2)', '*tan(-pi*x/2)')
    f = f.replace('tan(pi*x/2+pi/2)', '1/tan(-pi*x/2)')
    n = str2obj(f)
    output.push(M.mathjaxLim(n, a, ng))

    return M.limit2(output, f, n, a, ng)
    //LIMIT.特定形式sin_tan(output, f, n, a, ng)
  },
  特定形式tan_pi  : (output, f, n, a, ng) => {
    output.push('Convert non-zero limit to zero limit')

    f = M.transferLimit(f, a)
    a = 0
    n = str2obj(f)

    output.push(M.mathjaxLim(n, a, ng))

    output.push('Simplify continue')
    f = f.replace('tan(-x)', '(-tan(x))')
    f = f.replace('tan(pi*(x+1)/2)', 'tan(pi*x/2+pi/2)')
    f = f.replace(/\.*tan\([\w\*]+\+pi\/2\)/, str => {
      let pre_arr   = str.split('tan')
      let pre_str   = pre_arr[0]
      let other_str = str.slice(4, -6)
      if(pre_str.slice(-1) == '*'){
        return '-' + pre_str.slice(0, -1) + `/tan(${other_str})`
      }
      else if(pre_str.slice(-1) == '/'){
        return '-' + pre_str.slice(0, -1) + `*tan(${other_str})`
      }
      else{
        return `(-1)/tan(${other_str})`
      }
    })
    n = str2obj(f)

    if(n.group == 'MU' && n.p1.group == 'RD'){
      let p1 = noBr(n.p2)
      if(noBr(n.p1.p1) == -1 && p1.group == 'NG'){
        n = {
          group: 'RD',
          p1   : p1.p1,
          p2   : n.p1.p2
        }
      }
      else if(n.p1.p1 != 1){
        p1 = {
          group: 'MU',
          p1   : n.p1.p1,
          p2   : p1
        }
      }
      else{
        n = {
          group: 'RD',
          p1   : p1,
          p2   : n.p1.p2
        }
      }
    }

    f = obj2str(n)
    output.push(M.mathjaxLim(n, a, ng))

    return M.limit2(output, f, n, a, ng)
    //LIMIT.特定形式sin_tan(output, f, n, a, ng)
  },
  特定形式log_log : (output, f, n, a, ng) => {
    output.push('Convert logarithmic subtraction to logarithmic inner division')
    let f1 = f.replace('log(x+1)-log(x)', 'log(1+1/x)')
    let n1 = str2obj(f1)
    output.push('Convert to: ' + M.mathjaxLim(n1, a, ng))

    let f2 = '(1+1/x)^x=e'
    let n2 = str2obj(f2)
    output.push('According to the formula: ' + M.mathjaxLim(n2, Infinity))

    let f3 = f1.replace('log(1+1/x)', 'log(e^(1/x))')
    let n3 = str2obj(f3)
    output.push('Convert to: ' + M.mathjaxLim(n3, a, ng))

    let f4 = f3.replace('log(e^(1/x))', '1/x')
    let n4 = str2obj(f4)
    output.push('Convert to: ' + M.mathjaxLim(n4, a, ng))

    let [x_mi, x_c] = infiniteMu(n4)
    result          = showMiC(x_mi, x_c, ng)

    output.push('The limit value is: ' + result)

    return result
  },
  特定形式cos_1_x : (output, f, n, a, ng) => {
    output.push('将无限极值转换为零极值')
    let f1 = f.replace(/x/g, '(1/x)')
    let n1 = str2obj(f1)
    a      = 0
    output.push('Convert to: ' + M.mathjaxLim(n1, a, ng))

    let n2 = objSimplify(n1)
    let f2 = obj2str(n2)
    output.push('原式化简为: ' + M.mathjaxLim(n2, a, ng))
    return M.limit2(output, f2, n2, a, ng)
  },
  特定形式e_x     : (output, f, n, a, ng) => {
    // output.push('将无限极值转换为零极值')
    output.push('Convert Infinity to zero')
    let f1 = f.replace(/1\/x/g, 'y')
    f1     = f1.replace(/x/g, '(1/y)')
    f1     = f1.replace(/x/g, '(1/y)')
    f1     = f1.replace(/y/g, 'x')
    f1     = f1.replace(/y/g, 'x')
    f1     = cleanStr(f1)
    let n1 = str2obj(f1)
    a      = 0
    output.push('Convert to: ' + M.mathjaxLim(n1, a, ng))

    let n2 = objSimplify(n1, a)
    let f2 = cleanStr(obj2str(n2))

    output.push('Simplify to: ' + M.mathjaxLim(n2, a, ng))
    return M.limit2(output, f2, n2, a, ng)
  },
  无限比值        : (output, f, n, a, ng) => {
    let n_d   = [0]
    n_d.const = []
    infiniteDegree(n_d, n.p1)
    output.push('The numerator are reduced to polynomials: ' + ng + arr2str(n_d))

    let d_d   = [0]
    d_d.const = []
    infiniteDegree(d_d, n.p2)
    output.push('The denominator are reduced to polynomials: ' + arr2str(d_d))

    return showAdResult2(output, n_d, d_d, a, ng)
  },
  有限比值        : (output, f, n, a, ng) => {
    let numerator   = limitVal(n.p1, a)
    let denominator = +limitVal(n.p2, a)
    if(!denominator){
      output.push('The denominator limit value is 0')
      let n_d   = []
      n_d.const = []
      // n.p1 = objSimplify(n.p1)
      limitDegree(n_d, n.p1)
      output.push('The numerator are reduced to polynomials: ' + ng + arr2str(n_d))

      let d_d   = []
      d_d.const = []
      limitDegree(d_d, n.p2)
      output.push('The denominator are reduced to polynomials: ' + arr2str(d_d))

      return showAdResult2(output, n_d, d_d, a, ng)
    }
    else{
      result = fraction(numerator * (ng == '-' ? -1 : 1), denominator)
      output.push('The limit value is: ' + result)
      denominator > 10 && output.push(result + ' = ' + result.toNumber())
    }

    return result
  },
  无限幂         : (output, f, n, a, ng) => {
    let mi_value = limitVal(n.p2, a)
    let result
    if(!isFinite(mi_value)){
      output.push('The power limit value is: ' + M.mathjaxInf(mi_value))
      if(n.p1 == 'e'){
        if(mi_value == Infinity){
          result = mi_value * (ng == '-' ? -1 : 1)
          output.push('The limit value is: ' + M.mathjaxInf(mi_value))
        }
        else{
          output.push('The limit value is 0')
          result = 0
        }
      }
      else{
        let e_mi    = limitMiAd(n.p1)
        let e_mi_mi = obj2str({
          group: 'RD',
          p1   : addBr(e_mi.p2),
          p2   : addBr(e_mi.p1)
        })

        let [x_mi, x_c] = limitMu(e_mi, n.p2)

        if(x_mi == 0 && x_c[0] == 1 && x_c.length == 1 && !x_c.fraction){
          result = 'e'
        }
        else{
          let e_mi_mi_str = obj2str(e_mi_mi)
          let e_mi_str    = obj2str(e_mi)
          let p2_str      = obj2str(n.p2)
          let f1          = `${ng}(1+(${e_mi_str}))^((${e_mi_mi_str})*(${e_mi_str})*${p2_str})`
          let n1          = str2obj(f1)
          output.push('Convert to: ' + M.mathjaxLim(n1, a))
          let f2 = `${ng}e^(${e_mi_str}*${p2_str})`
          let n2 = str2obj(f2)
          output.push('Convert to: ' + M.mathjaxLim(n2, a))

          result = showEMiC(x_mi, x_c, ng)
        }

        output.push('The limit value is: ' + result)
      }
    }

    return result
  },
  有限幂         : (output, f, n, a, ng) => {
    let mi_value = limitVal(n.p2, a)
    let result
    if(!isFinite(mi_value)){
      if(n.p1 == 'e'){
        if(mi_value == Infinity){
          result = mi_value * (ng == '-' ? -1 : 1)
          output.push('The limit value is: ' + M.mathjaxInf(mi_value))
        }
        else{
          result = 0
          output.push('The limit value is: ' + result)
        }
      }
      else{
        let e_mi          = limitMiAd(n.p1)
        let [p1_mi, p1_c] = limitMu(e_mi)
        let [x_mi, x_c]   = limitMu(e_mi, n.p2)

        if(x_mi == 0 && x_c[0] == 1 && x_c.length == 1 && !x_c.fraction){
          result = Math.E
          output.push('The limit value is: e = ' + result)
        }
        else{
          let f1 = ng + 'e^((' + showMiC(p1_mi, p1_c) + ')*' + obj2str(n.p2) + ')'
          let n1 = str2obj(f1)
          output.push('Convert to: ' + M.mathjaxLim(n1, a, ng))

          let result_s = showEMiC(x_mi, x_c, ng)

          if(x_mi == 0){
            result = Math.pow(Math.E, x_c[0]) * (ng == '-' ? -1 : 1)
            result_s += ' = ' + result
          }
          else{
            result = result_s
          }
          output.push('The limit value is: ' + result_s)
        }
      }
    }

    return result
  },
  无限积         : (output, f, n, a, ng) => {
    // 分析阶次情况
    let [p1_mi, p1_c] = infiniteMu(n.p1)
    let [p2_mi, p2_c] = infiniteMu(n.p2)
    output.push('Part 1 simplify to: ' + showMiC(p1_mi, p1_c[0], ng))
    output.push('Part 2 simplify to: ' + showMiC(p2_mi, p2_c[0]))
    output.push('The limit value is: ' + showMiC(p1_mi + p2_mi, p1_c[0] * p2_c[0], ng))
    let result = Math.pow(a, p1_mi + p2_mi) * p1_c[0] * p2_c[0] * (ng == '-' ? -1 : 1)
    return result
  },
  分母有理化       : (output, f, n, a, ng) => {
    let p1 = objCopy(n.p1)
    if(p1.fgroup){
      p1.fgroup = ['MU']
    }

    let n1 = {
      group: 'RD',
      p1   : {
        fgroup: ['RD'],
        group : 'MU',
        p1    : p1,
        p2    : {
          fgroup: ['MU'],
          group : 'BR',
          p1    : {
            fgroup: ['BR'],
            group : 'AD',
            p1    : n.p2.p1.p1,
            p2    : '+',
            p3    : n.p2.p1.p3
          }
        }
      },
      p2   : {
        fgroup: ['RD'],
        group : 'MU',
        p1    : {
          fgroup: ['MU'],
          group : 'BR',
          p1    : n.p2
        },
        p2    : {
          fgroup: ['MU'],
          group : 'BR',
          p1    : {
            fgroup: ['MU'],
            group : 'AD',
            p1    : n.p2.p1.p1,
            p2    : '+',
            p3    : n.p2.p1.p3
          }
        }
      }
    }

    output.push('Denominator rationalization: ' + M.mathjax(n1, ng))

    let n2 = {
      group: 'RD',
      p1   : {
        fgroup: ['RD'],
        group : 'MU',
        p1    : p1,
        p2    : {
          fgroup: ['MU'],
          group : 'BR',
          p1    : {
            fgroup: ['BR'],
            group : 'AD',
            p1    : objCopy(n.p2.p1.p1),
            p2    : '+',
            p3    : objCopy(n.p2.p1.p3)
          }
        }
      },
      p2   : objSimplify({
        fgroup: ['RD'],
        group : 'AD',
        p1    : getPow2(n.p2.p1.p1, 'MU'),
        p2    : '-',
        p3    : getPow2(n.p2.p1.p3, 'MU')
      })
    }

    output.push('Simplify to: ' + M.mathjax(n2, ng))

    if(!isNaN(n2.p2)){

    }
    else if(sameObj(noBr(n2.p1.p1), n2.p2)){
      n2 = noBr(n2.p1.p2)

      output.push('Simplify to: ' + M.mathjax(n2, ng))
    }
    else{
      let arr_p1 = []
      limitDegree(arr_p1, n2.p1.p1)
      // console.log(arr_p1)

      // let p2 = {
      //   fgroup: ['RD'],
      //   group : 'AD',
      //   p1    : getPow2(n.p2.p1.p1, 'MU'),
      //   p2    : '-',
      //   p3    : getPow2(n.p2.p1.p3, 'MU')
      // }

      let p2 = n2.p2

      let arr_p2 = []
      limitDegree(arr_p2, p2)
      // console.log(arr_p2)

      if(getDegree(arr_p1) >= getDegree(arr_p2)){
        let [q, u, t] = M.deconv(arr_p1, arr_p2)
        if(nearZeroVec(u.data)){
          let p1 = arr2obj(q.data)
          if(p1 == 1){
            n2 = noBr(n2.p2)
          }
          else if((1 / p1) % 1 == 0){
            //是分子为1的分数
            n2 = {
              group: 'RD',
              p1   : noBr(n2.p1.p2),
              p2   : 1 / p1
            }
          }
          else{
            n2 = {
              group: 'MU',
              p1   : p1,
              p2   : n2.p1.p2
            }
          }

          output.push('After division: ' + M.mathjax(n2, ng))
        }
      }
      else{
        let [q, u, t] = M.deconv(arr_p2, arr_p1)
        if(nearZeroVec(u.data)){
          let p1 = arr2obj(q.data)
          if(p1 == 1){
            n2 = noBr(n2.p1.p2)
          }
          else{
            n2 = {
              group: 'RD',
              p1   : noBr(n2.p1.p2),
              p2   : p1
            }
          }

          output.push('After division: ' + M.mathjax(n2, ng))
        }
      }
    }

    if(n2.group == 'RD'){
      var fac = fraction(limitVal(noBr(n2).p1, a) * (ng == '-' ? -1 : 1), limitVal(noBr(n2).p2, a))
      if(fac.d > 10000){
        fac = fac.toNumber()
      }
    }

    let result = n2.group == 'RD' ? fac : limitVal(n2, a)

    output.push('The limit value is: ' + result)

    return result
  },
  分子有理化       : (output, f, n, a, ng) => {
    let n1 = {
      group: 'RD',
      p1   : {
        fgroup: ['RD'],
        group : 'MU',
        p1    : {
          fgroup: ['MU'],
          group : 'BR',
          p1    : n
        },
        p2    : {
          fgroup: ['MU'],
          group : 'BR',
          p1    : {
            fgroup: ['BR'],
            group : 'AD',
            p1    : n.p1,
            p2    : '+',
            p3    : n.p3
          }
        }
      },
      p2   : {
        fgroup: ['RD'],
        group : 'AD',
        p1    : n.p1,
        p2    : '+',
        p3    : n.p3
      }
    }

    output.push('Numerator rationalization: ' + M.mathjax(n1, ng))

    let n2 = {
      group: 'RD',
      p1   : objSimplify({
        fgroup: ['RD'],
        group : 'AD',
        p1    : getPow2(objCopy(n.p1), 'AD'),
        p2    : '-',
        p3    : getPow2(objCopy(n.p3), 'AD')
      }),
      p2   : {
        fgroup: ['RD'],
        group : 'AD',
        p1    : n.p1,
        p2    : '+',
        p3    : n.p3
      }
    }
    output.push('Simplify to: ' + M.mathjax(n2, ng))

    let n_d   = [0]
    n_d.const = []
    infiniteDegree(n_d, n2.p1)
    output.push('Numerator Simplify to polynomial: ' + ng + arr2str(n_d))

    let d_d   = [0]
    d_d.const = []
    infiniteDegree(d_d, n2.p2)
    output.push('Denominator Simplify to polynomial: ' + arr2str(d_d))

    return showAdResult(output, n_d, d_d, a, ng)

  },
  分子有理化3      : (output, f, n, a, ng) => {
    let p1_d   = [0]
    p1_d.const = []
    infiniteDegree(p1_d, n.p1)

    let p3_d   = [0]
    p3_d.const = []
    infiniteDegree(p3_d, n.p3)

    let p1_d_num = (p1_d.length - 1) * (p1_d.fraction || 1)
    let p3_d_num = (p3_d.length - 1) * (p3_d.fraction || 1)
    if(p1_d_num == p3_d_num && p1_d[0] == p3_d[0]){
      let n1 = {
        group: 'RD',
        p1   : {
          group: 'AD',
          p1   : {
            fgroup: ['RD'],
            group : 'MI',
            p1    : addBr(n.p1),
            p2    : 3
          },
          p2   : '-',
          p3   : {
            fgroup: ['RD'],
            group : 'MI',
            p1    : addBr(n.p3),
            p2    : 3
          }
        },
        p2   : {
          group: 'MU',
          p1   : 3 * p1_d[0] * p1_d[0],
          p2   : {
            group: 'MI',
            p1   : 'x',
            p2   : (p1_d.length - 1) * 2 * (p1_d.fraction || 1)
          }
        }
      }

      output.push('Numerator Rationalization，denominator keep the top degree: ' + M.mathjaxLim(n1, a, ng))

      let n2 = objSimplify(n1.p1)

      let n_d   = [0]
      n_d.const = []
      infiniteDegree(n_d, n2)

      let d_d   = [0]
      d_d.const = []
      infiniteDegree(d_d, n1.p2)

      let n3 = {
        group: 'RD',
        p1   : noBr(n2),
        p2   : n1.p2
      }
      output.push('Simplify to polynomial: ' + M.mathjaxLim(n3, a, ng))

      return showAdResult(output, n_d, d_d, a, ng)
    }
    else{
      console.warn('todo')
    }
  },
  分子分母有理化     : (output, f, n, a, ng) => {
    let n_p = {
      group: 'AD',
      p1   : noBr(n.p1).p1,
      p2   : '+',
      p3   : noBr(n.p1).p3
    }

    let d_p = {
      group: 'AD',
      p1   : noBr(n.p2).p1,
      p2   : '+',
      p3   : noBr(n.p2).p3
    }

    let n1 = {
      group: 'RD',
      p1   : {
        fgroup: ['RD'],
        group : 'MU',
        p1    : {
          fgroup: ['MU'],
          group : 'MU',
          p1    : addBr(n.p1, 'MU'),
          p2    : addBr(n_p, 'MU')
        },
        p2    : addBr(d_p, 'MU')
      },
      p2   : {
        fgroup: ['RD'],
        group : 'MU',
        p1    : {
          fgroup: ['MU'],
          group : 'MU',
          p1    : addBr(n.p2, 'MU'),
          p2    : addBr(d_p, 'MU')
        },
        p2    : addBr(n_p, 'MU')
      },
    }

    output.push('Rationalization of numerator / denominator: ' + M.mathjax(n1, ng))

    let n2 = {
      group: 'RD',
      p1   : {
        fgroup: ['RD'],
        group : 'MU',
        p1    : objSimplify({
          fgroup: ['MU'],
          group : 'AD',
          p1    : getPow2(n.p1.p1.p1, 'MU'),
          p2    : '-',
          p3    : getPow2(n.p1.p1.p3, 'MU')
        }),
        p2    : addBr(d_p, 'MU')
      },
      p2   : {
        fgroup: ['RD'],
        group : 'MU',
        p1    : objSimplify({
          fgroup: ['MU'],
          group : 'AD',
          p1    : getPow2(n.p2.p1.p1, 'MU'),
          p2    : '-',
          p3    : getPow2(n.p2.p1.p3, 'MU')
        }),
        p2    : addBr(n_p, 'MU')
      },
    }

    output.push('Simplify to: ' + M.mathjax(n2, ng))

    let result
    if(isFinite(a)){
      result = LIMIT.有限比值(output, f, n2, a, ng)
    }
    else{
      result = LIMIT.无限比值(output, f, n2, a, ng)
    }

    return result
  },
}

function showAdResult(output, n_d, d_d, a, ng){
  let n_d_l = getDegree(n_d)
  let d_d_l = getDegree(d_d)
  let result
  if(n_d_l == d_d_l){
    let fra = fraction(n_d[0] * (ng == '-' ? -1 : 1), d_d[0])
    if(n_d.const.length || d_d.const.length){
      result = cleanStr(polyCombine([fra, ...n_d.const], d_d.const))
    }
    else{
      result = fra
    }

    output.push('Same degree，The limit value is: ' + result)
    if(isFraction(fra) && fra.d > 10){
      output.push(fraction(n_d[0], d_d[0]) + ' = ' + n_d[0] / d_d[0])
    }
    if(/pi/.test(result)){
      output.push(result + ' = ' + eval(result))
    }
  }
  else if(n_d_l > d_d_l){
    let sign = Math.sign(n_d[0] / d_d[0] * (ng == '-' ? -1 : 1))
    result   = sign * Infinity
    output.push(`Numerator\'s degree higher，The limit value is: ` + M.mathjaxInf(result))
  }
  else{
    output.push(`Denominator's degree higher，The limit value is: 0`)
    result = 0
  }

  return result
}

function showAdResult2(output, n_d, d_d, a, ng){
  let n_d_l = getDegree(n_d)
  let d_d_l = getDegree(d_d)
  let result
  if(n_d_l == d_d_l){
    let fra = fraction(n_d[0] * (ng == '-' ? -1 : 1), d_d[0])
    if(n_d.const.length || d_d.const.length){
      result = cleanStr(polyCombine([fra, ...n_d.const], d_d.const))
    }
    else{
      result = fra
    }

    output.push('Same degree，The limit value is: ' + result)
    if(isFraction(fra) && fra.d > 10){
      output.push(fraction(n_d[0], d_d[0]) + ' = ' + n_d[0] / d_d[0])
    }
    if(/pi/.test(result)){
      output.push(result + ' = ' + eval(result))
    }
  }
  else if(n_d_l > d_d_l){
    let [q, u, t] = M.deconv(n_d, d_d)
    // console.log({
    //   q,
    //   u,
    //   t
    // })
    if(nearZeroVec(u.data)){
      output.push(`Numerator factorization: ${ng}(` + arr2str(d_d) + ')(' + arr2str(q.data) + ')')
      output.push(`After division: ${ng}` + arr2str(q.data))
      result = M.polyval(q, a) * (ng == '-' ? -1 : 1)
      output.push('The limit value is: ' + result)
    }
    else{
      result = a * (ng == '-' ? -1 : 1)
      output.push(`Numerator's degree higher，The limit value is: ` + M.mathjaxInf(result))
    }
  }
  else{
    result = 1 / a * (ng == '-' ? -1 : 1)
    output.push(`Denominator's degree higher，The limit value is: ` + M.mathjaxInf(result))
  }

  return result
}

function addBr(obj, fg){
  if(obj.group == 'BR'){
    if(fg){
      obj.fgroup = [fg]
    }
    return obj
  }

  let fgroup = fg || obj.fgroup
  obj.fgroup = 'BR'
  return {
    fgroup: [fgroup],
    group : 'BR',
    p1    : obj
  }
}

function analysis(source_code){
  if(typeof (source_code) != 'string'){
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

  setRoot(s)
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
    if(m.length < 3){
      break
    }
    // console.log('优先级 4', m, s)
    //
    // console.log('dodo', m, s)
    let s0 = s
    if('从前往后解析'){
      let s1 = m.slice(0, 3).join('')
      let s2 = m.slice(3).join('')
      switch(m[1]){
        case '.*':
          s = 替换(s1, 'times', 'once') + s2
          break
        case '*':
          s = 替换(s1, 'mtimes', 'once') + s2
          break
        case './':
          s = 替换(s1, 'rdivide', 'once') + s2
          break
        case '.\\':
          s = 替换(s1, 'ldivide', 'once') + s2
          break
        case '/':
          s = 替换(s1, 'mrdivide', 'once') + s2
          break
        case '\\':
          s = 替换(s1, 'mldivide', 'once') + s2
          break
      }
    }
    else{
      //下列注释的语句为从后往前解析
      let s1 = m.slice(0, m.length - 3).join('')
      let s2 = m.slice(m.length - 3).join('')
      switch(m[m.length - 2]){
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

function checkXY(s){
  let a      = s.split(/[\+\-]/g)
  let symbol = {}
  let b      = a.map(item => {
    let mi_d = 0
    item.replace(/\^\d+/g, mi => {
      // console.log(mi)
      mi = mi.slice(1)
      mi_d += mi - 1
      return ''
    })
    item.replace(/[a-z]+/gi, x => {
      // console.log(x)
      mi_d++
      symbol[x] = 1
      return ''
    })
    // console.log(item, mi_d)
    return mi_d
  })

  // console.log(a, b)
  let k = Object.keys(symbol)

  if(k.length == 1){
    return k
  }

  if(k.length > 2){
    return false
  }

  for(let i = b.length - 1; i > 0; i--){
    if(b[i] != b[0]){
      return false
    }
  }

  return k
}

function limitVal(obj, a){
  if(obj == 'x'){
    return +a
  }

  if(obj == 'e'){
    return Math.E
  }

  if(/\d+e/.test(obj)){
    return Math.E * obj.slice(0, -1)
  }

  if(!isNaN(obj)){
    return +obj
  }

  if(!obj?.group){
    // console.log(obj)
  }
  switch(obj.group){
    case 'AC':
      let result = action(obj.p1, limitVal(obj.p2, a))
      return result
    case 'AD':
      return limitVal(obj.p1, a) * 1 + limitVal(obj.p3, a) * (obj.p2 == '-' ? -1 : 1)
    case 'BR':
      return limitVal(obj.p1, a)
    case 'DL':
      return limitVal(obj.p1, a) / limitVal(obj.p2, a)
    case 'MI':
      let n  = limitVal(obj.p1, a)
      let p2 = noBr(obj.p2)
      if(n < 0 && p2.group == 'RD'){
        let n1 = M.pow(n, limitVal(p2.p1, a))
        if(n1 < 0){
          return -M.pow(-n1, 1 / limitVal(p2.p2, a))
        }
        return M.pow(n1, 1 / limitVal(p2.p2, a))
      }
      return M.pow(n, limitVal(p2, a))
    case 'MU':
      return limitVal(obj.p1, a) * limitVal(obj.p2, a)
    case 'NG':
      return -1 * limitVal(obj.p1, a)
    case 'RD':
      return limitVal(obj.p1, a) / limitVal(obj.p2, a)
    case 'PI':
      return pi
    default:
    // console.error('未处理group', obj.group)
  }
}

function arrAdd(a, i, n){
  a.reverse()
  a[i] = (a[i] || 0) + n
  a.reverse()
  return a
}

function arrMul(a, i, n){
  a.reverse()
  a[i] = (a[i] || 1) * n
  a.reverse()
  return a
}

function limitDegree(a, obj, r = 1){
  if(typeof (obj) == 'string' || typeof (obj) == 'number'){
    if(obj == 'x'){
      return arrAdd(a, 1, r)
    }
    else if(!isNaN(obj)){
      return arrAdd(a, 0, obj * r)
    }
    else{
      constAdd(a, obj)
      return 1
    }
  }

  switch(obj.group){
    case 'AC':
      switch(obj.p1){
        case 'sin':
        case 'tan':
        case 'asin':
        case 'atan':
          return limitDegree(a, obj.p2, r)
        case 'cos':
          let cos_a = []
          limitDegree(cos_a, obj.p2, r)
          cos_a = vecAdd(1, vecMul(cos_a, cos_a, -1 / 2))
          cos_a = vecAdd(a, vecMul(cos_a, r))
          for(let i = Math.max(a.length, cos_a.length) - 1; i >= 0; i--){
            a[i] = cos_a[i] || 0
          }
          return
        case 'log':
          let log_val = limitVal(obj.p2, 0)
          // console.log('log值', log_val)
          if(!isNaN(log_val) && log_val != 1){
            console.error('log极限值必须为1')
          }

          let aaa = []
          limitDegree(aaa, obj.p2, r)
          if(aaa.length > 1){
            limitDegree(a, -r)
            limitDegree(a, obj.p2, r)
          }
          else{
            constAdd(a, `log(${obj.p2.p1})`)
          }

          return
      }
      return ''
    case 'AD':
      let p1_arr = []
      limitDegree(p1_arr, obj.p1, r)
      let p3_arr = []
      limitDegree(p3_arr, obj.p3, obj.p2 == '-' ? -r : r)

      if(!a.length && !a.fraction){
        if(p1_arr.fraction == p3_arr.fraction){
          a.fraction = p1_arr.fraction
          p1_arr.map((n, i) => {
            arrAdd(a, p1_arr.length - 1 - i, n)
          })
          if(p1_arr.const){
            //这里没有考虑复杂情况 todo
            a.const = p1_arr.const
          }
          p3_arr.map((n, i) => {
            arrAdd(a, p3_arr.length - 1 - i, n)
          })
        }
        else if(!p1_arr.fraction && p1_arr.length == 1){
          a.fraction   = p3_arr.fraction
          let p1_arr_0 = p1_arr[p1_arr.length - 1]
          arrAdd(a, p1_arr.length - 1, Math.sign(p1_arr_0) * Math.pow(Math.abs(p1_arr_0), 1 / a.fraction))
          p3_arr.map((n, i) => {
            arrAdd(a, p3_arr.length - 1 - i, n)
          })
        }
        else if(!p3_arr.fraction && p3_arr.length == 1){
          a.fraction   = p1_arr.fraction
          let p3_arr_0 = p3_arr[p3_arr.length - 1]
          arrAdd(a, p3_arr.length - 1, Math.sign(p3_arr_0) * Math.pow(Math.abs(p3_arr_0), 1 / a.fraction))
          p1_arr.map((n, i) => {
            arrAdd(a, p1_arr.length - 1 - i, n)
          })
        }
        else{
          console.warn('todo')
        }
      }
      else if(a.length && !a.fraction && !p1_arr.fracton && !p3_arr.fraction){
        p1_arr.map((n, i) => {
          arrAdd(a, p1_arr.length - 1 - i, n)
        })
        p3_arr.map((n, i) => {
          arrAdd(a, p3_arr.length - 1 - i, n)
        })
      }
      else{
        console.warn('todo')
      }

      return
    case 'BR':
      return limitDegree(a, obj.p1, r)
    case 'DL':
      // return limitVal(obj.p1, a) / limitVal(obj.p2, a)
      return
    case 'MI':
      if(obj.p1 == 'x'){
        let v = limitVal(obj.p2)
        if(v % 1 == 0){
          arrAdd(a, v, 1)
        }
        else if(!a.fraction){
          a.fraction = v
          arrAdd(a, 1, 1)
          let a_const = a[a.length - 1] || 0

          // 下面一行是替代作用
          arrAdd(a, 0, Math.pow(a_const, 1 / v) - a_const)
        }
        else{
          console.warn('todo')
        }

        // return M.pow(limitVal(obj.p1, a), limitVal(obj.p2, a))
        return v
      }
      else if(obj.p1 == 'e'){
        limitDegree(a, r)
        limitDegree(a, obj.p2, r)
      }
      else if(!isNaN(obj.p1)){
        // console.warn('todo')
        let v = limitVal(obj.p2)
        if(v % 1 == 0){
          limitDegree(a, Math.pow(Math.abs(obj.p1), v) * Math.sign(obj.p1 * r))
        }
        else if((1 / v) % 1 == 0){
          a.fraction = v
          limitDegree(a, obj.p1, r)
        }
        //
        // limitDegree(a, obj.p1, r)
        // limitDegree(a, obj.p2)
      }
      else if(typeof (obj.p1) == 'string'){
        limitDegree(a, r)
        limitDegree(a, obj.p2, r)
        constAdd(a, `log(${obj.p1})`)
      }
      else if(obj.p1.group){
        let e_mi = limitMiAd(obj.p1)
        // console.log(e_mi)
        // console.log('极限Convert to: e^' + (e_mi?.source || e_mi) + '*' + 全部复原(obj.p2.uuid))

        let [x_mi, x_c] = limitMu(e_mi, obj.p2)
        if(x_c[0] == 1){
          x_c.shift()
        }

        let n_obj = {
          group: 'MI',
          p1   : 'e'
        }

        if(x_c.length){
          if(x_mi == 0){
            n_obj.p2 = x_c.join('*')
          }
          else if(x_mi == 1){
            n_obj.p2 = {
              group: 'MU',
              p1   : 'x',
              p2   : x_c.join('*')
            }
          }
          else{
            n_obj.p2 = {
              group: 'MU',
              p1   : {
                group: 'MI',
                p1   : 'x',
                p2   : x_mi
              },
              p2   : x_c.join('*')
            }
          }
        }
        else{
          if(x_mi == 0){
            n_obj = 1
          }
          else if(x_mi == 1){
            n_obj = 'e'
          }
          else{
            n_obj.p2 = {
              group: 'MI',
              p1   : 'x',
              p2   : x_mi
            }
          }
        }

        limitDegree(a, n_obj, r)

        // let mi = (x_mi == 0 ? '' : (x_c.length ? '(' : '') + (x_mi == 1 ? 'x*' : 'x^' + x_mi + '*') + x_c.join('*')) + (x_c.length ? ')' : '')
        // console.log('结果：e' + (mi ? '^' + mi : ''))

        return //'e' + (mi ? '^' + mi : '')
      }
      return
    case 'MU':
      let [x_mi, x_c] = limitMu(obj.p1, obj.p2, r)
      arrMul(a, x_mi, x_c[0])
      if(x_c.length > 1){
        constAdd(a, ...x_c.slice(1))
      }

      // return limitDegree(a, obj.p1)
      return
    case 'NG':
      return limitDegree(a, obj.p1, -r)
    case 'RD':
      // let rd_p1 = []
      // limitDegree(rd_p1, obj.p1, r)
      limitDegree(a, obj.p1, r)
      let rd_p2 = []
      limitDegree(rd_p2, obj.p2)
      if(rd_p2.length == 1){
        // 分母是常量
        let v = rd_p2[0]
        if(isNaN(v)){
          a.const.push('1/' + v)
        }
        else if(v != 0){
          for(let i = a.length - 1; i >= 0; i--){
            a[i] = (a[i] || 0) / v
          }
        }
      }
      else{
        console.warn('todo')
      }

      return a
    case 'PI':
      a.const.push('pi')
      return pi
    default:
      console.error('未处理group', obj.group)
  }
}

function limitMiAd(obj){
  switch(obj.group){
    case 'AD':
      let output = ''

      if(obj.p1 - 1){
        return {
          group: 'AD',
          p1   : obj.p1 - 1,
          p2   : '+',
          p3   : obj.p2
        }
      }
      else if(obj.p2 == '-'){
        return {
          group: 'MU',
          p1   : -1,
          p2   : obj.p3
        }
      }

      return obj.p3
    case 'BR':
      return limitMiAd(obj.p1)
    case 'RD':
      return {
        group: 'RD',
        p1   : objSimplify({
          group: 'AD',
          p1   : obj.p1,
          p2   : '-',
          p3   : obj.p2
        }),
        p2   : obj.p2
      }
    default:
      console.error('未处理group', obj.group)
  }
}

function limitMu(...a){
  let x_mi = 0
  let x_c  = [1]
  for(let i = 0, il = a.length; i < il; i++){
    if(typeof (a[i]) == 'string' || typeof (a[i]) == 'number'){
      if(a[i] == 'x'){
        x_mi += 1
      }
      else if(!isNaN(a[i])){
        x_c[0] *= a[i]
      }
      else{
        x_c.push(a[i])
      }
    }
    else if(typeof (a[i] == 'object')){
      switch(a[i].group){
        case 'AD':
          let [ad1_x_mi, ad1_x_c] = limitMu(a[i].p1)
          let [ad3_x_mi, ad3_x_c] = limitMu(a[i].p3)

          if(ad1_x_mi > ad3_x_mi){
            return [ad1_x_mi, ad1_x_c]
          }
          else if(ad1_x_mi < ad3_x_mi){
            return [ad3_x_mi, ad3_x_c.map(v => v *= a[i].p2 == '+' ? 1 : -1)]
          }
          else{
            return [
              ad3_x_mi, ad3_x_c.map((v, index) => {
                v *= a[i].p2 == '+' ? 1 : -1
                v += (ad1_x_c[index] || 0) // 会不会漏过ad1_x_c存在而ad3_x_c不存在的内容？
                return v
              })
            ]
          }
          break
        case 'BR':
          let [br_x_mi, br_x_c] = limitMu(a[i].p1)
          x_mi += br_x_mi
          x_c[0] *= br_x_c[0]
          x_c.push(...br_x_c.slice(1))
          break
        case 'RD':
          let [rd_n_x_mi, rd_n_x_c] = limitMu(a[i].p1)
          x_mi += rd_n_x_mi
          x_c[0] *= rd_n_x_c[0]
          x_c.push(...rd_n_x_c.slice(1))

          let [rd_d_x_mi, rd_d_x_c] = limitMu(a[i].p2)
          x_mi -= rd_d_x_mi
          x_c[0] /= rd_d_x_c[0]
          for(let i = rd_d_x_c.length - 1; i > 0; i--){
            let n = x_c.indexOf(rd_d_x_c[i])
            if(n > 0){
              x_c.splice(n, 1)
            }
            else if(n < 0){
              x_c.push('1/' + rd_d_x_c[i])
            }
          }
          break
        case 'MU':
          let [mu_x_mi, mu_x_c] = limitMu(a[i].p1, a[i].p2)
          x_mi += mu_x_mi
          x_c[0] *= mu_x_c[0]
          x_c.push(...mu_x_c.slice(1))
          break
        case 'MI':
          if(a[i].p1 == 'x' && !isNaN(a[i].p2)){
            x_mi += a[i].p2 * 1
          }
          else if(a[i].p1 == 'e' && !isNaN(a[i].p2)){
            x_c.push('e^' + a[i].p2)
          }
          else{
            console.log('todo')
          }
          break
        case 'AC':
          let arr = []
          limitDegree(arr, a[i])

          if(arr.length){
            x_mi += arr.length - 1
            x_c[0] *= arr[0]
          }
          x_c.push(...(arr.const || []))
          break
        case 'PI':
          x_c.push('pi')
          break
        default:
          console.error('未处理group', a[i].group)
      }
    }
  }

  return [x_mi, x_c]
}

function clearArr(arr){
  for(let i = arr.length - 1; i >= 0; i--){
    arr[i] = arr[i] || 0
  }
  while(arr.length && arr[0] === 0){
    arr.shift()
  }
}

function cleanStr(s){
  let s1 = s.replace(/^\+/g, '')
  s1     = s1.replace(/\(\+/g, '(')
  s1     = s1.replace(/x\^1\b/g, 'x')
  s1     = s1.replace(/x\^0(?!\.)/g, '1')
  s1     = s1.replace(/\b1\*/g, '')
  s1     = s1.replace(/\b1\*/g, '')
  s1     = s1.replace(/\*1\b/g, '')
  s1     = s1.replace(/\-\-/g, '+')
  s1     = s1.replace(/\+\-/g, '-')

  s1     = s1.replace(/(?<!\w)\([\w\.]+\)/g, s => {
    return s.slice(1, -1)
  })
  s1     = s1.replace(/[\+\-\*\/\^]\([\w\.]+\)/g, s => {
    return s[0]+s.slice(2, -1)
  })
  s1     = s1.replace(/[\+\-\*\/]\([^\+\-\(\)]*\)/g, s=>{
    return s[0]+s.slice(2,-1)
  })
  s1     = s1.replace(/^\([^\+\-\(\)]*\)[\+\-\*\/]/g, s=>{
    return s.slice(1,-2)+s.slice(-1)
  })
  s1     = s1.replace(/^\([\w\.]+\)/g, s => {
    return s.slice(1, -1)
  })


  let n = str2obj(s1)
  s1 = obj2str(noBr(n))

  return s1
}

function polyCombine(a = [], b = []){
  let result_n0 = 1
  let result_n  = []
  let result_d  = []
  for(let i = 0, il = a.length; i < il; i++){
    if(a[i]){
      let c = ('' + a[i]).split('/')
      if(isNaN(c[0])){
        result_n.push(cleanStr(c[0]))
      }
      else{
        // result_n0 *= c[0]
        result_n0 = result_n0.mul(c[0])
      }

      if(c[1]){
        if(isNaN(c[1])){
          result_d.push(c[1])
        }
        else{
          // result_n0 /= c[1]
          result_n0 = result_n0.div(c[1])
        }
      }
    }
  }

  for(let i = 0, il = b.length; i < il; i++){
    if(b[i]){
      let c = ('' + b[i]).split('/')
      if(isNaN(c[0])){
        result_d.push(c[0])
      }
      else{
        // result_n0 /= c[0]
        result_n0 = result_n0.div(c[0])
      }

      if(c[1]){
        if(isNaN(c[1])){
          result_d.push(c[1])
        }
        else{
          // result_n0 *= c[1]
          result_n0 = result_n0.mul(c[1])
        }
      }
    }
  }

  let result = result_n0

  if(result_n.length){
    if(result_n0 == 1){
      result = ''
    }
    else if(result_n0 == -1){
      result = '-'
    }
    else{
      result += '*'
    }

    result += '('+result_n.join('*')+')'
  }

  if(result_d.length){
    result += '/' + (result_d.length == 1 ? result_d[0] : brackets(result_n.join('*')))
  }

  //处理一下正负号
  let sign = 0
  result   = ('' + result).replace(/\-/g, ng => {
    sign++
    return ''
  })

  if(sign % 2){
    result = '-' + result
  }

  return result
}

function brackets(s){
  return `(${s})`
}

function constAdd(a, ...arr){
  if(!a.const){
    a.const = []
  }

  a.const.push(...arr)
}

function infiniteDegree(a, obj, r = 1, plus){
  if(typeof (obj) == 'string' || typeof (obj) == 'number'){
    if(obj == 'x'){
      return arrAdd(a, 1, r)
    }
    else if(!isNaN(obj)){
      return arrAdd(a, 0, obj * r)
    }
    else{
      constAdd(a, obj)
      return 1
    }
  }

  switch(obj.group){
    case 'AC':
      switch(obj.p1){
        case 'sin':
        case 'cos':
          return 0
        case 'log':
          let log_val = limitVal(obj.p2, Infinity)
          // console.log('log值', log_val)
          if(log_val != 1){
            // console.log('log极限值必须为1')
          }

          let _a = []
          infiniteDegree(_a, obj.p2)
          if(_a.length == 1 && _a[0] == 1 && _a.ng){
            a.ng = _a.ng
          }
          if(_a.length > 1){
            a[plus] = {
              log: (_a.length - 1) * r
            }
          }

          // 下面是 limitMu的算法
          // let aaa = []
          // limitDegree(aaa, obj.p2, r)
          // if(aaa.length > 1){
          //   limitDegree(a, -r)
          //   limitDegree(a, obj.p2, r)
          // }
          // else{
          //   constAdd(a, `log(${obj.p2.p1})`)
          // }
          return
      }
      return ''
    case 'AD':
      infiniteDegree(a, obj.p1)
      infiniteDegree(a, obj.p3, obj.p2 == '-' ? -1 : 1, 'plus')
      return
    case 'BR':
      return infiniteDegree(a, obj.p1)
    case 'MI':
      let p1_arr = []
      infiniteDegree(p1_arr, obj.p1)
      let [x1_mi, x1_c] = infiniteMu(obj.p1)
      let [x2_mi, x2_c] = infiniteMu(obj.p2)
      let mi            = x1_mi * x2_c[0]
      let c             = Math.pow(x1_c[0], x2_c[0])
      let fra           = (p1_arr.fraction || 1) * x2_c[0]

      // switch(getArrNumber(p1_arr)){
      //       //   case 0:
      //       //     return 0
      //       //   case 1:
      //       //     if(fra > 0 && fra % 1 == 0 && (a.fraction || 1) == 1){
      //       //       arrAdd(a, mi, c * r)
      //       //     }
      //       //     else{
      //       //       console.warn('todo')
      //       //     }
      //       //     break
      //       //   default:
      //       //     a.fraction = (a.fraction || 1) * fra
      //       //
      //       //     p1_arr.forEach((v, i) => {
      //       //       a[i] = v
      //       //     })
      //       // }
      // return

      if(a.length == 0 && !a.fraction){
        if(fra < 0){
          a.ng = [-fra, c] //not sure
        }
        else if(fra % 1 != 0){
          // 非整数
          a.fraction = fra
        }

        p1_arr.forEach((v, i) => {
          a[i] = v
        })
      }
      else{
        arrAdd(a, mi, c * r)
      }
      return
    case 'MU':
      let [x_mi, x_c] = infiniteMu(obj.p1, obj.p2)
      if(x_mi < 0){
        a.ng = [-x_mi, x_c[0]]
      }
      else{
        if(x_mi < 1 && (1 / x_mi) % 1 == 0){
          a.fraction = x_mi
          x_mi       = 1
        }

        // arrMul(a, x_mi, x_c[0])
        arrAdd(a, x_mi, x_c[0])
      }

      if(x_c.length > 1){
        constAdd(a, ...x_c.slice(1))
      }

      if(x_c.times){
        a.times = x_c.times
      }

      // return infiniteDegree(a, obj.p1)
      return
    case 'RD':
      let [p1_mi, p1_c] = infiniteMu(obj.p1)
      let [p2_mi, p2_c] = infiniteMu(obj.p2)
      if(p1_mi - p2_mi >= 0){
        arrAdd(a, p1_mi - p2_mi, p1_c[0] / p2_c[0] * r)
      }
      else{
        a.ng = [p2_mi - p1_mi, p1_c[0] / p2_c[0] * r]
      }
      return pi
    case 'PI':
      return pi
    default:
      console.error('未处理group', obj.group)
  }
}

function infiniteMu(...a){
  let x_mi = 0
  let x_c  = [1]
  for(let i = 0, il = a.length; i < il; i++){
    if(typeof (a[i]) == 'string' || typeof (a[i]) == 'number'){
      if(a[i] == 'x'){
        x_mi += 1
      }
      else if(a[i] != '1'){
        x_c[0] *= a[i]
      }
    }
    else if(typeof (a[i] == 'object')){
      switch(a[i].group){
        case 'AD':
          let [ad1_x_mi, ad1_x_c] = infiniteMu(a[i].p1)
          let [ad3_x_mi, ad3_x_c] = infiniteMu(a[i].p3)

          if(ad1_x_mi > ad3_x_mi){
            return [ad1_x_mi, ad1_x_c]
          }
          else if(ad1_x_mi < ad3_x_mi){
            return [ad3_x_mi, ad3_x_c.map(v => v *= a[i].p2 == '+' ? 1 : -1)]
          }
          else{
            return [
              ad3_x_mi, ad3_x_c.map((v, index) => {
                v *= a[i].p2 == '+' ? 1 : -1
                v += (ad1_x_c[index] || 0) // 会不会漏过ad1_x_c存在而ad3_x_c不存在的内容？
                return v
              })
            ]
          }
          break
        case 'BR':
          let [br_x_mi, br_x_c] = infiniteMu(a[i].p1)
          x_mi += br_x_mi
          x_c[0] *= br_x_c[0]
          x_c.push(...br_x_c.slice(1))
          break
        case 'RD':
          let [rd_n_x_mi, rd_n_x_c] = infiniteMu(a[i].p1)
          x_mi += rd_n_x_mi
          x_c[0] *= rd_n_x_c[0]
          x_c.push(...rd_n_x_c.slice(1))

          let [rd_d_x_mi, rd_d_x_c] = infiniteMu(a[i].p2)
          x_mi -= rd_d_x_mi
          x_c[0] /= rd_d_x_c[0]
          for(let i = rd_d_x_c.length - 1; i > 0; i--){
            let n = x_c.indexOf(rd_d_x_c[i])
            if(n > 0){
              x_c.splice(n, 1)
            }
            else if(n < 0){
              x_c.push('1/' + rd_d_x_c[i])
            }
          }
          break
        case 'MU':
          let [mu_x_mi, mu_x_c] = infiniteMu(a[i].p1, a[i].p2)
          x_mi += mu_x_mi
          x_c[0] *= mu_x_c[0]
          x_c.push(...mu_x_c.slice(1))
          break
        case 'MI':
          let [mi1_x_mi, mi1_x_c] = infiniteMu(a[i].p1)
          let [mi2_x_mi, mi2_x_c] = infiniteMu(a[i].p2)
          x_mi += mi1_x_mi * mi2_x_c[0]
          x_c[0] *= Math.pow(mi1_x_c[0], mi2_x_c[0])
          break
        case 'AC':
          let arr = []
          infiniteDegree(arr, a[i], 1, 'times')

          if(arr.length){
            x_mi += arr.length - 1
            x_c[0] *= arr[0]
          }
          x_c.push(...(arr.const || []))

          if(arr.ng){
            x_mi -= arr.ng[0]
            x_c[0] /= arr.ng[1]
          }

          if(arr.times){
            x_c.times = arr.times
          }
          break
        default:
          console.error('未处理group', a[i].group)
      }
    }
  }

  return [x_mi, x_c]
}

function getArrNumber(arr){
  let num = 0
  arr.map(v => {
    if(v){
      num++
    }
  })
  return num
}

function getPow2(obj, fg){
  if(!typeof (obj) == 'object' || !obj.group){
    if(!isNaN(obj)){
      return Math.pow(obj, 2)
    }
    return {
      fgroup: [fg],
      group : 'MI',
      p1    : obj,
      p2    : 2
    }
  }

  switch(obj.group){
    case 'BR':
      let p1 = getPow2(obj.p1)
      if(typeof (p1) == 'object' && p1.group == 'BR'){
        obj = p1
      }
      else{
        obj.p1 = p1
      }
      return obj
    case 'MI':
      let p2 = getMu2(obj.p2)
      if(p2 == 1 || typeof (p2) == 'object' && p2.group == 'BR' && p2.p1 == 1){
        obj = obj.p1
      }
      else if(!isNaN(obj.p1) && !isNaN(p2)){
        obj = Math.pow(obj.p1, obj.p2)
      }
      else{
        obj.p2 = p2
      }

      return obj
    case 'MU':
      let mu_p1     = getPow2(obj.p1)
      let arr_mu_p1 = []
      limitDegree(arr_mu_p1, mu_p1)

      let mu_p2     = getPow2(obj.p2)
      let arr_mu_p2 = []
      limitDegree(arr_mu_p2, mu_p2)

      let arr_mu_p1p2 = vecMul(arr_mu_p1, arr_mu_p2)
      let mu_obj      = arr2obj(arr_mu_p1p2)
      return mu_obj
    case 'RD':
      obj.p1 = getPow2(obj.p1)
      obj.p2 = getPow2(obj.p2)
      return obj
    default:
      return {
        fgroup: [fg],
        group : 'MI',
        p1    : obj,
        p2    : 2
      }
  }
}

function getMu2(obj, fg){
  if(!typeof (obj) == 'object' || !obj.group){
    if(!isNaN(obj)){
      return obj * 2
    }
    return {
      fgroup: [fg],
      group : 'MU',
      p1    : obj,
      p2    : 2
    }
  }

  switch(obj.group){
    case 'BR':
      let p1 = getMu2(obj.p1)
      if(typeof (p1) == 'object'){
        obj.p1 = p1
      }
      else{
        obj = p1
      }
      return obj
    case 'RD':
      if(!isNaN(obj.p1) && !isNaN(obj.p2)){
        return 2 * obj.p1 / obj.p2
      }
      obj.p1 = getMu2(obj.p1)
      return obj
    default:
      return {
        fgroup: [fg],
        group : 'MU',
        p1    : obj,
        p2    : 2
      }
  }
}

function objCopy(obj){
  return JSON.parse(JSON.stringify(obj))
}

function sameObj(a, b){
  if(a.group == b.group && a.p1 == b.p1 && a.p2 == b.p2){
    return true
  }
}

function noBr(obj){
  return obj?.group == 'BR' ? noBr(obj.p1) : obj
}

function setMi(n, v, fraction = 1){
  if(n == 0){
    //可能有问题，待定
    if(fraction != 1){
      if(v == 0){
        return 0
      }
      else{
        let v1 = keepZero(Math.pow(Math.abs(v), fraction))
        if(v1 % 1 == 0){
          //开方整数
          return (v >= 0 ? 1 : -1) * v1
        }
        else if(v > 0){
          return {
            group: 'MI',
            p1   : v,
            p2   : {
              fgroup: ['MI'],
              group : 'RD',
              p1    : 1,
              p2    : 1 / fraction
            }
          }
        }
        else if(v < 0){
          return {
            group: 'MU',
            p1   : '-1',
            p2   : {
              fgroup: ['MU'],
              group : 'MI',
              p1    : -v,
              p2    : {
                fgroup: ['MI'],
                group : 'RD',
                p1    : 1,
                p2    : 1 / fraction
              }
            }
          }
        }
      }
    }

    return v
  }

  let obj = 'x'
  //解决x的幂
  if(Math.abs(fraction) == 1){
    if(n != 1){
      obj = {
        group: 'MI',
        p1   : obj,
        p2   : n
      }
    }

    if(fraction == -1){
      return {
        group: 'RD',
        p1   : v,
        p2   : obj,
      }
    }
  }
  else if(1 / fraction % 1 == 0){
    obj = {
      group: 'MI',
      p1   : obj,
      p2   : addBr({
        fgroup: 'MI',
        group : 'RD',
        p1    : n,
        p2    : 1 / fraction
      })
    }
  }

  //解决幂前的常数
  if(v == -1){
    obj = {
      group: 'NG',
      p1   : obj
    }
  }
  else if(Math.abs(fraction) >= 1){
    if(v != 1){
      if(1 / v % 1 == 0){
        obj = {
          group: 'RD',
          p1   : obj,
          p2   : 1 / v
        }
      }
      else{
        obj = {
          group: 'MU',
          p1   : v,
          p2   : obj
        }
      }
    }
  }
  else if(Math.abs(fraction) < 1){
    let p1 = keepZero(Math.pow(Math.abs(v), n * fraction))
    if(p1 % 1 == 0){
      //把数字从根号中提出
      if(p1 != 1){
        obj = {
          group: 'MU',
          p1   : Math.sign(v) * p1,
          p2   : obj
        }
      }
    }
    else{
      obj = {
        // fgroup: ['MU'],
        group: 'MI',
        p1   : addBr({
          fgroup: ['MI'],
          group : 'MU',
          p1    : v,
          p2    : 'x'
        }),
        p2   : addBr({
          fgroup: ['MI'],
          group : 'RD',
          p1    : n,
          p2    : 1 / fraction
        })
      }
    }
  }

  return obj
}

function setMi2(n, v, fraction = 1){
  if(n == 0){
    if(fraction != 1){
      if(v == 0){
        return 0
      }
      else{
        let v1 = keepZero(Math.pow(Math.abs(v), fraction))
        if(v1 % 1 == 0){
          //开方整数
          return (v >= 0 ? 1 : -1) * v1
        }
        else if(v > 0){
          return {
            group: 'MI',
            p1   : v,
            p2   : {
              fgroup: ['MI'],
              group : 'RD',
              p1    : 1,
              p2    : 1 / fraction
            }
          }
        }
        else if(v < 0){
          return {
            group: 'MU',
            p1   : '-1',
            p2   : {
              fgroup: ['MU'],
              group : 'MI',
              p1    : -v,
              p2    : {
                fgroup: ['MI'],
                group : 'RD',
                p1    : 1,
                p2    : 1 / fraction
              }
            }
          }
        }
      }
    }

    return v
  }

  if(fraction == 1){
    let x_mi = 'x'
    if(n != 1){
      x_mi = {
        group: 'MI',
        p1   : x_mi,
        p2   : n
      }
    }

    if(v == 1){
      return x_mi
    }
    else{
      return {
        group: 'MU',
        p1   : v,
        p2   : x_mi
      }
    }
  }

  if(n * fraction == 1){
    if(v == 1){
      return 'x'
    }

    return {
      group: 'MU',
      p1   : v,
      p2   : 'x'
    }
  }

  if(v == 1){
    if(fraction == 1){
      return {
        group: 'MI',
        p1   : 'x',
        p2   : n
      }
    }

    return {
      group: 'MI',
      p1   : 'x',
      p2   : {
        fgroup: ['MI'],
        group : 'RD',
        p1    : n,
        p2    : 1 / fraction
      }
    }
  }

  let p1 = keepZero(Math.pow(Math.abs(v), n * fraction))
  if(p1 % 1 == 0){
    //把数字从根号中提出

    if(v >= 0){
      return {
        // fgroup: ['MU'],
        group: 'MU',
        p1   : p1,
        p2   : {
          group: 'MI',
          p1   : 'x',
          p2   : {
            fgroup: ['MI'],
            group : 'RD',
            p1    : n,
            p2    : 1 / fraction
          }
        }
      }
    }
    else if(v < 0){
      return {
        // fgroup: ['MU'],
        group: 'MU',
        p1   : -p1,
        p2   : {
          group: 'MI',
          p1   : 'x',
          p2   : {
            fgroup: ['MI'],
            group : 'RD',
            p1    : n,
            p2    : 1 / fraction
          }
        }
      }
    }
  }

  if(v >= 0){
    return {
      // fgroup: ['MU'],
      group: 'MI',
      p1   : {
        fgroup: ['MI'],
        group : 'BR',
        p1    : {
          fgroup: ['BR'],
          group : 'MU',
          p1    : v,
          p2    : 'x'
        }
      },
      p2   : {
        fgroup: ['MI'],
        group : 'RD',
        p1    : n,
        p2    : 1 / fraction
      }
    }
  }
  else if(v < 0){
    return {
      // fgroup: ['MU'],
      group: 'MU',
      p1   : -1,
      p2   : {
        group: 'MI',
        p1   : {
          fgroup: ['MI'],
          group : 'BR',
          p1    : {
            fgroup: ['BR'],
            group : 'MU',
            p1    : v,
            p2    : 'x'
          }
        },
        p2   : {
          fgroup: ['MI'],
          group : 'RD',
          p1    : n,
          p2    : 1 / fraction
        }
      }
    }
  }
}

function objSimplify(obj, a){
  let arr = []
  switch(obj.group){
    case 'AD':
      arr = objSimplifyArr(obj)

      if(arr.group){
        return arr
      }

      break
    case 'BR':
      return objSimplify(obj.p1)
    case 'MI':
      if(a==1){
        let mi_p1_arr = objSimplifyArr(obj)
        console.log('mi_p1_arr', mi_p1_arr)
      }
      let mi_p1_arr = objSimplifyArr(obj.p1)
      let mi_p2_arr = objSimplifyArr(obj.p2)
      let fra       = (mi_p1_arr.fraction || 1) * mi_p2_arr[0]

      switch(getArrNumber(mi_p1_arr)){
        case 0:
          return 0
        case 1:
          if(fra > 0 && fra % 1 == 0){
            let arr    = []
            arr.length = mi_p1_arr.length
            arr[0]     = Math.pow(mi_p1_arr[0], fra)
            clearArr(arr)
          }
          else{
            clearArr(mi_p1_arr)
            mi_p1_arr.fraction = fra
            arr                = mi_p1_arr
          }

          break
        default:
          clearArr(mi_p1_arr)
          mi_p1_arr.fraction = fra
          arr                = mi_p1_arr
      }
      break
    case 'MU':
      if(noBr(obj.p1).group == 'RD' && noBr(obj.p2).group == 'RD'){
        //两个分数相乘，变成一个分数
        let obj2 = {
          group: 'RD',
          p1   : addBr(objSimplify({
            fgroup: ['RD'],
            group : 'MU',
            p1    : noBr(obj.p1).p1,
            p2    : noBr(obj.p2).p1
          })),
          p2   : addBr(objSimplify({
            fgroup: ['RD'],
            group : 'MU',
            p1    : noBr(obj.p1).p2,
            p2    : noBr(obj.p2).p2
          }))
        }
        return obj2
      }

      if(obj.p1 == 1){
        return obj.p2
      }

      if(obj.p2 == 1){
        return obj.p1
      }

      arr = objSimplifyArr(obj)

      if(!Array.isArray(arr)){
        return arr
      }

      break
    case 'RD':
      arr = objSimplifyArr(obj)
      break
  }

  return arr2obj(arr)
}

function objSimplifyArr(obj){
  if(typeof (obj) == 'string' || typeof (obj) == 'number'){
    if(obj == 'x'){
      return [1, 0]
    }
    else if(!isNaN(obj)){
      return [+obj]
    }
    else{
      let m   = obj.match(/(\d*)(\w+)/)
      let a   = [m[1] || 1]
      a.times = m[2]
      return a
    }
  }

  let arr = []
  switch(obj.group){
    case 'AC':
      arr    = objSimplifyArr(obj.p2)
      arr.ac = obj.p1
      break
    case 'AD':
      let ad_p1 = objSimplifyArr(obj.p1)
      let ad_p3 = objSimplifyArr(obj.p3)

      let ad_p1_factor = objFactor(ad_p1)
      let ad_p3_factor = objFactor(ad_p3)

      let [ad_same, ad_p1_left, ad_p3_left] = sameFactor(ad_p1_factor, ad_p3_factor)

      // console.log({
      //   ad_same,
      //   ad_p1_left,
      //   ad_p3_left,
      //   ad_p1_factor,
      //   ad_p3_factor,
      //   ad_p1,
      //   ad_p3
      // })

      if(ad_same.length){
        let f = ad_same.join('*') + '*('
        // delete ad_p1.times
        // delete ad_p3.times
        f += mularr2str(ad_p1_left)
        f += obj.p2
        f += mularr2str(ad_p3_left)
        f += ')'
        // console.log(f)
        let n = str2obj(f)
        n.f   = f
        return n
      }

      if(ad_p1?.f && ad_p3?.times){
        if(ad_p1.f.indexOf(ad_p3.times + '*') == 0){
          let f = ad_p1.f.slice(0, -1) + obj.p2 + arr2str(ad_p3) + ')'
          let n = str2obj(f)
          n.f   = f
          return n
        }
      }

      if(!ad_p1?.group && !ad_p3?.group && !ad_p1.ac && !ad_p3.ac && (ad_p1.fraction || 1) == 1 && (ad_p3.fraction || 1) == 1){
        if(obj.p2 == '-'){
          ad_p3 = vecMul(ad_p3, -1)
        }
        arr = vecAdd(ad_p1, ad_p3)
      }
      else{
        return {
          group: 'AD',
          p1   : arr2obj(ad_p1),
          p2   : obj.p2,
          p3   : arr2obj(ad_p3),
        }
      }
      break
    case 'BR':
      return objSimplifyArr(obj.p1)
    case 'MI':
      let mi_p1_arr = objSimplifyArr(obj.p1)
      let mi_p2_arr = objSimplifyArr(obj.p2)
      let fra       = (mi_p1_arr.fraction || 1) * mi_p2_arr[0]

      if(mi_p2_arr[0] < 0){
        mi_p2_arr.fraction = -(mi_p2_arr.fraction || 1)
        mi_p2_arr[0]       = -mi_p2_arr[0]
      }

      if(mi_p1_arr.times == 'e'){
        arr = mi_p2_arr
        if(arr[0]){
          arr.ac    = 'e^'
          arr.times = 'e'
          if(arr[arr.length - 1] != 1){
            arr.times += '^' + arr[arr.length - 1]
          }
          arr[arr.length - 1] = 0
        }
      }
      else{
        switch(getArrNumber(mi_p1_arr)){
          case 0:
            return 0
          case 1:
            if(fra > 0 && fra % 1 == 0){
              arr.length = (mi_p1_arr.length - 1) * fra + 1
              arr[0]     = Math.pow(mi_p1_arr[0], fra)
              clearArr(arr)
            }
            else if(fra < 0 && fra % 1 == 0){
              arr.length   = -(mi_p1_arr.length - 1) * fra + 1
              arr[0]       = Math.pow(mi_p1_arr[0], -fra)
              arr.fraction = -1
              clearArr(arr)
            }
            else{
              clearArr(mi_p1_arr)
              mi_p1_arr.fraction = fra
              arr                = mi_p1_arr
            }
            break
          default:
            clearArr(mi_p1_arr)
            mi_p1_arr.fraction = fra
            arr                = mi_p1_arr
        }
      }
      break
    case 'MU':
      let mu_p1 = objSimplifyArr(obj.p1)
      let mu_p2 = objSimplifyArr(obj.p2)

      if(mu_p1.ac || mu_p2.ac){
        return obj
      }

      if((mu_p1.fraction || 1) == (mu_p2.fraction || 1)){
        arr = vecMul(mu_p1, mu_p2)
      }
      else if(sameVec(mu_p1, mu_p2)){
        arr     = mu_p1
        let fra = (mu_p1.fraction || 1) + (mu_p2.fraction || 1)
        if(fra % 1 == 0){
          if(fra == 1 || fra == -1){
            arr.fraction = fra
          }
          else{
            let b = []
            a.map((v, i) => {
              b[i * Math.abs(fra)] = v
            })
            clearArr(b)
            arr          = b
            arr.fraction = Math.sign(fra)
          }
        }
        else{
          arr.fraction = fra
        }
      }
      else if((mu_p2.fraction || 1) == 1 && mu_p2.length == 1){
        arr          = vecMul(mu_p1, mu_p1.fraction < 0 ? 1 / mu_p2[0] : mu_p2[0])
        arr.fraction = mu_p1.fraction || 1
      }
      else if((mu_p1.fraction || 1) == 1 && mu_p1.length == 1){
        // arr          = vecMul(mu_p2, mu_p2.fraction < 0 ? 1 / mu_p1[0] : mu_p1[0])
        arr          = vecMul(mu_p2, mu_p1[0])
        arr.fraction = mu_p2.fraction || 1
      }
      else{
        return {
          group: 'MU',
          p1   : addBr(arr2obj(mu_p1)),
          p2   : addBr(arr2obj(mu_p2)),
        }
      }
      break
    case 'RD':
      let rd_p1_arr = objSimplifyArr(obj.p1)
      let rd_p2_arr = objSimplifyArr(obj.p2)
      let rd_p1_d   = getDegree(rd_p1_arr)
      let rd_p2_d   = getDegree(rd_p2_arr)
      let rd_p1_n   = getArrNumber(rd_p1_arr)
      let rd_p2_n   = getArrNumber(rd_p2_arr)
      let rd_d_dif  = rd_p1_d - rd_p2_d
      let c         = rd_p1_arr[0] / rd_p2_arr[0]

      if(rd_p1_n == 1 && rd_p2_n == 1){
        if(rd_d_dif == 0){
          //级数一样，约分
          return [c]
        }
        else if(rd_d_dif % 1 == 0){
          arr.length   = Math.abs(rd_d_dif) + 1
          arr.fraction = Math.sign(rd_d_dif)
          arr[0]       = c
        }
        else{
          arr.length   = 2
          arr.fraction = rd_d_dif
          arr[0]       = c
        }
      }
      else if(rd_p2_n == 1 && rd_p2_d == 1){
        arr = vecMul(rd_p1_arr, 1 / rd_p2_arr[0])
      }
      else{
        console.warn('todo')
      }
      break
  }

  return arr
}

function objSimplifyobj(obj){
  switch(obj?.group){
    case 'AD':
    case 'BR':
    case 'MI':
    case 'MU':
    case 'NG':
    case 'RD':
    default:
      return obj
  }
}

function sameVec(a, b){
  if(JSON.stringify(a) == JSON.stringify(b)){
    return true
  }
}

function getDegree(a){
  clearArr(a)
  let n = (a.length - 1) * (a.fraction || 1)
  if(a.times){
    if(a.times.log){
      n += a.times.log * 0.001
    }
  }
  return n
}

function isAdMiFac(obj){
  obj = noBr(obj)
  if(obj?.p2 == '-'){
    if(obj.p1.group == 'MI' && noBr(obj.p1.p2).group == 'RD' && !isNaN(noBr(obj.p1.p2).p2)){
      return noBr(obj.p1.p2).p2
    }

    if(obj.p3.group == 'MI' && noBr(obj.p3.p2).group == 'RD' && !isNaN(noBr(obj.p3.p2).p2)){
      return noBr(obj.p3.p2).p2
    }

    let f = obj2str(obj)
    let m = f.match(/\^\(1\/(\d+)\)/)

    return m && m[1]
  }
}

function showEMiC(x_mi, x_c, ng = ''){
  let c    = x_c.slice()
  let result
  let sign = 1
  if(c[0] < 0){
    c[0] = -c[0]
    sign = -1
  }

  if(c[0] == 1){
    c.shift()
  }

  let mi = x_mi == 0 ? '' : (x_mi == 1 ? 'x' : 'x^' + x_mi)

  if(c.length){
    if(mi){
      mi = '(' + c.join('x') + '*' + mi + ')'
    }
    else{
      mi = c.join('x')
      if(c.length > 1){
        mi = '(' + mi + ')'
      }
    }
  }

  if(sign == 1){
    result = ng + 'e' + (mi ? '^' + mi : '')
  }
  else{
    result = ng + '1/e' + (mi ? '^' + mi : '')
  }

  return result
}

function showMiC(mi, c, ng = ''){
  let s = c
  if(mi > 0){
    if(c == 1){
      s = 'x'
    }
    else if(c == -1){
      s = '-x'
    }
    else{
      s = c + '*x'
    }

    if(mi != 1){
      s += '^' + mi
    }
  }
  else if(mi < 0){
    if(c == 1){
      s = '1/x'
    }
    else if(c == -1){
      s = '-1/x'
    }
    else{
      s = c + '/x'
    }

    if(mi != -1){
      s += '^' + (-mi)
    }
  }

  return s
}

function objFactor(obj){
  let a = []

  if(obj.times){
    if(/\w+\^\d+/.test(obj.times)){
      let m = obj.times.match(/(\w+)\^(\d+)/)
      for(let i = m[2] - 1; i >= 0; i--){
        a.push(m[1])
      }
    }
    else{
      a.push(obj.times)
    }
  }

  switch(obj.group){
    case 'MU':
      a.push(...objFactor(obj.p1))
      a.push(...objFactor(obj.p2))
      break
    case 'MI':
      if(!isNaN(obj.p2)){
        for(let i = obj.p2 - 1; i >= 0; i--){
          a.push(obj.p1)
        }
      }
      break
    case 'NG':
      a.push(-1)
      a.push(...objFactor(obj.p1))
      break
    case 'BR':
      a = objFactor(obj.p1)
      break
    // case 'RD':
    default:
      if(Array.isArray(obj)){
        let b = obj.slice()
        for(let i in obj){
          if(/\d+/.test(i) || i == 'times'){
            continue
          }

          b[i] = obj[i]
        }

        a.push(b)
      }
      else{
        a.push(obj2str(obj))
      }
  }

  return a
}

function sameFactor(a0, b0){
  let a    = a0.slice()
  let b    = b0.slice()
  let same = []

  if(a.times && a.times == b.times){
    same.push(a.times)
  }
  else{
    if(a0.times){
      a.times = a0.times
    }
    if(b0.times){
      b.times = b0.times
    }
  }

  for(let i = a.length - 1; i >= 0; i--){
    let item = a[i]
    let j    = b.indexOf(item)
    if(j >= 0){
      same.push(item)
      a.splice(i, 1)
      b.splice(j, 1)
    }
  }

  let obj = {}
  same.map(item => {
    obj[item] = (obj[item] || 0) + 1
  })

  let combine_same = []
  for(let item in obj){
    if(obj[item] == 1){
      combine_same.push(item)
    }
    else{
      combine_same.push(item + '^' + obj[item])
    }
  }
  return [combine_same, a, b]
}

// transfer
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
        case 'NG':

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
          console.error('未处理group', group)
      }

      return trans2MathJax(c, [group, ...fgroup])
    })
  }

  return s
}

function trans2MathObj(uuid, fgroup = [], j = 0){
  uuid = typeof (uuid) == 'string' ? uuid.trim() : uuid
  if(!/^_\d{5}_\w\w_$/g.test(uuid)){
    // console.error('trans2MathObj only accept uuid', s)
    return uuid
  }

  var act, fun, arg, obj = {}

  var group          = getGroup(uuid)
  var source         = getUuidCode(group, uuid)
  var fgroup         = fgroup.slice()
  var current_fgroup = fgroup.slice()
  fgroup.unshift(group)

  var obj = {
    uuid,
    group,
    fgroup: current_fgroup,
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
      a      = c.match(/\+|\-/)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      obj.p2 = trans2MathObj(a[0], fgroup, j = 1)
      obj.p3 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 2)
      break
    case 'AS':
      a      = c.split(/\s*\=\s*/)
      obj.p1 = trans2MathObj(a[0], fgroup)
      obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'BR':
      c      = c.slice(1, -1)
      obj.p1 = trans2MathObj(c, fgroup)
      break
    case 'CN':
      a      = c.match(/[\>\<\=\~\!]+/)
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
      a      = c.match(/&&/)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'DE':
      a      = c.match(/\.\^/)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'DG':
      a      = c.match(/\'/)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      break
    case 'DL':
      a      = c.split(/\s*\.\\\s*/g)
      obj.p1 = trans2MathObj(a[0], fgroup)
      obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'DM':
      a      = c.match(/\.\*/)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'DO':
      a      = c.match(/\|\|/)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'DR':
      a      = c.split(/\s*\.\/\s*/g)
      obj.p1 = trans2MathObj(a[0], fgroup)
      obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'DZ':
      a      = c.match(/\.\'/)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      break
    case 'LD':
      a      = c.match(/\\/)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'LG':
      c      = c.replace(/\|/g, '||')
      c      = c.replace(/\&/g, '&&')
      a      = c.split(/\s*(\|\||\&\&)\s*/g)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'MA':
      c      = c.slice(-1) == ';' ? c.slice(0, -1) : c
      a      = c.split(/\s*\=\s*/g)
      obj.p1 = trans2MathObj(a[0], fgroup)
      obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'MI':
      a      = c.match(/\^/)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'MN': //被add代替
      a      = c.split(/\s*\-\s*/g)
      obj.p1 = trans2MathObj(a[0], fgroup)
      obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'MU':
      a      = c.split(/\s*\*\s*/g)
      obj.p1 = trans2MathObj(a[0], fgroup)
      obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'NE':
      c      = c.replace(/\s*\~\=\s*/, '!=')
      a      = c.split(/\s*\!\=\s*/g)
      obj.p1 = trans2MathObj(a[0], fgroup)
      obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'NG':
      obj.p1 = trans2MathObj(c.slice(1), fgroup)
      break
    case 'NT':
      c      = c.replace(/\s*\~\s*/, '!')
      a      = c.split(/\s*\!\s*/g)
      obj.p1 = trans2MathObj(a[0], fgroup)
      obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'OB':
      break
    case 'RD':
      a      = c.match(/\//)
      obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'PI':
      obj.p1 = trans2MathObj(c, fgroup)
      break
    default:
      console.error('未处理group', group)
  }

  return obj
}

function obj2mathjax(obj, n, sqrt){
  if(typeof (obj) != 'object' || !obj.group){
    // console.log('pass', obj)
    return obj
  }
  let str = ''
  switch(obj.group){
    case 'AC':
      str = obj2mathjax(obj.p1, 1) + obj2mathjax(obj.p2, 2)
      // obj.p1 = trans2MathObj(c.slice(0, -10).trim(), fgroup)
      // obj.p2 = trans2MathObj(c.slice(-10), fgroup, j = 1)
      break
    case 'AD':
      str = obj2mathjax(obj.p1, 1) + obj.p2 + obj2mathjax(obj.p3, 3)
      // a = c.match(/\+|\-/)
      // obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      // obj.p2 = trans2MathObj(a[0], fgroup, j = 1)
      // obj.p3 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 2)
      break
    case 'AS':
      str = obj2mathjax(obj.p1, 1) + '=' + obj2mathjax(obj.p2, 2)
      // a            = c.split(/\s*\=\s*/)
      // obj.p1 = trans2MathObj(a[0], fgroup)
      // obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'BR':
      if(/AD|DR|DL|RD/.test(obj.fgroup[0])){
        str = obj2mathjax(obj.p1, 1)
      }
      else if(/MI/.test(obj.fgroup[0]) && (n == 2 || sqrt)){
        str = obj2mathjax(obj.p1, 1)
      }
      else{
        // console.log('BR', obj.fgroup[0], obj.p1)
        str = ' \\left(' + obj2mathjax(obj.p1, 1) + ' \\right)'
      }

      // c = c.slice(1, -1)
      // obj.p1 = trans2MathObj(c, fgroup)s
      break
    case 'CN':
      str = obj2mathjax(obj.p1, 1) + obj.p2 + obj2mathjax(obj.p3, 3)
      // a = c.match(/[\>\<\=\~\!]+/)
      // obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      // obj.p2 = trans2MathObj(a[0], fgroup, j = 1)
      // obj.p3 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 2)
      break
    case 'CP':
      let imag = obj2mathjax(obj.p3, 3)
      let sign = imag[0] == '-' ? '-' : '+'
      str      = obj2mathjax(obj.p1, 1) + obj.p2 + sign + obj2mathjax(obj.p3, 3) + 'i'

      // c      = c.replace(/\s*/g, '')
      // let im = c.match(/[\+\-]?\s*\d*(\.\d+)?[ij]/g)
      // let re = +c.replace(im[0], '')
      // im     = im[0].slice(0, -1) || 1
      // im     = im == '-' || im == '+' ? +(im + '1') : +im
      // obj.p1 = trans2MathObj(re, fgroup)
      // obj.p2 = trans2MathObj(im, fgroup, j = 1)
      break
    case 'DA':
      str = obj2mathjax(obj.p1, 1) + '&&' + obj2mathjax(obj.p2, 2)

      // a = c.match(/&&/)
      // obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      // obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'DE':
      str = '{' + obj2mathjax(obj.p1, 1) + '}.^{' + obj2mathjax(obj.p2, 2) + '}'

      // a = c.match(/\.\^/)
      // obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      // obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'DG':
      str = '{' + obj2mathjax(obj.p1, 1) + "}'"

      // a = c.match(/\'/)
      // obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      break
    case 'DL':
      str = ' \\frac{' + obj2mathjax(obj.p1, 1) + '}{' + obj2mathjax(obj.p2, 2) + '}'

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
      str = ' \\frac{' + obj2mathjax(obj.p1, 1) + '}{' + obj2mathjax(obj.p2, 2) + '}'

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
      if(obj.p2.group == 'BR' && obj.p2.p1.source == '1/2'){
        str = '\\sqrt{' + obj2mathjax(obj.p1, 1, 'sqrt') + '}'
      }
      else if(obj.p2.group == 'BR' && /1\/\d+/.test(obj.p2.p1.source)){
        str = `\\sqrt[${obj.p2.p1.p2}]{` + obj2mathjax(obj.p1, 1, 'sqrt') + '}'
      }
      else{
        str = '{' + obj2mathjax(obj.p1, 1) + '}^{' + obj2mathjax(obj.p2, 2) + '}'
      }

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
      let p1 = obj2mathjax(obj.p1, 1)
      if(p1 == -1){
        str += '-'
      }
      else{
        str += p1
      }
      str += obj2mathjax(obj.p2, 2)

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
    case 'NG':
      str = '-' + obj2mathjax(obj.p1)
    case 'NT':
      // c = c.replace(/\s*\~\s*/, '!')
      // a = c.split(/\s*\!\s*/g)
      // obj.p1 = trans2MathObj(a[0], fgroup)
      // obj.p2 = trans2MathObj(a[1], fgroup, j = 1)
      break
    case 'OB':
      break
    case 'RD':
      str = ' \\frac{' + obj2mathjax(obj.p1, 1) + '}{' + obj2mathjax(obj.p2, 2) + '}'

      // a = c.match(/\//)
      // obj.p1 = trans2MathObj(c.slice(0, a.index), fgroup)
      // obj.p2 = trans2MathObj(c.slice(a.index + a[0].length), fgroup, j = 1)
      break
    case 'PI':
      str = ' \\pi '

      // obj.p1 = trans2MathObj(c, fgroup)
      break
    default:
      console.error('未处理group', obj.group)
  }

  return str
}

function obj_ad2array(obj_arr, obj){
  let synbal = {}
  let x      = obj2num_mi(obj_arr, obj.p1)
  if(x){
    for(let s in x){
      synbal[s] = (synbal[s] || 0) + x[s]
    }
  }
  let p2 = obj.p2
  x      = obj2num_mi(obj_arr, obj.p3, p2)
  if(x){
    for(let s in x){
      synbal[s] = (synbal[s] || 0) + x[s]
    }
  }

  return synbal
}

function obj2num_mi(obj_arr, obj, sign = '+'){
  let p = 1
  if(typeof (obj) == 'object' && obj.group == 'AD'){
    return obj_ad2array(obj_arr, obj)
  }
  if(typeof (obj) == 'object' && obj.group == 'MU'){
    p   = obj.p1
    obj = obj.p2
  }

  let mi
  if(typeof obj == 'string' && /[a-zA-Z]+/.test(obj)){
    if(!obj_arr[obj]){
      obj_arr[obj] = []
    }
    obj_arr[obj][1] = (obj_arr[obj][1] || 0) * 1 + (sign == '-' ? -p : p) * 1
    let symbol_obj  = {}
    symbol_obj[obj] = 1
    return symbol_obj
  }

  if(!isNaN(obj)){
    obj_arr.c = (obj_arr.c || 0) * 1 + (sign == '-' ? -obj : obj) * 1
    return ''
  }

  if(typeof (obj) == 'object' && obj.group == 'MI' && typeof obj.p1 == 'string'){
    if(!obj_arr[obj.p1]){
      obj_arr[obj.p1] = []
    }

    obj_arr[obj.p1][obj.p2] = (obj_arr[obj.p1][obj.p2] || 0) * 1 + (sign == '-' ? -p : p) * 1
    let symbol_obj          = {}
    symbol_obj[obj.p1]      = 1
    return symbol_obj
  }
  else if(typeof (obj) == 'object' && obj.group == 'MU'){

  }
}

function obj_mu2array(arr, obj){
  obj_mu2obj(arr, obj.p1)
  obj_mu2obj(arr, obj.p2)
}

function obj_mu2obj(arr, item){
  if(typeof (item) == 'string'){
    arr.push(item)
    return
  }

  if(typeof (item) == 'object' && item.group == 'MI'){
    for(let i = item.p2 - 1; i >= 0; i--){
      arr.push(item.p1)
    }
    return
  }

  if(typeof (item) == 'object' && item.group == 'AD'){
    let fac = M.factor(item)
    arr.push(...fac)
    return
  }

  if(typeof (item) == 'object' && item.group == 'MU'){
    obj_mu2array(arr, item)
    return
  }

  if(typeof (item) == 'object' && item.group == 'BR'){
    obj_mu2obj(arr, item.p1)
    return
  }

}

function str2obj(s){
  return trans2MathObj(analysis(s))
}

function obj2str(obj){
  let str

  if(!obj?.group){
    return obj
  }

  switch(obj.group){
    case 'AC':
      str = obj2str(obj.p1, 1) + obj2str(obj.p2, 2)
      break
    case 'AD':
      str = obj2str(obj.p1, 1) + obj.p2 + obj2str(obj.p3, 3)
      break
    case 'AS':
      str = obj2str(obj.p1, 1) + '=' + obj2str(obj.p2, 2)
      break
    case 'BR':
      str = '(' + obj2str(obj.p1, 1) + ')'
      break
    case 'CN':
      break
    case 'CP':
      let imag = obj2str(obj.p3, 3)
      let sign = imag[0] == '-' ? '-' : '+'
      str      = obj2str(obj.p1, 1) + obj.p2 + sign + obj2str(obj.p3, 3) + 'i'

      // c      = c.replace(/\s*/g, '')
      // let im = c.match(/[\+\-]?\s*\d*(\.\d+)?[ij]/g)
      // let re = +c.replace(im[0], '')
      // im     = im[0].slice(0, -1) || 1
      // im     = im == '-' || im == '+' ? +(im + '1') : +im
      // obj.p1 = trans2MathObj(re, fgroup)
      // obj.p2 = trans2MathObj(im, fgroup, j = 1)
      break
    case 'DA':
      str = obj2str(obj.p1, 1) + '&&' + obj2str(obj.p2, 2)
      break
    case 'DE':
      str = obj2str(obj.p1, 1) + '.^' + obj2str(obj.p2, 2)
      break
    case 'DG':
      str = obj2str(obj.p1, 1) + "'"
      break
    case 'DL':
      str = obj2str(obj.p1, 1) + '/' + obj2str(obj.p2, 2)
      break
    case 'DM':
      break
    case 'DO':
      break
    case 'DR':
      str = obj2str(obj.p1, 1) + './' + obj2str(obj.p2, 1)
      break
    case 'DZ':
      // a = c.match(/\.\'/)
      break
    case 'LD':
      // a = c.match(/\\/)
      break
    case 'LG':
      // c = c.replace(/\|/g, '||')
      // c = c.replace(/\&/g, '&&')
      // a = c.split(/\s*(\|\||\&\&)\s*/g)
      break
    case 'MA':
      // c   = c.slice(-1) == ';' ? c.slice(0, -1) : c
      // a   = c.split(/\s*\=\s*/g)
      break
    case 'MI':
      str = obj2str(obj.p1, 1) + '^' + obj2str(obj.p2, 1)
      break
    case 'MN': //被add代替
      break
    case 'MU':
      str = obj2str(obj.p1, 1) + '*' + obj2str(obj.p2, 1)
      break
    case 'NE':
      str = '!=' + obj2str(obj.p1, 1)
      break
    case 'NG':
      str = '-' + obj2str(obj.p1)
      break
    case 'NT':
      str = '~' + obj2str(obj.p1)
      break
    case 'OB':
      break
    case 'RD':
      str = obj2str(obj.p1, 1) + '/' + obj2str(obj.p2, 2)
      break
    case 'PI':
      str = 'pi'
      break
    default:
      console.error('未处理group', obj.group)
  }

  return str
}

function arr2obj(a){
  if(!Array.isArray(a)){
    return a
  }

  clearArr(a)

  let obj
  let il = a.length
  if(il == 1){
    //常数
    if(a[0] >= 0){
      obj = a[0]
    }
    else{
      obj = {
        group: 'BR',
        p1   : a[0]
      }
    }
  }
  else if(getArrNumber(a) == 1){
    obj = setMi(il - 1, a[0], a.fraction)
  }
  else{
    obj = {
      group: 'AD',
      p1   : setMi(il - 1, a[0], a.fraction)
    }
    for(let i = 1; i < il; i++){
      if(a[i]){
        obj.p2 = a[i] > 0 ? '+' : '-'
        obj.p3 = setMi(il - 1 - i, Math.abs(a[i]), a.fraction)
        if(i != il - 1){
          obj = {
            group: 'AD',
            p1   : obj,
          }
        }
      }
      else if(i == il - 1){
        obj = obj.p1
      }
    }
  }

  if(a.ac){
    obj = {
      group: 'AC',
      p1   : a.ac,
      p2   : addBr(obj)
    }
  }

  return obj
}

function arr2str(arr, x = 'x'){
  if(!Array.isArray(arr)){
    return arr
  }

  clearArr(arr)

  let s = ''
  let a

  let fra      = arr.fraction ?? 1
  let fra_sign = Math.sign(fra)
  fra          = fra * fra_sign
  if(fra < 0 && 1 / fra % 1 == 0){
    fra = fraction(1, 1 / fra)
  }


  for(let i = 0, l = arr.length; i < l; i++){
    a = arr[i]

    if(a){
      let a_sign = Math.sign(a)
      a = a_sign * a

      let n = l - 1 - i
      let f = n.mul(fra)

      let s1 = x + '^(' + f + ')'
      if(arr.ac == 'e^' || fra_sign > 0){
        if(a < 1 && (1 / a) % 1 == 0){
          s1 += '/' + (1 / a)
        }
        else{
          s1 = a + '*(' + s1 + ')'
        }
      }
      else{
        if(a < 1 && (1 / a) % 1 == 0){
          s1 = '1/(' + (1 / a) + '*' + s1 + ')'
        }
        else{
          s1 = a + '/' + s1
        }
      }

      s += (a_sign > 0 ? '+' : '-') + s1
    }
  }

  if(arr.const && arr.const.length && s){
    s = polyCombine([...arr.const, s])
  }

  if(arr.ac == 'e^'){
    if(fra_sign == -1){
      s = '1/e^(' + s + ')'
    }
    else{
      s = 'e^(' + s + ')'
    }

  }

  if(arr.times && s){
    for(let ac in arr.times){
      s += '*' + ac + '(x' + (arr.times[ac] != 1 ? '^' + arr.times[ac] : '') + ')'
      // s = arr.times + '*' + (/[\+\-]/.test(s[0]) ? s : `(${s})`)
    }
  }

  // "e^2*(e^(+1*x^(1))+1/e^(+1*x^(1)))"
  let s1 = ''
  let s0 = s
  while(1){
    s1 = cleanStr(s0)
    if(s1 == s0){
      // console.log(s, '=>', s1)
      break
    }
    s0 = s1
  }

  return s1
}

function mularr2str(a){
  if(!Array.isArray(a)){
    return a
  }
  let s = ''
  for(let i = 0, l = a.length; i < l; i++){
    s += '*' + arr2str(a[i])
  }
  return s.slice(1)
}