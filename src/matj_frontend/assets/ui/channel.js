function createChannel(f){
  var P = (W.P_CHANNEL = $.C(f, {
    id: "channel_box",
    L : 0,
    T : 80,
    W : 388,
    H : "100%", // H : 38,//580,
    BG: "#fff",
    PD: 20,
    BR: 5,
    O : "hidden",
  }));

  createTab(P);
  createLocal(P);
  createRemote(P);
  createFavorite(P);
  createPublic(P);

  P.tab.DOWN({
    target_eobj: P.local_tab,
  });
}

function createTab(P){
  P.tab = $.C(P, {
    id: "tab",
    L : 10,
    T : 10,
    F : 18,
    W : "calc(100% - 20px)", // BG:'gray'
  }).down((eobj) => {
    var target    = eobj.target_eobj;
    var css_focus = {
      C : "#fff",
      BG: "#000",
    };
    var css_blur  = {
      C : "",
      BG: "",
    };
    P.public_tab.S(target == P.public_tab ? css_focus : css_blur);
    P.local_tab.S(target == P.local_tab ? css_focus : css_blur);
    P.remote_tab.S(target == P.remote_tab ? css_focus : css_blur);
    P.favorite_tab.S(target == P.favorite_tab ? css_focus : css_blur);

    P.local.V(target == P.local_tab);
    P.remote.V(target == P.remote_tab);
    P.public.V(target == P.public_tab);
    P.favorite.V(target == P.favorite_tab);

    if(target == P.public_tab){
      P_CHANNEL.getPublicChannel();
    }
  });

  P.public_tab   = $.C(P.tab, {
    I : "public",
    L : "50%",
    T : 0,
    W : "calc(25% - 1px)",
    PD: "5px 0",
    BD: "1px solid #000", // BG:'red',
    TA: "center",
  });
  P.local_tab    = $.C(P.tab, P.public_tab.CSS_).S({
    I                     : "local",
    L                     : 0,
    borderTopLeftRadius   : "2em",
    borderBottomLeftRadius: "2em",
  });
  P.remote_tab   = $.C(P.tab, P.public_tab.CSS_).S({
    I: "remote",
    L: "25%",
  });
  P.favorite_tab = $.C(P.tab, P.public_tab.CSS_).S({
    I                      : "favorite",
    L                      : "75%",
    borderTopRightRadius   : "2em",
    borderBottomRightRadius: "2em",
  });
}

function createLocal(P){
  P.local = $.C(P, {
    id: "local",
    L : 0,
    T : 50,
    W : "100%",
    O : "auto",
  });

  P.updateLocal = (detail_obj, i = P_CHANNEL.focus_local) => {
    let cells = P.locals[i].context.firstChild.rows[0].cells

    if(detail_obj.title){
      cells[0].innerHTML = detail_obj.title
    }

    if(detail_obj.size){
      cells[1].innerHTML = $.SIZE(detail_obj.size)
    }

    if(detail_obj.time){
      cells[2].innerHTML = $.getDatetime("dort", detail_obj.time)
    }
  }

  P.selectLocal = (n) => {
    P_MATJ.codeSaveNow()

    P.focus_local  = n;
    LS.focus_local = n;
    var source     = LS["local" + n] || "";
    let detail     = P_MATJ.getDetail(source);

    P_MATJ.type       = "local";
    P_MATJ.noOnChange = true; //不会触发codeSave
    P_MATJ.input_auther.H();
    P_MATJ.input_title.val(detail.title || '');
    P_MATJ.input_share.H();
    P_MATJ.is_readonly = false;
    P_MATJ.show_readonly.I("");

    P_MATJ.noOnChange = true
    P_MATJ.editor.setValue(detail.code || '');

    for(let i in P.locals){
      let eobj = P.locals[i];

      eobj.S({
        C: n == eobj.index ? "red" : "",
      });
    }
  };

  P.LEN      = 16;
  P.locals   = {};
  P.sharestr = "";

  for(var i = 1; i <= P.LEN; i++){
    var source     = LS["local" + i];
    let detail_obj = P_MATJ.getDetail(source);

    let s = `<table>`
    s += `<tr>`
    s += `<td style="font-weight:bold;width:220px"></td>`;
    s += `<td style="text-align:right;width:50px;font-size:14px;"></td>`;
    s += `<td style="text-align:right;width:90px;font-size:14px;"></td>`;
    s += `</tr>`
    s += `</table>`

    P.locals[i] = $.c(P.local, {
      I : s,
      CN: "channel",
    }).click((eobj) => {
      // P_CHANNEL.openlocal(eobj)
      if(P_CHANNEL.freeze){
        return;
      }

      P_CHANNEL.selectLocal(eobj.index);
    });

    P.locals[i].index = i;

    P.updateLocal(detail_obj, i)
  }
}

