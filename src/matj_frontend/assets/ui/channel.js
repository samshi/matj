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

  P.LEN       = 10
  P.channels  = {}
  P.share_arr = []
  for(var i = 1; i <= P.LEN; i++){
    var html = LS['channel_name_' + i] ?? 'untitled ' + (i)
    // if(i == P.LEN - 1){
    //   html = 'share file, read only'
    // }

    P.channels[i] = $.C(P, {
      I : html,
      L : 20,
      T : 60 * (i - 1) + 18,
      W : 250,
      H : 40,
      F : 20,
      C : '#000000',
      TA: 'center'
    }, 'button').click(eobj => {
      if(P_CHANNEL.freeze){
        return
      }

      P_CHANNEL.selectChannel(eobj.index)
    })

    P.channels[i].index = i

    P.channels[i].input_component = $.C(P, {
      L : 20,
      T : 60 * (i - 1) + 18,
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
      W: 80,
      H: 30,
      LH: 30,
      F: 16, // BD: '1px solid'
    }).down(eobj => {
      if(eobj.I_ == 'pedding'){
        codeSave(10)
      }
    })

  }

  P.more = $.C(P, {I:'...'}).down(eobj=>{
    P.buttons.toggle().S({
      L:eobj.L_-60,
      T:eobj.T_+50
    })
  })

  P.buttons = $.C(P, {
    L: 20,
    T: P.T_ + P.channels[P.LEN].T_ + P.channels[P.LEN].H_ + 30,
  }).H()

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
    P.buttons.H()
  })

  P.share = $.C(P.buttons, P.rename.CSS_, 'button').S({
    T: 50,
    I: 'share',
  }).H().click(async eobj => {
    let P             = P_CHANNEL
    let channel_index = P.focus_channel || 0

    if(P.share_arr.includes('' + channel_index)){
      await INNER.matj.unshare('' + channel_index)
    }
    else{
      await INNER.matj.share('' + channel_index)
    }

    P.freshShare()

    // let name          = 'channel' + channel_index
    // let share_hash    = encodeShare(principal_str + name)
    // let share_url     = document.location.host + '#' + share_hash
    //
    // copyContent(share_url)
    // eobj.I('Copied')
    //
    // P.qrimg.V().S({src: showQRCode(share_url)})
    //
    // setTimeout(_ => {
    //   eobj.I('share')
    // }, 2000)
  })

  // P.qrimg = $.C(f, {
  //   L : 100,
  //   T : P.buttons.T_ + 50,
  //   W : 202,
  //   H : 202,
  //   BD: '1px solid #e0e0e0'
  // }, 'img').H()

  //=================================================

  P.freshShare = async () => {
    let P             = P_CHANNEL
    let principal_str = DATA.principal + ''
    let sharestr      = await INNER.matj_default.getshare(principal_str)
    console.log(sharestr)
    P.share_arr = sharestr.length == 0 ? [] : sharestr[0].slice(1, -1).split('=_')

    for(let i in P.channels){
      P.channels[i].S({
        BG: P.share_arr.includes('' + i) ? '#a7daf1' : ''
      })
    }

    P.share.I(P.share_arr.includes('' + P.focus_channel) ? 'unshare' : 'share')
  }

  P.selectChannel = n => {
    LS.focus_channel = n
    var code         = LS['channel' + n] || ''
    noOnChange       = true
    P_MATJ.editor.setValue(code)

    P.focus_channel = n

    P.share.I(P.share_arr.includes('' + P.focus_channel) ? 'unshare' : 'share')

    for(let i in P.channels){
      let eobj = P.channels[i]

      eobj.S({
        C: n == eobj.index ? 'red' : ''
      })

      eobj.light.S({
        BG: LS['channel' + eobj.index] ? '#888' : ''
      })
    }



    P.more.S({
      L:P.channels[n].W_ + 150,
      T:P.channels[n].T_
    }).V()
    // if(n == P.LEN - 1){
    //   P.buttons.H()
    // }
    // else{
    //   P.buttons.V()
    // }

    // P.qrimg.H()
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
    let msg_eobj = P.channels[n].msg
    msg_eobj.I(s)
    if(s == 'pedding'){
      msg_eobj.S({
        CS: 'pointer',
      })
    }
    else{
      msg_eobj.S({
        CS: '',
      })
    }
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
    let P             = P_CHANNEL
    let principal_str = DATA.principal + ''

    for(let i = 1; i <= 10; i++){
      (async () => {
        let name = 'channel' + i

        P.setLight(i, 'green')
        P.setMsg(i, 'loading')
        let result = await INNER.matj_default.principalget(principal_str + name)
        // let result = await INNER.matj_default.get(name)
        console.log(Date.now(), principal_str + name, result)
        if(result.length){
          if(!LS[name]){
            LS[name] = result[0] || ''
          }
          else if(result[0] != LS[name]){
            // 本地文件为主
            LS[name + '_r'] = result[0]
            console.warn(name + '_r has different code')
          }
        }
        else{
          delete LS[name + '_r']
        }

        P.checkLight(i)
        P.setMsg(i, LS[name] ? 'loaded' : 'empty')
      })()
    }

    P.freshShare()
  }

  P.afterLogin = ()=>{
    P_CHANNEL.getChannelsCode()
    P_CHANNEL.share.V()
  }
  //一开始就显示所有频道
  P.max()
}