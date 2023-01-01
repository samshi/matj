function createAvatarPage(f){
  var P = window.P_CANVAS = $.C(f, {
    L: -1000,
    W: 202,
    H: 202
  }, 'canvas')

  P.limitColor      = (str) => {
    var color = ''
    for(let i = 0; i < 6; i += 2){
      let n = (Math.floor(parseInt(str.slice(i, i + 2), 16) / 64) * 64 + 0)
      color += ('0' + n.toString(16)).slice(-2)
    }
    return color
  }
  P.accountToAvatar = function(accountId){
    let N     = 2
    let mode  = {
      2: {
        from  : 2,
        step  : 4,
        len   : 15,
        margin: 16
      },
      3: {
        from  : 4,
        step  : 2,
        len   : 28,
        margin: 17
      },
    }[N]
    // console.log(mode)
    var c_str = accountId.slice(0, 3) + accountId.slice(-3)
    var color = P.limitColor(c_str)
    var v     = []
    for(let i = mode.from; i < 64; i += mode.step){
      let s = accountId.slice(i, i + mode.step)
      v.push(parseInt(s, 16) % 2)
    }
    v.length = mode.len

    let CTX = P_CANVAS.CTX;

    CTX.clearRect(0, 0, 202, 202);

    let len       = v.length
    CTX.fillStyle = '#' + color
    var l, t
    var m         = mode.margin
    var w         = (202 - m - m) / (N * 2 + 1)
    let w1        = N + 1

    for(let i = 0; i < len; i++){
      if(v[i]){
        l = m + w * (i % w1)
        t = m + w * ((i / w1) | 0)
        CTX.fillRect(l, t, w, w);
        if(i % w1 != w1 - 1){
          l = m + w * (N * 2 - (i % w1))
          CTX.fillRect(l, t, w, w);
        }
      }
    }

    return CTX.canvas.toDataURL()
  }

  P.principalToAvatar = function(principal_str){
    if(!principal_str){
      return ''
    }
    let accountId = INNER.principalToAccountAddress(principal_str)
    // console.log(principal_str, accountId);
    return P.accountToAvatar(accountId);
  }
}
