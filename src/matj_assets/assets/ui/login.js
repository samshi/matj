function login(f){
  var P = W.P_LOGIN = $.C(f, {
    id: 'login_box',
    L : 0,
    T : 0,
    W : 388,
    H : 178,
    BG: '#fff',
    PD: 20,
    BR: 5,
  })

  $.C(P, {
    L : 0,
    T : 20,
    W : '100%',
    F : 30,
    FF: 'STSongti-SC-Bold, STSongti-SC',
    FW: 'bold',
    C : '#000000',
    TA: 'center',
    I : 'MatJ <span style="font-size:20px;color:#666">a js math library for matlab script</span>'
  })

  P.login_plug_box = $.c(P, {
    MT: 60,
    id: 'login_plug_box',
    T : 100,
    W : 168,
    H : 100,
    PD: 8,
    BR: 10,
    D : 'inline-block',
    TA: 'center',
    I : "",
  }).over(eobj => {
    eobj.S({
      BG: '#eee'
    })
  }).out(eobj => {
    eobj.S({
      BG: ''
    })
  }).down(async _ => {
    var plug_is_connected = await connectPlug()
    if(plug_is_connected){
      connectPlug2()
    }
  })

  P.plug_img = $.c(P.login_plug_box, {
    src: 'img/plug.svg',
    H  : 100
  }, 'img')

  P.login_identity_box = $.c(P, P.login_plug_box.CSS_).S({
    id: 'login_identity_box',
  }).over(eobj => {
    eobj.S({
      BG: '#eee'
    })
  }).out(eobj => {
    eobj.S({
      BG: ''
    })
  }).down(connectIC)

  P.identity_img = $.c(P.login_identity_box, {
    src: 'img/dfinity.png',
    H  : 134,
    MT : -15,
    ML : -5
  }, 'img')

  P.login_plug_img = $.C(P, {
    // F:16,
    L  : 50,
    T  : 75,
    H  : 40,
    src: 'img/plug.svg'
  }, 'img').H()

  P.login_identity_img = $.C(P, {
    // F:16,
    L  : 50,
    T  : 82,
    H  : 20,
    src: 'img/dfinity.svg'
  }, 'img').H()

  P.account_balance = $.C(P, {
    F: 24,
    L: 100,
    T: 75,
  }).H()

  P.logout_btn = $.C(P, {
    L : 330,
    T : P.account_balance.T_ + 3,
    PD: '5px 10px',
    I : 'logout'
  }, 'button').H().down(_ => {
    if(DATA.login == 'plug'){
      window.ic.plug.disconnect()
    }
    DATA = {}
    P_CHANNEL.share.H()
    P_CHANNEL.upload.H()
    var P = P_LOGIN

    P.login_plug_img.H()
    P.login_identity_img.H()
    P.account_balance.H()
    P.account.H()
    P.logout_btn.H()
    P.account_copy.H()
    P.buymecafe.H()
    P.avatar.H()

    P.login_plug_box.V()
    P.login_identity_box.V()

    for(let channel_index in timers){
      delete timers[channel_index]
      P_CHANNEL.setLight(channel_index, '#888')
      P_CHANNEL.setMsg(channel_index, '')
    }
  })

  P.account = $.C(P, {
    F: 20,
    L: 50,
    T: P.account_balance.T_ + 40
  }).H()

  P.account_copy = $.C(P, {
    L : 220,
    T : P.account_balance.T_ + 40,
    PD: '5px 10px',
    I : 'Copy'
  }, 'button').H().down(eobj => {
    copyContent(DATA.accountId)
    eobj.I('Copied')

    setTimeout(_ => {
      eobj.I('Copy')
    }, 3000)
  })

  P.buymecafe = $.C(P, {
    I : 'buy auther cafe',
    L : 60,
    W : 200,
    H : 40,
    LH: 40,
    BR: 20,
    F : 18,
    BD: '1px solid',
    TA: 'center',
    T : P.H_ - 20
  }).H().down(async eobj => {
    let amount = +prompt('you will send auther some ICP, change it less or more', 0.1)
    if(typeof (amount) == 'number' && amount > 0 && amount < DATA.icp_balance){
      let result = await payOwner('359646224d9cd82d26f73cc9dcddbaa041f13ee5802560b65f58db0ed02b8cf2', amount)
      if(result){
        getBalance()
        alert('thanks a lot!')
      }
      else{
        alert('transfer failed')
      }
    }
    else{
      alert('the amount is unavailable')
    }
  })

  P.avatar = $.C(P, {
    src: 'img/samshi.jpeg',
    L  : P.buymecafe.L_ + P.buymecafe.W_ + 30,
    T  : P.buymecafe.T_,
    W  : 42,
    H  : 42,
    BR : 20,
    TS : 300,
    BD : '1px solid #444'
  }, 'img').H().over(eobj => {
    eobj.S({
      L: P.buymecafe.L_ + P.buymecafe.W_ + 10,
      T: P.buymecafe.T_ - 20,
      W: 82,
      H: 82,
    })
  }).out(eobj => {
    eobj.S({
      L: P.buymecafe.L_ + P.buymecafe.W_ + 30,
      T: P.buymecafe.T_,
      W: 42,
      H: 42,
    })
  })
}

