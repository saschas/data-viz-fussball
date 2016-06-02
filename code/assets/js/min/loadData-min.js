function capitalizeFirstLetter(e){return e.charAt(0).toUpperCase()+e.slice(1)}function getPercentageOfKey(e,t){var a=100*t[e]/maxHelper[e];return a}function getRandomColor(){for(var e="0123456789ABCDEF".split(""),t="#",a=0;6>a;a++)t+=e[Math.floor(16*Math.random())];return t}function getCookie(e){for(var t=e+"=",a=document.cookie.split(";"),i=0;i<a.length;i++){for(var n=a[i];" "==n.charAt(0);)n=n.substring(1);if(0==n.indexOf(t))return n.substring(t.length,n.length)}return!1}function animateMapIntro(e){var t=document.getElementById("map"),a=new TWEEN.Tween({scale:2}).to({scale:1},4400).onUpdate(function(){t.style.transform="scale("+this.scale+")"}).onComplete(function(){document.cookie="visited=true",e()}).easing(TWEEN.Easing.Cubic.InOut).start()}function formatData(e){var t={};for(key in e[0])"name"!==key&&(t[key]={});e.forEach(function(e,a){normalizeData(e);for(key in e)"name"!==key&&("undefined"==typeof t[key][e.name]&&(t[key][e.name]={}),t[key][e.name]=e[key])}),buildDataViz(t)}function normalizeData(e){var t={},a=[];for(key in e)"name"!==key&&a.push(e[key]);var i=Math.max.apply(Math,a);for(key in e)maxHelper[e.name]=i}function buildCircle(e,t){var a=document.createElement("div");e.setAttribute("name",t.key),console.log(visualisationData,[t.key]),t.radius>=minRadius?a.radius=maxRadius*t.radius/100:a.radius=maxRadius*minRadius/100,a.msg=t.msg,e.appendChild(a),a.classList.add("bubbles");var i="background-image:url(assets/ico/"+capitalizeFirstLetter(t.name)+".svg);",n="left:"+.1*t.x+"%;",s="top:"+.1*t.y+"%;";return a.setAttribute("style","width:"+a.radius+"px;height:"+a.radius+"px;"+s+n+i),a.setAttribute("name",t.name),a.setAttribute("id","bubble"+t.name),a.addEventListener("mouseenter",getSetDataInfo),a}function getSetDataInfo(e){console.log(this.msg);var t=document.createElement("h2"),a=document.createElement("h3");countrieInfo.innerHTML="<h2>"+this.msg.anzeigename+"</h2><h3>"+this.msg.absolute+"</h3>"}function buildDataViz(e){var t="http://www.w3.org/2000/svg",a=1200,i=1200,n={x:0,y:0},s=document.createElement("div");s.width=window.innerWidth,s.height=window.innerHeight,s.classList.add("holder"),s.style.display="block",statistikPlayground.appendChild(s);var o={};for(key in e)"name"!==key&&(console.log(e[key].x,e[key].y),o={key:statistikKey,x:e[key].x+n.x,y:e[key].y+n.y,radius:getPercentageOfKey(statistikKey,e[key]),name:key,msg:{absolute:e[key][statistikKey],anzeigename:e[key].anzeigename},color:getRandomColor()},e[key].circle=buildCircle(s,o));visualisationData=e}function changeKey(e){if(e!==statistikKey)for(key in visualisationData)if("name"!==key){var t=visualisationData[key].circle.radius,a=getPercentageOfKey(e,visualisationData[key]);animateValues(t,a,visualisationData[key].circle),visualisationData[key].circle.radius=a,statistikKey=e,infoBox.dataset.currentfilter=statistikKey}}function actionButton(e){changeKey(this.id)}function animateValues(e,t,a){var i={wert:e},n={wert:t},s=new TWEEN.Tween(i).to(n,1e3).onUpdate(function(){console.log(this.wert),this.wert>=minRadius?(a.style.width=maxRadius*this.wert/100+"px",a.style.height=maxRadius*this.wert/100+"px"):(a.style.width=maxRadius*minRadius/100+"px",a.style.height=maxRadius*minRadius/100+"px")}).easing(TWEEN.Easing.Quadratic.InOut).start()}function animate(e){requestAnimationFrame(animate),TWEEN.update(e)}var visitedCookie=getCookie("visited");console.log(visitedCookie),visitedCookie?(document.body.classList.add("no-animation"),setTimeout(function(){document.body.classList.add("animationFinish")},400)):animateMapIntro(function(){document.body.classList.add("animationFinish")});var statistikKey="nationen",maxHelper={},maxRadius=148,minRadius=10,visualisationData={},infoBox=document.getElementById("infoBox"),countrieInfo=document.getElementById("countrieInfo"),logo=document.getElementById("nationen"),statistikPlayground=document.getElementById("statistikPlayground"),options=["tore","gegentore","spielanzahl","alter","rot","gelb","qualifikationen","marktwert","kader","punkte","siege","gastgeber","twitter","nationen"],xmlhttp=new XMLHttpRequest,url="assets/data/data.json";xmlhttp.onreadystatechange=function(){if(4==xmlhttp.readyState&&200==xmlhttp.status){var e=JSON.parse(xmlhttp.responseText);formatData(e[0])}},xmlhttp.open("GET",url,!0),xmlhttp.send();for(var inputFields=document.getElementsByClassName("filter"),i=0;i<inputFields.length;i++)inputFields[i].addEventListener("click",actionButton);logo.addEventListener("click",actionButton),requestAnimationFrame(animate);