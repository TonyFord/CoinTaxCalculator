function handleFileSelect()
{
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    alert('The File APIs are not fully supported in this browser.');
    return;
  }

  input = document.getElementById('fileinput');
  if (!input) {
    alert("Um, couldn't find the fileinput element.");
  }
  else if (!input.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
  }
  else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");
  }
  else {

    CSV={ 'buy' : { 'coin' : '', 'data' : '', 'array' : [] }, 'sell' : { 'coin' : '', 'data' : '', 'array' : [] } };

    file = document.getElementById('fileinput').files[0];
    file2 = document.getElementById('fileinput2').files[0];

    fr = new FileReader();
    fr.onload = function(fr){ receivedText(file.name) }
    fr.readAsText(file);

    fr2 = new FileReader();
    fr2.onload = function(fr2){ receivedText(file2.name) }
    fr2.readAsText(file2);
  }
}

function receivedText(fn) {
  var F=fn.split(/_/g);
  if( F.length == 2 ){
    FF=F[1].split(/\./g);
    if( FF[0] == 'buy' || FF[0] == 'sell' ){
      CSV[FF[0]].coin=F[0];
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

      if( FF[0] == 'buy'){
        JB=CSV[FF[0]].array;
      } else {
        JS=CSV[FF[0]].array;
      }

      if( CSV['buy'].coin == CSV['sell'].coin && CSV['buy'].array.length > 0 && CSV['sell'].array.length > 0 ){
        load_content( CSV['buy'].coin );
      }

    } else {
      alert( 'filename must be in format <coin>_<buy|sell>.csv' );
    }
  } else {
    alert( 'filename must be in format <coin>_<buy|sell>.csv' );
  }
}

var CSV={};
var JB=[];
var JS=[];
var bestand=0;

