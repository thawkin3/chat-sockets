var express = require('express');
var router = express.Router();
// var http = require('http').Server(express);
// var io = require('socket.io')(http);

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.io.emit("userConnected", "a new user has connected!");
  res.sendFile('index.html', { root:  'public' });
});

/* Socket.io connection */
// io.on('connection', function (socket) {
//   console.log("a user has connected!");
//   socket.on('chat message', function (msg) {
//     io.emit('chat message', msg);
//   });
// });

module.exports = router;
