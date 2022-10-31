function createCopyPage(f){
  var P = window.P_COPY = $.C(f, {
    L: -1000
  })

  P.input = $.c(P, {
    type: 'text'
  }, 'input')

  P.copyContent = (str) => {
    var P = P_COPY
    P.input.val(str)
    P.input.context.select()
    document.execCommand('copy')
  }

  P.copy_msg = $.C(main, {
    F : 12,
    I : 'Copied',
    Z : 100,
    BG: 'yellow',
    PD: '2px 8px',
    BD: '1px solid #888',
    BR: 10,
  }).H()

  P.large_image = $.C(main, {
    CN: 'avatar',
    W: 80,
    Z: 100,
  }, 'img').H()
}


