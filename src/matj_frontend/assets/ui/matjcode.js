function createMatjArea(f){
  var P = P_MATJ = $.C(f, P_JS.CSS_).S({
    id: 'id_matj_area',
    BG: '#900',
  })

  P.zoomin  = $.C(f, {
    I : '+',
    L : 550,
    T : 10,
    PD: '2px 8px',
    BR: 5,
    F : 18,
    BD: '2px solid #900'
  }).down(eobj => {
    P_MATJ.S({
      F: P_MATJ.F_ * 1 + 2
    })
  })
  P.zoomout = $.C(f, {
    I : '-',
    L : 590,
    T : 10,
    PD: '2px 8px',
    BR: 5,
    F : 18,
    BD: '2px solid #900'
  }).down(eobj => {
    P_MATJ.S({
      F: P_MATJ.F_ * 1 - 2
    })
  })

  P.show = $.C(f, {
    I : 'matj code',
    L : 450,
    T : 10,
    PD: '5px 10px',
    BR: 5,
    F : 14,
    BD: '2px solid #900'
  }).down(eobj => {
    console.log('matj')

    $('#id_matj_area').V()
    $('#id_js_area').H()
  })

  P.textarea = $.C(P, {
    id: 'matj_textarea'
  }, 'textarea')

  var option = {
    lineNumbers      : true,
    tabSize          : 2,
    autoCloseBrackets: true,
    autoCloseTags    : true,
    foldGutter       : true,
    lineWrapping     : true,
    gutters          : [
      'breakpoints', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'
    ],
    viewportMargin   : Infinity, // keyMap: 'sublime'
  }

  P.editor = CodeMirror(function(elt){
    var myTextArea = P.textarea.context
    myTextArea.parentNode.replaceChild(elt, myTextArea)
    elt.id    = 'id_matj_mirror'
    P.context = elt
  }, option)

  P.editor.on('change', function(cm, change_obj){
    if(window.noOnChange){
      window.noOnChange = false
      //codeRun() //打开页面，自动填入程序后，是否自动执行
      return
    }

    window.code_changed = true
    let channel_index   = P_CHANNEL.focus_channel || 0
    if(channel_index == 10){
      return
    }

    P_CHANNEL.setLight(channel_index, 'red')
    P_CHANNEL.setMsg(channel_index, 'update')

    clearTimeout(P.timer)
    P.timer = setTimeout(codeSave, 1000)
  })

  $('#id_matj_mirror').S({H: 'calc(100% + 8px'})
}

var timers = []

function codeSave(delay = 60000){
  let channel_index = P_CHANNEL.focus_channel || 0

  let name = 'channel' + channel_index

  let source = P_MATJ.editor.getValue()
  LS[name]   = source

  if(DATA.accountId){
    // 静等60秒后再保存，尽量减少上传次数
    P_CHANNEL.setLight(channel_index, '#f4d71a')
    P_CHANNEL.setMsg(channel_index, 'pedding')
    delete timers[channel_index]
    timers[channel_index] = setTimeout((function(channel_index, name, source){
      return async function(){
        P_CHANNEL.setLight(channel_index, 'green')
        P_CHANNEL.setMsg(channel_index, 'uploading...')
        P_CHANNEL.freeze = true
        let size = await INNER.matj.set(name, source)
        console.log(source.length, size)
        P_CHANNEL.setLight(channel_index, '#888')
        P_CHANNEL.setMsg(channel_index, 'saved')

        P_CHANNEL.freeze = false
      }
    })(channel_index, name, source), delay)
  }
  else{
    P_CHANNEL.setLight(channel_index, '#888')
    P_CHANNEL.setMsg(channel_index, '')
  }
}

function codeRun(){
  window.code_changed = false
  var matj_code       = P_MATJ.editor.getValue()
  var analy_str       = tidy(matj_code)
  setRoot(analy_str)

  var js_code = trans2js(analy_str)
  P_JS.editor.setValue(js_code)

  // P_OUTPUT.run_btn.DOWN()
  var iframe_head = P_OUTPUT.context.contentDocument.head
  if(iframe_head.script_id){
    iframe_head.script_id.R();
  }

  var js_code = 'var t0=Date.now()\n'
  // js_code += 'function runMatJ(){\n'
  js_code += 'window.clearAll && window.clearAll();\n'
  js_code += P_JS.editor.getValue() + '\n'
  // js_code += '}\n'
  // js_code += 'runMatJ()\n'
  js_code += 'showVariable()'

  iframe_head.script_id = $.c($(iframe_head), {
    type: 'text/javascript'
  }, 'script').I(js_code)
}
