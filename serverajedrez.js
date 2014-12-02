// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
//var manage_files = require('./managefiles.js'); TODO implementation class (refactoring code)

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  socket.on('play game', function(data){
    console.log(data);
    /*writeFile(msg);
    executeProgram();
    setTimeout( function (){
      getRespond()
      },300);*/
  });


  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

// Function manage files 
function writeFile(msg){
  var fs = require('fs');
  fs.writeFile("entrada.txt", "entrada_numero("+msg+")", function(err) {
      if(err) {
          console.log(err);
      } else {
          console.log("The file was saved!");
      }
  }); 
}

function readFile(){
  var fs = require('fs');
  var path = require('path');
  var filePath = path.join(__dirname, 'salida.txt');

  fs.readFile(filePath, {encoding: 'utf-8'}, function (err,data) {
    console.log(data);
      if (err) {
        return console.log(err);
      }else{
      console.log(data);
      }
  });
}

function getRespond(){
  var a = 1;
  var fs = require('fs');
  var path = require('path');
  var filePath = path.join(__dirname, 'salida.txt');

  fs.readFile(filePath, {encoding: 'utf-8'}, function (err,data) {
      if (err) {
        return console.log(err);
      }else{
        var mensaje = getDataByPredicate(data);
        io.emit('response factorial number', mensaje);
      }
  });
}

function getDataByPredicate(data){
  return data.split("(")[1].split(")")[0];
}

function executeProgram(){
  console.log("ejecutar programa")
  var exec = require('child_process').execFile;
  var fun =function(){
     exec('g.exe', function(err, data) {
          console.log(data.toString());                       
      });
      exec('kill.bat', function(err, data) {
          console.log("close");                       
      });  
  }
  fun();
}