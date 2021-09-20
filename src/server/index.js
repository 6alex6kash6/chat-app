const express = require('express');
const path = require('path');
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {format} = require('date-fns')

const {addUser, users} = require('./users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = 3223
const buildPath = path.resolve(__dirname, "../client/dist");

app.use(express.static(buildPath))

io.on('connection', (socket) => {
    console.log('socket')
    // socket.emit('countUpdate', count)
    socket.on('sendMessage', (data, callback) => {
        const filter = new Filter()

        if (filter.isProfane(data)) {
            return callback('profan detected')
        }

        io.to(data.room).emit("message", {
            text: data.message,
            name: data.name,
            isUrl: false,
            date: format(new Date(), 'hh:mm')
        })
        callback('delivered')
    })

    socket.on('room:join', ({name, room}) => {
        addUser({id: socket.id, name, room})
        socket.join(room)
        socket.broadcast.to(room).emit('message:join', `user ${name} joined ${room}`)
        io.to(room).emit('roomData', {users})
    })

    socket.on('sendLocation', (data, callback) => {
        io.to(data.room).emit('message:geo', {
            name: data.name,
            text: `https://google.com/maps?q=${data.latitude},${data.longitude}`,
            isUrl: true,
            date: format(new Date(), 'hh:mm')
        })
        callback('geo delivered')
    })
    socket.on('disconnect', () => {
        io.emit('message:disconnect', 'user disconnected')
    })
})


server.listen(PORT, () => {
    console.log('Server listen on port 3223')
})