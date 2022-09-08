function createCopyPage (f) {
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
}


