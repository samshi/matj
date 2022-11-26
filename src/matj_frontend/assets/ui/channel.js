function createChannel(f){
  var P = (W.P_CHANNEL = $.C(f, {
    id: "channel_box",
    L : 0,
    T : 127,
    W : 428,
    H : "calc(100% - 140px)", // H : 38,//580,
    BG: "#fff",
    BR: 5,
    O : "auto",
    // BD: 'red'
  }));

  createTab(P);
  createLocal(P);
  createRemote(P);
  createPublic(P);

  P.unselectAll = () => {
    P.unselectLocal()
    P.unselectRemote()
    P.unselectPublic()
  }
}

function createTab(P){
  P.tab = $.C(P, {
    id: "tab",
    L : 10,
    T : 20,
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

    P.local.V(target == P.local_tab);
    P.remote.V(target == P.remote_tab);
    P.public.V(target == P.public_tab);

    if(target == P.public_tab){
      P_CHANNEL.getPublicChannel();
    }
  });

  P.remote_tab   = $.C(P.tab, {
    I : "remote",
    L : "33%",
    T : 0,
    W : "calc(33% - 1px)",
    PD: "5px 0",
    BD: "1px solid #000", // BG:'red',
    TA: "center",
  });
  P.local_tab    = $.C(P.tab, P.remote_tab.CSS_).S({
    I                     : "local",
    L                     : 0,
    borderTopLeftRadius   : "2em",
    borderBottomLeftRadius: "2em",
  });
  P.public_tab = $.C(P.tab, P.remote_tab.CSS_).S({
    I                      : "public",
    L                      : "66%",
    borderTopRightRadius   : "2em",
    borderBottomRightRadius: "2em",
  });
}

function createLocal(P){
  P.local = $.C(P, {
    id: "local",
    L : 0,
    T : 70,
    W : "100%",
    H : 'calc(100% - 80px)',
    O : "auto", // BD: '1px solid red'
    // BG: 'yellow'
  });

  P.local_channels = $.c(P.local)
  P.add = $.c(P.local, {src:'img/add.svg', W:30, PD: 10}, 'img').down(_=>{
    let j = local.j
    P.locals[j] = $.c(P.local_channels, {
      I : s,
      CN: 'channel',
    }).click((eobj) => {
      // P_CHANNEL.openlocal(eobj)
      if(P_CHANNEL.freeze){
        return;
      }

      P_CHANNEL.selectLocal(eobj.index);
    });

    P.locals[j].index = j;
  })

  P.updateLocal = (detail_obj, i = P_CHANNEL.focus_local) => {
    let cells = P.locals[i].context.firstChild.rows[0].cells

    if(detail_obj.title){
      cells[0].innerHTML = detail_obj.title
    }

    if(detail_obj.time){
      cells[1].innerHTML = (detail_obj.size ? $.SIZE(detail_obj.size) : '') + '<br>' +$.getDatetime("dort", detail_obj.time)
    }
  }

  P.selectLocal = (n) => {
    P_MATJ.codeSaveNow()

    //必须在codeSaveNow后面
    P.unselectAll()

    P.focus_local  = n;
    LS.focus_local = n;
    var source     = LS["local" + n] || "";
    let detail     = P_MATJ.getDetail(source);

    P_MATJ.type       = "local";
    P_MATJ.noOnChange = true; //不会触发codeSave
    P_MATJ.input_author.H();
    P_MATJ.input_title.val(detail.title || '').V();
    P_MATJ.show_readonly.H();
    P_MATJ.message.H();

    P_MATJ.noOnChange = true
    P_MATJ.editor.setValue(detail.code || '');


    P.locals[n] && P.locals[n].S({
      BG: "#eee"
    });
  };

  P.unselectLocal = () => {
    let focus_local = P.locals[P.focus_local]
    focus_local && focus_local.S({
        BG: ""
      })
    delete P.focus_local
  }

  P.LEN      = 20;
  P.locals   = {};
  P.sharestr = "";

  let s = `<table>`
  s += `<tr>`
  s += `<td class="title"></td>`;
  s += `<td class="sizetime"></td>`;
  s += `</tr>`
  s += `</table>`
  let j=1
  for(var i = 1; i <= j+P.LEN; i++){
    let source     = LS["local" + i];
    let detail_obj = P_MATJ.getDetail(source);
    if(detail_obj.size){
      if(i!==j){
        LS["local" + j] = LS["local" + i]
        delete LS["local" + i]
      }
      P.locals[j] = $.c(P.local_channels, {
        I : s,
        CN: 'channel',
      }).click((eobj) => {
        // P_CHANNEL.openlocal(eobj)
        if(P_CHANNEL.freeze){
          return;
        }

        P_CHANNEL.selectLocal(eobj.index);
      });

      P.locals[j].index = j;

      P.updateLocal(detail_obj, j)

      j++
    }
  }

  local.j = j
}

