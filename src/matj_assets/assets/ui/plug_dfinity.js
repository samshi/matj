async function connectPlug(){
  if(!window?.ic?.plug){
    alert('plug extension not install')
    return
  }
  console.log(window.ic.plug && 'Plug and play!')

  const nnsCanisterId     = 'qoctq-giaaa-aaaaa-aaaea-cai'
  DATA.whitelist          = [
    // nnsCanisterId,
    'rrkah-fqaaa-aaaaa-aaaaq-cai',  //MATJONIC_CANISTER_ID mac27 local
    'yl3mt-iaaaa-aaaam-aaava-cai',  //MATJONIC_CANISTER_ID network
  ]
  const plug_is_connected = await myAwait('plug requestConnect', window?.ic?.plug?.requestConnect, {
    whitelist: DATA.whitelist,
    host     : /ic0\.app/.test(location.href) ? 'https://boundary.ic0.app' : 'http://localhost:8000'
  }, window?.ic?.plug)

  const connectionState = plug_is_connected ? 'allowed' : 'denied'
  console.log(`The Connection was ${connectionState}!`, plug_is_connected)

  return plug_is_connected
}

async function connectPlug2(){
  if(!window.INNER){
    setTimeout(connectPlug2, 1000)
    return
  }
  INNER.identity = ic.plug.agent
  DATA.isplug    = true

  DATA.principal = await myAwait('plug.getPrincipal', window.ic.plug.agent.getPrincipal, undefined, window.ic.plug.agent)

  DATA.accountId = INNER.principalToAccountAddress(DATA.principal + '')

  connectPlug3()

}

async function connectPlug3(){
  if(!await window.ic.plug.isConnected()){
    console.log(timeFormat(), 'await plug.isConnected')
    setTimeout(connectPlug3, 200)
    return
  }

  INNER.matj = await myAwait('matjPlugCreateActor', INNER.matjPlugCreateActor)
  getBalance()
}

async function connectIC(){
  if(window.INNER){
    INNER.internetIdentity()
  }
  else{
    setTimeout(connectIC, 1000)
  }
}

async function afterLogin(){
  DATA.principal = INNER.principal
  DATA.accountId = INNER.address
  DATA.isic      = true
  await getBalance()
}

async function getBalance(){
  P_CHANNEL.upload.V()

  P_LOGIN.login_plug_box.H()
  P_LOGIN.login_identity_box.H()
  P_CHANNEL.max()

  P_CHANNEL.getChannelsCode()

  var balance_str

  if(DATA.isplug){
    DATA.plug_balance = await myAwait('plug.requestBalance', window.ic.plug.requestBalance, undefined, window.ic.plug)
    DATA.plug_balance?.forEach(item => {
      if(item.symbol == 'ICP'){
        balance_str      = item.amount + ' ICP'
        DATA.icp_balance = item.amount
      }
    })
  }
  else{
    var balance         = await myAwait('IC balance', INNER.authActor.account_balance_dfx, {account: INNER.address})
    var num_icp_balance = parseInt(balance.e8s) / 1e8

    DATA.icp_balance = num_icp_balance
    balance_str      = num_icp_balance + ' ICP'
  }

  console.log(balance_str)

  var s = DATA.isplug ? 'Plug' : DATA.isic ? 'Dfinity' : 'fail'
  if(s != 'fail'){
    s += ': ' + (balance_str || 'get balance faild')
    s += '<br>' + shortPrincipal(DATA.accountId)
  }

  P_LOGIN.account_balance.V().S({
    I    : s,
    title: DATA.accountId,
  })
  P_LOGIN.account_copy.V()

  P_LOGIN.buymecafe.V()
  P_LOGIN.avatar.V()

  // var abc = await INNER.matj.who()
  // console.log(abc+'')
  //
  //
  // var zzz = await INNER.matj.get('aaa')
  // console.log(zzz)
  //
  // var aaa = await INNER.matj.set('aaa', new Date().toLocaleTimeString())
  // console.log(aaa)
  //
  // var bbb = await INNER.matj.get('aaa')
  // console.log(bbb)
}

function shortPrincipal(s){
  return s.slice(0, 5) + '...' + s.slice(-5)
}

async function payOwner(to_address, price){
  // let to_address = INNER.principalToAccountAddress(owner_principal)
  let amount     = 100000000 * price

  if(DATA.isplug){
    const params = {
      to    : to_address,
      amount: amount,
    }

    var plug_result = await myAwait('plug.requestTransfer', window.ic.plug.requestTransfer, params, window.ic.plug)
    if(plug_result.height){
      return true
    }
  }
  else{
    var args = {
      'to'             : to_address,
      'fee'            : {'e8s': 10000},
      'memo'           : 0,
      'from_subaccount': [Array(28).fill(0).concat(INNER.to32bits(0))],
      'created_at_time': [],
      'amount'         : {'e8s': amount},
    }

    var ic_result = await myAwait('authActor.send_dfx', INNER.authActor.send_dfx, args)
    if(parseInt(ic_result)){
      return true
    }
  }
}
