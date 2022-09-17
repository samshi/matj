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

  P.auther   = $.C(P, {
    L: 20,
    T: 10,
    F: 18
  })
  P.private  = $.C(P)
  P.faverate = $.C(P)
  P.public   = $.C(P)

  P.LEN       = 10
  P.channels  = {}
  P.share_arr = []
  for(var i = 1; i <= P.LEN; i++){
    var html = LS['channel_name_' + i] ?? 'untitled ' + (i)
    // if(i == P.LEN - 1){
    //   html = 'share file, read only'
    // }

    P.channels[i] = $.C(P.private, {
      I : html,
      L : 20,
      T : 60 * (i - 1) + 58,
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

    P.channels[i].light = $.C(P.private, {
      L : P.channels[i].W_ + 30,
      T : P.channels[i].T_ + 10,
      W : 20,
      H : 20,
      BR: 10, // BD: 'gray'
    })

    P.channels[i].msg = $.C(P.private, {
      L : P.channels[i].light.L_ + 30,
      T : P.channels[i].T_ + 5,
      W : 80,
      H : 30,
      LH: 30,
      F : 16, // BD: '1px solid'
    }).down(eobj => {
      if(eobj.I_ == 'pedding'){
        P_MATJ.codeSave(10)
      }
    })
  }

  P.input_component = $.C(P.private, {
    L : 20,
    W : 400,
    H : 40,
    BG: '#fff',
    Z : 1
  }).H()

  P.input  = $.C(P.input_component, {
    W : P.channels[1].W_ - 8,
    H : 34,
    F : 20,
    C : '#000000',
    TA: 'center',
  }, 'input').keydown(eobj => {
    if(eobj.KEYCODE == 13){
      P.ok.CLICK(P.ok)
    }
    else if(eobj.KEYCODE == 27){
      P.cancel.CLICK(P.cancel)
    }
  }, 1)
  P.ok     = $.C(P.input_component, {
    L    : P.channels[1].W_ + 10,
    W    : 45,
    H    : 38,
    F    : 20,
    I    : 'ok',
    title: i
  }, 'button').click(eobj => {
    let index                   = P.focus_channel
    let new_title               = P.input.val()
    LS['channel_name_' + index] = new_title
    P.channels[index].I(new_title)

    let source          = P_MATJ.editor.getValue()
    let {title, auther} = P_MATJ.getTitleAuther(source)
    console.log(title, auther);

    if(!title && !auther){
      P_MATJ.addTitleAuther(new_title, LS.auther || '')
    }
    else{
      P_MATJ.setTitleAuther(new_title, auther || LS.auther || '')
    }

    eobj.FATHER.H()
  })
  P.cancel = $.C(P.input_component, {
    L: P.ok.L_ + P.ok.W_ + 10,
    W: 75,
    H: 38,
    F: 20,
    I: 'cancle'
  }, 'button').click(eobj => {
    eobj.FATHER.H()
  })

  P.more = $.C(P.private, {I: '...'}).down(eobj => {
    P.moreButtons.toggle().S({
      L: eobj.L_ - 60,
      T: eobj.T_ + 40
    })
  }).H()

  P.moreButtons = $.C(P.private, {
    // L: 20,
    // T: P.T_ + P.channels[P.LEN].T_ + P.channels[P.LEN].H_ + 30,
    PD: 4,
    BG: '#eee'
  }).H()

  P.rename = $.c(P.moreButtons, {
    W    : 80,
    H    : 40,
    F    : 20,
    C    : '#000000',
    TA   : 'center',
    I    : 'rename',
    title: i
  }, 'button').click(eobj => {
    let P     = P_CHANNEL
    let index = P.focus_channel
    P.input_component.toggle().S({
      T: P.channels[index].T_
    })
    P.input.focusMe().val(P.channels[index].I_)
    P.moreButtons.H()
  })

  P.share = $.c(P.moreButtons, P.rename.CSS_, 'button').S({
    // T: 50,
    I: 'share'
  }).H().click(async eobj => {
    let P             = P_CHANNEL
    let channel_index = P.focus_channel

    if(P.share_arr.includes('' + channel_index)){
      await INNER.matj.unshare('' + channel_index)
    }
    else{
      await INNER.matj.share('' + channel_index)
    }

    P.freshShare()
  })

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

    P.changeButtonText()
  }

  P.selectChannel = n => {
    LS.focus_channel = n
    var code         = LS['channel' + n] || ''
    noOnChange       = true //不会触发codeSave
    P_MATJ.editor.setValue(code)

    P.focus_channel = n

    P.changeButtonText()
    P.showTitleAuther(code)

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
      L: P.channels[n].W_ + 150,
      T: P.channels[n].T_
    }).V()

    P.moreButtons.H()
  }

  P.changeButtonText = () => {
    P.share.I(P.share_arr.includes('' + P.focus_channel) ? 'unshare' : 'share')
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
      //并行读取所有远程内容
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

  P.afterLogin = () => {
    P_CHANNEL.getChannelsCode()
    P_CHANNEL.share.V()
  }

  P.showTitleAuther = source => {
    let channel_index   = P_CHANNEL.focus_channel
    let {title, auther} = P_MATJ.getTitleAuther(source)
    console.log(title, auther)
    title = title || `untitled ${channel_index}`
    if(auther != ''){
      LS.auther = auther
    }
    else if(LS.auther){
      auther = LS.auther
    }
    P_CHANNEL.channels[channel_index].I(title)
    P_CHANNEL.showAuther(auther)

    P_MATJ.setTitleAuther(title, auther)
  }

  P.showAuther = (auther) => {
    P.auther.I(`auther: ${auther || LS.auther || 'anonymous'}`)
  }
  //一开始就显示所有频道
  P.max()
}