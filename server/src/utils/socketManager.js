let io;

module.exports = {
  init: (httpServer) => {
    io = require('socket.io')(httpServer, {
      cors: {
        origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('join_role', (role) => {
        // Users can join a room based on their role for targeted broadcasts
        socket.join(role);
        console.log(`Socket ${socket.id} joined role room: ${role}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    return io;
  },
  
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
