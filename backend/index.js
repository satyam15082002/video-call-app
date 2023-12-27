// require('dotenv').config()
const express=require('express')
const app=express()
const http=require('http')
const server=http.createServer(app)
const {Server}=require('socket.io')
const cors=require('cors')
const io=new Server(server)
app.use(cors({
    origin:[`${process.env.ALLOWED_ORIGIN}`]
}))

io.on('connection',socket=>{
    console.log("New client connected",socket.id)
    socket.on('user-join',async ({room})=>{
       const clients= Array.from(io.sockets.adapter.rooms.get(room)||[])
       socket.join(room)
       clients.forEach(clientID=>{
           socket.emit('add-peer',{
                peerID:clientID,
                createOffer:true
           })
           io.to(clientID).emit('add-peer',{
                peerID:socket.id,
                createOffer:false
           })
       })
    })
    socket.on('offer',async({peerID,offer})=>{
        console.log("Offer recv");
        io.to(peerID).emit('offer',{
            peerID:socket.id,
            offer:offer
        })
    })
    socket.on('answer',async({peerID,answer})=>{

        io.to(peerID).emit('answer',{
            peerID:socket.id,
            answer:answer
        })
    })
    socket.on('ice',async ({peerID,candidate})=>{
        io.to(peerID).emit('ice',{
            candidate:candidate,
            peerID:socket.id
        })
    })
    socket.on('voice',async({audio,video,room})=>{
        socket.to(room).emit('voice',{
                peerID:socket.id,
                audio:audio,
                video:video
        })
    })
    socket.on('disconnect',()=>{
        socket.broadcast.emit('user-leave',{
            peerID:socket.id
        })
    })
    
})

app.get('/',(req,res)=>{
    return res.json({message:`Working ${process.env.ALLOWED_ORIGIN}`})
})

server.listen(5000,()=>{
    console.log("started at 5000");
})

