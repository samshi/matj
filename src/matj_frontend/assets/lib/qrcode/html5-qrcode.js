//---------------------------------------------------------------------
// JavaScript-HTML5 QRCode Generator
//
// Copyright (c) 2011 Amanuel Tewolde
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
//---------------------------------------------------------------------

// Generates a QRCode of text provided.
// First QRCode is rendered to a canvas.
// The canvas is then turned to an image PNG
// before being returned as an <img> tag.
var QRCodeVersion = 5; // 1-40 see http://www.denso-wave.com/qrcode/qrgene2-e.html

function showQRCode(text){

  var dotsize = 3;  // size of box drawn on canvas
  var padding = 6; // (white area around your QRCode)
  var black   = "rgb(0,0,0)";
  var white   = "rgb(255,255,255)";

  //362 12
  //290 11
  //217 9
  //164 8
  //130 6
  //106 5

  var canvas          = document.createElement('canvas');
  var qrCanvasContext = canvas.getContext('2d');

  try{
    // QR Code Error Correction Capability
    // Higher levels improves error correction capability while decreasing the amount of data QR Code size.
    // QRErrorCorrectLevel.L (5%) QRErrorCorrectLevel.M (15%) QRErrorCorrectLevel.Q (25%) QRErrorCorrectLevel.H (30%)
    // eg. L can survive approx 5% damage...etc.
    var qr = new QRCode(QRCodeVersion, QRErrorCorrectLevel.L);
    qr.addData(text);
    qr.make();
    // console.log('QRCodeVersion', QRCodeVersion);
  }
  catch(err){
    QRCodeVersion++; //动态自动寻找最小值
    if(QRCodeVersion>20){
      console.log(err);
      return;
    }
    return showQRCode(text);
  }

  var qrsize = qr.getModuleCount();
  canvas.setAttribute('height', (qrsize * dotsize) + padding);
  canvas.setAttribute('width', (qrsize * dotsize) + padding);
  qrCanvasContext.fillStyle = white;
  qrCanvasContext.fillRect(0, 0, 1000, 1000);
  var shiftForPadding = padding / 2;
  if(canvas.getContext){
    for(var r = 0; r < qrsize; r++){
      for(var c = 0; c < qrsize; c++){
        if(qr.isDark(r, c)){
          qrCanvasContext.fillStyle = black;
        }
        else{
          qrCanvasContext.fillStyle = white;
        }
        qrCanvasContext.fillRect((c * dotsize) + shiftForPadding, (r * dotsize) + shiftForPadding, dotsize, dotsize);   // x, y, w, h
      }
    }
  }

  return canvas.toDataURL("image/png");
}