function createRemote(P){
  let i
  P.remote = $.C(P, {
    id: "remote",
    L : 0,
    T : 50,
    W : "100%",
    H : "calc(100% - 65px)", // BD:'1px solid red',
    O : "auto",
  });

  P.login_box = $.c(P.remote, {
    // id: 'login_box',
    H: 156,
  });

  P.selectRemote = (n) => {
    P_MATJ.codeSaveNow()

    P.focus_remote = n;

    var source        = LS["remote" + n] || "";
    let detail        = P_MATJ.getDetail(source);
    P_MATJ.type       = "remote";
    P_MATJ.noOnChange = true; //不会触发codeSave
    P_MATJ.editor.setValue(detail.code);
    P_MATJ.input_auther.val(detail.auther || '').V();
    P_MATJ.input_title.val(detail.title || '');
    P_MATJ.input_share.S({ checked: detail.share }).V();
    P_MATJ.is_readonly = false;
    P_MATJ.show_readonly.I("");

    P_MATJ.noOnChange = true
    P_MATJ.editor.setValue(detail.code || '');

    // P.changeButtonText()
    // P.showTitleAuther(code)

    for(let i in P.remotes){
      let eobj = P.remotes[i];

      eobj.S({
        C: n == eobj.index ? "red" : "",
      });

      // eobj.light.S({
      //   BG: LS['local' + eobj.index] ? '#888' : ''
      // })
    }

    // P.more.S({
    //   L: P.locals[n].W_ + 150,
    //   T: P.locals[n].T_
    // }).V()
    //
    // P.moreButtons.H()
  };

  P.updateRemote = (detail_obj, i = P_CHANNEL.focus_remote) => {
    let cells = P.remotes[i].V().context.firstChild.rows[0].cells

    if(detail_obj.title){
      cells[0].innerHTML = detail_obj.title
    }

    if(detail_obj.size){
      cells[1].innerHTML = $.SIZE(detail_obj.size)
    }

    if(detail_obj.time){
      cells[2].innerHTML = $.getDatetime("dort", detail_obj.time)
    }

    cells[3].innerHTML = detail_obj.share ? SVG.share : SVG.unshare

    // let children = P_CHANNEL.remotes[i].V().context.children;
    //
    // children[0].innerHTML = detail.title;
    // children[1].innerHTML = $.SIZE(detail.code.length);
    // children[2].innerHTML = detail.time;
    // children[3].innerHTML = detail.share? SVG.share : SVG.unshare;
  }

  P.afterLogin = () => {
    P_CHANNEL.getRemoteCode();
    // P_CHANNEL.share.V()
  };

  P.getRemoteCode = () => {
    let P             = P_CHANNEL;
    let principal_str = DATA.principal + "";

    for(let i = 1; i <= 10; i++){
      //并行读取所有远程内容
      (async () => {
        let remote_name = "remote" + i;

        // P.setLight(i, 'green')
        // P.setMsg(i, 'loading')
        let result = await INNER.matj_default.principalget(principal_str + remote_name);

        let source = result[0] || "";
        console.log(Date.now(), principal_str + name, source);

        if(result.length){
          if(!LS[remote_name]){
            LS[remote_name] = source;
          }
          else if(result[0] != LS[remote_name]){
            // 远程文件为主
            LS[remote_name + "_" + $.MS()] = LS[remote_name];
            LS[remote_name]                = source;
            console.warn(remote_name + " has different backup code");
          }
        }

        let detail = P_MATJ.getDetail(source);

        P.updateRemote(detail, i)

        // P.checkLight(i)
        // P.setMsg(i, LS[name] ? 'loaded' : 'empty')
      })();
    }

    // P.freshShare()
  };

  P.RLEN    = 10;
  P.remotes = {};
  for(i = 1; i <= P.RLEN; i++){
    let s = `<table>`
    s += `<tr>`
    s += `<td style="font-weight:bold;"></td>`;
    s += `<td style="text-align:right;width:50px;font-size:14px;"></td>`;
    s += `<td style="text-align:right;width:90px;font-size:14px;"></td>`;
    s += `<td style="text-align:right;width:30px;"></td>`;
    s += `</tr>`
    s += `</table>`

    P.remotes[i] = $.c(P.remote, {
      I : s,
      CN: "channel", // L : 20,
      // T : 60 * (i - 1) + 20,
      // W : 250,
      // H : 40,
      // F : 18,
      // C : '#000000',
      // TA: 'center'
    }).click((eobj) => {
      if(P_CHANNEL.freeze){
        return;
      }

      P_CHANNEL.selectRemote(eobj.index);
    }).H();

    P.remotes[i].index = i;

    // P.locals[i].light = $.C(P.remote, {
    //   L : P.locals[i].W_ + 30,
    //   T : P.locals[i].T_ + 10,
    //   W : 20,
    //   H : 20,
    //   BR: 10, // BD: 'gray'
    // })
    //
    // P.locals[i].msg = $.C(P.remote, {
    //   L : P.locals[i].light.L_ + 30,
    //   T : P.locals[i].T_ + 5,
    //   W : 80,
    //   H : 30,
    //   LH: 30,
    //   F : 16, // BD: '1px solid'
    // }).down(eobj => {
    //   if(eobj.I_ == 'pedding'){
    //     P_MATJ.codeSave(10)
    //   }
    // })
  }

  return;
  P.input_component = $.C(P.remote, {
    L : 20,
    W : 400,
    H : 40,
    BG: "#fff",
    Z : 1,
  }).H();

  P.input  = $.C(P.input_component, {
    W : P.locals[1].W_ - 8,
    H : 34,
    F : 20,
    C : "#000000",
    TA: "center",
  }, "input").keydown((eobj) => {
    if(eobj.KEYCODE == 13){
      P.ok.CLICK(P.ok);
    }
    else if(eobj.KEYCODE == 27){
      P.cancel.CLICK(P.cancel);
    }
  }, 1);
  P.ok     = $.C(P.input_component, {
    L    : P.locals[1].W_ + 10,
    W    : 45,
    H    : 38,
    F    : 20,
    I    : "ok",
    title: i,
  }, "button").click((eobj) => {
    let index                   = P.focus_local;
    let new_title               = P.input.val();
    LS["channel_name_" + index] = new_title;
    P.locals[index].I(new_title);

    let source            = P_MATJ.editor.getValue();
    let { title, auther } = P_MATJ.getDetail(source);
    console.log(title, auther);

    if(!title && !auther){
      P_MATJ.addTitleAuther(new_title, LS.auther || "");
    }
    else{
      P_MATJ.setTitleAuther(new_title, auther || LS.auther || "");
    }

    eobj.FATHER.H();
  });
  P.cancel = $.C(P.input_component, {
    L: P.ok.L_ + P.ok.W_ + 10,
    W: 75,
    H: 38,
    F: 20,
    I: "cancle",
  }, "button").click((eobj) => {
    eobj.FATHER.H();
  });

  P.more = $.C(P.remote, { I: "..." })
    .down((eobj) => {
      P.moreButtons.toggle().S({
        L: eobj.L_ - 60,
        T: eobj.T_ + 40,
      });
    })
    .H();

  P.moreButtons = $.C(P.remote, {
    // L: 20,
    // T: P.T_ + P.locals[P.LEN].T_ + P.locals[P.LEN].H_ + 30,
    PD: 4,
    BG: "#eee",
  }).H();

  P.rename = $.c(P.moreButtons, {
    W    : 80,
    H    : 40,
    F    : 20,
    C    : "#000000",
    TA   : "center",
    I    : "rename",
    title: i,
  }, "button").click((eobj) => {
    let P     = P_CHANNEL;
    let index = P.focus_local;
    P.input_component.toggle().S({
      T: P.locals[index].T_,
    });
    P.input.focusMe().val(P.locals[index].I_);
    P.moreButtons.H();
  });

  P.share_button = $.c(P.moreButtons, P.rename.CSS_, "button")
    .S({
      // T: 50,
      I: "share",
    })
    .H()
    .click(async (eobj) => {
      let P     = P_CHANNEL;
      let index = P.focus_local;

      if(P.checkShare(index)){
        await INNER.matj.unshare("" + index);
      }
      else{
        let source = P_MATJ.editor.getValue();
        await P.share(index, source)
      }

      P.freshShare();
    });

  P.share = async (index, source) => {
    let { title, auther, time, code } = P_MATJ.getDetail(source);
    await INNER.matj.share("" + index, title, auther, '' + time, '' + code.length);
  }
  //=================================================

  P.freshShare = async () => {
    let P             = P_CHANNEL;
    let principal_str = DATA.principal + "";
    let sharestr      = await INNER.matj_default.getshare(principal_str);
    console.log(sharestr);
    P.sharestr = sharestr.length == 0 ? "" : sharestr[0]; //.slice(1, -1).split('=_')

    for(let i in P.locals){
      P.locals[i].S({
        BG: P.checkShare(i) ? "#a7daf1" : "",
      });
    }

    P.changeButtonText();
  };

  P.checkShare = (n) => {
    return $.F(P.sharestr, "_" + n + "%") || $.F(P.sharestr, "_" + n + "=");
  };

  P.changeButtonText = () => {
    P.share.I(P.checkShare(P.focus_local) ? "unshare" : "share");
  };

  P.setLight = (n, c) => {
    P.locals[n].light.S({
      BG: c,
    });
  };

  P.checkLight = (n) => {
    let P    = P_CHANNEL;
    let eobj = P.locals[n];
    let c    = LS["local" + eobj.index] ? "#888" : "";
    P.setLight(n, c);
  };

  P.setMsg = (n, s) => {
    let msg_eobj = P.locals[n].msg;
    msg_eobj.I(s);
    if(s == "pedding"){
      msg_eobj.S({
        CS: "pointer",
      });
    }
    else{
      msg_eobj.S({
        CS: "",
      });
    }
  };

  P.max = () => {
    P_CHANNEL.S({
      H: main.H_ - P_CHANNEL.T_ - P_CHANNEL.PD_ * 2,
    });
  };
  P.min = () => {
    P_CHANNEL.S({
      H: 38,
    });
  };

  P.showTitleAuther = (source) => {
    let index             = P_CHANNEL.focus_local;
    let { title, auther } = P_MATJ.getDetail(source);
    console.log(title, auther);
    title = title || `untitled ${index}`;
    if(auther != ""){
      LS.auther = auther;
    }
    else if(LS.auther){
      auther = ""; //LS.auther
    }
    P_CHANNEL.locals[index].I(title + " - " + auther);
    // P_CHANNEL.showAuther(auther)

    P_MATJ.setTitleAuther(title, auther);
  };

  P.showAuther = (auther) => {
    P.auther.I(`auther: ${auther || LS.auther || "anonymous"}`);
  };

  //一开始就显示所有频道
  P.max();
}

