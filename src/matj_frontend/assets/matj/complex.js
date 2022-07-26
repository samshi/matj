function complex(re, im){
  if(Math.abs(im) < 2e-16){
    return re
  }

  return new Complex(re, im)
}

function Complex(re, im){
  if(isNaN(re) || isNaN(im)){
    throw new TypeError()
  }

  this.r = keepZero(re)
  this.i = keepZero(im)
}

//当前复数对象加上另外一个复数，并返回一个新的计算和值后的复数对象
Complex.prototype.add = function(that){
  return complex(this.r + that.r, this.i + that.i)
}

//当前复数对象减去另外一个复数，并返回一个新的计算和值后的复数对象
Complex.prototype.minus = function(that){
  return complex(this.r - that.r, this.i - that.i)
}

//当前复数乘以另外一个复数，并返回一个新的计算乘积之后的复数对象
Complex.prototype.mul = function(that){
  return complex(this.r * that.r - this.i * that.i, this.r * that.i + this.i * that.r)
}

//当前复数除以另外一个复数，并返回一个新的计算相除之后的复数对象
Complex.prototype.div = function(that){
  var mag = that.mag()
  var re  = this.r * that.i + this.i * that.r
  var im  = this.i * that.r - this.r * that.i
  return complex(re / mag, im / mag)
}

//计算复数的模，复数的模定义为原点（0,0）到复平面的距离
Complex.prototype.mag = function(){
  return Math.sqrt(this.r * this.r + this.i * this.i)
}

//检查当前复数对象是否和另外一个复数值相等
Complex.prototype.equals = function(that){
  return that != null &&                    //必须有定义且不为null
    that.constructor === Complex &&           //并且必须是Complex实例
    this.r === that.r && this.i === that.i   //并且必须包含相同的值
}

//返回当前复数的共轭复数
Complex.prototype.conj = function(){
  return complex(this.r, -this.i)
}

//返回当前复数的共轭复数
Complex.prototype.toString = function(){
  return this.r + (this.i > 0 ? ' + ' : ' - ') + Math.abs(this.i) + 'i'
}
