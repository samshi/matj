function createOutputArea(f){
  var P = P_OUTPUT = $.C(f, {
    src: 'runing.html',
    id : 'id_output',
    L  : P_MATJ.L_ + P_MATJ.W_ + 10,
    T  : 0,
    W  : 800,
    H  : f.H_ - 25,
    M  : 0,
    PD : 5,
    B  : 10,
    Z  : 20,
    BD : '1px solid',
    BG : '#fff'
  }, 'iframe')

  P.run_btn = $.C(f, {
    I : 'run js code',
    L : 1050,
    T : 10,
    W: 80,
    PD: '5px 10px',
    BR: 5,
    F : 14,
    BD: '2px solid #666'
  }).down(function(){
    codeRun()
  })
}
