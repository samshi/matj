function fraction(numerator, denominator){ // 分子分母
  if(!denominator){
    console.error('denominator zero')
    return 'denominator zero'
  }

  if(!numerator){
    return 0
  }

  let f = new Fraction(numerator, denominator)

  if(f.d == 1){
    return f.n
  }

  return f
}

function Fraction(n, d){
  if(isNaN(n) || isNaN(d) || !d){
    throw new TypeError()
  }

  this.n = d > 0 ? n : -n
  this.d = d > 0 ? d : -d

  return this.reduction()
}

// 约分 reduction
Fraction.prototype.reduction = function(){
  let gcd = this.gcd(this.n, this.d)
  this.n /= gcd
  this.d /= gcd

  return this
}

//最大公约数 greatest common divisor
Fraction.prototype.gcd = function(a, b){
  a       = Math.abs(a)
  b       = Math.abs(b)
  let max = Math.max(a, b)
  let min = Math.min(a, b)
  while(1){
    if(!min){
      return max
    }
    [max, min] = [min, max % min]
  }
}

//最小公倍数 Least common multiple
Fraction.prototype.lcm = function(a, b){
  let gcd = this.gcd(a, b)
  return a / gcd * b
}

// lcm 及各自的倍数
Fraction.prototype.lcm_r = function(a, b){
  let gcd = this.gcd(a, b)
  let r1  = a / gcd
  let r2  = b / gcd
  return [r1 * b, r1, r2]
}

//当前分数对象加上另外一个分数对象，并返回一个新的计算后的分数对象
Fraction.prototype.add = function(b){
  if(typeof (b) == 'number'){
    return fraction(this.n + b * this.d, this.d)
  }

  let [lcm, r1, r2] = this.lcm_r(this.d, b.d) //减少溢出的风险
  let n             = this.n * r2 + b.n * r1
  return fraction(n, lcm)
}

//当前分数对象减去另外一个分数对象，并返回一个新的计算后的分数对象
Fraction.prototype.minus = function(b){
  if(typeof (b) == 'number'){
    return fraction(this.n - b * this.d, this.d)
  }

  let [lcm, r1, r2] = this.lcm_r(this.d, b.d) //减少溢出的风险
  let n             = this.n * r2 - b.n * r1
  return fraction(n, lcm)
}

//当前分数对象乘以另外一个分数对象，并返回一个新的计算后的分数对象
Fraction.prototype.mul = function(b){
  if(typeof (b) == 'number'){
    return fraction(this.n * b, this.d)
  }

  return fraction(this.n * b.n, this.d * b.d)
}

//当前分数对象除以另外一个分数对象，并返回一个新的计算后的分数对象
Fraction.prototype.div = function(b){
  if(typeof (b) == 'number'){
    return fraction(this.n, this.d * b)
  }

  return fraction(this.n * b.d, this.d * b.n)
}

//返回当前分数的字符串表示
Fraction.prototype.toNumber = function(){
  return this.n / this.d
}

//返回当前分数的字符串表示
Fraction.prototype.toString = function(){
  return this.n + '/' + this.d
}
