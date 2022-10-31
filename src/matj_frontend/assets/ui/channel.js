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
    T : 60,
    W : "100%",
    H: 'calc(100% - 280px)',
    O : "auto",
    // BD: '1px solid red'
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
    P_MATJ.input_title.val(detail.title || '').V();
    // P_MATJ.input_share.H();
    P_MATJ.is_readonly = false;
    P_MATJ.show_readonly.H();

    P_MATJ.noOnChange = true
    P_MATJ.editor.setValue(detail.code || '');

    for(let i in P.locals){
      let eobj = P.locals[i];

      eobj.S({
        BG: n == eobj.index ? "#eee" : "",
      });
    }
  };

  P.unselectLocal= ()=>{
    for(let i in P.locals){
      P.locals[i].S({
        BG: "",
      });
    }
  }

  P.LEN      = 16;
  P.locals   = {};
  P.sharestr = "";

  for(var i = 1; i <= P.LEN; i++){
    var source     = LS["local" + i];
    let detail_obj = P_MATJ.getDetail(source);

    let s = `<table>`
    s += `<tr>`
    s += `<td class="title" style="text-align:left"></td>`;
    s += `<td class="size"></td>`;
    s += `<td class="time"></td>`;
    s += `</tr>`
    s += `</table>`

    P.locals[i] = $.c(P.local, {
      I : s,
      CN: 'channel',
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
  P.remote = $.C(P, P.local.CSS_).S({
    id: "remote",
  });

  P.login_box = $.c(P.remote, {
    // id: 'login_box',
    H: 74,
  });

  P.selectRemote = (n) => {
    P_MATJ.codeSaveNow()

    P.focus_remote = n;
    let remote_name = P.getRemoteName(n)

    var source        = LS[remote_name] || "";
    let detail        = P_MATJ.getDetail(source);
    P_MATJ.type       = "remote";
    P_MATJ.noOnChange = true; //不会触发codeSave
    P_MATJ.editor.setValue(detail.code);
    P_MATJ.input_auther.val(detail.auther || '').V();
    P_MATJ.input_title.val(detail.title || '').V();
    // P_MATJ.input_share.S({ checked: detail.share }).V();
    P_MATJ.is_readonly = false;
    P_MATJ.show_readonly.H();

    P_MATJ.noOnChange = true
    P_MATJ.editor.setValue(detail.code || '');

    // P.changeButtonText()
    // P.showTitleAuther(code)

    for(let i in P.remotes){
      let eobj = P.remotes[i];

      eobj.S({
        BG: n == eobj.index ? "#eee" : "",
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

  P.unselectRemote = ()=>{
    for(let i in P.remotes){
      P.remotes[i].S({
        BG: "",
      });
    }
  }

  P.getRemoteName = n=>{
    let principal_str = DATA.principal + "";
    return principal_str.slice(-3)+"remote" + n;
  }
  P.updateRemote = (detail_obj, i = P_CHANNEL.focus_remote) => {
    let cells = P.remotes[i].V().context.firstChild.rows[0].cells

    if('title' in detail_obj){
      cells[0].innerHTML = detail_obj.title
    }

    if('size' in detail_obj){
      cells[1].innerHTML = detail_obj.size ? $.SIZE(detail_obj.size) : ''
    }

    if('time' in detail_obj){
      cells[2].innerHTML = $.getDatetime("dort", detail_obj.time)
    }

    // cells[3].innerHTML = detail_obj.share ? SVG.share : SVG.unshare
  }

  P.afterLogin = () => {
    P_CHANNEL.getRemoteCode();
  };

  P.getRemoteCode = () => {
    let P             = P_CHANNEL;
    let principal_str = DATA.principal + "";

    for(let i = 1; i <= 10; i++){
      //并行读取所有远程内容
      (async () => {
        let remote_name = P.getRemoteName(i);

        // P.setLight(i, 'green')
        // P.setMsg(i, 'loading')
        let result = await INNER.matj_default.principalget(principal_str + 'remote'+i);

        let source = result[0] || "";
        console.log(Date.now(), remote_name, principal_str + 'remote'+i, source);

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

    P.getShare()
  };

  P.RLEN    = 10;
  P.remotes = {};
  for(let i = 1; i <= P.RLEN; i++){
    let s = `<table>`
    s += `<tr>`
    s += `<td class="title" style="text-align:left"></td>`;
    s += `<td class="size"></td>`;
    s += `<td class="time"></td>`;
    s += `<td class="channel_svg"></td>`;
    s += `</tr>`
    s += `</table>`

    P.remotes[i] = $.c(P.remote, {
      I : s,
      CN: 'channel', // L : 20,
      // T : 60 * (i - 1) + 20,
      // W : 250,
      // H : 40,
      // F : 18,
      // C : '#000000',
      // TA: 'center'
    }).click(async eobj => {
      let target = eobj.event.target
      if(target.firstChild?.nodeName === "svg"){
        target = target.firstChild;
      }
      else if(target.nodeName === "path"){
        target = target.parentNode;
      }
      else if(target.nodeName !== "svg"){
        target = null
      }

      // 点中svg图像
      if(target){
        let P     = P_CHANNEL;
        let index = eobj.index;
        let share_str

        let cells = P.remotes[index].V().context.firstChild.rows[0].cells
        cells[3].innerHTML = SVG.wait
        cells[3].title = 'waiting internet computer reply ...'

        if(P.checkShare(index)){
          share_str = await INNER.matj.unshare("" + index);
        }
        else{
          let remote_name = P.getRemoteName(index);
          let source = LS[remote_name] || ''
          let { title, auther, time, size } = P_MATJ.getDetail(source);
          share_str = await INNER.matj.share("" + index, title, auther, time, '' + size);
        }

        P.sharestr = share_str.split(' ').slice(1).join('')
        P.freshShare();
        return;
      }

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

  P.getShare = async () => {
    let P             = P_CHANNEL;
    let principal_str = DATA.principal + "";
    let sharestr      = await INNER.matj_default.getshare(principal_str);
    P.sharestr = sharestr.length == 0 ? "" : sharestr[0]; //.slice(1, -1).split('=_')
    P.freshShare()
  }

  P.freshShare = async () => {
    console.log(P.sharestr);
    for(let i in P.remotes){
      let cells = P.remotes[i].V().context.firstChild.rows[0].cells
      cells[3].innerHTML = P.checkShare(i) ? SVG.share : SVG.unshare
      cells[3].title = P.checkShare(i) ? 'unshare' : 'share'
    }
  };

  P.checkShare = (n) => {
    let P             = P_CHANNEL;
    return $.F(P.sharestr, "_" + n + "%") || $.F(P.sharestr, "_" + n + "=");
  };
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
        let [channel, title, auther, time, size] = channelstr.split("%");
        let item                     = principalid + 'remote' + channel;

        s += `<div onclick="P_CHANNEL.openpublic(this, event)" class="channel"  data-id="${principalid}" data-channel="${channel}">`
        s += `<table>`
        s += `<tr>`
        s += `<td class="channel_avatar"><img class="avatar" onmouseover="P_CHANNEL.large(event)" onmouseout="P_CHANNEL.large()" src="${P_CANVAS.principalToAvatar(principalid)}"/></td>`;
        s += `<td class="auther">${auther}</td>`;
        s += `<td class="title">${title}</td>`;
        s += `<td class="size">${$.SIZE(size||0)}</td>`;
        s += `<td class="time">${$.getDatetime("dort", time)}</td>`;
        s += `<td class="channel_svg">${P.hasFavorite(item)
                                                        ? SVG.favorite
                                                        : SVG.unfavorite}</td>`;
        s += `</tr>`
        s += `</table>`
        s += `</div>`
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

    if(event.target.firstChild?.nodeName == "svg"){
      target = event.target.firstChild;
    }
    else if(event.target.nodeName == "svg"){
      target = event.target;
    }
    else if(event.target.nodeName == "path"){
      target = event.target.parentNode;
    }


    if(target){
      let item = node.dataset.id + 'remote' + node.dataset.channel;
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
    P_MATJ.show_readonly.V();
    P_MATJ.input_title.H()

    let public_file_name = node.dataset.id + "remote" + node.dataset.channel;
    (async () => {
      let result = await INNER.matj_default.principalget(public_file_name);
      let detail_obj = P_MATJ.getDetail(result[0])
      P_MATJ.editor.setValue(detail_obj.code);
    })();

    var brothers = node.parentNode.childNodes;
    brothers.forEach((item) => {
      item.style.background = item == node ? "#eee" : "";
    });
  };

  P.getPublicChannel();

  P.large = event=>{
    if(!event){
      P_COPY.large_image.H()
    }else{
      P_COPY.large_image.V().S({
        L  : event.clientX + 20,
        T  : event.clientY - 40,
        src: event.target.src
      })
    }
  }
}

function createFavorite(P){
  P.favorite     = $.C(P, P.local.CSS_).S({ id: "favorite" });
  P.showFavorite = function(){
    let s = "";
    P.allshare.forEach((pair) => {
      let principalid   = pair[0];
      let sharedchannel = pair[1].slice(1, -1).split("=_");

      sharedchannel.map((channelstr) => {
        let [channel, title, auther, time, size] = channelstr.split("%");
        let item                     = principalid + "remote" + channel;

        if(P.hasFavorite(item)){
          s += `<div onclick="P_CHANNEL.openpublic(this, event)" class="channel"  data-id="${principalid}" data-channel="${channel}">`
          s += `<table>`
          s += `<tr>`
          s += `<td class="channel_avatar"><img class="avatar" onmouseover="P_CHANNEL.large(event)" onmouseout="P_CHANNEL.large()" src="${P_CANVAS.principalToAvatar(principalid)}"/></td>`;
          s += `<td class="auther">${auther}</td>`;
          s += `<td class="title">${title}</td>`;
          s += `<td class="size">${$.SIZE(size||0)}</td>`;
          s += `<td class="time">${$.getDatetime("dort", time)}</td>`;
          s += `<td class="channel_svg">${SVG.favorite}</td>`;
          s += `</tr>`
          s += `</table>`
          s += `</div>`
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

//for(var i in LS){if(/\d{6}/.test(i.slice(-6))){delete LS[i]}}
