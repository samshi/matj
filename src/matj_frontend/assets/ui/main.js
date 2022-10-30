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
    T: 20,
    W: 388 + 40,
    F: 30,
    FF: "STSongti-SC-Bold, STSongti-SC",
    FW: "bold",
    C: "#000000",
    TA: "center",
    I: 'MatJ <span style="font-size:20px;color:#666">a js math library for matlab script</span>',
  });

  createCopyPage(main);
  createJsArea(main);
  createMatjArea(main);
  createChannel(main);
  createOutputArea(main);

  login(P_CHANNEL.login_box);

  onresize();

  // 切换上次的channel
  setTimeout(function () {
    P_CHANNEL.selectLocal(LS.focus_local || 1);
  }, 100);
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
