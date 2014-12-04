// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var player_prolog_program = "vendorprolog/player.EXE";
var machine_prolog_program = "machine.EXE";
var salida_with_data = "entrada.txt"
var entrada_validate = "salida.txt";
var entrada_state_game = "estadojuego.txt";
var entrada_state_muerte = "muerte.txt";
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
    writeFile(salida_with_data,formatEntrada(data));
    if (data.player == "player"){
      console.log("executePlayerProgram");
       executePlayerProgram();
    }else{
      console.log("executePlayerProgram");
       executeMachineProgram();
    }
    setTimeout( function (){
      //reviewMotion(socket,data)
      readFile(socket,data,entrada_validate,"is_validate");
    },300);
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

  socket.on('move element to all', function(data){
    console.log(data);
     socket.broadcast.emit('move piece in table',data);
  });

  socket.on('dead element to all',function(data){
     socket.broadcast.emit('dead element in table',data);
  });

  socket.on('end game to all',function(data){
      socket.broadcast.emit('end game in table',data);
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

function socketSuccessMotion(socket, data){
  console.log("enviando data al cliente que su movimiento estubo BIEN");
  socket.emit('move piece',{
    type : data.type4,
    x: data.xf4,
    y: data.yf4
  });
}

function socketBadMotion(socket) {
  console.log("enviando data al cliente que su movimiento estubo MAL");
  socket.emit('bad motion')
}

function socketDeadPiece(socket,piece){
  console.log("enviando data al cliente que su movimiento MATO A UNA PIEZA ES = "+piece);
  socket.emit('dead piece',{
    type : piece
  });
}

function socketEndGame(socket,winner){
  console.log("enviando data al cliente que gano la partida ES = " + winner );
  socket.emit('end game',{
    winner : winner
  });
}

function reviewMotion(socket,data_json,data){
  var is_validate = getDataByPredicate(data);
  console.log("is_validate = "+is_validate);
  if (is_validate == "\"true\""){
    console.log("jugada valida");
    socketSuccessMotion(socket, data_json);
    console.log("leyendo archivo si hay muertes ")
    readFile(socket,data_json,entrada_state_muerte,"is_dead");
  }else{
    console.log("jugada invalida");
    socketBadMotion(socket);
    console.log("setear null a los archivos muerte y estado de juego")
    writeFile(entrada_state_muerte,"muerte('null')") 
    writeFile(entrada_state_game,"estadojuego('null')")
  }
}

function reviewDeadPiece(socket,data_json,data){
  var is_dead = getDataByPredicate(data);
  console.log("is_dead = "+is_dead);
  if (is_dead != 'null'){
    console.log("hubo un muerto ");
    socketDeadPiece(socket,is_dead.split(",")[2]); //TO-DO implement emit there some deads
    // TO - DO changed return data of prolog
    console.log("leyendo archivo si hay ganador ")
    readFile(socket,data_json,entrada_state_game,"is_winner");
  }else{
    console.log("setear null a los archivos muerte y estado de juego")
    writeFile(entrada_state_muerte,"muerte('null')") 
    writeFile(entrada_state_game,"estadojuego('null')")
  }
}

function reviewStatusGame(socket,data_json,data) {
  var is_winner =  getDataByPredicate(data);
  console.log("is_winner = "+is_winner);
  if (is_winner != 'null'){
    console.log("hubo un ganador")
    socketEndGame(socket, is_winner);
  }
  console.log("setear null a los archivos muerte y estado de juego")
  writeFile(entrada_state_muerte,"muerte('null')") 
  writeFile(entrada_state_game,"estadojuego('null')")
}

// Function manage files 
function writeFile(file,msg){
  var fs = require('fs');
  fs.writeFile(file, msg, function(err) {
      if(err) {
          console.log(err);
      } else {
          console.log("The file was saved!");
      }
  }); 
}

function readFile(socket,data_json,file,type_review){
  var text=null;
  var fs = require('fs');
  var path = require('path');
  var filePath = path.join(__dirname, file);
  fs.readFile(filePath, {encoding: 'utf-8'}, function (err,data) {
      if (err) {
      }else{
        switch (type_review){
          case 'is_validate':
            reviewMotion(socket,data_json,data);
            break;
          case 'is_dead':
            reviewDeadPiece(socket,data_json,data)
            break;
          case 'is_winner':
            reviewStatusGame(socket,data_json,data)
            break;
        }
      }
  });
}

function getDataByPredicate(data){
  console.log(data);
  return data.split("(")[1].split(")")[0];
}

function executePlayerProgram(){
  console.log("execute prolog player")
  var exec = require('child_process').execFile;
  var fun =function(){
     exec(player_prolog_program, function(err, data) {
          console.log(data.toString());                       
      });
      exec('vendorprolog/killPlayer.bat', function(err, data) {
          console.log("cerrando executePlayerProgram");                       
      });  
  }
  fun();
}

function executeMachineProgram(){
  console.log("execute prolog machine")
  var exec = require('child_process').execFile;
  var fun =function(){
     exec(machine_prolog_program, function(err, data) {
          console.log(data.toString());                       
      });
      exec('killMachine.bat', function(err, data) {
          console.log("cerrando executeMachineProgram");                       
      });  
  }
  fun();
}


function formatEntrada(data){
    return "entrada(\""+data.type1+"\","+data.x1+","+data.y1+",\""+data.type2+"\","+data.x2+","+data.y2+",\""+data.type3+"\","+data.x3+","+data.y3+",\""+data.turnB+"\",\""+data.turnA+"\",\""+data.isOn1+"\",\""+data.isOn2+"\",\""+data.isOn3+"\",\""+data.type4+"\","+data.x4+","+data.y4+","+data.xf4+","+data.yf4+")";
}