//==============================
//p5扩展
var X = 0, Y = 0, L = 0, T = 0, W = 300, H = 300, 动画模式 = 0, 边宽 = 1, ANIMATE = []
var CTX
// var 语音 = new p5.Speech(); // speech synthesis object
function createCanvas(w=300, h=300, gl){
  CTX = $.C(OUTPUT_PAGES[2], {
    W:w,
    H:h,
    // BG:'#fff'
  }, 'canvas').CTX
console.log(CTX.canvas.width,CTX.canvas.height)
  CTX.LW(1)
}
function createMainCanvas(w, h, gl){
  createCanvas(w, h, gl)
    // position()
  // angleMode(DEGREES)
  // strokeCap(ROUND)
  // strokeJoin(ROUND)
  // push()
}

function position(l, t){
  console.log(l, t)
  CTX.canvas.EOBJ.S({
    L: l,
    T: t,
    P: 'absolute'
  })
}

function slider(f, fn, f0, min, max, step, w, fn_after){
  window[f] = +f0 //+getLocal(f, f0)
  w         = w || 200
  step      = step || 1
  f0        = f0 || (min + max) / 2

  var myslider = $.C(OUTPUT_PAGES[2], {
    L : X,
    T : Y,
    W : w,
    BG: color(250)
  })

  var bar = $.C(myslider, {
    L    : 0,
    T    : 2,
    W    : w - 120,
    type : 'range',
    value: map(window[f], min, max, 0, 100)
  }, 'input').input(function(){
    var v = map(+this.val(), 0, 100, min, max)
    v     = $.FX($.R(v / step) * step * 10000) / 10000
    v     = constrain(v, min, max)
    if(inputval.val() != v){
      inputval.val(v)
      inputval.INPUT()
    }

    this.val(map(v, min, max, 0, 100))
  })

  var inputval = $.C(myslider, {
    L    : w - 110,
    T    : 1,
    type : 'number',
    min  : min,
    max  : max,
    step : step,
    value: window[f]
  }, 'input').input(function(){
    window[f] = constrain(+this.val(), min, max)

    setLocal(f, window[f])
    fn && fn(f)

    bar.val(map(window[f], min, max, 0, 100))
  })

  $.C(myslider, {
    I: f,
    L: 150
  }, 'nobr')

  fn_after && fn_after()
}

function radios(f, fn, f0, desc, fn_after){
  // window[f] = +getLocal(f, '')

  var myradio = $.C(OUTPUT_PAGES[2], {
    L: X,
    T: Y
  })

  var css = {
    name: f,
    L   : 0,
    T   : 2,
    type: 'radio'
  }

  if(window[f] == f0){
    css.checked = 'checked'
  }
  var radio = $.C(myradio, css, 'input').change(function(){
    if(this.context.checked){
      window[f] = f0
      setLocal(f, window[f])
      fn && fn(f0, desc)
    }
  })

  $.C(myradio, {
    I: f0 + ' ',
    L: 30
  }, 'nobr')

  fn_after && fn_after()
}

function checkbox(f, fn, f0, desc, fn_after){
  window[f] = +getLocal(f, '')

  var box = $.C(OUTPUT_PAGES[2], {
    L: X,
    T: Y
  })

  var check = $.C(box, {
    name   : f,
    L      : 0,
    T      : 2,
    type   : 'checkbox',
    checked: window[f] == f0
  }, 'input').change(function(){
    window[f] = this.context.checked ? 1 : ''
    setLocal(f, window[f])
    fn && fn(f0, desc)
  })

  $.C(box, {
    I: f + ' ',
    L: 30
  }, 'nobr')

  fn_after && fn_after()
}

function createNodeObj(css, el, father){
  father = father || OUTPUT_PAGES[2]
  return $.C(father, css, el)
}

function getLocal(s, def){
  var local = sessionStorage[s]
  if(local){
    try{
      var obj = JSON.parse(local)
      return obj
    }
    catch(e){
      console.log(e, s, local)
    }
    return local
  }

  return def
}

function setLocal(s, obj){
  sessionStorage[s] = JSON.stringify(obj)
  // localStorage[s] = $.isString(obj) ? obj : JSON.stringify(obj)
}

function linspace_del(start, end, n){
  n = Math.max(1, n || 100)
  if(n == 1){
    return [start]
  }
  else if(n == 2){
    return [start, end]
  }
  var step = (end - start) / (n - 1)
  return createArr(start, step, end)
}

function createArr(min, step, max){
  var a = []
  for(var i = min; i <= max + step / 2; i += step){
    a.push($.FX(i, 10))
  }
  return a
}