var ZIPSTRINGMAP = 'ghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*()_-=+{}[]|;:<>,.?'

function myzip(arr){
  var str = ''
  arr.forEach(n => {
    str += change(n)
  })
  return str

  function change(n){
    if(n < ZIPSTRINGMAP.length){
      return ZIPSTRINGMAP[n]
    }
    return n.toString(16)
  }
}

function myunzip(str){
  var arr = [], n, odd, n2 = ''
  var obj = {}
  ZIPSTRINGMAP.split('').forEach((k, index) => {
    obj[k] = index
  })

  for(var i = 0, l = str.length; i < l; i++){
    // n = ZIPSTRINGMAP.indexOf()
    n = obj[str[i]]
    if(n || n === 0){
      arr.push(n)
    }
    else if(!odd){
      n2  = str[i]
      odd = true
    }
    else{
      n2 += str[i]
      odd = false
      arr.push(parseInt(n2, 16))
    }
  }
  return arr
}

function zipstrToUrl(str){
  if(str){
    var unzip_arr     = myunzip(str)
    var bytesAsBuffer = new Uint8Array(unzip_arr)
    var banner_blob   = new Blob([bytesAsBuffer], { 'type': 'image/png' })
    var banner_url    = blobtoURL(banner_blob)
    return banner_url
  }
  return ''
}

function getArrLocal(name){
  var local_url = 'dfinity_' + name
  return myunzip(localStorage[local_url])
}

function putArrLocal(name, arr){
  var local_url           = 'dfinity_' + name
  // if(!localStorage[local_url]){
  localStorage[local_url] = myzip(arr)
  // }
}

async function readFileAsDataURL(file){
  let result = await new Promise((resolve, reject) => {
    var a    = new FileReader()
    a.onload = e => resolve(e.target.result)
    a.readAsDataURL(file)
  })

  console.log('Promise��ʽ����������Ϊ==>', result)
}

async function getImgSource(mo, name){
  var local_url = 'dfinity_' + name
  var data
  if(!localStorage[local_url]){
    if(mo){
      var bytes = await mo.getFile(name)
      data      = bytes[0]
      // putArrLocal(name, bytes[0])
    }
    else{
      return
    }
  }
  else{
    data = getArrLocal(name)
  }

  const bytesAsBuffer = new Uint8Array(data)
  var blob            = new Blob([bytesAsBuffer], { 'type': 'image/png' })
  const fileURL       = blobtoURL(blob)

  return fileURL
}

async function fileToArr(file){
  let fileSliceBuffer = (await file.arrayBuffer()) || new ArrayBuffer(0)
  let bytesAsBuffer   = new Uint8Array(fileSliceBuffer)
  return Array.from(bytesAsBuffer)
}

async function loadImg(src){
  let result = await new Promise((resolve, reject) => {
    var img    = new Image()
    img.onload = _ => resolve(img)
    img.src    = src
  })

  return result
}

function dataURLtoBlob(dataurl){
  //'data:text/plain;base64,XXXXXXXXX'
  if(dataurl){
    var arr   = dataurl.split(',')
    var match = arr[0].match(/:(.*?);/)
    if(match){
      var mime = match[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)

      while(n--){
        u8arr[n] = bstr.charCodeAt(n)
      }

      return new Blob([u8arr], { type: mime })
    }
  }
}

function blobtoURL(blob){
  return blob ? URL.createObjectURL(blob) : ''
}

function pastImgToCanvas(img, canvas, limit = 0){
  var w = img.width
  var h = img.height

  if(limit){
    var rate = Math.max(w / limit, h / limit, 1)
    w /= rate
    h /= rate
  }

  canvas.width  = w
  canvas.height = h
  var CTX       = canvas.CTX //canvas.getContext('2d')
  CTX.drawImage(img, 0, 0, w, h)
}

function imgDataUrl(img){
  var canvas = P_COPY.canvas_eobj.context
  pastImgToCanvas(img, canvas)
  return canvasDataURL(canvas)
}

function canvasDataURL(canvas){
  var dataurl = canvas.toDataURL()
  return dataurl.length > 1000 ? dataurl : ''
}

async function myAwait(title, f, p, _this = this){
  // console.log('myAwait', f, p)
  var time = Date.now()
  // var result_promise =

  try{
    if(typeof (p) == 'undefined'){
      if(_this){
        var result = await f.call(_this)
      }
      else{
        var result = await f()

      }
    }
    else{
      if(_this){
        var result = await f.call(_this, p)
      }
      else{
        var result = await f(p)

      }
    }

    console.log(time + '_' + title, result)
    return result
  }
  catch(e){
    console.log(time + '_' + title, e)
  }
}

function timeFormat(time = Date.now()){
  var t            = new Date(time)
  var minute       = ('0' + t.getMinutes()).slice(-2)
  var second       = ('0' + t.getSeconds()).slice(-2)
  var micro_second = ('00' + (time % 1000)).slice(-3)
  return minute + ':' + second + '.' + micro_second
}

// not use
/*
async function uploadFile(mo, file){
  let arr = await fileToArr(file)
  if(mo){
    await mo.uplodaFile(file.name, arr)
  }

  // putArrLocal(file.name, arr)

  return file.name
}
*/
