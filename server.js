// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var mongoose=require('mongoose');
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));


// Connect to the database
mongoose.connect('mongodb://test:test@ds117956.mlab.com:17956/image_search')

// create a schema
var latest=new mongoose.Schema({
    query:String
})

var recent=mongoose.model('recent',latest);

// using request model to get data from imgur api
var request=require('request')


app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// out latest seraches
app.get('/latest',function(req,res){

    recent.find({},function(err,data){
        if(err){console.log(err)}
        res.send(data)
    })

})


app.get('/search/:value',function(req,res){

var options={
  url:'https://api.imgur.com/3/gallery/search/1?q='+req.params.value,
  headers:{
    Authorization:"Client-ID ae63041e2274e37"
  }
}
  
if (typeof req.query.offset === "undefined" || req.query.offset === null) { 
  var end=10;
}else{
  var end=req.query.offset
}


request(options,function(request,resp,body){

  
  var imgList=[]
//   spent a lot a time,when i coudlnt access data value,you need to parse data from api so that you can use it as json object,keep in mind
  var data=JSON.parse(body).data

  console.log(end)

  for(var i=0;i<=end;i++){
    var dummy=data[i];
    
    
    var filterdata={id:dummy.id,
                title:dummy.title,
                height:dummy.cover_height,
                width:dummy.cover_width,
                link:dummy.link};
    

    imgList.push(filterdata)

  }
  res.send(imgList)


})


var newSearch=recent({query:req.params.value}).save(function(err,data){
    if(err){console.log(err)}
    console.log("item saved")
})


})




// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

