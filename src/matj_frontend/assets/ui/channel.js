function createChannel(f){
  var P = W.P_CHANNEL = $.C(f, {
    id: 'channel_box',
    L : 0,
    T : 220,
    W : 388,
    H : 38,//580,
    BG: '#fff',
    PD: 20,
    BR: 5,
    O : 'hidden'
  })
  //   .click(eobj => {
  //   eobj.H_ == 38 ? P.max() : P.min()
  // })

  P.LEN      = 11
  P.channels = []
  for(var i = 0; i < P.LEN; i++){
    // var html      = {0: 'local'}[i] || 'remote ' + i
    var html = LS['channel_name_' + i] ?? 'file' + (i + 1)
    if(i == P.LEN - 1){
      html = 'share file, read only'
    }

    P.channels[i] = $.C(P, {
      L : 20,
      T : 60 * i + 18,
      W : 250,
      H : 40,
      F : 20,
      C : '#000000',
      TA: 'center',
      I : html
    }, 'button').click(eobj => {
      if(P_CHANNEL.freeze){
        return
      }

      P_CHANNEL.selectChannel(eobj.index)
    })

    P.channels[i].index = i

    P.channels[i].input_component = $.C(P, {
      L : 20,
      T : 60 * i + 18,
      W : 400,
      H : 40,
      BG: '#fff',
      Z : 1
    }).H()

    P.channels[i].input  = $.C(P.channels[i].input_component, {
      W : P.channels[i].W_ - 8,
      H : 34,
      F : 20,
      C : '#000000',
      TA: 'center',
    }, 'input')
    P.channels[i].ok     = $.C(P.channels[i].input_component, {
      L    : P.channels[i].W_ + 10,
      W    : 45,
      H    : 38,
      F    : 20,
      I    : 'ok',
      title: i
    }, 'button').click(eobj => {
      let index                   = eobj.TITLE_
      let channel                 = P_CHANNEL.channels[index]
      let new_name                = channel.input.val()
      LS['channel_name_' + index] = new_name
      channel.I(new_name)
      eobj.FATHER.H()
    })
    P.channels[i].cancel = $.C(P.channels[i].input_component, {
      L: P.channels[i].ok.L_ + P.channels[i].ok.W_ + 10,
      W: 75,
      H: 38,
      F: 20,
      I: 'cancle'
    }, 'button').click(eobj => {
      eobj.FATHER.H()
    })

    P.channels[i].light = $.C(P, {
      L : P.channels[i].W_ + 30,
      T : P.channels[i].T_ + 10,
      W : 20,
      H : 20,
      BR: 10, // BD: 'gray'
    })

    P.channels[i].msg = $.C(P, {
      L: P.channels[i].light.L_ + 30,
      T: P.channels[i].T_ + 5,
      W: 100,
      H: 30,
      F: 20, // BD: '1px solid'
    })
  }

  P.buttons = $.C(f, {
    L: 20,
    T: P.T_ + P.channels[P.LEN - 1].T_ + P.channels[P.LEN - 1].H_ + 30,
  })

  P.rename = $.C(P.buttons, {
    W    : 80,
    H    : 40,
    F    : 20,
    C    : '#000000',
    TA   : 'center',
    I    : 'rename',
    title: i
  }, 'button').click(eobj => {
    let P       = P_CHANNEL
    let channel = P.channels[P.focus_channel]
    channel.input_component.toggle()
    channel.input.focusMe().val(channel.I_)
  })

  P.share = $.C(P.buttons, P.rename.CSS_, 'button').S({
    L: 123,
    I: 'share',
  }).H().click(eobj => {
    let principal_str = DATA.principal + ''
    let channel_index = P_CHANNEL.focus_channel || 0
    let name          = 'channel' + channel_index
    let share_hash    = encodeShare(principal_str + name)
    let share_url     = document.location.host + '#' + share_hash

    copyContent(share_url)
    eobj.I('Copied')

    P.qrimg.V().S({src: showQRCode(share_url)})

    setTimeout(_ => {
      eobj.I('share')
    }, 3000)
  })

  P.upload = $.C(P.buttons, {
    L    : 240,
    W    : 140,
    H    : 40,
    F    : 20,
    C    : '#000000',
    TA   : 'center',
    I    : 'upload now',
    title: i
  }, 'button').click(codeSave).H()

  P.qrimg = $.C(f, {
    L : 100,
    T : P.buttons.T_ + 50,
    W : 200,
    H : 200,
    BD: '1px solid'
  }, 'img').H()

  //=================================================

  P.selectChannel = n => {
    LS.focus_channel = n
    var code         = LS['channel' + n] || ''
    noOnChange       = true
    P_MATJ.editor.setValue(code)

    P.focus_channel = n
    P.channels.forEach(eobj => {
      eobj.S({
        C: n == eobj.index ? 'red' : ''
      })

      eobj.light.S({
        BG: LS['channel' + eobj.index] ? '#888' : ''
      })
    })

    if(n == P.LEN - 1){
      P.buttons.H()
    }
    else{
      P.buttons.V()
    }

    P.qrimg.H()
  }

  P.setLight = (n, c) => {
    P.channels[n].light.S({
      BG: c
    })
  }

  P.checkLight = n => {
    let P    = P_CHANNEL
    let eobj = P.channels[n]
    let c    = LS['channel' + eobj.index] ? '#888' : ''
    P.setLight(n, c)
  }

  P.setMsg = (n, s) => {
    P.channels[n].msg.I(s)
  }

  P.max = () => {
    P_CHANNEL.S({
      H: main.H_ - P_CHANNEL.T_ - P_CHANNEL.PD_ * 2
    })
  }
  P.min = () => {
    P_CHANNEL.S({
      H: 38
    })
  }

  P.getChannelsCode = () => {
    (async () => {
      let P             = P_CHANNEL
      let principal_str = DATA.principal + ''
      for(let i = 1, l = P.channels.length; i < 10; i++){
        let name = 'channel' + i
        P.setLight(i, 'green')
        P.setMsg(i, 'loading')
        console.log(Date.now(), principal_str + name)
        let result = await INNER.matj_default.principalget(principal_str + name)
        // let result = await INNER.matj_default.get(name)
        console.log(Date.now(), principal_str + name, result)
        if(!LS[name]){
          LS[name] = result[0] || ''
        }
        else if(result[0] != LS[name]){
          // 本地文件为主
          LS[name + '_r'] = result[0]
          console.warn(name + '_r has different code')
        }

        P.checkLight(i)
        P.setMsg(i, LS[name] ? 'loaded' : 'empty')
      }
    })()
  }

  //一开始就显示所有频道
  P.max()
}

