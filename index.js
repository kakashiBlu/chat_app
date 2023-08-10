//Node server which will handle Scoket.io connections

const express = require("express")
var app = express();
var server = app.listen(process.env.PORT);
var io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile('./public/index.html');
})

app.get('/removed', (req, res) => {
    res.sendFile(__dirname + '/public/removed.html');
})

const users = {};

//using sockets
io.on('connection', socket => {
    // console.log("Yes")
    socket.on('new-userJoined', Username => {
        users[socket.id] = Username;
        // console.log(name);
        socket.broadcast.emit('userJoined', Username);
    })

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    })
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })
    socket.on('abandoned', message => {
        socket.broadcast.emit('left', users[socket.id]);
    })
    socket.on('closeChat', data => {

        socket.broadcast.emit('chatClosed', data);


    })
})
