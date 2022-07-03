//v2022-03-05
/* author sam */
//编程规则
//1. 必须使用缩进
//2. 方法用驼峰格式: setMagaDrag
//3. 变量和属性用小写及下划线: t.catch_mouse
//4. jQuery 和 系统的属性名往往是驼峰格式，很容易和自定义的3区分
//5. core.js(jsob_core.js)中大写字母开头的属性和方法，不会被混淆工具混淆
//6. core.js(jsob_core.js)中小写字母开头的属性和方法，如果是4，混淆工具会忽略，其它的一律会混淆。 (会有些例外，如一些html5的属性还没有被混淆工具收录)

//* 使用空格或缩进和换行使得代码一目了然
//* 使用空行分隔不相关的执行句
//* 避免嵌套过深
//* 避免执行代码过长
//* 使用一次的函数可以取消，减少函数数量

//* 方法/函数分级，名称后加_0, _1, _2, _3 ...
//* 高级别只能调用低级别的函数，包括同级
// var strict = 'use'
//num
var PI  = Math.PI
var pi  = PI
var PI2 = PI + PI
var now = (Date.now() - (new Date('0000-01-01')))/87600000 //日期序列值表示从某个固定的预设日期（0000 年 1 月 0 日）起计的整数天数及小数天数值

//框架主体
;(function(){
  var b   = navigator.userAgent.toLowerCase()
  var d   = document
  var nil = 'undefined'

  //SELECT
  window.$ = function(a, b, c){            //goal, nocache, limit node
    if(typeof (a) === nil || a === null){
    }
    else if($.isFunction(a)){      //如果传进的是函数
      //$._funlist ? $._funlist.push(a) :  a()
      if($._funlist){
        $._funlist.push(a)
      }
      else{
        a()
      }
    }
    else if(a.context && a.context.EOBJ){//如果传进的就是eobj
      return a
    }
    else if(a.EOBJ && a.EOBJ.context === a){  //传进node, 曾$过
      return a.EOBJ
    }
    else if(typeof (a) == 'string'){    //传进字符串、优先缓存
      a = a.replace(/(^\s+)|(\s+$)/g, '')
      //a = a.TRIM()
      /*update by ljj IE8中string不支持trim方法*/

      /*
       var op = a.substr(0, 1)     // operator
       var s  = a.substr(1)       // name without operator
       var nm
       var r, i, l
       if(op == '#'){          //id
       nm = '_id_' + s
       if(!$._list[nm] || b){      //如果之前有缓存，则直接返回缓存
       node = (c || d).getElementById(s)
       }
       }
       else if(op == '.'){      //class
       nm = '_cs_' + s
       if(!$._list[nm] || b){
       var q = new RegExp('(^|\\s)' + s + '(\\s|$)')
       r     = d.getElementsByTagName('*')
       for(i = 0, l = r.length; i < l; i++){
       if(q.test(r[i].className)){
       //h.push(r[i])
       node = r[i]
       break
       }
       }
       }
       }
       else if(op == '@'){      //radio box
       nm = '_in_' + s
       b  = 1; //强制不缓存
       if(!$._list[nm] || b){
       r = d.getElementsByName(s)
       for(i = 0, l = r.length; i < l; i++){
       if(r[i].checked){
       //h.push(r[i])
       node = r[i]
       break
       }
       }
       }
       }
       else{              //tag
       nm = '_nm_' + a
       if(!$._list[nm] || b){
       r    = d.getElementsByTagName(a)
       node = r[0]
       }
       }
       //缺省情况下，包含node的eobj，被缓存在 $._list
       //对于radio节点，前置符号是@，传入b==1，这样，就不会被缓存，下次读取时仍然能找到被选中的项目
       */

      if(!$._list[a] || b){
        var nodes
        if(a[0] == '#'){
          nodes = [document.getElementById(a.slice(1))] //safari 会出现querySelectorAll失败，而getElementById成功的情况
        }
        else{
          nodes = document.querySelectorAll(a)
        }

        if(nodes[0]){
          $._list[a] = new $._init(nodes)  //node被包装成eobj对象
        }
        else{
          console.log('getElementById/querySelectorAll error', a, nodes)
        }
      }
      return $._list[a] || ''
    }
    else{                //传进node, 不曾$过
      return new $._init(a)
    }
  }

  //扩展函数
  $.E = function(){  //$.E(obj1, obj2, obj3)
    var z = arguments, key
    for(var i = 1, l = z.length; i < l; i++){
      for(key in z[i]){
        z[0][key] = z[i][key]
      }
    }

    return z[0]
  }

  //工具库和变量
  $.E($, {
    //变量
    _list   : {},  //query cache，eobj缓存
    _guid   : 1,  //唯一id序号自动添加
    _funlist: [],  //document.body onload 调用之前，缓存命令
    _img_ok : 1,
    Z       : 100,    //max zIndex
    z_list  : {},
    _js_ok  : 1,
    SPLIT0  : '@;',  //返回：切割模块
    SPLIT1  : '@:',  //返回：切割请求和返回值
    SPLIT2  : '@-',  //返回：一级切割模块返回值；发送：连接本模块多参数
    SPLIT3  : '@=',  //返回：二级切割模块返回值

    //_init
    _init: function(a, z){
      if(!a){
        return
      }
      z = this
      var node
      if(a[0]){
        node = a[0]
        if(a.length > 1){
          z.nodes = Array.prototype.slice.call(a)
        }
      }
      else{
        node = a
      }
      z.context = node
      z.target  = node
      node.id   = node.id || z.ID_ || '_' + ($._guid++)
      z.ID_     = node.id

      if(node.tagName == 'CANVAS'){
        z.CTX = node.getContext('2d')
        $.E(z.CTX, {
          lineCap : 'round',
          lineJoin: 'round'
        })
      }
      node.EOBJ = z
    },

    //TIME
    MS: function(a){
      var z = (new Date).getTime()  //Date.now(); IE 8 不支持
      // var z = performance.now()
      return a == 's' ? $.R(z / 1000) : z
      // return a == 's' ? $.R(z / 1000) : z.toFixed(2)
    },

    //NUMBER
    // 0, 0, 1, 1, 1, 0, 1 数组被当作数字了  isArray: function(o){return Object.prototype.toString.call(o) === '[object Array]';}
    VN  : function(a){
      return isNaN(a) || a === '' || a === null
    },
    R   : Math.round,
    SIZE: function(n){
      if(n < 1024){
        return n + ' 字节'
      }
      var k = $.R(n / 102.4) / 10
      if(k < 1024){
        return k + ' KB'
      }
      var m = $.R(k / 102.4) / 10
      if(m < 1024){
        return m + ' MB'
      }
      var g = $.R(m / 102.4) / 10
      return g + ' GB'
    },

    //STRING
    //起始位置的一个或多个非字符(^\s+)

    F    : function(a, b){ //find b in a
      return ('' + a).indexOf(b) + 1
    },
    TRIM : function(a){
      return typeof (a) == 'string' ? a.replace(/(^\s+)|(\s+$)/g, '') : a
    },
    LTRIM: function(a){
      return typeof (a) == 'string' ? a.replace(/(^\s+)/g, '') : a
    },
    RTRIM: function(a){
      return typeof (a) == 'string' ? a.replace(/(\s+$)/g, '') : a
    },

    //type
    isNull: function(s){
      return !s && typeof (s) !== 'undefined' && s !== 0
    },

    isNumber: function(s){
      return typeof (s) == 'number'
    },

    isString: function(s){
      return typeof (s) == 'string'
    },

    isArray: function(obj){
      return Array.isArray ? Array.isArray(obj) : Object.prototype.toString.call(obj) == '[object Array]'
    },

    isObject: function(obj){
      //排除 null
      return Object.prototype.toString.call(obj) == '[object Object]'
    },

    isReferenceError: function(obj){
      return typeof (obj) == 'object' && obj && (obj.hasOwnProperty ? obj + '' : '').substring(0, 14) == 'ReferenceError' //?
    },

    isFunction: function(obj){
      return Object.prototype.toString.call(obj) == '[object Function]'
    },

    isRegExp: function(obj){
      return Object.prototype.toString.call(obj) == '[object RegExp]'
    },

    myTypeof: function(obj){
      var type = typeof (obj)
      var t    = this
      if(/number|string|boolean|undefined/.test(type)){
        return type
      }
      else if(t.isNull(obj)){
        return 'null'
      }
      else if(t.isRegExp(obj)){
        return 'regexp'
      }
      else if(t.isArray(obj)){
        return 'array'
      }
      else if(t.isReferenceError(obj)){
        return 'ReferenceError'
      }
      else if(t.isObject(obj)){
        return 'object'
      }
      else if(t.isFunction(obj)){
        return 'function'
      }
      else if(/int/i.test(Object.prototype.toString.call(obj))){
        // uint8/16/32/64, int8/16/32/64
        return Object.prototype.toString.call(obj).slice(8,-6).toLowerCase().replace('big', '')
      }
      else{
        console.log('other_' + Object.prototype.toString.call(obj))
        return 'object'
      }
    },

    //AJAX

    _ajax          : function(a){
      var _z = false //xmlHTTP
      if(window.XMLHttpRequest){ // Mozilla, Safari,...
        if(/function|object/.test(typeof (window.XMLHttpRequest))){
          _z = new XMLHttpRequest()
        }
        else{
          _z = new ActiveXObject('Microsoft.XMLHTTP')
        }
      }
      else if(window.ActiveXObject){ // IE
        try{
          _z = new ActiveXObject('Msxml2.XMLHTTP')
        }
        catch(e){
          try{
            _z = new ActiveXObject('Microsoft.XMLHTTP')
          }
          catch(e){
          }
        }
      }
      this.setRequest = function(url, fun, content, type, head){
        $.OUT = url + (content ? '?' + content : '')
        _z.open(type, type == 'get' ? $.OUT : url, a !== 'syc')
        if(!head['Content-Type']){
          _z.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        }

        for(var i in head){
          _z.setRequestHeader(i, head[i])
        }
        _z.onreadystatechange = function(){
          if(_z.readyState == 4 && _z.status == 200){
            fun(_z.responseText)
          }
        }
        _z.send(type == 'get' ? 'NULL' : (content || 'NULL'))
      }
    },
    _setChannel    : function(url, is_script, is_get, fn, head){  //channel, ? Script : AJAX
      var _pool    = {}, _timer = 0, _xmlhttp = is_script ? '' : new $._ajax(), URLAJAX = url
      var callAjax = function(quest_str = ''){
        if(!quest_str){
          if(head['Content-Type'] && $.F(head['Content-Type'], 'json')){
            // var _gets = {}
            // $.EACH(_pool, function(a, _key){
            //   //a = a.replace(/#/g, '~')  //在createBook恢复
            //   if(typeof (a) == 'object'){
            //     a = JSON.stringify(a)
            //   }
            //   _gets[encodeURIComponent(_key)] = encodeURIComponent(a)
            // })
            quest_str = JSON.stringify(_pool)
            if(quest_str == '{}'){
              quest_str = ''
            }
          }
          else{
            var _gets = []
            $.EACH(_pool, function(a, _key){
              //a = a.replace(/#/g, '~')  //在createBook恢复
              if(typeof (a) == 'object'){
                a = JSON.stringify(a)
              }
              _gets.push(encodeURIComponent(_key) + '=' + encodeURIComponent(a))
            })
            quest_str = _gets.join('&')
          }

          //escape             不编码字符有69个：              * +   - . /         @ _   0-9 a-z A-Z
          //encodeURI          不编码字符有82个：! # $ & ' ( ) * + , - . / : ; = ? @ _ ~ 0-9 a-z A-Z
          //encodeURIComponent 不编码字符有71个：!       ' ( ) *     - .             _ ~ 0-9 a-z A-Z

          _pool = {}
        }

        var url = URLAJAX || $.URLAJAX

        if(is_script){  //Script
          if(this.ajid){
            this.ajid.R()
          }
          this.ajid = $.C($(d.head), { type: 'text/javascript' }, 'script')
          if(quest_str){
            url += '?' + quest_str + '&FUN=$.FUN'
          }
          this.ajid.S({ src: url })
        }
        else{      //Ajax
          if(quest_str.substring(0, 2) == 'JS'){
            _xmlhttp.setRequest(url, function(a){
              $.C($(d.head), {
                text: a
              }, 'script')
              $._js_ok = 1
              fn && fn()
            }, quest_str, is_get ? 'get' : 'post', head)  //default post
          }
          else{
            _xmlhttp.setRequest(url, function(a){
              fn ? fn(a) : $.FUN(a)
            }, quest_str, is_get ? 'get' : 'post', head)  //default post
          }
        }
      }

      //公有
      this.do = function(data){
        callAjax(data)
      }

      this.add = function(a, b){
        //用于多次post的对象合并
        if(a){
          _pool[a] = b || ''
        }
        clearTimeout(_timer)
        _timer = setTimeout(callAjax, 10)
      }
    },
    _funcs         : {},
    _script_channel: [],
    FN             : function(fns, url, is_script, is_get, n){
      n = n || 0
      if(!$._script_channel[n] && url){
        $._script_channel[n] = new $._setChannel(url, is_script, is_get)
      }
      if(fns){
        $.E($._funcs, fns)
      }
      return $
    },
    LOADJS         : function(str_js, fn, url){
      if($.F(str_js, 'http:')){
        $.C($(d.head), {
          src: str_js
        }, 'script')
      }
      else{
        $._js_ok = 0
        new $._setChannel(url || $.URLSCRIPT, '', '', fn).add('JS', str_js)
      }
    },
    D              : function(data, n){  //default: ajax, post
      //未完成
      n = n || 0
      var d
      $._script_channel[n].add()
      for(var i in data){
        if(0 && $.isArray(data[i])){
          //不知为何有这么一个处理
          d = data[i][0]
          $.FN(data[i][1], '', '', '', n)
        }
        else{
          d = data[i]
        }
        $._script_channel[n].add(i, d)
      }
    },
    post           : function(url, data, post_callback, n, head){
      return this.get_post(0, url, data, post_callback, n, head)
    },
    get            : function(url, data, post_callback, n, head){
      return this.get_post(1, url, data, post_callback, n, head)
    },
    get_post       : function(is_get, url, data, post_callback, n, head){
      n                    = n || 1
      $._script_channel[n] = new $._setChannel(url, 0, is_get, post_callback, head || {})
      if($.isString(data)){
        $._script_channel[n].do(data)
      }
      else{
        $.D(data, n)
      }
      return $
    },
    FUN            : function(a){
      /*
       if(a=='unlogin'){
       alert("You haven't login!")
       window.location = './'
       return
       }
       ,SPLIT0: '@;'  //返回：切割模块
       ,SPLIT1: '@:'  //返回：切割请求和返回值
       ,SPLIT2: '@-'  //返回：一级切割模块返回值；发送：连接本模块多参数
       ,SPLIT3: '@='  //返回：二级切割模块返回值
       */
      var y, x, data
      //a  A=B@:C1@-C2@-C31@=C32@;d=e@:f
      $.EACH(a.split($.SPLIT0), function(b){  //b = ['A=B@:C1@-C2@-C31@=C32', 'd=e@:f']
        y          = b.split($.SPLIT1)        //y = ['A=B', 'C1@-C2@-C31@=C32']      || ['d=e', 'f']
        x          = y[0].split('=')        //x = ['A', 'B']              || ['d', 'e']
        data       = (y[1] || '').split($.SPLIT2)  //data = ['C1', 'C2', 'C31@=C32']      || ['f']
        var detail = []            //detail = [['C1'], ['C2'], ['C31', 'C32']]  || [['f']]
        for(var i = 0, l = data.length; i < l; i++){
          detail[i] = data[i].split($.SPLIT3)
        }
        if($._funcs[x[0]]){
          $._funcs[x[0]](data, x[1])  //(['C1', 'C2', 'C31@=C32'], [['C1'], ['C2'], ['C31', 'C32']])  || (['f'], [['f']])
        }
        else if($._funcs.ALL){
          $._funcs.ALL(data, x[0], x[1])    //(['C1', 'C2', 'C31@=C32'], 'A')      || (['f'], 'd')
        }
      })
    },

    //ANIMATE
    TWEEN: {
      'EaseOut'  : function(f){
        return function(r, b, d){
          r = $.B(0, 1, r)
          return f(1 - r, b + d, -d)
        }
      },
      'EaseInOut': function(f){
        return function(r, b, d){
          r = $.B(0, 1, r)
          if(r < .5){
            return f(r + r, b, d / 2)
          }
          else{
            return f(2 - r - r, b + d, -d / 2)
          }
        }
      },
      F          : {
        LINEAR: function(r, b, d){
          return b + d * r
        },
        QUAD  : function(r, b, d){
          return b + d * r * r
        },
        CUBIC : function(r, b, d){
          return b + d * r * r * r
        },
        QUART : function(r, b, d){
          return b + d * r * r * r * r
        },
        QUINT : function(r, b, d){
          return b + d * r * r * r * r * r
        },
        SINE  : function(r, b, d){
          return b + d * (1 - Math.cos(r * (Math.PI / 2)))
        },
        EXPO  : function(r, b, d){
          return b + d * Math.pow(2, 10 * (r - 1))
        },
        CIRC  : function(r, b, d){
          return b + d * (1 - Math.sqrt(1 - r * r))
        },
        BACK  : function(r, b, d, s){
          s = s || 1.70158
          return d * r * r * ((s + 1) * r - s) + b
        },
        BOUNCE: function(r, b, d){
          if(r > 1.75 / 2.75){
            return b + d * (1 - 7.5625 * (r = 1 - r) * r)
          }
          else if(r > 0.75 / 2.75){
            return b + d * (0.25 - 7.5625 * (r = 1.25 / 2.75 - r) * r)
          }
          else if(r > 0.25 / 2.75){
            return b + d * (0.0625 - 7.5625 * (r = 0.5 / 2.75 - r) * r)
          }
          else{
            return b + d * (0.015625 - 7.5625 * (r = 0.125 / 2.75 - r) * r)
          }
        }
      },
      _list      : {},
      arr        : [],
      open       : function(){
        //允许动画
        this.is_stop = 0
        this.is_run  = 0
      },
      close      : function(){
        //不允许动画
        this.is_stop = 1
        this.is_run  = 0
      },
      stop       : function(){
        //动画停止
        this._list  = {}
        this.is_run = 0
      },
      DELE       : function(a){
        if(a){
          delete this._list[a]
        }
        else{
          this._list = {}
        }
      },
      speed      : function(a){
        if(a){
          this.duration = a
        }
        else if(!this.duration){
          this.duration = 618
        }
        return this.duration
      },
      add        : function(channel, eobj, to, duration, delay, sTween, sEase){
        var TWEEN = $.TWEEN
        if(TWEEN.is_stop || !channel){
          if(typeof (to) == 'function'){
            to.call(eobj, 1)
          }
          else if(eobj && to && eobj.S){
            eobj.S(to)
          }
          return eobj
        }
        var z = {
          mylord  : eobj,
          start   : $.MS() + (delay || 0),
          duration: duration || TWEEN.speed()
        }

        if(typeof (to) == 'function'){
          z.fn = to
        }
        else{
          z.from = {}
          z.dis  = {}
          z.to   = to
          var f, i
          for(i in to){
            if(i == 'TX' || i == 'TY'){
              if(!eobj.FATHER.TF_){
                i = i == 'TX' ? 'L' : 'T'
              }
            }
            f = (typeof (eobj[i + '_']) === nil ? (i == 'A' ? 1 : 0) : eobj[i + '_'])
            if(to[i] !== f){
              z.from[i] = f
              if(i !== 'BG'){
                z.dis[i] = to[i] - f
              }
            }
          }
        }
        if(typeof (sTween) == 'function'){
          z.twfunc = sTween
        }
        else{
          sTween   = sTween || 'QUAD'
          z.twfunc = TWEEN.F[sTween]//'QUAD';SINE
          sEase    = sEase || 'EaseInOut'
          if(sTween !== 'LINEAE' && (sEase == 'EaseInOut' || sEase == 'EaseOut')){
            z.twfunc = TWEEN[sEase](z.twfunc)
          }
        }

        TWEEN._list[channel] = z
        if(!TWEEN.is_run){
          TWEEN.is_run = 1
          TWEEN.run()
        }
        return eobj
      },
      run        : function(){
        if(window.counter){
          counter++
        }
        var z, y, live = 0, tr, r, now = $.MS(), i, j
        var x          = $.TWEEN

        if(!x.is_run){
          return
        }

        for(i in x._list){
          z = x._list[i]
          if(!z){
            continue
          }
          tr = (now - z.start) / z.duration //time rate
          r  = z.twfunc(tr, 0, 1)
          if(tr < 1){
            live++
            if(tr >= 0){
              if(z.fn){
                z.fn.apply(z.mylord, [r, z.mylord])
              }
              else{
                y = {}
                for(j in z.from){
                  if(j == 'BG'){
                    y[j] = $.MIXCOLOR(r, z.from[j], z.to[j])
                  }
                  else{
                    y[j] = z.from[j] + z.dis[j] * r
                  }
                }
                z.mylord.S(y)
              }
            }
          }
          else{
            if(z.fn){
              // z.fn.call(z.mylord, r)
              z.fn.apply(z.mylord, [1, z.mylord])
            }
            else{
              z.mylord && z.mylord.S && z.mylord.S(z.to)
            }

            //执行THEN的内容
            if(z.mylord.animateArr && z.mylord.animateArr.length){
              var t = z.mylord.animateArr.shift()
              live++
              z.mylord.animate(t[0], t[1], t[2], t[3], t[4])
              //新发起的动画仍然沿用i
            }
            else{
              x._list[i] = 0
            }
          }
        }

        if(live){
          $.REPEATER(x.run)
        }
        else{
          $.TWEEN.stop()
        }
      }
    },

    //DOM
    C: function(father, css, tag, before){  //father, tag 也行
      if(typeof (css) == 'string' && css.length && !tag){
        tag = css
        css = {}
      }

      if(tag && tag.toLowerCase){
        tag = tag.toLowerCase()
      }
      else{
        tag = tag || 'div'
      }

      var z
      if(tag == 'password'){
        z              = $(d.createElement('input'))
        z.context.type = 'password'
      }
      else if(tag == 'checkbox'){
        z              = $(d.createElement('input'))
        z.context.type = 'checkbox'
      }
      else if(tag == 'file'){
        z              = $(d.createElement('input'))
        z.context.type = 'file'
      }
      else{
        z = $(typeof (tag) == 'string' ? d.createElement(tag) : tag)  //document.createElement
      }

      if(tag == 'canvas'){
        if(z.context.getContext){
          if(css.W && css.H && !css.width && !css.height){
            z.S({
              width : css.W,
              height: css.H
            })
          }
        }
        else{  //IE6-8
          window.isSupport = 1
          return
          //z.CTX = FlashCanvas.initElement(z.context)
        }
      }
      if(father){
        father.A(z, before)
        /*
         try{
         }catch(e){
         alert('478'+e)
         }
         */
      }

      var default_css = {
        P : 'absolute',
        id: z.ID_ || '_' + ($._guid++),
        L : 0,
        T : 0
      }

      /*
       if(css){
       if(typeof(css.R)=='undefined'){
       default_css.L = 0
       }
       if(typeof(css.B)=='undefined'){
       default_css.T = 0
       }
       }
       */
      z.S($.E(default_css, css))
      if(father && father.TF_){
        z.SET3D()
      }

      return z
    },
    c: function(father, css, tag, before){
      if(typeof (css) == 'string' && css.length && !tag){
        tag = css
        css = {}
      }
      return $.C(father, $.E({
        P: '',
        L: '',
        T: ''
      }, css), tag, before)
    },

    resetIndex: function(eobj){
      for(var i = 0, l = eobj.CHILDREN.length; i < l; i++){
        eobj.CHILDREN[i].INDEX = i
      }
    },

    //LOOP
    EACH: function(obj, func){
      var is_array = $.isArray(obj)
      var i, len
      if(is_array){  //$.EACH([...], func)
        for(i = 0, len = obj.length; i < len; i++){
          func(obj[i], i, is_array)
        }
      }
      else if(!$.VN(obj)){  //$.EACH(3, func)  //SAM 3-16
        for(i = 0; i < obj; i++){
          func(i)
        }
      }
      else{
        for(i in obj){  //$.EACH({...}, func)
          func(obj[i], i, is_array)
        }
      }
    },

    //LOAD image
    //放在 $(function(){...});之前
    LOADIMG: function(files, url, fn, fn2){  //1
      $.loadImageCallBack = fn || $._emptyFunc
      $.loadImageProcess  = fn2 || $._emptyFunc//2
      $._img_ok           = 0
      var imgs_num        = 0
      var imgs_obj        = {}
      var file, img
      url                 = url ? url + '/' : ''
      for(var i = 0, len = files.length; i < len; i++){
        file                             = files[i]
        img                              = new Image()
        img.onload                       = function(){
          imgs_num++
          $.loadImageProcess(imgs_num, files.length)//3
          if(imgs_num === files.length){
            //alert(4)
            $.loadImageCallBack()
            $._img_ok = 1
          }
        }
        img.src                          = url + file
        imgs_obj[file.replace('.', '_')] = img
      }
      //alert('files.length:'+len)
      if(!len){
        //alert(2)
        $.loadImageCallBack()
        $._img_ok = 1
        //alert(3)
      }
      return imgs_obj
    },

    //获取坐标
    POS: function(o){
      /*
       var x = 0,
       y = 0
       while(o){
       x += o.L_ || 0
       x += o.TX_ || 0
       y += o.T_ || 0
       y += o.TY_ || 0
       o = o.FATHER
       }
       return {
       'x': x,
       'y': y
       }
       */
      var x = 0, y = 0, o = o.context || o
      while(o){
        x += o.offsetLeft || 0
        y += o.offsetTop || 0
        x += (o.EOBJ ? o.EOBJ.TX_ : 0) || 0
        y += (o.EOBJ ? o.EOBJ.TY_ : 0) || 0
        o = o.offsetParent
      }
      return {
        'x': x,
        'y': y
      }
    },
    IW : function(){
      return document.compatMode == 'CSS1Compat' ? document.documentElement.clientWidth : document.body.clientWidth
    },
    IH : function(){
      return document.compatMode == 'CSS1Compat' ? document.documentElement.clientHeight : document.body.clientHeight
    },

    //event 提炼共性
    _bindFunc      : function(e){
      return function(fun, bubble, fn2, fn3){
        this.bind(e, fun || $._emptyFunc, bubble, fn2, fn3)
        return this
      }
    },
    stopPropagation: function(e){
      if(e.stopPropagation){
        e.stopPropagation()
        try{
          e.preventDefault()
        }
        catch(e){
          console.log(e)
        }
      }
      else{    //IE
        e.cancelBubble = true
        e.returnValue  = false
      }
    },

    //空函数
    _emptyFunc: function(){
      // console.log('_emptyFunc')
    },

    B : function(min, max, c){
      var _max = Math.max(min, max)
      var _min = Math.min(min, max)
      return Math.max(_min, Math.min(_max, c))
    },
    P2: function(a){
      return a * a
    },

    //10进制-> 16进制
    HX: function(n){
      var z = $.R(n).toString(16)
      return z.length == 1 ? '0' + z : z
    }, //myalert(isNaN(null), isNaN(''), isNaN('0ab'), isNaN('ab0'), isNaN({}), isNaN([]), isNaN(NaN)))

    FX: function(a, b, c){  //Math.ceil, Math.floor
      //FX(3.14159265)==3.14
      //FX(3.14159265, 0)==3
      //FX(3.14159265, 1)==3.1
      //FX(3.14159265, 2)==3.14
      //FX(3.14159265, 3)==3.142

      //Math.round
      //Math.floor(3.14) = 3
      //Math.ceil(3.14) = 4
      var s
      var f = c || $.R
      if($.VN(a)){
        s = ''
      }//else if (typeof(b) == 'undefined') s = f(a * 100) / 100
      else if(b === 0){
        s = f(a)
      }
      else if(b == 1){
        s = f(a * 10) / 10
      }
      else if(b == 2 || !b){
        s = f(a * 100) / 100
      }
      else if(b == 3){
        s = f(a * 1000) / 1000
      }
      else{
        var z = Math.pow(10, b)
        s     = f(a * z) / z
      }
      return s
    },

    //COLOR
    RGBA: function(a, o){  //16进制颜色返回rgba格式
      /// <summary>返回color字符串</summary>
      var r = '0x' + a.substring(1, 3), g = '0x' + a.substring(3, 5), b = '0x' + a.substring(5, 7)

      return ['rgba(', +r, ',', +g, ',', +b, ',', o, ')'].join('')
    },

    //读取querystring
    QS: function(key){
      //获取当前文档的URL,为后面分析它做准备
      var sURL = document.URL

      //URL中是否包含查询字符串
      var z = sURL.indexOf('?')
      if(z < 0){
        z = sURL.indexOf('#')
      }
      if(z > 0){
        //分解URL,第二个元素为完整的查询字符串
        //即arrayParams[1]的值为【first=1&second=2】

        var qs = sURL.substring(z + 1)

        //分解查询字符串
        //arrayURLParams[0]的值为【first=1 】
        //arrayURLParams[1]的值为【second=2】
        var arrayURLParams = qs.split('&')

        //遍历分解后的键值对
        for(var i = 0, len = arrayURLParams.length; i < len; i++){
          //分解一个键值对
          var sParam = arrayURLParams[i].split('=')

          if((sParam[0] == key) && (sParam[1] !== '')){
            //找到匹配的的键,且值不为空
            return sParam[1]
          }
        }
      }
    },

    //ARRAY
    IA: function(thing, array, where){
      var i
      if(typeof (thing) == 'function'){
        for(i in array){
          if(thing(array[i])){
            return where ? i : true
          }
        }
        if(where){
          return -1
        }
      }
      else{
        for(i in array){
          if(thing === array[i]){
            return where ? i : true
          }
        }
        if(where){
          return -1
        }
      }
    },

    //HASH
    HASH: function(fun){
      if(('onhashchange' in window) && ((typeof document.documentMode == 'undefined') || document.documentMode == 8 && $.IS.I8)){
        // 浏览器支持onhashchange事件
        window.onhashchange = fun  // TODO，对应新的hash执行的操作函数
      }
      else{
        // 不支持则用定时器检测的办法
        setInterval(function(){
          fun()
        }, 50)
      }
    },

    //mixColor
    MIXCOLOR: function(p, c1, c2){
      var r1 = '0x' + c1.substring(1, 3)
      var g1 = '0x' + c1.substring(3, 5)
      var b1 = '0x' + c1.substring(5, 7)
      var r2 = '0x' + c2.substring(1, 3)
      var g2 = '0x' + c2.substring(3, 5)
      var b2 = '0x' + c2.substring(5, 7)
      var r  = Math.round(r2 * p + r1 * (1 - p)).toString(16)
      var g  = Math.round(g2 * p + g1 * (1 - p)).toString(16)
      var b  = Math.round(b2 * p + b1 * (1 - p)).toString(16)

      r = r.length == 1 ? '0' + r : r
      g = g.length == 1 ? '0' + g : g
      b = b.length == 1 ? '0' + b : b
      return '#' + r + g + b
    },

    //DEBUG
    MSG: function(){
      top.document.title = this.LOG.apply(this, arguments)
    },
    LOG: function(){
      var t = new Date()
      if(!this.lms){
        this.lms = $.MS()
      }
      // var z    = $.MS() - this.lms
      var z    = ''
      this.lms = $.MS()

      if(z > 1000){
        // z = t.getMinutes() + ':' + t.getSeconds()
      }
      var y
      for(var i = 0, len = arguments.length; i < len; i++){
        if(typeof arguments[i] !== 'undefined'){
          y = arguments[i]
          z += ('' + JSON.stringify(y)).replace(/"/g, '') + ' '
        }
      }
      // top.$.MSG(z)
      console.log(z)
      return z
    }
  })

  //选择器对象功能扩展
  $._init.prototype = {
    //获坐标和尺寸
    left        : function(){
      if(typeof (this.L_) === nil){
        this.L_ = this.context.offsetLeft
      }
      return this.L_
    },
    top         : function(){
      if(typeof (this.T_) === nil){
        this.T_ = this.context.offsetTop
      }
      return this.T_
    },
    width       : function(){
      if(typeof (this.W_) === nil){
        this.W_ = this.context.scrollWidth
      }
      return this.W_
    },
    height      : function(){
      if(typeof (this.H_) === nil){
        this.H_ = this.context.scrollHeight
      }
      return this.H_
    },
    offsetHeight: function(){
      return this.context.offsetHeight
    },
    offsetWidth : function(){
      return this.context.offsetWidth
    },
    offsetLeft  : function(){
      return this.context.offsetLeft
    },
    offsetTop   : function(){
      return this.context.offsetTop
    },

    //类操作
    addClass   : function(s){
      if(!this.hasClass(s)){
        this.S({ CN: $.TRIM((this.context.className || '') + ' ' + s) })
      }
      return this
    },
    removeClass: function(s){
      return this.S({ CN: $.TRIM(this.context.className.replace(new RegExp('(\\s|^)' + s + '(\\s|$)'), '')) })
    },
    hasClass   : function(s){
      return this.context.className.match(new RegExp('(\\s|^)' + s + '(\\s|$)'))
    },

    //DOM
    A         : function(eobj, before){
      eobj.FATHER = this
      if(!this.CHILDREN){
        this.CHILDREN = []
      }

      if(before){
        this.CHILDREN.unshift(eobj)
        this.context.insertBefore(eobj.context, this.context.firstChild)
        $.resetIndex(this)
      }
      else{
        eobj.INDEX = this.CHILDREN.length
        this.CHILDREN.push(eobj)
        this.context.appendChild(eobj.context)
      }
      this.I_ = this.context.innerHTML
      return this
    },
    R         : function(keepchild){
      delete $._list['_id_' + this.ID_]

      if(this.FATHER && this.FATHER.CHILDREN){
        var pos = $.IA(this, this.FATHER.CHILDREN, 1)
        if(pos > -1){
          this.FATHER.CHILDREN[pos] = null
          this.FATHER.CHILDREN.splice(pos, 1)
          $.resetIndex(this.FATHER)
        }
      }

      function removeChild(node){
        if(!keepchild && node.children && node.children.length){
          for(var i = node.children.length - 1; i >= 0; i--){
            removeChild(node.children[i])
          }
        }

        node.stop && node.stop()
        node.close && node.close()
        node.parentNode.removeChild(node)
      }

      removeChild(this.context)

      // this.context = null
      // this.FATHER  = null
      return this.context
    },
    PRES      : function(k, v){
      if(this.nodes){
        for(var i in this.nodes){
          this.nodes[i].style[k]          = v
          this.nodes[i].style[$._pre + k] = v
        }
      }
      else{
        this.context.style[k]          = v
        this.context.style[$._pre + k] = v
      }
      return this
    },
    S         : function(css, done){
      var t     = this, css3D = [], perspective
      css       = chineseCss(css)
      this.CSS_ = $.E(this.CSS_ || {}, css)

      //t.CSS = $.E(t.CSS || {}, css)
      if(!t.context || !t.context.style){
        return t
      }
      var y, x, i, j, I, n, z
      var nodes = this.nodes || [this.context]
      for(var no in nodes){
        n = nodes[no]
        z = n.style

        for(i in css){
          y = css[i]

          I = i.toUpperCase()
          if(!done && t[I + '_'] === y || typeof (y) === nil){  //过滤重复值和无效值
            continue
          }
          if(!$.VN(y)){  //是数字
            x = $.R(y) + 'px'  //数字缺省+'px'
          }
          else{
            x = y
          }

          t[I + '_'] = y  //记住这个值

          //使用缩写的好处：
          //简短、好写
          //自动添加px
          //避免全称不能被混淆的缺点
          //缓存属性值，避免重复设置
          //与animate保持一致

          //缺点：习惯

          //如何让简写和全称保持一致？
          if(0 && t.FATHER && t.FATHER.TF_){
            //支持3D则 TX/TY 代替 L/T, 数据保存在 L_/T_
            if(i == 'L'){
              i     = 'TX'
              z.top = 0
            }
            if(i == 'T'){
              i      = 'TY'
              z.left = 0
            }
          }

          if(i == 'T'){
            z.top = x
          }
          else if(i == 'L'){
            z.left = x
          }
          else if(i == 'W'){
            z.width = x
          }
          else if(i == 'H'){
            z.height = x
          }
          else if(i == 'R'){
            z.right = x
          }
          else if(i == 'B'){
            z.bottom = x
          }
          else if(i == 'M'){
            z.margin = x
          }
          else if(i == 'ML'){
            z.marginLeft = x
          }
          else if(i == 'MT'){
            z.marginTop = x
          }
          else if(i == 'MR'){
            z.marginRight = x
          }
          else if(i == 'MB'){
            z.marginBottom = x
          }
          else if(i == 'F'){
            z.fontSize = x
          }
          else if(i == 'LH'){
            z.lineHeight = x
          }
          else if(i == 'PD'){
            z.padding = x
          }
          else if(i == 'PDT'){
            z.paddingTop = x
          }
          else if(i == 'PDR'){
            z.paddingRight = x
          }
          else if(i == 'PDB'){
            z.paddingBottom = x
          }
          else if(i == 'PDL'){
            z.paddingLeft = x
          }
          else if(i == 'BR'){
            z.borderRadius = x
          }

          else if(i == 'A'){
            if($.IS.I678){
              if($.IS.I8){
                z.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + $.R(y * 100) + ')'
              }
              else{
                z.filter = 'alpha(opacity=' + $.R(y * 100) + ')'
              }
            }
            else{
              z.opacity = y
            }
          }
          else if(i == 'M'){
            z.margin = y
          }
          else if(i == 'C'){
            z.color = y
          }
          else if(i == 'D'){
            z.display = y
          }
          else if(i == 'O'){
            z.overflow = y
          }
          else if(i == 'OX'){
            z.overflowX = y
          }
          else if(i == 'OY'){
            z.overflowY = y
          }
          else if(i == 'P'){
            z.position = y == 'r' ? 'relative' : y
          }
          else if(i == 'Z'){
            z.zIndex        = y
            $.z_list[t.ID_] = y    //记录所有的 zIndex
          }
          else if(i == 'CS'){
            z.cursor = y
          }
          else if(i == 'TA'){
            z.textAlign = y
          }
          else if(i == 'VA'){
            z.verticalAlign = y
          }

          //font
          else if(i == 'FF'){
            z.fontFamily = y
          }
          else if(i == 'FW'){
            z.fontWeight = y
          }

          //background
          else if(i == 'BG'){
            z.background = y
          }
          else if(i == 'BP'){
            z.backgroundPosition = y
          }

          //border
          else if(i == 'BD'){
            if(y[0] == '#'){
              y = '1px solid ' + y
            }
            z.border = y
          }
          else if(i == 'BDT'){
            if(y[0] == '#'){
              y = '1px solid ' + y
            }
            z.borderTop = y
          }
          else if(i == 'BDR'){
            if(y[0] == '#'){
              y = '1px solid ' + y
            }
            z.borderRight = y
          }
          else if(i == 'BDB'){
            if(y[0] == '#'){
              y = '1px solid ' + y
            }
            z.borderBottom = y
          }
          else if(i == 'BDL'){
            if(y[0] == '#'){
              y = '1px solid ' + y
            }
            z.borderLeft = y
          }
          else if(i == 'BS'){
            t.PRES('BoxShadow', y)
          }
          else if(i == 'WS'){
            z.whiteSpace = y ? 'nowrap' : ''
          }

          //css3D
          else if($.F('TX TY TZ RX RY RZ SC ', i + ' ')){
            css3D.push(i)
          }
          else if(i == 'DL' || i == 'EASE'){
            //值已经在EASE_中保存了
          }
          else if(i == 'TS'){
            t.PRES('Transition', [
              'all', y / 1000 + 's', t.EASE_ || 'ease', (t.DL_ || 0) / 1000 + 's'
              // ease | linear | ease-in | ease-out | ease-in-out | cubic-bezier(<number>, <number>, <number>, <number>)
            ].join(' '))
          }
          else if(i == 'TO'){
            t.PRES('TransformOrigin', y)
          }
          else if(i == 'TF'){
            t.PRES('TransformStyle', y)
          }
          else if(i == 'PP'){
            t.PRES('Perspective', y) //这里不需要px
          }
          else if(i == 'PO'){
            t.PRES('PerspectiveOrigin', y)
          }
          else if(i == 'PW' || i == 'PH'){
            perspective = 1
          }

          //attribute
          else if(i == 'I'){
            if(t.CHILDREN){
              for(var j = t.CHILDREN.length - 1; j >= 0; j--){
                t.CHILDREN[j].R()
              }
              delete t.CHILDREN
            }
            n.innerHTML = window.traditionalized ? traditionalized(y) : y
          }
          else if(i == 'text'){
            if(t.CHILDREN){
              for(j = t.CHILDREN.length - 1; j >= 0; j--){
                t.CHILDREN[j].R()
              }
              delete t.CHILDREN
            }

            n.innerText = window.traditionalized ? traditionalized(y) : y
          }
          //else if(i == 'V'  : n.value = y;} //给显隐用了
          else if(i == 'CN'){
            n.className = y
          }
          //保存对象属性
          else if(i == 'G'){
          }
          else if(i.substring(0, 4) == 'data' //
            || $.F('id src href name text placeholder type title value width height border ', i + ' ')    //
            || $.F('target cellSpacing cellPadding resize scrollTop ', i + ' ') //
            || $.F('min max step preload autoplay controls for rel ', i + ' ')){
            n.setAttribute(i, y)
          }
          else if($.F('selected checked disabled ', i + ' ')){
            n[i] = y
          }

          //dataset
          else if(/data-/.test(i)){
            var key        = i.slice(5)
            n.dataset[key] = y
          }

          //显隐
          else if(i == 'V'){
            y ? t.V() : t.H()
          }

          //缺省是style属性
          else{
            z[i] = y
          }
        }

        if(css3D.length && t.FATHER && t.FATHER.TF_){  //父节点必须是SET3D过的，特征就是TF_
          var s_transform = ''
          var key, v

          for(j = 0; j < css3D.length; j++){
            key = css3D[j]
            v   = css[key] == '' ? css[key + '_'] : css[key]
            if(/T/.test(key)){
              s_transform += 'translate' + key[1] + '(' + v + 'px) '
            }
            else if(/R/.test(key)){
              s_transform += 'rotate' + key[1] + '(' + v + 'deg) '
            }
            else if(/S/.test(key)){
              s_transform += 'scale(' + v + ') '
            }
          }

          // console.log(css3D, s_transform)
          t.css3D = css3D
          t.PRES('Transform', s_transform)
        }
        if(perspective && t.TF_){  //自己必须是SET3D过的
          t.S({
            PO: ($.VN(t.PW_) ? 50 : t.PW_) + '% ' + ($.VN(t.PH_) ? 50 : t.PH_) + '%'
          })
        }
      }

      return t
    },
    SETPP     : function(a, b){
      var pw, ph
      if(b){
        var pwph = b.split(' ')
        var pw   = parseInt(pwph[0])
        var ph   = parseInt(pwph[1])
      }
      else{
        pw = 50
        ph = 50
      }
      return this.S({
        PP: a || -1,
        PW: pw, //PerspectiveOrigin
        PH: ph  //PerspectiveOrigin
      }).SET3D()
    },
    SET3D     : function(a, b){
      if($.IS.I && !$.IS.I1){
        //不支持3D
        return this
      }
      var pw, ph
      if(b){
        var pwph = b.split(' ')
        pw       = parseInt(pwph[0])
        ph       = parseInt(pwph[1])
      }
      else{
        pw = 50
        ph = 50
      }
      return this.S({
        TF: 'preserve-3d',
        PP: a || 3000, //Perspective
        PW: pw, //PerspectiveOrigin
        PH: ph, //PerspectiveOrigin
      })
    },
    ATT       : function(obj){
      if(typeof obj == 'string'){
        return this.context.getAttribute(a)
      }

      this.S(obj)
      return this
    },
    ATTR      : function(a){
      return this.ATT(a)
    },
    removeAttr: function(a){
      if(this.nodes){
        for(var i in this.nodes){
          this.nodes[i].removeAttribute(a)
        }
      }
      else{
        this.context.removeAttribute(a)
      }
      return this
    },
    I         : function(a){
      if(this.CHILDREN){
        for(var i = this.CHILDREN.length - 1; i >= 0; i--){
          this.CHILDREN[i].R()
        }
        this.CHILDREN = null
      }
      return this.S({ I: a || (a === 0 ? '0' : '') })
    },
    text      : function(a){
      if(this.CHILDREN){
        for(var i = this.CHILDREN.length - 1; i >= 0; i--){
          this.CHILDREN[i].R()
        }
        this.CHILDREN = null
      }
      return this.S({ text: a || (a === 0 ? '0' : '') })
    },
    H         : function(){
      if(this.D_ !== 'none'){
        this.D__ = this.D_
      }
      return this.S({ D: 'none' })
    },
    V         : function(z, type){
      if(typeof (z) == 'undefined' || z){
        if(this.D_ == 'none'){
          return this.S({ D: this.D__ || type || '' })
        }
        else{
          return this.S({ D: this.D_ || type || '' })
        }
      }
      else{
        return this.H()
      }
    }, //写成 d: '' 大多数情况下可行
    // inline
    VV        : function(){
      return this.S({ D: 'block' })
    },  //写成 d: '' 大多数情况下可行
    isH       : function(){
      return this.D_ == 'none'
    },
    isV: function(){
      return !this.isH()
    },
    toggle    : function(){
      return this.isH() ? this.V() : this.H()
    },
    css       : function(css){
      return this.S(css)
    },
    html      : function(a){
      return this.val(a)
    },
    val       : function(a){
      if(typeof (a) === nil){
        if(this.context.nodeName == 'TEXTAREA'){
          return this.context.value //$.TRIM()
        }
        return this.context.value || this.context.innerHTML
      }
      else{
        this.context.value = a
        return this
      }
    },
    attr      : function(a, b){
      var obj = {}
      obj[a]  = b
      return this.ATTR(obj)
    },

    //上级
    father: function(){
      return this.FATHER || $(this.parentNode)
    },

    //平级, this.father 指向上一级
    next    : function(a){
      var node = this.context
      while(node = a ? node.previousElementSibling : node.nextElementSibling){
        if(node && node.nodeName !== '#text'){
          return $(node)
        }
      }
    },
    previous: function(){
      return this.next(1)
    },

    //http://select.yeeyan.org/view/213582/202991
    //触摸事件
    //
    //三种在规范中列出并获得跨移动设备广泛实现的基本触摸事件：
    //
    //1. touchstart：手指放在一个DOM元素上。
    //2. touchmove：手指拖曳一个DOM元素。
    //3. touchend：手指从一个DOM元素上移开。
    //
    //每个触摸事件都包括了三个触摸列表：
    //
    //1. touches：当前位于屏幕上的所有手指的一个列表。
    //2. targetTouches：位于当前DOM元素上的手指的一个列表。
    //3. changedTouches：涉及当前事件的手指的一个列表。例如，在一个touchend事件中，这就会是移开的手指。
    //
    //这些列表由包含了触摸信息的对象组成：
    //
    //1. identifier：一个数值，唯一标识触摸会话（touch session）中的当前手指。
    //2. target：DOM元素，是动作所针对的目标。
    //3. 客户/页面/屏幕坐标：动作在屏幕上发生的位置。
    //4. 半径坐标和 rotationAngle：画出大约相当于手指形状的椭圆形。

    //事件绑定
    bind  : function(type, fn, bubble, fn2){
      var tp = type, mapping
      if($.IS.T){
        mapping = {
          down: 'touchstart',
          up  : 'touchend',
          move: 'touchmove'
        }
      }
      else{
        mapping = {
          down: 'mousedown',
          up  : 'mouseup',
          move: 'mousemove',
          over: 'mouseover',
          out : 'mouseout'
        }
      }
      tp = mapping[type] || tp

      var t = this, _ctx = t.context, type_ = type.toUpperCase()  //t.DOWN 存放着down事件
        , fun

      if(t[type_] !== fn){  //如果反复绑定同一个监听事件，简化处理，否则，需要以下处理步骤
        fun = function(e){
          e = e || window.event
          if(e){
            if($.F(type, 'key')){
              t.KEYCODE    = e.KEYCODE || e.keyCode || e.which
              t.ctrlKey    = e.ctrlKey
              t.altKey     = e.altKey
              t.shiftKey   = e.shiftKey
              t.commandKey = t.KEYCODE == 91 && type == 'keydown'
            }
            else{
              // t.KEYCODE = 0
              // t.ctrlKey = 0
              // t.altKey  = 0
            }

            //shift:16, ctrl:17, alt:18
            //shift为什么要 stopPropagation ?
            if(!bubble
              //|| t.KEYCODE == 16 || t.KEYCODE == 17 || t.KEYCODE == 18 || t.ctrlKey || t.altKey
            ){
              $.stopPropagation(e)
            }
            var _e  = (e.changedTouches && e.changedTouches[0]) || (e.touches && e.touches[0]) || e
            t.event = e
            t.T     = $.MS()  //e.timeStamp

            if(typeof (_e.clientX) !== 'undefined'){
              t.X = _e.clientX + (window.scrollX || document.body.scrollLeft || document.documentElement.scrollLeft)
              t.Y = _e.clientY + (window.scrollY || document.body.scrollTop || document.documentElement.scrollTop)
            }

            t.type = tp
            //以下写法无法在fun(){this}中的this里抓到event主体，抓到的是window
            //fn($.E(this.EOBJ, {X:e.clientX, Y:e.clientY, clientX: e.clientX, clientY:e.clientY}))
            //X是为了将来混淆方便，clientX是无法混淆的

            // t.target_eobj = $(e.srcElement || e.target); //代价有些大

            //对事件预处理
            if(type == 'down'){
              if(t.UP){
                if($.IS_DRAG){
                  return
                }

                $.IS_DRAG = true
              }

              t.target_eobj = e.target_eobj || $(e.srcElement || e.target)
              if(t.is_gesture){
                //已经引发pinchstart,不必再执行了
                //delete t.is_gesture
                //return
              }

              if(t.IS_DOWN){
                //第二个手指按下
              }
              else{
                t.IS_DOWN   = 1
                t.MX        = 0
                t.MY        = 0
                t.down_time = t.T
                if(t.MOVE){
                  t.o_l = t.L_
                  t.o_t = t.T_
                  t.L_X = t.DOWN_X = t.X
                  t.L_Y = t.DOWN_Y = t.Y

                  var w = t.enlarge_area

                  //有了 catch_mouse，在手机上会感觉迟钝
                  //而鼠标太过灵活，动作幅度大，需要扩大范围跟踪
                  if(!$.IS.T && t.enlarge_area && !t.catch_mouse){
                    t.catch_mouse = $.C(t, {
                      L: -w,
                      T: -w,
                      W: w + w + (t.width() || 0),
                      H: w + w + (t.height() || 0), // A : 0.3,
                      // BG: '#000'
                    })
                    if($.IS.I678){
                      t.catch_mouse.S({
                        A : 0.01,
                        BG: '#ffffff'
                      })
                    }
                  }

                  t.catch_mouse && t.catch_mouse.V().S({
                    W: w + w + (t.W_ || 0),
                    H: w + w + (t.H_ || 0),
                  })
                }
                // 这里 fn2 似乎不需要
                // fn2 && fn2.call(t, t)
              }
            }
            else if(type == 'move'){
              //down定义过，IS_DOWN开关才有效。
              //触屏只定义move，不定义down和up
              //掠过的行为，通过t.IS_DOWN来判断
              t.MX        = t.X - t.DOWN_X
              t.MY        = t.Y - t.DOWN_Y
              t.move_time = t.T
              if(!t.IS_DOWN){
                fn2 && fn2.call(t, t)
                return
              }
            }
            else if(type == 'up'){
              $.IS_DRAG = false

              t.catch_mouse && t.catch_mouse.H()
              //如果多个手指一起up，这里只响应一次
              if(!t.IS_DOWN){
                return
              }

              if(!t.is_gesture){
                t.IS_DOWN = 0
              }
              if(fn2 && $.MS() - t.down_time < 200 && Math.abs(t.X - t.DOWN_X) < 3 && Math.abs(t.Y - t.DOWN_Y) < 3){
                //有效点击
                fn2.call(t, t)
              }
            }
          }

          fn.call(t, t)

          if(type == 'move'){
            t.D_X = t.X - t.L_X
            t.D_Y = t.Y - t.L_Y
            t.L_X = t.X
            t.L_Y = t.Y
          }
          return t
        }

        t[type_] = fun
      }

      if(_ctx.addEventListener){
        //https://www.cnblogs.com/ziyunfei/p/5545439.html passive 的事件监听器
        //https://segmentfault.com/a/1190000008512184
        _ctx.addEventListener(tp, t[type_], { passive: bubble == 1 })
      }
      else if(_ctx.attachEvent){
        _ctx.attachEvent('on' + tp, t[type_])
      }
      else{
        _ctx['on' + tp] = t[type_]
      }

      if(type == 'click' || type == 'down'){
        if(!t.CS_){
          t.S({ CS: 'pointer' })
        }
      }

      return this
    },
    unbind: function(type, fn){
      if(this.context.removeEventListener){
        this.context.removeEventListener(type, fn)
      }
      else{
        this.context.detachEvent('on' + type, fn)
      }
      return this
    },

    //常用事件
    click   : $._bindFunc('click'),
    change  : $._bindFunc('change'),
    input   : $._bindFunc('input'),
    load    : $._bindFunc('load'),
    down    : $._bindFunc('down'),
    up      : $._bindFunc('up'),
    move    : $._bindFunc('move'),
    over    : $._bindFunc('over'),
    out     : $._bindFunc('out'),
    dblclick: $._bindFunc('dblclick'),

    //mousedown: $._bindFunc('mousedown'),
    //mouseup  : $._bindFunc('mouseup'),
    //mousemove: $._bindFunc('mousemove'),

    focus   : $._bindFunc('focus'),
    blur    : $._bindFunc('blur'),
    keydown : $._bindFunc('keydown'),
    keyup   : $._bindFunc('keyup'),
    keypress: $._bindFunc('keypress'),
    scroll  : $._bindFunc('scroll'),
    focus2  : function(){
      this.context.focus()
      return this
    },
    focusMe : function(){
      this.context.focus()
      return this
    },
    WHEEL   : function(fns){
      var t    = this
      var _ctx = t.context
      var f    = function(e){
        e = e || window.event
        if(e.wheelDelta){
          t.WHL = e.wheelDelta / 120
        }
        else if(e.detail){
          t.WHL = -e.detail / 3
        }
        t.X = e.clientX
        t.Y = e.clientY
        fns.call(t, t)
      }
      if($.IS.FF){
        this.context.addEventListener('DOMMouseScroll', f, false)
      }
      else if(!$.IS.T){
        this.context.onmousewheel = f
      }
      t.hasWHEEL = 1
      return this
    },

    //拖动
    MAGIC: function(op){
      op    = op || {}    //这样，访问op的属性不会出错了
      var z = this
      z.op  = op
      // var G = z.goal = op.goal || z
      // var G = z.goal = z.op.G || z.G_ || z.target_eobj || z
      var G = z.goal = z.op.G || z.G_ || z

      if(op.x && G.FATHER && G.FATHER.W_){
        G.dif_w = Math.min(0, G.FATHER.W_ - G.W_)
      }
      else{
        G.dif_w = 0
      }

      if(op.y && G.FATHER && G.FATHER.H_){
        G.dif_h = Math.min(0, G.FATHER.H_ - G.H_)
      }
      else{
        G.dif_h = 0
      }

      z.enlarge_area = 200

      z.tapPress = op.tap || op.doubletap || op.press

      z.down(function(z){
        var G = z.goal
        if(G.Z_ !== $.Z - 1 && !op.zkeep){
          G.S({ Z: $.Z++ })
        }
        G.S({ TS: 0 })

        var e = z.event
        if(e.touches && e.touches.length > 1){
          if(op.pinchstart){ //双指操作，pinchstart只调用一次
            z.is_gesture       = 1
            var p1             = e.touches[0]
            var p2             = e.touches[1]
            var dx             = p2.pageX - p1.pageX
            var dy             = p2.pageY - p1.pageY
            z.finger_distence0 = Math.pow($.P2(dx) + $.P2(dy), 0.2)
            z.center0          = [(p2.pageX + p1.pageX) / 2, (p2.pageY + p1.pageY) / 2]
            z.angle0           = Math.atan2(dx, dy)

            op.pinchstart(z)
            //如果同时按下down，会触发两次down，第一次触发down就会进入pinchstart
            //pinchstart如果设置IS_DOWN = 0；会被第二次执行的down重新设置成IS_DOWN = 1
          }
        }
        else{
          delete z.is_gesture
          op.down && op.down(z)

          if(z.last_down && z.down_time - z.last_down.down_time < 300){
            clearTimeout(z.timer_up)
          }

          if(op.press){
            z.timer_press = setTimeout(function(){
              z.IS_DOWN = 0
              op.press(z)
            }, 200)
          }
        }
      }, 1)

      z.move(function(z){
        var e = z.event

        if(e.touches && e.touches.length > 1){ //多指
          if(z.timer_press){
            clearTimeout(z.timer_press)
            delete z.timer_press
          }

          if(op.pinchmove){
            var p1            = e.touches[0]
            var p2            = e.touches[1]
            var dx            = p2.pageX - p1.pageX
            var dy            = p2.pageY - p1.pageY
            z.finger_distence = Math.pow($.P2(dx) + $.P2(dy), 0.2)
            z.center          = [(p2.pageX + p1.pageX) / 2, (p2.pageY + p1.pageY) / 2]
            z.angle           = Math.atan2(dx, dy)
            z.scale           = $.FX(z.finger_distence / z.finger_distence0, 4)
            z.confirm         = 'pinchmove'

            op.pinchmove(z)
          }
        }
        else{
          if(!op.x){ //左右移动
            z.MX  = 0
            z.L_X = z.X
          }

          if(!op.y){ //上下移动
            z.MY  = 0
            z.L_Y = z.Y
          }

          var mx = Math.abs(z.MX)
          var my = Math.abs(z.MY)
          var dt = z.T - z.down_time

          if(op.swipe){
            if(mx > 5 && mx / dt > .65){
              z.confirm = 'swipe-x-' + (z.MX > 0 ? 'r' : 'l')
              console.log('swipe')
              op.swipe(z)
              z.UP(z)
              return
            }
            else if(my > 5 && my / dt > .65){
              z.confirm = 'swipe-y-' + (z.MY > 0 ? 'd' : 'u')
              console.log('swipe')
              op.swipe(z)
              z.UP(z)
              return
            }
          }

          if(z.timer_press && (mx > 5 || my > 5)){
            clearTimeout(z.timer_press)
            delete z.timer_press
          }

          op.move && op.move(z)
        }

      }, 1, $.IS.T && op.over) //?

      z.up(function(z){
        if(z.is_gesture){
          op.pinchend && op.pinchend(z)
        }

        if(z.timer_press){
          clearTimeout(z.timer_press)
          delete z.timer_press
        }

        if(z.tapPress && !z.confirm){
          //未判明发生特殊事件，如 pan, swipe, pinch
          if(z.T - z.down_time < 250 && Math.abs(z.X - z.DOWN_X) < 3 && Math.abs(z.Y - z.DOWN_Y) < 3){
            // tap -- hammer.js
            // interval  300  Maximum time in ms between multiple taps.
            // time  250  Maximum press time in ms.
            // threshold  2  While doing a tap some small movement is allowed.
            // posThreshold  10  The maximum position difference between multiple taps.
            if(z.last_down && z.T - z.last_down.down_time < 400 && Math.abs(z.X - z.last_down.DOWN_X) < 11 && Math.abs(z.Y - z.last_down.DOWN_Y) < 11){
              //console.log('double', z.T - z.last_down.down_time, z.last_down.T - z.last_down.down_time, z.down_time - z.last_down.T)
              delete z.last_down
              op.doubletap && op.doubletap(z)
            }
            else{
              z.timer_up  = setTimeout(function(){
                delete z.last_down
                z.tapPress && z.tapPress(z)
              }, 300 - (z.T - z.down_time))
              z.last_down = {
                down_time: z.down_time,
                T        : z.T,
                DOWN_X   : z.DOWN_X,
                DOWN_Y   : z.DOWN_Y
              }
            }
          }
        }
        else{
          op.up && op.up(z)
        }
        delete z.confirm
      }, 1)

      z.keydown(function(z){
        op.keydown && op.keydown(z)
      }, 1)

      z.keyup(function(z){
        op.keyup && op.keyup(z)
      }, 1)
      return this
    },
    DRAG : function(op){
      var z = this

      z.S({
        CS: 'move'
      })
      z.op = op || {}    //这样，访问option的属性不会出错了
      if(!('x' in z.op)){
        z.op.x = []  //缺省是可以移动的
      }
      if(!('y' in z.op)){
        z.op.y = []  //缺省是可以移动的
      }

      //if(z.op.limit && $.IA(z.target_eobj.ID_, z.op.limit)){
      // var G = z.goal = z.op.G || z.G_ || z.target_eobj || z
      var G = z.goal = z.op.G || z.G_ || z
      //}
      //else{
      //  z.IS_DOWN = 0
      //  return
      //}

      G.speed_x = 0
      G.speed_y = 0

      if(z.op.x && G.FATHER && G.FATHER.W_){
        G.dif_w = Math.min(0, G.FATHER.W_ - G.W_)
      }
      else{
        G.dif_w = 0
      }

      if(z.op.y && G.FATHER && G.FATHER.H_){
        G.dif_h = Math.min(0, G.FATHER.H_ - G.H_)
      }
      else{
        G.dif_h = 0
      }

      z.enlarge_area = z.op.enlarge_area || 400

      z.down(function(z){
        $.TWEEN.close()
        z.TS__ = z.TS_ || 0
        G.Z__  = G.Z_ || 0
        if(G.Z__ !== $.Z - 1 && !z.op.zkeep){
          G.S({ Z: $.Z++ })
        }
        G.S({ TS: 0 })

        if(z.op.langtap){
          z.timer_langtap = setTimeout(function(){
            z.IS_DOWN = 0
            z.op.langtap()
          }, 500)
        }

        z.op.down && z.op.down.call(z, z)
      }, 1 || !op.no_propagation)

      z.move(function(z){
        clearTimeout(z.timer_langtap)
        var x, y, css = {}
        var G         = z.goal
        if(1 || z.is_move){
          x = z.op.x
          y = z.op.y

          if(x){
            //G.speed_x += (z.X - (z.L_X || 0) - G.speed_x) / 10
            //G.speed_x = z.X - (z.L_X || 0)
            css.L = (G.L_ || 0) + z.X - (z.L_X || 0)
          }
          else{
            G.speed_x = 0
          }

          if(y){
            //G.speed_y += (z.Y - (z.L_Y || 0) - G.speed_y) / 10
            //G.speed_y = z.Y - (z.L_Y || 0)
            css.T = (G.T_ || 0) + z.Y - (z.L_Y || 0)
          }
          else{
            G.speed_y = 0
          }
        }

        if(z.op.move){
          z.op.move.call(z, css)
        }
        else{
          G.S(css)
        }

        //z.is_move = 1
        //z.timer && clearTimeout(z.timer)
        //z.timer = setTimeout(function(){
        //  z.is_move      = 0
        //  z.goal.speed_x = 0
        //  z.goal.speed_y = 0
        //}, 200)
      }, 0, z.op.over)

      z.up(function(z){
        z.S({ TS: z.TS__ })
        G.S({ Z: G.Z__ })
        $.TWEEN.open()
        clearTimeout(z.timer_langtap)
        if(z.op.up){
          z.op.up.call(z, z)
        }
      }, 1, z.op.click)

      return this
    },
    DRAGY: function(){
      var z = this
      z.up(function(z){
        $.TWEEN.open()
        var css    = {}
        var dura_y = 0
        if(z.speed_y){
          css.T  = $.B(z.dif_h, 0, z.T_ + z.speed_y * 100)
          dura_y = Math.abs((css.T - z.T_) / z.speed_y) * 30
          if(dura_y){
            z.animate(css, dura_y, 0, 'QUAD', 'EaseOut')
          }
        }
      }, 1)
      z.move(function(z){
        if(!z.is_move){
          z.is_move = 1
          z.L_Y     = z.Y
          return
        }
        var t     = $.B(z.dif_h, 0, z.T_ + z.Y - z.L_Y)
        z.speed_y = t - z.T_
        z.S({ T: t })

        z.timer && clearTimeout(z.timer)
        z.timer = setTimeout(function(){
          z.is_move = 0
          z.speed_y = 0
        }, 200)

      })
      this.hasDRAGY = 1
      return this
    },

    //动画
    SetTweenId : function(s){
      this.TID = s
      return this
    },
    animate    : function(to, duration, delay, sTween, sEase, TID){
      return $.TWEEN.add(TID || this.TID || this.ID_, this, to, duration, delay, sTween, sEase)
    },
    animateStop: function(){
      if($.TWEEN._list[this.ID_]){
        $.TWEEN._list[this.ID_] = null
      }
      return this
    },
    THEN       : function(to, duration, delay, sTween, sEase){
      if(!this.animateArr){
        this.animateArr = []
      }
      this.animateArr.push([to, duration || 1, delay, sTween, sEase])
      return this
    },

    //hover切换图片
    hover: function(out, over){
      this.out(typeof (out) == 'function' ? out : function(z){
        return typeof (out) == 'string' ? z.S({ src: out }) : z.S(out)
      })
      this.over(typeof (over) == 'function' ? over : function(z){
        return typeof (over) == 'string' ? z.S({ src: over }) : z.S(over)
      })
      return this.OUT()
    },
    HOVER: function(over, out){
      this.out(out).over(over)
      return this.OUT()
    },

    //禁止选中
    UNSELECT: function(){
      return this.PRES('UserSelect', 'none')
        .bind('selectstart', function(){
          return false
        })
    }
  }

  //参数1 browser，需要用到工具库
  $.IS = {
    //判断
    I  : $.F(b, 'msie'),
    I8 : $.F(b, 'msie 8'),
    I9 : $.F(b, 'msie 9'),
    I1 : $.F(b, 'msie 1'),
    O  : $.F(b, 'opera'),
    FF : $.F(b, 'firefox'),                       // Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:67.0) Gecko/20100101 Firefox/67.0
    SF : $.F(b, 'safari') && !$.F(b, 'chrome'),   // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15
    CH : $.F(b, 'chrome'),                        // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36
    A  : $.F(b, 'android'),
    MH : $.F(b, 'iphone'),
    MP : $.F(b, 'ipad'),
    T  : 'createTouch' in document || 'ontouchstart' in window,
    IOS: !!b.match(/\(i[^;]+;( u;)? cpu.+mac os x/)

    //Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B206 Safari/7534.48.3
  }

  //参数2 browser，需要用到参数1和工具库
  $.IS.I678 = $.F(b, 'msie') && !$.IS.I9 && !$.IS.I1

  //判断
  $._pre = $.IS.FF ? 'Moz' : ($.IS['O'] ? 'O' : ($.IS.I ? 'Ms' : 'Webkit'))

  //方法REPEATER，需要用到参数2
  $.E($, {
    REPEATER: (function(){
      //var z = $._pre.toLowerCase() + 'RequestAnimationFrame'
      var z = 'requestAnimationFrame'
      return window[z] ? function(fn){
        window[z](fn)
      } : function(fn){
        setTimeout(fn, 1000 / 60)
      }
    })()
  })

  $(function(){
    $.body = $(d.body).S({
      M : 0,
      PD: 0
    })
    // $.body = $(d.body).S({
    //   W: $.IW(),
    //   H: $.IH()
    // })
    空间 = $.body
    //.SET3D()
  })

  //文件加载后，运行$(function)过的程序
  $.timer = function(){
    if(d.body && $._funlist && $._img_ok){
      //d.body.onload && $._funlist.push(d.body.onload); //不需要吧, onload会自己执行的
      for(var i = 0; i < $._funlist.length; i++){  //当$._funlist[i](window)运行时，$._funlist数组还可能添加
        if($.isFunction($._funlist[i])){
          $._funlist[i](window)
        }
      }
      clearInterval($.timer)
      delete $._funlist
      delete $.timer
    }
    else{
      setTimeout($.timer, 100)
    }
  }
  setTimeout($.timer, 100)
})()

//windows document 级操作
$(function(){  //禁止选中
  //selectForbiden()
  $.body.bind('dragleave', $._emptyFunc)
  $.body.bind('drop', $._emptyFunc)
  $.body.bind('dragenter', $._emptyFunc)
  $.body.bind('dragover', $._emptyFunc)
})

function selectForbiden(){
  var d           = document, w = window
  d.onselectstart = function(){
    return false
  }
  d.ondragstart   = function(){
    return false
  }
  d.ontouchstart  = function(){
    return false
  }
  d.onselect      = function(){
    w.getSelection ? (w.getSelection() && w.getSelection().removeAllRanges()) : d.selection.empty()
  }

  d.orientationchange                        = function(e){
    e.preventDefault()
    return false
  }
  d.documentElement.style.WebkitTouchCallout = 'none'   //禁止弹出菜单
  d.documentElement.style.MozTouchCallout    = 'none'

  d.documentElement.style.WebkitUserSelect = 'none'    //禁止选中
  d.documentElement.style.MozUserSelect    = 'none'
}

function setMagaDrag(a, b){
  a.FATHER.S({ O: 'hidden' })
  if(!b){
    a.S({ H: '' })
    a.S({ H: a.context.scrollHeight })
  }
  a.dif_h = Math.min(0, a.FATHER.H_ - 5 - a.H_)
  if($.IS.T){
    a.hasDRAGY || a.DRAGY()
  }
  else{
    a.hasWHEEL || a.WHEEL(function(a){
      a.S({ T: $.B(a.dif_h, 0, a.T_ + 50 * a.WHL) })
    })
  }
}

function log(){
  console.log.apply(console, arguments)
  return true
}

function chineseCss(css){
  if($.isObject(css)){

    var map    = {
      '左': 'L length',
      '上': 'T top',
      '前': '',
      '宽': 'W width',
      '高': 'H height',
      '右': 'R right',
      '下': 'B bottom',

      '行高': 'LH lineHeight',
      '边距': 'PD padding',
      '透明': 'A opacity',
      '颜色': 'C color',
      '显示': 'D display',

      '位置'  : 'P position',
      '层序'  : 'Z zIndex',
      '光标'  : 'CS cursor',
      '对齐'  : 'TA textAlign',
      '垂直对齐': 'VA verticalAlign',
      '圆角'  : 'BR borderRadius',

      '边距' : 'M margin',
      '边距左': 'ML marginLeft',
      '边距上': 'MT marginTop',
      '边距右': 'MR marginRight',
      '边距左': 'MB marginBottom',

      '溢出' : 'O overflow',
      '横溢出': 'OX overflowX',
      '竖溢出': 'OY overflowY',

      '字' : 'F fontSize',
      '字体': 'FF fontFamily',
      '字重': 'FW fontWeight',

      '背景'  : 'BG background',
      '背景定位': 'BP backgroundPosition',

      '边框' : 'BD border',
      '边框左': 'BDT borderTop',
      '边框右': 'BDR borderRight',
      '边框下': 'BDB borderBottom',
      '边框左': 'BDL borderLeft',

      '内容': 'I ', ///////////////////////////////////
      //   :'BS BoxShadow',
      // '' :'TS Transition',
      // '' :'TO TransformOrigin',
      // '' :'TF TransformStyle',
      // '' :'PP Perspective',
      // '' :'PO PerspectiveOrigin',
      //
      // '' :'I',
      //
      // '' :'CN className',
      // '' :'id src href name text placeholder type title value width height',
      // '' :'border target cellSpacing cellPadding selected resize scrollTop',
      // '' :'',

    }
    var newcss = {}, k2
    for(var k in css){
      if(k in map){
        k2         = map[k].split(' ')[0]
        newcss[k2] = css[k]
        // console.log(k, k2)
      }
      else{
        newcss[k] = css[k]
      }
    }
    return newcss
  }
  else{
    return css
  }

}

$._init.prototype.样式 = function(css, durationg, delay, sTween, sEase){
  css = chineseCss(css)
  if(durationg){
    this.animate(css, durationg, delay, sTween, sEase)
  }
  else{
    this.S(css)
  }
  return this
}
$._init.prototype.透视 = $._init.prototype.SETPP
$._init.prototype.构建 = function(b, c){
  return $.C(this, b, c)
}

function getCSS3D(坐标系, base, a){
  a = a || []

  if(!坐标系 || 坐标系 == base){
    return a
  }

  base    = base || {}
  var arr = []
  if(坐标系.css3D){
    for(var i in 坐标系.css3D){
      arr.push([坐标系.css3D[i], 坐标系[坐标系.css3D[i] + '_']])
    }
    a = arr.concat(a)
  }

  return getCSS3D(坐标系.FATHER, base, a)
}

function multiMatricx(matrix, arr){
  var k, v, a, c, s
  var m = copyArr(matrix)
  for(var i = 0, l = arr.length; i < l; i++){
    k = arr[i][0]
    v = arr[i][1]
    m = mn(i, m, k, -v)
  }
  return m
}

function multiMatricxBack(matrix, arr){
  var k, v, a, c, s
  var m = copyArr(matrix)
  for(var i = arr.length - 1; i >= 0; i--){
    k = arr[i][0]
    v = arr[i][1]
    m = mn(i, m, k, v)
  }
  return m
}

function copyArr(arr){
  return JSON.parse(JSON.stringify(arr))
}

function mn(i, m, k, v){
  if(k == 'TX'){
    m = MATRICX(m, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, v, 0, 0, 1])
  }
  else if(k == 'TY'){
    m = MATRICX(m, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, v, 0, 1])
  }
  else if(k == 'TZ'){
    m = MATRICX(m, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, v, 1])
  }
  else{
    a = v / 180 * Math.PI
    c = Math.cos(a)
    s = Math.sin(a)
    if(k == 'RX'){
      m = MATRICX(m, [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1])
    }
    else if(k == 'RY'){
      m = MATRICX(m, [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1])
    }
    else if(k == 'RZ'){
      m = MATRICX(m, [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    }
  }
  return m
}

function MATRICXV(p, n){
  var a = []
  var v
  for(var j = 0; j < 4; j++){
    v = p[0] * n[j + 0] + p[1] * n[j + 4] + p[2] * n[j + 8] + p[3] * n[j + 12]

    a.push(v)
  }
  return a
}

function MATRICX(m, n){
  var a = []
  var v, k
  for(var i = 0; i < 4; i++){
    k = i * 4
    for(var j = 0; j < 4; j++){
      v = m[k] * n[j] + m[k + 1] * n[j + 4] + m[k + 2] * n[j + 8] + m[k + 3] * n[j + 12]

      a.push(v)
    }
  }
  return a
}

function 平方(a){
  return a * a
}

function getAngle(对边, 邻边1, 邻边2){
  if(邻边1 * 邻边2 < 0.0001){
    return 90
  }
  else{
    return pi2degree(Math.acos((平方(邻边1) + 平方(邻边2) - 平方(对边)) / 2 / 邻边1 / 邻边2))
  }
}

function pi2degree(a){
  return 180 / Math.PI * a
}

function SIN(a){
  return Math.sin(a * Math.PI / 180)
}

function COS(a){
  return Math.cos(a * Math.PI / 180)
}

function distance(p, q){
  return Math.sqrt(平方(p[0] - q[0]) + 平方(p[1] - q[1]) + 平方(p[2] - q[2]))
}

function 执行后延时执行(f, 最小间隔, 最大间隔){ //触发后立即做一次，以后，两次间隔不会小于'间隔',也不会大于最大间隔
  var timer
  var 上次操作时间戳 = 0
  最大间隔        = 最大间隔 || 2000
  return function(z, stop){
    clearTimeout(timer)
    if(!stop && $.MS() - 上次操作时间戳 < 最大间隔){
      timer = setTimeout(function(){
        f(z)
        上次操作时间戳 = $.MS()
      }, 最小间隔)
    }
    else{
      f(z)
      上次操作时间戳 = $.MS()
    }
  }
}

function 等待后延时执行(f, 最小间隔, 最大间隔){ //触发后立即做一次，以后，两次间隔不会小于'间隔',也不会大于最大间隔
  var timer
  var 上次操作时间戳 = 0
  最大间隔        = 最大间隔 || 2000
  return function(z){
    if(!timer || $.MS() - 上次操作时间戳 < 最大间隔){
      timer && clearTimeout(timer)
      timer = setTimeout(function(){
        f(z)
        上次操作时间戳 = $.MS()
        timer   = 0
      }, 最小间隔)
    }
    else{
      f(z)
      上次操作时间戳 = $.MS()
    }
  }
}

function 计算耗时(f, n){
  var t0 = $.MS()
  for(var i = 0; i < n; i++){
    f()
  }
  console.log($.MS() - t0)
  $.MSG($.MS() - t0)
}