function createPublic(P){
  P.public   = $.C(P, P.local.CSS_).S({ id: "public" });
  P.allshare = [];

  P.showPublic = function(){
    let s = "";
    P.allshare.forEach((pair) => {
      let principalid   = pair[0];
      let sharedchannel = pair[1].slice(1, -1).split("=_");

      sharedchannel.map((channelstr) => {
        let [channel, title, auther] = channelstr.split("%");
        let item                     = principalid + "channel" + channel;

        s += `<div onclick="P_CHANNEL.openpublic(this, event)" class="channel" data-id="${principalid}" data-channel="${channel}">`;
        s += `<div width=40><img class="avatar" src="${P_CANVAS.principalToAvatar(principalid)}"/></div>`;
        s += `<div>${auther}</div>`;
        s += `<div style="text-align:right;">${title}</div>`;
        s += `<div style="text-align:right;" width=40>${P.hasFavorite(item)
                                                        ? SVG.favorite
                                                        : SVG.unfavorite}</div>`;
        s += `</div>`;
      });
    });

    P.public.I(s);
  };

  P.getPublicChannel = () => {
    let P = P_CHANNEL;
    if(!window.INNER){
      setTimeout(P.getPublicChannel, 1000);
      return;
    }

    P.showPublic();
    (async () => {
      P.allshare = await INNER.matj_default.getallshare();
      // P.allshare = [
      //   ['bd2wg-k5qgq-hxlt4-km3ub-65vbo-sm2s2-byexk-vowwq-ubcgi-ocxz3-hae', '_6%charts%samshi=_4%for loop%samshi=_7%factor%samshi='],
      //   ['jxod7-ldlti-mmxc6-rrojx-peixc-vskod-pmv7f-aroz7-wtrys-eq3xg-kqe', '_3%todolist%samshi=']
      // ]
      console.log(P.allshare);

      P.showPublic();
      P.showFavorite();
    })();
  };

  P.openpublic = function(node, event){
    let target;
    if(event.target.nodeName == "svg"){
      target = event.target;
    }
    else if(event.target.nodeName == "path"){
      target = event.target.parentNode;
    }
    else if(event.target.firstChild?.nodeName == "svg"){
      target = event.target.firstChild;
    }

    if(target){
      let item = node.dataset.id + "channel" + node.dataset.channel;
      if(P.hasFavorite(item)){
        P.removeFavorite(item);
        target.outerHTML = SVG.unfavorite;
        console.log("removeFavorite", item);
      }
      else{
        P.addFavorite(item);
        target.outerHTML = SVG.favorite;
        console.log("addFavorite", item);
      }

      P.showFavorite();
      return;
    }

    P_MATJ.type        = "public";
    P_MATJ.is_readonly = true;
    P_MATJ.show_readonly.I("read only");

    let public_file_name = node.dataset.id + "channel" + node.dataset.channel;
    (async () => {
      let result = await INNER.matj_default.principalget(public_file_name);
      P_MATJ.editor.setValue(result[0]);
    })();

    var brothers = node.parentNode.childNodes;
    brothers.forEach((item) => {
      item.style.background = item == node ? "#eee" : "";
    });
  };

  P.getPublicChannel();
}

