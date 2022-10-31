function login(f){
  var P = (W.P_LOGIN = f);

  P.connect_wallet = $.c(P, {
    // MT: 25,
    ML: 30,
    id: "connect_wallet",
    W : 120,
    H : 50,
    D : "inline-block",
    I : "Connect Wallet:",
    VA: 'bottom',
    F : 16
  })

  P.login_plug_box = $.c(P, {
    // MT: 25,
    ML: 10,
    id: "login_plug_box",
    W : 100,
    H : 50,
    PD: 8,
    BR: 10,
    D : "inline-block",
    TA: "center",
  })
    .over((eobj) => {
      eobj.S({
        BG: "#eee",
      });
    })
    .out((eobj) => {
      eobj.S({
        BG: "",
      });
    })
    .down(async (_) => {
      var plug_is_connected = await connectPlug();
      if(plug_is_connected){
        connectPlug2();
      }
    });

  P.plug_img = $.c(P.login_plug_box, {
    src: "img/plug.svg",
    H  : 50,
  }, "img");

  P.login_identity_box = $.c(P, P.login_plug_box.CSS_)
    .S({
      ML: 0,
      id: "login_identity_box",
    })
    .over((eobj) => {
      eobj.S({
        BG: "#eee",
      });
    })
    .out((eobj) => {
      eobj.S({
        BG: "",
      });
    })
    .down(connectIC);

  P.identity_img = $.c(P.login_identity_box, {
    src: "img/dfinity.png",
    H  : 70,
    MT : -7,
  }, "img");

  // ========================================
  P.login_plug_img = $.C(P, {
    // F:16,
    L  : 30,
    T  : 20,
    H  : 30,
    src: "img/plug.svg",
  }, "img").H();

  P.login_identity_img = $.C(P, {
    // F:16,
    L  : 27,
    T  : 26,
    H  : 16,
    src: "img/dfinity.svg",
  }, "img").H();

  P.account_balance = $.C(P, {
    F: 13,
    L: 67,
    T: P.login_plug_img.T_ + 5,
  }).H();

  P.id_avatar = $.C(P, {
    L : 165,
    T : P.login_plug_img.T_ + 2,
    TS: 300,
    CN: "avatar",
    W : 24,
    H : 24,
  }, "img")
    .H()
    .over((eobj) => {
      eobj.S({
        L: 165 - 29,
        T: P.login_plug_img.T_ - 20,
        W: 82,
        H: 82,
        Z: 1,
      });
    })
    .out((eobj) => {
      eobj.S({
        L: 165,
        T: P.login_plug_img.T_ + 2,
        W: 24,
        H: 24,
        Z: 0,
      });
    });

  P.account = $.C(P, {
    F    : 13,
    L    : 200,
    T    : P.account_balance.T_,
    title: 'Copy'
  }).H().down(eobj => {
    P_COPY.copyContent(DATA.accountId);
    eobj.S({title: "Copied"});

    setTimeout((_) => {
      eobj.S({title: "Copy"});
    }, 5000);
  });

  P.copy = $.C(P, {
    L  : 291,
    T  : P.account_balance.T_ + 3,
    W  : 12,
    src: 'img/copy.webp'
  }, 'img').down(eobj => {
    P_COPY.copyContent(DATA.accountId, 'accound id copied', eobj.X, eobj.Y);
  }).H()

  P.logout_btn = $.C(P, {
    L : 330,
    T : P.account_balance.T_ - 5,
    W : 70,
    PD: "5px 10px",
    I : "Logout",
  }, "button")
    .H()
    .down((_) => {
      if(DATA.login == "plug"){
        window.ic.plug.disconnect();
      }
      DATA  = {};
      // P_CHANNEL.share.H()
      var P = P_LOGIN;

      P.login_plug_img.H();
      P.login_identity_img.H();
      P.account_balance.H();
      P.id_avatar.H();
      P.account.H();
      P.copy.H();
      P.logout_btn.H();
      P.buymecafe.H();
      P.avatar.H();

      P.connect_wallet.V();
      P.login_plug_box.V();
      P.login_identity_box.V();

      for(let index in P_MATJ.timers){
        delete P_MATJ.timers[index];
        // 为什么要中断，因为已经disconnect了

        // P_CHANNEL.setLight(index, "#888");
        // P_CHANNEL.setMsg(index, "");
      }

      for(let i in P_CHANNEL.remotes){
        P_CHANNEL.remotes[i].H()
      }
    });

  // ====================================
  P.avatar = $.C(main, {
    src: "img/samshi.jpeg",
    L  : 45,
    T  : 'calc(100% - 70px)',
    W  : 30,
    H  : 30,
    BR : 20,
    TS : 300,
    BD : "1px solid #444",
  }, "img")
    .H()
    .over((eobj) => {
      eobj.S({
        L: 45 - 26,
        T: 'calc(100% - 96px)',
        W: 82,
        H: 82,
        Z: 1,
      });
    })
    .out((eobj) => {
      eobj.S({
        L: 45,
        T: 'calc(100% - 70px)',
        W: 30,
        H: 30,
        Z: 0,
      });
    });

  P.buymecafe = $.C(main, {
    I             : '<img width=24 src="img/cafe.svg" style="margin:0 0 0 10px;"/> <span style="line-height:30px;padding-right:10px;">support me on MatJ</span>',
    L             : 100,
    T             : P.avatar.T_,
    W             : 277,
    H             : 30,
    BR            : 20,
    F             : 14,
    BD            : "1px solid #666", // TA: "center",
    D             : 'flex',
    justifyContent: 'space-evenly',
  })
    .H()
    .down(async (eobj) => {
      let amount = +prompt("you will send author (accountId: 359646224d9cd82d26f73cc9dcddbaa041f13ee5802560b65f58db0ed02b8cf2) some ICP, the fixed gas fee is 0.0001 ICP", 0.1);
      if(typeof amount == "number" && amount > 0 && amount < DATA.icp_balance){
        let result = await payOwner("359646224d9cd82d26f73cc9dcddbaa041f13ee5802560b65f58db0ed02b8cf2", amount);
        if(result){
          getBalance();
          alert("thanks a lot!");
        }
        else{
          alert("transfer failed");
        }
      }
      else{
        alert("the amount is unavailable");
      }
    });
}