var CODEBASE = []
$(function(){
  for(let i = 0; i < 10; i++){
    (function(i){
      $.get(`/test/test${i}.m`, '', res => {
        if(res){
          CODEBASE[i] = res
          let name    = 'channel' + i
          if(!LS[name]){
            LS[name] = CODEBASE[i]
            let m    = CODEBASE[i].match(/^\%\s*title\s*\=([\w\s]+?)\n/)
            console.log(m)
            if(m && m[1].trim()){
              LS['channel_name_' + i] = m[1].trim()
              if(window.P_CHANNEL){
                let channel = P_CHANNEL.channels[i]
                channel.I(LS['channel_name_' + i])
              }
            }
          }
        }
      })
    })(i)
  }
})

function encodeShare(s){
  let out = ''
  for(let i = 0, l = s.length; i < l; i++){
    let code = s.charCodeAt(i)
    //40-122
    code += i - 40
    code     = code % 83 + 40
    out += String.fromCharCode(code)
  }
  return encodeURI(out)
}

function decodeShare(s){
  s       = decodeURI(s)
  let out = ''
  for(let i = 0, l = s.length; i < l; i++){
    let code = s.charCodeAt(i)
    //40-122
    code += -40 - i
    code     = (code + 83) % 83 + 40
    out += String.fromCharCode(code)
  }
  return out
}

window.onhashchange = async function(){
  if(!window.INNER){
    setTimeout(onhashchange, 200)
    return
  }

  let hash          = document.location.hash.slice(1);
  let share_url     = decodeShare(hash)
  let i             = P_CHANNEL.LEN - 1
  LS['channel' + i] = await INNER.matj_default.principalget(share_url)

  if(LS.focus_channel == i){
    P.selectChannel(i)
  }
}
