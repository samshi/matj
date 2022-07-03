/*欠缺
randn 正态分布
求复数根 完成

finished
abs, acosd, acot, acotd, acoth, acsc, acscd, acsch, all, angle, any, asec, asecd, asech, asind, atan2d, atand, blkdiag, bounds, cat, checkLimit, checkObj, chol, circshift, cn, concatenate, cond, conj, conv, cosd, cot, cotd, coth, cross, csc, cscd, csch, ctranspose, cumprod, cumsum, deconv, det, detvec, diag, disp, dot, dx, eig, eigvec, eye, eyenum, factor, factorial, fft, fix, flip, flipdim, fliplr, flipud, fzero, gauss, gaussf, hess, hessHalf, hilb, hilbf, ifft, imag, inv, invf, ipermute, isequaln, islogical, ismatrix, isreal, isrow, isscalar, issorted, isvector, kron, ldivide, length, linear, linspace, logical, logspace, lu, mag, magic, mathjax, max, maxmin, meshgrid, min, minus, mldivide, mod, mpower, mrdivide, mtimes, multif, ndims, newtonCotes, norm, nthroot, numel, ones, orth, pascal, permute, pinv, plot, plus, poly, polyder, polyfit, polyint, polyval, polyvalNum, polyvalm, pow, power, printline, prod, project, qr, rand, randi, rank, rcond, rdivide, real, rem, repmat, reshape, roots, rot90, rref, sec, secd, sech, shiftdim, sign, sind, size, sort, sortrows, sqrt, squeeze, strlength, sum, surf, svd, sym, sym2poly, syms, tand, test, testroots, times, title, trace, transpose, tril, triu, uminus, union, uplus, xlabel, ylabel, zeros

2022 onprogress
collect, colspace, datestr, diff, expand, expm, intersect, ismember, limit, numden, null, randn, setdiff, setxor, simplify, solve, unique, and, not, or, xor, false, find, isequal, true, eq, ge, gt, le, lt, ne, iscolumn, isempty, bitand, bitcmp, bitget, bitor, bitset, bitshift, bitxor, swapbytes,

2023
laplace, ilaplace, fourier, ifourier

sam shi

*/

/*
该作者有系列文章介绍matlab的某项功能集合：
matlab多项式操作
https://blog.csdn.net/qq_33785671/article/details/52378085

matlab公式符号计算
https://blog.csdn.net/qq_33785671/article/details/52378782

数值代数主要知识点
https://www.renrendoc.com/paper/88085540.html

MathJax常用符号
https://blog.csdn.net/xuejianbest/article/details/80391999
https://blog.csdn.net/anmin1992/article/details/101122045

Matlab教程
https://www.w3cschool.cn/matlab/matlab-gvky28jd.html

mathematica实验报告(符号计算)
https://www.docin.com/p-499001372.html?docfrom=rrela

matlab中符号函数教程,MATLAB程序设计教程(9)——MATLAB符号计算
https://blog.csdn.net/weixin_28799111/article/details/115816338

 */

let VLIST     = []
let TABLE_TR  = []
let cnt       = 0
let total_cnt = 0

