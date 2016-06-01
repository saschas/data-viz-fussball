
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function helperFunction(svg){

    //__________________ JSON aus der Console heraus exportieren

    (function(console){

    console.save = function(data, filename){

        if(!data) {
            console.error('Console.save: No data')
            return;
        }

        if(!filename) filename = 'console.json'

        if(typeof data === "object"){
            data = JSON.stringify(data, undefined, 4)
        }

        var blob = new Blob([data], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')

        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
     }
    })(console);

    //__________________ Variablen


    var mouse = {
        x : 0,
        y : 0,
        active : false,
        scale : {
            x : 0,
            diff : 0,
            bool : false
        }
    }


    //var svgElement = document.getElementsByTagName('svg');
    var getInfoButton = document.getElementById('getInfo');
    var countries = svg.getElementsByClassName('bubbles');

    console.log(svg,svg.getElementsByTagName('circle'));

    //__________________ Download data



    getInfoButton.addEventListener('click',function(){
        getInfo();
    });



    function getInfo(){
        var landInfo = [];
        for(var i=0;i<countries.length;i++){

          console.log(countries[i]);

          landInfo.push({
            name : countries[i].id,
            x : countries[i].style.left , // parseFloat(countries[i].getAttribute('cx')),
            y : countries[i].style.top , // parseFloat(countries[i].getAttribute('cy')),
            radius: countries[i].style.width //parseFloat(countries[i].getAttribute('r')),
          });
        }

        console.save(landInfo);

    }
    //__________________ Variablen

    window.addEventListener('keydown',function(e){
        if (e.altKey) {
            console.log("The ALT key was pressed!");
            mouse.scale.bool = true;
        } 
    });

    window.addEventListener('keyup',function(e){
        
            mouse.scale.bool = false;
            mouse.activeEl = null;
        
    });



    window.addEventListener('mousedown',function(e){


        if(e.target.classList.contains('bubbles')){
            mouse.activeEl = e.target;

            if(mouse.scale.bool){
                mouse.active= false;
                mouse.scale.x = e.pageX;
                mouse.scale.y = e.pageY;
            }else{
                //console.log(mouse.active,e.target);
                mouse.active= true;
                
            }
        }


    });


    window.addEventListener('mousemove',function(e){
        mouse.x = e.pageX;
        mouse.y = e.pageY;

        if(mouse.scale.bool){
            mouse.scale.diff = e.pageX - mouse.scale.x;

            mouse.activeEl.style.width =  mouse.scale.diff+'%';// setAttribute('r', mouse.scale.diff);
        }
        if(mouse.active){
          mouse.activeEl.style.top = mouse.x + '%';
          mouse.activeEl.style.left = mouse.y + '%';
            //mouse.activeEl.setAttribute('cx',mouse.x);
            //mouse.activeEl.setAttribute('cy',mouse.y);
        }
    });

    window.addEventListener('mouseup',function(e){

        mouse.active= false;
        mouse.activeEl = null;
        
    });
}

//_____________________________________ Helper 


var statistikKey = 'tore';
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
  //var c = document.createElementNS("http://www.w3.org/2000/svg","circle");
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
  //c.setAttribute('cx' , opt.x);
  //c.setAttribute('cy' , opt.y);
  //c.setAttribute('r', c.radius) ;
  //c.setAttribute('fill' , opt.color);
   // c.setAttribute('name', opt.name);

   c.classList.add('bubbles');

   var backgroundImage = "background-image:url(assets/ico/" + capitalizeFirstLetter( opt.name ) + ".svg);";
   c.setAttribute('style', 'position:absolute;top:'+ opt.y * .1+'%;' + backgroundImage +'left:'+ opt.x*.1 +'%;transform: translateX(-50%) translateY(-50%); width:'+c.radius + 'px;height:'+c.radius+'px;');
  //c.setAttribute('translateX' , opt.x);
  //c.setAttribute('translateY' , opt.y);
  //c.setAttribute('width', c.radius) ;
  //c.setAttribute('height', c.radius) ;
  //c.setAttribute('background-image' , opt.color);
  c.setAttribute('name', opt.name);

  return c;
}



function getPercentageOfKey(key , curr ){

  var percentage = 100 * curr[key] / maxHelper[key];

  return percentage;
}


// function createBGPattern(holder,name, bgImageSrc){
//   var pattern = document.createElementNS (xmlns, "pattern");

//       pattern.setAttributeNS (null, "patternUnits", 'userSpaceOnUse');
//       pattern.setAttributeNS (null, "width", '100');
//       pattern.setAttributeNS (null, "height", '100');
//       pattern.setAttributeNS (null, "id", name);

//   var image = document.createElementNS (xmlns, "image");

//       image.setAttributeNS (null, "xlink:href=", bgImageSrc + '.svg');
//       image.setAttributeNS (null, "x", '0');
//       image.setAttributeNS (null, "y", '0');

//       image.setAttributeNS (null, "width", '100');
//       image.setAttributeNS (null, "height", '100');


//       pattern.appendChild(image);


// }

// <defs>
//   <pattern id="img1" patternUnits="userSpaceOnUse" width="100" height="100">
//     <image xlink:href="wall.jpg" x="0" y="0" width="100" height="100" />
//   </pattern>
// </defs>




function buildDataViz(data){
  var xmlns = "http://www.w3.org/2000/svg";
  var boxWidth = 1200;
  var boxHeight = 1200;

  var offset = {
    x : 100,
    y : 100,
  }


  var svgElem = document.createElement('div');
      svgElem.width = window.innerWidth;
      svgElem.height = window.innerHeight;

      svgElem.classList.add('holder');

 //var svgElem = document.createElementNS (xmlns, "svg");
 //    svgElem.setAttributeNS (null, "viewBox", "0 0 " + boxWidth + " " + boxHeight);
 //    svgElem.setAttributeNS (null, "width", boxWidth);
 //    svgElem.setAttributeNS (null, "height", boxHeight);

      svgElem.style.display = "block";

    document.body.appendChild(svgElem);

  //var definitionsHolder = document.createElementNS (xmlns, "defs");
  //    svgElem.appendChild(definitionsHolder);

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
      data[key].circle =  buildCircle(svgElem,opt);


     
    }//end of if
  }//endfor


  helperFunction(svgElem);

  visualisationData = data;
}


function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
          object.style.width = maxRadius * this.wert / 100  + 'px';
          object.style.height = maxRadius * this.wert / 100  + 'px';
         //object.setAttribute('r', maxRadius * this.wert / 100 )
        }else {
          object.style.width = maxRadius * minRadius / 100  + 'px';
          object.style.height = maxRadius * minRadius / 100  + 'px';
          //object.setAttribute('r', maxRadius * minRadius / 100 );
        }
      }).easing(TWEEN.Easing.Back.In).start();

}



// 
requestAnimationFrame(animate);

function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}






