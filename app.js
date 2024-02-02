 const express = require('express');
 const bodyParser = require('body-parser');
 const ejs = require('ejs');
 //const vonage = require('vonage');
 const {Vonage} = require('@vonage/server-sdk');
 const socketio = require('socket.io');

 const vonage = new Vonage({
   apiKey: "46a1159e",
   apiSecret: "kXzxNlxZ7LJX4rAE" //kXzxNlxZ7LJX4rAE
 },{debug:true});

 const app = express();


 //template engine
 app.set('view engine','html');
 app.engine('html',ejs.renderFile);

 //public folder
 app.use(express.static(__dirname + '/public'));

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended: true}));

 //index route

 app.get('/',(req,res)=>{
    res.render('index');
 });


 app.post('/',(req,res)=>{
   // res.send(req.body);
   // console.log(req.body);
   const number = req.body.number;
   const text = req.body.text;

   vonage.message.sendSms(
      '12034848525',number,text,{
         type:'unicode'
      },(err,responseData)=>{
         if(err){
            console.log(err);
         }else{
            console.dir(responseData);
            const data ={
               id : responseData.message[0]['message-id'],
               number:responseData.message[0]['to']
            }

            io.emit('smsStatus', data);
         }
      }
   )
});

 //define port

 const port =1000;

 const server = app.listen(port,()=> console.log(`server started on port ${port}`));

 // Connect to socket.io
const io = socketio(server);
io.on('connection', (socket) => {
  console.log('Connected');
  io.on('disconnect', () => {
    console.log('Disconnected');
  })
});