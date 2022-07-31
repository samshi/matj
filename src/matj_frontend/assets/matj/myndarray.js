function ndarray(arr, shape, order, view) {
  if (isNda(arr)) {
    return arr
  }
  if (!isArray(arr)) {
    return arr
  }

  return new ndarray.create(arr, shape, order, view)
}

ndarray.create = function (arr, shape, order, view) {
  if (shape == undefined) {
    arr = this.fromArray(arr || [])
    shape = arr.shape
  }
  // this.data  = arr instanceof ndarray.create ? arr.data : this.fromArray(arr)
  this.data = arr.data ?? arr
  var dtype = this.data.constructor.toString().toLowerCase().match(/function (.*)\(/)[1]
  this.dtype = {
    array: 'array',
    arraybuffer: 'buffer',
    object: 'generic',
    uint8clampedarray: 'uint8_clamped',
  }[dtype] || dtype.slice(0, -5)

  this.stride = [] //步长
  if (typeof (shape) == 'number') {
    // 仅单个数值
    if (!(/array|buffer/.test(dtype))) {
      this.dtype = this.dtype
      // this.data  = [this.data]
      this.view = shape
    }
    else {
      this.view = shape
    }

    this.shape = []
    this.dimension = 0
    this.size = 0
    this.offset = 0
    this.order = []
    this.scalar = true
  }
  else {
    // 至少是一维数组

    this.shape = shape ? shape.slice() : [this.data.length || this.data.byteLength]
    this.dimension = this.shape.length
    // Array / Float32Array ...

    this.order = order ? order.slice() : linear(0, this.dimension - 1)
    this.view = [] //各维度显示边界值，不用相乘shape[]，切片/hi/lo时改变

    var stride = 1
    var l = this.dimension
    var offset = 0
    // for(var i=l-1; i>=0; i--){
    //   this.shape[i] = this.shape[i] | 0
    //   if(i < l - 1){
    //     stride *= this.shape[i + 1]
    //   }
    //   this.view[i] = view ? view[i].slice() : linear(0, stride ,this.shape[i] * stride)
    //   // offset += Math.min.apply(this, this.view[i])
    //   // i== l-1 [0, 1, 2, 3 ...]
    //   // i== l-2 [0, col, 2*col, 3*col ...]
    //   // i== l-3 [0, col*row, 2*col*row, 3*col*row ...]
    //
    //   this.stride[i] = stride //lo hi, shape改变，后stride会被改成错误的形式，需要替换成原来的
    // }
    for (var i = 0; i < l; i++) {
      this.shape[i] = this.shape[i] | 0
      if (i > 0) {
        stride *= this.shape[i - 1]
      }
      this.view[i] = view ? view[i].slice() : linear(0, stride, this.shape[i] * stride - 1)
      // offset += Math.min.apply(this, this.view[i])
      // i== l-1 [0, 1, 2, 3 ...]
      // i== l-2 [0, col, 2*col, 3*col ...]
      // i== l-3 [0, col*row, 2*col*row, 3*col*row ...]

      this.stride[i] = stride //lo hi, shape改变，后stride会被改成错误的形式，需要替换成原来的
    }

    this.offset = offset
    this.size = stride * (this.shape[l - 1] || 0) || 0
  }

  this.length = this.data.length //this.size

  Object.defineProperty(this, 'T', {
    enumerable: false, // 当且仅当该属性的enumerable为true时，该属性才能够出现在对象的枚举属性中
    configurable: false, // 当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除
    get: this.transpose  // 属性的值
  })

  return this
}

function arrConcat(a, d, shape) {
  if (isArray(a)) {
    let result = []
    let l = a.length
    if (typeof (shape[d]) === 'undefined') {
      shape[d] = l
    }
    if (l != shape[d]) {
      console.log('error', l, d, shape[d])
      return
    }
    if (isArray(a[0])) {
      shape[1] = a[0].length
    }

    for (let i = 0; i < l; i++) {
      if (isArray(a[0])) {
        for (let j = 0, jl = a[0].length; j < jl; j++) {
          result[i + j * l] = a[i][j]
          //result.push() //= result.concat(arrConcat(a[i], d + 1, shape))
        }
      }
      else {
        result[i] = a[i]
      }
    }

    if (a.fraction) {
      result.fraction = a.fraction
    }

    return result
  }
  else {
    return a
  }
}

ndarray.create.prototype = {
  type: 'ndarray',
  fromArray(arr) {
    let shape = []
    let _arr = arrConcat(arr, 0, shape)
    // 下面三行把向量强行改变成矩阵
    if (shape.length == 1) {
      shape.unshift(1)
    }
    return _arr ? ndarray(_arr, shape) : null
  },
  index() {
    if (this.scalar) {
      return this.view
    }

    var argu = Array.prototype.slice.call(arguments)
    var i = this.dimension
    if (i > argu.length) {
      let a = []
      let l = 1
      let n = argu[0]
      //for(let d = this.shape.length - 1; d >= 0; d--){ //行主序
      for (let d = 0, dl = this.shape.length; d <= dl; d++) { //列主序
        l *= this.shape[d]
        a[d] = n % l
        n = (n - a[d]) / l
      }
      argu = a
    }

    var m
    var p = this.offset
    var p1 = this.offset
    while (--i >= 0) {
      m = argu[i] || 0
      p += this.view[i][m]
      p1 += this.stride[i] * m
    }

    if (p != p1) {
      // console.log(p, p1)
      // 两种算法
      // 在原始状态下结果相同
      // 在pick状态下 p1 无效
      // 用 view 代替 stride，p少了乘法
    }
    return p
  },
  get() {
    var argu = Array.prototype.slice.call(arguments)
    var n = this.index.apply(this, argu)
    return this.data[n]
  },
  set() {
    var argu = Array.prototype.slice.call(arguments)
    var v = argu.pop()
    //argu.length==1 ? argu :
    var n = this.index.apply(this, argu)
    if (this.data[n] !== v) {
      this.data[n] = v
    }
    return this.data[n]
  },
  set0() {
    var argu = Array.prototype.slice.call(arguments)
    var v = argu.pop()
    var n = this.index.apply(this, argu)
    if (this.data[n] !== v) {
      this.data[n] = keepZero(v)
    }
    return this.data[n]
  },
  trans() {
    var argu = Array.prototype.slice.call(arguments)
    var v = argu.pop()
    var d = this.get.apply(this, argu)

    if (v[0] != 1 && !isNaN(v[0])) {
      d *= v[0] //keepZero(v[0] * this.data[n])
    }
    if (v[1] && !isNaN(v[1])) {
      d += +v[1] //keepZero(+v[1] + this.data[n])
    }

    argu.push(d)
    return this.set0(...argu)
  },
  trans0() {
    var argu = Array.prototype.slice.call(arguments)
    var v = argu.pop()
    var d = this.get.apply(this, argu)

    if (v[0] != 1 && !isNaN(v[0])) {
      // d *= v[0]
      d = keepZero(v[0] * d)
    }
    if (v[1] && !isNaN(v[1])) {
      // d += +v[1]
      d = keepZero(+v[1] + d)
    }

    argu.push(d)
    return this.set(...argu)
  },
  simple() {

    let new_nda = ndarray([], this.shape)
    new_nda.fill((...arg) => this.get(...arg))

    if (this.viewindex) {
      //D(D>6)
      let data = new_nda.data.filter((v, index) => this.viewindex.includes(index))
      return ndarray(data, [1, data.length])
    }

    new_nda.name = this.name
    new_nda.arg = this.arg
    return new_nda
  },

  //view 原有数据下的新视图
  transpose() {
    if (this.scalar) {
      return this
    }

    var argu = Array.prototype.slice.call(arguments)

    var shape = []
    var order = []
    var view = []
    var stride = []
    var j
    var l = this.dimension
    var i = l
    var n
    while (i--) {
      n = argu[i] | 0
      j = typeof (argu[i]) == 'member' ? n : l - 1 - i
      order[i] = j
      shape[i] = this.shape[j]
      stride[i] = this.stride[j]
      view[i] = this.view[j]
    }

    var nda = ndarray(this.data, shape, order, view)
    nda.stride = stride
    nda.offset = this.offset

    return nda
  },
  hi() {
    if (this.scalar) {
      return this
    }

    var argu = Array.prototype.slice.call(arguments)

    var shape = []
    var view = []
    var i = this.dimension
    var n
    while (i--) {
      n = argu[i] | 0
      if (n > 0 && n < this.shape[i]) {
        shape[i] = n
        view[i] = this.view[i].slice(0, n)
      }
      else {
        shape[i] = this.shape[i]
        view[i] = this.view[i]
      }
    }

    var nda = ndarray(this.data, shape, this.order, view)
    nda.stride = this.stride.slice()
    nda.offset = this.offset

    return nda
  },
  lo() {
    if (this.scalar) {
      return this
    }

    var argu = Array.prototype.slice.call(arguments)

    var shape = []
    var view = []
    var i = this.dimension
    var n
    while (i--) {
      n = argu[i] | 0
      if (n && n < this.shape[i]) {
        shape[i] = this.shape[i] - n
        view[i] = this.view[i].slice(n)
      }
      else {
        view[i] = this.view[i]
      }
    }

    var nda = ndarray(this.data, shape, this.order, view)
    nda.stride = this.stride.slice()
    nda.offset = this.offset

    return nda
  },
  step() {
    if (this.scalar) {
      return this
    }

    var argu = Array.prototype.slice.call(arguments)
    var shape = []
    var view = []
    var stride = []
    var offset = 0
    var i = this.dimension
    var n
    while (i--) {
      n = argu[i] | 0
      if (n > 1) {
        shape[i] = Math.floor(this.shape[i] / n)
        stride[i] = this.stride[i] * n
        view[i] = setStep(this.view[i], n)
      }
      else if (n < 0) {
        shape[i] = Math.floor(this.shape[i] / -n)
        stride[i] = this.stride[i] * n
        view[i] = setStep(this.view[i], n)
      }
      else {
        shape[i] = this.shape[i]
        stride[i] = this.stride[i]
        view[i] = this.view[i]
      }
      offset += view[i][0]
    }

    var nda = ndarray(this.data, shape, this.order, view)
    nda.stride = stride
    // nda.offset = offset

    return nda
  },
  pick(...argu) {
    if (this.scalar) {
      return {
        dimension: -1
      }
    }

    var view = []
    var shape = []
    var order = []
    var stride = []
    var offset = this.offset

    var n
    var a
    for (var i = 0; i < this.dimension; i++) {
      n = argu[i]

      let _view = []

      if (typeof (n) == 'number') {
        n = n < 0 ? n + this.view[i].length : n
        if (n in this.view[i]) {
          _view.push(this.view[i][n])
        }
      }
      else if (isArray(n)) {
        if (n.length == 1 && n[0] in this.view[i]) {
          offset += this.view[i][n[0]]
          continue
        }

        n.forEach((m, index) => {
          if (m in this.view[i]) {
            _view.push(this.view[i][m])
          }
        })
      }
      else if (/:/.test(n)) {
        _view = createIndex(n, this.view[i])
      }

      if (_view.length == 1 && typeof (n) == 'number') {
        //增加 typeof (n) == 'number'，是为了区别 : 和 n
        //这里行向量和列向量无法区分
        offset += _view[0]
      }
      else {
        //无效相当与所有
        let lastest_view = _view.length ? _view.slice() : this.view[i].slice()
        view.push(lastest_view)

        shape.push(lastest_view.length)
        stride.push(this.stride[i])
        order.push(this.order[i])
      }
    }

    //ndarray([1,2,3]), 取pick(':', 0)时，shape=[]，会造成死机，全面禁用pick?
    if (shape.length == 0) {
      return this.data[offset]
    }

    var nda = ndarray(this.data, shape, order, view)

    nda.stride = stride.slice()
    nda.offset = offset

    return nda
  },
  pickKeep(...argu) { //数据必须INDEX完毕
    if (this.scalar) {
      return {
        dimension: -1
      }
    }

    if (argu.length == 1) {
      let a = this

      if (isNda(argu[0])) {
        let b = argu[0].simple()
        //D(D>6)
        a.viewindex = []

        if (sameSize(a, b)) {
          b.data.forEach((v, index) => {
            if (v) { //D(D>6)
              a.viewindex.push(index)  //matlabD=diag(root([1 5 4 2 3]))
            }
          })
        }
        else {
          b.data.forEach((v, index) => {
            if (!isNaN(v)) {
              // if(v){ //D(D>6)
              a.viewindex.push(index)
              // a.viewindex.push(v)  //matlabD=diag(root([1 5 4 2 3]))
            }
            else {
              console.error('pickKeep argu error', argu)
            }
          })
        }

        return a
      }
      else if (':' == argu[0]) {
        let b = a.simple()
        return ndarray(b.data, [b.length, 1])
      }
      else if (/:/.test(argu[0])) {
        let b = a.simple()
        //这里不是keepSet，只要取值，输出行向量
        let out = createIndex(argu[0], linear(0, b.data.length - 1))
        let arr = []
        out.forEach(n => {
          arr.push(b.data[n])
        })
        if (b.shape[0] == 1) {
          return ndarray(arr, [1, arr.length])
        }
        else {
          return ndarray(arr, [arr.length, 1])
        }
      }
    }

    var view = []
    var shape = []
    var order = []
    var stride = []
    var offset = this.offset

    var n
    var a
    var l = Math.max(argu.length, this.dimension)
    for (var i = 0; i < l; i++) { //
      n = argu[i]
      let _view = []

      if (typeof (n) == 'number') {
        n = n < 0 ? n + this.view[i].length : n
        if (this.view[i] == undefined) {
          _view.push(n)

        }
        else if (n in this.view[i]) {
          _view.push(this.view[i][n])
        }
      }
      else if (isArray(n)) {
        //这一段会降维，跳过
        if (0 && n.length == 1 && n[0] in this.view[i]) {
          offset += this.view[i][n[0]]
          continue
        }

        n.forEach((m, index) => {
          if (m in this.view[i]) {
            _view.push(this.view[i][m])
          }
        })
      }
      else if (/:/.test(n)) {
        _view = createIndex(n, this.view[i])
      }

      if (0 && _view.length == 1) {
        //这一段也是引起降维的
        offset += _view[0]
      }
      else {
        //无效相当与所有
        let lastest_view = _view.length ? _view.slice() : this.view[i].slice()
        view.push(lastest_view)

        shape.push(lastest_view.length)
        stride.push(i in this.stride ? this.stride[i] : i)
        order.push(i in this.order ? this.order[i] : i)
      }
    }

    var nda = ndarray(this.data, shape, order, view)

    let len = 1
    view.forEach(d => len *= d.length)
    nda.stride = stride.slice()
    nda.offset = offset
    nda.length = len
    nda.name = this.name
    nda.arg = this.arg

    return nda
  },
  pick_old() { //最早的写法，不完善，供参考
    if (this.scalar) {
      return {
        dimension: -1
      }
    }

    var argu = Array.prototype.slice.call(arguments)

    var view = []
    var shape = []
    var order = []
    var stride = []
    var offset = this.offset

    var n
    var cache = []
    var picker
    var a
    var b
    for (var i = 0; i < this.dimension; i++) {
      n = argu[i]
      a = cache[i] || this.view[i]
      picker = 'NaN'
      if (typeof (n) == 'number' && n >= 0) {
        n = n | 0
        picker = a[n] // 是数字
      }

      if (typeof (picker) != 'number') {
        //没有指定有效数字，如非数字和数字，或者是个不存在的序号
        order.push(view.length)
        view.push(a)
        shape.push(a.length)
        stride.push(this.stride[i])
      }
      else {
        //picker 有效
        if (i < this.dimension - 1) {
          b = cache[i + 1] || this.view[i + 1]

          cache[i + 1] = []
          for (var j = 0, lj = b.length; j < lj; j++) {
            cache[i + 1][j] = b[j] + picker
          }
        }
        else if (view.length == 0) {
          // 如果只剩下一个数字，而不是数组
          return ndarray(this.data, picker)
        }
        else {
          var j = view[0].length
          offset += picker
          while (j--) {
            view[0][j] += picker
          }
        }
      }
    }

    var nda = ndarray(this.data, shape, order, view)
    nda.stride = stride

    return nda
  },
  pickset(...argu) { //数据必须INDEX完毕
    //三维怎么办
    //这里的序号从0开始，Matlab是从1开始的
    // if(n >= this.shape[0] || m >= this.shape[1]){
    //   //如果this的shape没有包含(n,m),扩充到(n,m)
    //   let b = ndarray([], [Math.max(n + 1, this.shape[0]), Math.max(m + 1, this.shape[1])])
    //   b.fill((i, j) => i < this.shape[0] && j < this.shape[1] ? this.get(i, j) : 0)
    //
    //   this.data   = b.data.slice()
    //   this.shape  = b.shape
    //   this.order  = b.order
    //   this.view   = b.view
    //   this.length = b.length
    // }
    //
    // return this.pickKeep(n, m)

    if (this.scalar) {
      return {
        dimension: -1
      }
    }

    if (argu.length == 1) {
      let a = this

      if (isNda(argu[0])) {
        let b = argu[0].simple()
        //D(D>6)
        a.viewindex = []
        b.data.forEach((v, index) => {
          if (v) {
            a.viewindex.push(index)
          }
        })
        return a
      }
      else if (/:/.test(argu[0])) {
        let b = a.simple()
        a.viewindex = createIndex(argu[0], linear(0, b.data.length - 1))

        return a
      }
    }

    var view = []
    var shape = []
    var order = []
    var stride = []
    var offset = this.offset

    var n
    var a
    var l = Math.max(argu.length, this.dimension)
    var expented = false
    for (var i = 0; i < l; i++) { //
      n = argu[i]
      let _view = []

      if (isNda(n)) {
        n = n.simple().data
      }

      if (typeof (n) == 'number') {
        n = n < 0 ? n + this.view[i].length : n
        if (this.view[i] == undefined) {
          _view = new Array(n + 1)
          expented = true
        }
        else if (n in this.view[i]) {
          _view.push(this.view[i][n])
        }
        else {
          _view = new Array(n + 1)
          expented = true
        }
      }
      else if (isArray(n)) {
        //这一段会降维，跳过
        if (0 && n.length == 1 && n[0] in this.view[i]) {
          offset += this.view[i][n[0]]
          continue
        }

        n.forEach((m, index) => {
          if (m in this.view[i]) {
            _view.push(this.view[i][m])
          }
          else {
            _view.push(m)
            expented = true
          }
        })
      }
      else if (/:/.test(n)) {
        _view = createIndex(n, this.view[i])
      }

      if (0 && _view.length == 1) {
        //这一段也是引起降维的
        offset += _view[0]
      }
      else {
        //无效相当与所有
        let lastest_view = _view.length ? _view.slice() : this.view[i].slice()
        view.push(lastest_view)

        shape.push(lastest_view.length)
        stride.push(i in this.stride ? this.stride[i] : i)
        order.push(i in this.order ? this.order[i] : i)
      }
    }

    if (expented) {
      var nda = ndarray(this.data, shape)
      nda.name = this.name
      nda.arg = this.arg
      window[nda.name] = nda
      return nda.pickKeep(...argu)
    }
    else {
      var nda = ndarray(this.data, shape, order, view)

      let len = 1
      view.forEach(d => len *= d.length)
      nda.stride = stride.slice()
      nda.offset = offset
      nda.length = len
      nda.name = this.name
      nda.arg = this.arg

      return nda
    }

  }, //show
  toString() {
    if (this.scalar || this.dimension < 1) {
      return this.get()
    }
    return this.length == this.data.length ? this.data.toString() : this.toArray().toString()
  },
  toArray() {
    if (this.scalar) {
      return this.get()
    }

    var output = []
    if (this.dimension == 11) { //二维 / 矩阵
      var s = '[ '
      var i = this.shape[0]
      while (i--) {
        output.push(this.get(i))
      }
    }
    else if (this.dimension == 22) { //二维 / 矩阵
      var s = '[ '
      var i = this.shape[0]
      while (i--) {
        var view1_arr = []
        var j = this.shape[1]
        while (j--) {
          view1_arr.push(this.get(i, j))
        }
        output.push(view1_arr)
      }
    }
    else if (this.dimension == 33) { //三维
      var i = this.shape[0]
      while (i--) {
        var view1_arr = []
        var j = this.shape[1]
        while (j--) {
          var view2_arr = []
          var k = this.shape[2]
          while (k--) {
            view2_arr.push(this.get(i, j, k))
          }
          view1_arr.push(view2_arr)
        }
        output.push(view1_arr)
      }
    }
    else { //四维及以上
      var dim = this.dimension
      var point_arr = new Uint16Array(dim)
      var out_arr = []
      var amount = this.size
      var i = dim
      var that = this
      while (i--) {
        out_arr[i] = []
      }

      var pointer = 0//dim - 1
      while (amount--) {
        // out_arr[dim - 1].push(this.get.apply(this, point_arr))
        out_arr[0].push(this.get.apply(this, point_arr))
        next(pointer)
      }
      output = out_arr[dim - 1]

      function next(n) {
        if (point_arr[n] == that.shape[n] - 1) {
          if (n == dim - 1) {
            return
          }

          out_arr[n + 1].push(out_arr[n])
          out_arr[n] = []
          point_arr[n] = 0
          next(n + 1)
          pointer = 0//dim - 1
        }
        else {
          point_arr[n]++
        }
      }
    }

    // this.arr = view0_arr
    return output
  },
  show(z) {
    z && console.log(z)

    if (this.dimension == 0) {
      log(' ', this.get())
    }
    else if (this.dimension == 1) { //一维 / 数组
      var s = '[ '
      for (var i = 0; i < this.shape[0]; i++) {
        s += this.get(i) + ' '
      }
      s += ']'
      console.log(s)
      log(' ', s)
    }
    else if (this.dimension == 2) { //二维 / 矩阵
      var s = '  [\n'
      for (var i = 0; i < this.shape[0]; i++) {
        s += '    [ '
        for (var j = 0; j < this.shape[1]; j++) {
          s += this.get(i, j) + ' '
        }
        s += ']\n'
        // if(i == this.shape[0] - 1){
        //
        // }
        // s = '  '
      }
      s += '  ]'
      log(s)
    }
    else if (this.dimension == 3) { //三维
      var s = '[ '
      for (var i = 0; i < this.shape[0]; i++) {
        s += '[ '
        for (var j = 0; j < this.shape[1]; j++) {
          s += '[ '
          for (var k = 0; k < this.shape[2]; k++) {
            s += this.get(i, j, k) + ' '
          }
          s += ']'
          if (j == this.shape[1] - 1) {
            s += ' ]'
            if (i == this.shape[0] - 1) {
              s += ' ]'
            }
            else {
              s += ';'
            }
          }

          log(s)
          s = s.slice(-1) == ';' ? '  ' : '    '
        }
      }
    }
    else if (this.dimension > 3) {
      log(this.toArray())
    }

    return this
  },
  unpack() {
    return this.toArray()
  },

  //matrix
  matrixadd(b) {
    let a = this
    let c = ndarray([], [Math.max(a.shape[0], b.shape[0]), Math.max(a.shape[1], b.shape[1])])
    c.fill((i, j) => a.get(Math.min(a.shape[0] - 1, i), Math.min(a.shape[1] - 1, j)) + b.get(Math.min(b.shape[0] - 1, i), Math.min(b.shape[1] - 1, j)))
    // if(a.shape[0] == b.shape[0] && a.shape[1] == b.shape[1]){
    //   // let c = ndarray([], a.shape)
    //   var l = this.size
    //   var i = l
    //   while(i--){
    //     a.data[i] = keepZero(a.data[i] - b.data[i])
    //   }
    // }
    return c
  },
  matrixsub(b) {
    let a = this
    let c = ndarray([], [Math.max(a.shape[0], b.shape[0]), Math.max(a.shape[1], b.shape[1])])
    c.fill((i, j) => a.get(i % a.shape[0], j % a.shape[1]) - b.get(i % b.shape[0], j % b.shape[1]))
    // if(a.shape[0] == b.shape[0] && a.shape[1] == b.shape[1]){
    //   // let c = ndarray([], a.shape)
    //   var l = this.size
    //   var i = l
    //   while(i--){
    //     a.data[i] = keepZero(a.data[i] - b.data[i])
    //   }
    // }
    return c
  },

  //other
  flatten() {
    if (this.scalar) {
      return this.get()
    }

    if (this.size == this.data.length) {
      return this.data.slice()
    }

    //方法2
    var dim = this.dimension
    var point_arr = new Uint16Array(dim)
    var output = []
    var amount = this.size
    var pointer = 0//dim - 1
    var that = this
    while (amount--) {
      output.push(this.get.apply(this, point_arr))
      if (amount) {
        next(pointer)
      }
    }

    function next(n) {
      if (point_arr[n] == that.shape[n] - 1) {
        if (n == dim - 1) { //!0
          return
        }

        point_arr[n] = 0
        next(n + 1)  //n-1
        pointer = 0 // dim - 1
      }
      else {
        point_arr[n]++
      }
    }

    return output
  },
  fill(f) {
    this.map(function () {
      var argu = Array.prototype.slice.call(arguments)
      argu.push(f.apply(this, argu))
      this.set.apply(this, argu)
    })
    return this
  },
  map(f) {
    if (this.scalar) {
      f.apply(this, [this.index()])
      return
    }

    var dim = this.dimension
    var point_arr = new Uint16Array(dim)
    var pointer = 0//dim - 1
    var amount = this.size
    var c
    var that = this
    while (amount--) {
      c = f.apply(this, point_arr)
      if (c == '_end_1' || c == '_end_0') {
        return c
      }

      if (amount) {
        next(pointer)
      }
    }

    return c

    function next(n) {
      if (point_arr[n] == that.shape[n] - 1) {
        if (n == dim - 1) { //!0
          return
        }

        point_arr[n] = 0
        next(n + 1)  //n-1
        pointer = 0 // dim - 1
      }
      else {
        point_arr[n]++
      }
    }
  },
  clone() {
    if (this.scalar) {
      var nda = ndarray(this.data.slice ? this.data.slice() : this.data, this.view)
    }
    else {
      var nda = ndarray(this.data.slice(), this.shape, this.order, this.view)
      nda.stride = this.stride
      nda.name = this.name
      nda.arg = this.arg
    }
    return nda
  },
  keepRound() {
    this.fill((i, j) => keepRound(this.get(i, j)))
    return this
  }
}

  ; (function addOpFunction() {
    var ndp = ndarray.create.prototype
    //批量扩展ndarray各种运算方法

    //ops
    ndp.assign = function (src) {
      this.map(function () {
        var argu = Array.prototype.slice.call(arguments)
        var v = src.get.apply(src, argu)
        argu.push(v)
        this.set.apply(this, argu)
      })
      return this
    }
    ndp.norm2 = function () {
      return Math.sqrt(this.norm2squared())
    }
    ndp.argmin = function () {
      if (this.scalar) {
        return this.view
      }
      var n = 0
      var i = this.dimension
      while (i--) {
        n += Math.min.apply(this, this.view[i])
      }
      return n
    }
    ndp.argmax = function () {
      if (this.scalar) {
        return this.view
      }
      var n = 0
      var i = this.dimension
      while (i--) {
        n += Math.max.apply(this, this.view[i])
      }
      return n
    }

    function makeOp(group, fun_body) {
      for (var id in group) {
        var op = group[id]
        var fn = isNaN(id) ? id : op
        if (!fun_body) {
          var _body = op
          op = 'op'
        }
        else {
          var _body = fun_body
        }

        ndp[fn + 'eq'] = (function (op) {
          _body = _body
            .replace('op', op)
            .replace(/true/g, '"_end_1"')
            .replace(/false/g, '"_end_0"')
            .replace(/break1/g, '"_break_1"')
            .replace(/break0/g, '"_break_0"')
            .replace(/sum/g, 'r.sum')
            .replace(/prod/g, 'r.prod')
            .replace(/min/g, 'r.min')
            .replace(/max/g, 'r.max')

          if (!/return/.test(_body)) {
            _body = 'return ' + _body
          }

          var f = new Function('a', 'b', 'r', _body)
          var r = {}

          return function (b) {
            r.sum = 0
            r.prod = 1
            r.min = Infinity
            r.max = -Infinity
            var c = this.map(function () {
              var argu = Array.prototype.slice.call(arguments)
              var a = this.get.apply(this, argu)
              var c = f(a, b, r)
              if (/_end_|_break_|sum|prod|min|max/.test(c)) {
                return c
              }

              argu.push(c)
              this.set.apply(this, argu)
            })

            if (c == '_end_1' || c == '_break_1') {
              return true
            }
            else if (c == '_end_0' || c == '_break_0') {
              return false
            }
            else if (c == 'r.sum') {
              return r.sum
            }
            else if (c == 'r.prod') {
              return r.prod
            }
            else if (c == 'r.min') {
              return r.min
            }
            else if (c == 'r.max') {
              return r.max
            }

            return this
          }
        })(op)

        ndp[fn] = (function (fn) {
          return function (b) {
            var nda = this.clone()
            return nda[fn + 'eq'](b)
          }
        })(fn)
      }
    }

    makeOp({
      assigns: '=',
      add: '+',
      sub: '-',
      mul: '*',
      div: '/',
      mod: '%',
      band: '&',
      bor: '|',
      bxor: '^',
      lshift: '<<',
      rshift: '>>',
      rrshift: '>>>',
      and: '&&',
      or: '||',
      eq: '===',
      neq: '!==',
      lt: '<',
      gt: '>',
      leq: '<=',
      geq: '>='
    }, 'a op b')

    makeOp({
      not: '!',
      bnot: '~',
      neg: '-',
      recip: '1.0/'
    }, 'op a')

    makeOp([
      'abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atan2', 'atanh', 'ceil', 'cos', 'cosh', 'exp', 'floor', 'log', 'log2', 'log10', 'round', 'sin', 'sinh', 'sign', 'sqrt', 'tan', 'tanh', 'random'
    ], 'Math.op(a)')

    makeOp([
      'max', 'min', 'atan2', 'pow'
    ], 'Math.op(a, b)')

    makeOp({
      equals: 'a!=b?false:break1',// Check if two ndarrays are equal
      any: 'a?true:break0',// Check if any element of the array is truthy
      all: 'a?break1:false',// Checks if any element of the array is falsy
      sum: 'sum+=+a;/*console.log(sum,+a)*/;return "sum"',// Sums all elements of the array
      prod: 'prod*=+a;/*console.log(prod,+a)*/;return "prod"',// Multiplies all elements of the array
      norm2squared: 'sum+=a*a;/*console.log(sum,+a)*/;return "sum"',// Computes the squared L2 norm
      norminf: 'if(-a>sum){sum=-a}else if(a>sum){sum=a};return "sum"',// Computes the L:'',//infinity norm
      norm1: 'sum+=a<0?-a:a;return "sum"',// Computs the L1 norm
      sup: 'if(max<a)max=a;return "max"',// Max element in array
      inf: 'if(min>a)min=a;return "min"',// Min element in array
    }, '')
  })()

  ; (function addGemm() {
    ndarray.create.prototype.gemm = function (b, alpha = 1, beta = 0) {
      var a = this
      if (a instanceof ndarray.create &&  //
        b instanceof ndarray.create &&      //
        a.shape.length == 2 &&           //
        b.shape.length == 2 &&              //
        a.shape[1] == b.shape[0]         //
      ) {
        var c = ndarray(new Float32Array(a.shape[0] * b.shape[1]), [a.shape[0], b.shape[1]])
        var sum, prod
        var i = a.shape[0]
        while (i--) {
          var j = b.shape[1]
          while (j--) {
            sum = 0
            var k = b.shape[0]
            while (k--) {
              prod = a.get(i, k) * b.get(k, j)
              sum += alpha == 1 ? prod : prod * alpha
            }
            sum += beta
            c.set(i, j, sum)
          }
        }

        return c
      }
      else {
        console.error('矩阵尺寸不对')
      }
    }
  })()

function setStep(arr, step, fr, to) {
  step = (+step | 0) || 1
  var l = arr.length
  var new_arr = []
  if (step == 1) {
    return arr.slice(0)
  }
  else if (step > 0) {
    fr = fr || 0
    to = to || l
    for (var i = fr; i < to; i += step) {
      arr.hasOwnProperty(i) && new_arr.push(arr[i])
    }
  }
  else if (step < 0) {
    fr = !isNaN(fr) ? (fr + l) % l : l - 1
    to = !isNaN(to) ? (to + l) % l : 0
    for (var i = fr; i >= to; i += step) {
      arr.hasOwnProperty(i) && new_arr.push(arr[i])
    }
  }
  return new_arr
}

function setPick(arr, p, fr, to) {
  if (!isNaN(p) && arr.hasOwnProperty(p)) {
    return [p]
  }
  else if (/\d*:\d*/.test(p)) {
    var s = p.split(':')
    var fr = +s[0]
    var to = +s[1]
    var st = +s[2]
    return setStep(arr, st, fr, to)
  }
  var out = []

  if (typeof (arr) == 'object') {
    for (var i in p) {
      if (p[i] in arr) {
        out.push(p[i])
      }
    }
  }

  return out.length ? out : arr
}

function pack(arr, result) { // ndarray-pack
  var shape = [], c = arr, sz = 1
  while (isArray(c)) {
    shape.push(c.length)
    sz *= c.length
    c = c[0]
  }
  if (shape.length === 0) {
    return ndarray()
  }
  if (!result) {
    result = ndarray(new Float32Array(flatten(arr)), shape)
  }

  return result
}

function flatten(arr, result = []) {
  for (let item of arr) {
    if (isArray(item)) {
      result = flatten(item, result)
    }
    else {
      result = result.concat(arr)
      break
    }
  }
  return result
}

function interp(a, b, r) {
  return a + r * (b - a)
}

function interp1d(arr, x) {
  var ix = Math.floor(x), fx = x - ix, s0 = 0 <= ix && ix < arr.shape[0], s1 = 0 <= ix + 1 && ix + 1 < arr.shape[0], w0 = s0 ? +arr.get(ix) : 0.0, w1 = s1 ? +arr.get(ix + 1) : 0.0
  // return (1.0-fx)*w0 + fx*w1
  return interp(w0, w1, fx)
}

function interp2d(arr, x, y) {
  var ix = Math.floor(x), fx = x - ix, s0 = 0 <= ix && ix < arr.shape[0]
  var s1 = 0 <= ix + 1 && ix + 1 < arr.shape[0], iy = Math.floor(y)
  var fy = y - iy, t0 = 0 <= iy && iy < arr.shape[1], t1 = 0 <= iy + 1 && iy + 1 < arr.shape[1]
  var w00 = s0 && t0 ? arr.get(ix, iy) : 0.0
  var w01 = s0 && t1 ? arr.get(ix, iy + 1) : 0.0
  var w10 = s1 && t0 ? arr.get(ix + 1, iy) : 0.0
  var w11 = s1 && t1 ? arr.get(ix + 1, iy + 1) : 0.0
  // return (1.0-fy) * ((1.0-fx)*w00 + fx*w10) + fy * ((1.0-fx)*w01 + fx*w11)
  var ip = interp
  return ip(ip(w00, w10, fx), ip(w01, w11, fx), fy)
}

function interp3d(arr, x, y, z) {
  var ix = Math.floor(x), fx = x - ix, s0 = 0 <= ix && ix < arr.shape[0]
  var s1 = 0 <= ix + 1 && ix + 1 < arr.shape[0], iy = Math.floor(y), fy = y - iy
  var t0 = 0 <= iy && iy < arr.shape[1], t1 = 0 <= iy + 1 && iy + 1 < arr.shape[1]
  var iz = Math.floor(z), fz = z - iz
  var u0 = 0 <= iz && iz < arr.shape[2], u1 = 0 <= iz + 1 && iz + 1 < arr.shape[2]
  var w000 = s0 && t0 && u0 ? arr.get(ix, iy, iz) : 0.0
  var w010 = s0 && t1 && u0 ? arr.get(ix, iy + 1, iz) : 0.0
  var w100 = s1 && t0 && u0 ? arr.get(ix + 1, iy, iz) : 0.0
  var w110 = s1 && t1 && u0 ? arr.get(ix + 1, iy + 1, iz) : 0.0
  var w001 = s0 && t0 && u1 ? arr.get(ix, iy, iz + 1) : 0.0
  var w011 = s0 && t1 && u1 ? arr.get(ix, iy + 1, iz + 1) : 0.0
  var w101 = s1 && t0 && u1 ? arr.get(ix + 1, iy, iz + 1) : 0.0
  var w111 = s1 && t1 && u1 ? arr.get(ix + 1, iy + 1, iz + 1) : 0.0
  // return (1.0-fz) * ((1.0-fy) * ((1.0-fx)*w000 + fx*w100) + fy * ((1.0-fx)*w010 + fx*w110)) + fz * ((1.0-fy) * ((1.0-fx)*w001 + fx*w101) + fy * ((1.0-fx)*w011 + fx*w111))
  var ip = interp
  return ip(ip(ip(w000, w100, fx), ip(w010, w110, fx), fy), ip(ip(w001, w101, fx), ip(w011, w111, fx), fy), fz)
}

function interpNd(arr) {
  var d = arr.shape.length | 0, ix = [], fx = [], s0 = [], s1 = [], i, t
  for (i = 0; i < d; ++i) {
    t = +arguments[i + 1]
    ix[i] = Math.floor(t)
    fx[i] = t - ix[i]
    s0[i] = 0 <= ix[i] && ix[i] < arr.shape[i]
    s1[i] = 0 <= ix[i] + 1 && ix[i] + 1 < arr.shape[i]
  }
  var r = 0.0, j, w, idx
  i_loop:
  for (i = 0; i < (1 << d); ++i) {
    w = 1.0
    idx = arr.offset
    for (j = 0; j < d; ++j) {
      if (i & (1 << j)) {
        if (!s1[j]) {
          continue i_loop
        }
        w *= fx[j]
        idx += arr.stride[j] * (ix[j] + 1)
      }
      else {
        if (!s0[j]) {
          continue i_loop
        }
        w *= 1.0 - fx[j]
        idx += arr.stride[j] * ix[j]
      }
    }
    r += w * arr.data[idx]
  }
  return r
}

function interpolate(arr, x, y, z) {
  switch (arr.shape.length) {
    case 0:
      return 0.0
    case 1:
      return interp1d(arr, x)
    case 2:
      return interp2d(arr, x, y)
    case 3:
      return interp3d(arr, x, y, z)
    default:
      return interpNd.apply(undefined, arguments)
  }
}

function isnd(a) {
  return a && a.dtype && (a instanceof ndarray.create)
}

// todo
function gemm(a, b, alpha, beta) { //ndarray-gemm

}

function cp(re = 0, im = 0) {

  return {
    re: re,
    im: im
  }
}

function cpAdd(a, b) {
  if (typeof (b) == 'number') {
    return {
      re: a.re + b * 1,
      im: a.im
    }
  }

  return {
    re: a.re + b.re,
    im: a.im + b.im,
  }
}

function cpSub(a, b) {
  return {
    re: a.re - b.re,
    im: a.im - b.im,
  }
}

function cpMul(a, b) {
  sumMul += 4
  if (typeof (b) == 'number') {
    return {
      re: a.re * b,
      im: a.im * b
    }
  }

  // if(T){
  //   return {
  //     re: saveMul(a.re, b.re) - saveMul(a.im, b.im),
  //     im: saveMul(a.re, b.im) + saveMul(a.im, b.re)
  //   }
  // }
  // else{
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re
  }
  // }

}

