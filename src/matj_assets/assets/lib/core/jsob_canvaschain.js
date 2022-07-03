/* author sam */
var COS  = Math.cos;
var SIN  = Math.sin;
var ATAN = Math.atan;
var PI   = Math.PI;
var PI2  = PI * 2;

//canvas chained mode
function extantCanvas(){
  if(!window.$){
    setTimeout(extantCanvas, 300)
    return
  }

  $.E(window.CanvasRenderingContext2D ? CanvasRenderingContext2D.prototype : {}, new function(){
    var fun1   = function(fun){
      return function(){
        this[fun].apply(this, arguments);
        return this;
      }
    };
    var fun2   = function(fun){
      return function(a){
        this[fun] = a;
        return this;
      }
    };
    var result = {};
    var obj    = {
      A : 'arc',
      AT: 'arcTo',
      B : 'beginPath',
      BC: 'bezierCurveTo',
      C : 'closePath',
      CL: 'clip',
      DI: 'drawImage', // FR: 'fillRect',
      FT: 'fillText', //(text,x,y,maxWidth) // L : 'lineTo',
      M : 'moveTo',
      QC: 'quadraticCurveTo',
      R : 'rect',
      RS: 'restore',
      RT: 'rotate',
      SC: 'scale',
      SR: 'strokeRect',
      SV: 'save',
      TL: 'translate'
    };
    var i;
    for(i in obj){
      result[i] = fun1(obj[i]);
    }

    obj     = {
      FO: 'font',
      FS: 'fillStyle',
      GC: 'globalCompositeOperation',
      LC: 'lineCap', // LJ: 'lineJoin',
      // ML: 'miterLimit', 用LJ代替
      LW: 'lineWidth',
      SS: 'strokeStyle',
      TA: 'textAlign'
    };
    var map = {
      平: 'butt', //lineCap
      圆: 'round', //lineCap, lineJoin
      方: 'square', //lineCap
      斜: 'bevel', //lineJoin
    };
    /*
     lineCap
     butt	默认。向线条的每个末端添加平直的边缘。
     round	向线条的每个末端添加圆形线帽。
     square	向线条的每个末端添加正方形线帽。

     lineJoin
     bevel	创建斜角。
     round	创建圆角。
     miter	由miterLimit设定。创建尖角。
     */
    for(i in obj){
      result[i] = fun2(obj[i]);
    }

    $.E(result, {
      AS: function(a, b){
        $.EACH(b, function(z){
          a.addColorStop(z[0], z[1]);
        })
      },
      F : function(a){
        if(a){
          this.FS(a)
        }
        this.fill();
        return this;
      },
      CR: function(l, t, w, h){
        this.clearRect(l || 0, t || 0, w || this.canvas.width, h || this.canvas.height);
        return this;
      },
      FR: function(l, t, w, h){
        this.fillRect(l || 0, t || 0, w || this.canvas.width, h || this.canvas.height);
        return this;
      },
      LJ: function(a){
        if(a == 'round'){
          this.lineJoin = 'round';
        }
        else{
          if(isNaN(a)){
            this.lineJoin = 'bevel';
          }
          else{
            this.miterLimit = a;
            this.lineJoin   = 'miter'
          }
        }
        return this;
      },
      I : function(){
        return this
          .LC('round')
          .LJ('round')
        //.b()
      },
      L : function(){
        var a = arguments;
        for(var i = 0; i < a.length; i += 2){
          this.lineTo(a[i], a[i + 1]);
        }
        return this;
      },
      LN: function(){
        var a = arguments;
        this.M(a[0], a[1]);
        for(var i = 2; i < a.length; i += 2){
          this.L(a[i], a[i + 1]);
        }
        return this;
      },
      LG: function(a, b, c, d, e, f){
        var grad = this.createLinearGradient(a, b, c, d);
        this.AS(grad, e);
        if(f){
          this.SS(grad);
        }
        else{
          this.FS(grad);
        }
        return this;
      },
      RG: function(a, b, c, d, e, f, g, h){
        var grad = this.createRadialGradient(a, b, c, d, e, f);
        this.AS(grad, g);
        if(h){
          this.SS(grad);
        }
        else{
          this.FS(grad);
        }
        return this;
      },
      S : function(a){
        if(a){
          this.SS(a)
        }
        this.stroke();
        return this;
      },
      SD: function(a, b, c, d){
        if(a){
          this.shadowOffsetX = a;
        }
        if(b){
          this.shadowOffsetY = b;
        }
        if(c){
          this.shadowColor = c;
        }
        if(d){
          this.shadowBlur = d;
        }
        return this;
      },
      TS: function(a, b, c){
        this.font         = a;
        this.textBaseline = b || 'top';
        this.textAlign    = c || 'left';
        return this;
      },
      CB: function(b, c, d, e, f){ //x, y, w, h, curv//1,2 // curvBorder
        b = b + .5;
        c = c + .5;
        d = d + b - 1;
        e = e + c - 1;
        return this.LW()
          .B()
          .M(b + f, c)      //左上
          .L(d - f, c)      //右上
          .QC(d, c, d, c + f)
          .L(d, e - f)      //右下
          .QC(d, e, d - f, e)
          .L(b + f, e)      //左下
          .QC(b, e, b, e - f)
          .L(b, c + f)      //左上
          .QC(b, c, b + f, c)
          .C();
      },
      EL: function(x, y, w, h, a1, a2, move){ //椭圆 ellipse
        // a1, a2 起始/终止角度
        if(move){
          this.M(x + w * COS(a1), y + h * SIN(a1));
        }
        for(var a = a1, inter = PI / 60; a <= a2 - inter; a += inter){
          this.L(x + w * COS(a), y + h * SIN(a))
        }
        return this;
      },
      IN: function(x, y){
        return this.isPointInPath(x, y);
      }
    });

    obj = {
      //方法原型
      始: 'B', //'beginPath',
      闭: 'C', //'closePath',

      起点 : 'M', //'moveTo',
      弧  : 'A', //'arc',
      矩形 : 'R', //'rect',
      切弧 : 'AT', //'arcTo'
      二次 : 'QC', //'quadraticCurveTo',
      贝塞尔: 'BC', //'bezierCurveTo',

      选裁: 'CL', //'clip',

      贴图: 'DI', //'drawImage',

      描矩形: 'SR', //'strokeRect',
      填矩形: 'FR', //'fillRect',
      填文字: 'FT', //'fillText',

      恢复: 'RS', //'restore',
      保存: 'SV', //'save',

      旋转: 'RT', //'rotate',
      缩放: 'SC', //'scale'
      移动: 'TL', //'translate'

      //赋值型
      填型: 'FS', //'fillStyle',
      描型: 'SS', //'strokeStyle',
      端型: 'LC', //'lineCap', '平|圆|方'

      线宽  : 'LW', //'lineWidth',
      对齐  : 'TA', //'textAlign'
      字体  : 'FO', //'font',
      叠加关系: 'GC', //'globalCompositeOperation',

      //方法变型
      填  : 'F',     //fillStyle
      描  : 'S',     //strokeStyle
      清矩形: 'CR',  //clearRect
      初始化: 'I',   //LC.LJ.ML

      线 : 'L',       //lineTo
      线段: 'LN',     //moveTo, lineTo
      椭圆: 'EL',
      圆角: 'CB',

      阴影: 'SD',     //shadowOffsetX/OffsetY/Color/BLur

      色阶  : 'AS',     //addColorStop
      线性渐变: 'LG',  //createLinearGradient
      辐射渐变: 'RG',   //createRadialGradient
      文字相关: 'TS',   //font/textBaseline/textAlign

      交型: 'LJ', //'lineJoin', //'圆|数字'
      // 折限: 'ML', //'miterLimit',
    };
    for(i in obj){
      result[i] = fun1(obj[i]);
    }
    return result;
  });
}

extantCanvas()
