var 等轴   = 0
var PLOT = {}

function title(s){
  createNodeObj({
    I : s,
    L : L,
    T : 10,
    W : W,
    H : 30,
    TA: 'center',
    LH: 30
  })
}

function xlabel(s){
  createNodeObj({
    I : s,
    L : PLOT.L,
    T : PLOT.H + PLOT.T + 60,
    W : PLOT.W,
    H : 20,
    LH: 20,
    F : 24,
    TA: 'center'
  })
}

function ylabel(s){
  OUTPUT_PAGES[2].SET3D()
  createNodeObj({
    I : s,
    L : PLOT.L - 50 - PLOT.H / 2,
    T : PLOT.T + PLOT.H / 2 - 15,
    W : PLOT.H,
    H : 20,
    LH: 20,
    F : 24,
    TA: 'center',
    RZ: -90, // BD:'1px solid',
    // VA:'bottom',

  })
}

function title(s){
  OUTPUT_PAGES[2].SET3D()
  createNodeObj({
    I : s,
    L : PLOT.L,
    T : PLOT.T - 45,
    W : PLOT.W,
    H : 20,
    LH: 20,
    F : 30,
    TA: 'center'
  })
}

function polygon(){
  var len = arguments.length, arr
  if(len == 1 && $.isArray(arguments[0])){
    arr = arguments[0]
  }
  else if(len % 2 == 0 && len >= 6){
    arr = arguments
  }

  beginShape()

  for(var i = 0, l = arr.length; i < l; i += 2){
    vertex(arr[i], arr[i + 1])
  }

  endShape(CLOSE)

}

function axisEqual(){
  等轴 = 1
}

function axisFull(){
  等轴 = 0
}

function fill(n){
  CTX.FS(`rgb(${n},${n},${n})`)
}

function stroke(n){
  // console.log(n)
  CTX.SS(typeof (n) == 'number' ? `rgb(${n},${n},${n})` : n)
}

function strokeWeight(n){
  CTX.LW(n)
}

function rect(x, y, w, h){
  CTX.SR(x, y, w, h).FR(x, y, w, h)
}

function noFill(){
  CTX.C()
}

function beginShape(){
  CTX.B()
}

function endShape(){
  CTX.C()
}

function vertex(x, y){
  CTX.L(x, y)
}

function drawMarker(x, y, marker){
  CTX.FT(marker, x, y)
}

function map(v, a, b, c, d){
  v = Math.max(a, v)
  v = Math.min(b, v)

  return (v - a) / (b - a) * (d - c) + c
}

function line(x0, y0, x1, y1, color = 0){
  stroke(color)
  CTX.LN(sl(x0), sl(y0), sl(x1), sl(y1))
}

function lineSolo(x0, y0, x1, y1, color = 0){
  beginShape()
  stroke(color)
  CTX.LN(sl(x0), sl(y0), sl(x1), sl(y1))
  endShape()
  CTX.stroke()
}

function sl(a){
  return Math.round(a) - 0.5
}

function simplechart(type, y, x, setting){
  var option = {
    // title: {
    //   text: '图'
    // },
    tooltip: {
      trigger: 'axis'
    },
    xAxis  : {
      type       : 'category',
      boundaryGap: type == 'bar',
      data       : x
    },
    yAxis  : {
      type: 'value'
    },

  }

  if($.isArray(y[0])){
    option.series = []
    y.forEach(d => {
      option.series.push(series_type(d, type))
    })
  }
  else{
    option.series = [series_type(y, type)]
  }

  console.log(option)
  myechart(option)

  function series_type(d, type){
    var obj = {
      data: d,
      type: type
    }

    if(type == 'smooth'){
      obj.type   = 'line'
      obj.smooth = true
    }
    else if(type == 'area'){
      obj.type      = 'line'
      obj.areaStyle = {}
    }
    return obj
  }
}

function expand(a, b){
  for(var item in b){
    if(!a[item]){
      a[item] = b[item]
    }
    else if($.isArray(b[item])){
      if(!$.isArray(a[item])){
        a[item] = b[item]
      }
      else if(b[item].length){
        expand(a[item], b[item])
      }
    }
    else if($.isObject(b[item])){
      if(!$.isObject(a[item])){
        a[item] = b[item]
      }
      else if(Object.keys(b[item]).length){
        expand(a[item], b[item])
      }
    }
    else{
      a[item] = b[item]
    }
  }
}

