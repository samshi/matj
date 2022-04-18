let VERSION = 1.0
let W       = window
let LS = localStorage
let DATA = {
}

W.onresize = function(){
  clearTimeout(W.resize_timer)
  resize_timer = setTimeout(delayResize, 100)
}

function delayResize(){
  W.IW = $.IW()
  W.IH = $.IH()

  RESIZE($.body)
}

$(function(){
  W.main = $.c($.body,{
    W:$.IW()*1,
    H:$.IH()*1,
    BG: '#f8f8f8'
  }, 'main')
  login(main)
  createCopyPage(main)
  createChannel(main)
  createJsArea(main)
  createMatjArea(main)
  createOutputArea(main)
  // part_copy()
  // part_pop()
  // part_msg()
  // part_banner()
  //
  // page_collection()
  // page_create()
  // page_detail()
  // page_market()
  // page_profile()
  // page_settings()
  // page_states()

  onresize()

  // 切换上次的channel
  if(LS.focus_channel){
    setTimeout(function(){
      P_CHANNEL.selectChannel(LS.focus_channel)
    }, 100)
  }
})

function RESIZE(eobj){
  if(!eobj){
    // || eobj.isH()
    return
  }

  if(eobj.resize){
    console.log('resize', eobj.ID_)
    eobj.resize(eobj)
  }
  else{
    // console.log('no resize', eobj.ID_)
  }

  if(eobj.CHILDREN){
    eobj.CHILDREN.forEach(function(a){
      RESIZE(a)
    })
  }
}

