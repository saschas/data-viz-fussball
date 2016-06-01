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


var svgElement = document.getElementsByTagName('svg');
var getInfoButton = document.getElementById('getInfo');
var countries = svgElement[0].getElementsByTagName('circle');



getInfoButton.addEventListener('click',function(){
    getInfo();
});
function getInfo(){
    var landInfo = [];
    for(var i=0;i<countries.length;i++){

    	console.log(countries[i]);

    	landInfo.push({
    		name : countries[i].id,
    		x : parseFloat(countries[i].getAttribute('cx')),
    		y : parseFloat(countries[i].getAttribute('cy')),
            radius: parseFloat(countries[i].getAttribute('r')),
    	});
    }

    console.save(landInfo);

}
//

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

    if(e.target.hasAttribute('r')){
        mouse.activeEl = e.target;

        if(mouse.scale.bool){
            mouse.active= false;
            mouse.scale.x = e.pageX;
            mouse.scale.y = e.pageY;
        }else{
            console.log(mouse.active,e.target);
            mouse.active= true;
            
        }
    }


});


window.addEventListener('mousemove',function(e){
    mouse.x = e.pageX;
    mouse.y = e.pageY;

    if(mouse.scale.bool){
        mouse.scale.diff = e.pageX - mouse.scale.x;
        var curr = mouse.activeEl.getAttribute('r')
        console.log(parseFloat(curr),mouse.activeEl.getAttribute('r') ) ;
        mouse.activeEl.setAttribute('r', mouse.scale.diff);
    }
    if(mouse.active){
        mouse.activeEl.setAttribute('cx',mouse.x);
        mouse.activeEl.setAttribute('cy',mouse.y);
    }
});

window.addEventListener('mouseup',function(e){

    mouse.active= false;
    mouse.activeEl = null;
    
});