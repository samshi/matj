function createJsArea(f){
  var P = P_JS = $.C(f, {
    id : 'id_js_area',
    L  : 430,
    T  : 50,
    W  : 800,
    H  : f.H_ - 75,
    M  : 0,
    PD : 2,
    B  : 10,
    PDB: 10,
    F  : 16,
    O  : 'auto',
    Z  : 1,
    FF : 'monospace',
    BG : '#009',
  })

  P.show = $.C(f, {
    I : 'view js code',
    L : 780,
    T : 10,
    PD: '5px 10px',
    BR: 5,
    F : 14,
    BD: '2px solid #009'
  }).down(eobj => {
    console.log('js')
    $('#id_js_area').V()
    $('#id_matj_area').H()
  }).H()

  P.textarea = $.C(P, {
    id: 'js_textarea'
  }, 'textarea')

  var option = {
    lineNumbers      : true,
    tabSize          : 2,
    autoCloseBrackets: true,
    autoCloseTags    : true,
    foldGutter       : true,
    lineWrapping     : true,
    // theme            : 'base16-light',
    gutters          : [
      'breakpoints', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'
    ],
    viewportMargin   : Infinity,
    theme            : 'base16-light',
  }

  P.editor = CodeMirror(function(elt){
    var myTextArea = P.textarea.context
    myTextArea.parentNode.replaceChild(elt, myTextArea)
    elt.id    = 'id_js_mirror'
    P.context = elt
  }, option)

  $('#id_js_mirror').S({H: 'calc(100% + 8px'})
}