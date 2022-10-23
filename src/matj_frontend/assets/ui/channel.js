function createChannel(f){
  var P = W.P_CHANNEL = $.C(f, {
    id: 'channel_box',
    L : 0,
    T : 220,
    W : 388,
    H : '100%',
    // H : 38,//580,
    BG: '#fff',
    PD: 20,
    BR: 5,
    O : 'hidden'
  })

  createTab(P)
  createLocal(P)
  createRemote(P)
  createFavorite(P)
  createPublic(P)


  P.tab.DOWN({
    target_eobj: P.local_tab
  })
}

function createTab(P){
  P.tab = $.C(P, {
    id: 'tab',
    L: 10,
    T: 10,
    F: 18,
    W: 'calc(100% - 20px)', // BG:'gray'
  }).down(eobj => {
    var target    = eobj.target_eobj
    var css_focus = {
      C : '#fff',
      BG: '#000'
    }
    var css_blur  = {
      C : '',
      BG: ''
    }
    P.public_tab.S(target == P.public_tab ? css_focus : css_blur)
    P.local_tab.S(target == P.local_tab ? css_focus : css_blur)
    P.remote_tab.S(target == P.remote_tab ? css_focus : css_blur)
    P.favorite_tab.S(target == P.favorite_tab ? css_focus : css_blur)

    P.local.V(target == P.local_tab)
    P.remote.V(target == P.remote_tab)
    P.public.V(target == P.public_tab)
    P.favorite.V(target == P.favorite_tab)

    if(target == P.public_tab){
      P_CHANNEL.getPublicChannel()
    }
  })

  P.public_tab   = $.C(P.tab, {
    I : 'public',
    L : '50%',
    T : 0,
    W : 'calc(25% - 1px)',
    PD: '5px 0',
    BD: '1px solid #000', // BG:'red',
    TA: 'center'
  })
  P.local_tab  = $.C(P.tab, P.public_tab.CSS_).S({
    I                     : 'local',
    L                     : 0,
    borderTopLeftRadius   : '2em',
    borderBottomLeftRadius: '2em',
  })
  P.remote_tab = $.C(P.tab, P.public_tab.CSS_).S({
    I                      : 'remote',
    L                      : '25%',
  })
  P.favorite_tab = $.C(P.tab, P.public_tab.CSS_).S({
    I                      : 'favorite',
    L                      : '75%',
    borderTopRightRadius   : '2em',
    borderBottomRightRadius: '2em',
  })
}

function createLocal(P){
  P.local = $.C(P, {
    id: 'local',
    L: 0,
    T: 50,
    W: '100%',
    O: 'auto'
  })

  P.LEN      = 16
  P.channels = {}
  P.sharestr = ''

  for(var i = 1; i <= P.LEN; i++){
    var source          = LS['channel' + i]
    let {title, auther, size, time} = P_MATJ.getTitleAuther(source)
    var html            = (title ?? 'untitled ' + (i)) + ' - ' + (auther || '')

    // s += `<table onclick="P_CHANNEL.openlocal(this, event)" class="channel" data-id="local" data-channel="${i}">`
    // s += `<tr>`
    let s = ''
    // s += `<div style="text-align:left;">${auther || 'anonymouse'}</div>`
    s += `<div style="font-weight:bold;width:220px;">${title || 'untitled ' + i}</div>`
    s += `<div style="text-align:right;width:72px;font-size:14px;" >${$.SIZE(size)}</div>`
    s += `<div style="text-align:right;width:90px;font-size:14px;" >${time}</div>`
    // s += `</tr>`
    // s += `</table>`


    P.channels[i] = $.c(P.local, {
      I : s,
      CN: 'channel',
      // L : 20,
      // T : 60 * (i - 1) + 20,
      // W : 250,
      // H : 40,
      // F : 18,
      // C : '#000000',
      // TA: 'center'
    }).click(eobj => {
      // P_CHANNEL.openlocal(eobj)
      if(P_CHANNEL.freeze){
        return
      }

      P_CHANNEL.selectChannel(eobj.index)
    })

    P.channels[i].index = i
  }

  P.selectChannel = n => {
    LS.focus_channel  = n
    var code          = LS['channel' + n] || ''
    P_MATJ.noOnChange = true //不会触发codeSave
    P_MATJ.editor.setValue(code)
    P_MATJ.is_readonly = false
    P_MATJ.show_readonly.I('')

    P.focus_channel = n

    // P.changeButtonText()
    // P.showTitleAuther(code)

    for(let i in P.channels){
      let eobj = P.channels[i]

      eobj.S({
        C: n == eobj.index ? 'red' : ''
      })

      // eobj.light.S({
      //   BG: LS['channel' + eobj.index] ? '#888' : ''
      // })
    }

    // P.more.S({
    //   L: P.channels[n].W_ + 150,
    //   T: P.channels[n].T_
    // }).V()
    //
    // P.moreButtons.H()
  }
  return

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
}

