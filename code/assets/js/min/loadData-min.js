function capitalizeFirstLetter(t){return t.charAt(0).toUpperCase()+t.slice(1)}function getPercentageOfKey(t,e){var a=100*e[t]/maxHelper[t];return a}function getRandomColor(){for(var t="0123456789ABCDEF".split(""),e="#",a=0;6>a;a++)e+=t[Math.floor(16*Math.random())];return e}function getCookie(t){for(var e=t+"=",a=document.cookie.split(";"),i=0;i<a.length;i++){for(var n=a[i];" "==n.charAt(0);)n=n.substring(1);if(0==n.indexOf(e))return n.substring(e.length,n.length)}return!1}function animateMapIntro(t){var e=document.getElementById("map"),a=new TWEEN.Tween({scale:2}).to({scale:1},4400).onUpdate(function(){e.style.transform="scale("+this.scale+")"}).onComplete(function(){document.cookie="visited=true",t()}).easing(TWEEN.Easing.Cubic.InOut).start()}function formatData(t){var e={};for(key in t[0])"name"!==key&&(e[key]={});t.forEach(function(t,a){normalizeData(t);for(key in t)"name"!==key&&("undefined"==typeof e[key][t.name]&&(e[key][t.name]={}),e[key][t.name]=t[key])}),buildDataViz(e)}function normalizeData(t){var e={},a=[];for(key in t)"name"!==key&&a.push(t[key]);var i=Math.max.apply(Math,a);for(key in t)maxHelper[t.name]=i}function buildCircle(t,e){var a=document.createElement("div");t.setAttribute("name",e.key),console.log(visualisationData,[e.key]),e.radius>=minRadius?a.radius=maxRadius*e.radius/100:a.radius=maxRadius*minRadius/100,a.msg=e.msg,t.appendChild(a),a.classList.add("bubbles");var i="background-image:url(assets/ico/"+capitalizeFirstLetter(e.name)+".svg);",n="left:"+.1*e.x+"%;",s="top:"+.1*e.y+"%;";return a.setAttribute("style","width:"+a.radius+"px;height:"+a.radius+"px;"+s+n+i),a.setAttribute("name",e.name),a.setAttribute("id","bubble"+e.name),a}function buildDataViz(t){var e="http://www.w3.org/2000/svg",a=1200,i=1200,n={x:66,y:0},s=document.createElement("div");s.width=window.innerWidth,s.height=window.innerHeight,s.classList.add("holder"),s.style.display="block",statistikPlayground.appendChild(s);var o={};for(key in t)"name"!==key&&(console.log(t[key].x,t[key].y),o={key:statistikKey,x:t[key].x+n.x,y:t[key].y+n.y,radius:getPercentageOfKey(statistikKey,t[key]),name:key,msg:"hallo ",color:getRandomColor()},t[key].circle=buildCircle(s,o));visualisationData=t}function changeKey(t){if(t!==statistikKey)for(key in visualisationData)if("name"!==key){var e=visualisationData[key].circle.radius,a=getPercentageOfKey(t,visualisationData[key]);animateValues(e,a,visualisationData[key].circle),visualisationData[key].circle.radius=a,statistikKey=t}}function actionButton(t){changeKey(this.id)}function animateValues(t,e,a){var i={wert:t},n={wert:e},s=new TWEEN.Tween(i).to(n,1e3).onUpdate(function(){console.log(this.wert),this.wert>=minRadius?(a.style.width=maxRadius*this.wert/100+"px",a.style.height=maxRadius*this.wert/100+"px"):(a.style.width=maxRadius*minRadius/100+"px",a.style.height=maxRadius*minRadius/100+"px")}).easing(TWEEN.Easing.Quadratic.InOut).start()}function animate(t){requestAnimationFrame(animate),TWEEN.update(t)}var visitedCookie=getCookie("visited");console.log(visitedCookie),visitedCookie?(document.body.classList.add("no-animation"),setTimeout(function(){document.body.classList.add("animationFinish")},400)):animateMapIntro(function(){document.body.classList.add("animationFinish")});var statistikKey="tore",maxHelper={},maxRadius=148,minRadius=10,visualisationData={},statistikPlayground=document.getElementById("statistikPlayground"),options=["tore","gegentore","spielanzahl","alter","rot","gelb","qualifikationen","marktwert","kader","punkte","siege","gastgeber","twitter","landsize"],xmlhttp=new XMLHttpRequest,url="assets/data/data.json";xmlhttp.onreadystatechange=function(){if(4==xmlhttp.readyState&&200==xmlhttp.status){var t=JSON.parse(xmlhttp.responseText);formatData(t[0])}},xmlhttp.open("GET",url,!0),xmlhttp.send();for(var inputFields=document.getElementsByClassName("filter"),i=0;i<inputFields.length;i++)inputFields[i].addEventListener("click",actionButton);requestAnimationFrame(animate);