function plot_e(y, x, setting){ //折线图
  simplechart('line', y, x, setting)
}

function bar_e(y, x, setting){ //柱状图
  simplechart('bar', y, x, setting)
}

function pie_e(y, setting){ //饼图
  var option = {
    series: [
      {
        type     : 'pie', // radius   : '75%',
        center   : ['50%', '50%'],
        data     : y,
        animation: false,
        label    : {
          position   : 'outer',
          alignTo    : 'none',
          bleedMargin: 5
        }, // left     : 0,
        // right    : 0,
        // top      : 0,
        // bottom   : 0
      }
    ]
  }

  if(setting){
    expand(option, setting)
  }

  console.log(option)
  myechart(option)
}

function scatter_e(y, x, setting){ //散点图
  simplechart('scatter', y, x, setting)
}

function area_e(y, x, setting){ //区域图
  simplechart('area', y, x, setting)
}

function line_smooth_e(y, x, setting){ //散点图
  simplechart('smooth', y, x, setting)
}

function line_stack_e(y, x){ //散点图
  var series = []
  var legend = []
  for(var item in y){
    legend.push(item)
    series.push({
      name : item,
      type : 'line',
      stack: '总量',
      data : y[item]
    })
  }
  simplechart('line', y, x, {
    legend: {
      data: legend
    },
    series: series,
  })
}

function area_stack_e(y, x){ //散点图
  var series = []
  var legend = []
  for(var item in y){
    legend.push(item)
    series.push({
      name     : item,
      type     : 'line',
      stack    : '总量',
      areaStyle: {},
      data     : y[item]
    })
  }
  simplechart('line', y, x, {
    legend: {
      data: legend
    },
    series: series,
  })
}

function func_chart(y, setting){
  var option = {
    animation: false,
    xAxis    : {
      name: 'x',
    },
    yAxis    : {
      name: 'y',
    },
    dataZoom : [
      {
        type      : 'slider',
        filterMode: 'none',
        xAxisIndex: [0],
        startValue: -20,
        endValue  : 20
      }, {
        show      : true,
        type      : 'slider',
        filterMode: 'none',
        yAxisIndex: [0],
        startValue: -20,
        endValue  : 20
      }
    ],
    series   : [
      {
        type      : 'line',
        showSymbol: false,
        clip      : true,
        data      : y
      }
    ]
  }

  if(setting){
    expand(option, setting)
    console.log(option)
  }

  myechart(option)
}

function myechart(option){
  var node = OUTPUT_PAGES[2].context  //document.getElementById('div_echarts')
  $(node).S({Z: 1})
  var mychart = echarts.init(node)
  mychart.setOption(option)
}

function bar(){
  var z      = 拆解参数(arguments, 1)
  var x      = z.x
  var y      = z.y
  var x_suit = z.x_suit
  var y_suit = z.y_suit
  var group  = z.group
  var W      = z.W

  x_suit.barwidth = 0.5

  var 刻度长 = 7

  绘制x坐标轴(W, x, 刻度长, x_suit)
  绘制y坐标轴(W, y, 刻度长, y_suit, 1)

  group.forEach(function(item){
    绘制条形图(x_suit, y_suit, item[0], item[1], item[2])
  })
}

function histogram(){
  var z      = 拆解参数(arguments, 1)
  var x      = z.x
  var y      = z.y
  var x_suit = z.x_suit
  var y_suit = z.y_suit
  var group  = z.group
  var W      = z.W

  x_suit.barwidth = 1

  var 刻度长 = 7

  绘制x坐标轴(W, x, 刻度长, x_suit)
  绘制y坐标轴(W, y, 刻度长, y_suit, 1)

  group.forEach(function(item){
    绘制直方图(x_suit, y_suit, item[0], item[1], item[2])
  })
}

function stem(){
  var z      = 拆解参数(arguments, 1)
  var x      = z.x
  var y      = z.y
  var x_suit = z.x_suit
  var y_suit = z.y_suit
  var group  = z.group
  var W      = z.W

  var 刻度长 = 7

  绘制x坐标轴(W, x, 刻度长, x_suit)
  绘制y坐标轴(W, y, 刻度长, y_suit, 1)

  group.forEach(function(item){
    绘制针状图(x_suit, y_suit, item[0], item[1], item[2])
  })
}