function createRemote(P){
  P.remote = $.C(P, {
    id: 'remote',
    L: 0,
    T: 50,
    W: '100%',
    H: 'calc(100% - 65px)', // BD:'1px solid red',
    O: 'auto'
  })

  P.login_box = $.c(P.remote, {
    // id: 'login_box',
    H: 156
  })

  P.afterLogin = () => {
    P_CHANNEL.getChannelsCode()
    // P_CHANNEL.share.V()
  }

  P.getChannelsCode = () => {
    let P             = P_CHANNEL
    let principal_str = DATA.principal + ''

    for(let i = 1; i <= 10; i++){
      //并行读取所有远程内容
      (async () => {
        let name = 'channel' + i

        // P.setLight(i, 'green')
        // P.setMsg(i, 'loading')
        let result = await INNER.matj_default.principalget(principal_str + name)
        // let result = await INNER.matj_default.get(name)

        let source = result[0] || ''
        console.log(Date.now(), principal_str + name, source)

        let remote_name = 'remote_channel'+i
        if(result.length){
          if(!LS[remote_name]){
            LS[remote_name] = source
          }
          else if(result[0] != LS[remote_name]){
            // 本地文件为主
            LS[remote_name + '_r'] = source
            console.warn(remote_name + '_r has different code')
          }
        }
        else{
          delete LS[remote_name + '_r']
        }

        let info = P_MATJ.getTitleAuther(source)

        let children = P_CHANNEL.remote_channels[i].context.children
        children[0].innerHTML = info.title
        children[1].innerHTML = info.size
        children[2].innerHTML = info.time

        // P.checkLight(i)
        // P.setMsg(i, LS[name] ? 'loaded' : 'empty')
      })()
    }

    // P.freshShare()
  }


  P.RLEN      = 10
  P.remote_channels = {}
  for(var i = 1; i <= P.RLEN; i++){
    // s += `<table onclick="P_CHANNEL.openlocal(this, event)" class="channel" data-id="local" data-channel="${i}">`
    // s += `<tr>`
    let s = ''
    // s += `<div style="text-align:left;">${auther || 'anonymouse'}</div>`
    s += `<div style="font-weight:bold;width:220px;">title</div>`
    s += `<div style="text-align:right;width:72px;font-size:14px;" >size</div>`
    s += `<div style="text-align:right;width:90px;font-size:14px;" >time</div>`
    // s += `</tr>`
    // s += `</table>`

    P.remote_channels[i] = $.c(P.remote, {
      I : s,
      CN: 'channel',
      // L : 20,
      // T : 60 * (i - 1) + 20,
      // W : 250,
      // H : 40,
      // F : 18,
      // C : '#000000',
      // TA: 'center'
    }).click(eobj => {
      if(P_CHANNEL.freeze){
        return
      }

      P_CHANNEL.selectRemoteChannel(eobj.index)
    })

    P.remote_channels[i].index = i

    // P.channels[i].light = $.C(P.remote, {
    //   L : P.channels[i].W_ + 30,
    //   T : P.channels[i].T_ + 10,
    //   W : 20,
    //   H : 20,
    //   BR: 10, // BD: 'gray'
    // })
    //
    // P.channels[i].msg = $.C(P.remote, {
    //   L : P.channels[i].light.L_ + 30,
    //   T : P.channels[i].T_ + 5,
    //   W : 80,
    //   H : 30,
    //   LH: 30,
    //   F : 16, // BD: '1px solid'
    // }).down(eobj => {
    //   if(eobj.I_ == 'pedding'){
    //     P_MATJ.codeSave(10)
    //   }
    // })
  }

  P.selectRemoteChannel = n => {
    LS.focus_remote_channel  = n
    var code          = LS['channel_remote' + n] || ''
    P_MATJ.noOnChange = true //不会触发codeSave
    P_MATJ.editor.setValue(code)
    P_MATJ.is_readonly = false
    P_MATJ.show_readonly.I('')

    P.focus_remote_channel = n

    // P.changeButtonText()
    // P.showTitleAuther(code)

    for(let i in P.remote_channels){
      let eobj = P.remote_channels[i]

      eobj.S({
        C: n == eobj.index ? 'red' : ''
      })

      // eobj.light.S({
      //   BG: LS['channel' + eobj.index] ? '#888' : ''
      // })
    }

    // P.more.S({
    //   L: P.channels[n].W_ + 150,
    //   T: P.channels[n].T_
    // }).V()
    //
    // P.moreButtons.H()
  }

  return
  P.input_component = $.C(P.remote, {
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

  P.more = $.C(P.remote, {I: '...'}).down(eobj => {
    P.moreButtons.toggle().S({
      L: eobj.L_ - 60,
      T: eobj.T_ + 40
    })
  }).H()

  P.moreButtons = $.C(P.remote, {
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

    if(P.checkShare(channel_index)){
      await INNER.matj.unshare('' + channel_index)
    }
    else{
      let source          = P_MATJ.editor.getValue()
      let {title, auther} = P_MATJ.getTitleAuther(source)
      await INNER.matj.share('' + channel_index, title, auther)
    }

    P.freshShare()
  })

  //=================================================

  P.freshShare = async () => {
    let P             = P_CHANNEL
    let principal_str = DATA.principal + ''
    let sharestr      = await INNER.matj_default.getshare(principal_str)
    console.log(sharestr)
    P.sharestr = sharestr.length == 0 ? '' : sharestr[0] //.slice(1, -1).split('=_')

    for(let i in P.channels){
      P.channels[i].S({
        BG: P.checkShare(i) ? '#a7daf1' : ''
      })
    }

    P.changeButtonText()
  }

  P.checkShare = n => {
    return $.F(P.sharestr, '_' + n + '%') || $.F(P.sharestr, '_' + n + '=')
  }



  P.changeButtonText = () => {
    P.share.I(P.checkShare(P.focus_channel) ? 'unshare' : 'share')
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
      auther = '' //LS.auther
    }
    P_CHANNEL.channels[channel_index].I(title + ' - ' + auther)
    // P_CHANNEL.showAuther(auther)

    P_MATJ.setTitleAuther(title, auther)
  }

  P.showAuther = (auther) => {
    P.auther.I(`auther: ${auther || LS.auther || 'anonymous'}`)
  }

  //一开始就显示所有频道
  P.max()
}

function createPublic(P){
  P.public = $.C(P, P.local.CSS_).S({id: 'public'})
  P.allshare = []

  P.showPublic = function(){
    let s  = ''
    P.allshare.forEach(pair => {
      let principalid   = pair[0]
      let sharedchannel = pair[1].slice(1, -1).split('=_')

      sharedchannel.map(channelstr => {
        let [channel, title, auther] = channelstr.split('%')
        let item                     = principalid + 'channel' + channel

        s += `<table onclick="P_CHANNEL.openpublic(this, event)" class="channel" data-id="${principalid}" data-channel="${channel}"><tr>`
        s += `<td width=40><img class="avatar" src="${P_CANVAS.principalToAvatar(principalid)}"/></td>`
        s += `<td>${auther}</td>`
        s += `<th style="text-align:right;">${title}</th>`
        s += `<td style="text-align:right;" width=40>${P.hasFavorite(item) ? SVG.favorite : SVG.unfavorite}</td>`
        s += `</tr></table>`
      })
    })

    P.public.I(s)
  }

  P.getPublicChannel = () => {
    let P = P_CHANNEL;
    if(!window.INNER){
      setTimeout(P.getPublicChannel, 1000)
      return
    }

    P.showPublic()

    ;(async () => {
      P.allshare = await INNER.matj_default.getallshare()
      // P.allshare = [
      //   ['bd2wg-k5qgq-hxlt4-km3ub-65vbo-sm2s2-byexk-vowwq-ubcgi-ocxz3-hae', '_6%charts%samshi=_4%for loop%samshi=_7%factor%samshi='],
      //   ['jxod7-ldlti-mmxc6-rrojx-peixc-vskod-pmv7f-aroz7-wtrys-eq3xg-kqe', '_3%todolist%samshi=']
      // ]
      console.log(P.allshare)

      P.showPublic()
      P.showFavorite()
    })()
  }

  P.openpublic = function(node, event){
    let target
    if(event.target.nodeName == 'svg'){
      target = event.target
    }
    else if(event.target.nodeName == 'path'){
      target = event.target.parentNode
    }
    else if(event.target.firstChild?.nodeName == 'svg'){
      target = event.target.firstChild
    }

    if(target){
      let item = node.dataset.id+'channel'+node.dataset.channel
      if(P.hasFavorite(item)){
        P.removeFavorite(item)
        target.outerHTML = SVG.unfavorite
        console.log('removeFavorite', item)
      }
      else{
        P.addFavorite(item)
        target.outerHTML = SVG.favorite
        console.log('addFavorite', item)
      }

      P.showFavorite()
      return
    }

    P_MATJ.is_readonly = true
    P_MATJ.show_readonly.I('read only')

    let public_file_name = node.dataset.id+'channel'+node.dataset.channel
    ;(async ()=>{
      let result = await INNER.matj_default.principalget(public_file_name)
      P_MATJ.editor.setValue(result[0])
    })();

    var brothers = node.parentNode.childNodes
    brothers.forEach(item =>{
      item.style.background = item == node ? '#eee' : ''
    })
  }

  P.getPublicChannel()
}

function createFavorite(P){
  P.favorite = $.C(P, P.local.CSS_).S({id: 'favorite'})
  P.showFavorite = function(){
    let s  = ''
    P.allshare.forEach(pair => {
      let principalid   = pair[0]
      let sharedchannel = pair[1].slice(1, -1).split('=_')

      sharedchannel.map(channelstr => {
        let [channel, title, auther] = channelstr.split('%')
        let item                     = principalid + 'channel' + channel

        if(P.hasFavorite(item)){
          s += `<table onclick="P_CHANNEL.openpublic(this, event)" class="channel" data-id="${principalid}" data-channel="${channel}"><tr>`
          s += `<td width=40><img class="avatar" src="${P_CANVAS.principalToAvatar(principalid)}"/></td>`
          s += `<td>${auther}</td>`
          s += `<th style="text-align:right;">${title}</th>`
          s += `<td style="text-align:right;" width=40>${SVG.favorite}</td>`
          s += `</tr></table>`
        }
      })
    })

    P.favorite.I(s)
  }
  P.hasFavorite = function(item){
    // console.log(P.favorite_list, item, P.favorite_list.includes(item))
    return P.favorite_list.includes(item)
  }

  P.addFavorite = function(item){
    if(!P.favorite_list.includes(item)){
      P.favorite_list.push(item)
    }
    P.setFavorite()
  }

  P.removeFavorite = function(item){
    var list = []
    P.favorite_list.map(favorite => {
      if(favorite != item){
        list.push(favorite)
      }
    })

    P.favorite_list = list

    P.setFavorite()
  }

  P.setFavorite = function(){
    LS.favorite = JSON.stringify(P.favorite_list)
  }

  P.getFavorite = function(node){
    let list = []
    if(LS.favorite){
      try{
        list = JSON.parse(LS.favorite)
      }
      catch(e){

      }
    }
    return list
  }

  P.favorite_list = P.getFavorite()
}
