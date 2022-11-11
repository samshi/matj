function createMessageArea(f){
  var P = (P_MESSAGE = $.C(f, {
    id: "id_message_area",
    L : P_JS.L_,
    T : P_JS.T_ + main.H_ / 2 + 1,
    W : P_JS.W_,
    H : main.H_ / 2 - P_JS.T_ - 15,
  }))

  P.input_message = $.C(P, {
    L : 0,
    T : 20,
    W : 'calc(100% - 20px)',
    H : 50,
    PD: 10,
    placeholder: 'Leave your message '
  }, 'textarea')

  P.input_name = $.C(P, {
    L : 'calc(100% - 400px)',
    T : P.input_message.T_ + P.input_message.H_ + P.input_message.PD_ * 2 + 10,
    W : 200,
    F : 16,
    PD: '5px 10px',
    placeholder: 'Leave your name',
    value: LS.myname || ''
  }, 'input')

  P.confirm = $.C(P, {
    L : 'calc(100% - 100px)',
    T : P.input_name.T_,
    W : 80,
    H : 30,
    LH: 30,
    F : 16,
    TA: 'center',
    I : 'send',
    BD: '1px solid',
    BG: '#fff',
    BR: 20
  }).down(async eobj => {
    if(eobj.I_ != 'send'){
      return
    }

    if(!INNER.matj){
      alert('please connect wallet before send message')
      return
    }

    let message = P.input_message.val().trim()
    if(!message){
      alert('message needed')
      return
    }

    eobj.I(`<div style="width:24px;margin:3px 28px;">${SVG.wait}</div>`)
    await P.setMessage('M', message)
    await P.getMessage()
  })

  let t          = P.confirm.T_ + P.confirm.H_ + 10
  P.message_area = $.C(P, {
    L : 0,
    T : t,
    PD: 10,
    BD: '#000',
    W : P.W_ - 21,
    H : P.H_ - t - 21,
    BG: '#fff',
    O : 'auto'
  })

  P.setMessage     = async function(action, message){
    let message_file = P.getMessageName()
    let name = P.input_name.val().trim()

    if(!/^\w+$/.test(name)){
      alert('name invalid')
      return
    }

    if(LS.myname != name){
      LS.myname = name
    }

    let message_res
    switch(action){
      case 'M':
        message_res  = await INNER.matj.message(message_file, name, action, message)
      case 'D': //donate
      case 'U': //zan
    }

    console.log(message_res)

    P.confirm.I('send')
  }
  P.getMessage     = async function(){
    let message_file = P.getMessageName()
    let all_message  = await INNER.matj_default.getmessage(message_file);
    P.showMessage(all_message[0])
  }
  P.getMessageName = function(){
    let message_file
    if(P_MATJ.type == 'remote'){
      message_file = DATA.principal + "" + P_CHANNEL.focus_remote + 'G'
    }
    else if(P_MATJ.type == 'public'){
      message_file = P_MATJ.public_file_name + 'G'
    }

    return message_file
  }
  P.showMessage    = function(all_message){
    // motoko let new_message = principalId#"^"#now#"^"#name#"^"#action#"^"#message;
    // add: message_str#"=_"#new_message
    // new: new_message

    let keys = all_message.match(/(\=_)?(\w{5}\-){10}\w\w\w\^\d+\^\w+\^[A-Z]\^/g)
    if(!keys){
      return
    }
    let all  = []
    let pos0, pos1
    for(let i = 0, l = keys.length; i < l; i++){
      pos1 = all_message.indexOf(keys[i])
      if(pos0){
        all.push(all_message.slice(pos0, pos1))
      }

      all.push(...keys[i].replace(/^\=_/, '').slice(0, -1).split('^'))
      pos0 = pos1 + keys[i].length
    }
    all.push(all_message.slice(pos0))

    let s = ''
    all.forEach((item, index) => {
      if(index % 5 === 0){
        s += '<table><tr>'
        s += `<td><img class="avatar" onmouseover="P_CHANNEL.large(event)" onmouseout="P_CHANNEL.large()" src="${P_CANVAS.principalToAvatar(item)}"/></td>`
      }
      else if(index % 5 === 1){
        s += `<td>${new Date(+item.slice(0, 13)).toLocaleString()}</td>`
      }
      else if(index % 5 === 2){
        s += `<td>${item}</td>`
      }
      else if(index % 5 === 3){
        s += `<td>${item}</td>`
      }
      else if(index % 5 === 4){
        s += `<td>${item}</td>`
        s += '</tr></table>'
      }
    })
    P.message_area.I(s+s+s+s)
  }
}