function cpMulAdd(a, b, c) {
  // sumMul += 4
  // if(typeof (b) == 'number'){
  //   return {
  //     re: a.re * b,
  //     im: a.im * b
  //   }
  // }

  // if(T){
  //   return {
  //     re: saveMul(a.re, b.re) - saveMul(a.im, b.im),
  //     im: saveMul(a.re, b.im) + saveMul(a.im, b.re)
  //   }
  // }
  // else{
  return {
    re: a.re * b.re - a.im * b.im + c.re,
    im: a.re * b.im + a.im * b.re + c.im
  }
  // }

}

var arrMul = {}
var sumMul = 0
var passMul = 0

function saveMul(a, b) {
  if (a == 0 || b == 0) {
    return 0
  }

  var sa = true, sb = true
  if (a < 0) {
    a = -a
    sa = false
  }
  if (b < 0) {
    b = -b
    sb = false
  }

  var s = a + '_' + b
  if (!arrMul[s]) {
    arrMul[s] = a * b
    sumMul++
  }
  else {
    passMul++
  }

  return sa == sb ? arrMul[s] : -arrMul[s]
}

function cpConj(a) {
  return {
    re: a.re,
    im: -a.im
  }
}

function cpRound(cp, n = 0) {
  var size = 10 ** n
  return {
    re: Math.round(cp.re * size) / size || 0,
    im: Math.round(cp.im * size) / size || 0,
  }
}

