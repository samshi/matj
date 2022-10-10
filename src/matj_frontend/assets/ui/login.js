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
    H  : 30,
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
    F: 20,
    L: 120,
    T: 75,
  }).H()

  P.logout_btn = $.C(P, {
    L : 330,
    T : P.account_balance.T_ + 3,
    W : 70,
    PD: '5px 10px',
    I : 'Logout'
  }, 'button').H().down(_ => {
    if(DATA.login == 'plug'){
      window.ic.plug.disconnect()
    }
    DATA = {}
    P_CHANNEL.share.H()
    var P = P_LOGIN

    P.login_plug_img.H()
    P.login_identity_img.H()
    P.account_balance.H()
    P.id_avatar.H()
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

  P.id_avatar = $.C(P, {
    L : 45,
    T : P.account_balance.T_ + 40,
    TS : 300,
    CN: 'avatar'
  }, 'img').H().over(eobj => {
    eobj.S({
      L: 45 - 26,
      T: P.account_balance.T_ + 40 - 26,
      W: 82,
      H: 82,
      Z: 1
    })
  }).out(eobj => {
    eobj.S({
      L : 45,
      T : P.account_balance.T_ + 40,
      W: 30,
      H: 30,
      Z: 0
    })
  })

  P.account = $.C(P, {
    F: 20,
    L: 120,
    T: P.id_avatar.T_ + 0
  }).H()

  P.account_copy = $.C(P, {
    L : P.logout_btn.L_,
    T : P.id_avatar.T_,
    W : 70,
    PD: '5px 10px',
    I : 'Copy'
  }, 'button').H().down(eobj => {
    P_COPY.copyContent(DATA.accountId)
    eobj.I('Copied')

    setTimeout(_ => {
      eobj.I('Copy')
    }, 3000)
  })

  P.avatar = $.C(P, {
    src: 'img/samshi.jpeg',
    L  : 45,
    T  : P.H_ - 20,
    W  : 30,
    H  : 30,
    BR : 20,
    TS : 300,
    BD : '1px solid #444'
  }, 'img').H().over(eobj => {
    eobj.S({
      L: 45 - 26,
      T: P.H_ - 20 - 26,
      W: 82,
      H: 82,
      Z: 1
    })
  }).out(eobj => {
    eobj.S({
      L: 45,
      T: P.H_ - 20,
      W: 30,
      H: 30,
      Z: 0
    })
  })

  P.buymecafe = $.C(P, {
    I : '<img width=24 src="img/cafe.svg" style="display:inline;vertical-align:middle;margin-right:5px;"/> support me on MatJ',
    L : 120,
    W : 250,
    H : 30,
    BR: 20,
    F : 18,
    BD: '1px solid',
    TA: 'center',
    T : P.avatar.T_
  }).H().down(async eobj => {
    let amount = +prompt('you will send author some ICP, change it less or more', 0.1)
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

}

