let VERSION = 1.0
let W       = window
let LS      = localStorage
let DATA    = {}

W.onresize = function(){
  clearTimeout(W.resize_timer)
  resize_timer = setTimeout(delayResize, 100)
}

function delayResize(){
  W.IW = $.IW()
  W.IH = $.IH()

  RESIZE($.body)
}

$(function(){
  W.main = $.c($.body, {
    W : $.IW() * 1,
    H : $.IH() * 1,
    BG: '#f8f8f8'
  }, 'main')
  login(main)
  createCopyPage(main)
  createChannel(main)
  createJsArea(main)
  createMatjArea(main)
  createOutputArea(main)

  onresize()
  onhashchange()

  // 切换上次的channel
  setTimeout(function(){
    P_CHANNEL.selectChannel(LS.focus_channel || 0)
  }, 100)
})

function RESIZE(eobj){
  if(!eobj){
    // || eobj.isH()
    return
  }

  if(eobj.resize){
    console.log('resize', eobj.ID_)
    eobj.resize(eobj)
  }
  else{
    // console.log('no resize', eobj.ID_)
  }

  if(eobj.CHILDREN){
    eobj.CHILDREN.forEach(function(a){
      RESIZE(a)
    })
  }
}

function principalToAvatar(principal_str, eobj){
  let accountId = INNER.principalToAccountAddress(principal_str)
  console.log(principal_str, accountId);
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
  console.log(mode)
  var v = [accountId.slice(0, 3) + accountId.slice(-3)]
  for(let i = mode.from; i < 64; i += mode.step){
    let s = accountId.slice(i, i + mode.step)
    v.push(parseInt(s, 16) % 2)
  }
  v.length = mode.len
  console.log(v);
  P_CHANNEL.qrimg.V()
  let CANVAS = $.c(P_CHANNEL, {
    W: 202,
    H: 202
  }, 'canvas')
  let CTX    = CANVAS.CTX;

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
  console.log(m, w, w1)
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

  eobj.S({
    src: CTX.canvas.toDataURL(),
    BR : 100,
    BD : '1px solid #e0e0e0'
  })
}