function load_content( coin ){

  switch(coin.toUpperCase()){

    case "SC":
      coindesc="Siacoin";
    break;
    case "BTC":
      coindesc="Bitcoin";
    break;
    case "BCH":
      coindesc="Bitcoin Cash";
    break;
    case "BTG":
      coindesc="Bitcoin Gold";
    break;
    case "DASH":
      coindesc="Dash";
    break;
    case "DCR":
      coindesc="Decred";
    break;
    case "ETH":
      coindesc="Ethereum";
    break;
    case "FAIR":
      coindesc="Faircoin";
    break;
    case "BLK":
      coindesc="Blackcoin";
    break;
    case "MAID":
      coindesc="Maidsafe";
    break;
    case "NAV":
      coindesc="Navcoin";
    break;
    case "XRP":
      coindesc="Ripple";
    break;
    case "XEM":
      coindesc="NEM";
    break;
    case "MANNA":
      coindesc="Manna";
    break;
    case "IOTA":
      coindesc="IOTA";
    break;
    case "BSV":
      coindesc="Bitcoin SV";
    break;
    case "AUR":
      coindesc="Auroracoin";
    break;

  }

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

  while( JBi < JB.length - 1 || JSi < JS.length - 1 ){
    console.log( JBi, JSi );

    if( JBi < JB.length ){
      if( JS.length == 0 ){
        console.log('1');
        timestamp_=JB[JBi].timestamp;
        flag_buy=true;
      } else if ( ! JS[0].timestamp > 0 ){
        console.log('2');
        timestamp_=JB[JBi].timestamp;
        flag_buy=true;
      } else if( ((JS[JSi] != undefined ) ? JB[JBi].timestamp <= JS[JSi].timestamp : true ) ){
        console.log('3');
        timestamp_=JB[JBi].timestamp;
        flag_buy=true;
      } else {
        console.log('4');
        timestamp_=JS[JSi].timestamp;
        flag_buy=false;
      }
    } else {
      console.log('5');
	     timestamp_=JS[JSi].timestamp;
       flag_buy=false;
    }

    //var timestamp_=( id_open < JB.length - 1 ) ? JB[id_open].timestamp : timestamp_+1000*3600*24;
    //var timestamp__=( JS.length > 0 ) ? JS[0].timestamp : timestamp_;
    //	console.log( lastyear, new Date(timestamp_), new Date(timestamp__) );

    if( lastyear < new Date( timestamp_ ).getFullYear() ){

      if( lastyear>0){
        t+="<h3>Kauf...................: " + pad.slice( parseInt( kaufyear ).toString().length ) + kaufyear.toFixed(2) + " EUR</h3>";
        t+="<h3>Verkauf................: " + pad.slice( parseInt( verkaufyear ).toString().length ) + verkaufyear.toFixed(2) + " EUR</h3>";
        t+="<h3>Gewinn/Verlust.........: " + pad.slice( parseInt( gvyear ).toString().length ) + gvyear.toFixed(2) + " EUR</h3>";
        t+="<h3>zu versteuernder Ertrag: " + pad.slice( parseInt( taxyear ).toString().length ) + taxyear.toFixed(2) + " EUR</h3>";
        t+="<h3>Bestand (31.12." + lastyear + ")...: " + pad.slice( parseInt( bestand ).toString().length ) + bestand.toFixed(8) + " " + coin.toUpperCase() + "</h3><br>";
        t+="<div class=\"pagebreak\"> </div>";
      }

      t+="<hr>";
      t+="<h1>" + coin.toUpperCase() + " ( " + coindesc + " )</h1>";
      t+="<h1>" + new Date( timestamp_ ).getFullYear() + "</h1><br>";
      lastyear=new Date( timestamp_ ).getFullYear();
      taxyear=0;
      gvyear=0;
      kaufyear=0;
      verkaufyear=0;

    }



    if( flag_buy ){

      if( id_open < JB.length - 1 ){
        var c=JB[id_open];

        t+="TRADE-ID:" + pad.slice( parseInt(id_open+1).toString().length ) + (id_open+1) + " [ eröffnet ]<br>";
        var kauf=c.amount * c.price;
        t+=pad.slice( parseInt( c.amount ).toString().length )  + "<b>" + c.amount.toFixed(8) + " " + coin.toUpperCase() + "</b><br>";
        t+=c.date + " &nbsp;&nbsp;&nbsp;kauf zu " + pad.slice( parseInt( c.price ).toString().length ) + c.price.toFixed(2) + " EUR ( " + pad.slice( parseInt( kauf ).toString().length ) + (kauf).toFixed(2) + " EUR ) <i>" + c.info + "</i><br>";
        t+="<br>";

        bestand+=c.amount;

        kaufyear+=kauf;

        id_open++;

        JBi++;

      }

    } else {

      var a=JS[JSi];

      while( JS[JSi].open > 0 && id_closed < JB.length-1 ){

        var b=JB[id_closed];

        if( b.open >= a.open ){
          t+=pad.slice( parseInt( a.open ).toString().length ) + "" + a.open.toFixed(8) + " " + coin.toUpperCase() + "<br>";
          var kauf=a.open * b.price;
          var verkauf=a.open * a.price;
          var gv=verkauf - kauf;
          bestand-=a.open;

          t+=b.date + " &nbsp;&nbsp;&nbsp;kauf zu " + pad.slice( parseInt( b.price ).toString().length ) + b.price.toFixed(2) + " EUR ( " + pad.slice( parseInt( kauf ).toString().length ) + (kauf).toFixed(2) + " EUR ) <i>" + b.info + "</i><br>";
          t+=a.date + " verkauf zu " + pad.slice( parseInt( a.price ).toString().length ) + a.price.toFixed(2) + " EUR ( " + pad.slice( parseInt( verkauf ).toString().length ) + (verkauf).toFixed(2) + " EUR ) <i>" + a.info + "</i><br>";
          var d=( a.timestamp - b.timestamp ) / 3600 / 24 / 1000;
          t+=d + " Tage " + ( ( d > taxfree ) ? " > 1 Jahr = steuerfrei" : ", zu versteuern: " + pad.slice( parseInt( gv ).toString().length ) + gv.toFixed(2) + " EUR" ) + "<br>";
          t+="<br>";
          taxyear+=( d > taxfree ) ? 0 : gv;
          gvyear+=gv;
          verkaufyear+=verkauf;
          b.open-=a.open;
          a.open=0;

          if( b.open == a.open ){
            t+="TRADE-ID:" + pad.slice( parseInt(id_closed+1).toString().length ) + (id_closed+1) + " [ geschlossen ]<br>";
            t+=pad.slice( parseInt( b.amount ).toString().length )  + "<b>" + b.amount.toFixed(8) + " " + coin.toUpperCase() + "</b><br>";
            t+="<br>";
            id_closed++;
          }

        } else if( b.open < a.open ){
          t+=pad.slice( parseInt( b.open ).toString().length ) + "" + b.open.toFixed(8) + " " + coin.toUpperCase() + "<br>";
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
          t+=pad.slice( parseInt( b.amount ).toString().length )  + "<b>" + b.amount.toFixed(8) + " " + coin.toUpperCase() + "</b><br>";
          t+="<br>";

          a.open-=b.open;
          b.open=0;

          id_closed++;

        }
      }
      JSi++;
      //JS.shift();
    }
  }
  t+="<h3>Kauf...................: " + pad.slice( parseInt( kaufyear ).toString().length ) + kaufyear.toFixed(2) + " EUR</h3>";
  t+="<h3>Verkauf................: " + pad.slice( parseInt( verkaufyear ).toString().length ) + verkaufyear.toFixed(2) + " EUR</h3>";
  t+="<h3>Gewinn/Verlust.........: " + pad.slice( parseInt( gvyear ).toString().length ) + gvyear.toFixed(2) + " EUR</h3>";
  t+="<h3>zu versteuernder Ertrag: " + pad.slice( parseInt( taxyear ).toString().length ) + taxyear.toFixed(2) + " EUR</h3>";

  var op=0;
  JB.forEach(
    function(v,i){
      if( v.open >= 0 ) op += v.open;
    }
  );
  t+="<h3>Bestand (31.12." + lastyear + ")...: " + pad.slice( parseInt( bestand ).toString().length ) + bestand.toFixed(8) + " " + coin.toUpperCase() + "</h3><br>";



  $("#out").html(t);


}
