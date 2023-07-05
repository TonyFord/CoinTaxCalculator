function handleFileSelect()
{
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    alert('The File APIs are not fully supported in this browser.');
    return;
  }
  document.getElementById('btnLoad').disabled=true;

  CSV={ 'kauf' : { 'coin' : '', 'symbol' : '', 'data' : '', 'array' : [] }, 'verkauf' : { 'coin' : '', 'symbol' : '', 'data' : '', 'array' : [] } };

  if(!fileinp('filekauf')) return false;
  setTimeout( function(){ fileinp('fileverkauf'); },1000 );
  setTimeout( 
    function(){ 
      console.log( CSV );
      if( CSV['kauf'].symbol == CSV['verkauf'].symbol && CSV['kauf'].coin == CSV['verkauf'].coin && CSV['kauf'].array.length > 0 && CSV['verkauf'].array.length > 0 ){
        load_content( CSV['kauf'] );
      } else if( CSV['verkauf'].symbol == '' ) {
        return false;
      } else {
        alert('Dateinamen müssen identisch sein und sich nur durch den Anhang _kauf und _verkauf unterscheiden!\n\nFormat <symbol>_<coin>_<kauf|verkauf>.csv definiert sein!');
      }
    },2000 
  );

  document.getElementById('btnLoad').disabled=false;

}

function fileinp(file){

  input = document.getElementById(file);
  if (!input) {
    alert('Konnte kein fileinput-Element finden! Bitte an den Entwickler wenden!');
    return false;
  }
  else if (!input.files) {
    alert('Dein Browser scheint input.files nicht zu unterstützen! Bitte versuche es mit einem anderen Browser, z.B. FireFox oder Chrome(ium)' );
    return false;
  }
  else if (!input.files[0]) {
    alert('Bitte wähle für den Kauf und Verkauf jeweils eine csv-Datei aus, bevor du Load klickst!');
    return false;
  }
  else {

    file = document.getElementById(file).files[0];

    fr = new FileReader();
    fr.onload = function(fr){ receivedText(file.name) }
    fr.readAsText(file);

  }
  return true;
}

function receivedText(fn) {
  
  var F=fn.split(/_/g);
  if( F.length > 2 ){

    FF=F.slice(-1)[0].split(/\./g);
    if( FF[0] == 'kauf' || FF[0] == 'verkauf' ){

      CSV[FF[0]].symbol=F[0];
      CSV[FF[0]].coin=F.slice(1,-1).join(' ');
      CSV[FF[0]].data=fr.result.split("\n");
      CSV[FF[0]].array=[];

      var J=CSV[FF[0]].array;

      CSV[FF[0]].data.forEach(
        function(a,i){
          var A=a.split(/,/g);
          if( A[0] != '' && A[4] != '1' ) J.push( { "date":A[0], "amount":parseFloat( A[1] ), "price":parseFloat( A[2] ), "info":A[3], "is_informal" : A[4] } );
        }
      );

      J.forEach(
        function(a,i){
          J[i].timestamp = new Date(a.date.split(".").reverse().join("-")).getTime();
          J[i].open=J[i].amount;
        }
      )

      J.sort(
        function(a,b){
          return a.timestamp - b.timestamp;
        }
      );

      if( FF[0] == 'kauf'){
        JB=CSV[FF[0]].array;
      } else if( FF[0] == 'verkauf' ) {
        JS=CSV[FF[0]].array;
      }

    } else {
      alert( 'Dateiname muss nach dem Format <symbol>_<coin>_<kauf|verkauf>.csv definiert sein!' );
    }
  } else {
    alert( 'Dateiname muss nach dem Format <symbol>_<coin>_<kauf|verkauf>.csv definiert sein!' );
  }
}

var CSV={};
var JB=[];
var JS=[];
var bestand=0;

