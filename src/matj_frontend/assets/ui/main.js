let VERSION = 1.0;
let W = window;
let LS = localStorage;
let DATA = {};

W.onresize = function () {
  clearTimeout(W.resize_timer);
  resize_timer = setTimeout(delayResize, 100);
};

function delayResize() {
  W.IW = $.IW();
  W.IH = $.IH();

  RESIZE($.body);
}

$(function () {
  W.main = $.c(
    $.body,
    {
      W: $.IW() * 1,
      H: $.IH() * 1,
      BG: "#f8f8f8",
    },
    "main"
  );

  $.C(main, {
    L: 0,
    T: 8,
    W: 428,
    F: 30,
    FF: "STSongti-SC-Bold, STSongti-SC",
    FW: "bold",
    C: "#000000",
    TA: "center",
    title: 'support MatJ',
    I: 'MatJ <span style="font-size:20px;color:#666">a js math library for matlab script</span>',
  }).down(_ => {
    if(DATA.icp_balance){
      P_LOGIN.support.toggle()
    }
  });

  createCopyPage(main);
  createAvatarPage(main);
  createJsArea(main);
  createMessageArea(main);
  createMatjArea(main);
  createChannel(main);
  createOutputArea(main);

  createLogin(main);

  onresize();

  let hash = location.hash.slice(1)
  let P = P_CHANNEL
  if(/^\w{8}\d{1,2}$/.test(hash)){
    P.addFavorite(hash)
    P.tab.DOWN({
      target_eobj: P.favorite_tab,
    });
  }
  else{
    // 切换上次的channel
    P.tab.DOWN({
      target_eobj: P.local_tab,
    });

    setTimeout(function () {
      P.selectLocal(LS.focus_local || 1);
    }, 100);
  }

});

function RESIZE(eobj) {
  if (!eobj) {
    // || eobj.isH()
    return;
  }

  if (eobj.resize) {
    console.log("resize", eobj.ID_);
    eobj.resize(eobj);
  } else {
    // console.log('no resize', eobj.ID_)
  }

  if (eobj.CHILDREN) {
    eobj.CHILDREN.forEach(function (a) {
      RESIZE(a);
    });
  }
}
