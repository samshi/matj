function createMessageArea(f){
  const P = (P_MESSAGE = $.C(f, {
    id: "id_message_area",
    L : P_JS.L_,
    T : P_JS.T_ + main.H_ / 2 + 1,
    W : P_JS.W_,
    H : main.H_ / 2 - P_JS.T_ - 15,
    Z : 30
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
          if(!all[i].U){
            all[i].U = {}
          }

          if(!all[i].U[principalId]){
            all[i].U[principalId] = []
          }
          all[i].U[principalId].push(obj) //= (all[i].U[principalId] || 0) + 1
          break
        case 'N':
          i = msg
          if(!all[i].N){
            all[i].N = {}
          }

          if(!all[i].N[principalId]){
            all[i].N[principalId] = []
          }
          all[i].N[principalId].push(obj)

          // all[i].N[principalId] = (all[i].N[principalId] || 0) + 1
          break
        case 'D':
          let amount, result
          [i, amount, result] = msg.split(' ')
          obj.amount          = +amount
          obj.result          = result
          if(!all[i].D){
            all[i].D = {}
          }

          if(!all[i].D[principalId]){
            all[i].D[principalId] = []
          }
          all[i].D[principalId].push(obj)

          // all[i].D[principalId] = (all[i].D[principalId] || 0) + amount * 1
          break
        default:
          // all的数量只有留言的数量，U/N/donate信息都嵌入了，比all_message的数量少
          obj.index = all.length
          all.push(obj)
      }
    }

    all.sort((a, b) => {
      let kau = P.total(a.U)
      let kan = P.total(a.N)
      let kbu = P.total(b.U)
      let kbn = P.total(b.N)
      return kau - kan < kbu - kbn ? 1 : -1
    })

    let s = ''
    for(let i = 0, l = all.length; i < l; i++){
      let {
            index,
            principalId,
            time,
            auther,
            action,
            msg,
            U,
            N,
            D
          } = all[i]
      s += '<div class="channel message">'
      // index是自然顺序，不会改变，i是排序后的顺序，会变
      s += `<table><tr data-principalId="${principalId}" data-index="${index}" data-i="${i}">`
      s += `<td class="channel_avatar" title="${principalId}">`
      s += `<img class="avatar" onmouseover="P_CHANNEL.large(event)" onmouseout="P_CHANNEL.large()" src="${P_CANVAS.principalToAvatar(principalId)}"/>`
      s += `</td>`
      s += `<td class="sizetime" style="text-align:left;">${auther}<br/>${$.getDatetime("dort", time)}</td>`
      s += `<td class="message">${msg.replace(/\n/g, '<br/>')}</td>`
      s += `<td class="channel_svg" onclick="P_MESSAGE.click(this)" onmouseover="P_MESSAGE.over(this, event)" onmouseout="P_MESSAGE.out(this)" data-act="U">${SVG.U}<br><span>${P_MESSAGE.totalCnt(U)}</span></td>`;
      s += `<td class="channel_svg" onclick="P_MESSAGE.click(this)" onmouseover="P_MESSAGE.over(this, event)" onmouseout="P_MESSAGE.out(this)" data-act="N">${SVG.N}<br><span>${P_MESSAGE.totalCnt(N)}</span></td>`;
      s += `<td class="channel_svg" onclick="P_MESSAGE.click(this)" onmouseover="P_MESSAGE.over(this, event)" onmouseout="P_MESSAGE.out(this)" data-act="D">${SVG.D}<br><span>${P_MESSAGE.totalCnt(D)}</span></td>`;

      s += '</tr></table></div>'
    }

    P.message_area.I(s)
    P.all = all
  }

  P.cnt      = function(obj){
    return obj ? Object.keys(obj).length : 0
  }
  P.total    = function(obj){
    let total = 0
    for(let principalId in obj){
      total += P.sum(obj[principalId])
    }
    return total
  }
  P.sum      = function(arr){
    return arr.reduce((x, y) => {
      return x + (y.amount || 1)
    }, 0)
  }
  P.totalCnt = function(obj){
    return obj ? P.total(obj) + '/' + P.cnt(obj) : ' '
  }
  P.click    = async function(node){
    if(!INNER.matj){
      alert('please connect wallet first')
      return
    }

    let act     = node.dataset.act
    let dataset = node.parentNode.dataset
    let i       = dataset.i
    let index   = dataset.index

    let principalId = DATA.principal + ''
    let obj         = P.all[i][act] || {}

    if(act === 'D'){
      let to_principalId = dataset.principalid; //dataset change key to lowercase
      let account        = INNER.principalToAccountAddress(to_principalId)
      let amount         = prompt('how much to D')
      let result         = await payOwner(account, amount);
      getBalance()

      P.setMessage(act, `${index} ${amount} ${result}`)
      obj[principalId] = (obj[principalId] || 0) + amount * 1
    }
    else{
      P.setMessage(act, index)
      obj[principalId] = (obj[principalId] || 0) + 1
    }
    P.update(node, obj)
    P.all[i][act] = obj
  }

  P.update = function(node, obj){
    node.innerHTML = node.innerHTML.replace(/\<span\>.*\<\/span\>/, d => {
      return `<span>${P.totalCnt(obj)}</span>`
    })
  }

  P.floatbox = $.C(P, {
    id            : 'floatbox',
    D             : 'flex',
    flexWrap      : 'wrap',
    justifyContent: 'space-around',
    maxWidth      : '160px',
    BG            : '#fff',
    BD            : '#888',
    PD            : 3,
    BR            : 20,
    F             : 12,
    alignItems    : 'center'
  }).H()

  P.over = function(node, e){
    let P = P_MESSAGE
    clearTimeout(P.timer)
    if(P.floatbox.isV() && P.node === node){
      return
    }

    P.node      = node
    let act     = node.dataset.act
    let dataset = node.parentNode.dataset
    let i       = dataset.i

    if(!P.all[i][act]){
      P.out()
    }

    let s = ''
    for(let principalId in P.all[i][act]){
      s += `<div style="display:inline-block; padding:2px 5px;text-align:center;"><img class="avatar" src="${P_CANVAS.principalToAvatar(principalId)}"/>` + '<span>' + P.all[i][act][principalId][0].auther + '<br>' + (P.sum(P.all[i][act][principalId]) || '') + '</span></div>'
    }

    const pos = node.getBoundingClientRect()
    P.floatbox.V().S({
      A: 0.01,
      I: s //[s, s, s, s, s, s, s, s, s, s, s, s].slice(0, Math.floor(Math.random()*12)).join('')
    })

    setTimeout(() => {
      let P              = P_MESSAGE
      const clientWidth  = P.floatbox.context.clientWidth
      const clientHeight = P.floatbox.context.clientHeight
      s && P.floatbox.S({
        L: pos.left - P.L_ - clientWidth / 2 + 16,
        T: pos.top - P.T_ - clientHeight - 10,
        A: 1
      })
    }, 200)

  }
  P.out  = function(node, e){
    let P   = P_MESSAGE
    P.timer = setTimeout(() => {
      P_MESSAGE.floatbox.H()
    }, 2)
  }
}