function createRemote(P){
  P.remote = $.C(P, P.local.CSS_).S({
    id: "remote",
  });

  let msg = `Connect Wallet and get 10 remote channels

  Why need connect wallet?
  1. you will get a unique identity
  2. obtain 10 remote channels for free
  3. remote channels can be edited by diffirent device
  4. remote channels can be published to share channel with others
  5. to leave message on a shared channel
  6. you may get some denote by your shared channel or your contributed message
  `
  P.alert_message = $.C(P.remote, {
    I: msg.replace(/\n/g, '<br/>'),
    PD: '20px 40px',
    W: 'calc(100% - 80px)',
    F: 14
  })
  P.remote_channels = $.C(P.remote, {BG:'#fff'}).H()

  P.selectRemote = (n) => {
    P_MATJ.codeSaveNow()

    //必须在codeSaveNow后面
    P.unselectAll()

    P.focus_remote  = n;
    let remote_name = P.getRemoteName(n)
    var source        = LS[remote_name] || "";
    let detail        = P_MATJ.getDetail(source);

    P_MATJ.type       = "remote";
    P_MATJ.noOnChange = true; //不会触发codeSave
    P_MATJ.editor.setValue(detail.code);
    P_MATJ.input_author.val(detail.author || '').V();
    P_MATJ.input_title.val(detail.title || '').V();
    P_MATJ.show_readonly.H();
    P_MATJ.message.V();

    P_MATJ.noOnChange = true
    P_MATJ.editor.setValue(detail.code || '');

    P.remotes[n].S({
      BG: "#eee"
    });

    P_MESSAGE.getMessage()
  };

  P.unselectRemote = () => {
    let focus_remote = P.remotes[P.focus_remote]
    focus_remote && focus_remote.S({
      BG: ""
    })
    delete P.focus_remote
  }

  P.getRemoteName = (n, id=DATA.principal + "") => {
    return id.slice(-9, -4) +id.slice(-3) + n;
  }

  P.updateRemote  = (detail_obj, i = P_CHANNEL.focus_remote) => {
    let cells = P.remotes[i].V().context.firstChild.rows[0].cells

    if('title' in detail_obj){
      cells[1].innerHTML = detail_obj.title
    }

    if(detail_obj.time){
      cells[2].innerHTML = (detail_obj.size ? $.SIZE(detail_obj.size) : '') + '<br>' +$.getDatetime("dort", detail_obj.time)
    }
  }

  P.afterLogin = () => {
    P_CHANNEL.remote_channels.V()
    P_CHANNEL.getRemoteCode();
  };

  P.getRemoteCode = () => {
    let P             = P_CHANNEL;
    let principal_str = DATA.principal + "";
    P.getShare()

    for(let i = 1; i <= 10; i++){
      //并行读取所有远程内容
      (async () => {
        let remote_name = P.getRemoteName(i);

        // P.setLight(i, 'green')
        // P.setMsg(i, 'loading')
        let result = await INNER.matj_default.getchannel(principal_str + i);

        let source = result[0] || "";
        // console.log(Date.now(), remote_name, principal_str + i, source.length);

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
        else{
          source = LS[remote_name] || ''
        }

        let detail = P_MATJ.getDetail(source);

        P.updateRemote(detail, i)
      })();
    }
  };

  P.RLEN    = 10;
  P.remotes = {};
  for(let i = 1; i <= P.RLEN; i++){
    let s = `<table>`
    s += `<tr>`
    s += `<td class="index">${i}</td>`;
    s += `<td class="title"></td>`;
    s += `<td class="sizetime"></td>`;
    s += `<td class="channel_svg"></td>`;
    s += `<td class="channel_svg" data-name="link"></td>`;
    s += `</tr>`
    s += `</table>`

    P.remotes[i] = $.c(P.remote_channels, {
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
      else if(target.parentNode.nodeName === "svg"){
        target = target.parentNode;
      }
      else if(target.nodeName !== "svg"){
        target = null
      }

      let P     = P_CHANNEL;
      let index = eobj.index;

      // 点中svg图像
      if(target){
        if(target.parentNode.dataset.name==='link'){
          let href = location.origin+'#'+P.getRemoteName(index)
          P_COPY.copyContent(href, 'share link copied', eobj.X, eobj.Y);
        }
        else{
          let share_str
          let cells          = P.remotes[index].V().context.firstChild.rows[0].cells
          cells[3].innerHTML = SVG.wait
          cells[3].title     = 'waiting internet computer reply ...'

          if(P.checkShare(index)){
            share_str = await INNER.matj.unshare("" + index);
          }
          else{
            let remote_name                 = P.getRemoteName(index);
            let source                      = LS[remote_name] || ''
            let {title, author, time, size} = P_MATJ.getDetail(source);
            share_str                       = await INNER.matj.share("" + index, title, author, time, '' + size);
          }

          P.sharestr = share_str.split(' ').slice(1).join('')
          P.freshShare();
        }

        return;
      }

      if(P.freeze){
        return;
      }

      P.selectRemote(eobj.index);
    }).H();

    P.remotes[i].index = i;
  }

  P.getShare = async () => {
    let P             = P_CHANNEL;
    let principal_str = DATA.principal + "";
    let sharestr      = await INNER.matj_default.getshare(principal_str);
    P.sharestr        = sharestr.length == 0 ? "" : sharestr[0]; //.slice(1, -1).split('=_')
    P.freshShare()
  }

  P.freshShare = async () => {
    if(!P.sharestr){
      return
    }

    for(let i in P.remotes){
      let cells          = P.remotes[i].V().context.firstChild.rows[0].cells
      let checked        = P.checkShare(i)
      cells[3].innerHTML = checked ? SVG.share : cells[1].innerHTML ? SVG.unshare : ''
      cells[3].title     = checked ? 'unshare' : 'share'
      cells[4].innerHTML = checked ? SVG.link  : ''
      cells[4].title     = checked ? 'copy link' : ''
    }
  };

  P.checkShare = (n) => {
    let P = P_CHANNEL;
    return $.F(P.sharestr, "_" + n + "%") || $.F(P.sharestr, "_" + n + "=");
  };
}