function createFavorite(P){
  P.favorite     = $.C(P, P.local.CSS_).S({ id: "favorite" });
  P.showFavorite = function(){
    let s = "";
    P.allshare.forEach((pair) => {
      let principalid   = pair[0];
      let sharedchannel = pair[1].slice(1, -1).split("=_");

      sharedchannel.map((channelstr) => {
        let [channel, title, auther] = channelstr.split("%");
        let item                     = principalid + "channel" + channel;

        if(P.hasFavorite(item)){
          s += `<table onclick="P_CHANNEL.openpublic(this, event)" class="channel" data-id="${principalid}" data-channel="${channel}"><tr>`;
          s += `<td width=40><img class="avatar" src="${P_CANVAS.principalToAvatar(principalid)}"/></td>`;
          s += `<td>${auther}</td>`;
          s += `<th style="text-align:right;">${title}</th>`;
          s += `<td style="text-align:right;" width=40>${SVG.favorite}</td>`;
          s += `</tr></table>`;
        }
      });
    });

    P.favorite.I(s);
  };
  P.hasFavorite  = function(item){
    // console.log(P.favorite_list, item, P.favorite_list.includes(item))
    return P.favorite_list.includes(item);
  };

  P.addFavorite = function(item){
    if(!P.favorite_list.includes(item)){
      P.favorite_list.push(item);
    }
    P.setFavorite();
  };

  P.removeFavorite = function(item){
    var list = [];
    P.favorite_list.map((favorite) => {
      if(favorite != item){
        list.push(favorite);
      }
    });

    P.favorite_list = list;

    P.setFavorite();
  };

  P.setFavorite = function(){
    LS.favorite = JSON.stringify(P.favorite_list);
  };

  P.getFavorite = function(node){
    let list = [];
    if(LS.favorite){
      try{
        list = JSON.parse(LS.favorite);
      }
      catch(e){
      }
    }
    return list;
  };

  P.favorite_list = P.getFavorite();
}