function load_content( coin, filter = '' ){

  var t="";
  //t+="<h1>" + String.toUpperCase(coin) + " ( " + coindesc + " )</h1>";
  var pad="________";

  var id_open=0;
  var id_closed=0;
  var taxfree=365;
  var lastyear=0;
  var taxyear=0;
  var gvyear=0;
  var kaufyear=0;
  var verkaufyear=0;
  var JBi=0;
  var JSi=0;

  var timestamp_=0;
  var flag_buy=false;
  var lastJBi=-1;
  var lastJSi=-1;
  while( JBi < JB.length - 1 || JSi <= JS.length - 1 ){

    if( JBi < JB.length ){
      if( JS.length == 0 ){
        timestamp_=JB[JBi].timestamp;
        flag_buy=true;
      } else if ( ! JS[0].timestamp > 0 ){
        timestamp_=JB[JBi].timestamp;
        flag_buy=true;
      } else if( ((JS[JSi] != undefined ) ? JB[JBi].timestamp <= JS[JSi].timestamp : true ) ){
        timestamp_=JB[JBi].timestamp;
        flag_buy=true;
      } else {
        timestamp_=JS[JSi].timestamp;
        flag_buy=false;
      }
    } else {
	     timestamp_=JS[JSi].timestamp;
       flag_buy=false;
    }

    if( lastyear < new Date( timestamp_ ).getFullYear() ){

      if( lastyear>0 && filter == '' ){
        t+="<h3>Kauf...................: " + pad.slice( parseInt( kaufyear ).toString().length ) + kaufyear.toFixed(2) + " EUR</h3>";
        t+="<h3>Verkauf................: " + pad.slice( parseInt( verkaufyear ).toString().length ) + verkaufyear.toFixed(2) + " EUR</h3>";
        t+="<h3>Gewinn/Verlust.........: " + pad.slice( parseInt( gvyear ).toString().length ) + gvyear.toFixed(2) + " EUR</h3>";
        t+="<h3>zu versteuernder Ertrag: " + pad.slice( parseInt( taxyear ).toString().length ) + taxyear.toFixed(2) + " EUR</h3>";
        t+="<h3>Bestand (31.12." + lastyear + ")...: " + pad.slice( parseInt( bestand ).toString().length ) + bestand.toFixed(8) + " " + coin.symbol.toUpperCase() + "</h3><br>";
        t+="<div class=\"pagebreak\"> </div>";
      }

      t+="<hr>";
      t+="<h1>" + coin.symbol.toUpperCase() + " ( " + coin.coin + " )</h1>";
      t+="<h1>" + new Date( timestamp_ ).getFullYear() + "</h1><br>";
      lastyear=new Date( timestamp_ ).getFullYear();
      taxyear=0;
      gvyear=0;
      kaufyear=0;
      verkaufyear=0;

    }


    if( flag_buy ){

      if( id_open < JB.length ){
        var c=JB[id_open];

        t+="<span style='display:"+(( c.info.match( eval( '/'+filter+'/ig' ) ) != null ) ? '' : 'none' )+";'>TRADE-ID:" + pad.slice( parseInt(id_open+1).toString().length ) + (id_open+1) + " [ eröffnet ]<br>";
        var kauf=c.amount * c.price;
        t+=pad.slice( parseInt( c.amount ).toString().length )  + "<b>" + c.amount.toFixed(8) + " " + coin.symbol.toUpperCase() + "</b><br>";
        t+=c.date + " &nbsp;&nbsp;&nbsp;kauf zu " + pad.slice( parseInt( c.price ).toString().length ) + c.price.toFixed(2) + " EUR ( " + pad.slice( parseInt( kauf ).toString().length ) + (kauf).toFixed(2) + " EUR ) <i>" + c.info + "</i><br>";
        t+="<br></span>";

        bestand+=c.amount;

        kaufyear+=kauf;

        id_open++;

        JBi++;

      }

    } else {

      var a=JS[JSi];

      while( JS[JSi].open > 0 && id_closed <= JB.length-1 ){

        var b=JB[id_closed];

        if( b.open >= a.open ){

          t+="<span style='display:"+(( a.info.match( eval( '/'+filter+'/ig' ) ) != null ) ? '' : 'none' )+";'>"+pad.slice( parseInt( a.open ).toString().length ) + "" + a.open.toFixed(8) + " " + coin.symbol.toUpperCase() + "<br>";
          var kauf=a.open * b.price;
          var verkauf=a.open * a.price;
          var gv=verkauf - kauf;
          bestand-=a.open;

          t+=b.date + " &nbsp;&nbsp;&nbsp;kauf zu " + pad.slice( parseInt( b.price ).toString().length ) + b.price.toFixed(2) + " EUR ( " + pad.slice( parseInt( kauf ).toString().length ) + (kauf).toFixed(2) + " EUR ) <i>" + b.info + "</i><br>";
          t+=a.date + " verkauf zu " + pad.slice( parseInt( a.price ).toString().length ) + a.price.toFixed(2) + " EUR ( " + pad.slice( parseInt( verkauf ).toString().length ) + (verkauf).toFixed(2) + " EUR ) <i>" + a.info + "</i><br>";
          var d=( a.timestamp - b.timestamp ) / 3600 / 24 / 1000;
          t+=d + " Tage " + ( ( d > taxfree ) ? " > 1 Jahr = steuerfrei" : ", zu versteuern: " + pad.slice( parseInt( gv ).toString().length ) + gv.toFixed(2) + " EUR" ) + "<br>";
          t+="<br></span>";
          taxyear+=( d > taxfree ) ? 0 : gv;
          gvyear+=gv;
          verkaufyear+=verkauf;
          b.open-=a.open;
          a.open=0;

          if( b.open == a.open ){
            t+="TRADE-ID:" + pad.slice( parseInt(id_closed+1).toString().length ) + (id_closed+1) + " [ geschlossen ]<br>";
            t+=pad.slice( parseInt( b.amount ).toString().length )  + "<b>" + b.amount.toFixed(8) + " " + coin.symbol.toUpperCase() + "</b><br>";
            t+="<br>";
            id_closed++;
          }

        } else if( b.open < a.open ){
          t+="<span style='display:"+(( a.info.match( eval( '/'+filter+'/ig' ) ) != null ) ? '' : 'none' )+";'>"+pad.slice( parseInt( b.open ).toString().length ) + "" + b.open.toFixed(8) + " " + coin.symbol.toUpperCase() + "<br>";
          var kauf=b.open * b.price;
          var verkauf=b.open * a.price;
          var gv=verkauf - kauf;
          bestand-=b.open;

          t+=b.date + " &nbsp;&nbsp;&nbsp;kauf zu " + pad.slice( parseInt( b.price ).toString().length ) + b.price.toFixed(2) + " EUR ( " + pad.slice( parseInt( kauf ).toString().length ) + (kauf).toFixed(2) + " EUR ) <i>" + b.info + "</i><br>";
          t+=a.date + " verkauf zu " + pad.slice( parseInt( a.price ).toString().length ) + a.price.toFixed(2) + " EUR ( " + pad.slice( parseInt( verkauf ).toString().length ) + (verkauf).toFixed(2) + " EUR ) <i>" + a.info + "</i><br>";
          var d=( a.timestamp - b.timestamp ) / 3600 / 24 / 1000;
          t+=d + " Tage " + ( ( d > taxfree ) ? " > 1 Jahr = steuerfrei" : ", zu versteuern: " + pad.slice( parseInt( gv ).toString().length ) + gv.toFixed(2) + " EUR" ) + "<br>";
          t+="<br>";
          taxyear+=( d > taxfree ) ? 0 : gv;
          gvyear+=gv;
          verkaufyear+=verkauf;

          t+="TRADE-ID:" + pad.slice( parseInt(id_closed+1).toString().length ) + (id_closed+1) + " [ geschlossen ]<br>";
          t+=pad.slice( parseInt( b.amount ).toString().length )  + "<b>" + b.amount.toFixed(8) + " " + coin.symbol.toUpperCase() + "</b><br>";
          t+="<br></span>";

          a.open-=b.open;
          b.open=0;

          id_closed++;

        }
      }
      JSi++;
    }
  }
  if( filter == '' ){
    t+="<h3>Kauf...................: " + pad.slice( parseInt( kaufyear ).toString().length ) + kaufyear.toFixed(2) + " EUR</h3>";
    t+="<h3>Verkauf................: " + pad.slice( parseInt( verkaufyear ).toString().length ) + verkaufyear.toFixed(2) + " EUR</h3>";
    t+="<h3>Gewinn/Verlust.........: " + pad.slice( parseInt( gvyear ).toString().length ) + gvyear.toFixed(2) + " EUR</h3>";
    t+="<h3>zu versteuernder Ertrag: " + pad.slice( parseInt( taxyear ).toString().length ) + taxyear.toFixed(2) + " EUR</h3>";
  }

  var op=0;
  JB.forEach(
    function(v,i){
      if( v.open >= 0 ) op += v.open;
    }
  );

  if( filter == '' ){
    t+="<h3>Bestand (31.12." + lastyear + ")...: " + pad.slice( parseInt( bestand ).toString().length ) + bestand.toFixed(8) + " " + coin.symbol.toUpperCase() + "</h3><br>";
  }

  $("#out").html(t);


}
