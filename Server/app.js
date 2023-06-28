var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const verify = require("./routes/verify")
const auth = require("./routes/auth")
const tech = require("./routes/tech")
const manage = require("./routes/mangeData")
const cors = require("cors");
const http = require("http")
app.use(bodyParser.urlencoded({
    extended:true
}))

app.use(express.static('public')); 
app.use('/images', express.static('images'));
app.use(cors());

const server = http.createServer(app);
app.use(express.json())
app.get('/test',verify,(req,res)=>{
    res.send(req.user)
})
app.use('/auth',auth)
app.use('/api/user',verify,manage)

app.get('/',(req,res)=>{
    return res.send({error:true,message:"SUCCESS"})
})
app.use('/tech',tech)

app.listen(3000,()=>{
    console.log("Node app is running on port 3000")
})

module.exports = app;