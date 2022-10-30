function createMatjArea(f) {
  var P = (P_MATJ = $.C(f, P_JS.CSS_).S({
    id: "id_matj_area",
    BG: "#900",
  }));

  P.show_mat_code_button = $.C(f, {
    I: "matj code",
    L: 450,
    T: 10,
    PD: "5px 10px",
    BR: 5,
    F: 14,
    BD: "2px solid #900",
  }).down((eobj) => {
    console.log("matj");

    $("#id_matj_area").V();
    $("#id_js_area").H();
  });

  P.zoomin = $.C(f, {
    I: "+",
    L: 550,
    T: 10,
    PD: "2px 8px",
    BR: 5,
    F: 18,
    BD: "2px solid #900",
  }).down((eobj) => {
    P_MATJ.S({
      F: P_MATJ.F_ * 1 + 2,
    });
  });

  P.zoomout = $.C(f, {
    I: "-",
    L: 590,
    T: 10,
    PD: "2px 8px",
    BR: 5,
    F: 18,
    BD: "2px solid #900",
  }).down((eobj) => {
    P_MATJ.S({
      F: P_MATJ.F_ * 1 - 2,
    });
  });

  P.show_readonly = $.C(f, {
    L: 637,
    T: 25,
    F: 14,
  });

  P.input_auther = $.C(
    f,
    {
      L: 637,
      T: 10,
      W: 200,
      F: 18,
      PD: 3,
      placeholder: "input auther name",
    },
    "input"
  );

  P.input_title = $.C(f, {
      L: 860,
      T: 10,
      W: 200,
      F: 18,
      PD: 3,
      placeholder: "give file a title",
    },
    "input"
  ).input(eobj =>{
    let obj = {
      title:eobj.val(),
      time: $.MS()
    }
    if(P_MATJ.type === "local"){
      P_CHANNEL.updateLocal(obj)
    }
    else if(P_MATJ.type === "remote"){
      P_CHANNEL.updateRemote(obj)
    }

    P_MATJ.willSave()
  });

  P.input_share = $.C(f, {
      L: 1080,
      T: 10,
      F: 18,
      type: "checkbox",
    },
    "input"
  )

  P.show_readonly = $.C(f, {
    L: 637,
    T: 25,
    F: 14,
  });

  P.textarea = $.C(
    P,
    {
      id: "matj_textarea",
    },
    "textarea"
  );

  var option = {
    lineNumbers: true,
    tabSize: 2,
    autoCloseBrackets: true,
    autoCloseTags: true,
    foldGutter: true,
    lineWrapping: true,
    gutters: ["breakpoints", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    viewportMargin: Infinity, // keyMap: 'sublime'
  };

  P.editor = CodeMirror(function (elt) {
    var myTextArea = P.textarea.context;
    myTextArea.parentNode.replaceChild(elt, myTextArea);
    elt.id = "id_matj_mirror";
    P.context = elt;
  }, option);

  $("#id_matj_mirror").S({ H: "calc(100% + 8px" });

  P.editor.on("change", function (cm, change_obj) {
    if (P_MATJ.noOnChange) {
      P_MATJ.noOnChange = false;
      //codeRun() //打开页面，自动填入程序后，是否自动执行
      return;
    }

    if (P_MATJ.is_readonly) {
      return;
    }

    P_MATJ.code_changed = true;
    // let index = P_CHANNEL.focus_local;

    // P_CHANNEL.setLight(index, 'red')
    // P_CHANNEL.setMsg(index, 'update')
    P.willSave()

  });

  P.timers = {};

  P.willSave = ()=>{
    P.timer && clearTimeout(P.timer);
    P.timer = setTimeout(P_MATJ.codeSave, 1000);
  }

  P.codeSaveNow = ()=>{
    if(P_MATJ.timer){
      clearTimeout(P_MATJ.timer)
      P_MATJ.codeSave()
    }
  }

  P.codeSave = (delay = 10000) => {
    // 处理local / remote
    let P = P_MATJ;
    P.timer = 0

    let code = P.editor.getValue();

    let detail_obj = {
      title: P.input_title.val(),
      time: $.MS(),
    };

    if (P.type === "remote") {
      detail_obj.auther= P.input_auther.val()
      detail_obj.share = +P.input_share.val();
    }

    // 更新显示
    if(P.type === "local"){
      P_CHANNEL.updateLocal(detail_obj)
    }
    else{
      P_CHANNEL.updateRemote(detail_obj)
    }

    //更新本地
    let new_line0 = P.detailToStr(detail_obj);
    let source = `${new_line0}` + code;

    let index = P.type === "local" ? P_CHANNEL.focus_local : P_CHANNEL.focus_remote;
    let name = P.type + index;
    LS[name] = source;
    console.log('codeSave', name)

    //更新远程
    if (DATA.accountId && P.type === "remote") {
      // 静等60秒后再保存，尽量减少上传次数
      // P_CHANNEL.setLight(index, '#f4d71a')
      // P_CHANNEL.setMsg(index, 'pedding')
      clearTimeout(P.timers[index]);
      P.timers[index] = setTimeout(
        (function (index, name, source) {
          return async function () {
            // P_CHANNEL.setLight(index, 'green')
            // P_CHANNEL.setMsg(index, 'uploading...')
            P_CHANNEL.freeze = true;

            if(detail_obj.share){
              // set share 二合一
              let result = await P_MATJ.setshare(name, source, "" + index, detail_obj.title, detail_obj.auther, ''+detail_obj.time, ''+code.length)
              console.log(result)
            }
            else{
              let size = await INNER.matj.set(name, source);
              console.log(source.length, size);
            }
            // P_CHANNEL.setLight(index, '#888')
            // P_CHANNEL.setMsg(index, 'saved')

            P_CHANNEL.freeze = false;
          };
        })(index, name, source),
        delay
      );
    } else {
      // P_CHANNEL.setLight(index, '#888')
      // P_CHANNEL.setMsg(index, '')
    }
  };

  P.detailToStr = (detail_obj) => {
    var s = "";
    for (let item in detail_obj) {
      s += `%${item}=${detail_obj[item]}`;
    }
    s += "\n";
    return s;
  };

  P.addTitleAuther = (title, auther) => {
    let source = P_MATJ.editor.getValue();
    source =
      `% title = ${title} % auther = ${auther} % time = ${$.MS()}\n` + source;
    P_MATJ.editor.setValue(source);
  };

  P.setTitleAuther = (title, auther) => {
    let source = P.editor.getValue();
    let info = P.getDetail(source);
    if (info.title != title || info.auther != auther) {
      let line0_pos = source.indexOf("\n");
      let new_line0 = `% title = ${title} % auther = ${auther} % time = ${$.MS()}\n`;
      source = `${new_line0}\n` + source.slice(line0_pos);
      P_MATJ.editor.setValue(source);
    }
  };

  P.getDetail = (source = "") => {
    let first_line_point = source.indexOf("\n");
    let line0 = source.slice(0, first_line_point).trim();
    if (!/^(\%\s*\w+\s*=[^%]*\s*)+$/.test(line0)) {
      return {
        code: source,
      };
    }

    let title = line0.match(/\%\s*title\s*\=([^%]+)/);
    let auther = line0.match(/\%\s*auther\s*\=([^%]+)/);
    let time = line0.match(/\%\s*time\s*\=([^%]+)/);
    let share = line0.match(/\%\s*share\s*\=([^%]+)/);
    let code = source.slice(first_line_point + 1);

    return {
      title: title ? title[1].trim() : "",
      auther: auther ? auther[1].trim() : "",
      share: share ? +share[1].trim() : "",
      time: time ? $.getDatetime("dort", time[1].trim()) : "",
      code,
    };
  };

  P.codeRun = () => {
    P_MATJ.code_changed = false;
    var matj_code = P_MATJ.editor.getValue();
    var analy_str = tidy(matj_code);
    setRoot(analy_str);

    var js_code = trans2js(analy_str);
    P_JS.editor.setValue(js_code);

    // P_OUTPUT.run_btn.DOWN()
    var iframe_head = P_OUTPUT.context.contentDocument.head;
    if (iframe_head.script_id) {
      iframe_head.script_id.R();
    }

    var js_code = "var t0=Date.now()\n";
    // js_code += 'function runMatJ(){\n'
    js_code += "window.clearAll && window.clearAll();\n";
    js_code += P_JS.editor.getValue() + "\n";
    // js_code += '}\n'
    // js_code += 'runMatJ()\n'
    js_code += "showVariable()";

    iframe_head.script_id = $.c(
      $(iframe_head),
      {
        type: "text/javascript",
      },
      "script"
    ).I(js_code);
  };
}
