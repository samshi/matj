function trans2js(s, fgroup = []){
  var REG = TIDY.正则

  var i = 100000
  var j, act, fun, arg

  var id_reg   = REG.id[1]
  var add_line = 0
  while(id_reg.test(s) && i--){
    j = 0
    s = s.replace(id_reg, function(uuid){
      j++
      var group  = getGroup(uuid)
      var source = getUuidCode(group, uuid)

      let newline = source.split(/_\d{5}_NN_/g)
      if(newline.length > 1){
        add_line += newline.length - 1
      }

      var c = source.trim()
      c     = c.replace(/_\d{5}_RF_/g, '')
      c     = c.replace(/_\d{5}_NN_/g, ' ').trim()

      var a, f
      switch(group){
        case 'AC':
          fun = c.slice(0, -10).trim()
          group += fun
          arg = c.slice(-10)
          act = 'action'
          // var f = c.slice(0, -10).trim()
          if(fgroup[0] == 'MA' && j == 1){
            // f = 1 || M[fun] ? `"${fun}"` : fun
            c = `pickset("${fun}",${arg})`
          }
            // else if(fgroup.includes('MA')){
            //   c = ['pickget("', f, '",', c.slice(-10), ')'].join('')
          // }
          else if(/_\d{5}_DT_/g.test(fun)){
            c = `${act}(${fun},${arg})`
          }
          else{
            // c = `${act}(this.${fun}??"${fun}",${arg})`
            f = M[fun] ? `"${fun}"` : `typeof(${fun})=="undefined"?"${fun}":${fun}`
            c = `${act}(${f},${arg})`
            // c = `${act}(typeof(${fun})=="undefined"?"${fun}":${fun},${arg})`
          }

          break
        case 'AE':
          c = c.slice(1, -1)
          c = c.replace(/end/g, '"end"')
          a = c.split(/[,\s]+/g)
          c = '["' + a.join('","') + '"]'
          break
        case 'AD':
          let pre = ''
          if(c[0] == '+'){
            c = c.slice(1)
          }
          if(c[0] == '-'){
            c   = c.slice(1)
            pre = '-'
          }

          a = c.split(/\s*\+\s*/g)
          if(a.length == 2){
            if(pre == '-'){
              c = ['M.plus(M.mtimes(', a[1], ', -1),', a[0], ')'].join('')
            }
            else{
              c = ['M.plus(', a[0], ',', a[1], ')'].join('')
            }
          }
          else{
            a = c.split(/\s*\-\s*/g)
            if(a.length == 2){
              if(pre == '-'){
                c = ['M.minus(M.mtimes(', a[0], ', -1),', a[1], ')'].join('')
              }
              else{
                c = ['M.minus(', a[0], ',', a[1], ')'].join('')
              }
            }
          }

          break
        case 'AF':
          console.log('AF', c) //AF @_10015_BR_ _10046_DR
          let func_head = c.slice(1, 11)
          let func_body = c.slice(11)
          c             = `function(${func_head}){return ${func_body}}`
          break
        case 'AL':
          if(c.slice(-1) == ';'){
            act = 'action'
            c   = c.slice(0, -1)
          }
          else{
            if(c.slice(0, 4) == 'plot'){
              act = 'action'
            }
            else{
              act = 'actionshow'
            }
          }

          fun = c.slice(0, -10).trim()
          group += fun

          arg = c.slice(-10)
          // c   = `${act}(this.${fun}??"${fun}",${arg})`
          f   = M[fun] ? `"${fun}"` : `typeof(${fun})!='undefined'?${fun}:"${fun}"` //`"${fun}"`
          c   = `${act}(${f},${arg})`
          // c   = `${act}(typeof(${fun})!='undefined'?${fun}:"${fun}",${arg})`
          // c = [act, '("', c.slice(0, -10).trim(), '",', c.slice(-10), ')'].join('')

          break
        case 'AR':
          // console.log('AR', c)
          // x=[1:10]
          // A(:,:,1) = [2 3; 1 6]
          // [invA, invB] = inv(A)
          // A = [true false true true true false]
          // A = [true false true; true true false]
          // A=[a,a]

          if(0 && fgroup[0] == 'MA'){ //为什么屏蔽过这一项？ A(:,:,1) = [2 3; 1 6]
            c = c.slice(1, -1)
            a = c.split(/[\s,]+/g)

            //以下到底用哪个？
            c = '["' + a.join('","') + '"]' //[invA, invB] = inv(A)
            // c = '[' + a.join(',') + ']'
          }
          else{
            c = c.slice(1, -1)
            //replace(/\s+/g, ' ').
            a = c.trim().split(/[;\n]+/g) //;和换行都是矩阵的新行的分隔符
            for(let i = a.length - 1; i >= 0; i--){
              if(a[i].trim() == ''){
                a.splice(i, 1)
              }
            }

            if(a.length == 1){
              if(/_\d{5}_(CC|SC)_/.test(c)){ //x=[1:10]

              }
              else if(/^[\+\-\d\.\s\,\/]+$/.test(c)){
                //增加 \w : A = [true false true true true false]
                //不增加 A=[a,a]
                a = a[0].trim().split(/[\s\,]+/g).map(s => isNaN(s) ? s : +s)
                // c = JSON.stringify(a)

                //checkMt(cumsum(A), [1 1 2 3 4 4]);
                c = 0 && a.length == 1 ? '[' + a[0] + ']' : 'M.concatenate(' + a.join(',') + ')'
              }
              else{
                a = a[0].trim().split(/[\s\,]+/g)
                c = a.length == 1 ? '[' + a[0] + ']' : 'M.concatenate(' + a.join(',') + ')'
              }
            }
            else{
              if(/^[\+\-\d\.\s\,\;\/]+$/.test(c)){
                //增加 \w : A = [true false true; true true false]
                //不增加 A=[a;a]
                a = a.map(row => {
                  row = row.trim().split(/[\s\,]+/g).map(s => isNaN(s) ? s : +s)
                  return (row.length == 1 ? row[0] : 'M.concatenate(' + row.join(',') + ')')
                })
                // c = JSON.stringify(a).replace(/"/g, '')
                // console.log(a, c)

                c = 'M.concatenateV(' + a.join(',') + ')'
              }
              else{
                a = a.map(row => {
                  row = row.trim().split(/[\s\,]+/g)
                  return (row.length == 1 ? row[0] : 'M.concatenate(' + row.join(',') + ')')
                })
                c = 'M.concatenateV(' + a.join(',') + ')'

              }
              let newline0 = source.split('\n')
              if(newline0.length > 1){
                c += (new Array(newline0.length)).join('\n')
              }
            }
          }

          break
        case 'AS':
          var hascolon = c.slice(-1) == ';'
          act          = hascolon ? 'assign' : 'assignshow'
          c            = hascolon ? c.slice(0, -1) : c
          a            = c.split(/\s*\=\s*/)
          a[1]         = a[1].replace(/_\d{5}_AR_/, s => {
            return 'ndarray(' + s + ')'
          })

          if(/_\d{5}_(AC|PS|AE|BE)_/.test(a[0])){
            c = act + '(' + a[1] + ',' + a[0] + ')'
          }
            // else if(/_\d{5}_PS_/.test(a[0])){
            //   c = act + '(' + a[0] + ',' + a[1] + ')'
          // }
          else if(/_\d{5}_\w\w_/.test(a[0])){
            c = act + '(' + a[1] + ',' + a[0] + ')' //x.a.b.c=[1;2]
            // c = act + '(' + a[1] + ',"' + a[0] + '")'
          }
          else if(fgroup[0] == 'FR='){
            c = a[0] + '=' + a[1]
          }
          else{
            // c = a[0] + '=' + a[1]
            c = act + '(' + a[1] + ',"' + a[0] + '")'
          }

          if(hascolon){
            c += ';'
          }

          // if(!hascolon && fgroup[0] != 'FR='){
          //   // c += '\nM.printline("' + a[0] + '")'
          //   c = 'assignshow("' + a[0] + '",' + a[1] + ')'
          // }
          break
        case 'BE':
          // let s = c
          c = c.slice(1, -1)
          c = c.replace(/end/g, '"end"')
          if(fgroup[0] == 'MA'){
            a = c.split(/[,\s]+/g)
            c = '["' + a.join('","') + '"]'
          }
          else{
            // c = s
          }
          // console.log(fgroup[0], c)
          break
        case 'BR':
          c = c.slice(1, -1)
          c = c.replace(/end/g, '"end"')
          if(fgroup[0] == 'MA'){
            a = c.split(/[,\s]+/g)
            c = '["' + a.join('","') + '"]'
          }

          if(/A\w(factor|limit|solve|mathjax|simplify|expand)$/.test(fgroup[0])){ // && !/_AC_/.test(c)
            let s = 全部复原(c)
            let a = s.split(',')
            a[0] = '"' + a[0] + '"'
            return a.join(',')
          }

          break
        case 'CC':
          //B = 0:10:100
          // m=[1:2:10;2:6]
          if(fgroup[0] == 'AR'){
            a = c.split(/\s*\:\s*/)
            c = 'M.linear(' + a[0] + ',' + a[1] + ',' + a[2] + ')' // A=[1:3:7;2:3:8;3:3:9]
          }
          else if(/AS|MS/g.test(fgroup[0])){
            a = c.split(/\s*\:\s*/)
            c = 'M.linear(' + a[0] + ',' + a[1] + ',' + a[2] + ')'
          }
          else if(fgroup[0] == 'BR' && /^[\d\.\:]+$/g.test(c)){
            // str2(4:2:8)
            // c = '"' + c + '"'
            // console.log(source)

            // sum((1:10)./(3:2:21))
            a = c.split(/\s*\:\s*/)
            c = 'M.linear(' + a[0] + ',' + a[1] + ',' + a[2] + ')'
          }
          else if(fgroup[1] != 'FR='){
            //D(1:2:end)
            c = '"' + c + '"'
          }
          break
        case 'CA':
          c = '\nbreak\n' + c + ':'
          // c = c + ':'
          break
        case 'CM':
          c = ['\ncommand("', c, '")'].join('')
          break
        case 'CN':
          a = c.match(/[\>\<\=\~\!]+/)
          c = ['M.cn(', c.slice(0, a.index), ',"', a[0], '",', c.slice(a.index + a[0].length), ')'].join('')
          break
        case 'CP':
          // a = c.split(/\b/g)
          // a = c.slice(0, -1)
          c      = c.replace(/\s*/g, '')
          let im = c.match(/[\+\-]?\s*\d*(\.\d+)?[ij]/g)
          let re = +c.replace(im[0], '')
          im     = im[0].slice(0, -1) || 1
          im     = im == '-' || im == '+' ? +(im + '1') : +im
          c      = ['complex(', re, ',', im, ')'].join('')
          break
        case 'DA':
          a = c.match(/&&/)
          c = ['doubleand(', c.slice(0, a.index), ',', c.slice(a.index + a[0].length), ')'].join('')
          break
        case 'DE':
          a = c.match(/\.\^/)
          c = ['M.power(', c.slice(0, a.index), ',', c.slice(a.index + a[0].length), ')'].join('')
          break
        case 'DG':
          a = c.match(/\'/)
          c = ['M.ctranspose(', c.slice(0, a.index), ')'].join('')
          break
        case 'DL':
          a = c.split(/\s*\.\\\s*/g)
          c = ['M.ldivide(', a[0], ',', a[1], ')'].join('')
          break
        case 'DM':
          a = c.match(/\.\*/)
          c = ['M.times(', c.slice(0, a.index), ',', c.slice(a.index + a[0].length), ')'].join('')
          break
        case 'DO':
          a = c.match(/\|\|/)
          c = ['doubleor(', c.slice(0, a.index), ',', c.slice(a.index + a[0].length), ')'].join('')
          break
        case 'DR':
          a = c.split(/\s*\.\/\s*/g)
          c = ['M.rdivide(', a[0], ',', a[1], ')'].join('')
          break
        case 'DT':
          c = 'M.checkObj("' + c + '")'
          break
        case 'DZ':
          a = c.match(/\.\'/)
          c = ['M.transpose(', c.slice(0, a.index), ')'].join('')
          break
        case 'FN':
          let function_head_pos = c.indexOf('\n')
          let line0             = c.slice(9, function_head_pos).trim()
          let source_code       = 单级复原(line0, 1)
          let return_func       = source_code.split('=')

          if(return_func.length == 1){
            line0 = 'function ' + return_func[0]
            if(line0.indexOf('(') == -1){
              line0 += '()'
            }
            c = line0 + '{' + c.slice(function_head_pos)
            c = c.replace(/end\w*/, '}')
          }
          else{
            // console.log(trans2js(line0))
            line0 = 'function ' + return_func[1]
            // line0                 = line0.replace(/^[^\(]+/, s => {
            //   return s + '=function'
            // })
            if(line0.indexOf('(') == -1){
              line0 += '()'
            }
            c = line0 + '{' + c.slice(function_head_pos)
            c = c.replace(/end\w*/, 'return ' + return_func[0] + '}')
          }

          break
        case 'FR':
          a = c.match(/_\d{5}_AS_/)
          c = c.replace(a[0], s => {
            s     = trans2js(s, ['FR=', ...fgroup])
            //i=1:5
            var a = s.split('=')
            //.replace(/"/g, '')
            var b = a.slice(1).join('').split(':')
            if(b.length == 2){
              var l    = b[1]
              var step = 1
            }
            else if(b.length == 3){
              var l    = b[2]
              var step = b[1]
            }
            var lname = 'l' + a[0]
            return ['(', a[0], '=', b[0], ', ' + lname + '=' + l + ';', a[0], '<=' + lname + ';', a[0], '+=', step, '){'].join('')
          })
          c = c.replace('end', '}')

          break
        case 'IF':
          c = c.replace(/\belse\b/g, '}else{')
          c = c.replace(/elseif/g, '}else if')
          a = c.match(/if\s+.*\n/g)
          a.forEach(str => {
            c = c.replace(str, s => {
              let mid = s.slice(3, -1)
              mid     = trans2js(mid, [group, ...fgroup])
              return 'if (' + mid + '){\n'
            })
          })
          c = c.replace('end', '}')
          break
        case 'LD':
          a = c.match(/\\/)
          c = ['M.mldivide(', c.slice(0, a.index), ',', c.slice(a.index + a[0].length), ')'].join('')
          break
        case 'LG':
          c = c.replace(/\|/g, '||')
          c = c.replace(/\&/g, '&&')
          break
        case 'MA':
          act = c.slice(-1) == ';' ? 'multias' : 'multiasshow'
          c   = c.slice(-1) == ';' ? c.slice(0, -1) : c
          a   = c.split(/\s*\=\s*/g)

          a[1] = a[1].replace(/_\d{5}_AR_/, s => {
            return 'ndarray(' + s + ')'
          })

          c = [act, '(', a[0], ',', a[1], ')'].join('')
          break
        case 'MI':
          a = c.match(/\^/)
          c = ['M.mpower(', c.slice(0, a.index), ',', c.slice(a.index + a[0].length), ')'].join('')
          break
        case 'MN': //被add代替
          a = c.split(/\s*\-\s*/g)
          if(a.length == 3){
            c = ['M.minus(M.mtimes(', a[1], ', -1),', a[2], ')'].join('')
          }
          else{
            c = ['M.minus(', a[0], ',', a[1], ')'].join('')
          }
          break
        case 'MU':
          a = c.split(/\s*\*\s*/g)
          if(a[0][0] == '-'){
            c = ['M.mtimes(M.mtimes(', a[1].slice(1), ', -1),', a[2], ')'].join('')
          }
          else{
            c = ['M.mtimes(', a[0], ',', a[1], ')'].join('')
          }
          break
        case 'NE':
          c = c.replace(/\s*\~\=\s*/, '!=')
          break
        case 'NG':
          c = ['M.mtimes(-1,', c.slice(1), ')'].join('')
          break
        case 'NN':
          return ''
        case 'NT':
          c = c.replace(/\s*\~\s*/, '!')
          break
        case 'OC':
          c = `calcshow(${c})`
          break
        case 'OB':
          if(fgroup[0] == 'CA'){
            a = c.slice(1, -1).split(',')
            c = a.join(':\ncase ')
          }
          else{
            a = c.slice(1, -1).split(';')
            c = '[' + a.join(',') + ']'
          }
          break
        case 'OP':
          if(/\belse\b/g.test(source)){
            return source.replace(/\belse\b/g, '}else{')
          }
          else if(/\botherwise\b/g.test(c)){
            return source.replace(/\botherwise\b/g, '\nbreak\ndefault:')
          }
          else{
            c = `M.printline("${c}", ${c})`
          }
          break
        case 'PS':
          var fun = c.slice(0, -10).trim()
          var arg = c.slice(-10)
          // f = 1 || M[fun] ? `"${fun}"` : fun
          c       = `pickset("${fun}",${arg})`
          // c       = `pickset(typeof(${fun})!='undefined'?${fun}:"${fun}",${arg})`
          // if(fgroup[0] == 'MA' && j == 1){
          // }
          //   // else if(fgroup.includes('MA')){
          //   //   c = ['pickget("', f, '",', c.slice(-10), ')'].join('')
          // // }
          // else if(/_\d{5}_DT_/g.test(f)){
          //   c = ['pickset(', f, ',', c.slice(-10), ')'].join('')
          // }
          // else{
          //   c = ['pickset("', f, '",', c.slice(-10), ')'].join('')
          // }

          break
        case 'RB':
          let newline = c.split('\n')
          if(newline.length > 1){
            return (new Array(newline.length)).join('\n')
          }
          return ''
        case 'RD':
          a = c.match(/\//)
          c = ['M.mrdivide(', c.slice(0, a.index), ',', c.slice(a.index + a[0].length), ')'].join('')
          break
        case 'RF':
          return ''
        case 'SF':
          c = c.slice(1)
          return '"' + c + '"'
        case 'SC':
          // m=[1:2:10;2:6]
          a = c.split(/\s*\:\s*/)
          if(fgroup[0] == 'AR'){
            c = 'M.linear(' + a[0] + ',' + a[1] + ')'
          }
          else if(fgroup[0] == 'AR' || fgroup[0] == 'AS' && fgroup[1] !== 'FR='){
            c = 'M.linear(' + a[0] + ',' + a[1] + ')'
          }
          else if(fgroup[0] == 'BR' && /DG|DR/.test(fgroup[1]) && !/end/g.test(c)){
            //cavg=cumsum(x)./(1:length(x))
            if(!a[0].length || !a[1].length){
              c = '"' + c + '"'
            }
            else{
              c = 'M.linear(' + a[0] + ',' + a[1] + ')'
            }
          }
          else if(fgroup[1] == 'FR='){

          }
          else{
            c = '"' + c + '"'
            c = c.replace(/_\d{5}_\w\w_/g, s => {
              return '"+' + s + '+"'
            })

            if(c.slice(0, 3) == '""+'){
              c = c.slice(3)
            }

            if(c.slice(-3) == '+""'){
              c = c.slice(0, -3)
            }
          }

          break
        case 'SW':
          c = c.replace(/switch\s+\w+/, str => {
            return 'switch(' + str.slice(6) + '){\ncase "never coming":'
          })
          c = c.replace(/\{\nbreak\n/, '{\n')
          c = c.replace(/\botherwise\b/, 'default:')
          c = c.replace('end', '}')
          break
        case 'SY':
          a = c.slice(5).trim().split(/\s+/g)
          c = 'M.syms("' + a.join('","') + '")'
          break
        case 'TY':
          c = c.replace(/catch\s+\w+/, str => {
            return '\n}\ncatch(e){\n' + str.slice(6).trim()
          })
          c = c.replace('try', 'try{')
          c = c.replace('end', '}')
          break
        case 'WH':
          c = c.replace(/while\s+\w+/, str => {
            return 'while(' + str.slice(6).trim() + '){'
          })
          c = c.replace('end', '}')
          break

        //todo
        case 'BK':
        case 'CE':
        case 'CT':

        case 'OE':
        case 'PI':
        case 'RT':
        case 'SA': //!
        case 'SL':
        case 'ST':
        default:
      }

      return trans2js(c, [group, ...fgroup])
    })
  }

  if(add_line){
    s = (new Array(add_line + 1)).join('\n') + s
  }
  return s
}