// const W = window
const M = {
  FIXNUM: 4,
  SYMS  : {},
}
//矩阵处理
$.E(M, {
  bounds                    : (...args) => {
    return [M.min.apply(this, args).single, M.max.apply(this, args).single]
  },
  cat                       : (c, ...args) => {
    c           = INDEX(c)
    let a0shape = args[0].shape.slice()

    let len1        = a0shape.splice(c, 1)[0] || 1
    let a0shape_str = JSON.stringify(a0shape)

    let a1shape     = args[1].shape.slice()
    let len2        = a1shape.splice(c, 1)[0] || 1
    let a1shape_str = JSON.stringify(a1shape)

    let cshape = args[0].shape.slice()
    cshape[c]  = len1 + len2

    if(a0shape_str != a1shape_str){
      return false
    }

    let b = ndarray([], cshape)

    if(b.dimension > args[0].dimension){
      args[0].map((...arg) => b.set(...arg, 0, args[0].get(...arg)))
    }
    else{
      args[0].map((...arg) => b.set(...arg, args[0].get(...arg)))
    }

    if(b.dimension > args[1].dimension){
      args[1].map((...arg) => {
        let a = arg.slice()
        a[c]  = len1
        b.set(...a, args[1].get(...arg))
      })
    }
    else{
      args[1].map((...arg) => {
        let a = arg.slice()
        a[c] += args[0].shape[c]
        b.set(...a, args[1].get(...arg))
      })
    }

    if(args.length > 2){
      return M.cat(UNINDEX(c), b, ...(args.slice(2)))
    }

    return b
  },
  checkObj                  : s => {
    var a   = s.split('.')
    var obj = window[a[0]]
    if(!obj){
      window[a[0]] = {}
      obj          = window[a[0]]
      addToTable(a[0], obj)
    }

    for(var i = 1, l = a.length - 1; i < l; i++){
      if(!obj[a[i]]){
        obj[a[i]] = {}
      }
      obj = obj[a[i]]
    }
    return {
      obj : obj,
      key : a[i],
      name: s
    }
  },
  chol                      : a => {
    let l = a.shape[0]
    let b = M.zeros(l)
    let num
    for(let i = 0; i < l; i++){ //row
      for(let j = i; j < l; j++){ //col
        num = a.get(i, j)
        for(let k = 0; k < i; k++){ //row
          num -= b.get(k, j) * b.get(k, i)
        }
        b.set0(i, j, i == j ? Math.sqrt(num) : num / b.get(i, i))
      }
    }
    return b
  },
  concatenate               : (...arg) => {
    let b           = []
    let b_shape_row = 1
    for(let i = 0; i < arg.length; i++){
      let a = arg[i]

      // A = [true false true true true false]
      // A = [true false true; true true false]
      if(a == undefined){
        continue
      }

      if(isNda(a)){
        b_shape_row = a.shape[0] || 1
        a           = a.simple().data
      }

      if(Array.isArray(a)){
        b = b.concat(...a)
      }
      else{
        b.push(a)
      }
    }

    return ndarray(b, [b_shape_row, b.length / b_shape_row])
  },
  concatenateV              : (...arg) => {       // 非matlab函数
    // console.log(arg)
    let b = []
    let b_shape
    for(let i = 0; i < arg.length; i++){
      let a = arg[i]
      if(!isNda(a)){ // || a.dimension != 2
        if(Array.isArray(b)){
          if(Array.isArray(a)){
            b = b.concate(...a)
          }
          else{
            b.push(a)
            // return ndarray(arg, [arg.length, 1])
          }
        }
        else if(isNda(b)){
          if(b.shape[1] == 1 && !Array.isArray(a)){
            b.data.push(a)
            b.shape[0]++
          }
          else if(Array.isArray(a) && a.length == b.shape[1]){
            b.data.push(a)
            b.shape[0]++
          }
          else{
            console.log('todo')
          }
        }
        else{
          console.log('todo')
        }
      }
      else{
        a = a.simple()
        if(!i){
          b = a
        }
        else if(Array.isArray(b)){
          b = b.concat(...a.data)
        }
        else if(a.shape[1] != arg[0].shape[1]){
          console.log('size error')
          return 'size error'
        }
        else{
          for(let col = a.shape[1] - 1; col >= 0; col--){
            b.data.splice((col + 1) * b.shape[0], 0, ...(a.data.slice(col * a.shape[0], (col + 1) * a.shape[0])))
          }
          b.shape[0] += a.shape[0]
        }
      }
    }

    if(Array.isArray(b)){
      return ndarray(b, [b.length, 1])
    }

    return ndarray(b.data, b.shape)
  },
  cond                      : (a, p = 2) => {
    if(p == 2){
      let AA    = M.mtimes(a.transpose(), a)
      let v     = M.detvec(AA)
      let root  = M.findRoots(v).real
      let min_r = root[0]
      root.forEach(r => {
        if(r > 0 && r < min_r){
          min_r = r
        }
      })

      return Math.sqrt(root[0]) / Math.sqrt(min_r)
    }
    else if(/1|Inf|fro/.test(p)){
      return M.norm(a, p) * M.norm(M.inv(a), p)
    }
    else{
      return p
    }

  },
  conv                      : (a, b) => {
    a = (a.data ? a.simple().data : a)
    b = (b.data ? b.simple().data : b)

    return ndarray(vecMul(a, b))
  },
  det                       : (a, lam = 0) => {
    if(!M.isSquare(a)){
      console.log('only squar matrix has det')
      return
    }

    if(1){
      // 行列式参数法
      let v   = M.detvec(a)
      let l   = v.length
      let sum = v[l - 1]
      let x   = 1
      for(let i = l - 2; i >= 0; i--){
        x *= lam
        sum += x * v[i]
      }
      return keepZero(sum)
    }
    else{
      // 传统方法
      var b = M.minus(a, M.eyenum(a.shape[0], a.shape[0], lam))
      return selfdet(b)

      function selfdet(a){
        var l = a.view[0].length
        if(l == 1){
          return a.get(0, 0)
        }
        if(l == 2){
          return a.get(0, 0) * a.get(1, 1) - a.get(0, 1) * a.get(1, 0)
        }

        var sum = 0
        for(var n = 0; n < l; n++){
          let v = a.get(0, n)
          if(!nearZero(v)){
            if(n % 2){
              v = -v
            }
            let rows = a.view[0].slice(1)
            let cols = a.view[1].slice()
            cols.splice(n, 1)
            let b = ndarray(a.data, a.shape, a.order, [rows, cols])
            sum += v * selfdet(b)
          }
        }

        return sum
      }
    }

  },
  detvec                    : a => {
    if(!M.isSquare(a)){
      console.log('only squar matrix has det')
      return
    }

    if(a.detvec){
      return a.detvec
    }

    //初始化
    let b = a.shape[0] > 6 ? M.hess(a) : a.clone()
    for(let i = 0, l = a.view[0].length; i < l; i++){
      b.set(i, i, [-1, b.get(i, i)])  //A - λI
    }

    let count         = 0
    let middle_result = a.shape[0] > 6 ? detvecHess(b) : detvec(b)

    if(middle_result[0] == -1){
      middle_result = middle_result.map(a => a ? -a : 0)
    }
    else{
      //middle_result = middle_result.map(a => a ? a : 0)
    }

    a.detvec = middle_result
    return a.detvec

    function detvec(a){
      count++
      let l = a.view[0].length
      if(l == 1){
        return a.get(0, 0)
      }

      if(l == 2){
        return vecAdd(vecMul(a.get(0, 0), a.get(1, 1)), vecMul(a.get(1, 0), a.get(0, 1), -1))
      }

      if(l == 3){
        return vecAdd(                                           //
          vecMul(a.get(0, 0), a.get(1, 1), a.get(2, 2)),       //
          vecMul(a.get(0, 0), a.get(2, 1), a.get(1, 2), -1),   //
          vecMul(a.get(1, 0), a.get(0, 1), a.get(2, 2), -1),   //
          vecMul(a.get(1, 0), a.get(2, 1), a.get(0, 2)),       //
          vecMul(a.get(2, 0), a.get(0, 1), a.get(1, 2)),       //
          vecMul(a.get(2, 0), a.get(1, 1), a.get(0, 2), -1),)  //
      }

      var sum = 0
      for(var n = 0; n < l; n++){
        let v  = a.get(0, n)
        let tp = $.myTypeof(v)
        if(tp == 'number' && !nearZero(v) || tp == 'array' && !nearZeroVec(v)){
          if(n % 2){
            v = vecMul(v, -1)
            // console.log('vecMul', v)
          }

          let rows = a.view[0].slice(1)
          let cols = a.view[1].slice()
          cols.splice(n, 1)
          let b = ndarray(a.data, a.shape, a.order, [rows, cols])
          sum   = vecAdd(sum, vecMul(v, detvec(b)))
          // console.log('vecAdd', sum)

        }
      }

      return sum
    }

    function detvecHess(a){
      let l = a.shape[0]

      let b0 = a.get(0, 0)
      let b1 = vecAdd(vecMul(a.get(0, 0), a.get(1, 1)), vecMul(a.get(1, 0), a.get(0, 1), -1))
      let b2
      for(let i = 2; i < l; i++){
        b2 = vecAdd(vecMul(a.get(i, i), b1), vecMul(-a.get(i - 1, i) * a.get(i, i - 1), b0))
        b0 = b1
        b1 = b2
      }

      return b2
    }

  },
  eig                       : (a, b, econ) => {
    if(!M.isSquare(a)){
      console.error('只有方阵才有特征值')
      return
    }

    if(isNda(b)){
      if(!M.isSquare(b)){
        console.error('只有方阵才有广义特征值')
        return
      }
      else{
        a = M.mtimes(M.transpose(M.inv(b)), a)
      }
    }

    cnt       = 0
    let t0    = Date.now()
    let trace = M.trace(a)
    let jd    = -10
    console.log('trace', trace)
    let det = M.det(a)
    if(nearZero(det)){
      console.log('det为0，奇异矩阵，存在0特征值')
    }

    console.log('det', det)
    let v = M.detvec(a)
    console.log('detvec', v)

    let root = M.findRoots(v).real
    // root.unique()
    console.log('root', root)

    if(!root.length){
      return '无实数特征值'
    }

    let lam_list       = []
    let eig_arr        = []
    let eig_vec_matrix = M.eye(a.shape[1])
    let total_lam      = trace

    // let lu       = M.lu(a)
    // let fullrank = a.shape[0]

    // if(lu.rank < fullrank){
    //   console.log('秩为' + lu.rank + '，非满秩，奇异矩阵，存在' + (fullrank - lu.rank) + '个0特征值', lu)
    // for(let i = 0; i < fullrank - lu.rank; i++){
    //   lam_list.push(0)
    // }
    //特征向量 todo
    // }

    for(let i = 0, l = root.length; i < l; i++){
      root[i] == keepZero(root[i])

      if(econ && !root[i]){
        continue
      }

      let lam_eig_vec = M.eigvec(minus_lam(a, root[i]))
      // console.log('simple', root[i], lam_eig_vec.simple())
      for(var j = 0; j < lam_eig_vec.shape[1]; j++){
        eig_arr.push(root[i])

        for(let k = 0; k < lam_eig_vec.shape[0]; k++){
          eig_vec_matrix.set0(k, i + j, lam_eig_vec.get(k, j))
        }
      }

      i += j - 1
      // i += lam_eig_vec.shape[1] - 1
    }

    let eig_vec = ndarray(eig_arr, [eig_arr.length, 1])
    let V       = eig_vec_matrix.simple()
    // let V = M.orth(eig_vec_matrix)
    let D       = M.diag(eig_arr)
    let W       = M.transpose(M.inv(V))
    return {
      single : eig_vec,
      multias: [V, D, W]
    }

  },
  eigvec                    : a => {
    let [L, U, lu] = M.lu(a)
    if(lu.rest_col.length == 0){
      console.error('为何特征值带入后，矩阵非奇异？', lu)
      return
    }
    // console.log(lu)
    if(lu.rank != lu.order_row.length){
      console.error('rand != order_row.length')
    }

    let len   = a.shape[0]
    let order = lu.rank //lu.order_row.length
    let rest  = len - order
    for(let col = order - 1; col >= 0; col--){
      let row   = col
      let pivot = U.get(row, col)
      //非主元消元
      for(let col_i = col + 1; col_i < order; col_i++){
        var v = U.get(row, col_i)
        //特征向量变更
        for(let j = len - 1; j >= order; j--){
          U.trans(row, j, [1, v * U.get(col_i, j)])
        }

        U.set(row, col_i, 0)
      }
      //自由元 同比 主元归负一
      for(let j = len - 1; j >= order; j--){
        U.trans(row, j, [-1 / pivot])
      }

      //主元归负一
      U.set(row, col, -1)
    }

    //自由元对角单位化
    for(let i = len - 1; i >= order; i--){
      U.set(i, i, 1)
    }

    let pick_order = linear(order, len - 1)
    let pick_arr   = []
    // row_all = lu.order_row.concat(...lu.rest_row)
    col_all        = lu.order_col.concat(...lu.rest_col)
    col_all.map((col, index) => {
      pick_arr[col] = index
    })
    console.log('pick_arr', pick_arr)
    let vec = U.pickKeep(pick_arr, pick_order).simple()
    // return vec

    let norm = M.sqrt(M.dot(vec, vec)) //eigvec 3*2，M.dot->1*2
    // console.log('eigvec before', eigvec.simple().data, norm)

    let aaaa = M.rdivide(vec, norm)
    // console.log('eigvec after', aaaa.simple().data)
    return aaaa.simple()
  },
  gauss                     : (a_s, b_s, stop) => {
    a_source = format(a_s)
    b_source = format(b_s)
    if(!M.isSquare(a_source)){
      // console.error('高斯消元法矩阵尺寸不对', '主矩阵必须是方阵')
      // return
    }

    let b
    if(b_source == undefined){
      b = M.eye(a_source.shape[0])
    }
    else if(!isNda(b_source) || b_source.dimension != 2 || b_source.shape[0] != a_source.shape[0]){
      console.error('高斯消元法矩阵尺寸不对', '次矩阵必须是行数和主矩阵一致的矩阵', a_s, b_s, stop)
      return
    }
    else{
      b = b_source.clone()
    }

    let a = a_source.clone()

    let pivot_list = []
    let ltrangle   = M.eye(a_source.shape[0])
    let order_row  = [], rest_row = linear(0, a.shape[0] - 1)
    let order_col  = [], rest_col = linear(0, a.shape[1] - 1)
    for(let k = 0; k < a.shape[0]; k++){
      //轮次
      //计算k列最大值，作为主元pivot
      let pivot, rest_row_index, pivot_row
      for(let m = 0, l = rest_row.length; m < l; m++){
        let v = a.get(rest_row[m], k)
        if(v){//!nearZero(v)
          if(pivot == undefined || Math.abs(v) > Math.abs(pivot)){
            pivot          = v
            pivot_row      = rest_row[m]
            rest_row_index = m
            // break 不再判断最大pivot
          }
        }
      }

      if(!pivot){
        console.log(k + ' col has no pivot, 出现零主元', {
          a,
          order_col,
          order_row
        })
        continue //todo
      }

      // 选列的最大值有何意义？
      // rest_row.forEach((l, index) => {
      //   let v     = a.get(l, k)
      //   let v_abs = Math.abs(v)
      //   if(!index || v_abs > max_abs){
      //     max       = v
      //     max_abs   = v_abs
      //     max_i     = l
      //     max_index = index
      //   }
      // })

      //确定主元和剩余行
      pivot_list.push(pivot)
      order_row.push(pivot_row)
      order_col.push(k)

      rest_row = rest_row.filter(n => n != pivot_row)
      rest_col = rest_col.filter(n => n != k)

      //最大值，主元，所在的行单位化/归一
      //似乎可以先不做, 以保持a的上三角矩阵，并不要求归一
      if(0 && pivot != 1){
        a.set(pivot_row, k, 1)
        for(let col = k + 1; col < a.shape[1]; col++){
          a.trans0(pivot_row, col, [1 / pivot])
        }

        for(let col = 0; col < b.shape[1]; col++){
          // console.log('主元行归一', pivot_row, col, b.get(pivot_row, col), pivot, b.get(pivot_row, col) / pivot)
          b.trans0(pivot_row, col, [1 / pivot])
        }
      }

      //其余行消元
      rest_row.forEach(row => {
        let v = a.get(row, k)

        if(v){//!nearZero(v)
          let r = v / pivot
          ltrangle.set(row, k, r)
          a.set(row, k, 0) //相当下面col=k
          for(let col = k + 1; col < a.shape[1]; col++){
            a.trans0(row, col, [1, -a.get(pivot_row, col) * r])
          }

          // b.set(row, 0, b.get(row, 0) / v - b.get(pivot_row, 0))
          for(let col = 0; col < b.shape[1]; col++){
            // console.log('他行消元', row, col, b.get(row, col), r, b.get(pivot_row, col), b.get(row, col) - b.get(pivot_row, col) * r)
            b.trans0(row, col, [1, -b.get(pivot_row, col) * r])
          }
        }
      })
    }

    // console.log('rank', order_row.length, order_col.length)
    // console.log('row', order_row, rest_row)
    // console.log('col', order_col, rest_col)
    // console.log('pivot_list', pivot_list)
    let rank = order_row.length
    // console.log('上三角矩阵U', a.clone())
    // console.log('下三角矩阵L', ltrangle.clone())
    // console.log('L的逆矩阵', b.clone())

    // a 此时是上三角矩阵 U，ltrangle 是下三角矩阵L，b此时是L的逆矩阵

    //上三角矩阵转单位矩阵
    for(let k = order_col.length - 1; k >= 0; k--){ //轮次，倒数
      let p = order_row[k]
      let q = order_col[k]

      let pivot = a.get(p, q)
      for(let l = k; l >= 0; l--){
        let row = order_row[l]
        let v   = a.get(row, q)
        // console.log('列值', l, row, k, a.get(order_row[k], k), v)
        if(v){ //!nearZero(v)
          if(l == k){
            a.set(row, q, 1)
            // 等价于 a.trans(row, q, [1 / v])

            //剩余的a列同比缩放
            for(let col = rest_col.length - 1; col >= 0; col--){
              a.trans0(row, rest_col[col], [1 / v])
            }

            for(let n = 0; n < b.shape[1]; n++){
              // console.log('回溯归一', l, row, n, b.get(row, n), v, b.get(row, n) / v)
              b.trans0(row, n, [1 / v])
            }

          }
          else{
            a.set(row, q, 0)
            // 等价于 a.trans(row, q, [1, -a.get(p, q) * v])

            //剩余的a列同样消减
            for(let col = rest_col.length - 1; col >= 0; col--){
              a.trans0(row, rest_col[col], [1, -a.get(p, rest_col[col]) * v])
            }

            for(let n = 0; n < b.shape[1]; n++){
              // console.log('回溯消元', l, row, n, b.get(row, n), b.get(order_row[k], n), v, b.get(row, n) - b.get(order_row[k], n) * v)
              b.trans0(row, n, [1, -b.get(p, n) * v])
            }
          }
        }
      }
    }

    if(stop){
      console.log('stop', a, order_row)
      return a.pick(order_row.concat(...rest_row), ':').simple()
    }

    // console.log('stop', {
    //   a,
    //   b,
    //   order_row,
    //   rest_row,
    //   order_col,
    //   rest_col
    // })

    return b.pickKeep((order_row.concat(...rest_row)).slice(0, a.shape[1]), ':').simple()
    // let newdata = []
    // order_row.forEach(n => {
    //   newdata = newdata.concat(b.data.slice(n * b.shape[1], (n + 1) * b.shape[1]))
    // })
    //
    // for(let i = 0, l = (a.shape[0] - order_row.length) * b.shape[1]; i < l; i++){
    //   newdata.push(0)
    // }
    //
    // return ndarray(newdata, [a.shape[1], b.shape[1]])
  },
  gaussf                    : (a_source, b_source, stop) => {
    a_source = format(a_source)
    b_source = format(b_source)
    if(!M.isSquare(a_source)){
      // console.error('高斯消元法矩阵尺寸不对', '主矩阵必须是方阵')
      // return
    }

    let b
    if(b_source == undefined){
      b = M.eye(a_source.shape[0])
      // b = ndarray([], a_source.shape)
      // b.fill((i,j)=> fraction(i==j ? 1 : 0, 1))
    }
    else if(!isNda(b_source) || b_source.dimension != 2 || b_source.shape[0] != a_source.shape[0]){
      console.error('高斯消元法矩阵尺寸不对', '次矩阵必须是行数和主矩阵一致的矩阵')
      return
    }
    else{
      b = b_source.clone()
    }

    let a = a_source.clone()

    let pivot_list = []
    let ltrangle   = M.eyenum(a_source.shape[0], a_source.shape[0], fraction(1, 1))
    let order_row  = [], rest_row = linear(0, a.shape[0] - 1)
    let order_col  = [], rest_col = linear(0, a.shape[1] - 1)
    for(let k = 0; k < a.shape[0]; k++){
      //轮次
      //计算k列最大值，作为主元pivot
      let v = a.get(rest_row[0], k)
      let pivot, rest_row_index, pivot_row
      if(v.n || v){
        pivot          = v
        pivot_row      = rest_row[0]
        rest_row_index = 0
      }
      else{
        for(let row = 1, l = rest_row.length; row < l; row++){
          let v = a.get(rest_row[row], k)
          if(v.n || v){
            pivot          = v
            pivot_row      = rest_row[row]
            rest_row_index = row
            break
          }
        }
      }

      if(!pivot){
        console.log(k + ' row has no pivot, 出现零主元')
        continue //todo
      }

      //确定主元和剩余行
      pivot_list.push(pivot)
      order_row.push(pivot_row)
      order_col.push(k)

      rest_row = rest_row.filter(n => n != pivot_row)
      rest_col = rest_col.filter(n => n != k)

      //最大值，主元，所在的行单位化/归一
      //似乎可以先不做, 以保持a的上三角矩阵，并不要求归一
      if(0 && pivot != 1){
        a.set(pivot_row, k, 1)
        for(let col = k + 1; col < a.shape[1]; col++){
          a.trans(pivot_row, col, [1 / pivot])
        }

        for(let col = 0; col < b.shape[1]; col++){
          // console.log('主元行归一', pivot_row, col, b.get(pivot_row, col), pivot, b.get(pivot_row, col) / pivot)
          b.trans(pivot_row, col, [1 / pivot])
        }
      }

      //其余行消元
      rest_row.forEach(row => {
        let v = a.get(row, k)

        if(v.n || v){
          let r = v.div(pivot)
          ltrangle.set(row, k, r)
          a.set(row, k, fraction(0, 1)) //相当下面col=k
          for(let col = k + 1; col < a.shape[1]; col++){
            a.set(row, col, a.get(row, col).minus(a.get(pivot_row, col).mul(r)))
          }

          // b.set(row, 0, b.get(row, 0) / v - b.get(pivot_row, 0))
          for(let col = 0; col < b.shape[1]; col++){
            // console.log('他行消元', row, col, b.get(row, col), r, b.get(pivot_row, col), b.get(row, col) - b.get(pivot_row, col) * r)
            // b.trans(row, col, [1, -b.get(pivot_row, col) * r])
            b.set(row, col, b.get(row, col).minus(b.get(pivot_row, col).mul(r)))
          }
        }
      })

    }

    // console.log('rank', order_row.length, order_col.length)
    // console.log('row', order_row, rest_row)
    // console.log('col', order_col, rest_col)
    // console.log('pivot_list', pivot_list)
    let rank = order_row.length
    // console.log('上三角矩阵U', a.clone())
    // console.log('下三角矩阵L', ltrangle.clone())
    // console.log('L的逆矩阵', b.clone())

    // a 此时是上三角矩阵 U，ltrangle 是下三角矩阵L，b此时是L的逆矩阵

    //上三角矩阵转单位矩阵
    for(let k = order_col.length - 1; k >= 0; k--){ //轮次，倒数
      let p = order_row[k]
      let q = order_col[k]

      let pivot = a.get(p, q)
      for(let l = k; l >= 0; l--){
        let row = order_row[l]
        let v   = a.get(row, q)
        // console.log('列值', l, row, k, a.get(order_row[k], k), v)
        if(v.n || v){
          if(l == k){
            a.set(row, q, fraction(1, 1))
            // 等价于 a.trans(row, q, [1 / v])

            //剩余的a列同比缩放
            for(let col = rest_col.length - 1; col >= 0; col--){
              // a.trans(row, rest_col[col], [1 / v])
              a.set(row, rest_col[col], a.get(row, rest_col[col]).div(v))
            }

            for(let n = 0; n < b.shape[1]; n++){
              // console.log('回溯归一', l, row, n, b.get(row, n), v, b.get(row, n) / v)
              // b.trans(row, n, [1 / v])
              b.set(row, n, b.get(row, n).div(v))
            }

          }
          else{
            a.set(row, q, fraction(0, 1))
            // 等价于 a.trans(row, q, [1, -a.get(p, q) * v])

            //剩余的a列同样消减
            for(let col = rest_col.length - 1; col >= 0; col--){
              // a.trans(row, rest_col[col], [1, -a.get(p, rest_col[col]) * v])
              a.set(row, rest_col[col], a.get(row, rest_col[col]).minus(a.get(p, rest_col[col]).mul(v)))
            }

            for(let n = 0; n < b.shape[1]; n++){
              // console.log('回溯消元', l, row, n, b.get(row, n), b.get(order_row[k], n), v, b.get(row, n) - b.get(order_row[k], n) * v)
              // b.trans(row, n, [1, -b.get(p, n) * v])
              b.set(row, n, b.get(row, n).minus(b.get(p, n).mul(v)))

            }
          }
        }
      }
    }

    if(stop){
      return a
    }

    // console.log(a.data.slice(), order_row)
    let newdata = []
    order_row.forEach(n => {
      newdata = newdata.concat(b.data.slice(n * b.shape[1], (n + 1) * b.shape[1]))
    })

    for(let i = 0, l = (a.shape[0] - order_row.length) * b.shape[1]; i < l; i++){
      newdata.push(0)
    }

    return ndarray(newdata, [a.shape[1], b.shape[1]])
  },
  hess                      : a => {
    if(!M.isSquare(a)){
      return
    }
    let h1 = M.hessHalf(a)
    let h2 = M.hessHalf(M.transpose(h1))
    return h2
  },
  hessHalf                  : a => {
    let b = a.simple()
    let l = b.shape[1]

    for(let col = 0; col < l - 2; col++){
      //第一步，寻找(col+1, col的非零值
      for(let row = col + 1; row < l; row++){
        if(!nearZero(b.get(row, col))){
          if(row != col + 1){
            //需要做行变换
            let row_change = ndarray([], [l, l])
            row_change.fill((i, j) => i == row && j == col + 1 || i == col + 1 && j == row || (i != row && i != col + 1 && i == j) ? 1 : 0)
            b = M.mtimes(M.mtimes(row_change, b), row_change)
            console.log('行变换', row_change, b)
          }
          break
        }
      }

      //构造变换矩阵
      let h, invh
      for(let row = col + 2; row < l; row++){
        let v = b.get(row, col)
        if(!nearZero(v)){
          if(!h){
            h    = M.eye(l)
            invh = M.eye(l)
          }
          v /= b.get(col + 1, col)
          // console.log(b.get(row, col), b.get(col+1, col))
          h.set(row, col + 1, -v)
          invh.set(row, col + 1, v)
        }
      }

      if(h){
        b = M.mtimes(M.mtimes(h, b), invh)
        // console.log('消元', h, invh)
      }

    }

    return b
  },
  hilbf                     : n => {
    return ndarray([], [n, n]).fill((i, j) => fraction(1, i + j + 1))
  },
  hilb                      : n => {
    return ndarray([], [n, n]).fill((i, j) => 1 / (i + j + 1))
  },
  inv                       : (a) => {
    return M.gauss(a)
  },
  invf                      : (a) => {
    return M.gaussf(a)
  },
  kron                      : (a, b) => {
    let c = ndarray([], [a.shape[0] * b.shape[0], a.shape[1] * b.shape[1]])
    c.fill((i, j) => {
      let m = i / b.shape[0] | 0
      let p = i % b.shape[0]
      let n = j / b.shape[1] | 0
      let q = j % b.shape[1]
      return a.get(m, n) * b.get(p, q)
    })
    return c
  },
  lowerDimension            : (r, v) => {
    //降维
    let n = v.length - 1
    //系数从小到大
    // let u1 = [-v[0] / r]
    // for(let i = 1; i < n; i++){
    //   u1[i] = (u1[i - 1] - v[i]) / r
    // }
    //
    // console.log('系数从小到大', u1)
    // if(nearZero(u1[n - 1] - 1)){
    //   return u1
    // }
    //
    // console.error('u1[n - 1]应该很接近1', u1[n - 1])

    //系数从大到小
    let u2 = []
    u2[0]  = 1
    for(let i = 1; i < n - 1; i++){
      u2[i] = keepZero(v[i] + r * u2[i - 1])
    }

    u2[n - 1] = -v[n] / r //避免多次的误差累计
    // console.log('系数从大到小', u2)
    if(!nearZero(u2[n - 1] - (keepZero(v[n - 1] + r * u2[n - 2])), -10)){
      console.log('u2常数项累计误差有些大', u2[n - 1], keepZero(v[n - 1] + r * u2[n - 2]), u2[n - 1] - keepZero(v[n - 1] + r * u2[n - 2]), v, u2, r)
    }

    return u2
  },
  lowerDimensionComplex     : (c1, p) => {
    // x^2+ax+b
    let a = -2 * c1.r
    let b = c1.r * c1.r + c1.i * c1.i

    let [q, r, s] = M.deconv(p, [1, a, b])
    console.log('lowerDimensionComplex', s, M.dot(s, s))
    return q
  },
  lowerDimensionComplexGuess: (c, p, n = 0) => {
    console.log("lowerDimensionComplexGuess", c, p)
    let a = -c
    let b = c * c / 4
    console.log(n, c, a, b, p)
    let u = []
    let v = p.slice()
    for(let i = 0; i < v.length - 2; i++){
      let r = v[i]
      u.push(r)
      v[i] -= r
      v[i + 1] -= r * a
      v[i + 2] -= r * b
      // console.log(i, v)
    }

    return M.dot(v, v)

    console.log(v,)

    c *= 1.01
    if(n > 10){
      return
    }
    n++

    return M.lowerDimensionComplexGuess(c, p, n)
  },
  lu                        : a_source => {
    a_source = format(a_source)
    if(!M.isSquare(a_source)){
      return {error: 'LU分解尺寸不对, 矩阵必须是方阵'}
    }

    let a   = a_source.clone()
    let b   = M.eye(a.shape[0])
    let len = b.shape[0]

    let pivot_list = []
    let ltrangle   = M.eye(a.shape[0])
    let order_row  = [], rest_row = linear(0, len - 1)
    let order_col  = [], rest_col = linear(0, len - 1)
    for(let k = 0; k < len; k++){ //轮次
      //计算k列最大值，作为主元pivot
      let pivot, rest_row_index, pivot_row
      for(let m = 0, l = rest_row.length; m < l; m++){
        let v = a.get(rest_row[m], k)
        if(!nearZero(v, -8)){
          if(pivot == undefined || Math.abs(v) > Math.abs(pivot)){
            pivot          = v
            pivot_row      = rest_row[m]
            rest_row_index = m
            // break 不再判断最大pivot
          }
        }
      }

      if(!pivot){
        // console.log(k + ' col has no pivot, 出现零主元')
        continue //todo
      }

      //确定主元和剩余行
      pivot_list.push(pivot)
      rest_row.splice(rest_row_index, 1)
      order_row.push(pivot_row)
      rest_col.splice(k - order_col.length, 1)
      order_col.push(k)

      //其余行消元
      rest_row.forEach((l, index) => {
        let v = a.get(l, k)

        if(!nearZero(v)){
          let r = v / pivot
          a.set(l, k, 0)
          ltrangle.set(l, k, r)
          for(let m = k + 1; m < len; m++){
            a.trans(l, m, [1, -a.get(pivot_row, m) * r])
          }

          for(let m = 0; m < len; m++){
            b.trans(l, m, [1, -b.get(pivot_row, m) * r])
          }
        }
      })
    }

    // console.log('rank', order_row.length, order_col.length)
    // console.log('row', order_row, rest_row)
    // console.log('col', order_col, rest_col)
    // console.log('pivot_list', pivot_list)
    let rank    = order_row.length
    let out_row = order_row.concat(...rest_row)
    let out_col = order_col.concat(...rest_col)
    let U       = a.pickKeep(out_row, out_col).simple()
    // console.log('上三角矩阵U', U)
    let L       = ltrangle.pickKeep(out_col, out_row).simple()
    // console.log('下三角矩阵L', L)
    let invb    = b.clone()
    // console.log('L的逆矩阵', invb)

    let output = [
      L, U, {
        rank,
        order_row,
        rest_row,
        order_col,
        rest_col,
        pivot_list,
        invb
      }
    ]

    console.log('lu', output)

    return output
  },
  magic                     : n => {
    let a = ndarray([], [n, n])
    if(n % 2){
      let i = 0
      let j = n / 2 | 0
      for(let k = 1, l = n * n; k <= l; k++){
        if(a.get(i, j)){
          i = (i + 2) % n
          j = (j - 1 + n) % n
        }
        a.set(i, j, k)
        i = (i - 1 + n) % n
        j = (j + 1) % n
      }
    }
    else if(n % 4 == 0){
      let m = num => num % 4
      let l = n * n
      a.fill((i, j) => m(i) == m(j) || m(i + j + 1) == 0 ? l - a.index(i, j) : a.index(i, j) + 1)
    }
    else{
      let r = n
      n     = r / 2
      let m = n / 2 | 0

      let i = 0
      let j = m
      for(let k = 1, l = n * n, l2 = l + l, l3 = l2 + l; k <= l; k++){
        if(a.get(i, j)){
          i = (i + 2) % n
          j = (j - 1 + n) % n
        }

        if(j < m && (i != m || j > 0) || j == m && i == m){
          a.set(i, j, k + l3)
          a.set(i + n, j, k)
        }
        else{
          a.set(i, j, k)
          a.set(i + n, j, k + l3)
        }

        if(j > n - m){
          a.set(i, j + n, k + l)
          a.set(i + n, j + n, k + l2)
        }
        else{
          a.set(i, j + n, k + l2)
          a.set(i + n, j + n, k + l)
        }

        i = (i - 1 + n) % n
        j = (j + 1) % n
      }
    }

    return a
  },
  norm                      : (a, p = 2) => {
    // console.log('norm', a, p)
    if(isNda(a) && a.shape[0] > 1 && a.shape[1] > 1){
      if(p == 1){
        //返回A中最大一列和，即max(sum(abs(A
        return M.max(M.sum(M.abs(a))).single
      }

      if(p == 2){
        //返回A的最大奇异值，和n=norm(A)用法一样
        let aa        = M.mtimes(a.transpose(), a)
        let v         = M.detvec(aa)
        let roots_obj = M.findRoots(v)
        return Math.sqrt(roots_obj.real[0])
      }

      if(p == 'inf'){
        //返回A中最大一行和，即max(sum(abs(A’)))
        return M.max(M.max(M.abs(M.transpose(a))).single).single
      }

      if(p == 'fro'){
        //A和A‘的积的对角线和的平方根，即sqrt(sum(diag(A'*A)))
        return Math.sqrt(M.sum(M.diag(M.mtimes(M.transpose(a), a))))
      }
    }
    else if(isNda(a) && (a.shape[0] == 1 || a.shape[1] == 1)){
      let b = a.simple()
      if(!isNaN(p)){
        //返回向量A的p范数。即返回 sum(abs(A).^p)^(1/p),对任意 1<p<+∞.
        // norm(A)
        // 返回向量A的2范数，即等价于norm(A,2)。

        if(p == 1){
          console.log(M.abs(b.data))
          console.log(M.sum(M.abs(b.data)))
          return M.sum(M.abs(b.data))
        }
        else{
          return Math.pow(M.sum(M.pow(M.abs(b.data), p)), 1 / p)
        }
      }

      if(p == 'inf'){
        // 返回max(abs(A))
        return M.max(M.abs(b.data)).single
      }

      if(p == '-inf'){
        //返回min(abs(A))
        return M.min(M.abs(b.data)).single
      }
    }

    return '参数无效'
  },
  'null'                    : () => {
  },
  colspace                  : () => {
  },  //todo
  expm                      : () => {
  },  //todo
  orth                      : a => {
    // if(!M.isSquare(a)){
    //   console.log('方阵才有orth')
    //   return
    // }

    let R = M.zeros(a.shape[1])
    let q = [], v, p
    for(let i = 0, l = a.shape[1]; i < l; i++){
      v = a.pickKeep(':', i).simple()
      for(let j = 0; j < i; j++){
        if(q[j]){
          p = keepZero(M.vecProduct(v, q[j]))
          R.set(j, i, p)
          // console.log(i, j, p)
          v = v.matrixsub(q[j].mul(p))
        }
      }

      let self_vps = keepZero(Math.sqrt(M.vecProduct(v)))
      R.set(i, i, self_vps)
      if(!nearZero(self_vps)){
        v.diveq(self_vps)
        q.push(v)
        // console.log('self_vps', self_vps, v)
      }
      else{
        // v.fill(_=>0)
        //   q.push(v)
      }
    }

    let Q = ndarray([], [a.shape[0], q.length])
    Q.fill((i, j) => q[j].get(i, 0))

    return Q //[Q, R]
  },
  pascal                    : (a, b) => {
    let c = ndarray([], [a, a])
    c.fill((i, j) => {
      if(i == 0 && j == 0){
        return 1
      }
      if(i == 0){
        return c.get(0, j - 1)
      }
      if(j == 0){
        return c.get(i - 1, 0)
      }
      return c.get(i - 1, j) + c.get(i, j - 1)
    })
    return c
  },
  pinv                      : (a, tol = 0) => {
    let svd_result = M.svd(a)
    let [U, S, V]  = svd_result.multias
    console.log(S.shape[1], S.shape[0])
    let S1 = M.zeros(S.shape[1], S.shape[0])
    for(let i = 0; i < Math.min(S1.shape[0], S1.shape[1]); i++){
      let v = S.get(i, i)
      S1.set0(i, i, v > tol ? 1 / v : 0)
    }

    return M.mtimes(M.mtimes(V, S1), M.transpose(U))
  },
  poly                      : a => {
    if(isNda(a)){
      return ndarray(M.detvec(a))
    }
    let b = 1
    a.forEach(v => {
      b = vecMul(b, [1, -v])
    })

    for(let i = b.length - 1; i >= 0; i--){
      b[i] = keepZero(b[i])
    }

    return ndarray(b)
  },
  project                   : (a, b) => {
    return a.mul((M.mtimes(M.transpose(b), a) / M.mtimes(M.transpose(a), a)))
  },
  qr                        : a => {
    if(!isNda(a)){
      return
    }

    let Q, R, l = a.shape[0]
    let b       = a
    while(1){
      let arr = [], v, sum = 0
      for(let i = b.shape[0] - 1; i >= 0; i--){
        v = b.get(i, 0)
        sum += v * v
        if(i){
          arr[i] = v
        }
        else{
          arr[i] = v - Math.sqrt(sum)
          sum    = sum - v * v + arr[i] ** 2
        }
      }

      let q = ndarray([], [b.shape[0], b.shape[0]])

      q.fill((i, j) => (i == j ? 1 : 0) - 2 * arr[i] * arr[j] / sum)

      let c = M.mtimes(q, b)

      if(!Q){
        Q = q
      }
      else{
        let q2 = ndarray([], [l, l])
        q2.fill((i, j) => {
          if(i < l - q.shape[0] || j < l - q.shape[0]){
            return i == j ? 1 : 0
          }
          else{
            return q.get(i - l + q.shape[0], j - l + q.shape[0])
          }
        })
        Q = M.mtimes(Q, q2)
      }

      if(!R){
        R = c
      }
      else{
        R.fill((i, j) => {
          if(i < l - c.shape[0] || j < l - c.shape[0]){
            return R.get(i, j)
          }
          else{
            return c.get(i - l + c.shape[0], j - l + c.shape[0])
          }
        })
      }

      if(b.shape[0] > 2){
        b = c.pick('1:', '1:')
      }
      else{
        break
      }
    }

    return [Q, R]
  },
  rank                      : a => {
    let lu = M.lu(a)[2]
    return lu.rank
  },
  rcond                     : a => {
    return 1 / M.cond(a, 1)
  },
  rref                      : a => {
    return M.gauss(a, undefined, 'stop')
  },
  svd                       : (a, econ) => {
    // svd(A,"econ") 生成 A 的精简分解。如果 A 是 m×n 矩阵，则：
    // m > n - 只计算 U 的前 n 列，S 是一个 n×n 矩阵。
    // m = n - svd(A,"econ") 等效于 svd(A)。
    // m < n - 只计算 V 的前 m 列，S 是一个 m×m 矩阵。
    //
    // m > n - svd(A,0) 等效于 svd(A,"econ")。
    // m <= n - svd(A,0) 等效于 svd(A)。
    // 精简分解从奇异值的对角矩阵 S 中删除额外的零值行或列，以及 U 或 V 中与表达式 A = U*S*V' 中的那些零值相乘的列。删除这些零值和列可以缩短执行时间，并减少存储要求，而且不会影响分解的准确性。
    let m = a.shape[0]
    let n = a.shape[1]
    if(m > n && econ === 0){
      econ = 'econ'
    }

    let AA         = M.mtimes(a.transpose(), a)
    let eig_result = M.eig(AA, '', econ)
    let Aeig       = eig_result.single
    let Aeigvec    = eig_result.multias[0]
    let p          = m
    let q          = n

    if(econ){
      p       = Aeig.size
      q       = p
      Aeigvec = Aeigvec.pick(':', ':' + (p - 1))
    }

    let sigma = ndarray([], [p, q]).fill((i, j) => i == j ? Math.sqrt(Aeig.get(i, 0)) : 0)
    // let sigma2 = M.diag(M.sqrt(Aeig))
    // console.log('svd', sigma, sigma2)
    let V = M.orth(Aeigvec)
    let u = M.zeros(m, p)
    for(let col = 0, l = u.shape[1]; col < l; col++){
      let eigvalue = sigma.get(col, col)
      console.log(col, eigvalue)
      if(eigvalue > 0){
        let ui = M.mtimes(a, V.pickKeep(':', col)).div(eigvalue)
        for(let row = 0; row < u.shape[0]; row++){
          u.set(row, col, ui.get(row, 0))
        }
      }
      else{
        u.set(col, col, 1)
      }
    }

    let U = M.orth(u)

    //let result = M.mtimes(M.mtimes(u, sigma), M.transpose(V))
    return {
      single : Aeig,
      multias: [U, sigma, V]
    }
  },
  tril                      : (a, k = 0) => {
    let b = ndarray([], a.shape)
    b.fill((i, j) => i < j + k ? 0 : a.get(i, j))
    return b
  },
  triu                      : (a, k = 0) => {
    let b = ndarray([], a.shape)
    b.fill((i, j) => i > j + k ? 0 : a.get(i, j))
    return b
  },
})
//矩阵处理2
$.E(M, {
  blkdiag   : (...arg) => {
    //从输入参数构造块对角矩阵
    let a = arg[0].simple(), b, c
    for(let i = 1, l = arg.length; i < l; i++){
      b = arg[i]
      c = M.zeros(a.shape[0] + b.shape[0], a.shape[1] + b.shape[1])
      a.map((i, j) => {
        c.set(i, j, a.get(i, j))
      })
      b.map((i, j) => {
        c.set(a.shape[0] + i, a.shape[1] + j, b.get(i, j))
      })
      a = c
    }

    return c
  },
  circshift : (a, k, dim) => {
    //循环移位
    if(!/^[\+\-]?\d+$/g.test(k) && !isNda(k)){
      console.error('circshift(A,K)，K 必须是整数')
      return
    }

    var d = []
    if(isNda(k)){
      let vec = k.data
      for(let i = 0; i < a.shape.length; i++){
        if(i in vec){
          d[i] = vec[i]
        }
        else{
          d[i] = 0
        }
      }
    }
    else if(dim == undefined){
      for(let i = 0; i < a.shape.length; i++){
        if(a.shape[i] > 1){
          d[i] = k
        }
        else{
          d[i] = 0
        }
      }
    }
    else if(!isNaN(dim) && +dim >= 1){
      dim = INDEX(dim)
      for(let i = 0; i < a.shape.length; i++){
        if(i == dim){
          d[i] = k
        }
        else{
          d[i] = 0
        }
      }
    }

    else{
      console.error('circshift(A,K,dim)，dim 必须是正整数')
      return
    }

    console.log(d)
    let b = ndarray([], a.shape)
    b.fill((...arg) => {
      for(let i = 0; i < arg.length; i++){
        arg[i] = (arg[i] - d[i] + a.shape[i]) % a.shape[i]
      }
      return a.get(...arg)
    })

    return b
  },
  ctranspose: a => {
    //复数共轭转置
    let _ta = type(a)
    if(_ta === 'ndarray'){
      let ct = a.transpose().simple()
      ct.data.map(item => isComplex(item) ? item.conj() : item)
      return ct
    }
  },
  diag      : (a, k = 0) => {
    if(isNda(a) && (a.shape[0] == 1 || a.shape[1] == 1)){
      a = a.simple().data
    }

    let b
    if(Array.isArray(a)){
      let abs_k = Math.abs(k)
      let l     = a.length + abs_k
      b         = ndarray([], [l, l])
      b.fill((i, j) => i + k == j ? a[k > 0 ? i : j] : 0)
      return b
    }
    else if(isNda(a)){
      let l = Math.min(a.shape[0], a.shape[1])
      if(k > 0){
        l -= Math.max(0, l + k - a.shape[1])
      }
      else if(k < 0){
        l -= Math.max(0, l - k - a.shape[0])
      }
      b = ndarray([], [l, 1])
      b.fill((i, j) => k >= 0 ? a.get(i, i + k) : a.get(i - k, i))

    }
    return b
  },
  flipdim   : (a, dim) => {
    //沿指定维度翻转数组 不推荐使用, 推荐flip
  },
  flip      : (a, dim) => {
    if(/^\d$/.test(dim) && (dim - 1) in a.shape){
      //dim参数有效
      dim = INDEX(dim)
    }
    else{
      for(let i = 0; i < a.shape.length; i++){
        if(a.shape[i] > 1){
          dim = i
          break
        }
      }
    }

    let b       = a.clone()
    b.view[dim] = b.view[dim].reverse()
    return b.simple()
  },
  fliplr    : a => {
    //从左到右翻转矩阵
    let b = a.simple()
    b.view[1].reverse()
    return b.simple()
  },
  flipud    : a => {
    //将矩阵向下翻转
    let b = a.simple()
    b.view[0].reverse()
    return b.simple()
  },
  length    : a => { //需要扩充
    //矢量长度或最大阵列尺寸
    return Math.max(...a.shape)
    // return Math.sqrt(M.mtimes(a.transpose(a), a))
  },
  ndims     : a => {
    //数组维数
    return a.dimension
  },
  numel     : a => {
    //数组元素的数目
    return a.size
  },
  ipermute  : (a, dimorder) => {
    //n-维阵列的反置换维数
    let b = a.simple()
    dimorder.data.forEach((n, i) => {
      b.shape[INDEX(n)] = a.shape[i]
      b.view[INDEX(n)]  = a.view[i]
    })
    return b.simple()
  },
  iscolumn  : a => {
    //确定输入是否是列向量
    return (isNda(a) && a.dimension == 2 && a.shape[1] == 1)
  },
  isempty   : a => {
    //确定数组是否为空
    return (isNda(a) && a.size == 0)
  },
  ismatrix  : a => {
    //确定输入是否为矩阵
    return isNda(a) && a.dimension == 2
  },
  isrow     : a => {
    //确定输入是否为行向量
    return (isNda(a) && a.dimension == 2 && a.shape[0] == 1)
  },
  isscalar  : a => {
    //确定输入是否为标量
    return !isNaN(a) || typeof (a) == 'string'
  },
  isvector  : a => {
    //确定输入是否为矢量
    return M.iscolumn(a) || M.isrow(a) || M.isscalar(a)
  },
  permute   : (a, dimorder) => {
    //重新排列 N 维数组的维数
    let b = a.simple()
    dimorder.data.forEach((n, i) => {
      b.shape[i] = a.shape[INDEX(n)]
      b.view[i]  = a.view[INDEX(n)]
    })
    return b.simple()
  },
  repmat    : (a, ...arg) => {
    //复制和平铺数组

    if(!isNda(a)){
      a = ndarray([a])
    }

    let vec_rep = []
    if(arg.length == 1){
      if(!isNaN(arg[0])){
        vec_rep = new Array(a.dimension)
        for(let i = vec_rep.length - 1; i >= 0; i--){
          vec_rep[i] = arg[0]
        }
      }
      else if(isNda(arg[0])){
        vec_rep = arg[0].data
      }
      else if(Array.isArray(arg[0])){
        vec_rep = arg[0]
      }
    }
    else{
      vec_rep = arg
    }

    let a_shape = []
    let b_shape = []
    for(let i = vec_rep.length - 1; i >= 0; i--){
      a_shape[i] = a.shape[i] || 1
      b_shape[i] = a_shape[i] * vec_rep[i]
    }

    a     = ndarray(a.data, a_shape)
    let b = ndarray([], b_shape)
    b.fill((...arg) => {
      for(let i = arg.length - 1; i >= 0; i--){
        arg[i] = arg[i] % a.shape[i]
      }
      return a.get(...arg)
    })

    return b
  },
  reshape   : (a, ...arg) => {
    //	重塑数组
    if(!isNda(a)){
      console.error('reshape error, need matrix:', a)
    }

    let el = M.numel(a)

    let vec
    if(arg.length == 1){
      if(Array.isArray(arg[0])){
        vec = arg[0]
      }
      else if(isNda(arg[0])){
        vec = arg[0].data
      }
    }
    else{
      vec = arg
    }

    let p = M.prod(vec, vec)

    if(el != p){
      console.error('reshape param error, prod should be ', el)
    }

    return ndarray(a.data, vec)
  },
  rot90     : (a, k = 1) => {
    k           = (k % 4 + 4) % 4
    let len     = a.dimension
    let b_shape = k % 2 == 1 ? a.shape.slice().reverse() : a.shape
    let b       = ndarray([], b_shape)
    console.log(k, b_shape, b)
    b.fill((...arg) => {
      if(k == 1){
        // 0 0 -> 0 1
        // 1 0 -> 0 0
        // 1 1 -> 1 0
        // 0 1 -> 1 1
        [arg[0], arg[1]] = [arg[1], b.shape[0] - 1 - arg[0]]
      }
      else if(k == 2){
        [arg[0], arg[1]] = [b.shape[0] - 1 - arg[0], b.shape[1] - 1 - arg[1]]
      }
      else if(k == 3){
        [arg[0], arg[1]] = [b.shape[1] - 1 - arg[1], arg[0]]
      }
      //console.log(arg, a.get(...arg))
      return a.get(...arg)
    })
    return b
  },
  size      : (a, dim) => {
    if(dim){
      return a.shape[dim - 1]
    }
    return ndarray(a.shape)
  },
  shiftdim  : (a, n) => {//
    // 移位维度
    // B = shiftdim(A,n) 将数组 A 的维度移动 n 个位置。当 n 为正整数时，shiftdim 向左移动维度；当 n 为负整数时，向右移动维度。例如，如果 A 是 2×3×4 数组，则 shiftdim(A,2) 返回 4×2×3 数组。
    // B = shiftdim(A) 返回数组，其元素与 A 相同，但删除了前面的长度为 1 的维度。
    // [B,m] = shiftdim(A) 还返回删除的长度为 1 的维度的数量。
    if(n && !isNaN(n) && n % 1 == 0){
      //是整数
      let b = a
      if(n > 0){
        b       = a.simple()
        b.shape = a.shape.slice(n).concat(...a.shape.slice(0, n))
        b.view  = a.view.slice(n).concat(a.view.slice(0, n))
      }
      else if(n < 0){
        b = a.simple()
        for(let i = 0; i < -n; i++){
          b.shape.unshift(1)
          b.view.unshift([0])
        }
      }

      return b
    }

    if(n == undefined){
      let m = 0
      let b = a
      if(a.dimension > 2){
        for(let i = 0; i < a.dimension; i++){
          if(a.shape[i] == 1){
            m++
          }
          else{
            continue
          }
        }

        if(m){
          b       = a.simple()
          b.shape = b.shape.slice(m)
          b.view  = b.view.slice(m)
          b.dimension -= m
        }
      }

      return {
        single : b,
        multias: [b, m]
      }
    }
  },
  issorted  : (a, ...d) => {
    //	确定集合元素是否按排序顺序排列
    let sorted_result = M.sort(a, ...d)
    let sorted        = sorted_result.single
    return sameValue(a, sorted)
  },
  sort      : (a, ...d) => {
    let direction = d.includes('descend') ? 'descend' : 'ascend'
    let dim       = d.includes(2) ? 2 : d.includes(3) ? 3 : 0

    // let column       = /^\d+$/.test(d[0]) ? +d[0] : 1

    if(direction){
      d = d.filter(item => item != direction)
    }

    let f = function(arr){
      let b = arr.slice()
      arr.sort((a, b) => direction == 'descend' ? (b > a ? 1 : -1) : (b < a ? 1 : -1))
      let index_arr = []
      arr.forEach(n => {
        let i = b.indexOf(n)
        index_arr.push(UNINDEX(i))
        b[i] = '__!!__'
      })
      return {
        single : arr,
        multias: [arr, index_arr]
      }
    }

    let b, i
    if(isNda(a)){
      if(a.shape[0] == 1 || dim == 2){
        b = []
        i = []
        for(let row = 0; row < a.shape[0]; row++){
          let f_result = f(a.pick(row, ':').simple().data)
          let [b1, i1] = f_result.multias
          b.push(b1)
          i.push(i1)
        }
      }
      else if(dim == 3){
        b = a.simple()
        i = a.simple()
        for(let row = 0; row < a.shape[0]; row++){
          for(let col = 0; col < a.shape[1]; col++){
            let arr = []
            for(let page = 0; page < a.shape[2]; page++){
              arr.push(a.get(row, col, page))
            }
            let [sorted_arr, sorted_i] = f(arr)
            console.log(row, col, sorted_arr)

            for(let page = 0; page < a.shape[2]; page++){
              b.set(row, col, page, sorted_arr[page])
              i.set(row, col, page, sorted_i[page])
            }
          }
        }
        return {
          single : b,
          multias: [b, i]
        }
      }
      else{
        let f_result = M.sort(M.transpose(a), direction, 2);
        [b, i]       = f_result.multias
        let tb       = M.transpose(b)
        return {
          single : tb,
          multias: [tb, i]
        }
      }

    }
    else if(Array.isArray(a)){
      [b, i] = f(a)
    }

    let out_b = ndarray(b)
    return {
      single : out_b,
      multias: [out_b, ndarray(i)]
    }
  },
  sortrows  : (a, ...d) => {
    //按升序对行排序
    let direction = d.includes('descend') ? 'descend' : 'ascend'
    let column    = /^\d+$/.test(d[0]) ? INDEX(+d[0]) : 0

    if(direction){
      d = d.filter(item => item != direction)
    }

    let column_vec = Array.isArray(d[0]) || isNda(d[0]) ? d[0] : null

    let order = []

    if(column_vec){
      //多列排序 todo
      column_vec       = column_vec.data || column_vec
      column_vec       = INDEX(column_vec)
      let col_data     = a.pick(':', column_vec).simple().data
      let combine_data = []
      for(let i = 0, l = a.shape[0]; i < l; i++){
        let multi = [i]
        for(j = 0; j < column_vec.length; j++){
          multi.push(col_data[i + j * l])
        }
        combine_data[i] = multi
      }

      console.log(combine_data)
      let sorted_arr = combine_data.sort((a, b) => {
        if(a[1] == b[1]){
          if(a[2] == b[2]){
            if(a[3] != undefined){
              if(a[3] == b[3]){
                if(a[4] != undefined){
                  if(a[4] == b[4]){
                    if(a[5] != undefined){
                      return a[45] - b[5]
                    }
                  }
                  return a[4] - b[4]
                }
              }
              return a[3] - b[2]
            }
          }
          return a[2] - b[2]
        }
        return a[1] - b[1]
      })
      sorted_arr.forEach(n => {
        let i = n[0]
        order.push(a.view[0][i])
        col_data[i] = null
      })

      a.view[0] = order
      order     = UNINDEX(order)
    }
    else{
      let col_data   = a.pick(':', column).simple().data
      let sorted_arr = col_data.slice().sort((a, b) => a - b)
      sorted_arr.forEach(n => {
        let i = col_data.indexOf(n)
        order.push(a.view[0][i])
        col_data[i] = null
      })

      a.view[0] = order
      order     = UNINDEX(order)
    }

    return {
      single : a,
      multias: [a, ndarray(order, [order.length, 1])]
    }
  },
  squeeze   : a => {
    // 删除单维度
    if(!isNda(a) || a.dimension < 3){
      return a
    }

    let out_shape = []
    for(let i = 0; i < a.dimension; i++){
      if(a.shape[i] > 1){
        out_shape.push(a.shape[i])
      }
    }

    if(out_shape.length == 0){
      out_shape = [1, 1]
    }
    else if(out_shape.length == 1){
      out_shape.push(1)
    }

    return ndarray(a.data, out_shape)
  },
  transpose : a => {
    a       = format(a)
    let _ta = type(a)
    if(_ta === 'ndarray'){
      return a.transpose()
      // let b=a.transpose()
      // return b.simple()
    }
  }
})
//字符串函数
$.E(M, {
  /*
  用于存储文本字符数组的函数，结合字符数组，等等
blanks	创建空白字符的字符串
cellstr	从字符数组中创建字符串单元格数组
char	转换为字符数组 (字符串)
iscellstr	确定输入是否是字符串的单元格数组
ischar	确定项是否为字符数组
sprintf	将数据格式化为字符串
strcat	水平串联字符串
strjoin	将单元格数组中的字符串合并为单个字符串
识别字符串部分的函数，查找和替换子串
ischar	确定项是否为字符数组
isletter	按照字母次序的数组元素
isspace	数组元素是空格字符
isstrprop	确定字符串是否为指定类别
sscanf	从字符串读取格式化数据
strfind	在另一个字符串中找到一个字符串
strrep	查找和替换字符串
strsplit	在指定分隔符处拆分字符串
strtok	字符串的选定部分
validatestring	检查文本字符串的有效性
symvar	在表达式中确定符号变量
regexp	匹配正则表达式 (区分大小写)
regexpi	匹配正则表达式 (不区分大小写)
regexprep	使用正则表达式替换字符串
regexptranslate	将字符串转换为正则表达式
字符串比较函数
strcmp	比较字符串 (区分大小写)
strcmpi	比较字符串 (不区分大小写)
strncmp	比较字符串的前 n 个字符 (区分大小写)
strncmpi	比较字符串的前 n 个字符 (不区分大小写)
改变字符串大写或小写，创建或删除空格的函数
deblank	从字符串末尾分隔尾随空格
strtrim	从字符串中删除前导空格和尾随空格
lower	将字符串转换为小写
upper	将字符串转换为大写
strjust	对齐字符数组
*/
})
//代数，符号计算 symbolic math
$.E(M, {
  numden  : s => {
    let ss          = analysis(s)
    let mathjax_obj = trans2MathObj(ss)
    if(mathjax_obj.group == 'RD'){
      return [mathjax_obj.p1, mathjax_obj.p2]
    }

    return ['', '']
  },
  simplify: s => {
    // (x-2)*(x^2+2*x+4)+(x+5)*(x^2-5*x+25)
    // ans: 117 2x3
  },
  expand  : s => {
    // (a+b)^3
    // ans: a^3 + 3a^2b +3ab^2 +b^3
  },
  solve   : s => {
    let ss = analysis(s)

    // let mathjax_code = trans2MathJax(ss)
    // mathjax_code     = '$' + mathjax_code + '$'
    // console.log(mathjax_code)

    let mathjax_obj = trans2MathObj(ss)
    console.log(mathjax_obj)
    let code = '$' + obj2mathjax(mathjax_obj) + '$'
    console.log(code)

    return code
  },
  sym     : s => {
    if(/^\d+$/g.test(s) && s > Number.MAX_SAFE_INTEGER){
      return BigInt(s)
    }

    let ss = analysis(s)
    return trans2MathObj(ss)
  }
  /*
  sym
  expand
  collect
  solve
  roots
  simplify

  */
})
//微积分
$.E(M, {
  diff            : (x, n = 1, dim = 1) => { //todo
    // 计算沿大小不等于 1 的第一个数组维度的 X 相邻元素之间的差分
    // 如果 X 是长度为 m 的向量，则 Y = diff(X) 返回长度为 m-1 的向量。Y 的元素是 X 相邻元素之间的差分。
    // Y = [X(2)-X(1) X(3)-X(2) ... X(m)-X(m-1)]
    // 如果 X 是不为空的非向量 p×m 矩阵，则 Y = diff(X) 返回大小为 (p-1)×m 的矩阵，其元素是 X 的行之间的差分。
    // Y = [X(2,:)-X(1,:); X(3,:)-X(2,:); ... X(p,:)-X(p-1,:)]

    // 差分和近似导数；计算x相邻元素之间的差异。
    // 如果X是向量，则diff（X）返回相邻元素之间的差异的向量，比X短一个元素：[X（2）-X（1）X（3）-X（2）... X（N）-X（N-1）]
    //
    // 如果X是一个矩阵，则diff（X）返回行差的矩阵：[X（2：m，...）-X（1：m-1，:)]

    // diff函数用于对符号表达式求导数。该函数的一般调用格式为：
    // diff(s)：没有指定变量和导数阶数，则系统按findsym函数指示的默认变量对符号表达式s求一阶导数。
    // diff(s,’v’)：以v为自变量，对符号表达式s求一阶导数。
    // diff(s,n)：按findsym函数指示的默认变量对符号表达式s求n阶导数，n为正整数。
    // diff(s,’v’,n)：以v为自变量，对符号表达式s求n阶导数。

    // syms f(x)
    // f(x) = sin(x^2);
    // Df = diff(f,x)
    // Df(x) = 2xcos(x^2)
    //
    // syms x t
    // Df = diff(sin(x*t^2))
    // Df = t^2*cos(t^2*x)
    //
    // Df = diff(sin(x*t^2),t)
    // Df = 2*t*x*cos(t^2*x)
    //
    // syms x y
    // Df = diff(x*cos(x*y), y, 2)
    // Df = −x^3*cos(x*y)

    // 导数公式：
    // x^a        -> ax^(a-1)
    // e^x        -> e^x
    // a^x        -> ln(a)*a^x
    // loga(x)    -> 1/(x*ln(a))
    // ln(x)      -> 1/x
    // sin(x)     -> cos(x)
    // cos(x)     -> -sin(x)
    // tan(x)     -> sec(x)^2
    // cot(x)     -> -csc(x)^2
    // sec(x)     -> sec(x)tan(x)
    // csc(x)     -> -csc(x)cot(x)
    // arcsin(x)  -> 1/sqrt(1-x^2)
    // arccos(x)  -> -1/sqrt(1-x^2)
    // arctan(x)  -> 1/(1+x^2)
    // arccot(x)  -> -1/(1+x^2)

    // fg         -> (f'g+fg')
    // f/g        -> (f'g-fg')/g^2
    // 1/f        -> -f'/f^2

    if(n > 1){
      return M.diff(M.diff(x, n - 1))
    }

    if(isNda(x)){
      if((x.shape[0] == 1 || x.shape[1] == 1) && x.dimension == 2){
        x = x.data

        let out = []
        for(let i = 0, l = x.length - 1; i < l; i++){
          out[i] = x[i + 1] - x[i]
        }

        return ndarray(out)
      }

      let out = []
      if(dim == 1){
        for(let i = 0, l = x.shape[0] - 1; i < l; i++){
          out[i] = M.minus(x.pickKeep(i + 1, ':'), x.pickKeep(i, ':'))
        }

        return M.concatenateV(...out)
      }
      else if(dim == 2){
        for(let i = 0, l = x.shape[1] - 1; i < l; i++){
          out[i] = M.minus(x.pickKeep(':', i + 1), x.pickKeep(':', i))
        }

        return M.concatenate(...out)
      }
    }

  },
  polyint         : (p, k = 0) => {
    if(isNda(p)){
      p = p.data
    }

    let l   = p.length
    let out = []
    for(let i = 0; i < l; i++){
      out[i] = p[i] / (l - i)
    }
    out[l] = k

    return ndarray(out)
  },
  polyder         : (a, b) => {
    //k = polyder(p) 返回 p 中的系数表示的多项式的导数，
    //k = polyder(a,b) 返回多项式 a 和 b 的乘积的导数，
    //[q,d] = polyder(a,b) 返回多项式 a 和 b 的商的导数，

    if(b == undefined){
      if(isNda(a)){
        a = a.data
      }

      let l   = a.length
      let out = []
      console.log(a)
      for(let i = 0; i < l - 1; i++){
        out[i] = a[i] * (l - 1 - i)
      }

      return ndarray(out)
    }
    else{
      let c  = (a.data ? a.simple().data : a)
      let d  = (b.data ? b.simple().data : b)
      let c1 = M.polyder(a).data
      let d1 = M.polyder(b).data

      let e = ndarray(vecAdd(vecMul(c1, d), vecMul(c, d1, -1)))
      let f = M.conv(b, b)

      return {
        single : M.polyder(M.conv(a, b)),
        multias: [e, f]
      }
    }

  },
  limit2          : (output, f, n, a, ng = '') => {
    let result
    if(typeof (n) != 'object'){
      console.error('limit2 n error')
      return
    }

    let n0
    if(n.group == 'AC'){
      output.push('Calculate ' + n.p1 + ' inner limit first')
      n0 = n
      n  = n.p2.p1
    }

    if(n.group == 'NG'){
      ng = ng == '' ? '-' : ''
      f  = f.slice(1)
      n  = n.p1
    }

    if(isFinite(eval(a))){
      if(str2reg('(x^w-1)/(x^w-1)').test(f) && a == 1){
        result = LIMIT.特定形式mn(output, f, n, a, ng)
      }
      else if(str2reg('(1/sin(x)-1/tan(x))').test(f) && a == 0){
        result = LIMIT.特定形式sin_tan(output, f, n, a, ng)
      }
      else if(str2reg('(tan(x)-sin(x))').test(f) && a == 0){
        result = LIMIT.特定形式tan_sin(output, f, n, a, ng)
      }
      else if(str2reg('sin(pi*x)').test(f) && a == 1){
        result = LIMIT.特定形式sin_pi(output, f, n, a, ng)
      }
      else if((str2reg('tan((pi*x)/2)').test(f) || str2reg('tan(pi*x/2)').test(f)) && a == 1){
        result = LIMIT.特定形式tan_pi_2(output, f, n, a, ng)
      }
      else if(str2reg('tan').test(f) && /pi/.test(a)){
        result = LIMIT.特定形式tan_pi(output, f, n, a, ng)
      }
      else{
        if(n.group == 'RD'){
          output.push('Finite ratio limit')

          if(n.p2?.p1?.p2 == '-' && (n.p2.p1.p1.group == 'MI' || n.p2.p1.p2.group == 'MI')){
            result = LIMIT.分母有理化(output, f, n, a, ng)
          }
          else{
            result = LIMIT.有限比值(output, f, n, a, ng)
          }
        }
        else if(n.group == 'MI'){
          output.push('Finite power limit')
          result = LIMIT.有限幂(output, f, n, a, ng)
        }
        else if(n.group == 'MU'){
          if(M.limit(obj2str(n.p1), a)){
            output.push('Multi limit，calculate independent: ')
            output.push(M.mathjaxLim(n.p1, a, ng))
            let v1 = eval(M.limit2(output, obj2str(n.p1), n.p1, a, ng))
            output.push(M.mathjaxLim(n.p2, a))
            let v2 = eval(M.limit2(output, obj2str(n.p2), n.p2, a))

            result = v1 * v2

            output.push('The limit value is: ' + M.mathjaxInf(result))
          }
          else if(noBr(n.p1).group == 'RD' || noBr(n.p2).group == 'RD'){
            output.push('Split into fractions: ')
            let n2
            if(noBr(n.p1).group == 'RD' && noBr(n.p2).group != 'RD'){
              n2 = {
                group: 'RD',
                p1   : noBr(n.p1).p1 == 1 ? noBr(n.p2) : {
                  group: 'MU',
                  p1   : noBr(n.p1).p1,
                  p2   : n.p2
                },
                p2   : noBr(n.p1).p2
              }
            }
            else if(noBr(n.p1).group != 'RD' && noBr(n.p2).group == 'RD'){
              n2 = {
                group: 'RD',
                p1   : noBr(n.p2).p1 == 1 ? n.p1 : {
                  group: 'MU',
                  p1   : n.p1,
                  p2   : noBr(n.p2).p1,
                },
                p2   : noBr(n.p2).p2
              }
            }
            else{
              console.log('todo')
            }

            let f2 = obj2str(n2)
            output.push(M.mathjaxLim(n2, a))
            result = M.limit2(output, f2, n2, a, ng)
          }
          else{
            console.log('todo')
          }
        }
      }
    }
    else if(a == -Infinity){
      output.push('Convert -Infinity to Infinity')

      let f1 = M.transferInfinite(f)
      let n1 = str2obj(f1)
      a      = Infinity
      output.push(M.mathjaxLim(n1, a, ng))

      result = M.limit2(output, f1, n1, a, ng)
    }
    else{
      //Infinity
      if(str2reg('log(x+1)-log(x)').test(f)){
        result = LIMIT.特定形式log_log(output, f, n, a, ng)
      }
      else if(/cos\(1\/[\(\d\*]*x/.test(f)){
        result = LIMIT.特定形式cos_1_x(output, f, n, a, ng)
      }
      else if(/\/x/.test(f) && /e/.test(f)){
        result = LIMIT.特定形式e_x(output, f, n, a, ng)
      }
      else if(n.group == 'RD'){
        output.push('Ratio limit')

        if(isAdMiFac(n.p1) == 2 && isAdMiFac(n.p2) == 2){
          result = LIMIT.分子分母有理化(output, f, n, a, ng)
        }
        else if(isAdMiFac(n.p2) == 2){
          result = LIMIT.分母有理化(output, f, n, a, ng)
        }
        else{
          result = LIMIT.无限比值(output, f, n, a, ng)
        }
      }
      else if(n.group == 'MI'){
        output.push('Infinity power limit')
        result = LIMIT.无限幂(output, f, n, a, ng)
      }
      else if(isAdMiFac(n) == 2){
        result = LIMIT.分子有理化(output, f, n, a, ng)
      }
      else if(isAdMiFac(n) == 3){
        result = LIMIT.分子有理化3(output, f, n, a, ng)
      }
      else if(n.group == 'MU'){
        result = LIMIT.无限积(output, f, n, a, ng)

      }

      if(n0 && result){
        let result_s = n0.p1 + `(${result})`
        if(!isNaN(result) || isFraction(result)){
          result = action(n0.p1, result.toNumber())
          output.push('The limit value is: ' + result_s + ' = ' + result)

        }
        else{
          result = result_s
          output.push('The limit value is: ' + result)
        }
      }
    }

    return result
  },
  limit           : (f, a, output = []) => {
    //Limit of symbolic expression

    /*
    limit(f,var,a) returns the Bidirectional Limit of the symbolic expression f when var approaches a.
    limit(f,a) uses the default variable found by symvar.
    limit(f) returns the limit at 0.
    limit(f,var,a,'left') returns the Left Side Limit of f as var approaches a.
    limit(f,var,a,'right') returns the Right Side Limit of f as var approaches a.

    limit(ln(sin(x)), pi/2)        -> 0
    limit((sqrt(x+1)-1)/x, 0)      -> 1/2
    limit((1-x^(1/3))/(1-x), 0)    -> 1/3
    limit((1-cos(x))/x^2, 0)       -> 1/2
    limit((1-1/x)^x, inf)          -> e^-1
    limit((x+1)^(1/x), inf)        -> 1
    limit(x*sin(1/x), 0)           -> 0
    limit((2*x^3+x)/(3*x^3+1), 0)  -> 2/3
    limit(sin(a*x)/sin(b*x), 0)    -> a/b

    f=(x*(exp(sin(x))+1)-2*(exp(tan(x))-1))/(x+a) -> (1/2*a*exp(sin(a))+1/2*a-exp(tan(a))+1)/a                                 ,,,,,,,,,,,,,,,,,,
    limit((1+2*t/x)^(3*x),x,inf)   -> exp(6*t)
    f=x*(sqrt(x^2+1)-x);
    limit(f,x,inf,’left’)          -> 1/2
    f=(sqrt(x)-sqrt(2)-sqrt(x-2))/sqrt(x*x-4);
    limit(f,x,2,’right’)           -> -1/2

    极限公式
    sin(x)         -> x
    tan(x)         -> x
    arcsin(x)      -> x
    arctan(x)      -> x
    1-cos(x)       -> 1/2*x^2
    1-cos(x^2)     -> 1/2*x^4
    (1+x)^(1/n)-1  -> x/n
    e^x-1          -> x
    e^(x^2)-1      -> x^2
    a^x-1          -> x*ln(a)
    ln(1+x)        -> x
    (1+1/x)^x      -> e      inf
    (1+x)^(1/x)    -> e

    大学数学求极限常用公式及简单套用
    https://baijiahao.baidu.com/s?id=1615042947782687596&wfr=spider&for=pc
    */

    f = window[f] || f

    let n, f0 = f
    let a_num = isNaN(a) ? eval(a) : +a

    // let output = []
    if(typeof (f) == 'string'){
      f = f.replace(/\s/g, '')
      n = str2obj(f)
    }
    else if(typeof (f) == 'object' && f.uuid){
      n = f
      f = obj2str(n)
    }
    else{
      return 'para error'
    }

    if(obj2str(n) != f){
      console.error(n, f, obj2str(n))
    }

    output.push(M.mathjaxLim(n, a))
    let n0 = limitVal(n, a_num)
    if(n0 == undefined){
      return 'undefined'
    }

    if(isFinite(n0) && n0){
      // console.log('direct calc', n0, f)
      output.push('Calculate directly: ' + n0)
      return n0
    }

    let an, vn

    if(a_num == Infinity){
      an = [0, 0.0001, 0.000001, 0.00000001]
      vn = [
        limitVal(n, 1 / an[1]), limitVal(n, 1 / an[2]), limitVal(n, 1 / an[3]),
      ]
    }
    else if(a_num == -Infinity){
      an = [0, 0.0001, 0.000001, 0.00000001]
      vn = [
        limitVal(n, -1 / an[1]), limitVal(n, -1 / an[2]), limitVal(n, -1 / an[3]),
      ]
    }
    else{
      an = [a_num, a_num + 0.05, a_num + 0.02, a_num + 0.005]
      vn = [
        limitVal(n, an[1]), limitVal(n, an[2]), limitVal(n, an[3]),
      ]
    }

    let p = M.polyfit(an.slice(1), vn, 2)
    n0    = M.polyval(p, an[0]) //* (ng == '-' ? -1 : 1)

    if(isNaN(n0)){
      if(isNaN(vn[3])){
        if(isNaN(vn[2])){
          if(isNaN(vn[1])){
            n0 = 'something wrong'
          }
          else{
            n0 = vn[1]
          }
        }
        else{
          n0 = vn[2]
        }
      }
      else{
        n0 = vn[3]
      }
    }

    let ng = ''
    if(n.group == 'NG'){
      ng = '-'
      f  = f.slice(1)
      n  = n.p1
    }

    let result = M.limit2(output, f, n, a, ng)

    isNaN(n0) || output.push('Reference numerical approximation results: ' + M.mathjaxInf(n0.toFixed(M.FIXNUM * 2)))
    // if(isFinite(a_num)){
    // }
    // else{
    //   isNaN(n0) || output.push(`Reference calculation results 1: f(${a0}) -> ` + n0.toFixed(M.FIXNUM * 2))
    //   isNaN(n1) || output.push(`Reference calculation results 2: f(${a1}) -> ` + n1.toFixed(M.FIXNUM * 2))
    // }
    return result
  },
  transferInfinite: (f, a) => {
    let f1 = f.replace(str2reg(`x^d`), s => {
      let d = +s.slice(2)
      if(d % 2){
        return '(-y)^' + d
      }
      else{
        return 'y^' + d
      }
    })

    f1 = f1.replace(str2reg(`[\+\-\*\/]x`), s => {
      let symbol = s.slice(0, -1)
      switch(symbol){
        case '+':
          return '-y'
        case '-':
          return '+y'
        case '*':
        case '/':
          return symbol + 'y'
      }
    })

    f1 = f1.replace(/y/g, 'x')

    return f1
  },
  transferLimit   : (f, a) => {
    f = f.replace(str2reg(`(${a}-x)`), '(-y)')
    f = f.replace(str2reg(`(x-${a})`), '(y)')
    // f = f.replace(/\(([\+\-]?\d+)?[\+\-]?x([\+\-]\d+)?\)/g, (find_str) => {
    //   let d
    //   let sign = ''
    //   find_str = find_str.replace(/[\+\-]?x/, single_x => {
    //     if(single_x == '-x'){
    //       d    = -a
    //       sign = '-'
    //     }
    //     else{
    //       d = +a
    //     }
    //
    //     return ''
    //   })
    //
    //   find_str = find_str.replace(/[\+\-]?\d+/g, single_num => {
    //     d += single_num * 1
    //     return ''
    //   })
    //
    //   // console.log(find_str)
    //   return `(${sign}y` + (d == 0 ? '' : d > 0 ? '+' + d : '-' + (-d)) + ')'
    // })

    f = f.replace(/\d+\*x/g, s => {
      let d0 = +s.slice(0, -2)
      let d  = d0
      let c
      if(isNaN(a) && /\//.test(a)){
        // a 是个分数，其中很可能有 pi
        let a_arr      = a.split('/')
        let a_arr0_arr = a_arr[0].split('*')
        let fra
        if(a_arr0_arr.length && (!isNaN(a_arr0_arr[0]) || !isNaN(a_arr0_arr[1]))){
          if(!isNaN(a_arr0_arr[0])){
            d *= a_arr0_arr[0]
            c = a_arr0_arr[1]
          }
          else{
            d *= a_arr0_arr[1]
            c = a_arr0_arr[0]
          }
        }
        else{
          c = a_arr[0]
        }

        if(!isNaN(a_arr[1])){
          fra = fraction(d, +a_arr[1])
        }
        else{
          // 分母不是数字的情形
          console.log('todo')
        }

        let result = d + '*' + 'y'
        if(isFraction(fra)){
          if(fra.n > 0){
            result += '+'
          }
          else{
            result += '-'
            fra.n = -fra.n
          }

          if(fra.n == 1){
            result += c
          }
          else{
            result += fra.n + '*' + c
          }

          result += '/' + fra.d
        }
        else{
          if(fra > 0){
            result += '+'
          }
          else{
            result += '-'
            fra = -fra
          }

          if(fra == 1){
            result += c
          }
          else{
            result += fra + '*' + c
          }
        }

        return result
      }
    })
    f = f.replace(/x/g, '(y' + (isNaN(a) || a > 0 ? '+' + a : a) + ')')
    f = f.replace(/y/g, 'x')
    // console.log(f, a)

    return f
  },
  transferLimit2  : (f, a) => {
    // 找到括号内含x的字符串
    f = f.replace(/\([^\(]*[\+\-]?x[^\)]*\)/g, (find_str) => { ///\(([\+\-]?\d+)?[\+\-]?x([\+\-]\d+)?\)/g
      let d
      let sign = ''
      find_str = find_str.replace(/[\+\-]?x/, single_x => {
        if(single_x == '-x'){
          d    = -a
          sign = '-'
        }
        else{
          d = +a
        }

        return ''
      })

      find_str = find_str.replace(/[\+\-]?\d+/g, single_num => {
        d += single_num * 1
        return ''
      })

      // console.log(find_str)
      return `(${sign}y` + (d == 0 ? '' : d > 0 ? '+' + d : '-' + (-d)) + ')'
    })

    f = f.replace(/x/g, '(y' + (a > 0 ? '+' + a : a) + ')')
    f = f.replace(/y/g, 'x')
    // console.log(f, a)

    return f
  },
  newtonCotes     : (f, a, b, n, m = 1) => {
    // fun，积分函数的句柄，必须能够接受矢量输入
    // a，积分下限
    // b，积分上限
    // m，将区间[a,b]等分的子区间数量
    // n，采用的Newton-Cotes公式的阶数，必须满足n<8，否则积分没法保证稳定性

    f = window[f] ?? f
    a = window[a] ?? +a
    b = window[b] ?? +b
    n = window[n] ?? +n
    m = window[m] ?? +m
    console.log(a, b, n, m)
    f       = f.replace(/\s/g, '')
    let obj = str2obj(f)
    let xk  = M.linspace(a, b, m + 1).data

    let sum = 0
    for(let i = 0; i < m; i++){
      sum += M.newtonCotes2(obj, xk[i], xk[i + 1], n)
    }

    return sum;//limitVal(n, b)
  },
  newtonCotes2    : (obj, a, b, n) => {
    if(n < 2 || n > 7){
      return 'newton cotes accept 2-7, but ' + n
    }

    let x = M.linspace(a, b, +n + 1).data
    console.log(x)

    if(!M.COTESCOEFF){
      M.COTESCOEFF = {
        1: d([1, 1], 2),
        2: d([1, 4, 1], 6),
        3: d([1, 3, 3, 1], 8),
        4: d([7, 32, 12, 32, 7], 90),
        5: d([19, 75, 50, 50, 75, 19], 288),
        6: d([41, 216, 27, 272, 27, 216, 41], 840),
        7: d([751, 3577, 1323, 2989, 2989, 1323, 3577, 751], 17280),
      }

      function d(arr, n){
        return arr.map(v => v / n)
      }
    }

    let sum = 0
    for(let i = 0; i <= n; i++){
      sum += M.COTESCOEFF[n][i] * limitVal(obj, x[i])
    }

    sum *= b - a

    return sum
  },

  /*
    limit
    subs
    collect
    solve
    simplify
    matlab 符号计算 https://www.docin.com/p-65461705.html
    */
})
//多项式
$.E(M, {
  deconv    : (u, v) => {
    // 去卷积和多项式除法
    // [q,r] = deconv(u,v) 使用长除法将向量 v 从向量 u 中去卷积，并返回商 q 和余数 r，以使 u = conv(v,q) + r。
    // 如果 u 和 v 是由多项式系数组成的向量，则对它们去卷积相当于将 u 表示的多项式除以 v 表示的多项式。
    u = (u.data ?? u).slice()
    v = v.data ?? v

    if(v.fraction){
      //有根号
      let n = 1 / v.fraction
      if(n % 1 == 0){
        //整数倍
        let u1 = []
        for(let i = u.length - 1; i >= 0; i--){
          u1[i * n] = i == u.length - 1 ? Math.pow(u[i], n) : u[i]
        }
        u = u1
      }
    }

    let q = []
    let r = []
    let t = []
    let rate
    for(let i = 0, il = u.length - v.length; i <= il; i++){
      rate = (u[i] ?? 0) / v[0]
      q[i] = rate
      for(let j = v.length - 1; j >= 0; j--){
        u[i + j] = (u[i + j] ?? 0) - (v[j] || 0) * rate
      }
    }

    for(let i = u.length - v.length + 1; i < u.length; i++){
      t.push(u[i])
    }

    if(v.fraction){
      q.fraction = v.fraction
    }

    return [ndarray(q), ndarray(u.slice()), ndarray(t)]
  },
  dx        : (v) => {
    let dv = []
    let l  = v.length - 1
    for(let i = 0; i < l; i++){
      dv[i] = v[i] * (l - i)
    }
    return dv
  },
  factorRoot: (n, k, space = 'rational') => {
    if(!Array.isArray(n)){
      return 'factorRoot: only array '
    }
    // 多项式因式分解
    let roots  = M.roots(n).single.data
    let output = []
    let left   = n
    if(n[0] != 1){
      output.push(n[0])
    }
    // let s     = n[0] != 1 ? n[0] + '*' : ''
    let x = k[0]
    let y = k[1] ?? ''

    for(var i = 0, l = roots.length; i < l; i++){
      if(isComplex(roots[i]) && space != 'complex'){
        let b = -keepZero(2 * roots[i].r)
        let c = keepZero(roots[i].r ** 2 + roots[i].i ** 2)
        i++
        if((!isRational(b) || !isRational(c)) && space == 'rational'){
          continue
        }

        if(space == 'rational'){
          let [q, r, s] = M.deconv(left, [1, b, c])
          console.log(left, q, r, s)
          left = q.data
        }

        let bs
        let cs

        if(b == 0){
          bs = ''
        }
        else if(b == 1){
          bs = y ? '+' + x + '*' + y : '+' + x
        }
        else if(b == -1){
          bs = y ? '-' + x + '*' + y : '-' + x
        }
        else if(b > 0){
          bs = y ? '+' + b + x + '*' + y : '+' + b + x
        }
        else{
          bs = y ? b + x + '*' + y : b + x
        }

        if(c == 0){
          cs = ''
        }
        else if(c == 1){
          cs = y ? '+' + y + '^2' : '+1'
        }
        else if(c == -1){
          cs = y ? '-' + y + '^2' : '-1'
        }
        else if(c > 0){
          cs = y ? '+' + b + y + '^2' : '+' + c
        }
        else{
          cs = y ? b + y + '^2' : c
        }

        output.push(`${x}^2${bs}${cs}`)
        // s += `(${x}^2${bs}${cs})`

      }
      else{
        let r = roots[i]
        let b
        if(isComplex(r)){
          b = -r.r
          if(b == 0){
            bs = ''
          }
          else if(b == 1){
            bs = y ? '+' + y : '+1'
          }
          else if(b == -1){
            bs = y ? '-' + y : '-1'
          }
          else if(b > 0){
            bs = y ? '+' + b + y : '+' + b
          }
          else{
            bs = y ? b + y : b
          }

          let c = -r.i
          if(c == 1){
            bs += y ? '+' + y : '+'
          }
          else if(c == -1){
            bs += y ? '-' + y : '-'
          }
          else if(c > 0){
            bs += y ? '+' + c + y : '+' + c
          }
          else{
            bs += y ? c + y : '' + c
          }
          bs += 'i'
        }
        else{
          b = -r
          if(!isRational(b) && space == 'rational'){
            continue
          }

          if(space == 'rational'){
            let [q, r, s] = M.deconv(left, [1, b])
            console.log(left, q, r, s)
            left = q.data
          }

          if(b == 0){
            bs = ''
          }
          else if(b == 1){
            bs = y ? '+' + y : '+1'
          }
          else if(b == -1){
            bs = y ? '-' + y : '-1'
          }
          else if(b > 0){
            bs = y ? '+' + b + y : '+' + b
          }
          else{
            bs = y ? b + y : b
          }

        }

        output.push(`${x}${bs}`)

        // s += `(${x}${bs})`
      }
    }

    if(left.length == 1 && left[0] == 1 || space != 'rational'){

    }
    else{
      let s = arr2str(left, x)

      output.push(s)
    }
    return output
  },
  factor    : (n1, space) => {
    let n
    if(typeof (n1) == 'string'){
      n = str2obj(n1)
    }
    else if(typeof (n1) == 'object' && n1.uuid){
      n  = n1
      n1 = obj2str(n1)
    }
    else{
      n = n1
    }

    // console.log(n1, n)

    if(typeof (n) == 'object' && n.group == 'RD'){
      // 分数因式分解
      let p2nda = M.factor(n.p2)
      p2nda     = p2nda.map(n => fraction(1, n))
      return M.factor(n.p1).concat(...p2nda)
      // return M.concatenate(M.factor(n.p1), p2nda)
    }

    if(typeof (n) == 'object' && n.group == 'AD'){
      // 多项式因式分解
      let k        = checkXY(n1)
      let main_key = k[0]
      let sub_key
      if(k == false){
        console.log('多个变量，单项的幂不一致或变量数超过2个，不可分解')
        return [n1]
      }
      else if(k.length == 2){
        //存在两个变量，
        main_key = k[0] > k[1] ? k[1] : k[0]
        sub_key  = k[0] > k[1] ? k[0] : k[1]
        n        = n1.replace(/\*?\s*[a-z]+(\^\d+)?/g, item => {
          let s = item
          if(item[0] == '*'){
            s = item.slice(1).trim()
          }
          if(s.slice(0, sub_key.length) == sub_key){
            return item[0] == '*' ? '' : 1
          }

          return item
        })

        console.log(n1, n)
        n = str2obj(n)
      }

      let obj_arr = []
      obj_ad2array(obj_arr, n)
      let c = obj_arr.c
      delete obj_arr.c
      let key = Object.keys(obj_arr)
      if(key[0] != main_key){
        return 'something wront'
      }

      obj_arr[k[0]][0] = c
      return M.factorRoot(obj_arr[k[0]].reverse(), [main_key, sub_key], space)
    }

    let arr = []

    if(typeof (n) == 'object' && n.group == 'NG'){
      // 多项式因式分解
      arr.push(-1)
      console.log('-1 是第一个因子')
      n = n.p1
    }

    if(typeof (n) == 'object' && n.group == 'MU'){
      // 多项式因式分解
      obj_mu2array(arr, n)
      return arr
    }

    let numberlize = function(n){
      if(typeof (n) == 'string'){
        //如果是BigInt被引号包裹，去掉引号
        n = n.replace(/n$/, '')
        n = BigInt(n)
      }

      if(typeof (n) == 'bigint'){
        if(n < Number.MAX_SAFE_INTEGER){
          return parseInt(n)
        }
      }
      else{
        if(n > Number.MAX_SAFE_INTEGER){
          alert('超过了最大安全整数，会丢失精度，请尝试用bigint: 在数字后面加n，如 1234567890n')
          //9007199254740991，也就是2的53次方-1
          return '' + n
        }
      }

      return n
    }

    let sqrt = function(n){
      if(typeof (n) == 'bigint'){
        let s  = '' + n
        let l  = s.length
        let d  = (l / 2 | 0) - 2
        let s1 = s.slice(0, -d * 2)
        return Math.sqrt(s1) * Math.pow(10, d)
      }
      return Math.sqrt(n)
    }

    let mod = function(n, f){
      if(typeof (n) == 'bigint'){
        let s = '' + n
        let left
        while(s){
          let s1 = (left ? left : '') + s.slice(0, 9)
          left   = s1 % f
          s      = s.slice(9)
        }

        return left
      }
      return n % f
    }

    let rest = function(n, f){
      if(typeof (n) == 'bigint'){
        let s    = '' + n
        let left
        let rest = ''
        let step = 6
        while(s){
          let s1 = s.slice(0, step)
          let l  = s1.length
          s1     = (left ? left : '') + s1
          left   = s1 % f
          let v  = Math.round((s1 - left) / f)
          rest += ((0).toFixed(step) + v).slice(-l)
          s      = s.slice(step)
        }

        rest = rest.replace(/^0+/g, '')
        return numberlize(BigInt(rest))
      }
      return Math.round(n / f)
    }

    n = numberlize(n)

    if(!M.FACTOR){
      let a    = FACTOR_STR.split(',')
      let l    = a.length
      M.FACTOR = new Uint8Array(l)
      a.forEach((n, i) => {
        M.FACTOR[i] = i < 2 ? n : n || 1
      })
      // 共358084个, 最大质数 5148233

      FACTOR_STR = null
      delete window.FACTOR_STR
    }

    // 目前可快速求出26万亿(2.65e13)以内的数字，超过了也能求，会很慢，因为质数需要不断添加到集合里
    let result = []
    if(n < 0){
      n         = -n
      result[0] = -1
    }

    while(n > 1){
      let m = sqrt(n)

      let find = false
      let fac
      for(let i = 0; true; i++){
        if(!M.FACTOR[i]){
          result.push('unfactor ' + n)
          return ndarray(result)

          // let add_fac = getNextPrime(fac)
          // console.log('新增一个质数', add_fac)
          //
          // if(i % 1000 == 0){
          //   let yn = comfirm('扩充了质数库至' + add_fac + ', 仍未找到因数，是否继续？(目前分解' + n + ')')
          //   if(!yn){
          //     result.push('未分解' + n)
          //     return ndarray(result)
          //   }
          // }
          // M.FACTOR[i] = (add_fac - fac) / 2
        }

        fac = i < 2 ? M.FACTOR[i] : fac + (M.FACTOR[i] || 1) * 2
        if(fac > m){
          break
        }

        if(mod(n, fac) == 0){
          find = true  //发现因子
          result.push(fac)
          n = rest(n, fac)
          break
        }
      }

      if(find){
        continue
      }

      result.push(n)
      break
    }

    return result // ndarray(result)

    function getNextPrime(n){
      while(true){
        n += 2
        let m    = Math.sqrt(n)
        let pass = false
        for(let i = 0; M.FACTOR[i] <= m; i++){
          if(n % M.FACTOR[i] == 0){
            pass = true
            break
          }
        }

        if(!pass){
          return n
        }
      }
    }
  },
  findRoots : (arr, fuzhu = '主线') => {
    // arr 的最高次系数在前，常数系数最后一个
    if(isNda(arr)){
      arr = arr.data
    }

    let v = oneHighCoefficients(arr)

    let n = v.length //阶数加1，如：三次方n=4
    if(n < 2){
      console.error('方程阶数太小', n, fuzhu)
      return {real: []}
    }
    else if(n == 2){
      console.log(n, fuzhu, -v[1])

      return {real: [-v[1]]}
    }

    //0根首先选出
    if(nearZero(v.slice(-1)[0])){
      console.log(n, fuzhu, 0)
      let left_roots = M.findRoots(v.slice(0, -1), fuzhu)
      let result     = {
        real: [0].concat(...left_roots.real).sort(mysort)
      }
      if(left_roots.imag){
        result.imag = left_roots.imag
      }
      return result
    }

    let func = funcCreate(M.polyvalNum, v)
    if(n == 3){
      let b     = v[1]
      let c     = v[2]
      let delta = keepZero(b * b / 4 - c)
      let d     = keepZero(b / 2)
      if(delta > 0){
        let val = Math.sqrt(delta)
        console.log(n, fuzhu, [keepZero(-d + val), keepZero(-d - val)])
        return {real: [keepZero(-d + val), keepZero(-d - val)].sort(mysort)}
      }
      if(nearZero(delta)){
        console.log(n, fuzhu, [-d, -d])
        return {real: [-d, -d]}
      }

      if(fuzhu == '主线'){
        let cv = Math.sqrt(-delta)
        console.log(n, fuzhu, '有两个复根', [complex(-d, cv), complex(-d, -cv)])
        return {
          real: [],
          imag: [complex(-d, cv), complex(-d, -cv)]
        }
      }

      return {
        real: [],
      }
    }
    else if(n == 4){
      let b     = v[1]
      let c     = v[2]
      let d     = v[3]
      let p     = keepZero(c - b * b / 3)
      let q     = keepZero(d - b * c / 3 + 2 * b * b * b / 27)
      let delta = keepZero((q / 2) ** 2 + (p / 3) ** 3)
      let b_3   = b / 3

      if(!p && !q){
        console.log(n, fuzhu, '有一个三重零根', -b_3)
        return {real: [-b_3, -b_3, -b_3]}
      }
      if(delta <= 0){
        let r     = Math.sqrt(-p * p * p / 27)
        let theta = Math.acos(keepZero(-q / 2 / r)) / 3
        let _     = 2 * cubeRoot(r)
        let y1    = _ * Math.cos(theta)
        let y2    = _ * Math.cos(theta + pi * 2 / 3)
        let y3    = _ * Math.cos(theta + pi * 4 / 3)
        let x1    = keepZero(y1 - b_3)
        let x2    = keepZero(y2 - b_3)
        let x3    = keepZero(y3 - b_3)

        if(delta == 0){
          if(p && q){
            // console.log('delta == 0, 且p,q!=0, 三个实根中一个绝对值是', Math.abs(_), ',另两个相等, 绝对值是', Math.abs(_) / 2)
          }
        }

        console.log(n, fuzhu, '找到了3个实根', x1, func(x1), x2, func(x2), x3, func(x3))
        console.log(n, 'func count', func('cnt'))
        return {real: [x1, x2, x3].sort(mysort)}
      }
      else{
        // console.log('有一个实根和两个复根')
        let delta_sqrt = Math.sqrt(delta)
        let y1         = cubeRoot(-q / 2 + delta_sqrt) + cubeRoot(-q / 2 - delta_sqrt)
        let x1         = keepZero(y1 - b_3)

        // 降维
        let u = M.lowerDimension(x1, v)

        console.log(n, fuzhu, '找到了一个实根', x1, func(x1))
        console.log(n, 'func count', func('cnt'))

        let roots = M.findRoots(u, fuzhu)
        console.log(n, fuzhu, '找到了两个复根', roots)
        return {
          real: ([x1].concat(roots.real)).sort(mysort),
          imag: roots.imag
        }
      }
    }
    else if(n == 5){
      //https://baike.baidu.com/item/%E4%B8%80%E5%85%83%E5%9B%9B%E6%AC%A1%E6%96%B9%E7%A8%8B
      //假设一元四次方程x^4+bx^3+cx^2+dx+e=0
      //先求配平参数y，y是三次方程u的一个实根
      let b = v[1]
      let c = v[2]
      let d = v[3]
      let e = v[4]

      let u     = [
        1, -c, b * d - 4 * e, -d * d - b * b * e + 4 * c * e
      ]
      let rooty = M.findRoots(u, '配平')
      let y     = rooty.real[0]
      // console.log(u, rooty, y)

      //分别带入两个完全平方式，次数较低的2次方程
      let u1 = [
        b * b / 4 - c + y, b / 2 * y - d, y * y / 4 - e
      ]
      //u1 判别式为0，简化为1元1次方程
      // mx + n = 0
      if(u1[0]){
        let m = Math.sqrt(u1[0])
        let n = u1[1] / u1[0] / 2 * m
        // console.log('mn',m,n)

        //次数较高的2次方程-1次方程=0
        let u2_1 = [
          1, b / 2 - m, y / 2 - n
        ]
        let u2_2 = [
          1, b / 2 + m, y / 2 + n
        ]

        let rootx1 = M.findRoots(u2_1, fuzhu)
        let rootx2 = M.findRoots(u2_2, fuzhu)
        console.log(n, fuzhu, '找到的根:', rootx1, rootx2)

        let result = {
          real: rootx1.real.concat(...rootx2.real).sort(mysort),
          imag: (rootx1.imag || []).concat(...(rootx2.imag || []))
        }

        //let w = v.slice()
        // for(let i=0; i<result.real.length; i++){
        //   w       = M.lowerDimension(result.real[i], w)
        //   console.log('lowerDimension', w)
        // }
        // for(let i=0; i<result.imag.length; i+=2){
        //   w       = M.lowerDimensionComplex(result.imag[i], w)
        //   console.log('lowerDimension', w)
        // }
        return result
      }
      else{
        let u2 = [
          1, b / 2, y / 2
        ]

        let rootx = M.findRoots(u2, fuzhu)

        let result = {
          real: rootx.real.concat(...rootx.real).sort(mysort),
          imag: (rootx.imag || []).concat(...(rootx.imag || []))
        }

        return result
      }
    }
    else if(n > 5){
      let to = '无效解', to_v

      //找出一个根，然后降维求解
      //已知 v[n-1] = 1
      //根的和 == -v[n-2]
      //根的积 == -v[0]
      //曲线平滑
      if(n % 2){
        //偶数阶
        //左极限 > 0，右极限 > 0
        //可能无实根
        let t = Math.pow(Math.abs(v[n - 1]), 1 / n) //-determinant
        //[-t, t] 区间至少有一根
        let val_l = func(-t)
        let val_r = func(t)

        if(val_l == 0){
          // console.log('找到1实根', -t)
          to = -t
        }
        else if(val_r == 0){
          // console.log('找到1实根', -t)
          to = t
        }
        else if(val_l > 0 && val_r > 0){
          // console.log('[-t, t]间至少有2根(含复根)')
          //求导，根为极值点，再判断
          let dv    = M.dx(v)
          let func1 = funcCreate(M.polyvalNum, dv) //1阶导数

          let dv_root = M.findRoots(dv, '导数') //从大到小排列
          console.log(n, fuzhu, 'dv_root', dv_root)

          //很可能出现所有导数根处值是正的情形，无法继续求根

          let dv_root_real = dv_root.real

          let roots_obj = {
            real: [],
            imag: []
          }

          let fr, fr_v

          for(let i = dv_root_real.length - 1; i >= 0; i--){
            let val = func(dv_root_real[i])
            if(nearZero(val)){
              // 导数为零的点应该不会有 val为零的情况
              roots_obj.real.push(dv_root_real[i])
              fr   = dv_root_real[i] + 0.00001
              fr_v = func(fr)
              if(nearZero(fr_v)){
                fr   = dv_root_real[i] + 0.0001
                fr_v = func(fr)
                if(nearZero(fr_v)){
                  fr   = dv_root_real[i] + 0.001
                  fr_v = func(fr)
                }
              }
              continue
            }

            if(fr == undefined){
              if(val > 0){
                fr   = dv_root_real[i]
                fr_v = val
              }
              else if(val < 0){
                fr             = dv_root_real[i]
                fr_v           = val
                let [to, to_v] = findNagtive(func, fr, fr_v, -1)
                if(!nearZero(to_v)){
                  to = guessRoot(func, fr, fr_v, to, to_v)
                }

                // to 必定是一个根，在fr左侧
                if(to != '无效解'){
                  roots_obj.real.push(to)
                }
              }
            }
            else{
              if(val * fr_v < 0){
                to   = guessRoot(func, fr, fr_v, dv_root_real[i], val)
                fr   = dv_root_real[i]
                fr_v = val
              }
            }

            if(to != '无效解'){
              roots_obj.real.push(to)
            }
          }

          if(fr_v < 0){
            // 最后一个导数的根<0, 其右侧必定又一个根
            let [to, to_v] = findNagtive(func, fr, fr_v, 1)
            if(!nearZero(to_v)){
              to = guessRoot(func, fr, fr_v, to, to_v)
              if(to != '无效解'){
                roots_obj.real.push(to)
              }
            }
          }

          let u = v.slice(), changed = false
          if(roots_obj.real.length != n - 1 && roots_obj.real.length){
            for(let i = 0, l = roots_obj.real.length; i < l; i++){
              u       = M.lowerDimension(roots_obj.real[i], u)
              changed = true
            }
          }

          if(!changed){
            console.log(n, fuzhu, '无实根')
            //偶数次多项式，且无实根，则根为成对复数，
            if(fuzhu != '主线'){
              //非主线，无实根，复数根不用求
              return {
                real: []
              }
            }
            else{
              //通过逼近法求一对复根

              let pass   = false
              let fr     = 0
              let fr_val = v[v.length - 1]
              let to
              let to_val
              if(v[v.length - 3]){
                // 劈因子法中提到，多项式末尾二次因式，是多项式一对最小复根的近似二次因式
                let b          = v[v.length - 2] / v[v.length - 3] / 2
                let c          = v[v.length - 1] / v[v.length - 3]
                roots_obj.imag = newtonComplex(func, func1, v, [b, c])
              }
              else{
                // 第一步：在复空间，原点是正值，寻找一个负值点，再寻找一个更近的正值点
                let k      = 0
                let ang
                let theta0 = Math.pow(Math.abs(v[v.length - 1]), 1 / (n - 1))
                let theta
                while(k < n * 8){
                  // 第一个点是 x^(n-1)+1=0的根
                  k += 1
                  ang    = k * pi / (n - 1)
                  theta  = (0.9 + k / 10) * theta0
                  to     = complex(theta * Math.cos(ang), theta * Math.sin(ang))
                  to_val = func(to)
                  if(to_val == 0 || M.real(to_val) < 0){
                    console.log('扫射算法找到负值点', k, to, to_val)
                    break
                  }
                }

                // 第二步：通过类似二分法，找到近似复根
                if(to_val == 0){
                  to   = [complex(to.r, to.i), complex(to.r, -to.i)]
                  pass = true
                }
                else{
                  //除了偶然发现根之外，必然到达这里
                  to = guessRootComplex(func, fr, fr_val, to, to_val)
                }

                // 第三步，迭代找到极限精度复根
                // 劈因子法（牛顿法的推广）https://www.doc88.com/p-6951840960034.html
                if(pass){
                  roots_obj.imag = to
                }
                else{
                  roots_obj.imag = newtonComplex(func, func1, v, to)
                }

                // 其他方法文献：
                // 一种适合于求实系数多项式近似复根的迭代法 抛物牛顿法 https://www.docin.com/p-772976175.html
                // 同时求解多项式所有重根的两种迭代法 https://www.doc88.com/p-6768991886756.html
                // 两个同时求多项式零点的3阶Newton型迭代法 https://www.doc88.com/p-45629507921656.html?s=rel&id=9
                // 关于同时求解多项式所有二次因子的迭代解法 https://www.computmath.com/jssx/CN/10.12286/jssx.1980.3.229
              }

              // 第四步，二次降维，继续求解
              u = M.lowerDimensionComplex(roots_obj.imag[0], v)
            }
          }

          let left_u      = M.findRoots(u, fuzhu)
          let left_u_real = left_u.real
          let left_u_imag = left_u.imag || []

          if(left_u_real.length){
            // 降维后得到的根，再拿到高维进行微调，以消除累计误差
            left_u_real = optimaMulti(func, left_u_real)

            console.log(n, fuzhu, '找到其他实根', left_u_real)
          }

          if(left_u_imag.length){
            // 降维后得到的根，再拿到高维进行微调，以消除累计误差
            left_u_imag = optimaMultiComplex(func, func1, v, left_u_imag)

            console.log(n, fuzhu, '找到其他复根', left_u_imag)
          }

          // 这一路通过求出导数的所有根，进而一次性求出所有解
          // 如果无实根，则找出复根
          let result = {
            real: roots_obj.real.concat(left_u_real).sort(mysort),
            imag: roots_obj.imag.concat(...(left_u_imag || []))
          }

          console.log(n, fuzhu, result)

          return result
        }
        else if(val_l > 0 && val_r < 0){
          // console.log('[-t, t]间至少有1实根')
          to = guessRoot(func, -t, val_l, t, val_r)
        }
        else if(val_l < 0 && val_r > 0){
          // console.log('[-t, t]间至少有1实根')
          to = guessRoot(func, -t, val_l, t, val_r)
        }
        else if(val_l < 0 && val_r < 0){
          // console.log('[-t, t]间至少有两根(含复根)，两侧有都有实根')

          [to, to_v] = findNagtive(func, t, val_r, 1)
          if(!nearZero(to_v)){
            to = guessRoot(func, t, val_r, to, to_v)
          }
        }
      }
      else{
        //奇数阶
        //左极限 < 0，右极限 > 0
        //必有实根
        let fr   = 0
        let fr_v = v[n - 1]

        if(nearZero(fr_v)){
          to = tr_v
        }
        else{
          [to, to_v] = findNagtive(func, fr, fr_v, fr_v > 0 ? -1 : 1)
          if(!nearZero(to_v)){
            to = guessRoot(func, fr, fr_v, to, to_v)
          }
        }
      }

      if(to == '无效解'){
        console.log(n, fuzhu, '五根')
        return {real: []}
      }

      let u = M.lowerDimension(to, v) //降维之后，误差放大
      // console.log(n, 'lowerDimension', to, u)

      let sub_roots      = M.findRoots(u, fuzhu)
      let sub_roots_real = sub_roots.real

      if(sub_roots_real.length){
        //降维后得到的根，再拿到高维进行微调，以消除累计误差
        sub_roots_real = optimaMulti(func, sub_roots_real)

        console.log(n, fuzhu, '优化实根', sub_roots_real)
        console.log(n, 'func count', func('cnt'))
      }

      let result = {
        real: [to].concat(...sub_roots_real).sort(mysort)
      }

      if(sub_roots.imag){
        result.imag = sub_roots.imag
      }

      console.log(n, fuzhu, result)
      return result
    }
  },
  fzero     : (fun, x0, options) => {
    // 非线性函数的根
    let f = function(x){
      return action(fun, x)
    }

    if(isNda(x0)){
      x0 = x0.data
    }

    let fr
    if(Array.isArray(x0)){
      let fr_v = f(x0[0])
      let to_v = f(x0[1])
      if(fr_v * to_v < 0){
        return guessRoot(f, x0[0], fr_v, x0[1], to_v)
      }

      fr = (x0[0] + x0[1]) / 2
    }
    else{
      fr = x0
    }

    let fr_v          = f(fr)
    let to, to_v, min = fr, max = fr, min_v, max_v
    let k             = 100
    let step          = 0.01
    while(k--){
      to   = x0 + x0 * step
      to_v = f(to)

      console.log(100 - k, to, to_v, step)

      if(nearZero(to_v)){
        // console.log('find a negtive', to)
        return to
      }

      if(to_v * fr_v < 0){
        //to已获得
        break
      }

      if(step > 0){
        max   = to
        max_v = to_v
      }
      else{
        min   = to
        min_v = to_v
      }

      step *= -1.5
    }

    if(step > 0){
      fr    = max
      fr_to = max_v
    }
    else{
      fr    = min
      fr_to = min_v
    }

    let x1 = guessRoot(f, fr, fr_v, to, to_v)

    if(Array.isArray(x0) && (x1 > x[1] || x1 < [0])){
      // return null
    }

    return x1
  },
  nthroot   : (a, b) => { //需要扩充
    let fun = function(a, v){
      if(!a){
        return 0
      }
      else if(a > 0){
        return Math.pow(a, 1 / v)
      }
      else if(a < 0 && (v % 2 == 1 || v % 2 == -1)){
        return -Math.pow(-a, 1 / v)
      }
      else{
        return NaN
      }
    }

    let a_shape
    if(isNda(a)){
      a_shape = a.shape
      a       = a.simple().data
    }
    if(isNda(b)){
      b = b.simple().data
    }

    if(typeof (a) == 'number'){
      if(Array.isArray(b)){
        let c = b.map(v => fun(a, v))

        return ndarray(c)
      }
      else if(typeof (b) == 'number'){
        return fun(a, b)
      }

      return NaN
    }
    else if(Array.isArray(a)){
      if(typeof (b) == 'number'){
        let c = b.map(v => fun(v, b))
        return ndarray(c)
      }

      if(Array.isArray(b)){
        let c = a.map((v, index) => fun(v, b[index]))

        return ndarray(c, a_shape)
      }
    }

    return NaN
  },
  polyvalNum: (p, x) => {
    p = p.data || p
    if(p.fraction){
      x = Math.pow(x, p.fraction)
    }

    let fun = n => {
      let sum = p[0]
      for(let i = 1, l = p.length; i < l; i++){
        sum = M.plus(M.mtimes(sum, n), p[i])
      }
      return sum
    }
    return mixfun(fun, x)
  },
  polyval   : (p, x) => {
    return ndarray(M.polyvalNum(p, x))
  },
  polyvalm  : (p, x) => {
    if(isNda(p)){
      p = p.data
    }

    let l   = p.length
    let sum = M.plus(M.mtimes(p[l - 1], M.eye(l - 1)), M.mtimes(p[l - 2], x))
    for(let i = 0; i < l - 2; i++){
      sum = M.plus(sum, M.mtimes(p[i], M.mpower(x, l - 1 - i)))
    }
    return sum

  },
  polyfit   : (x, y, n) => {
    // 多项式曲线拟合
    // p = polyfit(x,y,n) 返回次数为 n 的多项式 p(x) 的系数，该阶数是 y 中数据的最佳拟合（在最小二乘方式中）。p 中的系数按降幂排列，p 的长度为 n+1
    // [p,S] = polyfit(x,y,n) 还返回一个结构体 S，后者可用作 polyval 的输入来获取误差估计值。
    // [p,S,mu] = polyfit(x,y,n) 还返回 mu，后者是一个二元素向量，包含中心化值和缩放值。mu(1) 是 mean(x)，mu(2) 是 std(x)。使用这些值时，polyfit 将 x 的中心置于零值处并缩放为具有单位标准差
    // 这种中心化和缩放变换可同时改善多项式和拟合算法的数值属性。

    x = x.data || x
    y = y.data || y

    n += 1
    l     = x.length
    let A = ndarray([], [n, n])

    let a = []
    let b = []

    for(let i = 0; i < n + n; i++){
      a[i] = 0
      if(i < n){
        b[i] = 0
      }
      for(let j = 0; j < l; j++){
        let xj = Math.pow(x[j], i)
        a[i] += xj
        if(i < n){
          b[i] += xj * y[j]
        }
      }
    }

    for(let i = 0; i < n; i++){
      for(let j = 0; j < n; j++){
        A.set(i, j, a[i + j])
      }
    }

    let B = ndarray(b, [n, 1])

    // console.log(a, b)
    return M.flipud(M.mldivide(A, B))

  },
  roots     : (arr, fuzhu = '主线') => {
    let result = M.findRoots(arr, fuzhu)
    let r      = result.real
    let i      = result.imag || []
    let ri     = r.concat(...i)
    let root_r = ndarray(r, [r.length, 1])
    let root_i = ndarray(i, [i.length, 1])
    return {
      single : ndarray(ri, [ri.length, 1]),
      multias: [root_r, root_i]
    }
  },
  sym2poly  : f => {
    let a
    if(window[f]){
      a = window[f]
    }
    else if(typeof (f) == 'string'){
      let n = str2obj(f)
      a     = []
      limitDegree(a, n)
      clearArr(a)
    }
    else{
      console.log('todo')
    }

    return ndarray(a)
  },
  syms      : (...arg) => {
    M.SYMS = {}
    arg.forEach(x => {
      window[x] = x
      M.SYMS[x] = x
    })
  }, /*
  solve
  simplify

  */
})
//变换
$.E(M, {
  fft    : (a) => {
    a = a.data || a

    var r    = Math.ceil(Math.log2(a.length))
    var size = 1 << r

    var re_a = new Float64Array(size)
    var im_a = new Float64Array(size)
    for(var i = 0; i < size; i++){
      re_a[i] = a[i] || 0
    }

    var omg = getOmg(size)

    var fft_arr = fft_base(re_a.slice(0), im_a, omg)

    var output = []
    for(var i = 0; i < size; i++){
      output[i] = complex(fft_arr[0][i], fft_arr[1][i])
    }
    return ndarray(output)
  },
  ifft   : (a) => {
    a = a.data || a

    var r    = Math.ceil(Math.log2(a.length))
    var size = 1 << r

    var re_a = new Float64Array(size)
    var im_a = new Float64Array(size)
    for(var i = 0; i < size; i++){
      if(isComplex(a[i])){
        re_a[i] = a[i].r
        im_a[i] = a[i].i
      }
      else{
        re_a[i] = a[i] || 0
        im_a[i] = 0
      }

    }
    console.log(a)
    console.log(re_a)
    console.log(im_a)

    var omg = getOmg(size)

    var ifft_arr = fft_base(re_a, im_a, omg, -1)
    var output   = []
    for(var i = 0; i < size; i++){
      output[i] = ifft_arr[i]
    }

    return ndarray(output)
  },
  laplace: () => {
    // laplace(f) returns the Laplace Transform of f. By default, the independent variable is t and the transformation variable is s.
    // laplace(f,transVar) uses the transformation variable transVar instead of s.
    // laplace(f,var,transVar) uses the independent variable var and the transformation variable transVar instead of t and s, respectively.

    // syms x y
    // f = 1/sqrt(x);
    // laplace(f)
    // ans =
    //   pi^(1/2)/s^(1/2)

    // syms a t
    // f = exp(-a*t);
    // laplace(f)
    // ans =
    //   1/(a + s)
  }, /*
  laplace
  ilaplace
  fourier
  ifourier
  */
})
//三角函数
$.E(M, {
  // 常用三角函数公式
  // https://wenku.baidu.com/link?url=WCV1ZboOraYou7UWQtTKrHYCENCUUwKprjpAhwIMobmrjirlSOqFjLvQ5f3SXhkO8wGk17yCZpfuOxc0FoThxTMsxzpPQMdNgoJodS1942fu8vGxe3bfVzL_vGGWsi54
  acosd : a => {
    return angle2degree(action('acos', a))
  },
  acot  : a => {
    return mixfun(n => Math.atan(1 / n), a)
  },
  acotd : a => {
    return angle2degree(M.acot(a))
  },
  acoth : a => {
    return mixfun(n => Math.atanh(1 / n), a)
  },
  acsc  : a => {
    return mixfun(n => Math.asin(1 / n), a)
  },
  acscd : a => {
    return angle2degree(M.acsc(a))
  },
  acsch : a => {
    return mixfun(n => Math.asinh(1 / n), a)
  },
  asind : a => {
    return angle2degree(action('asin', a))
  },
  asec  : a => {
    return mixfun(n => Math.acos(1 / n), a)
  },
  asecd : a => {
    return angle2degree(M.asec(a))
  },
  asech : a => {
    return mixfun(n => Math.acosh(1 / n), a)
  },
  atan2d: a => {
    return angle2degree(action('atan2', a))
  },
  atand : a => {
    return angle2degree(action('atan', a))
  },
  cosd  : a => {
    return action('cos', degree2angle(a))
  },
  cot   : a => {
    return mixfun(n => 1 / Math.tan(n), a)
  },
  cotd  : a => {
    a = degree2angle(a)
    return M.cot(a)
  },
  coth  : a => {
    return mixfun(n => 1 / Math.tanh(n), a)
  },
  csc   : a => {
    return mixfun(n => 1 / Math.sin(n), a)
  },
  cscd  : a => {
    a = degree2angle(a)
    return M.csc(a)
  },
  csch  : a => {
    return mixfun(n => 1 / Math.sinh(n), a)
  },
  sec   : a => {
    return mixfun(n => 1 / Math.cos(n), a)
  },
  secd  : a => {
    a = degree2angle(a)
    return M.sec(a)
  },
  sech  : a => {
    return mixfun(n => 1 / Math.cosh(n), a)
  },
  sind  : a => {
    return action('sin', degree2angle(a))
  },
  tand  : a => {
    return action('tan', degree2angle(a))
  },
})
//基本函数
$.E(M, {
  abs       : a => {
    return mixfun(n => {
      if(isComplex(n)){
        return n.mag()
      }
      return Math.abs(n)
    }, a)
  },
  cross     : () => {    //todo
  },
  cumprod   : (a, ...argu) => {
    let b = ndarray([], a.shape)

    let dim       = argu.indexOf(2) >= 0 ? 2 : 1
    let direction = argu.indexOf('reverse') >= 0 ? 'reverse' : 'forward'
    let nanflag   = argu.indexOf('omitnan') >= 0 ? 'omitnan' : 'includenan'

    let nanfunc = a => isNaN(a) ? (nanflag == 'omitnan' ? 1 : NaN) : +a
    let v
    if(direction == 'forward'){
      if(dim == 2 || a.shape[0] == 1){
        for(let row = 0; row < a.shape[0]; row++){
          for(let col = 0; col < a.shape[1]; col++){
            v = nanfunc(a.get(row, col))
            if(col == 0){
              b.set(row, col, v)
            }
            else{
              b.set0(row, col, v * b.get(row, col - 1))
            }
          }
        }
      }
      else{
        for(let col = 0; col < a.shape[1]; col++){
          for(let row = 0; row < a.shape[0]; row++){
            v = nanfunc(a.get(row, col))
            if(row == 0){
              b.set(row, col, v)
            }
            else{
              b.set0(row, col, v * b.get(row - 1, col))
            }
          }
        }
      }
    }
    else{
      if(dim == 2 || a.shape[0] == 1){
        for(let row = 0; row < a.shape[0]; row++){
          for(let col = 0; col < a.shape[1]; col++){
            let col2 = a.shape[1] - 1 - col
            v        = nanfunc(a.get(row, col2))
            if(col == 0){
              b.set(row, col2, v)
            }
            else{
              b.set0(row, col2, v * b.get(row, col2 + 1))
            }
          }
        }
      }
      else{
        for(let col = 0; col < a.shape[1]; col++){
          for(let row = 0; row < a.shape[0]; row++){
            let row2 = a.shape[0] - 1 - row
            v        = nanfunc(a.get(row2, col))
            if(row == 0){
              b.set(row2, col, v)
            }
            else{
              b.set0(row2, col, v * b.get(row2 + 1, col))
            }
          }
        }
      }
    }

    return b
  },
  cumsum    : (a, ...argu) => {
    let b = ndarray([], a.shape)

    let dim       = argu.indexOf(2) >= 0 ? 2 : 1
    let direction = argu.indexOf('reverse') >= 0 ? 'reverse' : 'forward'
    let nanflag   = argu.indexOf('omitnan') >= 0 ? 'omitnan' : 'includenan'

    let nanfunc = a => isNaN(a) ? (nanflag == 'omitnan' ? 0 : NaN) : +a
    let v
    if(direction == 'forward'){

      if(dim == 2 || a.shape[0] == 1){
        for(let row = 0; row < a.shape[0]; row++){
          for(let col = 0; col < a.shape[1]; col++){
            v = nanfunc(a.get(row, col))
            if(col == 0){
              b.set(row, col, v)
            }
            else{
              b.set0(row, col, v + b.get(row, col - 1))
            }
          }
        }
      }
      else{
        for(let col = 0; col < a.shape[1]; col++){
          for(let row = 0; row < a.shape[0]; row++){
            v = nanfunc(a.get(row, col))
            if(row == 0){
              b.set(row, col, v)
            }
            else{
              b.set0(row, col, v + b.get(row - 1, col))
            }
          }
        }
      }
    }
    else{
      if(dim == 2 || a.shape[0] == 1){
        for(let row = 0; row < a.shape[0]; row++){
          for(let col = 0; col < a.shape[1]; col++){
            let col2 = a.shape[1] - 1 - col
            v        = nanfunc(a.get(row, col2))
            if(col == 0){
              b.set(row, col2, v)
            }
            else{
              b.set0(row, col2, v + b.get(row, col2 + 1))
            }
          }
        }
      }
      else{
        for(let col = 0; col < a.shape[1]; col++){
          for(let row = 0; row < a.shape[0]; row++){
            let row2 = a.shape[0] - 1 - row
            v        = nanfunc(a.get(row2, col))
            if(row == 0){
              b.set(row2, col, v)
            }
            else{
              b.set0(row2, col, v + b.get(row2 + 1, col))
            }
          }
        }
      }
    }

    return b
  },
  datestr   : t => {  //todo

  },
  dot       : (a, b, c) => {
    let total = 0
    if(Array.isArray(a) && Array.isArray(b) && a.length == b.length){
      a.forEach((n, index) => total += n * b[index])
      return total
    }

    if(c == undefined){
      if(sameSize(a, b) && a.dimension == 2){
        if(a.shape[0] > 1){
          return dotRow(a, b)
        }
        else{
          return dotCol(a, b)
        }
      }
    }
    else if(c == 1){
      return dotRow(a, b)
    }
    else if(c == 2){
      return dotCol(a, b)
    }
  },
  factorial : a => {
    function factorial(n){
      if(n % 1 != 0 || n < 0){
        return NaN
      }
      if(n <= 1){
        return 1
      }
      else{
        return n * factorial(n - 1);
      }
    }

    return mixfun(factorial, a)
  },
  fix       : a => {
    return mixfun(n => (n > 0 ? Math.floor(n) : n < 0 ? Math.ceil(n) : 0), a)
  },
  ldivide   : (a, b) => {
    return M.rdivide(b, a)
  },
  max       : (a, a1 = [], ...argu) => {
    let dim           = argu.indexOf(2) > -1 ? 2 : 1
    let all           = argu.indexOf('all') > -1 ? 'all' : 0
    let nanflag       = argu.indexOf('includenan') > -1 ? 'includenan' : 'omitnan'
    let linear        = argu.indexOf('linear') > -1 ? 'linear' : 0
    let f             = arr => {
      let item, v
      for(let i = 0, l = arr.length; i < l; i++){
        item = arr[i]
        if(isNaN(item)){
          if(nanflag == 'includenan'){
            return NaN
          }
          continue
        }

        if(v == undefined){
          v = item
        }
        else{
          v = Math.max(v, item)
        }
      }
      return v ?? NaN
    }
    let self          = M.max
    let maxmin_result = M.maxmin(f, self, a, a1, dim, all, nanflag, linear)
    if(Array.isArray(maxmin_result)){
      return {
        single : maxmin_result[0],
        multias: maxmin_result
      }
    }
    else{
      return maxmin_result
    }
  },
  maxmin    : (f, self, a, a1, dim, all, nanflag, linear) => {
    let b
    a1 = a1.data || a1

    if(isNda(a)){
      b = a.simple()
      if(all){
        let v = f(b.data)
        let i = b.data.indexOf(v)

        return [v, i]
      }

      let c, d

      if(a1.length == 0){
        //单行/单列/1维的，直接取最大值
        if(b.dimension == 1 || b.shape[0] == 1 || b.shape[1] == 1){
          let v = b.data[0], index = 0
          for(let i = b.data.length - 1; i > 0; i--){
            v = f([b.data[i], v])
            if(v == b.data[i]){
              index = UNINDEX(i)
            }
          }
          return [v, index]
        }

        if(dim == 2){
          //行取最大值
          c = ndarray([], [b.shape[0], 1])
          d = ndarray([], [b.shape[0], 1])
          let v, index
          for(let i = 0; i < c.shape[0]; i++){
            let result = self(b.pick(i, ':'));
            [v, index] = result.multias
            c.set(i, 0, v)
            d.set(i, 0, index)
          }
        }
        else{
          //列取最大值
          c = ndarray([], [1, b.shape[1]])
          d = ndarray([], [1, b.shape[1]])
          let v, index
          for(let i = 0; i < c.shape[1]; i++){
            let result = self(b.pick(':', i));
            [v, index] = result.multias
            c.set(0, i, v)
            d.set(0, i, index)
          }
        }

        return [c, d]
      }
      else if(typeof a1 == 'number'){
        c      = b.clone()
        c.data = c.data.map(item => {
          let v = f([item, a1])
          // console.log(item, a1, v)
          return v
        })
        return c
      }
      else if(isNda(a1) && a1.shape[0] == a.shape[0] && a1.shape[1] == a.shape[1]){
        c      = b.clone()
        d      = a1.clone()
        c.data = c.data.map((item, index) => f([item, d.data[index]]))
        return c
      }

    }
    else if(Array.isArray(a)){
      b = f(a)
    }
    else{
      b = a
    }
    return b
  },
  min       : (a, a1 = [], ...argu) => {
    let dim           = argu.indexOf(2) > -1 ? 2 : 1
    let all           = argu.indexOf('all') > -1 ? 'all' : 0
    let nanflag       = argu.indexOf('includenan') > -1 ? 'includenan' : 'omitnan'
    let linear        = argu.indexOf('linear') > -1 ? 'linear' : 0
    let f             = arr => {
      let item, v
      for(let i = 0, l = arr.length; i < l; i++){
        item = arr[i]
        if(isNaN(item)){
          if(nanflag == 'includenan'){
            return NaN
          }
          continue
        }

        if(v == undefined){
          v = item
        }
        else{
          v = Math.min(v, item)
        }
      }
      return v
    }
    let self          = M.min
    let maxmin_result = M.maxmin(f, self, a, a1, dim, all, nanflag, linear)
    if(Array.isArray(maxmin_result)){
      return {
        single : maxmin_result[0],
        multias: maxmin_result
      }
    }
    else{
      return maxmin_result
    }
  },
  minus     : (a, b) => {
    return mix2fun(a, b, (a, b) => {
      let _ta = type(a)
      let _tb = type(b)
      if(_ta === 'complex' && _tb === 'normal'){
        a.r -= b
        return a
      }
      else if(_ta === 'normal' && _tb === 'complex'){
        b.r = a - b.r
        b.i = -b.i
        return b
      }
      else if(_ta === 'complex' && _tb === 'complex'){
        return a.minus(b)
      }
      else if(_tb === 'array'){
        return vecAdd(a, vecMul(-1, b))
      }
      else if(_ta === 'array'){
        if(_tb == 'string'){
          b == [-1, 0]
          return vecAdd(a, b)
        }
        return vecAdd(a, -b)
      }
      return a - b
    })
  },
  mldivide  : (a, b) => {
    //求解关于 x 的线性方程组 ax = b,  x = a\b
    a       = format(a)
    b       = format(b)
    let _ta = type(a)
    let _tb = type(b)
    if(_ta == 'ndarray' && _tb == 'normal'){
      return a.div(b)
    }
    else if(_ta == 'ndarray' && _tb == 'ndarray'){
      return M.gauss(a, b)
    }
    else if(_ta == 'normal' && _tb == 'normal'){
      return a / b
    }
    else if(_ta === 'complex' && _tb === 'normal'){

      return complex(a.r / b, a.i / b)
    }
    else if(_ta === 'normal' && _tb === 'complex'){
      // return (new Complex(a, 0)).div(b)
      var c = a / b.mag()
      return b.conj().mul(c)
    }
    else if(_ta === 'complex' && _tb === 'complex'){
      return a.div(b)
    }
    else{
      log('mul type err', a, _ta, b, _tb)
    }
  },
  mod       : (a, b) => {
    return mixfun(n => n % b, a)
  },
  mpower    : (a, b) => {
    // todo
    if(isNda(a) && !isNaN(b) && b % 1 == 0){
      let c = M.mtimes(a, a)
      for(let i = b - 3; i >= 0; i--){
        c = M.mtimes(c, a)
      }
      return c
    }
    else if(isNda(b) && !isNaN(a)){
      let [v, d] = eig(b)
      return M.mrdivide(M.mtimes(v, M.power(2, d)), v)
    }
    else if(typeof a == 'number' && typeof b == 'number'){
      return keepZero(Math.pow(a, b))
    }
    else if(typeof a == 'string' && typeof b == 'number'){
      let arr = [1]
      for(var i = 1; i < b + 1; i++){
        arr[i] = 0
      }

      return arr
      // return a+'^'+b
    }
  },
  mrdivide  : (a, b) => {
    // 求解关于 x 的线性方程组 xb = a,  x = a/b
    // 运算符 / 和 \ 通过以下对应关系而相互关联：B/A = (A'\B')'。
    // 如果 A 是方阵，则 A\B 约等于 inv(A)*B
    // x = a/b
    // x = mrdivide(a,b)
    a       = format(a)
    b       = format(b)
    let _ta = type(a)
    let _tb = type(b)
    if(_ta == 'ndarray' && _tb == 'ndarray'){
      return M.mtimes(a, M.inv(b))
      // return M.mldivide(b, a)
    }

    return M.mldivide(a, b)
  },
  mtimes    : (a, ...arg) => {
    a       = format(a)
    let b   = format(arg[0])
    let _ta = type(a)
    let _tb = type(b)
    let result
    if(_ta == 'ndarray' && _tb == 'normal'){
      result = a.mul(b)
    }
    else if(_ta == 'normal' && _tb == 'ndarray'){
      result = b.mul(a)
    }
    else if(_ta == 'normal' && _tb == 'normal'){
      result = a * b
    }
    else if(_ta == 'ndarray' && _tb == 'ndarray'){
      //矩阵乘法。 C = A * B是矩阵A和B的线性代数乘积。对于非标量A和B，A的列数必须等于B的行数。标量可以乘以任何大小的矩阵
      // todo
      if(a.shape[1] != b.shape[0]){
        console.log('error A的列数必须等于B的行数', a.shape[1], b.shape[0])
        return
      }
      else{
        let c = ndarray([], [a.shape[0], b.shape[1]])
        c.fill((i, j) => {
          let d = 0
          for(let k = b.shape[0] - 1; k >= 0; k--){
            // d += a.get(i, k) * b.get(k, j)
            d = d.add(a.get(i, k).mul(b.get(k, j)))
          }
          return d
        })
        result = c
      }
    }
    else if(_ta === 'complex' && _tb === 'normal'){
      result = complex(a.r * b, a.i * b)
    }
    else if(_ta === 'normal' && _tb === 'complex'){
      result = complex(b.r * a, b.i * a)
    }
    else if(_ta === 'complex' && _tb === 'complex'){
      result = a.mul(b)
    }
    else if(_ta === 'array' || _tb === 'array'){
      result = vecMul(a, b)
    }
    else if(_ta === 'normal' || _tb === 'string'){
      // 3*x
      result = [a, 0]
    }
    else if(_tb === 'normal' || _ta === 'string'){
      // 3*x
      result = [b, 0]
    }
    else{
      log('mul type err', a, b)
    }

    if(arg.length == 1){
      return result
    }

    return M.mtimes(result, ...arg.slice(1))
  },
  multif    : (a, b) => {
    a       = format(a)
    b       = format(b)
    let _ta = type(a)
    let _tb = type(b)
    if(_ta == 'ndarray' && _tb == 'normal'){
      return a.mul(b)
    }
    if(_ta == 'normal' && _tb == 'ndarray'){
      return b.mul(a)
    }
    else if(_ta == 'normal' && _tb == 'normal'){
      return a * b
    }
    else if(_ta == 'ndarray' && _tb == 'ndarray'){
      //矩阵乘法。 C = A * B是矩阵A和B的线性代数乘积。对于非标量A和B，A的列数必须等于B的行数。标量可以乘以任何大小的矩阵
      // todo
      if(a.shape[1] != b.shape[0]){
        console.log('error A的列数必须等于B的行数', a.shape[1], b.shape[0])
      }
      else{
        let c = ndarray([], [a.shape[0], b.shape[1]])
        c.fill((i, j) => {
          let d = 0
          for(let k = b.shape[0] - 1; k >= 0; k--){
            d = d.add(a.get(i, k).mul(b.get(k, j)))
          }
          return d
        })

        return c
      }
    }
    else if(_ta === 'complex' && _tb === 'normal'){
      return complex(a.r * b, a.i * b)
    }
    else if(_ta === 'normal' && _tb === 'complex'){
      return complex(b.r * a, b.i * a)
    }
    else if(_ta === 'complex' && _tb === 'complex'){
      return a.mul(b)
    }
    else{
      log('mul type err', a, b)
    }
  },
  plus      : (a, b) => {
    return mix2fun(a, b, (a, b) => {
      let _ta = type(a)
      let _tb = type(b)
      if(_ta === 'complex' && _tb === 'normal'){
        return complex(a.r + b, a.i)
      }
      else if(_ta === 'normal' && _tb === 'complex'){
        return complex(b.r + a, b.i)
      }
      else if(_ta === 'complex' && _tb === 'complex'){
        return a.add(b)
      }
      else if(_ta === 'array' || _tb === 'array'){
        if(_tb == 'string'){
          b = [1, 0]
        }
        return vecAdd(a, b)
      }
      return a + b
    })
  },
  pow       : (a, p) => {
    let f = (function(p){
      return function(n){
        return Math.pow(n, p)
      }
    })(p)
    let b
    if(isNda(a)){
      b = []
      for(i = 0; i < a.shape[1]; i++){
        b.push(a.pick(':', i).simple().data.map(f))
      }
    }
    else if(Array.isArray(a)){
      b = a.map(f)
    }
    else{
      b = f(a)
    }
    return b
  },
  power     : (a, n) => {
    let b = M.times(a, a)
    for(let i = n - 3; i >= 0; i--){
      b = M.times(b, a)
    }
    return b
  },
  prod      : (a, b) => {
    let fun = arr => {
      let sum = 1
      arr.forEach(a => sum *= a)
      return sum
    }

    return mix3func(fun, a, b)
  },
  rand      : (...arg) => {
    if(arg.length == 0){
      return Math.random()
    }
    if(arg.length == 1){
      if(isNda(arg[0])){
        var a = ndarray([], arg[0].data)
        return a.fill(_ => Math.random())
      }
      else if(Array.isArray(arg[0])){
        var a = ndarray([], arg[0])
        return a.fill(_ => Math.random())
      }
      else if(!isNaN(arg[0]) && !isNaN(arg[0] | 0)){
        var a = ndarray([], [arg[0] | 0, arg[0] | 0])
        return a.fill(_ => Math.random())
      }
    }
    else{
      //输入未校验
      var a = ndarray([], arg)
      return a.fill(_ => Math.random())
    }
  },
  randn     : (imax, ...arg) => {
    //正态分布
    console.log(imax, arg)
    let min = 1, max
    if(Array.isArray(imax)){
      [min, max] = imax
    }
    else{
      max = imax
    }

    if(arg.length == 0){
      return Math.floor(Math.random() * (max - min)) + min
    }

    let shape
    if(arg.length == 1){
      if(Array.isArray(arg[0])){
        shape = arg[0]
      }
      else if(!isNaN(arg[0]) && !isNaN(arg[0] | 0)){
        shape = [arg[0] | 0, arg[0] | 0]
      }
    }
    else{
      shape = arg
    }

    return ndarray([], shape).fill(_ => Math.floor(Math.random() * (max - min)) + min)
  },
  randi     : (imax, ...arg) => {
    //均匀分布
    let f = _ => {
      let v = Math.random()
      return (v > 0.5 ? Math.ceil : Math.floor)(v * (max - min)) + min
    }

    let min = 1, max
    if(isNda(imax)){
      imax = imax.data
    }
    if(Array.isArray(imax)){
      [min, max] = imax
    }
    else{
      max = imax
    }

    if(arg.length == 0){
      return f()
    }

    let shape
    if(arg.length == 1){
      if(Array.isArray(arg[0])){
        shape = arg[0]
      }
      else if(!isNaN(arg[0]) && !isNaN(arg[0] | 0)){
        shape = [arg[0] | 0, arg[0] | 0]
      }
    }
    else{
      shape = arg
    }

    return ndarray([], shape).fill(_ => f())
  },
  rem       : (a, b) => { //todo
    return mix2fun((n, m) => n - M.fix(n / m) * m, a)
  },
  rdivide   : (a, b) => {
    return mix2fun(a, b, (a, b) => {
      let _ta = type(a)
      let _tb = type(b)
      if(_ta === 'complex' && _tb === 'normal'){
        a.r /= b
        a.i /= b
        return a
      }
      else if(_ta === 'normal' && _tb === 'complex'){
        b.r = a / b.r
        b.i = a / b.i
        return b
      }
      else if(_ta === 'complex' && _tb === 'complex'){
        return a.div(b)
      }

      return a / b
    })
  },
  sign      : a => {
    if(isComplex(a)){
      return a.div(a.mag())
    }

    return mixfun(Math.sign, a)
  },
  sqrt      : a => {
    if(a < 0){
      return complex(0, Math.sqrt(-a))
    }

    let fun = function(a){
      if(isComplex(a)){
        let p = Math.sqrt(a.mag())
        let q = M.angle(a) / 2
        return complex(p * Math.cos(q), p * Math.sin(q))
      }
      return Math.sqrt(a)
    }
    return mixfun(fun, a)
  },
  strlength : a => {
    let b = a.clone()
    b.data.forEach((_, index) => {
      b.data[index] = ('' + _).length
    })
    return b
  },
  sum       : (a, b) => {
    let fun = function(arr){
      let sum = 0
      arr.forEach(a => sum += a)
      return sum
    }

    return mix3func(fun, a, b)
  },
  times     : (a, b) => {
    return mix2fun(a, b, (a, b) => {
      let _ta = type(a)
      let _tb = type(b)
      if(_ta === 'complex' && _tb === 'normal'){
        return complex(a.r * b, a.i * b)
      }
      else if(_ta === 'normal' && _tb === 'complex'){
        return complex(b.r * a, b.i * a)
      }
      else if(_ta === 'complex' && _tb === 'complex'){
        return a.mul(b)
      }

      return a * b
    })
  },
  uplus     : a => {
    return a
  },
  uminus    : a => {
    return M.mtimes(a, -1)
  },
  vecProduct: (a, b) => { //和dot很接近
    if(b == undefined){
      b = a
    }
    let sum = 0
    for(let i = a.shape[0] - 1; i >= 0; i--){
      sum += a.get(i, 0) * b.get(i, 0)
    }
    return keepZero(sum)
  },
})
//矩阵基础
$.E(M, {
  eye     : (n, m) => {
    m = m || n
    if(Array.isArray(n)){
      [n, m] = n
    }
    var a = ndarray([], [n, m])

    return a.fill((i, j) => i == j ? 1 : 0)
  },
  eyenum  : (n, m, num = 1) => {
    m = m || n
    if(Array.isArray(n)){
      [n, m] = n
    }
    var a = ndarray([], [n, m])

    return a.fill((i, j) => i == j ? num : 0)
  },
  isSquare: a => {
    return isNda(a) && a.dimension == 2 && a.shape[0] == a.shape[1]
  },
  linear  : (a, b, c) => {
    return ndarray(linear(a, b, c))
  },
  linspace: (a, b, c = 100) => {
    a        = +a
    let arr  = []
    let step = (b - a) / (c - 1)
    for(let i = 0; i < c; i++){
      arr.push(a + step * i)
    }

    return ndarray(arr)
  },
  logspace: (a, b, c = 50) => {
    let arr  = []
    let step = (b - a) / (c - 1)
    for(let i = 0; i < c; i++){
      arr.push(Math.pow(10, a + step * i))
    }

    return ndarray(arr)
  },
  meshgrid: (x, y, z) => {
    y = y || x
    z = z || x

    if(isNda(x)){
      x = x.simple().data
    }
    if(!Array.isArray(x)){
      console.error('meshgrid x must be matrix or array')
    }

    if(isNda(y)){
      y = y.simple().data
    }
    if(!Array.isArray(y)){
      console.error('meshgrid y must be matrix or array')
    }

    if(isNda(z)){
      z = z.simple().data
    }
    if(!Array.isArray(z)){
      console.error('meshgrid z must be matrix or array')
    }

    let X0 = ndarray(x, [x.length, 1])
    let Y0 = ndarray(y, [1, y.length])
    let Z0 = ndarray(z, [1, z.length])

    let X = X0.simple()
    let Y = Y0.simple()
    let Z = Z0.simple()
    for(let i = 1, l = y.length; i < l; i++){
      X = M.concatenate(X, X0)
    }

    for(let i = 1, l = x.length; i < l; i++){
      Y = M.concatenateV(Y, Y0)
    }

    for(let i = 1, l = x.length; i < l; i++){
      Z = M.concatenateV(Z, Z0)
    }
    return ['', [X, Y, Z]]
  },
  ones    : (m, n) => {
    return ndarray([], [m, n || m]).assignseq(1)
  },
  trace   : a => {
    if(!M.isSquare(a)){
      console.log('方阵才有trace')
      return
    }

    let sum = 0
    for(let i = a.shape[0] - 1; i >= 0; i--){
      sum += a.get(i, i)
    }

    return keepZero(sum, 10)
  },
  zeros   : (m, n) => {
    return ndarray([], [m, n || m]).assignseq(0)
  },
})
//集合操作
$.E(M, {
  intersect   : (a, b, row) => {
    // 设置两个数组的交集；返回A和B所共有的值。返回的值按排序顺序排列。
    // row: 将A和B的每一行作为单个实体处理，并返回A和B的公共行。返回的矩阵的行按排序顺序排列。
  },
  ismember    : (a, b, row) => {
    // 返回与A大小相同的数组，包含1（true），其中A的元素在其他地方的B中找到，它返回0（false）。
    // row: 将A和B的每一行作为单个实体处理，并返回一个包含1（true）的向量，其中矩阵A的行也是B的行；否则，它返回0（false）。

  },
  issorted_del: (a, row) => {
    // 如果A的元素按排序顺序返回逻辑1（true），否则返回逻辑0（false）。输入A可以是向量，也可以是N-by-1或1-by-N的字符串数组。如果A和sort（A）的输出相等，则A被认为是排序的。
    // 如果二维矩阵A的行按排序顺序返回逻辑1（真），否则返回逻辑0（假）。 如果A和排序（A）的输出相等，则认为矩阵A被排序。
  },
  setdiff     : (a, b, row) => {
    // 设置两个数组的差值；返回不在B中的值。返回数组中的值按排序顺序排列。
    // row: 将每一行A和B行作为单个实体处理，并返回一个不在B中的行。返回的矩阵的行按排序顺序排列。
    // “行”选项不支持单元格数组。
  },
  setxor      : _ => {
    //设置两个数组的异或
  },
  union       : (a, b) => {
    a      = a.clone()
    b      = b.clone()
    let c  = {}
    let un = []
    let ia = []
    let ib = []
    a.data.forEach((item, index) => {
      if(!c[item]){
        c[item] = 1
        un.push([item, 'a', UNINDEX(index)])
      }
    })
    b.data.forEach((item, index) => {
      if(!c[item]){
        c[item] = 1
        un.push([item, 'b', UNINDEX(index)])
      }
    })

    un.sort((item1, item2) => item1[0] > item2[0] ? 1 : -1)
    un = un.map(item => {
      if(item[1] == 'a'){
        ia.push(item[2])
      }
      else{
        ib.push(item[2])
      }
      return item[0]
    })

    return {
      single : ndarray(un),
      multias: [ndarray(un), ndarray(ia, [ia.length, 1]), ndarray(ib, [ib.length, 1])]
    }
  },
  unique      : _ => {
    //数组中唯一的值
  },
})
//复数
$.E(M, {
  real  : a => {
    return mixfun(n => {
      if(isComplex(n)){
        return n.r
      }
      return n
    }, a)
  },
  imag  : a => {
    //
    // function imag(n = 1){
    //   return new Complex(0, n)
    // }
    //
    //
    return mixfun(n => {
      if(isComplex(n)){
        return n.i
      }
      return 0
    }, a)
  },
  angle : a => {
    return mixfun(n => {
      if(isComplex(n)){
        return Math.atan2(n.i, n.r)
      }
    }, a)
  },
  mag   : a => {
    return mixfun(n => {
      if(isComplex(n)){
        return n.mag()
      }
    }, a)
  },
  conj  : a => {
    return mixfun(n => {
      if(isComplex(n)){
        return n.conj()
      }
    }, a)
  },
  isreal: a => {
    return mixfun(n => {
      if(isComplex(n)){
        return true
      }
    }, a)
  },
})
//逻辑
$.E(M, {
  any      : (a, b) => {
    let fun = arr => {
      for(let i = 0, l = arr.length; i < l; i++){
        if(arr[i]){
          return 1
        }
      }
      return 0
    }

    return mix3func(fun, a, b)
  },
  all      : (a, b) => {
    let fun = arr => {
      for(let i = 0, l = arr.length; i < l; i++){
        if(!arr[i]){
          return 0
        }
      }
      return 1
    }

    return mix3func(fun, a, b)
  },
  and      : _ => {
  }, //todo
  not      : _ => {
  },
  or       : _ => {
  },
  xor      : _ => {
  },
  'false'  : _ => {
  },
  find     : _ => {
  },
  islogical: _ => {
  },
  logical  : _ => {
  },
  'true'   : _ => {
  },
})
//关系
$.E(M, { //todo
  cn      : (a, b, c) => {
    let fun = function(n){
      switch(b){
        case '==':
          if(isComplex(a) && isComplex(c)){
            return a.i == c.i && a.r == c.r
          }
          return n == c || myNaN(a) && myNaN(c) ? 1 : 0
        case '>':
          return n > c ? 1 : 0
        case '<':
          return n < c ? 1 : 0
        case '>=':
          return n >= c ? 1 : 0
        case '<=':
          return n <= c ? 1 : 0
        case '~=':
        case '!=':
          return n != c ? 1 : 0
      }
    }

    if(a && a.name){
      a.arg = [a.name, b, c]
    }
    return mixfun(fun, a)
  },
  eq      : (a, b) => {//	测试a是否等于b
  },
  ge      : (a, b) => {//	测试是否大于或等于B
  },
  gt      : (a, b) => {//	测试a是否大于b
  },
  le      : (a, b) => {//	测试a是否小于或等于b
  },
  lt      : (a, b) => {//	测试a是否小于b
  },
  ne      : (a, b) => {//	测试a是否不等于b
  },
  isequal : (a, b) => {//		测试数组以获得相等性
  },
  isequaln: (a, b) => {//		测试数组相等，将NaN值视为相等
  },
})
//显示
$.E(M, {
  disp      : a => {
    addToTableOut('disp', a)
  },
  mathjaxInf: (s) => {
    if(s == Infinity){
      return `$ \\infty $`
    }
    else if(s == -Infinity){
      return `$ -\\infty $`
    }

    return s
  },
  mathjaxLim: (s, a, ng = '') => {
    let ss = analysis(s)

    // let mathjax_code = trans2MathJax(ss)
    // mathjax_code     = '$' + mathjax_code + '$'
    // console.log(mathjax_code)

    let math_obj = trans2MathObj(ss)
    // console.log(math_obj)
    let code     = '$\\lim \\limits_{x \\to '
    if(/\//.test(a)){
      let f_arr = a.split('/')
      code += `\\frac{${f_arr[0] == 'pi' ? '\\pi' : f_arr[0]}}${f_arr[1]}`
    }
    else if(isFinite(a)){
      code += a
    }
    else if(a == Infinity){
      code += ' \\infty'
    }
    else if(a == -Infinity){
      code += ' -\\infty'
    }

    code += '}'
    code += ng
    code += obj2mathjax(math_obj)
    code += '$'
    // console.log(code)

    return code
  },
  mathjax   : (s, ng = '') => {
    // https://www.mathjax.org/#demo
    // https://en.wikibooks.org/wiki/LaTeX/Mathematics?utm_source=ld246.com
    // MathJax常用符号
    // https://blog.csdn.net/xuejianbest/article/details/80391999?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.pc_relevant_default&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.pc_relevant_default&utm_relevant_index=1
    // 微积分常用符号
    // https://www.cnblogs.com/xuejianbest/p/10285243.html
    let ss = analysis(s)

    // let mathjax_code = trans2MathJax(ss)
    // mathjax_code     = '$' + mathjax_code + '$'
    // console.log(mathjax_code)

    let math_obj = trans2MathObj(ss)
    // console.log(math_obj)
    let code     = '$' + ng + obj2mathjax(math_obj) + '$'
    // console.log(code)

    return code
    /*
    // s是多项式的数组形式
    let output = ''

    let fx = (c, n) => {
      let x = n == 0 ? '' : n == 1 ? 'x' : 'x^{' + n + '}'
      if(c == 0){
        x = ''
      }
      else if(c == 1 && n == 0){
        x = c
      }
      else if(c != 1){
        x = c + x
      }

      x = c > 0 ? '+' + x : x

      return x
    }

    if(isNda(s)){
      let l = s.data.length
      s.data.forEach((n, i) => {
        if(n){
          output += fx(n, l - i - 1)
        }
      })
      output = output.slice(1)
    }

    output = '$' + output + '$'

    console.log(output)
    addToTableOut('mathjax', output)
     */
  },
  plot      : (...args) => {
    focusPage(page_names[2])
    plot.apply(this, args)
    // if(typeof (z) == 'undefined'){
    //   plot(x.data || x, y.data || y)
    // }
    // else{
    //   plot3(x.data || x, y.data || y, z.data || z)
    // }
  },
  printline : (a, b) => {
    addToTableOut(b?.name ?? a, b)
  },
  surf      : (x, y, z) => {
    focusPage(page_names[3])
    plotsurf(x.data || x, y.data || y, z.data || z)
  },
  setFixNum : n => {
    M.FIXNUM = Math.max(0, Math.min(15, isNaN(n) ? 4 : n | 0))
    return n
  },
  title     : a => {
    title(a)
  },
  xlabel    : a => {
    xlabel(a)
  },
  ylabel    : a => {
    ylabel(a)
  },
})
//位运算
$.E(M, {
  bitand   : (a, b) => {
    //当a、b是一个或数个无符号整数或无符号整数数组，返回参数a和b位和，
  },
  bitcmp   : (a) => {
    // a的补码
  },
  bitget   : (a, pos) => {
    // 在指定位置pos中获取位，在整数数组a中
  },
  bitor    : (a, b) => {
    // 对数a和b按位或
  },
  bitset   : (a, pos) => {
    // a的集合点在一个特定的位置pos
  },
  bitshift : (a, k) => {
    // 返回一个移到左K位，相当于乘以2K。K负值对应的位权转移或除以2|K|向负无穷舍入到最近的整数。任何溢出位都被截断。
  },
  bitxor   : (a, b) => {
    // 对数a和b按位异或
  },
  swapbytes: _ => {
    // 交换字节顺序
  }

})
//测试
$.E(M, {
  test      : () => {
    // console.log(M.poly([1, 0.8, 0.7, 0.7]))
    // console.log(M.poly([-1, 2, 2]))
    // console.log(M.poly([0.12549213361, 31.87450787, 4]))
    // console.log(M.poly([1, -2]))
    // console.log(M.poly([1, 0.5]))

    // console.log(M.roots(M.poly([-1, 2, 2])))
    // console.log(M.roots(M.poly([0.8, 0.8, 0.7, 0.7])))
    // console.log(M.roots(M.poly([0.8, 0.8, 0.7, 0.7])))
    // console.log(M.roots(M.poly([1, 2, 3, 4, 5, 6, 7])))
    // M.testroots([2, 3].sort(mysort))
    // M.testroots([-1, 2, 2].sort(mysort))
    // M.testroots([0.8, 0.8, 0.7, 0.7].sort(mysort))
    // M.testroots([1, 2, 3, 4, 5, 6, 7].sort(mysort))
    // M.testroots([1.1, 2.2, 2.299, 3, 3, 4.3, 5, 6.6, 7.001, 10].sort(mysort))
    // M.testroots([1.1, 2.2, 3.3, 4.4, 5.5, 6.6, 7.7, 8.8, 9.9, 10, -1.9, -2.8, -3.7, -4.6, -5.5, -6.4, -7.3, -8.2, -9.1, -10.13].sort(mysort))

    // let X = []
    // // X[0]  = [-5040, 13068, -13132, 6769, -1960, 322, -28, 1]
    // X[0]  = [0.3136, -1.68, 3.37, -3, 1]
    // console.log(X[0])
    // X[1] = M.dx(X[0])
    // console.log(X[1])
    // let n = 2
    // while(1){
    //   X[n] = strum(X[n - 2], X[n - 1])
    //   if(X[n].length == 0){
    //     break
    //   }
    //   console.log(n, X[n])
    //   n++
    // }
    //
    // var v   = [-80, -30, 20, -5.77, 15, 22, 7, 1]
    // var ans: M.roots(v)
    // ans.forEach(n => {
    //   console.log(n, M.polyval(v, n))
    // })
    // console.log(ans)

    // var v = [1, 0, 0, 0, 0, 0, 0, 0, -19, 19]
    // let v = [
    //   13.596266171468015,
    //   11.744586848156036, //12.508262345089936
    //   11.56843731838104, //11.062507855009144
    //   9.743126767780652, //10.776503801527605
    //   9.28440211539825,  //9.252161438560426
    //   9.150609956697728,
    //   8.177620355406663, //8.600830175014993
    //   7.438158869504732, //7.81126607820957
    //   7.037953552779608, //6.719717211964098
    //   5.938684472319515, //5.498095872433935
    //   4.996886265654994, //4.996885388894214
    //   4.841367539339063, //4.841368573979912  //4.197900126342421
    //   3.79237689934411,  //3.7671003432016907
    //   3.445432792964227, //2.9438643904703503
    //   1.4249246035238006, //1.424903265815783
    //   1.0965764667412081, //1.292418840645553
    //   1.0553286109420745,
    //   0.5190730671641752, //0.5612471787057998
    //   0.39791394949817205,
    //   -3.1844856657982534, //-3.184485641480928
    //   -3.5481588108077733, //-3.548158837135876
    //   -4.2816422802649745, //-4.281642273738663 //-4.233071161446341
    //   -5.484238974481785,  //-5.484238975172833 //-5.82306862398363
    //   -6.915003273564164,  //-6.758611466348392
    //   -7.997266039086613,
    //   -10.156352362213681, //-10.15635236221321 //-10.69963118654496
    //   -12.535276451766897, //-12.690651953792697
    //   -12.988041661440093,
    //   -14.204739128959606,
    //   -14.967593557956862 //-14.036586608960228
    // ]

    keepZero(0.00099999)
    keepZero(0.000999991)
    keepZero(0.000999995)
    keepZero(1110.000999995)
    keepZero(1110.000999991)
    keepZero(-11110.000999991)
    keepZero(-11110.000999995)
    keepZero(-1.000999994e4)
    keepZero(-1.000999994e-4)
    keepZero(-1.000999995e+4)
    keepZero(-1.000999995e-4)
    keepZero(-1.000999991e+5)
    keepZero(-1.000999991e-5)
    keepZero(-1.000999995e+5)
    keepZero(-1.000999995e-5)
    keepZero(-1.000999991e+6)
    keepZero(-1.000999991e-6)
    keepZero(-1.000999995e-6)
    return

    let v = []
    for(let i = 0; i < 30; i++){
      v.push(keepRound((Math.random() - 0.5) * 20, 6))
    }
    v.sort(mysort)
    v = [
      9.9186,
      9.71031,
      9.12515,
      8.49669,
      8.29083,
      7.32317,
      7.03256,
      6.53704,
      4.75311,
      4.59766,
      4.19598,
      3.93811,
      3.40596,
      3.08255,
      2.974244,
      2.32438,
      1.898391,
      1.796563,
      -0.333985,
      -0.722806,
      -1.656774,
      -1.658893,
      -4.72766,
      -5.4793,
      -5.92093,
      -7.04056,
      -8.88467,
      -8.96467,
      -9.58984,
      -9.61901
    ]
    console.log(v)
    M.testroots(v)
    // v.push(1)
    // console.log('求解', v)
    // var ans: M.roots(v)
    // ans.forEach(n => {
    //   console.log('验证', n, M.polyval(v, n))
    // })
    // console.log(ans)
    console.log(total_cnt)

  },
  testroots : v => {
    let f = M.poly(v).data
    let u = M.roots(f)
    console.log('已知1元' + v.length + '次方程', f)
    let dif = []
    if(u.length == v.length){
      v.forEach((n, i) => {
        u[i]   = keepRound(u[i], 7)
        dif[i] = [n, u[i], keepZero(n - u[i])]
      })
    }
    console.log(JSON.stringify(v) == JSON.stringify(u) ? '得到精确解' : dif)
  },
  checkLimit: (f, a, answer) => {
    let output = []
    let result = M.limit(f, a, output)

    if('' + result != answer && answer != 'pass'){
      console.error({
        f,
        result: '' + result,
        answer
      })
    }

    return output.join('<br>')
  },
})

//常用
function action(f, ...arg){
  // if(typeof (f) == 'object' && f.obj && f.key){
  //   f= f.obj[f.key]
  // }

  if(M[f]){
    return M[f].apply(window, arg)
  }
  else if(Math[f]){
    if(f == 'exp'){
      if(type(arg[0]) == 'complex'){
        return M.mtimes(Math.exp(arg[0].r), complex(Math.cos(arg[0].i), Math.sin(arg[0].i)))
      }
    }
    else if(f == 'sqrt'){
      if(type(arg[0]) == 'normal'){
        if(arg[0] < 0){
          return complex(0, Math.sqrt(-arg[0]))
        }
        else{
          return Math.sqrt(arg[0])
        }
      }
    }

    return mixfun(Math[f], ...arg)
  }
  else if(resident_command.includes(f)){
    addToTableOut(f, 'resident_command')
    return
    // log('resident_command', f, arg)
  }
  else if(typeof (f) == 'function'){
    return f(...arg)
  }
  else if(typeof (f) == 'string' && typeof (window[f]) == 'function'){
    f = window[f]
    return f(...arg)

    // if(arg.length == 1){
    //   if(isNda(arg[0])){
    //     let a      = arg[0].simple()
    //     let output = ''
    //     a.data.forEach(n => output += f[INDEX(n)] || '')
    //     return output
    //   }
    //   else if(/:/.test(arg[0])){
    //     arg[0]     = INDEX(arg[0])
    //     let output = createIndex(arg[0], f)
    //     return output.join('')
    //     // let l  = f.length
    //     // let a  = arg[0].split(':')
    //     // let fr = a[0] ? INDEX(a[0] | 0, l) : 0
    //     // let to
    //     // if(a.length < 3){
    //     //   to = a[1] ? Math.min(f.length, INDEX(a[1] | 0, l) + 1) : l
    //     //   console.log(f, l, arg, fr, to)
    //     //   return f.slice(fr, to)
    //     // }
    //     // else{
    //     //   let step   = a[1] ? a[1] | 0 : 1
    //     //   to         = a[2] ? Math.min(f.length - 1, INDEX(a[2] | 0)) : f.length - 1
    //     //   let output = ''
    //     //   linear(fr, step, to).forEach(n => output += f[n] || '')
    //     //   return output
    //     // }
    //   }
    //   else if(isNaN(arg[0])){
    //     arg[0] = INDEX(arg[0])
    //
    //     return f[arg[0]]
    //   }
    // }
  }
  else{
    let temp
    if(typeof (f) == 'object' && f.obj && f.key){
      temp = f.obj[f.key]
    }
    else if(window[f]){
      temp = window[f]
    }
    else if(isNda(f)){
      temp = f
    }
    else{
      window[f] = ndarray([])
      temp      = window[f]
    }

    if(isNda(temp)){
      if(arg.length == 1){
        if(isNda(arg[0])){
          // 按逻辑取值，输出列向量
          arg[0]  = arg[0].simple()
          temp    = temp.simple()
          let arr = temp.data.filter((n, index) => arg[0].data[index])
          //let result = temp.pickKeep(arg[0])
          return ndarray(arr, [arr.length, 1])
        }
        else if($.isNumber(arg[0])){
          arg     = INDEX(arg)
          let row = arg[0] % temp.shape[0]
          let col = keepZero((arg[0] - row) / temp.shape[0])
          return temp.get(row, col)
        }
        else if(arg[0] == ':'){
          let out = temp.simple()
          return ndarray(out.data, [out.data.length, 1])
        }
      }

      arg = INDEX(arg)

      for(let i = 0; i < arg.length; i++){
        if(isNda(arg[i])){
          arg[i] = arg[i].simple().data
        }
      }

      let result = temp.pickKeep(...arg)
      // let result = temp.pick(...arg)
      //D(:,[1 3])=D(:,[3 1]), 左边不能simple()
      //let output = result.simple()

      //n0(2:end)
      //delete temp.viewindex //需要dele ？

      if(result.size == 1){
        return result.get(0)
      }
      return result
    }
    // else if(typeof (temp) == 'function'){
    //   return temp(...arg) // ??
    // }
    // return temp.apply(temp, arg) ??
  }

  console.log(f, 'not defined yet')
  // log('not defined yet', f)
}

function actionshow(f, ...arg){
  // console.log('actionshow', f, arg)
  let result = action(f, ...arg)
  let g
  if(window[f]){
    window[f].arg = isNda(arg[0]) ? arg[0].arg : arg
  }
  else{
    g = {
      name: typeof (f) == 'function' ? f.toLocaleString().match(/\b\w+(?=\()/)[0] : f.name ?? f,
      arg : isNda(arg[0]) ? (arg[0].arg || arg[0].name) : arg //numel(A)
    }
  }

  if(result && result.single){
    result = result.single
  }

  if(g){
    if(!/disp|plot|surf|mathjax/.test(g.name)){
      addToTableOut(g, result)
    }
    if(f){
      delete f.viewindex
      delete f.arg
    }
  }
  else{ // if(!/disp|plot|surf|mathjax/.test(g.name)){
    addToTableOut(f, result)
    delete window[f].viewindex
    delete window[f].arg
  }
}

function assign(b, a){
  b = b.single || b
  // console.log('assign', a, b)
  if(M[a] || resident_command.includes(a)){
    console.error(a, 'can not be assign', b)
    return
  }
  else if(isNda(a)){
    if(isNda(b)){
      if(b.size == 0 && Array.isArray(a.arg) && a.name){
        let c = window[a.name]
        if(/\d/.test(a.arg[0])){
          // 删除某行
          c.view[0].splice(a.arg[0] - 1, 1)
          c.shape[0]--
        }
        else if(/\d/.test(a.arg[1])){
          // 删除某行
          c.view[1].splice(a.arg[1] - 1, 1)
          c.shape[1]--
        }
        else if(/\d/.test(a.arg[2])){
          // 删除某页面
          c.view[2].splice(a.arg[2] - 1, 1)
          c.shape[2]--
        }
        //删除 a 的行/列/页

        window[a.name] = c.simple()
        return window[a.name]
      }
      else if(a.shape.length == 3 && b.shape.length == 2){
        if(a.shape[2] == 1 && (a.shape[0] != b.shape[0] || a.shape[1] != b.shape[1])){
          //a 里内容将被 b替换
          let c_shape = b.shape.slice()
          c_shape[2]  = a.shape[2]
          let c       = ndarray([], c_shape)
          c.fill((i, j, k) => b.get(i, j))
          c.name         = a.name
          c.arg          = a.arg
          window[a.name] = c
        }
        else{
          //a添加b的内容
          b.map((i, j) => a.set(i, j, 0, b.get(i, j)))
        }
      }
      else{
        let c = b.simple()
        let d = a.simple()

        if(sameSize(c, d)){
          a.fill((...arg) => c.get(...arg))
        }
      }
    }
    else if(Array.isArray(b)){
      //window[a] = b[0] //todo
    }
    else if(a.viewindex){
      a.viewindex.forEach(n => a.set(n, b))
      delete a.viewindex
    }
    else{
      a.fill(_ => b)
      // a.set(0, b)
    }

    let name    = nameShort(a.name ?? a)
    VLIST[name] = 1
    return a
  }
  //下面的a都是string || object
  else if(a.obj && a.key){
    a.obj[a.key] = b
  }
  else if(isNda(b)){
    b.name    = b.name ? a + '@' + b.name : a.name ?? a
    window[a] = b.clone()
  }
  else if(typeof (b) == 'object' && 'single' in b){
    window[a] = b.single
  }
  else{
    if(isNda(b)){
      window[a] = b.simple()
    }
    else{
      window[a] = b
    }
  }

  VLIST[a] = 1

  return window[a]
}

function assignshow(b, a){
  let result = assign(b, a)

  if(b == undefined){
    return
  }

  addToTable(b.name ?? a.name ?? a, b.single || b)  // 应对 b=[0,0] b='abcde'

  if(isNda(a) && a.name){
    delete a.viewindex
    // delete window[a.name].arg
  }
}

function multias(a, b, show){
  if(isNda(a)){
    if(isNda(b)){
      for(let i = 0, l = b.size; i < l; i++){
        a.set(i, b.get(i))
      }
    }
    else if($.isArray(b)){
      for(let i = 0, l = Math.min(a.length, b.length); i < l; i++){
        a.set(i, b[i])
      }
    }
    else{
      a.assignseq(b)
    }
  }
  else if($.isArray(a)){
    a.map((f, i) => {
      if(b.multias && $.isArray(b.multias)){
        // e = eig(A) 返回向量
        // [V, D] = eig(A) 返回 右特征值向量矩阵 V 和特征值对角矩阵 D
        // [V, D, W] = eig(A) 返回 右特征值向量矩阵 V, 特征值对角矩阵 D, 左特征值向量矩阵
        window[f] = b.multias[i]
      }
      else if(isNda(b)){
        window[f] = b.get(i)
      }
      else{
        window[f] = b[i] || b
      }

      show && addToTable(f, window[f])

      VLIST[nameShort(f)] = 1
    })
  }
  else if($.isString(a)){
    if($.isArray(b)){
      window[a] = b[0]
    }
    else if(typeof (b) == 'string'){
      window[a] = b
      // eval(a + '="' + b + '"')
    }
    else{
      window[a] = b
      // eval(a + '=' + b)
    }
    console.error('为什么会到这里', a, JSON.stringify(b)) //
    // if(M[a]){
    //
    // }
    // else if(window[a]){
    //
    // }
    // else{
    // }
  }
  else if(a.obj && a.key){
    a.obj[a.key] = b

    //对象如何显示output和variable ？
    // show && addToTable(f, window[f])
  }
}

function multiasshow(a, b){
  multias(a, b, 'show')
  // console.log('here')
  if(a.name && a.arg){
    console.error('到不了这里吧')
    //addToTable(a.name + '(' + a.arg.map(n => UNINDEX(n)).join(',') + ')', b)
  }
}

function pickset(a, ...b){
  a = window[a] ?? a
  if(isNda(a) && a.name){
    VLIST[nameShort(a.name)] = 1
  }
  else{
    VLIST[a] = 1
  }

  let c = []

  if(!isNda(a)){
    window[a]      = ndarray([null])
    window[a].name = a
    window[a].arg  = b
    a              = window[a]
  }

  if(b.length == 1){
    if(sameSize(a, b[0])){
      let nda = a.pickKeep(b[0])
      return nda
    }

    let n = INDEX(b[0])
    if(isNda(n)){
      let nda = a.pickKeep(n)
      return nda
    }
    else{
      if(!isNaN(n)){
        let row = n % a.shape[0]
        let col = Math.round((n - row) / a.shape[0])
        c       = [row, col]
      }
      else{
        c = [n]
      }
    }
  }
  else{
    for(let i = 0; i < b.length; i++){
      if(isNda(b[i])){
        b[i] = b[i].simple().data
      }
    }
    c = INDEX(b)
  }

  a.arg = b

  return a.pickset(...c)
}

//
function calcshow(a){
  addToTableOut('ans', a) //显示原计算式
}

function command(){
}

function dottranspose(){
}

function doubleand(a, b){
  return a && b
}

function doubleor(a, b){
  return a || b
}

function format(a){
  // if($.isArray(a)){
  //   return ndarray(a)
  // }

  if(/:/.test(a)){
    let b = a.split(/\s*\:\s*/g)
    return ndarray(linear(...b))
  }

  if(typeof (a) == 'object' && a.obj && a.key){
    return a.obj[a.key]
  }

  if(isNda(a)){
    return a.simple()
  }
  return a
}

function isNda(a){
  return a instanceof ndarray.create
}

function isComplex(a){
  return a instanceof Complex
}

function isFraction(a){
  return a instanceof Fraction
}

function linear(a, b, c){
  let arr = []
  let to, step
  if(c == undefined){
    to   = b
    step = 1
  }
  else{
    to   = c
    step = b
  }

  if(step > 0){
    //step / 10000 是为了消除浮点误差造成最后一位数字缺失
    for(let i = a; i < to + step / 10000; i += step){
      arr.push(i)
    }
  }
  else if(step < 0){
    for(let i = a; i > to + step / 10000; i += step){
      arr.push(i)
    }
  }

  return arr
}

function nameShort(n){
  return n.replace ? n.replace(/@.+/g, '') : 'null'
}

function type(z){
  if(isNda(z)){
    return 'ndarray'
  }
  if(isComplex(z)){
    return 'complex'
  }
  if(isFraction(z)){
    return 'fraction'
  }
  if(Array.isArray(z)){
    return 'array'
  }
  // if(typeof (z) == 'string'){
  //   return 'string'
  // }
  return 'normal'
}

function log(...arg){
  var str = arg.join(' ').replace(/\n/g, '<br>').replace(/ /g, '&nbsp; ')
  // console.log(str)
  // return
  var I_ = (OUTPUT_PAGES[0].I_ || '')
  str    = (I_ ? I_ + '<br>' : '') + str

  OUTPUT_PAGES[0].I(str)
}

// function showVariable(){
//   // if(window.ans){
//   //   addToTable('ans', window.ans)
//   // }
//
//   let table = $.C($.body, {
//     L: 5,
//     T: 180,
//     W: 2
//   }, 'table')
//
//   table.I(TABLE_TR.join(''))
//
// }

function addToTable(a, v, str = '='){ //assign
  let name = a.name ?? a
  let arg  = a.arg ?? v?.arg ?? (window[a] ? window[a].arg : 0)
  if(name != 'ans' && name != 'disp' && !M[name] && v != undefined){
    // let name_short    = name.replace(/\(.*\)/, '').replace(/@.+/, '')
    VLIST[nameShort(name)] = 1
  }
  let s

  if(/disp|mathjax/.test(name)){
    s = '<div>' + v + '</div><div class="variableValue"></div>'
  }
  else{
    var v_arg
    if(arg){
      if(Array.isArray(arg)){
        arg = arg.map(item => Array.isArray(item) ? JSON.stringify(item) : item)
      }
      v_arg = '(' + (Array.isArray(arg) ? arg.join(/\>|\<|\=/g.test(arg.join('')) ? '' : ',') : arg) + ')'
    }
    else{
      v_arg = ''
    }
    s = `${name}${v_arg} ${str} ${variableType(v)}`
    s = `${name}${v_arg} = ${variableType(v)}`
    s += `<div class="variableValue">${variableValue(v)}</div>`
  }

  TABLE_TR.push(s)
}

function addToTableOut(a, v){ //show
  return addToTable(a, v, ':')
}

function variableType(a){
  if(isNda(a)){
    return a.shape.join('x')
    // return 'ndarray (' + a.shape.join(' x ') + ')'
  }
  if(isComplex(a)){
    return 'complex'
  }
  else{
    return $.myTypeof(a)
  }
}

function variableValue(a){
  let s
  if(isNda(a)){
    a       = a.simple()
    let b   = M.abs(a)
    let max = M.max(b, [], 'all').single
    let min = M.min(b, [], 'all').single

    if(!max){
      s = '<table>' + nda2table(a) + '</table>'
    }
    else if(a.size && max < 0.0001){
      let p       = Math.log10(max) | 0
      let enlarge = Math.pow(10, -p)
      let d       = mixfun(n => {
        if(isComplex(n)){
          return complex(n.r * enlarge, n.i * enlarge)
        }
        else if(isFraction(n)){
          return fraction(n.n * enlarge, n.d)
        }
        return n * enlarge
      }, a)
      s           = '<p>' + Math.pow(10, p).toExponential(1) + ' *</p>'
      s += '<table>' + nda2table(d) + '</table>'
    }
    else if(max % 1 == min % 1){
      s = '<table>' + nda2table(a) + '</table>'
    }
    else{
      s = '<table>' + nda2table(a) + '</table>'
    }

    return s
  }

  if(isComplex(a) || !isNaN(a)){
    return '<span title="' + a + '" onclick="showDetail(this)">' + showNormal(a) + '</span>'
  }
  else if(myNaN(a)){
    return 'NaN'
  }
  else if(Array.isArray(a)){
    a = a.map(s => {
      if(/\di/i.test(s)){
        s = s.replace(/\di/gi, str => str[0] + '*i')
      }
      else{
        // return typeof (s) != 'string' ? s : s.replace(/\s*\+\s*/g, ' + ').replace(/\s*\-\s*/g, ' - ')
      }
      return variableValue(s)
    })
    return '[ <br>&nbsp; ' + a.join(', <br>&nbsp; ') + ' <br>]'
  }
  else{
    if(/^[\w\+\-\*\/\^\.]+$/.test(a)){
      return M.mathjax(a)
    }
    return a
  }
}

function nda2table(nda, e){
  //https://www.php.cn/js-tutorial-413643.html
  // toString
  // toLocalString
  // toFixed
  // toExponential
  // toPrecision
  if(!isNda(nda)){
    let cs = nda < 0 ? 'class="nag"' : ''
    return '<td ' + cs + ' title="' + nda + '" onclick="showDetail(this)">' + showNormal(nda) + '</td>'
  }

  let s = ''
  switch(nda.dimension){
    case 0:
      return '<td>' + keepRound(nda.get()) + '</td>'
    case 1:
      // s +='<table>'
      s += '<tr>'
      for(let i = 0; i < nda.shape[0]; i++){
        let n = nda.get(i)
        if(isFraction(n)){
          s += '<td><nobr>' + n.toString() + '</nobr></td>'
        }
        else if(e){
          s += '<td><nobr>' + n.toExponential(M.FIXNUM) + '</nobr></td>'
        }
        else{
          let cs = n < 0 ? 'class="nag"' : ''
          s += '<td ' + cs + ' title="' + n + '" onclick="showDetail(this)">' + showNormal(n) + '</td>'
        }
      }

      if(s.length < 5){
        s += '<td>null</td>'
      }
      s += '</tr>'
      // s += '</table>'
      return s
    case 2:
      for(let i = 0; i < nda.shape[0]; i++){
        s += nda2table(nda.pick(i), e)
        // s += '<br><br>'
      }

      if(s.length < 1){
        s += '<td>&nbsp;</td>'
      }

      return s
    default:
      for(let i = 0; i < nda.shape[2]; i++){
        s += '<tr><td colspan=1000>(:,:,' + (i + 1) + ')</td></tr>'
        s += nda2table(nda.pick(':', ':', i), e)
      }

      return s
  }
}

function showDetail(node){
  if(node.innerText == node.title){
    node.innerText = node.normal_text
  }
  else{
    node.normal_text = node.innerText
    node.innerText   = node.title
  }
}

function showNormal(n){
  let s = n
  if(isComplex(n)){
    s = showNormal(n.r) + (n.i > 0 ? ' +' : ' -') + showNormal(Math.abs(n.i)) + 'i'
  }
  else if(!isNaN(n) && /^[\+\-\d\.e]+$/g.test('' + n)){
    if(n % 1 == 0){
      if(('' + n).length > 8){
        s = n.toExponential(M.FIXNUM)
      }
    }
    else if(Math.abs(n) < 0.0001 || Math.abs(n) > 1e8){
      s = n.toExponential(M.FIXNUM)
    }
    else if((+n).toFixed(M.FIXNUM) != n){
      s = (+n).toFixed(M.FIXNUM)
    }
  }

  if(n >= 0){
    s = '&nbsp;' + s
  }

  return s
}

function nearZeroVec(v){
  if(!Array.isArray(v)){
    // console.error('nearZeroVec只查看数组', v)
    return false
  }

  for(let i = v.length - 1; i >= 0; i--){
    if(v[i] || !nearZero(v[i])){
      return false
    }
  }
  return true
}

function vecAdd(a, b, ...m){
  var ta = typeof (a)
  var tb = typeof (b)
  var c, d, l
  if(ta == 'number' && tb == 'number'){
    result = a + b
  }
  else if(ta == 'number' && tb == 'object'){
    c        = b.slice()
    l        = b.length
    c[l - 1] = (c[l - 1] || 0) + a
    result   = c
  }
  else if(ta == 'object' && tb == 'number'){
    c        = a.slice()
    l        = a.length
    c[l - 1] = (c[l - 1] || 0) + b
    result   = c
  }
  else if(ta == 'object' && tb == 'object'){
    [c, d] = a.length > b.length ? [a.slice(), b] : [b.slice(), a]
    l      = c.length - d.length
    for(let i = d.length - 1; i >= 0; i--){
      c[i + l] = (c[i + l] || 0) + (d[i] || 0)
    }

    result = c
  }

  if(arguments.length == 2){
    return result
  }
    // else if(arguments.length == 3){
    //   return vecAdd(result, m)
  // }
  else{
    return vecAdd(result, ...m)
  }
}

function vecMul(a, b, ...m){
  if(a == 0 || b == 0 || m.indexOf(0) != -1){
    return 0
  }

  var ta = typeof (a)
  var tb = typeof (b)
  var c
  if(ta == 'number' && tb == 'number'){
    result = a * b
  }
  else if(ta == 'number' && tb == 'object'){
    c = b.slice()
    for(let i = c.length - 1; i >= 0; i--){
      c[i] = (c[i] || 0) * a
    }

    result = c
  }
  else if(ta == 'object' && tb == 'number'){
    c = a.slice()
    for(let i = c.length - 1; i >= 0; i--){
      c[i] = (c[i] || 0) * b
    }
    result = c
  }
  else if(ta == 'object' && tb == 'object'){
    c = []

    for(let ai = a.length - 1; ai >= 0; ai--){
      for(let bi = b.length - 1; bi >= 0; bi--){
        let i = ai + bi
        c[i]  = (c[i] || 0) + (a[ai] || 0) * (b[bi] || 0)
      }
    }

    result = c
  }

  if(arguments.length == 2){
    return result
  }
    // else if(arguments.length == 3){
    //   return vecMul(result, m)
  // }
  else{
    return vecMul(result, ...m)
  }
}

function minus_lam(a, lam){
  let b = a.clone()
  return M.minus(b, M.eyenum(a.shape[0], a.shape[0], lam))
}

function guessRoot(func, fr, fr_v, to, to_v){
  // console.log('guessRoot', {
  //   fr,
  //   fr_v,
  //   to,
  //   to_v
  // })
  if(fr_v == undefined){
    fr_v == func(fr)
  }

  // if(!fr_v){
  //   return fr
  // }

  if(to_v == undefined){
    to_v == func(to)
  }

  // if(!to_v){
  //   return to
  // }

  if(fr_v * to_v > 0){
    console.error('guessRoot 无法工作', {
      fr,
      fr_v,
      to,
      to_v
    })
    return
  }

  let k     = 100
  let r_max = 10
  let r_min = 1 / r_max
  let r, mid, v, ji
  while(k--){
    r   = Math.max(r_min, Math.min(r_max, Math.abs(fr_v / to_v)))
    // r   = Math.abs(fr_v / to_v)
    mid = r < 1 ? (fr / r + to) / (1 / r + 1) : (fr + to * r) / (r + 1)
    mid = keepZero(mid)

    if(mid == to || mid == fr){
      mid = (fr + to) / 2
    }

    v = func(mid)
    // console.log({
    //   k,
    //   mid,
    //   v,
    //   r,
    //   fr,
    //   fr_v,
    //   to,
    //   to_v
    // })

    ji = Math.sign(v) * Math.sign(fr_v)
    if(ji == 0){
      to   = mid
      to_v = v
      console.log('break0')
      break
    }
    else if(ji < 0){
      if(mid == to){
        console.log('break1')
        break
      }
      if(fr > to && to > mid || fr < to && to < mid){
        console.log('break2', fr, to, mid)
        break
      }
      to   = mid
      to_v = v
    }
    else{
      if(mid == fr){
        break
      }
      if(fr > to && fr < mid || fr < to && fr > mid){
        console.log('break3', fr, to, mid)
        break
      }
      fr   = mid
      fr_v = v
    }
  }

  // v = func(mid)
  // if(Math.abs(v) > 1){
  //   console.log('mid', mid, v)
  //   return '无效解'
  // }

  // mid = keepZero(mid)
  // return mid

  return keepZero(Math.abs(fr_v) > Math.abs(to_v) ? to : fr)
}

function myMag(c){
  if(isComplex(c)){
    return c.mag()
  }
  return Math.abs(c)
}

function myMid(func, fr, to){
  let dif         = M.minus(to, fr)
  let ang0        = isComplex(dif) ? M.angle(dif) : 0
  let theta0      = myMag(dif) / 2
  //dif = theta * e^ang*i
  let mids        = []
  let vs          = []
  let mags        = []
  let theta, mid, v, mag, dif_angle
  let n           = 3
  let split_angle = pi / 6 / n
  // console.log(split_angle * 180 / pi)

  for(let i = 0; i < n; i++){
    if(i == 0){
      theta = theta0
      ang   = ang0
      // console.log(ang * 180 / pi)
      mid   = M.plus(fr, complex(theta * Math.cos(ang), theta * Math.sin(ang)))
      v     = func(mid)
      mag   = myMag(v)

      mids.push(mid)
      vs.push(v)
      mags.push(mag)
    }
    else{
      dif_angle = split_angle * i
      theta     = theta0 / Math.cos(dif_angle)

      ang = ang0 - dif_angle
      // console.log(ang * 180 / pi)
      mid = M.plus(fr, complex(theta * Math.cos(ang), theta * Math.sin(ang)))
      v   = func(mid)
      mag = myMag(v)
      mids.push(mid)
      vs.push(v)
      mags.push(mag)

      ang = ang0 + dif_angle
      // console.log(ang * 180 / pi)
      mid = M.plus(fr, complex(theta * Math.cos(ang), theta * Math.sin(ang)))
      v   = func(mid)
      mag = myMag(v)
      mids.push(mid)
      vs.push(v)
      mags.push(mag)
    }
  }
  return {
    mids,
    vs,
    mags
  }
}

function guessRootComplex(func, fr, fr_v, to, to_v){
  k        = 100
  let mids, vs, mags
  let fr_m = myMag(fr_v)
  let to_m = myMag(to_v)
  console.log('guessRootComplex', {
    fr,
    fr_v,
    to,
    to_v,
    fr_m,
    to_m
  })

  let find
  while(k--){
    let {mids, vs, mags} = myMid(func, fr, to)
    console.log({
      k,
      mids,
      vs,
      mags
    })
    find = 0
    for(let i = 0, l = mids.length; i < l; i++){
      if(vs[i].r >= 0){
        if(mags[i] < fr_m){
          fr   = mids[i]
          fr_v = vs[i]
          fr_m = mags[i]
          find = 'fr' + i
        }
      }
      else{
        if(mags[i] < to_m){
          to   = mids[i]
          to_v = vs[i]
          to_m = mags[i]
          find = 'to' + i
        }
      }
    }

    if(!find || fr_m < 0.1 || to_m < 0.1){
      // 提高精度的事情交给 newton 迭代
      break
    }

    console.log({
      k,
      find,
      fr,
      fr_v,
      fr_m,
      to,
      to_v,
      to_m
    })
  }

  return find[0] == 'f' ? fr : to
}

function guessRootComplex_save(func, fr, fr_v, to, to_v){
  let k, mid, val, v, ji
  let fr_vr, to_vr
  let fr_vi, to_vi
  let r
  let r_max   = 100
  let r_min   = 1 / r_max
  let step    = 0.1
  let e       = 0.20
  let enlarge = 1

  for(let i = 0; i < 2; i++){
    // 第一步，通过调整虚数，找到值的实数零点
    fr_vr = M.real(fr_v)
    to_vr = M.real(to_v)

    k = 100
    while(k--){
      r = Math.max(r_min, Math.min(r_max, Math.abs(fr_vr / to_vr))) * enlarge
      if(r > 1){
        mid = complex(M.real(fr), (M.imag(fr) + M.imag(to) * r) / (r + 1))
      }
      else{
        r   = 1 / r
        mid = complex(M.real(to), (M.imag(fr) * r + M.imag(to)) / (r + 1))
      }

      val = func(mid)
      v   = M.real(val)

      if(Math.abs(v) < e){
        fr_v = val
        break
      }

      if(v * fr_vr > 0){
        if(M.imag(fr) == M.imag(mid)){
          fr_v = val
          break
        }
        fr   = mid
        fr_v = val
      }
      else{
        if(M.imag(to) == M.imag(mid)){
          to_v = val
          break
        }
        to   = mid
        to_v = val
      }

      console.log({
        k,
        mid: mid.toString(),
        val: val.toString(),
        r,
        fr : fr.toString(),
        to : to.toString(),
        fr_v,
        to_v
      })
    }

    if(nearZero(M.imag(val))){
      break
    }

    // 第二步，找到实数方向, 值的虚数符号相反的to
    fr   = mid
    fr_v = val
    step = 0.1
    for(let i = 0; i < 10; i++){
      to   = complex(M.real(fr) + step, M.imag(fr))
      to_v = func(to)

      console.log({
        i,
        to_v : to_v.toString(),
        to_vi: M.imag(to_v),
        fr_vi: M.imag(fr_v)
      })

      if(M.imag(to_v) * M.imag(fr_v) < 0){
        break
      }

      if(Math.abs(M.imag(to_v)) < Math.abs(M.imag(fr_v))){
        step *= 2
      }
      else{
        step *= -1.5
      }
    }

    // 第三步，通过调整实数，找到值的虚数零点
    fr_vi = M.imag(fr_v)
    to_vi = M.imag(to_v)

    k = 100
    while(k--){
      r = Math.max(r_min, Math.min(r_max, Math.abs(fr_vi / to_vi))) * enlarge
      if(r > 1){
        mid = complex((M.real(fr) + M.real(to) * r) / (r + 1), M.imag(fr))
      }
      else{
        r   = 1 / r
        mid = complex((M.real(to) * r + M.real(to)) / (r + 1), M.imag(fr))
      }

      val = func(mid)
      v   = M.imag(val)

      if(Math.abs(v) < e){
        to_v = val
        break
      }

      if(v * fr_vi > 0){
        if(M.real(fr) == M.imag(mid)){
          fr_v = val
          break
        }
        fr    = mid
        fr_v  = val
        fr_vr = v
      }
      else{
        if(M.real(to) == M.real(mid)){
          to_v = val
          break
        }
        to    = mid
        to_v  = val
        to_vr = v
      }

      console.log({
        k  : -k,
        mid: mid.toString(),
        val: val.toString(),
        r,
        fr : fr.toString(),
        to : to.toString(),
        fr_v,
        to_v,
      })

    }

    if(nearZero(M.real(val))){
      break
    }

    // 第四步，找到虚数方向，值的实数符号相反的to
    fr   = mid
    fr_v = val
    step = 0.1
    for(let i = 0; i < 10; i++){
      to   = complex(M.real(fr), M.imag(fr) + step)
      to_v = func(to)

      console.log({
        i    : -i,
        to_v : to_v.toString(),
        to_vr: M.real(to_v),
        fr_vr: M.real(fr_v)
      })

      if(M.real(to_v) * M.real(fr_v) < 0){
        break
      }

      if(Math.abs(M.real(to_v)) < Math.abs(M.real(fr_v))){
        step *= 2
      }
      else{
        step *= -1.5
      }
    }
  }

  return mid
}

function newtonComplex(func, func1, p, cp){
  console.log('newtonComplex', cp)
  // func 原多项式
  // func1 一阶导数
  // cp 近似复数根

  // 第一步，
  //x^2+u*x+v
  let u, v
  if(isComplex(cp)){
    u = -2 * M.real(cp)
    v = M.real(cp) ** 2 + M.imag(cp) ** 2
  }
  else if(Array.isArray(cp)){
    [u, v] = cp
  }

  let k = 30
  while(k--){
    var [q, _, r] = M.deconv(p, [1, u, v])
    r             = r.data

    if(!r[0] && !r[1]){
      // if(nearZero(r[0]) &&  nearZero(r[1])){
      break
    }

    var [_1, _2, s] = M.deconv(q, [1, u, v])
    s               = s.data

    var matrix = ndarray([u * s[0] - s[1], v * s[0], -s[0], -s[1]], [2, 2])
    var b      = ndarray([-r[0], -r[1]], [2, 1])

    var delta = M.gauss(matrix, b)
    delta     = delta.data
    if(!delta[0] && !delta[1]){
      break
    }
    u += delta[0]
    v += delta[1]
    console.log(k, u, v, delta)
  }

  let real  = -u / 2
  let check = v - u * u / 4
  if(check < 0){
    console.error('newtonComplex 结果是实根, 不科学啊', u, v, 'v - u * u / 4', check)
  }
  let imag = Math.sqrt(Math.abs(check))

  console.log('newton result', real, imag)
  return [complex(real, imag), complex(real, -imag)]
}

function newtonComplex_fail(func, func1, func2, x = 0){
  //抛物牛顿法，收敛失败，原因未知
  console.log(x)
  let k = 9
  let f0, f1, f2, omg
  let y1, y2, n
  while(k--){

    f0  = func(x)
    f1  = func1(x)
    f2  = func2(x)
    omg = k == 8 ? 1 : -1;//f1 >= 0 ? 1 : -1
    // x = x - omg * sqrt(f1*f1 - 2*f0*f2)/f2
    y1 = M.minus(x, M.mrdivide(M.minus(f1, M.mtimes(1, M.sqrt(M.minus(M.mtimes(f1, f1), M.mtimes(2, f0, f2))))), f2))
    y2 = M.minus(x, M.mrdivide(M.minus(f1, M.mtimes(-1, M.sqrt(M.minus(M.mtimes(f1, f1), M.mtimes(2, f0, f2))))), f2))
    console.log(f0, f1, f2, omg, y1, y2)
    n = prompt(n)
    if(n == 1){
      x = y1
    }
    else{
      x = y2
    }
  }

  return x
}

function funcCreate(fun, para){
  let cnt = 0
  let len = para.length
  return function(x){
    if(x == 'cnt'){
      total_cnt += cnt
      return [cnt, len]
    }
    cnt++
    return fun(para, x)
  }
}

function findNagtive(func, fr, fr_v, step){
  let to, to_v
  let k = 100
  while(k--){
    to   = fr + step
    to_v = func(to)

    if(nearZero(to_v)){
      // console.log('find a negtive', to)
      return [to, 0]
    }

    if(to_v * fr_v < 0){
      //to已获得
      break
    }
    step *= 10
  }

  return [to, to_v]
}

function keepZero(n){
  // return n
  if(nearZero(n)){
    return 0
  }

  let a       = '' + Math.abs(n)
  let reg     = /999999999|000000000/
  let reg_len = (reg.toString().length - 3) / 2
  if(reg.test(a)){
    let l = 0
    if(/e/.test(a)){
      let e = a.split('e')
      l -= e[1]
      a     = e[0]
    }

    if(/\./.test(a)){
      let d = a.split('.')
      a     = d[1]
      l += 0
    }

    let b = a.split(reg)
    l += b[0].length + reg_len

    if(l > 12){
      l--
    }

    let c = Math.pow(10, l)
    let d = Math.round(n * c) / c
    // console.log(n, l, c, d)
    n     = d
    // n = keepRound(n, l)
    // console.log('keepZero', a,
  }

  return n
}

function cubeRoot(n){
  let abs_root = Math.pow(Math.abs(n), 1 / 3)
  return n > 0 ? abs_root : -abs_root
}

function mysort(a, b){
  // return a-b //生序
  return b - a //降序
}

function strum(a, b){
  let u = []
  let l = a.length
  for(let i = 0; i < l; i++){
    u[i] = modmod(a[i], b[i])
  }

  for(let i = l - 1; i >= 0; i--){
    if(u[i]){
      break
    }
    u.splice(i, 1)
  }

  return u
}

function modmod(a, b){
  var rest

  if(!a || !b){
    rest = 0
  }
  else if(Math.abs(a) < Math.abs(b)){
    rest = keepZero(b % a)

    if(rest % a == 0){
      rest = 0
    }
  }
  else{
    rest = keepZero(a % b)

    if(rest % b == 0){
      rest = 0
    }
  }

  return !rest ? 0 : keepZero(-rest)
}

function optimaMulti(func, arr){
  for(let i = arr.length - 1; i >= 0; i--){
    let v     = func(arr[i])
    let opt_r = optima(func, arr[i], v)
    if(opt_r != arr[i]){
      console.log('实根优化', arr[i], v, '->', opt_r, func(opt_r))
      arr[i] = opt_r
    }
  }

  return arr
}

function optimaMultiComplex(func, func1, p, arr){
  for(let i = 0, l = arr.length; i < l; i += 2){
    let v0    = myMag(func(arr[i]))
    let opt_c = newtonComplex(func, func1, p, arr[i]) //返回一对复根
    let v2    = myMag(func(opt_c[0]))
    if(v0 > v2){
      console.log('复根优化', arr[i], v0, '->', opt_c[0], v2)
      arr[i]     = opt_c[0]
      arr[i + 1] = opt_c[1]
    }
  }

  return arr
}

function optima(func, r, v, step = 0.0001){
  if(Math.abs(step) > 0.01){
    return r
  }

  if(nearZero(v)){
    return r
  }

  let r1 = r * (1 + step)
  let v1 = func(r1)

  if(v1 * v < 0){
    return guessRoot(func, r, v, r1, v1)
  }

  if(Math.abs(v) > Math.abs(v1)){
    //r1 就比 r更优
    return optima(func, r1, v1, step * 2)
  }

  step *= -1
  let r2 = r * (1 + step)

  let v2 = func(r2)

  if(v2 * v < 0){
    return guessRoot(func, r, v, r2, v2)
  }

  if(Math.abs(v) > Math.abs(v2)){
    //r2 就比 r更优
    return optima(func, r2, v2, step * 2)
  }

  //左右两边的绝对值都比自己大
  return r
}

function oneHighCoefficients(arr){
  let v = arr.slice(), remove_first_zero = 1
  let high_a
  for(let i = 0, l = v.length; i < l; i++){
    if(isNaN(v[i]) || !v[i]){
      v[i] = 0
    }

    if(remove_first_zero == 1 && !v[i]){
      v.shift()
      i--
      l--
    }
    else if(remove_first_zero == 1){
      remove_first_zero = 2
      high_a            = v[i]
      v[i]              = 1 //最高阶的常数变为1，其他等比缩放
    }
    else{
      v[i] /= high_a
    }
  }
  return v
}

function degree2angle(a){
  if(typeof (a) == 'number'){
    a *= pi / 180
  }
  else if(Array.isArray(a)){
    a = a.map(n => n * pi / 180)
  }
  else if(isNda(a)){
    a = a.mul(pi / 180)
  }

  return a
}

function angle2degree(a){
  if(typeof (a) == 'number'){
    a *= 180 / pi
  }
  else if(Array.isArray(a)){
    a = a.map(n => n * 180 / pi)
  }
  else if(isNda(a)){
    a = a.mul(180 / pi)
  }

  return a
}

function mixfun(f, a, b){
  if(typeof (a) == 'object' && 'single' in a){
    a = a.single
  }

  if(Array.isArray(a)){
    return a.map(n => f(n, b))
  }
  else if(isNda(a)){
    let c = a.clone()
    c.fill((...arg) => f(c.get(...arg), b))
    return c
  }
  else if(isComplex(a)){
    return f(a, b)
  }
  else{
    return f(a, b)
  }
}

function mix2fun(a, b, f){
  if(typeof (a) == 'object' && 'single' in a){
    a = a.single
  }
  if(typeof (b) == 'object' && 'single' in b){
    b = b.single
  }
  a       = format(a)
  b       = format(b)
  let _ta = type(a)
  let _tb = type(b)
  if(_ta === 'ndarray' && _tb === 'normal'){
    a.data = a.data.map(n => f(n, b))
    return a
  }
  else if(_ta === 'normal' && _tb === 'ndarray'){
    b.data = b.data.map(n => f(a, n))
    return b
  }
  else if(_ta === 'ndarray' && _tb === 'ndarray'){
    let c
    if(a.dimension == 2 && b.dimension == 2){
      c = ndarray([], [Math.max(a.shape[0], b.shape[0]), Math.max(a.shape[1], b.shape[1])])
      c.fill((i, j) => f(a.get(i % a.shape[0], j % a.shape[1]), b.get(i % b.shape[0], j % b.shape[1])))
    }
    else if(a.dimension == 3 && b.dimension == 3){
      c = ndarray([], [Math.max(a.shape[0], b.shape[0]), Math.max(a.shape[1], b.shape[1]), Math.max(a.shape[2], b.shape[2])])
      c.fill((i, j, k) => f(a.get(i % a.shape[0], j % a.shape[1], k % a.shape[2]), b.get(i % b.shape[0], j % b.shape[1], k % b.shape[2])))
    }

    return c
  }
  else if(_ta === 'ndarray' && _tb === 'complex'){
    a.data = a.data.map(n => f(n, b))
    return a
  }
  else if(_ta === 'complex' && _tb === 'ndarray'){
    b.data = b.data.map(n => f(a, n))
    return b
  }

  return f(a, b)
}

function mix3func(fun, a, b){
  // if(!isNda(a)){
  //   return !!a
  // }

  if(isNda(b)){
    b = b.data
  }

  b = INDEX(b)

  let dim    = /^\d+$/.test(b) ? b : -1
  let all    = b == 'all'
  let vecdim = Array.isArray(b) && b.every(i => /^\d+$/.test(i)) ? b : false

  if(Array.isArray(a)){
    return fun(a)
  }

  if(all){
    return fun(a.simple().data)
  }

  if(dim == -1 && !vecdim){
    for(let i = 0; i < a.shape.length; i++){
      if(a.shape[i] > 1){
        //寻找第一个大于1的维度
        vecdim = [i]
        break
      }
    }
  }

  if(dim != -1){
    vecdim = [dim]
  }

  let d
  if(vecdim){
    d = 0
    while(dim < 20){
      if(!vecdim.includes(d)){
        break
      }
      d++
    }
  }

  if(d >= a.dimension){
    return mix3func(fun, a, 'all')
  }

  let pickArr  = []
  let shapeArr = []
  let setArr   = []

  for(let i = 0; i < a.dimension; i++){
    pickArr[i]  = ':'
    shapeArr[i] = 1
    setArr[i]   = 0
  }

  shapeArr[d] = a.shape[d]
  let out     = ndarray([], shapeArr)

  for(var i = 0; i < a.shape[d]; i++){
    pickArr[d] = i
    setArr[d]  = i
    out.set(...setArr, fun(a.pick(...pickArr).simple().data))
  }

  if(out.size == 1){
    return out.data[0]
  }
  return out
}

function sameSize(a, b){
  return a.dimension == b.dimension && JSON.stringify(a.shape) == JSON.stringify(b.shape)
}

function sameValue(a, b){
  if(!isNda(a)){
    console.warn(a, 'is not matrix')
    return
  }
  if(!isNda(b)){
    console.warn(b, 'is not matrix')
    return
  }
  a = a.simple()
  b = b.simple()
  return JSON.stringify(a.data) == JSON.stringify(b.data) && sameSize(a, b)
}

function dotRow(a, b){
  let arr = []

  for(let col = 0; col < a.shape[1]; col++){
    total = 0
    for(let row = 0; row < a.shape[0]; row++){
      total += a.get(row, col) * b.get(row, col)
    }
    arr.push(total)
  }

  if(arr.length == 1){
    return total
  }
  return ndarray(arr)
}

function dotCol(a, b){
  // console.log('dotCol', a, b)
  let arr = []

  for(let row = 0; row < a.shape[0]; row++){
    total = 0
    for(let col = 0; col < a.shape[1]; col++){
      total += a.get(row, col) * b.get(row, col)
    }
    arr.push(total)
  }

  if(arr.length == 1){
    return total
  }
  return M.transpose(ndarray(arr))
}

function INDEX(n){
  if($.isArray(n)){
    return n.map(n => INDEX(n))
  }
  if(isNda(n)){
    return n.sub(1)
  }

  return INDEX2(n)
}

function INDEX2(n){
  if(/:.*:/.test(n)){
    let a = n.split(':')
    a[0]  = INDEX2(a[0])
    a[2]  = INDEX2(a[2])
    return a.join(':')
  }
  else if(/:/.test(n)){
    let a = n.split(':')
    a[0]  = INDEX2(a[0])
    a[1]  = INDEX2(a[1])
    return a.join(':')
  }
  else if(!isNaN(n)){
    return n > 0 ? n - 1 : n
  }
  else if(/[\+\-]?\d+/.test(n)){
    //只替换一个数字
    return n.replace(/[\+\-]?\d+/, n => {
      return n - 1
    })
  }
  else if(/[\+\-]?\w+/.test(n)){
    return n + '-1'
  }
  else{
    console.log('todo', n)
  }
}

function UNINDEX(n){
  if($.isArray(n)){
    return n.map(n => !isNaN(n) ? n + 1 : n)
  }
  if(isNda(n)){
    return n.add(1)
  }
  else if(/:/.test(n)){
    return n.replace(/\d+/g, n => n + 1)
  }
  else if(!isNaN(n)){
    return n + 1
  }
  return n
}

function myNaN(a){
  return isNaN(a) && typeof (a) == 'number'
}

function isRational(n){
  return Math.abs(n) % 1 == 0
}

function str2reg(s){
  let map = '()^/+-*'
  for(let i = map.length - 1; i >= 0; i--){
    let reg = new RegExp('\\' + map[i], 'g')
    s       = s.replace(reg, '\\' + map[i])
  }

  s = s.replace(/w/g, '\\w+')
  s = s.replace(/d/g, '\\d+')
  return new RegExp(s, 'g')
}