function scatter(){
  var z      = 拆解参数(arguments, 1)
  var x      = z.x
  var y      = z.y
  var x_suit = z.x_suit
  var y_suit = z.y_suit
  var group  = z.group
  var W      = z.W

  var 刻度长 = 7

  绘制x坐标轴(W, x, 刻度长, x_suit)
  绘制y坐标轴(W, y, 刻度长, y_suit, 1)

  group.forEach(function(item){
    绘制散点图(x_suit, y_suit, item[0], item[1], item[2])
  })
}

function plot3(x, y, z, setting){
  var data = []
  // // Parametric curve
  z.forEach((v, i) => data.push([x[i % x.length], y[(i / y.length) | 0], v]))
  // for (var t = 0; t < 1; t += 0.001) {
  //   var x = (1 + 0.25 * Math.cos(75 * t)) * Math.cos(t);
  //   var y = (1 + 0.25 * Math.cos(75 * t)) * Math.sin(t);
  //   var z = t + 2.0 * Math.sin(75 * t);
  //   data.push([x, y, z]);
  // }
  console.log(data)

  option = {
    tooltip        : {},
    backgroundColor: '#fff',
    visualMap      : {
      show     : false,
      dimension: 2,
      min      : -0.5,
      max      : 0.5,
      inRange  : {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      }
    },
    xAxis3D        : {
      type: 'value', // data:x
    },
    yAxis3D        : {
      type: 'value', // data:y
    },
    zAxis3D        : {
      type: 'value', // data:z
    },
    grid3D         : {
      viewControl: {
        projection: 'orthographic'
      }
    },
    series         : [
      {
        type     : 'surface',
        data     : data,
        lineStyle: {
          width: 1
        }
      }
    ]
  }

  if(setting){
    expand(option, setting)
  }

  myechart(option)
}

function plotsurf(x, y, z, setting){
  var data = []
  var min  = z[0]
  var max  = z[0]
  z.forEach((v, i) => {
    min = Math.min(min, v)
    max = Math.max(max, v)
    data.push([x[i % x.length], y[(i / y.length) | 0], v])
  })
  // for (var t = 0; t < 1; t += 0.001) {
  //   var x = (1 + 0.25 * Math.cos(75 * t)) * Math.cos(t);
  //   var y = (1 + 0.25 * Math.cos(75 * t)) * Math.sin(t);
  //   var z = t + 2.0 * Math.sin(75 * t);
  //   data.push([x, y, z]);
  // }
  // console.log(data)

  option = {
    tooltip        : {},
    backgroundColor: '#fff',
    visualMap      : {
      show     : false,
      dimension: 2,
      min      : min,
      max      : max,
      inRange  : {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      }
    },
    xAxis3D        : {
      type: 'value', // data:x
    },
    yAxis3D        : {
      type: 'value', // data:y
    },
    zAxis3D        : {
      type: 'value', // data:z
    },
    grid3D         : {
      viewControl: {
        projection: 'orthographic'
      }
    },
    series         : [
      {
        type     : 'surface',
        data     : data,
        lineStyle: {
          width: 1
        }
      }
    ]
  }

  if(setting){
    expand(option, setting)
  }

  myechart(option)
}

function surface(setting){
  option = {
    tooltip        : {},
    backgroundColor: '#fff',
    visualMap      : {
      show     : false,
      dimension: 2,
      min      : -2,
      max      : 2,
      inRange  : {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      }
    },
    xAxis3D        : {
      type: 'value'
    },
    yAxis3D        : {
      type: 'value'
    },
    zAxis3D        : {
      type: 'value'
    },
    grid3D         : {
      viewControl: {
        // projection: 'orthographic'
      }
    },
    series         : [
      {
        type     : 'surface',
        wireframe: {
          // show: false
        },
        equation : {
          x: {
            step: 0.05
          },
          y: {
            step: 0.05
          },
          z: function(x, y){
            // if (Math.abs(x) < 0.05 && Math.abs(y) < 0.05) {
            //   return '-';
            // }
            return Math.sin(x * Math.PI) * Math.sin(y * Math.PI)
          }
        }
      }
    ]
  }

  if(setting){
    expand(option, setting)
  }

  myechart(option)
}

