const express = require('express')
var cors = require('cors')
const fs = require('fs').promises;
const app = express()
app.use(cors())
app.options('*', cors())
const port = 3000

app.use('/public', express.static('public'))

app.use('/data', express.static('data'))

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/addlink', async (req, res) => {
  var props = Object.keys(req.query);
  var url = req.query.url;
  var domain = url.split("//").length > 1 ? url.split("//")[1].split("/")[0] : url.length > 0 ? url : "domainDetectionError";
  var collection = req.query.collection ? req.query.collection : domain;

  var newData = JSON.stringify(req.query);
  try{
    var fileString = await fs.readFile(`./data/${collection}.json`, 'utf8');
    var parsedFile = JSON.parse("["+fileString.slice(0,-2)+"]");
  //  console.log({parsed:parsedFile, stringify:JSON.stringify(parsedFile)})
    var matchedURL = parsedFile.find(item => item.url == url);
    if(!matchedURL){
        await fs.appendFile(`./data/${collection}.json`, newData+",\n");
        parsedFile.push(req.query)
    }
  }catch(e){
      console.log("ERRRRORRORORORR",e);
      await fs.appendFile(`./data/${collection}.json`, newData+",\n");
      var fileString = await fs.readFile(`./data/${collection}.json`, 'utf8');
      var parsedFile = JSON.parse("["+fileString.slice(0,-2)+"]");
  }
res.json(parsedFile)

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
