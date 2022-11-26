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

  DATA.login     = 'plug'
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

//============================================ IC

async function connectIC(){
  if(window.INNER){
    INNER.internetIdentity()
  }
  else{
    setTimeout(connectIC, 1000)
  }
}

async function afterLoginIC(){
  DATA.principal = INNER.principal
  DATA.accountId = INNER.address
  DATA.login     = 'ic'
  getBalance()
}

async function getBalance(){
  let profile = await INNER.matj_default.getprofile(''+DATA.principal)
  DATA.myname = profile[0]
  while(!DATA.myname){
    DATA.myname = (prompt('Welcome to the MatJ world! please input your name')).trim()
    if(DATA.myname){
      let res = await INNER.matj.profile(DATA.myname)
      console.log(res)
    }
  }

  P_LOGIN.myname.I(DATA.myname)

  P_CHANNEL.afterLogin()

  P_LOGIN.afterLogin()

  if(DATA.login == 'plug'){
    DATA.plug_balance = await myAwait('plug.requestBalance', window.ic.plug.requestBalance, undefined, window.ic.plug)
    DATA.plug_balance?.forEach(item => {
      if(item.symbol == 'ICP'){
        DATA.icp_balance = item.amount
        P_LOGIN.showBalance()
      }
    })
  }
  else{
    var balance = await myAwait('IC balance', INNER.authActor.account_balance_dfx, {account: INNER.address})
    if(balance){
      var num_icp_balance = parseInt(balance.e8s) / 1e8

      DATA.icp_balance = num_icp_balance
      P_LOGIN.showBalance()
    }
    else{
      P.account_balance.I('get balance failed')
      return
    }
  }
}

function shortPrincipal(s){
  return s.slice(0, 5) + '...' + s.slice(-5)
}

async function payOwner(to_address, price){
  // let to_address = INNER.principalToAccountAddress(owner_principal)
  let amount = 100000000 * price

  if(DATA.login == 'plug'){
    const params = {
      to    : to_address,
      amount: amount,
    }

    var plug_result = await myAwait('plug.requestTransfer', window.ic.plug.requestTransfer, params, window.ic.plug)
    console.log('payOwner', price, plug_result)
    if(plug_result.height){
      return plug_result.height
    }
    return 'error'
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
    console.log('payOwner', price, ic_result)
    if(parseInt(ic_result)){
      return parseInt(ic_result)
    }
    return 'error'
  }
}