function plot(){
  var z = 拆解参数(arguments)
  console.log(z)
  var {x_suit, y_suit, group} = z

  var 刻度长 = 7

  绘制x坐标轴(PLOT.H, x_suit, 刻度长, 1)
  绘制y坐标轴(PLOT.W, y_suit, 刻度长, 1)
  // CTX.stroke()
  group.forEach(function(item, index){
    绘制折线图(index, x_suit, y_suit, item[0], item[1], item[2])
  })
}

function 拆解参数(arg, bool){
  var target = OUTPUT_PAGES[2]
  var W      = target.W_ * .82 - 40 //windowWidth
  var H      = target.H_ * .82 - 20 //windowHeight
  var L      = target.W_ * .09 + 35
  var T      = target.H_ * .09 - 5
  createMainCanvas(W + 10, H + 10)
  position(L, T)
  target.S({
    BG: '#f0f0f0'
  })

  fill(255)
  stroke(0)
  strokeWeight(1)
  rect(5, 5, W, H)

  var x     = [], y = [], x1, y1
  var group = []

  if(bool){
    y.push(0)
  }

  let len = arg.length
  let item
  for(let i = 0; i < len; i++){
    if(isNda(arg[i])){
      arg[i] = arg[i].simple().data
    }
  }

  // console.log(arg)
  for(let i = 0; i < len; i++){
    if($.isArray(arg[i])){
      if($.isArray(arg[i + 1])){
        x1 = arg[i].filter(n => n !== null)
        y1 = arg[i + 1].filter(n => n !== null)

        x.push(Math.min(...x1))
        x.push(Math.max(...x1))
        y.push(Math.min(...y1))
        y.push(Math.max(...y1))

        if(arg[i + 2] && $.isString(arg[i + 2])){
          group.push([arg[i], arg[i + 1], arg[i + 2]])
          i += 2
        }
        else{
          group.push([arg[i], arg[i + 1]])
          i += 1
        }
      }
      else{
        y1 = arg[i].filter(n => n !== null)

        var x_arr = linspace(0, arg[i].length - 1, arg[i].length)
        x.push(0)
        x.push(arg[i].length - 1)
        y.push(Math.min(...y1))
        y.push(Math.max(...y1))
        group.push([x_arr, arg[i]])
      }
    }
    else{
      group[group.length - 1].push(arg[i])
    }
  }

  var x_suit = 坐标轴适配(x, bool)
  var y_suit = 坐标轴适配(y)

  x_suit.mid = W / 2 + 5
  y_suit.mid = H / 2 + 5

  var rx = W / (x_suit._max - x_suit._min)
  var ry = H / (y_suit._max - y_suit._min)

  if(等轴){
    if(rx > ry){
      x_suit.w      = ry * (x_suit._max - x_suit._min) / 2
      x_suit._inter = y_suit._inter
    }
    else{
      y_suit.w      = rx * (y_suit._max - y_suit._min) / 2
      y_suit._inter = x_suit._inter

    }
  }

  group.forEach(function(item){
    if(item[2] && item[2].x){
      x_suit._inter = item[2].x
      x_suit._max   = Math.max(...item[0])
    }

    if(item[2] && item[2].y){
      y_suit._inter = item[2].y
      y_suit._max   = Math.max(...item[1])
    }
  })

  // console.log(x_suit, y_suit)
  PLOT = {
    ...PLOT,
    W,
    H,
    L,
    T
  }
  return {
    x,
    y,
    x_suit,
    y_suit,
    group,
  }
}

