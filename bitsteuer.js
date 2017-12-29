$( document ).ready(function() {

  load_content( getQueryVariable("coin") );


});

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       if( variable == "coin" ){ return "btc"; } else { return(false); }

}

function json_load( url ){
  var json = null;
  $.ajax({
      'async': false,
      'global': false,
      'cache': false,
      'url': url,
      'dataType': "json",
      'success': function (data) {
          json = data;
      }
  });
  return json;
}

function csv_load( url ){
  var csv = null;
  $.ajax({
      'async': false,
      'global': false,
      'cache': false,
      'url': url,
      'dataType': "text",
      'success': function (data) {
          csv = data;
      }
  });
  return csv;
}

var JB=[];
var JS=[];
var bestand=0;

function load_content( coin ){

  var csv=csv_load( coin + "_buy.csv");
  CSV=csv.split("\n");
  JB=[];

  CSV.forEach(
    function(a,i){
      var A=a.split(/,/g);
      JB.push( { "date":A[0], "amount":parseFloat( A[1] ), "price":parseFloat( A[2] ), "info":A[3] } );

    }
  );

  //var JB=json_load("btx_buy.json");
  JB.forEach(
    function(a,i){
      JB[i].timestamp = new Date(a.date.split(".").reverse().join("-")).getTime();
      JB[i].open=JB[i].amount;
    }
  )
  JB.sort(
    function(a,b){
      return a.timestamp - b.timestamp;
    }
  );

  var csv=csv_load( "data/" + coin + "_sell.csv");
  CSV=csv.split("\n");
  JS=[];

  CSV.forEach(
    function(a,i){
      var A=a.split(/,/g);
      JS.push( { "date":A[0], "amount":parseFloat( A[1] ), "price":parseFloat( A[2] ), "info":A[3] } );
    }
  );

  //var JS=json_load("btx_sell.json");
  JS.forEach(
    function(a,i){
      JS[i].timestamp = new Date(a.date.split(".").reverse().join("-")).getTime();
      JS[i].open=JS[i].amount;
    }
  )

  JS.sort(
    function(a,b){
      return a.timestamp - b.timestamp;
    }
  );


  var t="";
  var pad="________";

  var id_open=0;
  var id_closed=0;
  var taxfree=365;
  var lastyear=0;
  var taxyear=0;
  var gvyear=0;
  var kaufyear=0;
  var verkaufyear=0;


  while( id_open < JB.length-1 || JS.length-1 > 0 ){

    var timestamp_=( id_open < JB.length - 1 ) ? JB[id_open].timestamp : timestamp_ + 1000*3600*24;


    if( lastyear < new Date( timestamp_ ).getFullYear() ){

      if( lastyear>0){
        t+="<h3>Kauf...................: " + pad.slice( parseInt( kaufyear ).toString().length ) + kaufyear.toFixed(2) + " EUR</h3>";
        t+="<h3>Verkauf................: " + pad.slice( parseInt( verkaufyear ).toString().length ) + verkaufyear.toFixed(2) + " EUR</h3>";
        t+="<h3>Gewinn/Verlust.........: " + pad.slice( parseInt( gvyear ).toString().length ) + gvyear.toFixed(2) + " EUR</h3>";
        t+="<h3>zu versteuernder Ertrag: " + pad.slice( parseInt( taxyear ).toString().length ) + taxyear.toFixed(2) + " EUR</h3>";
        t+="<h3>Bestand (31.12." + lastyear + ")...: " + pad.slice( parseInt( bestand ).toString().length ) + bestand.toFixed(8) + " " + coin.toUpperCase() + "</h3><br>";
        t+="<div class=\"pagebreak\"> </div>";
      }

      t+="<hr><h1>" + new Date( timestamp_ ).getFullYear() + "</h1><br>";
      lastyear=new Date( timestamp_ ).getFullYear();
      taxyear=0;
      gvyear=0;
      kaufyear=0;
      verkaufyear=0;

    }


//    while( ( JS.length > 0 ) ? JS[0].timestamp < JB[id_open].timestamp : false ){

    while( ( JS.length > 0 ) ? JS[0].timestamp < timestamp_ : false ){

      var a=JS[0];

      while( JS[0].open > 0 && id_closed < JB.length-1 ){

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

      JS.shift();
    }

    if( id_open < JB.length -1 ){
      var c=JB[id_open];

      t+="TRADE-ID:" + pad.slice( parseInt(id_open+1).toString().length ) + (id_open+1) + " [ eröffnet ]<br>";
      var kauf=c.amount * c.price;
      t+=pad.slice( parseInt( c.amount ).toString().length )  + "<b>" + c.amount.toFixed(8) + " " + coin.toUpperCase() + "</b><br>";
      t+=c.date + " &nbsp;&nbsp;&nbsp;kauf zu " + pad.slice( parseInt( c.price ).toString().length ) + c.price.toFixed(2) + " EUR ( " + pad.slice( parseInt( kauf ).toString().length ) + (kauf).toFixed(2) + " EUR ) <i>" + c.info + "</i><br>";
      t+="<br>";

      bestand+=c.amount;

      kaufyear+=kauf;

      id_open++;
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
