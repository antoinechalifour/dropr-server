const http = require('http')
const SocketIo = require('socket.io')

module.exports = function createApp () {
  const configureIo = io => {
    io.on('connection', socket => {
      console.log(`New client connected: ${socket.id}`)

      socket.on('room/join', () => {
        console.log(`room/join: ${socket.id} => all`)
        socket.broadcast.emit('room/join', { id: socket.id })
      })

      socket.on('room/offer', ({ receiverId, offer }) => {
        console.log(`room/offer: ${socket.id} => ${receiverId}`)
        socket.to(receiverId).emit('room/offer', {
          id: socket.id,
          offer
        })
      })

      socket.on('room/accept', ({ receiverId, offer }) => {
        console.log(`room/accept: ${socket.id} => ${receiverId}`)
        socket.to(receiverId).emit('room/accept', {
          id: socket.id,
          offer
        })
      })

      socket.on('room/icecandidate', ({ receiverId, candidate }) => {
        console.log(`room/icecandidate: ${socket.id} => ${receiverId}`)
        socket.to(receiverId).emit('room/icecandidate', {
          id: socket.id,
          candidate
        })
      })
    })
  }

  const _start = ({ port }) => {
    const server = http.createServer()
    const io = SocketIo(server)

    configureIo(io)

    return new Promise((resolve, reject) => {
      server.listen(port, err => {
        if (err) {
          return reject(err)
        }

        resolve()
      })
    })
  }

  return { start: _start }
}
