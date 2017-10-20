var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socket_io = require('socket.io');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(function(req, res, next){
  res.io = io;
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// socket.io events
var messageData = [];
var users = [];
var colors = [
  "#ff0000", "#a64200", "#7fbf00", "#00736b", "#265499", 
  "#ac39e6", "#7f0044", "#f20000", "#66421a", "#611a66", 
  "#bf8fa3", "#b27700", "#397339", "#3d6df2", "#ffbffb", 
  "#ff408c", "#e58273", "#001499", "#b359a1", "#e5003d",
  "#10401d", "#297ca6", "#a3a3d9", "#f200c2", "#7f4048", 
  "#2000f2", "#ff8c40", "#f2e200", "#40a6ff"
];

function updateMessageHistory (messageHistory, newMessage) {
  messageHistory.push(newMessage);
  if (messageHistory.length > 50) {
    messageHistory.shift();
  }
  return messageHistory;
}

io.on('connection', function (socket) {
  io.emit("userConnected", "a new user has connected!");

  socket.on('userJoinedChatroom', function (data) {
    messageData = updateMessageHistory(messageData, data);
    var assignedColor = colors.length > 0 ? colors.splice(Math.floor(Math.random()*colors.length), 1)[0] : "#000000";
    users.push({ id: socket.id, username: data.message.split(" has joined the chatroom")[0], nameColor: assignedColor });
    socket.broadcast.emit('userJoinedChatroom', data);
    io.to(socket.id).emit('colorAssignment', assignedColor);
    io.to(socket.id).emit('youJoinedChatroom', messageData);
  });

  socket.on('sendMessage', function (data) {
    messageData = updateMessageHistory(messageData, data);
    io.emit('receiveMessage', data);
  });

  socket.on('iAmTyping', function (data) {
    socket.broadcast.emit('someoneIsTyping', data);
  });

  socket.on('iAmNotTyping', function (data) {
    socket.broadcast.emit('someoneIsNotTyping', data);
  });

  socket.on('userLeftChatroom', function (data) {
    disconnectOrLeftHelper(data);
  });

  socket.on('disconnect', function (data) {
    disconnectOrLeftHelper(data);
  });

  function disconnectOrLeftHelper (data) {
    var disconnectedUser = "Someone";
    for (var i = 0; i < users.length; i++) {
      if (users[i].id == socket.id) {
        disconnectedUser = users[i].username;
        console.log(disconnectedUser + "is disconnected");
        colors.push(users[i].nameColor);
        users.splice(i, 1);

        var myData = {
          username: "Chatroom",
          message: disconnectedUser + " has left the chatroom",
          nameColor: "#606060"
        }
        messageData = updateMessageHistory(messageData, myData);
        io.emit('userDisconnected', myData);

        break;
      }
    }
  }

});

module.exports = { app: app, server: server };
