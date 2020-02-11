/* This script requires a companion node server to be running. More info can be found here: https://github.com/jscrip/metaCrawlerRemoteStorage
/
(async function(){
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
var delay = (seconds) => new Promise((resolves) => {
	setTimeout(resolves, seconds*1000)
})
var links = new Set();
var docs = [];
var crawled = new Set();
var crawlLimit = 1000;
function getLinks(doc){
 [...doc.querySelectorAll("a")].forEach(function(a){
  a.href ? links.add(a.href.split("#")[0]) : null;
 })
}
async function parseDoc(response){
 var htmlString = await response.text();
 var parser = new DOMParser();
 return parser.parseFromString(htmlString, "text/html");
}
await getLinks(document);
var linkIterator = links.values();
for await (var link of linkIterator){

      try{
      if(link.indexOf(window.location.origin) > -1){
      var wait = getRandomInt(5)+((1/getRandomInt(100)+1.01));
      await console.log(`Waiting ${Math.round(wait*100)/100} seconds`)
      await delay(wait);
      await console.log(`Resuming...`);
		var response = await fetch(link);
		if (response.status == 200) {
			crawled.add(link);
			var doc = await parseDoc(response);
            var {type,url,status,ok,redirected} = response;
      var d = JSON.parse(JSON.stringify({type,url,status,ok,redirected,title:doc.title}));
       var payload = Object.keys(d).reduce((str,key,i) => {
	return str + ""+(i == 0 ? `` : `&`)+`${key}=${encodeURI(d[key])}`;
},"http://localhost:3000/addlink?")
console.log(payload)
var r = await fetch(payload);
 await delay(0.2);
var collection = await r.json();
console.log({collection});
            docs.push(d);
			await getLinks(doc);
		} 
		else {console.log("ERROR: Server returned status:", response.status);} //end if/else response.status == 200
	  } //end if window.location.origin
      }catch(err){console.log({err})}
      crawled.size % 10 == 0 ? console.log({crawlLimit,crawled:crawled.size}) : null; //log progess every 10 links
      if(crawlLimit <= crawled.size){break}
   }
 console.log({links,docs})


})()