function 坐标轴适配(a, 最小间隔){
  let b          = a.slice()
  b              = b.filter(n => isFinite(n))
  var _min       = keepZero(Math.min(...b))
  var _max       = keepZero(Math.max(...b))
  var _absmax    = Math.abs(_max - _min)
  var _grade     = Math.pow(10, Math.floor(Math.log10(_absmax)) - 1) //位数
  var _min_grade = Math.floor(_min / _grade)
  var _max_grade = Math.ceil(_max / _grade)
  var _inter     = Math.ceil(_absmax / _grade / 10)

  console.log({
    _min,
    _max,
    _absmax,
    _grade,
    _min_grade,
    _max_grade,
    _inter
  })
  // console.log(_absmax, _grade)
  if(_inter >= 6){
    _grade *= 10
    _inter = 1
  }
  else if(_grade == 0.1){
    //个数 < 10
    _grade *= 5
    _inter = 1
  }
  else if(最小间隔){
    // if(_inter == 2){
    //   //10～20个数字
    //   _inter = 1
    // }
    // else if(_inter == 3){
    //   //20～30个数字
    //   _inter = 2
    // }
    // else if(_inter == 4){
    //   //30～40个数字
    //   _inter = 3
    // }
    // else if(_inter == 5){
    //   //40～50个数字
    //   _inter = 5
    // }
  }
  else if(_inter >= 4){
    _grade *= 5
    _inter = 1
  }

  _min_grade = Math.floor(_min / _grade)
  _max_grade = Math.ceil(_max / _grade)

  return {
    _min  : keepZero(_min_grade * _grade),
    _max  : keepZero(_max_grade * _grade),
    _inter: keepZero(_inter * _grade)
  }
}

function 绘制x坐标轴(w, suit, 刻度长, 基准横线){
  function 处理(i){
    var value, x_pos, 边距
    value = $.FX(i, 10)
    x_pos = x轴数值转坐标(value, suit)
    边距    = Math.abs(x_pos - suit.mid) - suit.mid + 5
    if(边距 < -0.01){
      lineSolo(x_pos, 5, x_pos, 5 + 刻度长)
      if(刻度长 !== w){
        lineSolo(x_pos, w + 5 - 刻度长, x_pos, w + 5)

        if(基准横线){
          lineSolo(x_pos, 5 + 刻度长, x_pos, w + 5 - 刻度长, 220) //中间网格
        }
      }
    }
    else if(边距 > 0.01){
      return true
    }

    createNodeObj({
      I : value,
      L : PLOT.L - 31 + x_pos + 1,
      T : PLOT.T + PLOT.H + 10,
      W : 61,
      H : 30,
      LH: 30,
      TA: 'center',
      F : 20
    }, 'div', OUTPUT_PAGES[2])
  }

  for(var i = suit._min; i <= suit._max; i += suit._inter){
    if(处理(i)){
      break
    }
  }

  if(suit.w){
    var i = suit._min
    while(1){
      i -= suit._inter
      if(处理(i)){
        break
      }
    }
  }
}

function 绘制y坐标轴(w, suit, 刻度长, 基准横线){
  function 处理(i){
    var value, y_pos, 边距
    y_pos = y轴数值转坐标(i, suit)

    边距 = Math.abs(y_pos - suit.mid) - suit.mid + 5

    if(边距 < -0.01){
      lineSolo(5, y_pos, 5 + 刻度长, y_pos) //右侧刻度
      if(刻度长 !== w){
        lineSolo(w + 5 - 刻度长, y_pos, w + 5, y_pos) //右侧刻度

        if(基准横线){
          lineSolo(5 + 刻度长, y_pos, w + 5 - 刻度长, y_pos, 220) //中间网格
        }
      }
    }
    else if(边距 > 0.01){
      return true
    }

    createNodeObj({
      I : $.FX(i, 10),
      L : PLOT.L - 100 - 10,
      T : PLOT.T + y_pos - 15 + 1,
      W : 100,
      H : 30,
      LH: 30,
      TA: 'right',
      F : 20
    }, 'div', OUTPUT_PAGES[2])
  }

  for(var i = suit._min; i <= suit._max; i += suit._inter){
    if(处理(i)){
      break
    }
  }

  if(suit.w){
    var i = suit._min
    while(1){
      i -= suit._inter
      if(处理(i)){
        break
      }
    }
  }

  if(基准横线){
    var 水平线 = y轴数值转坐标(0, suit)
    if(suit._min != 0 || suit._max != 0){
      // strokeWeight(1)
      // line(5, 水平线, 5 + PLOT.W, 水平线) // 不知在何处
    }

    suit.水平线 = 水平线
  }
}

function x轴数值转坐标(value, suit){
  var adj = suit.barwidth ? 0.9 : 0 //x轴左右边界是否和刻度空开一定距离
  var w   = suit.w || suit.mid - 5
  return map(value, suit._min - adj, suit._max + adj, suit.mid - w, suit.mid + w)
}

function y轴数值转坐标(value, suit){
  return PLOT.H + 10 - x轴数值转坐标(value, suit)
}

