function createCopyPage (f) {
  var P = W.P_COPY = $.C(f, {
    L: -1000
  })

  P.input = $.c(P, {
    type: 'text'
  }, 'input')
}

function copyContent (str) {
  var P = P_COPY
  P.input.val(str)
  P.input.context.select()
  document.execCommand('copy')
}
