//_____________________________________ Helper 


var statistikKey = 'gegentore';
var maxHelper = {};
var maxRadius = 70;
var minRadius = 10;
var visualisationData = {};

var options = [
'tore',
'gegentore',
'spielanzahl',
'alter',
'rot',
'gelb',
'qualifikationen',
'marktwert',
'kader',
'punkte',
'siege',
'gastgeber',
'twitter',
'landsize'
]


//_____________________________________ Load external Data

var xmlhttp = new XMLHttpRequest();
var url = "data.json";

xmlhttp.onreadystatechange = function() {
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    var myArr = JSON.parse(xmlhttp.responseText);
    formatData(myArr[0]);
  }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();


//_____________________________________ Format external Data


function formatData(arr) {

  var dataFormat = {}
  for(key in arr[0]){
    if(key !== 'Name'){
      dataFormat[key] = {}
    }
  }

  
  arr.forEach(function(obj, index) {

    //getMaxValues
    normalizeData(obj);
    
    //restructure Data
    for(key in obj){

      if(key !== 'name'){
        if(typeof dataFormat[key][obj.name] === 'undefined'){
          dataFormat[key][obj.name] = {}
        }
        dataFormat[key][obj.name] = obj[key];

      }
    }
  });



 buildDataViz(dataFormat);
}

function normalizeData(obj){ 

  var formatDataObject = {}
  var normArr = [];


  for( key in obj ){
    if(key !== 'name'){
       normArr.push(obj[key]);
    }
  }

 
  var largest = Math.max.apply(Math, normArr);
  for( key in obj ){
    maxHelper[ obj['name'] ] = largest
  }
}





// Maxwert

// currentWert







//_____________________________________ Build Data Viz
function buildCircle (holder,opt) {
  var c = document.createElementNS("http://www.w3.org/2000/svg","circle");
  

    holder.setAttribute('name', opt.key)

    console.log(visualisationData,[opt.key]);

    if(opt.radius >= minRadius){
      c.radius = maxRadius * opt.radius / 100;
     
    }else {
      c.radius = maxRadius * minRadius / 100;
    }
    
  holder.appendChild(c);
  c.setAttribute('cx' , opt.x);
  c.setAttribute('cy' , opt.y);
  c.setAttribute('r', c.radius) ;
  c.setAttribute('name', opt.name);

  return c;
}



function getPercentageOfKey(key , curr ){

  var percentage = 100 * curr[key] / maxHelper[key];

  return percentage;
}



function buildDataViz(data){
  var xmlns = "http://www.w3.org/2000/svg";
  var boxWidth = 1200;
  var boxHeight = 1200;

  var offset = {
    x : 100,
    y : 100,
  }

  var svgElem = document.createElementNS (xmlns, "svg");
      svgElem.setAttributeNS (null, "viewBox", "0 0 " + boxWidth + " " + boxHeight);
      svgElem.setAttributeNS (null, "width", boxWidth);
      svgElem.setAttributeNS (null, "height", boxHeight);

      svgElem.style.display = "block";

    document.body.appendChild(svgElem);

    var opt = {}
    
  for(key in data){

    if(key !== 'name'){
      console.log(data[key].x,data[key].y)

      opt = {
          key : statistikKey,
          x:  data[key].x + offset.x,
          y : data[key].y + offset.y,
          radius: getPercentageOfKey(statistikKey, data[key]),
          name : key
      }
      

      data[key].circle =  buildCircle(svgElem,opt);
     
    }//end of if
  }//endfor


  visualisationData = data;
}



function changeKey(targetKey){

  if(targetKey !== statistikKey){

    for(key in visualisationData){
      if(key !== 'name'){
        var initValue= visualisationData[key].circle.radius;//parseFloat(visualisationData[key].circle.getAttribute('r'));
        var targetValue = getPercentageOfKey(targetKey , visualisationData[key] );
        
        //console.log('KEY: ', statistikKey,targetKey);
        animateValues(initValue, targetValue, visualisationData[key].circle );
        visualisationData[key].circle.radius = targetValue;
        statistikKey = targetKey;

      }
    }
    

  }
}



var buttonHolder = document.getElementById('options');
options.forEach(function(o,index) {
  var btn = document.createElement('button');
      btn.name = o;
      btn.innerHTML = o;

      btn.addEventListener('click', actionButton) 

  buttonHolder.appendChild(btn);

});


function actionButton(e) {
  changeKey(this.name);
}

function animateValues(start,target, object ){


  var initValue = { 
    wert: start
  };
  var endValue = {
    wert : target
  }

  var tween = new TWEEN.Tween(initValue)
      .to(endValue, 1000)
      .onUpdate(function() {

        console.log(this.wert);
        if(this.wert >= minRadius){
         object.setAttribute('r', maxRadius * this.wert / 100 )
        }else {
          object.setAttribute('r', maxRadius * minRadius / 100 );
        }
      }).easing(TWEEN.Easing.Back.In).start();

}



// 
requestAnimationFrame(animate);

function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}






