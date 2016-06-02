
//______________________________________ Helper functions
/**
  @argument string == string
*/
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


/**
  @argument key == number
  @argument curr == number
  @return normalize given data 
*/

function getPercentageOfKey(key , curr ){

  var percentage = 100 * curr[key] / maxHelper[key];

  return percentage;
}

/**
  @return Generate random color
*/


function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


/**
  @argument cookie name == string
  @return cookie value by name

*/

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return false;
}


//_____________________________________ Check Cookie

var visitedCookie = getCookie('visited');

console.log(visitedCookie);

if(!visitedCookie){
  animateMapIntro(function() {
    document.body.classList.add('animationFinish');
  });
}else{
  document.body.classList.add('no-animation');
  setTimeout(function() {
    document.body.classList.add('animationFinish');
  },400);
}


//_____________________________________ Variable 


var statistikKey = 'tore';
var maxHelper = {};
var maxRadius = 148;
var minRadius = 10;
var visualisationData = {};

var statistikPlayground = document.getElementById('statistikPlayground');


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

//_____________________________________ Karten Animation

function animateMapIntro(cb) {

  var mapElement = document.getElementById('map');
  var tween = new TWEEN.Tween({
    scale : 2 
  })
  .to({
    scale: 1
  }, 4400)
  .onUpdate(function() {

    mapElement.style.transform = "scale("+ this.scale + ")";
  }).onComplete(function() {

    document.cookie = "visited=true";
    cb();

  }).easing(TWEEN.Easing.Cubic.InOut).start();
}

//_____________________________________ Load external Data

var xmlhttp = new XMLHttpRequest();
var url = "assets/data/data.json";

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
    if(key !== 'name'){
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

  //console.log(dataFormat);



  buildDataViz(dataFormat);
}

//_____________________________________ Format external Data
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



//_____________________________________ Build single Circle

function buildCircle (holder,opt) {
  var c = document.createElement('div');

    holder.setAttribute('name', opt.key)

    console.log(visualisationData,[opt.key]);

    if(opt.radius >= minRadius){
      c.radius = maxRadius * opt.radius / 100;
     
    }else {
      c.radius = maxRadius * minRadius / 100;
    }
    
    c.msg = opt.msg;


  holder.appendChild(c);

   c.classList.add('bubbles');



   var backgroundImage = "background-image:url(assets/ico/" + capitalizeFirstLetter( opt.name ) + ".svg);";
   var leftProperty = "left:"+ opt.x*.1 +"%;";
   var topProperty = "top:"+ opt.y*.1 +"%;";
  // var transformOrigin = "transform-origin: 50% 50%;";

   c.setAttribute('style', 'width:'+c.radius + 'px;height:'+c.radius+'px;' + topProperty + leftProperty + backgroundImage );
  
  c.setAttribute('name', opt.name);
  c.setAttribute('id', 'bubble' + opt.name);

  return c;
}


//_____________________________________ Build complete Data Viz




function buildDataViz(data){
  var xmlns = "http://www.w3.org/2000/svg";
  var boxWidth = 1200;
  var boxHeight = 1200;

  var offset = {
    x : 66,
    y : 0,
  }


  var dataHolder = document.createElement('div');
      dataHolder.width = window.innerWidth;
      dataHolder.height = window.innerHeight;

      dataHolder.classList.add('holder');

      dataHolder.style.display = "block";

    statistikPlayground.appendChild(dataHolder);

    var opt = {}
    
    for(key in data){

      if(key !== 'name'){
        console.log(data[key].x,data[key].y)

        opt = {
            key : statistikKey,
            x:  data[key].x + offset.x,
            y : data[key].y + offset.y,
            radius: getPercentageOfKey(statistikKey, data[key]),
            name : key,
            msg : 'hallo ',
            color : getRandomColor()
        }
        
        //createBGPattern(definitionsHolder,  opt.name , opt.name );
        data[key].circle =  buildCircle(dataHolder,opt);


       
      }//end of if
    }//endfor

  visualisationData = data;
}




//_____________________________________ Change filter key for data Viz

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


//_____________________________________ Event Listener 

var inputFields = document.getElementsByClassName('filter');

for(var i=0;i<inputFields.length;i++){
    
  inputFields[i].addEventListener('click',actionButton);
  
}




// var buttonHolder = document.getElementById('options');
// options.forEach(function(o,index) {
//   var btn = document.createElement('button');
//       btn.name = o;
//       btn.innerHTML = o;

//       btn.addEventListener('click', actionButton) 

//   buttonHolder.appendChild(btn);

// });


function actionButton(e) {
  changeKey(this.id);
}
//_____________________________________ Action for change filter events 

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
          object.style.width = maxRadius * this.wert / 100  + 'px';
          object.style.height = maxRadius * this.wert / 100  + 'px';
         //object.setAttribute('r', maxRadius * this.wert / 100 )
        }else {
          object.style.width = maxRadius * minRadius / 100  + 'px';
          object.style.height = maxRadius * minRadius / 100  + 'px';
          //object.setAttribute('r', maxRadius * minRadius / 100 );
        }
      }).easing(TWEEN.Easing.Quadratic.InOut).start();

}







//_____________________________________ Loop Function

requestAnimationFrame(animate);

function animate(time) {
    requestAnimationFrame(animate)
;    TWEEN.update(time);
}













