function createAvatarPage(f){
  var P = window.P_CANVAS = $.C(f, {
    L: -1000,
    W: 202,
    H: 202
  }, 'canvas')

  P.accountToAvatar = function(accountId){
    let N    = 2
    let mode = {
      2: {
        from  : 2,
        step  : 4,
        len   : 16,
        margin: 16
      },
      3: {
        from  : 4,
        step  : 2,
        len   : 29,
        margin: 17
      },
    }[N]
    // console.log(mode)
    var v = [accountId.slice(0, 3) + accountId.slice(-3)]
    for(let i = mode.from; i < 64; i += mode.step){
      let s = accountId.slice(i, i + mode.step)
      v.push(parseInt(s, 16) % 2)
    }
    v.length = mode.len

    let CTX = P_CANVAS.CTX;

    // v = [0,1,0,
    //      0,0,1,
    //      1,1,0,
    //      1,0,0,
    //      1,0,0,
    //      'd69b70'
    // ]

    // 1 -> 3 -> 6
    // 2 -> 5 -> 15
    // 3 -> 7 -> 28
    // 4 -> 9 -> 45
    // 5 -> 11 -> 66
    CTX.fillStyle = '#f0f0f0'
    CTX.fillRect(0, 0, 202, 202);

    let len       = v.length
    CTX.fillStyle = '#' + v[0]
    var l, t
    var m         = mode.margin
    var w         = (202 - m - m) / (N * 2 + 1)
    let w1        = N + 1
    // console.log(m, w, w1)
    for(let i = 1; i < len; i++){
      if(v[i]){
        l = m + w * ((i - 1) % w1)
        t = m + w * (((i - 1) / w1) | 0)
        CTX.fillRect(l, t, w, w);
        if((i - 1) % w1 != w1 - 1){
          l = m + w * (N * 2 - ((i - 1) % w1))
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