function 提取颜色(setting){
  return !setting || $.isString(setting) || $.isFunction(setting) || setting.mode ? setting : setting.c
}

function 绘制折线图(index, x_suit, y_suit, x, y, setting = {}){
  let color_map = {
    b: '#00f', //blue
    r: '#f00', //red
    g: '#0f0', //green
    c: '#0ff', //cyan
    m: '#f0f', //magenta
    k: '#000', //black
    y: '#ff0', //yellow
    w: '#fff', //white
  }

  let color_arr = Object.entries(color_map)
  let color     = color_arr[index][1]

  if(typeof setting == 'string'){
    console.log(setting)

    for(let c in color_map){
      if(setting.indexOf(c) >= 0){
        color   = color_map[c]
        setting = setting.replace(c, '')
        break;
      }
    }

    var line_style = ''
    let line_map   = {
      // '-' : 'Solid line',
      '--': 'Dashed',
      ':' : 'Dotted',
      '-.': 'Dash-dotted',
    }
    for(let c in line_map){
      if(setting.indexOf(c) >= 0){
        line_style = line_map[c]
        setting    = setting.replace(c, '')
        break;
      }
    }

    var marker     = ''
    let marker_map = {
      'o': ['o', 20, -6, 5],//'Circle                    ',    //Sample of circle marker
      '+': ['+', 20, -6, 5],//'Plus sign                 ',    //Sample of plus sign marker
      '*': ['*', 20, -5, 11],//'Asterisk                  ',    //Sample of asterisk marker
      '.': ['●', 16, -5, 5],//'Point                     ',    //Sample of point marker
      'x': ['x', 20, -5, 5],//'Cross                     ',    //Sample of cross marker
      '_': ['--', 20, -7, 6],//'Horizontal line           ',    //Sample of horizontal line marker
      '|': ['|', 20, -4, 6],//'Vertical line             ',    //Sample of vertical line marker
      's': ['■', 16, -8, 6],//'Square                    ',    //Sample of square marker
      'd': ['★', 16, -8, 5],//'Diamond                   ',    //Sample of diamond line marker
      '^': ['▲', 16, -9, 6],//'Upward-pointing triangle  ',    //Sample of upward-pointing triangle marker
      'v': ['▼', 16, -9, 7],//'Downward-pointing triangle',    //Sample of downward-pointing triangle marker
      '>': ['>', 20, -7, 6],//'Right-pointing triangle   ',    //Sample of right-pointing triangle marker
      '<': ['<', 20, -7, 5],//'Left-pointing triangle    ',    //Sample of left-pointing triangle marker
      'p': ['★', 16, -8, 5],//'Pentagram                 ',    //Sample of pentagram marker
      'h': ['h', 20, -7, 6],//'Hexagram                  ',    //Sample of hexagram marker
    }
    for(let c in marker_map){
      if(setting.indexOf(c) >= 0){
        marker = marker_map[c]
        break;
      }
    }
  }

  // console.log(color, line_style, marker)
  // var c = 'blue' //提取颜色(setting)
  strokeWeight(setting.w || 1.5)
  var color_func = $.isFunction(setting)
  if(!color_func){
    stroke(color || 'blue')
  }
  else{
    myStroke(color, 0)
  }

  if(line_style == 'Dashed'){
    CTX.setLineDash([10, 10])
  }
  else if(line_style == 'Dotted'){
    CTX.setLineDash([5, 10])
  }
  else if(line_style == 'Dash-dotted'){
    CTX.setLineDash([15, 5, 5, 5])
  }
  // '--': 'Dashed',
  // ':' : 'Dotted',
  // '-.': 'Dash-dotted',
  noFill()

  beginShape()
  var x_pos, y_pos
  CTX.FS(color)
  if(marker){
    CTX.FO(marker[1] + "px Georgia")
  }
  for(var i = 0, l = x.length; i < l; i++){
    if(y[i] === null || !isFinite(y[i])){
      CTX.stroke()
      endShape()
      beginShape()
      continue
    }
    x_pos = x轴数值转坐标(x[i], x_suit)
    y_pos = y轴数值转坐标(y[i], y_suit)

    if(l >= 10){
      vertex(x_pos, y_pos)
    }

    if(marker){
      drawMarker(x_pos + (marker[2] || -5), y_pos + (marker[3] || 10), marker[0])
    }
  }
  CTX.stroke()
  endShape()
}

