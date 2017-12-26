//socket.io
//引入並且建立物件的動作
var express = require('express');
var app = require('express')();     // 建立 express 物件
var http = require('http').Server(app); // 引入 http 模組
var io = require('socket.io')(http);  

//
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes');

//引入先前的mysql connect
var config = require("./mysql_connect.js");
var db = config.db;


/*
var index = require('./routes/index');
var student = require('./routes/student');
var users = require('./routes/users');
*/


// view engine setup


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(app.router);

//routes(app);
/*
app.get('/', routes.index);
app.get('/student', routes.student);
app.get('/teacher', routes.teacher);
*/

//router
app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});
app.get('/student', function(req, res){
  res.sendFile(__dirname + '/views/student.html');
});
app.get('/teacher', function(req, res){
  res.sendFile(__dirname + '/views/teacher.html');
});
app.get('/registerT', function(req, res){
  res.sendFile(__dirname + '/views/registerT.html');
});
app.get('/mysql_connect', function(req, res){
  res.sendFile(__dirname + '/js/mysql_connect.js');
});

//mongodb

/*db.query("SELECT * FROM teacher", function(err, rows, fiels) {
    if(err){
        console.log(err);
        return ;
    }
    //rows是資料庫query出來的所有資料(JSON)
    console.log(rows);
    //fiels是欄位的資訊
    console.log(fiels);
});*/

var online = 0;
var ROOMID_S="";
var nicknames = {};
//socket.io

io.on('connection', function(socket){ //on:啟動 Socket.io 的功能



  //學生
  socket.on('joinRoomS', function(m) {
    var roomid = m;
    var index = 0;
    var check = 'SELECT * FROM teacher '
        db.query(check, function (err, rows,fields) {
              if(err){
              console.log(err);
              }
              for(var r in rows)
              {
                //console.log(rows[r].RoomID);
                if (rows[r].RoomID == roomid)
                  {
                    index = 1;
                    break;
                  }

              }
              console.log(index);
              if (index == 1)
              {
                console.log("OK");
                //socket.join(m);
                //socket['roomS'] = m;
                socket.emit('checkENTER',1);
                //socket.broadcast.in(socket['room']).emit('successENTER',1);
              }
              else
              {
                console.log("NO");
                socket.emit('checkENTER',0);
                //socket.broadcast.in(socket['room']).emit('successENTER',1);
              }


        });
  });


   
  
 //老師 
  socket.on('check',function(m){
    var username = m.m;
    var password = m.n;
    console.log(username);
    console.log(password);
    var index = 0;
    var check = 'SELECT * FROM teacher '
        db.query(check, function (err, rows,fields) {
              if(err){
              console.log(err);
              }
              for(var r in rows)
              {
                if (rows[r].username == username)
                  {
                    index = 1;
                    break;
                  }

              }
                if (index == 1)
                {
                var sql = 'SELECT * FROM teacher WHERE username = ?';
                 db.query(sql, [username], function (err, rows,fields) {
                      if(err){
                      console.log(err);
                      return;
                      }
                                
                      console.log(rows[0].password);
                      if(rows[0].password == password)
                        {
                          //socket.join(rows[0].RoomID);
                          //console.log(socket['roomT']);
                          //socket['roomT'] = rows[0].RoomID;
                          //console.log(socket['roomT']);
                          socket.emit('checkTeacher',{m:1,n:rows[0].RoomID});
                        }
                      else
                        {socket.emit('checkTeacher',{m:0,n:0});}
                      console.log(rows);
                      
                    });
                 }
                 else
                 {
                     socket.emit('checkTeacher',{m:0,n:0});
                 }

            });
         
  });

  socket.on('checkREG',function(m){
    var name = m.x;
    var userID = m.y
    var password = m.z;
    var rand = parseInt(99999*Math.random()) + 10000; 
    var RoomID = rand.toString();
    console.log(name);
    console.log(userID);
    console.log(password);
    var index = 0;
    var check = 'SELECT * FROM teacher '
    db.query(check, function (err, rows,fields) {
          if(err){
          console.log(err);
          }
          for(var r in rows)
          {
            console.log(rows[r].username);
            if (rows[r].username == userID)
              {index = 1;}

          }
          //console.log("TEST:"+index);
          if(index == 0)
          {
              var sql = "INSERT INTO teacher (name, username,password,RoomID) VALUES ?";
              var value = [[name,userID,password,RoomID]];
                  db.query(sql, [value], function (err, result) {
                    if (err) throw err;
                    socket.emit('successSINGUP');
                    console.log("Number of records inserted: " + result.affectedRows);
                  });
          }
          else
          {
            //console.log("TEST:OK");
            socket.emit('errorSINGUP');
          }

        });

  });
socket.on('value',function(e){
    switch(e.m){
      case 1:
        socket.broadcast.in(e.n).emit('sum',1);
        break;
      case 2:
        socket.broadcast.in(e.n).emit('sum',2);
        break;
      case 3:
        socket.broadcast.in(e.n).emit('sum',3);
        break;
      case 4:
        socket.broadcast.in(e.n).emit('sum',4);
        break;
      case 5:
        socket.broadcast.in(e.n).emit('sum',5);
        break;
      case 6:
        socket.broadcast.in(e.n).emit('sum',6);
        break;
      case 7:
        socket.broadcast.in(e.n).emit('sum',7);
        break;
      
    }
  });
  
  socket.on('tf',function(n){
    console.log("TF "+n);
    socket.broadcast.in(n).emit('Stf');
  });
  socket.on('mc',function(n){
    socket.broadcast.in(n).emit('Smc');
  });
  socket.on('sa',function(n){
    console.log(n.n);
    socket.broadcast.in(n.n).emit('Ssa',n.m);
  });
  
  socket.on('submitSSA',function(n){
    socket.broadcast.in(n.x).emit('submitTSA',n);
    console.log(n);
  });




    socket.on('joinStudent',function(m){
      online = online + 1;
      console.log(online);
      console.log(m);
      socket.join(m);
      

    });

    socket.on('joinTeacher',function(m){
      console.log(m);
      socket.join(m);

    });

    socket.on('setnickname', function(m) {
      console.log("setnickname");
    if(typeof nicknames[m.name] === 'undefined') {
      nicknames[m.name] = {count: 0};
      socket.emit('nicknamesuccess', m.name);
      socket.broadcast.in(m.room).emit('system', m.name + " 已加入");
      socket['nickname'] = m.name;
    } else {
      nicknames[m.name].count++;
      var t = m.name + '' + nicknames[m.name].count;
      socket.emit('nicknamefail', t);
      socket['nickname'] = t;
    }
   });

      socket.on('post', function(m) {
    
      socket.broadcast.in(m.room).emit('msg', m);
      socket.broadcast.in(m.room).emit('msgT', m);

    
       });

     /* socket.on('disconnect', function () {
        console.log(online);
        

      });*/





});//socket.io 結束













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

http.listen(8080, function(){
  console.log('listening on *:8080');
});
module.exports = app;
