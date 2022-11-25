function createMatjArea(f){
  var P = (P_MATJ = $.C(f, P_JS.CSS_).S({
    id: "id_matj_area",
    BG: "#000",
  })).V();

  P.show_mat_code_button = $.C(f, {
    I : "matj code",
    L : 450,
    T : 10,
    PD: "5px 10px",
    BR: 5,
    F : 14,
    BD: "2px solid #900",
  }).down((eobj) => {
    console.log("matj");

    $("#id_matj_area").V();
    $("#id_js_area").H();
  });

  P.zoomin = $.C(f, {
    I : "+",
    L : 550,
    T : 10,
    PD: "2px 8px",
    BR: 5,
    F : 18,
    BD: "2px solid #900",
  }).down((eobj) => {
    P_MATJ.S({
      F: P_MATJ.F_ * 1 + 2,
    });
  });

  P.zoomout = $.C(f, {
    I : "-",
    L : 590,
    T : 10,
    PD: "2px 8px",
    BR: 5,
    F : 18,
    BD: "2px solid #900",
  }).down((eobj) => {
    P_MATJ.S({
      F: P_MATJ.F_ * 1 - 2,
    });
  });

  P.copy_content = $.C(f, {
    L    : 630,
    T    : 20,
    W    : 24,
    src  : 'img/document-copy.svg',
    title: 'copy file'
  }, 'img').down(eobj => {
    P_COPY.copyContent(P.editor.getValue(), 'file content copied', eobj.X, eobj.Y);
  })

  P.input_author = $.C(f, {
    L          : 677,
    T          : 15,
    W          : 110,
    F          : 16,
    PD         : 3,
    placeholder: "input author name",
  }, "input").input(eobj => {
    let obj = {
      author: eobj.val(),
      time  : $.MS()
    }
    if(P_MATJ.type === "local"){
      P_CHANNEL.updateLocal(obj)
    }
    else if(P_MATJ.type === "remote"){
      P_CHANNEL.updateRemote(obj)
    }

    P_MATJ.willSave()
  }).H();

  P.input_title = $.C(f, {
    L          : 810,
    T          : 15,
    W          : 200,
    F          : 16,
    PD         : 3,
    placeholder: "give file a title",
  }, "input").input(eobj => {
    let obj = {
      title: eobj.val(),
      time : $.MS()
    }
    if(P_MATJ.type === "local"){
      P_CHANNEL.updateLocal(obj)
    }
    else if(P_MATJ.type === "remote"){
      P_CHANNEL.updateRemote(obj)
    }

    P_MATJ.willSave()
  }).H();

  P.show_readonly = $.C(f, {
    L : 760,
    T : 25,
    W : 255,
    F : 14,
    PD: '0 5px',
    I : 'read only, any changes will be ignored!',
    BG: '#ff8'
  }).H();

  P.message = $.C(f, {
    L : 1100,
    T : 20,
    W : 28,
    H : 28,
    src: 'img/message.svg'
  }, 'img').down(_=>{
    P_MATJ.outbox.S({
      H:P_MATJ.outbox.H_ == main.H_ / 2 ? P_JS.H_ : main.H_ / 2
    })
  })

  P.textarea = $.C(P, {
    id: "matj_textarea",
  }, "textarea");

  var option = {
    lineNumbers      : true,
    tabSize          : 2,
    autoCloseBrackets: true,
    autoCloseTags    : true,
    foldGutter       : true,
    lineWrapping     : true,
    gutters          : [
      "breakpoints", "CodeMirror-linenumbers", "CodeMirror-foldgutter"
    ],
    viewportMargin   : Infinity, // keyMap: 'sublime'
  };

  P.editor = CodeMirror(function(elt){
    var myTextArea = P.textarea.context;
    myTextArea.parentNode.replaceChild(elt, myTextArea);
    elt.id    = "id_matj_mirror";
    P.context = elt;
  }, option);

  $("#id_matj_mirror").S({ H: "100%" });

  // codemirror 会把 id_matj_area 改名 id_matj_mirror，新创建一个 id_matj_area，插入 id_matj_mirror
  P_MATJ.outbox = $("#id_matj_area")

  P.editor.on("change", function(cm, change_obj){
    if(P_MATJ.noOnChange){
      P_MATJ.noOnChange = false;
      //codeRun() //打开页面，自动填入程序后，是否自动执行
      return;
    }

    if(P_MATJ.type === 'public'){
      return;
    }

    P_MATJ.code_changed = true;
    // let index = P_CHANNEL.focus_local;

    // P_CHANNEL.setLight(index, 'red')
    // P_CHANNEL.setMsg(index, 'update')
    P.willSave()

  });

  P.timers = {};

  P.willSave = () => {
    P.timer && clearTimeout(P.timer);
    P.timer = setTimeout(P_MATJ.codeSave, 1000);
  }

  P.codeSaveNow = () => {
    if(P_MATJ.timer){
      clearTimeout(P_MATJ.timer)
      P_MATJ.codeSave()
    }
  }

  P.codeSave = (delay = 10000) => {
    // 处理local / remote
    let P   = P_MATJ;
    P.timer = 0

    let code = P.editor.getValue();

    let detail_obj = {
      title: P.input_title.val(),
      time : $.MS(),
    };

    if(P.type === "remote"){
      detail_obj.author = P.input_author.val()
    }

    //更新本地
    let new_line0 = P.detailToStr(detail_obj);
    let source    = `${new_line0}` + code;

    let index
    if(P.type === 'local'){
      index               = P_CHANNEL.focus_local
      LS['local' + index] = source;
    }
    else{
      index                              = P_CHANNEL.focus_remote
      LS[P_CHANNEL.getRemoteName(index)] = source;
    }

    console.log('codeSave', P.type, index)

    // 更新显示
    detail_obj.size = code.length
    if(P.type === "local"){
      P_CHANNEL.updateLocal(detail_obj)
    }
    else{
      P_CHANNEL.updateRemote(detail_obj)
    }

    //更新远程
    if(DATA.accountId && P.type === "remote"){
      // 静等60秒后再保存，尽量减少上传次数
      // P_CHANNEL.setLight(index, '#f4d71a')
      // P_CHANNEL.setMsg(index, 'pedding')
      clearTimeout(P.timers[index]);
      P.timers[index] = setTimeout((function(index, source){
        return async function(){
          // P_CHANNEL.setLight(index, 'green')
          // P_CHANNEL.setMsg(index, 'uploading...')
          P_MATJ.timers[index] = 0
          P_CHANNEL.freeze     = true;

          let size = await INNER.matj.channel(''+index, source);
          console.log(source.length, size);

          if(P_CHANNEL.checkShare(index)){
            // set share 二合一
            let result = await INNER.matj.share("" + index, detail_obj.title, detail_obj.author, '' + detail_obj.time, '' + detail_obj.size)
            console.log(result)
          }
          // P_CHANNEL.setLight(index, '#888')
          // P_CHANNEL.setMsg(index, 'saved')

          P_CHANNEL.freeze = false;
        };
      })(index, source), delay);
    }
  };

  P.detailToStr = (detail_obj) => {
    var s = "";
    for(let item in detail_obj){
      s += `%${item}=${detail_obj[item]}`;
    }
    s += "\n";
    return s;
  };

  P.getDetail = (source = "") => {
    let first_line_point = source.indexOf("\n");
    let line0            = source.slice(0, first_line_point).trim();
    if(!/^(\%\s*\w+\s*=[^%]*\s*)+$/.test(line0)){
      return {
        title : '',
        author: '',
        time  : '',
        code  : source,
        size  : source.length
      };
    }

    let title  = line0.match(/\%\s*title\s*\=([^%]+)/);
    let author = line0.match(/\%\s*author\s*\=([^%]+)/);
    let time   = line0.match(/\%\s*time\s*\=([^%]+)/);
    // let share = line0.match(/\%\s*share\s*\=([^%]+)/);
    let code   = source.slice(first_line_point + 1);

    return {
      title : title ? title[1].trim() : "",
      author: author ? author[1].trim() : "", // share: share ? +share[1].trim() : "",
      time  : time ? time[1].trim() : "",
      code,
      size  : code.length
    };
  };

  P.codeRun = () => {
    P_MATJ.code_changed = false;
    var matj_code       = P_MATJ.editor.getValue();
    var analy_str       = tidy(matj_code);
    setRoot(analy_str);

    var js_code = trans2js(analy_str);
    P_JS.editor.setValue(js_code);

    // P_OUTPUT.run_btn.DOWN()
    var iframe_head = P_OUTPUT.context.contentDocument.head;
    if(iframe_head.script_id){
      iframe_head.script_id.R();
    }

    var js_code = `
var t0=Date.now()
window.clearAll && window.clearAll();
try{
  ${P_JS.editor.getValue()}
  if(!window.showVariable){
    setTimeout(showVariable, 3000)
  }else{
    showVariable()
  }
}catch(e){
  if(!window.showVariable){
    setTimeout(function(){showVariable(e.message)}, 3000)
  }else{
    showVariable(e.message)
  }
}
`

    iframe_head.script_id = $.c($(iframe_head), {
      type: "text/javascript",
    }, "script").I(js_code);
  };
}
