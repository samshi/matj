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
  }, 'iframe').over(_=>{
    //鼠标移动其上，刷新一次，除非代码再次改动
    if(!P_MATJ.code_changed){
      return
    }

    P_MATJ.codeRun()
  })

  P.run_btn = $.C(f, {
    I : 'run',
    L : 1050,
    T : 10,
    W : 50,
    PD: '2px 10px',
    BR: 5,
    F : 19,
    BD: '2px solid #4aac0c',
    C: '#fff',
    BG:'#4aac0c',
    TA: 'center'
  }).down(_=>{
    P_MATJ.codeRun()
  })
}
