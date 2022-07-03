let VERSION = 1.0
let W       = window
let LS      = localStorage
let DATA    = {}

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
  W.main = $.c($.body, {
    W : $.IW() * 1,
    H : $.IH() * 1,
    BG: '#f8f8f8'
  }, 'main')
  login(main)
  createCopyPage(main)
  createChannel(main)
  createJsArea(main)
  createMatjArea(main)
  createOutputArea(main)

  onresize()
  onhashchange()

  // 切换上次的channel
  setTimeout(function(){
    P_CHANNEL.selectChannel(LS.focus_channel || 0)
  }, 100)
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