function almostsame(a, b) {
  var i = a.length
  var E = 1e-3
  while (i--) {
    if (Math.abs(a[i] - b[i]) > E) {
      console.log(i, a[i], b[i])
      return false
    }
  }
  return true
}

function myeval(a) {
  try {
    return eval(a)
  }
  catch (e) {
    return parseInt(a)
  }
}

function keepRound(n, m = 6) {
  if (isNaN(n)) {
    return n
  }
  if (nearZero(n, -m - 2)) {
    return 0
  }

  // if(/99999|00000/.test('' + mid)){
  //   return keepRound(mid)
  // }

  let a = Math.abs(n)
  let b = Math.round(Math.log10(a))
  let c = Math.pow(10, m - b)
  let d = Math.round(n * c) / c
  // console.log(n, a, b, c, d)
  return d
}

function nearZero(n, m = -12) {
  if (isNaN(n)) {
    // console.error('nearZero只查看数字', n)
    return false
  }

  let zero = Math.pow(10, m)
  return Math.abs(n) < zero
}

function createIndex(s, arr) {
  // console.log('createIndex b', s, arr)
  let len = arr.length
  s = s.replace(/end/g, len)
  // 因为结果需要包含end对应的位置
  // 这一步在INDEX过程就已经处理

  let result = []

  if (s == ':') {
    result = arr
  }
  else {

    let a = s.split(':')
    for (let i = a.length - 1; i >= 0; i--) {
      a[i] = eval(a[i])
    }

    let fr, to, step

    if (a.length == 2) {
      fr = a[0] || 0
      fr = fr < 0 ? fr + len : fr
      to = a[1] || len - 1
      to = to < 0 ? to + len : to
      step = 1
    }
    else if (a.length == 3) {
      fr = a[0] || 0
      fr = fr < 0 ? fr + len : fr
      to = a[2] || len - 1
      to = to < 0 ? to + len : to
      step = a[1] || 1
    }

    if (step > 0) {
      for (let i = fr; i <= to; i += step) {
        // if(arr.includes(i)){
        result.push(arr[i])
        // }
      }
    }
    else {
      for (let i = fr; i >= to; i += step) {
        // if(arr.includes(i)){
        result.push(arr[i])
        // }
      }
    }
  }

  // console.log('createIndex a', result)

  return result
}
