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
      let all_message = await INNER.matj_default.getmessage(message_file);
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
    let all = []
    for(let j = 0, l = keys.length; j < l; j++){
      let [principalId, time, auther, action] = keys[j].replace(/^\=_/, '').slice(0, -1).split('^')

      all_message = all_message.slice(keys[j].length)
      let pos     = j == l - 1
                    ? all_message.length
                    : all_message.indexOf(keys[j + 1])
      let msg     = all_message.slice(0, pos)
      let obj     = {
        principalId,
        time,
        auther,
        action,
        msg
      }
      all_message = all_message.slice(pos)

      let i
      switch(action){
        case 'U':
          i = msg
          if(!all[i].up){
            all[i].up = {}
          }
          all[i].up[principalId] = (all[i].up[principalId] || 0) + 1
          break
        case 'N':
          i = msg
          if(!all[i].down){
            all[i].down = {}
          }
          all[i].down[principalId] = (all[i].down[principalId] || 0) + 1
          break
        case 'D':
          let amount, result
          [i, amount, result] = msg.split(' ')
          if(!all[i].donate){
            all[i].donate = {}
          }
          all[i].donate[principalId] = (all[i].donate[principalId] || 0) + amount * 1
          break
        default:
          // all的数量只有留言的数量，up/down/donate信息都嵌入了，比all_message的数量少
          obj.index = all.length
          all.push(obj)
      }
    }

    all.sort((a, b) => {
      let kau = P.sum(a.up)
      let kan = P.sum(a.down)
      let kbu = P.sum(b.up)
      let kbn = P.sum(b.down)
      return kau - kan < kbu - kbn ? 1 : -1
    })

    let s = ''
    for(let i = 0, l = all.length; i < l; i++){
      let { index, principalId, time, auther, action, msg, up, down, donate } = all[i]
      s += '<div class="channel message">'
      // index是自然顺序，不会改变，i是排序后的顺序，会变
      s += `<table><tr data-principalId="${principalId}" data-index="${index}" data-i="${i}">`
      s += `<td class="channel_avatar" title="${principalId}">`
      s += `<img class="avatar" onmouseover="P_CHANNEL.large(event)" onmouseout="P_CHANNEL.large()" src="${P_CANVAS.principalToAvatar(principalId)}"/>`
      s += `</td>`
      s += `<td class="sizetime" style="text-align:left;">${auther}<br/>${$.getDatetime("dort", time)}</td>`
      s += `<td class="message">${msg.replace(/\n/g, '<br/>')}</td>`
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
    return obj ? Object.values(obj).reduce((x, y) => {
      return x + y
    }) : 0
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
    let i       = dataset.i
    let index   = dataset.index

    P.setMessage('U', index)

    if(!P.all[i].up){
      P.all[i].up = {}
    }
    let principalId          = DATA.principal + ''
    P.all[i].up[principalId] = (P.all[i].up[principalId] || 0) + 1

    P.update(node, P.all[i].up)
  }
  P.down   = function(node){
    if(!INNER.matj){
      alert('please connect wallet before send down')
      return
    }

    let dataset = node.parentNode.dataset
    let i       = dataset.i
    let index   = dataset.index

    P.setMessage('N', index)

    if(!P.all[i].down){
      P.all[i].down = {}
    }
    let principalId            = DATA.principal + ''
    P.all[i].down[principalId] = (P.all[i].down[principalId] || 0) + 1

    P.update(node, P.all[i].down)
  }

  P.update = function(node, obj){
    node.innerHTML = node.innerHTML.replace(/\<span\>.*\<\/span\>/, d => {
      return `<span>${P.sumCnt(obj)}</span>`
    })
  }

  P.donate = async function(node){
    let dataset     = node.parentNode.dataset
    let principalId = dataset.principalid; //dataset change key to lowercase
    let account     = INNER.principalToAccountAddress(principalId)
    let amount      = prompt('how much to donate')
    let i           = dataset.i
    let index       = dataset.index
    console.log('donate', principalId, account, amount, P.all[i].auther)
    let result = await payOwner(account, amount);
    console.log(result)

    P.setMessage('D', `${index} ${amount} ${result}`)

    if(!P.all[i].donate){
      P.all[i].donate = {}
    }
    let from_principalId              = DATA.principal + ''
    P.all[i].donate[from_principalId] = (P.all[i].donate[from_principalId] || 0) + amount * 1

    P.update(node, P.all[i].donate)
    getBalance()
  }
}
