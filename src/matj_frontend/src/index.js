import {Actor, HttpAgent} from '@dfinity/agent'
import {AuthClient} from '@dfinity/auth-client'

// import "../assets/main.css";
let canister_ids = {}

function initCanisterIds(){
  let canisters
  let network

  if(process.env.NODE_ENV === 'production'){
    network   = 'ic'
    canisters = require('../../../canister_ids.json')
  }
  else{
    network   = 'local'
    canisters = require('../../../.dfx/local/canister_ids.json')
  }

  for(const canister in canisters){
    process.env[canister.toUpperCase() + '_CANISTER_ID']  = canisters[canister][network]
    canister_ids[canister.toUpperCase() + '_CANISTER_ID'] = canisters[canister][network]
  }

  console.log(canister_ids)
}

initCanisterIds()

import {matj as matj_default} from "../../declarations/matj";

import {idlFactory as matj_idl} from '../../declarations/matj/matj.did.js'

const matjCreateActor     = async (identity) => {
  const agent = new HttpAgent({identity})
  if(process.env.NODE_ENV !== 'production'){
    await agent.fetchRootKey()
  }
  return Actor.createActor(matj_idl, {
    agent,
    canisterId: canister_ids.MATJ_CANISTER_ID
  })
}
const matjPlugCreateActor = async () => {
  const agent = window.ic.plug.agent
  if(process.env.NODE_ENV !== 'production'){
    await agent.fetchRootKey()
  }
  const actor = await window.ic.plug.createActor({
    canisterId      : canister_ids.MATJ_CANISTER_ID,
    interfaceFactory: matj_idl,
  })

  return actor
}

// ledger
import {ledgerIDL} from '../assets/candid/ledger.did.js'

async function ledgerCreateActor(identity){
  const agent = new HttpAgent({
    identity,
    host: 'ic0.app',
  })

  if(process.env.NODE_ENV !== 'production'){
    await agent.fetchRootKey()
  }

  return Actor.createActor(ledgerIDL, {
    agent,
    canisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
  })
}

//auth
import {principalToAccountAddress, to32bits} from '../assets/js/utils.js'

async function internetIdentity(){
  let authClient = await AuthClient.create()
  console.log('authClient', authClient)
  setTimeout(function(){
    console.log('authClient.login begin')

    authClient.login({
      identityProvider: 'https://identity.ic0.app/',
      onSuccess       : async () => {
        console.log('authClient.login onSuccess')
        // // At this point we're authenticated, and we can get the identity from the auth client:
        // const identity = authClient.getIdentity();
        // // Using the identity obtained from the auth client, we can create an agent to interact with the IC.
        // const agent = new HttpAgent({ identity });
        // // Using the interface description of our webapp, we create an actor that we use to call the service methods.
        // const webapp = Actor.createActor(webapp_idl, {
        //   agent,
        //   canisterId: webapp_id,
        // });
        // // Call whoami which returns the principal (user id) of the current user.
        // const principal = await webapp.whoami();

        var identity          = authClient.getIdentity()
        var principal         = identity.getPrincipal()
        var address           = principalToAccountAddress(principal.toString())
        var authActor_promise = ledgerCreateActor(identity)
        var matj_promise      = matjCreateActor(identity)
        $.E(INNER, {
          identity,
          principal,
          address,
          authActor: await authActor_promise,
          matj     : await matj_promise,
        })

        await window.afterLoginIC()
      },
      onError         : (e) => {
        console.log('authClient.login onError', e)
      }
    })
  }, 1000)
}

window.INNER = {
  internetIdentity,
  matjPlugCreateActor,
  principalToAccountAddress,
  to32bits,
  matj_default
}
