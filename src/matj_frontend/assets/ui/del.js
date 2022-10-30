// var CODEBASE = []
// $(function(){
//   for(let i = 1; i <= 10; i++){
//     (function(i){
//       $.get(`/test/test${i}.m`, '', res => {
//         if(res){
//           CODEBASE[i] = res
//           let name    = 'channel' + i
//           if(!LS[name]){
//             LS[name] = CODEBASE[i]
//             let m    = CODEBASE[i].match(/^\%\s*title\s*\=([\w\s]+?)\n/)
//             console.log(m)
//             if(m && m[1].trim()){
//               LS['channel_name_' + i] = m[1].trim()
//               let channel             = P_CHANNEL.locals[i]
//               channel.I(LS['channel_name_' + i])
//             }
//           }
//         }
//       })
//     })(i)
//   }
// })

onhashchange();

function encodeShare(s) {
  let out = "";
  for (let i = 0, l = s.length; i < l; i++) {
    let code = s.charCodeAt(i);
    //40-122
    code += i - 40;
    code = (code % 83) + 40;
    out += String.fromCharCode(code);
  }
  return encodeURI(out);
}

function decodeShare(s) {
  s = decodeURI(s);
  let out = "";
  for (let i = 0, l = s.length; i < l; i++) {
    let code = s.charCodeAt(i);
    //40-122
    code += -40 - i;
    code = ((code + 83) % 83) + 40;
    out += String.fromCharCode(code);
  }
  return out;
}

window.onhashchange = async function () {
  if (!window.INNER) {
    setTimeout(onhashchange, 200);
    return;
  }

  // let hash          = document.location.hash.slice(1);
  // let share_url     = decodeShare(hash)
  // let i             = P_CHANNEL.LEN
  // LS['channel' + i] = await INNER.matj_default.principalget(share_url)
  //
  // if(LS.focus_local == i){
  //   P_CHANNEL.selectLocal(i)
  // }
};
