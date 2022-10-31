// var CODEBASE = []
// $(function(){
//   for(let i = 1; i <= 10; i++){
//     (function(i){
//       $.get(`/test/test${i}.m`, '', res => {
//         if(res){
//           CODEBASE[i] = res
//           let name    = 'channel' + i
//           if(!LS[name]){
//             LS[name] = CODEBASE[i]
//             let m    = CODEBASE[i].match(/^\%\s*title\s*\=([\w\s]+?)\n/)
//             console.log(m)
//             if(m && m[1].trim()){
//               LS['channel_name_' + i] = m[1].trim()
//               let channel             = P_CHANNEL.locals[i]
//               channel.I(LS['channel_name_' + i])
//             }
//           }
//         }
//       })
//     })(i)
//   }
// })

onhashchange();

function encodeShare(s) {
  let out = "";
  for (let i = 0, l = s.length; i < l; i++) {
    let code = s.charCodeAt(i);
    //40-122
    code += i - 40;
    code = (code % 83) + 40;
    out += String.fromCharCode(code);
  }
  return encodeURI(out);
}

function decodeShare(s) {
  s = decodeURI(s);
  let out = "";
  for (let i = 0, l = s.length; i < l; i++) {
    let code = s.charCodeAt(i);
    //40-122
    code += -40 - i;
    code = ((code + 83) % 83) + 40;
    out += String.fromCharCode(code);
  }
  return out;
}

window.onhashchange = async function () {
  if (!window.INNER) {
    setTimeout(onhashchange, 200);
    return;
  }

  // let hash          = document.location.hash.slice(1);
  // let share_url     = decodeShare(hash)
  // let i             = P_CHANNEL.LEN
  // LS['channel' + i] = await INNER.matj_default.principalget(share_url)
  //
  // if(LS.focus_local == i){
  //   P_CHANNEL.selectLocal(i)
  // }
};

//=================================================
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
  let { title, author } = P_MATJ.getDetail(source);
  console.log(title, author);

  if(!title && !author){
    P_MATJ.addTitleAuthor(new_title, LS.author || "");
  }
  else{
    P_MATJ.setTitleAuthor(new_title, author || LS.author || "");
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

//=================================================

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

P.showTitleAuthor = (source) => {
  let index             = P_CHANNEL.focus_local;
  let { title, author } = P_MATJ.getDetail(source);
  console.log(title, author);
  title = title || `untitled ${index}`;
  if(author != ""){
    LS.author = author;
  }
  else if(LS.author){
    author = ""; //LS.author
  }
  P_CHANNEL.locals[index].I(title + " - " + author);
  // P_CHANNEL.showAuthor(author)

  P_MATJ.setTitleAuthor(title, author);
};

P.showAuthor = (author) => {
  P.author.I(`author: ${author || LS.author || "anonymous"}`);
};

//һ��ʼ����ʾ����Ƶ��
P.max();




public shared(msg) func setshare(name : Text, code: Text, index : Text, title: Text, author: Text, time: Text, size: Text) : async Text {
  let principalId = Principal.toText(msg.caller);
  map.put(principalId # name, code);

  await share(index, title, author, time, size)
};


P.addTitleAuthor = (title, author) => {
  let source = P_MATJ.editor.getValue();
  source     = `% title = ${title} % author = ${author} % time = ${$.MS()}\n` + source;
  P_MATJ.editor.setValue(source);
};

P.setTitleAuthor = (title, author) => {
  let source = P.editor.getValue();
  let info   = P.getDetail(source);
  if(info.title != title || info.author != author){
    let line0_pos = source.indexOf("\n");
    let new_line0 = `% title = ${title} % author = ${author} % time = ${$.MS()}\n`;
    source        = `${new_line0}\n` + source.slice(line0_pos);
    P_MATJ.editor.setValue(source);
  }
};
