let LS = localStorage
let OUTPUT_PAGES
var page_names = ['output', 'variables', '2d chart', '3d chart']//, 'error'
$(function(){
  var main       = $.C($.body)
  var pages      = []

  for(let index = page_names.length - 1, page_name; index >= 0; index--){
    page_name = page_names[index]
    var btn   = $.C(main, {
      id: 'btn'+index,
      L : 20 + index * 125,
      T : 20,
      I : page_name,
      H : 30,
      LH: 30,
      W : 110,
      F : 16,
      BR: 15,
      TA: 'center',
      BD: '1px solid',
    }).down(eobj => {
      focusPage(eobj.I_)
    })

    var IW = $.IW()
    var IH = $.IH()

    pages[index] = $.C(main, {
      id: 'page'+index,
      L : 20,
      T : 120,
      W : IW - 70,
      H : IH - 200,
      BD: '1px solid', // I : page_name,
      BG: '#fff',
      PD: 10,
      F : LS['output'+index] || 18,
      Z : 1,
      O : 'auto'
    })

    pages[index].btn  = btn
    pages[index].name = page_name
  }

  OUTPUT_PAGES = pages

  let zoomin  = $.C(main, {
    id:'zoomin',
    I : '+',
    L : 40,
    T : 70,
    PD: '2px 8px',
    BR: 5,
    F : 18,
    BD: '2px solid #000'
  }).down(eobj => {
    if(OUTPUT_PAGES[0].Z_==2){
      OUTPUT_PAGES[0].S({
        F: OUTPUT_PAGES[0].F_ * 1 + 2
      })
      LS.output0 = OUTPUT_PAGES[0].F_
    }

    if(OUTPUT_PAGES[1].Z_==2){
      OUTPUT_PAGES[1].S({
        F: OUTPUT_PAGES[1].F_ * 1 + 2
      })
      LS.output1 = OUTPUT_PAGES[1].F_
    }
  })

  let zoomout = $.C(main, zoomin.CSS_)
    .S({
      id:'zoomout',
      I: '-',
      L: zoomin.L_ + 50
    }).down(eobj => {
      if(OUTPUT_PAGES[0].Z_==2){
        OUTPUT_PAGES[0].S({
          F: OUTPUT_PAGES[0].F_ * 1 - 2
        })
        LS.output0 = OUTPUT_PAGES[0].F_
      }

      if(OUTPUT_PAGES[1].Z_==2){
        OUTPUT_PAGES[1].S({
          F: OUTPUT_PAGES[1].F_ * 1 - 2
        })
        LS.output1 = OUTPUT_PAGES[1].F_
      }
    })

  TIME_AREA = $.C(main, {
    id:'TIME_AREA',
    L : 20,
    T : IH - 50,
    W : IW - 70,
    H : 30, // BD: '1px solid',
    // I : page_name,
    BG: '#fff',
    PD: 10,
    F : 18,
    Z : 1,
    O : 'auto'
  })

  focusPage(LS.page_name)
})

function focusPage(page_name){
  if(!page_name){
    delete LS.page_name
    return
  }

  LS.page_name = page_name

  // console.log('focusPage', LS.page_name)

  OUTPUT_PAGES.forEach((page, i) => {
    // console.log([page.name, page_name])
    if(page.name == page_name){
      page.S({
        Z: 2
      })
      page.btn.S({
        C : '#fff',
        BG: '#333'
      })
    }
    else{
      page.S({
        Z: 1
      })
      page.btn.S({
        C : '',
        BG: ''
      })
    }
  })
}

function clearAll(){
  focusPage(page_names[0])
  OUTPUT_PAGES[0].I('')
  OUTPUT_PAGES[1].I('')
  OUTPUT_PAGES[2].I('')
  // OUTPUT_PAGES[3].I('')
  TIME_AREA.I('')

  for(let key in VLIST){
    if(VLIST.hasOwnProperty(key)){
      delete VLIST[key]
      delete window[key]
    }
  }

  // 'When $a \ne 0$, there are two solutions to $ax^2 + bx + c = 0$ and they are$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$'
  TABLE_TR = []
}

function showVariable(err){
  let table = $.C(OUTPUT_PAGES[0], {
    L: 20,
    T: 40, // W: PLOT.W + 2
    W: OUTPUT_PAGES[0].W_ - 20
  })

  let s = TABLE_TR.join('')
  s += '<br/><br/>'
  table.I(s)

  s = ((new Date).toLocaleString()) + ', cost: ' + (Date.now() - t0) + ' ms'
  TIME_AREA.I(s)

  table = $.C(OUTPUT_PAGES[1], {
    L: 20,
    T: 40, // W: PLOT.W + 2
    W: OUTPUT_PAGES[1].W_ - 20
  }, 'table')

  s = ''

  if(err){
    // VLIST.err = 1
    // window.err = err
    OUTPUT_PAGES[0].I(`error: ${err}`)
  }

  for(let variable in VLIST){
    if(VLIST.hasOwnProperty(variable)){
      s += '<tr>'
      s += `<td>${variable}</td>`
      s += `<td style="text-align:left">${variableValue(window[variable])}</td>`
      s += `<td>${variableType(window[variable])}</td>`
      s += '</tr>'
    }
  }

  table.I(s)

  // console.log(SYMS)
  if(MathJax.typeset){
    MathJax.typeset()
  }
  else{
    setTimeout(MathJax.typeset, 1000)
  }
  // OUTPUT_PAGES[0].V()

  // focusPage(LS.page_name)
}

window.onerror = function(errorMessage, scriptURI, lineNumber, columNumber, errorObj){
  var s = [
    //'errorMessage: ' +
    errorMessage, 'scriptURI: ' + scriptURI, 'lineNumber: ' + (lineNumber - 2), // 'columNumber: ' + columNumber,
    // 'errorObj: ' + JSON.stringify(errorObj),
  ].join('<br>')
  OUTPUT_PAGES[0].I(s)
}