function 绘制条形图(x_suit, y_suit, x, y, setting = {}){
  var c = 提取颜色(setting)
  var w = setting.w || 1
  var r = setting.r || 0.4

  var color_func = $.isFunction(c)
  if(!color_func){
    fill(c || 'blue')
  }

  strokeWeight(w)

  var barwidth = x轴数值转坐标(x_suit._min + (x[1] - x[0]) * r, x_suit) - x轴数值转坐标(x_suit._min, x_suit)
  var x_pos, y_pos
  for(var i = 0, l = x.length; i < l; i++){
    if(y[i] === null){
      continue
    }
    x_pos = x轴数值转坐标(x[i] - (x_suit.barwidth || 0) / 2, x_suit)
    y_pos = y轴数值转坐标(y[i], y_suit)
    if(color_func){
      myStroke(c, i)
      myFill(c, i)
    }
    rect(x_pos, y_pos, barwidth, y_suit.水平线 - y_pos)
  }
}

function 绘制直方图(x_suit, y_suit, x, y, setting = {}){
  var c          = 提取颜色(setting)
  var w          = setting.w || 1
  var r          = setting.r || 1
  var color_func = $.isFunction(c)
  if(!color_func){
    fill(c || 'blue')
  }

  strokeWeight(w)

  var barwidth = x轴数值转坐标(x_suit._min + (x[1] - x[0]) * r, x_suit) - x轴数值转坐标(x_suit._min, x_suit)
  // console.log(x_suit, barwidth, x轴数值转坐标(x_suit._min + (x_suit.barwidth || 0) / 2, x_suit), x轴数值转坐标(x_suit._min - (x_suit.barwidth || 0) / 2, x_suit))
  var x_pos, y_pos
  for(var i = 0, l = x.length; i < l; i++){
    if(y[i] === null){
      continue
    }
    x_pos = x轴数值转坐标(x[i] - (x_suit.barwidth || 0) / 2, x_suit)
    y_pos = y轴数值转坐标(y[i], y_suit)
    if(color_func){
      myStroke(c, i)
      myFill(c, i)
    }
    rect(x_pos, y_pos, barwidth, y_suit.水平线 - y_pos)
  }
}

function 绘制针状图(x_suit, y_suit, x, y, setting = {}){
  var c = 提取颜色(setting)
  var w = setting.w || 1
  var d = setting.d || 5

  strokeWeight(w)
  var color_func = $.isFunction(c)
  if(!color_func){
    fill(255)
    stroke(c || 'blue')
  }

  var x_pos, y_pos
  for(var i = 0, l = x.length; i < l; i++){
    if(y[i] === null){
      continue
    }
    x_pos = x轴数值转坐标(x[i] - (x_suit.barwidth || 0) / 2, x_suit)
    y_pos = y轴数值转坐标(y[i], y_suit)
    if(color_func){
      myStroke(c, i)
      myFill(c, i)
    }
    line(x_pos, y_pos, x_pos, y_suit.水平线)
    ellipse(x_pos, y_pos, myFn(d, i))
  }
}

function 绘制散点图(x_suit, y_suit, x, y, setting = {}){
  var c = 提取颜色(setting)
  strokeWeight(setting.w || 1)

  var d = setting.d || 5
  noFill()
  var color_func = $.isFunction(c)
  if(!color_func){
    stroke(c || 'blue')
  }

  var x_pos, y_pos
  for(var i = 0, l = x.length; i < l; i++){
    if(y[i] === null){
      continue
    }
    x_pos = x轴数值转坐标(x[i] - (x_suit.barwidth || 0) / 2, x_suit)
    y_pos = y轴数值转坐标(y[i], y_suit)
    if(color_func){
      myStroke(c, i)
      myFill(c, i)
    }

    ellipse(x_pos, y_pos, myFn(d, i))
  }
}

function myStroke(f, i){
  var c = f(i, 's')
  if(c === false || c === undefined){
    noStroke()
  }
  else{
    stroke(c)
  }
}

function myFill(f, i){
  var c = f(i, 'f')
  if(c === false || c === undefined){
    noFill()
  }
  else{
    fill(c)
  }
}

function myFn(f, i){
  if($.isFunction(f)){
    return f(i)
  }
  else{
    return f
  }
}