function createPublic(P){
  P.public   = $.C(P, P.local.CSS_).S({
    id: "public",
    // BG: 'green'
  });

  P.public_filter = $.C(P.public, {
    L: 20,
    T: 5,
    W: 'calc(100% - 32px)',
    H: 40,
  })

  P.public_filter_input = $.C(P.public_filter, {
    W: 'calc(100% - 70px)',
    H: 'calc(100% - 10px)',
    F: 16,
    PD: '3px 10px',
    placeholder: 'name title filter',
    value: LS.public_filter || ''
  }, 'input').input(eobj=>{
    // console.log(eobj.val())
    LS.public_filter = eobj.val()
    P.publicFilter()
  })

  P.public_filter_favorite = $.C(P.public_filter, {
    I:LS.public_isfavorite=='1' ? SVG.favorite : SVG.unfavorite,
    L: 'calc(100% - 40px)'
  }).down(eobj=>{
    let isfavorite = eobj.I_ == SVG.favorite
    eobj.I(isfavorite ? SVG.unfavorite : SVG.favorite)
    LS.public_isfavorite = isfavorite ? 0 : 1
    P.publicFilter()
  })

  P.public_channel = $.C(P.public, {
    T: 50,
    W: '100%',
  })

  P.allshare = [];

  P.createPubliceChannenl = (principalid, channelstr, index, nolimit) => {
    let [channel, title, author, time, size] = channelstr.split("%");
    let item                                 = P.getRemoteName(channel, principalid);

    let s = ''
    if(P.hasFavorite(item) || nolimit){
      s += `<div onclick="P_CHANNEL.selectPublic(this, event)" class="channel public"  data-id="${principalid}" data-channel="${channel}" data-index="${index}">`
      s += `<table>`
      s += `<tr>`
      s += `<td class="channel_avatar" title="${item}"><img class="avatar" onmouseover="P_CHANNEL.large(event)" onmouseout="P_CHANNEL.large()" src="${P_CANVAS.principalToAvatar(principalid)}"/></td>`;
      s += `<td class="author">${author}</td>`;
      s += `<td class="title">${title}</td>`;
      s += `<td class="sizetime">${$.SIZE(size || 0)}<br/>${$.getDatetime("dort", time)}</td>`;
      s += `<td class="channel_svg">${P.hasFavorite(item) ? SVG.favorite : SVG.unfavorite}</td>`;
      s += `</tr>`
      s += `</table>`
      s += `</div>`
    }

    return s
  }

  P.showPublic = function(){
    let s = "";
    let index = 1
    P.allshare.forEach((pair) => {
      let principalid    = pair[0];
      let shared_channel = pair[1].slice(1, -1).split("=_");

      shared_channel.map((channel_str) => {
        s += P.createPubliceChannenl(principalid, channel_str, index, 'nolimit')
        index++
      });
    });

    P.public_channel.I(s);

    P.publicFilter()
  };

  P.publicFilter = () =>{
    clearTimeout(P.public_filter_timer)
    P.public_filter_timer = setTimeout(function(){
      // console.log(LS.public_filter)
      // console.log(LS.public_isfavorite)
      // console.log(P.public_channel.context.children)

      let filter = (LS.public_filter || '').split(/\s+/)

      let channels = P.public_channel.context.children
      let cells, item, auther, title, favorite, show
      for(let i=0, l=channels.length; i<l; i++){
        cells = channels[i].children[0].rows[0].cells

        item   = cells[0].title
        auther = cells[1].innerHTML
        title  = cells[2].innerHTML
        is_favorite = P.hasFavorite(item)

        show = true
        if(LS.public_isfavorite=='1' && !is_favorite){
          show = false
        }
        else{
          for(let j=0, jl=filter.length; j<jl; j++){
            if(!$.F(auther, filter[j]) && !$.F(title, filter[j])){
              show = false
              break
            }
          }
        }

        channels[i].style.display = show ? '' : 'none'
        // console.log(item, auther, title, is_favorite, show)
      }
    }, 200)

  }

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
      console.log('P.allshare', P.allshare);

      P.showPublic();
    })();
  };

  P.selectPublic = function(node, event){
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

    let item = P.getRemoteName(node.dataset.channel, node.dataset.id);
    if(target){
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

      P.publicFilter()
      return;
    }

    P.unselectAll()

    P.focus_public = node
    // 如果P.showPublic发生了内容改变，这个P.focus_public变得无效，会发生什么怪异行为呢？
    // 评估下来最多就是选中的共享文件背景色消失

    P_MATJ.type = "public";
    P_MATJ.show_readonly.V();
    P_MATJ.message.V();

    P_MATJ.input_author.H()
    P_MATJ.input_title.H()

    P_MATJ.editor.setValue(LS['public_'+item] ||'');

    P_MATJ.public_file_name = node.dataset.id + node.dataset.channel;
    (async () => {
      let result     = await INNER.matj_default.getchannel(P_MATJ.public_file_name);
      console.log(P_MATJ.public_file_name, result)
      let detail_obj = P_MATJ.getDetail(result[0])

      if(detail_obj.code !== LS['public_'+item]){
        LS['public_'+item] = detail_obj.code
        P_MATJ.editor.setValue(detail_obj.code);
      }
    })();

    node.style.background = "#eee"

    P_MESSAGE.getMessage()
  };

  P.unselectPublic = ()=> {
    // P.focus_public 也可能是favorite的节点
    P.focus_public && (P.focus_public.style.background = "")
  }

  P.getPublicChannel();

  P.large = event => {
    if(!event){
      P_COPY.large_image.H()
    }
    else{
      P_COPY.large_image.V().S({
        L  : event.clientX + 20,
        T  : event.clientY - 40,
        src: event.target.src
      })
    }
  }

  P.hasFavorite = function(item){
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
