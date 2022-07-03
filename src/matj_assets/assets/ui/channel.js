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

  P.channels = []
  for(var i = 0; i < 10; i++){
    // var html      = {0: 'local'}[i] || 'remote ' + i
    var html      = LS['channel_name_' + i] ?? 'file' + (i + 1)
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

  P.rename = $.C(f, {
    L    : 50,
    T    : P.T_ + P.channels[9].T_ + P.channels[9].H_ + 50,
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

  P.upload = $.C(f, {
    L    : 200,
    T    : P.rename.T_,
    W    : 200,
    H    : 40,
    F    : 20,
    C    : '#000000',
    TA   : 'center',
    I    : 'upload remote now',
    title: i
  }, 'button').click(codeSave).H()

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
      H: 580
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
      for(let i = 1; i < 10; i++){
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
                let channel             = P_CHANNEL.channels[i]
                channel.I(LS['channel_name_' + i])
              }

            }
          }
        }
      })
    })(i)
  }
})

