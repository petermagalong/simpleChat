const { Server } = require('socket.io');
const http = require('http');
const PORT = process.env.PORT || 5000;
// Create an HTTP server
const server = http.createServer();

// Pass the HTTP server to the Socket.IO server
const io = new Server(server, {
  cors: { origin: '*' },
});
const USERS = [];



io.on('connection', (socket) => {
    //emmit ito naman yung mag papasa ng data from server to client
    socket.emit('users-count', USERS.length); 

    // socket.on ito naman yung tatanggap ng data from client to server
    socket.on('new-user', (name) => {
        console.log(name);
        const newUser = {
            id: socket.id,
            name: name,
        };

        USERS.push(newUser);
        // Notify all clients about the new user
        socket.broadcast.emit('users-connected', name);
    })

    socket.on('disconnect', () => {
        try {
            const user = USERS.find((user) => user.id === socket.id);
            const userName = user.name;
            // Notify all about the updated user count
            socket.broadcast.emit('users-disconnected', userName); 

            const index = USERS.indexOf(user);
            // Remove the user from the USERS array
            USERS.splice(index, 1); 
        }catch (error) {
            console.error(socket.id + ' disconnected');
        }
    })

    socket.on('new-chat', (userChat) => {
        const userName = USERS.find((user) => user.id === socket.id).name;

        socket.broadcast.emit('added-new-chat', {
            name: userName,
            chat: userChat,
        });
    });

});

// Start the HTTP server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});