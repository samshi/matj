function getOmg(size){
  var size_2 = size >> 1
  var size_4 = size >> 2
  var size_8 = size >> 3

  var re = new Float64Array(size_2) //缺省值是0
  var im = new Float64Array(size_2)

  var s, c, _
  var theta0 = 2 * Math.PI / size // 最小单位、根

  re[0] = 1

  if(size_4 >= 1){
    im[size_4] = 1;
  }

  //以上两个值，实际上用不到，为了形式上的完整

  var theta = theta0
  //只要完成1/4的取值，填满1/2

  for(let i = 1; i <= size_8; i++){
    c                  = Math.cos(theta)
    s                  = Math.sin(theta)
    re[i]              = c
    im[i]              = s
    re[_ = size_2 - i] = -c
    im[_]              = s
    re[_ = size_4 - i] = s
    im[_]              = c
    re[_ = size_4 + i] = -s
    im[_]              = c

    theta += theta0
  }

  return {
    re: re,
    im: im
  }
}

function fft_base(re_a, im_a, omg, dir = 1){
  var r      = Math.log2(re_a.length) | 0
  var size   = 1 << r
  var size_2 = size >> 1

  omg = omg || getOmg(size)
  var omg_re
  var omg_im

  // 一次性生成临时数组
  var re_s = new Float64Array(size)
  var im_s = new Float64Array(size)

  var bfsize, a, b, re, im, j, t, k, m, l, _
  var re_a_a, re_a_b, im_a_a, im_a_b
  // 用两层循环，不用迭代
  for(k = 0, l = r - 1; k < l; k++){
    _    = re_a
    re_a = re_s
    re_s = _

    _    = im_a
    im_a = im_s
    im_s = _

    bfsize = 1 << (l - k)

    m = size_2
    while(m--){
      // j, a, b 的取值方法是此算法的亮点，使得能够以m, m+size_2输出，从而避免排序
      // 确定了输出下标 m, m+size_2, 推导出输入下标 a, b, 适合进行GPU计算
      j = m % bfsize
      t = m - j         // t <= m < size_2
      a = m + t
      b = a + bfsize

      re_a_a = re_s[a]
      im_a_a = im_s[a]
      re_a_b = re_s[b]
      im_a_b = im_s[b]

      omg_re = omg.re[t]
      omg_im = omg.im[t]
      re     = omg_re * re_a_b - omg_im * im_a_b
      im     = omg_re * im_a_b + omg_im * re_a_b

      re_a[m] = re_a_a + re
      im_a[m] = im_a_a + im
      _       = m + size_2
      re_a[_] = re_a_a - re
      im_a[_] = im_a_a - im
    }
  }

  // k == r-1
  // k循环的最后一次单独处理
  if(dir < 0){
    // 逆变换直接定位，避免后续的重排序
    re_a_a       = re_a[0]
    re_a_b       = re_a[1]
    re_s[0]      = (re_a_a + re_a_b) / size
    re_s[size_2] = (re_a_a - re_a_b) / size

    for(m = 1; m < size_2; m++){
      a = (size_2 - m) << 1 //偶得之奇妙规则，可从 m ? size - m : m 推导得出
      b = a + 1

      re_a_a = re_a[a]
      re     = omg.re[m] * re_a[b] + omg.im[m] * im_a[b]

      re_s[m]          = (re_a_a + re) / size
      re_s[m + size_2] = (re_a_a - re) / size
    }

    return re_s
  }
  else{
    m = size_2
    while(m--){
      a = m << 1
      b = a + 1

      re_a_a = re_a[a]
      im_a_a = im_a[a]
      re_a_b = re_a[b]
      im_a_b = im_a[b]

      omg_re = omg.re[m]
      omg_im = omg.im[m]
      re     = omg_re * re_a_b - omg_im * im_a_b
      im     = omg_re * im_a_b + omg_im * re_a_b

      re_s[m] = re_a_a + re
      im_s[m] = im_a_a + im
      _       = m + size_2
      re_s[_] = re_a_a - re
      im_s[_] = im_a_a - im
    }

    return [re_s, im_s]
  }
}

