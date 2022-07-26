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
    //����ƶ����ϣ�ˢ��һ�Σ����Ǵ����ٴθĶ�
    if(!window.code_changed){
      return
    }

    codeRun()
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
    codeRun()
  })
}
