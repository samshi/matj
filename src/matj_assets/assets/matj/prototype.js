Number.prototype.add   = function(a){
  if(!(this % 1)){
    //int
    if(isFraction(a)){
      return fraction(this * a.d + a.n, a.d)
    }

    // if(isCompled(a)){
    //
    // }
  }

  return this + a.toNumber()
}
Number.prototype.minus = function(a){
  if(!(this % 1)){
    //int
    if(isFraction(a)){
      return fraction(this * a.d - a.n, a.d)
    }
  }

  return this - a.toNumber()
}
Number.prototype.mul   = function(a){
  if(!(this % 1)){
    //int
    if(isFraction(a)){
      return fraction(this * a.n, a.d)
    }
  }

  return this * a.toNumber()
}
Number.prototype.div   = function(a){
  if(!(this % 1)){
    //int
    if(isFraction(a)){
      return fraction(this * a.d, a.n)
    }

    return fraction(this, a)
  }

  return this / a.toNumber()
}

Number.prototype.toNumber = function(){
  return this
}

String.prototype.toNumber = function(){
  return +this
}

Uint8Array.prototype.type     = 'uint8'
Uint16Array.prototype.type    = 'uint16'
Uint32Array.prototype.type    = 'uint32'
BigUint64Array.prototype.type = 'uint64'
Int8Array.prototype.type      = 'int8'
Int16Array.prototype.type     = 'int16'
Int32Array.prototype.type     = 'int32'
BigInt64Array.prototype.type  = 'int64'

Float32Array.prototype.type = 'single'
Float64Array.prototype.type = 'double'

Number.prototype.type  = 'number'
String.prototype.type  = 'string'
Array.prototype.type   = 'array'
Boolean.prototype.type = 'boolean'

// Array.prototype.unique = function(){
//   for(let i = this.length - 1; i >= 0; i--){
//     if(this.indexOf(this[i]) != i){
//       //说明前面还有同样的值
//       this.splice(i, 1)
//     }
//   }
// }
