function createLogin(f){
  var P = (W.P_LOGIN = $.C(f, {
    id: 'login_box',
    // BG: '#eee',
    L : 0,
    T : 52,
    W : 428,
    H : 75
  }))

  P.connect_wallet = $.C(P, {
    T : 12+15,
    L : 44,
    id: "connect_wallet", // W : 120,
    // H : 50,
    // D : "inline-block",
    // I : '<span style="font-size:16px;color:#000">Connect Wallet:</span><ul style="margin:5px 0 0 0; padding-inline-start:13px"><li>share code public<li>leave public message<li>earn by contribute</li>', // VA: 'bottom',
    I: 'Connect Wallet :',
    F : 16,
    // LH: 12,
    // C : '#666'
  })

  P.login_plug_box = $.C(P, {
    L : 180,
    T : 7,
    id: "login_plug_box",
    W : 100,
    H : 60,
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
      P.plug_wait.V()
      P.login_identity_box.H()
      P.plug_img.H()
      var plug_is_connected = await connectPlug();
      if(plug_is_connected){
        connectPlug2();
      }
      else{
        P.plug_wait.H()
        P.login_identity_box.V()
        P.plug_img.V()
      }
    });

  P.plug_img = $.C(P.login_plug_box, {
    src: "img/plug.svg",
    L  : 35,
    T  : 4,
    H  : 50,
  }, "img");

  P.plug_wait = $.C(P.login_plug_box, {
    I: SVG.wait,
    L: 30,
    T: 10,
    W: 40,
    H: 40
  }).H()

  P.login_identity_box = $.C(P, P.login_plug_box.CSS_)
    .S({
      L : 285,
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
    .down(() => {
      P.identity_wait.V()
      P.login_plug_box.H()
      P.identity_img.H()
      connectIC()
    });

  P.identity_img = $.C(P.login_identity_box, {
    src: "img/dfinity.png",
    L  : 3,
    T  : -3,
    H  : 70,
  }, "img");

  P.identity_wait = $.C(P.login_identity_box, P.plug_wait.CSS_).H()

  // ========================================
  P.login_plug_img = $.C(P, {
    // F:16,
    L  : 30,
    T  : 37,
    H  : 30,
    src: "img/plug.svg",
  }, "img").H();

  P.login_identity_img = $.C(P, {
    // F:16,
    L  : 27,
    T  : P.login_plug_img.T_ + 7,
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

      P_CHANNEL.remote_channels.H();

      P.login_plug_img.H();
      P.login_identity_img.H();
      P.account_balance.H();
      P.id_avatar.H();
      P.account.H();
      P.copy.H();
      P.logout_btn.H();
      P.support.H();

      P.connect_wallet.V();
      P.login_plug_box.V();
      P.plug_img.V()
      P.plug_wait.H()

      P.login_identity_box.V();
      P.identity_img.V()
      P.identity_wait.H()

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
  P.support = $.C(P, {}).H()

  P.avatar_t = 4
  P.avatar_l = 85
  P.avatar   = $.C(P.support, {
    src: "img/samshi.jpeg",
    L  : P.avatar_l,
    T  : P.avatar_t,
    W  : 30,
    H  : 30,
    BR : 20,
    TS : 300,
    BD : "1px solid #444",
  }, "img")
    .over((eobj) => {
      eobj.S({
        L: P_LOGIN.avatar_l - 30,
        T: 0,
        W: 75,
        H: 75,
        Z: 1,
      });
    })
    .out((eobj) => {
      eobj.S({
        L: P_LOGIN.avatar_l,
        T: P_LOGIN.avatar_t,
        W: 30,
        H: 30,
        Z: 0,
      });
    });

  P.buymecafe = $.C(P.support, {
    I             : '<img width=24 src="img/cafe.svg" style="margin:0 0 0 10px;"/> <span style="line-height:30px;padding-right:10px;">support MatJ</span>',
    L             : 140,
    T             : P.avatar.T_,
    W             : 172,
    H             : 30,
    BR            : 20,
    F             : 14,
    BD            : "1px solid #666", // TA: "center",
    D             : 'flex',
    BG            : '#fff',
    justifyContent: 'space-evenly',
  })
    .down(async (eobj) => {
      let amount = +prompt("you will send author (accountId: 359646224d9cd82d26f73cc9dcddbaa041f13ee5802560b65f58db0ed02b8cf2) some ICP, gas fee 0.0001 ICP", 0.1);
      if(typeof amount == "number" && amount > 0 && amount + 0.0001 <= DATA.icp_balance){
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
        alert("the amount is invalid");
      }
    });
}
