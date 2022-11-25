function createMessageArea(f){
  var P = (P_MESSAGE = $.C(f, {
    id: "id_message_area",
    L : P_JS.L_,
    T : P_JS.T_ + main.H_ / 2 + 1,
    W : P_JS.W_,
    H : main.H_ / 2 - P_JS.T_ - 15,
  }))

  P.input_message = $.C(P, {
    L          : 0,
    T          : 20,
    W          : 'calc(100% - 120px)',
    H          : 50,
    PD         : 10,
    placeholder: 'Leave your message '
  }, 'textarea')

  P.confirm = $.C(P, {
    L : 'calc(100% - 82px)',
    T : P.input_message.T_ + (P.input_message.H_ + P.input_message.PD_ * 2 - 32) / 2,
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

  let t          = P.input_message.T_ + P.input_message.H_ + P.input_message.PD_ * 2 + 10
  P.message_area = $.C(P, {
    L  : 0,
    T  : t,
    PDB: 10,
    BD : '#000',
    W  : P.W_ - 2,
    H  : P.H_ - t - 11,
    BG : '#fff',
    O  : 'auto'
  })

  P.wait       = 0
  P.setMessage = async function(action, message){
    let message_file = P.getMessageName()
    let name         = DATA.myname

    if(!/^\w+$/.test(name)){
      alert('name invalid, only accept a-zA-Z_0-9, no space')
      return
    }

    if(LS.myname != name){
      LS.myname = name
    }

    let message_res
    switch(action){
      case 'M':
      case 'D': //donate
      case 'U': //up
      case 'N': //down
        P.wait++
        message_res = await INNER.matj.message(message_file, name, action, message)
        P.wait--
        break
    }

    P.confirm.I('send')

    P.getMessage()
  }

  P.getMessage     = async function(){
    let message_file = P.getMessageName()
    if(!P.wait){
      let all_message  = await INNER.matj_default.getmessage(message_file);
      P.showMessage(all_message[0])
    }
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
  P.showMessage    = function(all_message = ''){
    // motoko let new_message = principalId#"^"#now#"^"#name#"^"#action#"^"#message;
    // add: message_str#"=_"#new_message
    // new: new_message

    let keys = all_message.match(/(\=_)?(\w{5}\-){10}\w\w\w\^\d+\^\w+\^[A-Z]\^/g)
    if(!keys){
      P.message_area.I('')
      return
    }
    let all = [], msg
    let pos
    for(let i = 0, l = keys.length; i < l; i++){
      msg         = keys[i].replace(/^\=_/, '').slice(0, -1).split('^')
      all_message = all_message.slice(keys[i].length)
      pos         = i == l - 1 ? all_message.length : all_message.indexOf(keys[i + 1])
      msg.push(all_message.slice(0, pos))
      all_message = all_message.slice(pos)

      switch(msg[3]){
        case 'U':
          var principalId  = msg[0]
          var target_index = msg[4]
          if(!all[target_index][1][5]){
            all[target_index][1][5] = {}
          }
          all[target_index][1][5][principalId] = (all[target_index][1][5][principalId] || 0) + 1
          break
        case 'N':
          var principalId  = msg[0]
          var target_index = msg[4]
          if(!all[target_index][1][6]){
            all[target_index][1][6] = {}
          }
          all[target_index][1][6][principalId] = (all[target_index][1][6][principalId] || 0) + 1
          break
        default:
          all.push([all.length, msg])
      }
    }

    // console.log(all_message, keys, all)

    all.sort((a, b) => {
      let kau = P.sum(a[1][5])
      let kan = P.sum(a[1][6])
      let kbu = P.sum(b[1][5])
      let kbn = P.sum(b[1][6])
      return kau - kan < kbu - kbn ? 1 : -1
    })

    let s = ''
    for(let i = 0, l = all.length; i < l; i++){
      let [j, [principalId, time, name, action, message, up, down, donate]] = all[i]
      s += '<div class="channel message">'
      s += `<table><tr data-principalId="${principalId}" data-j="${j}" data-i="${i}">`
      s += `<td class="channel_avatar" title="${principalId}">`
      s += `<img class="avatar" onmouseover="P_CHANNEL.large(event)" onmouseout="P_CHANNEL.large()" src="${P_CANVAS.principalToAvatar(principalId)}"/>`
      s += `</td>`
      s += `<td class="sizetime" style="text-align:left;">${name}<br/>${$.getDatetime("dort", time)}</td>`
      s += `<td class="message">${message.replace(/\n/g, '<br/>')}</td>`
      s += `<td class="channel_svg" onclick="P_MESSAGE.up(this)">${SVG.good}<br><span>${P_MESSAGE.sumCnt(up)}</span></td>`;
      s += `<td class="channel_svg" onclick="P_MESSAGE.down(this)">${SVG.bad}<br><span>${P_MESSAGE.sumCnt(down)}</span></td>`;
      s += `<td class="channel_svg" onclick="P_MESSAGE.donate(this)">${SVG.donate}<br><span>${P_MESSAGE.sumCnt(donate)}</span></td>`;

      s += '</tr></table></div>'
    }

    P.message_area.I(s)
    P.all = all
  }

  P.cnt    = function(obj){
    return obj ? Object.keys(obj).length : 0
  }
  P.sum    = function(obj){
    return obj ? Object.values(obj).reduce((x, y) => x + y) : 0
  }
  P.sumCnt = function(obj){
    return obj ? P.sum(obj) + '/' + P.cnt(obj) : ' '
  }
  P.up     = function(node){
    if(!INNER.matj){
      alert('please connect wallet before send up')
      return
    }

    let dataset = node.parentNode.dataset

    P.setMessage('U', dataset.j)
    if(!P.all[dataset.i][1][5]){
      P.all[dataset.i][1][5] = {}
    }
    let principalId                     = DATA.principal + ''
    P.all[dataset.i][1][5][principalId] = (P.all[dataset.i][1][5][principalId] || 0) + 1

    P.update(node, P.all[dataset.i][1][5])

  }
  P.down   = function(node){
    if(!INNER.matj){
      alert('please connect wallet before send down')
      return
    }

    let dataset = node.parentNode.dataset

    P.setMessage('N', dataset.j)
    if(!P.all[dataset.i][1][6]){
      P.all[dataset.i][1][6] = {}
    }
    let principalId                     = DATA.principal + ''
    P.all[dataset.i][1][6][principalId] = (P.all[dataset.i][1][6][principalId] || 0) + 1

    P.update(node, P.all[dataset.i][1][6])
  }

  P.update = function(node, obj){
    node.innerHTML = node.innerHTML.replace(/\<span\>.*\<\/span\>/, d => {
      return `<span>${P.sumCnt(obj)}</span>`
    })
  }
}
