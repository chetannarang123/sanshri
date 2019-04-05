var express = require('express');
//var SwaggerExpress = require('swagger-express-mw');
//var path = require('path')
const fileUpload = require('express-fileupload');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var config = require("./config/database_config/database")
var bodyParser = require('body-parser');
var http = require('http');
var api = require("./controller/api");
message = require("./models/message.js");
ROOMS = require("./models/rooms");
mongoose.set('useCreateIndex', true);
//init database
mongoose.connect(config.database, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("we are connected to database")
});

//json pattern
jsonPattern = require('./json/jsonPattern');
jsonResponses = require('./json/jsonResponses');
customConfig = require('./config/custom_config/customConfig');

//validations init
validations = require('./validations/validations');

//init app
var app = express();


//setting up path
app.use(express.static(__dirname + '/public'));
//file upload
app.use(fileUpload());
// Body Parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

app.set('view engine', 'ejs');

//body parser init
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(customConfig.jsonSuccessCode).json({});
    }
    next();
  });


//Set routes
var user = require('./routes/user');
app.use('/user',user)
var hostel = require('./routes/hostel');
app.use('/hostel',hostel)
var store = require('./routes/stores');
app.use('/store',store)
var mess = require('./routes/mess');
app.use('/mess',mess)
var search = require('./routes/search');
app.use('/search',search)
var product = require('./routes/product');
app.use('/product',product)
var subscription = require('./routes/subscription');
app.use('/subscription',subscription)
var cart = require('./routes/cart');
app.use('/cart',cart)
var global_data = require('./routes/global_data');
app.use('/global_data',global_data)
var chat = require('./routes/chat');
app.use('/chat',chat)
var admin_login_route = require("./routes/admin_login_routes");
app.use("/admin_login",admin_login_route);
var dashboard_route= require("./routes/dashboard_routes");
app.use("/dashboard",dashboard_route);

// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
app.get('/admin-panel', function(req, res){
  res.render('admin_panel/admin_login.ejs',{msg:""});
});


// });
// var user_subscription = require('./routes/user_subscription');
// app.use('/user_subscription',user_subscription)

//setting error handler


// Start the server
// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });

var httpServer = http.createServer(app).listen(3000, function () {
  console.log('Express server listening on port.. ' + 3000);
});

var users = {};
var name = '';

app.get('/:name', function(req, res){
  name = req.params.name;
  res.render('admin_panel/chat.ejs');
});

io = require('socket.io')(httpServer);
// socket
io.sockets.on("connection", function(socket){
  users[socket.id] = name;
  // node
  socket.on("nRoom", function(room){
      socket.join(room);
      socket.broadcast.in(room).emit("node new user", users[socket.id] + " new user has joined");
  });

  socket.on("node new message", function(data){
      io.sockets.in("nRoom").emit('node news', users[socket.id] + ": "+ data);
  });


});
// io.on('connection', function(socket){
//   console.log('a user connected');
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// });
  // Set socket.io listeners.

//   io = require('socket.io').listen(httpServer);
// io.on('connection', (socket) => {

// console.log('user connected')

// socket.on('join', function(userNickname) {

//         console.log(userNickname +" : has joined the chat "  );

//         socket.broadcast.emit('userjoinedthechat',userNickname +" : has joined the chat ");
//     })


// socket.on('messagedetection', (senderNickname,messageContent) => {

//        //log the message in console 

//        console.log(senderNickname+" : " +messageContent)

//       //create a message object 

//       let  message = {"message":messageContent, "senderNickname":senderNickname}

//        // send the message to all users including the sender  using io.emit() 

//       io.emit('message', message )

//       })

// socket.on('disconnect', function(userNickname) {

//         console.log(userNickname +' has left ')

//         socket.broadcast.emit( "userdisconnect" ,' user has left')
//     })

// })

io = require('socket.io')(httpServer);
io.on("connection", function (socket) {
  console.log('a user connected');
    socket.on("socketFromClient", function (msg) {
        if(msg.roomId==undefined||msg.roomId==""){ 
            socket.join(msg.roomId);
        }
//-----------------------------------------------------------------------------CHAT        
        if (msg.methodName && msg.methodName == "chat") {
            api.chat(msg, function (err, response) {
                if (response) {
                    //ADDING SOCKET TO ROOM MADE
                    if(response.roomId==undefined||response.roomId==""){

                        console.log(response.data.roomId)
                        socket.join(response.data.roomId);
                    }
                } else if (err) {
                  console.log('eeerrr')
                    // responseObj['message'] = err;
                    return socket.emit('responseFromServer', err);
                }
                //notify sender about the message has been sent or not
               // console.log(response)
                io.sockets.in(response.data.roomId).emit('responseFromServer', response);
            });
        }
//------------------------------------------------------------------------------ISTYPING
        if(msg.methodName && msg.methodName == "isTyping"){
            console.log("In IsTyping");

            io.sockets.broadcast.to(msg.roomId).emit('responseFromServer', msg);
        }
//------------------------------------------------------------------------------ONLINE ENABLE
if (msg.methodName && msg.methodName == "online_enable") {
    api.online_enable(msg, function (err, response) {
        if (response) {
          
            socket.emit('Online enabled')
            
        } else if (err) {
            
            return socket.emit(err);
        }
        
    });
}

    });
});
  // io = require('socket.io')(httpServer);
  // io.on('connection', (socket) => {
  //   console.log('a user connected');

  //   // On conversation entry, join broadcast channel
  //   socket.on('enter conversation', (conversation) => {
  //     socket.join(conversation);
  //     console.log('joined ' + conversation);
  //   });

  //   socket.on('leave conversation', (conversation) => {
  //     socket.leave(conversation);
  //     console.log('left ' + conversation);
  //   })

  //   socket.on('new message', (conversation) => {
  //     io.sockets.in(conversation).emit('refresh messages', conversation);
  //     });

  //   socket.on('disconnect', () => {
  //     console.log('user disconnected');
  //   });
  // });

  module.exports = app;

 
  app.use(function(err, req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || customConfig.internalServerErrorCode);
    res.json(jsonResponses.response(err.status || customConfig.internalServerErrorCode,res.locals.message,null));
  
  });

