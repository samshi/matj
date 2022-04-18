function createChannel(f){
  var P = W.P_CHANNEL = $.C(f, {
    id: 'channel_box',
    L : 0,
    T : 220,
    W : 388,
    H : 38,//580,
    BG: '#fff',
    PD: 20,
    BR: 5,
    O : 'hidden'
  })
  //   .click(eobj => {
  //   eobj.H_ == 38 ? P.max() : P.min()
  // })

  P.channels = []
  for(var i = 0; i < 10; i++){
    // var html      = {0: 'local'}[i] || 'remote ' + i
    var html      = LS['channel_name_' + i] ?? 'file' + (i + 1)
    P.channels[i] = $.C(P, {
      L : 20,
      T : 60 * i + 18,
      W : 150,
      H : 40,
      F : 20,
      C : '#000000',
      TA: 'center',
      I : html
    }, 'button').click(eobj => {
      if(P_CHANNEL.freeze){
        return
      }

      P_CHANNEL.selectChannel(eobj.index)
    })

    P.channels[i].index = i

    P.channels[i].input_component = $.C(P, {
      L : 20,
      T : 60 * i + 18,
      W : 400,
      H : 40,
      BG: '#fff',
      Z : 1
    }).H()

    P.channels[i].input  = $.C(P.channels[i].input_component, {
      W : 142,
      H : 34,
      F : 20,
      C : '#000000',
      TA: 'center',
    }, 'input')
    P.channels[i].ok     = $.C(P.channels[i].input_component, {
      L    : 170,
      W    : 80,
      H    : 38,
      F    : 20,
      I    : 'ok',
      title: i
    }, 'button').click(eobj => {
      let index               = eobj.TITLE_
      let channel             = P_CHANNEL.channels[index]
      let new_name            = channel.input.val()
      LS['channel_name_' + index] = new_name
      channel.I(new_name)
      eobj.FATHER.H()
    })
    P.channels[i].cancel = $.C(P.channels[i].input_component, {
      L: 270,
      W: 100,
      H: 38,
      F: 20,
      I: 'cancle'
    }, 'button').click(eobj => {
      eobj.FATHER.H()
    })

    P.channels[i].light = $.C(P, {
      L : 180,
      T : P.channels[i].T_ + 10,
      W : 20,
      H : 20,
      BR: 10, // BD: 'gray'
    })

    P.channels[i].msg = $.C(P, {
      L : 210,
      T : P.channels[i].T_ + 5,
      W : 100,
      H : 30,
      F : 20,
      // BD: '1px solid'
    })

    P.channels[i].rename = $.C(P, {
      L    : 330,
      T    : P.channels[i].T_,
      W    : 80,
      H    : 40,
      F    : 20,
      C    : '#000000',
      TA   : 'center',
      I    : 'rename',
      title: i
    }, 'button').click(eobj => {
      let index   = eobj.TITLE_
      let channel = P_CHANNEL.channels[index]
      channel.input_component.toggle()
      channel.input.focusMe().val(channel.I_)
    })
  }

  P.selectChannel = n => {
    LS.focus_channel = n
    var code         = LS['channel' + n] || default_code[0] || ''
    noOnChange       = true
    P_MATJ.editor.setValue(code)

    P.focus_channel = n
    P.channels.forEach(eobj => {
      eobj.S({
        C: n == eobj.index ? 'red' : ''
      })

      eobj.light.S({
        BG: LS['channel' + eobj.index] ? '#888' : ''
      })
    })
  }

  P.setLight = (n, c) => {
    P.channels[n].light.S({
      BG: c
    })
  }

  P.checkLight = n => {
    let P    = P_CHANNEL
    let eobj = P.channels[n]
    let c    = LS['channel' + eobj.index] ? '#888' : ''
    P.setLight(n, c)
  }

  P.setMsg = (n, s) => {
    P.channels[n].msg.I(s)
  }

  P.max = () => {
    P_CHANNEL.S({
      H: 580
    })
  }
  P.min = () => {
    P_CHANNEL.S({
      H: 38
    })
  }

  P.getChannelsCode = () => {
    (async () => {
      let P             = P_CHANNEL
      let principal_str = DATA.principal + ''
      for(let i = 1; i < 10; i++){
        let name = 'channel' + i
        P.setLight(i, 'green')
        P.setMsg(i, 'loading')
        console.log(Date.now(), principal_str + name)
        let result = await INNER.matjonic_default.principalget(principal_str + name)
        console.log(Date.now(), principal_str + name, result)
        LS[name] = result[0] || default_code[i] || ''
        P.checkLight(i)
        P.setMsg(i, LS[name] ? 'loaded' : 'empty')
      }
    })()
  }

  //一开始就显示所有频道
  P.max()
}

let default_code = {
  0: `x=[1:10]
y(0)=1;
for i=2:10
  y(i-1)=y(i-2)*3;
end
plot(x, y)
y`,
  1: `a=[1,2,3]
b=[2,4,6]
c=a+1
d=b-2
e=c+d
f=[2 3 4;4 5 6]
g = [ 11 12 13 14 ...
  21 22 23 24 ...
  31 32 33 34 ]
h=[0:9]
m=[1:2:10;2:6]
n = m(null,2:end-2)
n(1:) = 3
n
m
n(0, 0:1)
[j k] = n(0, 0:1)
j
k`,
  2: '\n// example 1\ns=0;\nfor i=1:10\n  s=s+i/(2*i+1);\nend\ns\n\nsum((1:10)./(3:2:21))\n',
  3: '\ns=0;\nfor i=1:100\n  if mod(i,3)==0 && mod(i,7)==0\n    s=s+i;\n  end\nend\ns\n',
  4: '\nx=[1:10]\ny(0)=1;\nfor i=2:10\n  y(i-1)=y(i-2)*2;\nend\nplot(x, y)\ny',
  5: `// find the number which is equal to sum of factor
p=[];
for n=2:5000
  s=0;
  for r=1:n-1
    if mod(n,r)==0
      s=s+r;
    end
  end
  if s==n
    p=[p n];
  end
end
p`,
  6: "a = [2 3 4;4 5 6]\nb=a'\nc=b'",
}

